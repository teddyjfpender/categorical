import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
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
};
