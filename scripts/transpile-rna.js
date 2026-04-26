#!/usr/bin/env node
/**
 * Re-transpile @hanzogui/react-native-reanimated/lib/**\/*.js in-place.
 *
 * The published fork ships raw JSX in .js files across the whole lib/ tree
 * (packaging bug — lib/module/ was meant to be transpiled by the package's
 * build but wasn't). Rollup/Vite commonjs-resolver fails 'Expression expected'
 * on each one. This script walks the dir and transpiles each file with
 * esbuild.transformSync() in a single node process — ~10s total instead of
 * 20+ minutes per-file via npx.
 *
 * Runs post-install inside Dockerfile; silent on per-file errors (leaves
 * untouched so bundler can surface a clearer error if needed).
 */
const { transformSync } = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (p.endsWith('.js')) {
      try {
        const src = fs.readFileSync(p, 'utf8');
        const out = transformSync(src, {
          loader: 'jsx',
          format: 'esm',
          target: 'es2020',
          jsx: 'automatic',
        });
        fs.writeFileSync(p, out.code);
      } catch (err) {
        // Leave untouched — bundler will surface a clearer error if it matters.
      }
    }
  }
}

const roots = execSync(
  "find node_modules/.pnpm -type d -path '*@hanzogui/react-native-reanimated/lib' 2>/dev/null",
)
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

for (const dir of roots) {
  walk(dir);
}
console.log(`transpiled ${roots.length} @hanzogui/react-native-reanimated/lib root(s)`);
