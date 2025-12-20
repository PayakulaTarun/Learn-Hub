const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../content/next-js');

const topics = [
    {
        title: "Data Fetching Overview",
        slug: "data-fetching-overview",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["Beginner Module"],
        learning_objectives: ["Fetch API", "Server Components", "Client Components"],
        theory: "Next.js 14+ uses the standard `fetch` API extended with caching and revalidation logic. Data fetching happens on the server by default (in Server Components).",
        syntax: "async function getData() { const res = await fetch(...) }",
        examples: [
            {
                code: "export default async function Page() {\n  const data = await getData()\n  return <main>{data.title}</main>\n}",
                output: "Server rendered content",
                explanation: "No useEffect needed. Async components just await data."
            }
        ],
        common_mistakes: [{ "mistake": "Using useEffect for initial data load", "correction": "Use Server Components for better performance." }],
        interview_questions: [{ "question": "How is fetch different in Next.js?", "answer": "It is patched to include caching/revalidation arguments.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: ["Fetching blog posts", "Product details"],
        exam_notes: ["Server Components are key"],
        summary: "Simplified data access.",
        order: 21
    },
    {
        title: "Static Site Generation (SSG)",
        slug: "ssg",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "12 mins",
        prerequisites: ["Data Fetching"],
        learning_objectives: ["Build-time rendering", "force-cache"],
        theory: "SSG generates HTML at build time. In App Router, `fetch` defaults to 'force-cache', effectively creating SSG pages automatically if inputs are static.",
        syntax: "fetch('...', { cache: 'force-cache' })",
        examples: [
            {
                code: "const res = await fetch('https://api/posts');",
                output: "Static HTML generated at build time.",
                explanation: "Fastest possible performance (CDN served)."
            }
        ],
        common_mistakes: [{ "mistake": "Thinking getStaticProps exists in App router", "correction": "It is replaced by standard fetch semantics." }],
        interview_questions: [{ "question": "What is SSG?", "answer": "Rendering pages at build time.", "difficulty": "Easy" }],
        practice_problems: [],
        real_world_use_cases: ["Marketing pages", "Docs"],
        exam_notes: [],
        summary: "Default rendering strategy.",
        order: 22
    },
    {
        title: "Server-Side Rendering (SSR)",
        slug: "ssr",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["SSG"],
        learning_objectives: ["Dynamic Rendering", "no-store"],
        theory: "SSR generates HTML on each request. Use `{ cache: 'no-store' }` in fetch to opt-out of caching and ensure fresh data per request.",
        syntax: "fetch('...', { cache: 'no-store' })",
        examples: [
            {
                code: "const res = await fetch('...', { cache: 'no-store' });",
                output: "Fresh data on every refresh.",
                explanation: "Good for personalized dashboards."
            }
        ],
        common_mistakes: [],
        interview_questions: [{ "question": "When to use SSR?", "answer": "When data changes frequently or is user-specific.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: ["Analytics dashboard", "Social feed"],
        exam_notes: [],
        summary: "Fresh content at cost of TTFB.",
        order: 23
    },
    {
        title: "Incremental Static Regeneration (ISR)",
        slug: "isr",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["SSG", "SSR"],
        learning_objectives: ["Revalidation", "Hybrid Approach"],
        theory: "ISR allows updating static pages after build time. By setting a `next: { revalidate: 60 }` option, Next.js rebuilds the page in the background after 60 seconds.",
        syntax: "fetch('...', { next: { revalidate: 60 } })",
        examples: [
            {
                code: "fetch('...', { next: { revalidate: 10 } })",
                output: "Static for 10s, then updates.",
                explanation: "Best of both worlds: Speed of SSG, Freshness of SSR."
            }
        ],
        common_mistakes: [],
        interview_questions: [{ "question": "How ISR works?", "answer": "Serves stale content while regenerating new content in background.", "difficulty": "Advanced" }],
        practice_problems: [],
        real_world_use_cases: ["E-commerce product lists"],
        exam_notes: [],
        summary: "Scalable dynamic content.",
        order: 24
    },
    {
        title: "Client vs Server Components",
        slug: "client-vs-server-components",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "15 mins",
        prerequisites: ["App Router"],
        learning_objectives: ["'use client'", "Rendering Boundary", "Hydration"],
        theory: "Server Components (default) render on server, send no JS. Client Components (`use client`) are standard React components with hooks usage. Interactivity requires Client Components.",
        syntax: "'use client'",
        examples: [
            {
                code: "'use client'\nimport { useState } from 'react'\nexport default function Counter() { ... }",
                output: "Interactive button",
                explanation: "Hooks imply client-side logic."
            }
        ],
        common_mistakes: [{ "mistake": "Adding 'use client' everywhere", "correction": "Use leaf components for client logic to keep performance high." }],
        interview_questions: [{ "question": "Can Server Component import Client Component?", "answer": "Yes.", "difficulty": "Medium" }, { "question": "Can Client Component import Server Component?", "answer": "No, only pass as children.", "difficulty": "Hard" }],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: ["Critical concept for Next.js 13+"],
        summary: "Architecture paradigm.",
        order: 25
    },
    {
        title: "Fetch API in Next.js",
        slug: "fetch-api",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "8 mins",
        prerequisites: ["Data Fetching"],
        learning_objectives: ["Memoization", "Request Deduplication"],
        theory: "Next.js extends JS `fetch` to automatically memoize requests with the same URL and options within a single render pass.",
        syntax: "fetch(url)",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Efficient by design.",
        order: 26
    },
    {
        title: "Loading & Error UI",
        slug: "loading-error-ui",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "8 mins",
        prerequisites: ["File-Based Routing"],
        learning_objectives: ["loading.tsx", "error.tsx", "Suspense"],
        theory: "Next.js App Router uses special files. `loading.tsx` wraps page in Suspense during async fetch. `error.tsx` captures unhandled errors in children.",
        syntax: "export default function Loading() { return <Skeleton /> }",
        examples: [],
        common_mistakes: [{ "mistake": "error.tsx must be Client Component", "correction": "Errors might happen on client, so error.tsx needs 'use client'." }],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: ["Skeletons while loading dashboard"],
        exam_notes: [],
        summary: "Progressive UX.",
        order: 27
    },
    {
        title: "API Routes",
        slug: "api-routes",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["Node.js"],
        learning_objectives: ["Serverless functions", "Pages API"],
        theory: "In Pages Router, `pages/api/*` mapped to API endpoints. This is the legacy way but still widely used.",
        syntax: "export default function handler(req, res) { ... }",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Backend within Frontend.",
        order: 28
    },
    {
        title: "Route Handlers",
        slug: "route-handlers",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "12 mins",
        prerequisites: ["API Routes"],
        learning_objectives: ["GET/POST/PUT methods", "route.ts"],
        theory: "In App Router, use `route.ts` (not `page.tsx`) to define API endpoints using standard Request/Response web APIs. Exports named functions like GET, POST.",
        syntax: "export async function GET(request) { ... }",
        examples: [
            {
                code: "// app/api/hello/route.ts\nexport async function GET(request) {\n  return Response.json({ msg: 'Hello' })\n}",
                output: "JSON response",
                explanation: "Modern standard API handler."
            }
        ],
        common_mistakes: [],
        interview_questions: [{ "question": "Diff between API Routes and Route Handlers?", "answer": "Route Handlers use Web Request/Response API.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: ["Form submission handler"],
        exam_notes: [],
        summary: "The specific 'Backend' of App Router.",
        order: 29
    },
    {
        title: "Middleware",
        slug: "middleware",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["Route Handlers"],
        learning_objectives: ["Edge functions", "Request interception"],
        theory: "Middleware (`middleware.ts`) runs before a request completes. It's useful for rewriting, redirecting, or modifying headers/cookies globally or per path.",
        syntax: "export function middleware(request) { ... }",
        examples: [
            {
                code: "if (!token) return NextResponse.redirect(new URL('/login', request.url))",
                output: "Redirects unauthorized users",
                explanation: "Authentication guard."
            }
        ],
        common_mistakes: [{ "mistake": "Heavy logic in middleware", "correction": "Middleware runs on Edge. Keep it light." }],
        interview_questions: [{ "question": "Where does middleware run?", "answer": "Edge Runtime (mostly).", "difficulty": "Advanced" }],
        practice_problems: [],
        real_world_use_cases: ["Auth protection", "Geo-blocking"],
        exam_notes: [],
        summary: "Gatekeeper of your app.",
        order: 30
    },
    {
        title: "Forms & Server Actions",
        slug: "forms-server-actions",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "15 mins",
        prerequisites: ["Route Handlers"],
        learning_objectives: ["'use server'", "Mutations without API", "Progressive enhancement"],
        theory: "Server Actions allow calling server-side functions directly from client components (e.g., form `action`). They simplify mutations significantly.",
        syntax: "async function create(formData) { 'use server'; ... }",
        examples: [
            {
                code: "<form action={create}>\n  <input name='title' />\n</form>",
                output: "Submits to server function directly.",
                explanation: "No need to manually fetch('/api/create')."
            }
        ],
        common_mistakes: [],
        interview_questions: [{ "question": "What is a Server Action?", "answer": "Async function enabling server logic execution from client interactions.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: ["Newsletter signup", "Login form"],
        exam_notes: ["Alpha/Beta in older versions, Stable in 14"],
        summary: "No-API mutations.",
        order: 31
    },
    {
        title: "Authentication Basics",
        slug: "authentication-basics",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["Middleware"],
        learning_objectives: ["Session management", "Cookies", "JWT"],
        theory: "Authentication involves verifying identity (Login) and managing sessions (Cookies/JWT). Middleware is often used to protect routes.",
        syntax: "Conceptual",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Securing the app.",
        order: 32
    },
    {
        title: "NextAuth Introduction",
        slug: "nextauth-intro",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "12 mins",
        prerequisites: ["Auth Basics"],
        learning_objectives: ["Configuration", "Providers (Google/GitHub)", "SessionProvider"],
        theory: "NextAuth.js (Auth.js) is the standard library. It handles OAuth flows, sessions, and database adapters automatically.",
        syntax: "NextAuth(authOptions)",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: ["Sign in with Google"],
        exam_notes: [],
        summary: "Auth made easy.",
        order: 33
    },
    {
        title: "State Management in Next.js",
        slug: "state-management",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["Client Components"],
        learning_objectives: ["URL State", "Server State", "Client State"],
        theory: "In Next.js, prioritize URL (searchParams) for shareable state and Server State (fetch) for data. Use Client State (useState/Redux) only when necessary.",
        syntax: "N/A",
        examples: [],
        common_mistakes: [{ "mistake": "Using Redux for server data", "correction": "React Query or simple Fetch is better." }],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Shift state to URL.",
        order: 34
    },
    {
        title: "Context API with Next.js",
        slug: "context-api",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "8 mins",
        prerequisites: ["State Management"],
        learning_objectives: ["Client Providers", "Root Layout Integration"],
        theory: "To use Context in App Router, create a Client Component 'Provider' wrapper and use it in Root Layout to wrap `{children}`.",
        syntax: "'use client'; export const ThemeContext ...",
        examples: [
            {
                code: "// providers.tsx ('use client')\nreturn <ThemeContext.Provider>{children}...</ThemeContext.Provider>\n\n// layout.tsx\n<Providers>{children}</Providers>",
                output: "Global context works.",
                explanation: "Bridges server layout to client context."
            }
        ],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: ["Theming", "Cart state"],
        exam_notes: [],
        summary: "Global client state.",
        order: 35
    },
    {
        title: "SEO in Next.js",
        slug: "seo-nextjs",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["Metadata"],
        learning_objectives: ["Sitemap.xml", "Robots.txt", "Canonical URLs", "Open Graph"],
        theory: "Next.js provides helpers to generate `sitemap.ts` and `robots.ts` dynamically. Metadata API handles OGP tags specifically.",
        syntax: "export default function sitemap() { ... }",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Discoverability.",
        order: 36
    },
    {
        title: "Performance Optimization",
        slug: "performance-optimization",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "10 mins",
        prerequisites: ["Next Image"],
        learning_objectives: ["Bundle analysis", "Lazy loading", "Script component"],
        theory: "Use `next/script` for 3rd party scripts. Use `lazy()`/dynamic imports to split code. Analyze bundles with `@next/bundle-analyzer`.",
        syntax: "import dynamic from 'next/dynamic'",
        examples: [
            {
                code: "const HeavyChart = dynamic(() => import('./Chart'))",
                output: "Loads only when rendered.",
                explanation: "Code splitting."
            }
        ],
        common_mistakes: [],
        interview_questions: [{ "question": "How to load 3rd party scripts?", "answer": "Use next/script component.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Speed matters.",
        order: 37
    },
    {
        title: "Caching Strategies",
        slug: "caching-strategies",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "12 mins",
        prerequisites: ["Data Fetching"],
        learning_objectives: ["Request Memoization", "Data Cache", "Full Route Cache", "Router Cache"],
        theory: "Next.js has a complex 4-layer caching system. Understanding where data is cached (Server vs Client) and how to invalidate it (revalidatePath/revalidateTag) is crucial.",
        syntax: "revalidatePath('/blog')",
        examples: [],
        common_mistakes: [{ "mistake": "Confusion between Data Cache and Route Cache", "correction": "Data Cache persists fetch results; Route Cache stores static HTML." }],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: ["Advanced topic in v14"],
        summary: "Mastering freshness.",
        order: 38
    },
    {
        title: "Image & Font Optimization",
        slug: "image-font-optimization",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "8 mins",
        prerequisites: ["Next Image", "Next Font"],
        learning_objectives: ["Local fonts", "Remote patterns"],
        theory: "Configure `next.config.js` to allow specific remote image domains for security.",
        syntax: "images: { remotePatterns: [...] }",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Configuring assets.",
        order: 39
    },
    {
        title: "Intermediate Next.js Case Study",
        slug: "intermediate-case-study",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Intermediate",
        estimated_read_time: "25 mins",
        prerequisites: ["All Intermediate Topics"],
        learning_objectives: ["Build E-commerce Logic", "Integrate cart", "Auth flow"],
        theory: "Building a functional e-commerce product page with Authentication, Database fetch (mock), and dynamic routes.",
        syntax: "Hands-on",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Level up.",
        order: 40
    }
];

topics.forEach(topic => {
    const filePath = path.join(outputDir, `${topic.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(topic, null, 2));
    console.log(`Generated ${topic.slug}`);
});
