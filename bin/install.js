#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const source = path.join(__dirname, '..', 'templates', 'Skill');
const destBase = process.cwd();
const dest = path.join(destBase, '.agent', 'skills');

const stats = {
  created: 0,
  updated: 0,
  skipped: 0,
  errors: 0
};

function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch {
    return null;
  }
}

function syncFile(srcPath, dstPath) {
  try {
    const srcHash = getFileHash(srcPath);
    const dstHash = getFileHash(dstPath);

    if (!fs.existsSync(dstPath)) {
      // New file - create
      fs.mkdirSync(path.dirname(dstPath), { recursive: true });
      fs.copyFileSync(srcPath, dstPath);
      stats.created++;
      return 'created';
    } else if (srcHash !== dstHash) {
      // File changed - update
      fs.copyFileSync(srcPath, dstPath);
      stats.updated++;
      return 'updated';
    } else {
      // No change - skip
      stats.skipped++;
      return 'skipped';
    }
  } catch (err) {
    stats.errors++;
    return 'error';
  }
}

function syncRecursive(src, dst) {
  if (!fs.existsSync(src)) return;

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // Skip non-essential files
    if (['node_modules', '.git', 'bin', 'package.json', 'package-lock.json'].includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(dstPath)) {
        fs.mkdirSync(dstPath, { recursive: true });
      }
      syncRecursive(srcPath, dstPath);
    } else {
      syncFile(srcPath, dstPath);
    }
  }
}

console.log('📦 Syncing Bundles to .agent/skills...');
console.log(`   Source: ${source}`);
console.log(`   Destination: ${dest}\n`);

// Ensure destination exists
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Sync files
syncRecursive(source, dest);

console.log('='.repeat(40));
console.log('📊 SYNC REPORT');
console.log('='.repeat(40));
console.log(`✨ Created:  ${stats.created} files`);
console.log(`🔄 Updated:  ${stats.updated} files`);
console.log(`⏭️  Skipped:  ${stats.skipped} files (unchanged)`);
console.log(`❌ Errors:   ${stats.errors} files`);
console.log('='.repeat(40));
console.log(`\n✅ Sync complete! Skills available at: ${dest}`);
