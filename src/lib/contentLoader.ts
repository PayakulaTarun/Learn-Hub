import fs from 'fs';
import path from 'path';
import { Tutorial, TutorialMetadata } from '../types/content';

// Force build-time integrity. content-manifest.json IS REQUIRED.
import manifestData from '../generated/manifest.json';

const MANIFEST = manifestData as Record<string, {
    slug: string;
    path: string;
    title: string;
    category: string;
    subject: string;
    description: string;
    order: number;
}>;

/**
 * Get all available tutorials from the pre-built manifest
 * O(1) Access instead of O(N) File Scan
 */
export function getAllTutorials(): TutorialMetadata[] {
    return Object.values(MANIFEST).sort((a, b) => a.order - b.order);
}

/**
 * Get a single tutorial by slug
 * direct lookup via manifest
 */
export function getTutorialBySlug(slug: string): Tutorial | null {
    const item = MANIFEST[slug];
    if (!item) return null;

    try {
        const fullPath = path.join(process.cwd(), item.path);
        // We still read the file for the *body* content, but we know exactly where it is.
        // No searching.
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(fileContent) as Tutorial;
    } catch (error) {
        console.error(`[Content Error] Failed to read ${item.path}:`, error);
        return null;
    }
}

export function getAllTutorialSlugs(): string[] {
    return Object.keys(MANIFEST);
}

export function getTutorialsByCategory(category: string): TutorialMetadata[] {
    return Object.values(MANIFEST)
        .filter(t => t.category === category)
        .sort((a, b) => a.order - b.order);
}
