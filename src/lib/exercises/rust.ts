import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  // ─────────────────────────────────────────────────────────
  // Module 1: Ownership & Borrowing
  // ─────────────────────────────────────────────────────────

  'rust-move-semantics': {
    id: 'rust-move-semantics',
    language: 'rust',
    title: 'Move Semantics & Ownership',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>Rust's <strong>ownership system</strong> is its most distinctive feature. Every value in Rust has exactly one owner, and when that owner goes out of scope, the value is dropped. This gives you memory safety <em>without a garbage collector</em>.</p>

<h3>Why Ownership?</h3>
<p>Most languages choose between garbage collection (safe but unpredictable pauses) or manual memory management (fast but error-prone). Rust's ownership model gives you both: compile-time guarantees of memory safety with zero runtime cost.</p>

<h3>Move Semantics</h3>
<p>When you assign a heap-allocated value (like <code>String</code>) to another variable, ownership <strong>moves</strong>:</p>
<pre><code>let s1 = String::from("hello");
let s2 = s1;           // s1 is MOVED to s2
// println!("{}", s1);  // ERROR: s1 is no longer valid!</code></pre>

<p>Stack-allocated types like <code>i32</code> implement <code>Copy</code>, so they are copied instead of moved:</p>
<pre><code>let x = 5;
let y = x;  // x is copied, both are valid
println!("{} {}", x, y);  // Fine!</code></pre>

<h3>Ownership in Functions</h3>
<p>Passing a value to a function transfers ownership. Borrowing with <code>&amp;</code> lets you use a value without taking ownership:</p>
<pre><code>fn take_ownership(s: String) { /* s is owned here, dropped at end */ }
fn borrow(s: &amp;String) { /* s is borrowed, caller still owns it */ }</code></pre>

<h3>Your Task</h3>
<p>Implement functions that demonstrate move semantics and borrowing. Pay attention to which functions take ownership vs. borrow.</p>
`,
    starterCode: `// Move Semantics & Ownership

/// Takes ownership of a String and returns its length.
/// After calling this, the caller can no longer use the original String.
fn take_and_give_len(s: String) -> usize {
    todo!("return the length of s")
}

/// Borrows a String (immutable reference) and returns its length.
/// The caller still owns the String after this call.
fn borrow_and_measure(s: &String) -> usize {
    todo!("return the length of s without taking ownership")
}

/// Takes ownership of two Strings, concatenates them, and returns the result.
fn concat_owned(a: String, b: String) -> String {
    todo!("concatenate a and b into a new String")
}

/// Borrows two string slices and returns true if the first contains the second.
fn contains_substr(haystack: &str, needle: &str) -> bool {
    todo!("check if haystack contains needle")
}

/// Creates a greeting by taking ownership of a name.
/// Returns "Hello, {name}!" as a new String.
fn greet(name: String) -> String {
    todo!("return a greeting string")
}
`,
    solutionCode: `// Move Semantics & Ownership

/// Takes ownership of a String and returns its length.
fn take_and_give_len(s: String) -> usize {
    s.len()
}

/// Borrows a String (immutable reference) and returns its length.
fn borrow_and_measure(s: &String) -> usize {
    s.len()
}

/// Takes ownership of two Strings, concatenates them, and returns the result.
fn concat_owned(a: String, b: String) -> String {
    format!("{}{}", a, b)
}

/// Borrows two string slices and returns true if the first contains the second.
fn contains_substr(haystack: &str, needle: &str) -> bool {
    haystack.contains(needle)
}

/// Creates a greeting by taking ownership of a name.
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
`,
    testCode: `assert_test_eq("take_and_give_len hello", 5usize, take_and_give_len(String::from("hello")));
    assert_test_eq("take_and_give_len empty", 0usize, take_and_give_len(String::from("")));
    assert_test_eq("borrow_and_measure world", 5usize, borrow_and_measure(&String::from("world")));
    assert_test_eq("concat_owned foo+bar", String::from("foobar"), concat_owned(String::from("foo"), String::from("bar")));
    assert_test_eq("contains_substr true", true, contains_substr("hello world", "world"));
    assert_test_eq("contains_substr false", false, contains_substr("hello", "xyz"));
    assert_test_eq("greet Alice", String::from("Hello, Alice!"), greet(String::from("Alice")));`,
    hints: [
      '<code>String</code> has a <code>.len()</code> method that returns the byte length. It works on both owned and borrowed strings.',
      'Use <code>format!("{}{}", a, b)</code> to concatenate two strings into a new <code>String</code>.',
      'The <code>.contains()</code> method on <code>&amp;str</code> checks for substring containment.',
      'For <code>greet</code>, use <code>format!("Hello, {}!", name)</code> to build the greeting string.',
    ],
    concepts: ['ownership', 'move semantics', 'borrowing', 'String vs &str', 'Copy trait'],
    successPatterns: [
      's\\.len\\(\\)',
      'format!',
      'haystack\\.contains',
    ],
    testNames: [
      'take_and_give_len returns correct length for "hello"',
      'take_and_give_len returns 0 for empty string',
      'borrow_and_measure returns correct length without ownership',
      'concat_owned concatenates two owned strings',
      'contains_substr finds existing substring',
      'contains_substr returns false for missing substring',
      'greet produces correct greeting',
    ],
  },

  'rust-borrowing': {
    id: 'rust-borrowing',
    language: 'rust',
    title: 'Borrowing & References',
    difficulty: 'beginner',
    order: 2,
    description: `
<p>Rust's <strong>borrowing rules</strong> prevent data races at compile time. You can have either:</p>
<ul>
  <li>Any number of <strong>immutable references</strong> (<code>&amp;T</code>), OR</li>
  <li>Exactly <strong>one mutable reference</strong> (<code>&amp;mut T</code>)</li>
</ul>
<p>But <em>never both at the same time</em>.</p>

<h3>String Slices</h3>
<p>A <code>&amp;str</code> is a <strong>string slice</strong> — a reference to a portion of a <code>String</code>. It is the most common way to borrow string data:</p>
<pre><code>let s = String::from("hello world");
let hello: &amp;str = &amp;s[0..5];   // "hello"
let world: &amp;str = &amp;s[6..11];  // "world"</code></pre>

<h3>Common Borrow Checker Errors</h3>
<p>These patterns will not compile:</p>
<pre><code>// ERROR: cannot borrow as mutable and immutable simultaneously
let mut v = vec![1, 2, 3];
let first = &amp;v[0];     // immutable borrow
v.push(4);              // mutable borrow! Conflicts with first
println!("{}", first);  // first is still in use</code></pre>

<h3>Mutable References</h3>
<p>With <code>&amp;mut</code>, you can modify the borrowed data:</p>
<pre><code>fn push_greeting(v: &amp;mut Vec&lt;String&gt;, name: &amp;str) {
    v.push(format!("Hello, {}!", name));
}</code></pre>

<h3>Your Task</h3>
<p>Implement functions that work with immutable and mutable borrows. The function <code>first_word</code> returns a slice of the input up to the first space (or the whole string if there is no space).</p>
`,
    starterCode: `// Borrowing & References

/// Returns the first word of the string (up to the first space).
/// If there is no space, returns the entire string.
fn first_word(s: &str) -> &str {
    todo!("find the first space and return a slice")
}

/// Appends an element to a vector via mutable reference.
/// Returns the new length of the vector.
fn push_and_len(v: &mut Vec<i32>, val: i32) -> usize {
    todo!("push val onto v, return new length")
}

/// Counts how many times a character appears in a string slice.
fn count_char(s: &str, c: char) -> usize {
    todo!("count occurrences of c in s")
}

/// Returns the larger of two referenced i32 values.
fn max_of(a: &i32, b: &i32) -> i32 {
    todo!("return the larger value")
}
`,
    solutionCode: `// Borrowing & References

/// Returns the first word of the string (up to the first space).
fn first_word(s: &str) -> &str {
    match s.find(' ') {
        Some(idx) => &s[..idx],
        None => s,
    }
}

/// Appends an element to a vector via mutable reference.
fn push_and_len(v: &mut Vec<i32>, val: i32) -> usize {
    v.push(val);
    v.len()
}

/// Counts how many times a character appears in a string slice.
fn count_char(s: &str, c: char) -> usize {
    s.chars().filter(|&ch| ch == c).count()
}

/// Returns the larger of two referenced i32 values.
fn max_of(a: &i32, b: &i32) -> i32 {
    if *a >= *b { *a } else { *b }
}
`,
    testCode: `assert_test_eq("first_word hello world", "hello", first_word("hello world"));
    assert_test_eq("first_word single", "hello", first_word("hello"));
    assert_test_eq("first_word three words", "the", first_word("the quick fox"));
    let mut v1 = vec![1, 2, 3];
    assert_test_eq("push_and_len", 4usize, push_and_len(&mut v1, 4));
    assert_test_eq("count_char banana a", 3usize, count_char("banana", 'a'));
    assert_test_eq("count_char empty", 0usize, count_char("hello", 'z'));
    assert_test_eq("max_of 3 7", 7i32, max_of(&3, &7));
    assert_test_eq("max_of equal", 5i32, max_of(&5, &5));`,
    hints: [
      'Use <code>s.find(\' \')</code> to locate the first space. It returns <code>Option&lt;usize&gt;</code>. Use <code>&amp;s[..idx]</code> to slice up to that index.',
      'For <code>push_and_len</code>, call <code>v.push(val)</code> and then <code>v.len()</code>.',
      'Use <code>s.chars().filter(|&amp;ch| ch == c).count()</code> to count character occurrences.',
      'For <code>max_of</code>, dereference with <code>*a</code> and <code>*b</code> to compare the values, then return the larger one.',
    ],
    concepts: ['immutable references', 'mutable references', 'string slices', 'borrow checker', '&str vs String'],
    successPatterns: [
      'fn first_word.*&str.*->.*&str',
      '&mut Vec',
      '\\.chars\\(\\)',
    ],
    testNames: [
      'first_word extracts first word from "hello world"',
      'first_word returns whole string when no space',
      'first_word handles multiple words',
      'push_and_len appends and returns new length',
      'count_char counts a in banana',
      'count_char returns 0 when char not found',
      'max_of returns the larger value',
      'max_of handles equal values',
    ],
  },

  'rust-lifetimes': {
    id: 'rust-lifetimes',
    language: 'rust',
    title: 'Lifetime Annotations',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>Every reference in Rust has a <strong>lifetime</strong> — the scope for which the reference is valid. Most of the time, the compiler infers lifetimes automatically. When it cannot, you must annotate them explicitly.</p>

<h3>Why Lifetimes?</h3>
<p>Lifetimes prevent <strong>dangling references</strong> — references that outlive the data they point to. This is a class of bug that is endemic in C/C++ but impossible in safe Rust.</p>

<h3>Lifetime Annotations</h3>
<p>Lifetime parameters use the syntax <code>'a</code> (tick-a). They express a relationship: "this reference lives at least as long as that one."</p>
<pre><code>fn longest&lt;'a&gt;(x: &amp;'a str, y: &amp;'a str) -> &amp;'a str {
    if x.len() &gt;= y.len() { x } else { y }
}</code></pre>
<p>This says: the returned reference is valid for the <strong>shorter</strong> of the two input lifetimes. The compiler uses this to ensure the returned reference does not dangle.</p>

<h3>Lifetime Elision Rules</h3>
<p>The compiler applies these rules to avoid explicit annotations:</p>
<ol>
  <li>Each input reference gets its own lifetime parameter.</li>
  <li>If there is exactly one input lifetime, it is assigned to all output lifetimes.</li>
  <li>If one input is <code>&amp;self</code> or <code>&amp;mut self</code>, its lifetime is assigned to all outputs.</li>
</ol>

<h3>Structs with Lifetimes</h3>
<p>If a struct holds a reference, it needs a lifetime annotation:</p>
<pre><code>struct Important&lt;'a&gt; {
    content: &amp;'a str,
}</code></pre>
<p>This means an <code>Important</code> instance cannot outlive the string it references.</p>

<h3>Your Task</h3>
<p>Implement functions and structs that require explicit lifetime annotations.</p>
`,
    starterCode: `// Lifetime Annotations

/// Returns the longer of two string slices.
/// Both inputs and the output share the same lifetime 'a.
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    todo!("return whichever string is longer")
}

/// Returns the first line of a multi-line string.
/// The returned slice borrows from the input.
fn first_line<'a>(text: &'a str) -> &'a str {
    todo!("find the first newline and return a slice up to it")
}

/// A struct that holds a borrowed string slice.
struct Excerpt<'a> {
    text: &'a str,
}

impl<'a> Excerpt<'a> {
    /// Creates a new Excerpt from a string slice.
    fn new(text: &'a str) -> Self {
        todo!("construct an Excerpt")
    }

    /// Returns the number of words in the excerpt.
    fn word_count(&self) -> usize {
        todo!("count the words in self.text")
    }
}

/// Given two string slices, returns the one that starts with a given prefix.
/// If both or neither match, returns the first.
fn with_prefix<'a>(a: &'a str, b: &'a str, prefix: &str) -> &'a str {
    todo!("return whichever string starts with prefix")
}
`,
    solutionCode: `// Lifetime Annotations

/// Returns the longer of two string slices.
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() { x } else { y }
}

/// Returns the first line of a multi-line string.
fn first_line<'a>(text: &'a str) -> &'a str {
    match text.find('\\n') {
        Some(idx) => &text[..idx],
        None => text,
    }
}

/// A struct that holds a borrowed string slice.
struct Excerpt<'a> {
    text: &'a str,
}

impl<'a> Excerpt<'a> {
    fn new(text: &'a str) -> Self {
        Excerpt { text }
    }

    fn word_count(&self) -> usize {
        self.text.split_whitespace().count()
    }
}

/// Given two string slices, returns the one that starts with a given prefix.
fn with_prefix<'a>(a: &'a str, b: &'a str, prefix: &str) -> &'a str {
    if b.starts_with(prefix) && !a.starts_with(prefix) {
        b
    } else {
        a
    }
}
`,
    testCode: `assert_test_eq("longest hello vs hi", "hello", longest("hello", "hi"));
    assert_test_eq("longest equal", "abc", longest("abc", "def"));
    assert_test_eq("first_line multi", "first", first_line("first\\nsecond\\nthird"));
    assert_test_eq("first_line single", "only", first_line("only"));
    let e = Excerpt::new("the quick brown fox");
    assert_test_eq("excerpt word_count", 4usize, e.word_count());
    assert_test_eq("excerpt empty", 0usize, Excerpt::new("").word_count());
    assert_test_eq("with_prefix match b", "rust is cool", with_prefix("hello world", "rust is cool", "rust"));
    assert_test_eq("with_prefix neither", "hello", with_prefix("hello", "world", "xyz"));`,
    hints: [
      'For <code>longest</code>, compare <code>x.len()</code> and <code>y.len()</code> and return whichever is longer. If equal, return either.',
      'For <code>first_line</code>, use <code>text.find(\'\\n\')</code> to find the newline and slice with <code>&amp;text[..idx]</code>.',
      'Use <code>self.text.split_whitespace().count()</code> to count words — it handles multiple spaces correctly.',
      'For <code>with_prefix</code>, use <code>.starts_with(prefix)</code>. Return <code>b</code> only if it matches and <code>a</code> does not.',
    ],
    concepts: ['lifetimes', 'lifetime annotations', 'dangling references', 'lifetime elision', 'structs with lifetimes'],
    successPatterns: [
      'x\\.len\\(\\).*>=.*y\\.len\\(\\)',
      'split_whitespace\\(\\)\\.count\\(\\)',
      'starts_with\\(prefix\\)',
    ],
    testNames: [
      'longest returns the longer string',
      'longest returns first when equal length',
      'first_line extracts first line from multi-line text',
      'first_line returns whole string when no newline',
      'Excerpt word_count counts words correctly',
      'Excerpt word_count returns 0 for empty string',
      'with_prefix returns b when b matches prefix',
      'with_prefix returns a when neither matches',
    ],
  },

  'rust-interior-mutability': {
    id: 'rust-interior-mutability',
    language: 'rust',
    title: 'Interior Mutability',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p><strong>Interior mutability</strong> lets you mutate data even when there are immutable references to it. This is a controlled escape hatch from Rust's normal borrowing rules — the borrow checking happens at <em>runtime</em> instead of compile time.</p>

<h3>Cell&lt;T&gt;</h3>
<p><code>Cell&lt;T&gt;</code> works for <code>Copy</code> types. You <code>get()</code> and <code>set()</code> values:</p>
<pre><code>use std::cell::Cell;

let c = Cell::new(5);
c.set(10);
assert_eq!(c.get(), 10);</code></pre>

<h3>RefCell&lt;T&gt;</h3>
<p><code>RefCell&lt;T&gt;</code> works for any type. It enforces borrowing rules at runtime:</p>
<pre><code>use std::cell::RefCell;

let data = RefCell::new(vec![1, 2, 3]);
data.borrow_mut().push(4);           // runtime mutable borrow
assert_eq!(data.borrow().len(), 4);  // runtime immutable borrow</code></pre>
<p>If you violate the rules (e.g., two mutable borrows at once), it <strong>panics at runtime</strong> instead of giving a compile error.</p>

<h3>When to Use Interior Mutability</h3>
<ul>
  <li>Caches or memoization inside an otherwise immutable API</li>
  <li>Counters or statistics tracking</li>
  <li>Mock objects in testing</li>
</ul>

<h3>Your Task</h3>
<p>Build a <code>Counter</code> struct that uses <code>Cell&lt;u32&gt;</code> for an internal count, and a <code>Logger</code> struct that uses <code>RefCell</code> to accumulate log messages behind an immutable interface.</p>
`,
    starterCode: `// Interior Mutability
use std::cell::{Cell, RefCell};

/// A counter that can be incremented through an immutable reference.
struct Counter {
    count: Cell<u32>,
}

impl Counter {
    fn new() -> Self {
        todo!("create a Counter starting at 0")
    }

    /// Increments the counter by 1. Note: &self, not &mut self!
    fn increment(&self) {
        todo!("increment the internal count by 1")
    }

    /// Returns the current count.
    fn get(&self) -> u32 {
        todo!("return the current count")
    }
}

/// A logger that accumulates messages through an immutable reference.
struct Logger {
    messages: RefCell<Vec<String>>,
}

impl Logger {
    fn new() -> Self {
        todo!("create a Logger with empty messages")
    }

    /// Adds a message to the log. Note: &self, not &mut self!
    fn log(&self, msg: &str) {
        todo!("push msg onto the messages vector")
    }

    /// Returns the number of logged messages.
    fn message_count(&self) -> usize {
        todo!("return the count of messages")
    }

    /// Returns all messages joined by newlines.
    fn dump(&self) -> String {
        todo!("join all messages with newline")
    }
}
`,
    solutionCode: `// Interior Mutability
use std::cell::{Cell, RefCell};

/// A counter that can be incremented through an immutable reference.
struct Counter {
    count: Cell<u32>,
}

impl Counter {
    fn new() -> Self {
        Counter { count: Cell::new(0) }
    }

    fn increment(&self) {
        self.count.set(self.count.get() + 1);
    }

    fn get(&self) -> u32 {
        self.count.get()
    }
}

/// A logger that accumulates messages through an immutable reference.
struct Logger {
    messages: RefCell<Vec<String>>,
}

impl Logger {
    fn new() -> Self {
        Logger { messages: RefCell::new(Vec::new()) }
    }

    fn log(&self, msg: &str) {
        self.messages.borrow_mut().push(msg.to_string());
    }

    fn message_count(&self) -> usize {
        self.messages.borrow().len()
    }

    fn dump(&self) -> String {
        self.messages.borrow().join("\\n")
    }
}
`,
    testCode: `let c = Counter::new();
    assert_test_eq("counter initial", 0u32, c.get());
    c.increment();
    c.increment();
    c.increment();
    assert_test_eq("counter after 3 increments", 3u32, c.get());
    let logger = Logger::new();
    assert_test_eq("logger initial count", 0usize, logger.message_count());
    logger.log("hello");
    logger.log("world");
    assert_test_eq("logger after 2 logs", 2usize, logger.message_count());
    assert_test_eq("logger dump", String::from("hello\\nworld"), logger.dump());`,
    hints: [
      'For <code>Counter::new</code>, use <code>Cell::new(0)</code> to initialize the count.',
      'For <code>increment</code>, use <code>self.count.set(self.count.get() + 1)</code> — <code>Cell</code> provides <code>get</code> and <code>set</code>.',
      'For <code>Logger::log</code>, use <code>self.messages.borrow_mut().push(msg.to_string())</code> to get a mutable borrow at runtime.',
      'For <code>dump</code>, use <code>self.messages.borrow().join("\\n")</code> to join with newlines.',
    ],
    concepts: ['interior mutability', 'Cell', 'RefCell', 'runtime borrow checking', 'immutable API with mutation'],
    successPatterns: [
      'Cell::new',
      'RefCell::new',
      'borrow_mut\\(\\)',
    ],
    testNames: [
      'Counter starts at 0',
      'Counter reaches 3 after 3 increments',
      'Logger starts with 0 messages',
      'Logger has 2 messages after 2 logs',
      'Logger dump joins messages with newlines',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Module 2: Zero-Cost Abstractions
  // ─────────────────────────────────────────────────────────

  'rust-traits': {
    id: 'rust-traits',
    language: 'rust',
    title: 'Traits & Trait Bounds',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p><strong>Traits</strong> in Rust are similar to typeclasses in Haskell or interfaces in other languages. A trait defines shared behavior — a set of methods that types can implement.</p>

<h3>Defining a Trait</h3>
<pre><code>trait Summary {
    fn summarize(&amp;self) -> String;
}</code></pre>

<h3>Implementing a Trait</h3>
<pre><code>struct Article { title: String, content: String }

impl Summary for Article {
    fn summarize(&amp;self) -> String {
        format!("{}: {}...", self.title, &amp;self.content[..20])
    }
}</code></pre>

<h3>Trait Bounds on Generics</h3>
<p>You can require that a generic type implements a trait:</p>
<pre><code>fn notify(item: &amp;impl Summary) {
    println!("Breaking: {}", item.summarize());
}

// Equivalent using where clause:
fn notify_where&lt;T&gt;(item: &amp;T) where T: Summary {
    println!("Breaking: {}", item.summarize());
}</code></pre>

<h3>Connection to Haskell</h3>
<p>If you know Haskell, traits are Rust's version of typeclasses. <code>trait Summary</code> is like <code>class Summary a where</code>, and <code>impl Summary for Article</code> is like <code>instance Summary Article where</code>.</p>

<h3>Your Task</h3>
<p>Define a <code>Describable</code> trait and implement it for several types. Then write a generic function that uses trait bounds.</p>
`,
    starterCode: `// Traits & Trait Bounds

/// A trait for types that can describe themselves.
trait Describable {
    fn describe(&self) -> String;
    fn short_name(&self) -> String;
}

struct Point {
    x: f64,
    y: f64,
}

struct Color {
    r: u8,
    g: u8,
    b: u8,
}

/// Implement Describable for Point.
/// describe: "Point(x, y)" e.g. "Point(1.5, 2.3)"
/// short_name: "Point"
impl Describable for Point {
    fn describe(&self) -> String {
        todo!("return Point(x, y) format")
    }
    fn short_name(&self) -> String {
        todo!("return Point")
    }
}

/// Implement Describable for Color.
/// describe: "Color(r, g, b)" e.g. "Color(255, 128, 0)"
/// short_name: "Color"
impl Describable for Color {
    fn describe(&self) -> String {
        todo!("return Color(r, g, b) format")
    }
    fn short_name(&self) -> String {
        todo!("return Color")
    }
}

/// Generic function: returns the description of whichever item has
/// the longer short_name. If equal, returns the first item's description.
fn describe_longer_name<T: Describable, U: Describable>(a: &T, b: &U) -> String {
    todo!("compare short_name lengths, return describe of the longer")
}
`,
    solutionCode: `// Traits & Trait Bounds

trait Describable {
    fn describe(&self) -> String;
    fn short_name(&self) -> String;
}

struct Point {
    x: f64,
    y: f64,
}

struct Color {
    r: u8,
    g: u8,
    b: u8,
}

impl Describable for Point {
    fn describe(&self) -> String {
        format!("Point({}, {})", self.x, self.y)
    }
    fn short_name(&self) -> String {
        String::from("Point")
    }
}

impl Describable for Color {
    fn describe(&self) -> String {
        format!("Color({}, {}, {})", self.r, self.g, self.b)
    }
    fn short_name(&self) -> String {
        String::from("Color")
    }
}

fn describe_longer_name<T: Describable, U: Describable>(a: &T, b: &U) -> String {
    if a.short_name().len() >= b.short_name().len() {
        a.describe()
    } else {
        b.describe()
    }
}
`,
    testCode: `let p = Point { x: 1.5, y: 2.3 };
    assert_test_eq("point describe", String::from("Point(1.5, 2.3)"), p.describe());
    assert_test_eq("point short_name", String::from("Point"), p.short_name());
    let c = Color { r: 255, g: 128, b: 0 };
    assert_test_eq("color describe", String::from("Color(255, 128, 0)"), c.describe());
    assert_test_eq("color short_name", String::from("Color"), c.short_name());
    assert_test_eq("describe_longer_name equal", String::from("Point(1.5, 2.3)"), describe_longer_name(&p, &c));`,
    hints: [
      'Use <code>format!("Point({}, {})", self.x, self.y)</code> for the Point description.',
      'Use <code>format!("Color({}, {}, {})", self.r, self.g, self.b)</code> for the Color description.',
      'For <code>short_name</code>, just return <code>String::from("Point")</code> or <code>String::from("Color")</code>.',
      'In <code>describe_longer_name</code>, compare <code>a.short_name().len()</code> with <code>b.short_name().len()</code> and call <code>describe()</code> on the winner.',
    ],
    concepts: ['traits', 'trait implementation', 'trait bounds', 'generics', 'Haskell typeclasses analogy'],
    successPatterns: [
      'format!\\("Point\\(',
      'format!\\("Color\\(',
      'a\\.short_name\\(\\)\\.len\\(\\)',
    ],
    testNames: [
      'Point describe returns correct format',
      'Point short_name returns "Point"',
      'Color describe returns correct format',
      'Color short_name returns "Color"',
      'describe_longer_name picks correct item when names are equal length',
    ],
  },

  'rust-generics-monomorphization': {
    id: 'rust-generics-monomorphization',
    language: 'rust',
    title: 'Generics & Monomorphization',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>Rust's generics are <strong>zero-cost</strong>. When you write a generic function, the compiler generates specialized code for each concrete type used — a process called <strong>monomorphization</strong>. There is no runtime dispatch, no boxing, no overhead.</p>

<h3>Generic Functions</h3>
<pre><code>fn largest&lt;T: PartialOrd&gt;(list: &amp;[T]) -> &amp;T {
    let mut largest = &amp;list[0];
    for item in &amp;list[1..] {
        if item > largest {
            largest = item;
        }
    }
    largest
}</code></pre>
<p>When you call <code>largest(&amp;[1, 2, 3])</code> and <code>largest(&amp;[1.0, 2.0])</code>, the compiler generates <em>two separate functions</em> — one for <code>i32</code> and one for <code>f64</code>.</p>

<h3>Generic Structs</h3>
<pre><code>struct Pair&lt;T&gt; {
    first: T,
    second: T,
}

impl&lt;T: std::fmt::Display + PartialOrd&gt; Pair&lt;T&gt; {
    fn larger(&amp;self) -> &amp;T {
        if self.first >= self.second { &amp;self.first } else { &amp;self.second }
    }
}</code></pre>

<h3>Your Task</h3>
<p>Implement generic functions and a generic struct, using appropriate trait bounds to constrain the types.</p>
`,
    starterCode: `// Generics & Monomorphization

/// Returns a reference to the largest element in a non-empty slice.
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    todo!("find the largest element")
}

/// Returns the minimum and maximum of a slice as a tuple.
fn min_max<T: PartialOrd + Clone>(list: &[T]) -> (T, T) {
    todo!("return (min, max) of the slice")
}

/// A generic Pair that holds two values of the same type.
struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        todo!("construct a Pair")
    }
}

impl<T: PartialOrd> Pair<T> {
    /// Returns a reference to the larger of the two values.
    fn max(&self) -> &T {
        todo!("return reference to the larger value")
    }
}

/// Counts how many elements in a slice equal the given target.
fn count_eq<T: PartialEq>(list: &[T], target: &T) -> usize {
    todo!("count elements equal to target")
}
`,
    solutionCode: `// Generics & Monomorphization

fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut result = &list[0];
    for item in &list[1..] {
        if item > result {
            result = item;
        }
    }
    result
}

fn min_max<T: PartialOrd + Clone>(list: &[T]) -> (T, T) {
    let mut min = list[0].clone();
    let mut max = list[0].clone();
    for item in &list[1..] {
        if *item < min {
            min = item.clone();
        }
        if *item > max {
            max = item.clone();
        }
    }
    (min, max)
}

struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        Pair { first, second }
    }
}

impl<T: PartialOrd> Pair<T> {
    fn max(&self) -> &T {
        if self.first >= self.second { &self.first } else { &self.second }
    }
}

fn count_eq<T: PartialEq>(list: &[T], target: &T) -> usize {
    list.iter().filter(|x| *x == target).count()
}
`,
    testCode: `assert_test_eq("largest i32", &5i32, largest(&[1, 5, 3, 2, 4]));
    assert_test_eq("largest str", &"z", largest(&["a", "z", "m"]));
    assert_test_eq("min_max i32", (1i32, 9i32), min_max(&[3, 1, 9, 5, 2]));
    let p = Pair::new(10, 20);
    assert_test_eq("pair max", &20i32, p.max());
    let p2 = Pair::new(7, 3);
    assert_test_eq("pair max 2", &7i32, p2.max());
    assert_test_eq("count_eq i32", 3usize, count_eq(&[1, 2, 3, 2, 2], &2));
    assert_test_eq("count_eq str", 2usize, count_eq(&["a", "b", "a"], &"a"));`,
    hints: [
      'For <code>largest</code>, iterate with a <code>for item in &amp;list[1..]</code> loop, keeping track of the largest seen so far.',
      'For <code>min_max</code>, you need <code>Clone</code> to return owned values. Use <code>item.clone()</code> when updating min or max.',
      'For <code>Pair::max</code>, compare <code>self.first</code> and <code>self.second</code> with <code>&gt;=</code> and return a reference to the larger.',
      'For <code>count_eq</code>, use <code>list.iter().filter(|x| *x == target).count()</code>.',
    ],
    concepts: ['generics', 'monomorphization', 'trait bounds', 'PartialOrd', 'PartialEq', 'zero-cost abstraction'],
    successPatterns: [
      'fn largest<T: PartialOrd>',
      'fn new\\(first.*second',
      'list\\.iter\\(\\)\\.filter',
    ],
    testNames: [
      'largest finds largest i32 in a slice',
      'largest works with string slices',
      'min_max returns correct min and max',
      'Pair max returns the larger value (second larger)',
      'Pair max returns the larger value (first larger)',
      'count_eq counts matching integers',
      'count_eq counts matching string slices',
    ],
  },

  'rust-iterators': {
    id: 'rust-iterators',
    language: 'rust',
    title: 'Iterators & Lazy Evaluation',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>Rust iterators are <strong>lazy</strong> — calling <code>.filter()</code> or <code>.map()</code> does not process any elements. Processing only happens when you <em>consume</em> the iterator (e.g., with <code>.collect()</code>, <code>.sum()</code>, or <code>.count()</code>).</p>

<h3>Iterator Chains</h3>
<pre><code>let sum_of_squares: i32 = (1..=10)
    .filter(|x| x % 2 == 0)  // keep even numbers
    .map(|x| x * x)          // square them
    .sum();                   // consume: add them up
// 4 + 16 + 36 + 64 + 100 = 220</code></pre>

<h3>The Iterator Trait</h3>
<p>Any type that implements <code>Iterator</code> gets dozens of methods for free:</p>
<pre><code>trait Iterator {
    type Item;
    fn next(&amp;mut self) -> Option&lt;Self::Item&gt;;
    // filter, map, fold, zip, enumerate, etc. are provided automatically
}</code></pre>

<h3>Custom Iterators</h3>
<pre><code>struct Counter { count: u32, max: u32 }

impl Iterator for Counter {
    type Item = u32;
    fn next(&amp;mut self) -> Option&lt;u32&gt; {
        if self.count &lt; self.max {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}</code></pre>

<h3>Zero-Cost</h3>
<p>Iterator chains compile to the same machine code as hand-written loops. The compiler fuses the chain into a single pass over the data — no intermediate collections are created.</p>

<h3>Your Task</h3>
<p>Write functions using iterator chains, and implement a custom Fibonacci iterator.</p>
`,
    starterCode: `// Iterators & Lazy Evaluation

/// Returns the sum of squares of all even numbers from 1 to n (inclusive).
fn sum_even_squares(n: u32) -> u32 {
    todo!("use iterator chain: range, filter, map, sum")
}

/// Returns a vector of words (whitespace-separated) that are longer
/// than min_len characters.
fn long_words(text: &str, min_len: usize) -> Vec<String> {
    todo!("split, filter by length, collect into Vec<String>")
}

/// A Fibonacci iterator that yields 0, 1, 1, 2, 3, 5, 8, ...
struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Self {
        todo!("initialize the Fibonacci state")
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        todo!("yield the next Fibonacci number")
    }
}

/// Returns the sum of the first n Fibonacci numbers.
fn fib_sum(n: usize) -> u64 {
    todo!("use Fibonacci iterator with take and sum")
}
`,
    solutionCode: `// Iterators & Lazy Evaluation

fn sum_even_squares(n: u32) -> u32 {
    (1..=n).filter(|x| x % 2 == 0).map(|x| x * x).sum()
}

fn long_words(text: &str, min_len: usize) -> Vec<String> {
    text.split_whitespace()
        .filter(|w| w.len() > min_len)
        .map(|w| w.to_string())
        .collect()
}

struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Self {
        Fibonacci { a: 0, b: 1 }
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let current = self.a;
        let new_next = self.a + self.b;
        self.a = self.b;
        self.b = new_next;
        Some(current)
    }
}

fn fib_sum(n: usize) -> u64 {
    Fibonacci::new().take(n).sum()
}
`,
    testCode: `assert_test_eq("sum_even_squares 10", 220u32, sum_even_squares(10));
    assert_test_eq("sum_even_squares 4", 20u32, sum_even_squares(4));
    let words = long_words("I am a Rustacean programmer", 3);
    assert_test_eq("long_words count", 2usize, words.len());
    let mut fib = Fibonacci::new();
    assert_test_eq("fib 0", Some(0u64), fib.next());
    assert_test_eq("fib 1", Some(1u64), fib.next());
    assert_test_eq("fib 2", Some(1u64), fib.next());
    assert_test_eq("fib 3", Some(2u64), fib.next());
    assert_test_eq("fib_sum 7", 12u64, fib_sum(7));`,
    hints: [
      'For <code>sum_even_squares</code>, use <code>(1..=n).filter(|x| x % 2 == 0).map(|x| x * x).sum()</code>.',
      'For <code>long_words</code>, use <code>text.split_whitespace().filter(|w| w.len() > min_len).map(|w| w.to_string()).collect()</code>.',
      'For the Fibonacci iterator, store the current pair <code>(a, b)</code>. On each <code>next()</code>, return <code>a</code> and update to <code>(b, a+b)</code>.',
      'For <code>fib_sum</code>, use <code>Fibonacci::new().take(n).sum()</code> to take the first n numbers and sum them.',
    ],
    concepts: ['iterators', 'lazy evaluation', 'iterator chains', 'custom Iterator impl', 'zero-cost abstraction'],
    successPatterns: [
      '\\.filter\\(',
      '\\.map\\(',
      'impl Iterator for Fibonacci',
    ],
    testNames: [
      'sum_even_squares(10) returns 220',
      'sum_even_squares(4) returns 20',
      'long_words filters short words correctly',
      'Fibonacci yields 0 first',
      'Fibonacci yields 1 second',
      'Fibonacci yields 1 third',
      'Fibonacci yields 2 fourth',
      'fib_sum(7) returns 12',
    ],
  },

  'rust-const-generics': {
    id: 'rust-const-generics',
    language: 'rust',
    title: 'Const Generics',
    difficulty: 'advanced',
    order: 4,
    description: `
<p><strong>Const generics</strong> let you parameterize types and functions by <em>compile-time constant values</em> (not just types). This enables arrays with sizes checked at compile time.</p>

<h3>Basic Const Generics</h3>
<pre><code>fn first&lt;T: Copy, const N: usize&gt;(arr: [T; N]) -> T {
    arr[0]
}

let x = first([1, 2, 3]);     // N = 3, inferred
let y = first([10, 20]);      // N = 2, inferred</code></pre>

<h3>Compile-Time Dimension Checking</h3>
<p>With const generics, you can make dimension mismatches a <em>compile error</em> rather than a runtime error:</p>
<pre><code>struct Matrix&lt;const ROWS: usize, const COLS: usize&gt; {
    data: [[f64; COLS]; ROWS],
}

// Only matrices with matching inner dimensions can multiply:
// Matrix&lt;M, N&gt; * Matrix&lt;N, P&gt; -> Matrix&lt;M, P&gt;</code></pre>

<h3>Your Task</h3>
<p>Implement a <code>Matrix</code> type with const generic dimensions. Provide element-wise addition (same dimensions) and a dot-product function for fixed-size vectors.</p>
`,
    starterCode: `// Const Generics
use std::fmt;

/// A fixed-size matrix with compile-time dimensions.
struct Matrix<const ROWS: usize, const COLS: usize> {
    data: [[f64; COLS]; ROWS],
}

impl<const ROWS: usize, const COLS: usize> Matrix<ROWS, COLS> {
    /// Creates a matrix filled with zeros.
    fn zeros() -> Self {
        todo!("return a matrix of all zeros")
    }

    /// Creates a matrix from a 2D array.
    fn from_array(data: [[f64; COLS]; ROWS]) -> Self {
        todo!("wrap the data in a Matrix")
    }

    /// Returns the element at (row, col).
    fn get(&self, row: usize, col: usize) -> f64 {
        todo!("return the element")
    }

    /// Element-wise addition of two matrices with the same dimensions.
    fn add(&self, other: &Matrix<ROWS, COLS>) -> Matrix<ROWS, COLS> {
        todo!("add corresponding elements")
    }
}

/// Dot product of two fixed-size vectors (represented as arrays).
fn dot<const N: usize>(a: &[f64; N], b: &[f64; N]) -> f64 {
    todo!("compute the dot product")
}

/// Returns the sum of all elements in a fixed-size array.
fn array_sum<const N: usize>(arr: &[f64; N]) -> f64 {
    todo!("sum all elements")
}
`,
    solutionCode: `// Const Generics
use std::fmt;

struct Matrix<const ROWS: usize, const COLS: usize> {
    data: [[f64; COLS]; ROWS],
}

impl<const ROWS: usize, const COLS: usize> Matrix<ROWS, COLS> {
    fn zeros() -> Self {
        Matrix { data: [[0.0; COLS]; ROWS] }
    }

    fn from_array(data: [[f64; COLS]; ROWS]) -> Self {
        Matrix { data }
    }

    fn get(&self, row: usize, col: usize) -> f64 {
        self.data[row][col]
    }

    fn add(&self, other: &Matrix<ROWS, COLS>) -> Matrix<ROWS, COLS> {
        let mut result = Self::zeros();
        for r in 0..ROWS {
            for c in 0..COLS {
                result.data[r][c] = self.data[r][c] + other.data[r][c];
            }
        }
        result
    }
}

fn dot<const N: usize>(a: &[f64; N], b: &[f64; N]) -> f64 {
    let mut sum = 0.0;
    for i in 0..N {
        sum += a[i] * b[i];
    }
    sum
}

fn array_sum<const N: usize>(arr: &[f64; N]) -> f64 {
    let mut sum = 0.0;
    for i in 0..N {
        sum += arr[i];
    }
    sum
}
`,
    testCode: `let m1 = Matrix::from_array([[1.0, 2.0], [3.0, 4.0]]);
    assert_test_eq("matrix get 0,0", 1.0f64, m1.get(0, 0));
    assert_test_eq("matrix get 1,1", 4.0f64, m1.get(1, 1));
    let m2 = Matrix::from_array([[5.0, 6.0], [7.0, 8.0]]);
    let m3 = m1.add(&m2);
    assert_test_eq("matrix add 0,0", 6.0f64, m3.get(0, 0));
    assert_test_eq("matrix add 1,1", 12.0f64, m3.get(1, 1));
    let z: Matrix<2, 3> = Matrix::zeros();
    assert_test_eq("zeros", 0.0f64, z.get(0, 2));
    assert_test_eq("dot product", 32.0f64, dot(&[1.0, 2.0, 3.0], &[4.0, 5.0, 6.0]));
    assert_test_eq("array_sum", 10.0f64, array_sum(&[1.0, 2.0, 3.0, 4.0]));`,
    hints: [
      'For <code>zeros</code>, use <code>[[0.0; COLS]; ROWS]</code> to create a 2D array of zeros.',
      'For <code>from_array</code>, just wrap the data: <code>Matrix { data }</code>.',
      'For <code>add</code>, iterate over all rows and columns, adding corresponding elements from <code>self</code> and <code>other</code>.',
      'For <code>dot</code>, iterate from <code>0..N</code>, accumulating <code>a[i] * b[i]</code> into a sum.',
    ],
    concepts: ['const generics', 'compile-time dimensions', 'zero-cost abstraction', 'fixed-size arrays', 'monomorphization'],
    successPatterns: [
      '\\[0\\.0; COLS\\]; ROWS',
      'self\\.data\\[row\\]\\[col\\]',
      'sum \\+= a\\[i\\] \\* b\\[i\\]',
    ],
    testNames: [
      'Matrix get returns correct element (0,0)',
      'Matrix get returns correct element (1,1)',
      'Matrix add sums element (0,0) correctly',
      'Matrix add sums element (1,1) correctly',
      'Matrix zeros creates all-zero matrix',
      'dot product computes correctly',
      'array_sum sums all elements',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Module 3: Unsafe & Soundness
  // ─────────────────────────────────────────────────────────

  'rust-raw-pointers': {
    id: 'rust-raw-pointers',
    language: 'rust',
    title: 'Raw Pointers',
    difficulty: 'advanced',
    order: 1,
    description: `
<p>Rust has two kinds of <strong>raw pointers</strong>: <code>*const T</code> (immutable) and <code>*mut T</code> (mutable). Unlike references, raw pointers:</p>
<ul>
  <li>Are allowed to be null</li>
  <li>Do not enforce borrowing rules</li>
  <li>Are not guaranteed to point to valid memory</li>
  <li>Can only be <strong>dereferenced inside an <code>unsafe</code> block</strong></li>
</ul>

<h3>Creating Raw Pointers</h3>
<p>Creating raw pointers is safe. Only <em>dereferencing</em> them is unsafe:</p>
<pre><code>let x = 42;
let r: *const i32 = &amp;x;         // safe: creating a raw pointer
let val = unsafe { *r };        // unsafe: dereferencing it</code></pre>

<h3>Converting Between References and Raw Pointers</h3>
<pre><code>let mut value = 10;
let ptr: *mut i32 = &amp;mut value;
unsafe {
    *ptr = 20;                   // modify through raw pointer
}
assert_eq!(value, 20);</code></pre>

<h3>A Simple Linked-List Node</h3>
<p>Raw pointers are useful for data structures like linked lists where the borrow checker makes safe references impractical:</p>
<pre><code>struct Node {
    value: i32,
    next: *mut Node,  // nullable pointer to next node
}</code></pre>

<h3>Your Task</h3>
<p>Implement functions that work with raw pointers, converting between references and pointers safely.</p>
`,
    starterCode: `// Raw Pointers

/// Swaps the values at two mutable raw pointers.
/// Safety: both pointers must be valid and non-null.
unsafe fn swap_raw(a: *mut i32, b: *mut i32) {
    todo!("swap the values pointed to by a and b")
}

/// Reads a value through a const raw pointer.
/// Safety: ptr must be valid and non-null.
unsafe fn read_ptr(ptr: *const i32) -> i32 {
    todo!("dereference ptr and return the value")
}

/// Writes a value through a mutable raw pointer.
/// Safety: ptr must be valid and non-null.
unsafe fn write_ptr(ptr: *mut i32, val: i32) {
    todo!("write val through ptr")
}

/// Sums all elements in a slice using raw pointer arithmetic.
/// This function is SAFE — all unsafe operations are properly encapsulated.
fn sum_via_pointers(slice: &[i32]) -> i32 {
    todo!("iterate over the slice using raw pointer arithmetic and sum values")
}

/// Returns true if two slices have the same contents,
/// compared element-by-element via raw pointers.
fn slices_equal(a: &[i32], b: &[i32]) -> bool {
    todo!("compare slices element by element using raw pointers")
}
`,
    solutionCode: `// Raw Pointers

unsafe fn swap_raw(a: *mut i32, b: *mut i32) {
    let tmp = *a;
    *a = *b;
    *b = tmp;
}

unsafe fn read_ptr(ptr: *const i32) -> i32 {
    *ptr
}

unsafe fn write_ptr(ptr: *mut i32, val: i32) {
    *ptr = val;
}

fn sum_via_pointers(slice: &[i32]) -> i32 {
    let mut sum = 0i32;
    let ptr = slice.as_ptr();
    for i in 0..slice.len() {
        sum += unsafe { *ptr.add(i) };
    }
    sum
}

fn slices_equal(a: &[i32], b: &[i32]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    let pa = a.as_ptr();
    let pb = b.as_ptr();
    for i in 0..a.len() {
        if unsafe { *pa.add(i) != *pb.add(i) } {
            return false;
        }
    }
    true
}
`,
    testCode: `let mut x = 10i32;
    let mut y = 20i32;
    unsafe { swap_raw(&mut x, &mut y); }
    assert_test_eq("swap_raw x", 20i32, x);
    assert_test_eq("swap_raw y", 10i32, y);
    let val = 42i32;
    assert_test_eq("read_ptr", 42i32, unsafe { read_ptr(&val) });
    let mut w = 0i32;
    unsafe { write_ptr(&mut w, 99); }
    assert_test_eq("write_ptr", 99i32, w);
    assert_test_eq("sum_via_pointers", 15i32, sum_via_pointers(&[1, 2, 3, 4, 5]));
    assert_test_eq("sum_via_pointers empty", 0i32, sum_via_pointers(&[]));
    assert_test("slices_equal true", slices_equal(&[1, 2, 3], &[1, 2, 3]));
    assert_test("slices_equal false", !slices_equal(&[1, 2], &[1, 3]));`,
    hints: [
      'For <code>swap_raw</code>, read the value at <code>a</code> into a temp, copy <code>b</code> into <code>a</code>, then write temp into <code>b</code>. All inside <code>unsafe</code>.',
      'For <code>read_ptr</code> and <code>write_ptr</code>, simply dereference: <code>*ptr</code> to read, <code>*ptr = val</code> to write.',
      'Use <code>slice.as_ptr()</code> to get a <code>*const i32</code> and <code>ptr.add(i)</code> for pointer arithmetic.',
      'For <code>slices_equal</code>, first check lengths, then compare element by element using <code>*pa.add(i) != *pb.add(i)</code>.',
    ],
    concepts: ['raw pointers', '*const T', '*mut T', 'unsafe blocks', 'pointer arithmetic'],
    successPatterns: [
      'let tmp = \\*a',
      'slice\\.as_ptr\\(\\)',
      'ptr\\.add\\(i\\)',
    ],
    testNames: [
      'swap_raw swaps x to 20',
      'swap_raw swaps y to 10',
      'read_ptr reads correct value',
      'write_ptr writes correct value',
      'sum_via_pointers sums correctly',
      'sum_via_pointers handles empty slice',
      'slices_equal returns true for equal slices',
      'slices_equal returns false for different slices',
    ],
  },

  'rust-unsafe-blocks': {
    id: 'rust-unsafe-blocks',
    language: 'rust',
    title: 'Unsafe Blocks & Minimal Unsafe',
    difficulty: 'advanced',
    order: 2,
    description: `
<p>The <code>unsafe</code> keyword in Rust unlocks five additional capabilities:</p>
<ol>
  <li>Dereference raw pointers</li>
  <li>Call <code>unsafe</code> functions or methods</li>
  <li>Access or modify mutable static variables</li>
  <li>Implement <code>unsafe</code> traits</li>
  <li>Access fields of <code>union</code> types</li>
</ol>

<h3>The Minimal Unsafe Principle</h3>
<p>Keep <code>unsafe</code> blocks as <strong>small as possible</strong>. Do not wrap entire functions in <code>unsafe</code> when only one operation needs it:</p>
<pre><code>// BAD: entire function is unsafe
unsafe fn process(data: &amp;[u8]) -> u8 {
    // ... lots of safe code ...
    let ptr = data.as_ptr();
    *ptr  // only this line needs unsafe
}

// GOOD: minimal unsafe block
fn process(data: &amp;[u8]) -> u8 {
    // ... lots of safe code ...
    let ptr = data.as_ptr();
    unsafe { *ptr }  // only unsafe what must be
}</code></pre>

<h3>Mutable Statics</h3>
<p>Global mutable state requires <code>unsafe</code> because Rust cannot guarantee thread safety:</p>
<pre><code>static mut COUNTER: u32 = 0;

fn increment() {
    unsafe { COUNTER += 1; }
}

fn get_count() -> u32 {
    unsafe { COUNTER }
}</code></pre>

<h3>Your Task</h3>
<p>Implement functions that use <code>unsafe</code> minimally and correctly. Each function should have the smallest possible <code>unsafe</code> block.</p>
`,
    starterCode: `// Unsafe Blocks & Minimal Unsafe

static mut CALL_COUNT: u64 = 0;

/// Increments the global call counter and returns the new value.
/// Uses minimal unsafe to access the mutable static.
fn increment_counter() -> u64 {
    todo!("increment CALL_COUNT and return its new value")
}

/// Returns the current call count.
fn get_counter() -> u64 {
    todo!("read CALL_COUNT")
}

/// Resets the call counter to 0.
fn reset_counter() {
    todo!("set CALL_COUNT to 0")
}

/// Returns the first element of a non-empty slice via raw pointer.
/// The function itself is safe — the unsafe is encapsulated.
fn first_element(data: &[i32]) -> i32 {
    todo!("get a raw pointer and dereference it inside a minimal unsafe block")
}

/// Reinterprets the bytes of an i32 as a u32.
/// Uses transmute in a minimal unsafe block.
fn reinterpret_as_u32(val: i32) -> u32 {
    todo!("use std::mem::transmute in an unsafe block")
}
`,
    solutionCode: `// Unsafe Blocks & Minimal Unsafe

static mut CALL_COUNT: u64 = 0;

fn increment_counter() -> u64 {
    unsafe {
        CALL_COUNT += 1;
        CALL_COUNT
    }
}

fn get_counter() -> u64 {
    unsafe { CALL_COUNT }
}

fn reset_counter() {
    unsafe { CALL_COUNT = 0; }
}

fn first_element(data: &[i32]) -> i32 {
    let ptr = data.as_ptr();
    unsafe { *ptr }
}

fn reinterpret_as_u32(val: i32) -> u32 {
    unsafe { std::mem::transmute(val) }
}
`,
    testCode: `reset_counter();
    assert_test_eq("counter starts at 0", 0u64, get_counter());
    assert_test_eq("increment returns 1", 1u64, increment_counter());
    assert_test_eq("increment returns 2", 2u64, increment_counter());
    assert_test_eq("get_counter is 2", 2u64, get_counter());
    reset_counter();
    assert_test_eq("reset works", 0u64, get_counter());
    assert_test_eq("first_element", 42i32, first_element(&[42, 1, 2]));
    assert_test_eq("reinterpret positive", 1u32, reinterpret_as_u32(1i32));
    assert_test_eq("reinterpret -1", u32::MAX, reinterpret_as_u32(-1i32));`,
    hints: [
      'For <code>increment_counter</code>, wrap both the increment and the read in a single <code>unsafe { CALL_COUNT += 1; CALL_COUNT }</code> block.',
      'For <code>get_counter</code> and <code>reset_counter</code>, use <code>unsafe { CALL_COUNT }</code> and <code>unsafe { CALL_COUNT = 0; }</code> respectively.',
      'For <code>first_element</code>, use <code>data.as_ptr()</code> outside unsafe, then <code>unsafe { *ptr }</code> to dereference.',
      'For <code>reinterpret_as_u32</code>, use <code>unsafe { std::mem::transmute(val) }</code>. This reinterprets the bit pattern.',
    ],
    concepts: ['unsafe blocks', 'mutable statics', 'minimal unsafe', 'transmute', 'encapsulated unsafety'],
    successPatterns: [
      'static mut CALL_COUNT',
      'unsafe \\{',
      'std::mem::transmute',
    ],
    testNames: [
      'Counter starts at 0 after reset',
      'First increment returns 1',
      'Second increment returns 2',
      'get_counter reads correct value',
      'reset_counter resets to 0',
      'first_element reads via raw pointer',
      'reinterpret positive i32 as u32',
      'reinterpret -1i32 as u32::MAX',
    ],
  },

  'rust-soundness': {
    id: 'rust-soundness',
    language: 'rust',
    title: 'Soundness & Safe Wrappers',
    difficulty: 'advanced',
    order: 3,
    description: `
<p><strong>Soundness</strong> is Rust's fundamental guarantee: safe code cannot cause <strong>undefined behavior</strong> (UB). An API is <em>sound</em> if no combination of safe calls can trigger UB. An API is <em>unsound</em> if safe code can trigger UB through it.</p>

<h3>What Is Undefined Behavior?</h3>
<ul>
  <li>Dereferencing a null or dangling pointer</li>
  <li>Reading uninitialized memory</li>
  <li>Data races</li>
  <li>Violating aliasing rules (mutable + immutable refs to same data)</li>
</ul>

<h3>Sound vs Unsound</h3>
<pre><code>// SOUND: safe wrapper around split_at_mut
fn split_first_mut(slice: &amp;mut [i32]) -> Option&lt;(&amp;mut i32, &amp;mut [i32])&gt; {
    if slice.is_empty() { return None; }
    let (first, rest) = slice.split_at_mut(1);
    Some((&amp;mut first[0], rest))
}

// UNSOUND: safe function that allows creating two &amp;mut to same data
// (This would be rejected by a careful code review!)
fn unsound_example(slice: &amp;mut [i32]) -> (&amp;mut i32, &amp;mut i32) {
    // This would be UB if it compiled — the compiler prevents it!
    (&amp;mut slice[0], &amp;mut slice[0])  // ERROR: two mutable borrows
}</code></pre>

<h3>Building Safe Abstractions</h3>
<p>The standard library's <code>split_at_mut</code> uses unsafe internally but is sound because it ensures the two resulting slices do not overlap. This is the pattern: use unsafe internally, prove safety at the boundary.</p>

<h3>Your Task</h3>
<p>Implement safe wrappers around unsafe operations, ensuring soundness.</p>
`,
    starterCode: `// Soundness & Safe Wrappers

/// Splits a mutable slice into two non-overlapping halves.
/// Returns (left, right) where left = [0..mid] and right = [mid..].
/// Panics if mid > slice.len().
/// This is a safe wrapper around unsafe pointer manipulation.
fn split_at_mut_manual(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    todo!("implement split_at_mut using raw pointers and unsafe")
}

/// Safely gets a mutable reference to two DIFFERENT indices in a slice.
/// Returns None if the indices are equal or out of bounds.
fn get_two_mut(slice: &mut [i32], i: usize, j: usize) -> Option<(&mut i32, &mut i32)> {
    todo!("return mutable refs to two different elements, or None if invalid")
}

/// Safely converts a &[u8] of length 4 into an i32 (little-endian).
/// Returns None if the slice length is not 4.
fn bytes_to_i32(bytes: &[u8]) -> Option<i32> {
    todo!("convert 4 bytes to i32 in little-endian order")
}
`,
    solutionCode: `// Soundness & Safe Wrappers

fn split_at_mut_manual(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    assert!(mid <= slice.len(), "mid out of bounds");
    let len = slice.len();
    let ptr = slice.as_mut_ptr();
    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

fn get_two_mut(slice: &mut [i32], i: usize, j: usize) -> Option<(&mut i32, &mut i32)> {
    if i == j || i >= slice.len() || j >= slice.len() {
        return None;
    }
    let ptr = slice.as_mut_ptr();
    unsafe {
        Some((&mut *ptr.add(i), &mut *ptr.add(j)))
    }
}

fn bytes_to_i32(bytes: &[u8]) -> Option<i32> {
    if bytes.len() != 4 {
        return None;
    }
    Some(i32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]))
}
`,
    testCode: `let mut data = vec![1, 2, 3, 4, 5];
    let (left, right) = split_at_mut_manual(&mut data, 2);
    assert_test_eq("split left len", 2usize, left.len());
    assert_test_eq("split right len", 3usize, right.len());
    assert_test_eq("split left[0]", 1i32, left[0]);
    assert_test_eq("split right[0]", 3i32, right[0]);
    let mut arr = vec![10, 20, 30];
    let result = get_two_mut(&mut arr, 0, 2);
    assert_test("get_two_mut valid", result.is_some());
    let mut arr2 = vec![10, 20, 30];
    assert_test("get_two_mut same index", get_two_mut(&mut arr2, 1, 1).is_none());
    assert_test_eq("bytes_to_i32 valid", Some(1i32), bytes_to_i32(&[1, 0, 0, 0]));
    assert_test("bytes_to_i32 wrong len", bytes_to_i32(&[1, 2]).is_none());`,
    hints: [
      'For <code>split_at_mut_manual</code>, use <code>slice.as_mut_ptr()</code> and <code>std::slice::from_raw_parts_mut</code> to create two non-overlapping mutable slices.',
      'For <code>get_two_mut</code>, check that <code>i != j</code> and both are in bounds, then use raw pointers to create two mutable references.',
      'For <code>bytes_to_i32</code>, use <code>i32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]])</code> — no unsafe needed!',
      'Soundness means: if the caller provides valid arguments, the function cannot cause undefined behavior. Always validate inputs before entering <code>unsafe</code>.',
    ],
    concepts: ['soundness', 'undefined behavior', 'safe wrappers', 'split_at_mut', 'from_raw_parts_mut'],
    successPatterns: [
      'from_raw_parts_mut',
      'as_mut_ptr',
      'from_le_bytes',
    ],
    testNames: [
      'split_at_mut_manual left has correct length',
      'split_at_mut_manual right has correct length',
      'split_at_mut_manual left starts correctly',
      'split_at_mut_manual right starts correctly',
      'get_two_mut returns Some for valid distinct indices',
      'get_two_mut returns None for same index',
      'bytes_to_i32 converts valid bytes correctly',
      'bytes_to_i32 returns None for wrong length',
    ],
  },

  'rust-safe-abstractions': {
    id: 'rust-safe-abstractions',
    language: 'rust',
    title: 'Safe Abstractions over Unsafe',
    difficulty: 'advanced',
    order: 4,
    description: `
<p>The gold standard in Rust: <strong>unsafe internals with a safe public API</strong>. The standard library's <code>Vec</code>, <code>HashMap</code>, and <code>String</code> all follow this pattern. Users interact with a safe interface while performance-critical internals use unsafe.</p>

<h3>The Pattern</h3>
<ol>
  <li>Identify the minimal unsafe operations needed</li>
  <li>Wrap them in safe functions that enforce invariants</li>
  <li>Expose only the safe API to callers</li>
</ol>

<h3>Example: A Simple Stack</h3>
<pre><code>struct Stack {
    data: *mut i32,  // raw pointer to heap allocation
    len: usize,
    capacity: usize,
}

// Unsafe internals, but push/pop/peek are all safe to call</code></pre>

<h3>Your Task</h3>
<p>Implement a simple <code>SimpleVec</code> type — a growable array that uses raw pointer allocation internally but exposes a completely safe interface with <code>push</code>, <code>pop</code>, <code>get</code>, and <code>len</code>.</p>
`,
    starterCode: `// Safe Abstractions over Unsafe

/// A simplified Vec-like type using raw pointer allocation.
struct SimpleVec {
    data: Vec<i32>,  // We use Vec internally for simplicity;
                     // a real implementation would use raw alloc.
}

impl SimpleVec {
    /// Creates a new empty SimpleVec.
    fn new() -> Self {
        todo!("create an empty SimpleVec")
    }

    /// Appends a value to the end.
    fn push(&mut self, val: i32) {
        todo!("add val to the vector")
    }

    /// Removes and returns the last value, or None if empty.
    fn pop(&mut self) -> Option<i32> {
        todo!("remove and return the last element")
    }

    /// Returns the element at the given index, or None if out of bounds.
    fn get(&self, index: usize) -> Option<i32> {
        todo!("return element at index if valid")
    }

    /// Returns the number of elements.
    fn len(&self) -> usize {
        todo!("return the length")
    }

    /// Returns true if the vec is empty.
    fn is_empty(&self) -> bool {
        todo!("check if length is 0")
    }

    /// Returns the sum of all elements.
    fn sum(&self) -> i32 {
        todo!("sum all elements")
    }
}
`,
    solutionCode: `// Safe Abstractions over Unsafe

struct SimpleVec {
    data: Vec<i32>,
}

impl SimpleVec {
    fn new() -> Self {
        SimpleVec { data: Vec::new() }
    }

    fn push(&mut self, val: i32) {
        self.data.push(val);
    }

    fn pop(&mut self) -> Option<i32> {
        self.data.pop()
    }

    fn get(&self, index: usize) -> Option<i32> {
        self.data.get(index).copied()
    }

    fn len(&self) -> usize {
        self.data.len()
    }

    fn is_empty(&self) -> bool {
        self.data.is_empty()
    }

    fn sum(&self) -> i32 {
        self.data.iter().sum()
    }
}
`,
    testCode: `let mut v = SimpleVec::new();
    assert_test("new is empty", v.is_empty());
    assert_test_eq("new len 0", 0usize, v.len());
    v.push(10);
    v.push(20);
    v.push(30);
    assert_test_eq("len after 3 pushes", 3usize, v.len());
    assert_test_eq("get 0", Some(10i32), v.get(0));
    assert_test_eq("get 2", Some(30i32), v.get(2));
    assert_test("get out of bounds", v.get(5).is_none());
    assert_test_eq("pop", Some(30i32), v.pop());
    assert_test_eq("len after pop", 2usize, v.len());
    assert_test_eq("sum", 30i32, v.sum());`,
    hints: [
      'For <code>new</code>, use <code>SimpleVec { data: Vec::new() }</code>.',
      'For <code>get</code>, use <code>self.data.get(index).copied()</code> to return <code>Option&lt;i32&gt;</code> (copied converts <code>&amp;i32</code> to <code>i32</code>).',
      'For <code>pop</code>, <code>Vec::pop</code> already returns <code>Option&lt;i32&gt;</code>, so delegate directly.',
      'For <code>sum</code>, use <code>self.data.iter().sum()</code>.',
    ],
    concepts: ['safe abstractions', 'encapsulation', 'API design', 'Vec-like type', 'Option type'],
    successPatterns: [
      'SimpleVec',
      '\\.push\\(',
      '\\.pop\\(',
      '\\.get\\(',
    ],
    testNames: [
      'New SimpleVec is empty',
      'New SimpleVec has length 0',
      'Length is 3 after 3 pushes',
      'get(0) returns first pushed element',
      'get(2) returns third pushed element',
      'get out of bounds returns None',
      'pop returns last element',
      'Length decreases after pop',
      'sum returns correct total',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Module 4: Cryptographic Rust
  // ─────────────────────────────────────────────────────────

  'rust-constant-time': {
    id: 'rust-constant-time',
    language: 'rust',
    title: 'Constant-Time Comparison',
    difficulty: 'advanced',
    order: 1,
    description: `
<p>In cryptography, <strong>timing attacks</strong> exploit the fact that naive comparison functions return early when they find a mismatch. By measuring how long a comparison takes, an attacker can learn <em>where</em> the first difference is and reconstruct secrets byte by byte.</p>

<h3>The Vulnerable Pattern</h3>
<pre><code>// BAD: early return leaks information via timing
fn naive_eq(a: &amp;[u8], b: &amp;[u8]) -> bool {
    if a.len() != b.len() { return false; }
    for i in 0..a.len() {
        if a[i] != b[i] { return false; }  // exits early!
    }
    true
}</code></pre>
<p>If the first byte matches, this takes longer than if it doesn't. An attacker can exploit this to guess one byte at a time.</p>

<h3>The Constant-Time Pattern</h3>
<p>We XOR all byte pairs and OR the results together. The function always processes <em>every</em> byte, regardless of where differences are:</p>
<pre><code>fn ct_eq(a: &amp;[u8], b: &amp;[u8]) -> bool {
    if a.len() != b.len() { return false; }
    let mut diff = 0u8;
    for i in 0..a.len() {
        diff |= a[i] ^ b[i];  // XOR detects differences, OR accumulates
    }
    diff == 0  // only true if ALL bytes were equal
}</code></pre>

<h3>Why This Works</h3>
<p><code>a[i] ^ b[i]</code> is 0 if and only if <code>a[i] == b[i]</code>. The OR accumulates any non-zero bits. The final check <code>diff == 0</code> is only true if every pair was equal. No early returns means constant execution time.</p>

<h3>Your Task</h3>
<p>Implement constant-time comparison and related cryptographic utility functions.</p>
`,
    starterCode: `// Constant-Time Comparison

/// Constant-time equality comparison for byte slices.
/// Always processes every byte — no early returns after the length check.
fn ct_eq(a: &[u8], b: &[u8]) -> bool {
    todo!("XOR each byte pair, OR the results, check if zero")
}

/// Constant-time select: returns a if condition is true, b if false.
/// Must not branch on condition — use bitwise operations.
fn ct_select(condition: bool, a: u8, b: u8) -> u8 {
    todo!("use bitwise ops to select without branching")
}

/// XORs two byte slices of equal length, producing a new Vec<u8>.
/// Panics if lengths differ.
fn xor_bytes(a: &[u8], b: &[u8]) -> Vec<u8> {
    todo!("XOR corresponding bytes")
}

/// Returns true if a byte slice is all zeros (constant-time).
fn is_zero(data: &[u8]) -> bool {
    todo!("OR all bytes together, check if zero")
}
`,
    solutionCode: `// Constant-Time Comparison

fn ct_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    let mut diff = 0u8;
    for i in 0..a.len() {
        diff |= a[i] ^ b[i];
    }
    diff == 0
}

fn ct_select(condition: bool, a: u8, b: u8) -> u8 {
    let mask = (condition as u8).wrapping_neg(); // 0xFF if true, 0x00 if false
    (mask & a) | (!mask & b)
}

fn xor_bytes(a: &[u8], b: &[u8]) -> Vec<u8> {
    assert_eq!(a.len(), b.len(), "slices must have equal length");
    a.iter().zip(b.iter()).map(|(x, y)| x ^ y).collect()
}

fn is_zero(data: &[u8]) -> bool {
    let mut acc = 0u8;
    for &byte in data {
        acc |= byte;
    }
    acc == 0
}
`,
    testCode: `assert_test("ct_eq equal", ct_eq(&[1, 2, 3], &[1, 2, 3]));
    assert_test("ct_eq differ", !ct_eq(&[1, 2, 3], &[1, 2, 4]));
    assert_test("ct_eq diff len", !ct_eq(&[1, 2], &[1, 2, 3]));
    assert_test("ct_eq empty", ct_eq(&[], &[]));
    assert_test_eq("ct_select true", 0xAAu8, ct_select(true, 0xAA, 0xBB));
    assert_test_eq("ct_select false", 0xBBu8, ct_select(false, 0xAA, 0xBB));
    assert_test_eq("xor_bytes", vec![0u8, 0, 0], xor_bytes(&[0xAA, 0xBB, 0xCC], &[0xAA, 0xBB, 0xCC]));
    assert_test("is_zero true", is_zero(&[0, 0, 0]));
    assert_test("is_zero false", !is_zero(&[0, 1, 0]));`,
    hints: [
      'For <code>ct_eq</code>, use <code>diff |= a[i] ^ b[i]</code> in a loop. XOR produces 0 for equal bytes. OR accumulates any differences.',
      'For <code>ct_select</code>, create a mask: <code>(condition as u8).wrapping_neg()</code> gives 0xFF for true, 0x00 for false. Then use <code>(mask &amp; a) | (!mask &amp; b)</code>.',
      'For <code>xor_bytes</code>, use <code>a.iter().zip(b.iter()).map(|(x, y)| x ^ y).collect()</code>.',
      'For <code>is_zero</code>, OR all bytes together with <code>acc |= byte</code> and check <code>acc == 0</code>.',
    ],
    concepts: ['constant-time comparison', 'timing attacks', 'XOR', 'bitwise operations', 'cryptographic safety'],
    successPatterns: [
      'diff \\|= a\\[i\\] \\^ b\\[i\\]',
      'wrapping_neg',
      '\\.zip\\(',
    ],
    testNames: [
      'ct_eq returns true for equal slices',
      'ct_eq returns false for different slices',
      'ct_eq returns false for different lengths',
      'ct_eq handles empty slices',
      'ct_select returns a when true',
      'ct_select returns b when false',
      'xor_bytes XORs identical slices to zeros',
      'is_zero returns true for all zeros',
      'is_zero returns false when non-zero byte present',
    ],
  },

  'rust-field-arithmetic': {
    id: 'rust-field-arithmetic',
    language: 'rust',
    title: 'Finite Field Arithmetic',
    difficulty: 'advanced',
    order: 2,
    description: `
<p>A <strong>finite field</strong> GF(p) is the set {0, 1, ..., p-1} with addition and multiplication modulo a prime p. Finite fields are the foundation of modern cryptography — elliptic curves, RSA, AES all depend on them.</p>

<h3>Connection to Haskell Track</h3>
<p>If you completed the abstract algebra exercises in Haskell, this is the same concept implemented in a systems language. The algebraic structure is identical; the implementation uses Rust's trait system instead of Haskell's typeclasses.</p>

<h3>Field Elements</h3>
<pre><code>struct FieldElement {
    value: u64,
    prime: u64,
}</code></pre>
<p>All arithmetic operations must reduce the result modulo <code>prime</code>.</p>

<h3>Modular Inverse</h3>
<p>Division in a finite field is multiplication by the <strong>modular inverse</strong>. We can compute it using Fermat's little theorem: a<sup>p-2</sup> mod p = a<sup>-1</sup> mod p (when p is prime).</p>

<h3>Your Task</h3>
<p>Implement <code>FieldElement</code> with addition, subtraction, multiplication, negation, and modular exponentiation.</p>
`,
    starterCode: `// Finite Field Arithmetic

#[derive(Debug, Clone, Copy, PartialEq)]
struct FieldElement {
    value: u64,
    prime: u64,
}

impl FieldElement {
    /// Creates a new field element, reducing value mod prime.
    fn new(value: u64, prime: u64) -> Self {
        todo!("create with value reduced mod prime")
    }

    /// Field addition: (a + b) mod p
    fn add(self, other: FieldElement) -> FieldElement {
        todo!("add and reduce mod prime")
    }

    /// Field subtraction: (a - b + p) mod p
    fn sub(self, other: FieldElement) -> FieldElement {
        todo!("subtract with modular wraparound")
    }

    /// Field multiplication: (a * b) mod p
    fn mul(self, other: FieldElement) -> FieldElement {
        todo!("multiply and reduce mod prime")
    }

    /// Additive inverse: (p - a) mod p
    fn neg(self) -> FieldElement {
        todo!("return the additive inverse")
    }

    /// Modular exponentiation: a^exp mod p (using repeated squaring)
    fn pow(self, mut exp: u64) -> FieldElement {
        todo!("implement fast modular exponentiation")
    }

    /// Multiplicative inverse using Fermat's little theorem: a^(p-2) mod p
    fn inv(self) -> FieldElement {
        todo!("use pow with p-2")
    }
}
`,
    solutionCode: `// Finite Field Arithmetic

#[derive(Debug, Clone, Copy, PartialEq)]
struct FieldElement {
    value: u64,
    prime: u64,
}

impl FieldElement {
    fn new(value: u64, prime: u64) -> Self {
        FieldElement { value: value % prime, prime }
    }

    fn add(self, other: FieldElement) -> FieldElement {
        FieldElement::new((self.value + other.value) % self.prime, self.prime)
    }

    fn sub(self, other: FieldElement) -> FieldElement {
        FieldElement::new((self.value + self.prime - other.value) % self.prime, self.prime)
    }

    fn mul(self, other: FieldElement) -> FieldElement {
        FieldElement::new(((self.value as u128 * other.value as u128) % self.prime as u128) as u64, self.prime)
    }

    fn neg(self) -> FieldElement {
        FieldElement::new((self.prime - self.value) % self.prime, self.prime)
    }

    fn pow(self, mut exp: u64) -> FieldElement {
        let mut base = self.value as u128;
        let p = self.prime as u128;
        let mut result = 1u128;
        base %= p;
        while exp > 0 {
            if exp % 2 == 1 {
                result = (result * base) % p;
            }
            exp /= 2;
            base = (base * base) % p;
        }
        FieldElement::new(result as u64, self.prime)
    }

    fn inv(self) -> FieldElement {
        self.pow(self.prime - 2)
    }
}
`,
    testCode: `let a = FieldElement::new(7, 23);
    let b = FieldElement::new(15, 23);
    assert_test_eq("field new reduces", FieldElement { value: 7, prime: 23 }, FieldElement::new(30, 23));
    assert_test_eq("field add", FieldElement::new(22, 23), a.add(b));
    assert_test_eq("field sub", FieldElement::new(15, 23), a.sub(b));
    assert_test_eq("field mul", FieldElement::new((7u64 * 15) % 23, 23), a.mul(b));
    assert_test_eq("field neg", FieldElement::new(16, 23), a.neg());
    assert_test_eq("field pow", FieldElement::new(3, 23), FieldElement::new(2, 23).pow(5));
    let inv3 = FieldElement::new(3, 23).inv();
    assert_test_eq("field inv * original", FieldElement::new(1, 23), FieldElement::new(3, 23).mul(inv3));`,
    hints: [
      'For <code>new</code>, use <code>value % prime</code> to reduce the value into the field.',
      'For <code>sub</code>, use <code>(self.value + self.prime - other.value) % self.prime</code> to avoid underflow.',
      'For <code>mul</code>, cast to <code>u128</code> before multiplying to avoid overflow: <code>(self.value as u128 * other.value as u128) % self.prime as u128</code>.',
      'For <code>pow</code>, use repeated squaring: while exp > 0, if exp is odd multiply result by base, then square base and halve exp. Use <code>u128</code> for intermediate values.',
    ],
    concepts: ['finite fields', 'modular arithmetic', 'modular exponentiation', 'Fermat little theorem', 'cryptographic primitives'],
    successPatterns: [
      'value % prime',
      'as u128',
      'self\\.pow\\(self\\.prime - 2\\)',
    ],
    testNames: [
      'new reduces value mod prime',
      'field addition wraps correctly',
      'field subtraction wraps correctly',
      'field multiplication is correct',
      'negation gives additive inverse',
      'modular exponentiation works',
      'inverse satisfies a * inv(a) = 1',
    ],
  },

  'rust-eddsa': {
    id: 'rust-eddsa',
    language: 'rust',
    title: 'EdDSA Signature Verification (Simplified)',
    difficulty: 'advanced',
    order: 3,
    description: `
<p><strong>EdDSA</strong> (Edwards-curve Digital Signature Algorithm) is a modern signature scheme used in SSH, TLS, and cryptocurrency. This exercise implements a simplified version to teach the core concepts.</p>

<h3>Simplified EdDSA Overview</h3>
<p>We work in a finite field GF(p) and define a "point" as a single field element (simplifying the full curve arithmetic). The essential structure remains:</p>
<ul>
  <li><strong>Key generation</strong>: Pick a secret scalar <code>sk</code>. Compute public key <code>pk = sk * G</code> (where G is a generator).</li>
  <li><strong>Signing</strong>: Pick random nonce <code>k</code>, compute <code>r = k * G</code>, compute challenge <code>e = hash(r, message)</code>, compute <code>s = k - e * sk</code>.</li>
  <li><strong>Verification</strong>: Check that <code>s * G + e * pk == r</code>.</li>
</ul>

<h3>Why This Works</h3>
<pre><code>s * G + e * pk
= (k - e * sk) * G + e * (sk * G)
= k * G - e * sk * G + e * sk * G
= k * G
= r  ✓</code></pre>

<h3>Our Simplification</h3>
<p>We use scalar arithmetic mod a prime instead of full elliptic curve point operations. The algebraic structure is identical — multiplication replaces point scalar multiplication.</p>

<h3>Your Task</h3>
<p>Implement the simplified key generation, signing, and verification using modular arithmetic.</p>
`,
    starterCode: `// EdDSA Signature Verification (Simplified)

const PRIME: u64 = 997;   // small prime for demonstration
const GEN: u64 = 5;       // generator of the group

/// Modular exponentiation: base^exp mod modulus
fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    todo!("implement repeated squaring")
}

/// Simple hash: combines two values into a field element.
fn simple_hash(r: u64, message: u64) -> u64 {
    todo!("return (r * 31 + message) % PRIME as a simple hash")
}

/// Key generation: given a secret key, compute the public key.
/// pk = GEN^sk mod PRIME
fn generate_public_key(sk: u64) -> u64 {
    todo!("compute GEN^sk mod PRIME")
}

/// Signing: given secret key, message, and nonce k,
/// returns (r, s) where r = GEN^k mod PRIME, s = (k - e * sk) mod PRIME
fn sign(sk: u64, message: u64, k: u64) -> (u64, u64) {
    todo!("compute r and s for the signature")
}

/// Verification: given public key, message, and signature (r, s),
/// check that GEN^s * pk^e mod PRIME == r
fn verify(pk: u64, message: u64, r: u64, s: u64) -> bool {
    todo!("verify the signature")
}
`,
    solutionCode: `// EdDSA Signature Verification (Simplified)

const PRIME: u64 = 997;
const GEN: u64 = 5;

fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    let mut result = 1u64;
    base %= modulus;
    while exp > 0 {
        if exp % 2 == 1 {
            result = (result as u128 * base as u128 % modulus as u128) as u64;
        }
        exp /= 2;
        base = (base as u128 * base as u128 % modulus as u128) as u64;
    }
    result
}

fn simple_hash(r: u64, message: u64) -> u64 {
    ((r as u128 * 31 + message as u128) % PRIME as u128) as u64
}

fn generate_public_key(sk: u64) -> u64 {
    mod_pow(GEN, sk, PRIME)
}

fn sign(sk: u64, message: u64, k: u64) -> (u64, u64) {
    let r = mod_pow(GEN, k, PRIME);
    let e = simple_hash(r, message);
    let s = ((k as u128 + PRIME as u128 * 1000 - (e as u128 * sk as u128)) % PRIME as u128) as u64;
    (r, s)
}

fn verify(pk: u64, message: u64, r: u64, s: u64) -> bool {
    let e = simple_hash(r, message);
    let lhs = (mod_pow(GEN, s, PRIME) as u128 * mod_pow(pk, e, PRIME) as u128 % PRIME as u128) as u64;
    lhs == r
}
`,
    testCode: `assert_test_eq("mod_pow 5^3 mod 997", 125u64, mod_pow(5, 3, 997));
    assert_test_eq("mod_pow 2^10 mod 1000", 24u64, mod_pow(2, 10, 1000));
    assert_test_eq("simple_hash", ((100u64 * 31 + 42) % PRIME), simple_hash(100, 42));
    let sk = 123u64;
    let pk = generate_public_key(sk);
    assert_test_eq("generate_pk", mod_pow(GEN, sk, PRIME), pk);
    let message = 42u64;
    let k = 456u64;
    let (r, s) = sign(sk, message, k);
    assert_test("verify valid signature", verify(pk, message, r, s));
    assert_test("verify wrong message", !verify(pk, message + 1, r, s));`,
    hints: [
      'For <code>mod_pow</code>, use repeated squaring: while exp > 0, if odd multiply result by base, square base, halve exp. Use <code>u128</code> for intermediate products.',
      'For <code>simple_hash</code>, return <code>((r as u128 * 31 + message as u128) % PRIME as u128) as u64</code>.',
      'For <code>sign</code>, compute <code>r = mod_pow(GEN, k, PRIME)</code>, <code>e = simple_hash(r, message)</code>, <code>s = (k + PRIME*N - e*sk) % PRIME</code> where N is large enough to avoid underflow.',
      'For <code>verify</code>, compute <code>e = simple_hash(r, message)</code> and check <code>mod_pow(GEN, s, PRIME) * mod_pow(pk, e, PRIME) % PRIME == r</code>.',
    ],
    concepts: ['digital signatures', 'EdDSA', 'modular exponentiation', 'key generation', 'signature verification'],
    successPatterns: [
      'result as u128 \\* base as u128',
      'PRIME as u128 \\* 1000',
      'mod_pow\\(GEN, s, PRIME\\).*mod_pow\\(pk, e, PRIME\\)',
    ],
    testNames: [
      'mod_pow computes 5^3 mod 997 correctly',
      'mod_pow computes 2^10 mod 1000 correctly',
      'simple_hash produces expected value',
      'generate_public_key matches expected',
      'verify accepts valid signature',
      'verify rejects wrong message',
    ],
  },

  'rust-hash-functions': {
    id: 'rust-hash-functions',
    language: 'rust',
    title: 'Hash Functions (FNV-1a)',
    difficulty: 'advanced',
    order: 4,
    description: `
<p>A <strong>hash function</strong> maps arbitrary-length input to a fixed-size output. Cryptographic hash functions must also be collision-resistant, preimage-resistant, and avalanche-sensitive. In this exercise, we implement <strong>FNV-1a</strong>, a fast non-cryptographic hash, and explore its properties.</p>

<h3>FNV-1a Algorithm</h3>
<p>FNV-1a is simple and fast, making it great for hash tables (though not for cryptography):</p>
<pre><code>hash = FNV_OFFSET_BASIS
for each byte in input:
    hash = hash XOR byte
    hash = hash * FNV_PRIME</code></pre>

<h3>Constants (64-bit)</h3>
<pre><code>FNV_OFFSET_BASIS: u64 = 14695981039346656037
FNV_PRIME: u64 = 1099511628211</code></pre>

<h3>Properties of Good Hash Functions</h3>
<ul>
  <li><strong>Deterministic</strong>: Same input always gives same output</li>
  <li><strong>Avalanche effect</strong>: Changing one input bit changes ~50% of output bits</li>
  <li><strong>Uniform distribution</strong>: Outputs are spread evenly across the range</li>
</ul>

<h3>Bitwise Operations in Rust</h3>
<p>Rust provides the operators you need: <code>^</code> (XOR), <code>|</code> (OR), <code>&amp;</code> (AND), <code>&lt;&lt;</code> (left shift), <code>&gt;&gt;</code> (right shift). For hashing, use <code>.wrapping_mul()</code> to handle overflow.</p>

<h3>Your Task</h3>
<p>Implement FNV-1a hashing, a function to count differing bits (Hamming distance), and a simple Bloom filter using FNV-1a.</p>
`,
    starterCode: `// Hash Functions (FNV-1a)

const FNV_OFFSET_BASIS: u64 = 14695981039346656037;
const FNV_PRIME: u64 = 1099511628211;

/// Computes the FNV-1a hash of a byte slice.
fn fnv1a(data: &[u8]) -> u64 {
    todo!("implement FNV-1a: XOR each byte then multiply by prime")
}

/// Computes the FNV-1a hash of a string.
fn fnv1a_str(s: &str) -> u64 {
    todo!("delegate to fnv1a with s.as_bytes()")
}

/// Counts the number of differing bits between two u64 values (Hamming distance).
fn hamming_distance(a: u64, b: u64) -> u32 {
    todo!("XOR a and b, count the 1 bits")
}

/// A simple Bloom filter using two hash functions derived from FNV-1a.
struct BloomFilter {
    bits: Vec<bool>,
    size: usize,
}

impl BloomFilter {
    fn new(size: usize) -> Self {
        todo!("create a Bloom filter with 'size' bits, all false")
    }

    /// Inserts a string into the Bloom filter.
    fn insert(&mut self, item: &str) {
        todo!("compute two hash positions and set those bits to true")
    }

    /// Checks if a string MIGHT be in the Bloom filter.
    fn might_contain(&self, item: &str) -> bool {
        todo!("check if both hash positions are true")
    }
}
`,
    solutionCode: `// Hash Functions (FNV-1a)

const FNV_OFFSET_BASIS: u64 = 14695981039346656037;
const FNV_PRIME: u64 = 1099511628211;

fn fnv1a(data: &[u8]) -> u64 {
    let mut hash = FNV_OFFSET_BASIS;
    for &byte in data {
        hash ^= byte as u64;
        hash = hash.wrapping_mul(FNV_PRIME);
    }
    hash
}

fn fnv1a_str(s: &str) -> u64 {
    fnv1a(s.as_bytes())
}

fn hamming_distance(a: u64, b: u64) -> u32 {
    (a ^ b).count_ones()
}

struct BloomFilter {
    bits: Vec<bool>,
    size: usize,
}

impl BloomFilter {
    fn new(size: usize) -> Self {
        BloomFilter {
            bits: vec![false; size],
            size,
        }
    }

    fn insert(&mut self, item: &str) {
        let h1 = fnv1a_str(item) as usize % self.size;
        let h2 = fnv1a(item.as_bytes().iter().rev().copied().collect::<Vec<u8>>().as_slice()) as usize % self.size;
        self.bits[h1] = true;
        self.bits[h2] = true;
    }

    fn might_contain(&self, item: &str) -> bool {
        let h1 = fnv1a_str(item) as usize % self.size;
        let h2 = fnv1a(item.as_bytes().iter().rev().copied().collect::<Vec<u8>>().as_slice()) as usize % self.size;
        self.bits[h1] && self.bits[h2]
    }
}
`,
    testCode: `assert_test_eq("fnv1a empty", FNV_OFFSET_BASIS, fnv1a(&[]));
    let h1 = fnv1a_str("hello");
    let h2 = fnv1a_str("hello");
    assert_test_eq("fnv1a deterministic", h1, h2);
    assert_test("fnv1a different inputs", fnv1a_str("hello") != fnv1a_str("hellp"));
    assert_test_eq("hamming same", 0u32, hamming_distance(0xFF, 0xFF));
    assert_test_eq("hamming one bit", 1u32, hamming_distance(0b1000, 0b0000));
    let mut bloom = BloomFilter::new(1024);
    bloom.insert("apple");
    bloom.insert("banana");
    assert_test("bloom contains apple", bloom.might_contain("apple"));
    assert_test("bloom contains banana", bloom.might_contain("banana"));
    assert_test("bloom not contains cherry", !bloom.might_contain("cherry"));`,
    hints: [
      'For <code>fnv1a</code>, start with <code>FNV_OFFSET_BASIS</code>, then for each byte: <code>hash ^= byte as u64; hash = hash.wrapping_mul(FNV_PRIME);</code>.',
      'For <code>hamming_distance</code>, XOR the two values and count the 1 bits with <code>.count_ones()</code>.',
      'For the Bloom filter, use <code>fnv1a_str(item) as usize % self.size</code> as one hash, and hash the reversed bytes for a second hash.',
      'For <code>might_contain</code>, both bit positions must be <code>true</code>. False positives are possible, but false negatives are not.',
    ],
    concepts: ['hash functions', 'FNV-1a', 'Hamming distance', 'Bloom filter', 'bitwise operations'],
    successPatterns: [
      'wrapping_mul',
      'count_ones',
      'BloomFilter',
    ],
    testNames: [
      'fnv1a of empty input returns offset basis',
      'fnv1a is deterministic',
      'fnv1a produces different hashes for similar inputs',
      'hamming_distance of identical values is 0',
      'hamming_distance of one-bit difference is 1',
      'Bloom filter contains inserted apple',
      'Bloom filter contains inserted banana',
      'Bloom filter does not contain cherry',
    ],
  },
};
