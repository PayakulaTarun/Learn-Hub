import { AIService } from '../src/services/AIService';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, '../.env') });

async function test() {
    process.env.GOOGLE_CLOUD_PROJECT = 'student-resource-hub-a758a';

    console.log('🧪 Testing AI Response Grounding...');
    const query = 'Explain the difference between Strong AI and Weak AI according to the expert database.';

    const mockRes = {
        write: (chunk: string) => process.stdout.write(chunk),
        end: () => console.log('\n\n✅ Test Finished.'),
        flushHeaders: () => { }
    };

    try {
        await AIService.streamResponse(query, mockRes);
    } catch (e) {
        console.error('❌ Test Failed:', e);
    }
}

test();
