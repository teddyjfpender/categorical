import type { Exercise } from './types/exercise';

// ────────────────────────────────────────────────────────────────────
// Exercise Registry
//
// Exercises are grouped by module and ordered for progressive learning.
// Each exercise builds on what the previous one taught — no gaps.
//
// Reading Haskell module (5 exercises):
//   1. reading-values          — types, literals, basic list/bool/string ops
//   2. reading-expressions     — precedence, if-then-else, comparison, div/mod
//   3. reading-functions       — function defs, substitution, where clauses
//   4. reading-types           — :: notation, ->, counting args, partial application
//   5. function-application    — f x syntax, $, sections, map/filter
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
//
// Compiler & Language Theory module (5 exercises):
//   1. parser-type             — Parser newtype, Functor, charP, stringP
//   2. parser-combinators      — Applicative, Monad, orElse, many, some, natP
//   3. expression-parser       — Expr AST, operator precedence, chainl1
//   4. ast-evaluator           — eval, evalWithVars with Maybe monad
//   5. interpreter             — let bindings, variables, parse-then-eval pipeline
//
// Lambda Calculus II: Church Encodings module (5 exercises):
//   1. church-booleans         — Church booleans, NOT/AND/OR at concrete Bool type
//   2. church-numerals         — Church numerals, successor, add, mul
//   3. church-pairs-maybe      — Church pairs (fst/snd) and Church Maybe
//   4. reduction-strategies    — lazy vs strict, WHNF, thunks, predict-the-answer
//   5. fixpoint-recursion      — fix combinator, factorial/fibonacci via fix
//
// Lambda Calculus III: Types & Interpreters module (4 exercises):
//   1. curry-howard            — Curry-Howard correspondence, types as propositions
//   2. cps-transform           — continuation-passing style, CPS Fibonacci
//   3. lambda-ast              — Term ADT, freeVars, substitute, step
//   4. lambda-interpreter      — normalize, Church numerals as Terms, omega
// ────────────────────────────────────────────────────────────────────

const exercises: Record<string, Exercise> = {

  // ═══════════════════════════════════════════════════════════════════
  // READING HASKELL MODULE
  // ═══════════════════════════════════════════════════════════════════

  'reading-values': {
    id: 'reading-values',
    title: 'Values and Their Types',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>Before writing Haskell, let's learn to <strong>read</strong> it. In this exercise you'll look at expressions and predict what they evaluate to.</p>

<h3>Basic Types and Literal Values</h3>
<p>Every value in Haskell has a type. Here are the building blocks:</p>
<table>
  <thead><tr><th>Type</th><th>Example Values</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><code>Int</code></td><td><code>42</code>, <code>-7</code>, <code>0</code></td><td>Whole numbers</td></tr>
    <tr><td><code>Double</code></td><td><code>3.14</code>, <code>2.0</code></td><td>Decimal numbers</td></tr>
    <tr><td><code>Bool</code></td><td><code>True</code>, <code>False</code></td><td>Exactly two values (capitalized!)</td></tr>
    <tr><td><code>Char</code></td><td><code>'a'</code>, <code>'Z'</code>, <code>'3'</code></td><td>Single quotes for one character</td></tr>
    <tr><td><code>String</code></td><td><code>"hello"</code>, <code>"Hi!"</code></td><td>Double quotes — really <code>[Char]</code> (a list of characters)</td></tr>
    <tr><td><code>[Int]</code></td><td><code>[1, 2, 3]</code></td><td>A list of integers</td></tr>
  </tbody>
</table>

<h3>Basic Operations</h3>
<table>
  <thead><tr><th>Operation</th><th>What It Does</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>length xs</code></td><td>Number of elements in a list</td><td><code>length [10, 20, 30]</code> gives <code>3</code></td></tr>
    <tr><td><code>head xs</code></td><td>First element of a list</td><td><code>head [5, 10, 15]</code> gives <code>5</code></td></tr>
    <tr><td><code>tail xs</code></td><td>Everything after the first element</td><td><code>tail [5, 10, 15]</code> gives <code>[10, 15]</code></td></tr>
    <tr><td><code>xs !! n</code></td><td>Element at index n (0-based)</td><td><code>[1, 2, 3] !! 0</code> gives <code>1</code></td></tr>
    <tr><td><code>xs ++ ys</code></td><td>Concatenate two lists (or strings)</td><td><code>[1, 2] ++ [3]</code> gives <code>[1, 2, 3]</code></td></tr>
    <tr><td><code>not b</code></td><td>Boolean negation</td><td><code>not True</code> gives <code>False</code></td></tr>
    <tr><td><code>&&</code></td><td>Boolean AND</td><td><code>True && False</code> gives <code>False</code></td></tr>
    <tr><td><code>||</code></td><td>Boolean OR</td><td><code>True || False</code> gives <code>True</code></td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Read each expression and replace <code>error "..."</code> with the value you think it evaluates to. This is a "predict the answer" exercise — no function writing required!</p>
`,
    starterCode: `module ReadingValues where

-- EXERCISE: Read each expression and write what it evaluates to.
-- Replace each \`error "..."\` with the correct value.

-- 1. What does length [10, 20, 30] evaluate to?
answer1 :: Int
answer1 = error "how many elements in the list?"

-- 2. What does head [5, 10, 15] evaluate to?
answer2 :: Int
answer2 = error "what is the first element?"

-- 3. What does [1, 2, 3] ++ [4, 5] evaluate to?
answer3 :: [Int]
answer3 = error "what list do you get?"

-- 4. What does not False evaluate to?
answer4 :: Bool
answer4 = error "True or False?"

-- 5. What does True && False evaluate to?
answer5 :: Bool
answer5 = error "True or False?"

-- 6. What does "Hello" ++ " " ++ "World" evaluate to?
answer6 :: String
answer6 = error "what string do you get?"

-- 7. What does [1, 2, 3] !! 2 evaluate to?
--    !! is the indexing operator (0-based: !! 0 is first, !! 1 is second, etc.)
answer7 :: Int
answer7 = error "what is at index 2?"

-- 8. What does head "abc" evaluate to?
--    Remember: String = [Char], so head gives the first character.
answer8 :: Char
answer8 = error "what is the first character?"
`,
    solutionCode: `module ReadingValues where

answer1 :: Int
answer1 = 3

answer2 :: Int
answer2 = 5

answer3 :: [Int]
answer3 = [1, 2, 3, 4, 5]

answer4 :: Bool
answer4 = True

answer5 :: Bool
answer5 = False

answer6 :: String
answer6 = "Hello World"

answer7 :: Int
answer7 = 3

answer8 :: Char
answer8 = 'a'
`,
    testCode: `runTestEq "length [10,20,30]" (3 :: Int) answer1
        , runTestEq "head [5,10,15]" (5 :: Int) answer2
        , runTestEq "[1,2,3]++[4,5]" [1,2,3,4,5 :: Int] answer3
        , runTestEq "not False" True answer4
        , runTestEq "True && False" False answer5
        , runTestEq "concat strings" "Hello World" answer6
        , runTestEq "[1,2,3] !! 2" (3 :: Int) answer7
        , runTestEq "head abc" 'a' answer8`,
    hints: [
      'For <code>length</code>, just count the elements between the brackets: <code>[10, 20, 30]</code> has three elements.',
      'For <code>head</code>, it returns the <strong>first</strong> element. <code>head [5, 10, 15]</code> gives <code>5</code>.',
      'The <code>!!</code> operator is 0-based: index 0 is the first element, index 1 is the second, index 2 is the third.',
      'Remember that <code>String</code> is just <code>[Char]</code>, so <code>head "abc"</code> returns a <code>Char</code> — use single quotes: <code>\'a\'</code>.',
    ],
    concepts: ['types', 'literals', 'lists', 'Bool', 'Char', 'String', 'length', 'head', 'indexing', 'concatenation'],
    successPatterns: [
      'answer1\\s*=\\s*3',
      'answer4\\s*=\\s*True',
      'answer6.*Hello World',
    ],
    testNames: [
      'length [10,20,30] evaluates to 3',
      'head [5,10,15] evaluates to 5',
      '[1,2,3]++[4,5] evaluates to [1,2,3,4,5]',
      'not False evaluates to True',
      'True && False evaluates to False',
      '"Hello" ++ " " ++ "World" evaluates to "Hello World"',
      '[1,2,3] !! 2 evaluates to 3',
      'head "abc" evaluates to \'a\'',
    ],
  },

  'reading-expressions': {
    id: 'reading-expressions',
    title: 'Reading Expressions',
    difficulty: 'beginner',
    order: 2,
    description: `
<p>Now that you know the basic types, let's practice reading more complex expressions. You'll learn about operator precedence, conditionals, and comparison.</p>

<h3>Operator Precedence</h3>
<p>Just like in math, <code>*</code> and <code>/</code> bind tighter than <code>+</code> and <code>-</code>:</p>
<pre><code>3 + 4 * 2   -- evaluates to 11 (not 14!)
(3 + 4) * 2 -- evaluates to 14 (parens override)</code></pre>

<h3>Integer Division and Remainder</h3>
<p>Haskell uses <code>div</code> and <code>mod</code> for integer arithmetic (written with backticks to use as infix operators):</p>
<pre><code>10 \`div\` 3  -- evaluates to 3  (integer division)
10 \`mod\` 3  -- evaluates to 1  (remainder)</code></pre>

<h3>If-Then-Else</h3>
<p>In Haskell, <code>if</code> is an <strong>expression</strong> that returns a value — not a statement:</p>
<pre><code>if True then "yes" else "no"   -- evaluates to "yes"
if 5 > 3 then 100 else 0       -- evaluates to 100</code></pre>
<p>Both branches must return the same type, and the <code>else</code> is mandatory.</p>

<h3>Comparison Operators</h3>
<table>
  <thead><tr><th>Operator</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>></code></td><td>Greater than</td><td><code>5 > 3</code> is <code>True</code></td></tr>
    <tr><td><code><</code></td><td>Less than</td><td><code>5 < 3</code> is <code>False</code></td></tr>
    <tr><td><code>>=</code></td><td>Greater or equal</td><td><code>3 >= 3</code> is <code>True</code></td></tr>
    <tr><td><code><=</code></td><td>Less or equal</td><td><code>3 <= 5</code> is <code>True</code></td></tr>
    <tr><td><code>==</code></td><td>Equal</td><td><code>3 == 3</code> is <code>True</code></td></tr>
    <tr><td><code>/=</code></td><td>Not equal</td><td><code>3 /= 4</code> is <code>True</code></td></tr>
  </tbody>
</table>

<h3>Useful Functions</h3>
<ul>
  <li><code>even n</code> — returns <code>True</code> if <code>n</code> is divisible by 2</li>
  <li><code>max x y</code> — returns the larger of <code>x</code> and <code>y</code></li>
  <li><code>min x y</code> — returns the smaller of <code>x</code> and <code>y</code></li>
  <li><code>succ n</code> — returns <code>n + 1</code> (the successor)</li>
</ul>

<h3>Your Task</h3>
<p>Predict what each expression evaluates to. Work through the precedence and logic step by step.</p>
`,
    starterCode: `module ReadingExpressions where

-- EXERCISE: Predict what each expression evaluates to.

-- 1. What does 3 + 4 * 2 evaluate to?
--    Hint: * binds tighter than + (same as math)
answer1 :: Int
answer1 = error "?"

-- 2. What does (3 + 4) * 2 evaluate to?
answer2 :: Int
answer2 = error "?"

-- 3. What does 10 \`div\` 3 evaluate to?
--    div is integer division (rounds toward negative infinity)
answer3 :: Int
answer3 = error "?"

-- 4. What does 10 \`mod\` 3 evaluate to?
answer4 :: Int
answer4 = error "?"

-- 5. What does if 5 > 3 then "yes" else "no" evaluate to?
answer5 :: String
answer5 = error "?"

-- 6. What does if even 4 then 100 else 0 evaluate to?
--    \`even\` returns True if a number is divisible by 2
answer6 :: Int
answer6 = error "?"

-- 7. What does not (3 > 5) evaluate to?
answer7 :: Bool
answer7 = error "?"

-- 8. What does max 10 20 evaluate to?
--    max takes two arguments and returns the larger
answer8 :: Int
answer8 = error "?"

-- 9. What does min 10 20 evaluate to?
answer9 :: Int
answer9 = error "?"

-- 10. What does succ 7 evaluate to?
--     succ returns the successor (next number)
answer10 :: Int
answer10 = error "?"
`,
    solutionCode: `module ReadingExpressions where

answer1 :: Int
answer1 = 11

answer2 :: Int
answer2 = 14

answer3 :: Int
answer3 = 3

answer4 :: Int
answer4 = 1

answer5 :: String
answer5 = "yes"

answer6 :: Int
answer6 = 100

answer7 :: Bool
answer7 = True

answer8 :: Int
answer8 = 20

answer9 :: Int
answer9 = 10

answer10 :: Int
answer10 = 8
`,
    testCode: `runTestEq "3 + 4 * 2" (11 :: Int) answer1
        , runTestEq "(3 + 4) * 2" (14 :: Int) answer2
        , runTestEq "10 div 3" (3 :: Int) answer3
        , runTestEq "10 mod 3" (1 :: Int) answer4
        , runTestEq "if 5 > 3 then yes else no" "yes" answer5
        , runTestEq "if even 4 then 100 else 0" (100 :: Int) answer6
        , runTestEq "not (3 > 5)" True answer7
        , runTestEq "max 10 20" (20 :: Int) answer8
        , runTestEq "min 10 20" (10 :: Int) answer9
        , runTestEq "succ 7" (8 :: Int) answer10`,
    hints: [
      'Remember precedence: <code>3 + 4 * 2</code> is <code>3 + (4 * 2)</code> = <code>3 + 8</code> = <code>11</code>.',
      '<code>div</code> is integer division. <code>10 `div` 3</code> = <code>3</code> because 3 * 3 = 9 with remainder 1.',
      '<code>if</code> is an expression: <code>if True then x else y</code> evaluates to <code>x</code>. Check whether the condition is <code>True</code> or <code>False</code> first.',
      '<code>succ</code> returns the next number: <code>succ 7</code> = <code>8</code>. Think of it as adding 1.',
    ],
    concepts: ['precedence', 'arithmetic', 'if-then-else', 'comparison', 'div', 'mod', 'even', 'max', 'min', 'succ'],
    successPatterns: [
      'answer1\\s*=\\s*11',
      'answer5\\s*=\\s*"yes"',
      'answer7\\s*=\\s*True',
    ],
    testNames: [
      '3 + 4 * 2 evaluates to 11',
      '(3 + 4) * 2 evaluates to 14',
      '10 `div` 3 evaluates to 3',
      '10 `mod` 3 evaluates to 1',
      'if 5 > 3 then "yes" else "no" evaluates to "yes"',
      'if even 4 then 100 else 0 evaluates to 100',
      'not (3 > 5) evaluates to True',
      'max 10 20 evaluates to 20',
      'min 10 20 evaluates to 10',
      'succ 7 evaluates to 8',
    ],
  },

  'reading-functions': {
    id: 'reading-functions',
    title: 'Reading Function Definitions',
    difficulty: 'beginner',
    order: 3,
    description: `
<p>Now let's learn to read function definitions. The key skill is <strong>substitution</strong> — replacing parameters with actual values to evaluate a function call.</p>

<h3>Function Definition Syntax</h3>
<p>A function definition looks like this:</p>
<pre><code>double x = x * 2</code></pre>
<p>Read it as: "<code>double</code> of <code>x</code> is defined as <code>x * 2</code>."</p>

<h3>Substitution (Mental Evaluation)</h3>
<p>To evaluate <code>double 5</code>, replace every <code>x</code> in the body with <code>5</code>:</p>
<pre><code>double 5
= 5 * 2      -- substituted x = 5
= 10</code></pre>

<h3>Multiple Arguments</h3>
<pre><code>add x y = x + y</code></pre>
<p>To evaluate <code>add 3 7</code>, substitute <code>x = 3</code> and <code>y = 7</code>:</p>
<pre><code>add 3 7
= 3 + 7      -- substituted x = 3, y = 7
= 10</code></pre>

<h3>Nested Calls</h3>
<p>For <code>double (double 3)</code>, evaluate from the inside out:</p>
<pre><code>double (double 3)
= double (3 * 2)    -- inner call: x = 3
= double 6
= 6 * 2             -- outer call: x = 6
= 12</code></pre>

<h3>Where Clauses</h3>
<p>A <code>where</code> block defines local helper values:</p>
<pre><code>discount price percent = price - saving
  where saving = price * percent / 100</code></pre>
<p>To evaluate <code>discount 200 10</code>: first compute <code>saving = 200 * 10 / 100 = 20</code>, then <code>200 - 20 = 180</code>.</p>

<h3>Your Task</h3>
<p>The functions below are given to you. Read each one, then predict what the function calls evaluate to using substitution.</p>
`,
    starterCode: `module ReadingFunctions where

-- These functions are GIVEN. Read them carefully.

double :: Int -> Int
double x = x * 2

add :: Int -> Int -> Int
add x y = x + y

greet :: String -> String
greet name = "Hi, " ++ name ++ "!"

bigger :: Int -> Int -> Int
bigger x y = if x > y then x else y

discount :: Double -> Double -> Double
discount price percent = price - saving
  where saving = price * percent / 100

-- EXERCISE: Predict what each function call returns.

-- 1. What does \`double 7\` evaluate to?
answer1 :: Int
answer1 = error "substitute x = 7 into x * 2"

-- 2. What does \`double (double 3)\` evaluate to?
--    Hint: evaluate the inner call first.
answer2 :: Int
answer2 = error "double 3 = ?, then double that"

-- 3. What does \`add 10 20\` evaluate to?
answer3 :: Int
answer3 = error "substitute x=10, y=20 into x + y"

-- 4. What does \`greet "Ada"\` evaluate to?
answer4 :: String
answer4 = error "substitute name = Ada"

-- 5. What does \`bigger 5 3\` evaluate to?
answer5 :: Int
answer5 = error "which is bigger?"

-- 6. What does \`bigger 2 2\` evaluate to?
--    Hint: what happens when they're equal?
answer6 :: Int
answer6 = error "is 2 > 2?"

-- 7. What does \`discount 100 25\` evaluate to?
--    Hint: saving = 100 * 25 / 100 = 25. Then 100 - 25 = ?
answer7 :: Double
answer7 = error "compute the discount"

-- 8. What does \`add (double 3) (double 4)\` evaluate to?
--    Evaluate each argument first, then add them.
answer8 :: Int
answer8 = error "double 3 = ?, double 4 = ?, add them"
`,
    solutionCode: `module ReadingFunctions where

double :: Int -> Int
double x = x * 2

add :: Int -> Int -> Int
add x y = x + y

greet :: String -> String
greet name = "Hi, " ++ name ++ "!"

bigger :: Int -> Int -> Int
bigger x y = if x > y then x else y

discount :: Double -> Double -> Double
discount price percent = price - saving
  where saving = price * percent / 100

answer1 :: Int
answer1 = 14

answer2 :: Int
answer2 = 12

answer3 :: Int
answer3 = 30

answer4 :: String
answer4 = "Hi, Ada!"

answer5 :: Int
answer5 = 5

answer6 :: Int
answer6 = 2

answer7 :: Double
answer7 = 75.0

answer8 :: Int
answer8 = 14
`,
    testCode: `runTestEq "double 7" (14 :: Int) answer1
        , runTestEq "double (double 3)" (12 :: Int) answer2
        , runTestEq "add 10 20" (30 :: Int) answer3
        , runTestEq "greet Ada" "Hi, Ada!" answer4
        , runTestEq "bigger 5 3" (5 :: Int) answer5
        , runTestEq "bigger 2 2" (2 :: Int) answer6
        , runTestEq "discount 100 25" (75.0 :: Double) answer7
        , runTestEq "add (double 3) (double 4)" (14 :: Int) answer8`,
    hints: [
      'For <code>double 7</code>: substitute <code>x = 7</code> into <code>x * 2</code> to get <code>7 * 2 = 14</code>.',
      'For <code>double (double 3)</code>: first <code>double 3 = 6</code>, then <code>double 6 = 12</code>.',
      'For <code>bigger 2 2</code>: the condition is <code>2 > 2</code> which is <code>False</code>, so we take the <code>else</code> branch and return <code>y</code> = <code>2</code>.',
      'For <code>discount 100 25</code>: <code>saving = 100 * 25 / 100 = 25</code>, then <code>100 - 25 = 75.0</code>.',
    ],
    concepts: ['function-definitions', 'substitution', 'evaluation', 'where-clauses', 'nested-calls'],
    successPatterns: [
      'answer1\\s*=\\s*14',
      'answer4.*Hi, Ada!',
      'answer7\\s*=\\s*75',
    ],
    testNames: [
      'double 7 evaluates to 14',
      'double (double 3) evaluates to 12',
      'add 10 20 evaluates to 30',
      'greet "Ada" evaluates to "Hi, Ada!"',
      'bigger 5 3 evaluates to 5',
      'bigger 2 2 evaluates to 2',
      'discount 100 25 evaluates to 75.0',
      'add (double 3) (double 4) evaluates to 14',
    ],
  },

  'reading-types': {
    id: 'reading-types',
    title: 'Reading Type Signatures',
    difficulty: 'beginner',
    order: 4,
    description: `
<p>Type signatures are Haskell's way of documenting what a function expects and returns. Learning to read them is one of the most valuable Haskell skills.</p>

<h3>The <code>::</code> Symbol</h3>
<p><code>::</code> is read as "has type":</p>
<pre><code>not :: Bool -> Bool</code></pre>
<p>Read: "<code>not</code> has type <code>Bool -> Bool</code>" — it takes a <code>Bool</code> and returns a <code>Bool</code>.</p>

<h3>Arrows Separate Arguments from Return Type</h3>
<pre><code>add :: Int -> Int -> Int</code></pre>
<p>Read left to right: "takes an <code>Int</code>, takes another <code>Int</code>, returns an <code>Int</code>."</p>
<p>The number of <code>-></code> arrows tells you the maximum number of arguments:</p>
<ul>
  <li><code>Bool -> Bool</code> — 1 arrow = 1 argument</li>
  <li><code>Int -> Int -> Int</code> — 2 arrows = 2 arguments</li>
  <li><code>(a -> b) -> [a] -> [b]</code> — 2 top-level arrows = 2 arguments</li>
</ul>

<h3>Parentheses in Types</h3>
<p>Parentheses group types. In <code>map :: (a -> b) -> [a] -> [b]</code>:</p>
<ul>
  <li>The first argument has type <code>(a -> b)</code> — a <strong>function</strong> from <code>a</code> to <code>b</code></li>
  <li>The second argument has type <code>[a]</code> — a list of <code>a</code></li>
  <li>The return type is <code>[b]</code> — a list of <code>b</code></li>
</ul>
<p>The arrow inside parens doesn't count as a top-level arrow — it describes the <em>type</em> of the first argument.</p>

<h3>The Two Arrows: <code>-></code> vs <code>=></code></h3>
<p>Haskell has <strong>two</strong> different arrows in type signatures. Don't confuse them:</p>
<table>
  <thead><tr><th>Arrow</th><th>Name</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>-></code></td><td>Function arrow</td><td>Separates arguments from return type</td><td><code>Int -> Bool</code></td></tr>
    <tr><td><code>=></code></td><td>Constraint arrow</td><td>Separates a <em>requirement</em> from the actual type</td><td><code>Show a => a -> String</code></td></tr>
  </tbody>
</table>

<h3>Reading <code>=></code> (the Fat Arrow)</h3>
<p>The <code>=></code> arrow means "given that" or "as long as." Everything <strong>before</strong> <code>=></code> is a <em>constraint</em> (a requirement). Everything <strong>after</strong> is the actual function type. For example:</p>
<pre><code>show :: Show a => a -> String
--      ^^^^^^^^    ^^^^^^^^^^^
--      constraint  actual type
--      "as long    "takes an a,
--       as a has    returns a
--       Show"       String"</code></pre>
<p>Read this aloud: "show takes any type <code>a</code> <strong>as long as</strong> <code>a</code> has <code>Show</code>, and returns a <code>String</code>."</p>

<p>The constraint doesn't add an argument — it's a <em>requirement</em> on the type variable. When reading the type, <strong>skip everything before <code>=></code></strong> to find the function's actual argument and return types:</p>
<pre><code>show :: Show a => a -> String
-- Skip "Show a =>" → actual type is "a -> String"
-- So: 1 argument (a), returns String</code></pre>

<p>More examples:</p>
<pre><code>(+)  :: Num a  => a -> a -> a    -- "for any numeric type, takes two a's, returns an a"
(==) :: Eq a   => a -> a -> Bool  -- "for any comparable type, takes two a's, returns Bool"
sort :: Ord a  => [a] -> [a]      -- "for any orderable type, takes a list, returns a list"</code></pre>

<h3>The Big Insight: Partial Application</h3>
<p><code>-></code> is right-associative, so <code>add :: Int -> Int -> Int</code> really means:</p>
<pre><code>add :: Int -> (Int -> Int)</code></pre>
<p>This means <code>add 3</code> (called with just one argument) returns a <strong>function</strong> of type <code>Int -> Int</code>! This function adds 3 to whatever you give it. This is called <em>partial application</em>.</p>

<h3>Your Task</h3>
<p>Answer questions about type signatures by writing constant values.</p>
`,
    starterCode: `module ReadingTypes where

-- EXERCISE: Answer questions about type signatures.
-- Write your answers as shown.

-- Given: not :: Bool -> Bool
-- 1. How many arguments does \`not\` take?
answer1 :: Int
answer1 = error "count the arrows"

-- Given: add :: Int -> Int -> Int
-- 2. How many arguments does \`add\` take?
answer2 :: Int
answer2 = error "count the arrows"

-- Given: show :: Show a => a -> String
-- 3. What type does \`show True\` return?
--    Remember: skip the constraint (Show a =>) and read the actual type.
--    The actual type is: a -> String
--    So show takes an \`a\` and returns a...?
answer3 :: String
answer3 = error "what type does show return?"

-- Given: map :: (a -> b) -> [a] -> [b]
-- 4. How many arguments does \`map\` take?
answer4 :: Int
answer4 = error "count top-level arrows"

-- 5. The first argument of \`map\` has type (a -> b).
--    What kind of thing is (a -> b)?
--    Write "function" or "value"
answer5 :: String
answer5 = error "function or value?"

-- Given: add :: Int -> Int -> Int
-- 6. If you call \`add 3\` (one argument instead of two),
--    what type does the result have?
--    Write the type as a String.
answer6 :: String
answer6 = error "what type is add 3?"

-- Given: filter :: (a -> Bool) -> [a] -> [a]
--                   ^^^^^^^^^
--                   first argument (a function!)
-- 7. How many arguments does \`filter\` take?
--    Hint: count the top-level -> arrows (not the one inside the parens).
answer7 :: Int
answer7 = error "count top-level arrows"

-- 8. Look at filter's FIRST argument: (a -> Bool).
--    This is a function that takes an \`a\` and returns a... what?
--    Write just the return type of that inner function.
answer8 :: String
answer8 = error "look at what's after -> inside the parens"
`,
    solutionCode: `module ReadingTypes where

answer1 :: Int
answer1 = 1

answer2 :: Int
answer2 = 2

answer3 :: String
answer3 = "String"

answer4 :: Int
answer4 = 2

answer5 :: String
answer5 = "function"

answer6 :: String
answer6 = "Int -> Int"

answer7 :: Int
answer7 = 2

answer8 :: String
answer8 = "Bool"
`,
    testCode: `runTestEq "not takes 1 arg" (1 :: Int) answer1
        , runTestEq "add takes 2 args" (2 :: Int) answer2
        , runTestEq "show True returns String" "String" answer3
        , runTestEq "map takes 2 args" (2 :: Int) answer4
        , runTestEq "(a -> b) is a function" "function" answer5
        , runTestEq "add 3 has type Int -> Int" "Int -> Int" answer6
        , runTestEq "filter takes 2 args" (2 :: Int) answer7
        , runTestEq "predicate returns Bool" "Bool" answer8`,
    hints: [
      'Count only the <strong>top-level</strong> <code>-></code> arrows (not <code>=></code>). The <code>=></code> arrow is a constraint, not an argument separator. In <code>Show a => a -> String</code>, there is 1 top-level <code>-></code>, so 1 argument.',
      'When you see <code>=></code>, skip everything before it. <code>show :: Show a => a -> String</code> — the actual type is <code>a -> String</code>. So <code>show</code> takes one argument and returns a <code>String</code>.',
      'Partial application: <code>add :: Int -> (Int -> Int)</code>. Applying one argument peels off one layer: <code>add 3 :: Int -> Int</code>.',
      'The predicate in <code>filter :: (a -> Bool) -> [a] -> [a]</code> has type <code>(a -> Bool)</code> — it returns <code>Bool</code>.',
    ],
    concepts: ['type-signatures', 'arrows', 'partial-application', 'higher-order-types', 'reading-types'],
    successPatterns: [
      'answer1\\s*=\\s*1',
      'answer5\\s*=\\s*"function"',
      'answer6.*Int -> Int',
    ],
    testNames: [
      'not takes 1 argument',
      'add takes 2 arguments',
      'show True returns String',
      'map takes 2 arguments',
      '(a -> b) is a function',
      'add 3 has type Int -> Int',
      'filter takes 2 arguments',
      'predicate returns Bool',
    ],
  },

  'function-application': {
    id: 'function-application',
    title: 'Calling Functions',
    difficulty: 'beginner',
    order: 5,
    description: `
<p>Haskell's function call syntax is different from most languages. Mastering it is essential for reading any Haskell code.</p>

<h3>No Parentheses for Arguments</h3>
<p>In Haskell, you apply a function by writing it next to its argument, separated by a space:</p>
<pre><code>double 5       -- applies double to 5 (result: 10)
add 3 4        -- applies add to 3 and 4 (result: 7)</code></pre>
<p>Compare with other languages: <code>double(5)</code> and <code>add(3, 4)</code>. In Haskell, spaces replace parentheses and commas.</p>

<h3>Parentheses for Grouping</h3>
<p>Use parentheses when an argument is itself a complex expression:</p>
<pre><code>double (add 3 4)   -- first: add 3 4 = 7, then: double 7 = 14
add 3 (double 2)   -- first: double 2 = 4, then: add 3 4 = 7</code></pre>
<p>Without parens, <code>double add 3 4</code> would try to apply <code>double</code> to <code>add</code> — which is wrong!</p>

<h3>The <code>$</code> Operator</h3>
<p><code>$</code> is a way to avoid parentheses. It means "evaluate everything to the right first":</p>
<pre><code>double $ add 3 4    -- same as double (add 3 4)
square $ double 3   -- same as square (double 3)</code></pre>

<h3>Operators in Prefix Form</h3>
<p>Wrap an operator in parens to use it like a function:</p>
<pre><code>(+) 3 4     -- same as 3 + 4 = 7
(*) 5 6     -- same as 5 * 6 = 30</code></pre>

<h3>Sections (Partial Operators)</h3>
<p>Supply one argument to an operator to create a function:</p>
<pre><code>(*2) 7      -- a function that multiplies by 2: result 14
(3+) 10     -- a function that adds 3: result 13
(>5)        -- a function that checks if something is > 5</code></pre>

<h3>Map and Filter</h3>
<p><code>map f xs</code> applies function <code>f</code> to every element of list <code>xs</code>:</p>
<pre><code>map double [1, 2, 3]   -- [2, 4, 6]</code></pre>
<p><code>filter p xs</code> keeps elements where predicate <code>p</code> returns <code>True</code>:</p>
<pre><code>filter even [1, 2, 3, 4]   -- [2, 4]</code></pre>

<h3>Your Task</h3>
<p>Predict what each expression evaluates to.</p>
`,
    starterCode: `module FunctionApplication where

-- Helpers (given, don't modify)
double :: Int -> Int
double x = x * 2

add :: Int -> Int -> Int
add x y = x + y

square :: Int -> Int
square x = x * x

-- EXERCISE: Predict what each expression evaluates to.

-- 1. double 5
answer1 :: Int
answer1 = error "?"

-- 2. add 3 (double 2)
--    Evaluate the argument in parens first: double 2 = ?
answer2 :: Int
answer2 = error "?"

-- 3. square $ double 3
--    $ means: evaluate the right side first, pass to the left
--    double 3 = ?, then square that
answer3 :: Int
answer3 = error "?"

-- 4. double $ add 3 4
answer4 :: Int
answer4 = error "?"

-- 5. (+) 10 20
--    An operator in prefix form: (+) x y = x + y
answer5 :: Int
answer5 = error "?"

-- 6. (*2) 7
--    A "section": (*2) is a function that multiplies by 2
answer6 :: Int
answer6 = error "?"

-- 7. (3+) 10
--    A left section: (3+) is a function that adds 3
answer7 :: Int
answer7 = error "?"

-- 8. map double [1, 2, 3]
--    map applies a function to every element
answer8 :: [Int]
answer8 = error "?"

-- 9. filter even [1, 2, 3, 4, 5]
--    filter keeps elements where the function returns True
answer9 :: [Int]
answer9 = error "?"

-- 10. map (*3) (filter even [1, 2, 3, 4, 5])
--     First filter, then map over the result
answer10 :: [Int]
answer10 = error "?"
`,
    solutionCode: `module FunctionApplication where

double :: Int -> Int
double x = x * 2

add :: Int -> Int -> Int
add x y = x + y

square :: Int -> Int
square x = x * x

answer1 :: Int
answer1 = 10

answer2 :: Int
answer2 = 7

answer3 :: Int
answer3 = 36

answer4 :: Int
answer4 = 14

answer5 :: Int
answer5 = 30

answer6 :: Int
answer6 = 14

answer7 :: Int
answer7 = 13

answer8 :: [Int]
answer8 = [2, 4, 6]

answer9 :: [Int]
answer9 = [2, 4]

answer10 :: [Int]
answer10 = [6, 12]
`,
    testCode: `runTestEq "double 5" (10 :: Int) answer1
        , runTestEq "add 3 (double 2)" (7 :: Int) answer2
        , runTestEq "square $ double 3" (36 :: Int) answer3
        , runTestEq "double $ add 3 4" (14 :: Int) answer4
        , runTestEq "(+) 10 20" (30 :: Int) answer5
        , runTestEq "(*2) 7" (14 :: Int) answer6
        , runTestEq "(3+) 10" (13 :: Int) answer7
        , runTestEq "map double [1,2,3]" [2,4,6 :: Int] answer8
        , runTestEq "filter even [1..5]" [2,4 :: Int] answer9
        , runTestEq "map (*3) (filter even [1..5])" [6,12 :: Int] answer10`,
    hints: [
      'For <code>add 3 (double 2)</code>: first <code>double 2 = 4</code>, then <code>add 3 4 = 7</code>.',
      '<code>$</code> just means "evaluate everything to the right first". So <code>square $ double 3</code> = <code>square (double 3)</code> = <code>square 6</code> = <code>36</code>.',
      'A section like <code>(*2)</code> creates a function: <code>(*2) 7</code> = <code>7 * 2</code> = <code>14</code>. And <code>(3+) 10</code> = <code>3 + 10</code> = <code>13</code>.',
      'For the last one, work inside out: <code>filter even [1,2,3,4,5]</code> = <code>[2,4]</code>, then <code>map (*3) [2,4]</code> = <code>[6, 12]</code>.',
    ],
    concepts: ['function-application', 'dollar-operator', 'sections', 'prefix-operators', 'map', 'filter', 'grouping'],
    successPatterns: [
      'answer1\\s*=\\s*10',
      'answer3\\s*=\\s*36',
      'answer10.*\\[6.*12\\]',
    ],
    testNames: [
      'double 5 evaluates to 10',
      'add 3 (double 2) evaluates to 7',
      'square $ double 3 evaluates to 36',
      'double $ add 3 4 evaluates to 14',
      '(+) 10 20 evaluates to 30',
      '(*2) 7 evaluates to 14',
      '(3+) 10 evaluates to 13',
      'map double [1,2,3] evaluates to [2,4,6]',
      'filter even [1..5] evaluates to [2,4]',
      'map (*3) (filter even [1..5]) evaluates to [6,12]',
    ],
  },

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
--    Hint: foldl processes left-to-right. What accumulator and step function reverses?
myReverse :: [a] -> [a]
myReverse xs = error "use foldl"

-- 3. Map a function over a list using foldr.
--    foldr replaces (:) with your function and [] with [].
--    Hint: foldr replaces (:) — what should go in place of (:)?
myMap :: (a -> b) -> [a] -> [b]
myMap f xs = error "use foldr"

-- 4. Filter elements using foldr.
--    Like map, but only include elements where p is True.
--    Hint: like myMap, but only cons when the predicate holds.
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

<h3>zipWith: Pairwise Combination</h3>
<p><code>zipWith</code> applies a function to corresponding elements of two lists:</p>
<pre><code>zipWith (+) [1,2,3] [10,20,30] = [11, 22, 33]
zipWith (*) [2,3]   [10,10]    = [20, 30]</code></pre>

<h3>Your Task</h3>
<p>Implement infinite list generators and use laziness to work with infinite data.</p>
`,
    starterCode: `module LazyInfiniteLists where

-- EXERCISE: Work with infinite lists.

-- 1. Implement iterate: generate [x, f x, f (f x), ...]
--    This is an infinite list — Haskell's laziness makes it work.
myIterate :: (a -> a) -> a -> [a]
myIterate f x = error "cons the current value, then recurse with f applied to x"

-- 2. Implement repeat and replicate.
--    repeat x = [x, x, x, ...]  (infinite)
--    replicate n x = take n (repeat x)
myRepeat :: a -> [a]
myRepeat x = error "cons x, then recurse"

myReplicate :: Int -> a -> [a]
myReplicate n x = error "use take and myRepeat"

-- 3. The Fibonacci sequence as an infinite list.
--    fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
--    zipWith f xs ys applies f to corresponding elements.
fibs :: [Int]
fibs = error "start with 0 and 1, then add corresponding pairs"

-- Index into the Fibonacci sequence (0-indexed).
fibN :: Int -> Int
fibN n = error "index into the fibs list"

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

<h3>Data.Array: Fixed-Size Indexed Arrays</h3>
<p><code>Data.Array</code> provides arrays with constant-time lookup:</p>
<pre><code>import Data.Array

-- Create: listArray (low, high) [elements...]
arr = listArray (0, 3) [10, 20, 30, 40]

-- Access: arr ! index
arr ! 0  -- 10
arr ! 2  -- 30</code></pre>

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

<h3>Why This Works: Lazy Self-Reference</h3>
<p>Notice that <code>go</code> references <code>arr</code>, and <code>arr</code> is defined using <code>go</code>. This circular reference works because Haskell is lazy — <code>arr</code> is a collection of unevaluated thunks. When <code>go 5</code> needs <code>arr ! 4</code>, Haskell evaluates that entry once, caches the result, and never recomputes it.</p>
<p>This is O(n) time and O(n) space — the same as imperative DP.</p>

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
--    This is the SAME pattern as fibMemo — just different base cases.
staircase :: Int -> Int
staircase n = error "use array memoization (same pattern as fibMemo)"

-- 3. 0/1 Knapsack: maximize value within weight capacity.
--    Items are [(weight, value)] pairs.
--    Use a 2D array indexed by (item, remaining capacity).
knapsack :: [(Int, Int)] -> Int -> Int
knapsack items capacity = error "compute arr ! (numItems, capacity)"
  -- Scaffold:
  -- where
  --   numItems = length items
  --   itemArr  = listArray (1, numItems) items
  --   arr = listArray ((0,0), (numItems, capacity))
  --         [go i w | i <- [0..numItems], w <- [0..capacity]]
  --   go 0 _ = 0
  --   go i w
  --     | wi > w    = ???  -- item too heavy, skip
  --     | otherwise = ???  -- max of (skip, take)
  --     where (wi, vi) = itemArr ! i
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
<p><strong>The key property to verify:</strong> both sides arrive at the <em>same</em> shared secret independently. This agreement is the foundation of the entire protocol — if Alice's computed secret differs from Bob's, the exchange is broken.</p>
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
<p>Recall from the Applicative & Monad module: <code>do</code>-notation with <code>Either</code> short-circuits on the first <code>Left</code>, carrying the error message through.</p>
`,
    starterCode: `module RSAEncryption where

-- Helpers (same algorithms from previous exercises, provided for reuse)

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
<pre><code>λ = ((y2 - y1) * modInverse ((x2 - x1) \`mod\` p) p) \`mod\` p  -- slope of the line
x3 = (λ² - x1 - x2) mod p
y3 = (λ * (x1 - x3) - y1) mod p</code></pre>

<p>For point doubling P + P where y1 ≠ 0 (if y1 = 0, the tangent is vertical → return Inf):</p>
<pre><code>λ = ((3*x1² + a) * modInverse (2*y1) p) \`mod\` p   -- slope of the tangent
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
--    Handle: Inf cases, inverse points, y1==0 doubling guard, doubling, general addition.
--    Doubling formula: lam = ((3*x1*x1 + a) * modInverse (2*y1) p) \`mod\` p
--    General formula:  lam = ((y2 - y1) * modInverse ((x2 - x1) \`mod\` p) p) \`mod\` p
--    Then: x3 = (lam*lam - x1 - x2) \`mod\` p
--           y3 = (lam*(x1 - x3) - y1) \`mod\` p
ecAdd :: Curve -> ECPoint -> ECPoint -> ECPoint
ecAdd _ Inf q = q
ecAdd _ p Inf = p
ecAdd (Curve a p) (ECPoint x1 y1) (ECPoint x2 y2)
  | x1 == x2 && y1 == ((p - y2) \`mod\` p) = error "inverse points -> return Inf"
  | x1 == x2 && y1 == y2 && y1 == 0       = error "vertical tangent -> return Inf"
  | x1 == x2 && y1 == y2                   = error "doubling: compute lam, x3, y3"
  | otherwise                               = error "general addition: compute lam, x3, y3"

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
  | x1 == x2 && y1 == y2 && y1 == 0 = Inf
  | x1 == x2 && y1 == y2 = let
      lam = ((3 * x1 * x1 + a) * modInverse (2 * y1) p) \`mod\` p
      x3  = (lam * lam - 2 * x1) \`mod\` p
      y3  = (lam * (x1 - x3) - y1) \`mod\` p
    in ECPoint x3 y3
  | otherwise = let
      lam = ((y2 - y1) * modInverse ((x2 - x1) \`mod\` p) p) \`mod\` p
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

-- Note: in a real system, values and randomness would be reduced modulo the group order.

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

  // ═══════════════════════════════════════════════════════════════════
  // COMPILER & LANGUAGE THEORY MODULE
  // ═══════════════════════════════════════════════════════════════════

  'parser-type': {
    id: 'parser-type',
    title: 'Define a Parser Type',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>A <strong>parser</strong> is a function that consumes part of a string and returns a structured result along with the remaining unconsumed input. This is the foundational idea behind <em>parser combinators</em> — a powerful, composable approach to parsing that fits naturally into functional programming.</p>

<h3>The Parser Type</h3>
<p>We represent a parser as a newtype wrapping a function:</p>
<pre><code>newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }</code></pre>
<p>A <code>Parser a</code> takes a <code>String</code> input and returns:</p>
<ul>
  <li><code>Nothing</code> — the parse failed</li>
  <li><code>Just (result, remaining)</code> — successfully parsed a value of type <code>a</code>, with <code>remaining</code> being the unconsumed input</li>
</ul>

<h3>Example: Parsing a Single Character</h3>
<p>A parser that matches a character satisfying a predicate:</p>
<pre><code>charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing</code></pre>
<p>Usage:</p>
<pre><code>runParser (charP (== 'h')) "hello"  -- Just ('h', "ello")
runParser (charP (== 'h')) "world"  -- Nothing</code></pre>

<h3>Functor Instance</h3>
<p>To transform the result of a parser without changing what it consumes, we implement <code>Functor</code>:</p>
<pre><code>instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')</code></pre>
<p>This lets you write <code>fmap f letterP</code> to parse a letter and transform it.</p>

<h3>Parsing Exact Strings</h3>
<p>To parse an exact string like <code>"let"</code>, you consume characters one at a time, checking each matches. If any character fails, the whole parse fails:</p>
<pre><code>stringP :: String -> Parser String
stringP [] = Parser $ \\s -> Just ([], s)      -- empty string always succeeds
stringP (c:cs) = ...  -- parse c, then recursively parse cs</code></pre>

<h3>Data.Char Predicates</h3>
<p>The <code>Data.Char</code> module provides useful predicates:</p>
<ul>
  <li><code>isDigit :: Char -> Bool</code> — matches '0'..'9'</li>
  <li><code>isAlpha :: Char -> Bool</code> — matches letters</li>
  <li><code>isSpace :: Char -> Bool</code> — matches whitespace</li>
</ul>

<h3>Your Task</h3>
<p>Define the <code>Parser</code> newtype, implement <code>Functor</code> for it, then build the basic parsers: <code>charP</code>, <code>digitP</code>, <code>letterP</code>, and <code>stringP</code>.</p>
`,
    starterCode: `module ParserType where

import Data.Char (isDigit, isAlpha, isSpace)

-- 1. Define the Parser newtype.
--    A Parser a wraps a function: String -> Maybe (a, String)
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

-- 2. Implement Functor for Parser.
--    fmap f p should run p and apply f to the result.
instance Functor Parser where
  fmap f (Parser p) = error "implement fmap for Parser"

-- 3. charP: consume one character if it satisfies the predicate.
--    If the input is empty or the predicate fails, return Nothing.
charP :: (Char -> Bool) -> Parser Char
charP predicate = error "implement charP"

-- 4. digitP: parse a single digit character.
digitP :: Parser Char
digitP = error "use charP with isDigit"

-- 5. letterP: parse a single letter character.
letterP :: Parser Char
letterP = error "use charP with isAlpha"

-- 6. stringP: parse an exact string.
--    stringP "" always succeeds.
--    stringP (c:cs) should parse c, then recursively parse cs.
stringP :: String -> Parser String
stringP str = error "implement stringP"
`,
    solutionCode: `module ParserType where

import Data.Char (isDigit, isAlpha, isSpace)

newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

stringP :: String -> Parser String
stringP []     = Parser $ \\s -> Just ([], s)
stringP (c:cs) = Parser $ \\s -> case runParser (charP (== c)) s of
  Nothing       -> Nothing
  Just (_, s')  -> case runParser (stringP cs) s' of
    Nothing        -> Nothing
    Just (cs', s'') -> Just (c:cs', s'')
`,
    testCode: `runTestEq "charP (=='h') hello" (Just ('h', "ello")) (runParser (charP (== 'h')) "hello")
        , runTestEq "charP (=='h') world" Nothing (runParser (charP (== 'h')) "world")
        , runTestEq "charP (=='h') empty" Nothing (runParser (charP (== 'h')) "")
        , runTestEq "digitP 9abc" (Just ('9', "abc")) (runParser digitP "9abc")
        , runTestEq "digitP abc" Nothing (runParser digitP "abc")
        , runTestEq "letterP abc" (Just ('a', "bc")) (runParser letterP "abc")
        , runTestEq "letterP 123" Nothing (runParser letterP "123")
        , runTestEq "stringP let" (Just ("let", " x")) (runParser (stringP "let") "let x")
        , runTestEq "stringP let fails" Nothing (runParser (stringP "let") "lex x")
        , runTestEq "stringP empty" (Just ("", "hello")) (runParser (stringP "") "hello")
        , runTestEq "fmap on letterP" (Just ('b', "bc")) (runParser (fmap (const 'b') letterP) "abc")`,
    hints: [
      'For <code>fmap</code>: run the inner parser function <code>p s</code>, then pattern match. On <code>Just (a, s\')</code>, return <code>Just (f a, s\')</code>.',
      'For <code>charP</code>: pattern match the input with <code>(c:cs)</code>, add a guard <code>| predicate c</code>, and return <code>Just (c, cs)</code>. All other cases return <code>Nothing</code>.',
      'For <code>digitP</code> and <code>letterP</code>: simply apply <code>charP</code> to the appropriate <code>Data.Char</code> predicate.',
      'For <code>stringP</code>: the base case <code>stringP []</code> succeeds with an empty list. The recursive case parses one character with <code>charP (== c)</code>, then calls <code>stringP cs</code> on the remaining input, combining the results.',
    ],
    concepts: ['parser-combinators', 'newtype', 'functor', 'pattern-matching', 'maybe'],
    successPatterns: [
      'newtype\\s+Parser',
      'charP.*Parser\\s*\\$',
      'charP\\s+isDigit',
      'stringP.*charP',
    ],
    testNames: [
      'charP matches first character',
      'charP rejects non-matching character',
      'charP fails on empty input',
      'digitP parses a digit',
      'digitP rejects letters',
      'letterP parses a letter',
      'letterP rejects digits',
      'stringP parses exact string',
      'stringP fails on mismatch',
      'stringP empty always succeeds',
      'fmap transforms parser result',
    ],
  },

  'parser-combinators': {
    id: 'parser-combinators',
    title: 'Parser Combinators',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>Now that we have a <code>Parser</code> type and <code>Functor</code>, we need to <strong>combine</strong> parsers. This is where the real power emerges: small parsers snap together like LEGO bricks to build complex grammars.</p>

<h3>Applicative Instance</h3>
<p>The <code>Applicative</code> instance lets us sequence two parsers, combining their results:</p>
<pre><code>pure a = Parser $ \\s -> Just (a, s)  -- succeed without consuming input

Parser pf &lt;*&gt; Parser pa = Parser $ \\s ->
  case pf s of
    Nothing       -> Nothing
    Just (f, s')  -> case pa s' of
      Nothing        -> Nothing
      Just (a, s'')  -> Just (f a, s'')</code></pre>
<p><code>pure</code> injects a value into a parser that always succeeds. <code>&lt;*&gt;</code> runs the first parser to get a function, then the second parser to get an argument, and applies the function.</p>

<h3>Monad Instance</h3>
<p>The <code>Monad</code> instance lets subsequent parsers depend on earlier results:</p>
<pre><code>Parser pa >>= f = Parser $ \\s ->
  case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'</code></pre>
<p>This runs parser <code>pa</code>, feeds the result into <code>f</code> to get a new parser, then runs that parser on the remaining input.</p>

<h3>Choice: orElse</h3>
<p>Try the first parser; if it fails, try the second on the <em>original</em> input:</p>
<pre><code>orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s ->
  case p1 s of
    Nothing -> p2 s
    result  -> result</code></pre>

<h3>Repetition: many and some</h3>
<p><code>many p</code> applies <code>p</code> zero or more times, collecting results into a list. <code>some p</code> requires at least one match:</p>
<pre><code>many p = (do x &lt;- p; xs &lt;- many p; return (x:xs)) \`orElse\` pure []
some p = do x &lt;- p; xs &lt;- many p; return (x:xs)</code></pre>

<h3>Parsing Numbers</h3>
<p>With <code>some</code> and <code>digitP</code>, we can parse natural numbers:</p>
<pre><code>natP :: Parser Int
natP = do digits &lt;- some digitP; return (read digits)</code></pre>

<h3>Your Task</h3>
<p>Implement <code>Applicative</code> and <code>Monad</code> instances for <code>Parser</code>, then build the combinators <code>orElse</code>, <code>many</code>, <code>some</code>, and <code>natP</code>.</p>
`,
    starterCode: `module ParserCombinators where

import Data.Char (isDigit, isAlpha, isSpace)

-- PROVIDED: Parser type and Functor (from exercise 1)
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

-- EXERCISE: Implement the following

-- 1. Applicative instance for Parser
instance Applicative Parser where
  pure a = error "implement pure"
  Parser pf <*> Parser pa = error "implement <*>"

-- 2. Monad instance for Parser
instance Monad Parser where
  Parser pa >>= f = error "implement >>="

-- 3. orElse: try the first parser, if it fails try the second
orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = error "implement orElse"

-- 4. many: zero or more
many :: Parser a -> Parser [a]
many p = error "implement many"

-- 5. some: one or more (must succeed at least once)
some :: Parser a -> Parser [a]
some p = error "implement some"

-- 6. natP: parse a natural number (one or more digits, then read)
natP :: Parser Int
natP = error "implement natP"
`,
    solutionCode: `module ParserCombinators where

import Data.Char (isDigit, isAlpha, isSpace)

newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)
`,
    testCode: `runTestEq "orElse digitP letterP on abc" (Just ('a', "bc")) (runParser (orElse digitP letterP) "abc")
        , runTestEq "orElse digitP letterP on 9bc" (Just ('9', "bc")) (runParser (orElse digitP letterP) "9bc")
        , runTestEq "orElse digitP letterP on !bc" Nothing (runParser (orElse digitP letterP) "!bc")
        , runTestEq "many digitP on 123abc" (Just ("123", "abc")) (runParser (many digitP) "123abc")
        , runTestEq "many digitP on abc" (Just ("", "abc")) (runParser (many digitP) "abc")
        , runTestEq "some digitP on 123abc" (Just ("123", "abc")) (runParser (some digitP) "123abc")
        , runTestEq "some digitP on abc" Nothing (runParser (some digitP) "abc")
        , runTestEq "natP on 42+3" (Just (42 :: Int, "+3")) (runParser natP "42+3")
        , runTestEq "natP on 0" (Just (0 :: Int, "")) (runParser natP "0")
        , runTestEq "natP on abc" Nothing (runParser natP "abc")
        , runTestEq "pure 42" (Just (42 :: Int, "hello")) (runParser (pure 42) "hello")`,
    hints: [
      'For <code>pure</code>: return the value without consuming any input: <code>Parser $ \\s -> Just (a, s)</code>.',
      'For <code>&lt;*&gt;</code>: run <code>pf</code> first to get a function <code>f</code> and remaining <code>s\'</code>, then run <code>pa</code> on <code>s\'</code> to get <code>a</code> and <code>s\'\'</code>, then return <code>Just (f a, s\'\')</code>.',
      'For <code>many</code>: try to parse one item with <code>p</code>, then recursively parse <code>many p</code>. If any step fails, <code>orElse</code> returns <code>pure []</code> (empty list, no input consumed).',
      'For <code>natP</code>: use <code>some digitP</code> to get a <code>String</code> of digit characters, then <code>read</code> to convert it to an <code>Int</code>.',
    ],
    concepts: ['applicative', 'monad', 'parser-combinators', 'choice', 'repetition'],
    successPatterns: [
      'pure\\s+a\\s*=\\s*Parser',
      'Parser\\s+pf\\s*<\\*>\\s*Parser\\s+pa',
      'Nothing\\s*->\\s*p2\\s+s',
      'many.*orElse.*pure\\s*\\[',
    ],
    testNames: [
      'orElse picks first success (letter)',
      'orElse picks first success (digit)',
      'orElse fails if both fail',
      'many collects zero or more digits',
      'many succeeds with zero matches',
      'some collects one or more digits',
      'some fails on zero matches',
      'natP parses multi-digit number',
      'natP parses zero',
      'natP fails on non-digits',
      'pure injects value without consuming',
    ],
  },

  'expression-parser': {
    id: 'expression-parser',
    title: 'Expression Parser with Precedence',
    difficulty: 'advanced',
    order: 3,
    description: `
<p>Now we put our parser combinators to work on a real problem: parsing <strong>arithmetic expressions</strong> with correct operator precedence. This is a core problem in compiler design.</p>

<h3>The Expression AST</h3>
<p>We represent parsed expressions as an <strong>Abstract Syntax Tree</strong> (AST):</p>
<pre><code>data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
  deriving (Show, Eq)</code></pre>
<p>For example, <code>3 + 4 * 2</code> is represented as:</p>
<pre><code>Add (Lit 3) (Mul (Lit 4) (Lit 2))</code></pre>
<p>Note that <code>*</code> binds tighter than <code>+</code> — this is <strong>operator precedence</strong>.</p>

<h3>Precedence via Grammar Layers</h3>
<p>The standard technique is to define one parser per precedence level:</p>
<ol>
  <li><strong>parseFactor</strong> — highest precedence: numbers and parenthesized expressions</li>
  <li><strong>parseTerm</strong> — multiplication chains: <code>factor (* factor)*</code></li>
  <li><strong>parseExpr</strong> — addition chains: <code>term (+ term)*</code></li>
</ol>
<p>Each level calls the one above it for its operands, naturally encoding precedence.</p>

<h3>Left-Associative Chaining: chainl1</h3>
<p>The key combinator is <code>chainl1</code>, which parses <code>p (op p)*</code> and folds left:</p>
<pre><code>chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = p >>= rest
  where rest a = (do f &lt;- op; b &lt;- p; rest (f a b)) \`orElse\` pure a</code></pre>
<p>This parses one <code>p</code>, then repeatedly parses <code>op</code> followed by <code>p</code>, applying the operator left-to-right. So <code>1+2+3</code> becomes <code>Add (Add (Lit 1) (Lit 2)) (Lit 3)</code>.</p>

<h3>Handling Whitespace</h3>
<p>We skip optional spaces around operators using:</p>
<pre><code>skipSpaces :: Parser String
skipSpaces = many (charP isSpace)</code></pre>

<h3>Example Parse</h3>
<pre><code>"3+4*2" -> parseExpr
  -> parseTerm: parseFactor -> Lit 3, no more *
  -> sees +, so Add (Lit 3) ...
  -> parseTerm: parseFactor -> Lit 4, sees *
     -> Mul (Lit 4) (parseFactor -> Lit 2)
  -> Add (Lit 3) (Mul (Lit 4) (Lit 2))</code></pre>

<h3>Your Task</h3>
<p>Build a complete expression parser with correct precedence for <code>+</code> and <code>*</code>, supporting parentheses.</p>
`,
    starterCode: `module ExpressionParser where

import Data.Char (isDigit, isAlpha, isSpace)

-- PROVIDED: Full parser infrastructure
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)

skipSpaces :: Parser String
skipSpaces = many (charP isSpace)

-- EXERCISE: Implement the expression parser

-- The AST
data Expr = Lit Int | Add Expr Expr | Mul Expr Expr deriving (Show, Eq)

-- 1. chainl1: parse p, then repeatedly parse (op, p) folding left.
--    chainl1 p op = p >>= rest
--      where rest a = (do f <- op; b <- p; rest (f a b)) \`orElse\` pure a
chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = error "implement chainl1"

-- 2. parseFactor: a number literal, or a parenthesized expression.
--    Number: parse natP, wrap in Lit
--    Parens: parse '(', skipSpaces, parseExpr, skipSpaces, ')', return the expr
parseFactor :: Parser Expr
parseFactor = error "implement parseFactor"

-- 3. parseTerm: chain factors with * (higher precedence)
--    Use chainl1 with parseFactor and a parser that matches '*' and returns Mul
parseTerm :: Parser Expr
parseTerm = error "implement parseTerm"

-- 4. parseExpr: chain terms with + (lower precedence)
--    Use chainl1 with parseTerm and a parser that matches '+' and returns Add
parseExpr :: Parser Expr
parseExpr = error "implement parseExpr"

-- 5. parseString: run parseExpr and extract just the result
parseString :: String -> Maybe Expr
parseString input = error "run parseExpr on input, return just the Expr"
`,
    solutionCode: `module ExpressionParser where

import Data.Char (isDigit, isAlpha, isSpace)

newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)

skipSpaces :: Parser String
skipSpaces = many (charP isSpace)

data Expr = Lit Int | Add Expr Expr | Mul Expr Expr deriving (Show, Eq)

chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = p >>= rest
  where rest a = (do f <- op; b <- p; rest (f a b)) \`orElse\` pure a

parseFactor :: Parser Expr
parseFactor = litP \`orElse\` parenP
  where
    litP = do
      _ <- skipSpaces
      n <- natP
      _ <- skipSpaces
      return (Lit n)
    parenP = do
      _ <- skipSpaces
      _ <- charP (== '(')
      _ <- skipSpaces
      e <- parseExpr
      _ <- skipSpaces
      _ <- charP (== ')')
      _ <- skipSpaces
      return e

parseTerm :: Parser Expr
parseTerm = chainl1 parseFactor mulOp
  where mulOp = do _ <- skipSpaces; _ <- charP (== '*'); _ <- skipSpaces; return Mul

parseExpr :: Parser Expr
parseExpr = chainl1 parseTerm addOp
  where addOp = do _ <- skipSpaces; _ <- charP (== '+'); _ <- skipSpaces; return Add

parseString :: String -> Maybe Expr
parseString input = case runParser parseExpr input of
  Just (expr, _) -> Just expr
  Nothing        -> Nothing
`,
    testCode: `runTestEq "parse 42" (Just (Lit 42)) (parseString "42")
        , runTestEq "parse 3+4" (Just (Add (Lit 3) (Lit 4))) (parseString "3+4")
        , runTestEq "parse 3+4*2 precedence" (Just (Add (Lit 3) (Mul (Lit 4) (Lit 2)))) (parseString "3+4*2")
        , runTestEq "parse (3+4)*2 parens" (Just (Mul (Add (Lit 3) (Lit 4)) (Lit 2))) (parseString "(3+4)*2")
        , runTestEq "parse 1+2+3 left-assoc" (Just (Add (Add (Lit 1) (Lit 2)) (Lit 3))) (parseString "1+2+3")
        , runTestEq "parse 2*3*4 left-assoc" (Just (Mul (Mul (Lit 2) (Lit 3)) (Lit 4))) (parseString "2*3*4")
        , runTestEq "parse with spaces" (Just (Add (Lit 3) (Lit 4))) (parseString " 3 + 4 ")
        , runTestEq "parse nested parens" (Just (Mul (Lit 2) (Add (Lit 3) (Lit 4)))) (parseString "2*(3+4)")
        , runTestEq "parse single paren" (Just (Lit 5)) (parseString "(5)")
        , runTestEq "parse empty fails" Nothing (parseString "")`,
    hints: [
      'For <code>chainl1</code>: parse one <code>p</code>, then in <code>rest</code>, try to parse <code>op</code> then <code>p</code>, apply the operator, and recurse. If the <code>op</code> parse fails, <code>orElse</code> returns <code>pure a</code> (stop chaining).',
      'For <code>parseFactor</code>: try a number literal first (parse <code>natP</code>, wrap in <code>Lit</code>). If that fails (<code>orElse</code>), try parsing <code>(</code>, then <code>parseExpr</code>, then <code>)</code>.',
      'For <code>parseTerm</code>: use <code>chainl1 parseFactor mulOp</code> where <code>mulOp</code> parses <code>*</code> and returns the <code>Mul</code> constructor.',
      'For <code>parseString</code>: run <code>runParser parseExpr input</code> and extract just the first element of the tuple with pattern matching on <code>Just (expr, _)</code>.',
    ],
    concepts: ['expression-parsing', 'operator-precedence', 'left-recursion', 'chainl1', 'AST'],
    successPatterns: [
      'chainl1\\s+p\\s+op\\s*=\\s*p\\s*>>=',
      'parseFactor.*orElse',
      'chainl1\\s+parseFactor',
      'chainl1\\s+parseTerm',
    ],
    testNames: [
      'parse single number',
      'parse addition',
      'parse precedence: + vs *',
      'parse parentheses override precedence',
      'parse left-associative addition',
      'parse left-associative multiplication',
      'parse with whitespace',
      'parse nested parenthesized expression',
      'parse single parenthesized number',
      'parse empty string fails',
    ],
  },

  'ast-evaluator': {
    id: 'ast-evaluator',
    title: 'AST Evaluator',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p>We have a parser that turns strings into ASTs. Now we need an <strong>evaluator</strong> that turns ASTs into results. This is the second half of an interpreter pipeline: <code>String -> AST -> Value</code>.</p>

<h3>Evaluating a Simple AST</h3>
<p>Given our expression type:</p>
<pre><code>data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
  deriving (Show, Eq)</code></pre>
<p>Evaluation is straightforward pattern matching:</p>
<pre><code>eval :: Expr -> Int
eval (Lit n)   = n
eval (Add a b) = eval a + eval b
eval (Mul a b) = eval a * eval b</code></pre>
<p>Each constructor maps to a simple operation. The recursion follows the tree structure — this is called a <strong>tree-walking evaluator</strong>.</p>

<h3>Adding Variables</h3>
<p>Real languages have variables. We extend the AST:</p>
<pre><code>data Expr2 = Lit2 Int | Add2 Expr2 Expr2 | Mul2 Expr2 Expr2 | Var String
  deriving (Show, Eq)</code></pre>
<p>Now evaluation can <strong>fail</strong> — a variable might not be defined. We use <code>Maybe</code> to handle this:</p>
<pre><code>evalWithVars :: [(String, Int)] -> Expr2 -> Maybe Int</code></pre>
<p>The first argument is an <strong>environment</strong> — a list of variable bindings like <code>[("x", 5), ("y", 10)]</code>.</p>

<h3>Using the Maybe Monad</h3>
<p>The <code>Maybe</code> monad propagates failure automatically:</p>
<pre><code>evalWithVars env (Add2 a b) = do
  va &lt;- evalWithVars env a   -- if this returns Nothing, the whole thing is Nothing
  vb &lt;- evalWithVars env b   -- same here
  return (va + vb)            -- only reached if both succeed</code></pre>
<p>For variables, use <code>lookup</code> from the Prelude:</p>
<pre><code>lookup :: Eq a => a -> [(a, b)] -> Maybe b
lookup "x" [("x", 5), ("y", 10)]  -- Just 5
lookup "z" [("x", 5), ("y", 10)]  -- Nothing</code></pre>

<h3>Your Task</h3>
<p>Implement <code>eval</code> for the simple AST, then implement <code>evalWithVars</code> for the extended AST with variables, using the <code>Maybe</code> monad for error handling.</p>
`,
    starterCode: `module AstEvaluator where

-- PROVIDED: Expression types
data Expr = Lit Int | Add Expr Expr | Mul Expr Expr deriving (Show, Eq)

data Expr2 = Lit2 Int | Add2 Expr2 Expr2 | Mul2 Expr2 Expr2 | Var String
  deriving (Show, Eq)

-- 1. eval: evaluate a simple expression AST.
--    Pattern match on each constructor:
--      Lit n   -> n
--      Add a b -> evaluate both sides and add
--      Mul a b -> evaluate both sides and multiply
eval :: Expr -> Int
eval expr = error "implement eval"

-- 2. evalWithVars: evaluate an expression with variables.
--    Takes an environment [(String, Int)] mapping variable names to values.
--    Returns Maybe Int because variable lookup can fail.
--    Use the Maybe monad (do-notation) to propagate failures.
--    For Var: use  lookup name env  which returns Maybe Int.
evalWithVars :: [(String, Int)] -> Expr2 -> Maybe Int
evalWithVars env expr = error "implement evalWithVars"
`,
    solutionCode: `module AstEvaluator where

data Expr = Lit Int | Add Expr Expr | Mul Expr Expr deriving (Show, Eq)

data Expr2 = Lit2 Int | Add2 Expr2 Expr2 | Mul2 Expr2 Expr2 | Var String
  deriving (Show, Eq)

eval :: Expr -> Int
eval (Lit n)   = n
eval (Add a b) = eval a + eval b
eval (Mul a b) = eval a * eval b

evalWithVars :: [(String, Int)] -> Expr2 -> Maybe Int
evalWithVars env (Lit2 n)    = Just n
evalWithVars env (Add2 a b)  = do
  va <- evalWithVars env a
  vb <- evalWithVars env b
  return (va + vb)
evalWithVars env (Mul2 a b)  = do
  va <- evalWithVars env a
  vb <- evalWithVars env b
  return (va * vb)
evalWithVars env (Var name)  = lookup name env
`,
    testCode: `runTestEq "eval Lit 42" (42 :: Int) (eval (Lit 42))
        , runTestEq "eval Add 3 4" (7 :: Int) (eval (Add (Lit 3) (Lit 4)))
        , runTestEq "eval Mul 3 4" (12 :: Int) (eval (Mul (Lit 3) (Lit 4)))
        , runTestEq "eval Add 3 (Mul 4 2)" (11 :: Int) (eval (Add (Lit 3) (Mul (Lit 4) (Lit 2))))
        , runTestEq "eval nested" (14 :: Int) (eval (Mul (Add (Lit 3) (Lit 4)) (Lit 2)))
        , runTestEq "evalWithVars Lit2" (Just 42) (evalWithVars [] (Lit2 42))
        , runTestEq "evalWithVars Var found" (Just 5) (evalWithVars [("x", 5)] (Var "x"))
        , runTestEq "evalWithVars Var missing" Nothing (evalWithVars [("x", 5)] (Var "y"))
        , runTestEq "evalWithVars Add2 with vars" (Just 8) (evalWithVars [("x", 5), ("y", 3)] (Add2 (Var "x") (Var "y")))
        , runTestEq "evalWithVars Mul2 with var" (Just 15) (evalWithVars [("x", 5)] (Mul2 (Var "x") (Lit2 3)))
        , runTestEq "evalWithVars missing propagates" Nothing (evalWithVars [("x", 5)] (Add2 (Var "x") (Var "z")))`,
    hints: [
      'For <code>eval</code>: pattern match each constructor. <code>Lit n</code> returns <code>n</code>, <code>Add a b</code> returns <code>eval a + eval b</code>, <code>Mul a b</code> returns <code>eval a * eval b</code>.',
      'For <code>evalWithVars (Lit2 n)</code>: wrap in <code>Just</code> since a literal always succeeds.',
      'For <code>evalWithVars (Add2 a b)</code>: use <code>do</code>-notation — bind <code>evalWithVars env a</code> and <code>evalWithVars env b</code>, then <code>return</code> their sum. If either is <code>Nothing</code>, the whole thing becomes <code>Nothing</code>.',
      'For <code>evalWithVars (Var name)</code>: use <code>lookup name env</code> which already returns <code>Maybe Int</code>.',
    ],
    concepts: ['tree-walking-evaluator', 'pattern-matching', 'maybe-monad', 'environment', 'variable-lookup'],
    successPatterns: [
      'eval\\s*\\(Lit\\s+n\\)\\s*=\\s*n',
      'eval\\s*\\(Add',
      'evalWithVars.*Var.*lookup',
      'evalWithVars.*do',
    ],
    testNames: [
      'eval literal',
      'eval addition',
      'eval multiplication',
      'eval precedence (add then mul)',
      'eval nested expression',
      'evalWithVars literal',
      'evalWithVars variable found',
      'evalWithVars variable missing',
      'evalWithVars add two variables',
      'evalWithVars mul variable and literal',
      'evalWithVars missing variable propagates Nothing',
    ],
  },

  'interpreter': {
    id: 'interpreter',
    title: 'Build a Mini Interpreter',
    difficulty: 'advanced',
    order: 5,
    description: `
<p>We now have all the pieces: a parser that turns strings into ASTs, and an evaluator that computes results. In this final exercise, we combine them into a complete <strong>interpreter</strong> and extend the language with <code>let</code> expressions and variables.</p>

<h3>Extending the Language</h3>
<p>We extend our expression type with <code>Let</code> bindings and <code>Var</code> references:</p>
<pre><code>data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
          | Var String | Let String Expr Expr
  deriving (Show, Eq)</code></pre>
<p><code>Let "x" valueExpr bodyExpr</code> means "bind the name <code>x</code> to the result of <code>valueExpr</code>, then evaluate <code>bodyExpr</code> with that binding."</p>
<p>For example, <code>let x = 5 in x + 3</code> becomes <code>Let "x" (Lit 5) (Add (Var "x") (Lit 3))</code> and evaluates to <code>8</code>.</p>

<h3>Parsing let Expressions</h3>
<p>The syntax is: <code>let &lt;name&gt; = &lt;expr&gt; in &lt;expr&gt;</code></p>
<pre><code>parseLet :: Parser Expr
parseLet = do
  _ &lt;- stringP "let"
  _ &lt;- skipSpaces
  name &lt;- some letterP    -- variable name (one or more letters)
  _ &lt;- skipSpaces
  _ &lt;- charP (== '=')
  _ &lt;- skipSpaces
  val &lt;- parseExpr         -- the value expression
  _ &lt;- skipSpaces
  _ &lt;- stringP "in"
  _ &lt;- skipSpaces
  body &lt;- parseExpr        -- the body expression
  return (Let name val body)</code></pre>
<p>And <code>parseFactor</code> must try <code>parseLet</code> and <code>parseVar</code> as alternatives.</p>

<h3>Evaluating with an Environment</h3>
<p>The evaluator carries a list of variable bindings:</p>
<pre><code>evalLet :: [(String, Int)] -> Expr -> Maybe Int
evalLet env (Lit n)        = Just n
evalLet env (Var name)     = lookup name env
evalLet env (Let x val body) = do
  v &lt;- evalLet env val
  evalLet ((x, v) : env) body   -- extend the environment</code></pre>
<p>The key insight: <code>Let</code> evaluates the value, then adds the binding <code>(x, v)</code> to the front of the environment before evaluating the body.</p>

<h3>The Interpreter Pipeline</h3>
<pre><code>interpret :: String -> Maybe Int
interpret input = do
  (expr, _) &lt;- runParser parseExpr input
  evalLet [] expr</code></pre>
<p>Parse the string into an AST, then evaluate it with an empty initial environment.</p>

<h3>Your Task</h3>
<p>Extend the parser and evaluator with <code>let</code> expressions and variables, then wire them together into <code>interpret</code>.</p>
`,
    starterCode: `module Interpreter where

import Data.Char (isDigit, isAlpha, isSpace)

-- PROVIDED: Full parser infrastructure
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)

skipSpaces :: Parser String
skipSpaces = many (charP isSpace)

stringP :: String -> Parser String
stringP []     = Parser $ \\s -> Just ([], s)
stringP (c:cs) = Parser $ \\s -> case runParser (charP (== c)) s of
  Nothing       -> Nothing
  Just (_, s')  -> case runParser (stringP cs) s' of
    Nothing        -> Nothing
    Just (cs', s'') -> Just (c:cs', s'')

chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = p >>= rest
  where rest a = (do f <- op; b <- p; rest (f a b)) \`orElse\` pure a

-- Extended AST with Let and Var
data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
          | Var String | Let String Expr Expr
  deriving (Show, Eq)

-- EXERCISE: Implement the following

-- 1. parseVar: parse a variable name (one or more letters)
parseVar :: Parser Expr
parseVar = error "implement parseVar"

-- 2. parseLet: parse "let <name> = <expr> in <expr>"
parseLet :: Parser Expr
parseLet = error "implement parseLet"

-- 3. parseFactor: number, let-expr, variable, or parenthesized expr
--    Try in order: parseLet, litP, parseVar, parenP
parseFactor :: Parser Expr
parseFactor = error "implement parseFactor"

-- 4. parseTerm: chain factors with *
parseTerm :: Parser Expr
parseTerm = error "implement parseTerm"

-- 5. parseExpr: chain terms with +
parseExpr :: Parser Expr
parseExpr = error "implement parseExpr"

-- 6. evalLet: evaluate with an environment of variable bindings
--    Lit n        -> Just n
--    Var name     -> lookup name env
--    Add a b      -> evaluate both, add results
--    Mul a b      -> evaluate both, multiply results
--    Let x val body -> evaluate val, extend env with (x, result), evaluate body
evalLet :: [(String, Int)] -> Expr -> Maybe Int
evalLet env expr = error "implement evalLet"

-- 7. interpret: parse then evaluate
interpret :: String -> Maybe Int
interpret input = error "implement interpret"
`,
    solutionCode: `module Interpreter where

import Data.Char (isDigit, isAlpha, isSpace)

newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)

skipSpaces :: Parser String
skipSpaces = many (charP isSpace)

stringP :: String -> Parser String
stringP []     = Parser $ \\s -> Just ([], s)
stringP (c:cs) = Parser $ \\s -> case runParser (charP (== c)) s of
  Nothing       -> Nothing
  Just (_, s')  -> case runParser (stringP cs) s' of
    Nothing        -> Nothing
    Just (cs', s'') -> Just (c:cs', s'')

chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = p >>= rest
  where rest a = (do f <- op; b <- p; rest (f a b)) \`orElse\` pure a

data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
          | Var String | Let String Expr Expr
  deriving (Show, Eq)

parseVar :: Parser Expr
parseVar = do
  _ <- skipSpaces
  name <- some letterP
  _ <- skipSpaces
  return (Var name)

parseLet :: Parser Expr
parseLet = do
  _ <- skipSpaces
  _ <- stringP "let"
  _ <- skipSpaces
  name <- some letterP
  _ <- skipSpaces
  _ <- charP (== '=')
  _ <- skipSpaces
  val <- parseExpr
  _ <- skipSpaces
  _ <- stringP "in"
  _ <- skipSpaces
  body <- parseExpr
  return (Let name val body)

parseFactor :: Parser Expr
parseFactor = parseLet \`orElse\` litP \`orElse\` parseVar \`orElse\` parenP
  where
    litP = do
      _ <- skipSpaces
      n <- natP
      _ <- skipSpaces
      return (Lit n)
    parenP = do
      _ <- skipSpaces
      _ <- charP (== '(')
      _ <- skipSpaces
      e <- parseExpr
      _ <- skipSpaces
      _ <- charP (== ')')
      _ <- skipSpaces
      return e

parseTerm :: Parser Expr
parseTerm = chainl1 parseFactor mulOp
  where mulOp = do _ <- skipSpaces; _ <- charP (== '*'); _ <- skipSpaces; return Mul

parseExpr :: Parser Expr
parseExpr = chainl1 parseTerm addOp
  where addOp = do _ <- skipSpaces; _ <- charP (== '+'); _ <- skipSpaces; return Add

evalLet :: [(String, Int)] -> Expr -> Maybe Int
evalLet env (Lit n)          = Just n
evalLet env (Var name)       = lookup name env
evalLet env (Add a b)        = do
  va <- evalLet env a
  vb <- evalLet env b
  return (va + vb)
evalLet env (Mul a b)        = do
  va <- evalLet env a
  vb <- evalLet env b
  return (va * vb)
evalLet env (Let x val body) = do
  v <- evalLet env val
  evalLet ((x, v) : env) body

interpret :: String -> Maybe Int
interpret input = do
  (expr, _) <- runParser parseExpr input
  evalLet [] expr
`,
    testCode: `runTestEq "interpret 42" (Just 42) (interpret "42")
        , runTestEq "interpret 3+4" (Just 7) (interpret "3+4")
        , runTestEq "interpret 3+4*2" (Just 11) (interpret "3+4*2")
        , runTestEq "interpret (3+4)*2" (Just 14) (interpret "(3+4)*2")
        , runTestEq "interpret let x=5 in x+3" (Just 8) (interpret "let x = 5 in x + 3")
        , runTestEq "interpret let x=2 in x*x" (Just 4) (interpret "let x = 2 in x * x")
        , runTestEq "interpret nested let" (Just 11) (interpret "let x = 5 in let y = 6 in x + y")
        , runTestEq "interpret let in arithmetic" (Just 13) (interpret "let x = 3 in x + x * x + 1")
        , runTestEq "interpret empty fails" Nothing (interpret "")
        , runTestEq "evalLet Var missing" Nothing (evalLet [] (Var "z"))
        , runTestEq "evalLet Let extends env" (Just 10) (evalLet [] (Let "a" (Lit 10) (Var "a")))`,
    hints: [
      'For <code>parseVar</code>: use <code>some letterP</code> to parse the variable name (one or more letters), then wrap it in <code>Var</code>.',
      'For <code>parseLet</code>: sequence the keywords with <code>stringP "let"</code> and <code>stringP "in"</code>, use <code>some letterP</code> for the name, <code>charP (== \'=\')</code> for the equals sign, and call <code>parseExpr</code> for both the value and body.',
      'For <code>evalLet (Let x val body)</code>: evaluate <code>val</code> with the current env, then evaluate <code>body</code> with <code>(x, v) : env</code> — this adds the new binding to the front so it shadows any previous binding of the same name.',
      'For <code>interpret</code>: use <code>do</code>-notation with <code>Maybe</code> — bind <code>runParser parseExpr input</code> to get <code>(expr, _)</code>, then call <code>evalLet [] expr</code>.',
    ],
    concepts: ['interpreter', 'let-binding', 'environment', 'variable-scoping', 'parse-then-evaluate'],
    successPatterns: [
      'stringP\\s*"let"',
      'stringP\\s*"in"',
      'evalLet\\s*\\(\\(x.*:\\s*env\\)\\s*body',
      'evalLet\\s*\\[\\]\\s*expr',
    ],
    testNames: [
      'interpret simple number',
      'interpret addition',
      'interpret precedence',
      'interpret parentheses',
      'interpret let binding',
      'interpret let with multiplication',
      'interpret nested let',
      'interpret let in complex arithmetic',
      'interpret empty string fails',
      'evalLet undefined variable',
      'evalLet let extends environment',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // VERIFIED CRYPTOGRAPHIC PROTOCOLS MODULE
  // ═══════════════════════════════════════════════════════════════════

  'polynomial-arithmetic': {
    id: 'polynomial-arithmetic',
    title: 'Polynomial Arithmetic over Finite Fields',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p><strong>Polynomials over finite fields</strong> are the backbone of nearly every modern cryptographic protocol — from secret sharing to zero-knowledge proofs to error-correcting codes. Before we can build Shamir's scheme or Lagrange interpolation, we need reliable polynomial arithmetic mod a prime.</p>

<h3>Representation</h3>
<p>We store a polynomial as a list of coefficients, <strong>low-degree first</strong>:</p>
<pre><code>newtype Poly = Poly [Integer] deriving (Show, Eq)

-- Poly [3, 0, 2] represents 3 + 0x + 2x²</code></pre>

<h3>Horner's Method for Evaluation</h3>
<p>Evaluating a polynomial naively requires computing powers of x. <strong>Horner's method</strong> restructures the computation to avoid this:</p>
<pre><code>-- 3 + 0x + 2x²  =  3 + x(0 + x(2))
-- Evaluate right-to-left with foldr:
polyEval p (Poly cs) x = foldr (\\c acc -> (c + x * acc) \`mod\` p) 0 cs</code></pre>
<p>This is both faster and numerically stable in modular arithmetic.</p>

<h3>Polynomial Addition</h3>
<p>Add corresponding coefficients, padding the shorter polynomial with zeros:</p>
<pre><code>polyAdd p (Poly a) (Poly b) = ...  -- zipWith, pad shorter, mod p</code></pre>

<h3>Polynomial Multiplication (Convolution)</h3>
<p>Multiplying polynomials is <strong>convolution</strong>: the coefficient of x^k in the product is the sum of a_i * b_j for all i+j=k.</p>
<pre><code>-- (1 + x) * (1 + x) = 1 + 2x + x²
-- Poly [1,1] * Poly [1,1] = Poly [1,2,1]</code></pre>

<h3>Degree</h3>
<p>The degree is the index of the highest non-zero coefficient. The zero polynomial (all zeros or empty) has degree -1 by convention.</p>

<h3>Example: p = 23</h3>
<table>
  <thead><tr><th>Operation</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td><code>polyEval 23 (Poly [3,0,2]) 5</code></td><td><code>7</code> &nbsp; (3 + 0*5 + 2*25 = 53, 53 mod 23 = 7)</td></tr>
    <tr><td><code>polyMul 23 (Poly [1,1]) (Poly [1,1])</code></td><td><code>Poly [1,2,1]</code></td></tr>
    <tr><td><code>polyDeg (Poly [3,0,2])</code></td><td><code>2</code></td></tr>
    <tr><td><code>polyDeg (Poly [0,0])</code></td><td><code>-1</code></td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Implement polynomial evaluation (Horner's method), addition, multiplication (convolution), and degree computation &mdash; all over Z/pZ.</p>
`,
    starterCode: `module PolynomialArithmetic where

-- Polynomial: coefficients stored low-degree first.
-- Poly [3, 0, 2] represents 3 + 0x + 2x^2
newtype Poly = Poly [Integer] deriving (Show, Eq)

-- 1. Evaluate a polynomial at a point x, mod p.
--    Use Horner's method: foldr (\\c acc -> (c + x * acc) \`mod\` p) 0 cs
--    Example: polyEval 23 (Poly [3,0,2]) 5 = 7
polyEval :: Integer -> Poly -> Integer -> Integer
polyEval p (Poly cs) x = error "implement Horner's method"

-- 2. Add two polynomials mod p.
--    Pad the shorter list with zeros, then add corresponding coefficients mod p.
--    Example: polyAdd 23 (Poly [1,2]) (Poly [3,0,4]) = Poly [4,2,4]
polyAdd :: Integer -> Poly -> Poly -> Poly
polyAdd p (Poly a) (Poly b) = error "implement polynomial addition"

-- 3. Multiply two polynomials mod p (convolution).
--    The coefficient of x^k in the product is:
--      sum of a_i * b_j for all i + j = k, all mod p.
--    Example: polyMul 23 (Poly [1,1]) (Poly [1,1]) = Poly [1,2,1]
polyMul :: Integer -> Poly -> Poly -> Poly
polyMul p (Poly a) (Poly b) = error "implement convolution"

-- 4. Degree of a polynomial: index of the highest non-zero coefficient.
--    Return -1 for the zero polynomial.
--    Example: polyDeg (Poly [3,0,2]) = 2
--    Example: polyDeg (Poly [0,0]) = -1
polyDeg :: Poly -> Int
polyDeg (Poly cs) = error "implement degree"
`,
    solutionCode: `module PolynomialArithmetic where

newtype Poly = Poly [Integer] deriving (Show, Eq)

polyEval :: Integer -> Poly -> Integer -> Integer
polyEval p (Poly cs) x = foldr (\\c acc -> (c + x * acc) \`mod\` p) 0 cs

polyAdd :: Integer -> Poly -> Poly -> Poly
polyAdd p (Poly a) (Poly b) = Poly (go a b)
  where
    go [] []         = []
    go [] (y:ys)     = (y \`mod\` p) : go [] ys
    go (x:xs) []     = (x \`mod\` p) : go xs []
    go (x:xs) (y:ys) = ((x + y) \`mod\` p) : go xs ys

polyMul :: Integer -> Poly -> Poly -> Poly
polyMul p (Poly a) (Poly b) = Poly [coeff k | k <- [0 .. length a + length b - 2]]
  where
    coeff k = sum [ (a !! i * b !! (k - i)) \`mod\` p
                  | i <- [0 .. k]
                  , i < length a
                  , (k - i) < length b
                  ] \`mod\` p

polyDeg :: Poly -> Int
polyDeg (Poly cs) = go (length cs - 1) cs
  where
    go _ [] = -1
    go n xs
      | last xs /= 0 = n
      | otherwise     = go (n - 1) (init xs)
`,
    testCode: `runTestEq "polyEval 23 [3,0,2] at x=5 = 7" (7 :: Integer) (polyEval 23 (Poly [3,0,2]) 5)
        , runTestEq "polyEval 23 [1,1] at x=10 = 11" (11 :: Integer) (polyEval 23 (Poly [1,1]) 10)
        , runTestEq "polyEval 23 [0] at x=5 = 0" (0 :: Integer) (polyEval 23 (Poly [0]) 5)
        , runTestEq "polyAdd [1,2] + [3,0,4] mod 23" (Poly [4,2,4]) (polyAdd 23 (Poly [1,2]) (Poly [3,0,4]))
        , runTestEq "polyAdd [20,20] + [5,5] mod 23" (Poly [2,2]) (polyAdd 23 (Poly [20,20]) (Poly [5,5]))
        , runTestEq "polyMul [1,1]*[1,1] mod 23" (Poly [1,2,1]) (polyMul 23 (Poly [1,1]) (Poly [1,1]))
        , runTestEq "polyMul [2]*[3,1] mod 23" (Poly [6,2]) (polyMul 23 (Poly [2]) (Poly [3,1]))
        , runTestEq "polyMul [1,1]*[1,0,1] mod 23" (Poly [1,1,1,1]) (polyMul 23 (Poly [1,1]) (Poly [1,0,1]))
        , runTestEq "polyDeg [3,0,2] = 2" (2 :: Int) (polyDeg (Poly [3,0,2]))
        , runTestEq "polyDeg [0,0] = -1" ((-1) :: Int) (polyDeg (Poly [0,0]))
        , runTestEq "polyDeg [5] = 0" (0 :: Int) (polyDeg (Poly [5]))`,
    hints: [
      'For <code>polyEval</code>: use <code>foldr (\\c acc -> (c + x * acc) \\`mod\\` p) 0 cs</code>. This evaluates the polynomial right-to-left without computing powers.',
      'For <code>polyAdd</code>: handle three cases recursively &mdash; one list empty, other empty, or both non-empty. Add corresponding coefficients <code>mod p</code>.',
      'For <code>polyMul</code>: the coefficient of x^k is <code>sum [a!!i * b!!(k-i) | i <- [0..k], i < length a, (k-i) < length b] \\`mod\\` p</code>. The result has degree <code>length a + length b - 2</code>.',
      'For <code>polyDeg</code>: scan from the highest index down. If the last element is non-zero, that index is the degree. Otherwise, drop it and continue. Empty or all-zeros gives -1.',
    ],
    concepts: ['polynomial', 'finite-field', 'horner-method', 'convolution', 'modular-arithmetic'],
    successPatterns: [
      'foldr.*`mod`\\s+p',
      'polyAdd.*go|zipWith',
      'coeff\\s+k|sum.*!!',
      'last\\s+xs\\s*/=\\s*0|init\\s+xs',
    ],
    testNames: [
      'polyEval Horner at x=5',
      'polyEval linear at x=10',
      'polyEval zero polynomial',
      'polyAdd pads shorter polynomial',
      'polyAdd wraps mod p',
      'polyMul (1+x)*(1+x) = 1+2x+x^2',
      'polyMul scalar times polynomial',
      'polyMul (1+x)*(1+x^2)',
      'polyDeg of degree-2 polynomial',
      'polyDeg of zero polynomial',
      'polyDeg of constant polynomial',
    ],
  },

  'lagrange-interpolation': {
    id: 'lagrange-interpolation',
    title: 'Lagrange Interpolation',
    difficulty: 'advanced',
    order: 2,
    description: `
<p><strong>Lagrange interpolation</strong> is a foundational tool in cryptography: given a set of points, it reconstructs the unique polynomial passing through them. This is the mathematical engine behind Shamir's secret sharing, Reed-Solomon codes, and many zero-knowledge proof systems.</p>

<h3>The Problem</h3>
<p>Given <em>n</em> points <code>(x_0, y_0), (x_1, y_1), ..., (x_{n-1}, y_{n-1})</code> with distinct x-values, there is a unique polynomial of degree at most <em>n-1</em> passing through all of them. Lagrange interpolation lets us evaluate this polynomial at any point without explicitly computing its coefficients.</p>

<h3>The Formula</h3>
<p>To evaluate the interpolating polynomial at a point <code>x</code>:</p>
<pre><code>P(x) = sum_i ( y_i * L_i(x) )   mod p

where L_i(x) = product_{j /= i} ( (x - x_j) * modInverse((x_i - x_j) mod p, p) )   mod p</code></pre>

<p>Each <code>L_i</code> is called a <strong>Lagrange basis polynomial</strong>. It equals 1 at <code>x_i</code> and 0 at every other <code>x_j</code>.</p>

<h3>Modular Inverse</h3>
<p>Division in modular arithmetic means multiplying by the <strong>modular inverse</strong>. We compute it using the extended GCD:</p>
<pre><code>extGcd a 0 = (a, 1, 0)
extGcd a b = let (g, x, y) = extGcd b (a \`mod\` b)
             in  (g, y, x - (a \`div\` b) * y)

modInverse a p = let (_, x, _) = extGcd (a \`mod\` p + p) p
                 in  x \`mod\` p</code></pre>

<h3>Example: p = 23</h3>
<table>
  <thead><tr><th>Points</th><th>Evaluate at</th><th>Result</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td><code>[(1,2), (2,4)]</code></td><td><code>x = 3</code></td><td><code>6</code></td><td>Linear: y = 2x, so P(3) = 6</td></tr>
    <tr><td><code>[(1,1), (2,4), (3,9)]</code></td><td><code>x = 4</code></td><td><code>16</code></td><td>Quadratic: y = x&sup2;, so P(4) = 16</td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Implement <code>lagrangeEval</code>: given a prime <code>p</code>, a list of <code>(x, y)</code> points, and a target <code>x</code>, compute the value of the interpolating polynomial at that point, mod <code>p</code>.</p>
`,
    starterCode: `module LagrangeInterpolation where

-- Helper: modular exponentiation (for potential use)
modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

-- Helper: extended GCD
--   extGcd a b = (gcd, x, y) such that a*x + b*y = gcd
extGcd :: Integer -> Integer -> (Integer, Integer, Integer)
extGcd a 0 = (a, 1, 0)
extGcd a b = let (g, x, y) = extGcd b (a \`mod\` b)
             in  (g, y, x - (a \`div\` b) * y)

-- Helper: modular inverse
--   modInverse a p = a^(-1) mod p
modInverse :: Integer -> Integer -> Integer
modInverse a p = let (_, x, _) = extGcd (a \`mod\` p + p) p
                 in  x \`mod\` p

-- Lagrange interpolation: evaluate the interpolating polynomial at x, mod p.
--
-- Given points [(x_0, y_0), (x_1, y_1), ...] and a target x:
--   P(x) = sum_i ( y_i * L_i(x) )  mod p
-- where
--   L_i(x) = product_{j /= i} ( (x - x_j) * modInverse((x_i - x_j) mod p, p) )  mod p
--
-- Example: lagrangeEval 23 [(1,2),(2,4)] 3 = 6
lagrangeEval :: Integer -> [(Integer, Integer)] -> Integer -> Integer
lagrangeEval p points x = error "implement Lagrange interpolation"
`,
    solutionCode: `module LagrangeInterpolation where

modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

extGcd :: Integer -> Integer -> (Integer, Integer, Integer)
extGcd a 0 = (a, 1, 0)
extGcd a b = let (g, x, y) = extGcd b (a \`mod\` b)
             in  (g, y, x - (a \`div\` b) * y)

modInverse :: Integer -> Integer -> Integer
modInverse a p = let (_, x, _) = extGcd (a \`mod\` p + p) p
                 in  x \`mod\` p

lagrangeEval :: Integer -> [(Integer, Integer)] -> Integer -> Integer
lagrangeEval p points x = sum terms \`mod\` p
  where
    terms = [ (yi * basis i xi) \`mod\` p | (i, (xi, yi)) <- zip [0..] points ]
    basis i xi = foldl (\\acc (j, (xj, _)) ->
        if i == j then acc
        else (acc * ((x - xj) \`mod\` p + p) \`mod\` p * modInverse (((xi - xj) \`mod\` p + p) \`mod\` p) p) \`mod\` p
      ) 1 (zip [0..] points)
`,
    testCode: `runTestEq "lagrange [(1,2),(2,4)] at x=3 mod 23 = 6" (6 :: Integer) (lagrangeEval 23 [(1,2),(2,4)] 3)
        , runTestEq "lagrange [(1,2),(2,4)] at x=1 mod 23 = 2" (2 :: Integer) (lagrangeEval 23 [(1,2),(2,4)] 1)
        , runTestEq "lagrange [(1,2),(2,4)] at x=2 mod 23 = 4" (4 :: Integer) (lagrangeEval 23 [(1,2),(2,4)] 2)
        , runTestEq "lagrange [(1,1),(2,4),(3,9)] at x=4 mod 23 = 16" (16 :: Integer) (lagrangeEval 23 [(1,1),(2,4),(3,9)] 4)
        , runTestEq "lagrange [(1,1),(2,4),(3,9)] at x=1 mod 23 = 1" (1 :: Integer) (lagrangeEval 23 [(1,1),(2,4),(3,9)] 1)
        , runTestEq "lagrange [(1,1),(2,4),(3,9)] at x=5 mod 23 = 2" (2 :: Integer) (lagrangeEval 23 [(1,1),(2,4),(3,9)] 5)
        , runTestEq "lagrange single point [(3,7)] at x=10 mod 23 = 7" (7 :: Integer) (lagrangeEval 23 [(3,7)] 10)`,
    hints: [
      'Compute each Lagrange basis polynomial L_i(x) separately, then combine: <code>sum_i (y_i * L_i(x)) \\`mod\\` p</code>.',
      'For L_i(x), iterate over all j where j /= i. For each j, multiply by <code>(x - x_j) * modInverse((x_i - x_j) \\`mod\\` p + p) \\`mod\\` p, p)</code>.',
      'Be careful with negative numbers in modular arithmetic! Always add <code>p</code> before taking <code>mod p</code> to avoid negative remainders: <code>((a - b) \\`mod\\` p + p) \\`mod\\` p</code>.',
      'Full pattern: <code>sum [ (yi * foldl (\\acc ... -> if same index then acc else acc * ((x-xj) * modInverse((xi-xj) mod p, p)) mod p) 1 indexed_points) \\`mod\\` p | ... ] \\`mod\\` p</code>.',
    ],
    concepts: ['lagrange-interpolation', 'modular-inverse', 'finite-field', 'polynomial-evaluation', 'secret-sharing-foundation'],
    successPatterns: [
      'lagrangeEval.*sum|lagrangeEval.*foldl',
      'modInverse.*xi.*xj|modInverse.*x_i.*x_j',
      'x\\s*-\\s*xj|x\\s*-\\s*x_j',
      '`mod`\\s+p',
    ],
    testNames: [
      'lagrange linear y=2x at x=3',
      'lagrange linear at known point x=1',
      'lagrange linear at known point x=2',
      'lagrange quadratic y=x^2 at x=4',
      'lagrange quadratic at known point x=1',
      'lagrange quadratic y=x^2 at x=5 (25 mod 23 = 2)',
      'lagrange single point is constant',
    ],
  },

  'shamir-secret-sharing': {
    id: 'shamir-secret-sharing',
    title: "Shamir's Secret Sharing",
    difficulty: 'advanced',
    order: 3,
    description: `
<p><strong>Shamir's Secret Sharing</strong> is one of the most elegant applications of polynomial interpolation to cryptography. It lets you split a secret into <em>n</em> shares such that any <em>t</em> shares can reconstruct the secret, but fewer than <em>t</em> shares reveal <strong>nothing</strong> at all.</p>

<h3>The Idea</h3>
<p>A polynomial of degree <em>t-1</em> is uniquely determined by <em>t</em> points. So:</p>
<ol>
  <li>Pick a random polynomial of degree <em>t-1</em> whose constant term is the secret</li>
  <li>Evaluate it at <em>n</em> different points to create <em>n</em> shares</li>
  <li>Any <em>t</em> shares determine the polynomial (via Lagrange interpolation), and the secret is the value at x=0</li>
</ol>

<h3>Creating Shares</h3>
<p>Given a secret <code>s</code>, random coefficients <code>[a_1, ..., a_{t-1}]</code>, and a prime <code>p</code>:</p>
<pre><code>-- The polynomial: f(x) = s + a_1*x + a_2*x^2 + ... + a_{t-1}*x^{t-1}
-- Shares: (1, f(1)), (2, f(2)), ..., (n, f(n))   all mod p</code></pre>

<h3>Reconstructing the Secret</h3>
<p>Given <em>t</em> or more shares, use Lagrange interpolation at <code>x = 0</code> to recover <code>f(0) = s</code>.</p>

<h3>Example: (2,3)-threshold, p = 97</h3>
<pre><code>-- Secret: 42, random coefficient: [7]
-- Polynomial: f(x) = 42 + 7x
-- Shares: (1, 49), (2, 56), (3, 63)
-- Any 2 shares reconstruct 42 via lagrangeEval at x=0</code></pre>

<h3>Security</h3>
<p>With fewer than <em>t</em> shares, the secret is <strong>information-theoretically secure</strong> &mdash; not just computationally hard to find, but literally impossible. Every possible secret value is equally consistent with the shares you have. This is the gold standard of secrecy.</p>

<h3>Your Task</h3>
<p>Implement <code>createShares</code> to generate shares from a secret, and <code>reconstructSecret</code> to recover the secret from a sufficient number of shares.</p>
`,
    starterCode: `module ShamirSecretSharing where

-- Helper: modular exponentiation
modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

-- Helper: extended GCD
extGcd :: Integer -> Integer -> (Integer, Integer, Integer)
extGcd a 0 = (a, 1, 0)
extGcd a b = let (g, x, y) = extGcd b (a \`mod\` b)
             in  (g, y, x - (a \`div\` b) * y)

-- Helper: modular inverse
modInverse :: Integer -> Integer -> Integer
modInverse a p = let (_, x, _) = extGcd (a \`mod\` p + p) p
                 in  x \`mod\` p

-- Helper: evaluate polynomial (Horner's method)
--   Poly is represented as [Integer], low-degree first
polyEval :: Integer -> [Integer] -> Integer -> Integer
polyEval p cs x = foldr (\\c acc -> (c + x * acc) \`mod\` p) 0 cs

-- Helper: Lagrange interpolation at a point
lagrangeEval :: Integer -> [(Integer, Integer)] -> Integer -> Integer
lagrangeEval p points x = sum terms \`mod\` p
  where
    terms = [ (yi * basis i xi) \`mod\` p | (i, (xi, yi)) <- zip [0..] points ]
    basis i xi = foldl (\\acc (j, (xj, _)) ->
        if i == j then acc
        else (acc * ((x - xj) \`mod\` p + p) \`mod\` p * modInverse (((xi - xj) \`mod\` p + p) \`mod\` p) p) \`mod\` p
      ) 1 (zip [0..] points)

-- 1. Create n shares for a (t,n)-threshold scheme.
--    The polynomial is: secret + coeffs[0]*x + coeffs[1]*x^2 + ...
--    Evaluate at x = 1, 2, ..., n
--    The length of coeffs determines the threshold: t = length coeffs + 1
--
--    Example: createShares 97 42 [7] 3 = [(1,49),(2,56),(3,63)]
createShares :: Integer -> Integer -> [Integer] -> Int -> [(Integer, Integer)]
createShares p secret coeffs n = error "create shares by evaluating the polynomial"

-- 2. Reconstruct the secret from shares.
--    Use Lagrange interpolation at x = 0.
--
--    Example: reconstructSecret 97 [(1,49),(2,56)] = 42
reconstructSecret :: Integer -> [(Integer, Integer)] -> Integer
reconstructSecret p shares = error "use lagrangeEval at x=0"
`,
    solutionCode: `module ShamirSecretSharing where

modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

extGcd :: Integer -> Integer -> (Integer, Integer, Integer)
extGcd a 0 = (a, 1, 0)
extGcd a b = let (g, x, y) = extGcd b (a \`mod\` b)
             in  (g, y, x - (a \`div\` b) * y)

modInverse :: Integer -> Integer -> Integer
modInverse a p = let (_, x, _) = extGcd (a \`mod\` p + p) p
                 in  x \`mod\` p

polyEval :: Integer -> [Integer] -> Integer -> Integer
polyEval p cs x = foldr (\\c acc -> (c + x * acc) \`mod\` p) 0 cs

lagrangeEval :: Integer -> [(Integer, Integer)] -> Integer -> Integer
lagrangeEval p points x = sum terms \`mod\` p
  where
    terms = [ (yi * basis i xi) \`mod\` p | (i, (xi, yi)) <- zip [0..] points ]
    basis i xi = foldl (\\acc (j, (xj, _)) ->
        if i == j then acc
        else (acc * ((x - xj) \`mod\` p + p) \`mod\` p * modInverse (((xi - xj) \`mod\` p + p) \`mod\` p) p) \`mod\` p
      ) 1 (zip [0..] points)

createShares :: Integer -> Integer -> [Integer] -> Int -> [(Integer, Integer)]
createShares p secret coeffs n =
  [ (fromIntegral i, polyEval p (secret : coeffs) (fromIntegral i)) | i <- [1..n] ]

reconstructSecret :: Integer -> [(Integer, Integer)] -> Integer
reconstructSecret p shares = lagrangeEval p shares 0
`,
    testCode: `runTestEq "createShares (2,3) secret=42 coeff=[7] p=97 share1" (1 :: Integer, 49 :: Integer) (head (createShares 97 42 [7] 3))
        , runTestEq "createShares (2,3) share2" (2 :: Integer, 56 :: Integer) ((createShares 97 42 [7] 3) !! 1)
        , runTestEq "createShares (2,3) share3" (3 :: Integer, 63 :: Integer) ((createShares 97 42 [7] 3) !! 2)
        , runTestEq "reconstruct from shares 1,2" (42 :: Integer) (reconstructSecret 97 [(1,49),(2,56)])
        , runTestEq "reconstruct from shares 1,3" (42 :: Integer) (reconstructSecret 97 [(1,49),(3,63)])
        , runTestEq "reconstruct from shares 2,3" (42 :: Integer) (reconstructSecret 97 [(2,56),(3,63)])
        , runTestEq "createShares (3,5) p=257 share1" (1 :: Integer, 117 :: Integer) (head (createShares 257 100 [14,3] 5))
        , runTestEq "createShares (3,5) p=257 share2" (2 :: Integer, 140 :: Integer) ((createShares 257 100 [14,3] 5) !! 1)
        , runTestEq "reconstruct (3,5) from 3 shares" (100 :: Integer) (reconstructSecret 257 [(1,117),(2,140),(3,169)])
        , runTestEq "reconstruct (3,5) from different 3" (100 :: Integer) (reconstructSecret 257 [(2,140),(4,204),(5,245)])`,
    hints: [
      'For <code>createShares</code>: the polynomial is <code>secret : coeffs</code> (a list with secret as the constant term). Evaluate it at <code>x = 1, 2, ..., n</code> using <code>polyEval</code>.',
      'For <code>reconstructSecret</code>: this is just <code>lagrangeEval p shares 0</code> &mdash; interpolate at x=0 to recover the constant term.',
      'Use a list comprehension: <code>[(fromIntegral i, polyEval p (secret : coeffs) (fromIntegral i)) | i <- [1..n]]</code>.',
      'The <code>(2,3)</code> scheme uses a degree-1 polynomial (line), the <code>(3,5)</code> scheme uses degree-2 (parabola). The threshold <code>t = length coeffs + 1</code>.',
    ],
    concepts: ['secret-sharing', 'threshold-scheme', 'lagrange-interpolation', 'information-theoretic-security', 'polynomial-evaluation'],
    successPatterns: [
      'polyEval.*secret\\s*:\\s*coeffs',
      'lagrangeEval.*0|lagrangeEval.*shares.*0',
      'fromIntegral.*\\[1\\.\\.n\\]',
      'reconstructSecret.*lagrangeEval.*shares',
    ],
    testNames: [
      'createShares (2,3) share 1 = (1,49)',
      'createShares (2,3) share 2 = (2,56)',
      'createShares (2,3) share 3 = (3,63)',
      'reconstruct secret from shares 1,2',
      'reconstruct secret from shares 1,3',
      'reconstruct secret from shares 2,3',
      'createShares (3,5) share 1 = (1,117)',
      'createShares (3,5) share 2 = (2,140)',
      'reconstruct (3,5) from 3 shares',
      'reconstruct (3,5) from different 3 shares',
    ],
  },

  'schnorr-protocol': {
    id: 'schnorr-protocol',
    title: 'Schnorr Identification Protocol',
    difficulty: 'advanced',
    order: 4,
    description: `
<p>The <strong>Schnorr identification protocol</strong> is a foundational <strong>sigma protocol</strong> &mdash; an interactive proof that lets a prover convince a verifier they know a secret, without revealing the secret itself. It is the basis of Schnorr signatures (used in Bitcoin's Taproot) and a stepping stone to general zero-knowledge proofs.</p>

<h3>Sigma Protocols</h3>
<p>A sigma protocol has three moves (forming the Greek letter &Sigma;):</p>
<ol>
  <li><strong>Commitment:</strong> The prover picks a random <code>k</code> and sends <code>r = g^k mod p</code></li>
  <li><strong>Challenge:</strong> The verifier sends a random challenge <code>c</code></li>
  <li><strong>Response:</strong> The prover computes <code>s = (k - c * x) mod q</code> and sends <code>s</code></li>
</ol>
<p>The verifier accepts if <code>g^s * y^c mod p == r</code>.</p>

<h3>Why It Works (Algebraically)</h3>
<p>The prover's public key is <code>y = g^x mod p</code>. The verification equation:</p>
<pre><code>g^s * y^c  =  g^(k - c*x) * g^(x*c)    (substituting s and y)
            =  g^(k - c*x + x*c)
            =  g^k
            =  r</code></pre>
<p>The exponents cancel perfectly &mdash; this is the algebraic structure that makes the protocol sound.</p>

<h3>Honest-Verifier Zero-Knowledge</h3>
<p>If the verifier is honest (picks <code>c</code> randomly), the transcript <code>(r, c, s)</code> reveals nothing about <code>x</code>. Why? Because for any challenge <code>c</code>, a simulator can produce a valid-looking transcript without knowing <code>x</code> &mdash; just pick a random <code>s</code>, compute <code>r = g^s * y^c mod p</code>, and the transcript is indistinguishable from a real one.</p>

<h3>Parameters</h3>
<p>We need a prime <code>p</code> and a prime <code>q</code> that divides <code>p-1</code>, with a generator <code>g</code> of order <code>q</code> in Z/pZ:</p>
<pre><code>-- p=23, q=11: since 23-1 = 22 = 2*11, and 2^11 mod 23 = 1
-- So g=2 has order 11 mod 23</code></pre>

<h3>Example: p=23, q=11, g=2</h3>
<table>
  <thead><tr><th>Step</th><th>Value</th></tr></thead>
  <tbody>
    <tr><td>Secret key x</td><td>7</td></tr>
    <tr><td>Public key y = g^x mod p</td><td>2^7 mod 23 = 13</td></tr>
    <tr><td>Random k</td><td>3</td></tr>
    <tr><td>Commitment r = g^k mod p</td><td>2^3 mod 23 = 8</td></tr>
    <tr><td>Challenge c</td><td>5</td></tr>
    <tr><td>Response s = (k - c*x) mod q</td><td>(3 - 35) mod 11 = 1</td></tr>
    <tr><td>Verify: g^s * y^c mod p</td><td>2^1 * 13^5 mod 23 = 2 * 4 mod 23 = 8 = r</td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Implement the three phases of the Schnorr protocol (commit, respond, verify) and a function that simulates a full protocol run, returning whether verification succeeds.</p>
`,
    starterCode: `module SchnorrProtocol where

-- Helper: modular exponentiation
modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

-- Schnorr parameters: prime p, subgroup order q, generator g
data SchnorrParams = SP { spP :: Integer, spQ :: Integer, spG :: Integer }
  deriving (Show)

-- 1. Commitment phase: compute r = g^k mod p
--    The prover picks a random k and sends r to the verifier.
schnorrCommit :: SchnorrParams -> Integer -> Integer
schnorrCommit params k = error "compute g^k mod p"

-- 2. Response phase: compute s = (k - c * x) mod q
--    The prover uses their secret x, the random k, and the challenge c.
schnorrRespond :: SchnorrParams -> Integer -> Integer -> Integer -> Integer
schnorrRespond params x k c = error "compute (k - c * x) mod q"

-- 3. Verification: check that g^s * y^c mod p == r
--    y is the public key (g^x mod p), r is the commitment, c is the challenge, s is the response.
schnorrVerify :: SchnorrParams -> Integer -> Integer -> Integer -> Integer -> Bool
schnorrVerify params y r c s = error "check g^s * y^c mod p == r"

-- 4. Simulate a full protocol run.
--    Given params, secret x, random k, and challenge c:
--      - Compute public key y = g^x mod p
--      - Compute commitment r = g^k mod p
--      - Compute response s
--      - Return whether verification succeeds
simulateProtocol :: SchnorrParams -> Integer -> Integer -> Integer -> Bool
simulateProtocol params x k c = error "run full protocol and return verification result"
`,
    solutionCode: `module SchnorrProtocol where

modExp :: Integer -> Integer -> Integer -> Integer
modExp _ 0 _ = 1
modExp base expo m
  | even expo = modExp (base * base \`mod\` m) (expo \`div\` 2) m
  | otherwise = base * modExp base (expo - 1) m \`mod\` m

data SchnorrParams = SP { spP :: Integer, spQ :: Integer, spG :: Integer }
  deriving (Show)

schnorrCommit :: SchnorrParams -> Integer -> Integer
schnorrCommit params k = modExp (spG params) k (spP params)

schnorrRespond :: SchnorrParams -> Integer -> Integer -> Integer -> Integer
schnorrRespond params x k c = (k - c * x) \`mod\` (spQ params)

schnorrVerify :: SchnorrParams -> Integer -> Integer -> Integer -> Integer -> Bool
schnorrVerify params y r c s =
  (modExp (spG params) s (spP params) * modExp y c (spP params)) \`mod\` (spP params) == r

simulateProtocol :: SchnorrParams -> Integer -> Integer -> Integer -> Bool
simulateProtocol params x k c =
  let y = modExp (spG params) x (spP params)
      r = schnorrCommit params k
      s = schnorrRespond params x k c
  in  schnorrVerify params y r c s
`,
    testCode: `runTestEq "commit: g^3 mod 23 = 8" (8 :: Integer) (schnorrCommit (SP 23 11 2) 3)
        , runTestEq "commit: g^0 mod 23 = 1" (1 :: Integer) (schnorrCommit (SP 23 11 2) 0)
        , runTestEq "respond: (3 - 5*7) mod 11 = 1" (1 :: Integer) (schnorrRespond (SP 23 11 2) 7 3 5)
        , runTestEq "verify: g^1 * 13^5 mod 23 = 8" True (schnorrVerify (SP 23 11 2) 13 8 5 1)
        , runTestEq "verify: wrong r fails" False (schnorrVerify (SP 23 11 2) 13 9 5 1)
        , runTestEq "verify: wrong s fails" False (schnorrVerify (SP 23 11 2) 13 8 5 2)
        , runTestEq "protocol succeeds with correct secret" True (simulateProtocol (SP 23 11 2) 7 3 5)
        , runTestEq "protocol succeeds with different k,c" True (simulateProtocol (SP 23 11 2) 7 9 3)
        , runTestEq "protocol fails with wrong secret" False (let params = SP 23 11 2 in schnorrVerify params (modExp 2 8 23) (schnorrCommit params 3) 5 (schnorrRespond params 7 3 5))
        , runTestEq "protocol succeeds with x=1" True (simulateProtocol (SP 23 11 2) 1 5 7)`,
    hints: [
      'For <code>schnorrCommit</code>: just <code>modExp (spG params) k (spP params)</code>.',
      'For <code>schnorrRespond</code>: <code>(k - c * x) \\`mod\\` (spQ params)</code>. Haskell\'s <code>mod</code> always returns a non-negative result for a positive modulus.',
      'For <code>schnorrVerify</code>: compute <code>(modExp g s p * modExp y c p) \\`mod\\` p</code> and check equality with <code>r</code>.',
      'For <code>simulateProtocol</code>: compute <code>y = modExp g x p</code>, then call <code>schnorrCommit</code>, <code>schnorrRespond</code>, and <code>schnorrVerify</code> in sequence.',
    ],
    concepts: ['sigma-protocol', 'zero-knowledge-proof', 'schnorr-identification', 'discrete-logarithm', 'honest-verifier-ZK'],
    successPatterns: [
      'modExp.*spG.*spP',
      'k\\s*-\\s*c\\s*\\*\\s*x.*mod.*spQ',
      'modExp.*spG.*\\*.*modExp.*y.*c',
      'schnorrVerify\\s+params\\s+y\\s+r\\s+c\\s+s',
    ],
    testNames: [
      'commit g^3 mod 23 = 8',
      'commit g^0 mod 23 = 1',
      'respond (3 - 5*7) mod 11 = 1',
      'verify correct transcript',
      'verify rejects wrong commitment',
      'verify rejects wrong response',
      'full protocol with correct secret',
      'full protocol with different randomness',
      'protocol fails with wrong secret',
      'full protocol with x=1',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // APPLIED CATEGORY THEORY MODULE
  // ═══════════════════════════════════════════════════════════════════

  'state-monad': {
    id: 'state-monad',
    title: 'State Monad from Scratch',
    difficulty: 'intermediate',
    order: 1,
    description: `
<h3>Stateful Computation Without Mutation</h3>
<p>In imperative languages, you modify variables in place. In Haskell, we model state by <strong>threading</strong> a value through a chain of functions. The <code>State</code> monad wraps this pattern into a clean abstraction.</p>

<h3>The State Type</h3>
<pre><code>newtype State s a = State { runState :: s -> (a, s) }</code></pre>
<p>A <code>State s a</code> is a function that takes a current state of type <code>s</code> and returns:</p>
<ul>
  <li>A result of type <code>a</code></li>
  <li>A new state of type <code>s</code></li>
</ul>
<p>Think of it like a slot machine: you put in a state, and out comes a value plus the updated state.</p>

<h3>Why Build It Ourselves?</h3>
<p>Libraries provide <code>State</code>, but implementing it from scratch teaches the core idea: <strong>monads are just functions in disguise</strong>. The Functor/Applicative/Monad hierarchy threads the state automatically.</p>

<h3>The Typeclass Hierarchy</h3>
<p>GHC 9.6 requires the <strong>Applicative-Monad Proposal (AMP)</strong>: every Monad must also be a Functor and Applicative. You must define all three instances, in order:</p>
<table>
  <thead><tr><th>Instance</th><th>Key Idea</th></tr></thead>
  <tbody>
    <tr><td>Functor</td><td>Apply a function to the result, pass state through</td></tr>
    <tr><td>Applicative</td><td><code>pure</code> wraps a value without changing state; <code>&lt;*&gt;</code> threads state through two computations</td></tr>
    <tr><td>Monad</td><td><code>&gt;&gt;=</code> chains stateful computations, passing updated state forward</td></tr>
  </tbody>
</table>

<h3>Helpers</h3>
<ul>
  <li><code>get</code> — returns the current state as the result (and leaves state unchanged)</li>
  <li><code>put s</code> — replaces the state with <code>s</code>, returning <code>()</code></li>
  <li><code>modify f</code> — applies <code>f</code> to the current state</li>
</ul>

<h3>Worked Example</h3>
<pre><code>-- A "tick" increments the counter state by 1
tick :: State Int ()
tick = modify (+1)

-- Count three operations
countOps :: (Int, Int)
countOps = runState (tick >> tick >> tick >> get) 0
-- Result: (3, 3)   -- get returns the state (3), final state is also 3</code></pre>

<h3>Your Task</h3>
<p>Implement <code>Functor</code>, <code>Applicative</code>, and <code>Monad</code> instances for <code>State</code>, plus the three helpers <code>get</code>, <code>put</code>, and <code>modify</code>, and a <code>tick</code> function that increments the state.</p>
`,
    starterCode: `module StateMonad where

newtype State s a = State { runState :: s -> (a, s) }

-- EXERCISE: Implement all instances and helpers.

-- 1. Functor instance
--    fmap applies f to the result, leaving the state alone.
--    Unwrap with runState or pattern match: State g
--    Then: \\s -> let (a, s') = g s in (f a, s')
instance Functor (State s) where
  fmap f (State g) = error "implement fmap"

-- 2. Applicative instance
--    pure: wrap a value, don't touch the state
--    (<*>): run sf to get (f, s'), run sa with s' to get (a, s''), return (f a, s'')
instance Applicative (State s) where
  pure a = error "implement pure"
  State sf <*> State sa = error "implement (<*>)"

-- 3. Monad instance
--    (>>=): run sa to get (a, s'), then run (f a) with s'
instance Monad (State s) where
  State sa >>= f = error "implement (>>=)"

-- 4. get: return the current state as the result
get :: State s s
get = error "implement get"

-- 5. put: replace the state, return ()
put :: s -> State s ()
put s = error "implement put"

-- 6. modify: apply a function to the state
modify :: (s -> s) -> State s ()
modify f = error "implement modify"

-- 7. tick: increment an Int state by 1
tick :: State Int ()
tick = error "implement using modify"

-- 8. countOps: run three ticks then get the count
--    Should satisfy: countOps == (3, 3)
countOps :: (Int, Int)
countOps = runState (tick >> tick >> tick >> get) 0
`,
    solutionCode: `module StateMonad where

newtype State s a = State { runState :: s -> (a, s) }

instance Functor (State s) where
  fmap f (State g) = State $ \\s -> let (a, s') = g s in (f a, s')

instance Applicative (State s) where
  pure a = State $ \\s -> (a, s)
  State sf <*> State sa = State $ \\s ->
    let (f, s')  = sf s
        (a, s'') = sa s'
    in (f a, s'')

instance Monad (State s) where
  State sa >>= f = State $ \\s ->
    let (a, s') = sa s
    in runState (f a) s'

get :: State s s
get = State $ \\s -> (s, s)

put :: s -> State s ()
put s = State $ \\_ -> ((), s)

modify :: (s -> s) -> State s ()
modify f = State $ \\s -> ((), f s)

tick :: State Int ()
tick = modify (+1)

countOps :: (Int, Int)
countOps = runState (tick >> tick >> tick >> get) 0
`,
    testCode: `runTestEq "pure 42 with state 0" (42 :: Int, 0 :: Int) (runState (pure 42) 0)
        , runTestEq "fmap (+1) (pure 5) with state 0" (6 :: Int, 0 :: Int) (runState (fmap (+1) (pure 5)) (0 :: Int))
        , runTestEq "get with state 7" (7 :: Int, 7 :: Int) (runState get 7)
        , runTestEq "put 5 with state 0" ((), 5 :: Int) (runState (put 5) (0 :: Int))
        , runTestEq "modify (+10) with state 5" ((), 15 :: Int) (runState (modify (+10)) (5 :: Int))
        , runTestEq "tick from 0" ((), 1 :: Int) (runState tick 0)
        , runTestEq "tick >> tick from 0" ((), 2 :: Int) (runState (tick >> tick) 0)
        , runTestEq "countOps == (3,3)" (3 :: Int, 3 :: Int) countOps
        , runTestEq "get >>= put from 10" ((), 10 :: Int) (runState (get >>= put) (10 :: Int))
        , runTestEq "put 99 >> get" (99 :: Int, 99 :: Int) (runState (put 99 >> get) (0 :: Int))`,
    hints: [
      'For <code>fmap</code>: pattern match <code>State g</code>, then <code>State $ \\s -> let (a, s1) = g s in (f a, s1)</code>. Apply <code>f</code> only to the result, not the state.',
      'For <code>pure</code>: <code>State $ \\s -> (a, s)</code> — wrap the value, pass state through unchanged.',
      'For <code>&gt;&gt;=</code>: run the first computation to get <code>(a, s1)</code>, then <code>runState (f a) s1</code> — the key is threading the updated state.',
      'For <code>get</code>: <code>State $ \\s -> (s, s)</code>. For <code>put</code>: <code>State $ \\_ -> ((), s)</code>. For <code>modify</code>: <code>State $ \\s -> ((), f s)</code>.',
    ],
    concepts: ['state-monad', 'functor', 'applicative', 'monad', 'AMP', 'stateful-computation'],
    successPatterns: [
      'fmap\\s+f\\s+\\(State',
      'pure\\s+a\\s*=\\s*State',
      'runState\\s*\\(f\\s+a\\)\\s*s',
      'get\\s*=\\s*State',
    ],
    testNames: [
      'pure wraps value without changing state',
      'fmap applies function to result only',
      'get returns current state',
      'put replaces the state',
      'modify applies function to state',
      'single tick increments',
      'two ticks increment twice',
      'countOps returns (3,3)',
      'get >>= put is identity on state',
      'put then get returns new state',
    ],
  },

  'reader-monad': {
    id: 'reader-monad',
    title: 'Reader Monad from Scratch',
    difficulty: 'intermediate',
    order: 2,
    description: `
<h3>Implicit Configuration</h3>
<p>Many programs need to read configuration or environment values. Instead of passing a config argument through every function, the <code>Reader</code> monad threads it automatically — like a read-only environment available everywhere.</p>

<h3>The Reader Type</h3>
<pre><code>newtype Reader r a = Reader { runReader :: r -> a }</code></pre>
<p>A <code>Reader r a</code> is a function from an environment <code>r</code> to a result <code>a</code>. The environment is available everywhere but cannot be modified (unlike State).</p>

<h3>Typeclass Instances</h3>
<table>
  <thead><tr><th>Instance</th><th>Key Idea</th></tr></thead>
  <tbody>
    <tr><td>Functor</td><td><code>fmap f (Reader g) = Reader (f . g)</code> — compose <code>f</code> after the reader function</td></tr>
    <tr><td>Applicative</td><td><code>pure</code> ignores the environment; <code>&lt;*&gt;</code> passes the same environment to both sides</td></tr>
    <tr><td>Monad</td><td><code>&gt;&gt;=</code> runs the first reader, passes its result to <code>f</code>, and gives both the same environment</td></tr>
  </tbody>
</table>

<h3>Helpers</h3>
<ul>
  <li><code>ask</code> — returns the entire environment as the result</li>
  <li><code>local f m</code> — runs <code>m</code> with a modified environment (<code>f</code> is applied before reading)</li>
</ul>

<h3>Worked Example</h3>
<pre><code>data Config = Config { appName :: String, maxRetries :: Int }
  deriving (Show, Eq)

greetUser :: String -> Reader Config String
greetUser user = do
  config <- ask
  return (user ++ " logged into " ++ appName config)

-- runReader (greetUser "Alice") (Config "MyApp" 3)
-- => "Alice logged into MyApp"</code></pre>

<h3>Your Task</h3>
<p>Implement the Functor, Applicative, and Monad instances for <code>Reader</code>, plus <code>ask</code>, <code>local</code>, and a <code>greetUser</code> function that reads from a <code>Config</code>.</p>
`,
    starterCode: `module ReaderMonad where

newtype Reader r a = Reader { runReader :: r -> a }

-- EXERCISE: Implement all instances and helpers.

-- 1. Functor: compose f after the reader function
instance Functor (Reader r) where
  fmap f (Reader g) = error "implement fmap"

-- 2. Applicative: pure ignores env; (<*>) passes same env to both
instance Applicative (Reader r) where
  pure a = error "implement pure"
  Reader rf <*> Reader ra = error "implement (<*>)"

-- 3. Monad: run first reader, pass result to f, same environment
instance Monad (Reader r) where
  Reader ra >>= f = error "implement (>>=)"

-- 4. ask: return the environment itself
ask :: Reader r r
ask = error "implement ask"

-- 5. local: run a reader with a modified environment
local :: (r -> r) -> Reader r a -> Reader r a
local f (Reader g) = error "implement local"

-- Config type for the use-case
data Config = Config { appName :: String, maxRetries :: Int }
  deriving (Show, Eq)

-- 6. greetUser: read the config and produce a greeting
--    greetUser "Alice" with Config "MyApp" 3 => "Alice logged into MyApp"
greetUser :: String -> Reader Config String
greetUser user = error "use ask to read config, return greeting"

-- 7. retryMsg: read config and return "Will retry N times"
retryMsg :: Reader Config String
retryMsg = error "use ask to read maxRetries from config"
`,
    solutionCode: `module ReaderMonad where

newtype Reader r a = Reader { runReader :: r -> a }

instance Functor (Reader r) where
  fmap f (Reader g) = Reader (f . g)

instance Applicative (Reader r) where
  pure a = Reader $ \\_ -> a
  Reader rf <*> Reader ra = Reader $ \\r -> rf r (ra r)

instance Monad (Reader r) where
  Reader ra >>= f = Reader $ \\r -> runReader (f (ra r)) r

ask :: Reader r r
ask = Reader id

local :: (r -> r) -> Reader r a -> Reader r a
local f (Reader g) = Reader (g . f)

data Config = Config { appName :: String, maxRetries :: Int }
  deriving (Show, Eq)

greetUser :: String -> Reader Config String
greetUser user = do
  config <- ask
  return (user ++ " logged into " ++ appName config)

retryMsg :: Reader Config String
retryMsg = do
  config <- ask
  return ("Will retry " ++ show (maxRetries config) ++ " times")
`,
    testCode: `runTestEq "runReader ask 5" (5 :: Int) (runReader ask 5)
        , runTestEq "runReader (pure 42) 0" (42 :: Int) (runReader (pure 42) (0 :: Int))
        , runTestEq "fmap (+1) ask with 5" (6 :: Int) (runReader (fmap (+1) ask) (5 :: Int))
        , runTestEq "local (+1) ask with 5" (6 :: Int) (runReader (local (+1) ask) (5 :: Int))
        , runTestEq "local (*2) ask with 3" (6 :: Int) (runReader (local (*2) ask) (3 :: Int))
        , runTestEq "ask unchanged after local" (5 :: Int) (runReader (local (+1) ask >> ask) (5 :: Int))
        , runTestEq "greetUser Alice" "Alice logged into MyApp" (runReader (greetUser "Alice") (Config "MyApp" 3))
        , runTestEq "greetUser Bob" "Bob logged into TestApp" (runReader (greetUser "Bob") (Config "TestApp" 5))
        , runTestEq "retryMsg" "Will retry 3 times" (runReader retryMsg (Config "MyApp" 3))
        , runTestEq "retryMsg with 10" "Will retry 10 times" (runReader retryMsg (Config "X" 10))`,
    hints: [
      'For <code>fmap</code>: <code>Reader (f . g)</code> — compose <code>f</code> after the reader function <code>g</code>.',
      'For <code>pure</code>: <code>Reader $ \\_ -> a</code>. For <code>&lt;*&gt;</code>: <code>Reader $ \\r -> rf r (ra r)</code> — both functions receive the same environment.',
      'For <code>&gt;&gt;=</code>: <code>Reader $ \\r -> runReader (f (ra r)) r</code>. Run <code>ra</code> to get the value, apply <code>f</code>, then run the resulting reader with the same <code>r</code>.',
      'For <code>greetUser</code>: use <code>do { config &lt;- ask; return (user ++ " logged into " ++ appName config) }</code>.',
    ],
    concepts: ['reader-monad', 'functor', 'applicative', 'monad', 'AMP', 'environment', 'configuration'],
    successPatterns: [
      'fmap\\s+f\\s+\\(Reader\\s+g\\)\\s*=\\s*Reader\\s*\\(f\\s*\\.\\s*g\\)',
      'ask\\s*=\\s*Reader\\s+id',
      'local.*Reader.*\\.\\s*f',
      'config\\s*<-\\s*ask',
    ],
    testNames: [
      'ask returns the environment',
      'pure ignores the environment',
      'fmap composes over result',
      'local modifies environment for inner reader',
      'local multiplies environment',
      'ask after local sees original environment',
      'greetUser Alice with MyApp config',
      'greetUser Bob with TestApp config',
      'retryMsg reads maxRetries',
      'retryMsg with different config',
    ],
  },

  'monad-transformers': {
    id: 'monad-transformers',
    title: 'Monad Transformers: StateT',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>Combining Effects</h3>
<p>What if you need <strong>both</strong> state and the ability to fail? The <code>State</code> monad handles state, <code>Maybe</code> handles failure, but you can't use both at once — unless you <strong>stack</strong> them with a <em>monad transformer</em>.</p>

<h3>The StateT Transformer</h3>
<pre><code>newtype StateT s m a = StateT { runStateT :: s -> m (a, s) }</code></pre>
<p>Compare with plain <code>State</code>:</p>
<table>
  <thead><tr><th>Type</th><th>Wrapped function</th></tr></thead>
  <tbody>
    <tr><td><code>State s a</code></td><td><code>s -> (a, s)</code></td></tr>
    <tr><td><code>StateT s m a</code></td><td><code>s -> m (a, s)</code></td></tr>
  </tbody>
</table>
<p>The only difference: the result pair <code>(a, s)</code> is now wrapped in an inner monad <code>m</code>. When <code>m = Maybe</code>, any step can fail, aborting the entire chain.</p>

<h3>Instances</h3>
<p>The Functor, Applicative, and Monad instances all delegate to the inner monad <code>m</code>:</p>
<ul>
  <li><strong>Functor:</strong> <code>fmap f (StateT g) = StateT $ \\s -> fmap (\\(a,s') -> (f a, s')) (g s)</code></li>
  <li><strong>Monad:</strong> Run the first computation, use <code>&gt;&gt;=</code> on the inner monad to thread the state</li>
</ul>

<h3>The lift Function</h3>
<p><code>lift</code> injects a plain <code>m a</code> action into the transformer:</p>
<pre><code>lift :: Monad m => m a -> StateT s m a
lift ma = StateT $ \\s -> fmap (\\a -> (a, s)) ma</code></pre>

<h3>Use Case: Safe Stack</h3>
<pre><code>type SafeStack a = StateT [Int] Maybe a

safePush :: Int -> SafeStack ()
safePush x = StateT $ \\xs -> Just ((), x:xs)

safePop :: SafeStack Int
safePop = StateT $ \\xs -> case xs of
  []     -> Nothing      -- fail! stack is empty
  (h:t)  -> Just (h, t)  -- succeed with top element</code></pre>
<p>Popping from an empty stack gives <code>Nothing</code>, and the failure propagates through the entire chain.</p>

<h3>Example</h3>
<pre><code>runStateT (safePush 5) []         -- Just ((), [5])
runStateT safePop []              -- Nothing
runStateT safePop [1,2,3]         -- Just (1, [2,3])
runStateT (safePop >> safePop) [1]  -- Nothing (second pop fails)</code></pre>

<h3>Your Task</h3>
<p>Implement <code>StateT</code> with its Functor, Applicative, Monad instances, <code>lift</code>, and the safe stack operations.</p>
`,
    starterCode: `module MonadTransformers where

newtype StateT s m a = StateT { runStateT :: s -> m (a, s) }

-- EXERCISE: Implement all instances and the safe stack.

-- 1. Functor (requires Functor m)
instance Functor m => Functor (StateT s m) where
  fmap f (StateT g) = error "implement fmap"

-- 2. Applicative (requires Monad m — we use monadic bind in the implementation)
instance Monad m => Applicative (StateT s m) where
  pure a = error "implement pure"
  StateT sf <*> StateT sa = error "implement (<*>)"

-- 3. Monad (requires Monad m)
instance Monad m => Monad (StateT s m) where
  StateT sa >>= f = error "implement (>>=)"

-- 4. lift: inject an inner monad action into StateT
lift :: Monad m => m a -> StateT s m a
lift ma = error "implement lift"

-- 5. Safe stack using StateT [Int] Maybe

safePush :: Int -> StateT [Int] Maybe ()
safePush x = error "push x onto the stack, always succeeds"

safePop :: StateT [Int] Maybe Int
safePop = error "pop from stack, Nothing if empty"

-- 6. safeAdd: pop two values, push their sum
--    Fails if fewer than 2 elements on the stack
safeAdd :: StateT [Int] Maybe ()
safeAdd = error "pop twice, push the sum"
`,
    solutionCode: `module MonadTransformers where

newtype StateT s m a = StateT { runStateT :: s -> m (a, s) }

instance Functor m => Functor (StateT s m) where
  fmap f (StateT g) = StateT $ \\s -> fmap (\\(a, s') -> (f a, s')) (g s)

instance Monad m => Applicative (StateT s m) where
  pure a = StateT $ \\s -> return (a, s)
  StateT sf <*> StateT sa = StateT $ \\s -> do
    (f, s')  <- sf s
    (a, s'') <- sa s'
    return (f a, s'')

instance Monad m => Monad (StateT s m) where
  StateT sa >>= f = StateT $ \\s -> do
    (a, s') <- sa s
    runStateT (f a) s'

lift :: Monad m => m a -> StateT s m a
lift ma = StateT $ \\s -> fmap (\\a -> (a, s)) ma

safePush :: Int -> StateT [Int] Maybe ()
safePush x = StateT $ \\xs -> Just ((), x:xs)

safePop :: StateT [Int] Maybe Int
safePop = StateT $ \\xs -> case xs of
  []    -> Nothing
  (h:t) -> Just (h, t)

safeAdd :: StateT [Int] Maybe ()
safeAdd = do
  a <- safePop
  b <- safePop
  safePush (a + b)
`,
    testCode: `runTestEq "safePush 5 onto []" (Just ((), [5])) (runStateT (safePush 5) [])
        , runTestEq "safePush 3 onto [1,2]" (Just ((), [3,1,2])) (runStateT (safePush 3) [1,2])
        , runTestEq "safePop from []" (Nothing :: Maybe (Int, [Int])) (runStateT safePop [])
        , runTestEq "safePop from [1,2,3]" (Just (1, [2,3])) (runStateT safePop [1,2,3])
        , runTestEq "safePop >> safePop from [1]" (Nothing :: Maybe (Int, [Int])) (runStateT (safePop >> safePop) [1])
        , runTestEq "safePop >> safePop from [1,2]" (Just (2, [])) (runStateT (safePop >> safePop) [1,2])
        , runTestEq "safeAdd on [3,4,5]" (Just ((), [7,5])) (runStateT safeAdd [3,4,5])
        , runTestEq "safeAdd on [3]" (Nothing :: Maybe ((), [Int])) (runStateT safeAdd [3])
        , runTestEq "safeAdd on []" (Nothing :: Maybe ((), [Int])) (runStateT safeAdd [])
        , runTestEq "pure 42 with state [1]" (Just (42 :: Int, [1 :: Int])) (runStateT (pure 42) [1 :: Int])`,
    hints: [
      'For <code>fmap</code>: <code>StateT $ \\s -> fmap (\\(a, s1) -> (f a, s1)) (g s)</code>. Use the inner Functor to map over the pair inside <code>m</code>.',
      'For <code>pure</code>: <code>StateT $ \\s -> return (a, s)</code>. Use the inner monad\'s <code>return</code>.',
      'For <code>&gt;&gt;=</code>: <code>StateT $ \\s -> sa s >>= \\(a, s1) -> runStateT (f a) s1</code>. Chain via the inner monad\'s bind.',
      'For <code>safePop</code>: pattern match the list — <code>[] -> Nothing</code>, <code>(h:t) -> Just (h, t)</code>. For <code>safeAdd</code>: use do-notation to pop twice and push the sum.',
    ],
    concepts: ['monad-transformer', 'StateT', 'effect-stacking', 'Maybe', 'safe-stack'],
    successPatterns: [
      'fmap.*\\\\\\(a.*s.*->',
      'pure.*return.*a.*s',
      'runStateT\\s*\\(f\\s+a\\)\\s*s',
      '\\[\\]\\s*->\\s*Nothing',
    ],
    testNames: [
      'safePush onto empty stack',
      'safePush onto non-empty stack',
      'safePop from empty stack fails',
      'safePop from non-empty stack',
      'double pop from singleton fails',
      'double pop from pair succeeds',
      'safeAdd pops two and pushes sum',
      'safeAdd with one element fails',
      'safeAdd with empty stack fails',
      'pure wraps value in inner monad',
    ],
  },

  'free-monads': {
    id: 'free-monads',
    title: 'Free Monads: Build a DSL',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>Programs as Data</h3>
<p>A <strong>free monad</strong> turns any functor into a monad, giving you a way to build a <em>description</em> of a program as a data structure, then interpret it later. This is the foundation of domain-specific languages (DSLs) in Haskell.</p>

<h3>The Free Type</h3>
<pre><code>data Free f a = Pure a | Free (f (Free f a))</code></pre>
<p>This is a recursive type:</p>
<ul>
  <li><code>Pure a</code> — a completed computation with result <code>a</code></li>
  <li><code>Free (f (Free f a))</code> — one layer of the functor <code>f</code>, containing the rest of the program</li>
</ul>

<h3>Why "Free"?</h3>
<p>It's called "free" because it gives you a monad for <strong>free</strong> — you only need to define a Functor. The Monad instance is derived automatically from the structure of <code>Free</code>.</p>

<h3>Typeclass Instances</h3>
<p>Given <code>Functor f</code>:</p>
<pre><code>instance Functor f => Functor (Free f) where
  fmap f (Pure a)  = Pure (f a)
  fmap f (Free op) = Free (fmap (fmap f) op)

instance Functor f => Applicative (Free f) where
  pure = Pure
  Pure f  <*> x = fmap f x
  Free op <*> x = Free (fmap (<*> x) op)

instance Functor f => Monad (Free f) where
  Pure a  >>= f = f a
  Free op >>= f = Free (fmap (>>= f) op)</code></pre>

<h3>Building a Key-Value Store DSL</h3>
<p>Define the operations as a functor:</p>
<pre><code>data KVF next
  = Get String (String -> next)     -- read a key, continue with value
  | Put String String next          -- write key=value, then continue
  | Delete String next              -- delete a key, then continue

instance Functor KVF where
  fmap f (Get k cont)    = Get k (f . cont)
  fmap f (Put k v next)  = Put k v (f next)
  fmap f (Delete k next) = Delete k (f next)</code></pre>

<h3>Smart Constructors</h3>
<pre><code>getKV :: String -> Free KVF String
getKV k = Free (Get k Pure)

putKV :: String -> String -> Free KVF ()
putKV k v = Free (Put k v (Pure ()))

deleteKV :: String -> Free KVF ()
deleteKV k = Free (Delete k (Pure ()))</code></pre>

<h3>Interpreter</h3>
<p>An interpreter walks the free structure and executes each operation. You can write different interpreters for testing, logging, or real databases — all from the same DSL program.</p>

<h3>Your Task</h3>
<p>Implement the Free monad instances, the KVF functor, smart constructors, and an interpreter that runs against an association list <code>[(String, String)]</code>.</p>
`,
    starterCode: `module FreeMonads where

data Free f a = Pure a | Free (f (Free f a))

-- EXERCISE: Implement everything below.

-- 1. Functor instance for Free
instance Functor f => Functor (Free f) where
  fmap f x = error "implement fmap"

-- 2. Applicative instance for Free
instance Functor f => Applicative (Free f) where
  pure = Pure
  pf <*> px = error "implement (<*>)"

-- 3. Monad instance for Free
instance Functor f => Monad (Free f) where
  x >>= f = error "implement (>>=)"

-- Key-Value store functor
data KVF next
  = Get String (String -> next)
  | Put String String next
  | Delete String next

-- 4. Functor instance for KVF
instance Functor KVF where
  fmap f op = error "implement fmap for KVF"

-- 5. Smart constructors
getKV :: String -> Free KVF String
getKV k = error "wrap Get in Free"

putKV :: String -> String -> Free KVF ()
putKV k v = error "wrap Put in Free"

deleteKV :: String -> Free KVF ()
deleteKV k = error "wrap Delete in Free"

-- 6. Interpreter: run a Free KVF program against an association list
--    Returns the final result and the final store
interpret :: [(String, String)] -> Free KVF a -> (a, [(String, String)])
interpret store program = error "implement interpreter"
`,
    solutionCode: `module FreeMonads where

data Free f a = Pure a | Free (f (Free f a))

instance Functor f => Functor (Free f) where
  fmap f (Pure a)  = Pure (f a)
  fmap f (Free op) = Free (fmap (fmap f) op)

instance Functor f => Applicative (Free f) where
  pure = Pure
  Pure f  <*> x = fmap f x
  Free op <*> x = Free (fmap (<*> x) op)

instance Functor f => Monad (Free f) where
  Pure a  >>= f = f a
  Free op >>= f = Free (fmap (>>= f) op)

data KVF next
  = Get String (String -> next)
  | Put String String next
  | Delete String next

instance Functor KVF where
  fmap f (Get k cont)    = Get k (f . cont)
  fmap f (Put k v next)  = Put k v (f next)
  fmap f (Delete k next) = Delete k (f next)

getKV :: String -> Free KVF String
getKV k = Free (Get k Pure)

putKV :: String -> String -> Free KVF ()
putKV k v = Free (Put k v (Pure ()))

deleteKV :: String -> Free KVF ()
deleteKV k = Free (Delete k (Pure ()))

interpret :: [(String, String)] -> Free KVF a -> (a, [(String, String)])
interpret store (Pure a) = (a, store)
interpret store (Free (Get k cont)) =
  let val = case lookup k store of
              Just v  -> v
              Nothing -> ""
  in interpret store (cont val)
interpret store (Free (Put k v next)) =
  let store' = (k, v) : filter (\\(k', _) -> k' /= k) store
  in interpret store' next
interpret store (Free (Delete k next)) =
  let store' = filter (\\(k', _) -> k' /= k) store
  in interpret store' next
`,
    testCode: `runTestEq "put then get" ("1", [("a","1")]) (interpret [] (putKV "a" "1" >> getKV "a"))
        , runTestEq "get missing key" ("", []) (interpret [] (getKV "x"))
        , runTestEq "put overwrites" ("2", [("a","2")]) (interpret [("a","1")] (putKV "a" "2" >> getKV "a"))
        , runTestEq "delete removes key" ("", []) (interpret [("a","1")] (deleteKV "a" >> getKV "a"))
        , runTestEq "put two keys" ("world", [("b","world"),("a","hello")]) (interpret [] (do { putKV "a" "hello"; putKV "b" "world"; getKV "b" }))
        , runTestEq "pure value" (42 :: Int, []) (interpret [] (pure 42 :: Free KVF Int))
        , runTestEq "sequence of operations" ("bar", [("y","bar"),("x","foo")]) (interpret [] (do { putKV "x" "foo"; putKV "y" "bar"; getKV "y" }))
        , runTestEq "delete non-existent key" ((), [("a","1")]) (interpret [("a","1")] (deleteKV "z"))
        , runTestEq "put delete get" ("", []) (interpret [] (do { putKV "k" "v"; deleteKV "k"; getKV "k" }))
        , runTestEq "fmap over pure" (43 :: Int, []) (interpret [] (fmap (+1) (pure 42 :: Free KVF Int)))`,
    hints: [
      'For <code>fmap</code> on Free: <code>Pure a -> Pure (f a)</code>. <code>Free op -> Free (fmap (fmap f) op)</code> — use the outer functor to fmap the inner fmap.',
      'For <code>>>=</code> on Free: <code>Pure a >>= f = f a</code>. <code>Free op >>= f = Free (fmap (>>= f) op)</code> — push the bind into the functor layer.',
      'For KVF Functor: <code>Get k cont -> Get k (f . cont)</code>. <code>Put k v next -> Put k v (f next)</code>. <code>Delete k next -> Delete k (f next)</code>. Apply <code>f</code> to the continuation.',
      'For <code>interpret</code>: pattern match on Pure and each Free constructor. For Get, use <code>lookup</code> (default to <code>""</code>). For Put, prepend and filter old. For Delete, filter.',
    ],
    concepts: ['free-monad', 'DSL', 'interpreter-pattern', 'functor', 'algebraic-effects'],
    successPatterns: [
      'fmap f \\(Pure a\\)',
      'Free op >>= f = Free \\(fmap',
      'fmap f \\(Get k cont\\)',
      'interpret.*Pure.*=',
    ],
    testNames: [
      'put then get retrieves the value',
      'get missing key returns empty string',
      'put overwrites existing key',
      'delete removes a key',
      'put two keys and read second',
      'pure returns value unchanged',
      'sequence of three operations',
      'delete non-existent key is harmless',
      'put then delete then get returns empty',
      'fmap works over pure values',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // TYPED LINEAR ALGEBRA MODULE
  // ═══════════════════════════════════════════════════════════════════

  'vector-operations': {
    id: 'vector-operations',
    title: 'Vector Operations',
    difficulty: 'intermediate',
    order: 1,
    description: `
<h3>Vectors in Haskell</h3>
<p>A <strong>vector</strong> is an ordered list of numbers. We wrap it in a <code>newtype</code> so we can define our own operations without conflicting with list functions:</p>
<pre><code>newtype Vec = Vec [Double] deriving (Show, Eq)</code></pre>

<h3>Core Operations</h3>
<table>
  <thead><tr><th>Operation</th><th>Formula</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Addition</td><td>[a&#x2081;+b&#x2081;, a&#x2082;+b&#x2082;, ...]</td><td>[1,2] + [3,4] = [4,6]</td></tr>
    <tr><td>Scalar multiply</td><td>[c*a&#x2081;, c*a&#x2082;, ...]</td><td>3 * [1,2] = [3,6]</td></tr>
    <tr><td>Dot product</td><td>a&#x2081;*b&#x2081; + a&#x2082;*b&#x2082; + ...</td><td>[1,2,3] . [4,5,6] = 32</td></tr>
    <tr><td>Norm (length)</td><td>sqrt(v . v)</td><td>||[3,4]|| = 5.0</td></tr>
  </tbody>
</table>

<h3>Implementation Hints</h3>
<ul>
  <li><code>vecAdd</code>: use <code>zipWith (+)</code> to add corresponding elements</li>
  <li><code>vecScale</code>: use <code>map (c*)</code> to multiply each element by a scalar</li>
  <li><code>dot</code>: use <code>sum (zipWith (*) xs ys)</code></li>
  <li><code>vecNorm</code>: <code>sqrt (dot v v)</code></li>
  <li><code>zeroVec n</code>: use <code>replicate n 0</code></li>
</ul>

<h3>Worked Example</h3>
<pre><code>vecAdd (Vec [1,2,3]) (Vec [4,5,6])
  = Vec (zipWith (+) [1,2,3] [4,5,6])
  = Vec [5,7,9]

dot (Vec [1,2,3]) (Vec [4,5,6])
  = sum (zipWith (*) [1,2,3] [4,5,6])
  = sum [4,10,18]
  = 32.0</code></pre>

<h3>Your Task</h3>
<p>Implement five vector operations: addition, scalar multiplication, dot product, norm, and zero vector.</p>
`,
    starterCode: `module VectorOps where

newtype Vec = Vec [Double] deriving (Show, Eq)

-- EXERCISE: Implement each operation.

-- 1. Add two vectors element-wise
--    vecAdd (Vec [1,2]) (Vec [3,4]) = Vec [4,6]
vecAdd :: Vec -> Vec -> Vec
vecAdd (Vec xs) (Vec ys) = error "implement vecAdd"

-- 2. Multiply a vector by a scalar
--    vecScale 3 (Vec [1,2]) = Vec [3,6]
vecScale :: Double -> Vec -> Vec
vecScale c (Vec xs) = error "implement vecScale"

-- 3. Dot product of two vectors
--    dot (Vec [1,2,3]) (Vec [4,5,6]) = 32.0
dot :: Vec -> Vec -> Double
dot (Vec xs) (Vec ys) = error "implement dot"

-- 4. Euclidean norm (length) of a vector
--    vecNorm (Vec [3,4]) = 5.0
vecNorm :: Vec -> Double
vecNorm v = error "implement vecNorm using dot"

-- 5. Zero vector of dimension n
--    zeroVec 3 = Vec [0,0,0]
zeroVec :: Int -> Vec
zeroVec n = error "implement zeroVec"
`,
    solutionCode: `module VectorOps where

newtype Vec = Vec [Double] deriving (Show, Eq)

vecAdd :: Vec -> Vec -> Vec
vecAdd (Vec xs) (Vec ys) = Vec (zipWith (+) xs ys)

vecScale :: Double -> Vec -> Vec
vecScale c (Vec xs) = Vec (map (c *) xs)

dot :: Vec -> Vec -> Double
dot (Vec xs) (Vec ys) = sum (zipWith (*) xs ys)

vecNorm :: Vec -> Double
vecNorm v = sqrt (dot v v)

zeroVec :: Int -> Vec
zeroVec n = Vec (replicate n 0)
`,
    testCode: `runTestEq "vecAdd [1,2] [3,4]" (Vec [4,6]) (vecAdd (Vec [1,2]) (Vec [3,4]))
        , runTestEq "vecAdd [0,0] [5,5]" (Vec [5,5]) (vecAdd (Vec [0,0]) (Vec [5,5]))
        , runTestEq "vecScale 3 [1,2]" (Vec [3,6]) (vecScale 3 (Vec [1,2]))
        , runTestEq "vecScale 0 [1,2,3]" (Vec [0,0,0]) (vecScale 0 (Vec [1,2,3]))
        , runTestEq "dot [1,2,3] [4,5,6]" (32.0 :: Double) (dot (Vec [1,2,3]) (Vec [4,5,6]))
        , runTestEq "dot [1,0] [0,1]" (0.0 :: Double) (dot (Vec [1,0]) (Vec [0,1]))
        , runTestApprox "vecNorm [3,4]" 5.0 (vecNorm (Vec [3,4])) 0.001
        , runTestApprox "vecNorm [1,0]" 1.0 (vecNorm (Vec [1,0])) 0.001
        , runTestEq "zeroVec 3" (Vec [0,0,0]) (zeroVec 3)
        , runTestEq "vecAdd with zeroVec" (Vec [1,2,3]) (vecAdd (Vec [1,2,3]) (zeroVec 3))`,
    hints: [
      'For <code>vecAdd</code>: unwrap both vectors, use <code>zipWith (+) xs ys</code>, wrap the result back in <code>Vec</code>.',
      'For <code>vecScale</code>: <code>Vec (map (c *) xs)</code>. Multiply each element by the scalar <code>c</code>.',
      'For <code>dot</code>: <code>sum (zipWith (*) xs ys)</code>. Multiply corresponding elements, then sum.',
      'For <code>vecNorm</code>: <code>sqrt (dot v v)</code>. For <code>zeroVec</code>: <code>Vec (replicate n 0)</code>.',
    ],
    concepts: ['vector', 'dot-product', 'norm', 'linear-algebra', 'newtype'],
    successPatterns: [
      'zipWith\\s*\\(\\+\\)',
      'map.*\\*',
      'sum.*zipWith\\s*\\(\\*\\)',
      'sqrt.*dot',
    ],
    testNames: [
      'vecAdd adds element-wise',
      'vecAdd with zero vector',
      'vecScale multiplies by scalar',
      'vecScale by zero gives zero vector',
      'dot product [1,2,3].[4,5,6]=32',
      'dot product of orthogonal vectors is 0',
      'vecNorm [3,4]=5',
      'vecNorm [1,0]=1',
      'zeroVec creates zero vector',
      'vecAdd with zeroVec is identity',
    ],
  },

  'matrix-operations': {
    id: 'matrix-operations',
    title: 'Matrix Operations',
    difficulty: 'intermediate',
    order: 2,
    description: `
<h3>Matrices as Lists of Lists</h3>
<p>A <strong>matrix</strong> is a 2D grid of numbers. We represent it as a list of rows:</p>
<pre><code>newtype Mat = Mat [[Double]] deriving (Show, Eq)

-- The matrix [[1,2],[3,4]] is:
--   1  2
--   3  4</code></pre>

<h3>Transpose</h3>
<p>Transposing swaps rows and columns. The key insight: the first column of the transpose is the first element of each row.</p>
<pre><code>transpose [[1,2,3],     [[1,4],
           [4,5,6]]  =>  [2,5],
                          [3,6]]</code></pre>
<p>Implement recursively:</p>
<ul>
  <li>Base case: if any row is empty, return <code>[]</code></li>
  <li>Recursive case: <code>map head rows : transpose (map tail rows)</code></li>
</ul>

<h3>Matrix-Vector Multiplication</h3>
<p>Each row of the matrix is dotted with the vector:</p>
<pre><code>[1,2] * [5] = [1*5 + 2*6] = [17]
[3,4]   [6]   [3*5 + 4*6]   [39]</code></pre>

<h3>Matrix Multiplication</h3>
<p>To multiply A * B: for each row of A and each column of B, compute the dot product.</p>
<pre><code>A = [[1,2],[3,4]]    B = [[5,6],[7,8]]
A * B = [[1*5+2*7, 1*6+2*8],   = [[19,22],
         [3*5+4*7, 3*6+4*8]]      [43,50]]</code></pre>
<p>Strategy: transpose B to turn columns into rows, then dot each row of A with each row of B<sup>T</sup>.</p>

<h3>Identity Matrix</h3>
<p>The n x n identity matrix has 1s on the diagonal, 0s elsewhere. Multiplying by the identity gives back the original.</p>

<h3>Your Task</h3>
<p>Implement transpose, matrix-vector multiply, matrix multiply, and identity matrix.</p>
`,
    starterCode: `module MatrixOps where

newtype Mat = Mat [[Double]] deriving (Show, Eq)
newtype Vec = Vec [Double] deriving (Show, Eq)

-- Helper: dot product of two lists
dotList :: [Double] -> [Double] -> Double
dotList xs ys = sum (zipWith (*) xs ys)

-- EXERCISE: Implement each operation.

-- 1. Transpose a matrix (swap rows and columns)
--    matTranspose [[1,2],[3,4]] = [[1,3],[2,4]]
--    Hint: base case when rows have empty lists, recursive with map head/tail
matTranspose :: [[Double]] -> [[Double]]
matTranspose rows = error "implement matTranspose"

-- 2. Multiply a matrix by a vector
--    matVecMul [[1,2],[3,4]] (Vec [5,6]) = Vec [17,39]
matVecMul :: Mat -> Vec -> Vec
matVecMul (Mat rows) (Vec v) = error "implement matVecMul"

-- 3. Multiply two matrices
--    matMul [[1,2],[3,4]] [[5,6],[7,8]] = [[19,22],[43,50]]
matMul :: Mat -> Mat -> Mat
matMul (Mat a) (Mat b) = error "implement matMul"

-- 4. Identity matrix of size n
--    identity 2 = Mat [[1,0],[0,1]]
identity :: Int -> Mat
identity n = error "implement identity"
`,
    solutionCode: `module MatrixOps where

newtype Mat = Mat [[Double]] deriving (Show, Eq)
newtype Vec = Vec [Double] deriving (Show, Eq)

dotList :: [Double] -> [Double] -> Double
dotList xs ys = sum (zipWith (*) xs ys)

matTranspose :: [[Double]] -> [[Double]]
matTranspose [] = []
matTranspose ([] : _) = []
matTranspose rows = map head rows : matTranspose (map tail rows)

matVecMul :: Mat -> Vec -> Vec
matVecMul (Mat rows) (Vec v) = Vec (map (\\row -> dotList row v) rows)

matMul :: Mat -> Mat -> Mat
matMul (Mat a) (Mat b) =
  let bt = matTranspose b
  in Mat [ [ dotList rowA colB | colB <- bt ] | rowA <- a ]

identity :: Int -> Mat
identity n = Mat [ [ if i == j then 1 else 0 | j <- [0..n-1] ] | i <- [0..n-1] ]
`,
    testCode: `runTestEq "transpose [[1,2],[3,4]]" [[1,3],[2,4]] (matTranspose [[1,2],[3,4]])
        , runTestEq "transpose [[1,2,3],[4,5,6]]" [[1,4],[2,5],[3,6]] (matTranspose [[1,2,3],[4,5,6]])
        , runTestEq "matVecMul [[1,2],[3,4]] [5,6]" (Vec [17,39]) (matVecMul (Mat [[1,2],[3,4]]) (Vec [5,6]))
        , runTestEq "matVecMul identity [1,2]" (Vec [1,2]) (matVecMul (identity 2) (Vec [1,2]))
        , runTestEq "matMul [[1,2],[3,4]] [[5,6],[7,8]]" (Mat [[19,22],[43,50]]) (matMul (Mat [[1,2],[3,4]]) (Mat [[5,6],[7,8]]))
        , runTestEq "matMul identity A = A" (Mat [[1,2],[3,4]]) (matMul (identity 2) (Mat [[1,2],[3,4]]))
        , runTestEq "matMul A identity = A" (Mat [[1,2],[3,4]]) (matMul (Mat [[1,2],[3,4]]) (identity 2))
        , runTestEq "identity 3" (Mat [[1,0,0],[0,1,0],[0,0,1]]) (identity 3)
        , runTestEq "transpose single row" [[1],[2],[3]] (matTranspose [[1,2,3]])
        , runTestEq "matVecMul [[2,0],[0,3]] [4,5]" (Vec [8,15]) (matVecMul (Mat [[2,0],[0,3]]) (Vec [4,5]))`,
    hints: [
      'For <code>matTranspose</code>: base case — if any row is empty (match <code>([] : _)</code> or <code>[]</code>), return <code>[]</code>. Recursive: <code>map head rows : matTranspose (map tail rows)</code>.',
      'For <code>matVecMul</code>: <code>Vec (map (\\row -> dotList row v) rows)</code>. Dot each row of the matrix with the vector.',
      'For <code>matMul</code>: transpose B, then for each row of A and each column (row of B<sup>T</sup>), compute <code>dotList</code>.',
      'For <code>identity</code>: <code>Mat [ [ if i == j then 1 else 0 | j <- [0..n-1] ] | i <- [0..n-1] ]</code>.',
    ],
    concepts: ['matrix', 'transpose', 'matrix-multiplication', 'identity-matrix', 'linear-algebra'],
    successPatterns: [
      'map head rows.*matTranspose.*map tail',
      'dotList\\s+row\\s+v',
      'matTranspose\\s+b',
      'if\\s+i\\s*==\\s*j\\s+then\\s+1',
    ],
    testNames: [
      'transpose 2x2 matrix',
      'transpose 2x3 matrix',
      'matVecMul standard case',
      'matVecMul with identity',
      'matMul [[1,2],[3,4]]*[[5,6],[7,8]]',
      'matMul identity*A = A',
      'matMul A*identity = A',
      'identity 3 is correct',
      'transpose single row to column',
      'matVecMul diagonal matrix',
    ],
  },

  'linear-transformations': {
    id: 'linear-transformations',
    title: 'Linear Transformations',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>Transformations as Matrices</h3>
<p>A <strong>linear transformation</strong> is a function between vector spaces that preserves addition and scalar multiplication. In 2D, every linear transformation can be represented as a matrix. Applying the transformation is just matrix-vector multiplication.</p>

<h3>Common 2D Transformations</h3>
<table>
  <thead><tr><th>Transform</th><th>Matrix</th><th>Effect</th></tr></thead>
  <tbody>
    <tr><td>Scale</td><td><code>[[sx,0],[0,sy]]</code></td><td>Stretch x by sx, y by sy</td></tr>
    <tr><td>Rotate &#x3B8;</td><td><code>[[cos&#x3B8;,-sin&#x3B8;],[sin&#x3B8;,cos&#x3B8;]]</code></td><td>Rotate by &#x3B8; radians</td></tr>
    <tr><td>Reflect x-axis</td><td><code>[[1,0],[0,-1]]</code></td><td>Flip over x-axis</td></tr>
  </tbody>
</table>

<h3>Composition = Matrix Multiplication</h3>
<p>Applying transformation A then B is the same as applying the single matrix <code>B * A</code>. This is the <strong>composition law</strong>:</p>
<pre><code>applyTransform (compose B A) v == applyTransform B (applyTransform A v)</code></pre>
<p>This is why linear algebra is so powerful: composing any number of transformations is a single matrix multiply.</p>

<h3>Worked Example</h3>
<pre><code>scaleMat 2 3 = Mat [[2,0],[0,3]]
applyTransform (scaleMat 2 3) (Vec [1,1]) = Vec [2,3]

-- Compose scale(2,2) then scale(3,3) = scale(6,6)
compose (scaleMat 3 3) (scaleMat 2 2) = Mat [[6,0],[0,6]]</code></pre>

<h3>Your Task</h3>
<p>Implement scaling, rotation, and reflection matrices, plus <code>applyTransform</code> and <code>compose</code>. Then verify the composition law holds.</p>
`,
    starterCode: `module LinearTransformations where

newtype Vec = Vec [Double] deriving (Show, Eq)
newtype Mat = Mat [[Double]] deriving (Show, Eq)

-- Helpers (provided)
dotList :: [Double] -> [Double] -> Double
dotList xs ys = sum (zipWith (*) xs ys)

matTranspose :: [[Double]] -> [[Double]]
matTranspose [] = []
matTranspose ([] : _) = []
matTranspose rows = map head rows : matTranspose (map tail rows)

-- EXERCISE: Implement each function.

-- 1. Apply a transformation (matrix-vector multiply)
applyTransform :: Mat -> Vec -> Vec
applyTransform (Mat rows) (Vec v) = error "implement applyTransform"

-- 2. Compose two transformations (matrix multiply)
--    compose A B means "apply B first, then A"
compose :: Mat -> Mat -> Mat
compose (Mat a) (Mat b) = error "implement compose"

-- 3. Scaling matrix
--    scaleMat 2 3 = Mat [[2,0],[0,3]]
scaleMat :: Double -> Double -> Mat
scaleMat sx sy = error "implement scaleMat"

-- 4. Rotation matrix (angle in radians)
--    rotateMat (pi/2) rotates 90 degrees counter-clockwise
rotateMat :: Double -> Mat
rotateMat theta = error "implement rotateMat"

-- 5. Reflection across the x-axis
--    reflectX = Mat [[1,0],[0,-1]]
reflectX :: Mat
reflectX = error "implement reflectX"

-- 6. Verify composition law:
--    applyTransform (compose a b) v == applyTransform a (applyTransform b v)
--    Returns True if both sides match (within floating-point tolerance)
compositionLaw :: Mat -> Mat -> Vec -> Bool
compositionLaw a b v = error "implement compositionLaw"
`,
    solutionCode: `module LinearTransformations where

newtype Vec = Vec [Double] deriving (Show, Eq)
newtype Mat = Mat [[Double]] deriving (Show, Eq)

dotList :: [Double] -> [Double] -> Double
dotList xs ys = sum (zipWith (*) xs ys)

matTranspose :: [[Double]] -> [[Double]]
matTranspose [] = []
matTranspose ([] : _) = []
matTranspose rows = map head rows : matTranspose (map tail rows)

applyTransform :: Mat -> Vec -> Vec
applyTransform (Mat rows) (Vec v) = Vec (map (\\row -> dotList row v) rows)

compose :: Mat -> Mat -> Mat
compose (Mat a) (Mat b) =
  let bt = matTranspose b
  in Mat [ [ dotList rowA colB | colB <- bt ] | rowA <- a ]

scaleMat :: Double -> Double -> Mat
scaleMat sx sy = Mat [[sx, 0], [0, sy]]

rotateMat :: Double -> Mat
rotateMat theta = Mat [[cos theta, -(sin theta)], [sin theta, cos theta]]

reflectX :: Mat
reflectX = Mat [[1, 0], [0, -1]]

compositionLaw :: Mat -> Mat -> Vec -> Bool
compositionLaw a b v =
  let Vec lhs = applyTransform (compose a b) v
      Vec rhs = applyTransform a (applyTransform b v)
      approxEq x y = abs (x - y) < 1e-9
  in and (zipWith approxEq lhs rhs)
`,
    testCode: `runTestEq "scale (2,3) * [1,1]" (Vec [2,3]) (applyTransform (scaleMat 2 3) (Vec [1,1]))
        , runTestEq "scale (1,1) is identity" (Vec [5,7]) (applyTransform (scaleMat 1 1) (Vec [5,7]))
        , runTestEq "reflectX [3,4]" (Vec [3,-4]) (applyTransform reflectX (Vec [3,4]))
        , runTestEq "reflectX [0,0]" (Vec [0,0]) (applyTransform reflectX (Vec [0,0]))
        , runTestApprox "rotate pi/2 [1,0] x-component" 0.0 (let Vec [x,_] = applyTransform (rotateMat (pi/2)) (Vec [1,0]) in x) 0.001
        , runTestApprox "rotate pi/2 [1,0] y-component" 1.0 (let Vec [_,y] = applyTransform (rotateMat (pi/2)) (Vec [1,0]) in y) 0.001
        , runTestEq "compose scale(2,2) scale(3,3)" (Mat [[6,0],[0,6]]) (compose (scaleMat 2 2) (scaleMat 3 3))
        , runTest "compositionLaw scale+reflect" (compositionLaw (scaleMat 2 3) reflectX (Vec [1,1]))
        , runTest "compositionLaw two scales" (compositionLaw (scaleMat 2 2) (scaleMat 3 3) (Vec [4,5]))
        , runTest "compositionLaw rotate+scale" (compositionLaw (rotateMat (pi/4)) (scaleMat 2 2) (Vec [1,0]))`,
    hints: [
      'For <code>applyTransform</code>: <code>Vec (map (\\row -> dotList row v) rows)</code>. Each row of the matrix is dotted with the vector.',
      'For <code>compose</code>: transpose B, then for each row of A and each column of B, compute <code>dotList</code>. This is standard matrix multiplication.',
      'For <code>scaleMat</code>: <code>Mat [[sx, 0], [0, sy]]</code>. For <code>rotateMat</code>: <code>Mat [[cos theta, -(sin theta)], [sin theta, cos theta]]</code>.',
      'For <code>compositionLaw</code>: compute both sides and compare element-wise with a tolerance like <code>abs (x - y) < 1e-9</code>.',
    ],
    concepts: ['linear-transformation', 'matrix-representation', 'composition', 'rotation', 'scaling', 'reflection'],
    successPatterns: [
      'applyTransform.*dotList',
      'bt\\s*=\\s*matTranspose',
      'scaleMat.*\\[\\[sx',
      'approxEq\\s+x\\s+y\\s*=\\s*abs',
    ],
    testNames: [
      'scale (2,3) applied to [1,1]',
      'scale (1,1) is identity transform',
      'reflectX flips y component',
      'reflectX on origin',
      'rotate pi/2 x-component',
      'rotate pi/2 y-component',
      'compose two scalings',
      'composition law: scale + reflect',
      'composition law: two scales',
      'composition law: rotate + scale',
    ],
  },

  'gaussian-elimination': {
    id: 'gaussian-elimination',
    title: 'Gaussian Elimination',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>Solving Linear Systems</h3>
<p>Given a system of equations <code>Ax = b</code>, <strong>Gaussian elimination</strong> transforms it into row echelon form, then solves by <strong>back substitution</strong>.</p>

<h3>The Algorithm</h3>
<ol>
  <li><strong>Augment:</strong> combine A and b into a single matrix <code>[A|b]</code></li>
  <li><strong>Forward elimination:</strong> for each column, find the pivot row (first non-zero entry), swap it to the diagonal position, then subtract multiples of the pivot row from all rows below to create zeros</li>
  <li><strong>Back substitution:</strong> starting from the last row, solve for each variable</li>
</ol>

<h3>Worked Example</h3>
<pre><code>System: 2x + y = 4
        5x + 3y = 7

Augmented: [[2, 1, 4],
            [5, 3, 7]]

Step 1: Pivot on column 0 (row 0 has 2, no swap needed)
  Eliminate row 1: R1 = R1 - (5/2)*R0
  [[2,   1,   4  ],
   [0, 0.5, -3  ]]

Step 2: Back substitution
  y = -3 / 0.5 = -6
  x = (4 - 1*(-6)) / 2 = 5

Solution: x=5, y=-6</code></pre>

<p>Check: <code>2*5 + (-6) = 4</code> and <code>5*5 + 3*(-6) = 25 - 18 = 7</code>. Correct!</p>

<h3>Handling Singular Systems</h3>
<p>If during forward elimination a column has no non-zero pivot, the system is <strong>singular</strong> (no unique solution). Return <code>Nothing</code>.</p>

<h3>Implementation Strategy</h3>
<p>Since Haskell lists are immutable, you process the matrix functionally:</p>
<ul>
  <li>Forward elimination processes columns left to right, updating the matrix at each step</li>
  <li>For each column: find the pivot row, swap it into place, eliminate all rows below</li>
  <li>Back substitution processes rows bottom to top, accumulating the solution</li>
</ul>

<h3>Your Task</h3>
<p>Implement <code>solve :: [[Double]] -> [Double] -> Maybe [Double]</code> that solves the linear system <code>Ax = b</code>, returning <code>Nothing</code> for singular systems.</p>
`,
    starterCode: `module GaussianElimination where

-- EXERCISE: Solve Ax = b by Gaussian elimination.

-- solve takes a matrix A and vector b, returns Maybe the solution vector x.
-- Returns Nothing if the system is singular (no unique solution).
--
-- Strategy:
--   1. Augment A with b: append b_i to each row_i
--   2. Forward elimination: for each column k from 0 to n-1:
--      a. Find pivot: first row at index >= k with non-zero entry in column k
--      b. If no pivot, return Nothing
--      c. Swap pivot row to position k
--      d. For each row below k, subtract a multiple of row k to zero out column k
--   3. Back substitution: from row n-1 to 0, solve for x_k
--
-- Helper ideas:
--   swapRows i j mat = swap rows at indices i and j
--   eliminate pivot below mat = subtract multiples of pivot from rows below

solve :: [[Double]] -> [Double] -> Maybe [Double]
solve a b = error "implement solve"
`,
    solutionCode: `module GaussianElimination where

solve :: [[Double]] -> [Double] -> Maybe [Double]
solve a b =
  let n = length a
      augmented = zipWith (\\row bi -> row ++ [bi]) a b
  in case forwardElim 0 n augmented of
       Nothing  -> Nothing
       Just aug -> Just (backSubst n aug)

forwardElim :: Int -> Int -> [[Double]] -> Maybe [[Double]]
forwardElim k n mat
  | k >= n    = Just mat
  | otherwise =
      case findPivot k n mat of
        Nothing -> Nothing
        Just pivotIdx ->
          let mat1 = swapRows k pivotIdx mat
              pivotRow = mat1 !! k
              pivotVal = pivotRow !! k
              mat2 = [ if i <= k
                       then mat1 !! i
                       else let row = mat1 !! i
                                factor = (row !! k) / pivotVal
                            in zipWith (\\a' p -> a' - factor * p) row pivotRow
                     | i <- [0..n-1] ]
          in forwardElim (k + 1) n mat2

findPivot :: Int -> Int -> [[Double]] -> Maybe Int
findPivot k n mat =
  let candidates = [ i | i <- [k..n-1], abs ((mat !! i) !! k) > 1e-10 ]
  in case candidates of
       []    -> Nothing
       (i:_) -> Just i

swapRows :: Int -> Int -> [[Double]] -> [[Double]]
swapRows i j mat =
  [ if idx == i then mat !! j
    else if idx == j then mat !! i
    else mat !! idx
  | idx <- [0 .. length mat - 1] ]

backSubst :: Int -> [[Double]] -> [Double]
backSubst n mat = go (n - 1) []
  where
    go k acc
      | k < 0    = acc
      | otherwise =
          let row = mat !! k
              rhs = row !! n
              s   = sum [ (row !! j) * (acc !! (j - k - 1))
                        | j <- [k+1..n-1] ]
              xk  = (rhs - s) / (row !! k)
          in go (k - 1) (xk : acc)
`,
    testCode: `runTestApprox "solve 2x+y=4, 5x+3y=7 (x)" 5.0 (case solve [[2,1],[5,3]] [4,7] of Just [x,_] -> x; _ -> 999) 0.01
        , runTestApprox "solve 2x+y=4, 5x+3y=7 (y)" (-6.0) (case solve [[2,1],[5,3]] [4,7] of Just [_,y] -> y; _ -> 999) 0.01
        , runTestApprox "solve x+y=3, x-y=1 (x)" 2.0 (case solve [[1,1],[1,-1]] [3,1] of Just [x,_] -> x; _ -> 999) 0.01
        , runTestApprox "solve x+y=3, x-y=1 (y)" 1.0 (case solve [[1,1],[1,-1]] [3,1] of Just [_,y] -> y; _ -> 999) 0.01
        , runTest "singular system returns Nothing" (case solve [[1,2],[2,4]] [3,6] of Nothing -> True; _ -> False)
        , runTest "singular zero row returns Nothing" (case solve [[0,0],[1,2]] [1,3] of Nothing -> True; _ -> False)
        , runTestApprox "solve 3x3 identity (x)" 1.0 (case solve [[1,0,0],[0,1,0],[0,0,1]] [1,2,3] of Just [x,_,_] -> x; _ -> 999) 0.01
        , runTestApprox "solve 3x3 identity (y)" 2.0 (case solve [[1,0,0],[0,1,0],[0,0,1]] [1,2,3] of Just [_,y,_] -> y; _ -> 999) 0.01
        , runTestApprox "solve non-trivial 2x2" 1.0 (case solve [[3,2],[1,1]] [5,2] of Just [x,_] -> x; _ -> 999) 0.01`,
    hints: [
      'Start by augmenting: <code>zipWith (\\row bi -> row ++ [bi]) a b</code>. This gives you an n x (n+1) matrix.',
      'For forward elimination: process each column k. Find the first row at index >= k with a non-zero entry in column k. If none, return Nothing. Otherwise swap that row to position k.',
      'To eliminate below: for each row i > k, compute <code>factor = row_i[k] / pivot[k]</code>, then <code>row_i = zipWith (\\a p -> a - factor * p) row_i pivotRow</code>.',
      'For back substitution: start from the last row. <code>x_k = (augmented[k][n] - sum of known terms) / augmented[k][k]</code>. Build the solution vector from bottom to top.',
    ],
    concepts: ['gaussian-elimination', 'forward-elimination', 'back-substitution', 'linear-system', 'singular-matrix'],
    successPatterns: [
      'augmented.*zipWith.*\\+\\+',
      'findPivot|pivot',
      'swapRows|swap',
      'backSubst|backSub',
    ],
    testNames: [
      'solve 2x+y=4, 5x+3y=7 for x',
      'solve 2x+y=4, 5x+3y=7 for y',
      'solve x+y=3, x-y=1 for x',
      'solve x+y=3, x-y=1 for y',
      'singular system returns Nothing',
      'singular zero row returns Nothing',
      'solve identity 3x3 for x',
      'solve identity 3x3 for y',
      'solve identity 3x3 for z',
      'solve non-trivial 2x2 system',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LAMBDA CALCULUS I: FOUNDATIONS MODULE
  // ═══════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════
  // LAMBDA CALCULUS II: CHURCH ENCODINGS MODULE
  // ═══════════════════════════════════════════════════════════════════

  'church-booleans': {
    id: 'church-booleans',
    title: 'Church Booleans: Logic from Pure Functions',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>In the untyped lambda calculus there are <strong>no primitive data types</strong> — no booleans, no numbers, no pairs. Everything is a function. Alonzo Church showed that we can <em>encode</em> data as pure functions that "choose" between their arguments. These encodings are called <strong>Church encodings</strong>.</p>

<h3>The Core Idea: Booleans as Selectors</h3>
<p>A Church boolean is a function of two arguments that <em>selects</em> one of them:</p>
<ul>
  <li><strong>True</strong> selects the <em>first</em> argument: <code>\\x y -> x</code></li>
  <li><strong>False</strong> selects the <em>second</em> argument: <code>\\x y -> y</code></li>
</ul>
<pre><code>-- In lambda calculus notation:
-- TRUE  = \\x. \\y. x
-- FALSE = \\x. \\y. y</code></pre>

<h3>Why This Works</h3>
<p>If a boolean <em>is</em> a selector, then "if-then-else" is just <strong>function application</strong>:</p>
<pre><code>churchIf b t f = b t f
-- churchIf churchTrue  "yes" "no"  -->  "yes"
-- churchIf churchFalse "yes" "no"  -->  "no"</code></pre>
<p>No special syntax needed — the boolean itself does the branching!</p>

<h3>Church Logic without RankNTypes</h3>
<p>In pure lambda calculus, Church booleans are polymorphic. In Haskell, we would need <code>RankNTypes</code> to give them a fully polymorphic type. Instead, we specialize the boolean combinators at <strong>concrete types</strong> where we need them.</p>
<p>For composing logic operations (NOT, AND, OR), we specialize at <code>Bool -> Bool -> Bool</code> so that a Church boolean can return another Church boolean:</p>

<table>
  <thead><tr><th>Operation</th><th>Lambda Definition</th><th>Intuition</th></tr></thead>
  <tbody>
    <tr><td><code>NOT b</code></td><td><code>\\x y -> b y x</code></td><td>Swap the arguments — True becomes False and vice versa</td></tr>
    <tr><td><code>AND a b</code></td><td><code>\\x y -> a (b x y) y</code></td><td>If <code>a</code> is true, result depends on <code>b</code>; if <code>a</code> is false, result is false</td></tr>
    <tr><td><code>OR a b</code></td><td><code>\\x y -> a x (b x y)</code></td><td>If <code>a</code> is true, result is true; otherwise result depends on <code>b</code></td></tr>
  </tbody>
</table>

<h3>Converting Back</h3>
<p>To convert a Church boolean back to Haskell's <code>Bool</code>, just apply it to <code>True</code> and <code>False</code>:</p>
<pre><code>toBool b = b True False</code></pre>

<h3>Your Task</h3>
<p>Implement <code>churchTrue</code>, <code>churchFalse</code>, <code>toBool</code>, <code>churchIf</code>, <code>churchNot</code>, <code>churchAnd</code>, and <code>churchOr</code>. The logic combinators work at the concrete <code>Bool -> Bool -> Bool</code> type.</p>
`,
    starterCode: `module ChurchBooleans where

-- Church booleans: a boolean is a function that selects one of two arguments.
-- TRUE  picks the first,  FALSE picks the second.

-- | Church-encoded True: select the first argument.
churchTrue :: a -> a -> a
churchTrue x y = error "select the first argument"

-- | Church-encoded False: select the second argument.
churchFalse :: a -> a -> a
churchFalse x y = error "select the second argument"

-- | Convert a Church boolean to a Haskell Bool.
--   Apply the Church boolean to True and False.
toBool :: (Bool -> Bool -> Bool) -> Bool
toBool b = error "apply b to True and False"

-- | Church if-then-else: the boolean IS the branching mechanism.
churchIf :: (a -> a -> a) -> a -> a -> a
churchIf b t f = error "apply the boolean to then and else"

-- | Church NOT: swap the arguments so True becomes False and vice versa.
--   Specialized at Bool -> Bool -> Bool for composability.
churchNot :: (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool)
churchNot b = error "return a new Church boolean with swapped selection"

-- | Church AND: if a is true, result depends on b; otherwise false.
churchAnd :: (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool)
churchAnd a b = error "if a selects true-branch, delegate to b"

-- | Church OR: if a is true, result is true; otherwise depends on b.
churchOr :: (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool)
churchOr a b = error "if a selects true-branch, done; otherwise delegate to b"
`,
    solutionCode: `module ChurchBooleans where

churchTrue :: a -> a -> a
churchTrue x y = x

churchFalse :: a -> a -> a
churchFalse x y = y

toBool :: (Bool -> Bool -> Bool) -> Bool
toBool b = b True False

churchIf :: (a -> a -> a) -> a -> a -> a
churchIf b t f = b t f

churchNot :: (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool)
churchNot b = \\x y -> b y x

churchAnd :: (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool)
churchAnd a b = \\x y -> a (b x y) y

churchOr :: (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool) -> (Bool -> Bool -> Bool)
churchOr a b = \\x y -> a x (b x y)
`,
    testCode: `runTestEq "toBool churchTrue" True (toBool churchTrue)
        , runTestEq "toBool churchFalse" False (toBool churchFalse)
        , runTestEq "churchIf true" "yes" (churchIf churchTrue "yes" "no")
        , runTestEq "churchIf false" "no" (churchIf churchFalse "yes" "no")
        , runTestEq "churchNot true" False (toBool (churchNot churchTrue))
        , runTestEq "churchNot false" True (toBool (churchNot churchFalse))
        , runTestEq "churchAnd true true" True (toBool (churchAnd churchTrue churchTrue))
        , runTestEq "churchAnd true false" False (toBool (churchAnd churchTrue churchFalse))
        , runTestEq "churchAnd false true" False (toBool (churchAnd churchFalse churchTrue))
        , runTestEq "churchOr false false" False (toBool (churchOr churchFalse churchFalse))
        , runTestEq "churchOr false true" True (toBool (churchOr churchFalse churchTrue))
        , runTestEq "churchOr true false" True (toBool (churchOr churchTrue churchFalse))`,
    hints: [
      '<code>churchTrue</code> takes two arguments and returns the <strong>first</strong> one. <code>churchFalse</code> returns the <strong>second</strong>. These are the K and KI combinators from Module 1.',
      'For <code>toBool</code>, pass Haskell\'s <code>True</code> as the first argument and <code>False</code> as the second: <code>b True False</code>. For <code>churchIf</code>, it\'s the same idea — the boolean <em>is</em> the selector.',
      'For <code>churchNot</code>, you need to swap what gets selected: <code>\\x y -> b y x</code>. If <code>b</code> was selecting the first (true), it now selects the second (false).',
      'For <code>churchAnd a b</code>: if <code>a</code> picks the true-branch, delegate to <code>b</code>: <code>\\x y -> a (b x y) y</code>. For <code>churchOr a b</code>: if <code>a</code> picks true, done; else delegate: <code>\\x y -> a x (b x y)</code>.',
    ],
    concepts: ['church-encoding', 'lambda-calculus', 'higher-order-functions', 'boolean-logic', 'selectors'],
    successPatterns: [
      'churchTrue\\s+x\\s+y\\s*=\\s*x',
      'churchFalse\\s+x\\s+y\\s*=\\s*y',
      'churchNot',
      'churchAnd',
      'churchOr',
    ],
    testNames: [
      'toBool churchTrue is True',
      'toBool churchFalse is False',
      'churchIf churchTrue selects first',
      'churchIf churchFalse selects second',
      'churchNot true is False',
      'churchNot false is True',
      'churchAnd true true is True',
      'churchAnd true false is False',
      'churchAnd false true is False',
      'churchOr false false is False',
      'churchOr false true is True',
      'churchOr true false is True',
    ],
  },

  'church-numerals': {
    id: 'church-numerals',
    title: 'Church Numerals: Numbers from Pure Functions',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>If booleans are selectors, what are numbers? Church's insight: a natural number <strong>n</strong> is a function that applies another function <strong>n times</strong>.</p>

<h3>Church Numerals</h3>
<p>A Church numeral takes a function <code>f</code> and a base value <code>x</code>, then applies <code>f</code> to <code>x</code> exactly <em>n</em> times:</p>
<pre><code>-- 0 applies f zero times:  \\f x -> x
-- 1 applies f once:        \\f x -> f x
-- 2 applies f twice:       \\f x -> f (f x)
-- 3 applies f three times: \\f x -> f (f (f x))</code></pre>
<p>We use a type alias to keep signatures readable:</p>
<pre><code>type ChurchNum = (Int -> Int) -> Int -> Int</code></pre>
<p>Note: in the pure lambda calculus this would be polymorphic, but we specialize to <code>Int</code> for simplicity.</p>

<h3>Converting to Int</h3>
<p>To see what number a Church numeral represents, pass in <code>(+1)</code> and <code>0</code>:</p>
<pre><code>toInt n = n (+1) 0
-- toInt two = two (+1) 0 = (+1) ((+1) 0) = 2</code></pre>

<h3>Successor</h3>
<p>The successor of <code>n</code> applies <code>f</code> one more time than <code>n</code> does:</p>
<pre><code>successor n f x = f (n f x)</code></pre>
<p>Think of it as: first let <code>n</code> do its thing, then apply <code>f</code> one more time on top.</p>

<h3>Addition</h3>
<p>To add <code>m + n</code>: apply <code>f</code> <em>m</em> times, then apply <code>f</code> <em>n</em> more times:</p>
<pre><code>add m n f x = m f (n f x)</code></pre>
<p>First <code>n</code> applies <code>f</code> <em>n</em> times to <code>x</code>, then <code>m</code> applies <code>f</code> <em>m</em> more times to that result.</p>

<h3>Multiplication</h3>
<p>To multiply <code>m * n</code>: apply "apply-f-n-times" <em>m</em> times. That is, compose <code>n f</code> with itself <code>m</code> times:</p>
<pre><code>mul m n f = m (n f)</code></pre>
<p><code>n f</code> is a function that applies <code>f</code> <em>n</em> times. Applying that function <em>m</em> times gives <code>m * n</code> total applications.</p>

<h3>Your Task</h3>
<p>Define <code>zero</code>, <code>one</code>, <code>two</code>, <code>toInt</code>, <code>successor</code>, <code>add</code>, and <code>mul</code>. Verify with the tests that your arithmetic works.</p>
`,
    starterCode: `module ChurchNumerals where

-- A Church numeral applies a function f to a value x some number of times.
type ChurchNum = (Int -> Int) -> Int -> Int

-- | Zero applies f zero times.
zero :: ChurchNum
zero f x = error "apply f zero times"

-- | One applies f once.
one :: ChurchNum
one f x = error "apply f once"

-- | Two applies f twice.
two :: ChurchNum
two f x = error "apply f twice"

-- | Convert a Church numeral to a Haskell Int.
--   Pass (+1) as the function and 0 as the base.
toInt :: ChurchNum -> Int
toInt n = error "apply n to (+1) and 0"

-- | Successor: apply f one more time than n does.
successor :: ChurchNum -> ChurchNum
successor n f x = error "f applied to (n f x)"

-- | Addition: apply f m times after applying it n times.
add :: ChurchNum -> ChurchNum -> ChurchNum
add m n f x = error "m f composed with n f"

-- | Multiplication: apply (n f) m times.
mul :: ChurchNum -> ChurchNum -> ChurchNum
mul m n f = error "m applied to (n f)"
`,
    solutionCode: `module ChurchNumerals where

type ChurchNum = (Int -> Int) -> Int -> Int

zero :: ChurchNum
zero f x = x

one :: ChurchNum
one f x = f x

two :: ChurchNum
two f x = f (f x)

toInt :: ChurchNum -> Int
toInt n = n (+1) 0

successor :: ChurchNum -> ChurchNum
successor n f x = f (n f x)

add :: ChurchNum -> ChurchNum -> ChurchNum
add m n f x = m f (n f x)

mul :: ChurchNum -> ChurchNum -> ChurchNum
mul m n f = m (n f)
`,
    testCode: `runTestEq "toInt zero" 0 (toInt zero)
        , runTestEq "toInt one" 1 (toInt one)
        , runTestEq "toInt two" 2 (toInt two)
        , runTestEq "successor zero" 1 (toInt (successor zero))
        , runTestEq "successor two" 3 (toInt (successor two))
        , runTestEq "add one two" 3 (toInt (add one two))
        , runTestEq "add two (successor two)" 5 (toInt (add two (successor two)))
        , runTestEq "mul two two" 4 (toInt (mul two two))
        , runTestEq "mul two (successor two)" 6 (toInt (mul two (successor two)))
        , runTestEq "add zero one" 1 (toInt (add zero one))
        , runTestEq "mul zero two" 0 (toInt (mul zero two))`,
    hints: [
      '<code>zero</code> applies <code>f</code> zero times, so it just returns <code>x</code>. <code>one</code> applies <code>f</code> once: <code>f x</code>. <code>two</code> applies <code>f</code> twice: <code>f (f x)</code>.',
      'For <code>toInt</code>, you need to "observe" how many times the numeral applies its function. Pass in <code>(+1)</code> and start from <code>0</code>: <code>n (+1) 0</code>. Each application increments by 1.',
      'For <code>successor</code>, think of it as "do what <code>n</code> does, then one more <code>f</code>": <code>f (n f x)</code>. The <code>n f x</code> part applies <code>f</code> n times, then the outer <code>f</code> adds one more.',
      'For <code>add m n</code>: first apply <code>f</code> n times via <code>n f x</code>, then apply <code>f</code> m more times via <code>m f (...)</code>. For <code>mul m n</code>: <code>n f</code> applies <code>f</code> n times; doing that m times gives <code>m * n</code> total: <code>m (n f)</code>.',
    ],
    concepts: ['church-encoding', 'lambda-calculus', 'natural-numbers', 'function-composition', 'iteration'],
    successPatterns: [
      'zero\\s+f\\s+x\\s*=\\s*x',
      'one\\s+f\\s+x\\s*=\\s*f\\s+x',
      'successor\\s+n\\s+f\\s+x\\s*=\\s*f\\s*\\(n\\s+f\\s+x\\)',
      'add\\s+m\\s+n\\s+f\\s+x\\s*=\\s*m\\s+f\\s*\\(n\\s+f\\s+x\\)',
    ],
    testNames: [
      'toInt zero is 0',
      'toInt one is 1',
      'toInt two is 2',
      'successor zero is 1',
      'successor two is 3',
      'add one two is 3',
      'add two (successor two) is 5',
      'mul two two is 4',
      'mul two (successor two) is 6',
      'add zero one is 1',
      'mul zero two is 0',
    ],
  },

  'church-pairs-maybe': {
    id: 'church-pairs-maybe',
    title: 'Church Pairs and Maybe',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>Church encodings extend beyond booleans and numbers. We can encode <strong>pairs</strong> (tuples) and <strong>option types</strong> (Maybe) as pure functions too. The key idea remains the same: data is represented by the function that <em>eliminates</em> it.</p>

<h3>Church Pairs</h3>
<p>A pair holds two values and lets you extract either one. We encode a pair as a function waiting for an "accessor":</p>
<pre><code>-- A Church pair stores a and b, and takes an accessor function:
churchPair a b = \\f -> f a b</code></pre>
<p>To extract the first or second element, pass the right accessor:</p>
<pre><code>churchFst p = p (\\a _ -> a)   -- pass accessor that picks first
churchSnd p = p (\\_ b -> b)   -- pass accessor that picks second</code></pre>
<p>Notice the beautiful symmetry: a pair is just a function that holds two values "in closure" and feeds them to whatever accessor you provide.</p>

<h3>The Types</h3>
<p>The types look unusual but follow directly from the encoding:</p>
<pre><code>churchPair :: a -> b -> (a -> b -> c) -> c
churchFst  :: ((a -> b -> a) -> a) -> a
churchSnd  :: ((a -> b -> b) -> b) -> b</code></pre>
<p>Read <code>churchPair</code> as: "give me two values and an accessor, I'll apply the accessor to the values." The result type <code>c</code> is determined by the accessor.</p>

<h3>Church Maybe</h3>
<p>Haskell's <code>Maybe a</code> is either <code>Nothing</code> or <code>Just x</code>. Church-encoded, a Maybe is a function that takes two arguments: a default value and a function for the Just case:</p>
<pre><code>-- Church Nothing: ignore the function, return the default
churchNothing :: b -> (a -> b) -> b
churchNothing def f = def

-- Church Just: ignore the default, apply the function
churchJust :: a -> b -> (a -> b) -> b
churchJust x def f = f x

-- Convert back to Haskell Maybe:
toMaybe :: (Maybe a -> (a -> Maybe a) -> Maybe a) -> Maybe a
toMaybe m = m Nothing Just</code></pre>

<h3>Your Task</h3>
<p>Implement <code>churchPair</code>, <code>churchFst</code>, <code>churchSnd</code>, <code>churchNothing</code>, <code>churchJust</code>, and <code>toMaybe</code>. These simple building blocks demonstrate that <em>all</em> standard data types can emerge from pure lambda calculus.</p>
`,
    starterCode: `module ChurchPairsMaybe where

-- ── Church Pairs ────────────────────────────────────────────────

-- | Construct a Church pair: store a and b, wait for an accessor.
churchPair :: a -> b -> (a -> b -> c) -> c
churchPair a b f = error "apply f to a and b"

-- | Extract the first element of a Church pair.
churchFst :: ((a -> b -> a) -> a) -> a
churchFst p = error "pass an accessor that picks the first"

-- | Extract the second element of a Church pair.
churchSnd :: ((a -> b -> b) -> b) -> b
churchSnd p = error "pass an accessor that picks the second"

-- ── Church Maybe ────────────────────────────────────────────────

-- | Church Nothing: ignore the function, return the default.
churchNothing :: b -> (a -> b) -> b
churchNothing def f = error "return the default value"

-- | Church Just: apply the function to the wrapped value.
churchJust :: a -> b -> (a -> b) -> b
churchJust x def f = error "apply f to x"

-- | Convert a Church Maybe to a Haskell Maybe.
--   Pass Nothing as the default and Just as the function.
toMaybe :: (Maybe a -> (a -> Maybe a) -> Maybe a) -> Maybe a
toMaybe m = error "apply m to Nothing and Just"
`,
    solutionCode: `module ChurchPairsMaybe where

-- ── Church Pairs ────────────────────────────────────────────────

churchPair :: a -> b -> (a -> b -> c) -> c
churchPair a b f = f a b

churchFst :: ((a -> b -> a) -> a) -> a
churchFst p = p (\\a _ -> a)

churchSnd :: ((a -> b -> b) -> b) -> b
churchSnd p = p (\\_ b -> b)

-- ── Church Maybe ────────────────────────────────────────────────

churchNothing :: b -> (a -> b) -> b
churchNothing def f = def

churchJust :: a -> b -> (a -> b) -> b
churchJust x def f = f x

toMaybe :: (Maybe a -> (a -> Maybe a) -> Maybe a) -> Maybe a
toMaybe m = m Nothing Just
`,
    testCode: `runTestEq "churchFst (pair 1 2)" (1 :: Int) (churchFst (churchPair 1 2))
        , runTestEq "churchSnd (pair 1 2)" (2 :: Int) (churchSnd (churchPair 1 2))
        , runTestEq "churchFst (pair True False)" True (churchFst (churchPair True False))
        , runTestEq "churchSnd (pair True False)" False (churchSnd (churchPair True False))
        , runTestEq "churchFst strings" "hello" (churchFst (churchPair "hello" "world"))
        , runTestEq "churchSnd strings" "world" (churchSnd (churchPair "hello" "world"))
        , runTestEq "nested pair fst" (1 :: Int) (churchFst (churchPair 1 (churchPair 2 3)))
        , runTestEq "churchNothing" (0 :: Int) (churchNothing 0 (+1))
        , runTestEq "churchJust 5" (6 :: Int) (churchJust 5 0 (+1))
        , runTestEq "toMaybe churchNothing" (Nothing :: Maybe Int) (toMaybe (churchNothing :: Maybe Int -> (Int -> Maybe Int) -> Maybe Int))
        , runTestEq "toMaybe churchJust" (Just 42 :: Maybe Int) (toMaybe (churchJust 42))`,
    hints: [
      'For <code>churchPair</code>: you have values <code>a</code> and <code>b</code> and an accessor <code>f</code>. Just apply: <code>f a b</code>. The pair "stores" its values in a closure.',
      'For <code>churchFst</code>: you need to pass an accessor that ignores the second argument: <code>p (\\a _ -> a)</code>. For <code>churchSnd</code>: <code>p (\\_ b -> b)</code>.',
      'For <code>churchNothing</code>: it represents "no value" — just return <code>def</code> and ignore <code>f</code>. For <code>churchJust x</code>: it wraps a value — apply <code>f</code> to <code>x</code> and ignore <code>def</code>.',
      'For <code>toMaybe</code>: a Church Maybe takes a default and a function. Pass <code>Nothing</code> as the default and <code>Just</code> as the function: <code>m Nothing Just</code>.',
    ],
    concepts: ['church-encoding', 'lambda-calculus', 'pairs', 'maybe', 'closures', 'elimination'],
    successPatterns: [
      'churchPair\\s+a\\s+b\\s+f\\s*=\\s*f\\s+a\\s+b',
      'churchFst',
      'churchSnd',
      'churchNothing\\s+def\\s+f\\s*=\\s*def',
      'churchJust\\s+x\\s+def\\s+f\\s*=\\s*f\\s+x',
    ],
    testNames: [
      'churchFst (churchPair 1 2) is 1',
      'churchSnd (churchPair 1 2) is 2',
      'churchFst on Bool pair is True',
      'churchSnd on Bool pair is False',
      'churchFst on String pair',
      'churchSnd on String pair',
      'nested pair: fst of pair with nested snd',
      'churchNothing returns default',
      'churchJust applies function',
      'toMaybe churchNothing is Nothing',
      'toMaybe (churchJust 42) is Just 42',
    ],
  },

  'reduction-strategies': {
    id: 'reduction-strategies',
    title: 'Reduction Strategies: How Haskell Evaluates',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p>Lambda calculus defines <em>what</em> to compute but not <em>in what order</em>. Different <strong>reduction strategies</strong> specify which redex (reducible expression) to evaluate first. Haskell's choice — <strong>lazy evaluation</strong> (call-by-need) — has profound consequences.</p>

<h3>Reduction Strategies in Lambda Calculus</h3>
<table>
  <thead><tr><th>Strategy</th><th>Rule</th><th>Used By</th></tr></thead>
  <tbody>
    <tr><td><strong>Normal order</strong></td><td>Reduce the <em>leftmost, outermost</em> redex first</td><td>Theoretical lambda calculus</td></tr>
    <tr><td><strong>Applicative order</strong></td><td>Reduce the <em>leftmost, innermost</em> redex first (evaluate arguments before substitution)</td><td>Most languages (C, Python, Java)</td></tr>
    <tr><td><strong>Call-by-need (lazy)</strong></td><td>Normal order + <em>sharing</em>: a thunk is evaluated at most once, then cached</td><td>Haskell</td></tr>
  </tbody>
</table>

<h3>Why It Matters</h3>
<p>In strict (applicative-order) languages, <code>fst (1 + 2, error "boom")</code> would crash — both components of the tuple are evaluated before <code>fst</code> runs. In Haskell's lazy evaluation, the second component is never needed, so the error is never triggered:</p>
<pre><code>fst (1 + 2, error "boom")   -- Haskell: evaluates to 3
                              -- Strict: crashes!</code></pre>

<h3>Thunks and Weak Head Normal Form (WHNF)</h3>
<p>Haskell evaluates expressions to <strong>Weak Head Normal Form</strong> (WHNF) — just enough to determine the outermost constructor or lambda, leaving the rest as unevaluated <em>thunks</em>:</p>
<ul>
  <li><code>[1, 2, error "boom"]</code> in WHNF is <code>1 : (2 : error "boom" : [])</code> — the spine is a cons cell</li>
  <li><code>null</code> only checks if the list is <code>[]</code> or <code>(_ : _)</code> — it doesn't evaluate elements</li>
  <li><code>take 3 [1..]</code> only forces the first 3 elements of an infinite list</li>
</ul>

<h3>Key Patterns</h3>
<p>These patterns appear constantly in Haskell:</p>
<ul>
  <li><code>const a b = a</code> — the second argument is never evaluated</li>
  <li><code>head (map f xs)</code> — only <code>f (head xs)</code> is computed</li>
  <li><code>take n infinite</code> — laziness makes infinite structures usable</li>
</ul>

<h3>Your Task</h3>
<p>Predict what each expression evaluates to. Think carefully about which sub-expressions are actually <em>needed</em> and which remain as unevaluated thunks.</p>
`,
    starterCode: `module ReductionStrategies where

-- EXERCISE: Predict the result of each expression.
-- Replace each \`error "..."\` with the value you think it evaluates to.
-- Think about Haskell's LAZY evaluation: what gets evaluated and what doesn't?

-- 1. fst (1 + 2, error "boom")
--    Does the second element of the tuple get evaluated?
answer1 :: Int
answer1 = error "what does fst do with the pair?"

-- 2. take 3 [1..]
--    [1..] is an infinite list. How many elements does take force?
answer2 :: [Int]
answer2 = error "first three elements of the infinite list"

-- 3. const 42 (error "nope")
--    const a b = a. Is the second argument needed?
answer3 :: Int
answer3 = error "what does const return?"

-- 4. head (map (*2) [1..])
--    map (*2) [1..] is an infinite list. What does head need?
answer4 :: Int
answer4 = error "head only needs the first element"

-- 5. null [error "boom"]
--    null checks if a list is empty. Does it look at the elements?
answer5 :: Bool
answer5 = error "is the list empty?"

-- 6. snd (error "left", 42)
--    snd only needs the second component.
answer6 :: Int
answer6 = error "what does snd extract?"

-- 7. length (take 5 [1..])
--    How many elements does take 5 produce from an infinite list?
answer7 :: Int
answer7 = error "how long is the taken list?"

-- 8. head [3, error "never"]
--    head only looks at the first element of a list.
answer8 :: Int
answer8 = error "what is the first element?"
`,
    solutionCode: `module ReductionStrategies where

answer1 :: Int
answer1 = 3

answer2 :: [Int]
answer2 = [1, 2, 3]

answer3 :: Int
answer3 = 42

answer4 :: Int
answer4 = 2

answer5 :: Bool
answer5 = False

answer6 :: Int
answer6 = 42

answer7 :: Int
answer7 = 5

answer8 :: Int
answer8 = 3
`,
    testCode: `runTestEq "fst (1+2, error)" (3 :: Int) answer1
        , runTestEq "take 3 [1..]" [1, 2, 3 :: Int] answer2
        , runTestEq "const 42 (error)" (42 :: Int) answer3
        , runTestEq "head (map (*2) [1..])" (2 :: Int) answer4
        , runTestEq "null [error boom]" False answer5
        , runTestEq "snd (error, 42)" (42 :: Int) answer6
        , runTestEq "length (take 5 [1..])" (5 :: Int) answer7
        , runTestEq "head [3, error]" (3 :: Int) answer8`,
    hints: [
      '<code>fst</code> only needs the first element of a pair, and <code>snd</code> only needs the second. Haskell won\'t evaluate the component that isn\'t needed, so <code>error</code> in the unused component is harmless.',
      '<code>take 3 [1..]</code> forces exactly 3 elements from the infinite list. <code>const a b = a</code> discards <code>b</code> entirely. In both cases, laziness means unnecessary expressions stay as unevaluated thunks.',
      '<code>null</code> checks the <em>structure</em> of a list — is it <code>[]</code> or <code>(_ : _)</code>? It does NOT evaluate the elements. A non-empty list with <code>error</code> as its element is still non-empty, so <code>null</code> returns <code>False</code>.',
      '<code>head (map (*2) [1..])</code> only computes <code>(*2) 1 = 2</code>. Lazy evaluation means <code>map</code> only transforms the element that <code>head</code> demands. <code>head [3, error "never"]</code> returns <code>3</code> because the second element is never forced.',
    ],
    concepts: ['lazy-evaluation', 'reduction-strategy', 'thunks', 'WHNF', 'normal-order', 'applicative-order', 'call-by-need'],
    successPatterns: [
      'answer1\\s*=\\s*3',
      'answer2\\s*=\\s*\\[1,\\s*2,\\s*3\\]',
      'answer3\\s*=\\s*42',
      'answer5\\s*=\\s*False',
    ],
    testNames: [
      'fst (1+2, error "boom") evaluates to 3',
      'take 3 [1..] evaluates to [1,2,3]',
      'const 42 (error "nope") evaluates to 42',
      'head (map (*2) [1..]) evaluates to 2',
      'null [error "boom"] evaluates to False',
      'snd (error "left", 42) evaluates to 42',
      'length (take 5 [1..]) evaluates to 5',
      'head [3, error "never"] evaluates to 3',
    ],
  },

  'fixpoint-recursion': {
    id: 'fixpoint-recursion',
    title: 'Fixed Points: Recursion from Lambda Calculus',
    difficulty: 'intermediate',
    order: 5,
    description: `
<p>The pure untyped lambda calculus has no built-in recursion — there's no way to name a function and refer to that name inside the body. Yet Church and his students proved that recursion <em>is</em> still possible, using <strong>fixed-point combinators</strong>.</p>

<h3>What Is a Fixed Point?</h3>
<p>A <em>fixed point</em> of a function <code>f</code> is a value <code>x</code> such that <code>f x = x</code>. For example, 0 is a fixed point of <code>(*2)</code> because <code>0 * 2 = 0</code>.</p>
<p>A <strong>fixed-point combinator</strong> <code>fix</code> finds fixed points of <em>higher-order</em> functions:</p>
<pre><code>fix f = f (fix f)</code></pre>
<p>This equation says: <code>fix f</code> is a value <code>x</code> such that <code>x = f x</code>.</p>

<h3>How fix Enables Recursion</h3>
<p>Suppose we want factorial but can't use recursion directly. We write a "blueprint" function that takes its recursive self as an argument:</p>
<pre><code>factBlueprint :: (Int -> Int) -> (Int -> Int)
factBlueprint recur n = if n <= 0 then 1 else n * recur (n - 1)</code></pre>
<p><code>factBlueprint</code> doesn't call itself — it calls whatever <code>recur</code> function is passed in. The magic of <code>fix</code> is that it feeds the blueprint <em>its own output</em> as the <code>recur</code> argument:</p>
<pre><code>factorial = fix factBlueprint
-- fix factBlueprint
-- = factBlueprint (fix factBlueprint)
-- = factBlueprint (factBlueprint (fix factBlueprint))
-- = ...</code></pre>
<p>Laziness ensures this infinite unfolding only proceeds as far as needed.</p>

<h3>The Y Combinator</h3>
<p>In the untyped lambda calculus, the fixed-point combinator is written as:</p>
<pre><code>Y = \\f. (\\x. f (x x)) (\\x. f (x x))</code></pre>
<p>In Haskell, we can write it more directly thanks to recursive let-bindings:</p>
<pre><code>fix :: (a -> a) -> a
fix f = let x = f x in x</code></pre>
<p>Both definitions satisfy the equation <code>fix f = f (fix f)</code>.</p>

<h3>Your Task</h3>
<p>Implement <code>fix</code>, then use it to define <code>factorial</code> and <code>fibonacci</code> without explicit recursion in their definitions. Each function is defined by passing a "blueprint" to <code>fix</code>.</p>
`,
    starterCode: `module FixpointRecursion where

-- | The fixed-point combinator: fix f = f (fix f)
--   This enables recursion without self-reference.
fix :: (a -> a) -> a
fix f = error "f applied to (fix f)"

-- | Factorial via fix.
--   Write a lambda \\recur n -> ... that uses recur for the recursive call.
--   factorial 0 = 1, factorial n = n * factorial (n-1)
factorial :: Int -> Int
factorial = error "fix (\\\\recur n -> ...)"

-- | Fibonacci via fix.
--   fib 0 = 0, fib 1 = 1, fib n = fib (n-1) + fib (n-2)
fibonacci :: Int -> Int
fibonacci = error "fix (\\\\recur n -> ...)"

-- | sumTo via fix: sum of [1..n]
--   sumTo 0 = 0, sumTo n = n + sumTo (n-1)
sumTo :: Int -> Int
sumTo = error "fix (\\\\recur n -> ...)"
`,
    solutionCode: `module FixpointRecursion where

fix :: (a -> a) -> a
fix f = f (fix f)

factorial :: Int -> Int
factorial = fix (\\recur n -> if n <= 0 then 1 else n * recur (n - 1))

fibonacci :: Int -> Int
fibonacci = fix (\\recur n -> if n <= 1 then n else recur (n - 1) + recur (n - 2))

sumTo :: Int -> Int
sumTo = fix (\\recur n -> if n <= 0 then 0 else n + recur (n - 1))
`,
    testCode: `runTestEq "factorial 0" (1 :: Int) (factorial 0)
        , runTestEq "factorial 1" (1 :: Int) (factorial 1)
        , runTestEq "factorial 5" (120 :: Int) (factorial 5)
        , runTestEq "factorial 10" (3628800 :: Int) (factorial 10)
        , runTestEq "fibonacci 0" (0 :: Int) (fibonacci 0)
        , runTestEq "fibonacci 1" (1 :: Int) (fibonacci 1)
        , runTestEq "fibonacci 10" (55 :: Int) (fibonacci 10)
        , runTestEq "fibonacci 6" (8 :: Int) (fibonacci 6)
        , runTestEq "sumTo 0" (0 :: Int) (sumTo 0)
        , runTestEq "sumTo 5" (15 :: Int) (sumTo 5)
        , runTestEq "sumTo 100" (5050 :: Int) (sumTo 100)`,
    hints: [
      '<code>fix</code> satisfies the equation <code>fix f = f (fix f)</code>. That\'s literally the implementation: <code>fix f = f (fix f)</code>. Haskell\'s laziness ensures this doesn\'t loop infinitely — it only unfolds as much as needed.',
      'For <code>factorial</code>: write a blueprint that receives its own recursive self. <code>fix (\\recur n -> if n <= 0 then 1 else n * recur (n - 1))</code>. The <code>recur</code> parameter IS the factorial function — <code>fix</code> makes it so.',
      'For <code>fibonacci</code>: the blueprint takes <code>recur</code> and <code>n</code>. Base cases: <code>n <= 1</code> returns <code>n</code> (so fib 0 = 0, fib 1 = 1). Recursive: <code>recur (n-1) + recur (n-2)</code>.',
      'For <code>sumTo</code>: similar pattern. The blueprint is <code>\\recur n -> if n <= 0 then 0 else n + recur (n - 1)</code>. Each recursive function follows the same pattern: pass a lambda to <code>fix</code> where the first argument is the recursive call.',
    ],
    concepts: ['fixed-point', 'Y-combinator', 'recursion', 'lambda-calculus', 'lazy-evaluation', 'self-reference'],
    successPatterns: [
      'fix\\s+f\\s*=\\s*f\\s*\\(fix\\s+f\\)',
      'factorial\\s*=\\s*fix',
      'fibonacci\\s*=\\s*fix',
      'sumTo\\s*=\\s*fix',
    ],
    testNames: [
      'factorial 0 is 1',
      'factorial 1 is 1',
      'factorial 5 is 120',
      'factorial 10 is 3628800',
      'fibonacci 0 is 0',
      'fibonacci 1 is 1',
      'fibonacci 10 is 55',
      'fibonacci 6 is 8',
      'sumTo 0 is 0',
      'sumTo 5 is 15',
      'sumTo 100 is 5050',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LAMBDA CALCULUS III: TYPES & INTERPRETERS MODULE
  // ═══════════════════════════════════════════════════════════════════

  'curry-howard': {
    id: 'curry-howard',
    title: 'Curry-Howard: Types as Propositions, Programs as Proofs',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Curry-Howard Correspondence</h3>
<p>One of the deepest ideas in computer science: <strong>types are propositions</strong> and <strong>programs are proofs</strong>. Every type signature is a logical statement, and every function that satisfies that signature is a constructive proof that the statement is true.</p>

<h3>The Dictionary</h3>
<table>
  <thead><tr><th>Logic</th><th>Types</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Proposition A</td><td>Type <code>a</code></td><td>Any inhabited type</td></tr>
    <tr><td>A AND B</td><td><code>(a, b)</code></td><td>Pairs / tuples</td></tr>
    <tr><td>A OR B</td><td><code>Either a b</code></td><td>Sum types</td></tr>
    <tr><td>A IMPLIES B</td><td><code>a -> b</code></td><td>Functions</td></tr>
    <tr><td>TRUE</td><td><code>()</code></td><td>Unit &mdash; always provable</td></tr>
    <tr><td>Proof</td><td>A program of that type</td><td>Writing the function body</td></tr>
  </tbody>
</table>

<h3>Key Logical Rules as Types</h3>
<ul>
  <li><strong>Reflexivity (identity):</strong> <code>a -> a</code> &mdash; "A implies A" is trivially true</li>
  <li><strong>AND elimination:</strong> <code>(a, b) -> a</code> &mdash; from "A and B", we can conclude A</li>
  <li><strong>AND commutativity:</strong> <code>(a, b) -> (b, a)</code> &mdash; "A and B" implies "B and A"</li>
  <li><strong>OR introduction:</strong> <code>a -> Either a b</code> &mdash; from A, we know "A or B"</li>
  <li><strong>Case analysis:</strong> <code>(a -> c) -> (b -> c) -> Either a b -> c</code> &mdash; if both A and B imply C, and we have "A or B", then C</li>
  <li><strong>Transitivity (composition):</strong> <code>(a -> b) -> (b -> c) -> (a -> c)</code> &mdash; if A implies B and B implies C, then A implies C</li>
  <li><strong>Uncurrying:</strong> <code>(a -> b -> c) -> (a, b) -> c</code> &mdash; converts curried to uncurried</li>
  <li><strong>Currying:</strong> <code>((a, b) -> c) -> a -> b -> c</code> &mdash; converts uncurried to curried</li>
</ul>

<h3>Why This Matters</h3>
<p>In dependently typed languages like Agda, Coq, and Lean, this correspondence is used to write <em>machine-checked proofs</em>. In Haskell, it gives us intuition: if you can write a total function with a given type, you've proved the corresponding logical statement.</p>

<h3>Your Task</h3>
<p>Write eight functions that "prove" type-theoretic propositions. Each function's type signature <em>is</em> the proposition &mdash; your implementation is the proof. The types constrain your code so much that there is essentially only one way to write each function.</p>
`,
    starterCode: `module CurryHoward where

-- The Curry-Howard correspondence: types = propositions, programs = proofs.
-- Each function below has a type that represents a logical proposition.
-- Your job: write the ONLY possible implementation (the proof).

-- 1. Identity = Reflexivity: "A implies A"
proof1 :: a -> a
proof1 = error "prove: A implies A"

-- 2. AND elimination: "A and B implies A"
proof2 :: (a, b) -> a
proof2 = error "prove: (A AND B) implies A"

-- 3. AND commutativity: "A and B implies B and A"
proof3 :: (a, b) -> (b, a)
proof3 = error "prove: (A AND B) implies (B AND A)"

-- 4. OR introduction: "A implies A or B"
proof4 :: a -> Either a b
proof4 = error "prove: A implies (A OR B)"

-- 5. Case analysis: "If A->C and B->C and (A or B), then C"
proof5 :: (a -> c) -> (b -> c) -> Either a b -> c
proof5 = error "prove: case analysis on Either"

-- 6. Transitivity = Composition: "A->B and B->C implies A->C"
proof6 :: (a -> b) -> (b -> c) -> (a -> c)
proof6 = error "prove: transitivity of implication"

-- 7. Uncurrying: "If A implies (B implies C), then (A AND B) implies C"
proof7 :: (a -> b -> c) -> (a, b) -> c
proof7 = error "prove: uncurrying"

-- 8. Currying: "If (A AND B) implies C, then A implies B implies C"
proof8 :: ((a, b) -> c) -> a -> b -> c
proof8 = error "prove: currying"
`,
    solutionCode: `module CurryHoward where

-- 1. Identity = Reflexivity
proof1 :: a -> a
proof1 x = x

-- 2. AND elimination (fst)
proof2 :: (a, b) -> a
proof2 (a, _) = a

-- 3. AND commutativity
proof3 :: (a, b) -> (b, a)
proof3 (a, b) = (b, a)

-- 4. OR introduction (Left)
proof4 :: a -> Either a b
proof4 a = Left a

-- 5. Case analysis (either)
proof5 :: (a -> c) -> (b -> c) -> Either a b -> c
proof5 f _ (Left a)  = f a
proof5 _ g (Right b) = g b

-- 6. Transitivity = Composition
proof6 :: (a -> b) -> (b -> c) -> (a -> c)
proof6 f g x = g (f x)

-- 7. Uncurrying
proof7 :: (a -> b -> c) -> (a, b) -> c
proof7 f (a, b) = f a b

-- 8. Currying
proof8 :: ((a, b) -> c) -> a -> b -> c
proof8 f a b = f (a, b)
`,
    testCode: `runTestEq "proof1 42 = 42 (identity)" (42 :: Int) (proof1 42)
        , runTestEq "proof1 True = True" True (proof1 True)
        , runTestEq "proof2 (1, x) = 1 (AND elim)" (1 :: Int) (proof2 (1, "x"))
        , runTestEq "proof2 (True, 42) = True" True (proof2 (True, 42 :: Int))
        , runTestEq "proof3 (1, y) = (y, 1) (AND comm)" ("y", 1 :: Int) (proof3 (1 :: Int, "y"))
        , runTestEq "proof4 42 = Left 42 (OR intro)" (Left 42 :: Either Int String) (proof4 42)
        , runTestEq "proof5 Left case" (10 :: Int) (proof5 (+1) (*2) (Left (9 :: Int)))
        , runTestEq "proof5 Right case" (10 :: Int) (proof5 (+1) (*2) (Right (5 :: Int)))
        , runTestEq "proof6 (+1) (*2) 3 = 8 (compose)" (8 :: Int) (proof6 (+1) (*2) (3 :: Int))
        , runTestEq "proof7 add pair" (7 :: Int) (proof7 (\\a b -> a + b) (3 :: Int, 4 :: Int))
        , runTestEq "proof8 fst-of-pair via currying" (5 :: Int) (proof8 fst (5 :: Int) (10 :: Int))`,
    hints: [
      'For <code>proof1</code>: the only thing you can do with a value of type <code>a</code> is return it. The identity function <code>\\x -> x</code> is the unique proof of <code>a -> a</code>.',
      'For <code>proof2</code> and <code>proof3</code>: pattern match the tuple <code>(a, b)</code>. For AND elimination, return the first component. For commutativity, swap the components.',
      'For <code>proof4</code>: wrap the value with <code>Left</code>. For <code>proof5</code>: pattern match <code>Either a b</code> &mdash; apply the first function to <code>Left</code> values, the second to <code>Right</code> values. This is exactly <code>either</code>.',
      'For <code>proof6</code>: compose the two functions &mdash; <code>\\x -> g (f x)</code>. For <code>proof7</code>: pattern match the tuple and apply the curried function. For <code>proof8</code>: take two extra arguments and build the tuple to pass to <code>f</code>.',
    ],
    concepts: ['curry-howard', 'propositions-as-types', 'proofs-as-programs', 'logic', 'composition', 'currying'],
    successPatterns: [
      'proof1\\s+x\\s*=\\s*x',
      'proof2.*\\(a.*,',
      'proof5.*Left|proof5.*Right',
      'proof6.*g\\s*\\(f|proof6.*\\.\\s*',
    ],
    testNames: [
      'proof1 identity on Int',
      'proof1 identity on Bool',
      'proof2 AND elimination (fst)',
      'proof2 AND elimination (Bool, Int)',
      'proof3 AND commutativity',
      'proof4 OR introduction (Left)',
      'proof5 case analysis Left branch',
      'proof5 case analysis Right branch',
      'proof6 transitivity/composition',
      'proof7 uncurrying',
      'proof8 currying',
    ],
  },

  'cps-transform': {
    id: 'cps-transform',
    title: 'Continuation-Passing Style',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>What Is CPS?</h3>
<p>In <strong>continuation-passing style</strong>, functions never "return" a value. Instead, they receive an extra argument &mdash; a <em>continuation</em> <code>k</code> &mdash; and pass their result to <code>k</code> instead of returning it. This transforms the implicit call stack into an explicit chain of function calls.</p>

<h3>Direct Style vs CPS</h3>
<table>
  <thead><tr><th>Direct Style</th><th>CPS</th></tr></thead>
  <tbody>
    <tr><td><code>add x y = x + y</code></td><td><code>addCPS x y k = k (x + y)</code></td></tr>
    <tr><td><code>square x = x * x</code></td><td><code>squareCPS x k = k (x * x)</code></td></tr>
    <tr><td><code>f (g x)</code></td><td><code>gCPS x (\\r -> fCPS r k)</code></td></tr>
  </tbody>
</table>
<p>The continuation <code>k</code> says "what to do next with the result." To extract the final value, pass <code>id</code> as the continuation.</p>

<h3>Composing CPS Functions</h3>
<p>The power of CPS emerges when you <strong>chain</strong> computations. Instead of nested calls like <code>mul (add x y) (add x y)</code>, you thread continuations:</p>
<pre><code>squareSumCPS x y k = addCPS x y (\\s -> mulCPS s s k)
-- "add x and y, then take that sum s, multiply s*s, pass to k"</code></pre>

<h3>CPS Conversion</h3>
<p>Any direct-style function <code>f :: a -> b</code> can be converted to CPS:</p>
<pre><code>toCPS :: (a -> b) -> a -> (b -> r) -> r
toCPS f a k = k (f a)</code></pre>

<h3>Extracting Results</h3>
<p>To get the final value out of a CPS computation, pass <code>id</code> as the continuation:</p>
<pre><code>runCPS :: ((a -> a) -> a) -> a
runCPS f = f id</code></pre>

<h3>Recursive CPS: Fibonacci</h3>
<p>CPS really shines with recursion. The recursive calls pass their results to lambdas instead of returning:</p>
<pre><code>fibCPS 0 k = k 0
fibCPS 1 k = k 1
fibCPS n k = fibCPS (n-1) (\\a ->
             fibCPS (n-2) (\\b ->
             k (a + b)))</code></pre>
<p>Each recursive call says "when you have the answer, continue with this lambda." The two branches of Fibonacci are sequenced explicitly.</p>

<h3>Your Task</h3>
<p>Implement seven CPS functions: basic arithmetic in CPS, a composed computation, CPS conversion, CPS extraction, and recursive Fibonacci in CPS.</p>
`,
    starterCode: `module CPSTransform where

-- Continuation-Passing Style: functions don't return -- they pass
-- results to a continuation k.

-- 1. addCPS: add two integers, pass result to k
addCPS :: Int -> Int -> (Int -> r) -> r
addCPS x y k = error "pass (x + y) to the continuation"

-- 2. mulCPS: multiply two integers, pass result to k
mulCPS :: Int -> Int -> (Int -> r) -> r
mulCPS x y k = error "pass (x * y) to the continuation"

-- 3. squareCPS: square an integer, pass result to k
squareCPS :: Int -> (Int -> r) -> r
squareCPS x k = error "pass (x * x) to the continuation"

-- 4. squareSumCPS: add x and y, then square the sum, pass to k
--    Hint: use addCPS and mulCPS in sequence via continuations
squareSumCPS :: Int -> Int -> (Int -> r) -> r
squareSumCPS x y k = error "chain addCPS then mulCPS"

-- 5. toCPS: convert any direct-style function to CPS
toCPS :: (a -> b) -> a -> (b -> r) -> r
toCPS f a k = error "apply f to a, pass result to k"

-- 6. runCPS: extract the final value by passing id as continuation
runCPS :: ((a -> a) -> a) -> a
runCPS f = error "pass id to f"

-- 7. fibCPS: Fibonacci in CPS
--    Base cases: fibCPS 0 k = k 0, fibCPS 1 k = k 1
--    Recursive: fibCPS (n-1) and fibCPS (n-2), combine with k
fibCPS :: Int -> (Int -> r) -> r
fibCPS n k = error "implement Fibonacci in CPS"
`,
    solutionCode: `module CPSTransform where

addCPS :: Int -> Int -> (Int -> r) -> r
addCPS x y k = k (x + y)

mulCPS :: Int -> Int -> (Int -> r) -> r
mulCPS x y k = k (x * y)

squareCPS :: Int -> (Int -> r) -> r
squareCPS x k = k (x * x)

squareSumCPS :: Int -> Int -> (Int -> r) -> r
squareSumCPS x y k = addCPS x y (\\s -> mulCPS s s k)

toCPS :: (a -> b) -> a -> (b -> r) -> r
toCPS f a k = k (f a)

runCPS :: ((a -> a) -> a) -> a
runCPS f = f id

fibCPS :: Int -> (Int -> r) -> r
fibCPS 0 k = k 0
fibCPS 1 k = k 1
fibCPS n k = fibCPS (n - 1) (\\a -> fibCPS (n - 2) (\\b -> k (a + b)))
`,
    testCode: `runTestEq "addCPS 3 4 id = 7" (7 :: Int) (addCPS 3 4 id)
        , runTestEq "addCPS 0 0 id = 0" (0 :: Int) (addCPS 0 0 id)
        , runTestEq "mulCPS 3 4 id = 12" (12 :: Int) (mulCPS 3 4 id)
        , runTestEq "mulCPS 5 0 id = 0" (0 :: Int) (mulCPS 5 0 id)
        , runTestEq "squareCPS 5 id = 25" (25 :: Int) (squareCPS 5 id)
        , runTestEq "squareSumCPS 3 4 id = 49" (49 :: Int) (squareSumCPS 3 4 id)
        , runTestEq "squareSumCPS 0 0 id = 0" (0 :: Int) (squareSumCPS 0 0 id)
        , runTestEq "toCPS (+1) 5 id = 6" (6 :: Int) (toCPS (+1) 5 id)
        , runTestEq "toCPS (*2) 10 id = 20" (20 :: Int) (toCPS (*2) 10 id)
        , runTestEq "fibCPS 0 id = 0" (0 :: Int) (fibCPS 0 id)
        , runTestEq "fibCPS 1 id = 1" (1 :: Int) (fibCPS 1 id)
        , runTestEq "fibCPS 10 id = 55" (55 :: Int) (fibCPS 10 id)
        , runTestEq "addCPS 3 4 (*2) = 14" (14 :: Int) (addCPS 3 4 (*2))`,
    hints: [
      'The CPS pattern is simple: where you would <code>return x</code>, instead write <code>k x</code>. For <code>addCPS</code>: <code>k (x + y)</code>.',
      'For <code>squareSumCPS</code>: first call <code>addCPS x y</code> with a lambda continuation <code>\\s -> ...</code>. Inside that lambda, call <code>mulCPS s s k</code> to square the sum and pass it to the outer continuation.',
      'For <code>toCPS</code>: apply <code>f</code> to <code>a</code> to get the result, then pass it to <code>k</code>. For <code>runCPS</code>: the identity function <code>id</code> is the "do nothing" continuation that just returns the value.',
      'For <code>fibCPS</code>: the base cases pass 0 or 1 to <code>k</code>. The recursive case calls <code>fibCPS (n-1)</code> with <code>\\a -> fibCPS (n-2) (\\b -> k (a + b))</code> &mdash; each recursive result is received by a lambda that continues the computation.',
    ],
    concepts: ['continuation-passing-style', 'CPS', 'continuations', 'higher-order-functions', 'recursion', 'control-flow'],
    successPatterns: [
      'addCPS.*k\\s*\\(x\\s*\\+\\s*y\\)',
      'squareSumCPS.*addCPS',
      'toCPS.*k\\s*\\(f\\s+a\\)',
      'fibCPS.*fibCPS\\s*\\(n',
    ],
    testNames: [
      'addCPS 3 4 = 7',
      'addCPS 0 0 = 0',
      'mulCPS 3 4 = 12',
      'mulCPS 5 0 = 0',
      'squareCPS 5 = 25',
      'squareSumCPS 3 4 = 49',
      'squareSumCPS 0 0 = 0',
      'toCPS (+1) 5 = 6',
      'toCPS (*2) 10 = 20',
      'fibCPS 0 = 0',
      'fibCPS 1 = 1',
      'fibCPS 10 = 55',
      'addCPS with non-id continuation',
    ],
  },

  'lambda-ast': {
    id: 'lambda-ast',
    title: 'Lambda Calculus AST',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>Representing Lambda Calculus in Haskell</h3>
<p>The untyped lambda calculus has only three constructs, which we represent as a Haskell algebraic data type:</p>
<pre><code>data Term = Var String        -- variable reference
          | Lam String Term   -- lambda abstraction (\\x. body)
          | App Term Term     -- function application (f arg)
          deriving (Show, Eq)</code></pre>

<h3>Examples</h3>
<table>
  <thead><tr><th>Lambda Expression</th><th>Haskell Term</th></tr></thead>
  <tbody>
    <tr><td><code>x</code></td><td><code>Var "x"</code></td></tr>
    <tr><td><code>\\x. x</code> (identity)</td><td><code>Lam "x" (Var "x")</code></td></tr>
    <tr><td><code>(\\x. x) y</code></td><td><code>App (Lam "x" (Var "x")) (Var "y")</code></td></tr>
    <tr><td><code>\\f. \\x. f x</code></td><td><code>Lam "f" (Lam "x" (App (Var "f") (Var "x")))</code></td></tr>
  </tbody>
</table>

<h3>Free Variables</h3>
<p>A variable is <strong>free</strong> if it is not bound by any enclosing lambda. For example, in <code>\\x. x y</code>, <code>x</code> is bound but <code>y</code> is free.</p>
<pre><code>freeVars (Var x)      = [x]
freeVars (Lam x body) = filter (/= x) (freeVars body)
freeVars (App f a)    = nub (freeVars f ++ freeVars a)</code></pre>
<p>Use <code>import Data.List (nub)</code> to remove duplicates.</p>

<h3>Substitution</h3>
<p>Substitution <code>[x := s]</code> replaces free occurrences of <code>x</code> with the term <code>s</code>:</p>
<ul>
  <li><code>Var y</code>: if <code>y == x</code>, return <code>s</code>; otherwise <code>Var y</code></li>
  <li><code>App f a</code>: substitute in both sub-terms</li>
  <li><code>Lam y body</code>: if <code>y == x</code>, the variable is <strong>shadowed</strong> &mdash; don't substitute inside. Otherwise, substitute in the body.</li>
</ul>

<h3>Values and Single-Step Reduction</h3>
<p>In the lambda calculus, the only <strong>values</strong> (fully evaluated terms) are lambda abstractions. The single-step reduction function <code>step</code> performs one beta-reduction:</p>
<ul>
  <li><code>App (Lam x body) arg</code> &rarr; <code>substitute x arg body</code> (beta reduction)</li>
  <li><code>App f arg</code> where <code>f</code> can step &rarr; <code>App f' arg</code> (reduce the function first)</li>
  <li>Everything else &rarr; <code>Nothing</code> (already a value or stuck)</li>
</ul>

<h3>Your Task</h3>
<p>Define the <code>Term</code> type and implement <code>freeVars</code>, <code>substitute</code>, <code>isValue</code>, and <code>step</code>.</p>
`,
    starterCode: `module LambdaAST where

import Data.List (nub)

-- The lambda calculus has exactly three constructs:
data Term = Var String        -- variable
          | Lam String Term   -- \\x. body
          | App Term Term     -- f arg
          deriving (Show, Eq)

-- 1. freeVars: collect all free variables in a term
--    Var x -> [x]
--    Lam x body -> remove x from freeVars of body
--    App f a -> nub of combined free vars
freeVars :: Term -> [String]
freeVars t = error "implement freeVars"

-- 2. substitute: substitute [x := s] in a term
--    Var y -> if x==y then s, else Var y
--    App f a -> substitute in both
--    Lam y body -> if x==y then leave alone (shadowed), else substitute in body
substitute :: String -> Term -> Term -> Term
substitute x s t = error "implement substitute"

-- 3. isValue: only lambdas are values
isValue :: Term -> Bool
isValue t = error "implement isValue"

-- 4. step: single-step beta reduction
--    App (Lam x body) arg -> Just (substitute x arg body)
--    App f arg | step f succeeds -> Just (App f' arg)
--    otherwise -> Nothing
step :: Term -> Maybe Term
step t = error "implement step"
`,
    solutionCode: `module LambdaAST where

import Data.List (nub)

data Term = Var String
          | Lam String Term
          | App Term Term
          deriving (Show, Eq)

freeVars :: Term -> [String]
freeVars (Var x)      = [x]
freeVars (Lam x body) = filter (/= x) (freeVars body)
freeVars (App f a)    = nub (freeVars f ++ freeVars a)

substitute :: String -> Term -> Term -> Term
substitute x s (Var y)
  | x == y    = s
  | otherwise = Var y
substitute x s (App f a) = App (substitute x s f) (substitute x s a)
substitute x s (Lam y body)
  | x == y    = Lam y body
  | otherwise = Lam y (substitute x s body)

isValue :: Term -> Bool
isValue (Lam _ _) = True
isValue _         = False

step :: Term -> Maybe Term
step (App (Lam x body) arg) = Just (substitute x arg body)
step (App f arg) = case step f of
  Just f' -> Just (App f' arg)
  Nothing -> Nothing
step _ = Nothing
`,
    testCode: `runTestEq "freeVars (Var x) = [x]" ["x"] (freeVars (Var "x"))
        , runTestEq "freeVars (Lam x (Var x)) = []" ([] :: [String]) (freeVars (Lam "x" (Var "x")))
        , runTestEq "freeVars (Lam x (Var y)) = [y]" ["y"] (freeVars (Lam "x" (Var "y")))
        , runTestEq "freeVars (App (Var f) (Var x)) = [f,x]" ["f","x"] (freeVars (App (Var "f") (Var "x")))
        , runTestEq "substitute x->a in Var x = Var a" (Var "a") (substitute "x" (Var "a") (Var "x"))
        , runTestEq "substitute x->a in Var y = Var y" (Var "y") (substitute "x" (Var "a") (Var "y"))
        , runTestEq "substitute x->a in Lam x (Var x) = unchanged" (Lam "x" (Var "x")) (substitute "x" (Var "a") (Lam "x" (Var "x")))
        , runTestEq "substitute x->a in App" (App (Var "a") (Var "a")) (substitute "x" (Var "a") (App (Var "x") (Var "x")))
        , runTestEq "isValue (Lam x (Var x)) = True" True (isValue (Lam "x" (Var "x")))
        , runTestEq "isValue (Var x) = False" False (isValue (Var "x"))
        , runTestEq "step identity applied" (Just (Var "a")) (step (App (Lam "x" (Var "x")) (Var "a")))
        , runTestEq "step reduces function first" (Just (App (Lam "x" (Var "x")) (Var "b"))) (step (App (App (Lam "y" (Lam "x" (Var "x"))) (Var "a")) (Var "b")))
        , runTestEq "step on value = Nothing" Nothing (step (Lam "x" (Var "x")))`,
    hints: [
      'For <code>freeVars</code>: the key insight is that <code>Lam x body</code> <em>binds</em> <code>x</code>, so remove it from the free variables of <code>body</code>. Use <code>filter (/= x)</code> and <code>nub</code> for the <code>App</code> case.',
      'For <code>substitute</code>: pattern match on all three constructors. The critical case is <code>Lam y body</code>: if <code>x == y</code>, the inner lambda shadows <code>x</code>, so return the term unchanged. This prevents substituting into a scope where <code>x</code> is rebound.',
      'For <code>isValue</code>: pattern match &mdash; only <code>Lam _ _</code> returns <code>True</code>. Variables and applications are not values.',
      'For <code>step</code>: the first pattern <code>App (Lam x body) arg</code> performs beta reduction via substitution. The second pattern tries to reduce the function position. Use <code>case step f of Just f\' -> ...; Nothing -> Nothing</code>.',
    ],
    concepts: ['lambda-calculus', 'abstract-syntax-tree', 'free-variables', 'substitution', 'beta-reduction', 'small-step-semantics'],
    successPatterns: [
      'data\\s+Term\\s*=\\s*Var\\s+String',
      'freeVars.*Var.*=.*\\[',
      'Lam\\s+y\\s*\\(substitute',
      'step.*App.*Lam.*substitute',
    ],
    testNames: [
      'freeVars of a variable',
      'freeVars of bound variable is empty',
      'freeVars of free variable under lambda',
      'freeVars of application',
      'substitute variable match',
      'substitute variable no match',
      'substitute shadowed by lambda',
      'substitute in application',
      'lambda is a value',
      'variable is not a value',
      'step beta-reduces identity application',
      'step reduces function position first',
      'step on value returns Nothing',
    ],
  },

  'lambda-interpreter': {
    id: 'lambda-interpreter',
    title: 'Build a Lambda Calculus Interpreter',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>From Single Steps to Full Evaluation</h3>
<p>In the previous exercise, you built <code>step</code> to perform a single beta reduction. Now you'll build a <strong>multi-step normalizer</strong> that repeatedly applies <code>step</code> until the term reaches a normal form (no more reductions possible) or runs out of fuel.</p>

<h3>The Normalize Function</h3>
<pre><code>normalize :: Int -> Term -> Term
normalize 0 t = t                     -- out of fuel
normalize fuel t = case step t of
  Nothing -> t                        -- normal form reached
  Just t' -> normalize (fuel - 1) t'  -- keep reducing</code></pre>
<p>The <code>fuel</code> parameter prevents infinite loops &mdash; some lambda terms (like the Omega combinator) never reach a normal form.</p>

<h3>Church Numerals as Terms</h3>
<p>We can represent Church numerals as explicit <code>Term</code> values in our AST:</p>
<table>
  <thead><tr><th>Numeral</th><th>Lambda</th><th>Term</th></tr></thead>
  <tbody>
    <tr><td>0</td><td><code>\\f. \\x. x</code></td><td><code>Lam "f" (Lam "x" (Var "x"))</code></td></tr>
    <tr><td>1</td><td><code>\\f. \\x. f x</code></td><td><code>Lam "f" (Lam "x" (App (Var "f") (Var "x")))</code></td></tr>
  </tbody>
</table>

<h3>Church Successor</h3>
<p>The successor function wraps one more application of <code>f</code>:</p>
<pre><code>succ = \\n. \\f. \\x. f (n f x)</code></pre>
<p>So <code>succ zero</code> should normalize to a term equivalent to <code>churchOne</code>.</p>

<h3>The Omega Combinator</h3>
<p>The term <code>(\\x. x x)(\\x. x x)</code> reduces to itself &mdash; it loops forever. This is why <code>normalize</code> needs a fuel parameter:</p>
<pre><code>omega = App (Lam "x" (App (Var "x") (Var "x")))
            (Lam "x" (App (Var "x") (Var "x")))</code></pre>
<p>With fuel 100, <code>normalize</code> will stop after 100 steps, returning whatever term it has at that point.</p>

<h3>Your Task</h3>
<p>Implement <code>normalize</code>, define the Church numeral terms (<code>churchZero</code>, <code>churchOne</code>, <code>churchSucc</code>), and define <code>omega</code>. The <code>Term</code>, <code>substitute</code>, and <code>step</code> functions from the previous exercise are provided as helpers.</p>
`,
    starterCode: `module LambdaInterpreter where

import Data.List (nub)

-- AST and helpers from the previous exercise (provided)
data Term = Var String | Lam String Term | App Term Term deriving (Show, Eq)

freeVars :: Term -> [String]
freeVars (Var x)      = [x]
freeVars (Lam x body) = filter (/= x) (freeVars body)
freeVars (App f a)    = nub (freeVars f ++ freeVars a)

substitute :: String -> Term -> Term -> Term
substitute x s (Var y)
  | x == y    = s
  | otherwise = Var y
substitute x s (App f a) = App (substitute x s f) (substitute x s a)
substitute x s (Lam y body)
  | x == y    = Lam y body
  | otherwise = Lam y (substitute x s body)

step :: Term -> Maybe Term
step (App (Lam x body) arg) = Just (substitute x arg body)
step (App f arg) = case step f of
  Just f' -> Just (App f' arg)
  Nothing -> Nothing
step _ = Nothing

-- 1. normalize: repeatedly apply step until stuck or out of fuel
normalize :: Int -> Term -> Term
normalize fuel t = error "implement normalize"

-- 2. Church numerals as Term values
-- zero = \\f. \\x. x
churchZero :: Term
churchZero = error "define Church zero"

-- one = \\f. \\x. f x
churchOne :: Term
churchOne = error "define Church one"

-- succ = \\n. \\f. \\x. f (n f x)
churchSucc :: Term
churchSucc = error "define Church successor"

-- 3. Omega combinator: (\\x. x x)(\\x. x x) -- infinite loop!
omega :: Term
omega = error "define the Omega combinator"
`,
    solutionCode: `module LambdaInterpreter where

import Data.List (nub)

data Term = Var String | Lam String Term | App Term Term deriving (Show, Eq)

freeVars :: Term -> [String]
freeVars (Var x)      = [x]
freeVars (Lam x body) = filter (/= x) (freeVars body)
freeVars (App f a)    = nub (freeVars f ++ freeVars a)

substitute :: String -> Term -> Term -> Term
substitute x s (Var y)
  | x == y    = s
  | otherwise = Var y
substitute x s (App f a) = App (substitute x s f) (substitute x s a)
substitute x s (Lam y body)
  | x == y    = Lam y body
  | otherwise = Lam y (substitute x s body)

step :: Term -> Maybe Term
step (App (Lam x body) arg) = Just (substitute x arg body)
step (App f arg) = case step f of
  Just f' -> Just (App f' arg)
  Nothing -> Nothing
step _ = Nothing

normalize :: Int -> Term -> Term
normalize 0 t = t
normalize fuel t = case step t of
  Nothing -> t
  Just t' -> normalize (fuel - 1) t'

churchZero :: Term
churchZero = Lam "f" (Lam "x" (Var "x"))

churchOne :: Term
churchOne = Lam "f" (Lam "x" (App (Var "f") (Var "x")))

churchSucc :: Term
churchSucc = Lam "n" (Lam "f" (Lam "x" (App (Var "f") (App (App (Var "n") (Var "f")) (Var "x")))))

omega :: Term
omega = App (Lam "x" (App (Var "x") (Var "x"))) (Lam "x" (App (Var "x") (Var "x")))
`,
    testCode: `runTestEq "normalize identity app" (Var "a") (normalize 100 (App (Lam "x" (Var "x")) (Var "a")))
        , runTestEq "normalize already normal" (Var "z") (normalize 100 (Var "z"))
        , runTestEq "normalize nested app" (Var "a") (normalize 100 (App (Lam "y" (Var "y")) (App (Lam "x" (Var "x")) (Var "a"))))
        , runTestEq "churchZero structure" (Lam "f" (Lam "x" (Var "x"))) churchZero
        , runTestEq "churchOne structure" (Lam "f" (Lam "x" (App (Var "f") (Var "x")))) churchOne
        , runTest "succ zero normalizes to a lambda" (case normalize 100 (App churchSucc churchZero) of Lam _ _ -> True; _ -> False)
        , runTestEq "omega is self-application pair" (App (Lam "x" (App (Var "x") (Var "x"))) (Lam "x" (App (Var "x") (Var "x")))) omega
        , runTestEq "normalize 0 fuel stops immediately" (App (Lam "x" (Var "x")) (Var "a")) (normalize 0 (App (Lam "x" (Var "x")) (Var "a")))
        , runTestEq "omega with fuel 50 does not crash" True (let t = normalize 50 omega in t == t)
        , runTestEq "normalize double app" (Var "b") (normalize 100 (App (Lam "x" (Var "x")) (App (Lam "y" (Var "y")) (Var "b"))))`,
    hints: [
      'For <code>normalize</code>: the base case <code>normalize 0 t = t</code> stops when fuel runs out. Otherwise, try <code>step t</code>: if <code>Nothing</code>, the term is in normal form &mdash; return it. If <code>Just t\'</code>, recurse with <code>fuel - 1</code>.',
      'For <code>churchZero</code>: it is <code>\\f. \\x. x</code>, which ignores <code>f</code> and returns <code>x</code>. In our AST: <code>Lam "f" (Lam "x" (Var "x"))</code>. For <code>churchOne</code>: <code>Lam "f" (Lam "x" (App (Var "f") (Var "x")))</code>.',
      'For <code>churchSucc</code>: the successor <code>\\n. \\f. \\x. f (n f x)</code> takes a numeral <code>n</code> and wraps one more <code>f</code> around it. Translate directly: <code>Lam "n" (Lam "f" (Lam "x" (App (Var "f") (App (App (Var "n") (Var "f")) (Var "x")))))</code>.',
      'For <code>omega</code>: <code>(\\x. x x)(\\x. x x)</code> = <code>App (Lam "x" (App (Var "x") (Var "x"))) (Lam "x" (App (Var "x") (Var "x")))</code>. This reduces to itself, so <code>normalize</code> with finite fuel will just stop without crashing.',
    ],
    concepts: ['lambda-calculus', 'normalization', 'church-numerals', 'omega-combinator', 'interpreter', 'small-step-semantics'],
    successPatterns: [
      'normalize\\s+0.*=',
      'normalize.*case\\s+step',
      'churchZero.*Lam.*Lam.*Var',
      'omega.*App.*Lam.*App.*Var.*Var',
    ],
    testNames: [
      'normalize identity application',
      'normalize already-normal term',
      'normalize nested application',
      'churchZero structure correct',
      'churchOne structure correct',
      'succ zero normalizes to one',
      'omega structure correct',
      'normalize with 0 fuel stops immediately',
      'omega with finite fuel does not crash',
      'normalize double application',
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
