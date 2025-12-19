import fs from 'fs';
import path from 'path';
import { Tutorial, TutorialMetadata } from '../types/content';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Safely parse JSON with error handling
 */
function safeJSONParse(content: string, filePath: string): Tutorial | null {
    try {
        const parsed = JSON.parse(content) as Tutorial;

        // Validate required fields
        if (!parsed.slug || !parsed.title || !parsed.category) {
            console.error(`[Content Error] Missing required fields in ${filePath}`);
            return null;
        }

        return parsed;
    } catch (error) {
        console.error(`[Content Error] Invalid JSON in ${filePath}:`, error);
        return null;
    }
}

/**
 * Check if content directory exists
 */
function ensureContentDirExists(): boolean {
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`[Content Error] Content directory not found: ${CONTENT_DIR}`);
        return false;
    }
    return true;
}

/**
 * Get all available tutorials by scanning the content directory
 * Returns empty array on error instead of crashing
 */
export function getAllTutorials(): TutorialMetadata[] {
    const tutorials: TutorialMetadata[] = [];

    try {
        if (!ensureContentDirExists()) {
            return tutorials;
        }

        const categories = fs.readdirSync(CONTENT_DIR).filter(item => {
            try {
                if (item === 'practice' || item === 'evaluator') return false;
                const fullPath = path.join(CONTENT_DIR, item);
                return fs.statSync(fullPath).isDirectory();
            } catch (error) {
                console.error(`[Content Error] Cannot stat ${item}:`, error);
                return false;
            }
        });

        for (const category of categories) {
            try {
                const categoryPath = path.join(CONTENT_DIR, category);
                const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.json'));

                for (const file of files) {
                    try {
                        const filePath = path.join(categoryPath, file);

                        if (!fs.existsSync(filePath)) {
                            console.error(`[Content Error] File not found: ${filePath}`);
                            continue;
                        }

                        const content = fs.readFileSync(filePath, 'utf-8');
                        const tutorial = safeJSONParse(content, filePath);

                        if (tutorial) {
                            tutorials.push({
                                slug: tutorial.slug || 'unknown',
                                title: tutorial.title || 'Untitled',
                                category: tutorial.category || category,
                                subject: tutorial.subject || 'General',
                                description: tutorial.description || tutorial.summary || '',
                                order: tutorial.order ?? 9999,
                            });
                        }
                    } catch (fileError) {
                        console.error(`[Content Error] Error processing ${file}:`, fileError);
                        // Continue with next file instead of crashing
                        continue;
                    }
                }
            } catch (categoryError) {
                console.error(`[Content Error] Error processing category ${category}:`, categoryError);
                // Continue with next category
                continue;
            }
        }
    } catch (error) {
        console.error('[Content Error] Fatal error in getAllTutorials:', error);
    }

    // Sort by order to ensure curriculum sequence
    return tutorials.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
}

/**
 * Get a single tutorial by slug
 * Returns null on error instead of crashing
 */
export function getTutorialBySlug(slug: string): Tutorial | null {
    if (!slug || typeof slug !== 'string') {
        console.error('[Content Error] Invalid slug provided');
        return null;
    }

    try {
        if (!ensureContentDirExists()) {
            return null;
        }

        const categories = fs.readdirSync(CONTENT_DIR).filter(item => {
            try {
                const fullPath = path.join(CONTENT_DIR, item);
                return fs.statSync(fullPath).isDirectory();
            } catch (error) {
                return false;
            }
        });

        for (const category of categories) {
            try {
                const categoryPath = path.join(CONTENT_DIR, category);
                const files = fs.readdirSync(categoryPath);

                for (const file of files) {
                    if (file.endsWith('.json')) {
                        try {
                            const filePath = path.join(categoryPath, file);

                            if (!fs.existsSync(filePath)) {
                                continue;
                            }

                            const content = fs.readFileSync(filePath, 'utf-8');
                            const tutorial = safeJSONParse(content, filePath);

                            if (tutorial && tutorial.slug === slug) {
                                return tutorial;
                            }
                        } catch (fileError) {
                            // Continue with next file
                            continue;
                        }
                    }
                }
            } catch (categoryError) {
                // Continue with next category
                continue;
            }
        }
    } catch (error) {
        console.error(`[Content Error] Error finding tutorial ${slug}:`, error);
    }

    return null;
}

/**
 * Get all tutorial slugs for static generation
 * Returns empty array on error
 */
export function getAllTutorialSlugs(): string[] {
    try {
        return getAllTutorials()
            .map(t => t.slug)
            .filter(slug => slug && slug !== 'unknown');
    } catch (error) {
        console.error('[Content Error] Error getting tutorial slugs:', error);
        return [];
    }
}

/**
 * Get tutorials by category
 * Returns empty array on error
 */
export function getTutorialsByCategory(category: string): TutorialMetadata[] {
    if (!category || typeof category !== 'string') {
        console.error('[Content Error] Invalid category provided');
        return [];
    }

    try {
        return getAllTutorials().filter(t => t.category === category);
    } catch (error) {
        console.error(`[Content Error] Error getting tutorials for category ${category}:`, error);
        return [];
    }
}
