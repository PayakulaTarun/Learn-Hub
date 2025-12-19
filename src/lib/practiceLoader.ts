
import fs from 'fs';
import path from 'path';
import { PracticePack } from '../types/practice';

const practiceDir = path.join(process.cwd(), 'content/practice');

export function getPracticePack(slug: string): PracticePack | null {
    const filePath = path.join(practiceDir, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;

    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        console.error(`Error loading practice pack for ${slug}:`, e);
        return null;
    }
}
