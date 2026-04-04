import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  'recursion-patterns': {
    id: 'recursion-patterns',
    language: 'haskell',
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
    language: 'haskell',
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
    language: 'haskell',
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
<p>In a strict language, defining <code>fibs</code> in terms of itself would immediately try to evaluate the entire list — infinite loop. Haskell's laziness means <code>fibs</code> starts as an unevaluated thunk. The first two elements <code>0</code> and <code>1</code> are available immediately. When <code>zipWith</code> needs the third element, it looks at <code>fibs !! 0</code> (already computed: <code>0</code>) and <code>tail fibs !! 0</code> (already computed: <code>1</code>), producing <code>1</code>. Each new element only requires elements already computed — the "pulling" of values on demand is what makes the circular definition terminate.</p>

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
    language: 'haskell',
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
    language: 'haskell',
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

<h3>From 1D to 2D</h3>
<p>The pattern is identical to <code>fibMemo</code>, just with a 2D index:</p>
<pre><code>-- 1D: arr = listArray (0, n)         [go i   | i &lt;- [0..n]]
-- 2D: arr = listArray ((0,0),(n,c))  [go i w | i &lt;- [0..n], w &lt;- [0..c]]

-- 1D lookup: arr ! i
-- 2D lookup: arr ! (i, w)</code></pre>
<p>The list comprehension generates all entries in row-major order. The lazy self-reference, the <code>go</code> function reading from <code>arr</code> — everything works identically.</p>

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
};
