import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
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
};
