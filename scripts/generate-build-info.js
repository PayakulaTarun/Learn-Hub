const fs = require('fs');
const path = require('path');

const versionInfo = {
    timestamp: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'dev',
    environment: process.env.NODE_ENV || 'development',
    version: require('../package.json').version
};

const outputPath = path.join(__dirname, '../public/version.json');

fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));

console.log(`📦 Build artifact stamped: ${versionInfo.timestamp} (${versionInfo.commit})`);
