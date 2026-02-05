#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SKILL_DIR = path.join(__dirname, '..', 'templates', 'Skill');
const SKILLS_BASE = path.join(SKILL_DIR, '_skills');
const BUNDLES_DIR = path.join(SKILL_DIR, 'bundles');

const stats = {
    skillsCopied: 0,
    bundlesCreated: 0,
    errors: []
};

// Skill folders to process
const PROCESS_FOLDERS = ['Python', 'SQL'];

function copyRecursive(src, dst) {
    if (!fs.existsSync(dst)) {
        fs.mkdirSync(dst, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const dstPath = path.join(dst, entry.name);
        if (entry.isDirectory()) {
            copyRecursive(srcPath, dstPath);
        } else {
            fs.copyFileSync(srcPath, dstPath);
        }
    }
}

function getSkillsInBundle(bundlePath) {
    const skills = [];
    const entries = fs.readdirSync(bundlePath, { withFileTypes: true });

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const skillPath = path.join(bundlePath, entry.name);
        if (fs.existsSync(path.join(skillPath, 'SKILL.md'))) {
            skills.push(entry.name);
        }
    }
    return skills;
}

function processBundle(bundlePath, bundleName, category) {
    const skills = getSkillsInBundle(bundlePath);

    // Copy unique skills to _skills
    for (const skillName of skills) {
        const srcSkill = path.join(bundlePath, skillName);
        const dstSkill = path.join(SKILLS_BASE, skillName);

        if (!fs.existsSync(dstSkill)) {
            copyRecursive(srcSkill, dstSkill);
            stats.skillsCopied++;
            console.log(`  ✅ Copied: ${skillName}`);
        }
    }

    // Create bundle JSON
    const bundleJson = {
        schema_version: "1.0",
        id: bundleName.toLowerCase().replace(/\s+/g, '-'),
        title: bundleName,
        category: category,
        description: `Bundle de skills para ${bundleName}`,
        skills: skills.sort(),
        total_skills: skills.length,
        author: "freirevini"
    };

    const bundleFile = path.join(BUNDLES_DIR, category, `${bundleName}.json`);
    fs.mkdirSync(path.dirname(bundleFile), { recursive: true });
    fs.writeFileSync(bundleFile, JSON.stringify(bundleJson, null, 2), 'utf-8');
    stats.bundlesCreated++;
    console.log(`  📦 Bundle: ${bundleName}.json (${skills.length} skills)`);
}

console.log('🔄 Restructuring Python and SQL folders...\n');

// Process each category
for (const category of PROCESS_FOLDERS) {
    const categoryPath = path.join(SKILL_DIR, category);
    if (!fs.existsSync(categoryPath)) continue;

    console.log(`\n📁 Processing ${category}/`);

    const bundles = fs.readdirSync(categoryPath, { withFileTypes: true });
    for (const bundle of bundles) {
        if (!bundle.isDirectory()) continue;
        const bundlePath = path.join(categoryPath, bundle.name);
        processBundle(bundlePath, bundle.name, category);
    }
}

console.log('\n' + '='.repeat(50));
console.log(`📊 REPORT`);
console.log('='.repeat(50));
console.log(`Unique skills copied to _skills/:  ${stats.skillsCopied}`);
console.log(`Bundle JSONs created:              ${stats.bundlesCreated}`);
console.log(`Errors:                            ${stats.errors.length}`);
console.log('='.repeat(50));

if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(e => console.log(`  - ${e}`));
}

console.log('\n✅ Restructuring complete!');
console.log(`   _skills/: ${SKILLS_BASE}`);
console.log(`   bundles/: ${BUNDLES_DIR}`);
