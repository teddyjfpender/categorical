import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  'basic-functions': {
    id: 'basic-functions',
    language: 'haskell',
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
    language: 'haskell',
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
    language: 'haskell',
    title: 'Pattern Matching',
    difficulty: 'beginner',
    order: 3,
    description: `
<p><strong>Pattern matching</strong> is Haskell's way of looking at a value, figuring out what "shape" it has, and running different code for each shape. Instead of if-else chains, you write one equation per case.</p>

<h3>How It Works</h3>
<p>You write the function name, then a <strong>pattern</strong> on the left of <code>=</code>, and the result on the right:</p>
<pre><code>describe :: Bool -> String
describe True  = "yes"
describe False = "no"</code></pre>
<p>When you call <code>describe True</code>, Haskell checks the patterns top to bottom:</p>
<ol>
  <li>Does <code>True</code> match <code>True</code>? Yes! → return <code>"yes"</code></li>
  <li>(Never reaches the second equation)</li>
</ol>
<p>When you call <code>describe False</code>:</p>
<ol>
  <li>Does <code>False</code> match <code>True</code>? No.</li>
  <li>Does <code>False</code> match <code>False</code>? Yes! → return <code>"no"</code></li>
</ol>

<h3>The Key Idea: Patterns Pull Values Apart</h3>
<p>Patterns aren't just for matching constants like <code>True</code>/<code>False</code>. They can <strong>destructure</strong> compound values and bind names to the parts:</p>
<pre><code>-- The pattern (x:xs) pulls a list apart:
--   x  = the first element
--   xs = everything after the first
--
-- Example: if the list is [5, 10, 15]:
--   x  = 5
--   xs = [10, 15]

firstElement :: [Int] -> Int
firstElement (x:_) = x      -- x is bound to the first element
                             -- _ means "I don't need the rest"</code></pre>

<h3>Matching on Lists</h3>
<p>A list has exactly two possible shapes:</p>
<table>
  <thead><tr><th>Shape</th><th>Pattern</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Empty</td><td><code>[]</code></td><td>No elements</td><td><code>[]</code></td></tr>
    <tr><td>Non-empty</td><td><code>(x:xs)</code></td><td>First element <code>x</code>, rest <code>xs</code></td><td><code>[1,2,3]</code> → <code>x=1</code>, <code>xs=[2,3]</code></td></tr>
  </tbody>
</table>
<p>A function that handles both shapes:</p>
<pre><code>safeHead :: Int -> [Int] -> Int
safeHead fallback []    = fallback    -- empty: use the fallback
safeHead _        (x:_) = x          -- non-empty: return x (first element)

-- safeHead 0 [5, 10]  →  5       (non-empty, x = 5)
-- safeHead 0 []       →  0       (empty, use fallback)</code></pre>

<h3>The Maybe Type</h3>
<p><code>Maybe</code> is like a box that either contains a value or is empty. It has two shapes:</p>
<table>
  <thead><tr><th>Shape</th><th>Pattern</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Empty box</td><td><code>Nothing</code></td><td>No value inside</td><td><code>Nothing</code></td></tr>
    <tr><td>Full box</td><td><code>Just x</code></td><td>Contains value <code>x</code></td><td><code>Just 5</code> → <code>x=5</code></td></tr>
  </tbody>
</table>
<pre><code>-- "Open the box": if there's a value, use it. Otherwise, use a default.
fromMaybe :: Int -> Maybe Int -> Int
fromMaybe fallback Nothing  = fallback    -- empty box: use fallback
fromMaybe _        (Just x) = x          -- full box: use x

-- fromMaybe 0 (Just 42)  →  42     (full box, x = 42)
-- fromMaybe 0 Nothing    →  0      (empty box, use fallback)</code></pre>

<h3>The Underscore <code>_</code></h3>
<p><code>_</code> means "this value exists but I don't need to name it." Use it for arguments you don't use on the right side of <code>=</code>.</p>

<h3>Applying a Function to a Maybe</h3>
<p>The most powerful pattern: if the box has a value, <strong>do something to it</strong>. If it's empty, use a default:</p>
<pre><code>-- If Nothing:  return the default
-- If Just x:   apply the function to x and return the result
--
-- transform (+10) 0 (Just 5)   →  (+10) 5  →  15
-- transform (+10) 0 Nothing    →  0

transform :: (Int -> Int) -> Int -> Maybe Int -> Int
transform _        fallback Nothing  = fallback
transform function _        (Just x) = function x</code></pre>
<p>On the right side of <code>=</code>, <code>function x</code> means "call <code>function</code> with <code>x</code> as the argument" — it's just function application, like <code>double 5</code> or <code>(+10) 5</code>.</p>

<h3>Your Task</h3>
<p>Implement four functions using pattern matching. Each function needs one equation per shape. Replace each <code>error "..."</code> with the correct return value for that case.</p>
`,
    starterCode: `module PatternMatching where

-- EXERCISE: Replace each error "..." with the correct return value.
-- Each equation handles one "shape" of the input.

-- 1. Convert a Bool to "yes" or "no".
--    The pattern is already matched for you — just provide the result.
--    Example: boolToString True  →  "yes"
--    Example: boolToString False →  "no"
boolToString :: Bool -> String
boolToString True  = error "what should True become?"
boolToString False = error "what should False become?"

-- 2. Get the first element of a list, or a default if empty.
--    Two shapes:
--      []    → the list is empty, so return the fallback
--      (x:_) → the list has a first element x, so return x
--
--    Example: headOr 0 [1,2,3] → the list is (1:_), so return 1
--    Example: headOr 0 []      → empty, so return 0 (the fallback)
headOr :: a -> [a] -> a
headOr fallback []    = error "empty list: what should you return?"
headOr _        (x:_) = error "non-empty: what variable holds the first element?"

-- 3. Does a Maybe contain a value?
--    Two shapes:
--      Nothing  → empty box, no value   → False
--      (Just _) → full box, has a value → True
--
--    Example: isJust (Just 5)  → True
--    Example: isJust Nothing   → False
isJust :: Maybe a -> Bool
isJust Nothing  = error "empty box means..."
isJust (Just _) = error "full box means..."

-- 4. Apply a function to the value inside a Maybe.
--    Two shapes:
--      Nothing  → no value, so return the fallback
--      (Just x) → there IS a value x, so apply f to it: f x
--
--    Think of it as: "if the box has something, do f to it"
--
--    Example: maybeApply (+1) 0 (Just 5) → (+1) 5 → 6
--    Example: maybeApply (+1) 0 Nothing  → 0 (fallback)
maybeApply :: (a -> b) -> b -> Maybe a -> b
maybeApply _ fallback Nothing  = error "no value: return what?"
maybeApply f _        (Just x) = error "has value x: apply f to x how?"
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
      'Each equation already has the pattern on the left side — you just need to replace <code>error "..."</code> with the return value. For <code>boolToString True = error "..."</code>, the True case should return the string <code>"yes"</code>.',
      'For <code>headOr</code>: look at what names the pattern gives you. In <code>headOr fallback [] = ...</code>, you have a variable called <code>fallback</code> — return it! In <code>headOr _ (x:_) = ...</code>, the pattern pulls out the first element and calls it <code>x</code> — return <code>x</code>.',
      'For <code>isJust</code>: the empty box (<code>Nothing</code>) means there\'s no value, so return <code>False</code>. The full box (<code>Just _</code>) means there IS a value, so return <code>True</code>. The <code>_</code> means we don\'t need to know what the value is.',
      'For <code>maybeApply</code>: the <code>Nothing</code> case has no value to work with, so return <code>fallback</code>. The <code>Just x</code> case has a value <code>x</code> and a function <code>f</code> — apply the function: <code>f x</code> (just like <code>double 5</code> or <code>(+1) 5</code>).',
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
    language: 'haskell',
    title: 'Define a Shape Type',
    difficulty: 'beginner',
    order: 4,
    description: `
<p>So far you've pattern matched on types that already exist (<code>Bool</code>, lists, <code>Maybe</code>). Now you'll <strong>create your own type</strong>.</p>

<h3>Step 1: Defining a Simple Type</h3>
<p>The <code>data</code> keyword creates a new type. The simplest form lists possible values separated by <code>|</code> (read as "or"):</p>
<pre><code>data Color = Red | Green | Blue</code></pre>
<p>This says: "A <code>Color</code> is either <code>Red</code>, <code>Green</code>, or <code>Blue</code>." These are called <strong>constructors</strong> — they construct values of the type.</p>
<p>You pattern match on your own type exactly like you did with <code>Bool</code>:</p>
<pre><code>colorName :: Color -> String
colorName Red   = "red"
colorName Green = "green"
colorName Blue  = "blue"</code></pre>
<p>This is the same pattern as <code>boolToString</code> — one equation per constructor.</p>

<h3>Step 2: Constructors That Hold Data</h3>
<p>Constructors can carry values! List the types after the constructor name:</p>
<pre><code>data Temperature
  = Celsius Double       -- holds one Double (the temperature)
  | Fahrenheit Double    -- holds one Double</code></pre>
<p>Now <code>Celsius 100.0</code> and <code>Fahrenheit 212.0</code> are both <code>Temperature</code> values. The key: when you pattern match, you can <strong>pull the data out</strong>:</p>
<pre><code>toCelsius :: Temperature -> Double
toCelsius (Celsius c)    = c                     -- already Celsius, just return c
toCelsius (Fahrenheit f) = (f - 32) * 5 / 9     -- convert from Fahrenheit</code></pre>
<p>Inside the pattern <code>(Celsius c)</code>, the variable <code>c</code> gets bound to the Double inside. This is the same destructuring you learned with <code>(x:xs)</code> and <code>(Just x)</code>.</p>

<h3>Step 3: Constructors with Multiple Fields</h3>
<p>A constructor can hold more than one value — just list more types:</p>
<pre><code>data Point = Point Double Double    -- holds an x and a y

distanceFromOrigin :: Point -> Double
distanceFromOrigin (Point x y) = sqrt (x*x + y*y)</code></pre>
<p>The pattern <code>(Point x y)</code> binds <code>x</code> to the first Double and <code>y</code> to the second.</p>

<h3>Step 4: deriving (Show, Eq)</h3>
<p>Adding <code>deriving (Show, Eq)</code> at the end tells the compiler to automatically generate:</p>
<ul>
  <li><code>Show</code> — lets you print values: <code>show (Celsius 100) = "Celsius 100.0"</code></li>
  <li><code>Eq</code> — lets you compare values: <code>Celsius 100 == Celsius 100</code> is <code>True</code></li>
</ul>

<h3>Putting It All Together</h3>
<p>Here's the complete pattern for defining a type and writing a function on it:</p>
<pre><code>-- 1. Define the type (what shapes can values have?)
data Animal
  = Dog String          -- holds the dog's name
  | Cat String          -- holds the cat's name
  | Fish                -- no extra data
  deriving (Show, Eq)

-- 2. Write a function by matching each constructor
speak :: Animal -> String
speak (Dog name) = name ++ " says Woof!"
speak (Cat name) = name ++ " says Meow!"
speak Fish       = "..."</code></pre>

<h3>Your Task</h3>
<p>Define a <code>Shape</code> type with three constructors, then write an <code>area</code> function. Here's what each constructor needs:</p>
<table>
  <thead><tr><th>Constructor</th><th>Data it holds</th><th>Area formula</th></tr></thead>
  <tbody>
    <tr><td><code>Circle</code></td><td>one <code>Double</code> (the radius)</td><td><code>pi * r * r</code></td></tr>
    <tr><td><code>Rectangle</code></td><td>two <code>Double</code>s (width and height)</td><td><code>w * h</code></td></tr>
    <tr><td><code>Triangle</code></td><td>two <code>Double</code>s (base and height)</td><td><code>0.5 * b * h</code></td></tr>
  </tbody>
</table>
<p><code>pi</code> is built into Haskell — you can use it directly.</p>
`,
    starterCode: `module Shapes where

-- EXERCISE: Two steps — define a type, then write a function on it.
--
-- STEP 1: Define the Shape type.
--         Uncomment the block below and replace each _ with Double.
--
--   Circle holds 1 Double (radius)        → Circle Double
--   Rectangle holds 2 Doubles (w, h)      → Rectangle Double Double
--   Triangle holds 2 Doubles (base, h)    → Triangle Double Double

-- data Shape
--   = Circle _
--   | Rectangle _ _
--   | Triangle _ _
--   deriving (Show, Eq)

-- STEP 2: Write the area function.
--         Uncomment the block below and replace each _ with the formula.
--
--   The pattern on the left (e.g., Circle r) pulls out the data.
--   The formula on the right computes the area.
--
--   Circle r      → pi * r * r        (pi is built in)
--   Rectangle w h → w * h
--   Triangle b h  → 0.5 * b * h

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
      'Start with Step 1: remove the <code>--</code> from the <code>data Shape</code> block (4 lines). Then replace each <code>_</code> with <code>Double</code>. Circle needs one Double, Rectangle and Triangle need two each.',
      'After uncommenting, your data type should look like: <code>data Shape = Circle Double | Rectangle Double Double | Triangle Double Double deriving (Show, Eq)</code>. Now move to Step 2.',
      'For Step 2: uncomment the <code>area</code> function (4 lines). The patterns on the left already pull out the values (<code>r</code>, <code>w</code>, <code>h</code>, <code>b</code>). Replace each <code>_</code> on the right with the area formula using those variables.',
      'The formulas: <code>area (Circle r) = pi * r * r</code>, <code>area (Rectangle w h) = w * h</code>, <code>area (Triangle b h) = 0.5 * b * h</code>.',
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
    language: 'haskell',
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
    language: 'haskell',
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
    language: 'haskell',
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
};
