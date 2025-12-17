
import json
import os

output_dir = "d:/similar_gfg/content/angular"
os.makedirs(output_dir, exist_ok=True)

topics = [
    {
        "title": "Advanced RxJS Patterns",
        "slug": "advanced-rxjs-patterns",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "30 mins",
        "prerequisites": ["RxJS Operators"],
        "learning_objectives": ["Higher-order Mapping", "Subject vs BehaviorSubject vs ReplaySubject", "Custom Operators"],
        "theory": "Mastering RxJS involves understanding higher order mapping (streams of streams), multicasting, and creating reusable custom operators. Patterns like 'switchMap for search', 'concatMap for queueing', and 'mergeMap for parallel' are essential.",
        "syntax": "shareReplay(1)",
        "examples": [
            {
                "code": "const data$ = this.http.get('/data').pipe(\n  shareReplay(1)\n);",
                "output": "Caches the latest value",
                "explanation": "shareReplay makes the observable multicast and replays the last value to late subscribers, avoiding redundant HTTP calls."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Nested Subscriptions",
                "correction": "This is an anti-pattern. Use higher-order mapping operators (switchMap, mergeMap) to flatten the stream.",
                "example": "obs1.subscribe(val => obs2.subscribe(...)) // NO"
            }
        ],
        "interview_questions": [
            {
                "question": "When to use switchMap vs exhaustMap?",
                "answer": "switchMap cancels prior request (good for read/search). exhaustMap ignores new requests until current finishes (good for login button).",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Live Caching",
                "description": "Fetching config once and sharing it across the app without re-fetching.",
                "code": "shareReplay(1)"
            }
        ],
        "exam_notes": ["Multicasting shares execution.", "Unsubscribe via takeUntil or async pipe is mandatory."],
        "summary": "Advanced RxJS allows you to handle complex asynchronous flows elegantly."
    },
    {
        "title": "Advanced State Management (NgRx)",
        "slug": "ngrx-state-management",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "40 mins",
        "prerequisites": ["State Management Basics"],
        "learning_objectives": ["Redux Pattern", "Store, Actions, Reducers", "Selectors, Effects"],
        "theory": "NgRx is the Angular implementation of the Redux pattern. It provides a single source of truth (Store) using explicit Actions to trigger state changes via pure functions called Reducers. Effects handle side effects (API calls).",
        "syntax": "store.dispatch(increment());\nthis.count$ = store.select(selectCount);",
        "examples": [
            {
                "code": "export const counterReducer = createReducer(\n  initialState,\n  on(increment, (state) => state + 1),\n  on(reset, (state) => 0)\n);",
                "output": "Pure state transformation",
                "explanation": "State is immutable. The reducer takes old state + action and returns new state."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Overusing NgRx",
                "correction": "Not every app needs Redux. It adds boilerplate. Use it for complex, shared state.",
                "example": "Using NgRx for a simple toggle button."
            }
        ],
        "interview_questions": [
            {
                "question": "What is the role of Effects in NgRx?",
                "answer": "Effects listen for actions, perform side effects (like HTTP calls) and dispatch new actions (success/fail) back to the store, keeping components pure.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "E-commerce Cart",
                "description": "Cart state must be consistent across header, checkout, and inventory pages.",
                "code": "store.select(selectCartTotal)"
            }
        ],
        "exam_notes": ["Unidirectional data flow.", "Actions -> Reducer -> Store -> Selector -> View."],
        "summary": "NgRx provides predictability and debugging power (Time Travel) for large enterprise apps."
    },
    {
        "title": "Angular Universal (SSR)",
        "slug": "angular-universal-ssr",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "25 mins",
        "prerequisites": ["Angular CLI"],
        "learning_objectives": ["Server-Side Rendering benefits", "Hydration", "Avoid browser-only globals"],
        "theory": "Angular Universal renders your application on the server (Node.js) before sending it to the client. This improves SEO (search engines see content immediately) and First Contentful Paint (FCP).",
        "syntax": "ng add @nguniversal/express-engine",
        "examples": [],
        "common_mistakes": [
             {
                "mistake": "Accessing window/document on server",
                "correction": "Node.js doesn't have DOM. Use isPlatformBrowser check or dependency injection for tokens.",
                "example": "window.localStorage // Crashes on server"
            }
        ],
        "interview_questions": [
            {
                "question": "Why use SSR?",
                "answer": "Better SEO, social media previews, and faster perceived load time on slow devices.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Public Blog / E-commerce",
                "description": "Google needs to index product descriptions. SSR serves fully rendered HTML.",
                "code": "npm run engage"
            }
        ],
        "exam_notes": ["BrowserModule.withServerTransition().", "Node.js server required."],
        "summary": "SSR bridges the gap between SPA interactivity and traditional website SEO."
    },
    {
        "title": "Progressive Web Apps (PWA)",
        "slug": "angular-pwa",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Service Workers (Concept)"],
        "learning_objectives": ["Add PWA capabilities", "Service Worker configuration", "Offline support"],
        "theory": "PWA features make web apps behave like native apps: installable, offline support, and push notifications. Angular provides the `@angular/pwa` package to automate this setup.",
        "syntax": "ng add @angular/pwa",
        "examples": [
            {
                "code": "\"dataGroups\": [{\n  \"name\": \"api-performance\",\n  \"urls\": [\"/api/**\"],\n  \"cacheConfig\": { \"strategy\": \"performance\" }\n}]",
                "output": "ngsw-config.json snippet",
                "explanation": "Configures caching API responses for offline use."
            }
        ],
        "common_mistakes": [],
        "interview_questions": [],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["ngsw-config.json controls caching.", "Requires HTTPS."],
        "summary": "PWAs extend the reach of Angular apps to unreliable network conditions."
    },
    {
        "title": "Micro Frontends with Angular",
        "slug": "angular-micro-frontends",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "30 mins",
        "prerequisites": ["Lazy Loading Modules", "Webpack basics"],
        "learning_objectives": ["Module Federation", "Shell vs Micro-app", "Sharing dependencies"],
        "theory": "Micro Frontends split a monolithic frontend into smaller, independent applications that run together. Angular 12+ supports Webpack Module Federation, making it easier to load remote Angular modules into a shell app at runtime.",
        "syntax": "new ModuleFederationPlugin({...})",
        "examples": [],
        "common_mistakes": [
             {
                "mistake": "Version Mismatch",
                "correction": "All micro-frontends should ideally share the same Angular version/dependencies to avoid loading multiple frameworks.",
                "example": "Loading Angular 12 inside Angular 15 shell."
            }
        ],
        "interview_questions": [
            {
                "question": "What is Module Federation?",
                "answer": "A Webpack 5 feature allowing a JavaScript application to dynamically load code from another application at runtime.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Multiple Teams",
                "description": "Team Checkout deploys independently from Team Search. The Shell app stitches them together.",
                "code": "remotes: { checkout: '...' }"
            }
        ],
        "exam_notes": ["Independence.", "Runtime integration.", "Complexity tradeoff."],
        "summary": "Micro Frontends scale development across multiple teams but introduce significant architectural complexity."
    },
    {
        "title": "Angular Build & Deployment",
        "slug": "angular-build-deployment",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Angular CLI"],
        "learning_objectives": ["AOT vs JIT", "Tree Shaking", "Environments", "Dockerizing"],
        "theory": "Building for production optimizes the app. AOT (Ahead-of-Time) compilation compiles templates during build. Tree Shaking removes unused code. Environments allow distinct configs for Dev, Staging, and Prod.",
        "syntax": "ng build --configuration production",
        "examples": [
             {
                "code": "// environment.prod.ts\nexport const environment = {\n  production: true,\n  apiUrl: 'https://api.prod.com'\n};",
                "output": "Production config",
                "explanation": "Angular replaces environment.ts with environment.prod.ts during production build."
            }
        ],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "Difference between AOT and JIT?",
                "answer": "JIT (Just-in-Time) compiles in the browser (slower start). AOT compiles at build time (faster start, smaller bundle, earlier error detection).",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["dist/ folder contains artifacts.", "Main bundle, Polyfills, Styles."],
        "summary": "Proper build configuration ensures the app is small, fast, and secure for end users."
    },
    {
        "title": "Angular Performance Tuning",
        "slug": "angular-performance-tuning",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "30 mins",
        "prerequisites": ["Performance Optimization Basics"],
        "learning_objectives": ["Bundle Analysis", "Web Workers", "Server Push", "FCP/LCP"],
        "theory": "Deep tuning involves analyzing bundle content (webpack-bundle-analyzer), offloading CPU tasks to Web Workers, and optimizing Core Web Vitals. Running Change Detection outside the Angular Zone for high-frequency events is also a technique.",
        "syntax": "ng run app:analyze",
        "examples": [],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "How to debug large bundle size?",
                "answer": "Use 'webpack-bundle-analyzer' map to visualize module sizes and identify heavy dependencies.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Data Visualization",
                "description": "Running heavy math calculations in a Web Worker to avoid freezing the UI thread.",
                "code": "new Worker(...)"
            }
        ],
        "exam_notes": ["Zone pollution.", "Lighthouse score.", "Budget bundles in angular.json."],
        "summary": "Performance is a feature. Continuous monitoring and tuning prevents regression."
    },
    {
        "title": "Angular Best Practices",
        "slug": "angular-best-practices",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "20 mins",
        "prerequisites": ["All Intermediate Topics"],
        "learning_objectives": ["Style Guide (LIFT)", "Smart vs Dumb Components", "Folder Structure"],
        "theory": "Following the official Style Guide involves principles like LIFT (Locate, Identify, Flat, Try DRY). Separating Container components (Smart) from Presentational components (Dumb) leads to reusability.",
        "syntax": "N/A",
        "examples": [
             {
                "code": "// Presentational Component\n@Input() items: Item[];\n@Output() select = new EventEmitter();\n// Logicless, just displays data.",
                "output": "Reusable UI",
                "explanation": "Does not depend on services/store directly."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Logic in Templates",
                "correction": "Keep templates simple. No complex function calls or assignments.",
                "example": "<div *ngIf=\"user.roles.includes('admin') && ...\"> // Move to getter"
            }
        ],
        "interview_questions": [],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Single Responsibility Principle.", "Suffix files (component, service)."],
        "summary": "Adhering to community best practices ensures code maintainability and team scalability."
    },
    {
        "title": "Angular Interview Preparation",
        "slug": "angular-interview-prep",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "45 mins",
        "prerequisites": ["Everything"],
        "learning_objectives": ["Core Concepts Review", "Coding Challenges", "System Design"],
        "theory": "A compilation of the most frequent Angular interview topics: Lifecycle hooks, DI, RxJS mapping operators, Change Detection strategies, and architectural patterns.",
        "syntax": "N/A",
        "examples": [],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "Explain the Digest Cycle vs Change Detection?",
                "answer": "Digest Cycle (AngularJS) was a dirty-check loop. Change Detection (Angular) is a unidirectional tree traversal, much more efficient.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Review RxJS heavily.", "Know the 'why' behind features."],
        "summary": "Preparation involves not just knowing the API, but understanding the architectural decisions behind the framework."
    },
    {
        "title": "Angular Real-World Case Studies",
        "slug": "angular-case-studies",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Advanced",
        "estimated_read_time": "30 mins",
        "prerequisites": ["Everything"],
        "learning_objectives": ["Architecture Analysis", "Migration Stories", "Large Scale patterns"],
        "theory": "Examining real-world apps (like Gmail, Google Cloud Console, or banking apps) reveals how Angular scales. Topics include Monorepos (Nx), strict typing at scale, and hybrid upgrades.",
        "syntax": "N/A",
        "examples": [],
        "common_mistakes": [],
        "interview_questions": [],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Google Firebase Console",
                "description": "Uses Angular for complex, real-time data data management and form handling.",
                "code": "N/A"
            }
        ],
        "exam_notes": ["Scalability.", "Maintainability."],
        "summary": "Case studies provide the context needed to become an architect, not just a coder."
    }
]

for topic in topics:
    file_path = os.path.join(output_dir, f"{topic['slug']}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(topic, f, indent=2, ensure_ascii=False)

print("Batch 5 generated successfully.")
