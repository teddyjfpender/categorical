import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  'finite-field-gfp': {
    id: 'finite-field-gfp',
    language: 'haskell',
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
    language: 'haskell',
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
    language: 'haskell',
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
    language: 'haskell',
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
    language: 'haskell',
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
};
