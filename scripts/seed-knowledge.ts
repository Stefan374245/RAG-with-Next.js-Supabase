/**
 * Was macht seed-knowledge.ts?
 *
 * - Dieses Skript befüllt die Wissensdatenbank (Supabase) mit kompakten, thematisch sortierten Tech-Dokumenten.
 * - Es lädt Umgebungsvariablen, prüft die Konfiguration und importiert alle TECH_DOCUMENTS (JavaScript, TypeScript, React, Next.js, Angular, Best Practices etc.).
 * - Für jedes Dokument wird ein Embedding erzeugt und das Dokument per storeDocument() in die Datenbank geschrieben.
 * - Das Skript gibt eine Zusammenfassung aus, wie viele Dokumente erfolgreich gespeichert wurden.
 * - Wird typischerweise per `npm run seed:tech` ausgeführt, um die Datenbank für das RAG-System mit Startwissen zu füllen.
 *
 * Kurz: seed-knowledge.ts ist der Initialimporteur für eure Entwickler-Wissensdatenbank.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import type { TechStackMetadata } from '../types/techstack'
import { splitTextIntoChunks } from '../lib/utils'
config({ path: resolve(process.cwd(), '.env.local') })

// Verify environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.OPENAI_API_KEY) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure .env.local contains:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY') 
  console.error('- OPENAI_API_KEY')
  process.exit(1)
}

console.log('✅ Environment variables loaded\n')


// ======================= JAVASCRIPT BLOCK =======================
const TECH_DOCUMENTS: Array<{ title: string; content: string; metadata: TechStackMetadata }> = [
  {
    title: 'JavaScript Closures',
    content: `A closure is a function that has access to variables from its lexical (outer) scope, even after the outer function has finished executing. This is possible because functions in JavaScript form closures over their environment.

Example:
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}
const counter = createCounter();
counter(); // 1
counter(); // 2

Closures are fundamental for:
- Data privacy (encapsulation): Variables in the outer function are hidden from the global scope.
- Function factories: Creating partially applied functions or custom logic.
- Maintaining state in asynchronous code (e.g., setTimeout in loops).
- Event handlers: Each handler can "remember" the context in which it was created.

Best Practices:
- Use closures to avoid polluting the global namespace.
- Be mindful of memory leaks: Unintended references can keep large objects in memory.
- Understand that closures can capture variables by reference, not by value (common source of bugs in loops).

Closures are a core concept in JavaScript and are used extensively in modern frameworks and libraries (e.g., React hooks, currying, module patterns).`,
    metadata: {
      category: 'concept',
      tech_stack: ['JavaScript'],
      version: 'ES6',
      content_type: 'concept',
      level: 'beginner',
      learning_path: 'javascript-basics',
      prerequisites: ['Functions', 'Scope'],
      estimated_reading_time: 5,
      last_updated: '2026-01-27',
      keywords: ['closure', 'scope', 'lexical environment', 'function'],
      related_topics: ['Data privacy', 'Callbacks', 'Event handlers'],
      code_examples: true,
      slug: 'javascript-closures',
      author: 'TechStack Advisor',
      difficulty_score: 3
    }
  },
  {
    title: 'JavaScript Promises',
    content: `A Promise is an object representing the eventual completion (or failure) of an asynchronous operation. Promises have three states: pending, fulfilled, and rejected.

Example:
const promise = fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

Promises solve the "callback hell" problem by allowing chaining and error handling. They are the foundation for async/await syntax:
async function getData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

Advanced Promise patterns:
- Promise.all([...]) runs multiple promises in parallel and waits for all to finish.
- Promise.race([...]) returns the first settled promise.
- Promise.allSettled([...]) returns results of all, regardless of success/failure.

Best Practices:
- Always handle errors with .catch or try/catch.
- Avoid mixing callbacks and promises in the same code.
- Use async/await for more readable asynchronous code.

Promises are essential for modern JavaScript, especially in API calls, file operations, and UI updates.`,
    metadata: {
      category: 'concept',
      tech_stack: ['JavaScript'],
      version: 'ES6',
      content_type: 'concept',
      level: 'beginner',
      learning_path: 'javascript-async',
      prerequisites: ['Callbacks', 'Functions'],
      estimated_reading_time: 6,
      last_updated: '2026-01-27',
      keywords: ['promise', 'async', 'await', 'asynchronous'],
      related_topics: ['Async/Await', 'Callback', 'Error handling'],
      code_examples: true,
      slug: 'javascript-promises',
      author: 'TechStack Advisor',
      difficulty_score: 4
    }
  },
  {
    title: 'JavaScript Event Loop',
    content: `The event loop is the mechanism that allows JavaScript to perform non-blocking operations, despite being single-threaded. It coordinates the execution of synchronous and asynchronous code.

  Key concepts:
  - Call Stack: Executes synchronous code line by line.
  - Web APIs: Browser-provided APIs (e.g., setTimeout, fetch) handle async tasks.
  - Callback Queue (Task Queue): Holds callbacks from timers, events, etc.
  - Microtask Queue: Holds promises and mutation observers; has higher priority than the callback queue.

  Execution order:
  1. Call Stack (synchronous)
  2. Microtasks (Promises, async/await, queueMicrotask)
  3. Macrotasks (setTimeout, setInterval, I/O)

  Example:
  console.log('1');
  setTimeout(() => console.log('2'), 0);
  Promise.resolve().then(() => console.log('3'));
  console.log('4');
  // Output: 1, 4, 3, 2

  Best Practices:
  - Use promises and async/await for predictable async flow.
  - Understand the event loop to avoid race conditions and UI blocking.
  - Use setImmediate, process.nextTick (Node.js) for advanced scheduling.

  The event loop is fundamental for responsive UIs and scalable servers in JavaScript.`,
    metadata: {
      category: 'concept',
      tech_stack: ['JavaScript'],
      version: 'ES6',
      content_type: 'concept',
      level: 'intermediate',
      learning_path: 'javascript-async',
      prerequisites: ['Promises', 'Callbacks'],
      estimated_reading_time: 7,
      last_updated: '2026-01-27',
      keywords: ['event loop', 'call stack', 'microtask', 'macrotask'],
      related_topics: ['Async/Await', 'Callback Queue', 'Web APIs'],
      code_examples: true,
      slug: 'javascript-event-loop',
      author: 'TechStack Advisor',
      difficulty_score: 5
    }
  },
  {
    title: 'JavaScript Prototypes',
    content: `Every JavaScript object has a prototype, which is another object from which it inherits properties and methods. Prototypes enable inheritance and method sharing in JavaScript.

Example (constructor function):
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return 'Hello, ' + this.name;
};
const john = new Person('John');
john.greet(); // 'Hello, John'

ES6 classes are syntactic sugar over prototypes:
class Person {
  constructor(name) { this.name = name; }
  greet() { return 'Hello, ' + this.name; }
}

Advanced:
- Object.create(proto) creates a new object with the given prototype.
- You can override or extend prototypes at runtime.
- All functions have a prototype property; all objects have an internal [[Prototype]].

Best Practices:
- Use prototypes for method sharing to save memory.
- Avoid modifying built-in prototypes (e.g., Array.prototype) in production code.
- Prefer ES6 classes for clarity and maintainability.

Prototypal inheritance is a unique and powerful feature of JavaScript, used in frameworks, libraries, and the language core itself.`,
    metadata: {
      category: 'concept',
      tech_stack: ['JavaScript'],
      version: 'ES6',
      content_type: 'concept',
      level: 'intermediate',
      learning_path: 'javascript-objects',
      prerequisites: ['Functions', 'Objects'],
      estimated_reading_time: 8,
      last_updated: '2026-01-27',
      keywords: ['prototype', 'inheritance', 'class', 'object'],
      related_topics: ['ES6 Classes', 'Object.create', 'Method sharing'],
      code_examples: true,
      slug: 'javascript-prototypes',
      author: 'TechStack Advisor',
      difficulty_score: 6
    }
  },
  {
    title: 'JavaScript this Keyword',
    content: `'this' refers to the execution context in which a function is called. Its value is determined by how the function is invoked, not where it is defined.

Rules for 'this':
1. Regular function: this = global object (window in browser, undefined in strict mode)
2. Method: this = object that owns the method
3. Arrow function: this = lexical scope (inherits from parent, never its own)
4. Constructor: this = new instance object
5. .call/.apply/.bind: this = explicitly set

Example:
const obj = {
  name: 'Alice',
  regular: function() { return this.name; },
  arrow: () => this.name
};
obj.regular(); // 'Alice'
obj.arrow();   // undefined (inherits global scope)

Common pitfalls:
- Losing 'this' in callbacks or event handlers (use arrow functions or .bind).
- Arrow functions are not suitable as methods or constructors.

Best Practices:
- Use arrow functions for callbacks to preserve 'this'.
- Use .bind(this) or class fields for event handlers in React.
- Avoid using 'this' in functional programming style code.

Understanding 'this' is crucial for debugging, OOP, and working with frameworks like React and Vue.`,
    metadata: {
      category: 'concept',
      tech_stack: ['JavaScript'],
      version: 'ES6',
      content_type: 'concept',
      level: 'intermediate',
      learning_path: 'javascript-functions',
      prerequisites: ['Functions', 'Objects'],
      estimated_reading_time: 6,
      last_updated: '2026-01-27',
      keywords: ['this', 'execution context', 'arrow function', 'method'],
      related_topics: ['Arrow functions', 'Call/apply/bind', 'Global object'],
      code_examples: true,
      slug: 'javascript-this-keyword',
      author: 'TechStack Advisor',
      difficulty_score: 5
    }
  },
  // ======================= REACT BLOCK =======================
    {
      title: 'React State Management Deep Dive',
      content: `State management in React is crucial for building scalable and maintainable applications. There are several approaches, each with its own use cases:

  1. Local State (useState, useReducer):
  - Best for UI state that belongs to a single component or a small subtree.
  - Example: Form inputs, toggles, local counters.

  2. Context API:
  - Provides a way to share values (theme, user, locale) between components without prop drilling.
  - Use React.createContext and useContext hook.
  - Best for global, rarely-changing state.

  3. State Management Libraries:
  - Redux: Predictable state container, great for large apps with complex state logic. Uses actions, reducers, and a single store. DevTools and middleware support.
  - Zustand, Jotai, Recoil: Modern, minimal alternatives for global state. Hooks-based, less boilerplate than Redux.
  - MobX: Reactive state management using observables.

  4. Server State:
  - Data fetched from APIs (REST, GraphQL) is best managed with libraries like React Query, SWR, or Apollo Client. Handles caching, background updates, and synchronization.

  Best Practices:
  - Keep state as local as possible.
  - Avoid unnecessary global state.
  - Use selectors and memoization to optimize performance.
  - Normalize complex data (e.g., with Redux Toolkit).

  Choosing the right state management approach depends on app size, team experience, and requirements. Combine local, context, and global state as needed for clarity and performance.`,
      metadata: {
        category: 'framework',
        tech_stack: ['React', 'JavaScript'],
        version: '18.2.0',
        content_type: 'guide',
        level: 'advanced',
        learning_path: 'react-state-management',
        prerequisites: ['React State and Lifecycle'],
        estimated_reading_time: 10,
        last_updated: '2026-01-27',
        keywords: ['state', 'context', 'redux', 'zustand', 'server state'],
        related_topics: ['Redux', 'Context API', 'React Query', 'SWR'],
        code_examples: false,
        slug: 'react-state-management',
        author: 'TechStack Advisor',
        difficulty_score: 6
      }
    },

    {
      title: 'pgvector: Vector Search in React Apps',
      content: `pgvector is a PostgreSQL extension for efficient vector similarity search, enabling AI-powered features in modern web apps.

  Key Concepts:
  - Vectors represent text, images, or other data as high-dimensional arrays (embeddings).
  - pgvector adds a new column type (vector) and similarity operators (cosine, L2, inner product) to Postgres.
  - Enables semantic search, recommendations, and RAG (Retrieval Augmented Generation) workflows.

  Integration with React & Supabase:
  - Supabase supports pgvector out of the box. You can store and query embeddings via SQL or the Supabase client.
  - In a React app, you can:
    - Generate embeddings (e.g., with OpenAI API) on the client or server.
    - Store vectors in Supabase using RPC or REST endpoints.
    - Query for similar documents using SQL (ORDER BY embedding <=> query_embedding LIMIT k).
  - Use cases: semantic search, chatbots, personalized recommendations, document clustering.

  Best Practices:
  - Use approximate search (IVFFlat index) for large datasets.
  - Normalize vectors for cosine similarity.
  - Secure endpoints and validate user input.

  pgvector brings AI-native capabilities to fullstack React apps with minimal effort, especially when combined with Supabase and OpenAI.`,
      metadata: {
        category: 'tool',
        tech_stack: ['pgvector', 'PostgreSQL', 'React', 'Supabase'],
        version: '0.5.1',
        content_type: 'guide',
        level: 'advanced',
        learning_path: 'vector-search',
        prerequisites: ['PostgreSQL', 'Embeddings', 'React Basics'],
        estimated_reading_time: 8,
        last_updated: '2026-01-27',
        keywords: ['pgvector', 'vector search', 'semantic', 'embedding', 'supabase'],
        related_topics: ['OpenAI', 'RAG', 'Supabase', 'AI'],
        code_examples: false,
        slug: 'pgvector-react',
        author: 'TechStack Advisor',
        difficulty_score: 7
      }
    },
  {
    title: 'React Core Concepts',
    content: `React is a powerful JavaScript library for building user interfaces, developed by Meta. Its core principles are:

- Declarative: You describe what the UI should look like for each state, and React efficiently updates and renders components when data changes. This reduces bugs and makes UIs predictable.
- Component-Based: UIs are built from small, reusable components that manage their own state and logic. Components can be composed to create complex applications.
- Unidirectional Data Flow: Data flows from parent to child via props, making state management and debugging easier.
- Virtual DOM: React uses a virtual DOM to efficiently update only the parts of the UI that change, improving performance.
- Learn Once, Write Anywhere: React can be used for web (ReactDOM), native mobile (React Native), desktop (Electron), and even VR (React 360).

React encourages functional programming patterns, immutability, and testability. It is the foundation for many modern frameworks (Next.js, Gatsby, Remix) and is widely adopted in the industry.

Best Practices:
- Keep components small and focused (Single Responsibility Principle).
- Use composition over inheritance.
- Prefer function components and hooks for new code.
- Co-locate state where it is used most.
- Use PropTypes or TypeScript for type safety.

Common Use Cases:
- Building SPAs, dashboards, design systems, and interactive UIs.
- Integrating with REST/GraphQL APIs.
- Server-side rendering (SSR) and static site generation (SSG) with frameworks like Next.js.

React’s ecosystem includes state management (Redux, Zustand), routing (React Router), and testing (React Testing Library, Jest).`,
    metadata: {
      category: 'framework',
      tech_stack: ['React', 'JavaScript'],
      version: '18.2.0',
      content_type: 'guide',
      level: 'beginner',
      learning_path: 'react-basics',
      prerequisites: ['JavaScript Basics'],
      estimated_reading_time: 5,
      last_updated: '2026-01-27',
      keywords: ['declarative', 'component', 'UI', 'state'],
      related_topics: ['React Native', 'JSX', 'Virtual DOM'],
      code_examples: false,
      slug: 'react-core-concepts',
      author: 'Meta Platforms',
      difficulty_score: 2
    }
  },
  {
    title: 'React Components and JSX',
    content: `React components are the building blocks of every React application. They can be defined as functions (function components) or classes (class components).

JSX (JavaScript XML) is a syntax extension that allows you to write HTML-like code in JavaScript. JSX makes it easier to visualize UI structure and supports JavaScript expressions inside curly braces.

Example (Function Component):
function HelloMessage({ name }) {
  return <div>Hello {name}</div>;
}
root.render(<HelloMessage name="Taylor" />);

Class components implement a render() method and can use lifecycle methods. Function components are preferred for new code and can use hooks for state and side effects.

JSX compiles to React.createElement calls. You can use fragments (<>...</>) to group elements without extra DOM nodes.

Best Practices:
- Use function components and hooks for most use cases.
- Use props for data flow and composition.
- Avoid side effects in render methods.
- Use keys for lists to help React identify elements.

JSX supports conditional rendering, mapping arrays, and spreading props. It is type-safe with TypeScript and supports custom elements and attributes.`,
    metadata: {
      category: 'framework',
      tech_stack: ['React', 'JavaScript'],
      version: '18.2.0',
      content_type: 'example',
      level: 'beginner',
      learning_path: 'react-components',
      prerequisites: ['React Core Concepts'],
      estimated_reading_time: 7,
      last_updated: '2026-01-27',
      keywords: ['component', 'JSX', 'props', 'render'],
      related_topics: ['Functional Components', 'Class Components'],
      code_examples: true,
      slug: 'react-components-jsx',
      author: 'Meta Platforms',
      difficulty_score: 3
    }
  },
  {
    title: 'React State and Lifecycle',
    content: `Components can maintain internal state (this.state in class components, useState in function components). When state changes, React re-renders the component to reflect the new data.

Example (Class Component):
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }
  tick() { this.setState(state => ({ seconds: state.seconds + 1 })); }
  componentDidMount() { this.interval = setInterval(() => this.tick(), 1000); }
  componentWillUnmount() { clearInterval(this.interval); }
  render() { return <div>Seconds: {this.state.seconds}</div>; }
}
root.render(<Timer />);

Function components use hooks:
import { useState, useEffect } from 'react';
function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  return <div>Seconds: {seconds}</div>;
}

Lifecycle methods (class): componentDidMount, componentDidUpdate, componentWillUnmount, etc.
Hooks (function): useEffect, useLayoutEffect, useRef, etc.

Best Practices:
- Keep state as local as possible.
- Use effects for side effects (data fetching, subscriptions).
- Clean up resources in useEffect return functions.
- Avoid unnecessary re-renders by memoizing components and values.

State and lifecycle management are key to building interactive, performant React apps.`,
    metadata: {
      category: 'framework',
      tech_stack: ['React', 'JavaScript'],
      version: '18.2.0',
      content_type: 'example',
      level: 'intermediate',
      learning_path: 'react-state-lifecycle',
      prerequisites: ['React Components and JSX'],
      estimated_reading_time: 8,
      last_updated: '2026-01-27',
      keywords: ['state', 'lifecycle', 'componentDidMount', 'componentWillUnmount'],
      related_topics: ['Hooks', 'Effect', 'setState'],
      code_examples: true,
      slug: 'react-state-lifecycle',
      author: 'Meta Platforms',
      difficulty_score: 4
    }
  },
  {
    title: 'React Application Example: Todo App',
    content: `Combining props and state, you can build interactive applications. The Todo App is a classic example demonstrating state management, event handling, and component composition.

Example (Class Component):
class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) { this.setState({ text: e.target.value }); }
  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.text.length) return;
    this.setState(state => ({
      items: [...state.items, state.text],
      text: ''
    }));
  }
  render() {
    return (
      <div>
        <h3>TODO</h3>
        <ul>{this.state.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} value={this.state.text} />
          <button>Add #{this.state.items.length + 1}</button>
        </form>
      </div>
    );
  }
}
root.render(<TodoApp />);

Best Practices:
- Use controlled components for form inputs.
- Lift state up for shared data.
- Split UI into small, reusable components.
- Use keys for list items.

The Todo App pattern is a foundation for CRUD apps and demonstrates how React handles user input, state updates, and rendering.`,
    metadata: {
      category: 'framework',
      tech_stack: ['React', 'JavaScript'],
      version: '18.2.0',
      content_type: 'example',
      level: 'intermediate',
      learning_path: 'react-apps',
      prerequisites: ['React State and Lifecycle'],
      estimated_reading_time: 10,
      last_updated: '2026-01-27',
      keywords: ['application', 'todo', 'state', 'event handling'],
      related_topics: ['Forms', 'Event Delegation', 'Component Composition'],
      code_examples: true,
      slug: 'react-todo-app',
      author: 'Meta Platforms',
      difficulty_score: 5
    }
  },
    // ======================= ANGULAR BLOCK =======================
    {
      title: 'Angular Core Concepts',
      content: `Angular is a comprehensive, opinionated framework for building scalable, maintainable, and testable web applications. Developed by Google, Angular is used in enterprise environments and large-scale projects worldwide.

    Key Features:
    - Component-based architecture: Applications are composed of reusable, encapsulated components with their own templates, styles, and logic. Components communicate via @Input/@Output and services.
    - Dependency Injection (DI): Angular’s DI system enables loose coupling, testability, and modularity. Services are injected into components and other services as needed.
    - RxJS and Observables: Angular leverages RxJS for powerful, reactive programming. Observables are used for async data streams (HTTP, events, forms) and enable advanced patterns like debouncing, retry, and cancellation.
    - Ahead-of-Time (AOT) Compilation: Templates are compiled at build time, resulting in faster startup, smaller bundles, and improved security.
    - Angular CLI: The CLI provides commands for scaffolding, building, testing, linting, and deploying apps. It enforces best practices and project structure.
    - NgModules: Code is organized into modules for features, routing, and lazy loading. Modules enable code splitting and encapsulation.
    - Built-in support for forms (template-driven and reactive), HTTP client, routing, animations, i18n, and testing.

    Advanced Concepts:
    - Change Detection Strategies: Default vs. OnPush for performance tuning.
    - Zone.js: Tracks async operations for automatic change detection.
    - Custom Pipes and Directives: Extend templates with reusable logic.
    - Angular Universal: Server-side rendering for SEO and performance.

    Best Practices:
    - Use strong typing and interfaces with TypeScript.
    - Structure code by feature modules and use barrel files for exports.
    - Prefer OnPush change detection for performance-critical components.
    - Write unit tests (Jasmine, Karma) and end-to-end tests (Protractor, Cypress).
    - Use Angular CLI for consistent tooling and updates.
    - Use services for business logic and data access, not components.

    Common Use Cases:
    - Enterprise dashboards, admin panels, B2B apps, and complex SPAs.
    - Applications requiring strict architecture, maintainability, and long-term support.
    - Teams with large codebases, multiple developers, and CI/CD pipelines.

    Ecosystem:
    - Angular Material: UI component library following Material Design.
    - NgRx: Redux-inspired state management for Angular.
    - Angular DevTools: Chrome extension for debugging and profiling.

    Angular’s opinionated structure, tooling, and ecosystem make it ideal for large, mission-critical applications.`,
      metadata: {
        category: 'framework',
        tech_stack: ['Angular', 'TypeScript'],
        version: '17',
        content_type: 'guide',
        level: 'beginner',
        learning_path: 'angular-basics',
        prerequisites: ['TypeScript Basics'],
        estimated_reading_time: 7,
        last_updated: '2026-01-27',
        keywords: ['component', 'module', 'service', 'dependency injection'],
        related_topics: ['RxJS', 'Angular CLI', 'Routing'],
        code_examples: false,
        slug: 'angular-core-concepts',
        author: 'Google',
        difficulty_score: 3
      }
    },
    {
      title: 'Angular Data Binding & Directives',
      content: `Angular’s data binding and directives system is one of its most powerful features, enabling dynamic, interactive, and maintainable UIs.

    Data Binding Types:
    - Interpolation: {{ value }} — Display component data in the template.
    - Property binding: [property]="value" — Bind DOM properties to component fields.
    - Event binding: (event)="handler()" — Listen to DOM events and call component methods.
    - Two-way binding: [(ngModel)]="value" — Synchronize data between the view and the model (requires FormsModule).

    Example:
    <input [(ngModel)]="username">
    <div *ngIf="username">Hello, {{ username }}!</div>

    Directives:
    - Structural directives: Change the DOM structure (e.g., *ngIf, *ngFor, *ngSwitch).
    - Attribute directives: Change the appearance or behavior of elements (e.g., ngClass, ngStyle, custom directives).

    Custom Directives:
    - Create reusable logic for DOM manipulation, validation, or UI behavior.
    - Example: HighlightDirective to change background color on hover.

    Advanced:
    - Use trackBy in *ngFor for performance with large lists.
    - Combine multiple bindings and directives for complex UIs.
    - Use pipes for data transformation in templates (e.g., date, currency, custom pipes).

    Best Practices:
    - Prefer reactive forms for complex validation and dynamic forms.
    - Keep templates declarative and move logic to the component class.
    - Use custom directives and pipes to avoid code duplication.
    - Use strict typing for all form and binding data.

    Angular’s binding and directive system enables rapid development of robust, maintainable, and testable user interfaces.`,
      metadata: {
        category: 'framework',
        tech_stack: ['Angular', 'TypeScript'],
        version: '17',
        content_type: 'example',
        level: 'beginner',
        learning_path: 'angular-components',
        prerequisites: ['Angular Core Concepts'],
        estimated_reading_time: 6,
        last_updated: '2026-01-27',
        keywords: ['data binding', 'directive', 'ngModel', 'ngIf'],
        related_topics: ['Forms', 'Events', 'Templates'],
        code_examples: true,
        slug: 'angular-data-binding',
        author: 'Google',
        difficulty_score: 3
      }
    },
    // ======================= VUE BLOCK =======================
    {
      title: 'Vue.js Core Concepts',
      content: `Vue.js is a progressive JavaScript framework for building user interfaces. Features:
      - Declarative rendering with templates
      - Reactive data binding
      - Component-based structure
      - Single File Components (.vue)
      Vue is easy to integrate and has a gentle learning curve.`,
      metadata: {
        category: 'framework',
        tech_stack: ['Vue', 'JavaScript'],
        version: '3',
        content_type: 'guide',
        level: 'beginner',
        learning_path: 'vue-basics',
        prerequisites: ['JavaScript Basics'],
        estimated_reading_time: 6,
        last_updated: '2026-01-27',
        keywords: ['template', 'reactivity', 'component', 'SFC'],
        related_topics: ['Vuex', 'Vue Router', 'Composition API'],
        code_examples: false,
        slug: 'vue-core-concepts',
        author: 'Evan You',
        difficulty_score: 2
      }
    },
    {
      title: 'Vue.js Data Binding & Computed Properties',
      content: `Vue uses v-bind for binding and v-model for two-way data binding. Computed properties are cached and update reactively:
      Example:
      <input v-model="message">
      <p>{{ reversedMessage }}</p>
      computed: {
        reversedMessage() { return this.message.split('').reverse().join('') }
      }`,
      metadata: {
        category: 'framework',
        tech_stack: ['Vue', 'JavaScript'],
        version: '3',
        content_type: 'example',
        level: 'beginner',
        learning_path: 'vue-components',
        prerequisites: ['Vue.js Core Concepts'],
        estimated_reading_time: 5,
        last_updated: '2026-01-27',
        keywords: ['v-model', 'computed', 'reactivity', 'binding'],
        related_topics: ['Methods', 'Watchers', 'Props'],
        code_examples: true,
        slug: 'vue-data-binding',
        author: 'Evan You',
        difficulty_score: 2
      }
    },
    // ======================= SVELTE BLOCK =======================
    {
      title: 'Svelte Core Concepts',
      content: `Svelte is a compiler that turns declarative components into efficient JavaScript. Features:
      - No virtual DOM
      - Reactive assignments
      - Built-in stores for state management
      - Single File Components (.svelte)
      Svelte apps are fast and small.`,
      metadata: {
        category: 'framework',
        tech_stack: ['Svelte', 'JavaScript'],
        version: '4',
        content_type: 'guide',
        level: 'beginner',
        learning_path: 'svelte-basics',
        prerequisites: ['JavaScript Basics'],
        estimated_reading_time: 5,
        last_updated: '2026-01-27',
        keywords: ['compiler', 'reactivity', 'store', 'component'],
        related_topics: ['SvelteKit', 'Store', 'Transition'],
        code_examples: false,
        slug: 'svelte-core-concepts',
        author: 'Rich Harris',
        difficulty_score: 2
      }
    },
    {
      title: 'Svelte Reactivity & Stores',
      content: `Svelte uses reactive assignments and built-in stores for state:
      let count = 0;
      $: doubled = count * 2;
      import { writable } from 'svelte/store';
      const counter = writable(0);
      $counter.subscribe(value => { ... });`,
      metadata: {
        category: 'framework',
        tech_stack: ['Svelte', 'JavaScript'],
        version: '4',
        content_type: 'example',
        level: 'beginner',
        learning_path: 'svelte-state',
        prerequisites: ['Svelte Core Concepts'],
        estimated_reading_time: 5,
        last_updated: '2026-01-27',
        keywords: ['reactivity', 'store', 'assignment', 'writable'],
        related_topics: ['Derived Store', 'Transition', 'Animation'],
        code_examples: true,
        slug: 'svelte-reactivity',
        author: 'Rich Harris',
        difficulty_score: 2
      }
    },
    // ======================= NEXT.JS BLOCK =======================
    {
      title: 'Next.js Core Concepts',
      content: `Next.js is a React framework for production-grade web apps. Features:
      - File-based routing
      - Server-side rendering (SSR) & static site generation (SSG)
      - API routes
      - Built-in CSS & image optimization
      - Middleware & edge functions
      Next.js 15 introduces Server Actions and React 19 support.`,
      metadata: {
        category: 'framework',
        tech_stack: ['Next.js', 'React', 'JavaScript'],
        version: '15',
        content_type: 'guide',
        level: 'intermediate',
        learning_path: 'nextjs-basics',
        prerequisites: ['React Core Concepts'],
        estimated_reading_time: 7,
        last_updated: '2026-01-27',
        keywords: ['routing', 'SSR', 'SSG', 'API routes'],
        related_topics: ['Server Actions', 'Edge Functions', 'Middleware'],
        code_examples: false,
        slug: 'nextjs-core-concepts',
        author: 'Vercel',
        difficulty_score: 4
      }
    },
    {
      title: 'Next.js Server Actions & Routing',
      content: `Server Actions allow you to run server-side code directly from components. Routing is file-based:
      - Place files in app/ for routes
      - Use 'use server' directive for actions
      Example:
      export async function action() { 'use server'; ... }`,
      metadata: {
        category: 'framework',
        tech_stack: ['Next.js', 'React', 'JavaScript'],
        version: '15',
        content_type: 'example',
        level: 'intermediate',
        learning_path: 'nextjs-routing',
        prerequisites: ['Next.js Core Concepts'],
        estimated_reading_time: 6,
        last_updated: '2026-01-27',
        keywords: ['server actions', 'routing', 'app directory'],
        related_topics: ['API Routes', 'Streaming', 'Edge Functions'],
        code_examples: true,
        slug: 'nextjs-server-actions',
        author: 'Vercel',
        difficulty_score: 4
      }
    },
      // ======================= REDUX BLOCK =======================
      {
        title: 'Redux Core Concepts',
        content: `Redux is a predictable state container for JavaScript apps. Key ideas:
        - Single source of truth (store)
        - State is read-only, changed via actions
        - Reducers specify how state transitions occur
        - Middleware for async logic (e.g. redux-thunk)
        Redux is often used with React, but works with any UI layer.`,
        metadata: {
          category: 'library',
          tech_stack: ['Redux', 'JavaScript'],
          version: '5',
          content_type: 'guide',
          level: 'intermediate',
          learning_path: 'redux-basics',
          prerequisites: ['JavaScript Basics'],
          estimated_reading_time: 6,
          last_updated: '2026-01-27',
          keywords: ['store', 'action', 'reducer', 'middleware'],
          related_topics: ['React', 'Redux Toolkit', 'Thunk'],
          code_examples: false,
          slug: 'redux-core-concepts',
          author: 'Redux Team',
          difficulty_score: 4
        }
      },
      // ======================= NODE.JS BLOCK =======================
      {
        title: 'Node.js Core Concepts',
        content: `Node.js is a JavaScript runtime built on Chrome's V8 engine. Features:
        - Event-driven, non-blocking I/O
        - Single-threaded but highly scalable
        - Built-in modules for HTTP, file system, streams
        - npm ecosystem for packages
        Node.js is used for backend APIs, CLI tools, and real-time apps.`,
        metadata: {
          category: 'tool',
          tech_stack: ['Node.js', 'JavaScript'],
          version: '20',
          content_type: 'guide',
          level: 'intermediate',
          learning_path: 'nodejs-basics',
          prerequisites: ['JavaScript Basics'],
          estimated_reading_time: 7,
          last_updated: '2026-01-27',
          keywords: ['event loop', 'I/O', 'module', 'npm'],
          related_topics: ['Express', 'Streams', 'Buffer'],
          code_examples: false,
          slug: 'nodejs-core-concepts',
          author: 'Node.js Foundation',
          difficulty_score: 4
        }
      },
      // ======================= TAILWIND CSS BLOCK =======================
      {
        title: 'Tailwind CSS Core Concepts',
        content: `Tailwind CSS is a utility-first CSS framework. Features:
        - Composable utility classes for rapid UI development
        - Responsive design with breakpoints
        - Customization via config file
        - Purge unused styles for small bundles
        Tailwind is popular for modern web apps and design systems.`,
        metadata: {
          category: 'library',
          tech_stack: ['Tailwind CSS', 'CSS'],
          version: '3.4',
          content_type: 'guide',
          level: 'beginner',
          learning_path: 'tailwind-basics',
          prerequisites: ['CSS Basics'],
          estimated_reading_time: 5,
          last_updated: '2026-01-27',
          keywords: ['utility', 'responsive', 'config', 'purge'],
          related_topics: ['Design System', 'PostCSS', 'JIT'],
          code_examples: false,
          slug: 'tailwind-core-concepts',
          author: 'Tailwind Labs',
          difficulty_score: 2
        }
      },
      // ======================= SUPABASE BLOCK =======================
      {
        title: 'Supabase Core Concepts',
        content: `Supabase is an open-source backend-as-a-service built on PostgreSQL. Features:
        - Instant RESTful APIs
        - Realtime subscriptions
        - Authentication & storage
        - Vector search with pgvector
        Supabase is a popular alternative to Firebase for modern apps.`,
        metadata: {
          category: 'tool',
          tech_stack: ['Supabase', 'PostgreSQL'],
          version: '2',
          content_type: 'guide',
          level: 'intermediate',
          learning_path: 'supabase-basics',
          prerequisites: ['SQL Basics'],
          estimated_reading_time: 6,
          last_updated: '2026-01-27',
          keywords: ['API', 'realtime', 'auth', 'vector'],
          related_topics: ['Firebase', 'pgvector', 'Storage'],
          code_examples: false,
          slug: 'supabase-core-concepts',
          author: 'Supabase Team',
          difficulty_score: 3
        }
      },
      // ======================= VITE BLOCK =======================
      {
        title: 'Vite Core Concepts',
        content: `Vite is a modern frontend build tool. Features:
        - Lightning-fast dev server with hot module replacement
        - Native ES modules
        - Optimized production builds
        - Plugin system for extensibility
        Vite supports React, Vue, Svelte, and more.`,
        metadata: {
          category: 'tool',
          tech_stack: ['Vite', 'JavaScript', 'TypeScript'],
          version: '5',
          content_type: 'guide',
          level: 'beginner',
          learning_path: 'vite-basics',
          prerequisites: ['JavaScript Basics'],
          estimated_reading_time: 5,
          last_updated: '2026-01-27',
          keywords: ['dev server', 'HMR', 'ESM', 'plugin'],
          related_topics: ['Webpack', 'Rollup', 'Parcel'],
          code_examples: false,
          slug: 'vite-core-concepts',
          author: 'Evan You',
          difficulty_score: 2
        }
      },
        // ======================= JEST BLOCK =======================
        {
          title: 'Jest Testing Basics',
          content: `Jest is a popular JavaScript testing framework. Features:
          - Zero-config setup for most projects
          - Snapshot testing for UI
          - Mocking and spies for isolation
          - Parallel test execution
          Example:
          test('adds 1 + 2', () => { expect(1 + 2).toBe(3) })`,
          metadata: {
            category: 'tool',
            tech_stack: ['Jest', 'JavaScript'],
            version: '29',
            content_type: 'example',
            level: 'beginner',
            learning_path: 'testing-basics',
            prerequisites: ['JavaScript Basics'],
            estimated_reading_time: 5,
            last_updated: '2026-01-27',
            keywords: ['test', 'mock', 'snapshot', 'expect'],
            related_topics: ['Testing Library', 'Vitest', 'Mocha'],
            code_examples: true,
            slug: 'jest-testing-basics',
            author: 'Meta Platforms',
            difficulty_score: 2
          }
        },
        // ======================= API DESIGN BLOCK =======================
        {
          title: 'REST vs GraphQL',
          content: `REST and GraphQL are two popular API paradigms:
          - REST: Resource-based, uses HTTP verbs, multiple endpoints
          - GraphQL: Single endpoint, flexible queries, strong typing
          REST is simple and cache-friendly. GraphQL reduces over/under-fetching and is great for complex UIs.`,
          metadata: {
            category: 'api-doc',
            tech_stack: ['REST', 'GraphQL'],
            version: '',
            content_type: 'comparison',
            level: 'intermediate',
            learning_path: 'api-design',
            prerequisites: ['HTTP Basics'],
            estimated_reading_time: 6,
            last_updated: '2026-01-27',
            keywords: ['REST', 'GraphQL', 'endpoint', 'query'],
            related_topics: ['Apollo', 'OpenAPI', 'CRUD'],
            code_examples: false,
            slug: 'rest-vs-graphql',
            author: 'TechStack Advisor',
            difficulty_score: 3
          }
        },
        // ======================= AUTH BLOCK =======================
        {
          title: 'JWT Authentication',
          content: `JWT (JSON Web Token) is a compact, URL-safe means of representing claims between two parties. Used for stateless authentication:
          - Encodes user info and expiry in the token
          - Signed with secret or public/private key
          - Used in Authorization header: Bearer <token>
          JWTs are common in modern web and mobile apps.`,
          metadata: {
            category: 'best-practice',
            tech_stack: ['JWT', 'Auth'],
            version: '',
            content_type: 'concept',
            level: 'intermediate',
            learning_path: 'auth-basics',
            prerequisites: ['HTTP Basics'],
            estimated_reading_time: 5,
            last_updated: '2026-01-27',
            keywords: ['jwt', 'token', 'auth', 'stateless'],
            related_topics: ['OAuth', 'Session', 'Refresh Token'],
            code_examples: false,
            slug: 'jwt-auth',
            author: 'TechStack Advisor',
            difficulty_score: 3
          }
        },
        // ======================= DEVOPS BLOCK =======================
        {
          title: 'CI/CD Pipeline Basics',
          content: `CI/CD (Continuous Integration/Continuous Deployment) automates building, testing, and deploying code:
          - CI: Run tests and checks on every commit
          - CD: Deploy automatically to staging/production
          - Tools: GitHub Actions, GitLab CI, Jenkins
          CI/CD increases code quality and delivery speed.`,
          metadata: {
            category: 'best-practice',
            tech_stack: ['CI/CD', 'DevOps'],
            version: '',
            content_type: 'concept',
            level: 'beginner',
            learning_path: 'devops-basics',
            prerequisites: ['Git Basics'],
            estimated_reading_time: 5,
            last_updated: '2026-01-27',
            keywords: ['ci', 'cd', 'pipeline', 'automation'],
            related_topics: ['GitHub Actions', 'Jenkins', 'Testing'],
            code_examples: false,
            slug: 'cicd-basics',
            author: 'TechStack Advisor',
            difficulty_score: 2
          }
        },
        // ======================= ACCESSIBILITY BLOCK =======================
        {
          title: 'Web Accessibility (a11y) Basics',
          content: `Accessibility ensures apps are usable by everyone, including people with disabilities:
          - Use semantic HTML (e.g. <button>, <nav>)
          - Provide alt text for images
          - Ensure keyboard navigation
          - Use ARIA attributes when needed
          Tools: axe, Lighthouse, screen readers.`,
          metadata: {
            category: 'best-practice',
            tech_stack: ['Accessibility', 'HTML', 'a11y'],
            version: '',
            content_type: 'guide',
            level: 'beginner',
            learning_path: 'accessibility-basics',
            prerequisites: ['HTML Basics'],
            estimated_reading_time: 5,
            last_updated: '2026-01-27',
            keywords: ['a11y', 'semantic', 'alt', 'aria'],
            related_topics: ['WCAG', 'Screen Reader', 'Keyboard'],
            code_examples: false,
            slug: 'a11y-basics',
            author: 'TechStack Advisor',
            difficulty_score: 2
          }
        },
        // ======================= PERFORMANCE BLOCK =======================
        {
          title: 'Web Performance Optimization',
          content: `Performance is key for user experience and SEO:
          - Minimize bundle size (tree-shaking, code splitting)
          - Use lazy loading for images/components
          - Optimize critical rendering path
          - Monitor with tools like Lighthouse, WebPageTest
          Core Web Vitals: LCP, FID, CLS.`,
          metadata: {
            category: 'best-practice',
            tech_stack: ['Performance', 'Web'],
            version: '',
            content_type: 'guide',
            level: 'intermediate',
            learning_path: 'performance-basics',
            prerequisites: ['JavaScript Basics'],
            estimated_reading_time: 6,
            last_updated: '2026-01-27',
            keywords: ['performance', 'bundle', 'lazy', 'web vitals'],
            related_topics: ['Lighthouse', 'Code Splitting', 'SEO'],
            code_examples: false,
            slug: 'web-performance',
            author: 'TechStack Advisor',
            difficulty_score: 3
          }
        },
        // ======================= SECURITY BLOCK =======================
        {
          title: 'Web Security Essentials',
          content: `Security is critical for all web apps:
          - Sanitize user input to prevent XSS
          - Use HTTPS and secure cookies
          - Protect against CSRF and SQL injection
          - Use environment variables for secrets
          Tools: Helmet, OWASP ZAP, Snyk.`,
          metadata: {
            category: 'best-practice',
            tech_stack: ['Security', 'Web'],
            version: '',
            content_type: 'guide',
            level: 'intermediate',
            learning_path: 'security-basics',
            prerequisites: ['Web Basics'],
            estimated_reading_time: 6,
            last_updated: '2026-01-27',
            keywords: ['security', 'xss', 'csrf', 'https'],
            related_topics: ['OWASP', 'Helmet', 'Snyk'],
            code_examples: false,
            slug: 'web-security',
            author: 'TechStack Advisor',
            difficulty_score: 3
          }
        },
        // ======================= PWA BLOCK =======================
        {
          title: 'Progressive Web Apps (PWA)',
          content: `PWAs combine the best of web and mobile:
          - Installable on home screen
          - Offline support via Service Worker
          - Push notifications
          - Responsive and fast
          Use manifest.json and HTTPS for PWA features.`,
          metadata: {
            category: 'best-practice',
            tech_stack: ['PWA', 'Web'],
            version: '',
            content_type: 'guide',
            level: 'intermediate',
            learning_path: 'pwa-basics',
            prerequisites: ['Web Basics'],
            estimated_reading_time: 6,
            last_updated: '2026-01-27',
            keywords: ['pwa', 'service worker', 'manifest', 'offline'],
            related_topics: ['Service Worker', 'Push', 'Manifest'],
            code_examples: false,
            slug: 'pwa-basics',
            author: 'TechStack Advisor',
            difficulty_score: 3
          }
        },
        // ======================= MICRO FRONTENDS BLOCK =======================
        {
          title: 'Micro Frontends',
          content: `Micro Frontends split a frontend app into independent, deployable modules:
          - Each team owns a feature end-to-end
          - Enables tech diversity and scaling
          - Common approaches: Module Federation, iframes, Web Components
          Use for large, distributed teams and complex apps.`,
          metadata: {
            category: 'tool',
            tech_stack: ['Micro Frontends', 'Web'],
            version: '',
            content_type: 'concept',
            level: 'advanced',
            learning_path: 'architecture-advanced',
            prerequisites: ['Frontend Architecture'],
            estimated_reading_time: 7,
            last_updated: '2026-01-27',
            keywords: ['micro frontend', 'module federation', 'web components'],
            related_topics: ['Monorepo', 'Module Federation', 'Web Components'],
            code_examples: false,
            slug: 'micro-frontends',
            author: 'TechStack Advisor',
            difficulty_score: 5
          }
        },
        // ======================= MONOREPO BLOCK =======================
        {
          title: 'Monorepo Strategies',
          content: `Monorepos manage multiple projects in a single repository:
          - Shared tooling and dependencies
          - Atomic commits across projects
          - Tools: Nx, Turborepo, Lerna
          Monorepos simplify code sharing and CI/CD for large teams.`,
          metadata: {
            category: 'tool',
            tech_stack: ['Monorepo', 'DevOps'],
            version: '',
            content_type: 'guide',
            level: 'advanced',
            learning_path: 'monorepo-advanced',
            prerequisites: ['Git Basics'],
            estimated_reading_time: 7,
            last_updated: '2026-01-27',
            keywords: ['monorepo', 'nx', 'turborepo', 'lerna'],
            related_topics: ['Micro Frontends', 'CI/CD', 'Tooling'],
            code_examples: false,
            slug: 'monorepo-strategies',
            author: 'TechStack Advisor',
            difficulty_score: 5
          }
        }
];

 
// Chunks beim Seeding nutzen
async function seedTechStack() {
  console.log('🌱 Starting TechStack Advisor knowledge base seeding with chunking...\n')

  // Dynamic import after env is loaded
  const { storeDocument } = await import('../features/rag-chat/services/vector-service')

  let successCount = 0
  let errorCount = 0
  let totalChunks = 0

  for (let i = 0; i < TECH_DOCUMENTS.length; i++) {
    const doc = TECH_DOCUMENTS[i]!
    const progress = `[${i + 1}/${TECH_DOCUMENTS.length}]`

    // Text in Chunks teilen
    const chunks = splitTextIntoChunks(doc.content)
    totalChunks += chunks.length
    for (let c = 0; c < chunks.length; c++) {
      const chunkContent = chunks[c] ?? ''
      const chunkTitle = `${doc.title} [Chunk ${c + 1}/${chunks.length}]`
      try {
        console.log(`${progress} Chunk ${c + 1}/${chunks.length}: ${chunkTitle}`)
        const id = await storeDocument(chunkTitle, chunkContent, doc.metadata)
        console.log(`   ✅ Stored (ID: ${id?.substring?.(0, 8) || id}...)\n`)
        successCount++
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
        errorCount++
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 TechStack Advisor Seeding Summary:')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   📦 Total Chunks: ${totalChunks}`)
  console.log(`   📄 Original Docs: ${TECH_DOCUMENTS.length}`)
  console.log('='.repeat(60) + '\n')

  if (successCount > 0) {
    console.log('🎉 TechStack knowledge base ready!')
    console.log('💡 Start the app: npm run dev')
    console.log('🔍 Try queries like:')
    console.log('   - "Explain React hooks"')
    console.log('   - "JavaScript closures example"')
    console.log('   - "Next.js Server Components vs Client Components"\n')
  } else {
    console.error('❌ All documents failed. Check environment variables.')
    process.exit(1)
  }
}

// Run seeding
seedTechStack()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
