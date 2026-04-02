import type { Exercise } from './types/exercise';

// ────────────────────────────────────────────────────────────────────
// Exercise Registry
//
// Exercises are grouped by module and ordered for progressive learning.
// Each exercise builds on what the previous one taught — no gaps.
//
// Type Systems module (7 exercises):
//   1. basic-functions        — defining functions, Haskell syntax basics
//   2. concrete-types         — type signatures with concrete types
//   3. pattern-matching       — pattern matching on Bool, Maybe, lists
//   4. algebraic-data-types   — defining custom types + matching on them
//   5. polymorphic-types      — type variables, constraints, typeclasses
//   6. parametric-polymorphism — free theorems, tuples, HOFs, composition
//   7. typeclasses-intro      — writing typeclass instances
//
// Category Theory module (4 exercises):
//   1. using-fmap             — use fmap on standard types (no instance writing)
//   2. functor-instance       — write a Functor instance for a custom type
//   3. functor-laws           — verify the Functor laws
//   4. natural-transformation — write natural transformations
// ────────────────────────────────────────────────────────────────────

const exercises: Record<string, Exercise> = {

  // ═══════════════════════════════════════════════════════════════════
  // TYPE SYSTEMS MODULE
  // ═══════════════════════════════════════════════════════════════════

  'basic-functions': {
    id: 'basic-functions',
    title: 'Define Your First Functions',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>Welcome to Haskell! In this exercise you'll define simple functions to learn the basic syntax.</p>

<h3>Defining Functions</h3>
<p>In Haskell, a function is defined with <code>=</code>. Arguments are separated by spaces — no parentheses needed:</p>
<pre><code>double x = x * 2
</code></pre>
<p>Call it the same way:</p>
<pre><code>double 5    -- result: 10
double 100  -- result: 200</code></pre>

<h3>Key Differences from Other Languages</h3>
<ul>
  <li><code>=</code> means <strong>definition</strong>, not assignment. <code>double x = x * 2</code> means "double of x <em>is defined as</em> x * 2."</li>
  <li>No <code>return</code> keyword — the right side of <code>=</code> is the result.</li>
  <li>No parentheses around arguments: <code>add x y = x + y</code>, not <code>add(x, y)</code>.</li>
  <li>Strings use double quotes: <code>"hello"</code>. String concatenation uses <code>++</code>.</li>
</ul>

<h3>Useful Operators</h3>
<table>
  <thead><tr><th>Operator</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>+</code>, <code>-</code>, <code>*</code></td><td>Arithmetic</td><td><code>3 + 4</code> gives <code>7</code></td></tr>
    <tr><td><code>++</code></td><td>Concatenate strings/lists</td><td><code>"hi" ++ "!"</code> gives <code>"hi!"</code></td></tr>
    <tr><td><code>==</code>, <code>/=</code></td><td>Equal, not equal</td><td><code>3 == 3</code> gives <code>True</code></td></tr>
    <tr><td><code>mod</code></td><td>Remainder (infix with backticks)</td><td><code>7 \`mod\` 3</code> gives <code>1</code></td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Implement four simple functions. Each one is a single line.</p>
`,
    starterCode: `module BasicFunctions where

-- EXERCISE: Implement each function.
-- Replace the \`error "..."\` with your code.

-- 1. Return the square of a number.
--    Example: square 4 = 16
square x = error "implement square"

-- 2. Greet someone by name.
--    Example: greet "Alice" = "Hello, Alice!"
--    Use ++ to join strings.
greet name = error "implement greet"

-- 3. Check if a number is negative.
--    Example: isNegative (-3) = True, isNegative 5 = False
--    Use < to compare.
isNegative n = error "implement isNegative"

-- 4. Return the larger of two numbers.
--    Example: larger 3 7 = 7
--    Use an if-then-else expression:
--      if condition then valueA else valueB
larger x y = error "implement larger"
`,
    solutionCode: `module BasicFunctions where

square x = x * x

greet name = "Hello, " ++ name ++ "!"

isNegative n = n < 0

larger x y = if x > y then x else y
`,
    testCode: `runTestEq "square 4 = 16" (16 :: Int) (square 4)
        , runTestEq "square 0 = 0" (0 :: Int) (square 0)
        , runTestEq "square (-3) = 9" (9 :: Int) (square (-3))
        , runTestEq "greet Alice" "Hello, Alice!" (greet "Alice")
        , runTestEq "greet world" "Hello, world!" (greet "world")
        , runTestEq "isNegative (-3)" True (isNegative (-3))
        , runTestEq "isNegative 5" False (isNegative 5)
        , runTestEq "isNegative 0" False (isNegative 0)
        , runTestEq "larger 3 7 = 7" (7 :: Int) (larger 3 7)
        , runTestEq "larger 10 2 = 10" (10 :: Int) (larger 10 2)`,
    hints: [
      'For <code>square</code>, multiply <code>x</code> by itself.',
      'For <code>greet</code>, use <code>++</code> to join three parts: <code>"Hello, "</code>, the name, and <code>"!"</code>.',
      'For <code>isNegative</code>, compare <code>n</code> with <code>0</code> using <code>&lt;</code>.',
      'For <code>larger</code>: <code>if x > y then x else y</code>.',
    ],
    concepts: ['functions', 'expressions', 'operators', 'if-then-else'],
    successPatterns: [
      'square\\s+\\w+\\s*=\\s*\\w+\\s*\\*\\s*\\w+',
      'greet\\s+\\w+\\s*=.*\\+\\+.*\\+\\+',
      'isNegative\\s+\\w+\\s*=.*<',
      'larger\\s+\\w+\\s+\\w+\\s*=\\s*if',
    ],
    testNames: [
      'square multiplies the number by itself',
      'greet concatenates strings with ++',
      'isNegative compares with 0',
      'larger uses if-then-else',
    ],
  },

  'concrete-types': {
    id: 'concrete-types',
    title: 'Add Type Signatures',
    difficulty: 'beginner',
    order: 2,
    description: `
<p>Every value in Haskell has a <strong>type</strong>. The compiler can figure out types automatically (called <em>type inference</em>), but writing them explicitly is good practice — they serve as documentation and catch errors early.</p>

<h3>Type Signatures</h3>
<p>A type signature goes on the line <strong>above</strong> a function definition, using <code>::</code> (read as "has type"):</p>
<pre><code>double :: Int -> Int
double x = x * 2</code></pre>
<p>This says: <code>double</code> takes an <code>Int</code> and returns an <code>Int</code>.</p>

<p>Multiple arguments chain with arrows:</p>
<pre><code>add :: Int -> Int -> Int
add x y = x + y</code></pre>
<p>Read this as: takes an <code>Int</code>, then another <code>Int</code>, returns an <code>Int</code>.</p>

<h3>Common Types</h3>
<table>
  <thead><tr><th>Type</th><th>Values</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>Int</code></td><td>Whole numbers</td><td><code>42</code>, <code>-7</code></td></tr>
    <tr><td><code>Double</code></td><td>Decimal numbers</td><td><code>3.14</code>, <code>-0.5</code></td></tr>
    <tr><td><code>Bool</code></td><td><code>True</code> or <code>False</code></td><td><code>True</code></td></tr>
    <tr><td><code>String</code></td><td>Text (list of characters)</td><td><code>"hello"</code></td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Add a type signature line above each of the four functions. The functions already work — you're just declaring their types.</p>
`,
    starterCode: `module ConcreteTypes where

-- EXERCISE: Add a type signature above each function.
--
-- A type signature looks like:
--   functionName :: InputType -> ReturnType
--
-- For example:
--   double :: Int -> Int
--   double x = x * 2

-- 1. square takes an Int and returns an Int.
--    _ :: _
square x = x * x

-- 2. greet takes a String and returns a String.
--    _ :: _
greet name = "Hello, " ++ name ++ "!"

-- 3. isNegative takes an Int and returns a Bool.
--    _ :: _
isNegative n = n < 0

-- 4. add takes two Ints and returns an Int.
--    _ :: _
add x y = x + y
`,
    solutionCode: `module ConcreteTypes where

square :: Int -> Int
square x = x * x

greet :: String -> String
greet name = "Hello, " ++ name ++ "!"

isNegative :: Int -> Bool
isNegative n = n < 0

add :: Int -> Int -> Int
add x y = x + y
`,
    testCode: `runTestEq "square 5 = 25" (25 :: Int) (square 5)
        , runTestEq "greet Bob" "Hello, Bob!" (greet "Bob")
        , runTestEq "isNegative (-1)" True (isNegative (-1))
        , runTestEq "isNegative 0" False (isNegative 0)
        , runTestEq "add 3 4 = 7" (7 :: Int) (add 3 4)`,
    hints: [
      'Write the signature on the line directly above the function. For example, above <code>square x = x * x</code> write <code>square :: ...</code>.',
      'Look at what goes in and what comes out. <code>square</code> takes a number (<code>Int</code>) and returns a number (<code>Int</code>).',
      'For <code>isNegative</code>, the result is <code>True</code> or <code>False</code> — that\'s the <code>Bool</code> type.',
      'For <code>add</code>, there are two arguments: <code>add :: Int -> Int -> Int</code>.',
    ],
    concepts: ['type-signatures', 'basic-types', 'Int', 'Bool', 'String'],
    successPatterns: [
      'square\\s*::',
      'greet\\s*::',
      'isNegative\\s*::',
      'add\\s*::',
    ],
    testNames: [
      'square has a type signature',
      'greet has a type signature',
      'isNegative has a type signature',
      'add has a type signature',
    ],
  },

  'pattern-matching': {
    id: 'pattern-matching',
    title: 'Pattern Matching',
    difficulty: 'beginner',
    order: 3,
    description: `
<p><strong>Pattern matching</strong> is how Haskell handles different cases. Instead of if-else chains, you write one equation per case:</p>

<pre><code>describe :: Bool -> String
describe True  = "yes"
describe False = "no"</code></pre>

<p>Haskell tries each equation top to bottom. The first pattern that matches runs.</p>

<h3>Matching on Lists</h3>
<p>A list is either empty (<code>[]</code>) or has a head and tail (<code>x:xs</code>):</p>
<pre><code>isEmpty :: [a] -> Bool
isEmpty []    = True
isEmpty (_:_) = False</code></pre>
<p>The underscore <code>_</code> means "I don't care about this value."</p>

<h3>The Maybe Type</h3>
<p><code>Maybe a</code> represents a value that might not exist. It has two constructors:</p>
<pre><code>-- Maybe has two cases:
--   Nothing   — no value
--   Just x    — a value x

fromMaybe :: a -> Maybe a -> a
fromMaybe fallback Nothing  = fallback
fromMaybe _        (Just x) = x</code></pre>
<p>Think of <code>Maybe</code> as a safe version of null — the type system forces you to handle the missing case.</p>

<h3>Your Task</h3>
<p>Implement four functions using pattern matching. Each function needs multiple equations — one per case.</p>
`,
    starterCode: `module PatternMatching where

-- EXERCISE: Implement each function using pattern matching.
-- Write one equation per case (no if-then-else needed).

-- 1. Convert a Bool to "yes" or "no".
--    Example: boolToString True = "yes"
boolToString :: Bool -> String
boolToString True  = error "implement True case"
boolToString False = error "implement False case"

-- 2. Get the first element of a list, or a default if empty.
--    Example: headOr 0 [1,2,3] = 1
--    Example: headOr 0 []      = 0
--    Pattern: (x:_) matches a non-empty list, [] matches empty.
headOr :: a -> [a] -> a
headOr fallback []    = error "implement empty case"
headOr _        (x:_) = error "implement non-empty case"

-- 3. Return True if a Maybe contains a value, False if Nothing.
--    Example: isJust (Just 5) = True
--    Example: isJust Nothing  = False
isJust :: Maybe a -> Bool
isJust Nothing  = error "implement Nothing case"
isJust (Just _) = error "implement Just case"

-- 4. Apply a function to the value inside a Maybe, or return a default.
--    Example: maybeApply (+1) 0 (Just 5) = 6
--    Example: maybeApply (+1) 0 Nothing  = 0
maybeApply :: (a -> b) -> b -> Maybe a -> b
maybeApply _ fallback Nothing  = error "implement Nothing case"
maybeApply f _        (Just x) = error "implement Just case"
`,
    solutionCode: `module PatternMatching where

boolToString :: Bool -> String
boolToString True  = "yes"
boolToString False = "no"

headOr :: a -> [a] -> a
headOr fallback [] = fallback
headOr _     (x:_) = x

isJust :: Maybe a -> Bool
isJust Nothing  = False
isJust (Just _) = True

maybeApply :: (a -> b) -> b -> Maybe a -> b
maybeApply _ fallback Nothing  = fallback
maybeApply f _        (Just x) = f x
`,
    testCode: `runTestEq "boolToString True" "yes" (boolToString True)
        , runTestEq "boolToString False" "no" (boolToString False)
        , runTestEq "headOr 0 [1,2,3]" (1 :: Int) (headOr 0 [1,2,3])
        , runTestEq "headOr 0 []" (0 :: Int) (headOr 0 [])
        , runTestEq "isJust (Just 5)" True (isJust (Just 5 :: Maybe Int))
        , runTestEq "isJust Nothing" False (isJust (Nothing :: Maybe Int))
        , runTestEq "maybeApply (+1) 0 (Just 5)" (6 :: Int) (maybeApply (+1) 0 (Just 5))
        , runTestEq "maybeApply (+1) 0 Nothing" (0 :: Int) (maybeApply (+1) 0 Nothing)`,
    hints: [
      'Each equation replaces the <code>error "..."</code> with the return value for that case. For <code>boolToString True</code>, the result is just <code>"yes"</code>.',
      'For <code>headOr</code>: when the list is empty, return the fallback. When it\'s non-empty, the <code>x</code> in <code>(x:_)</code> is the first element.',
      'For <code>isJust</code>: <code>Nothing</code> means no value (<code>False</code>), <code>Just _</code> means there is one (<code>True</code>).',
      'For <code>maybeApply</code>: the <code>Nothing</code> case returns <code>fallback</code>. The <code>Just x</code> case applies <code>f</code> to <code>x</code>: <code>f x</code>.',
    ],
    concepts: ['pattern-matching', 'Bool', 'Maybe', 'lists', 'constructors'],
    successPatterns: [
      'boolToString\\s+True\\s*=\\s*"yes"',
      'headOr\\s+\\w+\\s+\\[\\]\\s*=\\s*\\w+',
      'isJust\\s+Nothing\\s*=\\s*False',
      'maybeApply\\s+\\w+\\s+\\w+\\s*\\(Just\\s+\\w+\\)\\s*=\\s*\\w+\\s+\\w+',
    ],
    testNames: [
      'boolToString returns "yes" for True',
      'headOr returns fallback for empty list',
      'isJust returns False for Nothing',
      'maybeApply applies function to Just value',
    ],
  },

  'algebraic-data-types': {
    id: 'algebraic-data-types',
    title: 'Define a Shape Type',
    difficulty: 'beginner',
    order: 4,
    description: `
<p>Now that you can pattern match on existing types, let's <strong>define your own type</strong> using the <code>data</code> keyword.</p>

<h3>Algebraic Data Types</h3>
<p>An algebraic data type (ADT) has one or more <strong>constructors</strong>, each of which can hold data:</p>
<pre><code>data Color = Red | Green | Blue</code></pre>
<p>This defines a type <code>Color</code> with three possible values. You pattern match on them just like <code>Bool</code>:</p>
<pre><code>colorName :: Color -> String
colorName Red   = "red"
colorName Green = "green"
colorName Blue  = "blue"</code></pre>

<h3>Constructors with Fields</h3>
<p>Constructors can carry data — just list the types after the constructor name:</p>
<pre><code>data Expr
  = Lit Double          -- holds one Double
  | Add Expr Expr       -- holds two sub-expressions</code></pre>
<pre><code>eval :: Expr -> Double
eval (Lit n)     = n
eval (Add e1 e2) = eval e1 + eval e2</code></pre>

<h3>Deriving</h3>
<p><code>deriving (Show, Eq)</code> at the end of a data definition asks the compiler to automatically generate:</p>
<ul>
  <li><code>Show</code> — ability to print values (e.g., in the REPL)</li>
  <li><code>Eq</code> — ability to compare values with <code>==</code></li>
</ul>

<h3>Your Task</h3>
<p>Define a <code>Shape</code> type and an <code>area</code> function:</p>
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
-- Uncomment the code below and replace the underscores.

-- 1. Define Shape with three constructors.
--    Each constructor holds the dimensions as Doubles.
--
-- data Shape
--   = Circle _
--   | Rectangle _ _
--   | Triangle _ _
--   deriving (Show, Eq)

-- 2. Implement area by pattern matching on each constructor.
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
    testCode: `runTestApprox "area (Circle 5)" (pi * 25) (area (Circle 5)) 0.01
        , runTestEq "area (Rectangle 3 4)" (12.0 :: Double) (area (Rectangle 3 4))
        , runTestEq "area (Triangle 6 3)" (9.0 :: Double) (area (Triangle 6 3))
        , runTestApprox "area (Circle 1)" pi (area (Circle 1)) 0.01
        , runTestEq "area (Rectangle 0 5)" (0.0 :: Double) (area (Rectangle 0 5))`,
    hints: [
      'Start by uncommenting the <code>data Shape</code> block. Replace each underscore with <code>Double</code>.',
      'Circle has one field (radius), so it\'s <code>Circle Double</code>. Rectangle and Triangle each have two fields: <code>Rectangle Double Double</code>.',
      'For <code>area</code>, uncomment the function and replace underscores with the formula from the table. <code>pi</code> is built into Haskell.',
      'The complete area: <code>area (Circle r) = pi * r * r</code>, <code>area (Rectangle w h) = w * h</code>, <code>area (Triangle b h) = 0.5 * b * h</code>.',
    ],
    concepts: ['algebraic-data-types', 'pattern-matching', 'constructors', 'deriving'],
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

  'polymorphic-types': {
    id: 'polymorphic-types',
    title: 'Polymorphic Types and Constraints',
    difficulty: 'beginner',
    order: 5,
    description: `
<p>So far your type signatures have used <strong>concrete types</strong> like <code>Int</code> and <code>String</code>. But many functions work for <em>any</em> type. Haskell expresses this with <strong>type variables</strong>.</p>

<h3>Type Variables</h3>
<p>A lowercase letter in a type signature stands for "any type":</p>
<pre><code>identity :: a -> a
identity x = x</code></pre>
<p>This works for <code>Int</code>, <code>String</code>, <code>[Bool]</code>, anything. The <code>a</code> is a <strong>type variable</strong> — a placeholder for whatever type you use it with.</p>

<h3>Typeclass Constraints</h3>
<p>Some functions need the type to support specific operations. The function <code>add</code> uses <code>+</code>, which not all types have. A <strong>constraint</strong> says "this works for any type <code>a</code>, as long as <code>a</code> supports certain operations":</p>
<pre><code>add :: Num a => a -> a -> a
add x y = x + y</code></pre>
<p>The <code>Num a =></code> part (before the fat arrow) means: "<code>a</code> must be a numeric type." This lets <code>add</code> work with <code>Int</code>, <code>Double</code>, <code>Integer</code>, etc.</p>

<h3>Common Constraints</h3>
<table>
  <thead><tr><th>Constraint</th><th>Provides</th><th>Types that have it</th></tr></thead>
  <tbody>
    <tr><td><code>Num a</code></td><td><code>+</code>, <code>-</code>, <code>*</code></td><td><code>Int</code>, <code>Double</code>, <code>Integer</code></td></tr>
    <tr><td><code>Integral a</code></td><td><code>div</code>, <code>mod</code></td><td><code>Int</code>, <code>Integer</code></td></tr>
    <tr><td><code>Eq a</code></td><td><code>==</code>, <code>/=</code></td><td>Most types</td></tr>
    <tr><td><code>Ord a</code></td><td><code><</code>, <code>></code>, <code><=</code>, <code>>=</code></td><td>Most types</td></tr>
    <tr><td><code>Show a</code></td><td><code>show</code> (convert to String)</td><td>Most types</td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Add type signatures with the correct type variables and constraints. Each function already works — figure out the most general type.</p>
`,
    starterCode: `module PolymorphicTypes where

-- EXERCISE: Add a type signature above each function.
-- Use type variables (a, b) and constraints (Num a =>, Eq a =>)
-- where needed.

-- 1. Works for ANY type — no constraint needed.
--    What goes in and what comes out?
--    _ :: _
firstOfThree (x, _, _) = x

-- 2. Uses (+), which needs the Num constraint.
--    Both arguments and the result are the same numeric type.
--    _ :: _
addThree x y z = x + y + z

-- 3. Uses (==), which needs the Eq constraint.
--    Returns True if the value is in the list.
--    _ :: _
contains _ []     = False
contains v (x:xs) = v == x || contains v xs

-- 4. Works on any list — returns its length.
--    The list elements can be any type.
--    _ :: _
len []     = 0
len (_:xs) = 1 + len xs
`,
    solutionCode: `module PolymorphicTypes where

firstOfThree :: (a, b, c) -> a
firstOfThree (x, _, _) = x

addThree :: Num a => a -> a -> a -> a
addThree x y z = x + y + z

contains :: Eq a => a -> [a] -> Bool
contains _ []     = False
contains v (x:xs) = v == x || contains v xs

len :: [a] -> Int
len []     = 0
len (_:xs) = 1 + len xs
`,
    testCode: `runTestEq "firstOfThree (1,2,3)" (1 :: Int) (firstOfThree (1 :: Int, 2 :: Int, 3 :: Int))
        , runTestEq "firstOfThree (True,'a',1)" True (firstOfThree (True, 'a', 1 :: Int))
        , runTestEq "addThree 1 2 3" (6 :: Int) (addThree 1 2 3)
        , runTestEq "addThree 0 0 0" (0 :: Int) (addThree 0 0 0)
        , runTestEq "contains 3 [1,2,3]" True (contains (3 :: Int) [1,2,3])
        , runTestEq "contains 4 [1,2,3]" False (contains (4 :: Int) [1,2,3])
        , runTestEq "contains 1 []" False (contains (1 :: Int) [])
        , runTestEq "len [1,2,3]" (3 :: Int) (len [1 :: Int, 2, 3])
        , runTestEq "len []" (0 :: Int) (len ([] :: [Int]))`,
    hints: [
      'For <code>firstOfThree</code>: the input is a 3-tuple <code>(a, b, c)</code>. The output is the first element, which has type <code>a</code>.',
      'For <code>addThree</code>: it uses <code>+</code>, so it needs <code>Num a =></code>. All three arguments and the result are the same type <code>a</code>.',
      'For <code>contains</code>: it uses <code>==</code>, so it needs <code>Eq a =></code>. It takes a value of type <code>a</code>, a list of <code>[a]</code>, and returns <code>Bool</code>.',
      'For <code>len</code>: the list can hold any type (<code>[a]</code>), so no constraint is needed. It returns an <code>Int</code>.',
    ],
    concepts: ['polymorphism', 'type-variables', 'constraints', 'typeclasses'],
    successPatterns: [
      'firstOfThree\\s*::',
      'addThree\\s*::.*Num',
      'contains\\s*::.*Eq',
      'len\\s*::.*\\[',
    ],
    testNames: [
      'firstOfThree has a type signature',
      'addThree has a Num constraint',
      'contains has an Eq constraint',
      'len has a polymorphic list type',
    ],
  },

  'parametric-polymorphism': {
    id: 'parametric-polymorphism',
    title: 'Parametric Polymorphism',
    difficulty: 'beginner',
    order: 6,
    description: `
<p>When a function has type <code>a -> a</code> with <strong>no constraints</strong>, it can't inspect the value at all — it can only rearrange structure. This is called <strong>parametric polymorphism</strong>, and it has a remarkable consequence: the type alone tells you what the function does.</p>

<h3>The Free Theorem</h3>
<p>Consider the type <code>(a, b) -> (b, a)</code>. There is only <strong>one possible function</strong> with this type — it must swap the pair. The function can't create new values (it doesn't know what <code>a</code> or <code>b</code> are), so it can only rearrange what it's given.</p>

<h3>Tuples</h3>
<p>Tuples group fixed numbers of values. Pattern match with parentheses:</p>
<pre><code>fst :: (a, b) -> a
fst (x, _) = x

snd :: (a, b) -> b
snd (_, y) = y</code></pre>

<h3>Higher-Order Functions</h3>
<p>Functions can take other functions as arguments:</p>
<pre><code>apply :: (a -> b) -> a -> b
apply f x = f x</code></pre>

<h3>Function Composition</h3>
<p>Haskell has a built-in composition operator <code>(.)</code> that chains functions. If <code>g</code> transforms the input and <code>f</code> transforms that result:</p>
<pre><code>(f . g) x  =  f (g x)</code></pre>

<h3>Your Task</h3>
<p>Implement three polymorphic functions. The types tell you exactly what each one must do.</p>
`,
    starterCode: `module Polymorphism where

-- EXERCISE: Replace each \`error "..."\` with your implementation.
-- The type signatures constrain exactly what each function can do.

-- 1. Swap the elements of a pair.
--    Type tells you: take (a, b), return (b, a).
swap :: (a, b) -> (b, a)
swap pair = error "implement swap"
-- Hint: pattern match on the tuple.

-- 2. Apply a function to both elements of a pair.
--    Type tells you: take a function and a pair, apply it to each.
both :: (a -> b) -> (a, a) -> (b, b)
both f pair = error "implement both"
-- Hint: destructure the pair, apply f to each element.

-- 3. Compose two functions (apply g first, then f).
--    This is how Haskell's (.) operator works.
compose :: (b -> c) -> (a -> b) -> a -> c
compose f g x = error "implement compose"
-- Hint: apply g to x, then apply f to the result.
`,
    solutionCode: `module Polymorphism where

swap :: (a, b) -> (b, a)
swap (a, b) = (b, a)

both :: (a -> b) -> (a, a) -> (b, b)
both f (x, y) = (f x, f y)

compose :: (b -> c) -> (a -> b) -> a -> c
compose f g x = f (g x)
`,
    testCode: `runTestEq "swap (1,2)" (2 :: Int, 1 :: Int) (swap (1 :: Int, 2 :: Int))
        , runTestEq "swap (True,'a')" ('a', True) (swap (True, 'a'))
        , runTestEq "both (+1) (3,4)" (4 :: Int, 5 :: Int) (both (+1) (3 :: Int, 4 :: Int))
        , runTestEq "both show (1,2)" ("1", "2") (both show (1 :: Int, 2 :: Int))
        , runTestEq "compose show (+1) 5" "6" (compose show (+1) (5 :: Int))
        , runTestEq "compose (*2) (+3) 1" (8 :: Int) (compose (*2) (+3) (1 :: Int))`,
    hints: [
      'For <code>swap</code>: destructure the tuple in the argument. <code>swap (x, y) = ...</code> — now return them in the opposite order.',
      'For <code>both</code>: destructure the pair AND name the function: <code>both f (x, y) = ...</code>. Apply <code>f</code> to each element separately.',
      'For <code>compose</code>: you have <code>f</code>, <code>g</code>, and <code>x</code>. First compute <code>g x</code>, then pass that result to <code>f</code>.',
      'Solutions: <code>swap (a, b) = (b, a)</code>; <code>both f (x, y) = (f x, f y)</code>; <code>compose f g x = f (g x)</code>.',
    ],
    concepts: ['parametric-polymorphism', 'higher-order-functions', 'function-composition', 'tuples'],
    successPatterns: [
      'swap\\s*\\(\\w+\\s*,\\s*\\w+\\)',
      'both\\s+\\w+\\s*\\(\\w+\\s*,\\s*\\w+\\)',
      'compose\\s+\\w+\\s+\\w+\\s+\\w+\\s*=',
    ],
    testNames: [
      'swap destructures and reverses the pair',
      'both applies the function to both elements',
      'compose chains two functions',
    ],
  },

  'typeclasses-intro': {
    id: 'typeclasses-intro',
    title: 'Writing Typeclass Instances',
    difficulty: 'beginner',
    order: 7,
    description: `
<p>A <strong>typeclass</strong> defines a set of functions that different types can implement. You've already used typeclasses — <code>Num</code>, <code>Eq</code>, <code>Show</code>. Now you'll write your own <strong>instance</strong>.</p>

<h3>How Typeclasses Work</h3>
<p>A typeclass is like an interface. It declares function signatures that types must implement:</p>
<pre><code>class Describable a where
  describe :: a -> String</code></pre>
<p>This says: "Any type <code>a</code> that is <code>Describable</code> must have a <code>describe</code> function."</p>

<h3>Writing an Instance</h3>
<p>To make a type implement a typeclass, write an <code>instance</code> declaration:</p>
<pre><code>data Color = Red | Green | Blue

instance Describable Color where
  describe Red   = "red"
  describe Green = "green"
  describe Blue  = "blue"</code></pre>
<p>The syntax is: <code>instance ClassName TypeName where</code>, followed by the function implementations indented below.</p>

<p><strong>Important:</strong> Write the <em>type constructor</em> after the class name, not a full type. It's <code>Describable Color</code>, not <code>Describable (Color a)</code>.</p>

<h3>The Eq Typeclass</h3>
<p><code>Eq</code> lets you compare values with <code>==</code> and <code>/=</code>:</p>
<pre><code>class Eq a where
  (==) :: a -> a -> Bool
  (/=) :: a -> a -> Bool
  x /= y = not (x == y)  -- default: /= is defined in terms of ==</code></pre>
<p>You only need to implement <code>==</code>. Haskell provides <code>/=</code> for free.</p>

<h3>Your Task</h3>
<p>Implement typeclass instances for a custom <code>TrafficLight</code> type.</p>
`,
    starterCode: `module TypeclassIntro where

data TrafficLight = Red | Yellow | Green

-- EXERCISE: Write typeclass instances for TrafficLight.

-- 1. Make TrafficLight an instance of Eq.
--    Two traffic lights are equal only if they're the same color.
--
--    instance Eq TrafficLight where
--      x == y = ???
--
-- Hint: pattern match on all pairs. Red == Red = True, etc.
-- Or use a simpler approach: convert to an Int first.

-- 2. Make TrafficLight an instance of Show.
--    Show requires a function: show :: a -> String
--
--    instance Show TrafficLight where
--      show Red    = ???
--      show Yellow = ???
--      show Green  = ???
`,
    solutionCode: `module TypeclassIntro where

data TrafficLight = Red | Yellow | Green

instance Eq TrafficLight where
  Red    == Red    = True
  Yellow == Yellow = True
  Green  == Green  = True
  _      == _      = False

instance Show TrafficLight where
  show Red    = "Red"
  show Yellow = "Yellow"
  show Green  = "Green"
`,
    testCode: `runTestEq "Red == Red" True (Red == Red)
        , runTestEq "Red == Green" False (Red == Green)
        , runTestEq "Yellow == Yellow" True (Yellow == Yellow)
        , runTestEq "Green /= Red" True (Green /= Red)
        , runTestEq "show Red" "Red" (show Red)
        , runTestEq "show Yellow" "Yellow" (show Yellow)
        , runTestEq "show Green" "Green" (show Green)`,
    hints: [
      'For <code>Eq</code>: start with <code>instance Eq TrafficLight where</code> on its own line, then indent the <code>==</code> equations below.',
      'You need to match each pair: <code>Red == Red = True</code>, <code>Yellow == Yellow = True</code>, <code>Green == Green = True</code>, and a catch-all <code>_ == _ = False</code>.',
      'For <code>Show</code>: same structure. <code>instance Show TrafficLight where</code>, then <code>show Red = "Red"</code>, etc.',
      'Full Eq instance: <code>Red == Red = True</code>, <code>Yellow == Yellow = True</code>, <code>Green == Green = True</code>, <code>_ == _ = False</code>.',
    ],
    concepts: ['typeclasses', 'instance', 'Eq', 'Show', 'pattern-matching'],
    successPatterns: [
      'instance\\s+Eq\\s+TrafficLight',
      'Red\\s*==\\s*Red\\s*=\\s*True',
      'instance\\s+Show\\s+TrafficLight',
      'show\\s+Red',
    ],
    testNames: [
      'Eq instance is declared',
      'Red == Red returns True',
      'Show instance is declared',
      'show handles Red',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY THEORY MODULE
  // ═══════════════════════════════════════════════════════════════════

  'using-fmap': {
    id: 'using-fmap',
    title: 'Using fmap',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>Before writing your own <code>Functor</code> instance, let's understand <code>fmap</code> by <strong>using</strong> it on types that already have one.</p>

<h3>What is fmap?</h3>
<p><code>fmap</code> applies a function to the value(s) inside a container, without changing the container's structure:</p>
<pre><code>fmap :: Functor f => (a -> b) -> f a -> f b</code></pre>
<p>Think of it as "reach inside the container, transform what's there, put it back."</p>

<h3>fmap on Common Types</h3>
<pre><code>-- Maybe: transform the value if it exists
fmap (+1) (Just 5)   -- Just 6
fmap (+1) Nothing    -- Nothing  (nothing to transform)

-- Lists: transform every element
fmap (*2) [1, 2, 3]  -- [2, 4, 6]
fmap show [1, 2, 3]  -- ["1", "2", "3"]

-- Either: transform the Right value (Left is untouched)
fmap (+1) (Right 10)      -- Right 11
fmap (+1) (Left "error")  -- Left "error"</code></pre>

<p>Notice the pattern: <code>fmap</code> never changes the structure. A <code>Nothing</code> stays <code>Nothing</code>. A 3-element list stays 3 elements. A <code>Left</code> stays <code>Left</code>.</p>

<h3>fmap is Just map, Generalized</h3>
<p>For lists, <code>fmap</code> is the same as <code>map</code>. The <code>Functor</code> typeclass generalizes this pattern to any container type.</p>

<h3>Your Task</h3>
<p>Use <code>fmap</code> to transform values inside containers. No instance writing — just apply <code>fmap</code> with the right function.</p>
`,
    starterCode: `module UsingFmap where

-- EXERCISE: Use fmap to transform values inside containers.
-- Replace each \`error "..."\` with an expression using fmap.

-- 1. Double every number in the list.
--    Result should be [2, 4, 6, 8, 10]
doubleAll :: [Int] -> [Int]
doubleAll xs = error "use fmap to double each element"
-- Hint: fmap (\\x -> ???) xs

-- 2. Convert a Maybe Int to a Maybe String.
--    Just 42 should become Just "42", Nothing stays Nothing.
showMaybe :: Maybe Int -> Maybe String
showMaybe mx = error "use fmap with the show function"

-- 3. Add 10 to the Right value of an Either.
--    Right 5 -> Right 15, Left "err" -> Left "err"
addToRight :: Either String Int -> Either String Int
addToRight ex = error "use fmap to add 10"

-- 4. Get the length of each string in a list.
--    ["hi", "hello", "hey"] -> [2, 5, 3]
lengths :: [String] -> [Int]
lengths xs = error "use fmap with the length function"
`,
    solutionCode: `module UsingFmap where

doubleAll :: [Int] -> [Int]
doubleAll xs = fmap (* 2) xs

showMaybe :: Maybe Int -> Maybe String
showMaybe mx = fmap show mx

addToRight :: Either String Int -> Either String Int
addToRight ex = fmap (+ 10) ex

lengths :: [String] -> [Int]
lengths xs = fmap length xs
`,
    testCode: `runTestEq "doubleAll [1..5]" [2,4,6,8,10 :: Int] (doubleAll [1,2,3,4,5])
        , runTestEq "doubleAll []" ([] :: [Int]) (doubleAll [])
        , runTestEq "showMaybe (Just 42)" (Just "42") (showMaybe (Just 42))
        , runTestEq "showMaybe Nothing" (Nothing :: Maybe String) (showMaybe Nothing)
        , runTestEq "addToRight (Right 5)" (Right 15 :: Either String Int) (addToRight (Right 5))
        , runTestEq "addToRight (Left err)" (Left "err" :: Either String Int) (addToRight (Left "err"))
        , runTestEq "lengths" [2,5,3 :: Int] (lengths ["hi","hello","hey"])`,
    hints: [
      'The pattern is always <code>fmap someFunction container</code>. For <code>doubleAll</code>: <code>fmap (* 2) xs</code>.',
      'For <code>showMaybe</code>: <code>show</code> converts any value to a String. Use <code>fmap show mx</code>.',
      'For <code>addToRight</code>: <code>fmap (+ 10) ex</code>. The <code>Left</code> case is handled automatically — fmap only touches <code>Right</code>.',
      'For <code>lengths</code>: <code>length</code> gives the length of a string. Use <code>fmap length xs</code>.',
    ],
    concepts: ['functor', 'fmap', 'Maybe', 'Either', 'lists'],
    successPatterns: [
      'fmap.*doubleAll|doubleAll.*fmap',
      'fmap\\s+show',
      'fmap.*addToRight|addToRight.*fmap',
      'fmap\\s+length',
    ],
    testNames: [
      'doubleAll uses fmap',
      'showMaybe uses fmap with show',
      'addToRight uses fmap',
      'lengths uses fmap with length',
    ],
  },

  'functor-instance': {
    id: 'functor-instance',
    title: 'Write a Functor Instance',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>You've used <code>fmap</code> on <code>Maybe</code>, lists, and <code>Either</code>. Now you'll make your <strong>own type</strong> work with <code>fmap</code> by writing a <code>Functor</code> instance.</p>

<h3>The Functor Typeclass</h3>
<pre><code>class Functor f where
  fmap :: (a -> b) -> f a -> f b</code></pre>
<p>To make a type a Functor, write an <code>instance</code> declaration — the same syntax you used for <code>Eq</code> and <code>Show</code>:</p>
<pre><code>instance Functor MyType where
  fmap f x = ...</code></pre>

<p><strong>Key detail:</strong> After <code>Functor</code> you write the <em>type constructor alone</em>, without its type parameter. It's <code>Functor Tree</code>, not <code>Functor (Tree a)</code>.</p>

<h3>The Binary Tree</h3>
<p>Our tree has two constructors:</p>
<pre><code>data Tree a
  = Leaf a                   -- holds a single value
  | Branch (Tree a) (Tree a) -- two subtrees, no value</code></pre>
<p>Visually:</p>
<pre><code>     Branch
    /      \\
  Leaf 1   Branch
          /      \\
        Leaf 2  Leaf 3</code></pre>

<h3>Writing fmap for Tree</h3>
<p>Think recursively — one equation per constructor:</p>
<ul>
  <li><strong>Leaf x</strong> — base case. Apply <code>f</code> to <code>x</code>, wrap back in <code>Leaf</code>.</li>
  <li><strong>Branch l r</strong> — recursive case. Recursively <code>fmap</code> over both subtrees.</li>
</ul>
<p>This is the same pattern as writing a recursive function on a list: handle the empty case, then the cons case.</p>

<h3>Your Task</h3>
<p>Implement <code>fmap</code> for <code>Tree</code>. Two equations, one per constructor.</p>
`,
    starterCode: `module TreeFunctor where

data Tree a
  = Leaf a
  | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

-- EXERCISE: Implement fmap for Tree.
--
-- Two cases:
--   Leaf x     -> apply f to x, wrap in Leaf
--   Branch l r -> recursively fmap each subtree

instance Functor Tree where
  -- fmap :: (a -> b) -> Tree a -> Tree b
  fmap f (Leaf x)     = error "apply f to x, wrap in Leaf"
  fmap f (Branch l r) = error "fmap over l and r, wrap in Branch"
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
    testCode: `runTestEq "fmap (+1) (Leaf 5)" (Leaf 6) (fmap (+1) (Leaf 5 :: Tree Int))
        , runTestEq "fmap (*2) branch" (Branch (Leaf 2) (Leaf 4)) (fmap (*2) (Branch (Leaf 1) (Leaf 2) :: Tree Int))
        , runTestEq "fmap show (Leaf 42)" (Leaf "42") (fmap show (Leaf 42 :: Tree Int))
        , runTestEq "fmap id preserves" (Leaf 7) (fmap id (Leaf 7 :: Tree Int))`,
    hints: [
      'This is like writing a recursive function on a list. <code>Leaf</code> is your base case (like <code>[]</code>), <code>Branch</code> is your recursive case (like <code>x:xs</code>).',
      'For the Leaf case: you have a value <code>x</code> and a function <code>f</code>. The result should still be a <code>Leaf</code>, wrapping the transformed value: <code>Leaf (...)</code>.',
      'For the Branch case: recurse on both subtrees. The structure stays the same: <code>Branch (fmap f l) (fmap f r)</code>.',
      'Full solution: <code>fmap f (Leaf x) = Leaf (f x)</code> and <code>fmap f (Branch l r) = Branch (fmap f l) (fmap f r)</code>.',
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
    title: 'The Functor Laws',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>Writing <code>fmap</code> isn't enough — a lawful <code>Functor</code> must satisfy two <strong>laws</strong>. These guarantee that <code>fmap</code> truly preserves structure.</p>

<h3>Why Laws?</h3>
<p>Without laws, <code>fmap</code> could do anything — reverse a list, drop elements, duplicate values. The laws ensure it only transforms values, nothing else.</p>

<h3>Law 1: Identity</h3>
<pre><code>fmap id == id</code></pre>
<p>Mapping the do-nothing function (<code>id</code>) over a structure changes nothing:</p>
<pre><code>fmap id (Branch (Leaf 1) (Leaf 2))
  == Branch (Leaf 1) (Leaf 2)  -- unchanged!</code></pre>

<h3>Law 2: Composition</h3>
<pre><code>fmap (f . g) == fmap f . fmap g</code></pre>
<p>Mapping a composed function equals mapping each function in sequence:</p>
<pre><code>-- These give the same result:
fmap (show . (+1)) (Leaf 5)       -- Leaf "6"
(fmap show . fmap (+1)) (Leaf 5)  -- Leaf "6"</code></pre>

<h3>Haskell's Built-in Functions</h3>
<p>You'll need two standard functions:</p>
<ul>
  <li><code>id :: a -> a</code> — returns its argument unchanged: <code>id 5 = 5</code></li>
  <li><code>(.) :: (b -> c) -> (a -> b) -> a -> c</code> — composes functions: <code>(f . g) x = f (g x)</code></li>
</ul>
<p>These are the same concepts from the parametric-polymorphism exercise, but <code>id</code> and <code>(.)</code> are built into Haskell.</p>

<h3>Your Task</h3>
<p>Write functions that <strong>check</strong> whether each law holds for a given tree. Each function should return <code>True</code> if the law is satisfied.</p>
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
-- Each should return True if the law holds.

-- Identity law: fmap id tree  ==  tree
identityLaw :: Eq a => Tree a -> Bool
identityLaw tree = error "compare fmap id tree with tree using =="

-- Composition law: fmap (f . g) tree  ==  (fmap f . fmap g) tree
compositionLaw :: Eq c => (b -> c) -> (a -> b) -> Tree a -> Bool
compositionLaw f g tree = error "compare both sides using =="
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
    testCode: `runTestEq "identityLaw (Leaf 5)" True (identityLaw (Leaf 5 :: Tree Int))
        , runTestEq "identityLaw branch" True (identityLaw (Branch (Leaf 1) (Leaf 2) :: Tree Int))
        , runTestEq "compositionLaw show (+1) leaf" True (compositionLaw show (+1) (Leaf 5 :: Tree Int))
        , runTestEq "compositionLaw show (+1) branch" True (compositionLaw show (+1) (Branch (Leaf 1) (Leaf 2) :: Tree Int))`,
    hints: [
      'Each function is a one-liner. Translate the mathematical equation directly into Haskell using <code>==</code>.',
      'For <code>identityLaw</code>: the left side is <code>fmap id tree</code>, the right side is <code>tree</code>. Compare with <code>==</code>.',
      'For <code>compositionLaw</code>: left side is <code>fmap (f . g) tree</code>. Right side: <code>(fmap f . fmap g) tree</code>. The <code>.</code> composes <code>fmap f</code> and <code>fmap g</code>.',
      'Solutions: <code>identityLaw tree = fmap id tree == tree</code> and <code>compositionLaw f g tree = fmap (f . g) tree == (fmap f . fmap g) tree</code>.',
    ],
    concepts: ['functor-laws', 'identity', 'composition', 'equational-reasoning'],
    successPatterns: [
      'fmap\\s+id\\s+\\w+\\s*==\\s*\\w+',
      'fmap\\s*\\(f\\s*\\.\\s*g\\)',
    ],
    testNames: [
      'identityLaw checks fmap id == id',
      'compositionLaw checks fmap (f . g) == fmap f . fmap g',
    ],
  },

  'natural-transformation': {
    id: 'natural-transformation',
    title: 'Natural Transformations',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p>A <strong>natural transformation</strong> converts one container type to another without looking at the values inside.</p>

<h3>Intuition</h3>
<p>Think of it as changing the packaging without touching the contents:</p>
<pre><code>maybeToList (Just 42) = [42]    -- Maybe -> List
maybeToList Nothing   = []      -- same conversion, no value</code></pre>
<p>The value <code>42</code> is untouched — only the container changed from <code>Maybe</code> to <code>[]</code>.</p>

<h3>The Naturality Condition</h3>
<p>A natural transformation has a special property: it doesn't matter whether you transform the container first and then map a function, or map first and then transform:</p>
<pre><code>-- These always give the same result:
fmap f (maybeToList mx)  ==  maybeToList (fmap f mx)

-- Example: f = (+1), mx = Just 5
fmap (+1) (maybeToList (Just 5))  = fmap (+1) [5]    = [6]
maybeToList (fmap (+1) (Just 5))  = maybeToList (Just 6) = [6]</code></pre>

<h3>Pattern Matching to Convert</h3>
<p>To write a natural transformation, pattern match on the source type's constructors and build the target type:</p>
<table>
  <thead><tr><th>Source</th><th>Constructors</th><th>Target</th><th>Mapping</th></tr></thead>
  <tbody>
    <tr><td><code>Maybe a</code></td><td><code>Nothing</code>, <code>Just x</code></td><td><code>[a]</code></td><td><code>Nothing -> []</code>, <code>Just x -> [x]</code></td></tr>
    <tr><td><code>[a]</code></td><td><code>[]</code>, <code>(x:_)</code></td><td><code>Maybe a</code></td><td><code>[] -> Nothing</code>, <code>(x:_) -> Just x</code></td></tr>
    <tr><td><code>Either e a</code></td><td><code>Left e</code>, <code>Right x</code></td><td><code>Maybe a</code></td><td><code>Left _ -> Nothing</code>, <code>Right x -> Just x</code></td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Implement three natural transformations using pattern matching.</p>
`,
    starterCode: `module NaturalTransformations where

-- EXERCISE: Implement each natural transformation.
-- Pattern match on the source type's constructors.

-- 1. Maybe -> List
--    Nothing has no value — what list has no elements?
--    Just x has one value — what list has one element?
maybeToList :: Maybe a -> [a]
maybeToList Nothing  = error "what list is empty?"
maybeToList (Just x) = error "what list has just x?"

-- 2. List -> Maybe (take the first element if it exists)
--    [] has no elements — which Maybe constructor means "no value"?
--    (x:_) has at least one — which constructor wraps a value?
listToMaybe :: [a] -> Maybe a
listToMaybe []    = error "no elements means..."
listToMaybe (x:_) = error "first element is x, so..."

-- 3. Either e a -> Maybe a
--    Left represents failure — discard it.
--    Right represents success — keep the value.
eitherToMaybe :: Either e a -> Maybe a
eitherToMaybe (Left _)  = error "failure means no value"
eitherToMaybe (Right x) = error "success means we have x"
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
    testCode: `runTestEq "maybeToList Nothing" ([] :: [Int]) (maybeToList (Nothing :: Maybe Int))
        , runTestEq "maybeToList (Just 5)" [5 :: Int] (maybeToList (Just 5))
        , runTestEq "listToMaybe []" (Nothing :: Maybe Int) (listToMaybe ([] :: [Int]))
        , runTestEq "listToMaybe [1,2,3]" (Just 1 :: Maybe Int) (listToMaybe [1 :: Int, 2, 3])
        , runTestEq "eitherToMaybe (Left err)" (Nothing :: Maybe Int) (eitherToMaybe (Left "err" :: Either String Int))
        , runTestEq "eitherToMaybe (Right 42)" (Just 42 :: Maybe Int) (eitherToMaybe (Right 42))`,
    hints: [
      'For <code>maybeToList</code>: <code>Nothing</code> (no value) maps to the empty list <code>[]</code>. <code>Just x</code> (one value) maps to a single-element list.',
      'For <code>listToMaybe</code>: an empty list means there\'s no first element (<code>Nothing</code>). A non-empty list <code>(x:_)</code> gives us the first element (<code>Just x</code>).',
      'For <code>eitherToMaybe</code>: <code>Left</code> is the failure case — discard with <code>Nothing</code>. <code>Right x</code> is the success case — wrap with <code>Just x</code>.',
      'Solutions: <code>Nothing -> []</code>, <code>Just x -> [x]</code>; <code>[] -> Nothing</code>, <code>(x:_) -> Just x</code>; <code>Left _ -> Nothing</code>, <code>Right x -> Just x</code>.',
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

  // ═══════════════════════════════════════════════════════════════════
  // MONOIDS & FOLDABLE MODULE
  // ═══════════════════════════════════════════════════════════════════

  'semigroup-intro': {
    id: 'semigroup-intro',
    title: 'Semigroup: Combining Values',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>A <strong>Semigroup</strong> is a type that has an associative binary operation for combining two values. In Haskell, this operation is <code>(&lt;&gt;)</code>.</p>

<h3>The Semigroup Typeclass</h3>
<pre><code>class Semigroup a where
  (&lt;&gt;) :: a -> a -> a</code></pre>

<p>You already know several semigroups:</p>
<pre><code>"hello" &lt;&gt; " world"   -- "hello world"  (String concatenation)
[1,2] &lt;&gt; [3,4]        -- [1,2,3,4]      (List append)
Just 3 &lt;&gt; Just 5      -- Just 3         (keeps first)</code></pre>

<h3>The Associativity Law</h3>
<p>A Semigroup must satisfy: <code>(a &lt;&gt; b) &lt;&gt; c == a &lt;&gt; (b &lt;&gt; c)</code>. Grouping doesn't matter.</p>

<h3>Your Task</h3>
<p>Implement <code>Semigroup</code> for an <code>Inventory</code> type that combines inventories by adding each field.</p>
`,
    starterCode: `module SemigroupIntro where

data Inventory = Inventory
  { swords  :: Int
  , shields :: Int
  , potions :: Int
  } deriving (Show, Eq)

-- EXERCISE: Implement Semigroup for Inventory.
-- Combining two inventories adds each field pairwise.
--
-- Example: Inventory 3 1 0 <> Inventory 0 2 5 = Inventory 3 3 5

instance Semigroup Inventory where
  (<>) = error "implement (<>) for Inventory"
  -- Hint: pattern match on both inventories and add each field.
  -- inv1 <> inv2 = Inventory (??? + ???) (??? + ???) (??? + ???)
`,
    solutionCode: `module SemigroupIntro where

data Inventory = Inventory
  { swords  :: Int
  , shields :: Int
  , potions :: Int
  } deriving (Show, Eq)

instance Semigroup Inventory where
  Inventory s1 sh1 p1 <> Inventory s2 sh2 p2 = Inventory (s1+s2) (sh1+sh2) (p1+p2)
`,
    testCode: `runTestEq "combine inventories" (Inventory 3 3 5) (Inventory 3 1 0 <> Inventory 0 2 5)
        , runTestEq "combine with empty" (Inventory 1 2 3) (Inventory 1 2 3 <> Inventory 0 0 0)
        , runTestEq "associativity" ((Inventory 1 0 0 <> Inventory 0 1 0) <> Inventory 0 0 1) (Inventory 1 0 0 <> (Inventory 0 1 0 <> Inventory 0 0 1))`,
    hints: [
      'Pattern match on both <code>Inventory</code> values to access their fields.',
      'Each field is combined with <code>+</code>: swords + swords, shields + shields, potions + potions.',
      'The pattern is: <code>Inventory s1 sh1 p1 <> Inventory s2 sh2 p2 = Inventory (s1+s2) ...</code>',
      'Full solution: <code>Inventory s1 sh1 p1 <> Inventory s2 sh2 p2 = Inventory (s1+s2) (sh1+sh2) (p1+p2)</code>',
    ],
    concepts: ['semigroup', 'typeclass', 'associativity'],
    successPatterns: [
      'instance\\s+Semigroup\\s+Inventory',
      'Inventory\\s*\\(.*\\+',
    ],
    testNames: [
      'combining inventories adds fields',
      'combining with zero inventory',
      'associativity holds',
    ],
  },

  'monoid-instance': {
    id: 'monoid-instance',
    title: 'Monoid: The Identity Element',
    difficulty: 'beginner',
    order: 2,
    description: `
<p>A <strong>Monoid</strong> extends Semigroup by adding an <strong>identity element</strong> called <code>mempty</code>:</p>
<pre><code>class Semigroup a => Monoid a where
  mempty :: a</code></pre>

<p>The identity element satisfies: <code>mempty &lt;&gt; x == x</code> and <code>x &lt;&gt; mempty == x</code>. It's the "do nothing" value.</p>

<h3>Examples</h3>
<pre><code>mempty :: String    -- ""     (empty string)
mempty :: [a]       -- []     (empty list)
mempty :: Sum Int   -- Sum 0  (zero under addition)</code></pre>

<h3>Why Monoids Matter</h3>
<p>With a Monoid, you can <code>mconcat</code> any list of values into one:</p>
<pre><code>mconcat ["a", "b", "c"]  -- "abc"
mconcat [Sum 1, Sum 2]   -- Sum 3</code></pre>

<h3>Your Task</h3>
<p>Make Inventory a Monoid by defining <code>mempty</code>, then write a function that checks the identity law.</p>
`,
    starterCode: `module MonoidInstance where

data Inventory = Inventory
  { swords  :: Int
  , shields :: Int
  , potions :: Int
  } deriving (Show, Eq)

instance Semigroup Inventory where
  Inventory s1 sh1 p1 <> Inventory s2 sh2 p2 = Inventory (s1+s2) (sh1+sh2) (p1+p2)

-- EXERCISE: Make Inventory a Monoid.

-- 1. Define mempty — the "empty" inventory where every field is 0.
instance Monoid Inventory where
  mempty = error "implement mempty"

-- 2. Write a function that checks both identity laws.
--    Left identity:  mempty <> x == x
--    Right identity: x <> mempty == x
identityLaw :: (Monoid a, Eq a) => a -> Bool
identityLaw x = error "check both identity laws"
`,
    solutionCode: `module MonoidInstance where

data Inventory = Inventory
  { swords  :: Int
  , shields :: Int
  , potions :: Int
  } deriving (Show, Eq)

instance Semigroup Inventory where
  Inventory s1 sh1 p1 <> Inventory s2 sh2 p2 = Inventory (s1+s2) (sh1+sh2) (p1+p2)

instance Monoid Inventory where
  mempty = Inventory 0 0 0

identityLaw :: (Monoid a, Eq a) => a -> Bool
identityLaw x = (mempty <> x == x) && (x <> mempty == x)
`,
    testCode: `runTestEq "mempty is empty inventory" (Inventory 0 0 0) (mempty :: Inventory)
        , runTestEq "left identity" (Inventory 1 2 3) (mempty <> Inventory 1 2 3)
        , runTestEq "right identity" (Inventory 1 2 3) (Inventory 1 2 3 <> mempty)
        , runTestEq "identityLaw check" True (identityLaw (Inventory 5 3 1))`,
    hints: [
      '<code>mempty</code> should be an Inventory where combining with it changes nothing.',
      'Since <code>(<>)</code> adds fields, the identity has all zeros: <code>Inventory 0 0 0</code>.',
      'For <code>identityLaw</code>: check <code>mempty <> x == x</code> AND <code>x <> mempty == x</code> using <code>&&</code>.',
      'Full: <code>mempty = Inventory 0 0 0</code>, <code>identityLaw x = (mempty <> x == x) && (x <> mempty == x)</code>.',
    ],
    concepts: ['monoid', 'identity', 'mempty', 'mconcat'],
    successPatterns: [
      'mempty\\s*=\\s*Inventory\\s+0\\s+0\\s+0',
      'mempty\\s*<>\\s*\\w+\\s*==\\s*\\w+',
    ],
    testNames: [
      'mempty is Inventory 0 0 0',
      'left identity holds',
      'right identity holds',
      'identityLaw function works',
    ],
  },

  'foldable-basics': {
    id: 'foldable-basics',
    title: 'Foldable: Collapsing Structure',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p><strong>Foldable</strong> generalizes list folding to any container. If you can "visit every element" in a structure, it's Foldable.</p>

<h3>The Key Function: foldr</h3>
<pre><code>class Foldable t where
  foldr :: (a -> b -> b) -> b -> t a -> b</code></pre>

<p><code>foldr f acc structure</code> folds from the right, combining each element with an accumulator:</p>
<pre><code>foldr (+) 0 [1,2,3]  -- 1 + (2 + (3 + 0)) = 6
foldr (:) [] [1,2,3] -- 1 : (2 : (3 : [])) = [1,2,3]</code></pre>

<h3>Free Functions from Foldable</h3>
<p>Once you implement <code>foldr</code>, you get many functions for free:</p>
<pre><code>toList :: Foldable t => t a -> [a]
length :: Foldable t => t a -> Int
sum    :: (Foldable t, Num a) => t a -> a
null   :: Foldable t => t a -> Bool</code></pre>

<h3>Your Task</h3>
<p>Implement <code>Foldable</code> for the <code>Tree</code> type you already know from the Functor module.</p>
`,
    starterCode: `module FoldableBasics where

data Tree a = Leaf a | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

-- EXERCISE: Implement Foldable for Tree.
--
-- Two cases, just like Functor:
--   Leaf x     -> apply f to x and the accumulator
--   Branch l r -> fold the right subtree first, then use that result
--                 to fold the left subtree

instance Foldable Tree where
  foldr f acc (Leaf x)     = error "combine x with acc using f"
  foldr f acc (Branch l r) = error "fold right subtree, then left"
`,
    solutionCode: `module FoldableBasics where

data Tree a = Leaf a | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

instance Foldable Tree where
  foldr f acc (Leaf x)     = f x acc
  foldr f acc (Branch l r) = foldr f (foldr f acc r) l
`,
    testCode: `runTestEq "foldr (+) on leaf" (5 :: Int) (foldr (+) 0 (Leaf 5 :: Tree Int))
        , runTestEq "foldr (+) on branch" (6 :: Int) (foldr (+) 0 (Branch (Leaf 1) (Branch (Leaf 2) (Leaf 3)) :: Tree Int))
        , runTestEq "foldr (:) [] = toList" [1 :: Int, 2, 3] (foldr (:) [] (Branch (Leaf 1) (Branch (Leaf 2) (Leaf 3))))
        , runTestEq "length" (3 :: Int) (length (Branch (Leaf 1) (Branch (Leaf 2) (Leaf 3)) :: Tree Int))`,
    hints: [
      'For <code>Leaf x</code>: you have an element <code>x</code> and an accumulator <code>acc</code>. Combine them: <code>f x acc</code>.',
      'For <code>Branch l r</code>: first fold the right subtree to get an intermediate result, then fold the left subtree with that result.',
      'The right-subtree fold: <code>foldr f acc r</code>. Then pass that as the accumulator to the left: <code>foldr f (foldr f acc r) l</code>.',
      'Full solution: <code>foldr f acc (Leaf x) = f x acc</code> and <code>foldr f acc (Branch l r) = foldr f (foldr f acc r) l</code>.',
    ],
    concepts: ['foldable', 'foldr', 'tree', 'recursion'],
    successPatterns: [
      'f\\s+x\\s+acc',
      'foldr\\s+\\w+\\s*\\(foldr',
    ],
    testNames: [
      'foldr on single leaf',
      'foldr sums all leaves',
      'foldr (:) [] extracts all leaves',
      'length counts all leaves',
    ],
  },

  'foldmap-power': {
    id: 'foldmap-power',
    title: 'foldMap: Folding with Monoids',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p><code>foldMap</code> is the most elegant way to fold — it maps each element to a Monoid value, then combines them all with <code>(&lt;&gt;)</code>:</p>
<pre><code>foldMap :: (Foldable t, Monoid m) => (a -> m) -> t a -> m</code></pre>

<h3>Monoid Newtypes</h3>
<p>Haskell provides newtype wrappers in <code>Data.Monoid</code> that give numbers different Monoid behaviors:</p>
<pre><code>import Data.Monoid (Sum(..), Product(..))

Sum 3 &lt;&gt; Sum 4         -- Sum 7     (addition)
Product 3 &lt;&gt; Product 4 -- Product 12 (multiplication)

getSum (Sum 7)          -- 7
getProduct (Product 12) -- 12</code></pre>

<h3>foldMap in Action</h3>
<pre><code>foldMap Sum [1,2,3]          -- Sum 6
foldMap Product [1,2,3]      -- Product 6
foldMap (\\x -> [x]) [1,2,3]  -- [1,2,3]  (each element -> singleton list)</code></pre>

<h3>Your Task</h3>
<p>Use <code>foldMap</code> with different Monoid newtypes to implement three utility functions on your Tree.</p>
`,
    starterCode: `module FoldMapPower where

import Data.Monoid (Sum(..), Product(..))

data Tree a = Leaf a | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

instance Foldable Tree where
  foldr f acc (Leaf x)     = f x acc
  foldr f acc (Branch l r) = foldr f (foldr f acc r) l

-- EXERCISE: Implement these using foldMap.

-- 1. Sum all values in the tree.
--    Hint: foldMap Sum wraps each element, then (<>) adds them.
treeSum :: Num a => Tree a -> a
treeSum t = error "use foldMap with Sum"

-- 2. Multiply all values in the tree.
treeProduct :: Num a => Tree a -> a
treeProduct t = error "use foldMap with Product"

-- 3. Convert the tree to a list.
--    Hint: each element becomes a singleton list [x], then (<>) = (++)
treeToList :: Tree a -> [a]
treeToList t = error "use foldMap with singleton lists"
`,
    solutionCode: `module FoldMapPower where

import Data.Monoid (Sum(..), Product(..))

data Tree a = Leaf a | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

instance Foldable Tree where
  foldr f acc (Leaf x)     = f x acc
  foldr f acc (Branch l r) = foldr f (foldr f acc r) l

treeSum :: Num a => Tree a -> a
treeSum t = getSum (foldMap Sum t)

treeProduct :: Num a => Tree a -> a
treeProduct t = getProduct (foldMap Product t)

treeToList :: Tree a -> [a]
treeToList t = foldMap (:[]) t
`,
    testCode: `runTestEq "treeSum" (6 :: Int) (treeSum (Branch (Leaf 1) (Branch (Leaf 2) (Leaf 3))))
        , runTestEq "treeSum single" (5 :: Int) (treeSum (Leaf 5))
        , runTestEq "treeProduct" (6 :: Int) (treeProduct (Branch (Leaf 1) (Branch (Leaf 2) (Leaf 3))))
        , runTestEq "treeToList" [1 :: Int, 2, 3] (treeToList (Branch (Leaf 1) (Branch (Leaf 2) (Leaf 3))))`,
    hints: [
      '<code>foldMap</code> takes a function <code>a -> m</code> (where <code>m</code> is a Monoid) and a Foldable structure. It maps then combines.',
      'For <code>treeSum</code>: wrap with <code>Sum</code>, then unwrap: <code>getSum (foldMap Sum t)</code>.',
      'For <code>treeToList</code>: each element becomes a singleton list. The function is <code>(:[])></code> or <code>\\x -> [x]</code>.',
      'Solutions: <code>getSum (foldMap Sum t)</code>, <code>getProduct (foldMap Product t)</code>, <code>foldMap (:[]) t</code>.',
    ],
    concepts: ['foldMap', 'monoid', 'Sum', 'Product', 'foldable'],
    successPatterns: [
      'foldMap\\s+Sum',
      'foldMap\\s+Product',
      'foldMap.*:\\[\\]',
    ],
    testNames: [
      'treeSum adds all leaves',
      'treeSum on single leaf',
      'treeProduct multiplies all leaves',
      'treeToList extracts leaves in order',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // APPLICATIVE & MONAD MODULE
  // ═══════════════════════════════════════════════════════════════════

  'maybe-monad': {
    id: 'maybe-monad',
    title: 'Maybe Monad: Chaining Fallible Operations',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>The <strong>Maybe monad</strong> lets you chain operations that might fail, without nested case expressions.</p>

<h3>The Problem</h3>
<p>Without monads, chaining fallible operations is painful:</p>
<pre><code>-- Ugly: nested case matching
findPhone userId = case lookupName userId of
  Nothing   -> Nothing
  Just name -> case lookupPhone name of
    Nothing    -> Nothing
    Just phone -> Just phone</code></pre>

<h3>The Bind Operator (&gt;&gt;=)</h3>
<p><code>(&gt;&gt;=)</code> (pronounced "bind") chains Maybe values:</p>
<pre><code>(&gt;&gt;=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Nothing  &gt;&gt;= f = Nothing   -- short-circuit on failure
Just x   &gt;&gt;= f = f x       -- pass the value to f</code></pre>

<p>The nested case becomes a clean chain:</p>
<pre><code>findPhone userId = lookupName userId &gt;&gt;= lookupPhone</code></pre>

<h3>Your Task</h3>
<p>Use <code>(&gt;&gt;=)</code> to chain fallible lookups and safe division.</p>
`,
    starterCode: `module MaybeMonad where

-- Sample data for lookups
type PhoneBook = [(String, String)]

phoneBook :: PhoneBook
phoneBook = [("Alice", "555-1234"), ("Bob", "555-5678")]

names :: [(Int, String)]
names = [(1, "Alice"), (2, "Bob")]

lookupName :: Int -> Maybe String
lookupName uid = lookup uid names

lookupPhone :: String -> Maybe String
lookupPhone name = lookup name phoneBook

-- EXERCISE: Use >>= to chain operations.

-- 1. Find a phone number by user ID.
--    Chain: lookupName uid >>= lookupPhone
findPhone :: Int -> Maybe String
findPhone uid = error "chain lookupName and lookupPhone with >>="

-- 2. Safe division that returns Nothing on divide-by-zero.
safeDivide :: Int -> Int -> Maybe Int
safeDivide x y = error "Nothing if y is 0, otherwise Just (x div y)"

-- 3. Chain two divisions: divide x by y, then divide that result by z.
chainDivide :: Int -> Int -> Int -> Maybe Int
chainDivide x y z = error "use >>= to chain two safeDivides"
`,
    solutionCode: `module MaybeMonad where

type PhoneBook = [(String, String)]

phoneBook :: PhoneBook
phoneBook = [("Alice", "555-1234"), ("Bob", "555-5678")]

names :: [(Int, String)]
names = [(1, "Alice"), (2, "Bob")]

lookupName :: Int -> Maybe String
lookupName uid = lookup uid names

lookupPhone :: String -> Maybe String
lookupPhone name = lookup name phoneBook

findPhone :: Int -> Maybe String
findPhone uid = lookupName uid >>= lookupPhone

safeDivide :: Int -> Int -> Maybe Int
safeDivide _ 0 = Nothing
safeDivide x y = Just (x \`div\` y)

chainDivide :: Int -> Int -> Int -> Maybe Int
chainDivide x y z = safeDivide x y >>= \\r -> safeDivide r z
`,
    testCode: `runTestEq "findPhone 1" (Just "555-1234") (findPhone 1)
        , runTestEq "findPhone 2" (Just "555-5678") (findPhone 2)
        , runTestEq "findPhone 99" (Nothing :: Maybe String) (findPhone 99)
        , runTestEq "safeDivide 10 2" (Just 5 :: Maybe Int) (safeDivide 10 2)
        , runTestEq "safeDivide 10 0" (Nothing :: Maybe Int) (safeDivide 10 0)
        , runTestEq "chainDivide 100 5 2" (Just 10 :: Maybe Int) (chainDivide 100 5 2)
        , runTestEq "chainDivide 100 0 2" (Nothing :: Maybe Int) (chainDivide 100 0 2)`,
    hints: [
      '<code>(&gt;&gt;=)</code> takes a <code>Maybe a</code> on the left and a function <code>a -> Maybe b</code> on the right.',
      'For <code>findPhone</code>: <code>lookupName uid &gt;&gt;= lookupPhone</code>. That\'s it — one line.',
      'For <code>safeDivide</code>: pattern match on <code>y</code>. If 0, return <code>Nothing</code>. Otherwise <code>Just (x \\`div\\` y)</code>.',
      'For <code>chainDivide</code>: <code>safeDivide x y &gt;&gt;= \\r -> safeDivide r z</code>.',
    ],
    concepts: ['monad', 'maybe', 'bind', 'chaining'],
    successPatterns: [
      '>>=\\s*lookupPhone',
      'safeDivide\\s*_\\s*0\\s*=\\s*Nothing',
      '>>=.*safeDivide',
    ],
    testNames: [
      'findPhone valid user',
      'findPhone second user',
      'findPhone invalid user',
      'safeDivide normal',
      'safeDivide by zero',
      'chainDivide success',
      'chainDivide first fails',
    ],
  },

  'do-notation': {
    id: 'do-notation',
    title: 'Do-Notation: Imperative-Style Haskell',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p><code>do</code>-notation is syntactic sugar for <code>(&gt;&gt;=)</code> that makes monadic code read like imperative code:</p>

<h3>The Translation</h3>
<pre><code>-- With >>= :
lookupName uid &gt;&gt;= \\name -> lookupPhone name

-- With do-notation:
do
  name &lt;- lookupName uid
  lookupPhone name</code></pre>

<p>The <code>&lt;-</code> arrow "extracts" the value from a <code>Maybe</code> (or any monad). If any step returns <code>Nothing</code>, the whole <code>do</code> block short-circuits.</p>

<h3>Rules</h3>
<ul>
  <li><code>x &lt;- action</code> — bind the result of <code>action</code> to <code>x</code></li>
  <li>The last line is the return value (no <code>&lt;-</code> needed)</li>
  <li>Use <code>return</code> or <code>Just</code> to wrap a pure value back into the monad</li>
</ul>

<h3>Your Task</h3>
<p>Rewrite <code>(&gt;&gt;=)</code> chains as <code>do</code> blocks, then build a validator.</p>
`,
    starterCode: `module DoNotation where

data User = User String Int String deriving (Show, Eq)

type PhoneBook = [(String, String)]

phoneBook :: PhoneBook
phoneBook = [("Alice", "555-1234"), ("Bob", "555-5678")]

names :: [(Int, String)]
names = [(1, "Alice"), (2, "Bob")]

lookupName :: Int -> Maybe String
lookupName uid = lookup uid names

lookupPhone :: String -> Maybe String
lookupPhone name = lookup name phoneBook

-- EXERCISE: Use do-notation.

-- 1. Rewrite findPhone using do-notation instead of >>=.
findPhone :: Int -> Maybe String
findPhone uid = error "use do-notation"
-- do
--   name <- lookupName uid
--   ???

-- 2. Validate user data. Return Nothing if any check fails.
--    - name must be non-empty
--    - age must be positive
--    - email must contain '@'
validateUser :: String -> Int -> String -> Maybe User
validateUser name age email = error "use do-notation to validate"
-- do
--   validName  <- if null name then Nothing else Just name
--   ...
`,
    solutionCode: `module DoNotation where

data User = User String Int String deriving (Show, Eq)

type PhoneBook = [(String, String)]

phoneBook :: PhoneBook
phoneBook = [("Alice", "555-1234"), ("Bob", "555-5678")]

names :: [(Int, String)]
names = [(1, "Alice"), (2, "Bob")]

lookupName :: Int -> Maybe String
lookupName uid = lookup uid names

lookupPhone :: String -> Maybe String
lookupPhone name = lookup name phoneBook

findPhone :: Int -> Maybe String
findPhone uid = do
  name <- lookupName uid
  lookupPhone name

validateUser :: String -> Int -> String -> Maybe User
validateUser name age email = do
  validName  <- if null name then Nothing else Just name
  validAge   <- if age <= 0  then Nothing else Just age
  validEmail <- if '@' \`elem\` email then Just email else Nothing
  Just (User validName validAge validEmail)
`,
    testCode: `runTestEq "findPhone 1" (Just "555-1234") (findPhone 1)
        , runTestEq "findPhone 99" (Nothing :: Maybe String) (findPhone 99)
        , runTestEq "valid user" (Just (User "Alice" 30 "a@b.com")) (validateUser "Alice" 30 "a@b.com")
        , runTestEq "empty name" (Nothing :: Maybe User) (validateUser "" 30 "a@b.com")
        , runTestEq "bad age" (Nothing :: Maybe User) (validateUser "Alice" 0 "a@b.com")
        , runTestEq "bad email" (Nothing :: Maybe User) (validateUser "Alice" 30 "invalid")`,
    hints: [
      '<code>do</code> notation: <code>x &lt;- action</code> binds the result. The last line is the return value.',
      'For <code>findPhone</code>: <code>do { name &lt;- lookupName uid; lookupPhone name }</code>.',
      'For <code>validateUser</code>: each step returns <code>Nothing</code> or <code>Just value</code>. Use <code>if ... then Nothing else Just ...</code>.',
      'The last line wraps the result: <code>Just (User validName validAge validEmail)</code>.',
    ],
    concepts: ['do-notation', 'monad', 'syntactic-sugar', 'validation'],
    successPatterns: [
      '<-\\s*lookupName',
      'validateUser.*=\\s*do',
      'if.*null.*Nothing.*Just',
    ],
    testNames: [
      'findPhone with do-notation',
      'findPhone missing user',
      'validateUser all valid',
      'validateUser empty name',
      'validateUser bad age',
      'validateUser bad email',
    ],
  },

  'either-error-handling': {
    id: 'either-error-handling',
    title: 'Either Monad: Errors with Context',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p><code>Either e a</code> is like <code>Maybe a</code> but carries an <strong>error message</strong> on failure:</p>
<pre><code>data Either e a = Left e | Right a

-- Left  = failure with error info
-- Right = success with value</code></pre>

<h3>Either as a Monad</h3>
<p><code>Either String</code> works with <code>do</code>-notation just like <code>Maybe</code>:</p>
<pre><code>parseInt :: String -> Either String Int
parseInt "42" = Right 42
parseInt s    = Left ("Not a number: " ++ s)

-- In do-notation:
do
  x &lt;- parseInt "42"    -- Right 42 → x = 42
  y &lt;- parseInt "abc"   -- Left "Not a number: abc" → whole block fails
  Right (x + y)          -- never reached</code></pre>

<p>The key advantage over <code>Maybe</code>: you get a <strong>descriptive error message</strong> instead of just <code>Nothing</code>.</p>

<h3>Your Task</h3>
<p>Build a config parser with descriptive error messages using the Either monad.</p>
`,
    starterCode: `module EitherErrorHandling where

data Config = Config String Int deriving (Show, Eq)

-- EXERCISE: Implement config parsing with Either for error messages.

-- 1. Parse a port string. Must be a number between 1 and 65535.
parsePort :: String -> Either String Int
parsePort s = error "parse and validate port"
-- Hint: use reads :: String -> [(Int, String)]
-- reads "8080" = [(8080, "")]
-- reads "abc"  = []

-- 2. Parse a host string. Must be non-empty.
parseHost :: String -> Either String String
parseHost h = error "validate host"

-- 3. Build a Config using do-notation.
--    Chain parseHost and parsePort with Either's monad.
buildConfig :: String -> String -> Either String Config
buildConfig hostStr portStr = error "use do-notation"
`,
    solutionCode: `module EitherErrorHandling where

data Config = Config String Int deriving (Show, Eq)

parsePort :: String -> Either String Int
parsePort s = case reads s of
  [(n, "")] | n > 0 && n < 65536 -> Right n
  _ -> Left ("Invalid port: " ++ s)

parseHost :: String -> Either String String
parseHost "" = Left "Host cannot be empty"
parseHost h  = Right h

buildConfig :: String -> String -> Either String Config
buildConfig hostStr portStr = do
  host <- parseHost hostStr
  port <- parsePort portStr
  Right (Config host port)
`,
    testCode: `runTestEq "valid config" (Right (Config "localhost" 8080)) (buildConfig "localhost" "8080")
        , runTestEq "empty host" (Left "Host cannot be empty" :: Either String Config) (buildConfig "" "8080")
        , runTestEq "bad port" (Left "Invalid port: abc" :: Either String Config) (buildConfig "localhost" "abc")
        , runTestEq "port too high" (Left "Invalid port: 99999" :: Either String Config) (buildConfig "localhost" "99999")
        , runTestEq "parsePort valid" (Right 443 :: Either String Int) (parsePort "443")
        , runTestEq "parseHost valid" (Right "example.com" :: Either String String) (parseHost "example.com")`,
    hints: [
      'Use <code>reads s :: [(Int, String)]</code> to try parsing. If it returns <code>[(n, "")]</code>, the parse succeeded.',
      'For <code>parsePort</code>: match on <code>reads s</code>. Check <code>n > 0 && n < 65536</code>. Return <code>Left ("Invalid port: " ++ s)</code> on failure.',
      'For <code>parseHost</code>: empty string → <code>Left "Host cannot be empty"</code>. Otherwise → <code>Right h</code>.',
      'For <code>buildConfig</code>: <code>do { host <- parseHost hostStr; port <- parsePort portStr; Right (Config host port) }</code>.',
    ],
    concepts: ['either', 'monad', 'error-handling', 'do-notation'],
    successPatterns: [
      'parsePort.*case\\s+reads',
      'parseHost.*Left.*Right|parseHost.*=.*Left',
      'buildConfig.*=\\s*do',
    ],
    testNames: [
      'valid config builds',
      'empty host fails',
      'invalid port fails',
      'out of range port fails',
      'parsePort valid',
      'parseHost valid',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ABSTRACT ALGEBRA MODULE
  // ═══════════════════════════════════════════════════════════════════

  'modular-arithmetic': {
    id: 'modular-arithmetic',
    title: 'Modular Arithmetic in Haskell',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p><strong>Modular arithmetic</strong> ("clock arithmetic") is the foundation of algebraic cryptography. In Z/7Z, all arithmetic wraps around at 7:</p>
<pre><code>3 + 5 = 8 = 1  (mod 7)
3 * 4 = 12 = 5 (mod 7)
-3 = 4          (mod 7, since 4 + 3 = 7 = 0)</code></pre>

<h3>Newtypes in Haskell</h3>
<p>A <code>newtype</code> wraps an existing type with zero runtime overhead:</p>
<pre><code>newtype Mod7 = Mod7 Int</code></pre>
<p>This creates a distinct type so the compiler prevents mixing <code>Mod7</code> values with regular <code>Int</code>s.</p>

<h3>Why Z/7Z?</h3>
<p>7 is prime, which means Z/7Z is a <strong>field</strong> — every non-zero element has a multiplicative inverse. This property is essential for cryptographic protocols like RSA and elliptic curve cryptography.</p>

<h3>Your Task</h3>
<p>Implement a <code>Mod7</code> type with proper modular arithmetic.</p>
`,
    starterCode: `module ModularArithmetic where

newtype Mod7 = Mod7 Int deriving (Show)

-- EXERCISE: Implement modular arithmetic for Z/7Z.

-- 1. Smart constructor: reduce any Int modulo 7.
mkMod7 :: Int -> Mod7
mkMod7 n = error "reduce n mod 7"

-- 2. Equality: two Mod7 values are equal if their underlying Ints are.
instance Eq Mod7 where
  (==) = error "implement equality"

-- 3. Num instance: all arithmetic reduces mod 7.
instance Num Mod7 where
  Mod7 a + Mod7 b   = error "add mod 7"
  Mod7 a * Mod7 b   = error "multiply mod 7"
  negate (Mod7 a)    = error "negate mod 7"
  fromInteger n      = error "convert Integer to Mod7"
  abs    = id
  signum _ = Mod7 1
`,
    solutionCode: `module ModularArithmetic where

newtype Mod7 = Mod7 Int deriving (Show)

mkMod7 :: Int -> Mod7
mkMod7 n = Mod7 (n \`mod\` 7)

instance Eq Mod7 where
  Mod7 a == Mod7 b = a == b

instance Num Mod7 where
  Mod7 a + Mod7 b = mkMod7 (a + b)
  Mod7 a * Mod7 b = mkMod7 (a * b)
  negate (Mod7 a) = mkMod7 (7 - a)
  fromInteger n   = mkMod7 (fromInteger n)
  abs    = id
  signum _ = Mod7 1
`,
    testCode: `runTestEq "mkMod7 10 = Mod7 3" (Mod7 3) (mkMod7 10)
        , runTestEq "mkMod7 7 = Mod7 0" (Mod7 0) (mkMod7 7)
        , runTestEq "3 + 5 = 1 (mod 7)" (Mod7 1) (Mod7 3 + Mod7 5)
        , runTestEq "3 * 4 = 5 (mod 7)" (Mod7 5) (Mod7 3 * Mod7 4)
        , runTestEq "negate 3 = 4 (mod 7)" (Mod7 4) (negate (Mod7 3))
        , runTestEq "0 + 0 = 0" (Mod7 0) (Mod7 0 + Mod7 0)`,
    hints: [
      '<code>mkMod7 n = Mod7 (n \\`mod\\` 7)</code> — use Haskell\'s <code>mod</code> to reduce.',
      'For addition: <code>Mod7 a + Mod7 b = mkMod7 (a + b)</code>. Same pattern for multiplication.',
      'Negation in mod 7: <code>negate (Mod7 a) = mkMod7 (7 - a)</code>. For example, -3 = 4 mod 7.',
      '<code>fromInteger n = mkMod7 (fromInteger n)</code> converts Integer literals to Mod7.',
    ],
    concepts: ['modular-arithmetic', 'newtype', 'Num', 'cryptography'],
    successPatterns: [
      'mkMod7.*mod.*7',
      'Mod7\\s+\\w+\\s*\\+\\s*Mod7\\s+\\w+\\s*=\\s*mkMod7',
      'negate.*mkMod7.*7\\s*-',
    ],
    testNames: [
      'mkMod7 reduces mod 7',
      'mkMod7 at boundary',
      'addition mod 7',
      'multiplication mod 7',
      'negation mod 7',
      'zero + zero',
    ],
  },

  'group-typeclass': {
    id: 'group-typeclass',
    title: 'Groups: Monoids with Inverses',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>A <strong>group</strong> is a monoid where every element has an <strong>inverse</strong>. The group axioms are:</p>
<ol>
  <li><strong>Closure:</strong> <code>a &lt;&gt; b</code> is always in the group</li>
  <li><strong>Associativity:</strong> <code>(a &lt;&gt; b) &lt;&gt; c == a &lt;&gt; (b &lt;&gt; c)</code></li>
  <li><strong>Identity:</strong> <code>mempty &lt;&gt; a == a</code></li>
  <li><strong>Inverse:</strong> <code>a &lt;&gt; invert a == mempty</code></li>
</ol>

<p>You already know Semigroup (axiom 1-2) and Monoid (axiom 3). Groups add axiom 4.</p>

<h3>The Typeclass Hierarchy</h3>
<pre><code>Semigroup  -- has (&lt;&gt;)
  => Monoid   -- adds mempty
    => Group  -- adds invert</code></pre>

<h3>Your Task</h3>
<p>Define a <code>Group</code> typeclass, implement it for <code>Mod7</code> (additive group), and write a law-checking function.</p>
`,
    starterCode: `module GroupTypeclass where

newtype Mod7 = Mod7 Int deriving (Show)

mkMod7 :: Int -> Mod7
mkMod7 n = Mod7 (n \`mod\` 7)

instance Eq Mod7 where
  Mod7 a == Mod7 b = a == b

instance Num Mod7 where
  Mod7 a + Mod7 b = mkMod7 (a + b)
  Mod7 a * Mod7 b = mkMod7 (a * b)
  negate (Mod7 a) = mkMod7 (7 - a)
  fromInteger n   = mkMod7 (fromInteger n)
  abs    = id
  signum _ = Mod7 1

-- EXERCISE: Define Group and implement it for Mod7.

-- 1. Make Mod7 a Semigroup (use + as the operation).
instance Semigroup Mod7 where
  (<>) = error "implement (<>) using +"

-- 2. Make Mod7 a Monoid (identity is 0 under addition).
instance Monoid Mod7 where
  mempty = error "implement mempty"

-- 3. Define the Group typeclass.
-- class Monoid a => Group a where
--   invert :: a -> a

-- 4. Implement Group for Mod7 (additive inverse = negate).
-- instance Group Mod7 where
--   invert = ???

-- 5. Check the inverse law: a <> invert a == mempty
-- inverseLaw :: (Group a, Eq a) => a -> Bool
-- inverseLaw a = ???
`,
    solutionCode: `module GroupTypeclass where

newtype Mod7 = Mod7 Int deriving (Show)

mkMod7 :: Int -> Mod7
mkMod7 n = Mod7 (n \`mod\` 7)

instance Eq Mod7 where
  Mod7 a == Mod7 b = a == b

instance Num Mod7 where
  Mod7 a + Mod7 b = mkMod7 (a + b)
  Mod7 a * Mod7 b = mkMod7 (a * b)
  negate (Mod7 a) = mkMod7 (7 - a)
  fromInteger n   = mkMod7 (fromInteger n)
  abs    = id
  signum _ = Mod7 1

instance Semigroup Mod7 where
  (<>) = (+)

instance Monoid Mod7 where
  mempty = Mod7 0

class Monoid a => Group a where
  invert :: a -> a

instance Group Mod7 where
  invert = negate

inverseLaw :: (Group a, Eq a) => a -> Bool
inverseLaw a = (a <> invert a == mempty) && (invert a <> a == mempty)
`,
    testCode: `runTestEq "Semigroup: 3 <> 5 = 1" (Mod7 1) (Mod7 3 <> Mod7 5)
        , runTestEq "Monoid: mempty = 0" (Mod7 0) (mempty :: Mod7)
        , runTestEq "invert 3 = 4" (Mod7 4) (invert (Mod7 3))
        , runTestEq "invert 0 = 0" (Mod7 0) (invert (Mod7 0))
        , runTestEq "inverseLaw 1" True (inverseLaw (Mod7 1))
        , runTestEq "inverseLaw 6" True (inverseLaw (Mod7 6))`,
    hints: [
      'For Semigroup: <code>(&lt;&gt;) = (+)</code>. We\'re using addition as the group operation.',
      'For Monoid: <code>mempty = Mod7 0</code> since 0 is the additive identity.',
      'Define <code>class Monoid a => Group a where invert :: a -> a</code>. For Mod7: <code>invert = negate</code>.',
      'The inverse law: <code>inverseLaw a = (a &lt;&gt; invert a == mempty) && (invert a &lt;&gt; a == mempty)</code>.',
    ],
    concepts: ['group', 'inverse', 'typeclass-hierarchy', 'axioms'],
    successPatterns: [
      'instance\\s+Semigroup\\s+Mod7',
      'class\\s+Monoid\\s+\\w+\\s*=>\\s*Group',
      'instance\\s+Group\\s+Mod7',
      'inverseLaw',
    ],
    testNames: [
      'Semigroup addition',
      'Monoid identity',
      'invert 3',
      'invert 0',
      'inverseLaw holds for 1',
      'inverseLaw holds for 6',
    ],
  },

  'ring-field': {
    id: 'ring-field',
    title: 'Rings and Fields',
    difficulty: 'advanced',
    order: 3,
    description: `
<p>A <strong>ring</strong> adds a second operation (multiplication) to a group. A <strong>field</strong> adds multiplicative inverses.</p>

<h3>The Hierarchy</h3>
<pre><code>Group     -- additive group: (+), 0, negate
  => Ring  -- adds: (*), 1, with distributive law
    => Field -- adds: multiplicative inverse for non-zero elements</code></pre>

<h3>Ring Axioms</h3>
<ul>
  <li>Addition forms a group (we have this from Group)</li>
  <li>Multiplication is associative with identity <code>one</code></li>
  <li>Distribution: <code>mul a (b &lt;&gt; c) == mul a b &lt;&gt; mul a c</code></li>
</ul>

<h3>Why Z/7Z is a Field</h3>
<p>Because 7 is <strong>prime</strong>, every non-zero element has a multiplicative inverse:</p>
<pre><code>1 * 1 = 1   (inverse of 1 is 1)
2 * 4 = 8 = 1   (inverse of 2 is 4)
3 * 5 = 15 = 1  (inverse of 3 is 5)
6 * 6 = 36 = 1  (inverse of 6 is 6)</code></pre>

<h3>Your Task</h3>
<p>Define Ring and Field typeclasses, implement them for Mod7, and verify the distributive law.</p>
`,
    starterCode: `module RingField where

newtype Mod7 = Mod7 Int deriving (Show)

mkMod7 :: Int -> Mod7
mkMod7 n = Mod7 (n \`mod\` 7)

instance Eq Mod7 where
  Mod7 a == Mod7 b = a == b

instance Num Mod7 where
  Mod7 a + Mod7 b = mkMod7 (a + b)
  Mod7 a * Mod7 b = mkMod7 (a * b)
  negate (Mod7 a) = mkMod7 (7 - a)
  fromInteger n   = mkMod7 (fromInteger n)
  abs = id
  signum _ = Mod7 1

instance Semigroup Mod7 where (<>) = (+)
instance Monoid Mod7 where mempty = Mod7 0

class Monoid a => Group a where invert :: a -> a
instance Group Mod7 where invert = negate

-- EXERCISE: Define Ring and Field.

-- 1. Ring: a Group with multiplication and a multiplicative identity.
-- class Group a => Ring a where
--   one :: a
--   mul :: a -> a -> a

-- 2. Implement Ring for Mod7.
-- instance Ring Mod7 where
--   one = ???
--   mul (Mod7 a) (Mod7 b) = ???

-- 3. Field: a Ring where every non-zero element has a multiplicative inverse.
-- class Ring a => Field a where
--   mulInv :: a -> a

-- 4. Implement Field for Mod7.
--    To find the inverse of a (mod 7): search for x where a*x = 1 (mod 7).
-- instance Field Mod7 where
--   mulInv (Mod7 0) = error "no inverse for 0"
--   mulInv (Mod7 a) = ???

-- 5. Check the distributive law: mul a (b <> c) == mul a b <> mul a c
-- distributionLaw :: (Ring a, Eq a) => a -> a -> a -> Bool
-- distributionLaw a b c = ???
`,
    solutionCode: `module RingField where

newtype Mod7 = Mod7 Int deriving (Show)

mkMod7 :: Int -> Mod7
mkMod7 n = Mod7 (n \`mod\` 7)

instance Eq Mod7 where
  Mod7 a == Mod7 b = a == b

instance Num Mod7 where
  Mod7 a + Mod7 b = mkMod7 (a + b)
  Mod7 a * Mod7 b = mkMod7 (a * b)
  negate (Mod7 a) = mkMod7 (7 - a)
  fromInteger n   = mkMod7 (fromInteger n)
  abs = id
  signum _ = Mod7 1

instance Semigroup Mod7 where (<>) = (+)
instance Monoid Mod7 where mempty = Mod7 0

class Monoid a => Group a where invert :: a -> a
instance Group Mod7 where invert = negate

class Group a => Ring a where
  one :: a
  mul :: a -> a -> a

instance Ring Mod7 where
  one = Mod7 1
  mul (Mod7 a) (Mod7 b) = mkMod7 (a * b)

class Ring a => Field a where
  mulInv :: a -> a

instance Field Mod7 where
  mulInv (Mod7 0) = error "no inverse for 0"
  mulInv (Mod7 a) = mkMod7 (head [x | x <- [1..6], (a * x) \`mod\` 7 == 1])

distributionLaw :: (Ring a, Eq a) => a -> a -> a -> Bool
distributionLaw a b c = mul a (b <> c) == (mul a b <> mul a c)
`,
    testCode: `runTestEq "mul 3 4 = 5 (mod 7)" (Mod7 5) (mul (Mod7 3) (Mod7 4))
        , runTestEq "mul one x = x" (Mod7 3) (mul one (Mod7 3))
        , runTestEq "mulInv 3 = 5" (Mod7 5) (mulInv (Mod7 3))
        , runTestEq "mulInv 2 = 4" (Mod7 4) (mulInv (Mod7 2))
        , runTestEq "3 * inv 3 = 1" (Mod7 1) (mul (Mod7 3) (mulInv (Mod7 3)))
        , runTestEq "distributionLaw" True (distributionLaw (Mod7 2) (Mod7 3) (Mod7 4))`,
    hints: [
      'Define <code>class Group a => Ring a where one :: a; mul :: a -> a -> a</code>.',
      'For Mod7: <code>one = Mod7 1</code>, <code>mul (Mod7 a) (Mod7 b) = mkMod7 (a * b)</code>.',
      'For <code>mulInv</code>: find <code>x</code> where <code>a * x \\`mod\\` 7 == 1</code>. Try: <code>head [x | x <- [1..6], (a*x) \\`mod\\` 7 == 1]</code>.',
      'Distribution law: <code>mul a (b &lt;&gt; c) == (mul a b &lt;&gt; mul a c)</code>.',
    ],
    concepts: ['ring', 'field', 'multiplicative-inverse', 'distribution'],
    successPatterns: [
      'class\\s+Group\\s+\\w+\\s*=>\\s*Ring',
      'class\\s+Ring\\s+\\w+\\s*=>\\s*Field',
      'instance\\s+Ring\\s+Mod7',
      'instance\\s+Field\\s+Mod7',
    ],
    testNames: [
      'multiplication mod 7',
      'multiplicative identity',
      'mulInv 3 = 5',
      'mulInv 2 = 4',
      'x * inv(x) = 1',
      'distributive law',
    ],
  },

  'group-homomorphism': {
    id: 'group-homomorphism',
    title: 'Group Homomorphisms',
    difficulty: 'advanced',
    order: 4,
    description: `
<p>A <strong>homomorphism</strong> is a structure-preserving map between algebraic structures — the algebra equivalent of a natural transformation between functors.</p>

<h3>The Key Property</h3>
<p>A function <code>f</code> is a group homomorphism if:</p>
<pre><code>f (a &lt;&gt; b) == f a &lt;&gt; f b</code></pre>
<p>This means: combining inputs then mapping gives the same result as mapping then combining outputs.</p>

<h3>Examples</h3>
<pre><code>-- id is always a homomorphism:
id (a &lt;&gt; b) == id a &lt;&gt; id b   -- trivially true

-- negate is a homomorphism of additive groups:
negate (a + b) == negate a + negate b   -- true!

-- (+1) is NOT a homomorphism:
(a + b) + 1 /= (a + 1) + (b + 1)   -- false! (extra +1)</code></pre>

<h3>The Parallel with Natural Transformations</h3>
<p>In category theory: <code>fmap f . alpha == alpha . fmap f</code> (naturality).<br/>
In algebra: <code>f (a &lt;&gt; b) == f a &lt;&gt; f b</code> (homomorphism).<br/>
Both say: <strong>structure is preserved under the map</strong>.</p>

<h3>Your Task</h3>
<p>Write a function that checks whether a given function is a group homomorphism, then test various functions.</p>
`,
    starterCode: `module GroupHomomorphism where

newtype Mod7 = Mod7 Int deriving (Show)

mkMod7 :: Int -> Mod7
mkMod7 n = Mod7 (n \`mod\` 7)

instance Eq Mod7 where Mod7 a == Mod7 b = a == b
instance Num Mod7 where
  Mod7 a + Mod7 b = mkMod7 (a + b)
  Mod7 a * Mod7 b = mkMod7 (a * b)
  negate (Mod7 a) = mkMod7 (7 - a)
  fromInteger n   = mkMod7 (fromInteger n)
  abs = id; signum _ = Mod7 1
instance Semigroup Mod7 where (<>) = (+)
instance Monoid Mod7 where mempty = Mod7 0

class Monoid a => Group a where invert :: a -> a
instance Group Mod7 where invert = negate

-- EXERCISE: Check if a function is a group homomorphism.

-- A function f is a homomorphism if:
--   f (a <> b) == f a <> f b
-- for all a, b in the group.

-- 1. Write a function that checks this property for a list of test pairs.
isHomomorphism :: (Group a, Group b, Eq b) => (a -> b) -> [(a, a)] -> Bool
isHomomorphism f pairs = error "check f (a <> b) == f a <> f b for all pairs"

-- Test pairs for Mod7
testPairs :: [(Mod7, Mod7)]
testPairs = [(Mod7 a, Mod7 b) | a <- [0..6], b <- [0..6]]

-- 2. Try these functions — which are homomorphisms?
-- doubleIt :: Mod7 -> Mod7
-- doubleIt x = x <> x
--
-- addOne :: Mod7 -> Mod7
-- addOne (Mod7 x) = mkMod7 (x + 1)
`,
    solutionCode: `module GroupHomomorphism where

newtype Mod7 = Mod7 Int deriving (Show)

mkMod7 :: Int -> Mod7
mkMod7 n = Mod7 (n \`mod\` 7)

instance Eq Mod7 where Mod7 a == Mod7 b = a == b
instance Num Mod7 where
  Mod7 a + Mod7 b = mkMod7 (a + b)
  Mod7 a * Mod7 b = mkMod7 (a * b)
  negate (Mod7 a) = mkMod7 (7 - a)
  fromInteger n   = mkMod7 (fromInteger n)
  abs = id; signum _ = Mod7 1
instance Semigroup Mod7 where (<>) = (+)
instance Monoid Mod7 where mempty = Mod7 0

class Monoid a => Group a where invert :: a -> a
instance Group Mod7 where invert = negate

isHomomorphism :: (Group a, Group b, Eq b) => (a -> b) -> [(a, a)] -> Bool
isHomomorphism f pairs = all (\\(a, b) -> f (a <> b) == f a <> f b) pairs

testPairs :: [(Mod7, Mod7)]
testPairs = [(Mod7 a, Mod7 b) | a <- [0..6], b <- [0..6]]

doubleIt :: Mod7 -> Mod7
doubleIt x = x <> x

addOne :: Mod7 -> Mod7
addOne (Mod7 x) = mkMod7 (x + 1)
`,
    testCode: `runTestEq "id is homomorphism" True (isHomomorphism (id :: Mod7 -> Mod7) testPairs)
        , runTestEq "negate is homomorphism" True (isHomomorphism (negate :: Mod7 -> Mod7) testPairs)
        , runTestEq "doubleIt is homomorphism" True (isHomomorphism doubleIt testPairs)
        , runTestEq "addOne is NOT homomorphism" False (isHomomorphism addOne testPairs)`,
    hints: [
      'For each pair <code>(a, b)</code>, check if <code>f (a &lt;&gt; b) == f a &lt;&gt; f b</code>.',
      'Use <code>all</code> to check the property for every pair: <code>all (\\(a,b) -> ...) pairs</code>.',
      'The check: <code>all (\\(a, b) -> f (a &lt;&gt; b) == f a &lt;&gt; f b) pairs</code>.',
      'Full: <code>isHomomorphism f pairs = all (\\(a, b) -> f (a &lt;&gt; b) == f a &lt;&gt; f b) pairs</code>. Also define <code>doubleIt x = x &lt;&gt; x</code> and <code>addOne (Mod7 x) = mkMod7 (x + 1)</code>.',
    ],
    concepts: ['homomorphism', 'structure-preservation', 'group-theory', 'cryptography'],
    successPatterns: [
      'isHomomorphism\\s+\\w+\\s+\\w+\\s*=\\s*all',
      'f\\s*\\(\\w+\\s*<>\\s*\\w+\\)\\s*==\\s*f\\s+\\w+\\s*<>\\s*f',
      'doubleIt',
      'addOne',
    ],
    testNames: [
      'id is a homomorphism',
      'negate is a homomorphism',
      'doubleIt is a homomorphism',
      'addOne is NOT a homomorphism',
    ],
  },
};

// ────────────────────────────────────────────────────────────────────
// Lookups — module mapping comes from curriculum.ts (single source of truth)
// ────────────────────────────────────────────────────────────────────

import { getExerciseIdsForModule } from './curriculum';

export function getExercise(id: string): Exercise | undefined {
  return exercises[id];
}

export function getExercisesByModule(moduleSlug: string): Exercise[] {
  const ids = getExerciseIdsForModule(moduleSlug);
  return ids.map((id) => exercises[id]).filter(Boolean);
}

export function getAllExercises(): Exercise[] {
  return Object.values(exercises);
}

export function getExerciseIds(): string[] {
  return Object.keys(exercises);
}
