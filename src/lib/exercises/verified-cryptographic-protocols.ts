import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
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

<h3>Step-by-Step: Computing a Basis Term</h3>
<p>Let's compute <code>L_0(3)</code> for points <code>[(1, 2), (2, 4)]</code> with <code>p = 23</code>:</p>
<pre><code>-- L_0(x) = product of (x - x_j) / (x_0 - x_j) for j ≠ 0
-- Here: x = 3, x_0 = 1, x_1 = 2

-- One term (j = 1):
--   numerator:   (3 - 2) = 1
--   denominator: (1 - 2) = -1 ≡ 22 (mod 23)
--   inverse:     modInverse 22 23 = 22 (since 22 * 22 = 484 = 21*23 + 1)
--   term:        1 * 22 = 22 (mod 23)
-- L_0(3) = 22

-- Then: P(3) = y_0 * L_0(3) + y_1 * L_1(3)
--            = 2 * 22 + 4 * L_1(3) (mod 23)
-- L_1(3) = (3 - 1) / (2 - 1) = 2 / 1 = 2
-- P(3) = 2 * 22 + 4 * 2 = 44 + 8 = 52 ≡ 6 (mod 23)
-- Since y = 2x, P(3) = 6 ✓</code></pre>

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

<h3>What is Group Order?</h3>
<p>The <strong>order</strong> of a generator <code>g</code> modulo <code>p</code> is the smallest positive integer <code>q</code> such that <code>g^q ≡ 1 (mod p)</code>. For our parameters:</p>
<pre><code>-- g = 2, p = 23: what is the order?
-- 2^1  mod 23 = 2
-- 2^2  mod 23 = 4
-- 2^11 mod 23 = 1    ← first time we hit 1!
-- So q = 11 (the order of 2 mod 23)</code></pre>
<p>We need <code>q</code> to be prime (it is: 11 is prime) and to divide <code>p - 1</code> (it does: 22 / 11 = 2). This ensures the math works securely.</p>

<h3>A Note on Haskell's mod</h3>
<p>The response <code>s = (k - c * x) mod q</code> can involve negative intermediate values. Haskell's <code>mod</code> always returns a non-negative result for positive modulus, so <code>(-5) \`mod\` 11 = 6</code>, not <code>-5</code>. This is exactly what we want — no special handling needed.</p>

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
};
