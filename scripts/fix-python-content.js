const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../content/python');

if (!fs.existsSync(dir)) {
    console.error('Directory not found:', dir);
    process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace "category": "backend" with "category": "python"
        const newContent = content.replace(/"category":\s*"backend"/g, '"category": "python"');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated ${file}`);
        } else {
            console.log(`No changes needed for ${file}`);
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
});
