import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars (auto-detects .env or .env.local)
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection check...');
console.log(`📡 URL: ${url ? '✅ Found' : '❌ MISSING'}`);
console.log(`🔑 Key: ${key ? '✅ Found' : '❌ MISSING'}`);

if (!url || !key) {
    console.error('❌ Missing environment variables. Please create a .env.local file.');
    process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
    try {
        const start = Date.now();
        const { data, error } = await supabase.from('user_activity_events').select('count', { count: 'exact', head: true });

        if (error) {
            // 42P01 means table missing (Connection OK, DB Schema missing)
            if (error.code === '42P01') {
                console.log('✅ Connection Successful! (But table "user_activity_events" is missing)');
                console.log('👉 Please run the SQL migration provided in supabase/policies.sql');
                return;
            }
            throw error;
        }

        console.log(`✅ Connection Successful in ${Date.now() - start}ms!`);
        console.log('✅ Database is reachable.');
    } catch (err: any) {
        console.error('❌ Connection Failed:', err.message);
        if (err.cause) console.error('   Cause:', err.cause);
    }
}

testConnection();
