#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = __dirname;
const SRC_ENTRY = path.join(ROOT, 'src', 'index.js');
const DIST_DIR = path.join(ROOT, 'dist');

if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

console.log('📦 Building Rastersonance (ESM + UMD) using esbuild...\n');

function run(cmd) {
    console.log('> ' + cmd);
    cp.execSync(cmd, { stdio: 'inherit' });
}

try {
    // ESM build
    run(`npx esbuild "${SRC_ENTRY}" --bundle --format=esm --minify --outfile="${path.join(DIST_DIR, 'rastersonance.esm.js')}"`);

    // UMD/IIFE build with a global name
    run(`npx esbuild "${SRC_ENTRY}" --bundle --format=iife --global-name=Rastersonance --minify --outfile="${path.join(DIST_DIR, 'rastersonance.umd.js')}"`);

    // Also produce a small minified UMD file with the conventional .min.js name
    run(`npx esbuild "${SRC_ENTRY}" --bundle --format=iife --global-name=Rastersonance --minify --outfile="${path.join(DIST_DIR, 'rastersonance.min.js')}"`);

    // Copy TypeScript definitions into dist if present
    const typesSrc = path.join(ROOT, 'index.d.ts');
    const typesDest = path.join(DIST_DIR, 'index.d.ts');
    if (fs.existsSync(typesSrc)) {
        fs.copyFileSync(typesSrc, typesDest);
        console.log('✅ Copied types to dist/index.d.ts');
    } else {
        console.warn('⚠️ No index.d.ts found at project root; skipping type copy.');
    }

    console.log('\n✨ Build complete!');
    console.log('Distribution files written to', DIST_DIR);
} catch (err) {
    console.error('\n❌ Build failed:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
}
