import { helpers, PredictionServiceClient } from '@google-cloud/aiplatform';
import { VertexAI } from '@google-cloud/vertexai';
import { db } from '../lib/firebase-admin';

// --- PRODUCTION CONFIG ---
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

if (!PROJECT_ID) {
    throw new Error('CRITICAL: GOOGLE_CLOUD_PROJECT environment variable is missing.');
}

const EMBEDDING_ENDPOINT = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/text-embedding-004`;

// Minimum similarity score to consider context "relevant"
const RELEVANCE_THRESHOLD = 0.65;

// Lazy initialization for production efficiency
let predictionClient: PredictionServiceClient | null = null;
let vertexAI: VertexAI | null = null;
let generativeModel: any | null = null;

function getPredictionClient() {
    if (!predictionClient) {
        predictionClient = new PredictionServiceClient({ apiEndpoint: `${LOCATION}-aiplatform.googleapis.com` });
    }
    return predictionClient;
}

function getGenerativeModel() {
    if (!vertexAI) {
        vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
    }
    if (!generativeModel) {
        // Using gemini-1.5-flash for better speed in production chat
        generativeModel = vertexAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.2, // Low temperature for high factuality
                topP: 0.8,
            }
        });
    }
    return generativeModel;
}


export class AIService {

    /**
     * Converts user query into a mathematical vector for semantic search
     */
    static async getEmbedding(text: string): Promise<number[]> {
        const instance = helpers.toValue({ content: text, task_type: 'RETRIEVAL_QUERY' });
        const request = { endpoint: EMBEDDING_ENDPOINT, instances: [instance!] };

        try {
            const [response] = await getPredictionClient().predict(request);
            const predictions = response.predictions;
            if (!predictions?.[0]) throw new Error('AI_EMBEDDING_EMPTY');

            const embedding = predictions[0].structValue?.fields?.embeddings?.structValue?.fields?.values?.listValue?.values;
            return embedding!.map(v => v.numberValue!);
        } catch (error: any) {
            console.error('[AI] Embedding Error:', error.message);
            throw new Error('AI_INFRASTRUCTURE_FAILURE');
        }
    }

    /**
     * Finds the most relevant snippets from the Knowledge Base (JSON parts) using Firestore Vector Search
     */
    static async getRelevantContext(queryVector: number[]): Promise<{ context: string, highConfidence: boolean }> {
        try {
            console.log('[AI] Querying Vector Database...');

            // Native Firestore Vector Search (O(log N) scale vs O(N) memory)
            const snapshot = await db.collection('knowledge_vectors')
                .findNearest({
                    vectorField: 'embedding',
                    queryVector: queryVector,
                    distanceMeasure: 'COSINE',
                    limit: 5
                })
                .get();

            const matches = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as any));

            // Prioritize QA over Tutorial in the context assembly
            const context = matches
                .sort((a, b) => {
                    if (a.type === 'qa' && b.type !== 'qa') return -1;
                    if (a.type !== 'qa' && b.type === 'qa') return 1;
                    return 0;
                })
                .map((v, i) => `[Source: ${v.heading} (${v.type})]\n${v.content}`)
                .join('\n\n');

            return {
                context,
                highConfidence: matches.length > 0
            };
        } catch (error: any) {
            console.error('[AI] Vector Search Failed:', error.message);
            // Fallback to empty context
            return { context: '', highConfidence: false };
        }
    }

    /**
     * Steams a grounded response to the client
     */
    static async streamResponse(query: string, res: any) {
        try {
            // 1. Semantic Search
            const queryVector = await this.getEmbedding(query);
            const { context, highConfidence } = await this.getRelevantContext(queryVector);

            // 2. Build Grounded Prompt
            let systemPrompt = "";
            if (highConfidence) {
                systemPrompt = `You are a Principal Software Engineering Tutor. 
                STRICT RULE: Use ONLY the provided CONTEXT to answer. 
                If the context doesn't contain the specific answer, say "I don't have specific details on that in my official software engineering database, but I can help with general topics."
                
                CONTEXT:
                ${context}`;
            } else {
                systemPrompt = `You are a helpful AI Assistant for an educational platform. 
                The user asked a question not found in our primary knowledge base. 
                Answer politely and suggest they check the official Roadmaps or Syllabus.`;
            }

            const prompt = `${systemPrompt}\n\nUSER QUERY: ${query}`;

            // 3. Execution & Streaming
            const streamingResp = await getGenerativeModel().generateContentStream(prompt);

            for await (const item of streamingResp.stream) {
                const chunk = item.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (chunk) res.write(chunk);
            }

        } catch (error: any) {
            console.error('[AI] Critical Flow Error:', error);
            res.write('\n\n⚠️ *Technical difficulty connecting to the AI brain. Please try again or use the search bar.*');
        } finally {
            res.end();
        }
    }
}
