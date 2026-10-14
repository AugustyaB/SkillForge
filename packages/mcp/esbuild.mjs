import * as esbuild from 'esbuild';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
  console.log('[esbuild] Bundling @skillforge/mcp standalone executable...');
  const startTime = Date.now();

  const distDir = path.resolve(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  await esbuild.build({
    entryPoints: [path.resolve(__dirname, 'src/index.ts')],
    bundle: true,
    outfile: path.resolve(__dirname, 'dist/index.js'),
    format: 'esm',
    platform: 'node',
    target: 'node18',
    banner: {
      js: "import { createRequire as __skillforgeCreateRequire } from 'module'; const require = __skillforgeCreateRequire(import.meta.url);",
    },
    sourcemap: true,
    logLevel: 'info',
  });

  // Make executable on POSIX environments
  const outPath = path.resolve(__dirname, 'dist/index.js');
  try {
    fs.chmodSync(outPath, 0o755);
  } catch {
    // Windows ignore
  }

  const duration = Date.now() - startTime;
  const stats = fs.statSync(outPath);
  console.log(`[esbuild] Successfully generated standalone MCP binary in ${duration}ms: ${(stats.size / 1024).toFixed(1)} KB`);
}

build().catch((err) => {
  console.error('[esbuild] Build failed:', err);
  process.exit(1);
});
