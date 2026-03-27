import type { Exercise } from './types/exercise';

// Exercise registry — all exercises are defined here so they can be
// referenced by ID from MDX content and loaded by the ExerciseWorkspace.
// The Haskell code is inlined to keep everything in one place for v1.

const exercises: Record<string, Exercise> = {
  'type-annotations': {
    id: 'type-annotations',
    title: 'Add Type Annotations',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>Add explicit <strong>type signatures</strong> to the functions in the editor. Haskell can infer types automatically, but explicit annotations serve as documentation and catch errors early.</p>

<h3>What is a type signature?</h3>
<p>A type signature is written above a function using <code>::</code> (read as "has type"):</p>
<pre><code>double :: Int -> Int
double x = x * 2</code></pre>

<p>The arrow <code>-></code> separates argument types from the return type. Multiple arguments chain with arrows:</p>
<pre><code>add :: Int -> Int -> Int
add x y = x + y</code></pre>

<h3>Polymorphism and Constraints</h3>
<p>When a function works for <strong>any</strong> type, use a type variable (lowercase letter):</p>
<pre><code>identity :: a -> a
identity x = x</code></pre>

<p>If the function needs specific operations (like <code>+</code>), add a <strong>typeclass constraint</strong> before <code>=></code>:</p>
<pre><code>add :: Num a => a -> a -> a
add x y = x + y</code></pre>

<h3>Common Typeclasses</h3>
<table>
  <thead><tr><th>Typeclass</th><th>Provides</th><th>Example types</th></tr></thead>
  <tbody>
    <tr><td><code>Num</code></td><td><code>+</code>, <code>-</code>, <code>*</code></td><td><code>Int</code>, <code>Double</code></td></tr>
    <tr><td><code>Integral</code></td><td><code>div</code>, <code>mod</code></td><td><code>Int</code>, <code>Integer</code></td></tr>
    <tr><td><code>Eq</code></td><td><code>==</code>, <code>/=</code></td><td>Most types</td></tr>
    <tr><td><code>Show</code></td><td><code>show</code></td><td>Most types</td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Add a type signature line above each of the four functions in the editor. Each function already works — you just need to declare its type.</p>
`,
    starterCode: `module TypeAnnotations where

-- EXERCISE: Add a type signature above each function.
--
-- A type signature looks like:
--   functionName :: InputType -> OutputType
--
-- For example:
--   double :: Int -> Int
--   double x = x * 2

-- 1. What types does \`add\` take and return?
--    Hint: it uses (+), which requires the Num typeclass.
--    _ :: _
add x y = x + y

-- 2. \`greet\` takes a name and returns a greeting.
--    What's the type of a text value in Haskell?
--    _ :: _
greet name = "Hello, " ++ name ++ "!"

-- 3. \`isEven\` checks divisibility — what does mod require?
--    Hint: mod uses the Integral typeclass. The result is True/False.
--    _ :: _
isEven n = n \`mod\` 2 == 0

-- 4. \`head'\` extracts the first element of a list.
--    It works on a list of *any* type — use a type variable.
--    _ :: _
head' (x:_) = x
head' []    = error "empty list"
`,
    solutionCode: `module TypeAnnotations where

add :: Num a => a -> a -> a
add x y = x + y

greet :: String -> String
greet name = "Hello, " ++ name ++ "!"

isEven :: Integral a => a -> Bool
isEven n = n \`mod\` 2 == 0

head' :: [a] -> a
head' (x:_) = x
head' []    = error "empty list"
`,
    testCode: `-- Tests check that type signatures are present and correct`,
    hints: [
      'A type signature goes on the line above the function: <code>name :: Type</code>',
      'For <code>add</code>, the constraint is <code>Num a =></code> because it uses <code>+</code>. The signature is <code>Num a => a -> a -> a</code>.',
      'For <code>greet</code>, strings in Haskell are <code>String</code> (or <code>[Char]</code>). It takes a <code>String</code> and returns a <code>String</code>.',
      'For <code>head\'</code>, it works on any list — the signature is <code>[a] -> a</code> where <code>a</code> is a type variable.',
    ],
    concepts: ['type-signatures', 'type-inference', 'typeclasses', 'polymorphism'],
    successPatterns: [
      'add\\s*::',
      'greet\\s*::',
      'isEven\\s*::',
      "head'\\s*::",
    ],
    testNames: [
      'add has a type signature',
      'greet has a type signature',
      'isEven has a type signature',
      "head' has a type signature",
    ],
  },

  'algebraic-data-types': {
    id: 'algebraic-data-types',
    title: 'Define a Shape Type',
    difficulty: 'beginner',
    order: 2,
    description: `
<p>Define an <strong>algebraic data type</strong> (ADT) called <code>Shape</code> and implement an <code>area</code> function using pattern matching.</p>

<h3>What are ADTs?</h3>
<p>Algebraic data types let you define types with multiple <strong>constructors</strong>. Each constructor can hold different data:</p>
<pre><code>data Color = Red | Green | Blue

data Expr
  = Lit Double          -- a literal number
  | Add Expr Expr       -- sum of two expressions
  | Mul Expr Expr       -- product of two expressions</code></pre>

<p>These are called <strong>sum types</strong> because a value is one constructor <em>or</em> another (like a tagged union).</p>

<h3>Pattern Matching</h3>
<p>You handle each constructor with its own equation:</p>
<pre><code>eval :: Expr -> Double
eval (Lit n)     = n
eval (Add e1 e2) = eval e1 + eval e2
eval (Mul e1 e2) = eval e1 * eval e2</code></pre>

<p>The compiler warns you if you forget a constructor — one of Haskell's great safety features.</p>

<h3>Your Task</h3>
<p>Define <code>Shape</code> with three constructors, then implement <code>area</code>:</p>
<table>
  <thead><tr><th>Constructor</th><th>Fields</th><th>Area formula</th></tr></thead>
  <tbody>
    <tr><td><code>Circle</code></td><td>radius (<code>Double</code>)</td><td><code>pi * r * r</code></td></tr>
    <tr><td><code>Rectangle</code></td><td>width, height (<code>Double</code>, <code>Double</code>)</td><td><code>w * h</code></td></tr>
    <tr><td><code>Triangle</code></td><td>base, height (<code>Double</code>, <code>Double</code>)</td><td><code>0.5 * b * h</code></td></tr>
  </tbody>
</table>
`,
    starterCode: `module Shapes where

-- EXERCISE: Define the Shape data type and an area function.
--
-- An algebraic data type uses the \`data\` keyword:
--   data Color = Red | Green | Blue
--
-- Constructors can hold values:
--   data Expr = Lit Double | Add Expr Expr

-- 1. Define Shape with three constructors:
--    - Circle: holds a radius (Double)
--    - Rectangle: holds width and height (Double, Double)
--    - Triangle: holds base and height (Double, Double)
--
-- Uncomment and complete:
-- data Shape
--   = Circle _
--   | Rectangle _ _
--   | Triangle _ _
--   deriving (Show, Eq)

-- 2. Implement area using pattern matching.
--    Each constructor needs its own equation:
--
-- area :: Shape -> Double
-- area (Circle r)      = _
-- area (Rectangle w h) = _
-- area (Triangle b h)  = _
`,
    solutionCode: `module Shapes where

data Shape
  = Circle Double
  | Rectangle Double Double
  | Triangle Double Double
  deriving (Show, Eq)

area :: Shape -> Double
area (Circle r)      = pi * r * r
area (Rectangle w h) = w * h
area (Triangle b h)  = 0.5 * b * h
`,
    testCode: `-- Tests verify Shape constructors exist and area computes correctly`,
    hints: [
      'Start by uncommenting the <code>data Shape</code> block and replacing the underscores with <code>Double</code>.',
      'Circle holds one Double (radius), Rectangle and Triangle each hold two Doubles.',
      'For area: Circle uses <code>pi * r * r</code>, Rectangle uses <code>w * h</code>, Triangle uses <code>0.5 * b * h</code>.',
    ],
    concepts: ['algebraic-data-types', 'pattern-matching', 'constructors', 'sum-types'],
    successPatterns: [
      'data\\s+Shape',
      'Circle\\s+Double',
      'Rectangle\\s+Double\\s+Double',
      'area\\s*::',
      'area\\s*\\(Circle',
    ],
    testNames: [
      'Shape data type is defined',
      'Circle constructor takes a Double',
      'Rectangle constructor takes two Doubles',
      'area function has a type signature',
      'area pattern-matches on Circle',
    ],
  },

  'parametric-polymorphism': {
    id: 'parametric-polymorphism',
    title: 'Write Generic Functions',
    difficulty: 'beginner',
    order: 3,
    description: `
<p>Implement <strong>parametrically polymorphic</strong> functions — functions that work for <em>any</em> type without knowing what the type is.</p>

<h3>What is parametric polymorphism?</h3>
<p>A function like <code>identity :: a -> a</code> works for every type. The <code>a</code> is a <strong>type variable</strong> — it can be <code>Int</code>, <code>String</code>, <code>[Bool]</code>, anything:</p>
<pre><code>identity :: a -> a
identity x = x

identity 42       -- 42
identity "hello"  -- "hello"
identity [True]   -- [True]</code></pre>

<h3>The Free Theorem</h3>
<p>The remarkable thing: because the function doesn't know what <code>a</code> is, it <strong>can't inspect the value</strong>. It can only rearrange structure. This severely limits what the function <em>can</em> do — which is a feature! It makes the function's behavior <strong>predictable from the type alone</strong>.</p>

<p>For example, there is only <strong>one</strong> function with type <code>(a, b) -> (b, a)</code> — it must swap the elements.</p>

<h3>Tuples and Higher-Order Functions</h3>
<p>Haskell tuples use parentheses and commas. Pattern match to extract elements:</p>
<pre><code>fst :: (a, b) -> a
fst (x, _) = x

snd :: (a, b) -> b
snd (_, y) = y</code></pre>

<p>Functions can take other functions as arguments (<strong>higher-order functions</strong>):</p>
<pre><code>apply :: (a -> b) -> a -> b
apply f x = f x</code></pre>

<h3>Your Task</h3>
<p>Implement three functions: <code>swap</code> (reverse a pair), <code>both</code> (apply a function to both elements), and <code>compose</code> (chain two functions).</p>
`,
    starterCode: `module Polymorphism where

-- EXERCISE: Replace each \`error "..."\` with a real implementation.
--
-- These functions are polymorphic — they work for ANY type.
-- That means you can't look at the values, only rearrange them.

-- 1. Swap the elements of a pair.
--    Pattern match on the tuple: (a, b) -> (b, a)
swap :: (a, b) -> (b, a)
swap pair = error "implement swap"
-- Hint: swap (x, y) = ???

-- 2. Apply a function to both elements of a pair.
both :: (a -> b) -> (a, a) -> (b, b)
both f pair = error "implement both"
-- Hint: both f (x, y) = (???, ???)

-- 3. Function composition: apply g first, then f.
--    This is the same as the (.) operator in Haskell.
compose :: (b -> c) -> (a -> b) -> a -> c
compose f g x = error "implement compose"
-- Hint: compose f g x = f (???)
`,
    solutionCode: `module Polymorphism where

swap :: (a, b) -> (b, a)
swap (a, b) = (b, a)

both :: (a -> b) -> (a, a) -> (b, b)
both f (x, y) = (f x, f y)

compose :: (b -> c) -> (a -> b) -> a -> c
compose f g x = f (g x)
`,
    testCode: `-- Tests verify functions work with multiple types`,
    hints: [
      'For <code>swap</code>, destructure the tuple in the argument: <code>swap (x, y) = (y, x)</code>',
      'For <code>both</code>, apply <code>f</code> to each element: <code>both f (x, y) = (f x, f y)</code>',
      'For <code>compose</code>, <code>g</code> transforms <code>x</code> first, then <code>f</code> transforms the result: <code>f (g x)</code>',
    ],
    concepts: ['parametric-polymorphism', 'higher-order-functions', 'function-composition'],
    successPatterns: [
      'swap\\s*\\(\\w+\\s*,\\s*\\w+\\)',
      'both\\s+\\w+\\s*\\(\\w+\\s*,\\s*\\w+\\)',
      'compose\\s+\\w+\\s+\\w+\\s+\\w+\\s*=',
    ],
    testNames: [
      'swap destructures and reverses the pair',
      'both applies the function to both elements',
      'compose chains two functions correctly',
    ],
  },

  'functor-instance': {
    id: 'functor-instance',
    title: 'Implement Functor for a Binary Tree',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>Implement the <strong>Functor</strong> instance for a binary tree. This is your first encounter with one of Haskell's most important typeclasses.</p>

<h3>What is a Functor?</h3>
<p>A Functor is a type that supports <strong>mapping a function over its contents</strong> while preserving structure. If you've used <code>map</code> on a list, you already know the idea:</p>
<pre><code>map (+1) [1, 2, 3]  -- [2, 3, 4]
-- Length preserved, order preserved, only values change</code></pre>

<p>The <code>Functor</code> typeclass generalizes this to any container:</p>
<pre><code>class Functor f where
  fmap :: (a -> b) -> f a -> f b</code></pre>

<h3>How fmap works on common types</h3>
<pre><code>fmap (+1) (Just 5)        -- Just 6
fmap (+1) Nothing         -- Nothing
fmap (*2) [1, 2, 3]      -- [2, 4, 6]
fmap show (Right 42)      -- Right "42"</code></pre>

<p>Notice: <code>fmap</code> never changes the <em>structure</em> — a <code>Nothing</code> stays <code>Nothing</code>, a 3-element list stays 3 elements.</p>

<h3>The Binary Tree</h3>
<p>Our tree has two constructors:</p>
<pre><code>data Tree a
  = Leaf a                   -- holds a single value
  | Branch (Tree a) (Tree a) -- holds two subtrees</code></pre>

<p>Visually:</p>
<pre><code>    Branch
   /      \\
 Leaf 1   Branch
         /      \\
       Leaf 2  Leaf 3</code></pre>

<h3>Your Task</h3>
<p>Implement <code>fmap</code> for <code>Tree</code>. Think about two cases:</p>
<ul>
  <li><strong>Leaf x</strong> — apply the function to <code>x</code>, wrap result back in <code>Leaf</code></li>
  <li><strong>Branch l r</strong> — recursively <code>fmap</code> over both subtrees</li>
</ul>
`,
    starterCode: `module TreeFunctor where

data Tree a
  = Leaf a
  | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

-- EXERCISE: Implement fmap for Tree.
--
-- fmap applies a function to every value in the tree,
-- while keeping the tree's shape exactly the same.
--
-- There are two cases to handle:
--   Leaf x     -> what should happen to x?
--   Branch l r -> what should happen to each subtree?

instance Functor Tree where
  -- fmap :: (a -> b) -> Tree a -> Tree b
  fmap f (Leaf x)     = error "handle the Leaf case"
  fmap f (Branch l r) = error "handle the Branch case"
`,
    solutionCode: `module TreeFunctor where

data Tree a
  = Leaf a
  | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

instance Functor Tree where
  fmap f (Leaf x)     = Leaf (f x)
  fmap f (Branch l r) = Branch (fmap f l) (fmap f r)
`,
    testCode: `-- Tests check fmap applies to all values and preserves structure`,
    hints: [
      'For <code>Leaf x</code>: apply the function to <code>x</code> and wrap it back: <code>Leaf (f x)</code>',
      'For <code>Branch l r</code>: recursively fmap over both subtrees: <code>Branch (fmap f l) (fmap f r)</code>',
      'The key insight: Leaf is the base case, Branch is the recursive case — just like a list.',
    ],
    concepts: ['functor', 'fmap', 'typeclass-instance', 'recursive-types'],
    successPatterns: [
      'Leaf\\s*\\(f\\s+\\w+\\)',
      'Branch\\s*\\(fmap',
    ],
    testNames: [
      'fmap applies function inside Leaf',
      'fmap recursively maps over Branch subtrees',
      'tree structure is preserved',
    ],
  },

  'functor-laws': {
    id: 'functor-laws',
    title: 'Verify the Functor Laws',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>A valid <code>Functor</code> must satisfy two <strong>laws</strong>. These aren't enforced by the compiler — it's on you to ensure your instance is lawful. Write functions that test both laws.</p>

<h3>Why laws?</h3>
<p>Without laws, <code>fmap</code> could do anything — reorder elements, duplicate them, drop some. The laws guarantee <code>fmap</code> truly preserves structure.</p>

<h3>Law 1: Identity</h3>
<pre><code>fmap id == id

-- In other words:
fmap id tree == tree</code></pre>
<p>Mapping the <strong>do-nothing function</strong> (<code>id</code>) over a structure should change nothing. If your functor passes this, it's not adding or removing elements.</p>

<h3>Law 2: Composition</h3>
<pre><code>fmap (f . g) == fmap f . fmap g

-- In other words:
fmap (f . g) tree == (fmap f . fmap g) tree</code></pre>
<p>Mapping a <strong>composed function</strong> is the same as mapping each function in sequence. If your functor passes this, it's not reordering elements or depending on the function.</p>

<h3>Example</h3>
<pre><code>let tree = Branch (Leaf 1) (Leaf 2)

-- Identity law:
fmap id tree          -- Branch (Leaf 1) (Leaf 2) ✓
tree                  -- Branch (Leaf 1) (Leaf 2) ✓

-- Composition law with f = show, g = (+1):
fmap (show . (+1)) tree       -- Branch (Leaf "2") (Leaf "3")
(fmap show . fmap (+1)) tree  -- Branch (Leaf "2") (Leaf "3") ✓</code></pre>

<h3>Your Task</h3>
<p>Implement <code>identityLaw</code> and <code>compositionLaw</code> — each should return <code>True</code> when the law holds. Use <code>==</code> to compare both sides.</p>
`,
    starterCode: `module FunctorLaws where

data Tree a
  = Leaf a
  | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

instance Functor Tree where
  fmap f (Leaf x)     = Leaf (f x)
  fmap f (Branch l r) = Branch (fmap f l) (fmap f r)

-- EXERCISE: Implement these law-checking functions.
--
-- Each function should return True if the law holds.
-- Use (==) to compare both sides of the equation.

-- Identity law: fmap id tree  ==  tree
-- "Mapping the do-nothing function changes nothing."
identityLaw :: Eq a => Tree a -> Bool
identityLaw tree = error "compare: fmap id tree  vs  tree"

-- Composition law: fmap (f . g) tree  ==  (fmap f . fmap g) tree
-- "Mapping a composed function equals composing the maps."
compositionLaw :: Eq c => (b -> c) -> (a -> b) -> Tree a -> Bool
compositionLaw f g tree = error "compare: fmap (f . g) tree  vs  (fmap f . fmap g) tree"
`,
    solutionCode: `module FunctorLaws where

data Tree a
  = Leaf a
  | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

instance Functor Tree where
  fmap f (Leaf x)     = Leaf (f x)
  fmap f (Branch l r) = Branch (fmap f l) (fmap f r)

identityLaw :: Eq a => Tree a -> Bool
identityLaw tree = fmap id tree == tree

compositionLaw :: Eq c => (b -> c) -> (a -> b) -> Tree a -> Bool
compositionLaw f g tree = fmap (f . g) tree == (fmap f . fmap g) tree
`,
    testCode: `-- Tests verify the law-checking functions work correctly`,
    hints: [
      'For <code>identityLaw</code>: compare <code>fmap id tree</code> with <code>tree</code> using <code>==</code>',
      'For <code>compositionLaw</code>: the left side is <code>fmap (f . g) tree</code>, the right side is <code>(fmap f . fmap g) tree</code>',
      'Both are one-liners — just translate the mathematical equation into Haskell using <code>==</code>.',
    ],
    concepts: ['functor-laws', 'identity', 'composition', 'equational-reasoning'],
    successPatterns: [
      'fmap\\s+id\\s+\\w+\\s*==\\s*\\w+',
      'fmap\\s*\\(f\\s*\\.\\s*g\\)',
    ],
    testNames: [
      'identityLaw correctly checks fmap id == id',
      'compositionLaw correctly checks fmap (f . g) == fmap f . fmap g',
    ],
  },

  'natural-transformation': {
    id: 'natural-transformation',
    title: 'Write Natural Transformations',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>A <strong>natural transformation</strong> converts one functor to another without looking at the values inside. In Haskell, it's a polymorphic function <code>forall a. F a -> G a</code>.</p>

<h3>Intuition</h3>
<p>Think of functors as containers. A natural transformation changes the <em>container</em>, not the <em>contents</em>:</p>
<pre><code>-- Maybe → List: change the container from Maybe to []
maybeToList (Just 42) = [42]
maybeToList Nothing   = []

-- The value 42 is untouched — only the wrapping changed.</code></pre>

<h3>The Naturality Condition</h3>
<p>For any natural transformation <code>alpha</code>, this diagram commutes:</p>
<pre><code>fmap f . alpha  ==  alpha . fmap f

-- It doesn't matter whether you:
--   1. Transform then map, OR
--   2. Map then transform
-- You get the same result either way.</code></pre>

<p>Example with <code>maybeToList</code>:</p>
<pre><code>-- Path 1: transform then map
fmap (+1) (maybeToList (Just 5))
= fmap (+1) [5]
= [6]

-- Path 2: map then transform
maybeToList (fmap (+1) (Just 5))
= maybeToList (Just 6)
= [6]     -- Same! ✓</code></pre>

<h3>Pattern Matching on Constructors</h3>
<p>Each natural transformation pattern-matches on the source functor's constructors:</p>
<pre><code>-- Maybe has two constructors: Nothing, Just x
-- [] has two base cases: [], [x]
-- Either has two constructors: Left e, Right x</code></pre>

<h3>Your Task</h3>
<p>Implement three natural transformations:</p>
<ul>
  <li><code>maybeToList</code> — <code>Nothing → []</code>, <code>Just x → [x]</code></li>
  <li><code>listToMaybe</code> — <code>[] → Nothing</code>, <code>(x:_) → Just x</code></li>
  <li><code>eitherToMaybe</code> — <code>Left _ → Nothing</code>, <code>Right x → Just x</code></li>
</ul>
`,
    starterCode: `module NaturalTransformations where

-- EXERCISE: Implement each natural transformation.
--
-- A natural transformation converts one "container" to another
-- without looking at what's inside. It can only restructure.
--
-- Pattern match on each constructor of the input type.

-- 1. Maybe -> List
--    Nothing has no value — what list has no elements?
--    Just x has one value — what list has one element?
maybeToList :: Maybe a -> [a]
maybeToList = error "implement maybeToList"
-- maybeToList Nothing  = ???
-- maybeToList (Just x) = ???

-- 2. List -> Maybe (take the first element, if it exists)
listToMaybe :: [a] -> Maybe a
listToMaybe = error "implement listToMaybe"
-- listToMaybe []    = ???
-- listToMaybe (x:_) = ???

-- 3. Either e a -> Maybe a (discard the error, keep the value)
eitherToMaybe :: Either e a -> Maybe a
eitherToMaybe = error "implement eitherToMaybe"
-- eitherToMaybe (Left _)  = ???
-- eitherToMaybe (Right x) = ???
`,
    solutionCode: `module NaturalTransformations where

maybeToList :: Maybe a -> [a]
maybeToList Nothing  = []
maybeToList (Just x) = [x]

listToMaybe :: [a] -> Maybe a
listToMaybe []    = Nothing
listToMaybe (x:_) = Just x

eitherToMaybe :: Either e a -> Maybe a
eitherToMaybe (Left _)  = Nothing
eitherToMaybe (Right x) = Just x
`,
    testCode: `-- Tests verify natural transformations and naturality condition`,
    hints: [
      'For <code>maybeToList</code>: <code>Nothing</code> becomes <code>[]</code>, <code>Just x</code> becomes <code>[x]</code>',
      'For <code>listToMaybe</code>: <code>[]</code> becomes <code>Nothing</code>, <code>(x:_)</code> becomes <code>Just x</code>',
      'For <code>eitherToMaybe</code>: <code>Left _</code> becomes <code>Nothing</code>, <code>Right x</code> becomes <code>Just x</code>',
    ],
    concepts: ['natural-transformation', 'polymorphism', 'functor', 'structure-preservation'],
    successPatterns: [
      'maybeToList\\s+Nothing\\s*=\\s*\\[\\]',
      'maybeToList\\s*\\(Just',
      'listToMaybe\\s+\\[\\]',
      'eitherToMaybe\\s*\\(Right',
    ],
    testNames: [
      'maybeToList handles Nothing',
      'maybeToList handles Just',
      'listToMaybe handles empty list',
      'eitherToMaybe handles Right',
    ],
  },
};

export function getExercise(id: string): Exercise | undefined {
  return exercises[id];
}

export function getExercisesByModule(moduleSlug: string): Exercise[] {
  const moduleExerciseIds: Record<string, string[]> = {
    'type-systems': ['type-annotations', 'algebraic-data-types', 'parametric-polymorphism'],
    'category-theory': ['functor-instance', 'functor-laws', 'natural-transformation'],
  };

  const ids = moduleExerciseIds[moduleSlug] || [];
  return ids.map((id) => exercises[id]).filter(Boolean);
}

export function getAllExercises(): Exercise[] {
  return Object.values(exercises);
}

export function getExerciseIds(): string[] {
  return Object.keys(exercises);
}
