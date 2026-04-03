import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  'lambda-identity': {
    id: 'lambda-identity',
    title: 'Lambda Expressions: The Building Blocks',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>Lambda calculus is the theoretical foundation of all functional programming. In this exercise you'll learn to <strong>read</strong> lambda expressions in Haskell and predict what they evaluate to.</p>

<h3>What Is a Lambda?</h3>
<p>A <strong>lambda expression</strong> (also called an <em>anonymous function</em>) is a function without a name. In Haskell, the backslash <code>\\</code> stands for the Greek letter &lambda; (lambda):</p>
<pre><code>\\x -> x + 1</code></pre>
<p>This means: "a function that takes <code>x</code> and returns <code>x + 1</code>." It's exactly like writing <code>f x = x + 1</code>, but without giving it the name <code>f</code>.</p>

<h3>The Identity Function</h3>
<p>The simplest lambda is the <strong>identity function</strong> &mdash; it returns its argument unchanged:</p>
<pre><code>\\x -> x</code></pre>
<p>Apply it to any value and you get that value back:</p>
<pre><code>(\\x -> x) 42      -- evaluates to 42
(\\x -> x) "hello" -- evaluates to "hello"</code></pre>
<p>The parentheses around <code>\\x -> x</code> are needed so Haskell knows the lambda ends before the argument.</p>

<h3>Multiple Arguments (Currying)</h3>
<p>Lambdas take <strong>one argument at a time</strong>. To take two arguments, you nest lambdas:</p>
<pre><code>\\x -> \\y -> x + y</code></pre>
<p>This means: "a function that takes <code>x</code> and returns <em>another function</em> that takes <code>y</code> and returns <code>x + y</code>." When you apply it to two arguments:</p>
<pre><code>(\\x -> \\y -> x + y) 3 4
-- Step 1: substitute x = 3 &rarr; \\y -> 3 + y
-- Step 2: substitute y = 4 &rarr; 3 + 4
-- Result: 7</code></pre>

<h3>The Const Function</h3>
<p><code>\\x -> \\y -> x</code> takes two arguments and always returns the <strong>first</strong>:</p>
<pre><code>(\\x -> \\y -> x) "hello" "world"  -- "hello"</code></pre>
<p>The second argument <code>"world"</code> is simply ignored.</p>

<h3>Higher-Order Lambdas</h3>
<p>Lambdas can take <strong>functions</strong> as arguments:</p>
<pre><code>(\\f -> f 10) (\\x -> x + 1)
-- substitute f = (\\x -> x + 1) &rarr; (\\x -> x + 1) 10
-- substitute x = 10 &rarr; 10 + 1
-- Result: 11</code></pre>

<h3>Alpha Equivalence</h3>
<p>The <em>name</em> of the parameter doesn't matter &mdash; only the <em>structure</em> does. These are all the same function:</p>
<pre><code>\\x -> x
\\y -> y
\\z -> z</code></pre>
<p>Renaming bound variables is called <strong>alpha equivalence</strong>.</p>

<h3>Your Task</h3>
<p>Predict what each lambda expression evaluates to. Replace every <code>error "..."</code> with the correct value.</p>
`,
    starterCode: `module LambdaIdentity where

-- EXERCISE: Predict what each lambda expression evaluates to.
-- Replace each \`error "..."\` with the correct value.

-- 1. The identity function applied to 42
--    (\\x -> x) 42
answer1 :: Int
answer1 = error "what does the identity return?"

-- 2. A lambda that doubles its argument
--    (\\x -> x * 2) 5
answer2 :: Int
answer2 = error "what is 5 doubled?"

-- 3. The const function: takes two args, returns the first
--    (\\x -> \\y -> x) "hello" "world"
answer3 :: String
answer3 = error "which argument is returned?"

-- 4. The opposite: takes two args, returns the second
--    (\\x -> \\y -> y) "hello" "world"
answer4 :: String
answer4 = error "which argument is returned?"

-- 5. A higher-order lambda: takes a function, applies it to 10
--    (\\f -> f 10) (\\x -> x + 1)
answer5 :: Int
answer5 = error "what does the function do to 10?"

-- 6. Apply a function twice: (\\f -> \\x -> f (f x)) (+3) 0
--    Step 1: f = (+3), so we get \\x -> (+3) ((+3) x)
--    Step 2: x = 0, so (+3) ((+3) 0) = (+3) 3 = 6
answer6 :: Int
answer6 = error "apply (+3) twice starting from 0"

-- 7. A curried addition: (\\x -> \\y -> x + y) 3 4
answer7 :: Int
answer7 = error "what is 3 + 4?"

-- 8. Alpha equivalence: the name doesn't matter!
--    (\\y -> y + 1) 99
--    This is the same as (\\x -> x + 1) 99
answer8 :: Int
answer8 = error "what is 99 + 1?"
`,
    solutionCode: `module LambdaIdentity where

answer1 :: Int
answer1 = 42

answer2 :: Int
answer2 = 10

answer3 :: String
answer3 = "hello"

answer4 :: String
answer4 = "world"

answer5 :: Int
answer5 = 11

answer6 :: Int
answer6 = 6

answer7 :: Int
answer7 = 7

answer8 :: Int
answer8 = 100
`,
    testCode: `runTestEq "(\\\\x -> x) 42 = 42" (42 :: Int) answer1
        , runTestEq "(\\\\x -> x * 2) 5 = 10" (10 :: Int) answer2
        , runTestEq "const returns first: hello" "hello" answer3
        , runTestEq "flipped const returns second: world" "world" answer4
        , runTestEq "(\\\\f -> f 10) (\\\\x -> x+1) = 11" (11 :: Int) answer5
        , runTestEq "apply (+3) twice to 0 = 6" (6 :: Int) answer6
        , runTestEq "(\\\\x -> \\\\y -> x+y) 3 4 = 7" (7 :: Int) answer7
        , runTestEq "(\\\\y -> y+1) 99 = 100" (100 :: Int) answer8`,
    hints: [
      'The identity function <code>\\x -> x</code> returns whatever you give it. So <code>(\\x -> x) 42</code> is just <code>42</code>.',
      'For <code>\\x -> \\y -> x</code>, the second argument is ignored. It always returns the first argument, no matter what the second one is.',
      'Higher-order: <code>(\\f -> f 10)</code> takes a function <code>f</code> and applies it to <code>10</code>. If <code>f = (\\x -> x + 1)</code>, then <code>f 10 = 11</code>.',
      'Apply-twice: <code>(\\f -> \\x -> f (f x)) (+3) 0</code> means <code>(+3) ((+3) 0) = (+3) 3 = 6</code>. Work inside-out.',
    ],
    concepts: ['lambda', 'identity', 'const', 'higher-order', 'currying', 'alpha-equivalence', 'anonymous-function'],
    successPatterns: [
      'answer1\\s*=\\s*42',
      'answer3\\s*=\\s*"hello"',
      'answer5\\s*=\\s*11',
      'answer6\\s*=\\s*6',
    ],
    testNames: [
      '(\\x -> x) 42 evaluates to 42',
      '(\\x -> x * 2) 5 evaluates to 10',
      'const (\\x -> \\y -> x) returns first arg "hello"',
      'flipped const (\\x -> \\y -> y) returns second arg "world"',
      '(\\f -> f 10) (\\x -> x+1) evaluates to 11',
      'apply-twice (\\f -> \\x -> f (f x)) (+3) 0 evaluates to 6',
      '(\\x -> \\y -> x+y) 3 4 evaluates to 7',
      'alpha equivalence: (\\y -> y+1) 99 evaluates to 100',
    ],
  },

  'beta-reduction': {
    id: 'beta-reduction',
    title: 'Beta Reduction: Substitution in Action',
    difficulty: 'beginner',
    order: 2,
    description: `
<p><strong>Beta reduction</strong> is the fundamental operation of lambda calculus. It's simply substitution: when you apply a lambda to an argument, you replace every occurrence of the parameter with the argument in the body.</p>

<h3>The Beta Reduction Rule</h3>
<p>The notation is:</p>
<pre><code>(\\x -> body) arg  &rarr;  body[x := arg]</code></pre>
<p>Read this as: "Replace every <code>x</code> in <code>body</code> with <code>arg</code>."</p>

<h4>Example 1: Simple substitution</h4>
<pre><code>(\\x -> x + x) 5
-- Replace x with 5 in (x + x):
-- 5 + 5
-- Result: 10</code></pre>

<h4>Example 2: Multi-step reduction</h4>
<pre><code>(\\x -> \\y -> x + y) 3 4
-- Step 1: Replace x with 3 in (\\y -> x + y):
--   \\y -> 3 + y
-- Step 2: Replace y with 4 in (3 + y):
--   3 + 4
-- Result: 7</code></pre>

<h4>Example 3: Function composition</h4>
<pre><code>(\\f -> \\g -> \\x -> f (g x)) (+1) (*2) 3
-- Step 1: Replace f with (+1):  \\g -> \\x -> (+1) (g x)
-- Step 2: Replace g with (*2):  \\x -> (+1) ((*2) x)
-- Step 3: Replace x with 3:    (+1) ((*2) 3)
--   = (+1) 6
--   = 7</code></pre>

<h3>Free vs Bound Variables</h3>
<p>A variable is <strong>bound</strong> if it appears as a lambda parameter. A variable is <strong>free</strong> if it refers to something defined <em>outside</em> the lambda:</p>
<pre><code>y = 5
(\\x -> x + y) 10
-- x is bound (it's the lambda parameter)
-- y is free (it refers to the top-level definition)
-- Replace x with 10: 10 + y = 10 + 5 = 15</code></pre>
<p>Beta reduction only substitutes the <strong>bound</strong> variable. Free variables keep their external values.</p>

<h3>Variable Shadowing</h3>
<p>When an inner lambda uses the same parameter name as an outer one, the inner binding <strong>shadows</strong> (hides) the outer one:</p>
<pre><code>(\\x -> (\\x -> x + 1) x) 10
-- The outer \\x binds to 10
-- (\\x -> x + 1) 10  &larr; now the inner \\x binds to 10
-- 10 + 1
-- Result: 11</code></pre>
<p>The inner <code>x</code> is a completely separate variable that happens to have the same name.</p>

<h3>Your Task</h3>
<p>Trace each beta reduction and predict the final value. The comments show the reduction steps to help you follow along.</p>
`,
    starterCode: `module BetaReduction where

-- EXERCISE: Trace each beta reduction and predict the result.
-- Replace each \`error "..."\` with the correct value.

-- 1. (\\x -> x + x) 5
--    Replace x with 5: 5 + 5 = ?
answer1 :: Int
answer1 = error "substitute and compute"

-- 2. (\\x -> \\y -> x + y) 3 4
--    Step 1: replace x with 3 -> \\y -> 3 + y
--    Step 2: replace y with 4 -> 3 + 4 = ?
answer2 :: Int
answer2 = error "two substitutions"

-- 3. (\\f -> f (f 0)) (\\x -> x + 1)
--    Step 1: replace f with (\\x -> x + 1)
--            -> (\\x -> x + 1) ((\\x -> x + 1) 0)
--    Step 2: inner application: (\\x -> x + 1) 0 = 1
--    Step 3: outer application: (\\x -> x + 1) 1 = ?
answer3 :: Int
answer3 = error "apply the function twice to 0"

-- 4. (\\f -> \\g -> \\x -> f (g x)) (+1) (*2) 3
--    Step 1: f = (+1) -> \\g -> \\x -> (+1) (g x)
--    Step 2: g = (*2) -> \\x -> (+1) ((*2) x)
--    Step 3: x = 3   -> (+1) ((*2) 3) = (+1) 6 = ?
answer4 :: Int
answer4 = error "compose (+1) after (*2)"

-- 5. Free variable: y is defined at the top level.
--    (\\x -> x + y) 10    where y = 5
--    Replace x with 10: 10 + y = 10 + 5 = ?
y :: Int
y = 5

answer5 :: Int
answer5 = error "x is substituted, y is free"

-- 6. Variable shadowing:
--    (\\x -> (\\x -> x + 1) x) 10
--    Outer: replace x with 10 -> (\\x -> x + 1) 10
--    Inner: replace x with 10 -> 10 + 1 = ?
answer6 :: Int
answer6 = error "inner x shadows outer x"
`,
    solutionCode: `module BetaReduction where

answer1 :: Int
answer1 = 10

answer2 :: Int
answer2 = 7

answer3 :: Int
answer3 = 2

answer4 :: Int
answer4 = 7

y :: Int
y = 5

answer5 :: Int
answer5 = 15

answer6 :: Int
answer6 = 11
`,
    testCode: `runTestEq "(\\\\x -> x + x) 5 = 10" (10 :: Int) answer1
        , runTestEq "(\\\\x -> \\\\y -> x+y) 3 4 = 7" (7 :: Int) answer2
        , runTestEq "(\\\\f -> f (f 0)) (\\\\x -> x+1) = 2" (2 :: Int) answer3
        , runTestEq "compose (+1) (*2) 3 = 7" (7 :: Int) answer4
        , runTestEq "free variable: (\\\\x -> x+y) 10 where y=5 = 15" (15 :: Int) answer5
        , runTestEq "shadowing: (\\\\x -> (\\\\x -> x+1) x) 10 = 11" (11 :: Int) answer6`,
    hints: [
      'For <code>(\\x -> x + x) 5</code>: replace every <code>x</code> with <code>5</code>, giving <code>5 + 5 = 10</code>.',
      'For multi-argument lambdas, reduce one argument at a time, left to right. <code>(\\x -> \\y -> x + y) 3 4</code>: first replace <code>x</code> with <code>3</code>, then replace <code>y</code> with <code>4</code>.',
      'Free variables are NOT substituted during beta reduction. <code>y = 5</code> is defined at the top level, so <code>(\\x -> x + y) 10</code> becomes <code>10 + 5</code>.',
      'Shadowing: in <code>(\\x -> (\\x -> x + 1) x) 10</code>, the outer <code>x</code> is replaced by <code>10</code>, giving <code>(\\x -> x + 1) 10</code>. Then the inner <code>x</code> is replaced by <code>10</code>, giving <code>11</code>.',
    ],
    concepts: ['beta-reduction', 'substitution', 'free-variable', 'bound-variable', 'shadowing', 'reduction-steps'],
    successPatterns: [
      'answer1\\s*=\\s*10',
      'answer3\\s*=\\s*2',
      'answer5\\s*=\\s*15',
      'answer6\\s*=\\s*11',
    ],
    testNames: [
      '(\\x -> x + x) 5 beta-reduces to 10',
      '(\\x -> \\y -> x + y) 3 4 beta-reduces to 7',
      '(\\f -> f (f 0)) (\\x -> x + 1) beta-reduces to 2',
      '(\\f -> \\g -> \\x -> f (g x)) (+1) (*2) 3 beta-reduces to 7',
      'free variable y=5: (\\x -> x + y) 10 evaluates to 15',
      'shadowing: (\\x -> (\\x -> x+1) x) 10 evaluates to 11',
    ],
  },

  'lambda-combinators': {
    id: 'lambda-combinators',
    title: 'Combinators: Functions from Functions',
    difficulty: 'beginner',
    order: 3,
    description: `
<p>A <strong>combinator</strong> is a lambda expression with <em>no free variables</em> &mdash; it only uses its parameters. Combinators are the building blocks of computation: remarkably, you can express <em>any</em> computation using just a handful of them.</p>

<h3>The Classic Combinators</h3>
<p>Each combinator has a single-letter name from the tradition of combinatory logic:</p>

<table>
  <thead><tr><th>Name</th><th>Letter</th><th>Definition</th><th>What It Does</th></tr></thead>
  <tbody>
    <tr><td>Identity</td><td><strong>I</strong></td><td><code>\\x -> x</code></td><td>Returns its argument unchanged</td></tr>
    <tr><td>Const (Kestrel)</td><td><strong>K</strong></td><td><code>\\x _ -> x</code></td><td>Takes two args, returns the first</td></tr>
    <tr><td>Flip (Cardinal)</td><td><strong>C</strong></td><td><code>\\f x y -> f y x</code></td><td>Swaps the arguments of a binary function</td></tr>
    <tr><td>Compose (Bluebird)</td><td><strong>B</strong></td><td><code>\\f g x -> f (g x)</code></td><td>Composes two functions: apply <code>g</code> then <code>f</code></td></tr>
    <tr><td>Duplicate (Warbler)</td><td><strong>W</strong></td><td><code>\\f x -> f x x</code></td><td>Applies a binary function to the same argument twice</td></tr>
    <tr><td>Substitution (Starling)</td><td><strong>S</strong></td><td><code>\\f g x -> f x (g x)</code></td><td>Applies <code>f</code> to <code>x</code> and <code>(g x)</code></td></tr>
  </tbody>
</table>

<h3>Why Combinators Matter</h3>
<ul>
  <li><strong>S and K alone</strong> can express any computable function (they are <em>Turing complete</em>).</li>
  <li>The identity combinator is actually <code>S K K</code>: <code>(\\f g x -> f x (g x)) (\\x _ -> x) (\\x _ -> x)</code> reduces to <code>\\x -> x</code>.</li>
  <li>Haskell's <code>id</code>, <code>const</code>, <code>flip</code>, and <code>(.)</code> are exactly I, K, C, and B.</li>
</ul>

<h3>Worked Examples</h3>
<pre><code>-- I combinator
iComb 42 = 42             -- returns argument unchanged

-- K combinator
kComb "a" "b" = "a"       -- ignores second argument

-- C combinator (flip)
cComb (-) 3 10 = (-) 10 3 = 7   -- swaps: 10 - 3, not 3 - 10

-- B combinator (compose)
bComb (+1) (*2) 3 = (+1) ((*2) 3) = (+1) 6 = 7

-- W combinator (duplicate)
wComb (+) 5 = (+) 5 5 = 10    -- uses 5 for both arguments

-- S combinator
sComb (\\x y -> x + y) (*2) 3
  = (\\x y -> x + y) 3 ((*2) 3)
  = (\\x y -> x + y) 3 6
  = 9</code></pre>

<h3>Your Task</h3>
<p>Implement each combinator as a one-line lambda. The type signatures are provided.</p>
`,
    starterCode: `module LambdaCombinators where

-- EXERCISE: Implement each classic combinator.
-- Each is a single-line lambda expression.

-- I combinator (Identity): returns its argument unchanged.
-- Example: iComb 42 = 42
iComb :: a -> a
iComb = error "implement identity"

-- K combinator (Const): takes two args, returns the first.
-- Example: kComb "a" "b" = "a"
kComb :: a -> b -> a
kComb = error "implement const"

-- C combinator (Flip): swaps the arguments of a function.
-- Example: cComb (-) 3 10 = 7   (computes 10 - 3)
cComb :: (a -> b -> c) -> b -> a -> c
cComb = error "implement flip"

-- B combinator (Compose): applies g then f.
-- Example: bComb (+1) (*2) 3 = 7
bComb :: (b -> c) -> (a -> b) -> a -> c
bComb = error "implement compose"

-- W combinator (Duplicate): applies f to x twice.
-- Example: wComb (+) 5 = 10
wComb :: (a -> a -> b) -> a -> b
wComb = error "implement duplicate"

-- S combinator (Substitution): f x (g x)
-- Example: sComb (\\x y -> x + y) (*2) 3 = 9
sComb :: (a -> b -> c) -> (a -> b) -> a -> c
sComb = error "implement S combinator"
`,
    solutionCode: `module LambdaCombinators where

iComb :: a -> a
iComb = \\x -> x

kComb :: a -> b -> a
kComb = \\x _ -> x

cComb :: (a -> b -> c) -> b -> a -> c
cComb = \\f x y -> f y x

bComb :: (b -> c) -> (a -> b) -> a -> c
bComb = \\f g x -> f (g x)

wComb :: (a -> a -> b) -> a -> b
wComb = \\f x -> f x x

sComb :: (a -> b -> c) -> (a -> b) -> a -> c
sComb = \\f g x -> f x (g x)
`,
    testCode: `runTestEq "iComb 42 = 42" (42 :: Int) (iComb 42)
        , runTestEq "iComb True = True" True (iComb True)
        , runTestEq "kComb a b = a" "a" (kComb "a" "b")
        , runTestEq "kComb 1 2 = 1" (1 :: Int) (kComb 1 2)
        , runTestEq "cComb (-) 3 10 = 7" (7 :: Int) (cComb (-) 3 10)
        , runTestEq "cComb (++) world hello = helloworld" "helloworld" (cComb (++) "world" "hello")
        , runTestEq "bComb (+1) (*2) 3 = 7" (7 :: Int) (bComb (+1) (*2) 3)
        , runTestEq "bComb show length hello = 5" "5" (bComb show length "hello")
        , runTestEq "wComb (+) 5 = 10" (10 :: Int) (wComb (+) 5)
        , runTestEq "wComb (*) 4 = 16" (16 :: Int) (wComb (*) 4)
        , runTestEq "sComb (\\\\x y -> x+y) (*2) 3 = 9" (9 :: Int) (sComb (\\x y -> x + y) (*2) 3)
        , runTestEq "sComb const id 5 = 5" (5 :: Int) (sComb const id 5)`,
    hints: [
      'The identity combinator is literally <code>\\x -> x</code>. It does nothing but return its argument.',
      'For K (const): <code>\\x _ -> x</code>. The underscore <code>_</code> means "I take a second argument but ignore it."',
      'For C (flip): <code>\\f x y -> f y x</code>. You receive the function and both arguments, then call the function with the arguments swapped.',
      'For S: <code>\\f g x -> f x (g x)</code>. Apply <code>g</code> to <code>x</code> to get the second argument, then apply <code>f</code> to <code>x</code> and that result.',
    ],
    concepts: ['combinator', 'identity', 'const', 'flip', 'compose', 'duplicate', 'substitution', 'SKI-calculus'],
    successPatterns: [
      'iComb\\s*=\\s*\\\\x\\s*->\\s*x',
      'kComb\\s*=\\s*\\\\x\\s*_\\s*->\\s*x',
      'bComb\\s*=\\s*\\\\f\\s+g\\s+x\\s*->\\s*f\\s*\\(g\\s+x\\)',
      'sComb\\s*=\\s*\\\\f\\s+g\\s+x\\s*->\\s*f\\s+x\\s*\\(g\\s+x\\)',
    ],
    testNames: [
      'iComb 42 = 42 (identity returns argument)',
      'iComb True = True (identity is polymorphic)',
      'kComb "a" "b" = "a" (const returns first)',
      'kComb 1 2 = 1 (const ignores second)',
      'cComb (-) 3 10 = 7 (flip swaps args)',
      'cComb (++) "world" "hello" = "helloworld"',
      'bComb (+1) (*2) 3 = 7 (compose applies g then f)',
      'bComb show length "hello" = "5"',
      'wComb (+) 5 = 10 (duplicate uses arg twice)',
      'wComb (*) 4 = 16 (duplicate: 4*4)',
      'sComb (\\x y->x+y) (*2) 3 = 9 (S combinator)',
      'sComb const id 5 = 5 (S K K = I)',
    ],
  },

  'higher-order-lambdas': {
    id: 'higher-order-lambdas',
    title: 'Higher-Order Functions as Lambda Calculus',
    difficulty: 'beginner',
    order: 4,
    description: `
<p>Higher-order functions &mdash; functions that take or return other functions &mdash; are where lambda calculus meets everyday programming. Haskell's <code>map</code>, <code>filter</code>, and function composition are all higher-order functions that you can define yourself using lambdas and pattern matching.</p>

<h3>map: Transform Every Element</h3>
<p><code>map</code> takes a function and a list, and applies the function to each element:</p>
<pre><code>map (*2) [1, 2, 3]  -- [2, 4, 6]
map show [1, 2, 3]  -- ["1", "2", "3"]</code></pre>
<p>You can define it with pattern matching on the list:</p>
<pre><code>myMap :: (a -> b) -> [a] -> [b]
myMap f []     = []                -- base case: empty list
myMap f (x:xs) = f x : myMap f xs  -- apply f to head, recurse on tail</code></pre>
<p>The key insight: <code>f</code> is a <strong>parameter</strong> that happens to be a function. Lambda calculus treats functions as values &mdash; they can be passed around like any other data.</p>

<h3>filter: Keep Only Matching Elements</h3>
<p><code>filter</code> takes a <strong>predicate</strong> (a function returning <code>Bool</code>) and keeps elements where the predicate returns <code>True</code>:</p>
<pre><code>filter even [1, 2, 3, 4, 5]  -- [2, 4]
filter (> 3) [1, 2, 3, 4, 5] -- [4, 5]</code></pre>

<h3>Function Composition</h3>
<p>Composition chains two functions together. Haskell uses <code>(.)</code> for this, but you can write it as a lambda:</p>
<pre><code>compose f g x = f (g x)
-- or equivalently:
compose = \\f g x -> f (g x)</code></pre>
<pre><code>compose (+1) (*2) 3  -- (+1) ((*2) 3) = (+1) 6 = 7</code></pre>

<h3>Applying Twice</h3>
<p>A function that applies another function two times:</p>
<pre><code>twice f x = f (f x)
twice (+3) 0  -- (+3) ((+3) 0) = (+3) 3 = 6</code></pre>

<h3>Flipping Arguments</h3>
<p><code>flip</code> swaps the first two arguments of a function:</p>
<pre><code>myFlip f x y = f y x
myFlip (-) 3 10  -- (-) 10 3 = 7</code></pre>

<h3>Your Task</h3>
<p>Implement each higher-order function using lambdas and/or pattern matching. Keep the given type signatures.</p>
`,
    starterCode: `module HigherOrderLambdas where

-- EXERCISE: Implement each higher-order function.

-- 1. myMap: apply a function to every element of a list.
--    Example: myMap (*2) [1, 2, 3] = [2, 4, 6]
myMap :: (a -> b) -> [a] -> [b]
myMap f [] = error "implement base case"
myMap f (x:xs) = error "implement recursive case"

-- 2. myFilter: keep elements where the predicate returns True.
--    Example: myFilter even [1, 2, 3, 4, 5] = [2, 4]
myFilter :: (a -> Bool) -> [a] -> [a]
myFilter p [] = error "implement base case"
myFilter p (x:xs) = error "implement recursive case"

-- 3. compose: apply g then f (like Haskell's (.))
--    Example: compose (+1) (*2) 3 = 7
compose :: (b -> c) -> (a -> b) -> a -> c
compose = error "implement as a lambda"

-- 4. twice: apply a function two times.
--    Example: twice (+3) 0 = 6
twice :: (a -> a) -> a -> a
twice = error "implement as a lambda"

-- 5. myFlip: swap the first two arguments of a function.
--    Example: myFlip (-) 3 10 = 7   (computes 10 - 3)
myFlip :: (a -> b -> c) -> b -> a -> c
myFlip = error "implement as a lambda"
`,
    solutionCode: `module HigherOrderLambdas where

myMap :: (a -> b) -> [a] -> [b]
myMap f [] = []
myMap f (x:xs) = f x : myMap f xs

myFilter :: (a -> Bool) -> [a] -> [a]
myFilter p [] = []
myFilter p (x:xs) = if p x then x : myFilter p xs else myFilter p xs

compose :: (b -> c) -> (a -> b) -> a -> c
compose = \\f g x -> f (g x)

twice :: (a -> a) -> a -> a
twice = \\f x -> f (f x)

myFlip :: (a -> b -> c) -> b -> a -> c
myFlip = \\f x y -> f y x
`,
    testCode: `runTestEq "myMap (*2) [1,2,3] = [2,4,6]" [2,4,6 :: Int] (myMap (*2) [1,2,3])
        , runTestEq "myMap show [1,2] = [1,2]" ["1","2"] (myMap show [1 :: Int, 2])
        , runTestEq "myMap id [] = []" ([] :: [Int]) (myMap id [])
        , runTestEq "myFilter even [1..5] = [2,4]" [2,4 :: Int] (myFilter even [1,2,3,4,5])
        , runTestEq "myFilter (>3) [1..5] = [4,5]" [4,5 :: Int] (myFilter (>3) [1,2,3,4,5])
        , runTestEq "myFilter odd [] = []" ([] :: [Int]) (myFilter odd [])
        , runTestEq "compose (+1) (*2) 3 = 7" (7 :: Int) (compose (+1) (*2) 3)
        , runTestEq "compose not even 3 = True" True (compose not even 3)
        , runTestEq "twice (+3) 0 = 6" (6 :: Int) (twice (+3) 0)
        , runTestEq "twice (*2) 1 = 4" (4 :: Int) (twice (*2) 1)
        , runTestEq "myFlip (-) 3 10 = 7" (7 :: Int) (myFlip (-) 3 10)
        , runTestEq "myFlip const 1 2 = 2" (2 :: Int) (myFlip const 1 2)`,
    hints: [
      'For <code>myMap</code>: the base case returns an empty list <code>[]</code>. The recursive case applies <code>f</code> to the head and prepends with <code>:</code>.',
      'For <code>myFilter</code>: use <code>if p x then x : myFilter p xs else myFilter p xs</code>. If the predicate is true, include <code>x</code>; otherwise skip it.',
      'For <code>compose</code>: it\'s a three-argument lambda: <code>\\f g x -> f (g x)</code>. Apply <code>g</code> first, then <code>f</code> to the result.',
      'For <code>myFlip</code>: <code>\\f x y -> f y x</code>. You receive the function and both arguments, then call the function with arguments swapped.',
    ],
    concepts: ['map', 'filter', 'composition', 'higher-order-function', 'pattern-matching', 'recursion', 'flip'],
    successPatterns: [
      'myMap\\s+f\\s+\\(x:xs\\)\\s*=\\s*f\\s+x\\s*:',
      'myFilter\\s+p\\s+\\(x:xs\\)',
      'compose\\s*=\\s*\\\\f\\s+g\\s+x\\s*->\\s*f\\s*\\(g\\s+x\\)',
      'myFlip\\s*=\\s*\\\\f\\s+x\\s+y\\s*->\\s*f\\s+y\\s+x',
    ],
    testNames: [
      'myMap (*2) [1,2,3] = [2,4,6]',
      'myMap show [1,2] = ["1","2"]',
      'myMap id [] = [] (empty list)',
      'myFilter even [1..5] = [2,4]',
      'myFilter (>3) [1..5] = [4,5]',
      'myFilter odd [] = [] (empty list)',
      'compose (+1) (*2) 3 = 7',
      'compose not even 3 = True',
      'twice (+3) 0 = 6',
      'twice (*2) 1 = 4',
      'myFlip (-) 3 10 = 7',
      'myFlip const 1 2 = 2',
    ],
  },

  'currying-partial': {
    id: 'currying-partial',
    title: 'Currying: One Argument at a Time',
    difficulty: 'beginner',
    order: 5,
    description: `
<p><strong>Currying</strong> is the process of transforming a function that takes multiple arguments (as a tuple) into a chain of functions that each take one argument. In Haskell, <em>all functions are curried by default</em> &mdash; this is a direct consequence of lambda calculus, where every function takes exactly one argument.</p>

<h3>Curried vs Uncurried</h3>
<p>Consider addition. You could write it two ways:</p>
<pre><code>-- Uncurried: takes a tuple (pair) as a single argument
addUncurried :: (Int, Int) -> Int
addUncurried (x, y) = x + y

-- Curried: takes one argument at a time
addCurried :: Int -> Int -> Int
addCurried x y = x + y</code></pre>
<p>The curried form lets you <strong>partially apply</strong> &mdash; supply some arguments now and the rest later:</p>
<pre><code>addFive :: Int -> Int
addFive = addCurried 5    -- supply just the first argument
addFive 10                -- 15</code></pre>

<h3>curry and uncurry</h3>
<p>Haskell provides <code>curry</code> and <code>uncurry</code> to convert between the two forms:</p>
<pre><code>curry   :: ((a, b) -> c) -> a -> b -> c
uncurry :: (a -> b -> c) -> (a, b) -> c</code></pre>
<p>Think of them as wrapping and unwrapping the tuple:</p>
<pre><code>curry fst 1 2     -- fst takes a tuple, curry lets us pass args separately: 1
uncurry (+) (3, 4) -- (+) takes curried args, uncurry packs them into a tuple: 7</code></pre>

<h3>Partial Application in Practice</h3>
<p>Because functions are curried, you can create specialized versions by supplying some arguments:</p>
<pre><code>double     = map (*2)        -- partially applied map
isPositive = filter (> 0)    -- partially applied filter
addThree   = (+) 3           -- partially applied (+)</code></pre>
<p>Each of these is a new function waiting for its remaining argument(s).</p>

<h3>Three-Argument Functions</h3>
<p>Currying extends to any number of arguments:</p>
<pre><code>add3 :: Int -> Int -> Int -> Int
add3 x y z = x + y + z

-- Partially apply:
add3 1 2 3   -- 6
add3 1 2     -- a function waiting for z
(add3 1 2) 3 -- 6</code></pre>

<h3>Your Task</h3>
<p>Implement <code>myCurry</code>, <code>myUncurry</code>, <code>add3</code>, and <code>addFive</code>. Some questions ask you to predict values, others to write implementations.</p>
`,
    starterCode: `module CurryingPartial where

-- EXERCISE: Implement currying and partial application.

-- 1. myCurry: convert an uncurried function to a curried one.
--    myCurry f x y  =  f (x, y)
--    Example: myCurry fst 1 2 = 1
myCurry :: ((a, b) -> c) -> a -> b -> c
myCurry = error "implement myCurry"

-- 2. myUncurry: convert a curried function to an uncurried one.
--    myUncurry f (x, y)  =  f x y
--    Example: myUncurry (+) (3, 4) = 7
myUncurry :: (a -> b -> c) -> (a, b) -> c
myUncurry = error "implement myUncurry"

-- 3. add3: a curried function that adds three numbers.
--    Example: add3 1 2 3 = 6
add3 :: Int -> Int -> Int -> Int
add3 = error "implement add3"

-- 4. addFive: partially apply add3 with the first two args as 2 and 3.
--    So addFive z = 2 + 3 + z = 5 + z
--    Example: addFive 10 = 15, addFive 20 = 25
addFive :: Int -> Int
addFive = error "implement using partial application of add3"

-- PREDICT: What do these evaluate to?

-- 5. myCurry fst 1 2 = ?
answer5 :: Int
answer5 = error "what does fst (1, 2) return?"

-- 6. myUncurry (+) (3, 4) = ?
answer6 :: Int
answer6 = error "what is 3 + 4?"

-- 7. add3 10 20 30 = ?
answer7 :: Int
answer7 = error "what is 10 + 20 + 30?"

-- 8. addFive 30 = ?
--    Remember: addFive = add3 2 3, so addFive 30 = 2 + 3 + 30
answer8 :: Int
answer8 = error "what is 2 + 3 + 30?"
`,
    solutionCode: `module CurryingPartial where

myCurry :: ((a, b) -> c) -> a -> b -> c
myCurry = \\f x y -> f (x, y)

myUncurry :: (a -> b -> c) -> (a, b) -> c
myUncurry = \\f (x, y) -> f x y

add3 :: Int -> Int -> Int -> Int
add3 = \\x y z -> x + y + z

addFive :: Int -> Int
addFive = add3 2 3

answer5 :: Int
answer5 = 1

answer6 :: Int
answer6 = 7

answer7 :: Int
answer7 = 60

answer8 :: Int
answer8 = 35
`,
    testCode: `runTestEq "myCurry fst 1 2 = 1" (1 :: Int) (myCurry fst 1 2)
        , runTestEq "myCurry snd 1 2 = 2" (2 :: Int) (myCurry snd 1 2)
        , runTestEq "myCurry (uncurry (+)) 3 4 = 7" (7 :: Int) (myCurry (uncurry (+)) 3 4)
        , runTestEq "myUncurry (+) (3,4) = 7" (7 :: Int) (myUncurry (+) (3, 4))
        , runTestEq "myUncurry (*) (5,6) = 30" (30 :: Int) (myUncurry (*) (5, 6))
        , runTestEq "myUncurry const (a,b) = a" "a" (myUncurry const ("a", "b"))
        , runTestEq "add3 1 2 3 = 6" (6 :: Int) (add3 1 2 3)
        , runTestEq "add3 10 20 30 = 60" (60 :: Int) (add3 10 20 30)
        , runTestEq "addFive 10 = 15" (15 :: Int) (addFive 10)
        , runTestEq "addFive 20 = 25" (25 :: Int) (addFive 20)
        , runTestEq "predict: myCurry fst 1 2 = 1" (1 :: Int) answer5
        , runTestEq "predict: myUncurry (+) (3,4) = 7" (7 :: Int) answer6
        , runTestEq "predict: add3 10 20 30 = 60" (60 :: Int) answer7
        , runTestEq "predict: addFive 30 = 35" (35 :: Int) answer8`,
    hints: [
      'For <code>myCurry</code>: you receive a function <code>f</code> that expects a tuple, and two separate arguments <code>x</code> and <code>y</code>. Pack them into a tuple and call <code>f</code>: <code>\\f x y -> f (x, y)</code>.',
      'For <code>myUncurry</code>: you receive a curried function <code>f</code> and a tuple <code>(x, y)</code>. Unpack the tuple and pass the elements separately: <code>\\f (x, y) -> f x y</code>.',
      'For <code>addFive</code>: use partial application! <code>add3 2 3</code> supplies the first two arguments, leaving a function that waits for the third.',
      'For the predictions: <code>fst (1, 2) = 1</code>, <code>3 + 4 = 7</code>, <code>10 + 20 + 30 = 60</code>, and <code>2 + 3 + 30 = 35</code>.',
    ],
    concepts: ['currying', 'uncurrying', 'partial-application', 'tuple', 'curry', 'uncurry', 'multi-argument'],
    successPatterns: [
      'myCurry\\s*=\\s*\\\\f\\s+x\\s+y\\s*->\\s*f\\s*\\(x\\s*,\\s*y\\)',
      'myUncurry\\s*=\\s*\\\\f\\s*\\(x\\s*,\\s*y\\)\\s*->\\s*f\\s+x\\s+y',
      'addFive\\s*=\\s*add3\\s+2\\s+3',
      'answer5\\s*=\\s*1',
    ],
    testNames: [
      'myCurry fst 1 2 = 1',
      'myCurry snd 1 2 = 2',
      'myCurry (uncurry (+)) 3 4 = 7',
      'myUncurry (+) (3,4) = 7',
      'myUncurry (*) (5,6) = 30',
      'myUncurry const ("a","b") = "a"',
      'add3 1 2 3 = 6',
      'add3 10 20 30 = 60',
      'addFive 10 = 15',
      'addFive 20 = 25',
      'predict: myCurry fst 1 2 = 1',
      'predict: myUncurry (+) (3,4) = 7',
      'predict: add3 10 20 30 = 60',
      'predict: addFive 30 = 35',
    ],
  },
};
