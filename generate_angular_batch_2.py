
import json
import os

output_dir = "d:/similar_gfg/content/angular"
os.makedirs(output_dir, exist_ok=True)

topics = [
    {
        "title": "Pipes",
        "slug": "angular-pipes",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Templates & Interpolation"],
        "learning_objectives": ["Understand Built-in Pipes", "Chaining Pipes", "Creating Custom Pipes"],
        "theory": "Pipes are functions that transform input data to a desired output for display in templates. They do not change the underlying data, only how it is viewed. Angular comes with built-in pipes like DatePipe, UpperCasePipe, LowerCasePipe, and CurrencyPipe.",
        "syntax": "{{ value | pipeName:args }}",
        "examples": [
            {
                "code": "<p>Birthday: {{ birthday | date:'medium' }}</p>\n<p>Price: {{ price | currency:'USD' }}</p>\n<p>Name: {{ 'john' | uppercase }}</p>",
                "output": "Birthday: Jan 1, 2023, 12:00:00 AM\nPrice: $100.00\nName: JOHN",
                "explanation": "The pipe operator (|) takes the left-side data and passes it through the specified pipe function."
            },
            {
                "code": "import { Pipe, PipeTransform } from '@angular/core';\n\n@Pipe({name: 'exponentialStrength'})\nexport class ExponentialStrengthPipe implements PipeTransform {\n  transform(value: number, exponent: number): number {\n    return Math.pow(value, exponent);\n  }\n}",
                "output": "{{ 2 | exponentialStrength:10 }} -> 1024",
                "explanation": "Custom pipe implementing PipeTransform interface."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Thinking pipes change the data in the component",
                "correction": "Pipes only transform the data for the view (template). The component property remains unchanged.",
                "example": "{{ name | uppercase }} does not make this.name uppercase in TS."
            }
        ],
        "interview_questions": [
            {
                "question": "What is the difference between pure and impure pipes?",
                "answer": "Pure pipes only run when the input reference changes. Impure pipes run on every change detection cycle.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [
            {
                "problem": "Create a pipe named 'reverse' that reverses a string.",
                "difficulty": "Easy",
                "hint": "Implement PipeTransform.",
                "solution": "transform(value: string): string { return value.split('').reverse().join(''); }"
            }
        ],
        "real_world_use_cases": [
            {
                "scenario": "Filtering Lists",
                "description": "Although discouraged for performance, pipes were historically used to filter lists in templates (now better handled in component logic).",
                "code": "<li *ngFor=\"let item of items | filter:searchText\">"
            }
        ],
        "exam_notes": ["Known built-in pipes: date, json, uppercase, lowercase, decimal, currency, percent.", "Syntax is {{ val | pipe }}."],
        "summary": "Pipes provide a clean, declarative way to format data right in the HTML template."
    },
    {
        "title": "Services",
        "slug": "angular-services",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Components in Angular"],
        "learning_objectives": ["Understand the purpose of Services", "Create a Service", "Share data between components"],
        "theory": "Services are classes with a specific purpose. They are responsible for business logic, data fetching, and state management. They help keep components lean and focused only on the view.",
        "syntax": "@Injectable({\n  providedIn: 'root',\n})\nexport class DataService { }",
        "examples": [
            {
                "code": "import { Injectable } from '@angular/core';\n\n@Injectable({\n  providedIn: 'root',\n})\nexport class HeroService {\n  getHeroes() { return ['Superman', 'Batman']; }\n}",
                "output": "A reusable service class",
                "explanation": "The @Injectable decorator marks it as a service that can be injected."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Instantiating services with 'new Service()'",
                "correction": "Always use Dependency Injection. Never use 'new'.",
                "example": "const service = new DataService(); // WRONG"
            }
        ],
        "interview_questions": [
            {
                "question": "Why do we use services?",
                "answer": "Code reuse, separation of concerns (business logic vs view logic), and sharing state between components.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "HTTP API Wrapper",
                "description": "A service that handles all HTTP calls to a backend API.",
                "code": "authService.login(user)"
            }
        ],
        "exam_notes": ["Marked with @Injectable.", "Singletons by default if providedIn: root."],
        "summary": "Services are the backbone of Angular application logic and data management."
    },
    {
        "title": "Dependency Injection",
        "slug": "angular-dependency-injection",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Services"],
        "learning_objectives": ["Understand DI pattern", "Inject a service into a component", "Hierarchical Injectors"],
        "theory": "Dependency Injection (DI) is a design pattern where dependencies (services) are provided to a class (component) rather than the class creating them itself. Angular has a powerful built-in DI system.",
        "syntax": "constructor(private heroService: HeroService) { }",
        "examples": [
            {
                "code": "export class HeroListComponent {\n  heroes: string[];\n\n  constructor(private heroService: HeroService) {\n    this.heroes = this.heroService.getHeroes();\n  }\n}",
                "output": "Component receives the service instance automatically",
                "explanation": "Angular looks up the provider for HeroService and injects the singleton instance into the constructor."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Circular Dependency",
                "correction": "Service A injects B, and B injects A. Resolve by refactoring or using forwardRef.",
                "example": "Circular dependency detected: ServiceA -> ServiceB -> ServiceA"
            }
        ],
        "interview_questions": [
            {
                "question": "What is singleton service in Angular?",
                "answer": "A service provided in the root injector is created once and shared across the entire app.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["DI decoupling.", "Constructor injection is standard.", "providers array in Module/Component configures injectors."],
        "summary": "Angular's DI system makes applications modular, efficient to test, and easy to maintain."
    },
    {
        "title": "Modules",
        "slug": "angular-modules",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Angular Architecture Overview"],
        "learning_objectives": ["Understand NgModule", "Root Module vs Feature Modules", "declarations, imports, exports, providers"],
        "theory": "NgModules are containers for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities. Every Angular app has at least a root module (AppModule).",
        "syntax": "@NgModule({\n  declarations: [AppComponent],\n  imports: [BrowserModule],\n  providers: [],\n  bootstrap: [AppComponent]\n})\nexport class AppModule { }",
        "examples": [
            {
                "code": "@NgModule({\n  imports: [CommonModule],\n  declarations: [FeatureComponent],\n  exports: [FeatureComponent]\n})\nexport class FeatureModule { }",
                "output": "Defines a feature module",
                "explanation": "Feature modules encapsulate specific functionality and can be imported into the main app."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Declaring a component in two modules",
                "correction": "A component can belong to only ONE module. Use a SharedModule to share it.",
                "example": "Type ComponentX is part of the declarations of 2 modules: A and B."
            }
        ],
        "interview_questions": [
            {
                "question": "What is a SharedModule?",
                "answer": "A module used to group common components, directives, and pipes that are used widely across the app, which is then imported by other modules.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Large Scale Apps",
                "description": "Splitting an app into UserModule, AdminModule, SharedModule, and CoreModule.",
                "code": "imports: [UserModule, AdminModule]"
            }
        ],
        "exam_notes": ["declarations: Components/Pipes/Directives.", "imports: Other Modules.", "exports: What is visible to others.", "bootstrap: Root component only."],
        "summary": "Modules provide the compilation context for components and manage the assembly of the application."
    },
    {
        "title": "Angular Routing Basics",
        "slug": "angular-routing-basics",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Modules"],
        "learning_objectives": ["SetUp Routing Module", "Define Routes", "router-outlet", "routerLink"],
        "theory": "The Angular Router enables navigation from one view to another as users perform application tasks. It interprets a browser URL to navigate to a specific component.",
        "syntax": "const routes: Routes = [\n  { path: 'home', component: HomeComponent },\n  { path: 'users', component: UserListComponent }\n];",
        "examples": [
            {
                "code": "// app-routing.module.ts\n@NgModule({\n  imports: [RouterModule.forRoot(routes)],\n  exports: [RouterModule]\n})\nexport class AppRoutingModule { }\n\n// app.component.html\n<nav>\n  <a routerLink=\"/home\">Home</a>\n</nav>\n<router-outlet></router-outlet>",
                "output": "Navigation system working",
                "explanation": "router-outlet is a placeholder where the matched component is rendered."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Using href instead of routerLink",
                "correction": "href triggers a full page reload. routerLink uses internal routing.",
                "example": "<a href='/home'>Reloads Page</a> vs <a routerLink='/home'>SPA Nav</a>"
            }
        ],
        "interview_questions": [
            {
                "question": "What is router-outlet?",
                "answer": "It is a directive that acts as a placeholder where Angular dynamically loads the component for the active route.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [
            {
                "problem": "Configure a wildcard route '**' for 404 pages.",
                "difficulty": "Easy",
                "hint": "Add path: '**' at the end of routes array.",
                "solution": "{ path: '**', component: PageNotFoundComponent }"
            }
        ],
        "real_world_use_cases": [],
        "exam_notes": ["RouterModule.forRoot() in root, forChild() in features.", "<router-outlet> is mandatory."],
        "summary": "Routing transforms an Angular app from a static component into a navigable multi-page application (SPA)."
    },
    {
        "title": "Router Parameters",
        "slug": "angular-router-parameters",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Angular Routing Basics"],
        "learning_objectives": ["Define Route Parameters", "ActivatedRoute service", "Read parameters"],
        "theory": "Routes often need to pass data, like a specific user ID for a profile page. This is done using route parameters defined with a colon.",
        "syntax": "{ path: 'user/:id', component: UserDetailComponent }",
        "examples": [
            {
                "code": "constructor(private route: ActivatedRoute) {\n  this.route.params.subscribe(params => {\n    this.id = params['id'];\n  });\n}",
                "output": "Captures ID from URL /user/123",
                "explanation": "ActivatedRoute provides access to the url, params, and fragments of the current route."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Using snapshots for dynamic navigation",
                "correction": "Snapshots only capture data once. If navigating from user/1 to user/2, snapshot won't update. Use Observable subscription.",
                "example": "this.id = this.route.snapshot.paramMap.get('id'); // May fail on reuse"
            }
        ],
        "interview_questions": [
            {
                "question": "Difference between snapshot and observable params?",
                "answer": "Snapshot gets value at initialization only. Observable subscription updates whenever the parameter changes while remaining on the same component.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Product Details Page",
                "description": "Clicking a product in a list navigates to /products/45, where 45 is the parameter used to fetch details.",
                "code": "path: 'product/:id'"
            }
        ],
        "exam_notes": ["Defined as :paramName.", "Accessed via ActivatedRoute."],
        "summary": "Route parameters are essential for dynamic data-driven navigation pages."
    },
    {
        "title": "Forms Introduction",
        "slug": "angular-forms-intro",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "10 mins",
        "prerequisites": ["Data Binding (One-way & Two-way)"],
        "learning_objectives": ["Understand Template-driven vs Reactive Forms", "FormsModule vs ReactiveFormsModule"],
        "theory": "Angular provides two approaches to handling user input: Template-driven forms (simple, logic in template) and Reactive forms (robust, logic in class). Both belong to @angular/forms.",
        "syntax": "import { FormsModule } from '@angular/forms';\nimport { ReactiveFormsModule } from '@angular/forms';",
        "examples": [],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "What is the main difference between Template-driven and Reactive forms?",
                "answer": "Template-driven forms are asynchronous in nature (creation) and logic resides in HTML. Reactive forms are synchronous, more scalable, and logic resides in the component class.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Template-driven = easy/simple.", "Reactive = complex/scalable."],
        "summary": "Choosing the right form strategy is key. Most enterprise apps prefer Reactive forms for their scalability and testability."
    },
    {
        "title": "Template-driven Forms",
        "slug": "angular-template-driven-forms",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Forms Introduction"],
        "learning_objectives": ["Use ngModel", "Form Validation in HTML", "ngForm"],
        "theory": "Template-driven forms rely on directives in the template to create and manipulate the underlying object model. They are suitable for simple forms.",
        "syntax": "<form #f=\"ngForm\" (ngSubmit)=\"onSubmit(f)\">\n  <input name=\"first\" ngModel required>\n</form>",
        "examples": [
            {
                "code": "<form #loginForm=\"ngForm\" (ngSubmit)=\"login(loginForm.value)\">\n  <input name=\"email\" ngModel required email>\n  <button [disabled]=\"!loginForm.valid\">Submit</button>\n</form>",
                "output": "A validated login form",
                "explanation": "#loginForm exported as ngForm allows access to form status (valid/invalid) and values."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Missing 'name' attribute",
                "correction": "When using ngModel in a form tag, the name attribute is mandatory.",
                "example": "Error: If ngModel is used within a form tag, either the name attribute must be set or the form control must be defined as 'standalone'."
            }
        ],
        "interview_questions": [
            {
                "question": "What is ngModelGroup?",
                "answer": "It allows grouping of form controls within a form to create a nested object structure in the value output.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Simple Search Bar",
                "description": "A single input search bar doesn't need the complexity of Reactive Forms.",
                "code": "<input [(ngModel)]=\"search\">"
            }
        ],
        "exam_notes": ["Requires FormsModule.", "Validation is done via HTML attributes (required, minlength)."],
        "summary": "Template-driven forms offer a quick way to setup forms using familiar 2-way binding concepts."
    },
    {
        "title": "Reactive Forms",
        "slug": "angular-reactive-forms",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "25 mins",
        "prerequisites": ["Forms Introduction"],
        "learning_objectives": ["FormControl, FormGroup, FormBuilder", "Sync between Model and View", "Custom Validators"],
        "theory": "Reactive forms provide a model-driven approach to handling form inputs whose values change over time. You create a tree of Angular form control objects in the component class and bind them to the template.",
        "syntax": "this.profileForm = new FormGroup({\n  firstName: new FormControl(''),\n  lastName: new FormControl('')\n});",
        "examples": [
            {
                "code": "constructor(private fb: FormBuilder) { \n  this.loginForm = this.fb.group({\n    email: ['', [Validators.required, Validators.email]],\n    password: ['']\n  });\n}\n\n// HTML\n<form [formGroup]=\"loginForm\">",
                "output": "Robust form with validation logic in TS",
                "explanation": "FormBuilder simplifies the syntax for creating FormGroups and Arrays."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Forgetting ReactiveFormsModule",
                "correction": "Import ReactiveFormsModule in the NgModule.",
                "example": "Can't bind to 'formGroup' since it isn't a known property of 'form'."
            }
        ],
        "interview_questions": [
            {
                "question": "What are benefits of Reactive Forms?",
                "answer": "Immutability, predictability, synchronous access to data models, easier unit testing, and observable streams.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [
            {
                "problem": "Create a reactive form with nested FormGroups (Address: street, city).",
                "difficulty": "Medium",
                "hint": "Use this.fb.group inside another group.",
                "solution": "address: this.fb.group({ street: [''], city: [''] })"
            }
        ],
        "real_world_use_cases": [
            {
                "scenario": "Dynamic Forms",
                "description": "Adding new items to a list (FormArray) dynamically, like 'Add another phone number'.",
                "code": "formArray.push(new FormControl())"
            }
        ],
        "exam_notes": ["FormControl = single input.", "FormGroup = collection.", "Sync model."],
        "summary": "Reactive Forms are the industry standard for complex data entry in Angular."
    },
    {
        "title": "Angular Lifecycle Hooks",
        "slug": "angular-lifecycle-hooks",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Components in Angular"],
        "learning_objectives": ["ngOnChanges, ngOnInit, ngOnDestroy", "ngAfterViewInit", "Order of execution"],
        "theory": "A component has a lifecycle managed by Angular. Angular creates it, renders it, creates and renders its children, checks it when data bound properties change, and destroys it before removing it from the DOM. Hooks allow you to tap into these moments.",
        "syntax": "ngOnInit() {\n  // logic\n}",
        "examples": [
            {
                "code": "export class UserComponent implements OnInit, OnDestroy {\n  ngOnInit() {\n    console.log('Component Initialized');\n  }\n  ngOnDestroy() {\n    console.log('Component Destroyed');\n  }\n}",
                "output": "Logs during creation and removal",
                "explanation": "ngOnInit is the most common place to fetch data."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Fetching data in constructor",
                "correction": "The constructor is for simple initialization (like DI). Heavy logic should go in ngOnInit.",
                "example": "constructor() { this.loadData(); } // Avoid"
            }
        ],
        "interview_questions": [
            {
                "question": "What is the difference between constructor and ngOnInit?",
                "answer": "Constructor is a TS feature for class instantiation. ngOnInit is an Angular lifecycle method called after Angular has finished setting up the component's data-bound input properties.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Cleanup",
                "description": "Unsubscribing from Observables in ngOnDestroy to prevent memory leaks.",
                "code": "ngOnDestroy() { this.sub.unsubscribe(); }"
            }
        ],
        "exam_notes": ["Order: OnChanges -> OnInit -> DoCheck -> AfterContent -> AfterView -> OnDestroy.", "ngOnChanges is called before ngOnInit."],
        "summary": "Lifecycle hooks provide precise control over how components behave throughout their existence."
    }
]

for topic in topics:
    file_path = os.path.join(output_dir, f"{topic['slug']}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(topic, f, indent=2, ensure_ascii=False)

print("Batch 2 generated successfully.")
