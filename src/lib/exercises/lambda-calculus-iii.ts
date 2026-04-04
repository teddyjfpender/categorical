import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
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

<h3>Why This Matters</h3>
<p>In dependently typed languages like Agda, Coq, and Lean, this correspondence is used to write <em>machine-checked proofs</em>. In Haskell, it gives us intuition: if you can write a total function with a given type, you've proved the corresponding logical statement.</p>

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

<h3>The Technique: Let the Types Guide You</h3>
<p>When the types are polymorphic (type variables like <code>a</code>, <code>b</code>), there's usually only <strong>one</strong> way to write the function. The types tell you exactly what to do:</p>

<h3>Worked Derivation 1: proof2 :: (a, b) -> a</h3>
<pre><code>-- I receive: a pair (a, b)
-- I must return: an a
--
-- Step 1: What can I do with a pair? Pattern match!
--   proof2 (x, y) = ...    where x :: a, y :: b
--
-- Step 2: I need to return an 'a'. I have x :: a and y :: b.
--   The only value of type 'a' available is x.
--
-- Step 3: proof2 (x, y) = x   ✓</code></pre>

<h3>Worked Derivation 2: proof5 :: (a -> c) -> (b -> c) -> Either a b -> c</h3>
<pre><code>-- I receive: two functions and an Either
-- I must return: a c
--
-- Step 1: Pattern match on the Either:
--   proof5 f g (Left x)  = ...    where x :: a
--   proof5 f g (Right y) = ...    where y :: b
--
-- Step 2 (Left case): I have x :: a and f :: a -> c.
--   Apply f to x: f x :: c  ✓
--
-- Step 3 (Right case): I have y :: b and g :: b -> c.
--   Apply g to y: g y :: c  ✓
--
-- proof5 f g (Left x)  = f x
-- proof5 f g (Right y) = g y</code></pre>

<p><strong>The pattern:</strong> look at what types you HAVE (from the inputs), look at what type you NEED (the return type), and find the unique path that connects them.</p>

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

<h3>Why Lambdas Replace the Call Stack</h3>
<p>In direct style, <code>f (g x)</code> implicitly uses the call stack: compute <code>g x</code>, push the result, then call <code>f</code>. In CPS, we make this explicit: <code>gCPS x (\\r -> fCPS r k)</code> says "compute <code>g</code> of <code>x</code>, and when you get result <code>r</code>, feed it to <code>f</code>, which passes its result to <code>k</code>." The lambda <code>\\r -> fCPS r k</code> <em>is</em> the call stack, turned into a function.</p>

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
  <li><code>App (Lam x body) arg</code> → <code>substitute x arg body</code> (beta reduction)</li>
  <li><code>App f arg</code> where <code>f</code> can step → <code>App f' arg</code> (reduce the function first)</li>
  <li>Everything else → <code>Nothing</code> (already a value or stuck)</li>
</ul>

<h3>Tracing Multi-Step Reduction</h3>
<p>The <code>step</code> function reduces one redex at a time. Here's how multiple steps work:</p>
<pre><code>-- Term: (\\y. \\x. x) a b
-- AST:  App (App (Lam "y" (Lam "x" (Var "x"))) (Var "a")) (Var "b")

-- step 1: reduce the inner App (Lam "y" ...) (Var "a")
--   substitute "y" (Var "a") in (Lam "x" (Var "x"))
--   = Lam "x" (Var "x")    (y doesn't appear in body, no change)
--   Result: App (Lam "x" (Var "x")) (Var "b")

-- step 2: reduce App (Lam "x" (Var "x")) (Var "b")
--   substitute "x" (Var "b") in (Var "x")
--   = Var "b"
--   Result: Var "b"     ← normal form (no more redexes)</code></pre>

<h3>Evaluation Strategy</h3>
<p>Our <code>step</code> function reduces the <strong>leftmost-outermost</strong> redex first. When it sees <code>App f arg</code>:</p>
<ol>
  <li>If <code>f</code> is a lambda <code>Lam x body</code>: substitute (beta reduce)</li>
  <li>If <code>f</code> can be stepped: step <code>f</code> first, leave <code>arg</code> alone</li>
  <li>Otherwise: no reduction possible (return <code>Nothing</code>)</li>
</ol>

<h3>A Note on Variable Capture (Not Required)</h3>
<p>Our <code>substitute</code> is simplified. Consider substituting <code>x → y</code> in <code>\\y. x</code>. The correct result renames the bound <code>y</code>: <code>\\z. y</code>. Our version produces <code>\\y. y</code> — the free <code>y</code> appears bound. This is <strong>variable capture</strong>. Our test terms avoid this, so the simplified version works for this exercise. Production interpreters use alpha-renaming or De Bruijn indices.</p>

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

<h3>Translating Lambda Notation to AST</h3>
<p>The hardest part of this exercise is converting lambda expressions to <code>Term</code> constructors. Here's the systematic process:</p>

<pre><code>-- Lambda notation:  \\n. \\f. \\x. f (n f x)
--
-- Work from outside in:
-- \\n.                    → Lam "n" (...)
--   \\f.                  → Lam "f" (...)
--     \\x.                → Lam "x" (...)
--       f (n f x)        → App (Var "f") (???)
--
-- For the inner part: n f x
-- Function application is LEFT-ASSOCIATIVE:
--   n f x  =  (n f) x  =  App (App (Var "n") (Var "f")) (Var "x")
--
-- So f (n f x) = App (Var "f") (App (App (Var "n") (Var "f")) (Var "x"))
--
-- Full translation:
-- Lam "n" (Lam "f" (Lam "x"
--   (App (Var "f") (App (App (Var "n") (Var "f")) (Var "x")))))</code></pre>

<h3>The Omega Combinator</h3>
<p><code>omega = (\\x. x x) (\\x. x x)</code> — a term that reduces to itself forever:</p>
<pre><code>-- \\x. x x  →  Lam "x" (App (Var "x") (Var "x"))
-- omega     →  App (Lam "x" (App (Var "x") (Var "x")))
--                  (Lam "x" (App (Var "x") (Var "x")))</code></pre>
<p>If you try to normalize omega, the <code>step</code> function produces the same term forever. That's why <code>normalize</code> needs a fuel parameter!</p>

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
