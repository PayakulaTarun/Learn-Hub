
export interface RoadmapTopic {
    id: string;
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    slug?: string; // Link to tutorial
    practiceId?: string; // Link to practice tool
    projectId?: string; // Link to project
    dependencies?: string[];
    estimatedHours: number;
}

export interface RoadmapStage {
    title: string;
    description: string;
    topics: RoadmapTopic[];
}

export interface CareerRoadmap {
    id: string;
    title: string;
    role: string;
    description: string;
    skills: string[];
    tools: string[];
    stages: RoadmapStage[];
}

export const roadmaps: CareerRoadmap[] = [
    {
        id: 'fullstack-dev',
        title: 'Full Stack Web Developer',
        role: 'Full Stack Engineer',
        description: 'Master the entire web stack from frontend UI to backend logic and database management.',
        skills: ['UI/UX Design', 'API Design', 'Database Modeling', 'DevOps Basics'],
        tools: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
        stages: [
            {
                title: 'Phase 1: Foundations',
                description: 'The absolute essentials of the web.',
                topics: [
                    { id: 'html-basics', title: 'HTML5 Semantic Structure', difficulty: 'Beginner', slug: 'html-basics', estimatedHours: 4 },
                    { id: 'css-essentials', title: 'Modern CSS & Layouts', difficulty: 'Beginner', slug: 'css-intro', estimatedHours: 8 },
                    { id: 'js-fundamentals', title: 'JavaScript Essentials', difficulty: 'Beginner', slug: 'js-intro', estimatedHours: 12 },
                ]
            },
            {
                title: 'Phase 2: Data Structures & Algorithms',
                description: 'The logic behind efficient applications.',
                topics: [
                    { id: 'complexity', title: 'Time & Space Complexity', difficulty: 'Beginner', slug: 'time-complexity', estimatedHours: 6 },
                    { id: 'sorting-base', title: 'Basic Sorting Algorithms', difficulty: 'Beginner', slug: 'sorting-intro', practiceId: 'sorting-visualizer', estimatedHours: 10 },
                    { id: 'searching-base', title: 'Linear & Binary Search', difficulty: 'Beginner', slug: 'binary-search-algo', practiceId: 'searching-visualizer', estimatedHours: 8 },
                ]
            },
            {
                title: 'Phase 3: Backend & Systems',
                description: 'Building robust server-side logic.',
                topics: [
                    { id: 'backend-intro', title: 'Server-side Concepts', difficulty: 'Intermediate', slug: 'backend-basics', estimatedHours: 15 },
                    { id: 'sql-mastery', title: 'SQL & Database Design', difficulty: 'Intermediate', slug: 'sql-intro', estimatedHours: 20 },
                ]
            }
        ]
    },
    {
        id: 'system-architect',
        title: 'System Architect',
        role: 'System Designer',
        description: 'Design scalable, distributed, and highly available systems for millions of users.',
        skills: ['Load Balancing', 'Caching Strategies', 'Microservices', 'Scalability'],
        tools: ['Redis', 'Kafka', 'Kubernetes', 'AWS/Azure', 'Nginx'],
        stages: [
            {
                title: 'Phase 1: Advanced Algorithms',
                description: 'Complex problem solving foundations.',
                topics: [
                    { id: 'graph-theory', title: 'Graph Traversal (BFS/DFS)', difficulty: 'Intermediate', slug: 'graph-algos-intro', practiceId: 'graph-visualizer', estimatedHours: 12 },
                    { id: 'shortest-path', title: 'Shortest Path (Dijkstra)', difficulty: 'Advanced', slug: 'dijkstra-algo', estimatedHours: 10 },
                ]
            },
            {
                title: 'Phase 2: Architecture Patterns',
                description: 'Design patterns for scale.',
                topics: [
                    { id: 'system-design-intro', title: 'Architecture Fundamentals', difficulty: 'Advanced', slug: 'system-design-basics', estimatedHours: 30 },
                ]
            }
        ]
    }
];
