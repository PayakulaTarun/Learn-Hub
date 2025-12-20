import axios from 'axios';

async function testChat() {
    console.log('🧪 Testing AI Chat Endpoint...');
    try {
        const resp = await axios.post('http://localhost:3000/api/ai/chat', {
            messages: [{ role: 'user', content: 'What is SQL Injection?' }]
        }, {
            headers: { 'Authorization': 'Bearer MOCK_TOKEN' } // Note: Will fail if auth is strictly enforced during local test
        });
        console.log('✅ AI Response:', resp.data);
    } catch (e: any) {
        console.error('❌ AI Test Failed:', e.message);
    }
}

// Only for local testing
// testChat();
