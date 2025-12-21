import fs from 'fs';
import path from 'path';
import { roadmaps } from '../src/lib/roadmaps';

console.log('🔍 Validating content integrity...');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const existingSlugs = new Set<string>();

// 1. Index all content files
function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (item.endsWith('.json')) {
            try {
                const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
                if (content.slug) {
                    existingSlugs.add(content.slug);
                }
            } catch (e) {
                console.error(`❌ Invalid JSON: ${fullPath}`);
                process.exit(1);
            }
        }
    }
}

scanDir(CONTENT_DIR);
console.log(`✅ Indexed ${existingSlugs.size} content files.`);

// 2. Validate Roadmaps
let errors = 0;
roadmaps.forEach(roadmap => {
    roadmap.stages.forEach(stage => {
        stage.topics.forEach(topic => {
            if (topic.slug && !existingSlugs.has(topic.slug)) {
                console.error(`❌ Broken Link: Roadmap "${roadmap.title}" -> Topic "${topic.title}" points to missing slug "${topic.slug}"`);
                errors++;
            }
        });
    });
});

if (errors > 0) {
    console.error(`🚨 Found ${errors} broken links. Build aborted.`);
    process.exit(1);
} else {
    console.log('✅ All roadmap links are valid.');
    process.exit(0);
}
