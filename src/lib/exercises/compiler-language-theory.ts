import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  'parser-type': {
    id: 'parser-type',
    language: 'haskell',
    title: 'Define a Parser Type',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>A <strong>parser</strong> is a function that consumes part of a string and returns a structured result along with the remaining unconsumed input. This is the foundational idea behind <em>parser combinators</em> — a powerful, composable approach to parsing that fits naturally into functional programming.</p>

<h3>The Parser Type</h3>
<p>We represent a parser as a newtype wrapping a function:</p>
<pre><code>newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }</code></pre>
<p>A <code>Parser a</code> takes a <code>String</code> input and returns:</p>
<ul>
  <li><code>Nothing</code> — the parse failed</li>
  <li><code>Just (result, remaining)</code> — successfully parsed a value of type <code>a</code>, with <code>remaining</code> being the unconsumed input</li>
</ul>

<h3>Example: Parsing a Single Character</h3>
<p>A parser that matches a character satisfying a predicate:</p>
<pre><code>charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing</code></pre>
<p>Usage:</p>
<pre><code>runParser (charP (== 'h')) "hello"  -- Just ('h', "ello")
runParser (charP (== 'h')) "world"  -- Nothing</code></pre>

<h3>Functor Instance</h3>
<p>To transform the result of a parser without changing what it consumes, we implement <code>Functor</code>:</p>
<pre><code>instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')</code></pre>
<p>This lets you write <code>fmap f letterP</code> to parse a letter and transform it.</p>

<h3>Parsing Exact Strings</h3>
<p>To parse an exact string like <code>"let"</code>, you consume characters one at a time, checking each matches. If any character fails, the whole parse fails:</p>
<pre><code>stringP :: String -> Parser String
stringP [] = Parser $ \\s -> Just ([], s)      -- empty string always succeeds
stringP (c:cs) = ...  -- parse c, then recursively parse cs</code></pre>

<h3>Data.Char Predicates</h3>
<p>The <code>Data.Char</code> module provides useful predicates:</p>
<ul>
  <li><code>isDigit :: Char -> Bool</code> — matches '0'..'9'</li>
  <li><code>isAlpha :: Char -> Bool</code> — matches letters</li>
  <li><code>isSpace :: Char -> Bool</code> — matches whitespace</li>
</ul>

<h3>Your Task</h3>
<p>Define the <code>Parser</code> newtype, implement <code>Functor</code> for it, then build the basic parsers: <code>charP</code>, <code>digitP</code>, <code>letterP</code>, and <code>stringP</code>.</p>
`,
    starterCode: `module ParserType where

import Data.Char (isDigit, isAlpha, isSpace)

-- 1. Define the Parser newtype.
--    A Parser a wraps a function: String -> Maybe (a, String)
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

-- 2. Implement Functor for Parser.
--    fmap f p should run p and apply f to the result.
instance Functor Parser where
  fmap f (Parser p) = error "implement fmap for Parser"

-- 3. charP: consume one character if it satisfies the predicate.
--    If the input is empty or the predicate fails, return Nothing.
charP :: (Char -> Bool) -> Parser Char
charP predicate = error "implement charP"

-- 4. digitP: parse a single digit character.
digitP :: Parser Char
digitP = error "use charP with isDigit"

-- 5. letterP: parse a single letter character.
letterP :: Parser Char
letterP = error "use charP with isAlpha"

-- 6. stringP: parse an exact string.
--    stringP "" always succeeds.
--    stringP (c:cs) should parse c, then recursively parse cs.
stringP :: String -> Parser String
stringP str = error "implement stringP"
`,
    solutionCode: `module ParserType where

import Data.Char (isDigit, isAlpha, isSpace)

newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

stringP :: String -> Parser String
stringP []     = Parser $ \\s -> Just ([], s)
stringP (c:cs) = Parser $ \\s -> case runParser (charP (== c)) s of
  Nothing       -> Nothing
  Just (_, s')  -> case runParser (stringP cs) s' of
    Nothing        -> Nothing
    Just (cs', s'') -> Just (c:cs', s'')
`,
    testCode: `runTestEq "charP (=='h') hello" (Just ('h', "ello")) (runParser (charP (== 'h')) "hello")
        , runTestEq "charP (=='h') world" Nothing (runParser (charP (== 'h')) "world")
        , runTestEq "charP (=='h') empty" Nothing (runParser (charP (== 'h')) "")
        , runTestEq "digitP 9abc" (Just ('9', "abc")) (runParser digitP "9abc")
        , runTestEq "digitP abc" Nothing (runParser digitP "abc")
        , runTestEq "letterP abc" (Just ('a', "bc")) (runParser letterP "abc")
        , runTestEq "letterP 123" Nothing (runParser letterP "123")
        , runTestEq "stringP let" (Just ("let", " x")) (runParser (stringP "let") "let x")
        , runTestEq "stringP let fails" Nothing (runParser (stringP "let") "lex x")
        , runTestEq "stringP empty" (Just ("", "hello")) (runParser (stringP "") "hello")
        , runTestEq "fmap on letterP" (Just ('b', "bc")) (runParser (fmap (const 'b') letterP) "abc")`,
    hints: [
      'For <code>fmap</code>: run the inner parser function <code>p s</code>, then pattern match. On <code>Just (a, s\')</code>, return <code>Just (f a, s\')</code>.',
      'For <code>charP</code>: pattern match the input with <code>(c:cs)</code>, add a guard <code>| predicate c</code>, and return <code>Just (c, cs)</code>. All other cases return <code>Nothing</code>.',
      'For <code>digitP</code> and <code>letterP</code>: simply apply <code>charP</code> to the appropriate <code>Data.Char</code> predicate.',
      'For <code>stringP</code>: the base case <code>stringP []</code> succeeds with an empty list. The recursive case parses one character with <code>charP (== c)</code>, then calls <code>stringP cs</code> on the remaining input, combining the results.',
    ],
    concepts: ['parser-combinators', 'newtype', 'functor', 'pattern-matching', 'maybe'],
    successPatterns: [
      'newtype\\s+Parser',
      'charP.*Parser\\s*\\$',
      'charP\\s+isDigit',
      'stringP.*charP',
    ],
    testNames: [
      'charP matches first character',
      'charP rejects non-matching character',
      'charP fails on empty input',
      'digitP parses a digit',
      'digitP rejects letters',
      'letterP parses a letter',
      'letterP rejects digits',
      'stringP parses exact string',
      'stringP fails on mismatch',
      'stringP empty always succeeds',
      'fmap transforms parser result',
    ],
  },

  'parser-combinators': {
    id: 'parser-combinators',
    language: 'haskell',
    title: 'Parser Combinators',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>Now that we have a <code>Parser</code> type and <code>Functor</code>, we need to <strong>combine</strong> parsers. This is where the real power emerges: small parsers snap together like LEGO bricks to build complex grammars.</p>

<h3>Applicative Instance</h3>
<p>The <code>Applicative</code> instance lets us sequence two parsers, combining their results:</p>
<pre><code>pure a = Parser $ \\s -> Just (a, s)  -- succeed without consuming input

Parser pf &lt;*&gt; Parser pa = Parser $ \\s ->
  case pf s of
    Nothing       -> Nothing
    Just (f, s')  -> case pa s' of
      Nothing        -> Nothing
      Just (a, s'')  -> Just (f a, s'')</code></pre>
<p><code>pure</code> injects a value into a parser that always succeeds. <code>&lt;*&gt;</code> runs the first parser to get a function, then the second parser to get an argument, and applies the function.</p>

<h3>Monad Instance</h3>
<p>The <code>Monad</code> instance lets subsequent parsers depend on earlier results:</p>
<pre><code>Parser pa >>= f = Parser $ \\s ->
  case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'</code></pre>
<p>This runs parser <code>pa</code>, feeds the result into <code>f</code> to get a new parser, then runs that parser on the remaining input.</p>

<h3>Choice: orElse</h3>
<p>Try the first parser; if it fails, try the second on the <em>original</em> input:</p>
<pre><code>orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s ->
  case p1 s of
    Nothing -> p2 s
    result  -> result</code></pre>

<h3>Repetition: many and some</h3>
<p><code>many p</code> applies <code>p</code> zero or more times, collecting results into a list. <code>some p</code> requires at least one match:</p>
<pre><code>many p = (do x &lt;- p; xs &lt;- many p; return (x:xs)) \`orElse\` pure []
some p = do x &lt;- p; xs &lt;- many p; return (x:xs)</code></pre>

<p><strong>How does <code>many</code> terminate?</strong> Each successful call to <code>p</code> consumes input, so the recursion progresses. When <code>p</code> finally fails, <code>orElse</code> returns <code>pure []</code> — the base case. <code>some</code> requires at least one success by calling <code>p</code> first, then delegates to <code>many</code> for the rest.</p>

<h3>Parsing Numbers</h3>
<p>With <code>some</code> and <code>digitP</code>, we can parse natural numbers:</p>
<pre><code>natP :: Parser Int
natP = do digits &lt;- some digitP; return (read digits)</code></pre>

<h3>Your Task</h3>
<p>Implement <code>Applicative</code> and <code>Monad</code> instances for <code>Parser</code>, then build the combinators <code>orElse</code>, <code>many</code>, <code>some</code>, and <code>natP</code>.</p>
`,
    starterCode: `module ParserCombinators where

import Data.Char (isDigit, isAlpha, isSpace)

-- PROVIDED: Parser type and Functor (from exercise 1)
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

-- EXERCISE: Implement the following

-- 1. Applicative instance for Parser
instance Applicative Parser where
  pure a = error "implement pure"
  Parser pf <*> Parser pa = error "implement <*>"

-- 2. Monad instance for Parser
instance Monad Parser where
  Parser pa >>= f = error "implement >>="

-- 3. orElse: try the first parser, if it fails try the second
orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = error "implement orElse"

-- 4. many: zero or more
many :: Parser a -> Parser [a]
many p = error "implement many"

-- 5. some: one or more (must succeed at least once)
some :: Parser a -> Parser [a]
some p = error "implement some"

-- 6. natP: parse a natural number (one or more digits, then read)
natP :: Parser Int
natP = error "implement natP"
`,
    solutionCode: `module ParserCombinators where

import Data.Char (isDigit, isAlpha, isSpace)

newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)
`,
    testCode: `runTestEq "orElse digitP letterP on abc" (Just ('a', "bc")) (runParser (orElse digitP letterP) "abc")
        , runTestEq "orElse digitP letterP on 9bc" (Just ('9', "bc")) (runParser (orElse digitP letterP) "9bc")
        , runTestEq "orElse digitP letterP on !bc" Nothing (runParser (orElse digitP letterP) "!bc")
        , runTestEq "many digitP on 123abc" (Just ("123", "abc")) (runParser (many digitP) "123abc")
        , runTestEq "many digitP on abc" (Just ("", "abc")) (runParser (many digitP) "abc")
        , runTestEq "some digitP on 123abc" (Just ("123", "abc")) (runParser (some digitP) "123abc")
        , runTestEq "some digitP on abc" Nothing (runParser (some digitP) "abc")
        , runTestEq "natP on 42+3" (Just (42 :: Int, "+3")) (runParser natP "42+3")
        , runTestEq "natP on 0" (Just (0 :: Int, "")) (runParser natP "0")
        , runTestEq "natP on abc" Nothing (runParser natP "abc")
        , runTestEq "pure 42" (Just (42 :: Int, "hello")) (runParser (pure 42) "hello")`,
    hints: [
      'For <code>pure</code>: return the value without consuming any input: <code>Parser $ \\s -> Just (a, s)</code>.',
      'For <code>&lt;*&gt;</code>: run <code>pf</code> first to get a function <code>f</code> and remaining <code>s\'</code>, then run <code>pa</code> on <code>s\'</code> to get <code>a</code> and <code>s\'\'</code>, then return <code>Just (f a, s\'\')</code>.',
      'For <code>many</code>: try to parse one item with <code>p</code>, then recursively parse <code>many p</code>. If any step fails, <code>orElse</code> returns <code>pure []</code> (empty list, no input consumed).',
      'For <code>natP</code>: use <code>some digitP</code> to get a <code>String</code> of digit characters, then <code>read</code> to convert it to an <code>Int</code>.',
    ],
    concepts: ['applicative', 'monad', 'parser-combinators', 'choice', 'repetition'],
    successPatterns: [
      'pure\\s+a\\s*=\\s*Parser',
      'Parser\\s+pf\\s*<\\*>\\s*Parser\\s+pa',
      'Nothing\\s*->\\s*p2\\s+s',
      'many.*orElse.*pure\\s*\\[',
    ],
    testNames: [
      'orElse picks first success (letter)',
      'orElse picks first success (digit)',
      'orElse fails if both fail',
      'many collects zero or more digits',
      'many succeeds with zero matches',
      'some collects one or more digits',
      'some fails on zero matches',
      'natP parses multi-digit number',
      'natP parses zero',
      'natP fails on non-digits',
      'pure injects value without consuming',
    ],
  },

  'expression-parser': {
    id: 'expression-parser',
    language: 'haskell',
    title: 'Expression Parser with Precedence',
    difficulty: 'advanced',
    order: 3,
    description: `
<p>Now we put our parser combinators to work on a real problem: parsing <strong>arithmetic expressions</strong> with correct operator precedence. This is a core problem in compiler design.</p>

<h3>The Expression AST</h3>
<p>We represent parsed expressions as an <strong>Abstract Syntax Tree</strong> (AST):</p>
<pre><code>data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
  deriving (Show, Eq)</code></pre>
<p>For example, <code>3 + 4 * 2</code> is represented as:</p>
<pre><code>Add (Lit 3) (Mul (Lit 4) (Lit 2))</code></pre>
<p>Note that <code>*</code> binds tighter than <code>+</code> — this is <strong>operator precedence</strong>.</p>

<h3>Precedence via Grammar Layers</h3>
<p>The standard technique is to define one parser per precedence level:</p>
<ol>
  <li><strong>parseFactor</strong> — highest precedence: numbers and parenthesized expressions</li>
  <li><strong>parseTerm</strong> — multiplication chains: <code>factor (* factor)*</code></li>
  <li><strong>parseExpr</strong> — addition chains: <code>term (+ term)*</code></li>
</ol>
<p>Each level calls the one above it for its operands, naturally encoding precedence.</p>

<h3>Left-Associative Chaining: chainl1</h3>
<p>The key combinator is <code>chainl1</code>, which parses <code>p (op p)*</code> and folds left:</p>
<pre><code>chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = p >>= rest
  where rest a = (do f &lt;- op; b &lt;- p; rest (f a b)) \`orElse\` pure a</code></pre>
<p>This parses one <code>p</code>, then repeatedly parses <code>op</code> followed by <code>p</code>, applying the operator left-to-right. So <code>1+2+3</code> becomes <code>Add (Add (Lit 1) (Lit 2)) (Lit 3)</code>.</p>

<h3>Tracing chainl1 (Left-Association)</h3>
<p>Let's trace <code>chainl1 parseFactor addOp</code> on <code>"1+2+3"</code>:</p>
<ol>
  <li><code>p</code> parses <code>1</code> → <code>Lit 1</code>. Then <code>rest (Lit 1)</code> is called.</li>
  <li><code>rest</code> tries <code>op</code>: sees <code>+</code>, so <code>f = Add</code>. Parses <code>p</code> again: <code>Lit 2</code>. Calls <code>rest (Add (Lit 1) (Lit 2))</code> — the accumulator grows on the <strong>left</strong>.</li>
  <li><code>rest</code> tries <code>op</code>: sees <code>+</code>, <code>f = Add</code>. Parses <code>Lit 3</code>. Calls <code>rest (Add (Add (Lit 1) (Lit 2)) (Lit 3))</code>.</li>
  <li><code>rest</code> tries <code>op</code>: no more <code>+</code>, <code>orElse</code> returns <code>pure (Add (Add (Lit 1) (Lit 2)) (Lit 3))</code>.</li>
</ol>
<p>The key: <code>rest</code> receives the <em>accumulated AST so far</em> as its argument. Each iteration wraps it on the <strong>left</strong> — that's left-association.</p>

<h3>Handling Whitespace</h3>
<p>We skip optional spaces around operators using:</p>
<pre><code>skipSpaces :: Parser String
skipSpaces = many (charP isSpace)</code></pre>

<h3>Example Parse</h3>
<pre><code>"3+4*2" -> parseExpr
  -> parseTerm: parseFactor -> Lit 3, no more *
  -> sees +, so Add (Lit 3) ...
  -> parseTerm: parseFactor -> Lit 4, sees *
     -> Mul (Lit 4) (parseFactor -> Lit 2)
  -> Add (Lit 3) (Mul (Lit 4) (Lit 2))</code></pre>

<h3>Your Task</h3>
<p>Build a complete expression parser with correct precedence for <code>+</code> and <code>*</code>, supporting parentheses.</p>
`,
    starterCode: `module ExpressionParser where

import Data.Char (isDigit, isAlpha, isSpace)

-- PROVIDED: Full parser infrastructure
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)

skipSpaces :: Parser String
skipSpaces = many (charP isSpace)

-- EXERCISE: Implement the expression parser

-- The AST
data Expr = Lit Int | Add Expr Expr | Mul Expr Expr deriving (Show, Eq)

-- 1. chainl1: parse p, then repeatedly parse (op, p) folding left.
--    chainl1 p op = p >>= rest
--      where rest a = (do f <- op; b <- p; rest (f a b)) \`orElse\` pure a
chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = error "implement chainl1"

-- 2. parseFactor: a number literal, or a parenthesized expression.
--    Number: parse natP, wrap in Lit
--    Parens: parse '(', skipSpaces, parseExpr, skipSpaces, ')', return the expr
parseFactor :: Parser Expr
parseFactor = litP \`orElse\` parenP
  where
    litP = do
      _ <- skipSpaces
      n <- natP
      _ <- skipSpaces
      error "return Lit n"
    parenP = do
      _ <- skipSpaces
      _ <- charP (== '(')
      _ <- skipSpaces
      e <- parseExpr
      _ <- skipSpaces
      _ <- charP (== ')')
      _ <- skipSpaces
      error "return e"

-- 3. parseTerm: chain factors with * (higher precedence)
--    Use chainl1 with parseFactor and a parser that matches '*' and returns Mul
parseTerm :: Parser Expr
parseTerm = error "implement parseTerm"

-- 4. parseExpr: chain terms with + (lower precedence)
--    Use chainl1 with parseTerm and a parser that matches '+' and returns Add
parseExpr :: Parser Expr
parseExpr = error "implement parseExpr"

-- 5. parseString: run parseExpr and extract just the result
parseString :: String -> Maybe Expr
parseString input = error "run parseExpr on input, return just the Expr"
`,
    solutionCode: `module ExpressionParser where

import Data.Char (isDigit, isAlpha, isSpace)

newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)

skipSpaces :: Parser String
skipSpaces = many (charP isSpace)

data Expr = Lit Int | Add Expr Expr | Mul Expr Expr deriving (Show, Eq)

chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = p >>= rest
  where rest a = (do f <- op; b <- p; rest (f a b)) \`orElse\` pure a

parseFactor :: Parser Expr
parseFactor = litP \`orElse\` parenP
  where
    litP = do
      _ <- skipSpaces
      n <- natP
      _ <- skipSpaces
      return (Lit n)
    parenP = do
      _ <- skipSpaces
      _ <- charP (== '(')
      _ <- skipSpaces
      e <- parseExpr
      _ <- skipSpaces
      _ <- charP (== ')')
      _ <- skipSpaces
      return e

parseTerm :: Parser Expr
parseTerm = chainl1 parseFactor mulOp
  where mulOp = do _ <- skipSpaces; _ <- charP (== '*'); _ <- skipSpaces; return Mul

parseExpr :: Parser Expr
parseExpr = chainl1 parseTerm addOp
  where addOp = do _ <- skipSpaces; _ <- charP (== '+'); _ <- skipSpaces; return Add

parseString :: String -> Maybe Expr
parseString input = case runParser parseExpr input of
  Just (expr, _) -> Just expr
  Nothing        -> Nothing
`,
    testCode: `runTestEq "parse 42" (Just (Lit 42)) (parseString "42")
        , runTestEq "parse 3+4" (Just (Add (Lit 3) (Lit 4))) (parseString "3+4")
        , runTestEq "parse 3+4*2 precedence" (Just (Add (Lit 3) (Mul (Lit 4) (Lit 2)))) (parseString "3+4*2")
        , runTestEq "parse (3+4)*2 parens" (Just (Mul (Add (Lit 3) (Lit 4)) (Lit 2))) (parseString "(3+4)*2")
        , runTestEq "parse 1+2+3 left-assoc" (Just (Add (Add (Lit 1) (Lit 2)) (Lit 3))) (parseString "1+2+3")
        , runTestEq "parse 2*3*4 left-assoc" (Just (Mul (Mul (Lit 2) (Lit 3)) (Lit 4))) (parseString "2*3*4")
        , runTestEq "parse with spaces" (Just (Add (Lit 3) (Lit 4))) (parseString " 3 + 4 ")
        , runTestEq "parse nested parens" (Just (Mul (Lit 2) (Add (Lit 3) (Lit 4)))) (parseString "2*(3+4)")
        , runTestEq "parse single paren" (Just (Lit 5)) (parseString "(5)")
        , runTestEq "parse empty fails" Nothing (parseString "")`,
    hints: [
      'For <code>chainl1</code>: parse one <code>p</code>, then in <code>rest</code>, try to parse <code>op</code> then <code>p</code>, apply the operator, and recurse. If the <code>op</code> parse fails, <code>orElse</code> returns <code>pure a</code> (stop chaining).',
      'For <code>parseFactor</code>: try a number literal first (parse <code>natP</code>, wrap in <code>Lit</code>). If that fails (<code>orElse</code>), try parsing <code>(</code>, then <code>parseExpr</code>, then <code>)</code>.',
      'For <code>parseTerm</code>: use <code>chainl1 parseFactor mulOp</code> where <code>mulOp</code> parses <code>*</code> and returns the <code>Mul</code> constructor.',
      'For <code>parseString</code>: run <code>runParser parseExpr input</code> and extract just the first element of the tuple with pattern matching on <code>Just (expr, _)</code>.',
    ],
    concepts: ['expression-parsing', 'operator-precedence', 'left-recursion', 'chainl1', 'AST'],
    successPatterns: [
      'chainl1\\s+p\\s+op\\s*=\\s*p\\s*>>=',
      'parseFactor.*orElse',
      'chainl1\\s+parseFactor',
      'chainl1\\s+parseTerm',
    ],
    testNames: [
      'parse single number',
      'parse addition',
      'parse precedence: + vs *',
      'parse parentheses override precedence',
      'parse left-associative addition',
      'parse left-associative multiplication',
      'parse with whitespace',
      'parse nested parenthesized expression',
      'parse single parenthesized number',
      'parse empty string fails',
    ],
  },

  'ast-evaluator': {
    id: 'ast-evaluator',
    language: 'haskell',
    title: 'AST Evaluator',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p>We have a parser that turns strings into ASTs. Now we need an <strong>evaluator</strong> that turns ASTs into results. This is the second half of an interpreter pipeline: <code>String -> AST -> Value</code>.</p>

<h3>Evaluating a Simple AST</h3>
<p>Given our expression type:</p>
<pre><code>data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
  deriving (Show, Eq)</code></pre>
<p>Evaluation is straightforward pattern matching:</p>
<pre><code>eval :: Expr -> Int
eval (Lit n)   = n
eval (Add a b) = eval a + eval b
eval (Mul a b) = eval a * eval b</code></pre>
<p>Each constructor maps to a simple operation. The recursion follows the tree structure — this is called a <strong>tree-walking evaluator</strong>.</p>

<h3>Adding Variables</h3>
<p>Real languages have variables. We extend the AST:</p>
<pre><code>data Expr2 = Lit2 Int | Add2 Expr2 Expr2 | Mul2 Expr2 Expr2 | Var String
  deriving (Show, Eq)</code></pre>
<p>Now evaluation can <strong>fail</strong> — a variable might not be defined. We use <code>Maybe</code> to handle this:</p>
<pre><code>evalWithVars :: [(String, Int)] -> Expr2 -> Maybe Int</code></pre>
<p>The first argument is an <strong>environment</strong> — a list of variable bindings like <code>[("x", 5), ("y", 10)]</code>.</p>

<h3>Using the Maybe Monad</h3>
<p>The <code>Maybe</code> monad propagates failure automatically:</p>
<pre><code>evalWithVars env (Add2 a b) = do
  va &lt;- evalWithVars env a   -- if this returns Nothing, the whole thing is Nothing
  vb &lt;- evalWithVars env b   -- same here
  return (va + vb)            -- only reached if both succeed</code></pre>
<p>For variables, use <code>lookup</code> from the Prelude:</p>
<pre><code>lookup :: Eq a => a -> [(a, b)] -> Maybe b
lookup "x" [("x", 5), ("y", 10)]  -- Just 5
lookup "z" [("x", 5), ("y", 10)]  -- Nothing</code></pre>

<h3>Your Task</h3>
<p>Implement <code>eval</code> for the simple AST, then implement <code>evalWithVars</code> for the extended AST with variables, using the <code>Maybe</code> monad for error handling.</p>
`,
    starterCode: `module AstEvaluator where

-- PROVIDED: Expression types
data Expr = Lit Int | Add Expr Expr | Mul Expr Expr deriving (Show, Eq)

data Expr2 = Lit2 Int | Add2 Expr2 Expr2 | Mul2 Expr2 Expr2 | Var String
  deriving (Show, Eq)

-- 1. eval: evaluate a simple expression AST.
--    Pattern match on each constructor:
--      Lit n   -> n
--      Add a b -> evaluate both sides and add
--      Mul a b -> evaluate both sides and multiply
eval :: Expr -> Int
eval expr = error "implement eval"

-- 2. evalWithVars: evaluate an expression with variables.
--    Takes an environment [(String, Int)] mapping variable names to values.
--    Returns Maybe Int because variable lookup can fail.
--    Use the Maybe monad (do-notation) to propagate failures.
--    For Var: use  lookup name env  which returns Maybe Int.
evalWithVars :: [(String, Int)] -> Expr2 -> Maybe Int
evalWithVars env expr = error "implement evalWithVars"
`,
    solutionCode: `module AstEvaluator where

data Expr = Lit Int | Add Expr Expr | Mul Expr Expr deriving (Show, Eq)

data Expr2 = Lit2 Int | Add2 Expr2 Expr2 | Mul2 Expr2 Expr2 | Var String
  deriving (Show, Eq)

eval :: Expr -> Int
eval (Lit n)   = n
eval (Add a b) = eval a + eval b
eval (Mul a b) = eval a * eval b

evalWithVars :: [(String, Int)] -> Expr2 -> Maybe Int
evalWithVars env (Lit2 n)    = Just n
evalWithVars env (Add2 a b)  = do
  va <- evalWithVars env a
  vb <- evalWithVars env b
  return (va + vb)
evalWithVars env (Mul2 a b)  = do
  va <- evalWithVars env a
  vb <- evalWithVars env b
  return (va * vb)
evalWithVars env (Var name)  = lookup name env
`,
    testCode: `runTestEq "eval Lit 42" (42 :: Int) (eval (Lit 42))
        , runTestEq "eval Add 3 4" (7 :: Int) (eval (Add (Lit 3) (Lit 4)))
        , runTestEq "eval Mul 3 4" (12 :: Int) (eval (Mul (Lit 3) (Lit 4)))
        , runTestEq "eval Add 3 (Mul 4 2)" (11 :: Int) (eval (Add (Lit 3) (Mul (Lit 4) (Lit 2))))
        , runTestEq "eval nested" (14 :: Int) (eval (Mul (Add (Lit 3) (Lit 4)) (Lit 2)))
        , runTestEq "evalWithVars Lit2" (Just 42) (evalWithVars [] (Lit2 42))
        , runTestEq "evalWithVars Var found" (Just 5) (evalWithVars [("x", 5)] (Var "x"))
        , runTestEq "evalWithVars Var missing" Nothing (evalWithVars [("x", 5)] (Var "y"))
        , runTestEq "evalWithVars Add2 with vars" (Just 8) (evalWithVars [("x", 5), ("y", 3)] (Add2 (Var "x") (Var "y")))
        , runTestEq "evalWithVars Mul2 with var" (Just 15) (evalWithVars [("x", 5)] (Mul2 (Var "x") (Lit2 3)))
        , runTestEq "evalWithVars missing propagates" Nothing (evalWithVars [("x", 5)] (Add2 (Var "x") (Var "z")))`,
    hints: [
      'For <code>eval</code>: pattern match each constructor. <code>Lit n</code> returns <code>n</code>, <code>Add a b</code> returns <code>eval a + eval b</code>, <code>Mul a b</code> returns <code>eval a * eval b</code>.',
      'For <code>evalWithVars (Lit2 n)</code>: wrap in <code>Just</code> since a literal always succeeds.',
      'For <code>evalWithVars (Add2 a b)</code>: use <code>do</code>-notation — bind <code>evalWithVars env a</code> and <code>evalWithVars env b</code>, then <code>return</code> their sum. If either is <code>Nothing</code>, the whole thing becomes <code>Nothing</code>.',
      'For <code>evalWithVars (Var name)</code>: use <code>lookup name env</code> which already returns <code>Maybe Int</code>.',
    ],
    concepts: ['tree-walking-evaluator', 'pattern-matching', 'maybe-monad', 'environment', 'variable-lookup'],
    successPatterns: [
      'eval\\s*\\(Lit\\s+n\\)\\s*=\\s*n',
      'eval\\s*\\(Add',
      'evalWithVars.*Var.*lookup',
      'evalWithVars.*do',
    ],
    testNames: [
      'eval literal',
      'eval addition',
      'eval multiplication',
      'eval precedence (add then mul)',
      'eval nested expression',
      'evalWithVars literal',
      'evalWithVars variable found',
      'evalWithVars variable missing',
      'evalWithVars add two variables',
      'evalWithVars mul variable and literal',
      'evalWithVars missing variable propagates Nothing',
    ],
  },

  'interpreter': {
    id: 'interpreter',
    language: 'haskell',
    title: 'Build a Mini Interpreter',
    difficulty: 'advanced',
    order: 5,
    description: `
<p>We now have all the pieces: a parser that turns strings into ASTs, and an evaluator that computes results. In this final exercise, we combine them into a complete <strong>interpreter</strong> and extend the language with <code>let</code> expressions and variables.</p>

<h3>Extending the Language</h3>
<p>We extend our expression type with <code>Let</code> bindings and <code>Var</code> references:</p>
<pre><code>data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
          | Var String | Let String Expr Expr
  deriving (Show, Eq)</code></pre>
<p><code>Let "x" valueExpr bodyExpr</code> means "bind the name <code>x</code> to the result of <code>valueExpr</code>, then evaluate <code>bodyExpr</code> with that binding."</p>
<p>For example, <code>let x = 5 in x + 3</code> becomes <code>Let "x" (Lit 5) (Add (Var "x") (Lit 3))</code> and evaluates to <code>8</code>.</p>

<h3>Parsing let Expressions</h3>
<p>The syntax is: <code>let &lt;name&gt; = &lt;expr&gt; in &lt;expr&gt;</code></p>
<pre><code>parseLet :: Parser Expr
parseLet = do
  _ &lt;- stringP "let"
  _ &lt;- skipSpaces
  name &lt;- some letterP    -- variable name (one or more letters)
  _ &lt;- skipSpaces
  _ &lt;- charP (== '=')
  _ &lt;- skipSpaces
  val &lt;- parseExpr         -- the value expression
  _ &lt;- skipSpaces
  _ &lt;- stringP "in"
  _ &lt;- skipSpaces
  body &lt;- parseExpr        -- the body expression
  return (Let name val body)</code></pre>
<p>And <code>parseFactor</code> must try <code>parseLet</code> and <code>parseVar</code> as alternatives.</p>

<h3>Why Parser Ordering Matters</h3>
<p><code>parseFactor</code> tries alternatives left to right with <code>orElse</code>. If you try <code>parseVar</code> before <code>parseLet</code>, the input <code>"let x = 5 in x"</code> would match <code>parseVar</code> first — parsing <code>"let"</code> as a variable name! Always try keyword parsers (<code>parseLet</code>) before identifier parsers (<code>parseVar</code>).</p>

<h3>Evaluating with an Environment</h3>
<p>The evaluator carries a list of variable bindings:</p>
<pre><code>evalLet :: [(String, Int)] -> Expr -> Maybe Int
evalLet env (Lit n)        = Just n
evalLet env (Var name)     = lookup name env
evalLet env (Let x val body) = do
  v &lt;- evalLet env val
  evalLet ((x, v) : env) body   -- extend the environment</code></pre>
<p>The key insight: <code>Let</code> evaluates the value, then adds the binding <code>(x, v)</code> to the front of the environment before evaluating the body.</p>

<h3>The Interpreter Pipeline</h3>
<pre><code>interpret :: String -> Maybe Int
interpret input = do
  (expr, _) &lt;- runParser parseExpr input
  evalLet [] expr</code></pre>
<p>Parse the string into an AST, then evaluate it with an empty initial environment.</p>

<h3>Your Task</h3>
<p>Extend the parser and evaluator with <code>let</code> expressions and variables, then wire them together into <code>interpret</code>.</p>
`,
    starterCode: `module Interpreter where

import Data.Char (isDigit, isAlpha, isSpace)

-- PROVIDED: Full parser infrastructure
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)

skipSpaces :: Parser String
skipSpaces = many (charP isSpace)

stringP :: String -> Parser String
stringP []     = Parser $ \\s -> Just ([], s)
stringP (c:cs) = Parser $ \\s -> case runParser (charP (== c)) s of
  Nothing       -> Nothing
  Just (_, s')  -> case runParser (stringP cs) s' of
    Nothing        -> Nothing
    Just (cs', s'') -> Just (c:cs', s'')

chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = p >>= rest
  where rest a = (do f <- op; b <- p; rest (f a b)) \`orElse\` pure a

-- Extended AST with Let and Var
data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
          | Var String | Let String Expr Expr
  deriving (Show, Eq)

-- EXERCISE: Implement the following

-- 1. parseVar: parse a variable name (one or more letters)
parseVar :: Parser Expr
parseVar = error "implement parseVar"

-- 2. parseLet: parse "let <name> = <expr> in <expr>"
parseLet :: Parser Expr
parseLet = error "implement parseLet"

-- 3. parseFactor: number, let-expr, variable, or parenthesized expr
--    Try in order: parseLet, litP, parseVar, parenP
parseFactor :: Parser Expr
parseFactor = error "implement parseFactor"

-- 4. parseTerm: chain factors with *
parseTerm :: Parser Expr
parseTerm = error "implement parseTerm"

-- 5. parseExpr: chain terms with +
parseExpr :: Parser Expr
parseExpr = error "implement parseExpr"

-- 6. evalLet: evaluate with an environment of variable bindings
--    Lit n        -> Just n
--    Var name     -> lookup name env
--    Add a b      -> evaluate both, add results
--    Mul a b      -> evaluate both, multiply results
--    Let x val body -> evaluate val, extend env with (x, result), evaluate body
evalLet :: [(String, Int)] -> Expr -> Maybe Int
evalLet env expr = error "implement evalLet"

-- 7. interpret: parse then evaluate
interpret :: String -> Maybe Int
interpret input = error "implement interpret"
`,
    solutionCode: `module Interpreter where

import Data.Char (isDigit, isAlpha, isSpace)

newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

instance Functor Parser where
  fmap f (Parser p) = Parser $ \\s -> case p s of
    Nothing      -> Nothing
    Just (a, s') -> Just (f a, s')

instance Applicative Parser where
  pure a = Parser $ \\s -> Just (a, s)
  Parser pf <*> Parser pa = Parser $ \\s -> case pf s of
    Nothing      -> Nothing
    Just (f, s') -> case pa s' of
      Nothing       -> Nothing
      Just (a, s'') -> Just (f a, s'')

instance Monad Parser where
  Parser pa >>= f = Parser $ \\s -> case pa s of
    Nothing      -> Nothing
    Just (a, s') -> runParser (f a) s'

charP :: (Char -> Bool) -> Parser Char
charP predicate = Parser $ \\s -> case s of
  (c:cs) | predicate c -> Just (c, cs)
  _                    -> Nothing

digitP :: Parser Char
digitP = charP isDigit

letterP :: Parser Char
letterP = charP isAlpha

orElse :: Parser a -> Parser a -> Parser a
orElse (Parser p1) (Parser p2) = Parser $ \\s -> case p1 s of
  Nothing -> p2 s
  result  -> result

many :: Parser a -> Parser [a]
many p = (do x <- p; xs <- many p; return (x:xs)) \`orElse\` pure []

some :: Parser a -> Parser [a]
some p = do x <- p; xs <- many p; return (x:xs)

natP :: Parser Int
natP = do digits <- some digitP; return (read digits)

skipSpaces :: Parser String
skipSpaces = many (charP isSpace)

stringP :: String -> Parser String
stringP []     = Parser $ \\s -> Just ([], s)
stringP (c:cs) = Parser $ \\s -> case runParser (charP (== c)) s of
  Nothing       -> Nothing
  Just (_, s')  -> case runParser (stringP cs) s' of
    Nothing        -> Nothing
    Just (cs', s'') -> Just (c:cs', s'')

chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p op = p >>= rest
  where rest a = (do f <- op; b <- p; rest (f a b)) \`orElse\` pure a

data Expr = Lit Int | Add Expr Expr | Mul Expr Expr
          | Var String | Let String Expr Expr
  deriving (Show, Eq)

parseVar :: Parser Expr
parseVar = do
  _ <- skipSpaces
  name <- some letterP
  _ <- skipSpaces
  return (Var name)

parseLet :: Parser Expr
parseLet = do
  _ <- skipSpaces
  _ <- stringP "let"
  _ <- skipSpaces
  name <- some letterP
  _ <- skipSpaces
  _ <- charP (== '=')
  _ <- skipSpaces
  val <- parseExpr
  _ <- skipSpaces
  _ <- stringP "in"
  _ <- skipSpaces
  body <- parseExpr
  return (Let name val body)

parseFactor :: Parser Expr
parseFactor = parseLet \`orElse\` litP \`orElse\` parseVar \`orElse\` parenP
  where
    litP = do
      _ <- skipSpaces
      n <- natP
      _ <- skipSpaces
      return (Lit n)
    parenP = do
      _ <- skipSpaces
      _ <- charP (== '(')
      _ <- skipSpaces
      e <- parseExpr
      _ <- skipSpaces
      _ <- charP (== ')')
      _ <- skipSpaces
      return e

parseTerm :: Parser Expr
parseTerm = chainl1 parseFactor mulOp
  where mulOp = do _ <- skipSpaces; _ <- charP (== '*'); _ <- skipSpaces; return Mul

parseExpr :: Parser Expr
parseExpr = chainl1 parseTerm addOp
  where addOp = do _ <- skipSpaces; _ <- charP (== '+'); _ <- skipSpaces; return Add

evalLet :: [(String, Int)] -> Expr -> Maybe Int
evalLet env (Lit n)          = Just n
evalLet env (Var name)       = lookup name env
evalLet env (Add a b)        = do
  va <- evalLet env a
  vb <- evalLet env b
  return (va + vb)
evalLet env (Mul a b)        = do
  va <- evalLet env a
  vb <- evalLet env b
  return (va * vb)
evalLet env (Let x val body) = do
  v <- evalLet env val
  evalLet ((x, v) : env) body

interpret :: String -> Maybe Int
interpret input = do
  (expr, _) <- runParser parseExpr input
  evalLet [] expr
`,
    testCode: `runTestEq "interpret 42" (Just 42) (interpret "42")
        , runTestEq "interpret 3+4" (Just 7) (interpret "3+4")
        , runTestEq "interpret 3+4*2" (Just 11) (interpret "3+4*2")
        , runTestEq "interpret (3+4)*2" (Just 14) (interpret "(3+4)*2")
        , runTestEq "interpret let x=5 in x+3" (Just 8) (interpret "let x = 5 in x + 3")
        , runTestEq "interpret let x=2 in x*x" (Just 4) (interpret "let x = 2 in x * x")
        , runTestEq "interpret nested let" (Just 11) (interpret "let x = 5 in let y = 6 in x + y")
        , runTestEq "interpret let in arithmetic" (Just 13) (interpret "let x = 3 in x + x * x + 1")
        , runTestEq "interpret empty fails" Nothing (interpret "")
        , runTestEq "evalLet Var missing" Nothing (evalLet [] (Var "z"))
        , runTestEq "evalLet Let extends env" (Just 10) (evalLet [] (Let "a" (Lit 10) (Var "a")))`,
    hints: [
      'For <code>parseVar</code>: use <code>some letterP</code> to parse the variable name (one or more letters), then wrap it in <code>Var</code>.',
      'For <code>parseLet</code>: sequence the keywords with <code>stringP "let"</code> and <code>stringP "in"</code>, use <code>some letterP</code> for the name, <code>charP (== \'=\')</code> for the equals sign, and call <code>parseExpr</code> for both the value and body.',
      'For <code>evalLet (Let x val body)</code>: evaluate <code>val</code> with the current env, then evaluate <code>body</code> with <code>(x, v) : env</code> — this adds the new binding to the front so it shadows any previous binding of the same name.',
      'For <code>interpret</code>: use <code>do</code>-notation with <code>Maybe</code> — bind <code>runParser parseExpr input</code> to get <code>(expr, _)</code>, then call <code>evalLet [] expr</code>.',
    ],
    concepts: ['interpreter', 'let-binding', 'environment', 'variable-scoping', 'parse-then-evaluate'],
    successPatterns: [
      'stringP\\s*"let"',
      'stringP\\s*"in"',
      'evalLet\\s*\\(\\(x.*:\\s*env\\)\\s*body',
      'evalLet\\s*\\[\\]\\s*expr',
    ],
    testNames: [
      'interpret simple number',
      'interpret addition',
      'interpret precedence',
      'interpret parentheses',
      'interpret let binding',
      'interpret let with multiplication',
      'interpret nested let',
      'interpret let in complex arithmetic',
      'interpret empty string fails',
      'evalLet undefined variable',
      'evalLet let extends environment',
    ],
  },
};
