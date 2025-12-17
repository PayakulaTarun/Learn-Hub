
import json
import os

output_dir = "d:/similar_gfg/content/angular"
os.makedirs(output_dir, exist_ok=True)

topics = [
    {
        "title": "HTTP Client & API Calls",
        "slug": "angular-http-client",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Observables & RxJS Basics", "Services"],
        "learning_objectives": ["HttpClientModule", "GET, POST, PUT, DELETE", "Interceptors basics"],
        "theory": "Most front-end apps communicate with backend services over HTTP. Angular provides a simplified client HTTP API known as HttpClient, which rests on the XMLHTTPRequest interface exposed by browsers.",
        "syntax": "this.http.get<User[]>('/api/users');",
        "examples": [
            {
                "code": "constructor(private http: HttpClient) { }\n\ngetUsers() {\n  return this.http.get<User[]>('https://api.example.com/users');\n}",
                "output": "Returns an Observable<User[]>",
                "explanation": "HttpClient methods return Observables, not Promises."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Forgetting to subscribe",
                "correction": "Observables are lazy. The HTTP request is not sent until you call .subscribe().",
                "example": "this.service.getUsers(); // Nothing happens"
            }
        ],
        "interview_questions": [
            {
                "question": "Does HttpClient return a Promise or Observable?",
                "answer": "Observable.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Authentication",
                "description": "Sending login credentials via POST and receiving a token.",
                "code": "http.post('/login', credentials)"
            }
        ],
        "exam_notes": ["Requires HttpClientModule.", "Returns generic typed Observables."],
        "summary": "HttpClient enables communication with remote servers using the Observable pattern."
    },
    {
        "title": "Observables & RxJS Basics",
        "slug": "angular-observables-rxjs",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "25 mins",
        "prerequisites": ["Introduction to Angular"],
        "learning_objectives": ["Understand Stream/Observable pattern", "Observer, Subscriber, Subscription", "Sync vs Async data"],
        "theory": "RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables. Angular uses RxJS heavily (Router, Forms, HTTP). An Observable is a stream of events or data over time.",
        "syntax": "const myObservable = of(1, 2, 3);\nmyObservable.subscribe(val => console.log(val));",
        "examples": [
            {
                "code": "const locations = new Observable((observer) => {\n  observer.next('New York');\n  observer.next('London');\n  observer.complete();\n});\n\nlocations.subscribe(data => console.log(data));",
                "output": "New York\nLondon",
                "explanation": "The observable emits two string values and then completes."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Memory Leaks",
                "correction": "Always unsubscribe from long-lived observables manually or using the async pipe.",
                "example": "Leaving a subscription open in a destroyed component."
            }
        ],
        "interview_questions": [
            {
                "question": "Observable vs Promise?",
                "answer": "Promise: Single value, always async, not cancellable. Observable: Multiple values (stream), can be sync or async, cancellable, supports operators.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Core part of Angular.", "Subscription needed to execute.", "Unsubscribe to prevent leaks."],
        "summary": "RxJS Observables provide a powerful way to manage async data flows in Angular."
    },
    {
        "title": "RxJS Operators",
        "slug": "angular-rxjs-operators",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "25 mins",
        "prerequisites": ["Observables & RxJS Basics"],
        "learning_objectives": ["map, filter, tap", "switchMap, mergeMap", "catchError"],
        "theory": "Operators are functions that build on the Observables foundation to enable sophisticated manipulation of collections. They allow you to transform, filter, and combine streams.",
        "syntax": "source$.pipe(\n  map(x => x * 2),\n  filter(x => x > 10)\n).subscribe();",
        "examples": [
            {
                "code": "import { map } from 'rxjs/operators';\n\nof(1, 2, 3).pipe(\n  map(x => x * 10)\n).subscribe(console.log);",
                "output": "10, 20, 30",
                "explanation": "The map operator transforms each emitted value."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Confusing switchMap and mergeMap",
                "correction": "switchMap cancels previous inner subscription (good for search). mergeMap runs all in parallel (good for writes).",
                "example": "Using mergeMap for search can cause race conditions."
            }
        ],
        "interview_questions": [
            {
                "question": "What is the purpose of the pipe() method?",
                "answer": "It is used to chain multiple operators together to transform the resulting observable.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Debounced Search",
                "description": "Waiting for user to stop typing before sending API request.",
                "code": "term$.pipe(debounceTime(300), distinctUntilChanged(), switchMap(searchFn))"
            }
        ],
        "exam_notes": ["Operators are pure functions.", "Import from 'rxjs/operators'."],
        "summary": "Operators are what make RxJS truly powerful, allowing for declarative complex async logic."
    },
    {
        "title": "State Management Basics",
        "slug": "angular-state-management",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Services", "Observables & RxJS Basics"],
        "learning_objectives": ["Local State vs Global State", "Services with Subjects", "BehaviorSubject"],
        "theory": "State management is about how data is shared and synchronized across the application. While libraries like NgRx exist, simple state management can be achieved using Services with RxJS BehaviorSubjects.",
        "syntax": "private state$ = new BehaviorSubject(initialState);",
        "examples": [
            {
                "code": "@Injectable()\nexport class StateService {\n  private count = new BehaviorSubject<number>(0);\n  count$ = this.count.asObservable();\n\n  increment() { this.count.next(this.count.value + 1); }\n}",
                "output": "A simple store pattern",
                "explanation": "Components subscribe to count$ to get updates and call increment() to modify state."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Exposing the Subject directly",
                "correction": "Expose only the Observable. Keep the Subject private so only the service can modify it.",
                "example": "public count = new BehaviorSubject(0); // Risky, anyone can .next()"
            }
        ],
        "interview_questions": [
            {
                "question": "What is BehaviorSubject?",
                "answer": "A variant of Subject that requires an initial value and emits its current value to new subscribers whenever they subscribe.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Subject = Multicast.", "BehaviorSubject = Holds current value."],
        "summary": "For many apps, a Service + BehaviorSubject is sufficient for state management before needing Redux/NgRx."
    },
    {
        "title": "Angular Guards",
        "slug": "angular-guards",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Angular Routing Basics"],
        "learning_objectives": ["canActivate", "canDeactivate", "canLoad", "Resolve"],
        "theory": "Guards are interfaces that tell the router whether it should allow navigation to or from a route. They are used for authentication, permission checking, or preventing unsaved changes loss.",
        "syntax": "canActivate: [AuthGuard]",
        "examples": [
             {
                "code": "@Injectable()\nexport class AuthGuard implements CanActivate {\n  constructor(private auth: AuthService, private router: Router) {}\n\n  canActivate(): boolean {\n    if (this.auth.isLoggedIn()) return true;\n    this.router.navigate(['/login']);\n    return false;\n  }\n}",
                "output": "Protects routes",
                "explanation": "If logic returns false, navigation stops."
            }
        ],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "What is usage of CanDeactivate?",
                "answer": "It is often used to warn the user before leaving a page with unsaved changes in a form.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Admin Dashboard",
                "description": "Preventing non-admin users from determining the admin route.",
                "code": "canActivate: [RoleGuard]"
            }
        ],
        "exam_notes": ["canActivate: Enter route?", "canDeactivate: Leave route?", "Resolve: Fetch data before route."],
        "summary": "Guards provide security and better UX by handling navigation logic centrally."
    },
    {
        "title": "Lazy Loading Modules",
        "slug": "angular-lazy-loading",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Modules", "Angular Routing Basics"],
        "learning_objectives": ["Understand performance benefits", "loadChildren syntax", "Module Preloading"],
        "theory": "By default, NgModules are eagerly loaded. Lazy loading means a module is loaded only when the user navigates to its route. This significantly reduces the initial bundle size and load time.",
        "syntax": "{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }",
        "examples": [
             {
                "code": "const routes: Routes = [\n  { \n    path: 'dashboard',\n    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)\n  }\n];",
                "output": "Code splitting in action",
                "explanation": "Webpack splits this module into a separate chunk (e.g., chunk.js) loaded on demand."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Importing lazy module in AppModule",
                "correction": "Do NOT import a lazy loaded module in the root AppModule. That defeats the purpose.",
                "example": "imports: [LazyModule] // WRONG"
            }
        ],
        "interview_questions": [
            {
                "question": "Why use lazy loading?",
                "answer": "To decrease initial load time by splitting code into smaller bundles loaded only when needed.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Use loadChildren.", "Do not import statically."],
        "summary": "Lazy loading is a critical performance optimization for large Angular applications."
    },
    {
        "title": "Error Handling",
        "slug": "angular-error-handling",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "15 mins",
        "prerequisites": ["HTTP Client & API Calls"],
        "learning_objectives": ["HttpErrorResponse", "Global ErrorHandler", "catchError operator"],
        "theory": "Handling errors gracefully is vital. Angular provides a global ErrorHandler class that can be intercepted. For HTTP, RxJS `catchError` is used to handle stream failures without crashing the app.",
        "syntax": "catchError(error => { return of([]); })",
        "examples": [
            {
                "code": "this.http.get('/api').pipe(\n  catchError(this.handleError)\n).subscribe();\n\nhandleError(error: HttpErrorResponse) {\n  console.log(error.message);\n  return throwError(() => new Error('Something bad happened'));\n}",
                "output": "Graceful failure",
                "explanation": "Intercepts the error notification and can log it or display a user-friendly message."
            }
        ],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "How do you implement global error logging?",
                "answer": "By creating a class implementing ErrorHandler and providing it in the root module.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Toast Notifications",
                "description": "Showing a red toast message whenever an API call fails 500.",
                "code": "Interceptor -> ToastService.showError()"
            }
        ],
        "exam_notes": ["RxJS catchError for streams.", "ErrorHandler for global exceptions."],
        "summary": "Proper error handling prevents white screens of death and improves user trust."
    },
    {
        "title": "Angular Animations",
        "slug": "angular-animations",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Directives (Built-in & Custom)"],
        "learning_objectives": ["BrowserAnimationsModule", "trigger, state, style, transition, animate", "Enter and Leave animations"],
        "theory": "Angular's animation system allows you to build complex animations using a DSL based on CSS Web Animations. You define definitions in the component metadata.",
        "syntax": "animations: [\n  trigger('openClose', [\n    state('open', style({ opacity: 1 })),\n    transition('closed => open', [animate('1s')])\n  ])\n]",
        "examples": [
            {
                "code": "<div [@openClose]=\"isOpen ? 'open' : 'closed'\">...</div>",
                "output": "Div fades in/out",
                "explanation": "Binds the animation trigger in HTML to the state variable in TS."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Missing BrowserAnimationsModule",
                "correction": "Animations won't work without importing this module.",
                "example": "Nothing happens on screen."
            }
        ],
        "interview_questions": [],
        "practice_problems": [],
        "real_world_use_cases": [
             {
                "scenario": "Route Transitions",
                "description": "Sliding pages in and out when navigating routes.",
                "code": "query(':enter', ...)"
            }
        ],
        "exam_notes": ["DSL: trigger->state->transition->animate.", "Built on Web Animations API."],
        "summary": "Animations make applications feel more polished and responsive."
    },
    {
        "title": "Component Communication",
        "slug": "angular-component-communication",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Components in Angular", "Services"],
        "learning_objectives": ["Parent to Child (@Input)", "Child to Parent (@Output)", "Sibling via Service"],
        "theory": "Components need to share data. Parent-Child uses Input/Output bindings. Unrelated components usually communicate via a shared Service (subject/observable).",
        "syntax": "@Input() data: string;\n@Output() notify = new EventEmitter();",
        "examples": [
            {
                "code": "// Child\n@Input() heroName: string;\n@Output() saved = new EventEmitter();\n\nonSave() { this.saved.emit(); }\n\n// Parent HTML\n<app-child [heroName]=\"name\" (saved)=\"onSaved()\"></app-child>",
                "output": "Two-way communication flow",
                "explanation": "Parent passes name down. Child emits event up."
            }
        ],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "How do siblings communicate?",
                "answer": "Typically using a shared Service with an RxJS Subject, or by passing data up to a common parent (state lift) and then down.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["@Input() passes down.", "@Output() events up.", "Services for cross-tree."],
        "summary": "Understanding data flow patterns is crucial for avoiding spaghetti code in large apps."
    },
    {
        "title": "ViewChild & ContentChild",
        "slug": "angular-viewchild-contentchild",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Component Communication"],
        "learning_objectives": ["Access Child Component Logic", "Access DOM elements", "Content Projection"],
        "theory": "@ViewChild allows a parent to access a child component or DOM element inside its own template. @ContentChild allows access to projected content (ng-content).",
        "syntax": "@ViewChild(ChildComponent) child: ChildComponent;",
        "examples": [
            {
                "code": "// Parent\n@ViewChild('myInput') input: ElementRef;\n\nngAfterViewInit() {\n  this.input.nativeElement.focus();\n}\n\n// HTML\n<input #myInput>",
                "output": "Focuses input on load",
                "explanation": "Direct DOM access wrapper using ElementRef."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Accessing ViewChild in ngOnInit",
                "correction": "ViewChild is only available in ngAfterViewInit.",
                "example": "result is undefined in ngOnInit."
            }
        ],
        "interview_questions": [
            {
                "question": "Difference between ViewChild and ContentChild?",
                "answer": "ViewChild selects elements from the component's own template. ContentChild selects elements projected into the component (via ng-content) from the parent.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Modal Component",
                "description": "Parent calls `modal.open()` directly on the child instance.",
                "code": "this.modal.open()"
            }
        ],
        "exam_notes": ["Available in AfterViewInit/AfterContentInit.", "ElementRef gives DOM access (use carefully)."],
        "summary": "These decorators provide imperative access to the component hierarchy and DOM."
    }
]

for topic in topics:
    file_path = os.path.join(output_dir, f"{topic['slug']}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(topic, f, indent=2, ensure_ascii=False)

print("Batch 3 generated successfully.")
