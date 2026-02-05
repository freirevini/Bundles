#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..');
const destBase = process.cwd();
const dest = path.join(destBase, '.agent', 'bundles');

function copyRecursive(src, dst) {
    if (!fs.existsSync(dst)) {
        fs.mkdirSync(dst, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const dstPath = path.join(dst, entry.name);

        if (entry.name === 'node_modules' || entry.name === '.git') continue;

        if (entry.isDirectory()) {
            copyRecursive(srcPath, dstPath);
        } else {
            fs.copyFileSync(srcPath, dstPath);
        }
    }
}

console.log('📦 Installing Bundles to .agent/bundles...');

try {
    copyRecursive(source, dest);
    console.log('✅ Bundles installed successfully!');
    console.log(`   Location: ${dest}`);
} catch (err) {
    console.error('❌ Installation failed:', err.message);
    process.exit(1);
}
