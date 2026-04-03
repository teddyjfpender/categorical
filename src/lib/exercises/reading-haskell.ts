import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
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
};
