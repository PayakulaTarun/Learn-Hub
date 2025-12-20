import fs from 'fs';
import path from 'path';
import { tokenize } from '../src/lib/ai/nlp'; // We need to run this with ts-node
// Note: We might need to copy/paste NLP logic here if ts-node has path mapping issues with imports
// For robustness, I will duplicate the simple tokenizer logic here for the script to be standalone.

const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
    'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
    'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is',
    'it', 'its', 'itself', 'let', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
    'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some',
    'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
    'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
    'which', 'while', 'who', 'whom', 'why', 'with', 'won', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

function scriptTokenize(text: string): string[] {
    if (!text) return [];
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_FILE = path.join(__dirname, '../src/lib/ai/knowledgeIndex.json');

const EXCLUDED_DIRS = ['assets', 'images', 'icons'];

interface KnowledgeItem {
    id: string;
    title: string;
    description: string;
    content: string;
    tokens: string[];
    type: 'concept' | 'problem' | 'tutorial';
    url: string;
}

let knowledge: KnowledgeItem[] = [];

function scanDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!EXCLUDED_DIRS.includes(file)) {
                scanDirectory(fullPath);
            }
        } else if (file.endsWith('.json')) {
            try {
                const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

                // Handle different content types

                // 1. Topic/Tutorial JSON
                if (Array.isArray(data)) {
                    data.forEach(item => processItem(item));
                }
                // 2. Single object (e.g. metadata or config)
                else {
                    processItem(data);
                }

            } catch (e) {
                console.warn(`Failed to parse ${file}:`, e);
            }
        }
    });
}

function processItem(item: any) {
    // Only process items that look like content
    if (!item.id || !item.title) return;

    // Determine type
    let type: KnowledgeItem['type'] = 'concept';
    if (item.code || item.initialCode) type = 'problem';
    if (item.sections || item.content) type = 'tutorial';

    // Construct URL (approximate based on ID/Structure)
    // This is "best effort" URL generation
    let url = `/`;
    if (type === 'problem') url = `/evaluator/solve/${item.id}`;
    else url = `/subjects/${item.id}`;

    // Extract text content for indexing
    let rawContent = item.description || item.content || "";

    // Add sections if tutorial
    if (item.sections && Array.isArray(item.sections)) {
        item.sections.forEach((sec: any) => {
            rawContent += " " + (sec.heading || "") + " " + (sec.content || "");

            // Create sub-items for long sections? 
            // For now, Monolith item is fine for simpler search.
        });
    }

    // Chunking logic (Optional): Break huge articles into paragraphs?
    // For MVp, we just verify the item acts as a source.

    const tokens = scriptTokenize(item.title + " " + rawContent);

    knowledge.push({
        id: item.id,
        title: item.title,
        description: item.description?.substring(0, 150) || "",
        content: rawContent.substring(0, 500), // Store snippet only to save JSON size
        tokens: tokens, // Full tokens for search
        type,
        url
    });
}

console.log('🧠 Scanning content universe...');
scanDirectory(CONTENT_DIR);
console.log(`✅ Indexed ${knowledge.length} knowledge atoms.`);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledge, null, 2));
console.log(`💾 Knowledge base saved to ${OUTPUT_FILE}`);
