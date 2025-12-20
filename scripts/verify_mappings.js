const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../content');

// Copy from src/lib/navData.ts
const availableSubjects = [
    { slug: 'html', label: 'HTML Foundations' },
    { slug: 'css', label: 'Modern CSS Design' },
    { slug: 'javascript', label: 'JavaScript Engine' },
    { slug: 'react', label: 'React Library' },
    { slug: 'next-js', label: 'Next.js Framework' },
    { slug: 'angular', label: 'Angular Framework' },
    { slug: 'bootstrap', label: 'Bootstrap UI' },
    { slug: 'data-structures', label: 'Data Structures' },
    { slug: 'algorithms', label: 'Algorithms' },
    { slug: 'operating-systems', label: 'Operating Systems' },
    { slug: 'dbms', label: 'Database (DBMS)' },
    { slug: 'computer-networks', label: 'Computer Networks' },
    { slug: 'software-engineering', label: 'Software Engineering' },
    { slug: 'computer-organization', label: 'Computer Org' },
    { slug: 'java', label: 'Java' },
    { slug: 'python', label: 'Python' },
    { slug: 'c-programming', label: 'C Programming' },
    { slug: 'cpp-programming', label: 'C++ Programming' },
    { slug: 'git', label: 'Git & Versioning' },
    { slug: 'artificial-intelligence', label: 'AI Foundations' },
    { slug: 'machine-learning', label: 'Machine Learning' },
    { slug: 'data-science', label: 'Data Science' },
    { slug: 'mysql', label: 'MySQL' },
    { slug: 'mongodb', label: 'MongoDB' }
];

const subjectSlugs = new Set(availableSubjects.map(s => s.slug));

function checkMappings() {
    const categories = fs.readdirSync(CONTENT_DIR);
    const unmapped = [];
    const mapped = {};

    for (const category of categories) {
        const catPath = path.join(CONTENT_DIR, category);
        if (!fs.statSync(catPath).isDirectory() || category === 'practice' || category === 'evaluator') continue;

        fs.readdirSync(catPath).forEach(file => {
            if (!file.endsWith('.json')) return;
            try {
                const tutorial = JSON.parse(fs.readFileSync(path.join(catPath, file), 'utf-8'));
                // Simulating index.tsx logic EXACTLY
                let rawSubject = tutorial.subject || tutorial.category || 'general';
                let key = rawSubject.toLowerCase().trim().replace(/\s+/g, '-');

                // Direct match check (same as index.tsx lines 23-28)
                const matchingSubject = availableSubjects.find(s =>
                    s.slug === key ||
                    s.label.toLowerCase() === rawSubject.toLowerCase() ||
                    s.label.toLowerCase().replace(/\s+/g, '-') === key
                    // Ignoring category match for now as specific subject match is preferred
                );

                if (matchingSubject) {
                    key = matchingSubject.slug;
                } else {
                    // Fallbacks (from index.tsx)
                    if (key === 'c++' || key === 'cpp') key = 'cpp-programming';
                    if (key === 'c') key = 'c-programming';
                    if (key === 'js') key = 'javascript';
                    if (key === 'reactjs') key = 'react';
                    if (key === 'node') key = 'backend';
                    if (key === 'next.js' || key === 'nextjs') key = 'next-js';
                }

                if (subjectSlugs.has(key)) {
                    mapped[key] = (mapped[key] || 0) + 1;
                } else {
                    unmapped.push({
                        file: path.join(category, file),
                        rawSubject,
                        generatedKey: key,
                        folder: category
                    });
                }
            } catch (e) { }
        });
    }

    console.log("=== Successfully Mapped ===");
    for (const [slug, count] of Object.entries(mapped)) {
        console.log(`${slug}: ${count}`);
    }

    if (unmapped.length > 0) {
        console.log("\n=== UNMAPPED FILES (These are hidden!) ===");
        // Group by generatedKey
        const groups = {};
        unmapped.forEach(u => {
            groups[u.generatedKey] = groups[u.generatedKey] || [];
            groups[u.generatedKey].push(u.rawSubject);
        });

        for (const [key, rawList] of Object.entries(groups)) {
            const uniqueRaws = [...new Set(rawList)];
            console.log(`Key '${key}' (from "${uniqueRaws.join('", "')}"): ${rawList.length} files`);
        }
    } else {
        console.log("\nAll files mapped successfully!");
    }
}

checkMappings();
