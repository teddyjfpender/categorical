# Categorical

Interactive learning platform for Haskell, type systems, and category theory. A structured curriculum with an embedded code editor, instant feedback, and progress tracking — inspired by [Total TypeScript](https://totaltypescript.com) and [AlgoExpert](https://algoexpert.io).

## Architecture

- **Astro 5** + **React** islands — static content with selectively hydrated interactive components
- **CodeMirror 6** — lightweight code editor with custom Haskell syntax highlighting
- **Tailwind CSS v4** — dark-themed UI
- **Zustand** + localStorage — client-side progress persistence (no backend required)
- **Mock execution engine** — pattern-based exercise validation (real GHC backend planned)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build for production
pnpm build

# Preview the production build
pnpm preview

# Run exercise validation tests
pnpm test
```

The dev server starts at `http://localhost:4321`.

## Project Structure

```
src/
├── components/
│   ├── editor/          # CodeMirror 6 wrapper + Haskell language support
│   ├── exercise/        # Legacy exercise components
│   ├── workspace/       # Split-pane IDE layout (main experience)
│   ├── progress/        # Dashboard components
│   └── ui/              # Shared UI (modals, syntax-highlighted content)
├── content/
│   └── lessons/         # MDX lesson content by module
├── layouts/             # Astro page layouts
├── lib/
│   ├── exercises.ts     # Exercise registry (starter code, solutions, tests)
│   ├── highlightHaskell.ts  # Static syntax highlighter for prose code blocks
│   ├── services/        # Execution service interface + mock executor
│   ├── stores/          # Zustand progress store
│   └── types/           # Shared TypeScript types
├── pages/               # Astro routes
└── styles/              # Global CSS + theme variables
```

## Curriculum

### Type Systems
- **Basic Types and Annotations** — type signatures, inference, polymorphism, typeclasses

### Category Theory
- **Functors** — fmap, Functor instances, functor laws, natural transformations

## Adding Exercises

Exercises are defined in `src/lib/exercises.ts`. Each exercise includes:

- `starterCode` — initial code shown to the user with guiding comments
- `solutionCode` — reference solution
- `description` — HTML content with syntax-highlighted code examples
- `hints` — progressive hints revealed one at a time
- `successPatterns` — regex patterns the mock executor checks against user code
- `testNames` — human-readable names for each pattern check

Run `pnpm test` after adding or modifying exercises to verify that all solutions pass and all starter codes correctly fail.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 5 + React islands |
| Editor | CodeMirror 6 |
| Content | MDX + Astro Content Collections |
| Styling | Tailwind CSS v4 |
| State | Zustand + localStorage |
| Execution | Mock (pattern-based), real GHC backend planned |
