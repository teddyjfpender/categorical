import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  'maybe-monad': {
    id: 'maybe-monad',
    language: 'haskell',
    title: 'Maybe Monad: Chaining Fallible Operations',
    difficulty: 'intermediate',
    order: 1,
    description: `
<h3>From Functor to Monad</h3>
<p>You've already used <code>fmap</code> to apply a function inside a <code>Maybe</code>:</p>
<pre><code>fmap (+1) (Just 5)   -- Just 6
fmap (+1) Nothing    -- Nothing</code></pre>
<p>But what if your function <em>itself</em> returns a <code>Maybe</code>? Then <code>fmap</code> gives you a <strong>nested</strong> result:</p>
<pre><code>fmap lookup (Just key)  -- Maybe (Maybe value)  -- nested!</code></pre>
<p>The <strong>bind operator</strong> <code>(&gt;&gt;=)</code> solves this: it maps the function and then <em>flattens</em> the result, avoiding nesting.</p>

<h3>The Problem: Nested Case Expressions</h3>
<p>Imagine chaining two lookups — find a user's name by ID, then look up their phone number. Without <code>(&gt;&gt;=)</code>, you'd write nested cases:</p>
<pre><code>-- Without >>= : deeply nested and repetitive
result = case lookupName userId of
  Nothing   -> Nothing
  Just name -> case lookupPhone name of
    Nothing    -> Nothing
    Just phone -> Just phone</code></pre>
<p>Each step repeats the same pattern: "if Nothing, short-circuit; if Just, continue." With three or four steps, the nesting becomes unreadable.</p>

<h3>The Bind Operator (&gt;&gt;=)</h3>
<p><code>(&gt;&gt;=)</code> (pronounced "bind") captures that repeated pattern:</p>
<pre><code>(&gt;&gt;=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Nothing  &gt;&gt;= f = Nothing   -- short-circuit on failure
Just x   &gt;&gt;= f = f x       -- unwrap, apply f (which may also fail)</code></pre>

<p>Now the nested case becomes:</p>
<pre><code>result = lookupName userId &gt;&gt;= lookupPhone</code></pre>
<p>Read this as: "look up the name, and <em>if that succeeds</em>, feed it to lookupPhone."</p>

<h3>Before vs. After</h3>
<table>
  <thead><tr><th>Without &gt;&gt;=</th><th>With &gt;&gt;=</th></tr></thead>
  <tbody>
    <tr><td>Nested case for each step</td><td>Flat chain: <code>a &gt;&gt;= f &gt;&gt;= g</code></td></tr>
    <tr><td>Repetitive Nothing handling</td><td>Short-circuits automatically</td></tr>
    <tr><td>Grows rightward with depth</td><td>Stays flat regardless of length</td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Implement three functions:</p>
<ol>
  <li><code>safeDivide</code> — a helper that returns <code>Nothing</code> on divide-by-zero (this is not monadic itself, but the next two functions chain it monadically)</li>
  <li><code>findPhone</code> — chain two lookups with <code>(&gt;&gt;=)</code></li>
  <li><code>chainDivide</code> — chain two safe divisions with <code>(&gt;&gt;=)</code></li>
</ol>
`,
    starterCode: `module MaybeMonad where

-- Sample data for lookups
type PhoneBook = [(String, String)]

phoneBook :: PhoneBook
phoneBook = [("Alice", "555-1234"), ("Bob", "555-5678")]

names :: [(Int, String)]
names = [(1, "Alice"), (2, "Bob")]

lookupName :: Int -> Maybe String
lookupName uid = lookup uid names

lookupPhone :: String -> Maybe String
lookupPhone name = lookup name phoneBook

-- EXERCISE: Use >>= to chain operations.

-- 1. Safe division that returns Nothing on divide-by-zero.
--    This is a plain helper — not monadic — but we'll chain it next.
--    Pattern match on y: if 0, Nothing. Otherwise Just (x \`div\` y).
safeDivide :: Int -> Int -> Maybe Int
safeDivide x y = error "Nothing if y is 0, otherwise Just (x div y)"

-- 2. Find a phone number by user ID.
--    Chain two lookups: lookupName uid >>= lookupPhone
--    Read this as: "look up the name, then if it succeeds, look up the phone."
findPhone :: Int -> Maybe String
findPhone uid = error "chain lookupName and lookupPhone with >>="

-- 3. Chain two divisions: divide x by y, then divide that result by z.
--    Use >>= with a lambda: safeDivide x y >>= \\r -> safeDivide r z
chainDivide :: Int -> Int -> Int -> Maybe Int
chainDivide x y z = error "use >>= to chain two safeDivides"
`,
    solutionCode: `module MaybeMonad where

type PhoneBook = [(String, String)]

phoneBook :: PhoneBook
phoneBook = [("Alice", "555-1234"), ("Bob", "555-5678")]

names :: [(Int, String)]
names = [(1, "Alice"), (2, "Bob")]

lookupName :: Int -> Maybe String
lookupName uid = lookup uid names

lookupPhone :: String -> Maybe String
lookupPhone name = lookup name phoneBook

findPhone :: Int -> Maybe String
findPhone uid = lookupName uid >>= lookupPhone

safeDivide :: Int -> Int -> Maybe Int
safeDivide _ 0 = Nothing
safeDivide x y = Just (x \`div\` y)

chainDivide :: Int -> Int -> Int -> Maybe Int
chainDivide x y z = safeDivide x y >>= \\r -> safeDivide r z
`,
    testCode: `runTestEq "findPhone 1" (Just "555-1234") (findPhone 1)
        , runTestEq "findPhone 2" (Just "555-5678") (findPhone 2)
        , runTestEq "findPhone 99" (Nothing :: Maybe String) (findPhone 99)
        , runTestEq "safeDivide 10 2" (Just 5 :: Maybe Int) (safeDivide 10 2)
        , runTestEq "safeDivide 10 0" (Nothing :: Maybe Int) (safeDivide 10 0)
        , runTestEq "chainDivide 100 5 2" (Just 10 :: Maybe Int) (chainDivide 100 5 2)
        , runTestEq "chainDivide 100 0 2" (Nothing :: Maybe Int) (chainDivide 100 0 2)`,
    hints: [
      'For <code>safeDivide</code>: pattern match on <code>y</code>. If 0, return <code>Nothing</code>. Otherwise <code>Just (x \\`div\\` y)</code>.',
      '<code>(&gt;&gt;=)</code> takes a <code>Maybe a</code> on the left and a function <code>a -> Maybe b</code> on the right.',
      'For <code>findPhone</code>: <code>lookupName uid &gt;&gt;= lookupPhone</code>. That\'s it — one line. The <code>&gt;&gt;=</code> handles the Nothing case for you.',
      'For <code>chainDivide</code>: <code>safeDivide x y &gt;&gt;= \\r -> safeDivide r z</code>. The lambda <code>\\r -> ...</code> receives the result of the first division.',
    ],
    concepts: ['monad', 'maybe', 'bind', 'chaining'],
    successPatterns: [
      '>>=\\s*lookupPhone',
      'safeDivide\\s*_\\s*0\\s*=\\s*Nothing',
      '>>=.*safeDivide',
    ],
    testNames: [
      'findPhone valid user',
      'findPhone second user',
      'findPhone invalid user',
      'safeDivide normal',
      'safeDivide by zero',
      'chainDivide success',
      'chainDivide first fails',
    ],
  },

  'do-notation': {
    id: 'do-notation',
    language: 'haskell',
    title: 'Do-Notation: Imperative-Style Haskell',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p><code>do</code>-notation is syntactic sugar for <code>(&gt;&gt;=)</code> that makes monadic code read like imperative code.</p>

<h3>Desugaring Rules</h3>
<p>The compiler translates <code>do</code> blocks into <code>(&gt;&gt;=)</code> chains. Here are the rules:</p>
<table>
  <thead><tr><th>do-notation</th><th>Desugars to</th></tr></thead>
  <tbody>
    <tr><td><code>do { x &lt;- action; rest }</code></td><td><code>action &gt;&gt;= \\x -> rest</code></td></tr>
    <tr><td><code>do { action; rest }</code></td><td><code>action &gt;&gt; rest</code></td></tr>
    <tr><td><code>do { let x = expr; rest }</code></td><td><code>let x = expr in rest</code></td></tr>
    <tr><td><code>do { lastAction }</code></td><td><code>lastAction</code></td></tr>
  </tbody>
</table>

<h3>An Example</h3>
<pre><code>-- With >>= :
lookupName uid &gt;&gt;= \\name -> lookupPhone name

-- With do-notation (same thing):
do
  name &lt;- lookupName uid
  lookupPhone name</code></pre>

<p>The <code>&lt;-</code> arrow "extracts" the value from a <code>Maybe</code> (or any monad). If any step returns <code>Nothing</code>, the whole <code>do</code> block short-circuits to <code>Nothing</code>.</p>

<h3>Important: <code>return</code> is NOT Imperative Return</h3>
<p>In Haskell, <code>return</code> does <strong>not</strong> exit a function early. It simply wraps a pure value into the monad. For <code>Maybe</code>, <code>return x</code> is just <code>Just x</code>:</p>
<pre><code>return 42 :: Maybe Int  -- Just 42
Just 42                 -- exactly the same thing</code></pre>
<p>You can use either <code>return</code> or <code>Just</code> — they mean the same thing for Maybe.</p>

<h3>if-then-else with Maybe</h3>
<p>You can use <code>if-then-else</code> inside a <code>do</code> block to validate data. Each branch returns a <code>Maybe</code>:</p>
<pre><code>validateAge :: Int -> Maybe Int
validateAge age = if age > 0 then Just age else Nothing</code></pre>
<p>Inside a <code>do</code> block, you bind the result with <code>&lt;-</code>:</p>
<pre><code>do
  validAge &lt;- if age > 0 then Just age else Nothing
  -- validAge is now an Int, not a Maybe Int
  ...</code></pre>

<h3>Your Task</h3>
<p>Rewrite <code>findPhone</code> using <code>do</code>-notation, then build a user validator.</p>
`,
    starterCode: `module DoNotation where

data User = User String Int String deriving (Show, Eq)

type PhoneBook = [(String, String)]

phoneBook :: PhoneBook
phoneBook = [("Alice", "555-1234"), ("Bob", "555-5678")]

names :: [(Int, String)]
names = [(1, "Alice"), (2, "Bob")]

lookupName :: Int -> Maybe String
lookupName uid = lookup uid names

lookupPhone :: String -> Maybe String
lookupPhone name = lookup name phoneBook

-- EXERCISE: Use do-notation.

-- 1. Rewrite findPhone using do-notation instead of >>=.
--    Remember: x <- action binds the result.
--    The last line IS the return value (no <- needed).
findPhone :: Int -> Maybe String
findPhone uid = error "use do-notation"
-- do
--   name <- lookupName uid
--   ???

-- 2. Validate user data. Return Nothing if any check fails.
--    - name must be non-empty
--    - age must be positive
--    - email must contain '@'
--
--    Use if-then-else for each check:
--      validName <- if null name then Nothing else Just name
--    The last line wraps the validated fields into a User.
--    Use Just (not return) to keep it explicit for now.
validateUser :: String -> Int -> String -> Maybe User
validateUser name age email = error "use do-notation to validate"
`,
    solutionCode: `module DoNotation where

data User = User String Int String deriving (Show, Eq)

type PhoneBook = [(String, String)]

phoneBook :: PhoneBook
phoneBook = [("Alice", "555-1234"), ("Bob", "555-5678")]

names :: [(Int, String)]
names = [(1, "Alice"), (2, "Bob")]

lookupName :: Int -> Maybe String
lookupName uid = lookup uid names

lookupPhone :: String -> Maybe String
lookupPhone name = lookup name phoneBook

findPhone :: Int -> Maybe String
findPhone uid = do
  name <- lookupName uid
  lookupPhone name

validateUser :: String -> Int -> String -> Maybe User
validateUser name age email = do
  validName  <- if null name then Nothing else Just name
  validAge   <- if age <= 0  then Nothing else Just age
  validEmail <- if '@' \`elem\` email then Just email else Nothing
  Just (User validName validAge validEmail)
`,
    testCode: `runTestEq "findPhone 1" (Just "555-1234") (findPhone 1)
        , runTestEq "findPhone 99" (Nothing :: Maybe String) (findPhone 99)
        , runTestEq "valid user" (Just (User "Alice" 30 "a@b.com")) (validateUser "Alice" 30 "a@b.com")
        , runTestEq "empty name" (Nothing :: Maybe User) (validateUser "" 30 "a@b.com")
        , runTestEq "bad age" (Nothing :: Maybe User) (validateUser "Alice" 0 "a@b.com")
        , runTestEq "bad email" (Nothing :: Maybe User) (validateUser "Alice" 30 "invalid")`,
    hints: [
      'For <code>findPhone</code>: start with <code>do</code>, then <code>name &lt;- lookupName uid</code> on the next line, then <code>lookupPhone name</code> as the last line.',
      'Remember: the last line of a <code>do</code> block is the return value. No need for <code>&lt;-</code> on it.',
      'For <code>validateUser</code>: each check is <code>validX &lt;- if condition then Just value else Nothing</code>. If any returns <code>Nothing</code>, the whole block short-circuits.',
      'The last line wraps the result: <code>Just (User validName validAge validEmail)</code>. Remember, <code>Just</code> and <code>return</code> are the same for Maybe.',
    ],
    concepts: ['do-notation', 'monad', 'syntactic-sugar', 'validation'],
    successPatterns: [
      '<-\\s*lookupName',
      'validateUser.*=\\s*do',
      'if.*null.*Nothing.*Just',
    ],
    testNames: [
      'findPhone with do-notation',
      'findPhone missing user',
      'validateUser all valid',
      'validateUser empty name',
      'validateUser bad age',
      'validateUser bad email',
    ],
  },

  'either-error-handling': {
    id: 'either-error-handling',
    language: 'haskell',
    title: 'Either Monad: Errors with Context',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p><code>Either e a</code> is like <code>Maybe a</code> but carries an <strong>error message</strong> on failure:</p>
<pre><code>data Either e a = Left e | Right a

-- Left  = failure with error info
-- Right = success with value</code></pre>

<h3>How Either's Bind Works</h3>
<p>Either's <code>(&gt;&gt;=)</code> works just like Maybe's, but preserves the error:</p>
<pre><code>Right x &gt;&gt;= f = f x        -- success: apply f
Left  e &gt;&gt;= f = Left e     -- failure: pass the error through unchanged</code></pre>
<p>This means in a <code>do</code> block, the <strong>first</strong> <code>Left</code> value short-circuits the whole chain, and its error message is preserved:</p>
<pre><code>do
  x &lt;- Right 42        -- success, x = 42
  y &lt;- Left "oops"     -- failure! the whole block returns Left "oops"
  Right (x + y)         -- never reached</code></pre>

<h3>Parsing with <code>reads</code></h3>
<p>Haskell's <code>reads</code> function tries to parse a string into a value. Its return type is a list of (value, remainingString) pairs:</p>
<pre><code>reads :: Read a => String -> [(a, String)]

reads "8080"  :: [(Int, String)]  -- [(8080, "")]    -- success: parsed 8080, nothing left
reads "8080x" :: [(Int, String)]  -- [(8080, "x")]   -- parsed 8080 but "x" remains
reads "abc"   :: [(Int, String)]  -- []              -- no parse at all</code></pre>
<p>A successful <em>complete</em> parse gives <code>[(n, "")]</code> — the value <code>n</code> and an empty remaining string <code>""</code>. You match on this pattern to detect success.</p>

<h3>Either as a Monad</h3>
<p><code>Either String</code> works with <code>do</code>-notation just like <code>Maybe</code>:</p>
<pre><code>parseInt :: String -> Either String Int
parseInt s = case reads s of
  [(n, "")] -> Right n
  _         -> Left ("Not a number: " ++ s)

-- In do-notation:
do
  x &lt;- parseInt "42"    -- Right 42, so x = 42
  y &lt;- parseInt "abc"   -- Left "Not a number: abc", whole block fails
  Right (x + y)          -- never reached</code></pre>

<p>The key advantage over <code>Maybe</code>: you get a <strong>descriptive error message</strong> instead of just <code>Nothing</code>.</p>

<h3>Your Task</h3>
<p>Build a config parser with descriptive error messages using the Either monad.</p>
`,
    starterCode: `module EitherErrorHandling where

data Config = Config String Int deriving (Show, Eq)

-- EXERCISE: Implement config parsing with Either for error messages.

-- 1. Parse a port string. Must be a number between 1 and 65535.
--
--    Strategy:
--      a) Use "reads s" to try parsing. Check for [(n, "")].
--      b) If parse succeeded AND n is in range, return Right n.
--      c) Otherwise return Left ("Invalid port: " ++ s).
--
--    You can use a case expression:
--      case reads s of
--        [(n, "")] -> if n > 0 && n < 65536 then Right n else Left ...
--        _         -> Left ("Invalid port: " ++ s)
parsePort :: String -> Either String Int
parsePort s = error "parse and validate port"

-- 2. Parse a host string. Must be non-empty.
--    Empty string -> Left "Host cannot be empty"
--    Otherwise    -> Right h
parseHost :: String -> Either String String
parseHost h = error "validate host"

-- 3. Build a Config using do-notation.
--    Chain parseHost and parsePort with Either's monad.
--    The first Left will short-circuit, just like Nothing does for Maybe.
buildConfig :: String -> String -> Either String Config
buildConfig hostStr portStr = error "use do-notation"
`,
    solutionCode: `module EitherErrorHandling where

data Config = Config String Int deriving (Show, Eq)

parsePort :: String -> Either String Int
parsePort s = case reads s of
  [(n, "")] | n > 0 && n < 65536 -> Right n
  _ -> Left ("Invalid port: " ++ s)

parseHost :: String -> Either String String
parseHost "" = Left "Host cannot be empty"
parseHost h  = Right h

buildConfig :: String -> String -> Either String Config
buildConfig hostStr portStr = do
  host <- parseHost hostStr
  port <- parsePort portStr
  Right (Config host port)
`,
    testCode: `runTestEq "valid config" (Right (Config "localhost" 8080)) (buildConfig "localhost" "8080")
        , runTestEq "empty host" (Left "Host cannot be empty" :: Either String Config) (buildConfig "" "8080")
        , runTestEq "bad port" (Left "Invalid port: abc" :: Either String Config) (buildConfig "localhost" "abc")
        , runTestEq "port too high" (Left "Invalid port: 99999" :: Either String Config) (buildConfig "localhost" "99999")
        , runTestEq "parsePort valid" (Right 443 :: Either String Int) (parsePort "443")
        , runTestEq "parseHost valid" (Right "example.com" :: Either String String) (parseHost "example.com")`,
    hints: [
      'Use <code>reads s :: [(Int, String)]</code> to try parsing. If it returns <code>[(n, "")]</code>, the parse fully succeeded (empty remaining string).',
      'For <code>parsePort</code>: match on <code>reads s</code>. If <code>[(n, "")]</code> and <code>n > 0 && n < 65536</code>, return <code>Right n</code>. Otherwise return <code>Left ("Invalid port: " ++ s)</code>.',
      'For <code>parseHost</code>: pattern match on empty string vs non-empty. <code>parseHost "" = Left "Host cannot be empty"</code>; <code>parseHost h = Right h</code>.',
      'For <code>buildConfig</code>: <code>do { host <- parseHost hostStr; port <- parsePort portStr; Right (Config host port) }</code>.',
    ],
    concepts: ['either', 'monad', 'error-handling', 'do-notation'],
    successPatterns: [
      'parsePort.*case\\s+reads',
      'parseHost.*Left.*Right|parseHost.*=.*Left',
      'buildConfig.*=\\s*do',
    ],
    testNames: [
      'valid config builds',
      'empty host fails',
      'invalid port fails',
      'out of range port fails',
      'parsePort valid',
      'parseHost valid',
    ],
  },
};
