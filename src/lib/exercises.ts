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
};

// ────────────────────────────────────────────────────────────────────
// Module → Exercise mapping
// ────────────────────────────────────────────────────────────────────

const moduleExerciseIds: Record<string, string[]> = {
  'type-systems': [
    'basic-functions',
    'concrete-types',
    'pattern-matching',
    'algebraic-data-types',
    'polymorphic-types',
    'parametric-polymorphism',
    'typeclasses-intro',
  ],
  'category-theory': [
    'using-fmap',
    'functor-instance',
    'functor-laws',
    'natural-transformation',
  ],
};

export function getExercise(id: string): Exercise | undefined {
  return exercises[id];
}

export function getExercisesByModule(moduleSlug: string): Exercise[] {
  const ids = moduleExerciseIds[moduleSlug] || [];
  return ids.map((id) => exercises[id]).filter(Boolean);
}

export function getAllExercises(): Exercise[] {
  return Object.values(exercises);
}

export function getExerciseIds(): string[] {
  return Object.keys(exercises);
}
