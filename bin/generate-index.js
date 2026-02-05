#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SKILL_DIR = path.join(__dirname, '..', 'templates', 'Skill');
const INDEX_FILE = path.join(SKILL_DIR, 'skills-index.json');

const allSkills = [];
const stats = { found: 0, errors: [] };

function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};
    const fm = {};
    match[1].split(/\r?\n/).forEach(line => {
        const idx = line.indexOf(':');
        if (idx > 0) fm[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
    });
    return fm;
}

function extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
}

function extractTags(content) {
    const keywords = new Set();
    const patterns = [/\b(python|javascript|typescript|react|node|sql|api|security|testing|debug|ml|ai|llm|rag|database|frontend|backend|devops|docker|kubernetes|aws|azure|gcp|fastapi|django)\b/gi];
    patterns.forEach(p => (content.match(p) || []).forEach(m => keywords.add(m.toLowerCase())));
    return Array.from(keywords).slice(0, 8);
}

function titleCase(str) {
    return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function processSkill(skillPath, relativePath) {
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) return;

    stats.found++;
    try {
        const content = fs.readFileSync(skillMdPath, 'utf-8');
        const fm = parseFrontmatter(content);
        const folderName = path.basename(skillPath);

        allSkills.push({
            id: (fm.name || folderName).toLowerCase().replace(/\s+/g, '-'),
            title: extractTitle(content) || titleCase(folderName),
            description: fm.description || '',
            path: relativePath.replace(/\\/g, '/'),
            tags: extractTags(content),
            priority: fm.priority || 'normal',
            version: fm.version || '1.0'
        });
    } catch (err) {
        stats.errors.push({ path: skillPath, error: err.message });
    }
}

function walkDir(dir, baseDir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (['node_modules', '.git', 'bundles'].includes(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (fs.existsSync(path.join(fullPath, 'SKILL.md'))) {
                processSkill(fullPath, path.relative(baseDir, fullPath));
            }
            walkDir(fullPath, baseDir);
        }
    }
}

console.log('🔍 Scanning all skills...');
walkDir(SKILL_DIR, SKILL_DIR);

// Sort by id
allSkills.sort((a, b) => a.id.localeCompare(b.id));

// Remove duplicates (keep first occurrence)
const uniqueSkills = [];
const seenIds = new Set();
for (const skill of allSkills) {
    const key = `${skill.id}:${skill.path}`;
    if (!seenIds.has(key)) {
        seenIds.add(key);
        uniqueSkills.push(skill);
    }
}

const index = {
    schema_version: "1.0",
    generated_at: new Date().toISOString(),
    total_skills: uniqueSkills.length,
    sources: {
        skills: "templates/Skill/skills",
        categories: "templates/Skill/SkillCategorias",
        bundles: "templates/Skill/bundles"
    },
    skills: uniqueSkills
};

fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');

console.log('\n📊 REPORT');
console.log('='.repeat(40));
console.log(`Skills found:    ${stats.found}`);
console.log(`Unique indexed:  ${uniqueSkills.length}`);
console.log(`Errors:          ${stats.errors.length}`);
console.log('='.repeat(40));
console.log(`✅ Index saved: ${INDEX_FILE}`);
