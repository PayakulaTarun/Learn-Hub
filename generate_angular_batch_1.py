
import json
import os

output_dir = "d:/similar_gfg/content/angular"
os.makedirs(output_dir, exist_ok=True)

topics = [
    {
        "title": "Introduction to Angular",
        "slug": "angular-introduction",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "10 mins",
        "prerequisites": ["HTML", "CSS", "JavaScript Basics"],
        "learning_objectives": ["Understand what Angular is", "Learn the history and versions of Angular", "Understand the difference between AngularJS and Angular", "Know the key features used in Angular"],
        "theory": "Angular is a platform and framework for building single-page client-application using HTML and TypeScript. Written by Google, it is unrelated to AngularJS (version 1.x). Angular provides a robust ecosystem including a CLI, testing tools, and a powerful router. It follows the component-based architecture.",
        "syntax": "// Basic Angular Component Structure\n@Component({\n  selector: 'app-root',\n  template: '<h1>Hello Angular</h1>'\n})\nexport class AppComponent {}",
        "examples": [
            {
                "code": "// A simple component example\nimport { Component } from '@angular/core';\n\n@Component({\n  selector: 'hello-world',\n  template: `<h2>Hello World!</h2>`\n})\nexport class HelloWorldComponent {}",
                "output": "<h2>Hello World!</h2> rendered in the DOM",
                "explanation": "This is the most basic building block of Angular. The @Component decorator marks the class as an Angular component and provides metadata like the selector and template."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Confusing AngularJS (v1) with Angular (v2+)",
                "correction": "AngularJS is JS-based. Angular is TS-based and architecture is completely different component-based.",
                "example": "// AngularJS uses $scope\n// Angular uses Classes and Decorators"
            }
        ],
        "interview_questions": [
            {
                "question": "What is the difference between Angular and AngularJS?",
                "answer": "AngularJS is the legacy, JS-based framework using controllers and $scope. Angular (v2+) is a complete rewrite using TypeScript and a component-based architecture.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [
            {
                "problem": "Research the latest version of Angular and its key distinct features compared to v2.",
                "difficulty": "Easy",
                "hint": "Check angular.io or update blogs.",
                "solution": "Angular releases new versions every 6 months. Features like Ivy, Standalone Components, and Signals distinguish newer versions."
            }
        ],
        "real_world_use_cases": [
            {
                 "scenario": "Enterprise Web Applications",
                 "description": "Angular is heavily used in banking and healthcare for large-scale apps due to its strict structure and TypeScript enforcement.",
                 "code": "// Pseudocode for strict typing\ninterface User { id: number; name: string; }"
            }
        ],
        "exam_notes": ["Angular is a platform, not just a library.", "It uses TypeScript.", "Component-based architecture."],
        "summary": "Angular is a powerful, opinionated framework ideal for enterprise-level SPAs, offering strong typing via TypeScript and a rich ecosystem."
    },
    {
        "title": "Angular Architecture Overview",
        "slug": "angular-architecture",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Introduction to Angular"],
        "learning_objectives": ["Understand Modules, Components, and Templates", "Learn about Metadata and Data Binding", "Understand Services and Dependency Injection"],
        "theory": "Angular architecture relies on fundamental building blocks: NgModules, Components, Templates, Metadata, Data Binding, Directives, Services, and Dependency Injection. An app is defined by a set of NgModules, ensuring modularity.",
        "syntax": "// No specific single syntax, but structural relationships.",
        "examples": [
            {
                "code": "@NgModule({\n  declarations: [AppComponent],\n  imports: [BrowserModule],\n  providers: [],\n  bootstrap: [AppComponent]\n})\nexport class AppModule { }",
                "output": "Bootstraping the basic module",
                "explanation": "The AppModule is the root module that Angular uses to bootstrap the application."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Putting all logic in Components",
                "correction": "Use Services for business logic to keep components lean.",
                "example": "// Wrong: Fetching data in Component constructor\n// Correct: Injecting a Service to fetch data"
            }
        ],
        "interview_questions": [
            {
                "question": "What are the main building blocks of Angular?",
                "answer": "Modules, Components, Templates, Metadata, Data Binding, Directives, Services, and Dependency Injection.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [
             {
                "problem": "Draw a diagram of how Components, Templates, and Services interact.",
                "difficulty": "Easy",
                "hint": "Components bind to Templates; Components use Services.",
                "solution": "N/A (Conceptual)"
            }
        ],
        "real_world_use_cases": [],
        "exam_notes": ["Modules organize code.", "Components control views.", "Services hold business logic."],
        "summary": "Angular applications are modular, component-based, and rely heavily on dependency injection for scalable architecture."
    },
    {
        "title": "Setting Up Angular Environment",
        "slug": "angular-environment-setup",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "10 mins",
        "prerequisites": ["Command Line Basics"],
        "learning_objectives": ["Install Node.js and NPM", "Install Angular CLI", "Create a new project"],
        "theory": "To develop Angular apps, you need Node.js and npm. The Angular CLI (Command Line Interface) is the primary tool to scaffold, build, and serve Angular applications.",
        "syntax": "npm install -g @angular/cli\nng new my-app\ncd my-app\nng serve",
        "examples": [
            {
                "code": "node -v\nnpm -v\nng version",
                "output": "v18.0.0\n8.0.0\nAngular CLI: 15.0.0",
                "explanation": "Verifying installations of Node, NPM, and Angular CLI."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Running ng commands without installing Node.js",
                "correction": "Node.js is a prerequisite.",
                "example": "Command not found: ng"
            }
        ],
         "interview_questions": [
            {
                "question": "What is the command to install Angular CLI globally?",
                "answer": "npm install -g @angular/cli",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [
             {
                "problem": "Install Angular CLI and create a 'hello-world' app.",
                "difficulty": "Easy",
                "hint": "Use 'ng new'.",
                "solution": "ng new hello-world"
            }
        ],
        "real_world_use_cases": [],
        "exam_notes": ["Node.js is required.", "CLI simplifies development."],
        "summary": "Setting up the environment involves installing Node.js and the Angular CLI, enabling rapid project scaffolding."
    },
    {
        "title": "Angular Project Structure",
        "slug": "angular-project-structure",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "12 mins",
        "prerequisites": ["Setting Up Angular Environment"],
        "learning_objectives": ["Understand root files like angular.json and package.json", "Explore the src folder structure", "Understand main.ts and index.html"],
        "theory": "An Angular workspace contains configuration files at the root and source files in `src`. Key files include `angular.json` (CLI config), `package.json` (dependencies), `src/main.ts` (entry point), and `src/app/` (app source).",
        "syntax": "src/\n  app/\n  assets/\n  environments/\n  index.html\n  main.ts\n  styles.css",
        "examples": [
            {
                "code": "// src/main.ts\nimport { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\nimport { AppModule } from './app/app.module';\n\nplatformBrowserDynamic().bootstrapModule(AppModule)\n  .catch(err => console.error(err));",
                "output": "Bootstraps the application",
                "explanation": "This is the entry point that tells Angular to launch the AppModule."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Editing files in node_modules",
                "correction": "Never edit node_modules directly. They are external libraries.",
                "example": "N/A"
            }
        ],
        "interview_questions": [
             {
                "question": "What is the purpose of angular.json?",
                "answer": "It contains workspace configuration for build, serve, test, and lint commands.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["main.ts is the entry point.", "index.html is the single page host."],
        "summary": "Understanding the project structure helps in locating code, configuration, and assets efficiently."
    },
    {
        "title": "TypeScript Basics for Angular",
        "slug": "typescript-basics-angular",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "20 mins",
        "prerequisites": ["JavaScript Basics"],
        "learning_objectives": ["Understand Static Typing", "Learn Classes and Interfaces", "Understand Decorators"],
        "theory": "Angular is built with TypeScript. TS adds static typing, classes, interfaces, and decorators to JS. Decorators (like @Component) are crucial in Angular for attaching metadata to classes.",
        "syntax": "let name: string = 'Angular';\n\ninterface User {\n  id: number;\n  name: string;\n}",
        "examples": [
            {
                "code": "class Greeter {\n  greeting: string;\n  constructor(message: string) {\n    this.greeting = message;\n  }\n  greet() {\n    return 'Hello, ' + this.greeting;\n  }\n}",
                "output": "Functions as a standard Class",
                "explanation": "Classes model business logic in Angular components and services."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Ignoring Types",
                "correction": "Using 'any' everywhere defeats the purpose of TS.",
                "example": "let data: any; // Avoid if possible"
            }
        ],
         "interview_questions": [
             {
                "question": "Why does Angular use TypeScript?",
                "answer": "For static typing, better tooling, refactoring capabilities, and compile-time error checking.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Angular requires TypeScript.", "Decorators are a key TS feature used heavily."],
        "summary": "TypeScript provides the safety and structure needed for large Angular applications."
    },
    {
        "title": "Angular CLI",
        "slug": "angular-cli",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Setting Up Angular Environment"],
        "learning_objectives": ["Use CLI to generate components and services", "Serve and Build applications", "Run tests via CLI"],
        "theory": "The Angular CLI automates development tasks. Common commands include `ng generate` (or `ng g`) for creating files, `ng serve` for running locally, and `ng build` for production compiling.",
        "syntax": "ng generate component my-component\nng g service my-service\nng build --prod",
        "examples": [
            {
                "code": "ng g c header",
                "output": "CREATE src/app/header/header.component.html\nCREATE src/app/header/header.component.spec.ts\nCREATE src/app/header/header.component.ts\nCREATE src/app/header/header.component.css\nUPDATE src/app/app.module.ts",
                "explanation": "Generates a 'header' component with all necessary files and registers it in the module."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Manually creating files instead of using CLI",
                "correction": "CLI ensures boilerplate is correct and files are registered.",
                "example": "Manual creation often misses app.module registration."
            }
        ],
        "interview_questions": [
             {
                "question": "What does 'ng g c' do?",
                "answer": "It is short for 'ng generate component'. It creates component files and updates the declared module.",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [
            {
                "problem": "Generate a service named 'user-data' using CLI.",
                "difficulty": "Easy",
                "hint": "ng g s ...",
                "solution": "ng generate service user-data"
            }
        ],
        "real_world_use_cases": [],
        "exam_notes": ["CLI is the standard for Angular dev.", "Know 'ng g', 'ng serve', 'ng build'."],
        "summary": "Mastering the CLI speeds up development and ensures adherence to style guides."
    },
    {
        "title": "Components in Angular",
        "slug": "angular-components",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "20 mins",
        "prerequisites": ["TypeScript Basics for Angular", "Angular CLI"],
        "learning_objectives": ["Understand the @Component decorator", "Learn Component Lifecycle", "Understand View Encapsulation"],
        "theory": "Components are the main building blocks. A component consists of a TypeScript class with a @Component decorator, an HTML template, and styles. They control a patch of screen called a view.",
        "syntax": "@Component({\n  selector: 'app-hero',\n  templateUrl: './hero.component.html',\n  styleUrls: ['./hero.component.css']\n})\nexport class HeroComponent {}",
        "examples": [
            {
                "code": "import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-user',\n  template: '<h1>User: {{name}}</h1>'\n})\nexport class UserComponent {\n  name = 'John Doe';\n}",
                "output": "<h1>User: John Doe</h1>",
                "explanation": "The class property 'name' is bound to the template using interpolation."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Forgetting to register component in Module (if not standalone)",
                "correction": "CLI handles this, but manual creation requires adding to Declarations array.",
                "example": "Component 'UserComponent' is not part of any NgModule."
            }
        ],
        "interview_questions": [
             {
                "question": "What are the three mandatory parts of a component setup?",
                "answer": "A class, a template (or templateUrl), and the @Component decorator.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Dashboard Widgets",
                "description": "Each widget (Graph, Stats, User Profile) is an independent component.",
                "code": "<app-graph></app-graph>\n<app-stats></app-stats>"
            }
        ],
        "exam_notes": ["Selector defines how to use it in HTML.", "Template defines the view."],
        "summary": "Components encapsulate logic and view, making the app modular and reusable."
    },
    {
        "title": "Templates & Interpolation",
        "slug": "angular-templates-interpolation",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Components in Angular"],
        "learning_objectives": ["Display dynamic data", "Use Template Syntax", "Perform simple logic in templates"],
        "theory": "Templates are HTML with special Angular syntax. Interpolation {{ }} allows you to embed expressions. It evaluates the expression and converts the result to a string.",
        "syntax": "<p>Hello {{ name }}</p>\n<p>Sum: {{ 1 + 1 }}</p>",
        "examples": [
            {
                 "code": "export class AppComponent {\n  title = 'My App';\n  getWelcomeMsg() { return 'Welcome!'; }\n}\n// HTML\n<h1>{{ title }}</h1>\n<p>{{ getWelcomeMsg() }}</p>",
                 "output": "<h1>My App</h1><p>Welcome!</p>",
                 "explanation": "Interpolation can bind properties and method return values."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Using side-effects in interpolation",
                "correction": "Interpolation expressions should be side-effect free and fast.",
                "example": "{{ deleteUser() }} // BAD"
            }
        ],
        "interview_questions": [
             {
                "question": "Can you use JavaScript 'window' object in templates?",
                "answer": "No, templates only have access to the component instance members.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["{{ }} is one-way from class to view.", "Expressions must avoid side effects."],
        "summary": "Interpolation is the primary way to output dynamic text in Angular applications."
    },
    {
        "title": "Data Binding (One-way & Two-way)",
        "slug": "angular-data-binding",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Templates & Interpolation"],
        "learning_objectives": ["Property Binding []", "Event Binding ()", "Two-way Binding [()]"],
        "theory": "Data binding connects the component logic to the view. \n1. Property Binding [property]=\"value\" (One-way: Source -> View)\n2. Event Binding (event)=\"handler()\" (One-way: View -> Source)\n3. Two-way Binding [(ngModel)]=\"value\" (Both directions)",
        "syntax": "<img [src]=\"imageUrl\">\n<button (click)=\"save()\">Save</button>\n<input [(ngModel)]=\"name\">",
        "examples": [
             {
                "code": "<button (click)=\"onClick()\">Click Me</button>\n<input [value]=\"userName\">",
                "output": "Button triggers onClick method. Input field shows userName property.",
                "explanation": "() handles events, [] handles properties."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Forgetting FormsModule for Two-Way Binding",
                "correction": "[(ngModel)] requires importing FormsModule in your module.",
                "example": "Can't bind to 'ngModel' since it isn't a known property of 'input'."
            }
        ],
        "interview_questions": [
             {
                "question": "What is the syntax for two-way binding?",
                "answer": "Banana-in-a-box syntax: [()]",
                "difficulty": "Easy"
            }
        ],
        "practice_problems": [
            {
                "problem": "Create an input that updates a <p> tag in real-time.",
                "difficulty": "Easy",
                "hint": "Use [(ngModel)].",
                "solution": "<input [(ngModel)]='text'> <p>{{text}}</p>"
            }
        ],
        "real_world_use_cases": [
            {
                "scenario": "Forms",
                "description": "Two-way binding is essential for form inputs where user data must sync with the model immediately.",
                 "code": "<input [(ngModel)]=\"user.email\">"
            }
        ],
        "exam_notes": ["[] = Input", "() = Output", "[()] = Two-way"],
        "summary": "Mastering bindings `[]`, `()`, and `[()]` is crucial for creating interactive Angular UIs."
    },
    {
        "title": "Directives (Built-in & Custom)",
        "slug": "angular-directives",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Beginner",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Data Binding (One-way & Two-way)"],
        "learning_objectives": ["Structural Directives (*ngIf, *ngFor)", "Attribute Directives (ngClass, ngStyle)", "Create a custom directive"],
        "theory": "Directives allow you to attach behavior to DOM elements. Structural directives (start with *) change the DOM layout (add/remove elements). Attribute directives change the appearance or behavior of an element.",
        "syntax": "<div *ngIf=\"isLoggedIn\">Welcome</div>\n<li *ngFor=\"let item of items\">{{item}}</li>\n<div [ngClass]=\"{'active': isActive}\">Tab</div>",
        "examples": [
            {
                "code": "<ul>\n  <li *ngFor=\"let user of users\">\n    {{ user.name }}\n  </li>\n</ul>",
                "output": "A list of user names",
                "explanation": "*ngFor iterates over the users array and duplicates the li element for each."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Multiple structural directives on one element",
                "correction": "You cannot have *ngIf and *ngFor on the same element. Use an <ng-container> wrapper.",
                "example": "<div *ngIf='show' *ngFor='let i of items'>Error</div>"
            }
        ],
        "interview_questions": [
             {
                "question": "What is the difference between structural and attribute directives?",
                "answer": "Structural directives change DOM layout (add/remove elements) and are prefixed with *. Attribute directives change appearance/behavior.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Conditional Display",
                "description": "Showing admin panels only if the user has a specific role.",
                "code": "<div *ngIf=\"user.role === 'admin'\">Admin Panel</div>"
            }
        ],
         "exam_notes": ["* indicates structural directive.", "ngIf, ngFor, ngSwitch are key."],
        "summary": "Directives are powerful tools to manipulate the DOM dynamically based on application state."
    }
]

for topic in topics:
    file_path = os.path.join(output_dir, f"{topic['slug']}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(topic, f, indent=2, ensure_ascii=False)

print("Batch 1 generated successfully.")
