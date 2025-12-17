
import json
import os

output_dir = "d:/similar_gfg/content/angular"
os.makedirs(output_dir, exist_ok=True)

topics = [
    {
        "title": "Change Detection",
        "slug": "angular-change-detection",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "25 mins",
        "prerequisites": ["Angular Lifecycle Hooks", "Zone.js basics (implied)"],
        "learning_objectives": ["Understand Zone.js", "Default Strategy", "OnPush Strategy"],
        "theory": "Change Detection (CD) is the mechanism Angular uses to synchronize the model and the view. Angular uses Zone.js to detect async operations (clicks, timers, HTTP). When one finishes, Angular checks bindings.",
        "syntax": "changeDetection: ChangeDetectionStrategy.OnPush",
        "examples": [
            {
                "code": "@Component({\n  selector: 'app-child',\n  template: '{{data.name}}',\n  changeDetection: ChangeDetectionStrategy.OnPush\n})\nexport class ChildComponent {\n  @Input() data: any;\n}",
                "output": "Optimized updates",
                "explanation": "With OnPush, Angular only checks this component if the @Input() reference changes, ignoring internal mutations."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Mutating data with OnPush",
                "correction": "OnPush works with immutability. If you do `data.name = 'new'`, the reference hasn't changed, so View won't update.",
                "example": "items.push(newItem) // Won't trigger OnPush update. Use items = [...items, newItem]"
            }
        ],
        "interview_questions": [
            {
                "question": "What is Zone.js?",
                "answer": "A library that patches standard browser APIs (setTimeout, XHR, events) to notify Angular when an async task is done so it can run Change Detection.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "High Performance Grid",
                "description": "A table with 1000 rows. Using OnPush ensures only rows receiving new data updates receive CD checks.",
                "code": "changeDetection: OnPush"
            }
        ],
        "exam_notes": ["Default checks everything (tree).", "OnPush checks only input changes/events.", "markForCheck() manually triggers."],
        "summary": "Mastering Change Detection strategies is key to preventing lag in complex Angular apps."
    },
    {
        "title": "Performance Optimization Basics",
        "slug": "angular-performance-optimization",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Change Detection", "Lazy Loading Modules"],
        "learning_objectives": ["TrackBy in *ngFor", "Production Build", "Pure Pipes"],
        "theory": "Angular is fast by default, but common patterns can slow it down. Key optimizations include using `trackBy` for lists to minimize DOM manipulation, ensuring production builds (AOT), and avoiding complex logic in getters.",
        "syntax": "<li *ngFor=\"let item of items; trackBy: trackById\">",
        "examples": [
            {
                "code": "trackById(index, item) {\n  return item.id;\n}\n\n// HTML\n<div *ngFor=\"let user of users; trackBy: trackById\">",
                "output": "Efficient list updates",
                "explanation": "If the list items change, Angular uses the ID to identify which DOM elements to keep, update, or remove, rather than rebuilding the whole list."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Calling functions in template interpolation",
                "correction": "Functions in {{ func() }} run on EVERY change detection cycle. Use pipes or pre-calculated properties.",
                "example": "{{ calculateData() }} // High Performance Cost"
            }
        ],
        "interview_questions": [
            {
                "question": "Why use trackBy?",
                "answer": "It improves performance of ngFor by helping Angular identify unique items, reducing DOM re-creation operations.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["AOT vs JIT.", "Tree shaking.", "Lazy Loading.", "TrackBy."],
        "summary": "Small changes like TrackBy and OnPush can lead to massive rendering improvements."
    },
    {
        "title": "Angular Styling & Theming",
        "slug": "angular-styling-theming",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Components in Angular"],
        "learning_objectives": [":host", ":host-context", "View Encapsulation", "Global Styles"],
        "theory": "Angular components encapsulate styles by default (Emulated). Special selectors like `:host` allow styling the component shell itself. Global styles (styles.css) affect everything.",
        "syntax": ":host {\n  display: block;\n  border: 1px solid red;\n}\n::ng-deep .child { ... }",
        "examples": [
            {
                "code": "@Component({\n  selector: 'app-card',\n  styles: [':host { display: block; padding: 10px; }']\n})",
                "output": "Styles applied to <app-card> tag",
                "explanation": "The :host pseudo-class selector targets elements in the component's own template."
            }
        ],
        "common_mistakes": [
            {
                "mistake": "Overusing ::ng-deep",
                "correction": "ng-deep is deprecated but still used. It breaks encapsulation. Use view encapsulation modes or global styles instead.",
                "example": "::ng-deep .mat-button { color: red; } // Leaks globally sometimes"
            }
        ],
        "interview_questions": [
            {
                "question": "What is ViewEncapsulation.None?",
                "answer": "It removes style isolation. Styles defined in this component are added to the document head and affect the global application.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Emulated (default) matches ShadowDOM behavior.", ":host selects self."],
        "summary": "Angular's style system allows for modular CSS while providing escape hatches for global themes."
    },
    {
        "title": "Internationalization (i18n)",
        "slug": "angular-i18n",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Pipes"],
        "learning_objectives": ["i18n attribute", "Extracting translation strings", "Locale pipes"],
        "theory": "Angular has efficient built-in support for multiple languages. You mark text with `i18n`, extract it to an XML file (XLIFF), translate it, and build separate versions of the app for each locale.",
        "syntax": "<h1 i18n>Hello World</h1>",
        "examples": [
             {
                "code": "<p i18n=\"@@homeWelcome\">Welcome to our app!</p>",
                "output": "Translatable string",
                "explanation": "The @@id allows you to keep the same ID even if text changes."
            }
        ],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "How does Angular i18n work at build time?",
                "answer": "It generates separate bundles for each language (Merge Translation), meaning zero runtime performance cost for translation lookup.",
                "difficulty": "Advanced"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
            {
                "scenario": "Global Ecommerce",
                "description": "Serving en-US, fr-FR, and es-ES versions of the same store.",
                "code": "baseHref changes per build"
            }
        ],
        "exam_notes": ["i18n attribute is removed at build time.", "Date/Currency pipes auto-format based on LOCALE_ID."],
        "summary": "Angular's i18n approach prioritizes performance by baking translations in at compile time."
    },
    {
        "title": "Accessibility in Angular",
        "slug": "angular-accessibility",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Directives (Built-in & Custom)"],
        "learning_objectives": ["ARIA attributes binding", "Focus management", "Router announcements"],
        "theory": "Accessibility (a11y) ensures apps are usable by everyone. Angular bindings work seamlessly with ARIA attributes. The CDK A11y package provides helpers for focus trapping and live announcers.",
        "syntax": "<button [attr.aria-label]=\"label\">Action</button>",
        "examples": [
            {
                "code": "<div role=\"alert\" [attr.aria-hidden]=\"!hasError\">\n  {{ errorMessage }}\n</div>",
                "output": "Dynamic ARIA attributes",
                "explanation": "Use [attr.attributeName] to bind to HTML attributes that aren't native properties."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Using [aria-label] instead of [attr.aria-label]",
                "correction": "ARIA attributes are attributes, not properties. You must use the `attr.` prefix.",
                "example": "<div [aria-label]=\"txt\"> // Error"
            }
        ],
        "interview_questions": [],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Binding syntax: [attr.x].", "Router needs to announce page changes (LiveAnnouncer)."],
        "summary": "Building accessible apps is a legal requirement in many places and good ethics everywhere."
    },
    {
        "title": "Angular Testing Basics",
        "slug": "angular-testing-basics",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["Angular CLI"],
        "learning_objectives": ["Jasmine & Karma", "spec.ts files", "TestBed"],
        "theory": "Angular CLI sets up Jasmine (test framework) and Karma (test runner). The `TestBed` is the most important utility, creating a dynamic Angular module environment for testing components.",
        "syntax": "describe('MyComponent', () => {\n  it('should create', () => {\n     expect(component).toBeTruthy();\n  });\n});",
        "examples": [
            {
                "code": "beforeEach(async () => {\n  await TestBed.configureTestingModule({\n    declarations: [ AppComponent ]\n  })\n  .compileComponents();\n});",
                "output": "Test environment setup",
                "explanation": "TestBed mimics NgModule configuration for the unit test."
            }
        ],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "What is TestBed?",
                "answer": "Angular's primary API for testing that allows mocking modules, services, and components.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["CLI creates spec.ts by default.", "ng test runs them."],
        "summary": "Testing is integrated deep into Angular's DNA, encouraging robust code."
    },
    {
        "title": "Unit Testing Components",
        "slug": "components-unit-testing",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "25 mins",
        "prerequisites": ["Angular Testing Basics"],
        "learning_objectives": ["ComponentFixture", "DebugElement", "Simulating events"],
        "theory": "Testing components involves creating a `ComponentFixture` to interact with the component instance and its DOM. `DebugElement` provides a wrapper around the native DOM element for safe inspection.",
        "syntax": "fixture.detectChanges();\nconst compiled = fixture.nativeElement;",
        "examples": [
            {
                "code": "it('should render title', () => {\n  const fixture = TestBed.createComponent(AppComponent);\n  fixture.detectChanges();\n  const compiled = fixture.nativeElement;\n  expect(compiled.querySelector('h1').textContent).toContain('Welcome');\n});",
                "output": "Verifies DOM output",
                "explanation": "We trigger CD with detectChanges() and then check the HTML content."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Forgetting detectChanges()",
                "correction": "The test environment does not run CD automatically (mostly). You must call it to update the view.",
                "example": "View remains empty until detectChanges is called."
            }
        ],
        "interview_questions": [],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Async testing needs async() or fakeAsync().", "Mock services using providers: []"],
        "summary": "Unit tests ensure individual components behave correctly in isolation."
    },
    {
        "title": "End-to-End Testing",
        "slug": "angular-e2e-testing",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Angular Testing Basics"],
        "learning_objectives": ["Protractor (Legacy)", "Cypress / Playwright", "Testing user flows"],
        "theory": "E2E testing simulates a real user interacting with the app in a browser. While Protractor was built-in, the community has moved to Cypress or Playwright. These tests run against a running application.",
        "syntax": "cy.visit('/');\ncy.contains('Welcome');",
        "examples": [],
        "common_mistakes": [],
        "interview_questions": [
            {
                "question": "Why is Protractor being deprecated?",
                "answer": "Modern tools like Cypress offer better stability, debugging, and speed compared to Protractor's Selenium WebDriver approach.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [
             {
                "scenario": "Login Flow",
                "description": "Script visits login, types credentials, clicks submit, and verifies dashboard URL.",
                "code": "cy.get('#login').click()"
            }
        ],
        "exam_notes": ["Tests entire app flow.", "Slower than unit tests."],
        "summary": "E2E tests provide the highest level of confidence that the system works as a whole."
    },
    {
        "title": "Angular Security Basics",
        "slug": "angular-security",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "20 mins",
        "prerequisites": ["HTTP Client & API Calls"],
        "learning_objectives": ["XSS Prevention", "Sanitization (DomSanitizer)", "CSP"],
        "theory": "Angular treats all values as untrusted by default. It automatically sanitizes property bindings to prevent Cross-Site Scripting (XSS). If you must modify HTML dynamically, you use `DomSanitizer` to bypass security (carefully).",
        "syntax": "this.sanitizer.bypassSecurityTrustHtml(html)",
        "examples": [
            {
                "code": "import { DomSanitizer } from '@angular/platform-browser';\n\nconstructor(private sanitizer: DomSanitizer) {}\n\nget safeUrl() {\n  return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);\n}",
                "output": "Allows embedding iframe",
                "explanation": "Needed for iframes or dangerous script tags."
            }
        ],
        "common_mistakes": [
             {
                "mistake": "Bypassing security unnecessarily",
                "correction": "Avoid usage of innerHTML. Often interpolation is safer and sufficient.",
                "example": "[innerHTML]=\"userContent\" // Risky"
            }
        ],
        "interview_questions": [
            {
                "question": "Does Angular prevent XSS?",
                "answer": "Yes, by automatic sanitization of all data bound to templates. It strips dangerous script tags.",
                "difficulty": "Medium"
            }
        ],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["XSS is main threat.", "HttpClient also helps (XSRF tokens support)."],
        "summary": "Angular allows you to build secure apps by default, but you must know when and how to bypass it safely."
    },
    {
        "title": "Angular Debugging Techniques",
        "slug": "angular-debugging",
        "subject": "Angular",
        "category": "Frontend Framework",
        "level": "Intermediate",
        "estimated_read_time": "15 mins",
        "prerequisites": ["Development Tools"],
        "learning_objectives": ["Augury / Angular DevTools", "Tap operator for RxJS", "Source Maps"],
        "theory": "Debugging requires tools beyond console.log. Angular DevTools (Chrome Extension) allows inspecting the component tree and profiler. For RxJS, the `tap` operator lets you peek into stream values without affecting them.",
        "syntax": "source$.pipe(tap(val => console.log('Stream:', val)))",
        "examples": [
            {
                "code": "ng serve --source-map=true",
                "output": "Enables TS debugging in DevTools",
                "explanation": "Allows putting breakpoints in .ts files instead of compiled .js."
            }
        ],
        "common_mistakes": [],
        "interview_questions": [],
        "practice_problems": [],
        "real_world_use_cases": [],
        "exam_notes": ["Angular DevTools extension.", "tap() operator."],
        "summary": "Effective debugging skills distinguish senior developers from juniors."
    }
]

for topic in topics:
    file_path = os.path.join(output_dir, f"{topic['slug']}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(topic, f, indent=2, ensure_ascii=False)

print("Batch 4 generated successfully.")
