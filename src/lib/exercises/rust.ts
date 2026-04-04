import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  // ─────────────────────────────────────────────────────────
  // Module 1: Ownership & Borrowing — "The compiler as safety net"
  // ─────────────────────────────────────────────────────────

  'rust-move-semantics': {
    id: 'rust-move-semantics',
    language: 'rust',
    title: 'Move Semantics: Defeating Double-Free',
    difficulty: 'beginner',
    order: 1,
    description: `
<h3>The Real Problem: Double-Free and Use-After-Free</h3>

<p>In 2023, Google's security team reported that <strong>70% of high-severity Chrome vulnerabilities</strong> were memory safety bugs. The most common? Use-after-free. Here is the C++ code that causes it:</p>

<pre><code>// C++ — DANGEROUS: compiles, runs, corrupts memory silently
std::string* make_greeting(const std::string&amp; name) {
    std::string greeting = "Hello, " + name;
    return &amp;greeting;  // returning pointer to local — DANGLING
}
// The string is destroyed, but the pointer lives on.
// Any read through it is undefined behavior.

// Even worse: double-free
std::string* s1 = new std::string("data");
std::string* s2 = s1;   // both point to same memory
delete s1;               // freed
delete s2;               // DOUBLE FREE — heap corruption</code></pre>

<p>These bugs are invisible at compile time. They pass code review. They pass tests. They ship to production. They get exploited.</p>

<h3>Rust's Answer: Ownership</h3>

<p>Rust makes these bugs <strong>structurally impossible</strong>. Every value has exactly one owner. When you assign a heap-allocated value to another variable, ownership <em>moves</em> — the original binding becomes invalid:</p>

<pre><code>let s1 = String::from("data");
let s2 = s1;              // ownership MOVES to s2
// println!("{}", s1);    // COMPILE ERROR: s1 is no longer valid
println!("{}", s2);       // fine — s2 owns the data</code></pre>

<p>There is no double-free because there is only ever one owner. There is no use-after-free because the compiler tracks every move.</p>

<h3>Transferring vs. Borrowing</h3>

<p>Functions can <strong>take ownership</strong> (consuming the value) or <strong>borrow</strong> (read/write without consuming):</p>

<pre><code>fn consume(s: String) { /* s is dropped at end */ }
fn borrow(s: &amp;String) { /* s is read-only, caller keeps ownership */ }
fn borrow_mut(s: &amp;mut String) { /* s is writable, caller keeps ownership */ }

let owned = String::from("hello");
borrow(&amp;owned);          // still valid after this call
consume(owned);           // MOVED — no longer valid after this call</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"If the compiler can catch it, don't rely on discipline." Every C++ team has coding guidelines that say "don't use after free." Rust's insight: guidelines are for humans, and humans make mistakes. Move the check into the compiler and the entire class of bugs vanishes.</blockquote>

<h3>Your Task</h3>
<p>Implement functions that correctly transfer and borrow resources. Think about <em>who owns what</em> at every point in your code.</p>
`,
    starterCode: `// Move Semantics: Defeating Double-Free
//
// The C++ bug: two pointers to the same allocation.
// Rust's cure: exactly one owner, enforced at compile time.

/// Takes ownership of a String, extracts useful data, and drops it.
/// The caller cannot use the String after this call — that's the POINT.
/// This models resource acquisition: open a file, read it, close it.
fn consume_and_measure(s: String) -> (usize, char) {
    todo!("return (byte length, first character) — panic if empty")
}

/// Borrows a String immutably. The caller keeps ownership.
/// This is the common case: most functions just need to READ.
fn analyze(s: &String) -> (usize, usize) {
    todo!("return (number of words, number of bytes)")
}

/// Takes ownership of two Strings, merges them, returns a new String.
/// Both inputs are consumed — the caller loses access to both.
/// This models resource merging: combining two buffers into one.
fn merge_owned(a: String, b: String) -> String {
    todo!("return a combined string: '{a} :: {b}'")
}

/// Demonstrates the key insight: clone() creates a SECOND owner.
/// Returns a tuple of (original length, clone length) to prove both exist.
fn clone_and_compare(s: &String) -> (usize, usize) {
    todo!("clone s, modify the clone by pushing '!', return (original len, clone len)")
}

/// Borrows two string slices. Nobody loses ownership of anything.
/// Returns true if the first is a prefix of the second.
fn is_prefix(short: &str, long: &str) -> bool {
    todo!("check if long starts with short")
}
`,
    solutionCode: `// Move Semantics: Defeating Double-Free

fn consume_and_measure(s: String) -> (usize, char) {
    let first = s.chars().next().expect("string must not be empty");
    (s.len(), first)
}

fn analyze(s: &String) -> (usize, usize) {
    let words = s.split_whitespace().count();
    (words, s.len())
}

fn merge_owned(a: String, b: String) -> String {
    format!("{} :: {}", a, b)
}

fn clone_and_compare(s: &String) -> (usize, usize) {
    let mut cloned = s.clone();
    cloned.push('!');
    (s.len(), cloned.len())
}

fn is_prefix(short: &str, long: &str) -> bool {
    long.starts_with(short)
}
`,
    testCode: `assert_test_eq("consume hello", (5usize, 'h'), consume_and_measure(String::from("hello")));
    assert_test_eq("consume single", (1usize, 'x'), consume_and_measure(String::from("x")));
    assert_test_eq("analyze words", (3usize, 15usize), analyze(&String::from("the quick brown")));
    assert_test_eq("merge", String::from("foo :: bar"), merge_owned(String::from("foo"), String::from("bar")));
    assert_test_eq("clone_and_compare", (5usize, 6usize), clone_and_compare(&String::from("hello")));
    assert_test("is_prefix true", is_prefix("hel", "hello world"));
    assert_test("is_prefix false", !is_prefix("xyz", "hello"));`,
    hints: [
      'For <code>consume_and_measure</code>, use <code>s.chars().next().expect("...")</code> to get the first character, and <code>s.len()</code> for byte length.',
      'For <code>analyze</code>, use <code>s.split_whitespace().count()</code> for word count. Since you only have <code>&amp;String</code>, you cannot modify or consume it.',
      'For <code>merge_owned</code>, use <code>format!("{} :: {}", a, b)</code>. Both <code>a</code> and <code>b</code> are consumed by this function.',
      'For <code>clone_and_compare</code>, call <code>s.clone()</code> to create an independent copy, then <code>.push(\'!\')</code> on the clone. The original is unchanged because you only borrowed it.',
    ],
    concepts: ['ownership', 'move semantics', 'double-free prevention', 'use-after-free prevention', 'borrowing vs consuming'],
    successPatterns: [
      's\\.chars\\(\\)\\.next\\(\\)',
      'split_whitespace\\(\\)\\.count\\(\\)',
      's\\.clone\\(\\)',
    ],
    testNames: [
      'consume_and_measure returns length and first char for "hello"',
      'consume_and_measure handles single character',
      'analyze counts words and bytes correctly',
      'merge_owned combines strings with separator',
      'clone_and_compare shows clone is independent',
      'is_prefix returns true for valid prefix',
      'is_prefix returns false for non-prefix',
    ],
  },

  'rust-borrowing': {
    id: 'rust-borrowing',
    language: 'rust',
    title: 'Borrowing: Preventing Iterator Invalidation',
    difficulty: 'beginner',
    order: 2,
    description: `
<h3>The Real Problem: Iterator Invalidation</h3>

<p>This is one of the most insidious bugs in C++. It compiles without warnings. It sometimes works. It sometimes silently corrupts data. It sometimes crashes. The behavior is <em>undefined</em>:</p>

<pre><code>// C++ — UNDEFINED BEHAVIOR: iterator invalidation
std::vector&lt;int&gt; v = {1, 2, 3, 4, 5};
for (auto it = v.begin(); it != v.end(); ++it) {
    if (*it == 3) {
        v.push_back(6);  // DANGER: may reallocate the vector
                         // 'it' now points to freed memory
    }
    std::cout &lt;&lt; *it;   // reading through invalidated iterator — UB
}</code></pre>

<p>The vector's <code>push_back</code> may trigger reallocation. When it does, the vector moves to a new memory location, and <em>every existing iterator, pointer, and reference to its elements becomes dangling</em>. This passes all compiler checks in C++.</p>

<h3>Rust's Answer: The Borrow Checker</h3>

<p>Rust enforces a simple rule that eliminates this entire class of bug:</p>

<ul>
  <li>You can have <strong>any number of immutable references</strong> (<code>&amp;T</code>), OR</li>
  <li>You can have <strong>exactly one mutable reference</strong> (<code>&amp;mut T</code>)</li>
  <li>But <strong>never both at the same time</strong></li>
</ul>

<pre><code>let mut v = vec![1, 2, 3];
let first = &amp;v[0];     // immutable borrow
v.push(4);              // COMPILE ERROR: cannot borrow v as mutable
                        // while first (immutable borrow) is still alive
println!("{}", first);</code></pre>

<p>The iterator invalidation bug is <em>impossible</em> in Rust. Not because programmers are careful, but because the type system forbids it.</p>

<h3>String Slices: Borrowing in Action</h3>

<p>A <code>&amp;str</code> is a <em>borrowed view</em> into string data. It does not own the data — it just points to a contiguous sequence of UTF-8 bytes owned by someone else:</p>

<pre><code>let s = String::from("hello world");
let hello: &amp;str = &amp;s[0..5];   // borrows bytes 0-4
let world: &amp;str = &amp;s[6..11];  // borrows bytes 6-10
// Both slices are valid as long as s is not mutated</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Good APIs make misuse impossible, not just unlikely." — Butler Lampson. The borrow checker does not just warn you about iterator invalidation. It <em>rejects your program</em>. This is Lampson's principle made structural: the API (Rust's type system) physically cannot be misused.</blockquote>

<h3>Your Task</h3>
<p>Implement functions using borrowing correctly. The <code>first_word</code> function returns a <em>slice</em> — a borrowed view — which means the original string must remain valid and unmodified for as long as the slice exists.</p>
`,
    starterCode: `// Borrowing: Preventing Iterator Invalidation
//
// C++ lets you hold an iterator while mutating the container.
// Rust makes that a compile error. Here, you practice the safe patterns.

/// Returns the first word of the string (up to the first space).
/// If there is no space, returns the entire string.
///
/// KEY INSIGHT: the return type &str BORROWS from the input.
/// The compiler guarantees the caller cannot mutate the original
/// string while this slice exists. Iterator invalidation = impossible.
fn first_word(s: &str) -> &str {
    todo!("find the first space and return a slice up to it")
}

/// Appends an element to a vector via mutable reference.
/// Returns the new length.
///
/// KEY INSIGHT: &mut Vec<i32> means EXCLUSIVE access.
/// No one else can read or write v while this function runs.
/// This is why Rust has no data races.
fn push_and_len(v: &mut Vec<i32>, val: i32) -> usize {
    todo!("push val, return new length")
}

/// Counts how many elements in a borrowed slice satisfy a predicate.
/// The slice is borrowed immutably — the caller still owns the data.
fn count_where(data: &[i32], predicate: fn(i32) -> bool) -> usize {
    todo!("count elements where predicate returns true")
}

/// Returns references to the minimum and maximum of a non-empty slice.
/// Both references borrow from the SAME slice — the compiler tracks this.
fn min_max(data: &[i32]) -> (&i32, &i32) {
    todo!("return references to the min and max elements")
}
`,
    solutionCode: `// Borrowing: Preventing Iterator Invalidation

fn first_word(s: &str) -> &str {
    match s.find(' ') {
        Some(idx) => &s[..idx],
        None => s,
    }
}

fn push_and_len(v: &mut Vec<i32>, val: i32) -> usize {
    v.push(val);
    v.len()
}

fn count_where(data: &[i32], predicate: fn(i32) -> bool) -> usize {
    data.iter().filter(|&&x| predicate(x)).count()
}

fn min_max(data: &[i32]) -> (&i32, &i32) {
    let mut min = &data[0];
    let mut max = &data[0];
    for item in &data[1..] {
        if item < min { min = item; }
        if item > max { max = item; }
    }
    (min, max)
}
`,
    testCode: `assert_test_eq("first_word hello world", "hello", first_word("hello world"));
    assert_test_eq("first_word single", "hello", first_word("hello"));
    assert_test_eq("first_word three words", "the", first_word("the quick fox"));
    let mut v1 = vec![1, 2, 3];
    assert_test_eq("push_and_len", 4usize, push_and_len(&mut v1, 4));
    assert_test_eq("count_where evens", 3usize, count_where(&[1, 2, 3, 4, 5, 6], |x| x % 2 == 0));
    assert_test_eq("count_where none", 0usize, count_where(&[1, 3, 5], |x| x % 2 == 0));
    assert_test_eq("min_max", (&1i32, &9i32), min_max(&[3, 1, 9, 5, 2]));
    assert_test_eq("min_max single", (&7i32, &7i32), min_max(&[7]));`,
    hints: [
      'For <code>first_word</code>, use <code>s.find(\' \')</code> to locate the first space. It returns <code>Option&lt;usize&gt;</code>. Use <code>&amp;s[..idx]</code> to create a slice up to that index.',
      'For <code>count_where</code>, use <code>data.iter().filter(|&amp;&amp;x| predicate(x)).count()</code>. The double reference is because <code>iter()</code> yields <code>&amp;i32</code> and <code>filter</code> passes <code>&amp;&amp;i32</code>.',
      'For <code>min_max</code>, hold <em>references</em> to elements, not copies. Start with <code>&amp;data[0]</code> and iterate with <code>for item in &amp;data[1..]</code>.',
      'The borrow checker ensures <code>first_word</code>\'s return value keeps the input alive. Try (mentally) mutating the string while holding the slice — the compiler would reject it.',
    ],
    concepts: ['borrow checker', 'iterator invalidation', 'immutable references', 'mutable references', 'string slices'],
    successPatterns: [
      's\\.find\\(\' \'\\)',
      '&s\\[\\.\\.idx\\]',
      'data\\.iter\\(\\)\\.filter',
    ],
    testNames: [
      'first_word extracts first word from "hello world"',
      'first_word returns whole string when no space',
      'first_word handles multiple words',
      'push_and_len appends and returns new length',
      'count_where counts even numbers correctly',
      'count_where returns 0 when no matches',
      'min_max finds correct min and max',
      'min_max handles single-element slice',
    ],
  },

  'rust-lifetimes': {
    id: 'rust-lifetimes',
    language: 'rust',
    title: 'Lifetimes: Eliminating Dangling References',
    difficulty: 'intermediate',
    order: 3,
    description: `
<h3>The Real Problem: Dangling References</h3>

<p>This is the single most common source of security vulnerabilities in C. It compiles. It runs. It returns garbage. Sometimes it returns the "right" answer. That makes it worse — the bug hides until production:</p>

<pre><code>// C — UNDEFINED BEHAVIOR: dangling pointer
char* get_greeting(const char* name) {
    char buffer[256];
    snprintf(buffer, sizeof(buffer), "Hello, %s!", name);
    return buffer;  // DANGLING — buffer is on the stack
                    // it will be overwritten by the next function call
}

int main() {
    char* msg = get_greeting("Alice");
    printf("%s\\n", msg);  // might print "Hello, Alice!"
                           // might print garbage
                           // might crash
                           // depends on what the stack looks like
}</code></pre>

<p>The C compiler sees nothing wrong. Neither does Valgrind in some cases. The bug is a <em>temporal</em> problem — the reference outlives the data it points to.</p>

<h3>Rust's Answer: Lifetime Annotations</h3>

<p>Lifetime annotations make reference validity <strong>explicit and compiler-checked</strong>. They are not runtime constructs — they are <em>documentation that the compiler verifies</em>:</p>

<pre><code>// This signature says: the returned reference lives as long as
// the SHORTER of the two input lifetimes.
fn longest&lt;'a&gt;(x: &amp;'a str, y: &amp;'a str) -> &amp;'a str {
    if x.len() &gt;= y.len() { x } else { y }
}

// The compiler uses this to PROVE the result won't dangle:
{
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("hi");
        result = longest(&amp;s1, &amp;s2);
    } // s2 is dropped here
    // println!("{}", result); // COMPILE ERROR: result might reference s2
}</code></pre>

<h3>Structs That Borrow</h3>

<p>When a struct holds a reference, it needs a lifetime annotation. This tells the compiler: "this struct cannot outlive the data it borrows from."</p>

<pre><code>struct Excerpt&lt;'a&gt; {
    text: &amp;'a str,  // borrows from something that lives at least as long
}
// An Excerpt CANNOT exist after its source string is freed.
// The compiler enforces this — no dangling reference possible.</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Make dependencies explicit." Lifetimes are not annotation burden — they are <em>dependency declarations</em>. In C, the dependency between a pointer and its allocation is implicit and invisible. In Rust, it is written in the type signature and verified by the compiler. This is Parnas's information hiding inverted: the critical dependency (reference validity) is made <em>maximally visible</em> precisely because hiding it causes catastrophic bugs.</blockquote>

<h3>Your Task</h3>
<p>Implement functions and structs with explicit lifetime annotations. Each annotation is a <em>contract</em> about how long data lives.</p>
`,
    starterCode: `// Lifetimes: Eliminating Dangling References
//
// In C, returning a pointer to a local is undefined behavior.
// In Rust, lifetime annotations make the compiler PROVE
// that every reference is valid when used.

/// Returns the longer of two string slices.
/// The lifetime 'a says: "the result lives as long as BOTH inputs."
/// This is the canonical lifetime example — understand it deeply.
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    todo!("return whichever string is longer; if equal, return x")
}

/// Returns the first line of a multi-line string.
/// The returned slice borrows from the input — same lifetime.
fn first_line<'a>(text: &'a str) -> &'a str {
    todo!("find the first newline and return a slice up to it")
}

/// A struct that borrows text and provides analysis methods.
/// The lifetime 'a ties this struct's validity to its source data.
struct TextWindow<'a> {
    content: &'a str,
    start: usize,
    end: usize,
}

impl<'a> TextWindow<'a> {
    /// Creates a window over the entire text.
    fn new(content: &'a str) -> Self {
        todo!("create a TextWindow spanning the whole string")
    }

    /// Returns the visible text within the window.
    fn visible(&self) -> &'a str {
        todo!("return &content[start..end]")
    }

    /// Returns the number of words in the visible window.
    fn word_count(&self) -> usize {
        todo!("count whitespace-separated words in the visible portion")
    }

    /// Returns a narrower window. The lifetime is preserved —
    /// the new window still borrows from the ORIGINAL source.
    fn narrow(&self, new_start: usize, new_end: usize) -> TextWindow<'a> {
        todo!("return a new TextWindow with adjusted bounds")
    }
}

/// Given two string slices, returns the one starting with the given prefix.
/// If both or neither match, returns the first.
fn with_prefix<'a>(a: &'a str, b: &'a str, prefix: &str) -> &'a str {
    todo!("return b if only b starts with prefix, otherwise a")
}
`,
    solutionCode: `// Lifetimes: Eliminating Dangling References

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() { x } else { y }
}

fn first_line<'a>(text: &'a str) -> &'a str {
    match text.find('\\n') {
        Some(idx) => &text[..idx],
        None => text,
    }
}

struct TextWindow<'a> {
    content: &'a str,
    start: usize,
    end: usize,
}

impl<'a> TextWindow<'a> {
    fn new(content: &'a str) -> Self {
        TextWindow { content, start: 0, end: content.len() }
    }

    fn visible(&self) -> &'a str {
        &self.content[self.start..self.end]
    }

    fn word_count(&self) -> usize {
        self.visible().split_whitespace().count()
    }

    fn narrow(&self, new_start: usize, new_end: usize) -> TextWindow<'a> {
        TextWindow {
            content: self.content,
            start: self.start + new_start,
            end: self.start + new_end,
        }
    }
}

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
    let tw = TextWindow::new("the quick brown fox");
    assert_test_eq("window visible", "the quick brown fox", tw.visible());
    assert_test_eq("window word_count", 4usize, tw.word_count());
    let narrow = tw.narrow(4, 15);
    assert_test_eq("narrow visible", "quick brown", narrow.visible());
    assert_test_eq("narrow word_count", 2usize, narrow.word_count());
    assert_test_eq("with_prefix match b", "rust is cool", with_prefix("hello world", "rust is cool", "rust"));
    assert_test_eq("with_prefix neither", "hello", with_prefix("hello", "world", "xyz"));`,
    hints: [
      'For <code>longest</code>, compare <code>x.len()</code> and <code>y.len()</code> and return whichever is longer. If equal, return <code>x</code>.',
      'For <code>first_line</code>, use <code>text.find(\'\\n\')</code> and slice with <code>&amp;text[..idx]</code>.',
      'For <code>TextWindow::narrow</code>, the new window\'s <code>start</code> is <code>self.start + new_start</code> and <code>end</code> is <code>self.start + new_end</code>. Crucially, it borrows the same <code>content</code> with the same lifetime <code>\'a</code>.',
      'For <code>with_prefix</code>, use <code>.starts_with(prefix)</code>. Return <code>b</code> only if it matches and <code>a</code> does not.',
    ],
    concepts: ['lifetimes', 'dangling references', 'lifetime annotations', 'structs with lifetimes', 'lifetime elision'],
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
      'TextWindow visible shows full content',
      'TextWindow word_count counts correctly',
      'narrow creates correct sub-window',
      'narrowed window counts words correctly',
      'with_prefix returns b when b matches prefix',
      'with_prefix returns a when neither matches',
    ],
  },

  'rust-interior-mutability': {
    id: 'rust-interior-mutability',
    language: 'rust',
    title: 'Interior Mutability: Principled Escape Hatches',
    difficulty: 'intermediate',
    order: 4,
    description: `
<h3>The Real Problem: Shared Mutable State</h3>

<p>Sometimes you genuinely need mutation behind an immutable interface. Consider a cache: the caller sees a pure lookup function, but internally the function memoizes results. Or a logger: the object is shared across a system, but it needs to accumulate messages. Or reference-counted graphs: multiple nodes share ownership and need to mutate shared data.</p>

<p>In C++, you reach for <code>mutable</code> members and hope for the best:</p>

<pre><code>// C++ — data race waiting to happen
class Cache {
    mutable std::unordered_map&lt;int, int&gt; store;  // 'mutable' in const context
public:
    int lookup(int key) const {  // looks const...
        if (store.count(key) == 0)
            store[key] = compute(key);  // ...but mutates! Thread-safe? No.
        return store[key];
    }
};</code></pre>

<p>C++ <code>mutable</code> punches a hole in the type system with zero safety guarantees. If two threads call <code>lookup</code> concurrently, you get a data race — undefined behavior.</p>

<h3>Rust's Answer: Cell and RefCell</h3>

<p>Rust provides interior mutability through <code>Cell&lt;T&gt;</code> and <code>RefCell&lt;T&gt;</code>. The key difference from C++: <strong>borrow checking still happens</strong>, just at runtime instead of compile time.</p>

<pre><code>use std::cell::RefCell;

let data = RefCell::new(vec![1, 2, 3]);
data.borrow_mut().push(4);           // runtime mutable borrow — checked!
let len = data.borrow().len();       // runtime immutable borrow — checked!

// This would PANIC (not UB — a clean, debuggable failure):
// let r1 = data.borrow();
// let r2 = data.borrow_mut();  // PANIC: already borrowed immutably</code></pre>

<p><code>Cell&lt;T&gt;</code> is simpler — it works for <code>Copy</code> types and uses <code>get()</code>/<code>set()</code> without borrowing:</p>

<pre><code>use std::cell::Cell;
let c = Cell::new(0u32);
c.set(c.get() + 1);  // increment through immutable reference</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Minimal escape from safety." RefCell is not a hack — it is a <em>principled</em> relaxation of compile-time borrow checking to runtime borrow checking. You still get checked access. You still get clear errors (panics, not silent corruption). The trusted computing base grows slightly (from zero-cost to runtime-checked), but the invariant (no aliased mutation) is <em>preserved</em>. Compare with C++ <code>mutable</code>, which offers zero checking of any kind.</blockquote>

<h3>Your Task</h3>
<p>Build an observable counter using <code>Cell</code> and a message logger using <code>RefCell</code>. Both expose immutable interfaces (<code>&amp;self</code>) while maintaining internal state.</p>
`,
    starterCode: `// Interior Mutability: Principled Escape Hatches
use std::cell::{Cell, RefCell};

/// An observable counter: can be incremented and observed
/// through an IMMUTABLE reference (&self).
///
/// This models real patterns like:
///   - HTTP request counters in shared server state
///   - Cache hit/miss statistics
///   - Observable metrics in monitoring systems
struct ObservableCounter {
    count: Cell<u32>,
    max_seen: Cell<u32>,
}

impl ObservableCounter {
    fn new() -> Self {
        todo!("create counter starting at 0 with max_seen = 0")
    }

    /// Increments the counter. Updates max_seen if new count exceeds it.
    /// Note: &self — this works through an immutable reference!
    fn increment(&self) {
        todo!("increment count, update max_seen if count > max_seen")
    }

    /// Returns the current count.
    fn get(&self) -> u32 {
        todo!("return current count")
    }

    /// Returns the highest value the counter has reached.
    fn peak(&self) -> u32 {
        todo!("return max_seen")
    }

    /// Resets the counter to 0 (but max_seen remembers).
    fn reset(&self) {
        todo!("set count to 0, leave max_seen unchanged")
    }
}

/// A logger that accumulates messages through an immutable interface.
/// Uses RefCell because Vec<String> is not Copy.
struct AuditLog {
    entries: RefCell<Vec<String>>,
}

impl AuditLog {
    fn new() -> Self {
        todo!("create with empty entries")
    }

    /// Logs a message with a sequential number: "[1] msg", "[2] msg", etc.
    fn log(&self, msg: &str) {
        todo!("push numbered message into entries")
    }

    /// Returns the total number of log entries.
    fn count(&self) -> usize {
        todo!("return entries length")
    }

    /// Returns all entries joined by newlines.
    fn dump(&self) -> String {
        todo!("join all entries with newline separator")
    }
}
`,
    solutionCode: `// Interior Mutability: Principled Escape Hatches
use std::cell::{Cell, RefCell};

struct ObservableCounter {
    count: Cell<u32>,
    max_seen: Cell<u32>,
}

impl ObservableCounter {
    fn new() -> Self {
        ObservableCounter { count: Cell::new(0), max_seen: Cell::new(0) }
    }

    fn increment(&self) {
        let new_val = self.count.get() + 1;
        self.count.set(new_val);
        if new_val > self.max_seen.get() {
            self.max_seen.set(new_val);
        }
    }

    fn get(&self) -> u32 {
        self.count.get()
    }

    fn peak(&self) -> u32 {
        self.max_seen.get()
    }

    fn reset(&self) {
        self.count.set(0);
    }
}

struct AuditLog {
    entries: RefCell<Vec<String>>,
}

impl AuditLog {
    fn new() -> Self {
        AuditLog { entries: RefCell::new(Vec::new()) }
    }

    fn log(&self, msg: &str) {
        let mut entries = self.entries.borrow_mut();
        let n = entries.len() + 1;
        entries.push(format!("[{}] {}", n, msg));
    }

    fn count(&self) -> usize {
        self.entries.borrow().len()
    }

    fn dump(&self) -> String {
        self.entries.borrow().join("\\n")
    }
}
`,
    testCode: `let c = ObservableCounter::new();
    assert_test_eq("counter initial", 0u32, c.get());
    c.increment();
    c.increment();
    c.increment();
    assert_test_eq("counter after 3", 3u32, c.get());
    assert_test_eq("counter peak", 3u32, c.peak());
    c.reset();
    assert_test_eq("counter after reset", 0u32, c.get());
    assert_test_eq("peak survives reset", 3u32, c.peak());
    let log = AuditLog::new();
    log.log("started");
    log.log("processed");
    assert_test_eq("log count", 2usize, log.count());
    assert_test_eq("log dump", String::from("[1] started\\n[2] processed"), log.dump());`,
    hints: [
      'For <code>ObservableCounter::new</code>, use <code>Cell::new(0)</code> for both fields.',
      'For <code>increment</code>, read with <code>self.count.get()</code>, compute new value, write with <code>self.count.set(new_val)</code>. Then check if <code>new_val > self.max_seen.get()</code>.',
      'For <code>AuditLog::log</code>, use <code>self.entries.borrow_mut()</code> to get a mutable borrow, compute the number from <code>entries.len() + 1</code>, then push.',
      'For <code>dump</code>, use <code>self.entries.borrow().join("\\n")</code>. The borrow is released when the temporary goes out of scope.',
    ],
    concepts: ['interior mutability', 'Cell', 'RefCell', 'runtime borrow checking', 'shared mutable state'],
    successPatterns: [
      'Cell::new',
      'RefCell::new',
      'borrow_mut\\(\\)',
    ],
    testNames: [
      'Counter starts at 0',
      'Counter reaches 3 after 3 increments',
      'Counter peak tracks maximum',
      'Counter reset sets count to 0',
      'Peak survives counter reset',
      'AuditLog has 2 entries after 2 logs',
      'AuditLog dump formats entries correctly',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Module 2: Zero-Cost Abstractions — "Abstraction without overhead"
  // ─────────────────────────────────────────────────────────

  'rust-traits': {
    id: 'rust-traits',
    language: 'rust',
    title: 'Traits: Zero-Cost Polymorphism',
    difficulty: 'intermediate',
    order: 1,
    description: `
<h3>The Real Problem: The Cost of Abstraction</h3>

<p>In C++, polymorphism has a concrete runtime cost. Every virtual function call goes through a vtable — an extra pointer indirection, a potential cache miss, and a barrier to inlining:</p>

<pre><code>// C++ — virtual dispatch has overhead
class Shape {
public:
    virtual double area() const = 0;   // vtable slot
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
};

// Every call to area() goes through a vtable pointer.
// The compiler CANNOT inline this — it doesn't know the concrete type.
void print_area(const Shape&amp; s) {
    std::cout &lt;&lt; s.area();  // indirect call, never inlined
}</code></pre>

<p>This forces a choice: abstraction (virtual) or performance (templates). C++ templates give you performance but with horrific error messages and no separate compilation.</p>

<h3>Rust's Answer: Traits with Static Dispatch</h3>

<p>Rust traits with generics compile to <strong>specialized, monomorphized code</strong>. The compiler generates a separate function for each concrete type — fully inlined, zero overhead:</p>

<pre><code>trait Shape {
    fn area(&amp;self) -> f64;
}

struct Circle { radius: f64 }

impl Shape for Circle {
    fn area(&amp;self) -> f64 { std::f64::consts::PI * self.radius * self.radius }
}

// Static dispatch: the compiler generates a SPECIALIZED version
// of print_area for Circle. The area() call is INLINED.
fn print_area(s: &amp;impl Shape) {
    println!("{}", s.area());  // direct call, fully inlined
}</code></pre>

<p>You get the abstraction of interfaces with the performance of hand-written specialized code. Rust also supports dynamic dispatch (<code>&amp;dyn Shape</code>) when you need it — but you <em>choose</em> it explicitly.</p>

<h3>The Taste Principle</h3>

<blockquote>"The best abstraction is one you don't pay for." Stroustrup articulated this as C++'s zero-overhead principle, but C++ only partially delivers — templates are zero-cost but virtual functions are not. Rust actually achieves it: <code>&amp;impl Trait</code> compiles away completely, and <code>&amp;dyn Trait</code> gives you dynamic dispatch only when you explicitly ask for it. The programmer makes the tradeoff decision, not the language.</blockquote>

<h3>Your Task</h3>
<p>Define a <code>Summary</code> trait and implement it for two types. Then write a generic function that uses trait bounds to work with any <code>Summary</code> type — knowing that the compiler will generate specialized code for each concrete type used.</p>
`,
    starterCode: `// Traits: Zero-Cost Polymorphism
//
// C++ virtual functions: abstraction WITH overhead.
// Rust traits + generics: abstraction WITHOUT overhead.
// The compiler monomorphizes — you get specialized code for free.

/// A trait for types that can summarize themselves.
/// This is like a Haskell typeclass or a C++ abstract base class,
/// but with ZERO runtime dispatch cost when used with generics.
trait Summary {
    fn headline(&self) -> String;
    fn word_count(&self) -> usize;

    /// Default method — implementors get this for free.
    fn preview(&self) -> String {
        let h = self.headline();
        format!("{} ({} words)", h, self.word_count())
    }
}

struct Article {
    title: String,
    body: String,
}

struct Tweet {
    author: String,
    content: String,
}

/// Implement Summary for Article.
/// headline: the title
/// word_count: number of whitespace-separated words in body
impl Summary for Article {
    fn headline(&self) -> String {
        todo!("return the title")
    }
    fn word_count(&self) -> usize {
        todo!("count words in body")
    }
}

/// Implement Summary for Tweet.
/// headline: "@{author}: {content}" (truncated to 50 chars)
/// word_count: words in content
impl Summary for Tweet {
    fn headline(&self) -> String {
        todo!("return @author: content, truncated to 50 chars")
    }
    fn word_count(&self) -> usize {
        todo!("count words in content")
    }
}

/// Generic function: returns the preview of whichever item has more words.
/// If equal, returns the first item's preview.
/// This compiles to SEPARATE specialized functions for each type pair.
fn longer_preview<T: Summary, U: Summary>(a: &T, b: &U) -> String {
    todo!("compare word counts, return preview of the one with more words")
}
`,
    solutionCode: `// Traits: Zero-Cost Polymorphism

trait Summary {
    fn headline(&self) -> String;
    fn word_count(&self) -> usize;

    fn preview(&self) -> String {
        let h = self.headline();
        format!("{} ({} words)", h, self.word_count())
    }
}

struct Article {
    title: String,
    body: String,
}

struct Tweet {
    author: String,
    content: String,
}

impl Summary for Article {
    fn headline(&self) -> String {
        self.title.clone()
    }
    fn word_count(&self) -> usize {
        self.body.split_whitespace().count()
    }
}

impl Summary for Tweet {
    fn headline(&self) -> String {
        let full = format!("@{}: {}", self.author, self.content);
        if full.len() > 50 {
            format!("{}...", &full[..47])
        } else {
            full
        }
    }
    fn word_count(&self) -> usize {
        self.content.split_whitespace().count()
    }
}

fn longer_preview<T: Summary, U: Summary>(a: &T, b: &U) -> String {
    if a.word_count() >= b.word_count() {
        a.preview()
    } else {
        b.preview()
    }
}
`,
    testCode: `let art = Article { title: String::from("Rust is Great"), body: String::from("Rust provides memory safety without garbage collection using ownership") };
    assert_test_eq("article headline", String::from("Rust is Great"), art.headline());
    assert_test_eq("article word_count", 9usize, art.word_count());
    let tw = Tweet { author: String::from("ferris"), content: String::from("hello world from rust") };
    assert_test_eq("tweet headline", String::from("@ferris: hello world from rust"), tw.headline());
    assert_test_eq("tweet word_count", 4usize, tw.word_count());
    assert_test_eq("article preview", String::from("Rust is Great (9 words)"), art.preview());
    let result = longer_preview(&art, &tw);
    assert_test_eq("longer preview picks article", String::from("Rust is Great (9 words)"), result);`,
    hints: [
      'For <code>Article::headline</code>, use <code>self.title.clone()</code> to return an owned copy.',
      'For <code>Tweet::headline</code>, build the full string with <code>format!("@{}: {}", ...)</code>, then check <code>full.len() > 50</code>. If so, take <code>&amp;full[..47]</code> and append <code>"..."</code>.',
      'For <code>word_count</code>, use <code>split_whitespace().count()</code> on the relevant field.',
      'For <code>longer_preview</code>, compare <code>a.word_count()</code> with <code>b.word_count()</code> and call <code>.preview()</code> on the winner. The <code>preview</code> method is provided by the default implementation in the trait.',
    ],
    concepts: ['traits', 'static dispatch', 'monomorphization', 'zero-cost abstraction', 'default methods'],
    successPatterns: [
      'split_whitespace\\(\\)\\.count\\(\\)',
      'a\\.word_count\\(\\).*>=.*b\\.word_count\\(\\)',
      'format!\\("@',
    ],
    testNames: [
      'Article headline returns the title',
      'Article word_count counts body words',
      'Tweet headline formats correctly',
      'Tweet word_count counts content words',
      'Article preview includes word count',
      'longer_preview picks the item with more words',
      'longer_preview returns first on tie',
    ],
  },

  'rust-generics-monomorphization': {
    id: 'rust-generics-monomorphization',
    language: 'rust',
    title: 'Generics & Monomorphization: Code the Compiler Writes',
    difficulty: 'intermediate',
    order: 2,
    description: `
<h3>The Real Problem: Generics That Cost Performance</h3>

<p>Java generics use <strong>type erasure</strong> — at runtime, <code>List&lt;Integer&gt;</code> and <code>List&lt;String&gt;</code> are the same type. This means boxing, heap allocation, and virtual dispatch for every element:</p>

<pre><code>// Java — generics erase to Object at runtime
List&lt;Integer&gt; nums = new ArrayList&lt;&gt;();
nums.add(42);  // autoboxed: new Integer(42) allocated on heap
// At runtime: List&lt;Object&gt; with pointer indirection to each element</code></pre>

<p>Go (before generics) forced <code>interface{}</code> — runtime type assertions and zero compile-time safety. Even with Go generics, the implementation uses "GC shape stenciling" which is a compromise between full monomorphization and type erasure.</p>

<h3>Rust's Answer: Monomorphization</h3>

<p>When you write a generic function in Rust, the compiler generates <strong>completely separate, specialized code</strong> for each concrete type used. There is zero runtime dispatch, zero boxing, full inlining:</p>

<pre><code>fn largest&lt;T: PartialOrd&gt;(list: &amp;[T]) -> &amp;T {
    let mut largest = &amp;list[0];
    for item in &amp;list[1..] {
        if item > largest { largest = item; }
    }
    largest
}

// When you call:
largest(&amp;[1i32, 2, 3]);        // compiler generates: largest_i32
largest(&amp;["a", "b", "c"]);     // compiler generates: largest_str
// These are DIFFERENT functions with DIFFERENT machine code.
// No runtime dispatch. No boxing. Full inlining.</code></pre>

<h3>The Tradeoff</h3>

<p>Monomorphization increases binary size (one copy per type) but eliminates all runtime overhead. This is the right tradeoff for systems programming: you pay at compile time, not at runtime.</p>

<h3>The Taste Principle</h3>

<blockquote>"Abstraction should improve readability without hurting performance." Generic code in Rust is simultaneously more readable (single implementation) and equally performant (compiles to specialized code). This is not a compromise — it is strictly better on both axes. The compiler does the duplication work that a human would otherwise do by hand.</blockquote>

<h3>Your Task</h3>
<p>Implement generic functions and a generic struct. Each will be monomorphized — mentally trace what the compiler generates for each concrete type.</p>
`,
    starterCode: `// Generics & Monomorphization
//
// Each generic function compiles to SEPARATE specialized code.
// largest::<i32> and largest::<String> are DIFFERENT functions.

/// Returns a reference to the largest element in a non-empty slice.
/// The compiler generates a SEPARATE version of this function
/// for each concrete type T that you call it with.
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    todo!("iterate, track the largest element, return a reference to it")
}

/// Returns the (min, max) of a slice as owned values.
/// Requires Clone because we return owned copies, not references.
fn min_max<T: PartialOrd + Clone>(list: &[T]) -> (T, T) {
    todo!("find min and max, clone them, return as tuple")
}

/// A generic pair that holds two values of the same type.
/// Pair<i32> and Pair<String> are DIFFERENT types at the machine level.
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
    /// Returns a reference to the larger value.
    /// This impl block ONLY exists for types that support comparison.
    fn max(&self) -> &T {
        todo!("return reference to the larger of first and second")
    }
}

/// Counts how many elements in a slice equal the target.
/// Monomorphized: count_eq::<i32>, count_eq::<&str>, etc.
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
      'For <code>largest</code>, start with <code>&amp;list[0]</code> and iterate over <code>&amp;list[1..]</code>, comparing each item to the current largest.',
      'For <code>min_max</code>, you need <code>.clone()</code> to return owned values. Initialize both min and max from <code>list[0].clone()</code>.',
      'For <code>Pair::max</code>, compare <code>self.first</code> and <code>self.second</code> with <code>&gt;=</code>. Return a <em>reference</em> with <code>&amp;self.first</code> or <code>&amp;self.second</code>.',
      'For <code>count_eq</code>, use <code>list.iter().filter(|x| *x == target).count()</code>. The dereference is needed because <code>iter()</code> yields references.',
    ],
    concepts: ['generics', 'monomorphization', 'trait bounds', 'zero-cost abstraction', 'type-level code generation'],
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
    title: 'Iterators: Composition Without Overhead',
    difficulty: 'intermediate',
    order: 3,
    description: `
<h3>The Real Problem: Abstraction vs. Performance</h3>

<p>In most languages, composing operations (filter, map, collect) creates intermediate collections and incurs overhead. A Python list comprehension like <code>[x*x for x in range(1000000) if x % 2 == 0]</code> allocates a list of 500,000 elements. Chaining operations in Java streams has overhead from boxing and virtual dispatch.</p>

<p>This forces a painful choice: write readable, composed code (slow) or write hand-optimized loops (fast but harder to read and maintain).</p>

<h3>Rust's Answer: Zero-Cost Iterators</h3>

<p>Rust iterator chains compile to the <strong>exact same machine code</strong> as a hand-written loop. The compiler fuses the entire chain into a single pass — no intermediate collections, no heap allocations, no function call overhead:</p>

<pre><code>// These produce IDENTICAL machine code:

// Iterator chain (readable, composable)
let sum: i32 = (1..=1000000)
    .filter(|x| x % 2 == 0)
    .map(|x| x * x)
    .sum();

// Hand-written loop (fast but less composable)
let mut sum = 0i32;
for x in 1..=1000000 {
    if x % 2 == 0 {
        sum += x * x;
    }
}</code></pre>

<p>Rust achieves this through <strong>lazy evaluation</strong>. Calling <code>.filter()</code> or <code>.map()</code> does not process any elements — it creates a new iterator type that wraps the previous one. Processing only happens when you <em>consume</em> the chain (with <code>.sum()</code>, <code>.collect()</code>, etc.).</p>

<h3>Custom Iterators</h3>

<p>Any type that implements the <code>Iterator</code> trait gets dozens of combinator methods for free:</p>

<pre><code>trait Iterator {
    type Item;
    fn next(&amp;mut self) -> Option&lt;Self::Item&gt;;
    // filter, map, fold, zip, take, skip, enumerate... all FREE
}</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Composition without overhead — this is what zero-cost means." Iterator chains are the purest expression of Rust's zero-cost abstraction philosophy. You compose small, simple operations into complex transformations. The compiler fuses them into optimal machine code. You never choose between elegance and performance — you get both.</blockquote>

<h3>Your Task</h3>
<p>Write functions using iterator chains and implement a custom Fibonacci iterator. Every chain you write compiles to a single fused loop.</p>
`,
    starterCode: `// Iterators: Composition Without Overhead
//
// filter().map().sum() compiles to the SAME machine code as a hand-written loop.
// This is zero-cost abstraction in its purest form.

/// Returns the sum of squares of all even numbers from 1 to n (inclusive).
/// A single iterator chain — compiles to one tight loop.
fn sum_even_squares(n: u32) -> u32 {
    todo!("use (1..=n).filter().map().sum()")
}

/// Extracts words longer than min_len from text.
/// split -> filter -> map -> collect: zero intermediate allocations
/// except the final Vec.
fn long_words(text: &str, min_len: usize) -> Vec<String> {
    todo!("split_whitespace, filter by length, map to owned String, collect")
}

/// A Fibonacci iterator: 0, 1, 1, 2, 3, 5, 8, 13, ...
/// Implementing Iterator gives us .take(), .sum(), .zip(), etc. for FREE.
struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Self {
        todo!("initialize: a=0, b=1")
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        todo!("yield current value, advance state")
    }
}

/// Returns the sum of the first n Fibonacci numbers.
/// Uses .take(n).sum() — composition, zero overhead.
fn fib_sum(n: usize) -> u64 {
    todo!("Fibonacci::new().take(n).sum()")
}
`,
    solutionCode: `// Iterators: Composition Without Overhead

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
      'For <code>sum_even_squares</code>, chain: <code>(1..=n).filter(|x| x % 2 == 0).map(|x| x * x).sum()</code>. This becomes a single loop at the machine level.',
      'For <code>long_words</code>, use <code>text.split_whitespace().filter(|w| w.len() > min_len).map(|w| w.to_string()).collect()</code>.',
      'For the Fibonacci iterator, store <code>(a, b)</code>. On each <code>next()</code>, save <code>a</code> as current, update <code>(a, b)</code> to <code>(b, a+b)</code>, and return <code>Some(current)</code>.',
      'For <code>fib_sum</code>, use <code>Fibonacci::new().take(n).sum()</code>. The <code>take</code> and <code>sum</code> methods are provided free because <code>Fibonacci</code> implements <code>Iterator</code>.',
    ],
    concepts: ['iterators', 'lazy evaluation', 'iterator fusion', 'custom Iterator impl', 'zero-cost composition'],
    successPatterns: [
      'filter\\(\\|.*%\\s*2',
      'x \\* x',
      'self\\.a\\s*\\+\\s*self\\.b',
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
    title: 'Const Generics: Compile-Time Dimension Checking',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Real Problem: Runtime Dimension Mismatch</h3>

<p>Matrix dimension bugs are some of the most common errors in scientific computing and machine learning. In Python/NumPy, you only discover them at runtime:</p>

<pre><code># Python — runtime crash
import numpy as np
A = np.zeros((3, 4))  # 3x4 matrix
B = np.zeros((2, 3))  # 2x3 matrix
C = A @ B              # RuntimeError: shapes (3,4) and (2,3) not aligned
# This error happens at RUNTIME — possibly after hours of computation</code></pre>

<p>In C, it is even worse — there is no dimension checking at all:</p>

<pre><code>// C — silent corruption
double A[3][4], B[2][3], C[3][3];
// multiply(A, B, C, 3, 4, 3);  // wrong dimensions — no error
// just reads garbage memory and produces garbage results</code></pre>

<h3>Rust's Answer: Const Generics</h3>

<p>Const generics let you encode dimensions <strong>in the type system</strong>. A <code>Matrix&lt;3, 4&gt;</code> and a <code>Matrix&lt;2, 3&gt;</code> are different types. Multiplying them requires the inner dimensions to match — and the compiler checks this:</p>

<pre><code>struct Matrix&lt;const ROWS: usize, const COLS: usize&gt; {
    data: [[f64; COLS]; ROWS],
}

// Matrix&lt;M, N&gt; * Matrix&lt;N, P&gt; -> Matrix&lt;M, P&gt;
// If you try Matrix&lt;3,4&gt; * Matrix&lt;2,3&gt;, it's a COMPILE ERROR
// because 4 != 2 (the inner dimension N doesn't match).</code></pre>

<p>The dimension is part of the TYPE. Wrong dimensions are not a runtime error — they are a <em>type error</em> caught during compilation.</p>

<h3>The Taste Principle</h3>

<blockquote>"Move bugs from runtime to compile time." This is the deeper version of Wadler's "theorems for free" — when information is encoded in types, the compiler can verify invariants that no amount of testing would catch. A test suite checks specific dimensions; the type system checks <em>all possible</em> dimensions. Every bug you move from runtime to compile time is a bug that can never reach production.</blockquote>

<h3>Your Task</h3>
<p>Implement a <code>Matrix</code> type with const generic dimensions. Element-wise addition requires the same dimensions (enforced by the type system). Implement a dot product for fixed-size vectors.</p>
`,
    starterCode: `// Const Generics: Compile-Time Dimension Checking
//
// Matrix<3,4> and Matrix<2,3> are DIFFERENT TYPES.
// You cannot add them — the compiler rejects it.
// You cannot multiply them with wrong inner dimensions — type error.

/// A fixed-size matrix with compile-time dimensions.
/// Matrix<2,3> has a DIFFERENT TYPE than Matrix<3,2>.
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
        todo!("return self.data[row][col]")
    }

    /// Element-wise addition. BOTH matrices must have the same dimensions.
    /// This is enforced by the type system — no runtime check needed.
    fn add(&self, other: &Matrix<ROWS, COLS>) -> Matrix<ROWS, COLS> {
        todo!("add corresponding elements")
    }

    /// Scales every element by a scalar value.
    fn scale(&self, scalar: f64) -> Matrix<ROWS, COLS> {
        todo!("multiply every element by scalar")
    }
}

/// Dot product of two fixed-size vectors (as arrays).
/// The dimensions MUST match — enforced at compile time by const N.
fn dot<const N: usize>(a: &[f64; N], b: &[f64; N]) -> f64 {
    todo!("compute sum of a[i] * b[i]")
}

/// Sum all elements in a fixed-size array.
fn array_sum<const N: usize>(arr: &[f64; N]) -> f64 {
    todo!("sum all elements")
}
`,
    solutionCode: `// Const Generics: Compile-Time Dimension Checking

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

    fn scale(&self, scalar: f64) -> Matrix<ROWS, COLS> {
        let mut result = Self::zeros();
        for r in 0..ROWS {
            for c in 0..COLS {
                result.data[r][c] = self.data[r][c] * scalar;
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
    let scaled = m1.scale(2.0);
    assert_test_eq("scale 0,0", 2.0f64, scaled.get(0, 0));
    assert_test_eq("scale 1,1", 8.0f64, scaled.get(1, 1));
    assert_test_eq("dot product", 32.0f64, dot(&[1.0, 2.0, 3.0], &[4.0, 5.0, 6.0]));
    assert_test_eq("array_sum", 10.0f64, array_sum(&[1.0, 2.0, 3.0, 4.0]));`,
    hints: [
      'For <code>zeros</code>, use <code>[[0.0; COLS]; ROWS]</code>. The const generics <code>COLS</code> and <code>ROWS</code> are available as compile-time constants.',
      'For <code>add</code>, create a zero matrix and iterate over all <code>ROWS</code> and <code>COLS</code>, adding corresponding elements.',
      'For <code>scale</code>, same pattern as <code>add</code> but multiply each element by the scalar.',
      'For <code>dot</code>, iterate from <code>0..N</code>, accumulating <code>a[i] * b[i]</code>. The constraint that both arrays have length N is enforced by the type signature.',
    ],
    concepts: ['const generics', 'compile-time dimension checking', 'type-level integers', 'zero-cost abstraction', 'moving bugs to compile time'],
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
      'Matrix scale multiplies (0,0) correctly',
      'Matrix scale multiplies (1,1) correctly',
      'dot product computes correctly',
      'array_sum sums all elements',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Module 3: Unsafe & Soundness — "Controlled danger"
  // ─────────────────────────────────────────────────────────

  'rust-raw-pointers': {
    id: 'rust-raw-pointers',
    language: 'rust',
    title: 'Raw Pointers: The Philosophy of Controlled Danger',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Philosophy: Safe by Default, Unsafe by Choice</h3>

<p>Most languages make a binary choice: everything is safe (Java, Python — with GC overhead) or everything is manual (C, C++ — with undefined behavior everywhere). Rust makes a <em>third</em> choice: safe by default, with <strong>surgical, auditable</strong> escape hatches.</p>

<p>In C, every pointer operation is implicitly unsafe. There is no distinction between "I checked this" and "I forgot to check this":</p>

<pre><code>// C — EVERY pointer operation is implicitly unsafe
void process(int* data, size_t len) {
    for (size_t i = 0; i &lt;= len; i++) {  // off-by-one: &lt;= instead of &lt;
        data[i] *= 2;  // buffer overflow on last iteration
                       // no compiler warning, no runtime error
                       // just silent memory corruption
    }
}</code></pre>

<h3>Rust's Raw Pointers</h3>

<p>Rust has <code>*const T</code> (immutable) and <code>*mut T</code> (mutable) raw pointers. Creating them is safe. <strong>Dereferencing them requires <code>unsafe</code></strong>:</p>

<pre><code>let x = 42;
let r: *const i32 = &amp;x;          // safe: creating a raw pointer
let val = unsafe { *r };          // unsafe: dereferencing it

// The unsafe block is a CONTRACT: "I, the programmer, have verified
// that this pointer is valid, aligned, and not aliased."</code></pre>

<h3>Why Some Operations Need Raw Pointers</h3>

<p>Certain patterns are impossible with Rust's safe references:</p>
<ul>
  <li>Creating two mutable references to different parts of a slice (split_at_mut)</li>
  <li>Implementing self-referential data structures (linked lists, graphs)</li>
  <li>Interfacing with C libraries (FFI)</li>
  <li>Memory-mapped I/O and hardware registers</li>
</ul>

<h3>The Taste Principle</h3>

<blockquote>"Minimize the trusted computing base." In C, the entire program is the trusted computing base — any line could contain undefined behavior. In Rust, only the <code>unsafe</code> blocks can cause UB. A 100,000-line Rust program might have 200 lines of unsafe code. Code review effort focuses there. Security audits focus there. Fuzzing focuses there. This is the systems programming equivalent of Lampson's principle: keep the dangerous parts small and well-reviewed.</blockquote>

<h3>Your Task</h3>
<p>Implement functions that use raw pointers. Keep the <code>unsafe</code> blocks as small as possible — the safe code around them establishes the invariants that make the unsafe operations correct.</p>
`,
    starterCode: `// Raw Pointers: The Philosophy of Controlled Danger
//
// In C, every pointer operation is implicitly unsafe.
// In Rust, you mark the dangerous parts explicitly.
// The unsafe block says: "I verified this is correct."

/// Swaps the values at two mutable raw pointers.
/// Safety: both pointers must be valid, non-null, and non-overlapping.
unsafe fn swap_raw(a: *mut i32, b: *mut i32) {
    todo!("swap the values at a and b using a temporary")
}

/// Reads a value through a const raw pointer.
/// Safety: ptr must be valid and point to initialized memory.
unsafe fn read_ptr(ptr: *const i32) -> i32 {
    todo!("dereference and return the value")
}

/// Writes a value through a mutable raw pointer.
/// Safety: ptr must be valid and properly aligned.
unsafe fn write_ptr(ptr: *mut i32, val: i32) {
    todo!("write val through the pointer")
}

/// Sums elements in a slice using raw pointer arithmetic.
/// This function is SAFE — all unsafe is properly encapsulated.
/// The safe interface guarantees the pointer is valid for the slice's length.
fn sum_via_pointers(slice: &[i32]) -> i32 {
    todo!("get raw pointer from slice, iterate with ptr.add(i), sum values")
}

/// Compares two slices element-by-element via raw pointers.
/// Returns true if all elements are equal. Safe interface.
fn slices_equal(a: &[i32], b: &[i32]) -> bool {
    todo!("check lengths, then compare via raw pointers")
}
`,
    solutionCode: `// Raw Pointers: The Philosophy of Controlled Danger

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
      'For <code>swap_raw</code>, save <code>*a</code> to a temp, write <code>*b</code> to <code>*a</code>, write temp to <code>*b</code>. All dereferences must be inside the <code>unsafe fn</code>.',
      'For <code>read_ptr</code> and <code>write_ptr</code>, simply dereference: <code>*ptr</code> to read, <code>*ptr = val</code> to write.',
      'Use <code>slice.as_ptr()</code> to get a <code>*const i32</code>. Use <code>ptr.add(i)</code> for pointer arithmetic — this is bounds-safe because you limit <code>i</code> to <code>slice.len()</code>.',
      'For <code>slices_equal</code>, first check lengths (this is the safe invariant that makes the pointer arithmetic valid), then compare element by element.',
    ],
    concepts: ['raw pointers', 'unsafe blocks', 'pointer arithmetic', 'trusted computing base', 'safe wrappers'],
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
    title: 'Unsafe Blocks: Safe APIs from Unsafe Foundations',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Real Skill: Wrapping Unsafe in Safe Abstractions</h3>

<p>The most important pattern in systems Rust is not <em>using</em> unsafe — it is <strong>hiding</strong> it. The standard library's <code>Vec</code>, <code>HashMap</code>, <code>String</code>, <code>Mutex</code>, and <code>Arc</code> all use unsafe internally. Their users never see it. The unsafe code is encapsulated behind a safe API that <em>upholds the invariants</em>.</p>

<p>Consider <code>split_at_mut</code> — a function that returns two non-overlapping mutable slices from one source slice. This is impossible with safe references (the borrow checker sees two <code>&amp;mut</code> to the same data), but it is perfectly safe because the slices do not overlap:</p>

<pre><code>// This is how the standard library implements it:
pub fn split_at_mut(slice: &amp;mut [i32], mid: usize) -> (&amp;mut [i32], &amp;mut [i32]) {
    assert!(mid &lt;= slice.len());  // safe invariant: mid is in bounds
    let ptr = slice.as_mut_ptr();
    unsafe {
        // SOUND: the two slices do not overlap because
        // [0..mid) and [mid..len) are disjoint ranges
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), slice.len() - mid),
        )
    }
}</code></pre>

<p>The <code>assert!</code> on line 2 is crucial — it establishes the invariant that the unsafe code relies on. Without it, the function would be <em>unsound</em>.</p>

<h3>The Five Unsafe Superpowers</h3>

<ol>
  <li>Dereference raw pointers</li>
  <li>Call unsafe functions</li>
  <li>Access mutable static variables</li>
  <li>Implement unsafe traits</li>
  <li>Access union fields</li>
</ol>

<p>Everything else in an <code>unsafe</code> block is still checked by the compiler. Unsafe does not turn off the borrow checker — it just unlocks these five additional capabilities.</p>

<h3>The Taste Principle</h3>

<blockquote>"Safe APIs built on unsafe foundations — like operating systems providing process isolation." The OS kernel runs in privileged mode and can corrupt any memory. But it exposes <em>safe system calls</em> to userspace. A buggy user program cannot corrupt the kernel. Similarly, unsafe Rust code is the "kernel" of a data structure — small, carefully reviewed, hidden behind a safe API that prevents misuse.</blockquote>

<h3>Your Task</h3>
<p>Implement <code>split_at_mut</code> yourself using raw pointers. Then implement safe wrappers around other unsafe operations, keeping the unsafe blocks minimal.</p>
`,
    starterCode: `// Unsafe Blocks: Safe APIs from Unsafe Foundations
//
// The standard library's Vec, HashMap, String all use unsafe internally.
// Their users never see it. That's the pattern you're learning here.

static mut CALL_COUNT: u64 = 0;

/// Increments the global call counter and returns the new value.
/// Mutable statics require unsafe because Rust cannot guarantee
/// thread safety for global mutable state.
fn increment_counter() -> u64 {
    todo!("unsafe block: increment CALL_COUNT, return new value")
}

/// Returns the current call count.
fn get_counter() -> u64 {
    todo!("unsafe block: read CALL_COUNT")
}

/// Resets the call counter to 0.
fn reset_counter() {
    todo!("unsafe block: set CALL_COUNT = 0")
}

/// Splits a mutable slice into two non-overlapping mutable halves.
/// This is THE canonical example of safe API wrapping unsafe code.
///
/// The assert! establishes the invariant. The unsafe code relies on it.
/// Remove the assert and the function becomes UNSOUND.
fn split_at_mut_manual(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    todo!("assert mid <= len, then use raw pointers + from_raw_parts_mut")
}

/// Returns the first element of a non-empty slice via raw pointer.
/// Safe function — the unsafe is encapsulated.
fn first_element(data: &[i32]) -> i32 {
    todo!("get raw pointer with as_ptr(), dereference in minimal unsafe block")
}
`,
    solutionCode: `// Unsafe Blocks: Safe APIs from Unsafe Foundations

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

fn first_element(data: &[i32]) -> i32 {
    let ptr = data.as_ptr();
    unsafe { *ptr }
}
`,
    testCode: `reset_counter();
    assert_test_eq("counter starts at 0", 0u64, get_counter());
    assert_test_eq("increment returns 1", 1u64, increment_counter());
    assert_test_eq("increment returns 2", 2u64, increment_counter());
    assert_test_eq("get_counter is 2", 2u64, get_counter());
    reset_counter();
    assert_test_eq("reset works", 0u64, get_counter());
    let mut data = vec![1, 2, 3, 4, 5];
    let (left, right) = split_at_mut_manual(&mut data, 2);
    assert_test_eq("split left len", 2usize, left.len());
    assert_test_eq("split right len", 3usize, right.len());
    assert_test_eq("split left[0]", 1i32, left[0]);
    assert_test_eq("split right[0]", 3i32, right[0]);
    assert_test_eq("first_element", 42i32, first_element(&[42, 1, 2]));`,
    hints: [
      'For <code>increment_counter</code>, wrap both the increment and the read in a single <code>unsafe { CALL_COUNT += 1; CALL_COUNT }</code> block.',
      'For <code>split_at_mut_manual</code>, first <code>assert!(mid &lt;= slice.len())</code>. Then use <code>slice.as_mut_ptr()</code> and <code>std::slice::from_raw_parts_mut</code> to create two non-overlapping slices.',
      'For <code>first_element</code>, use <code>data.as_ptr()</code> outside the unsafe block, then <code>unsafe { *ptr }</code> to dereference. Keep the unsafe block as small as possible.',
      'The <code>assert!</code> in <code>split_at_mut_manual</code> is not optional — it is the safe invariant that makes the unsafe code <em>sound</em>.',
    ],
    concepts: ['unsafe blocks', 'safe wrappers', 'split_at_mut', 'mutable statics', 'minimal unsafe'],
    successPatterns: [
      'from_raw_parts_mut',
      'as_mut_ptr',
      'unsafe \\{',
    ],
    testNames: [
      'Counter starts at 0 after reset',
      'First increment returns 1',
      'Second increment returns 2',
      'get_counter reads correct value',
      'reset_counter resets to 0',
      'split_at_mut left has correct length',
      'split_at_mut right has correct length',
      'split_at_mut left starts correctly',
      'split_at_mut right starts correctly',
      'first_element reads via raw pointer',
    ],
  },

  'rust-soundness': {
    id: 'rust-soundness',
    language: 'rust',
    title: 'Soundness: The Hardest Concept in Systems Programming',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>What Is Soundness?</h3>

<p>A function is <strong>sound</strong> if <em>no sequence of safe calls</em> can cause undefined behavior through it. A function is <strong>unsound</strong> if safe code can trigger UB by calling it with valid arguments.</p>

<p>This is the deepest concept in Rust's safety model. It is the property that separates "code that works today" from "code that is <em>correct</em>."</p>

<h3>Sound vs. Unsound: A Critical Distinction</h3>

<pre><code>// SOUND: safe wrapper that checks ALL invariants before entering unsafe
fn get_two_mut(slice: &amp;mut [i32], i: usize, j: usize) -> Option&lt;(&amp;mut i32, &amp;mut i32)&gt; {
    if i == j || i >= slice.len() || j >= slice.len() {
        return None;  // reject ALL invalid inputs before unsafe
    }
    let ptr = slice.as_mut_ptr();
    unsafe { Some((&amp;mut *ptr.add(i), &amp;mut *ptr.add(j))) }
}

// UNSOUND: looks safe, but safe callers can trigger UB
fn get_two_mut_bad(slice: &amp;mut [i32], i: usize, j: usize) -> (&amp;mut i32, &amp;mut i32) {
    let ptr = slice.as_mut_ptr();
    unsafe { (&amp;mut *ptr.add(i), &amp;mut *ptr.add(j)) }
    // If i == j, this creates two &amp;mut to the same location — UNDEFINED BEHAVIOR
    // If i >= len, this reads out of bounds — UNDEFINED BEHAVIOR
    // Safe code can trigger both by passing valid-looking arguments
}</code></pre>

<p>The unsound version <em>compiles</em>. It <em>runs</em>. It produces correct results most of the time. But it is broken — a safe caller with <code>i == j</code> triggers UB. The bug is not in the caller; it is in the function that failed to uphold its invariants.</p>

<h3>The Soundness Checklist</h3>

<ol>
  <li>Can any combination of <em>safe</em> input values cause UB?</li>
  <li>Are all indices checked before pointer arithmetic?</li>
  <li>Are aliasing rules maintained? (No two <code>&amp;mut</code> to the same data)</li>
  <li>Is all pointed-to memory valid and initialized?</li>
</ol>

<h3>The Taste Principle</h3>

<blockquote>"Keep the dangerous parts small and well-reviewed." — Butler Lampson. Soundness is the contract between unsafe code and its callers. The unsafe code says: "if you give me valid inputs, I will not cause UB." The safe wrapper says: "I will only give you valid inputs." When both parties uphold their contract, the entire system is safe. When either fails, you have a soundness hole — the worst kind of bug, because it is invisible to the compiler and to tests.</blockquote>

<h3>Your Task</h3>
<p>Implement sound wrappers around unsafe operations. Every function must validate its inputs before entering unsafe code.</p>
`,
    starterCode: `// Soundness: The Hardest Concept in Systems Programming
//
// Sound = safe callers CANNOT cause undefined behavior.
// Unsound = safe callers CAN cause undefined behavior.
// Your job: make EVERY function here sound.

/// Safely gets mutable references to two DIFFERENT indices.
/// Returns None if indices are equal or out of bounds.
///
/// WHY THIS IS HARD: creating two &mut to the same data is instant UB.
/// The safe checks before unsafe are what make this SOUND.
fn get_two_mut(slice: &mut [i32], i: usize, j: usize) -> Option<(&mut i32, &mut i32)> {
    todo!("validate i != j and both in bounds, then use raw pointers")
}

/// Safely converts a &[u8] of exactly 4 bytes into an i32 (little-endian).
/// Returns None if the slice is not exactly 4 bytes.
///
/// SOUNDNESS: we check the length before interpreting the bytes.
/// Without the check, short slices would read uninitialized memory.
fn bytes_to_i32(bytes: &[u8]) -> Option<i32> {
    todo!("check length == 4, then convert using from_le_bytes")
}

/// Safely reads a u32 from a byte slice at the given offset.
/// Returns None if offset + 4 exceeds the slice length.
fn read_u32_at(data: &[u8], offset: usize) -> Option<u32> {
    todo!("check bounds, then extract 4 bytes and convert")
}

/// Splits a mutable slice at a given midpoint.
/// Panics if mid > len (this is the standard library's behavior).
/// SOUND because the assert prevents out-of-bounds pointer arithmetic.
fn safe_split_at(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    todo!("assert mid <= len, then use from_raw_parts_mut")
}
`,
    solutionCode: `// Soundness: The Hardest Concept in Systems Programming

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

fn read_u32_at(data: &[u8], offset: usize) -> Option<u32> {
    if offset + 4 > data.len() {
        return None;
    }
    Some(u32::from_le_bytes([
        data[offset], data[offset + 1], data[offset + 2], data[offset + 3]
    ]))
}

fn safe_split_at(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
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
`,
    testCode: `let mut arr = vec![10, 20, 30];
    let result = get_two_mut(&mut arr, 0, 2);
    assert_test("get_two_mut valid", result.is_some());
    let mut arr2 = vec![10, 20, 30];
    assert_test("get_two_mut same index", get_two_mut(&mut arr2, 1, 1).is_none());
    let mut arr3 = vec![10, 20];
    assert_test("get_two_mut out of bounds", get_two_mut(&mut arr3, 0, 5).is_none());
    assert_test_eq("bytes_to_i32 valid", Some(1i32), bytes_to_i32(&[1, 0, 0, 0]));
    assert_test("bytes_to_i32 wrong len", bytes_to_i32(&[1, 2]).is_none());
    assert_test_eq("read_u32_at valid", Some(1u32), read_u32_at(&[1, 0, 0, 0, 99], 0));
    assert_test("read_u32_at overflow", read_u32_at(&[1, 2, 3], 0).is_none());
    let mut data = vec![1, 2, 3, 4, 5];
    let (left, right) = safe_split_at(&mut data, 2);
    assert_test_eq("split left len", 2usize, left.len());
    assert_test_eq("split right[0]", 3i32, right[0]);`,
    hints: [
      'For <code>get_two_mut</code>, check THREE things before unsafe: <code>i != j</code>, <code>i < slice.len()</code>, <code>j < slice.len()</code>. Missing any check makes the function <em>unsound</em>.',
      'For <code>bytes_to_i32</code>, use <code>i32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]])</code>. No unsafe needed — but the length check is essential for soundness.',
      'For <code>read_u32_at</code>, check <code>offset + 4 <= data.len()</code> to prevent out-of-bounds reads.',
      'For <code>safe_split_at</code>, the <code>assert!</code> on mid is what makes the subsequent raw pointer arithmetic sound. Without it, <code>ptr.add(mid)</code> could go past the allocation.',
    ],
    concepts: ['soundness', 'undefined behavior', 'invariant checking', 'safe wrappers', 'aliasing rules'],
    successPatterns: [
      'i == j',
      'from_le_bytes',
      'from_raw_parts_mut',
    ],
    testNames: [
      'get_two_mut returns Some for valid distinct indices',
      'get_two_mut returns None for same index',
      'get_two_mut returns None for out-of-bounds index',
      'bytes_to_i32 converts valid bytes correctly',
      'bytes_to_i32 returns None for wrong length',
      'read_u32_at reads at valid offset',
      'read_u32_at returns None when offset overflows',
      'safe_split_at splits correctly',
      'safe_split_at right side starts at mid',
    ],
  },

  'rust-safe-abstractions': {
    id: 'rust-safe-abstractions',
    language: 'rust',
    title: 'Safe Abstractions: The Invisible Unsafe',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Capstone: Building a Vec from Scratch</h3>

<p>Every <code>Vec&lt;T&gt;</code> you have ever used in Rust is built on unsafe code. Raw pointer allocation, manual memory management, unchecked indexing — it is all there, inside the standard library. But as a <em>user</em> of Vec, you have never seen it. You cannot cause undefined behavior through its API. This is the gold standard of systems programming.</p>

<p>Compare with C++ <code>std::vector</code>:</p>

<pre><code>// C++ — the API itself is unsafe
std::vector&lt;int&gt; v = {1, 2, 3};
int&amp; ref = v[0];          // reference to element
v.push_back(4);            // may reallocate — ref is now DANGLING
std::cout &lt;&lt; ref;         // UNDEFINED BEHAVIOR — no compiler warning</code></pre>

<p>C++ <code>vector</code> exposes unsafe operations through a "safe-looking" API. Rust's <code>Vec</code> genuinely cannot be misused through safe code — iterator invalidation, use-after-free, double-free, buffer overflows are all structurally impossible.</p>

<h3>The Pattern at Scale</h3>

<p>This pattern — unsafe internals, safe boundary — scales to entire systems:</p>

<ul>
  <li><strong>OS kernels</strong>: privileged code (kernel) with safe syscall interface (userspace)</li>
  <li><strong>Databases</strong>: unsafe file I/O and memory mapping, safe SQL interface</li>
  <li><strong>Compilers</strong>: unsafe pointer manipulation internally, safe AST operations externally</li>
</ul>

<h3>The Taste Principle</h3>

<blockquote>"The best unsafe code is invisible to its users." This is Parnas's information hiding applied to safety: the implementation detail that matters most (unsafe memory operations) is hidden behind a module boundary that prevents misuse. The user of your abstraction should not need to know — or care — that unsafe code exists inside it. If they need to think about safety, your abstraction has failed.</blockquote>

<h3>Your Task</h3>
<p>Implement a simple <code>SimpleVec</code> type with push, pop, get, and len. The internal implementation uses unsafe operations (via Vec internally for this exercise), but the public API is completely safe. No caller can cause undefined behavior.</p>
`,
    starterCode: `// Safe Abstractions: The Invisible Unsafe
//
// Vec, HashMap, String — all built on unsafe code.
// All impossible to misuse through their safe APIs.
// Build your own.

/// A simplified Vec-like type. In a real implementation, this would
/// use raw allocation (alloc::alloc) and manual capacity management.
/// We use Vec<i32> internally to focus on the API design pattern.
struct SimpleVec {
    data: Vec<i32>,
}

impl SimpleVec {
    /// Creates a new empty SimpleVec.
    fn new() -> Self {
        todo!("create with empty internal storage")
    }

    /// Appends a value. The caller does not need to think about
    /// capacity, reallocation, or pointer validity.
    fn push(&mut self, val: i32) {
        todo!("add val to internal storage")
    }

    /// Removes and returns the last value, or None if empty.
    /// Safe: cannot underflow, cannot access freed memory.
    fn pop(&mut self) -> Option<i32> {
        todo!("remove and return last element, or None")
    }

    /// Returns the element at index, or None if out of bounds.
    /// Safe: bounds-checked access, no buffer overflows possible.
    fn get(&self, index: usize) -> Option<i32> {
        todo!("return element at index if valid, None otherwise")
    }

    /// Returns the number of elements.
    fn len(&self) -> usize {
        todo!("return length")
    }

    /// Returns true if empty.
    fn is_empty(&self) -> bool {
        todo!("check if length is 0")
    }

    /// Maps a function over every element, returning a new SimpleVec.
    /// This is safe even though it constructs a new collection.
    fn map(&self, f: fn(i32) -> i32) -> SimpleVec {
        todo!("apply f to each element, collect into new SimpleVec")
    }

    /// Folds all elements into a single value using an accumulator.
    fn fold(&self, init: i32, f: fn(i32, i32) -> i32) -> i32 {
        todo!("fold elements with f, starting from init")
    }
}
`,
    solutionCode: `// Safe Abstractions: The Invisible Unsafe

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

    fn map(&self, f: fn(i32) -> i32) -> SimpleVec {
        SimpleVec {
            data: self.data.iter().map(|&x| f(x)).collect(),
        }
    }

    fn fold(&self, init: i32, f: fn(i32, i32) -> i32) -> i32 {
        self.data.iter().fold(init, |acc, &x| f(acc, x))
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
    let doubled = v.map(|x| x * 2);
    assert_test_eq("map get 0", Some(20i32), doubled.get(0));
    assert_test_eq("fold sum", 30i32, v.fold(0, |a, b| a + b));`,
    hints: [
      'For <code>new</code>, use <code>SimpleVec { data: Vec::new() }</code>.',
      'For <code>get</code>, use <code>self.data.get(index).copied()</code>. The <code>.copied()</code> converts <code>Option&lt;&amp;i32&gt;</code> to <code>Option&lt;i32&gt;</code>.',
      'For <code>map</code>, use <code>self.data.iter().map(|&amp;x| f(x)).collect()</code> to create a new Vec, then wrap it in SimpleVec.',
      'For <code>fold</code>, use <code>self.data.iter().fold(init, |acc, &amp;x| f(acc, x))</code>.',
    ],
    concepts: ['safe abstractions', 'encapsulated unsafe', 'API design', 'information hiding', 'Parnas principle'],
    successPatterns: [
      'SimpleVec',
      '\\.push\\(',
      '\\.get\\(index\\)\\.copied\\(\\)',
      '\\.iter\\(\\)\\.fold',
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
      'map doubles each element',
      'fold computes sum correctly',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Module 4: Cryptographic Rust — "Security as engineering discipline"
  // ─────────────────────────────────────────────────────────

  'rust-constant-time': {
    id: 'rust-constant-time',
    language: 'rust',
    title: 'Constant-Time Operations: Defeating Timing Attacks',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Real Attack: Timing Side Channels</h3>

<p>In 2003, researchers demonstrated that they could extract a complete AES key from a remote server by measuring response times with microsecond precision. The attack exploits a simple fact: <strong>naive comparison leaks information through timing</strong>.</p>

<pre><code>// VULNERABLE: early return leaks information
fn naive_eq(a: &amp;[u8], b: &amp;[u8]) -> bool {
    if a.len() != b.len() { return false; }
    for i in 0..a.len() {
        if a[i] != b[i] { return false; }  // EXITS EARLY
    }
    true
}

// If the correct password is "secret123":
// naive_eq("aXXXXXXXX", "secret123") -> fails at byte 0 (fast)
// naive_eq("sXXXXXXXX", "secret123") -> fails at byte 1 (slightly slower)
// naive_eq("seXXXXXXX", "secret123") -> fails at byte 2 (even slower)
// An attacker can guess one byte at a time by measuring response time!</code></pre>

<p>This is not theoretical. Timing attacks have been used against:</p>
<ul>
  <li>TLS/SSL implementations (Lucky 13, ROBOT attack)</li>
  <li>OAuth token verification</li>
  <li>Password hashing comparison</li>
  <li>Cryptocurrency wallet signatures</li>
</ul>

<h3>The Constant-Time Pattern</h3>

<p>The fix: <strong>always process every byte</strong>. Use XOR to detect differences and OR to accumulate them. No branches, no early returns:</p>

<pre><code>fn ct_eq(a: &amp;[u8], b: &amp;[u8]) -> bool {
    if a.len() != b.len() { return false; }
    let mut diff = 0u8;
    for i in 0..a.len() {
        diff |= a[i] ^ b[i];  // XOR: 0 if equal, non-zero if different
                                // OR: accumulates any difference
    }
    diff == 0  // true only if ALL bytes matched
}</code></pre>

<p><code>a[i] ^ b[i]</code> produces 0 if and only if the bytes are equal. The OR accumulation ensures <em>any</em> difference sets bits in <code>diff</code>. The final comparison happens <em>once</em>, after all bytes are processed.</p>

<h3>Branchless Selection</h3>

<p>Even a simple <code>if condition { a } else { b }</code> leaks information through timing (branch prediction). Constant-time selection uses bitwise operations:</p>

<pre><code>// mask is 0xFF if condition is true, 0x00 if false
let mask = (condition as u8).wrapping_neg();
let result = (mask &amp; a) | (!mask &amp; b);</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Security is a systems property, not a feature." You cannot "add" constant-time behavior to a system — it must be designed in from the start. Every branch is a potential information leak. Every early return is a timing oracle. This is why cryptographic code looks different from normal code: it is optimizing for a fundamentally different property (timing uniformity) rather than speed.</blockquote>

<h3>Your Task</h3>
<p>Implement constant-time comparison, branchless selection, XOR operations, and a zero-check — all without timing-dependent branches.</p>
`,
    starterCode: `// Constant-Time Operations: Defeating Timing Attacks
//
// Every branch is a potential timing leak.
// Cryptographic code must process ALL data regardless of content.

/// Constant-time equality: always processes every byte.
/// No early returns after the length check.
fn ct_eq(a: &[u8], b: &[u8]) -> bool {
    todo!("XOR each pair, OR accumulate, check final == 0")
}

/// Branchless select: returns a if condition is true, b if false.
/// Uses bitwise operations — no if/else branch.
fn ct_select(condition: bool, a: u8, b: u8) -> u8 {
    todo!("create mask from condition, use bitwise AND/OR to select")
}

/// XORs two equal-length byte slices. Panics if lengths differ.
fn xor_bytes(a: &[u8], b: &[u8]) -> Vec<u8> {
    todo!("XOR corresponding bytes into a new Vec")
}

/// Constant-time zero check: returns true if all bytes are zero.
/// Processes every byte — does not short-circuit on the first non-zero.
fn is_zero(data: &[u8]) -> bool {
    todo!("OR all bytes together, check if zero")
}
`,
    solutionCode: `// Constant-Time Operations: Defeating Timing Attacks

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
      'For <code>ct_eq</code>, use <code>diff |= a[i] ^ b[i]</code> in a loop. XOR yields 0 for equal bytes; OR accumulates any difference. Check <code>diff == 0</code> at the end.',
      'For <code>ct_select</code>, the trick is <code>(condition as u8).wrapping_neg()</code>: this converts <code>true</code> (1) to <code>0xFF</code> and <code>false</code> (0) to <code>0x00</code>. Then <code>(mask &amp; a) | (!mask &amp; b)</code> selects without branching.',
      'For <code>xor_bytes</code>, use <code>a.iter().zip(b.iter()).map(|(x, y)| x ^ y).collect()</code>.',
      'For <code>is_zero</code>, OR all bytes into an accumulator: <code>acc |= byte</code>. Check <code>acc == 0</code> at the end. Do not use <code>any()</code> — it short-circuits.',
    ],
    concepts: ['constant-time comparison', 'timing attacks', 'branchless selection', 'XOR accumulation', 'side-channel resistance'],
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
    title: 'Finite Field Arithmetic: Type-Safe Mathematics',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Real Problem: Unchecked Arithmetic in Cryptography</h3>

<p>Finite field arithmetic is the foundation of modern cryptography — elliptic curves, RSA, AES, and zero-knowledge proofs all depend on it. In C, implementing it is terrifying:</p>

<pre><code>// C — silent overflow destroys cryptographic properties
uint64_t field_mul(uint64_t a, uint64_t b, uint64_t p) {
    return (a * b) % p;  // WRONG: a * b overflows uint64_t silently
                         // result is (a * b) mod 2^64 mod p
                         // which is NOT (a * b) mod p
                         // every computation is subtly wrong
                         // and the system APPEARS to work
}

// This produced real vulnerabilities in OpenSSL (CVE-2014-3570)
// where incorrect field arithmetic led to weak signatures.</code></pre>

<p>The bug is invisible. The code compiles. The tests pass (for small inputs). The signatures verify (sometimes). The system is fundamentally broken.</p>

<h3>Rust's Answer: Overflow Checking and Strong Types</h3>

<p>Rust catches integer overflow in debug mode (panic) and provides explicit methods for wrapping/checked/saturating arithmetic. Combined with a type that encapsulates the prime modulus, the type system enforces mathematical invariants:</p>

<pre><code>// Rust: overflow is explicitly handled
fn field_mul(a: u64, b: u64, p: u64) -> u64 {
    // Cast to u128 to prevent overflow — intentional and explicit
    ((a as u128 * b as u128) % p as u128) as u64
}</code></pre>

<h3>Connection to Haskell</h3>

<p>If you completed the abstract algebra exercises in Haskell, this is the same algebraic structure (GF(p)) implemented in a systems language. The mathematical properties (closure, associativity, commutativity, identity, inverses) are identical. The implementation uses Rust's trait system instead of Haskell's typeclasses, and Rust gives you explicit control over overflow behavior.</p>

<h3>The Taste Principle</h3>

<blockquote>"Let the type system enforce mathematical invariants." A <code>FieldElement</code> type that always reduces mod p is not just convenient — it makes invalid states unrepresentable. You cannot accidentally use a non-reduced value because the type constructor enforces reduction. This is the same principle as Haskell's newtypes applied to systems programming: the wrapper costs nothing at runtime but prevents an entire class of bugs.</blockquote>

<h3>Your Task</h3>
<p>Implement <code>FieldElement</code> with addition, subtraction, multiplication, negation, exponentiation (by repeated squaring), and modular inverse (via Fermat's little theorem).</p>
`,
    starterCode: `// Finite Field Arithmetic: Type-Safe Mathematics
//
// In C, a * b overflows silently and destroys cryptographic properties.
// In Rust, overflow is explicit and the type system enforces reduction.

#[derive(Debug, Clone, Copy, PartialEq)]
struct FieldElement {
    value: u64,
    prime: u64,
}

impl FieldElement {
    /// Creates a new field element, reducing value mod prime.
    /// The constructor ENFORCES the invariant: value < prime.
    fn new(value: u64, prime: u64) -> Self {
        todo!("create with value % prime")
    }

    /// (a + b) mod p
    fn add(self, other: FieldElement) -> FieldElement {
        todo!("add and reduce")
    }

    /// (a - b + p) mod p — the +p prevents underflow
    fn sub(self, other: FieldElement) -> FieldElement {
        todo!("subtract with modular wraparound")
    }

    /// (a * b) mod p — MUST use u128 to prevent overflow
    fn mul(self, other: FieldElement) -> FieldElement {
        todo!("multiply using u128 intermediate, then reduce")
    }

    /// Additive inverse: p - a (mod p)
    fn neg(self) -> FieldElement {
        todo!("return the additive inverse")
    }

    /// Modular exponentiation: a^exp mod p (repeated squaring)
    /// This is O(log exp) — essential for practical cryptography.
    fn pow(self, mut exp: u64) -> FieldElement {
        todo!("square-and-multiply algorithm using u128")
    }

    /// Multiplicative inverse via Fermat's little theorem:
    /// a^(p-2) mod p = a^(-1) mod p (when p is prime)
    fn inv(self) -> FieldElement {
        todo!("self.pow(self.prime - 2)")
    }
}
`,
    solutionCode: `// Finite Field Arithmetic: Type-Safe Mathematics

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
      'For <code>new</code>, use <code>value % prime</code> to enforce the invariant that <code>value < prime</code>.',
      'For <code>sub</code>, use <code>(self.value + self.prime - other.value) % self.prime</code>. The <code>+ self.prime</code> prevents unsigned underflow.',
      'For <code>mul</code>, cast to <code>u128</code> before multiplying: <code>(self.value as u128 * other.value as u128) % self.prime as u128</code>. This is the key difference from the buggy C version.',
      'For <code>pow</code>, use repeated squaring: while exp > 0, if odd multiply result by base, square base, halve exp. Use <code>u128</code> throughout to prevent overflow.',
    ],
    concepts: ['finite fields', 'modular arithmetic', 'overflow prevention', 'Fermat little theorem', 'type-safe invariants'],
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
    title: 'EdDSA Signatures: Correct Algebra, No Clever Tricks',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>The Real System: Digital Signatures</h3>

<p>EdDSA (Edwards-curve Digital Signature Algorithm) secures SSH connections, TLS handshakes, and cryptocurrency transactions. When you <code>ssh</code> into a server with an Ed25519 key, this is the algorithm running underneath.</p>

<p>The full algorithm uses elliptic curve point arithmetic. Here we implement a simplified version using scalar arithmetic mod a prime — the algebraic structure is identical, and the same verification equation holds.</p>

<h3>How Signatures Work</h3>

<ol>
  <li><strong>Key generation</strong>: Choose secret key <code>sk</code>. Compute public key <code>pk = G^sk mod p</code>.</li>
  <li><strong>Signing</strong>: Choose random nonce <code>k</code>. Compute <code>r = G^k mod p</code>, compute challenge <code>e = hash(r, message)</code>, compute <code>s = (k - e * sk) mod p</code>.</li>
  <li><strong>Verification</strong>: Check that <code>G^s * pk^e mod p == r</code>.</li>
</ol>

<h3>Why Verification Works (The Algebra)</h3>

<pre><code>G^s * pk^e  mod p
= G^(k - e*sk) * (G^sk)^e  mod p
= G^(k - e*sk) * G^(e*sk)  mod p
= G^(k - e*sk + e*sk)      mod p
= G^k                      mod p
= r  ✓</code></pre>

<p>The verification equation is a direct consequence of the group structure. If any value is modified (message, signature, or public key), the equation fails. This is why signatures work: only someone who knows <code>sk</code> can produce an <code>s</code> that satisfies the verification equation.</p>

<h3>What Goes Wrong in Practice</h3>

<p>Most signature vulnerabilities are not about the algebra — they are about the <em>implementation</em>:</p>
<ul>
  <li><strong>Nonce reuse</strong>: If the same <code>k</code> is used for two different messages, the secret key can be extracted (this broke the PlayStation 3's ECDSA)</li>
  <li><strong>Weak random number generation</strong>: Predictable nonces reveal the secret key</li>
  <li><strong>Overflow bugs</strong>: The C bugs from the field arithmetic exercise apply here with cryptographic consequences</li>
</ul>

<h3>The Taste Principle</h3>

<blockquote>"Cryptographic code must be boring — no clever tricks, just correct algebra." The temptation in systems programming is to be clever: custom optimizations, tricky bit manipulations, non-obvious shortcuts. In cryptography, cleverness kills. The code should read like a direct transcription of the mathematical specification. Every deviation from the spec is a potential vulnerability. Boring, correct, and auditable beats clever and fragile.</blockquote>

<h3>Your Task</h3>
<p>Implement key generation, signing, and verification. Your code should read like the algebra above — no tricks, just correct modular arithmetic.</p>
`,
    starterCode: `// EdDSA Signatures: Correct Algebra, No Clever Tricks
//
// The code should READ like the math:
//   pk = G^sk mod p
//   r = G^k mod p
//   s = (k - e * sk) mod p
//   verify: G^s * pk^e mod p == r

const PRIME: u64 = 997;   // small prime for demonstration
const GEN: u64 = 5;       // generator of the multiplicative group

/// Modular exponentiation: base^exp mod modulus
/// Uses repeated squaring — O(log exp), not O(exp).
fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    todo!("repeated squaring with u128 intermediate")
}

/// Simple hash: combines two values into a field element.
/// In real EdDSA, this would be SHA-512.
fn simple_hash(r: u64, message: u64) -> u64 {
    todo!("return (r * 31 + message) % PRIME")
}

/// Key generation: pk = GEN^sk mod PRIME
fn generate_public_key(sk: u64) -> u64 {
    todo!("mod_pow(GEN, sk, PRIME)")
}

/// Signing: given secret key, message, and nonce k,
/// returns (r, s) where:
///   r = GEN^k mod PRIME
///   e = hash(r, message)
///   s = (k - e * sk) mod PRIME  (using large offset to avoid underflow)
fn sign(sk: u64, message: u64, k: u64) -> (u64, u64) {
    todo!("compute r, e, s as described above")
}

/// Verification: check that GEN^s * pk^e mod PRIME == r
fn verify(pk: u64, message: u64, r: u64, s: u64) -> bool {
    todo!("compute e, then check the verification equation")
}
`,
    solutionCode: `// EdDSA Signatures: Correct Algebra, No Clever Tricks

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
      'For <code>mod_pow</code>, use repeated squaring: while exp > 0, if odd multiply result by base (mod modulus), square base (mod modulus), halve exp. Cast to <code>u128</code> for intermediate products.',
      'For <code>simple_hash</code>, return <code>((r as u128 * 31 + message as u128) % PRIME as u128) as u64</code>.',
      'For <code>sign</code>, compute <code>s = (k + PRIME*1000 - e*sk) % PRIME</code>. The <code>PRIME*1000</code> prevents unsigned underflow while preserving the modular result.',
      'For <code>verify</code>, compute <code>e = simple_hash(r, message)</code>, then check <code>(mod_pow(GEN, s, PRIME) * mod_pow(pk, e, PRIME)) % PRIME == r</code>.',
    ],
    concepts: ['digital signatures', 'EdDSA', 'modular exponentiation', 'verification equation', 'nonce security'],
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
    title: 'Hash Functions: Simple Algorithms, Deep Properties',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Real Problem: What Makes a Good Hash Function?</h3>

<p>A hash function maps arbitrary input to a fixed-size output. This sounds simple, but the <em>properties</em> a hash function must satisfy are deep and non-obvious:</p>

<ul>
  <li><strong>Deterministic</strong>: Same input always produces same output</li>
  <li><strong>Avalanche effect</strong>: Changing one input bit should change ~50% of output bits</li>
  <li><strong>Uniform distribution</strong>: Outputs should be spread evenly across the range</li>
  <li><strong>Collision resistance</strong>: It should be hard to find two inputs with the same output</li>
</ul>

<p>A bad hash function can turn an O(1) hash table into an O(n) linked list. In 2011, researchers demonstrated "HashDoS" attacks that crashed web servers by crafting inputs that all hash to the same bucket.</p>

<h3>FNV-1a: Elegant Simplicity</h3>

<p>FNV-1a (Fowler-Noll-Vo) achieves good distribution with just two operations per byte — XOR and multiply:</p>

<pre><code>hash = FNV_OFFSET_BASIS       // 14695981039346656037 (64-bit)
for each byte in input:
    hash = hash XOR byte       // mix the byte in
    hash = hash * FNV_PRIME    // diffuse the bits</code></pre>

<p>The XOR mixes input bits into the hash. The multiplication diffuses them — a change in any input bit cascades through the entire hash value. Two operations, repeated. No lookup tables, no complex state management.</p>

<h3>Measuring Hash Quality: Hamming Distance</h3>

<p>The <strong>avalanche effect</strong> is measured by the Hamming distance between hashes of similar inputs. For a good hash function, changing one input byte should flip approximately half of the output bits (~32 out of 64).</p>

<h3>Bloom Filters: Hashing in Practice</h3>

<p>A Bloom filter uses multiple hash functions to test set membership in constant time with compact memory. It can have false positives (says "maybe in set" when not) but <em>never</em> false negatives (if it says "not in set," it is definitely not). Used in databases, network routing, and spell checkers.</p>

<h3>The Taste Principle</h3>

<blockquote>"Simple algorithms with deep properties — elegance is doing much with little." FNV-1a is two operations per byte. Yet it produces excellent distribution, good avalanche behavior, and is fast enough for hash tables. The best systems code is like this: simple enough to verify by inspection, yet powerful enough to serve in production. Complexity is a cost, not a feature.</blockquote>

<h3>Your Task</h3>
<p>Implement FNV-1a hashing, Hamming distance measurement, and a Bloom filter. Notice how much functionality emerges from simple primitives.</p>
`,
    starterCode: `// Hash Functions: Simple Algorithms, Deep Properties
//
// FNV-1a: two operations per byte (XOR and multiply).
// Simple enough to verify by inspection.
// Good enough for hash tables in production.

const FNV_OFFSET_BASIS: u64 = 14695981039346656037;
const FNV_PRIME: u64 = 1099511628211;

/// FNV-1a hash of a byte slice.
/// For each byte: XOR into hash, then multiply by prime.
/// Uses wrapping_mul because overflow is expected and intentional.
fn fnv1a(data: &[u8]) -> u64 {
    todo!("start with offset basis, XOR each byte, multiply by prime")
}

/// Convenience: FNV-1a hash of a string.
fn fnv1a_str(s: &str) -> u64 {
    todo!("delegate to fnv1a with s.as_bytes()")
}

/// Hamming distance: number of differing bits between two u64 values.
/// Used to measure avalanche effect — good hashes flip ~32 bits
/// when one input byte changes.
fn hamming_distance(a: u64, b: u64) -> u32 {
    todo!("XOR, then count 1-bits")
}

/// A Bloom filter: probabilistic set membership test.
/// False positives possible, false negatives IMPOSSIBLE.
struct BloomFilter {
    bits: Vec<bool>,
    size: usize,
}

impl BloomFilter {
    fn new(size: usize) -> Self {
        todo!("create with 'size' bits, all false")
    }

    /// Insert: set bits at two hash-derived positions.
    fn insert(&mut self, item: &str) {
        todo!("compute two hash positions, set those bits to true")
    }

    /// Query: check if both hash-derived positions are set.
    fn might_contain(&self, item: &str) -> bool {
        todo!("check both positions — false negative impossible")
    }
}
`,
    solutionCode: `// Hash Functions: Simple Algorithms, Deep Properties

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
      'For <code>fnv1a</code>, start with <code>FNV_OFFSET_BASIS</code>. For each byte: <code>hash ^= byte as u64</code>, then <code>hash = hash.wrapping_mul(FNV_PRIME)</code>. The <code>wrapping_mul</code> is intentional — overflow wraps around and contributes to diffusion.',
      'For <code>hamming_distance</code>, XOR the two values and count 1-bits with <code>.count_ones()</code>. XOR produces 1 exactly where the bits differ.',
      'For the Bloom filter, use <code>fnv1a_str(item) % size</code> for one position, and hash the reversed bytes for a second position. Two independent hash positions reduce false positive rate.',
      '<code>might_contain</code> returns true only if BOTH positions are set. False positives occur when other insertions happened to set both positions. False negatives are impossible because insertion always sets both positions.',
    ],
    concepts: ['hash functions', 'FNV-1a', 'avalanche effect', 'Hamming distance', 'Bloom filters'],
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
