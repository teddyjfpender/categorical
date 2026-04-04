import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
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

<h3>Verifying AND</h3>
<p>Let's trace <code>churchAnd churchTrue churchFalse</code>:</p>
<pre><code>churchAnd churchTrue churchFalse
= \\x y -> churchTrue (churchFalse x y) y
= \\x y -> churchTrue y y       -- churchFalse picks second: y
= \\x y -> y                     -- churchTrue picks first of (y, y): y
-- This is churchFalse! True AND False = False ✓</code></pre>
<p>And <code>churchAnd churchTrue churchTrue</code>:</p>
<pre><code>churchAnd churchTrue churchTrue
= \\x y -> churchTrue (churchTrue x y) y
= \\x y -> churchTrue x y       -- churchTrue picks first: x
= \\x y -> x                     -- churchTrue picks first again
-- This is churchTrue! True AND True = True ✓</code></pre>

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
};
