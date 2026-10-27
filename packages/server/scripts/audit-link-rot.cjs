#!/usr/bin/env node

/**
 * SkillForge — Automated Link Health & Link Rot Audit Suite
 *
 * Verifies official documentation URLs and learning resource links for all catalog skills.
 * Features:
 * - Concurrent, throttled HTTP checking with HEAD -> GET fallback.
 * - Permanent redirect (301/308) detection with optional auto-fix (`--fix`).
 * - Smart disk caching (`.link-audit-cache.json`) with 7-day TTL.
 * - Exponential backoff and retry for rate-limiting (429/503).
 * - Infinite redirect loop protection (max 5 hops).
 * - Detailed terminal scorecard and optional JSON reporting (`--report`).
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_CACHE_FILE = path.join(__dirname, '.link-audit-cache.json');
const DEFAULT_SKILLS_FILE = path.join(__dirname, '..', 'src', 'data', 'skills.json');
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Parses command-line arguments into a structured options object.
 */
function parseCliArgs(args = process.argv.slice(2)) {
  const options = {
    sample: null,
    skillId: null,
    timeoutMs: 6000,
    concurrency: 6,
    fix: false,
    report: false,
    noCache: false,
    cacheFile: DEFAULT_CACHE_FILE,
    skillsFile: DEFAULT_SKILLS_FILE,
    silent: false,
  };

  for (const arg of args) {
    if (arg.startsWith('--sample=')) {
      options.sample = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--skill=')) {
      options.skillId = arg.split('=')[1].trim();
    } else if (arg.startsWith('--timeout=')) {
      options.timeoutMs = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--concurrency=')) {
      options.concurrency = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--fix') {
      options.fix = true;
    } else if (arg === '--report') {
      options.report = true;
    } else if (arg === '--no-cache') {
      options.noCache = true;
    } else if (arg.startsWith('--cache-file=')) {
      options.cacheFile = arg.split('=')[1];
    } else if (arg.startsWith('--skills-file=')) {
      options.skillsFile = arg.split('=')[1];
    } else if (arg === '--silent') {
      options.silent = true;
    }
  }

  return options;
}

/**
 * Reads and validates the disk cache.
 */
function readCache(cacheFile = DEFAULT_CACHE_FILE) {
  if (!fs.existsSync(cacheFile)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(cacheFile, 'utf-8');
    if (!raw.trim()) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    // If cache is corrupted, safely return empty baseline
    return {};
  }
}

/**
 * Persists the cache to disk.
 */
function writeCache(cacheData, cacheFile = DEFAULT_CACHE_FILE) {
  try {
    const dir = path.dirname(cacheFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2), 'utf-8');
  } catch {
    // Best-effort cache save
  }
}

/**
 * Performs a single HTTP request with timeout using native fetch.
 */
async function fetchWithTimeout(url, method = 'HEAD', timeoutMs = 6000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      redirect: 'manual', // Manually follow to inspect 301 vs 302
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SkillForge/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Audits a single URL, following redirects up to 5 hops with loop detection and 429 backoff.
 */
async function checkUrl(targetUrl, options = {}, cache = null) {
  if (!targetUrl || typeof targetUrl !== 'string') {
    return {
      url: String(targetUrl),
      status: 0,
      ok: false,
      error: 'INVALID_URL',
    };
  }

  const trimmed = targetUrl.trim();

  // Validate URL protocol
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        url: trimmed,
        status: 0,
        ok: false,
        error: 'UNSUPPORTED_PROTOCOL',
      };
    }
  } catch {
    return {
      url: trimmed,
      status: 0,
      ok: false,
      error: 'MALFORMED_URL',
    };
  }

  // Check cache unless bypassed
  if (cache && !options.noCache && cache[trimmed]) {
    const cached = cache[trimmed];
    if (Date.now() - cached.checkedAt < CACHE_TTL_MS && cached.ok) {
      return {
        url: trimmed,
        status: cached.status,
        ok: cached.ok,
        finalUrl: cached.finalUrl,
        cached: true,
        redirected: cached.finalUrl !== trimmed,
      };
    }
  }

  const timeoutMs = options.timeoutMs || 6000;
  const maxHops = 5;
  const redirectChain = [];
  let currentUrl = trimmed;
  let hops = 0;
  let lastStatus = 0;

  while (hops < maxHops) {
    if (redirectChain.includes(currentUrl)) {
      return {
        url: trimmed,
        status: lastStatus,
        ok: false,
        finalUrl: currentUrl,
        error: 'REDIRECT_LOOP',
        redirectChain,
      };
    }
    redirectChain.push(currentUrl);

    let res;
    let retries = 0;
    while (retries < 2) {
      try {
        // Try HEAD first, fall back to GET if server rejects HEAD (e.g. 405, 403, 400)
        res = await fetchWithTimeout(currentUrl, 'HEAD', timeoutMs);
        if (res.status === 405 || res.status === 403 || res.status === 400) {
          res = await fetchWithTimeout(currentUrl, 'GET', timeoutMs);
        }

        // Handle 429 (Too Many Requests) or 503 with backoff
        if (res.status === 429 || res.status === 503) {
          retries++;
          const retryAfter = parseInt(res.headers.get('retry-after') || '1', 10);
          const waitTime = Math.min(3000, (isNaN(retryAfter) ? 1 : retryAfter) * 1000);
          await new Promise((r) => setTimeout(r, waitTime));
          continue;
        }

        break;
      } catch (err) {
        if (err.name === 'AbortError') {
          return {
            url: trimmed,
            status: 0,
            ok: false,
            finalUrl: currentUrl,
            error: 'TIMEOUT',
            redirectChain,
          };
        }

        retries++;
        if (retries >= 2) {
          const msg = err.code || err.message;
          return {
            url: trimmed,
            status: 0,
            ok: false,
            finalUrl: currentUrl,
            error: msg,
            redirectChain,
          };
        }

        // Fall back to GET on network or transport failure before sleeping
        try {
          res = await fetchWithTimeout(currentUrl, 'GET', timeoutMs);
          break;
        } catch (getErr) {
          if (getErr.name === 'AbortError') {
            return {
              url: trimmed,
              status: 0,
              ok: false,
              finalUrl: currentUrl,
              error: 'TIMEOUT',
              redirectChain,
            };
          }
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }

    if (!res) {
      return {
        url: trimmed,
        status: 0,
        ok: false,
        finalUrl: currentUrl,
        error: 'NO_RESPONSE',
        redirectChain,
      };
    }

    lastStatus = res.status;

    // Check for redirects (301, 302, 303, 307, 308)
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) {
        break; // Redirect without location header
      }
      try {
        currentUrl = new URL(location, currentUrl).href;
        hops++;
        continue;
      } catch {
        return {
          url: trimmed,
          status: res.status,
          ok: false,
          finalUrl: currentUrl,
          error: 'INVALID_REDIRECT_LOCATION',
          redirectChain,
        };
      }
    }

    break;
  }

  if (hops >= maxHops) {
    return {
      url: trimmed,
      status: lastStatus,
      ok: false,
      finalUrl: currentUrl,
      error: 'TOO_MANY_REDIRECTS',
      redirectChain,
    };
  }

  const isOk = lastStatus >= 200 && lastStatus < 400;
  const result = {
    url: trimmed,
    status: lastStatus,
    ok: isOk,
    finalUrl: currentUrl,
    redirectChain,
    redirected: currentUrl !== trimmed,
    error: isOk ? undefined : `HTTP_${lastStatus}`,
  };

  // Update cache on success
  if (cache && isOk) {
    cache[trimmed] = {
      status: lastStatus,
      ok: true,
      finalUrl: currentUrl,
      checkedAt: Date.now(),
    };
  }

  return result;
}

/**
 * Audits a collection of skills with concurrency throttling.
 */
async function auditSkills(skills, options = {}) {
  const cacheFile = options.cacheFile || DEFAULT_CACHE_FILE;
  const cache = readCache(cacheFile);

  // Collect all unique URLs mapped to skill IDs
  const urlToSkills = new Map();

  for (const skill of skills) {
    if (skill.officialUrl) {
      if (!urlToSkills.has(skill.officialUrl)) {
        urlToSkills.set(skill.officialUrl, []);
      }
      urlToSkills.get(skill.officialUrl).push({ skillId: skill.id, field: 'officialUrl' });
    }

    if (Array.isArray(skill.learnResources)) {
      for (const res of skill.learnResources) {
        if (res.url) {
          if (!urlToSkills.has(res.url)) {
            urlToSkills.set(res.url, []);
          }
          urlToSkills.get(res.url).push({
            skillId: skill.id,
            field: `learnResources[${res.label}]`,
          });
        }
      }
    }
  }

  const uniqueUrls = Array.from(urlToSkills.keys());
  const concurrency = options.concurrency || 6;
  const results = [];
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < uniqueUrls.length) {
      const idx = currentIndex++;
      const url = uniqueUrls[idx];
      const checkRes = await checkUrl(url, options, cache);
      const references = urlToSkills.get(url) || [];

      results.push({
        ...checkRes,
        references,
      });

      if (!options.silent && (results.length % 25 === 0 || results.length === uniqueUrls.length)) {
        process.stdout.write(
          `[Link Auditor] Progress: ${results.length}/${uniqueUrls.length} links checked...\r`
        );
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, uniqueUrls.length) }, () => worker());
  await Promise.all(workers);

  if (!options.silent) {
    process.stdout.write('\n');
  }

  // Save cache back to disk
  writeCache(cache, cacheFile);

  const healthy = results.filter((r) => r.ok && !r.redirected);
  const redirected = results.filter((r) => r.ok && r.redirected);
  const broken = results.filter((r) => !r.ok);

  return {
    totalSkills: skills.length,
    totalUrls: uniqueUrls.length,
    healthyCount: healthy.length,
    redirectedCount: redirected.length,
    brokenCount: broken.length,
    healthy,
    redirected,
    broken,
    results,
  };
}

/**
 * Automatically updates skills.json with permanent redirect target URLs.
 */
function applyRedirectFixes(skills, redirectedLinks, skillsFile = DEFAULT_SKILLS_FILE) {
  const redirectMap = new Map();
  for (const r of redirectedLinks) {
    if (r.finalUrl && r.url !== r.finalUrl) {
      redirectMap.set(r.url, r.finalUrl);
    }
  }

  if (redirectMap.size === 0) {
    return { appliedCount: 0 };
  }

  let appliedCount = 0;

  for (const skill of skills) {
    if (redirectMap.has(skill.officialUrl)) {
      skill.officialUrl = redirectMap.get(skill.officialUrl);
      appliedCount++;
    }

    if (Array.isArray(skill.learnResources)) {
      for (const res of skill.learnResources) {
        if (redirectMap.has(res.url)) {
          res.url = redirectMap.get(res.url);
          appliedCount++;
        }
      }
    }
  }

  fs.writeFileSync(skillsFile, JSON.stringify(skills, null, 2), 'utf-8');
  return { appliedCount };
}

/**
 * Main CLI execution entrypoint.
 */
async function runCli() {
  const options = parseCliArgs();

  console.log('================================================================================');
  console.log('               SKILLFORGE LINK HEALTH & LINK ROT AUDITOR');
  console.log('================================================================================');

  if (!fs.existsSync(options.skillsFile)) {
    console.error(`ERROR: Skills database not found at ${options.skillsFile}`);
    process.exit(1);
  }

  const rawSkills = JSON.parse(fs.readFileSync(options.skillsFile, 'utf-8'));
  let skillsToAudit = rawSkills;

  if (options.skillId) {
    skillsToAudit = rawSkills.filter((s) => s.id === options.skillId);
    if (skillsToAudit.length === 0) {
      console.error(`ERROR: Skill ID "${options.skillId}" not found in catalog.`);
      process.exit(1);
    }
  } else if (options.sample && options.sample > 0) {
    // Deterministic or pseudo-random sample
    const sampleSize = Math.min(options.sample, rawSkills.length);
    skillsToAudit = [...rawSkills].sort(() => 0.5 - Math.random()).slice(0, sampleSize);
    console.log(`[Link Auditor] Mode: Sample audit of ${sampleSize} skills.`);
  } else {
    console.log(`[Link Auditor] Mode: Full catalog audit of ${rawSkills.length} skills.`);
  }

  console.log(`[Link Auditor] Concurrency: ${options.concurrency} | Timeout: ${options.timeoutMs}ms`);

  const summary = await auditSkills(skillsToAudit, options);

  console.log('--------------------------------------------------------------------------------');
  console.log('AUDIT RESULTS SUMMARY:');
  console.log(`  Total Links Audited:   ${summary.totalUrls}`);
  console.log(`  Healthy (200 OK):      ${summary.healthyCount}`);
  console.log(`  Redirected (301/308):  ${summary.redirectedCount}`);
  console.log(`  Broken / Unreachable:  ${summary.brokenCount}`);
  console.log('--------------------------------------------------------------------------------');

  if (summary.brokenCount > 0) {
    console.log('\n❌ BROKEN LINKS DETECTED:');
    for (const b of summary.broken) {
      const skillsStr = b.references.map((r) => `${r.skillId} (${r.field})`).join(', ');
      console.log(`  - [${b.error || b.status}] ${b.url}`);
      console.log(`    Referenced in: ${skillsStr}`);
    }
  }

  if (summary.redirectedCount > 0) {
    console.log(`\n⚠️  PERMANENT REDIRECTS (${summary.redirectedCount}):`);
    for (const r of summary.redirected.slice(0, 10)) {
      console.log(`  - ${r.url} -> ${r.finalUrl}`);
    }
    if (summary.redirectedCount > 10) {
      console.log(`  ... and ${summary.redirectedCount - 10} more redirected links.`);
    }

    if (options.fix) {
      console.log('\n[Link Auditor] Applying permanent redirect fixes to skills.json...');
      const { appliedCount } = applyRedirectFixes(rawSkills, summary.redirected, options.skillsFile);
      console.log(`[Link Auditor] Successfully updated ${appliedCount} URLs in skills.json.`);
    }
  }

  if (options.report) {
    const reportPath = path.join(process.cwd(), 'link-rot-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`\n[Link Auditor] Detailed report saved to ${reportPath}`);
  }

  console.log('================================================================================');

  if (summary.brokenCount > 0) {
    process.exitCode = 1;
  } else {
    console.log('✅ ALL AUDITED LINKS HEALTHY & CERTIFIED.');
    process.exitCode = 0;
  }
}

if (require.main === module) {
  runCli().catch((err) => {
    console.error('[Link Auditor] Fatal Error:', err);
    process.exit(1);
  });
}

module.exports = {
  parseCliArgs,
  readCache,
  writeCache,
  checkUrl,
  auditSkills,
  applyRedirectFixes,
  runCli,
};
