
export interface RoadmapTopic {
    id: string;
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    slug?: string; // The content slug (e.g. 'html-introduction')
    practiceId?: string;
    projectId?: string;
    estimatedHours: number;
}

export interface RoadmapStage {
    title: string;
    description: string;
    domain: string; // e.g. 'frontend', 'theory', 'backend'
    topics: RoadmapTopic[];
}

export interface CareerRoadmap {
    id: string; // e.g. 'full-stack'
    title: string;
    role: string;
    description: string;
    skills: string[];
    tools: string[];
    stages: RoadmapStage[];
}

export const roadmaps: CareerRoadmap[] = [
    {
        id: 'frontend-dev',
        title: 'Frontend Developer',
        role: 'Frontend Engineer',
        description: 'Build beautiful, responsive, and high-performance user interfaces for the modern web.',
        skills: ['UI Architecture', 'Responsive Design', 'State Management', 'Web Performance', 'Testing'],
        tools: ['React', 'TypeScript', 'Tailwind CSS', 'Testing Library', 'Vite', 'Next.js'],
        stages: [
            {
                title: 'Phase 1: Semantic Foundations',
                description: 'HTML5, CSS3, and the foundational layout engines.',
                domain: 'frontend',
                topics: [
                    { id: 'html-mastery', title: 'HTML5 & Semantic SEO', difficulty: 'Beginner', slug: 'html-semantic-elements', estimatedHours: 6 },
                    { id: 'css-essentials', title: 'CSS Positioning & Flexbox', difficulty: 'Beginner', slug: 'css-flexbox', estimatedHours: 8 },
                    { id: 'css-grid', title: 'Advanced CSS Grid Layouts', difficulty: 'Beginner', slug: 'css-grid', estimatedHours: 10 },
                    { id: 'responsive-ui', title: 'Mobile-First & Fluid Design', difficulty: 'Beginner', slug: 'css-responsive-design', estimatedHours: 12 },
                ]
            },
            {
                title: 'Phase 2: JS Engine & Logic',
                description: 'Mastering the language that drives the client side.',
                domain: 'frontend',
                topics: [
                    { id: 'js-essentials', title: 'JavaScript Execution Context', difficulty: 'Beginner', slug: 'js-execution-context', estimatedHours: 15 },
                    { id: 'js-async', title: 'Asynchronous JS & APIs', difficulty: 'Intermediate', slug: 'js-async-await', estimatedHours: 20 },
                    { id: 'js-dom', title: 'DOM Manipulation & Events', difficulty: 'Beginner', slug: 'js-dom-manipulation', estimatedHours: 10 },
                ]
            },
            {
                title: 'Phase 3: React Ecosystem',
                description: 'Component-driven development and modern state management.',
                domain: 'frontend',
                topics: [
                    { id: 'react-intro', title: 'React Fundamentals & JSX', difficulty: 'Beginner', slug: 'react-introduction', estimatedHours: 20 },
                    { id: 'react-hooks', title: 'Hooks & Functional Components', difficulty: 'Intermediate', slug: 'react-hooks-intro', estimatedHours: 25 },
                    { id: 'state-mgmt', title: 'Redux & Context API', difficulty: 'Intermediate', slug: 'react-context-deep-dive', estimatedHours: 30 },
                    { id: 'react-perf', title: 'React Performance Tuning', difficulty: 'Advanced', slug: 'react-advanced-performance', estimatedHours: 20 },
                ]
            }
        ]
    },
    {
        id: 'backend-dev',
        title: 'Backend Developer',
        role: 'Backend Engineer',
        description: 'Design the logic, databases, and APIs that power large-scale distributed systems.',
        skills: ['API Design', 'System Architecture', 'Database Management', 'Scalability', 'Security'],
        tools: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
        stages: [
            {
                title: 'Phase 1: Environment & Logic',
                description: 'Setting up the server-side runtime and language logic.',
                domain: 'backend',
                topics: [
                    { id: 'py-start', title: 'Python for Backend Logic', difficulty: 'Beginner', slug: 'python-introduction', estimatedHours: 12 },
                    { id: 'node-core', title: 'Node.js Internals & NPM', difficulty: 'Beginner', slug: 'js-introduction', estimatedHours: 15 },
                    { id: 'http-protocols', title: 'HTTP, REST & JSON', difficulty: 'Beginner', slug: 'http-https', estimatedHours: 10 },
                ]
            },
            {
                title: 'Phase 2: Database Systems',
                description: 'Storing and retrieving data at scale.',
                domain: 'backend',
                topics: [
                    { id: 'sql-master', title: 'SQL & Relational Algebra', difficulty: 'Intermediate', slug: 'sql-intro', estimatedHours: 20 },
                    { id: 'nosql-pro', title: 'MongoDB & Document Stores', difficulty: 'Intermediate', slug: 'mongodb-introduction', estimatedHours: 15 },
                    { id: 'orm-concepts', title: 'ORM & Query Performance', difficulty: 'Intermediate', slug: 'mysql-query-optimization', estimatedHours: 20 },
                ]
            },
            {
                title: 'Phase 3: System Design',
                description: 'Architecting for reliability and high availability.',
                domain: 'backend',
                topics: [
                    { id: 'auth-sec', title: 'JWT, OAuth & Security', difficulty: 'Intermediate', slug: 'authentication-basics', estimatedHours: 25 },
                    { id: 'caching-redis', title: 'Distributed Caching (Redis)', difficulty: 'Advanced', slug: 'cache-memory', estimatedHours: 20 },
                    { id: 'system-dist', title: 'Distributed Systems & Messages', difficulty: 'Advanced', slug: 'cn-intro', estimatedHours: 35 },
                ]
            }
        ]
    },
    {
        id: 'mobile-dev',
        title: 'Mobile App Developer',
        role: 'Mobile Engineer',
        description: 'Build native and cross-platform mobile apps for millions of users.',
        skills: ['Native UI', 'Mobile Sync', 'Performance Profiling', 'Store Deployment'],
        tools: ['React Native', 'SwiftUI', 'Kotlin', 'Flutter', 'Firebase'],
        stages: [
            {
                title: 'Phase 1: Cross-Platform Foundations',
                description: 'Leveraging web skills for mobile.',
                domain: 'mobile',
                topics: [
                    { id: 'rn-basics', title: 'React Native CLI & Core Components', difficulty: 'Beginner', slug: 'react-introduction', estimatedHours: 25 },
                    { id: 'mobile-nav', title: 'React Navigation & User Flow', difficulty: 'Beginner', slug: 'react-introduction', estimatedHours: 15 },
                ]
            },
            {
                title: 'Phase 2: Native Capabilities',
                description: 'Accessing camera, GPS, and sensors.',
                domain: 'mobile',
                topics: [
                    { id: 'device-api', title: 'Native Modules & Bridge', difficulty: 'Intermediate', slug: 'js-web-apis', estimatedHours: 30 },
                    { id: 'push-notif', title: 'Push Notifications & Cloud Mess.', difficulty: 'Intermediate', slug: 'html-audio-video', estimatedHours: 20 },
                ]
            }
        ]
    },
    {
        id: 'full-stack-v2',
        title: 'Full Stack Engineer (Pro)',
        role: 'Senior Full Stack Developer',
        description: 'The complete path from UI design to production-scale system architecture.',
        skills: ['Full Cycle Development', 'Cloud Architecture', 'Security Best Practices', 'Post-launch Support'],
        tools: ['Next.js', 'Go', 'GCP', 'PostgreSQL', 'Sentry'],
        stages: [
            {
                title: 'Phase 1: Advanced Frontend',
                description: 'Micro-frontends and optimizations.',
                domain: 'frontend',
                topics: [
                    { id: 'perf-opt', title: 'Web Vitals & Performance Masterclass', difficulty: 'Advanced', slug: 'performance-optimization', estimatedHours: 20 },
                ]
            }
        ]
    },
    {
        id: 'game-developer',
        title: 'Game Developer',
        role: 'Unity/C# Developer',
        description: 'Create immersive 2D and 3D games for PC, Console, and Mobile.',
        skills: ['Game Physics', '3D Math', 'Scripting', 'Graphics Programming'],
        tools: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Blender'],
        stages: [
            {
                title: 'Phase 1: Game Math & Logic',
                description: 'Foundations of game physics.',
                domain: 'gaming',
                topics: [
                    { id: 'vector-math', title: 'Calculus & Vectors for Games', difficulty: 'Intermediate', slug: 'algorithms-intro', estimatedHours: 35 },
                ]
            }
        ]
    },
    {
        id: 'blockchain-dev',
        title: 'Blockchain Developer',
        role: 'Smart Contract Engineer',
        description: 'Build decentralized applications and secure smart contracts on Ethereum and other L1/L2 networks.',
        skills: ['Solidity', 'Web3.js', 'Smart Contract Auditing', 'DeFi Patterns'],
        tools: ['Solidity', 'Hardhat', 'Ethers.js', 'Foundry', 'Truffle'],
        stages: [
            {
                title: 'Phase 1: Web3 Foundations',
                description: 'Understanding decentralization.',
                domain: 'blockchain',
                topics: [
                    { id: 'eth-basics', title: 'Ethereum & Smart Contract Fundamentals', difficulty: 'Intermediate', slug: 'network-security-basics', estimatedHours: 25 },
                ]
            }
        ]
    },
    {
        id: 'data-analyst',
        title: 'Data Analyst',
        role: 'Business Intelligence Analyst',
        description: 'Translate complex datasets into actionable business insights through visualization and modeling.',
        skills: ['Data Visualization', 'SQL', 'Statistical Modeling', 'Reporting'],
        tools: ['Tableau', 'Power BI', 'SQL', 'Excel', 'Python'],
        stages: [
            {
                title: 'Phase 1: Visual Storytelling',
                description: 'Mastering visualization tools.',
                domain: 'data',
                topics: [
                    { id: 'tableau-pro', title: 'Advanced Tableau Visualization', difficulty: 'Intermediate', slug: 'data-visualization-basics', estimatedHours: 15 },
                ]
            }
        ]
    },
    {
        id: 'cloud-engineer',
        title: 'Cloud Engineer',
        role: 'Cloud Solutions Architect',
        description: 'Design and manage highly available, scalable, and secure cloud environments.',
        skills: ['Cloud Migration', 'Cost Optimization', 'Governance', 'Security'],
        tools: ['AWS', 'Azure', 'Google Cloud', 'Terraform', 'Vault'],
        stages: [
            {
                title: 'Phase 1: Cloud Architecture',
                description: 'Modern infrastructure patterns.',
                domain: 'cloud',
                topics: [
                    { id: 'aws-solutions', title: 'AWS Solutions Architecture', difficulty: 'Advanced', slug: 'cloud-networking', estimatedHours: 40 },
                ]
            }
        ]
    }
];
