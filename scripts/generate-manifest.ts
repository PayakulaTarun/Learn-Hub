import fs from 'fs';
import path from 'path';

console.log('📦 Generating Content Manifest...');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'generated', 'manifest.json');

interface ManifestItem {
    slug: string;
    path: string; // Relative to project root
    title: string;
    category: string;
    subject: string;
    description: string;
    order: number;
}

const manifest: Record<string, ManifestItem> = {};

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
                if (content.slug && content.title && content.category) {
                    const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
                    manifest[content.slug] = {
                        slug: content.slug,
                        path: relativePath,
                        title: content.title,
                        category: content.category,
                        subject: content.subject || 'General',
                        description: content.description || '',
                        order: content.order ?? 9999
                    };
                }
            } catch (e) {
                console.warn(`⚠️ Skipping invalid JSON: ${fullPath}`);
            }
        }
    }
}

scanDir(CONTENT_DIR);

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

console.log(`✅ Manifest generated with ${Object.keys(manifest).length} items.`);
