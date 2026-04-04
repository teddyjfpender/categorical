import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  'semigroup-intro': {
    id: 'semigroup-intro',
    language: 'haskell',
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
    language: 'haskell',
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
    language: 'haskell',
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
    language: 'haskell',
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
<p>Lists form a Monoid with <code>(&lt;&gt;) = (++)</code> (concatenation) and <code>mempty = []</code>. So <code>foldMap (\\x -> [x]) tree</code> wraps each leaf in a singleton list, then concatenates them:</p>
<pre><code>[1] &lt;&gt; [2] &lt;&gt; [3]
= [1] ++ [2] ++ [3]
= [1, 2, 3]</code></pre>

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
};
