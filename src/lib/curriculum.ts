/**
 * Single source of truth for the Categorical curriculum.
 *
 * All module, track, and lesson data lives here.
 * Sidebar, Dashboard, syllabus page, and exercises.ts all import from this file.
 */

export type ModuleStatus = 'available' | 'coming-soon';
export type TrackSlug = 'foundation' | 'category-theory' | 'algebra-crypto' | 'algorithms'
  | 'applied-ct' | 'languages' | 'linear-algebra' | 'verified-crypto';

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
];

// ── Modules ────────────────────────────────────────────────────────

export const modules: CurriculumModule[] = [
  {
    slug: 'reading-haskell',
    title: 'Reading Haskell',
    description: 'Learn to read Haskell before writing it — values, expressions, functions, types, and application.',
    icon: '\uD83D\uDC41',
    order: 0,
    track: 'foundation',
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
    icon: '\uD83D\uDD10',
    order: 6,
    track: 'algebra-crypto',
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
    icon: '\uD83D\uDD12',
    order: 11,
    track: 'verified-crypto',
    status: 'available',
    prerequisites: ['algebraic-cryptography', 'typed-linear-algebra'],
    lessons: [{
      slug: 'protocols',
      title: 'Cryptographic Protocols',
      path: '/verified-cryptographic-protocols/protocols',
      exerciseIds: ['polynomial-arithmetic', 'lagrange-interpolation', 'shamir-secret-sharing', 'schnorr-protocol'],
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
