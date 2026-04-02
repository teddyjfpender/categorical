/**
 * Single source of truth for the Categorical curriculum.
 *
 * All module, track, and lesson data lives here.
 * Sidebar, Dashboard, syllabus page, and exercises.ts all import from this file.
 */

export type ModuleStatus = 'available' | 'coming-soon';
export type TrackSlug = 'foundation' | 'category-theory' | 'algebra-crypto';

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
];

// ── Modules ────────────────────────────────────────────────────────

export const modules: CurriculumModule[] = [
  {
    slug: 'type-systems',
    title: 'Haskell Foundations',
    description: 'Functions, types, pattern matching, ADTs, polymorphism, and typeclasses.',
    icon: '\u03BB',
    order: 1,
    track: 'foundation',
    status: 'available',
    prerequisites: [],
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
    description: 'Finite fields, elliptic curves, and lattice-based constructions.',
    icon: '\uD83D\uDD10',
    order: 6,
    track: 'algebra-crypto',
    status: 'coming-soon',
    prerequisites: ['abstract-algebra', 'applicative-monad'],
    lessons: [],
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
