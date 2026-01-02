const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../content/next-js');

const topics = [
    {
        title: "Introduction to Next.js",
        slug: "intro-to-nextjs",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "5 mins",
        prerequisites: ["HTML", "CSS", "JavaScript", "React Basics"],
        learning_objectives: ["Understand what Next.js is", "Learn key differences from React", "Know the benefits of using Next.js"],
        theory: "Next.js is a React framework for building full-stack web applications. It creates fast, SEO-friendly applications by automating configuration and providing features like server-side rendering (SSR) and static site generation (SSG) out of the box.",
        syntax: "npx create-next-app@latest",
        examples: [
            {
                code: "// React Component in Next.js\nexport default function Home() {\n  return <h1>Hello, Next.js!</h1>;\n}",
                output: "Hello, Next.js! (Rendered on Server or Client)",
                explanation: "Looks exactly like React, but runs with Next.js powers."
            }
        ],
        common_mistakes: [{ "mistake": "Thinking it replaces React", "correction": "Next.js is built ON TOP of React." }],
        interview_questions: [{ "question": "What is Next.js?", "answer": "A React framework for production-grade applications with SSR/SSG support.", "difficulty": "Easy" }],
        practice_problems: [],
        real_world_use_cases: ["E-commerce sites needing SEO", "Dashboards needing speed"],
        exam_notes: ["Built by Vercel", "Production-ready"],
        summary: "The standard framework for React development.",
        order: 1
    },
    {
        title: "Why Next.js over React",
        slug: "nextjs-vs-react",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "8 mins",
        prerequisites: ["Intro to Next.js", "React"],
        learning_objectives: ["Compare CRA/Vite vs Next.js", "Understand SEO benefits", "Understand Routing"],
        theory: "React is a library for UIs. Next.js is a framework for apps. React needs manual setup for routing, bundling, and SSR. Next.js provides these by default.",
        syntax: "N/A",
        examples: [
            {
                code: "// React Router (Traditional)\n<Route path='/about' element={<About />} />\n\n// Next.js (File-based)\n// content/about.tsx automatically becomes /about",
                output: "/about route works instantly",
                explanation: "No complex router setup needed."
            }
        ],
        common_mistakes: [{ "mistake": "Using CRA for SEO heavy sites", "correction": "CRA is client-side only (bad for SEO). Next.js sends HTML." }],
        interview_questions: [{ "question": "Why use Next.js instead of Create React App?", "answer": "Better performance (SSR/SSG), built-in routing, API routes, and SEO optimization.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: ["Public facing marketing pages", "Blogs"],
        exam_notes: ["Library vs Framework distinction"],
        summary: "Next.js solves the 'configuration hell' of React apps.",
        order: 2
    },
    {
        title: "Next.js Features Overview",
        slug: "nextjs-features",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "6 mins",
        prerequisites: ["Intro to Next.js"],
        learning_objectives: ["Routing", "Rendering", "Data Fetching", "Styling"],
        theory: "Key features include File-system Routing, Server Components (default in App Router), Image Optimization, Font Optimization, and Route Handlers (API).",
        syntax: "N/A",
        examples: [],
        common_mistakes: [],
        interview_questions: [{ "question": "List 3 key features of Next.js", "answer": "SSR/SSG, File-based Routing, API Routes.", "difficulty": "Easy" }],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "A battery-included framework.",
        order: 3
    },
    {
        title: "Setting Up Next.js Environment",
        slug: "setting-up-nextjs",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "10 mins",
        prerequisites: ["Node.js Installed"],
        learning_objectives: ["Install Node.js", "Create new App", "Explanation of prompts"],
        theory: "We use 'create-next-app' to scaffold a project. It asks about TypeScript, ESLint, Tailwind, and App Router.",
        syntax: "npx create-next-app@latest my-app",
        examples: [
            {
                code: "npx create-next-app@latest ./ --typescript --tailwind --eslint",
                output: "Success! Created my-app at ...",
                explanation: "Sets up a modern stack instantly."
            }
        ],
        common_mistakes: [{ "mistake": "Using Node < 18", "correction": "Next.js 14 requires Node.js 18.17+." }],
        interview_questions: [],
        practice_problems: [{ "difficulty": "Easy", "problem": "Create a new Next.js app named 'hello-world'", "solution": "npx create-next-app@latest hello-world" }],
        real_world_use_cases: [],
        exam_notes: ["Uses npm, yarn, pnpm or bun"],
        summary: "One command setup.",
        order: 4
    },
    {
        title: "Next.js Project Structure",
        slug: "project-structure",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "8 mins",
        prerequisites: ["Setting Up Next.js"],
        learning_objectives: ["Understand folders", "src directory", "public directory", "app vs pages"],
        theory: "Standard structure: \n- `app/`: App Router routes\n- `public/`: Static files (images)\n- `next.config.js`: Configuration\n- `package.json`: Dependencies",
        syntax: "N/A",
        examples: [],
        common_mistakes: [{ "mistake": "Putting components in `public`", "correction": "Public is only for static assets." }],
        interview_questions: [{ "question": "What is the purpose of public folder?", "answer": "Stores static assets served from root URL.", "difficulty": "Easy" }],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Organized structure for scale.",
        order: 5
    },
    {
        title: "Pages Router vs App Router",
        slug: "pages-vs-app-router",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "12 mins",
        prerequisites: ["Project Structure"],
        learning_objectives: ["Evolution of Next.js", "React Server Components", "When to use which"],
        theory: "Pages Router (`pages/`) is the legacy/stable router using standard React components. App Router (`app/`) is the new paradigm using React Server Components, Layouts, and Streaming.",
        syntax: "N/A",
        examples: [
            {
                code: "// Pages Router (pages/about.js)\nexport default function About() { ... }\n\n// App Router (app/about/page.js)\nexport default function Page() { ... }",
                output: "Both render /about",
                explanation: "App Router requires a `page.js` file inside a folder named after the route."
            }
        ],
        common_mistakes: [{ "mistake": "Mixing concepts", "correction": "Stick to App Router for new projects." }],
        interview_questions: [{ "question": "Diff between Pages and App Router?", "answer": "App Router supports Server Components and Layouts natively. Pages Router does not.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: ["App Router is the future (Next 13+)"],
        summary: "App Router unlocks the full power of React 18+.",
        order: 6
    },
    {
        title: "File-Based Routing",
        slug: "file-based-routing",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "10 mins",
        prerequisites: ["Pages vs App Router"],
        learning_objectives: ["Folder to URL mapping", "page.tsx", "nested routes"],
        theory: "In App Router, folders define routes. A folder must contain `page.tsx` to be publicly accessible using its name as the URL path.",
        syntax: "app/blog/page.tsx -> /blog",
        examples: [
            {
                code: "src/app/dashboard/settings/page.tsx",
                output: "URL: /dashboard/settings",
                explanation: "Nested folders create nested routes."
            }
        ],
        common_mistakes: [{ "mistake": "Creating folder without page.tsx", "correction": "The route won't exist (404) without page.tsx." }],
        interview_questions: [{ "question": "How to create route /contact?", "answer": "Create app/contact/page.tsx", "difficulty": "Easy" }],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Filesystem is the API.",
        order: 7
    },
    {
        title: "Layouts and Pages",
        slug: "layouts-and-pages",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "10 mins",
        prerequisites: ["File-Based Routing"],
        learning_objectives: ["RootLayout", "Nested Layouts", "Sharing UI"],
        theory: "Layouts wrap pages. They preserve state, remain interactive, and do not re-render on navigation. `layout.tsx` is required in the root.",
        syntax: "export default function Layout({ children }) { ... }",
        examples: [
            {
                code: "// app/layout.tsx\nexport default function RootLayout({ children }) {\n  return <html><body>{children}</body></html>\n}",
                output: "Wraps every page",
                explanation: "Essential for global providers and CSS."
            }
        ],
        common_mistakes: [{ "mistake": "Forgetting {children}", "correction": "Layouts must render children prop." }],
        interview_questions: [{ "question": "Does Layout unmount on page change?", "answer": "No, it persists.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: ["Navbars, Footers, Sidebars"],
        exam_notes: [],
        summary: "Layouts provide consistent UI structure.",
        order: 8
    },
    {
        title: "Link & Navigation",
        slug: "link-and-navigation",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "8 mins",
        prerequisites: ["File-Based Routing"],
        learning_objectives: ["Link component", "useRouter hook", "Prefetching"],
        theory: "Use `<Link>` for client-side navigation (SPA feel). It prefetches routes in the background.",
        syntax: "import Link from 'next/link'",
        examples: [
            {
                code: "<Link href='/about'>About Us</Link>",
                output: "<a> tag with JS navigation",
                explanation: "Navigates without full page reload."
            }
        ],
        common_mistakes: [{ "mistake": "Using <a> tag", "correction": "Causes full browser refresh (slow). Use <Link>." }],
        interview_questions: [{ "question": "Why use Link over a tag?", "answer": "Client-side routing and prefetching.", "difficulty": "Easy" }],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Fast navigation with hydration.",
        order: 9
    },
    {
        title: "Static Assets",
        slug: "static-assets",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "5 mins",
        prerequisites: ["Project Structure"],
        learning_objectives: ["Public folder", "Referencing assets"],
        theory: "Files in `public/` can be accessed like `http://site/image.png`. Do not put code here.",
        syntax: "<img src='/logo.png' />",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Serving images, fonts, robots.txt.",
        order: 10
    },
    {
        title: "CSS in Next.js",
        slug: "css-in-nextjs",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "5 mins",
        prerequisites: ["Basics"],
        learning_objectives: ["Global CSS", "Tailwind Support", "CSS Modules"],
        theory: "Next.js supports Global CSS, CSS Modules, Tailwind CSS, and CSS-in-JS libraries.",
        syntax: "import './globals.css';",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Flexible styling options.",
        order: 11
    },
    {
        title: "Global Styles",
        slug: "global-styles",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "5 mins",
        prerequisites: ["CSS in Next.js"],
        learning_objectives: ["Importing global CSS"],
        theory: "Global styles typically go in `app/globals.css` and are imported in the Root Layout.",
        syntax: "@tailwind base; ...",
        examples: [],
        common_mistakes: [{ "mistake": "Importing global CSS in a component", "correction": "Global CSS should be imported in the root layout (mostly)." }],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Site-wide styles.",
        order: 12
    },
    {
        title: "CSS Modules",
        slug: "css-modules",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "8 mins",
        prerequisites: ["CSS in Next.js"],
        learning_objectives: ["Scoped Styles", ".module.css naming"],
        theory: "CSS Modules locally scope CSS by automatically creating unique class names. Prevents clashes.",
        syntax: "import styles from './Button.module.css'",
        examples: [
            {
                code: "<div className={styles.container}>...</div>",
                output: "<div class='Button_container__abc12'>...</div>",
                explanation: "Unique class name generated."
            }
        ],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: ["Component libraries"],
        exam_notes: [],
        summary: "Safe component-level styling.",
        order: 13
    },
    {
        title: "Metadata & Head Management",
        slug: "metadata",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "8 mins",
        prerequisites: ["App Router"],
        learning_objectives: ["Metadata API", "SEO tags", "Dynamic Metadata"],
        theory: "Export a `metadata` object or `generateMetadata` function from a `page.tsx` or `layout.tsx` to set <head> tags.",
        syntax: "export const metadata = { title: 'My App' }",
        examples: [
            {
                code: "export const metadata: Metadata = {\n  title: 'Home',\n  description: 'Welcome to my site'\n}",
                output: "<title>Home</title> in standard HTML",
                explanation: "Replaces standard HTML head tags."
            }
        ],
        common_mistakes: [{ "mistake": "Using strict <head> tag", "correction": "Use Metadata API in App router." }],
        interview_questions: [{ "question": "How to set dynamic page title?", "answer": "Use generateMetadata function.", "difficulty": "Medium" }],
        practice_problems: [],
        real_world_use_cases: ["SEO for blog posts"],
        exam_notes: [],
        summary: "Crucial for SEO.",
        order: 14
    },
    {
        title: "Images with next/image",
        slug: "next-image",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "10 mins",
        prerequisites: ["Static Assets"],
        learning_objectives: ["Image component", "Optimization Features", "CLS prevention"],
        theory: "The `<Image>` component extends the HTML `<img>` element. It provides automatic resizing, lazy loading, and format serving (WebP/AVIF).",
        syntax: "import Image from 'next/image'",
        examples: [
            {
                code: "<Image src='/hero.jpg' width={500} height={300} alt='Hero' />",
                output: "Optimized image tag",
                explanation: "Prevents layout shift and reduces file size."
            }
        ],
        common_mistakes: [{ "mistake": "Forgetting width/height", "correction": "Required to prevent Layout Shift unless using 'fill'." }],
        interview_questions: [{ "question": "Why use next/image?", "answer": "Auto optimization, lazy loading, CLS prevention.", "difficulty": "Easy" }],
        practice_problems: [],
        real_world_use_cases: ["Landing pages with large assets"],
        exam_notes: [],
        summary: "Performance optimized images by default.",
        order: 15
    },
    {
        title: "Fonts with next/font",
        slug: "next-font",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "6 mins",
        prerequisites: ["CSS"],
        learning_objectives: ["Google Fonts", "Self-hosted fonts", "Zero Layout Shift"],
        theory: "`next/font` automatically optimizes fonts (including Google Fonts) and removes external network requests for improved privacy and performance. No layout shift.",
        syntax: "import { Inter } from 'next/font/google'",
        examples: [
            {
                code: "const inter = Inter({ subsets: ['latin'] })\n<body className={inter.className}>",
                output: "Font loaded efficiently",
                explanation: "Class name applies the font family."
            }
        ],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Typography without performance penalty.",
        order: 16
    },
    {
        title: "Environment Variables",
        slug: "environment-variables",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "6 mins",
        prerequisites: ["Config"],
        learning_objectives: [".env.local", "Server vs Client vars", "Next Public prefix"],
        theory: "Store secrets in `.env.local`. Variables are server-only by default. Prefix with `NEXT_PUBLIC_` to expose to browser.",
        syntax: "process.env.API_KEY",
        examples: [
            {
                code: "NEXT_PUBLIC_ANALYTICS_ID=123\nDB_PASS=secret",
                output: "Client sees ANALYTICS_ID. Server sees both.",
                explanation: "Security mechanism to protect secrets."
            }
        ],
        common_mistakes: [{ "mistake": "Leaking secrets to client", "correction": "Never prefix secrets with NEXT_PUBLIC_." }],
        interview_questions: [{ "question": "How to expose env var to browser?", "answer": "Prefix with NEXT_PUBLIC_", "difficulty": "Easy" }],
        practice_problems: [],
        real_world_use_cases: ["API Keys, Database URLs"],
        exam_notes: [],
        summary: "Secure configuration management.",
        order: 17
    },
    {
        title: "Development vs Production Mode",
        slug: "dev-vs-prod",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "5 mins",
        prerequisites: ["npm scripts"],
        learning_objectives: ["Fast Refresh", "Optimization differences"],
        theory: "Dev mode (`next dev`) has Fast Refresh and better debugging. Prod mode (`next start`) is optimized, minified, and performant.",
        syntax: "npm run dev vs npm start",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Always build before deploying.",
        order: 18
    },
    {
        title: "Build & Start Commands",
        slug: "build-commands",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "5 mins",
        prerequisites: ["Dev vs Prod"],
        learning_objectives: ["next build", "next start", "artifacts"],
        theory: "`next build` generates an optimized production build in `.next` folder. `next start` runs a Node server serving that build.",
        syntax: "npm run build",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Preparing for launch.",
        order: 19
    },
    {
        title: "Beginner Next.js Mini Project",
        slug: "beginner-project",
        subject: "Next.js",
        category: "Full Stack Framework",
        level: "Beginner",
        estimated_read_time: "20 mins",
        prerequisites: ["All Beginner Topics"],
        learning_objectives: ["Build a simple blog", "Apply routing, layout, styling"],
        theory: "A step-by-step guide to building a multi-page website with a navigation bar, homepage, and about page, using the concepts learned.",
        syntax: "Hands-on implementation",
        examples: [],
        common_mistakes: [],
        interview_questions: [],
        practice_problems: [],
        real_world_use_cases: [],
        exam_notes: [],
        summary: "Putting it all together.",
        order: 20
    }
];

topics.forEach(topic => {
    const filePath = path.join(outputDir, `${topic.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(topic, null, 2));
    console.log(`Generated ${topic.slug}`);
});
