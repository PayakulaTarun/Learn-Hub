const fs = require('fs');
const path = require('path');

const version = {
    version: process.env.npm_package_version || '1.0.0',
    buildTime: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local-build'
};

const outDir = path.join(process.cwd(), 'out');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
    path.join(outDir, 'version.json'),
    JSON.stringify(version, null, 2)
);

console.log('✅ Generated version.json');
