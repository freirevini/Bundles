#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'templates', 'Skill');
const INDEX_FILE = path.join(SKILLS_DIR, 'skills-index.json');

const stats = {
  found: 0,
  created: 0,
  updated: 0,
  skipped: 0,
  errors: []
};

const allSkills = [];

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  
  const frontmatter = {};
  const lines = match[1].split(/\r?\n/);
  
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      const value = line.substring(colonIdx + 1).trim();
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function extractTags(content, id) {
  const keywords = new Set();
  const patterns = [
    /\b(python|javascript|typescript|react|node|sql|api|security|testing|debug|ml|ai|llm|rag|database|frontend|backend|devops|docker|kubernetes|aws|azure|gcp)\b/gi
  ];
  
  for (const pattern of patterns) {
    const matches = content.match(pattern) || [];
    matches.forEach(m => keywords.add(m.toLowerCase()));
  }
  
  // Remove id from tags
  keywords.delete(id.toLowerCase());
  
  // Limit to 8 tags
  return Array.from(keywords).slice(0, 8);
}

function normalizeId(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '');
}

function titleCase(str) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function processSkill(skillDir) {
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  const skillJsonPath = path.join(skillDir, 'skill.json');
  
  if (!fs.existsSync(skillMdPath)) return;
  
  stats.found++;
  
  try {
    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const folderName = path.basename(skillDir);
    
    // Build skill.json
    const skillJson = {
      schema_version: "1.0",
      id: normalizeId(frontmatter.name || folderName),
      title: extractTitle(content) || titleCase(folderName),
      description: frontmatter.description || "",
      version: frontmatter.version || "1.0.0",
      entrypoint: "SKILL.md",
      tags: extractTags(content, folderName),
      tools: frontmatter['allowed-tools'] ? frontmatter['allowed-tools'].split(',').map(t => t.trim()) : [],
      priority: frontmatter.priority || "normal",
      compatibility: ["antigravity", "gemini-code-assist", "cursor", "claude-code"],
      author: "freirevini"
    };
    
    // Check if skill.json exists
    if (fs.existsSync(skillJsonPath)) {
      const existing = JSON.parse(fs.readFileSync(skillJsonPath, 'utf-8'));
      // Merge: preserve custom fields, update empty ones
      for (const key of Object.keys(skillJson)) {
        if (!existing[key] || (Array.isArray(existing[key]) && existing[key].length === 0)) {
          existing[key] = skillJson[key];
        }
      }
      fs.writeFileSync(skillJsonPath, JSON.stringify(existing, null, 2), 'utf-8');
      stats.updated++;
    } else {
      fs.writeFileSync(skillJsonPath, JSON.stringify(skillJson, null, 2), 'utf-8');
      stats.created++;
    }
    
    // Add to index
    allSkills.push({
      id: skillJson.id,
      title: skillJson.title,
      description: skillJson.description,
      path: path.relative(SKILLS_DIR, skillDir).replace(/\\/g, '/'),
      tags: skillJson.tags,
      priority: skillJson.priority
    });
    
  } catch (err) {
    stats.errors.push({ path: skillDir, error: err.message });
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Check if this dir has SKILL.md
      if (fs.existsSync(path.join(fullPath, 'SKILL.md'))) {
        processSkill(fullPath);
      }
      // Continue walking
      walkDir(fullPath);
    }
  }
}

console.log('🔍 Scanning skills...');
walkDir(SKILLS_DIR);

// Sort skills by id
allSkills.sort((a, b) => a.id.localeCompare(b.id));

// Write global index
const index = {
  schema_version: "1.0",
  generated_at: new Date().toISOString(),
  total_skills: allSkills.length,
  skills: allSkills
};

fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');

console.log('\n📊 REPORT');
console.log('='.repeat(40));
console.log(`Skills found:    ${stats.found}`);
console.log(`JSON created:    ${stats.created}`);
console.log(`JSON updated:    ${stats.updated}`);
console.log(`Errors:          ${stats.errors.length}`);
console.log('='.repeat(40));

if (stats.errors.length > 0) {
  console.log('\n❌ ERRORS:');
  stats.errors.forEach(e => console.log(`  - ${e.path}: ${e.error}`));
}

console.log(`\n✅ Index saved to: ${INDEX_FILE}`);
