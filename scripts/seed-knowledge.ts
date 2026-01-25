/**
 * 🎓 TechStack Advisor - Knowledge Base Seeder
 * Compact, focused documents for developer knowledge
 * 
 * Usage: npm run seed:tech
 */

// Load .env.local FIRST
import { config } from 'dotenv'
import { resolve } from 'path'
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

// Import knowledge modules

// Tech Stack Documents - Focused and concise
const TECH_DOCUMENTS = [
  // ========== JAVASCRIPT FUNDAMENTALS (from modules) =========
  
  // ========== JAVASCRIPT (additional inline) ==========
  {
    title: 'JavaScript Closures',
    content: `A closure is a function that has access to variables from its outer scope, even after the outer function returns. Example:

function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}
const counter = createCounter();
counter(); // 1
counter(); // 2

Common use cases: Data privacy, function factories, event handlers, callbacks. Closures remember their lexical environment.`,
    metadata: { category: 'javascript', tech_stack: ['JavaScript'], level: 'beginner', content_type: 'concept' }
  },
  {
    title: 'JavaScript Promises',
    content: `Promises represent asynchronous operations. Three states: pending, fulfilled, rejected.

const promise = fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

Async/Await syntax is cleaner:
async function getData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

Promise.all() runs multiple promises in parallel. Promise.race() returns first settled promise.`,
    metadata: { category: 'javascript', tech_stack: ['JavaScript'], level: 'beginner', content_type: 'concept' }
  },
  {
    title: 'JavaScript Event Loop',
    content: `The event loop handles asynchronous code execution. Call Stack executes synchronous code. Web APIs handle async operations (setTimeout, fetch). Callback Queue holds callbacks. Microtask Queue (Promises) has higher priority than Callback Queue.

Execution order:
1. Call Stack (synchronous)
2. Microtasks (Promises, async/await)
3. Macrotasks (setTimeout, setInterval)

console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2

This is why Promises execute before setTimeout even with 0ms delay.`,
    metadata: { category: 'javascript', tech_stack: ['JavaScript'], level: 'intermediate', content_type: 'concept' }
  },
  {
    title: 'JavaScript Prototypes',
    content: `Every JavaScript object has a prototype. Prototypes enable inheritance and method sharing.

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

Use Object.create() for true prototypal inheritance without constructors.`,
    metadata: { category: 'javascript', tech_stack: ['JavaScript'], level: 'intermediate', content_type: 'concept' }
  },
  {
    title: 'JavaScript this Keyword',
    content: `'this' refers to the execution context. Its value depends on how a function is called:

1. Regular function: this = global object (window in browser)
2. Method: this = object that owns the method
3. Arrow function: this = lexical scope (inherits from parent)
4. Constructor: this = new object
5. .call/.apply/.bind: this = explicitly set

const obj = {
  name: 'Alice',
  regular: function() { return this.name; },
  arrow: () => this.name
};
obj.regular(); // 'Alice'
obj.arrow();   // undefined (inherits global scope)

Use arrow functions to preserve 'this' in callbacks.`,
    metadata: { category: 'javascript', tech_stack: ['JavaScript'], level: 'intermediate', content_type: 'concept' }
  },

  // ========== TYPESCRIPT ==========
  {
    title: 'TypeScript Basics',
    content: `TypeScript adds static typing to JavaScript. Benefits: Catch errors at compile time, better IDE support, self-documenting code.

Basic types:
let name: string = 'Alice';
let age: number = 30;
let isActive: boolean = true;
let items: string[] = ['a', 'b'];
let tuple: [string, number] = ['Alice', 30];

Interfaces define object shapes:
interface User {
  id: number;
  name: string;
  email?: string; // optional
}

Type inference works automatically. Use 'any' sparingly. Enable strict mode in tsconfig.json.`,
    metadata: { category: 'typescript', tech_stack: ['TypeScript'], level: 'beginner', content_type: 'tutorial' }
  },
  {
    title: 'TypeScript Generics',
    content: `Generics create reusable, type-safe components.

function identity<T>(value: T): T {
  return value;
}
identity<string>('hello'); // type: string
identity<number>(42);      // type: number

Generic interfaces:
interface Box<T> {
  value: T;
}
const stringBox: Box<string> = { value: 'hello' };

Generic constraints:
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

Array<T>, Promise<T>, Record<K,V> are built-in generic types.`,
    metadata: { category: 'typescript', tech_stack: ['TypeScript'], level: 'intermediate', content_type: 'concept' }
  },
  {
    title: 'TypeScript Utility Types',
    content: `TypeScript provides built-in utility types for common transformations:

Partial<T> - All properties optional
Required<T> - All properties required
Readonly<T> - All properties readonly
Pick<T, K> - Select specific properties
Omit<T, K> - Exclude specific properties
Record<K, V> - Object with keys K and values V

Example:
interface User {
  id: number;
  name: string;
  email: string;
}

type UserUpdate = Partial<User>; // all optional
type UserPreview = Pick<User, 'id' | 'name'>; // only id & name
type UserWithoutEmail = Omit<User, 'email'>; // exclude email

ReturnType<T> extracts function return type. Parameters<T> extracts parameter types.`,
    metadata: { category: 'typescript', tech_stack: ['TypeScript'], level: 'advanced', content_type: 'concept' }
  },

  // ========== REACT ==========
  {
    title: 'React useState Hook',
    content: `useState manages component state in functional components.

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

State updates are batched. Use functional updates for state based on previous state:
setCount(prev => prev + 1);

For objects, spread existing state:
const [user, setUser] = useState({ name: '', age: 0 });
setUser(prev => ({ ...prev, name: 'Alice' }));

Never mutate state directly. Always create new objects/arrays.`,
    metadata: { category: 'react', tech_stack: ['React'], level: 'beginner', content_type: 'tutorial' }
  },
  {
    title: 'React useEffect Hook',
    content: `useEffect runs side effects after render. Replaces componentDidMount, componentDidUpdate, componentWillUnmount.

useEffect(() => {
  // Effect code
  return () => {
    // Cleanup code
  };
}, [dependencies]);

Empty array [] runs once (componentDidMount). No array runs every render. Dependencies array runs when those values change.

Common patterns:
- Data fetching: useEffect with async function
- Event listeners: Add in effect, remove in cleanup
- Subscriptions: Subscribe in effect, unsubscribe in cleanup

Avoid infinite loops: Don't update state that's in dependency array without condition.`,
    metadata: { category: 'react', tech_stack: ['React'], level: 'beginner', content_type: 'tutorial' }
  },
  {
    title: 'React Server Components',
    content: `React Server Components (RSC) render on the server, sending HTML to client. Benefits: Smaller bundle size, direct database access, improved performance.

// Server Component (default in Next.js 13+ app directory)
async function Page() {
  const data = await db.query('SELECT * FROM users');
  return <div>{data.map(user => <p>{user.name}</p>)}</div>;
}

Cannot use hooks (useState, useEffect) or browser APIs. Use 'use client' directive for client components.

Server Components can import Client Components, but not vice versa. Pass data as props from Server to Client.

Streaming: Server Components support Suspense for progressive rendering.`,
    metadata: { category: 'react', tech_stack: ['React', 'Next.js'], level: 'advanced', content_type: 'concept' }
  },
  {
    title: 'React Custom Hooks',
    content: `Custom hooks extract reusable logic. Must start with 'use' prefix.

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', '');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}

Custom hooks can use other hooks. Share logic without prop drilling or HOCs.`,
    metadata: { category: 'react', tech_stack: ['React'], level: 'intermediate', content_type: 'tutorial' }
  },

  // ========== NEXT.JS ==========
  {
    title: 'Next.js App Router',
    content: `Next.js 13+ App Router uses React Server Components by default. File-system based routing with app/ directory.

app/
  layout.tsx    // Root layout (required)
  page.tsx      // Home page (/)
  about/
    page.tsx    // About page (/about)
  blog/
    [slug]/
      page.tsx  // Dynamic route (/blog/post-1)

Layouts wrap child pages. Nested layouts preserve state. Loading.tsx shows loading UI. Error.tsx handles errors with error boundaries.

Server Components are default. Add 'use client' for client-side interactivity. Data fetching happens directly in components with async/await.`,
    metadata: { category: 'nextjs', tech_stack: ['Next.js', 'React'], level: 'beginner', content_type: 'tutorial' }
  },
  {
    title: 'Next.js Server Actions',
    content: `Server Actions are server-side functions called from client or server components. Defined with 'use server' directive.

// app/actions.ts
'use server'
export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.posts.create({ title });
  revalidatePath('/posts');
}

// app/page.tsx
import { createPost } from './actions';
export default function Page() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button>Create</button>
    </form>
  );
}

No API routes needed. Type-safe. Built-in form handling. Use revalidatePath() or revalidateTag() to update cached data.`,
    metadata: { category: 'nextjs', tech_stack: ['Next.js', 'React'], level: 'intermediate', content_type: 'tutorial' }
  },
  {
    title: 'Next.js Data Fetching',
    content: `Next.js supports multiple data fetching strategies:

1. Server Components (default): Direct async/await in components
async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data.title}</div>;
}

2. Caching: fetch() is extended with caching options
fetch(url, { cache: 'force-cache' })      // Static (default)
fetch(url, { cache: 'no-store' })         // Dynamic
fetch(url, { next: { revalidate: 60 } })  // ISR (60s)

3. Server Actions: For mutations and forms

4. Route Handlers: API routes for external API calls
export async function GET(request) {
  return Response.json({ data });
}

Use Suspense boundaries for streaming and parallel data fetching.`,
    metadata: { category: 'nextjs', tech_stack: ['Next.js', 'React'], level: 'intermediate', content_type: 'tutorial' }
  },

  // ========== ANGULAR ==========
  {
    title: 'Angular Components',
    content: `Angular components are the building blocks of Angular apps. Each component has a TypeScript class, HTML template, and CSS styles.

@Component({
  selector: 'app-user',
  template: '<h1>{{name}}</h1>',
  styles: ['h1 { color: blue; }']
})
export class UserComponent {
  name = 'Alice';
}

Data binding:
- Interpolation: {{value}}
- Property binding: [property]="value"
- Event binding: (event)="handler()"
- Two-way binding: [(ngModel)]="value"

Components communicate via @Input() and @Output() decorators. Use services for shared logic and dependency injection.`,
    metadata: { category: 'angular', tech_stack: ['Angular', 'TypeScript'], level: 'beginner', content_type: 'tutorial' }
  },
  {
    title: 'Angular Services & Dependency Injection',
    content: `Services provide shared logic across components. Use @Injectable() decorator.

@Injectable({ providedIn: 'root' })
export class UserService {
  users = [];
  
  getUsers() {
    return this.http.get('/api/users');
  }
}

// Inject into component
constructor(private userService: UserService) {}

providedIn: 'root' creates singleton service. Dependency Injection resolves dependencies automatically.

Common service patterns:
- Data services (API calls)
- State management
- Utility functions
- Cross-component communication

Use HttpClient for HTTP requests. RxJS Observables handle async operations.`,
    metadata: { category: 'angular', tech_stack: ['Angular', 'TypeScript'], level: 'intermediate', content_type: 'tutorial' }
  },

  // ========== STATE MANAGEMENT ==========
  {
    title: 'React Context API',
    content: `Context provides global state without prop drilling.

const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <ChildComponent />
    </ThemeContext.Provider>
  );
}

function ChildComponent() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}

Good for: Theme, auth, language. Not ideal for frequently changing data (performance). Consider Redux, Zustand, or Jotai for complex state.`,
    metadata: { category: 'state-management', tech_stack: ['React'], level: 'intermediate', content_type: 'tutorial' }
  },

  // ========== PERFORMANCE ==========
  {
    title: 'React useMemo and useCallback',
    content: `useMemo and useCallback optimize performance by memoizing values and functions.

useMemo: Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]); // Only recompute if a or b changes

useCallback: Memoize function references
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]); // Only recreate if a or b changes

Use when:
- Expensive calculations in render
- Passing callbacks to memoized child components
- Dependencies in useEffect

Don't overuse: Premature optimization. Profile first. React 19 Compiler auto-optimizes.`,
    metadata: { category: 'performance', tech_stack: ['React'], level: 'advanced', content_type: 'concept' }
  },

  // ========== ERRORS & DEBUGGING ==========
  {
    title: 'Common React Errors',
    content: `Top React errors and solutions:

1. "Cannot read property of undefined"
Fix: Optional chaining user?.name or null checks

2. "Too many re-renders"
Fix: Remove state updates without conditions. Use useCallback for event handlers.

3. "Objects are not valid as React child"
Fix: Don't render objects directly. Use JSON.stringify or render properties.

4. "Invalid hook call"
Fix: Only call hooks at component top level. Don't call in loops/conditions.

5. "Missing key prop"
Fix: Add unique key prop to list items: key={item.id}

Use React DevTools for debugging. Enable Strict Mode to catch issues early.`,
    metadata: { category: 'error-solution', tech_stack: ['React'], level: 'beginner', content_type: 'error-solution' }
  },

  // ========== BEST PRACTICES ==========
  {
    title: 'React Component Best Practices',
    content: `Best practices for clean React components:

1. Single Responsibility: One component, one purpose
2. Small Components: Max 200-300 lines
3. Composition over inheritance: Combine small components
4. Props destructuring: const { name, age } = props;
5. Default props: Use default parameters or ??
6. PropTypes or TypeScript: Type-check props
7. Key props: Always use stable, unique keys
8. Avoid inline functions in JSX: Use useCallback
9. Lift state up: Share state at common ancestor
10. Custom hooks: Extract reusable logic

File structure:
- components/ - Reusable components
- pages/ or app/ - Route components
- hooks/ - Custom hooks
- utils/ - Helper functions`,
    metadata: { category: 'best-practice', tech_stack: ['React'], level: 'intermediate', content_type: 'best-practice' }
  }
]

async function seedTechStack() {
  console.log('🌱 Starting TechStack Advisor knowledge base seeding...\n')

  // Dynamic import after env is loaded
  const { storeDocument } = await import('../features/rag-chat/services/vector-service')

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < TECH_DOCUMENTS.length; i++) {
    const doc = TECH_DOCUMENTS[i]!
    const progress = `[${i + 1}/${TECH_DOCUMENTS.length}]`

    try {
      console.log(`${progress} Processing: ${doc.title}`)

      const id = await storeDocument(doc.title, doc.content, doc.metadata)

      console.log(`   ✅ Stored (ID: ${id.substring(0, 8)}...)\n`)
      successCount++

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 TechStack Advisor Seeding Summary:')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   📦 Total: ${TECH_DOCUMENTS.length}`)
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
