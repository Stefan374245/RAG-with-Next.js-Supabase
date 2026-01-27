/**
 * TECHSTACK ADVISOR - TYPE DEFINITIONS
 * 
 * TypeScript types for developer knowledge base system
 */

// ============================================================================
// BASE METADATA TYPE
// ============================================================================

export interface TechStackMetadata {
  // Category Classification
  category: 'framework' | 'library' | 'tool' | 'concept' | 'error-solution' | 'best-practice' | 'api-doc' | 'comparison' | 'tutorial'
  
  // Technology Tags
  tech_stack: string[]  // e.g., ['React', 'TypeScript', 'Next.js']
  version?: string      // e.g., '19.0', '15.0.2'
  
  // Content Type
  content_type: 'guide' | 'reference' | 'example' | 'troubleshooting' | 'comparison' | 'api' | 'concept'
  
  // Difficulty Level
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  
  // Learning Path
  learning_path?: string  // e.g., 'javascript-basics', 'react-mastery'
  prerequisites?: string[] // e.g., ['JavaScript Basics', 'HTML/CSS']
  
  // Additional Metadata
  estimated_reading_time?: number  // Minutes
  last_updated?: string           // ISO date
  keywords?: string[]             // For better search
  related_topics?: string[]       // Connected content
  code_examples?: boolean         // Has code snippets
  
  // SEO & Search
  slug?: string  // URL-friendly identifier
  author?: string
  difficulty_score?: number  // 1-10
    [key: string]: string | number | boolean | string[] | undefined;
}

// ============================================================================
// FRAMEWORK DEFINITIONS
// ============================================================================

export interface Framework {
  name: string
  type: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'testing' | 'build-tool'
  description: string
  website: string
  github_repo?: string
  npm_package?: string
  
  // Characteristics
  language: string  // 'JavaScript', 'TypeScript', etc.
  runtime?: string  // 'Browser', 'Node.js', 'Deno', 'Bun'
  paradigm?: string[]  // ['Component-based', 'Reactive', 'Declarative']
  
  // Version Info
  latest_version: string
  release_date: string
  
  // Learning Resources
  documentation_url: string
  tutorial_url?: string
  playground_url?: string
  
  // Ecosystem
  cli_tool?: string  // e.g., 'create-react-app', 'ng new'
  popular_libraries?: string[]
  state_management?: string[]
  routing_solution?: string
  
  // Comparisons
  similar_to?: string[]  // ['Vue', 'Angular']
  advantages?: string[]
  disadvantages?: string[]
  
  // Community
  weekly_downloads?: number
  github_stars?: number
  stackoverflow_questions?: number
  
  // Use Cases
  ideal_for?: string[]  // ['SPAs', 'Static Sites', 'Enterprise Apps']
  used_by?: string[]    // ['Facebook', 'Netflix', 'Airbnb']
}

// ============================================================================
// LEARNING CONTENT TYPES
// ============================================================================

export interface Tutorial {
  id: string
  title: string
  framework: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  
  // Content Structure
  sections: TutorialSection[]
  estimated_time: number  // minutes
  
  // Prerequisites
  prerequisites: string[]
  what_you_will_learn: string[]
  
  // Code Examples
  github_repo?: string
  demo_url?: string
  
  // Meta
  created_at: string
  updated_at: string
  author: string
}

export interface TutorialSection {
  title: string
  content: string
  code_example?: string
  language?: string  // For syntax highlighting
  notes?: string
  order: number
}

// ============================================================================
// ERROR SOLUTIONS DATABASE
// ============================================================================

export interface ErrorSolution {
  id: string
  error_message: string  // Exact error text
  framework: string
  
  // Context
  common_causes: string[]
  affected_versions?: string[]
  
  // Solutions
  solutions: Solution[]
  
  // Meta
  frequency: 'very-common' | 'common' | 'rare'
  severity: 'critical' | 'high' | 'medium' | 'low'
  tags: string[]
}

export interface Solution {
  title: string
  description: string
  steps: string[]
  code_fix?: string
  explanation?: string
  links?: string[]
}

// ============================================================================
// COMPARISON CONTENT
// ============================================================================

export interface FrameworkComparison {
  id: string
  title: string  // e.g., "React vs Vue vs Angular"
  frameworks: string[]
  
  // Comparison Criteria
  criteria: ComparisonCriteria[]
  
  // Summary
  summary: string
  recommendations: Recommendation[]
  
  // Meta
  last_updated: string
  author: string
}

export interface ComparisonCriteria {
  name: string  // 'Performance', 'Learning Curve', 'Ecosystem'
  description: string
  scores: Record<string, number>  // { 'React': 9, 'Vue': 8, 'Angular': 7 }
  details: Record<string, string>
}

export interface Recommendation {
  scenario: string  // 'Building a SPA', 'Large Enterprise App'
  recommended_framework: string
  reason: string
}

// ============================================================================
// API DOCUMENTATION
// ============================================================================

export interface APIDocumentation {
  id: string
  service_name: string  // 'OpenAI', 'Supabase', 'Vercel'
  api_name: string      // 'Chat Completions', 'Database', 'Deployments'
  
  // Endpoint Details
  endpoints: APIEndpoint[]
  
  // Authentication
  auth_type: 'api-key' | 'oauth' | 'jwt' | 'none'
  auth_example?: string
  
  // SDK Information
  sdk_languages?: string[]  // ['JavaScript', 'Python', 'Go']
  npm_package?: string
  
  // Meta
  version: string
  documentation_url: string
  rate_limits?: string
  pricing?: string
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  
  // Request
  headers?: Record<string, string>
  query_params?: APIParameter[]
  body_params?: APIParameter[]
  
  // Response
  response_example?: string
  response_schema?: string
  
  // Code Examples
  code_examples?: CodeExample[]
}

export interface APIParameter {
  name: string
  type: string
  required: boolean
  description: string
  default?: any
  example?: any
}

export interface CodeExample {
  language: string
  code: string
  description?: string
}

// ============================================================================
// BEST PRACTICES
// ============================================================================

export interface BestPractice {
  id: string
  title: string
  framework: string
  category: 'performance' | 'security' | 'accessibility' | 'testing' | 'architecture' | 'code-quality'
  
  // Content
  description: string
  why_important: string
  
  // Examples
  good_example?: string
  bad_example?: string
  
  // Implementation
  implementation_steps?: string[]
  tools_needed?: string[]
  
  // References
  references?: string[]
  related_practices?: string[]
  
  // Meta
  level: 'beginner' | 'intermediate' | 'advanced'
  impact: 'high' | 'medium' | 'low'
}

// ============================================================================
// CODE PATTERNS & SNIPPETS
// ============================================================================

export interface CodePattern {
  id: string
  name: string
  framework: string
  category: string  // 'hooks', 'components', 'routing', 'state-management'
  
  // Pattern Details
  description: string
  use_case: string
  when_to_use: string
  when_not_to_use?: string
  
  // Code
  code: string
  language: string
  
  // Explanation
  explanation: string
  key_concepts?: string[]
  
  // Variations
  variations?: CodePatternVariation[]
  
  // Meta
  level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

export interface CodePatternVariation {
  name: string
  description: string
  code: string
  when_to_use: string
}

// ============================================================================
// LEARNING PATHS
// ============================================================================

export interface LearningPath {
  id: string
  name: string
  description: string
  
  // Path Structure
  stages: LearningStage[]
  
  // Meta
  total_duration: number  // hours
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  target_audience: string
  
  // Outcomes
  learning_outcomes: string[]
  projects?: string[]
}

export interface LearningStage {
  order: number
  title: string
  description: string
  topics: string[]
  resources: string[]
  estimated_duration: number  // hours
  project?: string
}

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

export const POPULAR_FRAMEWORKS = [
  'React',
  'Vue',
  'Angular',
  'Next.js',
  'Svelte',
  'Solid',
  'Remix',
  'Nuxt',
  'Astro',
  'Qwik'
] as const

export const POPULAR_LIBRARIES = [
  'Redux',
  'React Query',
  'Zustand',
  'Jotai',
  'React Router',
  'TanStack Router',
  'React Hook Form',
  'Zod',
  'Axios',
  'SWR'
] as const

export const JAVASCRIPT_CONCEPTS = [
  'Closures',
  'Promises',
  'Async/Await',
  'Event Loop',
  'Prototypes',
  'Hoisting',
  'Scope',
  'Context (this)',
  'Modules',
  'Destructuring'
] as const

export const TECH_CATEGORIES = {
  frontend: ['React', 'Vue', 'Angular', 'Svelte'],
  backend: ['Node.js', 'Express', 'Fastify', 'Nest.js'],
  fullstack: ['Next.js', 'Remix', 'Nuxt', 'SvelteKit'],
  state: ['Redux', 'MobX', 'Zustand', 'Jotai', 'Recoil'],
  styling: ['Tailwind CSS', 'Styled Components', 'CSS Modules', 'Emotion'],
  build: ['Vite', 'Webpack', 'Turbopack', 'Rollup', 'esbuild'],
  testing: ['Jest', 'Vitest', 'Playwright', 'Cypress', 'Testing Library'],
  database: ['PostgreSQL', 'MongoDB', 'Supabase', 'Firebase', 'PlanetScale'],
  deployment: ['Vercel', 'Netlify', 'Railway', 'Fly.io', 'AWS']
} as const

export type TechCategory = keyof typeof TECH_CATEGORIES
