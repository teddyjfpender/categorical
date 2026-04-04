import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  'modular-arithmetic': {
    id: 'modular-arithmetic',
    language: 'haskell',
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
  Mod7 a == Mod7 b = error "compare a and b"

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
    language: 'haskell',
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
class Monoid a => Group a where
  invert :: a -> a

-- 4. Implement Group for Mod7 (additive inverse = negate).
instance Group Mod7 where
  invert = error "what function negates a Mod7?"

-- 5. Check the inverse law: a <> invert a == mempty AND invert a <> a == mempty
inverseLaw :: (Group a, Eq a) => a -> Bool
inverseLaw a = error "check (a <> invert a == mempty) && (invert a <> a == mempty)"
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
    language: 'haskell',
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

<p>This brute-force works because 7 is prime, guaranteeing every non-zero element has exactly one inverse. For composite numbers like 6, the search <code>[x | x &lt;- [1..5], (2 * x) \`mod\` 6 == 1]</code> returns an empty list — 2 has no inverse mod 6 because <code>gcd(2, 6) = 2 ≠ 1</code>. Fields require a prime modulus.</p>

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
class Group a => Ring a where
  one :: a
  mul :: a -> a -> a

-- 2. Implement Ring for Mod7.
instance Ring Mod7 where
  one = error "multiplicative identity"
  mul (Mod7 a) (Mod7 b) = error "multiply and reduce mod 7"

-- 3. Field: a Ring where every non-zero element has a multiplicative inverse.
class Ring a => Field a where
  mulInv :: a -> a

-- 4. Implement Field for Mod7.
--    To find the inverse of a: search 1..6 for x where a*x = 1 (mod 7).
--    Use: head [x | x <- [1..6], (a * x) \`mod\` 7 == 1]
instance Field Mod7 where
  mulInv (Mod7 0) = error "no inverse for 0"
  mulInv (Mod7 a) = error "search: mkMod7 (head [x | x <- [1..6], (a*x) \`mod\` 7 == 1])"

-- 5. Check the distributive law: mul a (b <> c) == mul a b <> mul a c
distributionLaw :: (Ring a, Eq a) => a -> a -> a -> Bool
distributionLaw a b c = error "check mul a (b <> c) == (mul a b <> mul a c)"
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
      'one\\s*=\\s*Mod7\\s+1',
      'mul.*=.*mkMod7',
      'mulInv.*head\\s*\\[',
      'distributionLaw.*mul.*<>',
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
    language: 'haskell',
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

<h3>Structure-Preservation as Taste</h3>
<p>The homomorphism property <code>f (a &lt;&gt; b) == f a &lt;&gt; f b</code> is a <em>design principle</em>. When a function preserves structure, users can reason about it locally (what it does to elements) and globally (what it does to combinations) independently. <code>addOne</code> breaks this promise, meaning you cannot factor computations through it — a complexity burden. Homomorphisms, by contrast, are freely rearrangeable: map before combining or combine before mapping. This freedom is what makes parallel computation possible and functional programs easy to refactor. Developing taste means recognizing when a function "feels wrong" — often that feeling corresponds to failing to be a homomorphism.</p>

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
};
