/**
 * Single source of truth for the Categorical curriculum.
 *
 * All module, track, and lesson data lives here.
 * Sidebar, Dashboard, syllabus page, and exercises.ts all import from this file.
 */

import type { Language } from './types/exercise';

export type ModuleStatus = 'available' | 'coming-soon';
export type TrackSlug = 'foundation' | 'category-theory' | 'algebra-crypto' | 'algorithms'
  | 'applied-ct' | 'languages' | 'linear-algebra' | 'verified-crypto' | 'lambda-calculus'
  | 'ts-design' | 'ts-advanced' | 'rust-ownership' | 'rust-systems' | 'gpu-fundamentals' | 'gpu-portable'
  | 'ts-architecture' | 'ts-perf' | 'rust-async-track' | 'rust-perf';

export interface Track {
  slug: TrackSlug;
  title: string;
  description: string;
  order: number;
}

export interface CurriculumModule {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  track: TrackSlug;
  language: Language;
  status: ModuleStatus;
  prerequisites: string[];
  lessons: CurriculumLesson[];
}

export interface CurriculumLesson {
  slug: string;
  title: string;
  path: string;
  exerciseIds: string[];
}

// ── Tracks ─────────────────────────────────────────────────────────

export const tracks: Track[] = [
  {
    slug: 'foundation',
    title: 'Foundation',
    description: 'Haskell syntax, types, and algebraic structures',
    order: 1,
  },
  {
    slug: 'category-theory',
    title: 'Category Theory',
    description: 'Functors, applicatives, monads, and natural transformations',
    order: 2,
  },
  {
    slug: 'algebra-crypto',
    title: 'Algebra & Cryptography',
    description: 'Abstract algebra and its applications to cryptography',
    order: 3,
  },
  {
    slug: 'algorithms',
    title: 'Algorithms',
    description: 'Functional algorithm patterns: recursion, higher-order design, laziness, and memoization',
    order: 4,
  },
  {
    slug: 'applied-ct',
    title: 'Applied Category Theory',
    description: 'State, Reader, monad transformers, and free monads — practical patterns from category theory',
    order: 5,
  },
  {
    slug: 'languages',
    title: 'Compiler & Language Theory',
    description: 'Parser combinators, expression parsing, evaluation, and interpretation',
    order: 6,
  },
  {
    slug: 'linear-algebra',
    title: 'Typed Linear Algebra',
    description: 'Vectors, matrices, linear transformations, and Gaussian elimination',
    order: 7,
  },
  {
    slug: 'verified-crypto',
    title: 'Verified Cryptographic Protocols',
    description: 'Polynomials, Lagrange interpolation, secret sharing, and zero-knowledge proofs',
    order: 8,
  },
  {
    slug: 'lambda-calculus',
    title: 'Lambda Calculus',
    description: 'The theoretical foundations of functional programming: lambda expressions, Church encodings, reduction, types, and Curry-Howard',
    order: 9,
  },
  {
    slug: 'ts-design',
    title: 'TypeScript: Design',
    description: 'Type-driven design, API patterns, and functional programming in TypeScript',
    order: 10,
  },
  {
    slug: 'ts-advanced',
    title: 'TypeScript: Advanced Types',
    description: 'Mapped types, conditional types, template literals, and type-level programming',
    order: 11,
  },
  {
    slug: 'rust-ownership',
    title: 'Rust: Ownership',
    description: 'Ownership, borrowing, lifetimes, and the borrow checker as a design discipline',
    order: 12,
  },
  {
    slug: 'rust-systems',
    title: 'Rust: Systems',
    description: 'Zero-cost abstractions, unsafe code, cryptographic implementations',
    order: 13,
  },
  {
    slug: 'gpu-fundamentals',
    title: 'GPU: CUDA',
    description: 'Parallel thinking, thread hierarchy, memory models, and kernel design',
    order: 14,
  },
  {
    slug: 'gpu-portable',
    title: 'GPU: ROCm/HIP',
    description: 'Portable GPU programming, CUDA-to-HIP translation, AMD architecture',
    order: 15,
  },
  {
    slug: 'ts-architecture',
    title: 'TypeScript: Architecture',
    description: 'DI, state machines, plugin systems, and module boundary design',
    order: 16,
  },
  {
    slug: 'ts-perf',
    title: 'TypeScript: Performance',
    description: 'Structural sharing, lazy evaluation, object pooling, and memoization',
    order: 17,
  },
  {
    slug: 'rust-async-track',
    title: 'Rust: Async & Traits',
    description: 'Futures, Pin, async patterns, sealed traits, middleware, and type-state',
    order: 18,
  },
  {
    slug: 'rust-perf',
    title: 'Rust: Performance',
    description: 'Cache-friendly layouts, arena allocation, SIMD concepts, and zero-copy parsing',
    order: 19,
  },
];

// ── Modules ────────────────────────────────────────────────────────

export const modules: CurriculumModule[] = [
  {
    slug: 'reading-haskell',
    title: 'Reading Haskell',
    description: 'Learn to read Haskell before writing it — values, expressions, functions, types, and application.',
    icon: '\u2981',
    order: 0,
    track: 'foundation',
    language: 'haskell',
    status: 'available',
    prerequisites: [],
    lessons: [{
      slug: 'reading',
      title: 'Reading Haskell',
      path: '/reading-haskell/reading',
      exerciseIds: [
        'reading-values', 'reading-expressions', 'reading-functions',
        'reading-types', 'function-application',
      ],
    }],
  },
  {
    slug: 'type-systems',
    title: 'Haskell Foundations',
    description: 'Functions, types, pattern matching, ADTs, polymorphism, and typeclasses.',
    icon: '\u03BB',
    order: 1,
    track: 'foundation',
    language: 'haskell',
    status: 'available',
    prerequisites: ['reading-haskell'],
    lessons: [{
      slug: 'basic-types',
      title: 'Haskell Foundations',
      path: '/type-systems/basic-types',
      exerciseIds: [
        'basic-functions', 'concrete-types', 'pattern-matching',
        'algebraic-data-types', 'polymorphic-types', 'parametric-polymorphism',
        'typeclasses-intro',
      ],
    }],
  },
  {
    slug: 'monoids-foldable',
    title: 'Monoids & Foldable',
    description: 'Semigroups, monoids, and folding — the bridge from typeclasses to category theory.',
    icon: '\u2295',
    order: 2,
    track: 'foundation',
    language: 'haskell',
    status: 'available',
    prerequisites: ['type-systems'],
    lessons: [{
      slug: 'monoids',
      title: 'Monoids and Foldable',
      path: '/monoids-foldable/monoids',
      exerciseIds: ['semigroup-intro', 'monoid-instance', 'foldable-basics', 'foldmap-power'],
    }],
  },
  {
    slug: 'category-theory',
    title: 'Functors & Natural Transformations',
    description: 'Functors, fmap, functor laws, and natural transformations — through code.',
    icon: '\u2219',
    order: 3,
    track: 'category-theory',
    language: 'haskell',
    status: 'available',
    prerequisites: ['type-systems'],
    lessons: [{
      slug: 'functors',
      title: 'Functors and Natural Transformations',
      path: '/category-theory/functors',
      exerciseIds: ['using-fmap', 'functor-instance', 'functor-laws', 'natural-transformation'],
    }],
  },
  {
    slug: 'applicative-monad',
    title: 'Applicative & Monad',
    description: 'Monadic bind, do-notation, and error handling with Maybe and Either.',
    icon: '\u226B',
    order: 4,
    track: 'category-theory',
    language: 'haskell',
    status: 'available',
    prerequisites: ['category-theory', 'monoids-foldable'],
    lessons: [{
      slug: 'applicative-monad',
      title: 'Applicative and Monad',
      path: '/applicative-monad/applicative-monad',
      exerciseIds: ['maybe-monad', 'do-notation', 'either-error-handling'],
    }],
  },
  {
    slug: 'abstract-algebra',
    title: 'Abstract Algebra',
    description: 'Groups, rings, fields, and homomorphisms — the algebraic foundations for cryptography.',
    icon: '\u2124',
    order: 5,
    track: 'algebra-crypto',
    language: 'haskell',
    status: 'available',
    prerequisites: ['monoids-foldable'],
    lessons: [{
      slug: 'algebra',
      title: 'Groups, Rings, and Fields',
      path: '/abstract-algebra/algebra',
      exerciseIds: ['modular-arithmetic', 'group-typeclass', 'ring-field', 'group-homomorphism'],
    }],
  },
  {
    slug: 'algebraic-cryptography',
    title: 'Algebraic Cryptography',
    description: 'Finite fields, Diffie-Hellman, RSA, elliptic curves, and commitment schemes.',
    icon: '\u2234',
    order: 6,
    track: 'algebra-crypto',
    language: 'haskell',
    status: 'available',
    prerequisites: ['abstract-algebra', 'applicative-monad'],
    lessons: [{
      slug: 'cryptography',
      title: 'Cryptographic Protocols from Algebra',
      path: '/algebraic-cryptography/cryptography',
      exerciseIds: [
        'finite-field-gfp', 'diffie-hellman', 'rsa-encryption',
        'elliptic-curve-addition', 'pedersen-commitment',
      ],
    }],
  },
  {
    slug: 'functional-algorithms',
    title: 'Functional Algorithms',
    description: 'Algorithmic thinking in Haskell: recursion schemes, higher-order design, laziness, and memoization.',
    icon: '\u03B1',
    order: 7,
    track: 'algorithms',
    language: 'haskell',
    status: 'available',
    prerequisites: ['type-systems', 'monoids-foldable'],
    lessons: [{
      slug: 'algorithms',
      title: 'Functional Algorithm Patterns',
      path: '/functional-algorithms/algorithms',
      exerciseIds: [
        'recursion-patterns', 'higher-order-algorithms', 'lazy-infinite-lists',
        'divide-and-conquer', 'lazy-memoization',
      ],
    }],
  },
  {
    slug: 'category-theory-ii',
    title: 'Applied Category Theory',
    description: 'State, Reader, monad transformers, and free monads — practical patterns from category theory.',
    icon: '\u21D2',
    order: 8,
    track: 'applied-ct',
    language: 'haskell',
    status: 'available',
    prerequisites: ['applicative-monad'],
    lessons: [{
      slug: 'applied-ct',
      title: 'Practical CT Patterns',
      path: '/category-theory-ii/applied-ct',
      exerciseIds: ['state-monad', 'reader-monad', 'monad-transformers', 'free-monads'],
    }],
  },
  {
    slug: 'languages',
    title: 'Compiler & Language Theory',
    description: 'Build a complete mini-language: parser combinators, expression parsing, evaluation, and interpretation.',
    icon: '\u03B3',
    order: 9,
    track: 'languages',
    language: 'haskell',
    status: 'available',
    prerequisites: ['category-theory-ii', 'functional-algorithms'],
    lessons: [{
      slug: 'compilers',
      title: 'Building a Mini-Language',
      path: '/languages/compilers',
      exerciseIds: ['parser-type', 'parser-combinators', 'expression-parser', 'ast-evaluator', 'interpreter'],
    }],
  },
  {
    slug: 'typed-linear-algebra',
    title: 'Typed Linear Algebra',
    description: 'Vectors, matrices, linear transformations, and Gaussian elimination — algebra meets geometry.',
    icon: '\u27E8',
    order: 10,
    track: 'linear-algebra',
    language: 'haskell',
    status: 'available',
    prerequisites: ['type-systems', 'monoids-foldable', 'abstract-algebra'],
    lessons: [{
      slug: 'linear',
      title: 'Vectors, Matrices, and Transforms',
      path: '/typed-linear-algebra/linear',
      exerciseIds: ['vector-operations', 'matrix-operations', 'linear-transformations', 'gaussian-elimination'],
    }],
  },
  {
    slug: 'verified-cryptographic-protocols',
    title: 'Verified Cryptographic Protocols',
    description: 'Polynomial arithmetic, Lagrange interpolation, Shamir secret sharing, and the Schnorr protocol.',
    icon: '\u03C3',
    order: 11,
    track: 'verified-crypto',
    language: 'haskell',
    status: 'available',
    prerequisites: ['algebraic-cryptography', 'typed-linear-algebra'],
    lessons: [{
      slug: 'protocols',
      title: 'Cryptographic Protocols',
      path: '/verified-cryptographic-protocols/protocols',
      exerciseIds: ['polynomial-arithmetic', 'lagrange-interpolation', 'shamir-secret-sharing', 'schnorr-protocol'],
    }],
  },
  {
    slug: 'lambda-calculus',
    title: 'Lambda Calculus I: Foundations',
    description: 'Lambda expressions, beta reduction, combinators, higher-order functions, and currying.',
    icon: '\u03BB',
    order: 12,
    track: 'lambda-calculus',
    language: 'haskell',
    status: 'available',
    prerequisites: ['reading-haskell'],
    lessons: [{
      slug: 'foundations',
      title: 'Lambda Calculus Foundations',
      path: '/lambda-calculus/foundations',
      exerciseIds: ['lambda-identity', 'beta-reduction', 'lambda-combinators', 'higher-order-lambdas', 'currying-partial'],
    }],
  },
  {
    slug: 'lambda-calculus-ii',
    title: 'Lambda Calculus II: Church Encodings',
    description: 'Church booleans, numerals, pairs, reduction strategies, and fixed-point recursion.',
    icon: '\u03BB',
    order: 13,
    track: 'lambda-calculus',
    language: 'haskell',
    status: 'available',
    prerequisites: ['lambda-calculus', 'type-systems'],
    lessons: [{
      slug: 'church-encodings',
      title: 'Church Encodings and Reduction',
      path: '/lambda-calculus-ii/church-encodings',
      exerciseIds: ['church-booleans', 'church-numerals', 'church-pairs-maybe', 'reduction-strategies', 'fixpoint-recursion'],
    }],
  },
  {
    slug: 'lambda-calculus-iii',
    title: 'Lambda Calculus III: Types & Interpreters',
    description: 'Curry-Howard correspondence, CPS transforms, and building a lambda calculus interpreter.',
    icon: '\u03BB',
    order: 14,
    track: 'lambda-calculus',
    language: 'haskell',
    status: 'available',
    prerequisites: ['lambda-calculus-ii', 'category-theory'],
    lessons: [{
      slug: 'types-and-interpreters',
      title: 'Types, Curry-Howard, and Interpreters',
      path: '/lambda-calculus-iii/types-and-interpreters',
      exerciseIds: ['curry-howard', 'cps-transform', 'lambda-ast', 'lambda-interpreter'],
    }],
  },

  // ── TypeScript ──────────────────────────────────────────────────────

  {
    slug: 'ts-type-driven',
    title: 'Type-Driven Design',
    description: 'Discriminated unions, branded types, exhaustive matching, and type narrowing.',
    icon: '\u0054',
    order: 15,
    track: 'ts-design',
    language: 'typescript',
    status: 'available',
    prerequisites: [],
    lessons: [{
      slug: 'type-driven',
      title: 'Type-Driven Design',
      path: '/ts-type-driven/type-driven',
      exerciseIds: ['ts-discriminated-unions', 'ts-branded-types', 'ts-exhaustive-matching', 'ts-type-narrowing'],
    }],
  },
  {
    slug: 'ts-api-patterns',
    title: 'API Design Patterns',
    description: 'Builder pattern, fluent APIs, Result types, and error handling by design.',
    icon: '\u0054',
    order: 16,
    track: 'ts-design',
    language: 'typescript',
    status: 'available',
    prerequisites: ['ts-type-driven'],
    lessons: [{
      slug: 'api-patterns',
      title: 'API Design Patterns',
      path: '/ts-api-patterns/api-patterns',
      exerciseIds: ['ts-builder-pattern', 'ts-result-type', 'ts-fluent-api', 'ts-error-handling'],
    }],
  },
  {
    slug: 'ts-functional',
    title: 'Functional TypeScript',
    description: 'Immutability, pipe/compose, option chaining, and algebraic patterns.',
    icon: '\u0054',
    order: 17,
    track: 'ts-advanced',
    language: 'typescript',
    status: 'available',
    prerequisites: ['ts-api-patterns'],
    lessons: [{
      slug: 'functional',
      title: 'Functional TypeScript',
      path: '/ts-functional/functional',
      exerciseIds: ['ts-immutability', 'ts-pipe-compose', 'ts-option-pattern', 'ts-algebraic-effects'],
    }],
  },
  {
    slug: 'ts-type-level',
    title: 'Advanced Type System',
    description: 'Mapped types, conditional types, template literals, and type-level programming.',
    icon: '\u0054',
    order: 18,
    track: 'ts-advanced',
    language: 'typescript',
    status: 'available',
    prerequisites: ['ts-functional'],
    lessons: [{
      slug: 'type-level',
      title: 'Type-Level Programming',
      path: '/ts-type-level/type-level',
      exerciseIds: ['ts-mapped-types', 'ts-conditional-types', 'ts-template-literals', 'ts-type-challenges'],
    }],
  },

  // ── Rust ────────────────────────────────────────────────────────────

  {
    slug: 'rust-ownership-borrowing',
    title: 'Ownership & Borrowing',
    description: 'Move semantics, the borrow checker, lifetime annotations, and interior mutability.',
    icon: '\u0052',
    order: 19,
    track: 'rust-ownership',
    language: 'rust',
    status: 'available',
    prerequisites: [],
    lessons: [{
      slug: 'ownership',
      title: 'Ownership and Borrowing',
      path: '/rust-ownership-borrowing/ownership',
      exerciseIds: ['rust-move-semantics', 'rust-borrowing', 'rust-lifetimes', 'rust-interior-mutability'],
    }],
  },
  {
    slug: 'rust-zero-cost',
    title: 'Zero-Cost Abstractions',
    description: 'Traits, generics, iterators, and const generics — abstractions that compile to optimal code.',
    icon: '\u0052',
    order: 20,
    track: 'rust-ownership',
    language: 'rust',
    status: 'available',
    prerequisites: ['rust-ownership-borrowing'],
    lessons: [{
      slug: 'zero-cost',
      title: 'Zero-Cost Abstractions',
      path: '/rust-zero-cost/zero-cost',
      exerciseIds: ['rust-traits', 'rust-generics-monomorphization', 'rust-iterators', 'rust-const-generics'],
    }],
  },
  {
    slug: 'rust-unsafe-ffi',
    title: 'Unsafe & Soundness',
    description: 'Raw pointers, unsafe blocks, soundness reasoning, and when unsafe is justified.',
    icon: '\u0052',
    order: 21,
    track: 'rust-systems',
    language: 'rust',
    status: 'available',
    prerequisites: ['rust-zero-cost'],
    lessons: [{
      slug: 'unsafe',
      title: 'Unsafe Rust and Soundness',
      path: '/rust-unsafe-ffi/unsafe',
      exerciseIds: ['rust-raw-pointers', 'rust-unsafe-blocks', 'rust-soundness', 'rust-safe-abstractions'],
    }],
  },
  {
    slug: 'rust-crypto',
    title: 'Cryptographic Rust',
    description: 'Constant-time operations, field arithmetic, and EdDSA signatures in Rust.',
    icon: '\u0052',
    order: 22,
    track: 'rust-systems',
    language: 'rust',
    status: 'available',
    prerequisites: ['rust-unsafe-ffi'],
    lessons: [{
      slug: 'crypto',
      title: 'Cryptographic Implementations',
      path: '/rust-crypto/crypto',
      exerciseIds: ['rust-constant-time', 'rust-field-arithmetic', 'rust-eddsa', 'rust-hash-functions'],
    }],
  },

  // ── CUDA ───────────────────────────────────────────────────────────

  {
    slug: 'cuda-parallel',
    title: 'Parallel Fundamentals',
    description: 'Thread hierarchy, memory spaces, kernel launch syntax, and SIMT execution.',
    icon: '\u0043',
    order: 23,
    track: 'gpu-fundamentals',
    language: 'cuda',
    status: 'available',
    prerequisites: [],
    lessons: [{
      slug: 'parallel',
      title: 'CUDA Parallel Fundamentals',
      path: '/cuda-parallel/parallel',
      exerciseIds: ['cuda-thread-hierarchy', 'cuda-kernel-launch', 'cuda-memory-spaces', 'cuda-synchronization'],
    }],
  },
  {
    slug: 'cuda-memory',
    title: 'Memory Hierarchy',
    description: 'Global, shared, and register memory — coalesced access, bank conflicts, and tiling.',
    icon: '\u0043',
    order: 24,
    track: 'gpu-fundamentals',
    language: 'cuda',
    status: 'available',
    prerequisites: ['cuda-parallel'],
    lessons: [{
      slug: 'memory',
      title: 'GPU Memory Hierarchy',
      path: '/cuda-memory/memory',
      exerciseIds: ['cuda-global-memory', 'cuda-shared-memory', 'cuda-tiling', 'cuda-occupancy'],
    }],
  },
  {
    slug: 'cuda-advanced',
    title: 'Advanced Patterns',
    description: 'Warp-level primitives, parallel reduction, scan algorithms, and performance tuning.',
    icon: '\u0043',
    order: 25,
    track: 'gpu-fundamentals',
    language: 'cuda',
    status: 'available',
    prerequisites: ['cuda-memory'],
    lessons: [{
      slug: 'advanced',
      title: 'Advanced CUDA Patterns',
      path: '/cuda-advanced/advanced',
      exerciseIds: ['cuda-warp-primitives', 'cuda-reduction', 'cuda-scan', 'cuda-performance'],
    }],
  },

  // ── ROCm/HIP ──────────────────────────────────────────────────────

  {
    slug: 'rocm-fundamentals',
    title: 'HIP Fundamentals',
    description: 'CUDA to HIP translation, portable kernel design, and hipify patterns.',
    icon: '\u0048',
    order: 26,
    track: 'gpu-portable',
    language: 'rocm',
    status: 'available',
    prerequisites: ['cuda-parallel'],
    lessons: [{
      slug: 'hip',
      title: 'HIP Fundamentals',
      path: '/rocm-fundamentals/hip',
      exerciseIds: ['rocm-hip-basics', 'rocm-cuda-translation', 'rocm-portable-kernels', 'rocm-hipify'],
    }],
  },
  {
    slug: 'rocm-architecture',
    title: 'AMD Architecture',
    description: 'Wavefronts vs warps, LDS vs shared memory, GCN/RDNA differences.',
    icon: '\u0048',
    order: 27,
    track: 'gpu-portable',
    language: 'rocm',
    status: 'available',
    prerequisites: ['rocm-fundamentals'],
    lessons: [{
      slug: 'architecture',
      title: 'AMD GPU Architecture',
      path: '/rocm-architecture/architecture',
      exerciseIds: ['rocm-wavefronts', 'rocm-lds', 'rocm-gcn-rdna', 'rocm-profiling'],
    }],
  },

  // ── Advanced TypeScript ────────────────────────────────────────────

  {
    slug: 'ts-architecture',
    title: 'Software Architecture',
    description: 'Dependency injection, state machines, plugin systems, and module boundary design.',
    icon: '\u0054',
    order: 28,
    track: 'ts-architecture',
    language: 'typescript',
    status: 'available',
    prerequisites: ['ts-type-level'],
    lessons: [{
      slug: 'architecture',
      title: 'Software Architecture in TypeScript',
      path: '/ts-architecture/architecture',
      exerciseIds: ['ts-dependency-injection', 'ts-state-machines', 'ts-plugin-system', 'ts-module-boundaries'],
    }],
  },
  {
    slug: 'ts-patterns',
    title: 'Advanced Patterns',
    description: 'Phantom types, opaque types, typed events, and property-based testing.',
    icon: '\u0054',
    order: 29,
    track: 'ts-architecture',
    language: 'typescript',
    status: 'available',
    prerequisites: ['ts-architecture'],
    lessons: [{
      slug: 'patterns',
      title: 'Advanced TypeScript Patterns',
      path: '/ts-patterns/patterns',
      exerciseIds: ['ts-phantom-types', 'ts-opaque-types', 'ts-type-safe-events', 'ts-property-testing'],
    }],
  },
  {
    slug: 'ts-perf-module',
    title: 'Performance Taste',
    description: 'Structural sharing, lazy evaluation, object pooling, and memoization.',
    icon: '\u0054',
    order: 30,
    track: 'ts-perf',
    language: 'typescript',
    status: 'available',
    prerequisites: ['ts-patterns'],
    lessons: [{
      slug: 'performance',
      title: 'Performance Patterns',
      path: '/ts-perf-module/performance',
      exerciseIds: ['ts-structural-sharing', 'ts-lazy-evaluation', 'ts-object-pooling', 'ts-memoization'],
    }],
  },

  // ── Advanced Rust ──────────────────────────────────────────────────

  {
    slug: 'rust-async',
    title: 'Async Rust',
    description: 'Futures by hand, Pin/Unpin, async combinators, and channels.',
    icon: '\u0052',
    order: 31,
    track: 'rust-async-track',
    language: 'rust',
    status: 'available',
    prerequisites: ['rust-crypto'],
    lessons: [{
      slug: 'async',
      title: 'Async Rust from Scratch',
      path: '/rust-async/async',
      exerciseIds: ['rust-futures-basics', 'rust-pin-unpin', 'rust-async-patterns', 'rust-channels'],
    }],
  },
  {
    slug: 'rust-advanced-traits',
    title: 'Advanced Trait Patterns',
    description: 'Sealed traits, middleware composition, type-state, and GATs.',
    icon: '\u0052',
    order: 32,
    track: 'rust-async-track',
    language: 'rust',
    status: 'available',
    prerequisites: ['rust-async'],
    lessons: [{
      slug: 'advanced-traits',
      title: 'Advanced Trait Mastery',
      path: '/rust-advanced-traits/advanced-traits',
      exerciseIds: ['rust-sealed-traits', 'rust-tower-middleware', 'rust-type-state', 'rust-gats'],
    }],
  },
  {
    slug: 'rust-perf-module',
    title: 'Performance Engineering',
    description: 'Cache-friendly layouts, arena allocation, SIMD concepts, and zero-copy parsing.',
    icon: '\u0052',
    order: 33,
    track: 'rust-perf',
    language: 'rust',
    status: 'available',
    prerequisites: ['rust-advanced-traits'],
    lessons: [{
      slug: 'performance',
      title: 'Rust Performance Engineering',
      path: '/rust-perf-module/performance',
      exerciseIds: ['rust-cache-friendly', 'rust-arena-allocation', 'rust-simd-basics', 'rust-zero-copy'],
    }],
  },
];

// ── Helpers ────────────────────────────────────────────────────────

export function getModule(slug: string): CurriculumModule | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getModulesByTrack(trackSlug: TrackSlug): CurriculumModule[] {
  return modules.filter((m) => m.track === trackSlug).sort((a, b) => a.order - b.order);
}

export function getExerciseIdsForModule(moduleSlug: string): string[] {
  const mod = getModule(moduleSlug);
  if (!mod) return [];
  return mod.lessons.flatMap((l) => l.exerciseIds);
}

export function getAllModules(): CurriculumModule[] {
  return [...modules].sort((a, b) => a.order - b.order);
}
