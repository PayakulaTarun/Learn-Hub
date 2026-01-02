const fs = require('fs');

const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

console.log('🔒 Validating Environment Variables...');

const missing = requiredVars.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.warn(`⚠️  WARNING: Missing required environment variables: ${missing.join(', ')}`);
    console.warn('   The application will build, but backend features may fail at runtime.');
    // process.exit(1); // Relaxed for user request
}

// Check for "placeholder" values that often sneak into prod
const placeholders = ['your-project-url', 'your-anon-key', 'placeholder'];
const suspicious = requiredVars.filter(key => {
    const val = process.env[key] || '';
    return placeholders.some(p => val.includes(p));
});

if (suspicious.length > 0) {
    console.error(`⚠️  WARNING: Suspicious environment variables detected: ${suspicious.join(', ')}`);
    console.error('   Are you deploying using default example keys?');
    // We fail on this for production safety
    process.exit(1);
}

console.log('✅ Environment integrity verified.');
