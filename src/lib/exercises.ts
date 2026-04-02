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
<p>Just like the <code>Eq</code> and <code>Show</code> instances you wrote in the Type Systems module, <code>Semigroup</code> is a typeclass. You implement it with the same <code>instance ... where</code> syntax:</p>
<pre><code>class Semigroup a where
  (&lt;&gt;) :: a -> a -> a</code></pre>

<p>You already know several semigroups:</p>
<pre><code>"hello" &lt;&gt; " world"   -- "hello world"  (String concatenation)
[1,2] &lt;&gt; [3,4]        -- [1,2,3,4]      (List append)</code></pre>

<p>Notice the pattern: <code>(&lt;&gt;)</code> takes two values of the <strong>same type</strong> and produces another value of that type. The operation differs by type — for strings it concatenates, for lists it appends.</p>

<h3>The Associativity Law</h3>
<p>A Semigroup must satisfy: <code>(a &lt;&gt; b) &lt;&gt; c == a &lt;&gt; (b &lt;&gt; c)</code>. Grouping doesn't matter — just like <code>(1 + 2) + 3 == 1 + (2 + 3)</code> for addition.</p>

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
--
-- The syntax is the same as writing Eq or Show instances:
--   instance Semigroup Inventory where
--     ...

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
      'The syntax is <code>instance Semigroup Inventory where</code> — same structure as writing <code>instance Eq TrafficLight where</code>.',
      'Pattern match on both <code>Inventory</code> values to access their fields.',
      'Each field is combined with <code>+</code>: swords + swords, shields + shields, potions + potions.',
      'The pattern is: <code>Inventory s1 sh1 p1 <> Inventory s2 sh2 p2 = Inventory (s1+s2) (sh1+sh2) (p1+p2)</code>',
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

<p>The <code>Semigroup a =></code> before <code>Monoid a</code> is a <strong>constraint</strong> — it means "to be a Monoid, a type must already be a Semigroup." You'll see this pattern often in Haskell: typeclasses building on each other.</p>

<p>The identity element satisfies: <code>mempty &lt;&gt; x == x</code> and <code>x &lt;&gt; mempty == x</code>. It's the "do nothing" value.</p>

<h3>Examples</h3>
<pre><code>mempty :: String    -- ""     (empty string)
mempty :: [a]       -- []     (empty list)

-- mempty <> anything = anything:
"" ++ "hello"       -- "hello"
[] ++ [1, 2, 3]     -- [1, 2, 3]</code></pre>

<h3>Why Monoids Matter</h3>
<p>With a Monoid, you can <code>mconcat</code> any list of values into one — it folds the list using <code>(&lt;&gt;)</code>, starting from <code>mempty</code>:</p>
<pre><code>mconcat ["a", "b", "c"]    -- "abc"
mconcat [[1,2], [3]]       -- [1,2,3]
mconcat ([] :: [String])   -- ""     (empty list gives mempty)</code></pre>

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
--    The constraint "Semigroup a => Monoid a" is already satisfied
--    because we wrote the Semigroup instance above.
instance Monoid Inventory where
  mempty = error "implement mempty"

-- 2. Write a function that checks both identity laws.
--    Left identity:  mempty <> x == x
--    Right identity: x <> mempty == x
--
--    Note the constraint syntax: (Monoid a, Eq a) => means
--    "this works for any type a that is both a Monoid and has Eq."
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

<h3>The Tree Type</h3>
<p>We'll fold over a binary tree. Here's the data type and a visual example:</p>
<pre><code>data Tree a = Leaf a | Branch (Tree a) (Tree a)</code></pre>
<pre><code>     Branch
    /      \\
  Leaf 1   Branch
          /      \\
        Leaf 2  Leaf 3</code></pre>
<p>A <code>Leaf</code> holds a single value. A <code>Branch</code> holds two subtrees (left and right) but no value of its own. If you did the Functor module, you've seen this type before.</p>

<h3>The Key Function: foldr</h3>
<pre><code>class Foldable t where
  foldr :: (a -> b -> b) -> b -> t a -> b</code></pre>

<p><code>foldr f acc structure</code> folds from the right, combining each element with an accumulator:</p>
<pre><code>-- On lists:
foldr (+) 0 [1,2,3]  -- 1 + (2 + (3 + 0)) = 6
foldr (:) [] [1,2,3] -- 1 : (2 : (3 : [])) = [1,2,3]</code></pre>

<h3>Folding a Tree</h3>
<p>Let's trace <code>foldr (+) 0</code> on the tree above (Branch (Leaf 1) (Branch (Leaf 2) (Leaf 3))):</p>
<ol>
  <li><strong>Branch case:</strong> We need to fold the whole tree. Since <code>foldr</code> folds from the <em>right</em>, we fold the right subtree first to get an intermediate accumulator, then fold the left subtree with that result.</li>
  <li><strong>Fold right subtree</strong> <code>Branch (Leaf 2) (Leaf 3)</code>:
    <ul>
      <li>Fold its right subtree <code>Leaf 3</code>: <code>(+) 3 0 = 3</code> (accumulator was 0)</li>
      <li>Fold its left subtree <code>Leaf 2</code> with new accumulator 3: <code>(+) 2 3 = 5</code></li>
    </ul>
  </li>
  <li><strong>Fold left subtree</strong> <code>Leaf 1</code> with accumulator 5: <code>(+) 1 5 = 6</code></li>
</ol>
<p>Result: <strong>6</strong>. The leaves were visited in order: 1, 2, 3 (left to right).</p>

<h3>Free Functions from Foldable</h3>
<p>Once you implement <code>foldr</code>, you get many functions for free:</p>
<pre><code>toList :: Foldable t => t a -> [a]
length :: Foldable t => t a -> Int
sum    :: (Foldable t, Num a) => t a -> a</code></pre>

<h3>Your Task</h3>
<p>Implement <code>Foldable</code> for <code>Tree</code>. Two equations, one per constructor.</p>
`,
    starterCode: `module FoldableBasics where

data Tree a = Leaf a | Branch (Tree a) (Tree a)
  deriving (Show, Eq)

-- EXERCISE: Implement Foldable for Tree.
--
-- Two cases, just like Functor:
--
-- Case 1: Leaf x
--   You have one element x and an accumulator acc.
--   Just combine them: f x acc
--
-- Case 2: Branch l r
--   Two subtrees, no element of its own.
--   Step A: fold the RIGHT subtree first to get an intermediate acc.
--           let acc' = foldr f acc r
--   Step B: fold the LEFT subtree using that intermediate acc.
--           foldr f acc' l
--   Combined: foldr f (foldr f acc r) l

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
      'For <code>Branch l r</code>: first fold the right subtree to get an intermediate accumulator. Think of it as: <code>let acc\' = foldr f acc r</code>.',
      'Then fold the left subtree using that intermediate accumulator: <code>foldr f acc\' l</code>. Inline it: <code>foldr f (foldr f acc r) l</code>.',
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

<h3>The Problem: Numbers Have Multiple Monoids</h3>
<p>Strings have one obvious way to combine: concatenation. But numbers can be combined by <em>addition</em> or <em>multiplication</em> — two different Monoid instances for the same type! Haskell can't have two instances of the same typeclass for <code>Int</code>, so it uses <strong>newtype wrappers</strong> to distinguish them:</p>
<pre><code>import Data.Monoid (Sum(..), Product(..))

-- Sum wraps a number to use addition as <>:
Sum 3 &lt;&gt; Sum 4         -- Sum 7

-- Product wraps a number to use multiplication as <>:
Product 3 &lt;&gt; Product 4 -- Product 12</code></pre>
<p><code>Sum</code> and <code>Product</code> are just thin wrappers. To get the number back out, use <code>getSum</code> or <code>getProduct</code>:</p>
<pre><code>getSum (Sum 7)          -- 7
getProduct (Product 12) -- 12</code></pre>

<h3>foldMap in Action</h3>
<p>Let's trace <code>foldMap Sum</code> on <code>Branch (Leaf 1) (Leaf 2)</code>:</p>
<ol>
  <li><code>Sum</code> is applied to each leaf: <code>Leaf 1</code> becomes <code>Sum 1</code>, <code>Leaf 2</code> becomes <code>Sum 2</code></li>
  <li>The results are combined with <code>(&lt;&gt;)</code>: <code>Sum 1 &lt;&gt; Sum 2 = Sum 3</code></li>
  <li>Unwrap: <code>getSum (Sum 3) = 3</code></li>
</ol>

<p>More examples:</p>
<pre><code>foldMap Sum [1,2,3]          -- Sum 6
foldMap Product [1,2,3]      -- Product 6
foldMap (\\x -> [x]) [1,2,3]  -- [1,2,3]  (each element -> singleton list)</code></pre>
<p>The last one uses lists as a Monoid (where <code>(&lt;&gt;) = (++)</code>). Each element becomes a one-element list, and they get concatenated together.</p>

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
--    Strategy: wrap each element with Sum, foldMap combines them,
--    then unwrap with getSum.
--    Example: getSum (foldMap Sum (Branch (Leaf 1) (Leaf 2))) = 3
treeSum :: Num a => Tree a -> a
treeSum t = error "use foldMap with Sum"

-- 2. Multiply all values in the tree.
--    Same pattern as treeSum but with Product / getProduct.
treeProduct :: Num a => Tree a -> a
treeProduct t = error "use foldMap with Product"

-- 3. Convert the tree to a list.
--    Strategy: each element becomes a singleton list [x].
--    Written as a lambda: \\x -> [x]
--    (You may also see the shorthand (:[]) — it means the same thing.)
--    foldMap combines them with (++) since lists are a Monoid.
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
      'For <code>treeToList</code>: each element becomes a singleton list. You can write <code>\\x -> [x]</code> or the shorthand <code>(:[]) </code> — both mean "put x in a one-element list."',
      'Solutions: <code>getSum (foldMap Sum t)</code>, <code>getProduct (foldMap Product t)</code>, <code>foldMap (\\x -> [x]) t</code> or <code>foldMap (:[]) t</code>.',
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
<h3>From Functor to Monad</h3>
<p>You've already used <code>fmap</code> to apply a function inside a <code>Maybe</code>:</p>
<pre><code>fmap (+1) (Just 5)   -- Just 6
fmap (+1) Nothing    -- Nothing</code></pre>
<p>But what if your function <em>itself</em> returns a <code>Maybe</code>? Then <code>fmap</code> gives you a <strong>nested</strong> result:</p>
<pre><code>fmap lookup (Just key)  -- Maybe (Maybe value)  -- nested!</code></pre>
<p>The <strong>bind operator</strong> <code>(&gt;&gt;=)</code> solves this: it maps the function and then <em>flattens</em> the result, avoiding nesting.</p>

<h3>The Problem: Nested Case Expressions</h3>
<p>Imagine chaining two lookups — find a user's name by ID, then look up their phone number. Without <code>(&gt;&gt;=)</code>, you'd write nested cases:</p>
<pre><code>-- Without >>= : deeply nested and repetitive
result = case lookupName userId of
  Nothing   -> Nothing
  Just name -> case lookupPhone name of
    Nothing    -> Nothing
    Just phone -> Just phone</code></pre>
<p>Each step repeats the same pattern: "if Nothing, short-circuit; if Just, continue." With three or four steps, the nesting becomes unreadable.</p>

<h3>The Bind Operator (&gt;&gt;=)</h3>
<p><code>(&gt;&gt;=)</code> (pronounced "bind") captures that repeated pattern:</p>
<pre><code>(&gt;&gt;=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Nothing  &gt;&gt;= f = Nothing   -- short-circuit on failure
Just x   &gt;&gt;= f = f x       -- unwrap, apply f (which may also fail)</code></pre>

<p>Now the nested case becomes:</p>
<pre><code>result = lookupName userId &gt;&gt;= lookupPhone</code></pre>
<p>Read this as: "look up the name, and <em>if that succeeds</em>, feed it to lookupPhone."</p>

<h3>Before vs. After</h3>
<table>
  <thead><tr><th>Without &gt;&gt;=</th><th>With &gt;&gt;=</th></tr></thead>
  <tbody>
    <tr><td>Nested case for each step</td><td>Flat chain: <code>a &gt;&gt;= f &gt;&gt;= g</code></td></tr>
    <tr><td>Repetitive Nothing handling</td><td>Short-circuits automatically</td></tr>
    <tr><td>Grows rightward with depth</td><td>Stays flat regardless of length</td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Implement three functions:</p>
<ol>
  <li><code>safeDivide</code> — a helper that returns <code>Nothing</code> on divide-by-zero (this is not monadic itself, but the next two functions chain it monadically)</li>
  <li><code>findPhone</code> — chain two lookups with <code>(&gt;&gt;=)</code></li>
  <li><code>chainDivide</code> — chain two safe divisions with <code>(&gt;&gt;=)</code></li>
</ol>
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

-- 1. Safe division that returns Nothing on divide-by-zero.
--    This is a plain helper — not monadic — but we'll chain it next.
--    Pattern match on y: if 0, Nothing. Otherwise Just (x \`div\` y).
safeDivide :: Int -> Int -> Maybe Int
safeDivide x y = error "Nothing if y is 0, otherwise Just (x div y)"

-- 2. Find a phone number by user ID.
--    Chain two lookups: lookupName uid >>= lookupPhone
--    Read this as: "look up the name, then if it succeeds, look up the phone."
findPhone :: Int -> Maybe String
findPhone uid = error "chain lookupName and lookupPhone with >>="

-- 3. Chain two divisions: divide x by y, then divide that result by z.
--    Use >>= with a lambda: safeDivide x y >>= \\r -> safeDivide r z
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
      'For <code>safeDivide</code>: pattern match on <code>y</code>. If 0, return <code>Nothing</code>. Otherwise <code>Just (x \\`div\\` y)</code>.',
      '<code>(&gt;&gt;=)</code> takes a <code>Maybe a</code> on the left and a function <code>a -> Maybe b</code> on the right.',
      'For <code>findPhone</code>: <code>lookupName uid &gt;&gt;= lookupPhone</code>. That\'s it — one line. The <code>&gt;&gt;=</code> handles the Nothing case for you.',
      'For <code>chainDivide</code>: <code>safeDivide x y &gt;&gt;= \\r -> safeDivide r z</code>. The lambda <code>\\r -> ...</code> receives the result of the first division.',
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
<p><code>do</code>-notation is syntactic sugar for <code>(&gt;&gt;=)</code> that makes monadic code read like imperative code.</p>

<h3>Desugaring Rules</h3>
<p>The compiler translates <code>do</code> blocks into <code>(&gt;&gt;=)</code> chains. Here are the rules:</p>
<table>
  <thead><tr><th>do-notation</th><th>Desugars to</th></tr></thead>
  <tbody>
    <tr><td><code>do { x &lt;- action; rest }</code></td><td><code>action &gt;&gt;= \\x -> rest</code></td></tr>
    <tr><td><code>do { action; rest }</code></td><td><code>action &gt;&gt; rest</code></td></tr>
    <tr><td><code>do { let x = expr; rest }</code></td><td><code>let x = expr in rest</code></td></tr>
    <tr><td><code>do { lastAction }</code></td><td><code>lastAction</code></td></tr>
  </tbody>
</table>

<h3>An Example</h3>
<pre><code>-- With >>= :
lookupName uid &gt;&gt;= \\name -> lookupPhone name

-- With do-notation (same thing):
do
  name &lt;- lookupName uid
  lookupPhone name</code></pre>

<p>The <code>&lt;-</code> arrow "extracts" the value from a <code>Maybe</code> (or any monad). If any step returns <code>Nothing</code>, the whole <code>do</code> block short-circuits to <code>Nothing</code>.</p>

<h3>Important: <code>return</code> is NOT Imperative Return</h3>
<p>In Haskell, <code>return</code> does <strong>not</strong> exit a function early. It simply wraps a pure value into the monad. For <code>Maybe</code>, <code>return x</code> is just <code>Just x</code>:</p>
<pre><code>return 42 :: Maybe Int  -- Just 42
Just 42                 -- exactly the same thing</code></pre>
<p>You can use either <code>return</code> or <code>Just</code> — they mean the same thing for Maybe.</p>

<h3>if-then-else with Maybe</h3>
<p>You can use <code>if-then-else</code> inside a <code>do</code> block to validate data. Each branch returns a <code>Maybe</code>:</p>
<pre><code>validateAge :: Int -> Maybe Int
validateAge age = if age > 0 then Just age else Nothing</code></pre>
<p>Inside a <code>do</code> block, you bind the result with <code>&lt;-</code>:</p>
<pre><code>do
  validAge &lt;- if age > 0 then Just age else Nothing
  -- validAge is now an Int, not a Maybe Int
  ...</code></pre>

<h3>Your Task</h3>
<p>Rewrite <code>findPhone</code> using <code>do</code>-notation, then build a user validator.</p>
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
--    Remember: x <- action binds the result.
--    The last line IS the return value (no <- needed).
findPhone :: Int -> Maybe String
findPhone uid = error "use do-notation"
-- do
--   name <- lookupName uid
--   ???

-- 2. Validate user data. Return Nothing if any check fails.
--    - name must be non-empty
--    - age must be positive
--    - email must contain '@'
--
--    Use if-then-else for each check:
--      validName <- if null name then Nothing else Just name
--    The last line wraps the validated fields into a User.
--    Use Just (not return) to keep it explicit for now.
validateUser :: String -> Int -> String -> Maybe User
validateUser name age email = error "use do-notation to validate"
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
      'For <code>findPhone</code>: start with <code>do</code>, then <code>name &lt;- lookupName uid</code> on the next line, then <code>lookupPhone name</code> as the last line.',
      'Remember: the last line of a <code>do</code> block is the return value. No need for <code>&lt;-</code> on it.',
      'For <code>validateUser</code>: each check is <code>validX &lt;- if condition then Just value else Nothing</code>. If any returns <code>Nothing</code>, the whole block short-circuits.',
      'The last line wraps the result: <code>Just (User validName validAge validEmail)</code>. Remember, <code>Just</code> and <code>return</code> are the same for Maybe.',
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

<h3>How Either's Bind Works</h3>
<p>Either's <code>(&gt;&gt;=)</code> works just like Maybe's, but preserves the error:</p>
<pre><code>Right x &gt;&gt;= f = f x        -- success: apply f
Left  e &gt;&gt;= f = Left e     -- failure: pass the error through unchanged</code></pre>
<p>This means in a <code>do</code> block, the <strong>first</strong> <code>Left</code> value short-circuits the whole chain, and its error message is preserved:</p>
<pre><code>do
  x &lt;- Right 42        -- success, x = 42
  y &lt;- Left "oops"     -- failure! the whole block returns Left "oops"
  Right (x + y)         -- never reached</code></pre>

<h3>Parsing with <code>reads</code></h3>
<p>Haskell's <code>reads</code> function tries to parse a string into a value. Its return type is a list of (value, remainingString) pairs:</p>
<pre><code>reads :: Read a => String -> [(a, String)]

reads "8080"  :: [(Int, String)]  -- [(8080, "")]    -- success: parsed 8080, nothing left
reads "8080x" :: [(Int, String)]  -- [(8080, "x")]   -- parsed 8080 but "x" remains
reads "abc"   :: [(Int, String)]  -- []              -- no parse at all</code></pre>
<p>A successful <em>complete</em> parse gives <code>[(n, "")]</code> — the value <code>n</code> and an empty remaining string <code>""</code>. You match on this pattern to detect success.</p>

<h3>Either as a Monad</h3>
<p><code>Either String</code> works with <code>do</code>-notation just like <code>Maybe</code>:</p>
<pre><code>parseInt :: String -> Either String Int
parseInt s = case reads s of
  [(n, "")] -> Right n
  _         -> Left ("Not a number: " ++ s)

-- In do-notation:
do
  x &lt;- parseInt "42"    -- Right 42, so x = 42
  y &lt;- parseInt "abc"   -- Left "Not a number: abc", whole block fails
  Right (x + y)          -- never reached</code></pre>

<p>The key advantage over <code>Maybe</code>: you get a <strong>descriptive error message</strong> instead of just <code>Nothing</code>.</p>

<h3>Your Task</h3>
<p>Build a config parser with descriptive error messages using the Either monad.</p>
`,
    starterCode: `module EitherErrorHandling where

data Config = Config String Int deriving (Show, Eq)

-- EXERCISE: Implement config parsing with Either for error messages.

-- 1. Parse a port string. Must be a number between 1 and 65535.
--
--    Strategy:
--      a) Use "reads s" to try parsing. Check for [(n, "")].
--      b) If parse succeeded AND n is in range, return Right n.
--      c) Otherwise return Left ("Invalid port: " ++ s).
--
--    You can use a case expression:
--      case reads s of
--        [(n, "")] -> if n > 0 && n < 65536 then Right n else Left ...
--        _         -> Left ("Invalid port: " ++ s)
parsePort :: String -> Either String Int
parsePort s = error "parse and validate port"

-- 2. Parse a host string. Must be non-empty.
--    Empty string -> Left "Host cannot be empty"
--    Otherwise    -> Right h
parseHost :: String -> Either String String
parseHost h = error "validate host"

-- 3. Build a Config using do-notation.
--    Chain parseHost and parsePort with Either's monad.
--    The first Left will short-circuit, just like Nothing does for Maybe.
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
      'Use <code>reads s :: [(Int, String)]</code> to try parsing. If it returns <code>[(n, "")]</code>, the parse fully succeeded (empty remaining string).',
      'For <code>parsePort</code>: match on <code>reads s</code>. If <code>[(n, "")]</code> and <code>n > 0 && n < 65536</code>, return <code>Right n</code>. Otherwise return <code>Left ("Invalid port: " ++ s)</code>.',
      'For <code>parseHost</code>: pattern match on empty string vs non-empty. <code>parseHost "" = Left "Host cannot be empty"</code>; <code>parseHost h = Right h</code>.',
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
<p><strong>Modular arithmetic</strong> is "clock arithmetic" — numbers wrap around at a fixed modulus. Think of a clock face, but instead of 12, we use 7:</p>
<pre><code>        0
      /   \\
    6       1
    |       |
    5       2
      \\   /
     4 - 3</code></pre>
<p>Going past 6 wraps back to 0. This number system is called <strong>Z/7Z</strong> ("the integers modulo 7").</p>

<h3>Arithmetic in Z/7Z</h3>
<pre><code>3 + 5 = 8 = 1  (mod 7)     -- 8 wraps around past 6
3 * 4 = 12 = 5 (mod 7)     -- 12 mod 7 = 5</code></pre>

<h3>Negation in Z/7Z</h3>
<p>The negation of <code>a</code> is the number you add to <code>a</code> to get 0. For example:</p>
<pre><code>negate 3 = ?
3 + ? = 0  (mod 7)
3 + 4 = 7 = 0  (mod 7)
So: negate 3 = 4</code></pre>
<p>In general: <code>negate a = 7 - a</code> (reduced mod 7).</p>

<h3>Newtypes in Haskell</h3>
<p>A <code>newtype</code> wraps an existing type with zero runtime overhead:</p>
<pre><code>newtype Mod7 = Mod7 Int</code></pre>
<p>This creates a distinct type so the compiler prevents mixing <code>Mod7</code> values with regular <code>Int</code>s.</p>

<h3>Why Z/7Z?</h3>
<p>7 is prime, which means Z/7Z is a <strong>field</strong> — every non-zero element has a multiplicative inverse. We'll see why this matters in later exercises when we build up the full algebraic hierarchy.</p>

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
--    Use mkMod7 in +, *, negate, and fromInteger to ensure
--    the result is always in range [0..6].
--
--    abs and signum are boilerplate — Haskell's Num class requires
--    them, but they don't make much sense for modular arithmetic.
--    We just define them trivially so the code compiles.
instance Num Mod7 where
  Mod7 a + Mod7 b   = error "add mod 7"
  Mod7 a * Mod7 b   = error "multiply mod 7"
  negate (Mod7 a)    = error "negate mod 7 (hint: mkMod7 (7 - a))"
  fromInteger n      = error "convert Integer to Mod7"
  abs    = id        -- boilerplate: required by Num, not meaningful here
  signum _ = Mod7 1  -- boilerplate: required by Num, not meaningful here
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
      'Negation in mod 7: <code>negate (Mod7 a) = mkMod7 (7 - a)</code>. For example, negate 3 = 4 because 3 + 4 = 7 = 0 mod 7.',
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

<p>You already know Semigroup (axioms 1-2) and Monoid (axiom 3). Groups add axiom 4.</p>

<h3>Defining Your Own Typeclass</h3>
<p>Until now, you've only <em>written instances</em> of existing typeclasses (Eq, Show, Semigroup, etc.). Now you'll <strong>define a brand-new typeclass</strong>. The syntax is:</p>
<pre><code>class ClassName a where
  methodName :: TypeSignature</code></pre>
<p>For example, you'll write a <code>Group</code> class with one method, <code>invert</code>:</p>
<pre><code>class Monoid a => Group a where
  invert :: a -> a</code></pre>
<p>After defining the class, you write instances for it — the same <code>instance ... where</code> syntax you already know.</p>

<h3>Superclass Constraints</h3>
<p>The <code>Monoid a =></code> before <code>Group a</code> is a <strong>superclass constraint</strong>. It means: "to be a Group, a type must already be a Monoid." This ensures that any Group has <code>(&lt;&gt;)</code> and <code>mempty</code> available. It mirrors the mathematical fact that every group is also a monoid.</p>

<h3>What You're Building</h3>
<pre><code>Semigroup   -- has (&lt;&gt;)
  |
  v
Monoid      -- adds mempty
  |
  v
Group       -- adds invert  &lt;-- YOU DEFINE THIS</code></pre>

<h3>Your Task</h3>
<p>Write the Semigroup and Monoid instances for Mod7, define the Group typeclass, implement it for Mod7, and write a law-checking function.</p>
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
--    This is a one-liner: (<>) is the same as (+) for our additive group.
instance Semigroup Mod7 where
  (<>) = error "implement (<>) using +"

-- 2. Make Mod7 a Monoid (identity is 0 under addition).
instance Monoid Mod7 where
  mempty = error "implement mempty"

-- 3. Define the Group typeclass.
--    Uncomment and complete:
-- class Monoid a => Group a where
--   invert :: a -> a

-- 4. Implement Group for Mod7 (additive inverse = negate).
--    Uncomment and complete:
-- instance Group Mod7 where
--   invert = ???

-- 5. Check the inverse law: a <> invert a == mempty AND invert a <> a == mempty
--    Uncomment and complete:
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
      'The class definition: <code>class Monoid a => Group a where invert :: a -> a</code>. For the instance: <code>invert = negate</code> (reuses the Num negation you already wrote).',
      'The inverse law checks both sides: <code>inverseLaw a = (a &lt;&gt; invert a == mempty) && (invert a &lt;&gt; a == mempty)</code>.',
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
<p>A <strong>ring</strong> adds a second operation (multiplication) to a group. A <strong>field</strong> adds multiplicative inverses. We're extending the same typeclass hierarchy you built in the previous exercise.</p>

<h3>The Hierarchy</h3>
<pre><code>Semigroup -- has (&lt;&gt;)
  => Monoid   -- adds mempty
    => Group     -- adds invert
      => Ring      -- adds mul, one
        => Field     -- adds mulInv</code></pre>

<h3>Ring Axioms</h3>
<ul>
  <li>Addition forms a group (we have this from Group)</li>
  <li>Multiplication is associative with identity <code>one</code></li>
  <li><strong>Distribution:</strong> <code>mul a (b &lt;&gt; c) == mul a b &lt;&gt; mul a c</code></li>
</ul>

<h3>The Distribution Law</h3>
<p>Let's verify with concrete numbers in Z/7Z:</p>
<pre><code>mul 2 (3 &lt;&gt; 4) = mul 2 (Mod7 0)  = Mod7 0   -- since 3+4=7=0 mod 7
mul 2 3 &lt;&gt; mul 2 4 = Mod7 6 &lt;&gt; Mod7 1 = Mod7 0   -- since 6+1=7=0 mod 7
-- Both sides equal Mod7 0. Distribution holds!</code></pre>

<h3>Why Z/7Z is a Field</h3>
<p>Because 7 is <strong>prime</strong>, every non-zero element has a multiplicative inverse:</p>
<pre><code>1 * 1 = 1   (inverse of 1 is 1)
2 * 4 = 8 = 1   (inverse of 2 is 4)
3 * 5 = 15 = 1  (inverse of 3 is 5)
6 * 6 = 36 = 1  (inverse of 6 is 6)</code></pre>

<h3>Finding Multiplicative Inverses</h3>
<p>To find the multiplicative inverse of <code>a</code>, we need <code>x</code> where <code>a * x = 1 (mod 7)</code>. A simple approach: try all values from 1 to 6 and pick the one that works.</p>
<p>Worked example for <code>a = 3</code>:</p>
<pre><code>3 * 1 = 3  (not 1)
3 * 2 = 6  (not 1)
3 * 3 = 9 = 2  (not 1)
3 * 4 = 12 = 5 (not 1)
3 * 5 = 15 = 1  -- found it! Inverse of 3 is 5.</code></pre>
<p>In Haskell, a list comprehension does this search: <code>head [x | x &lt;- [1..6], (a * x) \`mod\` 7 == 1]</code></p>

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
-- Same pattern as Group: define the class, then write the instance.

-- 1. Ring: a Group with multiplication and a multiplicative identity.
--    Uncomment and complete:
-- class Group a => Ring a where
--   one :: a
--   mul :: a -> a -> a

-- 2. Implement Ring for Mod7.
--    Uncomment and complete:
-- instance Ring Mod7 where
--   one = ???
--   mul (Mod7 a) (Mod7 b) = ???

-- 3. Field: a Ring where every non-zero element has a multiplicative inverse.
--    Uncomment and complete:
-- class Ring a => Field a where
--   mulInv :: a -> a

-- 4. Implement Field for Mod7.
--    To find the inverse of a: search 1..6 for x where a*x = 1 (mod 7).
--    Use: head [x | x <- [1..6], (a * x) \`mod\` 7 == 1]
--    Uncomment and complete:
-- instance Field Mod7 where
--   mulInv (Mod7 0) = error "no inverse for 0"
--   mulInv (Mod7 a) = ???

-- 5. Check the distributive law: mul a (b <> c) == mul a b <> mul a c
--    Uncomment and complete:
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
      'Define <code>class Group a => Ring a where one :: a; mul :: a -> a -> a</code>. Same pattern as defining Group.',
      'For Mod7: <code>one = Mod7 1</code>, <code>mul (Mod7 a) (Mod7 b) = mkMod7 (a * b)</code>.',
      'For <code>mulInv</code>: brute-force search! <code>mkMod7 (head [x | x <- [1..6], (a*x) \\`mod\\` 7 == 1])</code>.',
      'Distribution law: <code>mul a (b &lt;&gt; c) == (mul a b &lt;&gt; mul a c)</code>. Remember <code>(&lt;&gt;)</code> is addition here.',
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
<p>A <strong>homomorphism</strong> is a structure-preserving map between algebraic structures.</p>

<h3>The Key Property</h3>
<p>A function <code>f</code> is a group homomorphism if:</p>
<pre><code>f (a &lt;&gt; b) == f a &lt;&gt; f b</code></pre>
<p>This means: combining inputs then mapping gives the same result as mapping then combining outputs.</p>

<h3>Before You Code: Predict!</h3>
<p>Which of these functions on Z/7Z do you think are homomorphisms? Make your predictions before testing:</p>
<ul>
  <li><code>id</code> — the identity function</li>
  <li><code>negate</code> — additive inverse</li>
  <li><code>doubleIt x = x &lt;&gt; x</code> — adding a number to itself</li>
  <li><code>addOne (Mod7 x) = mkMod7 (x + 1)</code> — shift everything by 1</li>
</ul>
<p>Think about it: does <code>f (a &lt;&gt; b)</code> always equal <code>f a &lt;&gt; f b</code>?</p>

<h3>Examples</h3>
<pre><code>-- id is always a homomorphism:
id (a &lt;&gt; b) == id a &lt;&gt; id b   -- trivially true

-- negate is a homomorphism of additive groups:
negate (a + b) == negate a + negate b   -- true!

-- (+1) is NOT a homomorphism:
(a + b) + 1 /= (a + 1) + (b + 1)   -- left has one +1, right has two!</code></pre>

<h3>Why Does doubleIt Work?</h3>
<p><code>doubleIt x = x &lt;&gt; x</code> (i.e., <code>2*x</code> in the additive group). It's a homomorphism because Z/7Z addition is <strong>commutative</strong>:</p>
<pre><code>doubleIt (a &lt;&gt; b) = (a &lt;&gt; b) &lt;&gt; (a &lt;&gt; b)
                   = a &lt;&gt; a &lt;&gt; b &lt;&gt; b       -- associativity + commutativity
                   = doubleIt a &lt;&gt; doubleIt b</code></pre>
<p>The rearrangement relies on being able to swap <code>b</code> and <code>a</code> — that's commutativity.</p>

<h3>The Parallel with Functors</h3>
<p>If you've done the Functors module, you may notice a structural similarity:</p>
<pre><code>-- Natural transformation (functors):
fmap f . alpha == alpha . fmap f

-- Homomorphism (groups):
f (a &lt;&gt; b) == f a &lt;&gt; f b</code></pre>
<p>Both say the same thing: <strong>structure is preserved under the map</strong>. Homomorphisms are to groups what natural transformations are to functors.</p>

<h3>Your Task</h3>
<p>Write a function that checks whether a given function is a group homomorphism, then define and test various functions.</p>
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
--    Use "all" to verify the property holds for every pair.
isHomomorphism :: (Group a, Group b, Eq b) => (a -> b) -> [(a, a)] -> Bool
isHomomorphism f pairs = error "check f (a <> b) == f a <> f b for all pairs"

-- Test pairs: all combinations in Z/7Z (a complete check for this finite group)
testPairs :: [(Mod7, Mod7)]
testPairs = [(Mod7 a, Mod7 b) | a <- [0..6], b <- [0..6]]

-- 2. Define these functions and test them.
--    Which are homomorphisms? (Check your predictions from the description!)
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
      'The full check: <code>isHomomorphism f pairs = all (\\(a, b) -> f (a &lt;&gt; b) == f a &lt;&gt; f b) pairs</code>.',
      'Don\'t forget to uncomment and define <code>doubleIt x = x &lt;&gt; x</code> and <code>addOne (Mod7 x) = mkMod7 (x + 1)</code>. Bonus: try <code>tripleIt x = x &lt;&gt; x &lt;&gt; x</code> — is it a homomorphism too?',
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

  // ═══════════════════════════════════════════════════════════════════
  // FUNCTIONAL ALGORITHMS MODULE
  // ═══════════════════════════════════════════════════════════════════

  'recursion-patterns': {
    id: 'recursion-patterns',
    title: 'Recursion Patterns: foldr vs foldl',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>You've used <code>foldr</code> in the Foldable module. Now let's understand the <strong>two fundamental ways to fold</strong> — and when to use each — by implementing common list functions.</p>

<h3>Structural Recursion</h3>
<p>The simplest recursion pattern: handle the base case (<code>[]</code>), then the recursive case (<code>x:xs</code>):</p>
<pre><code>myLength :: [a] -> Int
myLength []     = 0              -- base case
myLength (_:xs) = 1 + myLength xs -- recursive case</code></pre>
<p>This is <strong>structural recursion</strong> — the function follows the structure of the data type.</p>

<h3>Two Ways to Fold</h3>
<p><code>foldr</code> and <code>foldl</code> build their computation in opposite directions:</p>
<pre><code>foldr f z [1,2,3] = f 1 (f 2 (f 3 z))     -- right-associative
                  = 1 \`f\` (2 \`f\` (3 \`f\` z))

foldl f z [1,2,3] = f (f (f z 1) 2) 3      -- left-associative
                  = ((z \`f\` 1) \`f\` 2) \`f\` 3</code></pre>

<h3>When to Use Which</h3>
<table>
  <thead><tr><th>Use</th><th>When</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>foldr</code></td><td>Building structures, works on infinite lists</td><td><code>map</code>, <code>filter</code>, <code>concat</code></td></tr>
    <tr><td><code>foldl</code></td><td>Accumulating a single value left-to-right</td><td><code>reverse</code>, <code>sum</code>, <code>length</code></td></tr>
  </tbody>
</table>

<h3>The Key Insight: map and filter ARE folds</h3>
<pre><code>-- map as a fold: replace (:) with (f x :) and [] with []
map f xs = foldr (\\x acc -> f x : acc) [] xs

-- filter as a fold: conditionally keep elements
filter p xs = foldr (\\x acc -> if p x then x : acc else acc) [] xs

-- reverse as a left fold: build from the opposite end
reverse xs = foldl (\\acc x -> x : acc) [] xs</code></pre>

<h3>Your Task</h3>
<p>Implement four common list functions: one with explicit recursion, and three using folds.</p>
`,
    starterCode: `module RecursionPatterns where

-- EXERCISE: Implement these list functions.

-- 1. Sum a list using explicit structural recursion (no fold).
--    Base case: empty list has sum 0.
--    Recursive case: head + sum of tail.
mySum :: [Int] -> Int
mySum xs = error "pattern match on [] and (x:xs)"

-- 2. Reverse a list using foldl.
--    foldl builds from the left — perfect for reversing.
--    Accumulator starts as [], each step prepends the element.
--    Hint: foldl (\\acc x -> x : acc) [] xs
myReverse :: [a] -> [a]
myReverse xs = error "use foldl"

-- 3. Map a function over a list using foldr.
--    foldr replaces (:) with your function and [] with [].
--    Hint: foldr (\\x acc -> f x : acc) [] xs
myMap :: (a -> b) -> [a] -> [b]
myMap f xs = error "use foldr"

-- 4. Filter elements using foldr.
--    Like map, but only include elements where p is True.
--    Hint: foldr (\\x acc -> if p x then x : acc else acc) [] xs
myFilter :: (a -> Bool) -> [a] -> [a]
myFilter p xs = error "use foldr with an if"
`,
    solutionCode: `module RecursionPatterns where

mySum :: [Int] -> Int
mySum []     = 0
mySum (x:xs) = x + mySum xs

myReverse :: [a] -> [a]
myReverse = foldl (\\acc x -> x : acc) []

myMap :: (a -> b) -> [a] -> [b]
myMap f = foldr (\\x acc -> f x : acc) []

myFilter :: (a -> Bool) -> [a] -> [a]
myFilter p = foldr (\\x acc -> if p x then x : acc else acc) []
`,
    testCode: `runTestEq "mySum [1,2,3]" (6 :: Int) (mySum [1,2,3])
        , runTestEq "mySum []" (0 :: Int) (mySum [])
        , runTestEq "mySum [10]" (10 :: Int) (mySum [10])
        , runTestEq "myReverse [1,2,3]" [3,2,1 :: Int] (myReverse [1,2,3])
        , runTestEq "myReverse []" ([] :: [Int]) (myReverse [])
        , runTestEq "myMap (+1) [1,2,3]" [2,3,4 :: Int] (myMap (+1) [1,2,3])
        , runTestEq "myMap show [1,2]" ["1","2"] (myMap show [1 :: Int, 2])
        , runTestEq "myFilter even [1..6]" [2,4,6 :: Int] (myFilter even [1,2,3,4,5,6])
        , runTestEq "myFilter (>3) [1,5,2,4]" [5,4 :: Int] (myFilter (>3) [1,5,2,4])`,
    hints: [
      'For <code>mySum</code>, pattern match: <code>mySum [] = 0</code> and <code>mySum (x:xs) = x + mySum xs</code>.',
      'For <code>myReverse</code>, <code>foldl</code> processes left-to-right, prepending each element: <code>foldl (\\acc x -> x : acc) [] xs</code>.',
      'For <code>myMap</code>, use <code>foldr</code>: transform each element and cons it: <code>foldr (\\x acc -> f x : acc) [] xs</code>. For <code>myFilter</code>, add a condition.',
      'Full solutions: <code>mySum (x:xs) = x + mySum xs</code>. <code>myReverse = foldl (\\acc x -> x : acc) []</code>. <code>myMap f = foldr (\\x acc -> f x : acc) []</code>. <code>myFilter p = foldr (\\x acc -> if p x then x : acc else acc) []</code>.',
    ],
    concepts: ['recursion', 'foldr', 'foldl', 'structural-recursion'],
    successPatterns: [
      'mySum\\s+\\[\\]\\s*=\\s*0',
      'foldl.*:.*acc',
      'foldr.*f\\s+\\w+.*:.*acc',
      'if\\s+p\\s+\\w+',
    ],
    testNames: [
      'mySum sums a list',
      'mySum empty list',
      'myReverse reverses',
      'myMap transforms',
      'myFilter selects',
    ],
  },

  'higher-order-algorithms': {
    id: 'higher-order-algorithms',
    title: 'Higher-Order Algorithm Design',
    difficulty: 'beginner',
    order: 2,
    description: `
<p>In imperative languages, algorithms are loops. In Haskell, algorithms are <strong>compositions of higher-order functions</strong>. Let's build some standard library functions from scratch.</p>

<h3>takeWhile and dropWhile</h3>
<p>These split a list at the first element that fails a predicate:</p>
<pre><code>takeWhile even [2,4,1,6] = [2,4]     -- takes while True
dropWhile even [2,4,1,6] = [1,6]     -- drops while True

-- Visually:
--   [2, 4, 1, 6]
--    ^  ^  |
--    take  stop (1 is odd)
--         [1, 6] = drop</code></pre>

<h3>span: Both at Once</h3>
<p><code>span</code> splits a list into (takeWhile, dropWhile) in a single pass:</p>
<pre><code>span even [2,4,1,6] = ([2,4], [1,6])</code></pre>

<h3>groupBy: Chunking</h3>
<p><code>groupBy</code> groups consecutive elements that satisfy a relation:</p>
<pre><code>groupBy (==) [1,1,2,2,2,3] = [[1,1], [2,2,2], [3]]
groupBy (<=) [1,2,3,1,2]   = [[1,2,3], [1,2]]</code></pre>
<p>The key insight: <code>groupBy</code> uses <code>span</code> to peel off the first group, then recurses on the rest.</p>

<h3>Pattern Matching with Guards</h3>
<p>Guards let you add conditions to pattern matches:</p>
<pre><code>absolute :: Int -> Int
absolute n
  | n >= 0    = n           -- if n >= 0
  | otherwise = negate n    -- otherwise (i.e., n < 0)</code></pre>

<h3>Your Task</h3>
<p>Implement <code>myTakeWhile</code>, <code>myDropWhile</code>, <code>mySpan</code>, and <code>myGroupBy</code>. Each builds on the previous.</p>
`,
    starterCode: `module HigherOrderAlgorithms where

-- EXERCISE: Implement these list algorithms.

-- 1. Take elements from the front while predicate holds.
--    Stop at the first element where p returns False.
--    Hint: pattern match on [] and (x:xs), use a guard.
myTakeWhile :: (a -> Bool) -> [a] -> [a]
myTakeWhile p xs = error "implement myTakeWhile"

-- 2. Drop elements from the front while predicate holds.
--    Return the rest starting from the first False.
myDropWhile :: (a -> Bool) -> [a] -> [a]
myDropWhile p xs = error "implement myDropWhile"

-- 3. Split: (takeWhile p xs, dropWhile p xs) in one pass.
--    Hint: in the recursive case, let (ys, zs) = mySpan p xs
--          then return (x:ys, zs).
mySpan :: (a -> Bool) -> [a] -> ([a], [a])
mySpan p xs = error "implement mySpan"

-- 4. Group consecutive elements using a relation.
--    Hint: use mySpan to split off the first group.
--    groupBy eq (x:xs) = let (group, rest) = mySpan (eq x) xs
--                        in (x:group) : myGroupBy eq rest
myGroupBy :: (a -> a -> Bool) -> [a] -> [[a]]
myGroupBy eq xs = error "implement myGroupBy"
`,
    solutionCode: `module HigherOrderAlgorithms where

myTakeWhile :: (a -> Bool) -> [a] -> [a]
myTakeWhile _ []     = []
myTakeWhile p (x:xs)
  | p x      = x : myTakeWhile p xs
  | otherwise = []

myDropWhile :: (a -> Bool) -> [a] -> [a]
myDropWhile _ []     = []
myDropWhile p (x:xs)
  | p x      = myDropWhile p xs
  | otherwise = x : xs

mySpan :: (a -> Bool) -> [a] -> ([a], [a])
mySpan _ []     = ([], [])
mySpan p (x:xs)
  | p x       = let (ys, zs) = mySpan p xs in (x:ys, zs)
  | otherwise  = ([], x:xs)

myGroupBy :: (a -> a -> Bool) -> [a] -> [[a]]
myGroupBy _ []     = []
myGroupBy eq (x:xs) =
  let (ys, zs) = mySpan (eq x) xs
  in (x:ys) : myGroupBy eq zs
`,
    testCode: `runTestEq "takeWhile even [2,4,1,6]" [2,4 :: Int] (myTakeWhile even [2,4,1,6])
        , runTestEq "takeWhile even []" ([] :: [Int]) (myTakeWhile even [])
        , runTestEq "takeWhile even [1,2]" ([] :: [Int]) (myTakeWhile even [1,2])
        , runTestEq "dropWhile even [2,4,1,6]" [1,6 :: Int] (myDropWhile even [2,4,1,6])
        , runTestEq "dropWhile even [2,4,6]" ([] :: [Int]) (myDropWhile even [2,4,6])
        , runTestEq "span even [2,4,1,6]" ([2,4 :: Int], [1,6]) (mySpan even [2,4,1,6])
        , runTestEq "span even [1,2,3]" (([] :: [Int]), [1,2,3]) (mySpan even [1,2,3])
        , runTestEq "groupBy (==) [1,1,2,2,3]" [[1,1],[2,2],[3 :: Int]] (myGroupBy (==) [1,1,2,2,3])
        , runTestEq "groupBy (==) []" ([] :: [[Int]]) (myGroupBy (==) [])`,
    hints: [
      'For <code>myTakeWhile</code>: base case <code>[] -> []</code>. For <code>(x:xs)</code>, if <code>p x</code> then keep <code>x</code> and recurse; otherwise return <code>[]</code>.',
      'For <code>mySpan</code>: when <code>p x</code> holds, recurse on <code>xs</code> to get <code>(ys, zs)</code>, then return <code>(x:ys, zs)</code>. When <code>p x</code> fails, return <code>([], x:xs)</code>.',
      'For <code>myGroupBy</code>: use <code>mySpan (eq x) xs</code> to get the first group and the rest. The first group is <code>x:ys</code>, then recurse on <code>zs</code>.',
      'Full: <code>myTakeWhile p (x:xs) | p x = x : myTakeWhile p xs | otherwise = []</code>. <code>myGroupBy eq (x:xs) = let (ys, zs) = mySpan (eq x) xs in (x:ys) : myGroupBy eq zs</code>.',
    ],
    concepts: ['higher-order-functions', 'guards', 'span', 'groupBy'],
    successPatterns: [
      'myTakeWhile.*\\[\\]\\s*=\\s*\\[\\]',
      'let.*mySpan\\s+p',
      'let.*mySpan.*eq',
    ],
    testNames: [
      'takeWhile takes matching prefix',
      'dropWhile skips prefix',
      'span splits at predicate',
      'groupBy chunks equal elements',
    ],
  },

  'lazy-infinite-lists': {
    id: 'lazy-infinite-lists',
    title: 'Lazy Evaluation and Infinite Lists',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>Haskell is <strong>lazy</strong> — it doesn't compute a value until you actually need it. This enables something impossible in strict languages: <strong>infinite data structures</strong>.</p>

<h3>How Laziness Works</h3>
<pre><code>-- In Python: [x*2 for x in range(1, 1000000000)]  -- allocates 1 billion elements immediately
-- In Haskell: map (*2) [1..]                        -- nothing computed yet!
--             take 5 (map (*2) [1..])               -- only computes 5 elements: [2,4,6,8,10]</code></pre>
<p>Haskell computes only what <code>take</code> demands. The rest of the infinite list is never touched.</p>

<h3>iterate: Building Infinite Sequences</h3>
<p><code>iterate</code> applies a function repeatedly:</p>
<pre><code>iterate f x = [x, f x, f (f x), f (f (f x)), ...]

take 5 (iterate (*2) 1)   -- [1, 2, 4, 8, 16]
take 4 (iterate (+3) 0)   -- [0, 3, 6, 9]</code></pre>

<h3>The Fibonacci Trick</h3>
<p>The Fibonacci sequence can be defined as a self-referential list:</p>
<pre><code>fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

-- How it works:
-- fibs       = 0 : 1 : 1 : 2 : 3 : 5 : ...
-- tail fibs  = 1 : 1 : 2 : 3 : 5 : 8 : ...
-- zipWith +  = 1 : 2 : 3 : 5 : 8 : 13 : ...
-- Result: 0 : 1 : [1, 2, 3, 5, 8, 13, ...]</code></pre>
<p>Laziness makes this work — each element is computed only when needed, and the computed values are <strong>shared</strong> (not recomputed).</p>

<h3>Your Task</h3>
<p>Implement infinite list generators and use laziness to work with infinite data.</p>
`,
    starterCode: `module LazyInfiniteLists where

-- EXERCISE: Work with infinite lists.

-- 1. Implement iterate: generate [x, f x, f (f x), ...]
--    This is an infinite list — Haskell's laziness makes it work.
myIterate :: (a -> a) -> a -> [a]
myIterate f x = error "x : myIterate f (f x)"

-- 2. Implement repeat and replicate.
--    repeat x = [x, x, x, ...]  (infinite)
--    replicate n x = take n (repeat x)
myRepeat :: a -> [a]
myRepeat x = error "x : myRepeat x"

myReplicate :: Int -> a -> [a]
myReplicate n x = error "use take and myRepeat"

-- 3. The Fibonacci sequence as an infinite list.
--    fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
--    zipWith f xs ys applies f to corresponding elements.
fibs :: [Int]
fibs = error "0 : 1 : zipWith (+) fibs (tail fibs)"

-- Index into the Fibonacci sequence (0-indexed).
fibN :: Int -> Int
fibN n = error "use !! to index into fibs"

-- 4. From the infinite list [1..], find numbers divisible by both 3 and 5.
--    Use filter on the infinite list [1..].
fizzBuzzNumbers :: [Int]
fizzBuzzNumbers = error "filter from [1..]"
`,
    solutionCode: `module LazyInfiniteLists where

myIterate :: (a -> a) -> a -> [a]
myIterate f x = x : myIterate f (f x)

myRepeat :: a -> [a]
myRepeat x = x : myRepeat x

myReplicate :: Int -> a -> [a]
myReplicate n x = take n (myRepeat x)

fibs :: [Int]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

fibN :: Int -> Int
fibN n = fibs !! n

fizzBuzzNumbers :: [Int]
fizzBuzzNumbers = filter (\\n -> n \`mod\` 3 == 0 && n \`mod\` 5 == 0) [1..]
`,
    testCode: `runTestEq "take 5 (myIterate (*2) 1)" [1,2,4,8,16 :: Int] (take 5 (myIterate (*2) 1))
        , runTestEq "take 4 (myIterate (+3) 0)" [0,3,6,9 :: Int] (take 4 (myIterate (+3) 0))
        , runTestEq "myReplicate 3 'a'" "aaa" (myReplicate 3 'a')
        , runTestEq "myReplicate 0 'x'" "" (myReplicate 0 'x')
        , runTestEq "take 8 fibs" [0,1,1,2,3,5,8,13 :: Int] (take 8 fibs)
        , runTestEq "fibN 0" (0 :: Int) (fibN 0)
        , runTestEq "fibN 6" (8 :: Int) (fibN 6)
        , runTestEq "fibN 10" (55 :: Int) (fibN 10)
        , runTestEq "take 4 fizzBuzzNumbers" [15,30,45,60 :: Int] (take 4 fizzBuzzNumbers)`,
    hints: [
      'For <code>myIterate</code>: the current value is the head, the tail applies <code>f</code> once more: <code>x : myIterate f (f x)</code>. This never terminates — laziness ensures only what you <code>take</code> is computed.',
      'For <code>fibs</code>: the definition is self-referential. <code>zipWith (+) fibs (tail fibs)</code> adds corresponding elements of the sequence and its shift. Start with <code>0 : 1 : ...</code>.',
      'For <code>fizzBuzzNumbers</code>: <code>filter</code> works on infinite lists because Haskell is lazy. The predicate checks <code>n \\`mod\\` 3 == 0 && n \\`mod\\` 5 == 0</code>.',
      'Full: <code>myIterate f x = x : myIterate f (f x)</code>. <code>fibs = 0 : 1 : zipWith (+) fibs (tail fibs)</code>. <code>fibN n = fibs !! n</code>. <code>fizzBuzzNumbers = filter (\\n -> n \\`mod\\` 3 == 0 && n \\`mod\\` 5 == 0) [1..]</code>.',
    ],
    concepts: ['laziness', 'infinite-lists', 'iterate', 'corecursion', 'fibonacci'],
    successPatterns: [
      'myIterate.*=.*:.*myIterate',
      'myRepeat.*=.*:.*myRepeat',
      'fibs.*=.*0.*:.*1.*:.*zipWith',
      'filter.*mod',
    ],
    testNames: [
      'myIterate generates sequence',
      'myReplicate creates copies',
      'fibs produces Fibonacci',
      'fibN indexes correctly',
      'fizzBuzzNumbers filters infinite list',
    ],
  },

  'divide-and-conquer': {
    id: 'divide-and-conquer',
    title: 'Divide and Conquer: Merge Sort',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p><strong>Divide and conquer</strong> is one of the most important algorithmic patterns. In Haskell, pattern matching and recursion make it particularly clean.</p>

<h3>The Pattern</h3>
<ol>
  <li><strong>Divide</strong> — split the problem into smaller subproblems</li>
  <li><strong>Conquer</strong> — solve each subproblem recursively</li>
  <li><strong>Combine</strong> — merge the results</li>
</ol>

<h3>Merge Sort: The Plan</h3>
<pre><code>     [3, 1, 4, 1, 5]          -- unsorted
     /              \\
  [3, 1]          [4, 1, 5]    -- split in half
  /    \\          /        \\
[3]   [1]      [4]      [1, 5] -- split again
  \\    /         \\       /   \\
 [1, 3]         [1]   [5]   -- base cases & merge
                  \\   /
                [1, 5]       -- merge
     \\            /
    [1, 1, 3, 4, 5]          -- final merge</code></pre>

<h3>Step 1: Split a List</h3>
<p>Haskell provides <code>splitAt</code>:</p>
<pre><code>splitAt 2 [1,2,3,4] = ([1,2], [3,4])
-- Split at the midpoint: splitAt (length xs \`div\` 2) xs</code></pre>

<h3>Step 2: Merge Two Sorted Lists</h3>
<p>Compare the heads, take the smaller one, recurse:</p>
<pre><code>merge [1,3] [2,4]
  = 1 : merge [3] [2,4]       -- 1 < 2, take 1
  = 1 : 2 : merge [3] [4]     -- 2 < 3, take 2
  = 1 : 2 : 3 : merge [] [4]  -- 3 < 4, take 3
  = 1 : 2 : 3 : [4]           -- left empty, take rest
  = [1, 2, 3, 4]</code></pre>

<h3>Haskell vs Imperative</h3>
<p>Compare the Haskell merge sort to the imperative version:</p>
<table>
  <thead><tr><th>Haskell</th><th>Imperative</th></tr></thead>
  <tbody>
    <tr><td>Pattern matching on <code>[]</code> and <code>(x:xs)</code></td><td>Array index bounds checking</td></tr>
    <tr><td>Immutable lists, pure functions</td><td>In-place mutation, temporary arrays</td></tr>
    <tr><td>~10 lines, obviously correct</td><td>~30 lines, easy to have off-by-one errors</td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Implement the three pieces: <code>splitHalf</code>, <code>merge</code>, and <code>mergeSort</code>.</p>
`,
    starterCode: `module DivideAndConquer where

-- EXERCISE: Implement merge sort.

-- 1. Split a list into two roughly equal halves.
--    Use: splitAt (length xs \`div\` 2) xs
splitHalf :: [a] -> ([a], [a])
splitHalf xs = error "split at the midpoint"

-- 2. Merge two sorted lists into one sorted list.
--    Pattern match on BOTH lists:
--      merge [] ys = ys          (left empty → take right)
--      merge xs [] = xs          (right empty → take left)
--      merge (x:xs) (y:ys) = ... (compare heads)
merge :: Ord a => [a] -> [a] -> [a]
merge xs ys = error "interleave in sorted order"

-- 3. Merge sort: split, sort halves, merge.
--    Base cases: [] and [x] are already sorted.
--    Recursive case: split, sort each half, merge results.
mergeSort :: Ord a => [a] -> [a]
mergeSort xs = error "divide, conquer, combine"
`,
    solutionCode: `module DivideAndConquer where

splitHalf :: [a] -> ([a], [a])
splitHalf xs = splitAt (length xs \`div\` 2) xs

merge :: Ord a => [a] -> [a] -> [a]
merge [] ys = ys
merge xs [] = xs
merge (x:xs) (y:ys)
  | x <= y    = x : merge xs (y:ys)
  | otherwise  = y : merge (x:xs) ys

mergeSort :: Ord a => [a] -> [a]
mergeSort []  = []
mergeSort [x] = [x]
mergeSort xs  =
  let (left, right) = splitHalf xs
  in merge (mergeSort left) (mergeSort right)
`,
    testCode: `runTestEq "splitHalf [1,2,3,4]" ([1,2],[3,4 :: Int]) (splitHalf [1,2,3,4])
        , runTestEq "splitHalf [1,2,3]" ([1],[2,3 :: Int]) (splitHalf [1,2,3])
        , runTestEq "merge [1,3] [2,4]" [1,2,3,4 :: Int] (merge [1,3] [2,4])
        , runTestEq "merge [] [1,2]" [1,2 :: Int] (merge [] [1,2])
        , runTestEq "merge [1,1] [1,2]" [1,1,1,2 :: Int] (merge [1,1] [1,2])
        , runTestEq "mergeSort [3,1,4,1,5]" [1,1,3,4,5 :: Int] (mergeSort [3,1,4,1,5])
        , runTestEq "mergeSort []" ([] :: [Int]) (mergeSort [])
        , runTestEq "mergeSort [1]" [1 :: Int] (mergeSort [1])
        , runTestEq "mergeSort sorted" [1,2,3 :: Int] (mergeSort [1,2,3])`,
    hints: [
      'For <code>splitHalf</code>: <code>splitAt (length xs \\`div\\` 2) xs</code>. The <code>splitAt n xs</code> function returns <code>(take n xs, drop n xs)</code>.',
      'For <code>merge</code>: three equations. Empty left → return right. Empty right → return left. Both non-empty → compare heads with <code><=</code>, take the smaller, recurse.',
      'For <code>mergeSort</code>: base cases <code>[] = []</code> and <code>[x] = [x]</code>. Otherwise: <code>let (l, r) = splitHalf xs in merge (mergeSort l) (mergeSort r)</code>.',
      'Full merge: <code>merge (x:xs) (y:ys) | x <= y = x : merge xs (y:ys) | otherwise = y : merge (x:xs) ys</code>.',
    ],
    concepts: ['divide-and-conquer', 'merge-sort', 'pattern-matching', 'recursion'],
    successPatterns: [
      'splitAt.*length.*div.*2',
      'merge\\s+\\[\\]',
      'merge.*\\(x:xs\\).*\\(y:ys\\)',
      'splitHalf\\s+xs',
    ],
    testNames: [
      'splitHalf divides evenly',
      'splitHalf odd length',
      'merge interleaves sorted',
      'mergeSort sorts unsorted',
      'mergeSort edge cases',
    ],
  },

  'lazy-memoization': {
    id: 'lazy-memoization',
    title: 'Dynamic Programming via Lazy Memoization',
    difficulty: 'advanced',
    order: 5,
    description: `
<p>In imperative languages, dynamic programming requires explicit tables. In Haskell, <strong>laziness gives you memoization for free</strong>.</p>

<h3>The Problem: Redundant Computation</h3>
<p>Naive recursive Fibonacci recomputes the same values exponentially:</p>
<pre><code>fib 5
├── fib 4
│   ├── fib 3
│   │   ├── fib 2  ← computed here
│   │   └── fib 1
│   └── fib 2      ← AND here (redundant!)
└── fib 3          ← AND here (redundant!)
    ├── fib 2      ← AND here!
    └── fib 1</code></pre>

<h3>The Solution: Lazy Arrays</h3>
<p>Create an array where each entry references other entries in the same array. Laziness ensures each entry is computed <strong>at most once</strong>:</p>
<pre><code>import Data.Array

fibMemo :: Int -> Int
fibMemo n = arr ! n
  where
    arr = listArray (0, n) [go i | i <- [0..n]]
    go 0 = 0
    go 1 = 1
    go i = arr ! (i-1) + arr ! (i-2)   -- looks up already-computed values!</code></pre>

<h3>Why This Works</h3>
<p><code>listArray</code> creates the array lazily — entries are thunks (unevaluated expressions). When <code>go 5</code> needs <code>arr ! 4</code>, Haskell evaluates that entry, caches the result, and never recomputes it. This is O(n) time and O(n) space — the same as imperative DP.</p>

<h3>The 0/1 Knapsack Problem</h3>
<p>Given items with weights and values, maximize total value within a weight limit:</p>
<pre><code>-- Items: [(weight, value)]
-- Capacity: 5
items = [(2, 3), (3, 4), (4, 5)]

-- Best: take items 1 and 2 → weight 5, value 7</code></pre>
<p>The recurrence: for each item, either skip it or take it (if it fits):</p>
<pre><code>dp i w
  | i == 0    = 0                              -- no items left
  | wi > w    = dp (i-1) w                     -- too heavy, skip
  | otherwise = max (dp (i-1) w)               -- skip
                    (vi + dp (i-1) (w - wi))   -- take</code></pre>

<h3>Your Task</h3>
<p>Implement memoized DP solutions using <code>Data.Array</code>.</p>
`,
    starterCode: `module LazyMemoization where

import Data.Array

-- EXERCISE: Dynamic programming with lazy memoization.

-- 1. Memoized Fibonacci using Data.Array.
--    Pattern: create array, each entry references the array itself.
--    arr = listArray (0, n) [go i | i <- [0..n]]
--    go 0 = 0; go 1 = 1; go i = arr ! (i-1) + arr ! (i-2)
fibMemo :: Int -> Int
fibMemo n = error "use Data.Array for O(n) Fibonacci"

-- 2. Staircase problem: how many ways to climb n stairs,
--    taking 1 or 2 steps at a time?
--    ways(0) = 1 (one way: do nothing)
--    ways(1) = 1 (one way: take 1 step)
--    ways(n) = ways(n-1) + ways(n-2)
staircase :: Int -> Int
staircase n = error "use array memoization"

-- 3. 0/1 Knapsack: maximize value within weight capacity.
--    Items are [(weight, value)] pairs.
--    Use a 2D array indexed by (item, remaining capacity).
knapsack :: [(Int, Int)] -> Int -> Int
knapsack items capacity = error "use 2D array memoization"
`,
    solutionCode: `module LazyMemoization where

import Data.Array

fibMemo :: Int -> Int
fibMemo n = arr ! n
  where
    arr = listArray (0, n) [go i | i <- [0..n]]
    go 0 = 0
    go 1 = 1
    go i = arr ! (i-1) + arr ! (i-2)

staircase :: Int -> Int
staircase n = arr ! n
  where
    arr = listArray (0, n) [go i | i <- [0..n]]
    go 0 = 1
    go 1 = 1
    go i = arr ! (i-1) + arr ! (i-2)

knapsack :: [(Int, Int)] -> Int -> Int
knapsack items capacity = arr ! (numItems, capacity)
  where
    numItems = length items
    itemArr = listArray (1, numItems) items
    arr = listArray ((0,0), (numItems, capacity))
          [go i w | i <- [0..numItems], w <- [0..capacity]]
    go 0 _ = 0
    go i w
      | wi > w    = arr ! (i-1, w)
      | otherwise = max (arr ! (i-1, w)) (vi + arr ! (i-1, w - wi))
      where (wi, vi) = itemArr ! i
`,
    testCode: `runTestEq "fibMemo 0" (0 :: Int) (fibMemo 0)
        , runTestEq "fibMemo 1" (1 :: Int) (fibMemo 1)
        , runTestEq "fibMemo 10" (55 :: Int) (fibMemo 10)
        , runTestEq "fibMemo 20" (6765 :: Int) (fibMemo 20)
        , runTestEq "staircase 0" (1 :: Int) (staircase 0)
        , runTestEq "staircase 1" (1 :: Int) (staircase 1)
        , runTestEq "staircase 5" (8 :: Int) (staircase 5)
        , runTestEq "staircase 10" (89 :: Int) (staircase 10)
        , runTestEq "knapsack simple" (7 :: Int) (knapsack [(2,3),(3,4),(4,5)] 5)
        , runTestEq "knapsack empty" (0 :: Int) (knapsack [] 10)
        , runTestEq "knapsack no capacity" (0 :: Int) (knapsack [(1,5)] 0)
        , runTestEq "knapsack single fits" (10 :: Int) (knapsack [(3,10)] 5)`,
    hints: [
      'The pattern: <code>arr = listArray bounds [go i | i <- range]</code> where <code>go</code> references <code>arr</code> itself. Laziness ensures each entry is computed once.',
      'For <code>fibMemo</code>: <code>arr = listArray (0, n) [go i | i <- [0..n]]</code>. <code>go 0 = 0; go 1 = 1; go i = arr ! (i-1) + arr ! (i-2)</code>. Return <code>arr ! n</code>.',
      'For <code>knapsack</code>: 2D array indexed by <code>(item, weight)</code>. Convert the item list to an array for O(1) access. The recurrence: skip = <code>arr ! (i-1, w)</code>, take = <code>vi + arr ! (i-1, w-wi)</code>.',
      'Full knapsack: <code>arr = listArray ((0,0), (numItems, capacity)) [go i w | i <- [0..numItems], w <- [0..capacity]]</code>. <code>go 0 _ = 0; go i w | wi > w = arr ! (i-1, w) | otherwise = max (arr ! (i-1, w)) (vi + arr ! (i-1, w-wi)) where (wi, vi) = itemArr ! i</code>.',
    ],
    concepts: ['memoization', 'dynamic-programming', 'laziness', 'Data.Array', 'knapsack'],
    successPatterns: [
      'listArray.*go',
      'arr\\s*!\\s*\\(i-1\\)',
      'knapsack.*arr\\s*!',
      'max.*arr',
    ],
    testNames: [
      'fibMemo base cases',
      'fibMemo larger values',
      'staircase base cases',
      'staircase larger values',
      'knapsack with items',
      'knapsack edge cases',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ALGEBRAIC CRYPTOGRAPHY MODULE
  // ═══════════════════════════════════════════════════════════════════

  'finite-field-gfp': {
    id: 'finite-field-gfp',
    title: 'Finite Fields GF(p)',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>A <strong>finite field</strong> GF(p) (also written F<sub>p</sub>) is the set of integers {0, 1, ..., p-1} with addition and multiplication done modulo a prime p. These fields are the backbone of modern cryptography — every protocol we'll build in this module lives inside one.</p>

<h3>Why GF(p)?</h3>
<p>In normal arithmetic, dividing integers is messy (3 / 2 = 1.5, not an integer). In GF(p), division <em>always works</em> (for non-zero divisors) and the result stays in the field. This is exactly what cryptographic algorithms need — every operation maps elements back to elements.</p>

<h3>The GF Data Type</h3>
<p>We'll carry both the value and the prime together:</p>
<pre><code>data GF = GF Integer Integer deriving (Show)
-- GF value prime
-- e.g., GF 7 23 means "7 in GF(23)"</code></pre>

<h3>The Extended Euclidean Algorithm</h3>
<p>To divide in GF(p), we need <strong>modular inverses</strong>. The inverse of <code>a</code> mod <code>p</code> is the number <code>x</code> such that <code>a * x ≡ 1 (mod p)</code>.</p>
<p>The <strong>Extended GCD</strong> algorithm finds coefficients <code>x</code>, <code>y</code> such that <code>a*x + b*y = gcd(a,b)</code>. When <code>gcd(a,p) = 1</code> (guaranteed when p is prime and a ≠ 0), this gives us the modular inverse.</p>

<p>Step-by-step for <code>extGcd 23 3</code> (finding inverse of 3 mod 23):</p>
<pre><code>extGcd 23 3:
  23 = 7*3 + 2    → recurse on (3, 2)
  extGcd 3 2:
    3 = 1*2 + 1   → recurse on (2, 1)
    extGcd 2 1:
      2 = 2*1 + 0 → recurse on (1, 0)
      extGcd 1 0:
        base case! return (1, 0)
      back-substitute: (y, x - (2 div 1)*y) = (0, 1 - 2*0) = (0, 1)
    back-substitute: (y, x - (3 div 2)*y) = (1, 0 - 1*1) = (1, -1)
  back-substitute: (y, x - (23 div 3)*y) = (-1, 1 - 7*(-1)) = (-1, 8)

Result: extGcd 23 3 = (-1, 8)
Check: 23*(-1) + 3*8 = -23 + 24 = 1  ✓
So 3 * 8 ≡ 1 (mod 23), meaning inv(3) = 8.</code></pre>

<p>The key insight: we call <code>extGcd m a</code> (not <code>extGcd a m</code>), and the <strong>second</strong> component of the result is the inverse of <code>a</code> mod <code>m</code>.</p>

<h3>Modular Inverse from Extended GCD</h3>
<pre><code>modInverse :: Integer -> Integer -> Integer
modInverse a m = let (_, x) = extGcd m a in x \`mod\` m
-- Note: extGcd m a (prime first!), then take second element</code></pre>

<h3>Division in GF(p)</h3>
<p>Division is just multiplication by the inverse:</p>
<pre><code>gfDiv (GF a p) (GF b _) = mkGF (a * modInverse b p) p</code></pre>

<h3>Your Task</h3>
<p>Implement the GF type with arithmetic, the Extended Euclidean Algorithm, modular inverse, and field division.</p>
`,
    starterCode: `module FiniteFieldGFP where

-- Finite field element: GF value prime
data GF = GF Integer Integer deriving (Show)

-- 1. Smart constructor: reduce value mod p.
--    Example: mkGF 30 23 = GF 7 23
mkGF :: Integer -> Integer -> GF
mkGF v p = error "reduce v modulo p"

-- 2. Equality: same value AND same prime.
instance Eq GF where
  -- (GF a p) == (GF b q) = ???
  (==) = error "implement Eq for GF"

-- 3. Num instance for GF(p) arithmetic.
--    Addition: (a + b) mod p
--    Multiplication: (a * b) mod p
--    Negate: (p - a) mod p
--    fromInteger, abs, signum can be error/id
instance Num GF where
  (GF a p) + (GF b _) = error "implement addition mod p"
  (GF a p) * (GF b _) = error "implement multiplication mod p"
  negate (GF a p)      = error "implement negation mod p"
  fromInteger _        = error "fromInteger not supported for GF"
  abs                  = id
  signum _             = error "signum not supported for GF"

-- 4. Extended Euclidean Algorithm.
--    extGcd a 0 = (1, 0)
--    extGcd a b = (y, x - (a \`div\` b) * y)
--      where (x, y) = extGcd b (a \`mod\` b)
extGcd :: Integer -> Integer -> (Integer, Integer)
extGcd a 0 = error "implement base case"
extGcd a b = error "implement recursive case"

-- 5. Modular inverse: the x such that a*x ≡ 1 (mod m).
--    Use extGcd m a (note the order!), take second component.
modInverse :: Integer -> Integer -> Integer
modInverse a m = error "use extGcd to find the inverse"

-- 6. Division in GF(p): multiply by the modular inverse.
gfDiv :: GF -> GF -> GF
gfDiv (GF a p) (GF b _) = error "multiply a by inverse of b"
`,
    solutionCode: `module FiniteFieldGFP where

data GF = GF Integer Integer deriving (Show)

mkGF :: Integer -> Integer -> GF
mkGF v p = GF (v \`mod\` p) p

instance Eq GF where
  (GF a p) == (GF b q) = a == b && p == q

instance Num GF where
  (GF a p) + (GF b _) = mkGF (a + b) p
  (GF a p) * (GF b _) = mkGF (a * b) p
  negate (GF a p)      = mkGF (p - a) p
  fromInteger _        = error "fromInteger not supported for GF"
  abs                  = id
  signum _             = error "signum not supported for GF"

extGcd :: Integer -> Integer -> (Integer, Integer)
extGcd a 0 = (1, 0)
extGcd a b = (y, x - (a \`div\` b) * y)
  where (x, y) = extGcd b (a \`mod\` b)

modInverse :: Integer -> Integer -> Integer
modInverse a m = let (_, x) = extGcd m a in x \`mod\` m

gfDiv :: GF -> GF -> GF
gfDiv (GF a p) (GF b _) = mkGF (a * modInverse b p) p
`,
    testCode: `runTestEq "mkGF 30 23 = GF 7 23" (GF 7 23) (mkGF 30 23)
        , runTestEq "mkGF 0 23 = GF 0 23" (GF 0 23) (mkGF 0 23)
        , runTestEq "GF 5 23 + GF 20 23 = GF 2 23" (GF 2 23) (GF 5 23 + GF 20 23)
        , runTestEq "GF 5 23 * GF 4 23 = GF 20 23" (GF 20 23) (GF 5 23 * GF 4 23)
        , runTestEq "negate (GF 5 23) = GF 18 23" (GF 18 23) (negate (GF 5 23))
        , runTestEq "extGcd 23 3 = (-1, 8)" ((-1 :: Integer), (8 :: Integer)) (extGcd 23 3)
        , runTestEq "modInverse 3 23 = 8" (8 :: Integer) (modInverse 3 23)
        , runTestEq "modInverse 5 23 = 14" (14 :: Integer) (modInverse 5 23)
        , runTestEq "gfDiv (GF 1 23) (GF 3 23) = GF 8 23" (GF 8 23) (gfDiv (GF 1 23) (GF 3 23))
        , runTestEq "gfDiv (GF 10 23) (GF 5 23) = GF 2 23" (GF 2 23) (gfDiv (GF 10 23) (GF 5 23))`,
    hints: [
      'For <code>mkGF</code>: <code>GF (v \\`mod\\` p) p</code>. The modulo ensures the value stays in range.',
      'For <code>Eq</code>: check both the value and the prime match: <code>(GF a p) == (GF b q) = a == b && p == q</code>.',
      'For <code>extGcd</code>: base case returns <code>(1, 0)</code>. Recursive case: <code>(y, x - (a \\`div\\` b) * y) where (x, y) = extGcd b (a \\`mod\\` b)</code>.',
      'For <code>modInverse</code>: call <code>extGcd m a</code> (prime first, value second), take the second component, reduce mod m.',
    ],
    concepts: ['finite-field', 'modular-arithmetic', 'extended-euclidean', 'modular-inverse', 'GF(p)'],
    successPatterns: [
      'extGcd\\s+\\w+\\s+0\\s*=\\s*\\(1\\s*,\\s*0\\)',
      'extGcd\\s+\\w+\\s+\\w+\\s*=.*div',
      'modInverse.*extGcd',
      'gfDiv.*modInverse',
    ],
    testNames: [
      'mkGF reduces mod p',
      'mkGF zero',
      'GF addition mod p',
      'GF multiplication mod p',
      'GF negation mod p',
      'extGcd computes coefficients',
      'modInverse 3 mod 23',
      'modInverse 5 mod 23',
      'gfDiv 1/3 in GF(23)',
      'gfDiv 10/5 in GF(23)',
    ],
  },

  'diffie-hellman': {
    id: 'diffie-hellman',
    title: 'Diffie-Hellman Key Exchange',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>The <strong>Diffie-Hellman protocol</strong> (1976) lets two people agree on a shared secret over an insecure channel. It was the first practical solution to the key distribution problem and it's still used in TLS, SSH, and Signal today.</p>

<h3>The Protocol</h3>
<pre><code>        Alice                          Bob
          |                              |
          |   Public: p = 23, g = 5      |
          |                              |
    a = 6 (secret)                 b = 15 (secret)
          |                              |
    A = g^a mod p                  B = g^b mod p
    A = 5^6 mod 23 = 8            B = 5^15 mod 23 = 19
          |                              |
          |------- sends A = 8 --------->|
          |<------ sends B = 19 ---------|
          |                              |
    s = B^a mod p                  s = A^b mod p
    s = 19^6 mod 23 = 2           s = 8^15 mod 23 = 2
          |                              |
        SHARED SECRET = 2             SHARED SECRET = 2</code></pre>

<h3>Why It Works</h3>
<p>Both sides compute <code>g^(a*b) mod p</code>, just in different order:</p>
<pre><code>Alice: B^a = (g^b)^a = g^(b*a) mod p
Bob:   A^b = (g^a)^b = g^(a*b) mod p</code></pre>
<p>An eavesdropper sees p, g, A, and B but <strong>cannot compute a or b</strong> — that would require solving the <strong>discrete logarithm problem</strong>, which is believed to be computationally infeasible for large primes.</p>

<h3>Square-and-Multiply (Modular Exponentiation)</h3>
<p>Computing <code>g^a mod p</code> naively would produce astronomically large intermediate numbers. The <strong>square-and-multiply</strong> algorithm keeps numbers small by reducing mod p at every step:</p>
<pre><code>modExp base 0     m = 1                              -- anything^0 = 1
modExp base expo  m
  | even expo = modExp (base*base \`mod\` m) (expo \`div\` 2) m  -- square
  | otherwise = base * modExp base (expo-1) m \`mod\` m        -- multiply

-- Example: 5^6 mod 23
-- even: modExp (25 mod 23=2) 3 23        -- squared base
-- odd:  2 * modExp 2 2 23 \`mod\` 23
-- even: modExp (4 mod 23=4) 1 23
-- odd:  4 * modExp 4 0 23 \`mod\` 23
-- base: 1
-- back:  4 * 1 mod 23 = 4
-- back:  2 * 4 mod 23 = 8
-- Result: 8  ✓</code></pre>

<h3>Your Task</h3>
<p>Implement modular exponentiation and the full Diffie-Hellman key exchange protocol.</p>
`,
    starterCode: `module DiffieHellman where

-- 1. Modular exponentiation using square-and-multiply.
--    modExp base expo m computes base^expo mod m efficiently.
--    Base case: expo == 0 → 1
--    Even expo: square the base, halve the exponent
--    Odd expo:  multiply by base, subtract 1 from exponent
modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = error "implement base case"
modExp base expo m
  | even expo = error "implement even case (square)"
  | otherwise = error "implement odd case (multiply)"

-- 2. Compute a public key: g^privateKey mod p
publicKey :: Integer -> Integer -> Integer -> Integer
publicKey g priv p = error "use modExp"

-- 3. Compute the shared secret: otherPublicKey^myPrivateKey mod p
sharedSecret :: Integer -> Integer -> Integer -> Integer
sharedSecret otherPub myPriv p = error "use modExp"

-- 4. Full DH exchange: given p, g, and both private keys,
--    return (alicePub, bobPub, sharedSecret).
dhExchange :: Integer -> Integer -> Integer -> Integer -> (Integer, Integer, Integer)
dhExchange p g aPriv bPriv = error "compute both public keys and the shared secret"
`,
    solutionCode: `module DiffieHellman where

modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

publicKey :: Integer -> Integer -> Integer -> Integer
publicKey g priv p = modExp g priv p

sharedSecret :: Integer -> Integer -> Integer -> Integer
sharedSecret otherPub myPriv p = modExp otherPub myPriv p

dhExchange :: Integer -> Integer -> Integer -> Integer -> (Integer, Integer, Integer)
dhExchange p g aPriv bPriv = (aPub, bPub, secret)
  where
    aPub   = publicKey g aPriv p
    bPub   = publicKey g bPriv p
    secret = sharedSecret aPub bPriv p
`,
    testCode: `runTestEq "modExp 5 6 23 = 8" (8 :: Integer) (modExp 5 6 23)
        , runTestEq "modExp 5 15 23 = 19" (19 :: Integer) (modExp 5 15 23)
        , runTestEq "modExp 2 10 1000 = 24" (24 :: Integer) (modExp 2 10 1000)
        , runTestEq "modExp 7 0 23 = 1" (1 :: Integer) (modExp 7 0 23)
        , runTestEq "publicKey g=5 priv=6 p=23 = 8" (8 :: Integer) (publicKey 5 6 23)
        , runTestEq "publicKey g=5 priv=15 p=23 = 19" (19 :: Integer) (publicKey 5 15 23)
        , runTestEq "sharedSecret 19 6 23 = 2" (2 :: Integer) (sharedSecret 19 6 23)
        , runTestEq "sharedSecret 8 15 23 = 2" (2 :: Integer) (sharedSecret 8 15 23)
        , runTestEq "dhExchange agreement" (let (_,_,s) = dhExchange 23 5 6 15 in s) (2 :: Integer)
        , runTestEq "dhExchange pubkeys" (let (a,b,_) = dhExchange 23 5 6 15 in (a,b)) ((8 :: Integer), (19 :: Integer))`,
    hints: [
      'For <code>modExp</code> base case: <code>modExp _ 0 _ = 1</code>. Anything raised to the zero power is 1.',
      'For even exponent: <code>modExp (base * base \\`mod\\` m) (expo \\`div\\` 2) m</code>. Squaring the base and halving the exponent is equivalent.',
      'For odd exponent: <code>base * modExp base (expo - 1) m \\`mod\\` m</code>. Factor out one multiplication, then the remaining exponent is even.',
      'For <code>dhExchange</code>: compute both public keys with <code>publicKey</code>, then the secret with <code>sharedSecret</code> using either side. Both must agree.',
    ],
    concepts: ['diffie-hellman', 'modular-exponentiation', 'discrete-logarithm', 'key-exchange', 'square-and-multiply'],
    successPatterns: [
      'modExp.*0.*=\\s*1',
      'even\\s+expo.*modExp',
      'publicKey.*modExp',
      'sharedSecret.*modExp',
    ],
    testNames: [
      'modExp 5^6 mod 23',
      'modExp 5^15 mod 23',
      'modExp 2^10 mod 1000',
      'modExp base case',
      'publicKey Alice',
      'publicKey Bob',
      'sharedSecret from Bob side',
      'sharedSecret from Alice side',
      'DH exchange secrets agree',
      'DH exchange public keys correct',
    ],
  },

  'rsa-encryption': {
    id: 'rsa-encryption',
    title: 'RSA Encryption',
    difficulty: 'advanced',
    order: 3,
    description: `
<p><strong>RSA</strong> (Rivest-Shamir-Adleman, 1977) is one of the first public-key cryptosystems. Unlike Diffie-Hellman which only exchanges a shared secret, RSA lets you <strong>encrypt messages</strong> and <strong>create digital signatures</strong>.</p>

<h3>The RSA Algorithm</h3>
<ol>
  <li><strong>Key Generation:</strong>
    <ul>
      <li>Choose two primes <code>p</code> and <code>q</code></li>
      <li>Compute <code>n = p * q</code> (the modulus)</li>
      <li>Compute <code>φ(n) = (p-1)(q-1)</code> (Euler's totient)</li>
      <li>Choose <code>e</code> such that <code>gcd(e, φ(n)) = 1</code> (public exponent)</li>
      <li>Compute <code>d = e⁻¹ mod φ(n)</code> (private exponent)</li>
      <li>Public key: <code>(e, n)</code>, Private key: <code>(d, n)</code></li>
    </ul>
  </li>
  <li><strong>Encryption:</strong> <code>c = m^e mod n</code></li>
  <li><strong>Decryption:</strong> <code>m = c^d mod n</code></li>
</ol>

<h3>Why It Works: Euler's Theorem</h3>
<p>Euler's theorem states: if <code>gcd(m, n) = 1</code>, then <code>m^φ(n) ≡ 1 (mod n)</code>.</p>
<p>Since <code>e * d ≡ 1 (mod φ(n))</code>, we have <code>e * d = 1 + k*φ(n)</code> for some k. Then:</p>
<pre><code>(m^e)^d = m^(e*d) = m^(1 + k*φ(n)) = m * (m^φ(n))^k ≡ m * 1^k = m (mod n)</code></pre>
<p>Decryption perfectly undoes encryption!</p>

<h3>Worked Example: p=11, q=13</h3>
<pre><code>n = 11 * 13 = 143
φ(n) = 10 * 12 = 120
e = 7  (gcd(7, 120) = 1  ✓)
d = 7⁻¹ mod 120 = 103  (since 7 * 103 = 721 = 6*120 + 1)

Encrypt m=42:  c = 42^7 mod 143 = 81
Decrypt c=81:  m = 81^103 mod 143 = 42  ✓</code></pre>

<h3>The Trapdoor</h3>
<p>RSA's security relies on a <strong>trapdoor function</strong>: computing <code>n = p * q</code> is easy, but <strong>factoring n back into p and q</strong> is hard for large numbers. Without the factorization, you cannot compute φ(n), and without φ(n), you cannot find d.</p>

<h3>Error Handling with Either</h3>
<p>Real crypto code must validate inputs. We use <code>Either String</code> for errors:</p>
<pre><code>rsaKeyGen :: Integer -> Integer -> Integer -> Either String ((Integer,Integer),(Integer,Integer))
-- Left "error message" for invalid inputs
-- Right ((e, n), (d, n)) for valid keys</code></pre>

<h3>Your Task</h3>
<p>Implement RSA key generation with validation, encryption, decryption, and a round-trip function using do-notation to chain Either computations.</p>
`,
    starterCode: `module RSAEncryption where

-- Helper: modular exponentiation (square-and-multiply)
modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

-- Helper: Extended Euclidean Algorithm
extGcd :: Integer -> Integer -> (Integer, Integer)
extGcd a 0 = (1, 0)
extGcd a b = (y, x - (a \`div\` b) * y)
  where (x, y) = extGcd b (a \`mod\` b)

-- Helper: modular inverse
modInverse :: Integer -> Integer -> Integer
modInverse a m = let (_, x) = extGcd m a in x \`mod\` m

-- 1. Euler's totient for n = p * q.
--    φ(n) = (p-1) * (q-1)
eulerTotient :: Integer -> Integer -> Integer
eulerTotient p q = error "compute (p-1)*(q-1)"

-- 2. RSA key generation.
--    Given primes p, q and public exponent e:
--    - Compute n = p * q
--    - Compute phi = eulerTotient p q
--    - Check gcd(e, phi) == 1, otherwise Left "e and phi(n) must be coprime"
--    - Compute d = modInverse e phi
--    - Return Right ((e, n), (d, n))
rsaKeyGen :: Integer -> Integer -> Integer -> Either String ((Integer, Integer), (Integer, Integer))
rsaKeyGen p q e = error "generate RSA key pair with validation"

-- 3. RSA encryption: c = m^e mod n.
--    Check 0 <= m < n, otherwise Left "message must be in range [0, n)"
rsaEncrypt :: Integer -> (Integer, Integer) -> Either String Integer
rsaEncrypt msg (e, n) = error "encrypt with validation"

-- 4. RSA decryption: m = c^d mod n.
--    No validation needed — just compute.
rsaDecrypt :: Integer -> (Integer, Integer) -> Integer
rsaDecrypt cipher (d, n) = error "decrypt using modExp"

-- 5. Round trip: generate keys, encrypt, then decrypt.
--    Use do-notation to chain the Either computations.
rsaRoundTrip :: Integer -> Integer -> Integer -> Integer -> Either String Integer
rsaRoundTrip p q e msg = error "chain keygen, encrypt, decrypt with do-notation"
`,
    solutionCode: `module RSAEncryption where

modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

extGcd :: Integer -> Integer -> (Integer, Integer)
extGcd a 0 = (1, 0)
extGcd a b = (y, x - (a \`div\` b) * y)
  where (x, y) = extGcd b (a \`mod\` b)

modInverse :: Integer -> Integer -> Integer
modInverse a m = let (_, x) = extGcd m a in x \`mod\` m

eulerTotient :: Integer -> Integer -> Integer
eulerTotient p q = (p - 1) * (q - 1)

rsaKeyGen :: Integer -> Integer -> Integer -> Either String ((Integer, Integer), (Integer, Integer))
rsaKeyGen p q e
  | gcd e phi /= 1 = Left "e and phi(n) must be coprime"
  | otherwise       = Right ((e, n), (d, n))
  where
    n   = p * q
    phi = eulerTotient p q
    d   = modInverse e phi

rsaEncrypt :: Integer -> (Integer, Integer) -> Either String Integer
rsaEncrypt msg (e, n)
  | msg < 0 || msg >= n = Left "message must be in range [0, n)"
  | otherwise           = Right (modExp msg e n)

rsaDecrypt :: Integer -> (Integer, Integer) -> Integer
rsaDecrypt cipher (d, n) = modExp cipher d n

rsaRoundTrip :: Integer -> Integer -> Integer -> Integer -> Either String Integer
rsaRoundTrip p q e msg = do
  (pub, priv) <- rsaKeyGen p q e
  cipher <- rsaEncrypt msg pub
  Right (rsaDecrypt cipher priv)
`,
    testCode: `runTestEq "eulerTotient 11 13 = 120" (120 :: Integer) (eulerTotient 11 13)
        , runTestEq "eulerTotient 5 7 = 24" (24 :: Integer) (eulerTotient 5 7)
        , runTestEq "rsaKeyGen d = 103" (Right ((7 :: Integer, 143 :: Integer), (103 :: Integer, 143 :: Integer))) (rsaKeyGen 11 13 7)
        , runTestEq "rsaKeyGen bad e" (Left "e and phi(n) must be coprime" :: Either String ((Integer,Integer),(Integer,Integer))) (rsaKeyGen 11 13 4)
        , runTestEq "rsaEncrypt 42 = 81" (Right (81 :: Integer)) (rsaEncrypt 42 (7, 143))
        , runTestEq "rsaEncrypt too large" (Left "message must be in range [0, n)" :: Either String Integer) (rsaEncrypt 150 (7, 143))
        , runTestEq "rsaEncrypt negative" (Left "message must be in range [0, n)" :: Either String Integer) (rsaEncrypt (-1) (7, 143))
        , runTestEq "rsaDecrypt 81 = 42" (42 :: Integer) (rsaDecrypt 81 (103, 143))
        , runTestEq "rsaRoundTrip 42" (Right (42 :: Integer)) (rsaRoundTrip 11 13 7 42)
        , runTestEq "rsaRoundTrip 100" (Right (100 :: Integer)) (rsaRoundTrip 11 13 7 100)`,
    hints: [
      'For <code>eulerTotient</code>: simply <code>(p - 1) * (q - 1)</code>. This counts integers less than n that are coprime to n.',
      'For <code>rsaKeyGen</code>: use guards — <code>| gcd e phi /= 1 = Left "..."</code> and <code>| otherwise = Right ((e, n), (d, n))</code> where <code>d = modInverse e phi</code>.',
      'For <code>rsaEncrypt</code>: check <code>msg < 0 || msg >= n</code> for the error case. Otherwise <code>Right (modExp msg e n)</code>.',
      'For <code>rsaRoundTrip</code>: use do-notation! <code>do { (pub, priv) <- rsaKeyGen p q e; cipher <- rsaEncrypt msg pub; Right (rsaDecrypt cipher priv) }</code>.',
    ],
    concepts: ['RSA', 'public-key-cryptography', 'euler-totient', 'trapdoor-function', 'Either-monad'],
    successPatterns: [
      'eulerTotient.*p\\s*-\\s*1',
      'gcd\\s+e\\s+phi',
      'Right.*modExp.*msg',
      'rsaRoundTrip.*do',
    ],
    testNames: [
      'eulerTotient 11 13',
      'eulerTotient 5 7',
      'rsaKeyGen valid keys',
      'rsaKeyGen rejects bad e',
      'rsaEncrypt 42',
      'rsaEncrypt rejects too large',
      'rsaEncrypt rejects negative',
      'rsaDecrypt 81',
      'rsaRoundTrip 42',
      'rsaRoundTrip 100',
    ],
  },

  'elliptic-curve-addition': {
    id: 'elliptic-curve-addition',
    title: 'Elliptic Curve Point Addition',
    difficulty: 'advanced',
    order: 4,
    description: `
<p><strong>Elliptic Curve Cryptography</strong> (ECC) achieves the same security as RSA with <em>much smaller keys</em>. A 256-bit ECC key provides roughly the same security as a 3072-bit RSA key. This is why modern systems (Bitcoin, Signal, TLS 1.3) prefer ECC.</p>

<h3>What Is an Elliptic Curve?</h3>
<p>An elliptic curve over GF(p) is the set of points (x, y) satisfying:</p>
<pre><code>y² ≡ x³ + ax + b  (mod p)</code></pre>
<p>plus a special "point at infinity" called <code>Inf</code> (the identity element).</p>

<h3>The Group Law</h3>
<p>Points on the curve form a <strong>group</strong> under a geometric operation called "point addition." The key idea:</p>
<ul>
  <li>To add P and Q: draw a line through them, find the third intersection with the curve, reflect over the x-axis</li>
  <li>To double P (add P to itself): use the tangent line at P instead</li>
  <li><code>Inf</code> is the identity: <code>P + Inf = P</code></li>
  <li>The inverse of <code>(x, y)</code> is <code>(x, p-y)</code> — reflection over the x-axis</li>
</ul>

<h3>Point Addition Formulas</h3>
<p>For distinct points P = (x1, y1) and Q = (x2, y2) where P ≠ -Q:</p>
<pre><code>λ = (y2 - y1) * modInverse (x2 - x1) p   -- slope of the line
x3 = (λ² - x1 - x2) mod p
y3 = (λ * (x1 - x3) - y1) mod p</code></pre>

<p>For point doubling P + P where y1 ≠ 0:</p>
<pre><code>λ = (3*x1² + a) * modInverse (2*y1) p     -- slope of the tangent
x3 = (λ² - 2*x1) mod p
y3 = (λ * (x1 - x3) - y1) mod p</code></pre>

<h3>Scalar Multiplication (Double-and-Add)</h3>
<p>To compute <code>n * P</code> (adding P to itself n times), use the same square-and-multiply idea:</p>
<pre><code>ecMul curve 0 _  = Inf
ecMul curve n p
  | even n    = ecMul curve (n \`div\` 2) (ecAdd curve p p)   -- double
  | otherwise = ecAdd curve p (ecMul curve (n-1) p)          -- add</code></pre>
<p>This is O(log n) additions instead of O(n).</p>

<h3>Example Curve: y² = x³ + 2x + 3 (mod 97)</h3>
<p>Check that (3, 6) is on the curve:</p>
<pre><code>LHS: 6²  = 36
RHS: 3³ + 2*3 + 3 = 27 + 6 + 3 = 36
36 mod 97 = 36 = 36  ✓</code></pre>

<h3>Your Task</h3>
<p>Implement point validation, negation, addition, and scalar multiplication on elliptic curves over GF(p).</p>
`,
    starterCode: `module EllipticCurveAddition where

-- Helpers
modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

extGcd :: Integer -> Integer -> (Integer, Integer)
extGcd a 0 = (1, 0)
extGcd a b = (y, x - (a \`div\` b) * y)
  where (x, y) = extGcd b (a \`mod\` b)

modInverse :: Integer -> Integer -> Integer
modInverse a m = let (_, x) = extGcd m a in x \`mod\` m

-- A point on an elliptic curve, or the point at infinity.
data ECPoint = ECPoint Integer Integer | Inf deriving (Show, Eq)

-- Curve parameters: y² = x³ + ax + b (mod p)
-- We store a and p; b is only needed for point validation.
data Curve = Curve { curveA :: Integer, curveP :: Integer } deriving (Show)

-- 1. Check if a point is on the curve y² = x³ + ax + b (mod p).
--    Inf is always on the curve.
--    For (x, y): check y² mod p == (x³ + a*x + b) mod p
isOnCurve :: Integer -> Integer -> Integer -> ECPoint -> Bool
isOnCurve a b p Inf = error "implement Inf case"
isOnCurve a b p (ECPoint x y) = error "check y^2 ≡ x^3 + ax + b mod p"

-- 2. Negate a point: (x, y) → (x, p - y).
ecNegate :: Integer -> ECPoint -> ECPoint
ecNegate _ Inf = error "implement Inf case"
ecNegate p (ECPoint x y) = error "reflect over x-axis"

-- 3. Point addition on the curve.
--    Handle: Inf cases, inverse points, doubling, general addition.
ecAdd :: Curve -> ECPoint -> ECPoint -> ECPoint
ecAdd _ Inf q = error "implement identity cases"
ecAdd _ p Inf = error "implement identity cases"
ecAdd curve p q = error "implement point addition and doubling"

-- 4. Scalar multiplication using double-and-add.
--    ecMul curve 0 _ = Inf
--    even n: double the point, halve n
--    odd n:  add the point, subtract 1 from n
ecMul :: Curve -> Integer -> ECPoint -> ECPoint
ecMul _ 0 _ = error "implement base case"
ecMul curve n p
  | even n    = error "implement double"
  | otherwise = error "implement add"
`,
    solutionCode: `module EllipticCurveAddition where

modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

extGcd :: Integer -> Integer -> (Integer, Integer)
extGcd a 0 = (1, 0)
extGcd a b = (y, x - (a \`div\` b) * y)
  where (x, y) = extGcd b (a \`mod\` b)

modInverse :: Integer -> Integer -> Integer
modInverse a m = let (_, x) = extGcd m a in x \`mod\` m

data ECPoint = ECPoint Integer Integer | Inf deriving (Show, Eq)

data Curve = Curve { curveA :: Integer, curveP :: Integer } deriving (Show)

isOnCurve :: Integer -> Integer -> Integer -> ECPoint -> Bool
isOnCurve _ _ _ Inf = True
isOnCurve a b p (ECPoint x y) =
  (y * y) \`mod\` p == (x * x * x + a * x + b) \`mod\` p

ecNegate :: Integer -> ECPoint -> ECPoint
ecNegate _ Inf = Inf
ecNegate p (ECPoint x y) = ECPoint x ((p - y) \`mod\` p)

ecAdd :: Curve -> ECPoint -> ECPoint -> ECPoint
ecAdd _ Inf q = q
ecAdd _ p Inf = p
ecAdd (Curve a p) (ECPoint x1 y1) (ECPoint x2 y2)
  | x1 == x2 && y1 == ((p - y2) \`mod\` p) = Inf
  | x1 == x2 && y1 == y2 = let
      lam = (3 * x1 * x1 + a) * modInverse (2 * y1) p \`mod\` p
      x3  = (lam * lam - 2 * x1) \`mod\` p
      y3  = (lam * (x1 - x3) - y1) \`mod\` p
    in ECPoint x3 y3
  | otherwise = let
      lam = (y2 - y1) * modInverse (x2 - x1) p \`mod\` p
      x3  = (lam * lam - x1 - x2) \`mod\` p
      y3  = (lam * (x1 - x3) - y1) \`mod\` p
    in ECPoint x3 y3

ecMul :: Curve -> Integer -> ECPoint -> ECPoint
ecMul _ 0 _ = Inf
ecMul curve n pt
  | even n    = ecMul curve (n \`div\` 2) (ecAdd curve pt pt)
  | otherwise = ecAdd curve pt (ecMul curve (n - 1) pt)
`,
    testCode: `runTestEq "isOnCurve (3,6)" True (isOnCurve 2 3 97 (ECPoint 3 6))
        , runTestEq "isOnCurve Inf" True (isOnCurve 2 3 97 Inf)
        , runTestEq "isOnCurve (0,0) false" False (isOnCurve 2 3 97 (ECPoint 0 0))
        , runTestEq "ecNegate (3,6)" (ECPoint 3 91) (ecNegate 97 (ECPoint 3 6))
        , runTestEq "ecNegate Inf" Inf (ecNegate 97 Inf)
        , runTestEq "ecAdd Inf P = P" (ECPoint 3 6) (ecAdd (Curve 2 97) Inf (ECPoint 3 6))
        , runTestEq "ecAdd P Inf = P" (ECPoint 3 6) (ecAdd (Curve 2 97) (ECPoint 3 6) Inf)
        , runTestEq "ecAdd P (neg P) = Inf" Inf (ecAdd (Curve 2 97) (ECPoint 3 6) (ECPoint 3 91))
        , runTestEq "ecAdd double (3,6) = (80,10)" (ECPoint 80 10) (ecAdd (Curve 2 97) (ECPoint 3 6) (ECPoint 3 6))
        , runTestEq "ecMul 2 (3,6) = (80,10)" (ECPoint 80 10) (ecMul (Curve 2 97) 2 (ECPoint 3 6))
        , runTestEq "ecMul 0 P = Inf" Inf (ecMul (Curve 2 97) 0 (ECPoint 3 6))
        , runTestEq "ecMul 1 P = P" (ECPoint 3 6) (ecMul (Curve 2 97) 1 (ECPoint 3 6))`,
    hints: [
      'For <code>isOnCurve</code>: compute <code>(y*y) \\`mod\\` p</code> and <code>(x*x*x + a*x + b) \\`mod\\` p</code> and check equality. <code>Inf</code> is always on the curve.',
      'For <code>ecNegate</code>: <code>ECPoint x ((p - y) \\`mod\\` p)</code>. The point at infinity negates to itself.',
      'For <code>ecAdd</code>: check four cases in order — (1) either point is Inf, (2) points are inverses (same x, y values sum to p mod p), (3) same point (doubling), (4) distinct points.',
      'For <code>ecMul</code>: base case <code>0 -> Inf</code>. Even: <code>ecMul curve (n \\`div\\` 2) (ecAdd curve pt pt)</code>. Odd: <code>ecAdd curve pt (ecMul curve (n-1) pt)</code>.',
    ],
    concepts: ['elliptic-curve', 'point-addition', 'scalar-multiplication', 'ECC', 'group-law'],
    successPatterns: [
      'y\\s*\\*\\s*y',
      'ECPoint\\s+x.*p\\s*-\\s*y',
      'lam.*modInverse',
      'ecMul.*ecAdd',
    ],
    testNames: [
      'isOnCurve (3,6) on y²=x³+2x+3 mod 97',
      'isOnCurve Inf always true',
      'isOnCurve rejects bad point',
      'ecNegate reflects over x-axis',
      'ecNegate Inf is Inf',
      'ecAdd identity left',
      'ecAdd identity right',
      'ecAdd inverse gives Inf',
      'ecAdd doubling',
      'ecMul scalar 2',
      'ecMul scalar 0',
      'ecMul scalar 1',
    ],
  },

  'pedersen-commitment': {
    id: 'pedersen-commitment',
    title: 'Pedersen Commitment Scheme',
    difficulty: 'advanced',
    order: 5,
    description: `
<p>A <strong>commitment scheme</strong> lets you "lock in" a value without revealing it, then open it later and prove you haven't changed your mind. Think of it like sealing a number in an envelope — you can't change it after sealing, but nobody can peek until you open it.</p>

<h3>Digital Coin Flipping</h3>
<p>Suppose Alice and Bob want to flip a coin over the phone. Without commitments, whoever goes second can cheat. With commitments:</p>
<ol>
  <li>Alice picks a bit, commits to it, sends the commitment to Bob</li>
  <li>Bob sends his bit in the clear</li>
  <li>Alice opens her commitment — Bob can verify she didn't cheat</li>
</ol>

<h3>Pedersen Commitment</h3>
<p>Given public parameters <code>p</code> (prime), <code>g</code> and <code>h</code> (generators):</p>
<pre><code>commit(v, r) = g^v * h^r  mod p</code></pre>
<p>where <code>v</code> is the value and <code>r</code> is a random blinding factor.</p>

<h3>Two Key Properties</h3>
<ul>
  <li><strong>Hiding:</strong> The random <code>r</code> masks <code>v</code> completely. Without knowing <code>r</code>, seeing the commitment reveals nothing about <code>v</code>.</li>
  <li><strong>Binding:</strong> Once committed, you cannot find a different <code>(v', r')</code> that produces the same commitment (assuming nobody knows the discrete log of h base g).</li>
</ul>

<h3>THE HOMOMORPHIC PROPERTY</h3>
<p>This is where Pedersen commitments connect back to abstract algebra. The commitment function is a <strong>group homomorphism</strong>!</p>
<pre><code>commit(v1, r1) * commit(v2, r2) = g^v1 * h^r1 * g^v2 * h^r2
                                 = g^(v1+v2) * h^(r1+r2)
                                 = commit(v1+v2, r1+r2)</code></pre>
<p>The product of two commitments is a commitment to the <em>sum of the values</em>! This means you can:</p>
<ul>
  <li>Add encrypted values without decrypting them</li>
  <li>Verify sums of hidden values in zero-knowledge</li>
  <li>Build confidential transaction systems (like Monero)</li>
</ul>
<p>This is exactly the structure-preserving property <code>f(a + b) = f(a) * f(b)</code> — a homomorphism from the additive group of values to the multiplicative group mod p.</p>

<h3>Example: p=23, g=2, h=9</h3>
<pre><code>commit(5, 3) = 2^5 * 9^3 mod 23
             = 32 * 729 mod 23
             = 9 * 16 mod 23       -- (32 mod 23 = 9, 729 mod 23 = 16)
             = 144 mod 23
             = 6</code></pre>

<h3>Your Task</h3>
<p>Implement the Pedersen commitment scheme and verify its homomorphic property — the algebraic bridge from abstract group theory to real-world zero-knowledge proofs.</p>
`,
    starterCode: `module PedersenCommitment where

-- Helper: modular exponentiation
modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

-- Pedersen parameters: prime p, generators g and h
data PedersenParams = PP { ppP :: Integer, ppG :: Integer, ppH :: Integer }
  deriving (Show)

-- A commitment: the value, randomness, and computed commitment
data Commitment = Commitment
  { commitValue :: Integer
  , commitRand  :: Integer
  , commitC     :: Integer
  } deriving (Show, Eq)

-- 1. Create a Pedersen commitment.
--    commit(v, r) = g^v * h^r mod p
pedersenCommit :: PedersenParams -> Integer -> Integer -> Commitment
pedersenCommit params v r = error "compute g^v * h^r mod p"

-- 2. Verify a commitment: recompute and check it matches.
pedersenVerify :: PedersenParams -> Integer -> Integer -> Integer -> Bool
pedersenVerify params v r c = error "recompute commitment and compare"

-- 3. Add two commitments (homomorphic property).
--    The product of commitments is a commitment to the sum.
--    New value = v1 + v2, new randomness = r1 + r2
--    New commitment = c1 * c2 mod p
pedersenAdd :: PedersenParams -> Commitment -> Commitment -> Commitment
pedersenAdd params c1 c2 = error "multiply commitments, add values and randomness"

-- 4. Check the homomorphic property:
--    commit(v1,r1) * commit(v2,r2) == commit(v1+v2, r1+r2)
--    i.e., the commitC of the sum equals the commitC of a fresh commit to the sum.
isHomomorphic :: PedersenParams -> Integer -> Integer -> Integer -> Integer -> Bool
isHomomorphic params v1 r1 v2 r2 = error "check that adding commitments equals committing the sum"
`,
    solutionCode: `module PedersenCommitment where

modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

data PedersenParams = PP { ppP :: Integer, ppG :: Integer, ppH :: Integer }
  deriving (Show)

data Commitment = Commitment
  { commitValue :: Integer
  , commitRand  :: Integer
  , commitC     :: Integer
  } deriving (Show, Eq)

pedersenCommit :: PedersenParams -> Integer -> Integer -> Commitment
pedersenCommit (PP p g h) v r = Commitment v r c
  where c = (modExp g v p * modExp h r p) \`mod\` p

pedersenVerify :: PedersenParams -> Integer -> Integer -> Integer -> Bool
pedersenVerify params v r c = commitC (pedersenCommit params v r) == c

pedersenAdd :: PedersenParams -> Commitment -> Commitment -> Commitment
pedersenAdd (PP p _ _) c1 c2 = Commitment
  { commitValue = commitValue c1 + commitValue c2
  , commitRand  = commitRand c1 + commitRand c2
  , commitC     = (commitC c1 * commitC c2) \`mod\` p
  }

isHomomorphic :: PedersenParams -> Integer -> Integer -> Integer -> Integer -> Bool
isHomomorphic params v1 r1 v2 r2 =
  commitC (pedersenAdd params c1 c2) == commitC (pedersenCommit params (v1 + v2) (r1 + r2))
  where
    c1 = pedersenCommit params v1 r1
    c2 = pedersenCommit params v2 r2
`,
    testCode: `runTestEq "commit(5,3) = 6" (6 :: Integer) (commitC (pedersenCommit (PP 23 2 9) 5 3))
        , runTestEq "commit(0,0) = 1" (1 :: Integer) (commitC (pedersenCommit (PP 23 2 9) 0 0))
        , runTestEq "verify correct" True (pedersenVerify (PP 23 2 9) 5 3 6)
        , runTestEq "verify wrong value" False (pedersenVerify (PP 23 2 9) 6 3 6)
        , runTestEq "verify wrong randomness" False (pedersenVerify (PP 23 2 9) 5 4 6)
        , runTestEq "add values sum" (8 :: Integer) (commitValue (pedersenAdd (PP 23 2 9) (pedersenCommit (PP 23 2 9) 5 3) (pedersenCommit (PP 23 2 9) 3 7)))
        , runTestEq "add randomness sum" (10 :: Integer) (commitRand (pedersenAdd (PP 23 2 9) (pedersenCommit (PP 23 2 9) 5 3) (pedersenCommit (PP 23 2 9) 3 7)))
        , runTestEq "homomorphic property 1" True (isHomomorphic (PP 23 2 9) 5 3 3 7)
        , runTestEq "homomorphic property 2" True (isHomomorphic (PP 23 2 9) 10 4 7 2)
        , runTestEq "homomorphic property 3" True (isHomomorphic (PP 23 2 9) 1 1 1 1)`,
    hints: [
      'For <code>pedersenCommit</code>: <code>c = (modExp g v p * modExp h r p) \\`mod\\` p</code>. Return <code>Commitment v r c</code>.',
      'For <code>pedersenVerify</code>: recompute the commitment with <code>pedersenCommit</code> and check if <code>commitC</code> matches <code>c</code>.',
      'For <code>pedersenAdd</code>: values add, randomness adds, commitments multiply: <code>Commitment (v1+v2) (r1+r2) ((c1*c2) \\`mod\\` p)</code>.',
      'For <code>isHomomorphic</code>: commit each value separately, add the commitments with <code>pedersenAdd</code>, then check if the result matches <code>pedersenCommit params (v1+v2) (r1+r2)</code>.',
    ],
    concepts: ['commitment-scheme', 'pedersen-commitment', 'homomorphic-property', 'zero-knowledge', 'group-homomorphism'],
    successPatterns: [
      'modExp\\s+g\\s+v\\s+p',
      'pedersenVerify.*pedersenCommit',
      'commitC\\s+c1\\s*\\*\\s*commitC\\s+c2',
      'pedersenAdd.*pedersenCommit',
    ],
    testNames: [
      'commit(5,3) with p=23,g=2,h=9',
      'commit(0,0) identity',
      'verify correct commitment',
      'verify rejects wrong value',
      'verify rejects wrong randomness',
      'add sums values',
      'add sums randomness',
      'homomorphic property holds (5,3)+(3,7)',
      'homomorphic property holds (10,4)+(7,2)',
      'homomorphic property holds (1,1)+(1,1)',
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
