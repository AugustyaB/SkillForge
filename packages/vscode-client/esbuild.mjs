import * as esbuild from 'esbuild';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.argv.includes('--production');

async function buildAll() {
  console.log(`[esbuild] Building SkillForge production bundles (production=${isProduction})...`);

  const startTime = Date.now();

  // 1. Build Extension Client
  console.log('[esbuild] Bundling Extension Client (src/extension.ts -> dist/extension.js)...');
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, 'src/extension.ts')],
    bundle: true,
    outfile: path.resolve(__dirname, 'dist/extension.js'),
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    minify: isProduction,
    sourcemap: !isProduction ? 'inline' : true,
    logLevel: 'info',
  });

  // 2. Build Headless LSP Server
  console.log('[esbuild] Bundling Headless Server (packages/server/src/index.ts -> dist/server.js)...');
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, '../server/src/index.ts')],
    bundle: true,
    outfile: path.resolve(__dirname, 'dist/server.js'),
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    minify: isProduction,
    sourcemap: !isProduction ? 'inline' : true,
    logLevel: 'info',
  });

  const duration = Date.now() - startTime;

  // Report bundle sizes
  const clientStats = fs.statSync(path.resolve(__dirname, 'dist/extension.js'));
  const serverStats = fs.statSync(path.resolve(__dirname, 'dist/server.js'));

  console.log(`\n[esbuild] Build completed in ${duration}ms:`);
  console.log(`  - dist/extension.js: ${(clientStats.size / 1024).toFixed(1)} KB`);
  console.log(`  - dist/server.js:    ${(serverStats.size / 1024).toFixed(1)} KB`);
  console.log(`  - Total bundle size: ${((clientStats.size + serverStats.size) / 1024).toFixed(1)} KB\n`);
}

buildAll().catch((err) => {
  console.error('[esbuild] Build failed:', err);
  process.exit(1);
});
