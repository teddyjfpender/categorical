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

  // ─────────────────────────────────────────────────────────
  // Module: Async From Scratch — "What async/await compiles to"
  // ─────────────────────────────────────────────────────────

  'rust-futures-basics': {
    id: 'rust-futures-basics',
    language: 'rust',
    title: 'Futures By Hand: What Async Compiles To',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Real Problem: Async Is Magic Until You Build It</h3>

<p>Most developers use <code>async/await</code> without understanding what it compiles to. They add <code>.await</code> and it works — until it doesn't. Then they face incomprehensible errors about <code>Pin</code>, <code>Unpin</code>, and <code>Send</code> bounds.</p>

<p>The truth is simple: <strong>every async fn compiles to a state machine that implements <code>Future</code></strong>. When you write <code>async { a().await; b().await }</code>, the compiler generates an enum with one variant per await point and a <code>poll()</code> method that advances through them.</p>

<h3>The Future Trait</h3>

<pre><code>pub trait Future {
    type Output;
    fn poll(self: Pin&lt;&amp;mut Self&gt;, cx: &amp;mut Context&lt;'_&gt;) -&gt; Poll&lt;Self::Output&gt;;
}

pub enum Poll&lt;T&gt; {
    Ready(T),     // computation is done, here's the result
    Pending,      // not done yet — call me again later
}</code></pre>

<p>An executor calls <code>poll()</code> repeatedly. When a future returns <code>Pending</code>, it must arrange for the <code>Waker</code> in <code>cx</code> to be called when progress is possible. The waker tells the executor: "poll me again."</p>

<h3>Building a Minimal Executor</h3>

<p>A real executor like tokio uses epoll/kqueue for I/O. But the core loop is simple:</p>

<pre><code>loop {
    match future.poll(cx) {
        Poll::Ready(val) =&gt; return val,
        Poll::Pending =&gt; { /* wait for waker to fire, then loop */ }
    }
}</code></pre>

<p>We'll use <code>AtomicBool</code> as our waker signal — when the future calls <code>wake()</code>, it sets the flag, and the executor spins until it sees it.</p>

<h3>The Taste Principle</h3>

<blockquote>"Understand the abstraction by building it." Tokio, async-std, smol — they all build on this same protocol. Once you've hand-written a Future, <code>async/await</code> is just syntactic sugar, not magic.</blockquote>

<h3>Your Task</h3>
<p>Implement a <code>Countdown</code> future that returns <code>Poll::Pending</code> a specified number of times before resolving, and a <code>block_on()</code> executor that drives any future to completion.</p>
`,
    starterCode: `// Futures By Hand: What Async Compiles To
//
// No tokio. No async-std. Just the raw Future trait and a
// hand-rolled executor. This is what the runtime does for you.

use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Wake, Waker};
use std::sync::{Arc, atomic::{AtomicBool, Ordering}};

/// A future that returns Poll::Pending exactly \`remaining\` times,
/// then returns Poll::Ready with the total number of polls it took.
struct Countdown {
    remaining: u32,
    total_polls: u32,
}

impl Countdown {
    fn new(count: u32) -> Self {
        todo!("initialize remaining and total_polls")
    }
}

impl Future for Countdown {
    type Output = u32;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<u32> {
        todo!(
            "1. Increment total_polls
             2. If remaining > 0, decrement remaining, call cx.waker().wake_by_ref(), return Pending
             3. Otherwise return Ready(total_polls)"
        )
    }
}

/// A simple waker backed by an AtomicBool flag.
struct Signal {
    woken: AtomicBool,
}

impl Signal {
    fn new() -> Self {
        todo!("create with woken = false")
    }
}

impl Wake for Signal {
    fn wake(self: Arc<Self>) {
        todo!("set woken to true")
    }
}

/// Drive a future to completion by polling in a loop.
/// Uses our Signal-based waker.
fn block_on<F: Future>(mut future: F) -> F::Output {
    todo!(
        "1. Create Arc<Signal>, convert to Waker with Waker::from(arc)
         2. Pin the future with pin!() or unsafe Pin::new_unchecked
         3. Loop: poll with context, return on Ready, on Pending reset the flag and continue"
    )
}
`,
    solutionCode: `use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Wake, Waker};
use std::sync::{Arc, atomic::{AtomicBool, Ordering}};

struct Countdown {
    remaining: u32,
    total_polls: u32,
}

impl Countdown {
    fn new(count: u32) -> Self {
        Countdown { remaining: count, total_polls: 0 }
    }
}

impl Future for Countdown {
    type Output = u32;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<u32> {
        let this = self.get_mut();
        this.total_polls += 1;
        if this.remaining > 0 {
            this.remaining -= 1;
            cx.waker().wake_by_ref();
            Poll::Pending
        } else {
            Poll::Ready(this.total_polls)
        }
    }
}

struct Signal {
    woken: AtomicBool,
}

impl Signal {
    fn new() -> Self {
        Signal { woken: AtomicBool::new(false) }
    }
}

impl Wake for Signal {
    fn wake(self: Arc<Self>) {
        self.woken.store(true, Ordering::SeqCst);
    }
}

fn block_on<F: Future>(mut future: F) -> F::Output {
    let signal = Arc::new(Signal::new());
    let waker = Waker::from(signal.clone());
    let mut cx = Context::from_waker(&waker);
    let mut future = unsafe { Pin::new_unchecked(&mut future) };
    loop {
        match future.as_mut().poll(&mut cx) {
            Poll::Ready(val) => return val,
            Poll::Pending => {
                signal.woken.store(false, Ordering::SeqCst);
            }
        }
    }
}
`,
    testCode: `let result = block_on(Countdown::new(0));
    assert_test_eq("countdown 0 total polls", 1u32, result);
    let result = block_on(Countdown::new(3));
    assert_test_eq("countdown 3 total polls", 4u32, result);
    let result = block_on(Countdown::new(10));
    assert_test_eq("countdown 10 total polls", 11u32, result);
    let result = block_on(Countdown::new(1));
    assert_test_eq("countdown 1 total polls", 2u32, result);
    let c = Countdown::new(5);
    assert_test_eq("countdown new remaining", 5u32, c.remaining);
    assert_test_eq("countdown new total_polls", 0u32, c.total_polls);
    let signal = Arc::new(Signal::new());
    assert_test("signal starts false", !signal.woken.load(Ordering::SeqCst));
    let s2 = signal.clone();
    Arc::clone(&s2).wake();
    assert_test("signal wake sets true", signal.woken.load(Ordering::SeqCst));`,
    hints: [
      'In <code>Countdown::new</code>, set <code>remaining</code> to the input count and <code>total_polls</code> to 0.',
      'In <code>poll()</code>, use <code>self.get_mut()</code> to get a <code>&amp;mut Countdown</code> from the <code>Pin</code>. This is safe because <code>Countdown</code> is <code>Unpin</code> (no self-references). Increment <code>total_polls</code> on every call.',
      'When returning <code>Pending</code>, always call <code>cx.waker().wake_by_ref()</code> — this tells the executor to poll again. Without this, the executor would sleep forever waiting for a notification that never comes.',
      'In <code>block_on</code>, create the waker with <code>Waker::from(arc.clone())</code>. Use <code>unsafe { Pin::new_unchecked(&amp;mut future) }</code> to pin it (safe because we never move it after pinning). Loop: poll, match, return on Ready, reset the flag on Pending.',
    ],
    concepts: ['Future trait', 'Poll::Pending/Ready', 'Waker', 'executor', 'state machine', 'async desugaring'],
    successPatterns: [
      'Poll::Pending',
      'Poll::Ready',
      'wake_by_ref',
      'Waker::from',
    ],
    testNames: [
      'Countdown(0) completes in 1 poll',
      'Countdown(3) completes in 4 polls',
      'Countdown(10) completes in 11 polls',
      'Countdown(1) completes in 2 polls',
      'Countdown::new sets remaining correctly',
      'Countdown::new starts total_polls at 0',
      'Signal starts as not woken',
      'Signal wake sets flag to true',
    ],
  },

  'rust-pin-unpin': {
    id: 'rust-pin-unpin',
    language: 'rust',
    title: 'Pin & Unpin: Why Self-References Break Moves',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Real Problem: Moving Invalidates Pointers</h3>

<p>Rust normally moves values by memcpy-ing bytes. This is fine for most types. But what if a struct contains a pointer to <em>itself</em>? After a move, the pointer still points to the old location — instant undefined behavior.</p>

<pre><code>// Conceptually what breaks:
struct SelfRef {
    data: String,
    ptr: *const String,  // points to self.data
}

let mut a = SelfRef::new();   // ptr points to a.data
let b = a;                     // memcpy! b.ptr still points to a's old location
// b.ptr is now DANGLING</code></pre>

<p>This isn't hypothetical. Every async fn compiles to a struct that may hold references across await points — references to its own local variables. Moving that struct after the first poll would invalidate those references.</p>

<h3>Pin: A Guarantee of Immobility</h3>

<p><code>Pin&lt;P&gt;</code> wraps a pointer type <code>P</code> and prevents moving the pointee out. <code>Pin&lt;Box&lt;T&gt;&gt;</code> means: "I promise this <code>T</code> will never be moved again." The Future trait requires <code>Pin&lt;&amp;mut Self&gt;</code> precisely for this reason.</p>

<p>If a type is <code>Unpin</code> (most types), <code>Pin</code> is a no-op — you can freely move it. Only types that opt out of <code>Unpin</code> (via <code>PhantomPinned</code>) actually need pinning.</p>

<h3>The Taste Principle</h3>

<blockquote>"Pin exists because async state machines are self-referential." It's not an arbitrary API complexity — it solves a real problem that arises the moment you compile <code>async/await</code> to a state machine.</blockquote>

<h3>Your Task</h3>
<p>Build a self-referential struct that demonstrates why Pin is necessary. Show the difference between pinned and unpinned types, and implement safe access patterns using Pin.</p>
`,
    starterCode: `// Pin & Unpin: Why Self-References Break Moves
//
// Demonstrate why Pin exists: self-referential structs
// become unsound if moved.

use std::pin::Pin;
use std::marker::PhantomPinned;

/// A struct that holds a value and a "cached pointer" to it.
/// The pointer simulates what async state machines do internally.
/// After init(), \`cached_ptr\` points to \`data\`. Moving the struct
/// would invalidate this pointer.
struct SelfReferential {
    data: String,
    cached_ptr: *const String,
    _pin: PhantomPinned,
}

impl SelfReferential {
    /// Create a new instance with an unset pointer (null).
    fn new(data: String) -> Self {
        todo!("create with data, null pointer, and PhantomPinned")
    }

    /// Initialize the self-reference. MUST be called on a pinned instance.
    /// Sets cached_ptr to point to self.data.
    fn init(self: Pin<&mut Self>) {
        todo!(
            "use unsafe to get a raw pointer to self.data
             and store it in cached_ptr"
        )
    }

    /// Read the data through the cached pointer. Returns None if not initialized.
    fn read_cached(self: Pin<&Self>) -> Option<&str> {
        todo!(
            "if cached_ptr is null, return None
             otherwise unsafe deref the pointer and return Some"
        )
    }

    /// Read data directly (always works).
    fn read_direct(self: Pin<&Self>) -> &str {
        todo!("return &self.data")
    }
}

/// Demonstrates that Unpin types can be freely moved even when pinned.
/// Vec<i32> is Unpin, so Pin<&mut Vec<i32>> lets you move the inner value.
fn demonstrate_unpin() -> (Vec<i32>, Vec<i32>) {
    todo!(
        "1. Create a Vec, pin it with Box::pin
         2. Show you can still access it normally because Vec is Unpin
         3. Return two vecs showing the data is accessible"
    )
}
`,
    solutionCode: `use std::pin::Pin;
use std::marker::PhantomPinned;

struct SelfReferential {
    data: String,
    cached_ptr: *const String,
    _pin: PhantomPinned,
}

impl SelfReferential {
    fn new(data: String) -> Self {
        SelfReferential {
            data,
            cached_ptr: std::ptr::null(),
            _pin: PhantomPinned,
        }
    }

    fn init(self: Pin<&mut Self>) {
        let self_ref: *const String = &self.data;
        unsafe {
            let this = self.get_unchecked_mut();
            this.cached_ptr = self_ref;
        }
    }

    fn read_cached(self: Pin<&Self>) -> Option<&str> {
        if self.cached_ptr.is_null() {
            None
        } else {
            Some(unsafe { &*self.cached_ptr }.as_str())
        }
    }

    fn read_direct(self: Pin<&Self>) -> &str {
        &self.data
    }
}

fn demonstrate_unpin() -> (Vec<i32>, Vec<i32>) {
    let v1 = vec![1, 2, 3];
    let pinned = Box::pin(v1);
    let first_clone = pinned.clone();
    let v2 = vec![4, 5, 6];
    let pinned2 = Box::pin(v2);
    let second_clone = pinned2.clone();
    (first_clone, second_clone)
}
`,
    testCode: `let mut boxed = Box::pin(SelfReferential::new(String::from("hello pin")));
    assert_test("before init is None", boxed.as_ref().read_cached().is_none());
    assert_test_eq("direct read before init", "hello pin", boxed.as_ref().read_direct());
    boxed.as_mut().init();
    assert_test_eq("cached read after init", Some("hello pin"), boxed.as_ref().read_cached());
    assert_test_eq("direct read after init", "hello pin", boxed.as_ref().read_direct());
    let mut boxed2 = Box::pin(SelfReferential::new(String::from("world")));
    boxed2.as_mut().init();
    assert_test_eq("second instance cached", Some("world"), boxed2.as_ref().read_cached());
    let (v1, v2) = demonstrate_unpin();
    assert_test_eq("unpin vec1", vec![1, 2, 3], v1);
    assert_test_eq("unpin vec2", vec![4, 5, 6], v2);`,
    hints: [
      'In <code>new()</code>, use <code>std::ptr::null()</code> for the initial <code>cached_ptr</code> and <code>PhantomPinned</code> for the <code>_pin</code> field. <code>PhantomPinned</code> is a zero-sized type that opts out of <code>Unpin</code>.',
      'In <code>init()</code>, first get a raw pointer to <code>self.data</code> with <code>&amp;self.data as *const String</code>. Then use <code>unsafe { self.get_unchecked_mut() }</code> to get a mutable reference and set <code>cached_ptr</code>.',
      'In <code>read_cached()</code>, check <code>self.cached_ptr.is_null()</code>. If not null, use <code>unsafe { &amp;*self.cached_ptr }</code> to dereference the raw pointer back to a <code>&amp;String</code>, then call <code>.as_str()</code>.',
      'For <code>demonstrate_unpin()</code>, <code>Vec&lt;i32&gt;</code> implements <code>Unpin</code>, so <code>Box::pin(vec)</code> still allows full access. Use <code>.clone()</code> to get copies of the data. The point: <code>Pin</code> only restricts types that are <code>!Unpin</code>.',
    ],
    concepts: ['Pin', 'Unpin', 'PhantomPinned', 'self-referential structs', 'async state machines', 'memory safety'],
    successPatterns: [
      'PhantomPinned',
      'get_unchecked_mut',
      'cached_ptr',
      'Pin<',
    ],
    testNames: [
      'Cached read is None before init',
      'Direct read works before init',
      'Cached read returns data after init',
      'Direct read works after init',
      'Second instance has independent cached pointer',
      'Unpin Vec can be cloned from pin (v1)',
      'Unpin Vec can be cloned from pin (v2)',
    ],
  },

  'rust-async-patterns': {
    id: 'rust-async-patterns',
    language: 'rust',
    title: 'Async Combinators: Composition of Futures',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>The Real Problem: Composing Asynchronous Operations</h3>

<p>In synchronous code, composition is trivial: <code>let result = f(g(x))</code>. But async operations return futures — values that represent <em>eventual</em> results. How do you chain them? How do you race them?</p>

<p>Libraries give you <code>.and_then()</code>, <code>select!()</code>, <code>join!()</code>. But these are just <strong>Future wrappers</strong> — structs that implement <code>Future</code> by delegating to inner futures. There's no magic.</p>

<h3>The Combinator Pattern</h3>

<p>John Hughes' influential paper "Why Functional Programming Matters" argues that the power of FP comes from its <strong>composition tools</strong> — combinators that build complex behaviors from simple pieces. The same principle applies to async:</p>

<pre><code>// AndThen: run F1, then pass its result to a closure that creates F2
// This is what .await; does in sequence

// Race: poll both F1 and F2, return whichever finishes first
// This is what select! does</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Combinators are the algebra of async." Just as monadic bind chains synchronous computations, <code>AndThen</code> chains async ones. Just as <code>Alternative</code> picks the first success, <code>Race</code> picks the first completion. Same math, different runtime.</blockquote>

<h3>Your Task</h3>
<p>Implement <code>AndThen</code> and <code>Race</code> as manual Future implementations. Also implement a <code>Ready</code> future (immediately resolves) to use as building blocks.</p>
`,
    starterCode: `// Async Combinators: Composition of Futures
//
// Build complex async behavior from simple pieces.
// No macros, no runtime — just Future impls.

use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

/// A future that immediately resolves with a value.
/// This is the "return" / "pure" of the async world.
struct Ready<T> {
    value: Option<T>,
}

fn ready<T>(val: T) -> Ready<T> {
    todo!("wrap val in Ready with Some")
}

impl<T> Future for Ready<T> {
    type Output = T;

    fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<T> {
        todo!("take the value out of Option and return Ready, panic if polled twice")
    }
}

/// A future that returns Pending \`n\` times, then Ready with a value.
struct Delayed<T> {
    value: Option<T>,
    remaining: u32,
}

fn delayed<T>(val: T, ticks: u32) -> Delayed<T> {
    todo!("create Delayed with remaining = ticks")
}

impl<T> Future for Delayed<T> {
    type Output = T;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<T> {
        todo!(
            "if remaining > 0: decrement, wake, return Pending
             else: take value and return Ready"
        )
    }
}

/// Chains two futures: runs first, then passes its output to a closure
/// that produces the second future.
struct AndThen<F1, F2, Func> {
    first: Option<F1>,
    second: Option<F2>,
    func: Option<Func>,
}

fn and_then<F1, F2, Func>(future: F1, func: Func) -> AndThen<F1, F2, Func>
where
    F1: Future,
    F2: Future,
    Func: FnOnce(F1::Output) -> F2,
{
    todo!("create with first = Some(future), func = Some(func), second = None")
}

impl<F1, F2, Func> Future for AndThen<F1, F2, Func>
where
    F1: Future + Unpin,
    F2: Future + Unpin,
    Func: FnOnce(F1::Output) -> F2 + Unpin,
{
    type Output = F2::Output;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<F2::Output> {
        todo!(
            "1. If first is Some, poll it. On Ready, take func, call it, store in second.
             2. If second is Some, poll it and return result.
             3. Use Pin::new() since types are Unpin."
        )
    }
}

/// Races two futures: returns the output of whichever finishes first.
struct Race<F1, F2> {
    first: Option<F1>,
    second: Option<F2>,
}

fn race<F1, F2>(f1: F1, f2: F2) -> Race<F1, F2>
where
    F1: Future,
    F2: Future<Output = F1::Output>,
{
    todo!("create with both as Some")
}

impl<F1, F2> Future for Race<F1, F2>
where
    F1: Future + Unpin,
    F2: Future<Output = F1::Output> + Unpin,
{
    type Output = F1::Output;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<F1::Output> {
        todo!(
            "poll first — if Ready, return it
             poll second — if Ready, return it
             otherwise Pending"
        )
    }
}
`,
    solutionCode: `use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

struct Ready<T> {
    value: Option<T>,
}

fn ready<T>(val: T) -> Ready<T> {
    Ready { value: Some(val) }
}

impl<T> Future for Ready<T> {
    type Output = T;

    fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<T> {
        let this = self.get_mut();
        Poll::Ready(this.value.take().expect("Ready polled after completion"))
    }
}

struct Delayed<T> {
    value: Option<T>,
    remaining: u32,
}

fn delayed<T>(val: T, ticks: u32) -> Delayed<T> {
    Delayed { value: Some(val), remaining: ticks }
}

impl<T> Future for Delayed<T> {
    type Output = T;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<T> {
        let this = self.get_mut();
        if this.remaining > 0 {
            this.remaining -= 1;
            cx.waker().wake_by_ref();
            Poll::Pending
        } else {
            Poll::Ready(this.value.take().expect("Delayed polled after completion"))
        }
    }
}

struct AndThen<F1, F2, Func> {
    first: Option<F1>,
    second: Option<F2>,
    func: Option<Func>,
}

fn and_then<F1, F2, Func>(future: F1, func: Func) -> AndThen<F1, F2, Func>
where
    F1: Future,
    F2: Future,
    Func: FnOnce(F1::Output) -> F2,
{
    AndThen {
        first: Some(future),
        second: None,
        func: Some(func),
    }
}

impl<F1, F2, Func> Future for AndThen<F1, F2, Func>
where
    F1: Future + Unpin,
    F2: Future + Unpin,
    Func: FnOnce(F1::Output) -> F2 + Unpin,
{
    type Output = F2::Output;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<F2::Output> {
        let this = self.get_mut();
        if let Some(ref mut first) = this.first {
            match Pin::new(first).poll(cx) {
                Poll::Ready(val) => {
                    this.first = None;
                    let func = this.func.take().expect("func already consumed");
                    this.second = Some(func(val));
                    cx.waker().wake_by_ref();
                    return Poll::Pending;
                }
                Poll::Pending => return Poll::Pending,
            }
        }
        if let Some(ref mut second) = this.second {
            return Pin::new(second).poll(cx);
        }
        unreachable!("AndThen polled after completion")
    }
}

struct Race<F1, F2> {
    first: Option<F1>,
    second: Option<F2>,
}

fn race<F1, F2>(f1: F1, f2: F2) -> Race<F1, F2>
where
    F1: Future,
    F2: Future<Output = F1::Output>,
{
    Race { first: Some(f1), second: Some(f2) }
}

impl<F1, F2> Future for Race<F1, F2>
where
    F1: Future + Unpin,
    F2: Future<Output = F1::Output> + Unpin,
{
    type Output = F1::Output;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<F1::Output> {
        let this = self.get_mut();
        if let Some(ref mut first) = this.first {
            if let Poll::Ready(val) = Pin::new(first).poll(cx) {
                this.first = None;
                this.second = None;
                return Poll::Ready(val);
            }
        }
        if let Some(ref mut second) = this.second {
            if let Poll::Ready(val) = Pin::new(second).poll(cx) {
                this.first = None;
                this.second = None;
                return Poll::Ready(val);
            }
        }
        Poll::Pending
    }
}
`,
    testCode: `use std::sync::{Arc, atomic::{AtomicBool, Ordering}};
    use std::task::{Wake, Waker};

    struct Sig { w: AtomicBool }
    impl Sig { fn new() -> Self { Sig { w: AtomicBool::new(false) } } }
    impl Wake for Sig { fn wake(self: Arc<Self>) { self.w.store(true, Ordering::SeqCst); } }

    fn run<F: Future + Unpin>(mut f: F) -> F::Output {
        let sig = Arc::new(Sig::new());
        let waker = Waker::from(sig.clone());
        let mut cx = Context::from_waker(&waker);
        loop {
            match Pin::new(&mut f).poll(&mut cx) {
                Poll::Ready(v) => return v,
                Poll::Pending => { sig.w.store(false, Ordering::SeqCst); }
            }
        }
    }

    assert_test_eq("ready resolves", 42i32, run(ready(42i32)));
    assert_test_eq("delayed 0", 99i32, run(delayed(99i32, 0)));
    assert_test_eq("delayed 5", 7i32, run(delayed(7i32, 5)));
    let chained = and_then(ready(10i32), |x| ready(x + 5));
    assert_test_eq("and_then ready+ready", 15i32, run(chained));
    let chained2 = and_then(delayed(3i32, 2), |x| delayed(x * 10, 1));
    assert_test_eq("and_then delayed+delayed", 30i32, run(chained2));
    let r = race(delayed(1i32, 10), ready(2i32));
    assert_test_eq("race fast wins", 2i32, run(r));
    let r2 = race(ready(100i32), delayed(200i32, 5));
    assert_test_eq("race first ready wins", 100i32, run(r2));`,
    hints: [
      'For <code>Ready</code>, use <code>self.get_mut().value.take()</code> to move the value out of the <code>Option</code>. The <code>take()</code> leaves <code>None</code> behind, so polling twice will panic via <code>.expect()</code>.',
      'For <code>Delayed</code>, check <code>remaining</code> first. If > 0, decrement, call <code>cx.waker().wake_by_ref()</code>, and return <code>Pending</code>. Otherwise <code>.take()</code> the value and return <code>Ready</code>.',
      'For <code>AndThen</code>, use a two-phase approach: while <code>first</code> is <code>Some</code>, poll it. When it resolves, take the closure with <code>.take()</code>, call it to produce the second future, store it in <code>self.second</code>. Then poll <code>second</code>.',
      'For <code>Race</code>, try polling <code>first</code>. If it returns <code>Ready</code>, return immediately. Otherwise try <code>second</code>. If neither is ready, return <code>Pending</code>. Since both are <code>Unpin</code>, use <code>Pin::new()</code>.',
    ],
    concepts: ['future combinators', 'and_then', 'race', 'composition', 'Hughes combinators', 'async algebra'],
    successPatterns: [
      'Pin::new\\(',
      'Poll::Ready',
      'Poll::Pending',
      '\\.take\\(\\)',
    ],
    testNames: [
      'Ready future resolves immediately',
      'Delayed(0) resolves immediately',
      'Delayed(5) resolves after 5 ticks',
      'AndThen chains two Ready futures',
      'AndThen chains two Delayed futures',
      'Race: second wins when faster',
      'Race: first wins when faster',
    ],
  },

  'rust-channels': {
    id: 'rust-channels',
    language: 'rust',
    title: 'Channels: Share by Communicating (CSP)',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Real Problem: Shared Mutable State</h3>

<p>The traditional approach to concurrency is shared mutable state protected by locks. This works, but it's the source of nearly every concurrency bug: deadlocks, data races, priority inversion, lock ordering violations.</p>

<pre><code>// The shared-state approach (fragile):
let data = Arc::new(Mutex::new(Vec::new()));
// Now EVERY thread must remember to lock, and lock in the right ORDER.
// Forget once → data race. Lock in wrong order → deadlock.</code></pre>

<h3>CSP: Communicating Sequential Processes</h3>

<p>Tony Hoare's CSP (1978) proposed a different model: instead of sharing memory, <strong>share by communicating</strong>. Each process has private state and communicates with others through channels. Go adopted this as a language primitive. Rust's <code>std::sync::mpsc</code> provides it in the standard library.</p>

<pre><code>// The channel approach (structured):
// Producer sends data through a channel. Consumer receives it.
// No shared state. No locks. No deadlocks.</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Don't communicate by sharing memory; share memory by communicating." — Go proverb, but the idea is Hoare's. Channels turn unstructured shared state into structured message passing.</blockquote>

<h3>Your Task</h3>
<p>Build a bounded channel from scratch using <code>Mutex&lt;VecDeque&lt;T&gt;&gt;</code>. Implement <code>try_send</code> (fails when full) and <code>try_recv</code> (returns None when empty). Single-threaded tests prove correctness.</p>
`,
    starterCode: `// Channels: Share by Communicating (CSP)
//
// Build a bounded channel from scratch.
// No async, no threads — just the data structure.

use std::sync::Mutex;
use std::collections::VecDeque;

/// Error returned when the channel is full.
#[derive(Debug, PartialEq)]
struct ChannelFull<T>(T);

/// A bounded channel that holds at most \`capacity\` items.
struct Channel<T> {
    buffer: Mutex<VecDeque<T>>,
    capacity: usize,
}

impl<T> Channel<T> {
    /// Create a new channel with the given capacity.
    fn new(capacity: usize) -> Self {
        todo!("initialize buffer and capacity")
    }

    /// Try to send a value. Returns Err(ChannelFull(val)) if the channel is full.
    fn try_send(&self, val: T) -> Result<(), ChannelFull<T>> {
        todo!(
            "lock the buffer, check length against capacity,
             push_back if room, return Err if full"
        )
    }

    /// Try to receive a value. Returns None if the channel is empty.
    fn try_recv(&self) -> Option<T> {
        todo!("lock the buffer, pop_front")
    }

    /// Returns the number of items currently in the channel.
    fn len(&self) -> usize {
        todo!("lock the buffer, return len")
    }

    /// Returns true if the channel is empty.
    fn is_empty(&self) -> bool {
        todo!("lock the buffer, check is_empty")
    }

    /// Returns true if the channel is full.
    fn is_full(&self) -> bool {
        todo!("lock the buffer, check len == capacity")
    }
}

/// A helper that creates a (sender_fn, receiver_fn) pair over a shared channel.
/// This simulates the producer/consumer pattern without threads.
fn channel_pair<T>(capacity: usize) -> (Channel<T>, ()) {
    todo!("just return (Channel::new(capacity), ())")
}
`,
    solutionCode: `use std::sync::Mutex;
use std::collections::VecDeque;

#[derive(Debug, PartialEq)]
struct ChannelFull<T>(T);

struct Channel<T> {
    buffer: Mutex<VecDeque<T>>,
    capacity: usize,
}

impl<T> Channel<T> {
    fn new(capacity: usize) -> Self {
        Channel {
            buffer: Mutex::new(VecDeque::with_capacity(capacity)),
            capacity,
        }
    }

    fn try_send(&self, val: T) -> Result<(), ChannelFull<T>> {
        let mut buf = self.buffer.lock().unwrap();
        if buf.len() >= self.capacity {
            Err(ChannelFull(val))
        } else {
            buf.push_back(val);
            Ok(())
        }
    }

    fn try_recv(&self) -> Option<T> {
        let mut buf = self.buffer.lock().unwrap();
        buf.pop_front()
    }

    fn len(&self) -> usize {
        let buf = self.buffer.lock().unwrap();
        buf.len()
    }

    fn is_empty(&self) -> bool {
        let buf = self.buffer.lock().unwrap();
        buf.is_empty()
    }

    fn is_full(&self) -> bool {
        let buf = self.buffer.lock().unwrap();
        buf.len() >= self.capacity
    }
}

fn channel_pair<T>(capacity: usize) -> (Channel<T>, ()) {
    (Channel::new(capacity), ())
}
`,
    testCode: `let ch: Channel<i32> = Channel::new(3);
    assert_test("new channel is empty", ch.is_empty());
    assert_test("new channel not full", !ch.is_full());
    assert_test_eq("new channel len 0", 0usize, ch.len());
    assert_test_eq("send 1", Ok(()), ch.try_send(10));
    assert_test_eq("send 2", Ok(()), ch.try_send(20));
    assert_test_eq("send 3", Ok(()), ch.try_send(30));
    assert_test("full after 3", ch.is_full());
    assert_test_eq("len is 3", 3usize, ch.len());
    assert_test_eq("send when full", Err(ChannelFull(40)), ch.try_send(40));
    assert_test_eq("recv first", Some(10), ch.try_recv());
    assert_test_eq("recv second", Some(20), ch.try_recv());
    assert_test_eq("recv third", Some(30), ch.try_recv());
    assert_test_eq("recv empty", None::<i32>, ch.try_recv());
    assert_test("empty after drain", ch.is_empty());
    let (ch2, _) = channel_pair::<String>(2);
    assert_test_eq("pair send", Ok(()), ch2.try_send(String::from("hello")));
    assert_test_eq("pair recv", Some(String::from("hello")), ch2.try_recv());`,
    hints: [
      'In <code>new()</code>, use <code>Mutex::new(VecDeque::with_capacity(capacity))</code> to pre-allocate the buffer.',
      'In <code>try_send()</code>, call <code>self.buffer.lock().unwrap()</code> to get the <code>MutexGuard</code>. Check <code>buf.len() >= self.capacity</code>. If full, return <code>Err(ChannelFull(val))</code> — this gives the value back to the caller.',
      'In <code>try_recv()</code>, lock the mutex and call <code>pop_front()</code>. <code>VecDeque::pop_front</code> already returns <code>Option&lt;T&gt;</code>, which is exactly what we need.',
      'The <code>Mutex</code> ensures that even if multiple threads call <code>try_send</code>/<code>try_recv</code> concurrently, the buffer is never accessed simultaneously. The <code>MutexGuard</code> is dropped when it goes out of scope, releasing the lock automatically.',
    ],
    concepts: ['CSP', 'channels', 'bounded buffer', 'Mutex', 'VecDeque', 'producer-consumer', 'message passing'],
    successPatterns: [
      'Mutex::new',
      'push_back',
      'pop_front',
      'lock\\(\\)\\.unwrap\\(\\)',
    ],
    testNames: [
      'New channel is empty',
      'New channel is not full',
      'New channel has length 0',
      'Send succeeds when space available',
      'Channel becomes full at capacity',
      'Length matches number of sent items',
      'Send fails when channel is full',
      'Receive returns items in FIFO order',
      'Receive returns None when empty',
      'Channel is empty after draining',
      'Channel pair works with String type',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Module: Advanced Traits — "Controlling the type system"
  // ─────────────────────────────────────────────────────────

  'rust-sealed-traits': {
    id: 'rust-sealed-traits',
    language: 'rust',
    title: 'Sealed Traits: Controlling Extension Points',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Real Problem: Uncontrolled Trait Implementations</h3>

<p>When you publish a trait, <em>anyone</em> can implement it. This is usually good — it's the open/closed principle. But sometimes you need to promise exhaustive matching or add methods without breaking downstream code.</p>

<pre><code>// Problem: if anyone can impl this, we can never add methods
pub trait DatabaseDialect {
    fn format_select(&amp;self) -&gt; String;
    // Adding this later BREAKS all external impls:
    // fn format_join(&amp;self) -&gt; String;
}</code></pre>

<p>The sealed trait pattern lets you have a public trait that <strong>only your crate can implement</strong>. External code can <em>use</em> the trait (call its methods, use it as a bound) but cannot implement it for new types.</p>

<h3>The Pattern</h3>

<pre><code>mod private {
    pub trait Sealed {}
}

pub trait MyTrait: private::Sealed {
    fn method(&amp;self) -&gt; String;
}

// Only types in THIS module can impl Sealed, therefore
// only types in THIS module can impl MyTrait.</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Not every extension point should be open." The sealed trait pattern is Rust's answer to final classes in Java, but more precise — you close the implementations while keeping the interface open for use.</blockquote>

<h3>Your Task</h3>
<p>Implement a sealed <code>DatabaseDialect</code> trait with two sealed implementations (Postgres and SQLite), and show that the pattern enables safe exhaustive matching.</p>
`,
    starterCode: `// Sealed Traits: Controlling Extension Points
//
// The sealed trait pattern: public interface, private implementations.
// Only YOUR types can implement the trait.

/// Private module — the Sealed trait is pub to the crate but
/// the module itself is not pub to external crates.
mod private {
    pub trait Sealed {}
}

/// A sealed trait: only types that impl private::Sealed can impl this.
/// External code can USE this trait but cannot IMPLEMENT it.
trait DatabaseDialect: private::Sealed {
    fn name(&self) -> &'static str;
    fn format_select(&self, table: &str, columns: &[&str]) -> String;
    fn format_limit(&self, query: &str, n: usize) -> String;
    fn placeholder(&self, index: usize) -> String;
}

struct Postgres;
struct Sqlite;

// TODO: Implement private::Sealed for both Postgres and Sqlite
// TODO: Implement DatabaseDialect for both

impl DatabaseDialect for Postgres {
    fn name(&self) -> &'static str {
        todo!("return \"PostgreSQL\"")
    }

    fn format_select(&self, table: &str, columns: &[&str]) -> String {
        todo!("return SELECT col1, col2 FROM table")
    }

    fn format_limit(&self, query: &str, n: usize) -> String {
        todo!("return query LIMIT n")
    }

    fn placeholder(&self, index: usize) -> String {
        todo!("return $1, $2, etc (Postgres style)")
    }
}

impl DatabaseDialect for Sqlite {
    fn name(&self) -> &'static str {
        todo!("return \"SQLite\"")
    }

    fn format_select(&self, table: &str, columns: &[&str]) -> String {
        todo!("return SELECT col1, col2 FROM table")
    }

    fn format_limit(&self, query: &str, n: usize) -> String {
        todo!("return query LIMIT n")
    }

    fn placeholder(&self, index: usize) -> String {
        todo!("return ?1, ?2, etc (SQLite style)")
    }
}

/// Because the trait is sealed, we can exhaustively handle all dialects.
/// This function takes a trait object and builds a parameterized INSERT.
fn build_insert(dialect: &dyn DatabaseDialect, table: &str, columns: &[&str]) -> String {
    todo!(
        "Build: INSERT INTO table (col1, col2) VALUES (placeholder(1), placeholder(2))
         Use dialect.placeholder(i) for each column index"
    )
}
`,
    solutionCode: `mod private {
    pub trait Sealed {}
}

trait DatabaseDialect: private::Sealed {
    fn name(&self) -> &'static str;
    fn format_select(&self, table: &str, columns: &[&str]) -> String;
    fn format_limit(&self, query: &str, n: usize) -> String;
    fn placeholder(&self, index: usize) -> String;
}

struct Postgres;
struct Sqlite;

impl private::Sealed for Postgres {}
impl private::Sealed for Sqlite {}

impl DatabaseDialect for Postgres {
    fn name(&self) -> &'static str {
        "PostgreSQL"
    }

    fn format_select(&self, table: &str, columns: &[&str]) -> String {
        format!("SELECT {} FROM {}", columns.join(", "), table)
    }

    fn format_limit(&self, query: &str, n: usize) -> String {
        format!("{} LIMIT {}", query, n)
    }

    fn placeholder(&self, index: usize) -> String {
        format!("${"$"}{}", index)
    }
}

impl DatabaseDialect for Sqlite {
    fn name(&self) -> &'static str {
        "SQLite"
    }

    fn format_select(&self, table: &str, columns: &[&str]) -> String {
        format!("SELECT {} FROM {}", columns.join(", "), table)
    }

    fn format_limit(&self, query: &str, n: usize) -> String {
        format!("{} LIMIT {}", query, n)
    }

    fn placeholder(&self, index: usize) -> String {
        format!("?{}", index)
    }
}

fn build_insert(dialect: &dyn DatabaseDialect, table: &str, columns: &[&str]) -> String {
    let cols = columns.join(", ");
    let placeholders: Vec<String> = (1..=columns.len())
        .map(|i| dialect.placeholder(i))
        .collect();
    let vals = placeholders.join(", ");
    format!("INSERT INTO {} ({}) VALUES ({})", table, cols, vals)
}
`,
    testCode: `let pg = Postgres;
    let sl = Sqlite;
    assert_test_eq("pg name", "PostgreSQL", pg.name());
    assert_test_eq("sl name", "SQLite", sl.name());
    assert_test_eq("pg select", String::from("SELECT id, name FROM users"), pg.format_select("users", &["id", "name"]));
    assert_test_eq("sl select", String::from("SELECT id, name FROM users"), sl.format_select("users", &["id", "name"]));
    assert_test_eq("pg limit", String::from("SELECT * FROM t LIMIT 10"), pg.format_limit("SELECT * FROM t", 10));
    assert_test_eq("pg placeholder 1", String::from("$1"), pg.placeholder(1));
    assert_test_eq("pg placeholder 3", String::from("$3"), pg.placeholder(3));
    assert_test_eq("sl placeholder 1", String::from("?1"), sl.placeholder(1));
    assert_test_eq("sl placeholder 3", String::from("?3"), sl.placeholder(3));
    assert_test_eq("pg insert", String::from("INSERT INTO users (name, email) VALUES ($1, $2)"), build_insert(&pg, "users", &["name", "email"]));
    assert_test_eq("sl insert", String::from("INSERT INTO users (name, email) VALUES (?1, ?2)"), build_insert(&sl, "users", &["name", "email"]));`,
    hints: [
      'First implement <code>private::Sealed</code> for both types: <code>impl private::Sealed for Postgres {}</code> and <code>impl private::Sealed for Sqlite {}</code>. These are empty impls — the trait has no methods.',
      'For <code>format_select</code>, use <code>columns.join(", ")</code> to build the column list and <code>format!("SELECT {} FROM {}", cols, table)</code>.',
      'For <code>placeholder</code>, Postgres uses <code>$N</code> (dollar-indexed) while SQLite uses <code>?N</code> (question-indexed). Use <code>format!("${}", index)</code> for Postgres.',
      'For <code>build_insert</code>, use <code>(1..=columns.len()).map(|i| dialect.placeholder(i)).collect::&lt;Vec&lt;_&gt;&gt;()</code> to generate all placeholders, then join with <code>", "</code>.',
    ],
    concepts: ['sealed traits', 'module privacy', 'extension control', 'exhaustive matching', 'API design'],
    successPatterns: [
      'private::Sealed',
      'impl private::Sealed for',
      'dyn DatabaseDialect',
      'placeholder',
    ],
    testNames: [
      'Postgres name is correct',
      'SQLite name is correct',
      'Postgres SELECT formatting',
      'SQLite SELECT formatting',
      'Postgres LIMIT formatting',
      'Postgres $N placeholder style',
      'Postgres $3 placeholder',
      'SQLite ?N placeholder style',
      'SQLite ?3 placeholder',
      'Postgres INSERT with placeholders',
      'SQLite INSERT with placeholders',
    ],
  },

  'rust-tower-middleware': {
    id: 'rust-tower-middleware',
    language: 'rust',
    title: 'Middleware as Composition: The Service Pattern',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Real Problem: Cross-Cutting Concerns</h3>

<p>Every real service needs logging, timing, auth, rate limiting. The naive approach: cram it all into one function. The result: a 500-line handler where business logic is buried under infrastructure.</p>

<pre><code>// The monolith approach (don't do this):
fn handle(req: Request) -&gt; Response {
    let start = Instant::now();           // timing
    log::info!("incoming: {}", req);      // logging
    check_auth(&amp;req)?;                    // auth
    check_rate_limit(&amp;req)?;              // rate limit
    let response = actual_logic(req);     // BUSINESS LOGIC (finally)
    log::info!("took {:?}", start.elapsed()); // more timing
    response
}</code></pre>

<h3>The Middleware Pattern</h3>

<p>Tower (the Rust HTTP ecosystem's foundation) models services as a trait. Middleware is just a Service that wraps another Service — pure composition:</p>

<pre><code>trait Service {
    type Response;
    fn call(&amp;self, req: &amp;str) -&gt; Self::Response;
}

// Logging&lt;Timing&lt;Echo&gt;&gt; — each layer adds behavior around the next</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Middleware is the decorator pattern done right." Instead of inheritance hierarchies or aspect-oriented programming, you compose behavior through wrapping. Each layer has a single responsibility. Testing each layer in isolation is trivial.</blockquote>

<h3>Your Task</h3>
<p>Implement the Service trait, an Echo service, and Logging + Timing middleware wrappers. Compose them to show <code>Logging&lt;Timing&lt;Echo&gt;&gt;</code>.</p>
`,
    starterCode: `// Middleware as Composition: The Service Pattern
//
// Simplified Tower-style service trait with middleware wrappers.
// Composition, not inheritance.

use std::time::Instant;

/// The core Service trait. Every service takes a request (&str)
/// and returns a Response.
trait Service {
    type Response;
    fn call(&self, req: &str) -> Self::Response;
}

/// The simplest service: echoes back the request.
struct Echo;

impl Service for Echo {
    type Response = String;

    fn call(&self, req: &str) -> String {
        todo!("return format: \"Echo: {req}\"")
    }
}

/// Middleware that adds a prefix tag to the response.
/// Simulates logging by wrapping the inner response with metadata.
struct Logging<S> {
    inner: S,
    tag: String,
}

impl<S> Logging<S> {
    fn new(inner: S, tag: &str) -> Self {
        todo!("store inner and tag")
    }
}

impl<S: Service<Response = String>> Service for Logging<S> {
    type Response = String;

    fn call(&self, req: &str) -> String {
        todo!("return format: \"[{tag}] {inner_response}\"")
    }
}

/// Middleware that measures execution time (in a simplified way).
/// Wraps response with timing info.
struct Timing<S> {
    inner: S,
}

impl<S> Timing<S> {
    fn new(inner: S) -> Self {
        todo!("store inner")
    }
}

impl<S: Service<Response = String>> Service for Timing<S> {
    type Response = String;

    fn call(&self, req: &str) -> String {
        todo!(
            "1. Record start = Instant::now()
             2. Call inner
             3. Record elapsed
             4. Return format: \"{response} (elapsed: {elapsed:?})\"
             Note: for tests, just return \"{response} (timed)\" for determinism"
        )
    }
}

/// Middleware that transforms the request before passing it to inner.
struct RequestMapper<S, F> {
    inner: S,
    mapper: F,
}

impl<S, F> RequestMapper<S, F> {
    fn new(inner: S, mapper: F) -> Self {
        todo!("store inner and mapper")
    }
}

impl<S, F> Service for RequestMapper<S, F>
where
    S: Service<Response = String>,
    F: Fn(&str) -> String,
{
    type Response = String;

    fn call(&self, req: &str) -> String {
        todo!("apply mapper to req, then call inner with the mapped req")
    }
}

/// Compose multiple middleware layers and demonstrate the pipeline.
fn compose_pipeline() -> String {
    todo!(
        "Build: Logging<Timing<Echo>> with tag \"APP\"
         Call with request \"hello\"
         Return the result"
    )
}
`,
    solutionCode: `use std::time::Instant;

trait Service {
    type Response;
    fn call(&self, req: &str) -> Self::Response;
}

struct Echo;

impl Service for Echo {
    type Response = String;

    fn call(&self, req: &str) -> String {
        format!("Echo: {}", req)
    }
}

struct Logging<S> {
    inner: S,
    tag: String,
}

impl<S> Logging<S> {
    fn new(inner: S, tag: &str) -> Self {
        Logging { inner, tag: tag.to_string() }
    }
}

impl<S: Service<Response = String>> Service for Logging<S> {
    type Response = String;

    fn call(&self, req: &str) -> String {
        let response = self.inner.call(req);
        format!("[{}] {}", self.tag, response)
    }
}

struct Timing<S> {
    inner: S,
}

impl<S> Timing<S> {
    fn new(inner: S) -> Self {
        Timing { inner }
    }
}

impl<S: Service<Response = String>> Service for Timing<S> {
    type Response = String;

    fn call(&self, req: &str) -> String {
        let _start = Instant::now();
        let response = self.inner.call(req);
        format!("{} (timed)", response)
    }
}

struct RequestMapper<S, F> {
    inner: S,
    mapper: F,
}

impl<S, F> RequestMapper<S, F> {
    fn new(inner: S, mapper: F) -> Self {
        RequestMapper { inner, mapper }
    }
}

impl<S, F> Service for RequestMapper<S, F>
where
    S: Service<Response = String>,
    F: Fn(&str) -> String,
{
    type Response = String;

    fn call(&self, req: &str) -> String {
        let mapped = (self.mapper)(req);
        self.inner.call(&mapped)
    }
}

fn compose_pipeline() -> String {
    let service = Logging::new(Timing::new(Echo), "APP");
    service.call("hello")
}
`,
    testCode: `let echo = Echo;
    assert_test_eq("echo", String::from("Echo: hello"), echo.call("hello"));
    assert_test_eq("echo world", String::from("Echo: world"), echo.call("world"));
    let logged = Logging::new(Echo, "TEST");
    assert_test_eq("logging echo", String::from("[TEST] Echo: hello"), logged.call("hello"));
    let timed = Timing::new(Echo);
    assert_test_eq("timing echo", String::from("Echo: hello (timed)"), timed.call("hello"));
    let full = Logging::new(Timing::new(Echo), "APP");
    assert_test_eq("full pipeline", String::from("[APP] Echo: hello (timed)"), full.call("hello"));
    let mapped = RequestMapper::new(Echo, |r: &str| r.to_uppercase());
    assert_test_eq("request mapper", String::from("Echo: HELLO"), mapped.call("hello"));
    let full_mapped = Logging::new(Timing::new(RequestMapper::new(Echo, |r: &str| format!("REQ:{}", r))), "SVC");
    assert_test_eq("full with mapper", String::from("[SVC] Echo: REQ:test (timed)"), full_mapped.call("test"));
    assert_test_eq("compose_pipeline", String::from("[APP] Echo: hello (timed)"), compose_pipeline());`,
    hints: [
      'For <code>Echo</code>, use <code>format!("Echo: {}", req)</code>. This is the base service — no wrapping, just echo.',
      'For <code>Logging</code>, call <code>self.inner.call(req)</code> first to get the inner response, then wrap it: <code>format!("[{}] {}", self.tag, response)</code>.',
      'For <code>Timing</code>, since tests need deterministic output, use <code>format!("{} (timed)", response)</code> rather than actual elapsed time. In production you would use <code>Instant::now()</code> and <code>.elapsed()</code>.',
      'For <code>RequestMapper</code>, apply the closure to transform the request: <code>let mapped = (self.mapper)(req)</code>, then pass <code>&amp;mapped</code> to <code>self.inner.call()</code>.',
    ],
    concepts: ['Service trait', 'middleware pattern', 'decorator composition', 'Tower architecture', 'separation of concerns'],
    successPatterns: [
      'impl Service for',
      'self\\.inner\\.call',
      'Logging::new',
      'Timing::new',
    ],
    testNames: [
      'Echo returns formatted request',
      'Echo with different input',
      'Logging wraps with tag',
      'Timing wraps with timing marker',
      'Full pipeline: Logging<Timing<Echo>>',
      'RequestMapper transforms input',
      'Full pipeline with RequestMapper',
      'compose_pipeline returns correct result',
    ],
  },

  'rust-type-state': {
    id: 'rust-type-state',
    language: 'rust',
    title: 'Type-State: Compile-Time State Machines',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>The Real Problem: Invalid State at Runtime</h3>

<p>Builders and state machines often rely on runtime checks: "did the user call <code>.url()</code> before <code>.build()</code>?" If not, you panic or return an error. But the programmer's mistake is known at <em>write time</em>, not run time. Why wait?</p>

<pre><code>// Runtime state machine (fragile):
let req = RequestBuilder::new()
    .build();   // OOPS: no URL, no method
                // Panics at runtime, not compile time</code></pre>

<h3>Type-State Pattern</h3>

<p>Use phantom type parameters to encode state in the type system. Transitions consume the old type and return a new one. The <code>.build()</code> method only exists on the type with all fields set:</p>

<pre><code>RequestBuilder&lt;NoUrl, NoMethod&gt;
    .url("...")       → RequestBuilder&lt;HasUrl, NoMethod&gt;
    .method("GET")    → RequestBuilder&lt;HasUrl, HasMethod&gt;
    .build()          → Request     // only available here!</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Make invalid states unrepresentable." If the type system encodes which transitions are legal, the compiler rejects invalid sequences. No runtime checks needed. No documentation needed. The API is its own specification.</blockquote>

<h3>Your Task</h3>
<p>Build a type-state <code>RequestBuilder</code> where <code>.build()</code> is only callable when both URL and method are set.</p>
`,
    starterCode: `// Type-State: Compile-Time State Machines
//
// The builder pattern with phantom types ensures that
// .build() can only be called when all required fields are set.

use std::marker::PhantomData;

/// State markers — zero-sized types used only at the type level.
struct NoUrl;
struct HasUrl;
struct NoMethod;
struct HasMethod;

/// The final request, produced only when builder is fully configured.
#[derive(Debug, PartialEq)]
struct Request {
    url: String,
    method: String,
    headers: Vec<(String, String)>,
}

/// A builder that tracks which fields have been set via type parameters.
/// U = URL state, M = Method state.
struct RequestBuilder<U, M> {
    url: Option<String>,
    method: Option<String>,
    headers: Vec<(String, String)>,
    _url_state: PhantomData<U>,
    _method_state: PhantomData<M>,
}

impl RequestBuilder<NoUrl, NoMethod> {
    /// Start building a request. Nothing is set yet.
    fn new() -> Self {
        todo!("return builder with None/empty fields and PhantomData")
    }
}

impl<M> RequestBuilder<NoUrl, M> {
    /// Set the URL. Transitions from NoUrl to HasUrl.
    /// Returns a NEW builder with different type parameter.
    fn url(self, url: &str) -> RequestBuilder<HasUrl, M> {
        todo!(
            "return RequestBuilder<HasUrl, M> with url set,
             carrying over method, headers"
        )
    }
}

impl<U> RequestBuilder<U, NoMethod> {
    /// Set the HTTP method. Transitions from NoMethod to HasMethod.
    fn method(self, method: &str) -> RequestBuilder<U, HasMethod> {
        todo!(
            "return RequestBuilder<U, HasMethod> with method set,
             carrying over url, headers"
        )
    }
}

impl<U, M> RequestBuilder<U, M> {
    /// Add a header. Available in ANY state — doesn't change state.
    fn header(self, key: &str, value: &str) -> RequestBuilder<U, M> {
        todo!("push header and return self with same type parameters")
    }
}

impl RequestBuilder<HasUrl, HasMethod> {
    /// Build the final request. ONLY available when both URL and method are set.
    /// This is the key insight: the type system prevents calling this too early.
    fn build(self) -> Request {
        todo!("construct Request from the builder fields, unwrapping Options")
    }
}
`,
    solutionCode: `use std::marker::PhantomData;

struct NoUrl;
struct HasUrl;
struct NoMethod;
struct HasMethod;

#[derive(Debug, PartialEq)]
struct Request {
    url: String,
    method: String,
    headers: Vec<(String, String)>,
}

struct RequestBuilder<U, M> {
    url: Option<String>,
    method: Option<String>,
    headers: Vec<(String, String)>,
    _url_state: PhantomData<U>,
    _method_state: PhantomData<M>,
}

impl RequestBuilder<NoUrl, NoMethod> {
    fn new() -> Self {
        RequestBuilder {
            url: None,
            method: None,
            headers: Vec::new(),
            _url_state: PhantomData,
            _method_state: PhantomData,
        }
    }
}

impl<M> RequestBuilder<NoUrl, M> {
    fn url(self, url: &str) -> RequestBuilder<HasUrl, M> {
        RequestBuilder {
            url: Some(url.to_string()),
            method: self.method,
            headers: self.headers,
            _url_state: PhantomData,
            _method_state: PhantomData,
        }
    }
}

impl<U> RequestBuilder<U, NoMethod> {
    fn method(self, method: &str) -> RequestBuilder<U, HasMethod> {
        RequestBuilder {
            url: self.url,
            method: Some(method.to_string()),
            headers: self.headers,
            _url_state: PhantomData,
            _method_state: PhantomData,
        }
    }
}

impl<U, M> RequestBuilder<U, M> {
    fn header(self, key: &str, value: &str) -> RequestBuilder<U, M> {
        let mut headers = self.headers;
        headers.push((key.to_string(), value.to_string()));
        RequestBuilder {
            url: self.url,
            method: self.method,
            headers,
            _url_state: PhantomData,
            _method_state: PhantomData,
        }
    }
}

impl RequestBuilder<HasUrl, HasMethod> {
    fn build(self) -> Request {
        Request {
            url: self.url.unwrap(),
            method: self.method.unwrap(),
            headers: self.headers,
        }
    }
}
`,
    testCode: `let req = RequestBuilder::new()
        .url("https://example.com")
        .method("GET")
        .build();
    assert_test_eq("basic build url", "https://example.com", req.url.as_str());
    assert_test_eq("basic build method", "GET", req.method.as_str());
    assert_test("basic build no headers", req.headers.is_empty());
    let req2 = RequestBuilder::new()
        .method("POST")
        .url("https://api.test/data")
        .header("Content-Type", "application/json")
        .build();
    assert_test_eq("reverse order url", "https://api.test/data", req2.url.as_str());
    assert_test_eq("reverse order method", "POST", req2.method.as_str());
    assert_test_eq("header count", 1usize, req2.headers.len());
    assert_test_eq("header key", "Content-Type", req2.headers[0].0.as_str());
    assert_test_eq("header value", "application/json", req2.headers[0].1.as_str());
    let req3 = RequestBuilder::new()
        .url("https://x.com")
        .header("A", "1")
        .method("PUT")
        .header("B", "2")
        .build();
    assert_test_eq("multi header count", 2usize, req3.headers.len());
    assert_test_eq("multi header method", "PUT", req3.method.as_str());`,
    hints: [
      'In <code>new()</code>, all <code>Option</code> fields are <code>None</code>, headers is <code>Vec::new()</code>. Both phantom fields are <code>PhantomData</code>. The type is <code>RequestBuilder&lt;NoUrl, NoMethod&gt;</code>.',
      'In <code>url()</code>, you consume <code>self</code> (type <code>RequestBuilder&lt;NoUrl, M&gt;</code>) and return a new <code>RequestBuilder&lt;HasUrl, M&gt;</code>. Carry over <code>self.method</code>, <code>self.headers</code>. The <code>M</code> parameter is preserved unchanged.',
      'In <code>header()</code>, the type parameters <code>U, M</code> don\'t change — adding a header doesn\'t change the state. Create a new builder with the same types and the header appended.',
      '<code>build()</code> is only implemented for <code>RequestBuilder&lt;HasUrl, HasMethod&gt;</code>. This means calling <code>.build()</code> on a builder missing URL or method is a <strong>compile error</strong>, not a runtime error. Use <code>.unwrap()</code> on the Options since they are guaranteed to be Some.',
    ],
    concepts: ['type-state pattern', 'phantom types', 'compile-time state machine', 'builder pattern', 'zero-cost abstractions'],
    successPatterns: [
      'url:\\s*None',
      'url:\\s*Some\\(',
      'self\\.url\\.unwrap\\(\\)',
      'method:\\s*Some\\(',
    ],
    testNames: [
      'Build with url then method: correct URL',
      'Build with url then method: correct method',
      'Build with no headers: empty',
      'Build with method then url: correct URL',
      'Build with method then url: correct method',
      'Headers are preserved',
      'Header key is correct',
      'Header value is correct',
      'Multiple headers across state transitions',
      'Method preserved across header additions',
    ],
  },

  'rust-gats': {
    id: 'rust-gats',
    language: 'rust',
    title: 'GATs: Lending Iterators & Lifetime Association',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Real Problem: Iterators That Borrow From Self</h3>

<p>Rust's standard <code>Iterator</code> trait has a fundamental limitation: <code>type Item</code> cannot borrow from the iterator itself. This means you can't write an iterator that yields references to its internal buffer — the references would need a lifetime tied to <code>&amp;self</code>, but the associated type has no way to express that.</p>

<pre><code>// This is IMPOSSIBLE with standard Iterator:
trait Iterator {
    type Item;  // no lifetime parameter!
    fn next(&amp;mut self) -&gt; Option&lt;Self::Item&gt;;
}
// Can't write type Item = &amp;[T]; — what lifetime?</code></pre>

<h3>GATs: Generic Associated Types</h3>

<p>Stable since Rust 1.65, GATs allow associated types to have generic parameters, including lifetimes:</p>

<pre><code>trait LendingIterator {
    type Item&lt;'a&gt; where Self: 'a;
    fn next&lt;'a&gt;(&amp;'a mut self) -&gt; Option&lt;Self::Item&lt;'a&gt;&gt;;
}
// Now Item can borrow from self — the lifetime is tied to the borrow!</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"GATs fill the gap between Iterator and streaming." They express relationships the old type system couldn't: an output type whose lifetime is tied to the input borrow. This enables zero-copy streaming, windowed iteration, and lending patterns that were previously impossible to express safely.</blockquote>

<h3>Your Task</h3>
<p>Implement a <code>LendingIterator</code> trait and a <code>Windows</code> iterator that yields overlapping slices from a buffer — each slice borrows from the iterator itself.</p>
`,
    starterCode: `// GATs: Lending Iterators & Lifetime Association
//
// Generic Associated Types let us express "the output borrows from self."
// This was impossible before Rust 1.65.

/// A lending iterator: each item borrows from the iterator itself.
/// The key difference from std::Iterator: Item has a lifetime parameter.
trait LendingIterator {
    type Item<'a> where Self: 'a;
    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
}

/// Yields overlapping windows of a fixed size from a slice.
/// Each window borrows from the internal data — this is WHY we need GATs.
struct Windows<'data, T> {
    data: &'data [T],
    window_size: usize,
    position: usize,
}

impl<'data, T> Windows<'data, T> {
    fn new(data: &'data [T], window_size: usize) -> Self {
        todo!("initialize with position = 0")
    }
}

impl<'data, T> LendingIterator for Windows<'data, T> {
    type Item<'a> = &'a [T] where Self: 'a;

    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>> {
        todo!(
            "if position + window_size <= data.len():
               return Some(&data[position..position+window_size]), advance position
             else: return None"
        )
    }
}

/// Counts how many items a lending iterator yields.
fn count_items<I: LendingIterator>(iter: &mut I) -> usize {
    todo!("loop calling next(), count until None")
}

/// Collects all windows as owned Vecs (converts borrowed slices to owned).
/// This demonstrates that you CAN collect from a lending iterator — you just
/// need to clone/copy the data.
fn collect_windows(data: &[i32], window_size: usize) -> Vec<Vec<i32>> {
    todo!(
        "create Windows iterator, loop over next(),
         convert each &[i32] to Vec<i32>, collect all"
    )
}

/// A lending iterator over chunks of mutable references.
/// Each chunk is a mutable borrow — can't exist simultaneously.
struct MutChunks<'data, T> {
    data: &'data mut [T],
    chunk_size: usize,
    position: usize,
}

impl<'data, T> MutChunks<'data, T> {
    fn new(data: &'data mut [T], chunk_size: usize) -> Self {
        todo!("initialize with position = 0")
    }
}

impl<'data, T> LendingIterator for MutChunks<'data, T> {
    type Item<'a> = &'a mut [T] where Self: 'a;

    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>> {
        todo!(
            "if position < data.len():
               compute end = min(position+chunk_size, data.len())
               use unsafe to reborrow a mutable slice of data[position..end]
               advance position
               return Some(slice)
             else: None"
        )
    }
}
`,
    solutionCode: `trait LendingIterator {
    type Item<'a> where Self: 'a;
    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
}

struct Windows<'data, T> {
    data: &'data [T],
    window_size: usize,
    position: usize,
}

impl<'data, T> Windows<'data, T> {
    fn new(data: &'data [T], window_size: usize) -> Self {
        Windows { data, window_size, position: 0 }
    }
}

impl<'data, T> LendingIterator for Windows<'data, T> {
    type Item<'a> = &'a [T] where Self: 'a;

    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>> {
        if self.position + self.window_size <= self.data.len() {
            let window = &self.data[self.position..self.position + self.window_size];
            self.position += 1;
            Some(window)
        } else {
            None
        }
    }
}

fn count_items<I: LendingIterator>(iter: &mut I) -> usize {
    let mut count = 0;
    while let Some(_) = iter.next() {
        count += 1;
    }
    count
}

fn collect_windows(data: &[i32], window_size: usize) -> Vec<Vec<i32>> {
    let mut windows = Windows::new(data, window_size);
    let mut result = Vec::new();
    while let Some(w) = windows.next() {
        result.push(w.to_vec());
    }
    result
}

struct MutChunks<'data, T> {
    data: &'data mut [T],
    chunk_size: usize,
    position: usize,
}

impl<'data, T> MutChunks<'data, T> {
    fn new(data: &'data mut [T], chunk_size: usize) -> Self {
        MutChunks { data, chunk_size, position: 0 }
    }
}

impl<'data, T> LendingIterator for MutChunks<'data, T> {
    type Item<'a> = &'a mut [T] where Self: 'a;

    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>> {
        if self.position >= self.data.len() {
            return None;
        }
        let end = std::cmp::min(self.position + self.chunk_size, self.data.len());
        let start = self.position;
        self.position = end;
        let ptr = self.data.as_mut_ptr();
        Some(unsafe { std::slice::from_raw_parts_mut(ptr.add(start), end - start) })
    }
}
`,
    testCode: `let data = [1, 2, 3, 4, 5];
    let mut w = Windows::new(&data, 3);
    assert_test_eq("window 1", Some(&[1, 2, 3][..]), w.next());
    assert_test_eq("window 2", Some(&[2, 3, 4][..]), w.next());
    assert_test_eq("window 3", Some(&[3, 4, 5][..]), w.next());
    assert_test_eq("window exhausted", None::<&[i32]>, w.next());
    let data2 = [10, 20, 30, 40, 50];
    let mut w2 = Windows::new(&data2, 2);
    assert_test_eq("count windows of 2 over 5", 4usize, count_items(&mut w2));
    let collected = collect_windows(&[1, 2, 3, 4], 2);
    assert_test_eq("collect window count", 3usize, collected.len());
    assert_test_eq("collect window 0", vec![1, 2], collected[0]);
    assert_test_eq("collect window 1", vec![2, 3], collected[1]);
    assert_test_eq("collect window 2", vec![3, 4], collected[2]);
    let mut arr = [10, 20, 30, 40, 50];
    let mut chunks = MutChunks::new(&mut arr, 2);
    if let Some(chunk) = chunks.next() {
        chunk[0] = 100;
    }
    if let Some(chunk) = chunks.next() {
        chunk[0] = 300;
    }
    drop(chunks);
    assert_test_eq("mut chunk modified idx 0", 100, arr[0]);
    assert_test_eq("mut chunk modified idx 2", 300, arr[2]);`,
    hints: [
      'For <code>Windows::next()</code>, check <code>self.position + self.window_size &lt;= self.data.len()</code>. Return a slice <code>&amp;self.data[self.position..self.position + self.window_size]</code> and then increment <code>self.position</code> by 1.',
      'For <code>count_items()</code>, use a <code>while let Some(_) = iter.next()</code> loop. You can\'t use a <code>for</code> loop because <code>LendingIterator</code> isn\'t <code>std::iter::Iterator</code>.',
      'For <code>collect_windows()</code>, call <code>.to_vec()</code> on each borrowed slice to convert <code>&amp;[i32]</code> into an owned <code>Vec&lt;i32&gt;</code>. This is the "escape hatch" from lending — clone the data to own it.',
      'For <code>MutChunks::next()</code>, you need <code>unsafe</code> because the borrow checker can\'t prove that consecutive mutable slices don\'t overlap. Use <code>self.data.as_mut_ptr()</code> and <code>std::slice::from_raw_parts_mut(ptr.add(start), len)</code>.',
    ],
    concepts: ['GATs', 'LendingIterator', 'lifetime association', 'windowed iteration', 'zero-copy streaming'],
    successPatterns: [
      "type Item<'a>",
      'LendingIterator',
      'where Self:',
      'from_raw_parts_mut',
    ],
    testNames: [
      'Windows yields first window',
      'Windows yields second window',
      'Windows yields third window',
      'Windows returns None when exhausted',
      'count_items counts windows correctly',
      'collect_windows returns correct count',
      'collect_windows first window is correct',
      'collect_windows second window is correct',
      'collect_windows third window is correct',
      'MutChunks mutation visible at index 0',
      'MutChunks mutation visible at index 2',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Module: Performance & Memory — "The fastest code is the code that doesn't run"
  // ─────────────────────────────────────────────────────────

  'rust-cache-friendly': {
    id: 'rust-cache-friendly',
    language: 'rust',
    title: 'Data-Oriented Design: AoS vs SoA',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Real Problem: Cache Misses Kill Performance</h3>

<p>Modern CPUs don't access memory one byte at a time. They load entire <strong>cache lines</strong> (typically 64 bytes). When you iterate over an array, if the next element is already in the cache line, access is nearly free. If it's in a different cache line, you wait ~100 cycles for the fetch.</p>

<p>This means <strong>how you lay out data matters more than the algorithm</strong> for many workloads.</p>

<h3>AoS vs SoA</h3>

<pre><code>// Array of Structs (AoS): each struct has ALL fields
struct Particle { x: f64, y: f64, vx: f64, vy: f64, mass: f64 }
Vec&lt;Particle&gt;
// Memory: [x,y,vx,vy,mass | x,y,vx,vy,mass | ...]
// Updating positions? You load mass into cache but never use it.

// Struct of Arrays (SoA): each field has its own array
struct Particles { xs: Vec&lt;f64&gt;, ys: Vec&lt;f64&gt;, vxs: Vec&lt;f64&gt;, vys: Vec&lt;f64&gt; }
// Memory: [x,x,x,...] [y,y,y,...] [vx,vx,vx,...] [vy,vy,vy,...]
// Updating positions? You only load x and vx — perfect cache utilization.</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"Data-oriented design: let the data access pattern drive the layout, not the object model." Entity Component Systems (ECS) in game engines, columnar databases (Parquet), and SIMD processing all use SoA for the same reason: sequential access to homogeneous data is what hardware is built for.</blockquote>

<h3>Your Task</h3>
<p>Implement both AoS and SoA layouts for a particle system. Show how the update loop differs and why SoA is more cache-friendly.</p>
`,
    starterCode: `// Data-Oriented Design: AoS vs SoA
//
// Array of Structs vs Struct of Arrays.
// Same data, different memory layout, different cache behavior.

/// Array of Structs: the traditional OOP layout.
#[derive(Debug, Clone, PartialEq)]
struct Particle {
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
}

/// Update positions for AoS: iterate over each particle.
/// Each cache line loads x, y, vx, vy together — not ideal if you only need x, vx.
fn update_positions_aos(particles: &mut Vec<Particle>, dt: f64) {
    todo!("for each particle: x += vx * dt, y += vy * dt")
}

/// Struct of Arrays: data-oriented layout.
/// Each field is a contiguous array — perfect for sequential access.
struct ParticlesSoA {
    xs: Vec<f64>,
    ys: Vec<f64>,
    vxs: Vec<f64>,
    vys: Vec<f64>,
}

impl ParticlesSoA {
    fn new() -> Self {
        todo!("create with empty Vecs")
    }

    fn len(&self) -> usize {
        todo!("return xs.len()")
    }

    fn push(&mut self, x: f64, y: f64, vx: f64, vy: f64) {
        todo!("push to each Vec")
    }

    /// Convert from AoS to SoA.
    fn from_aos(particles: &[Particle]) -> Self {
        todo!("iterate and split each field into separate Vecs")
    }

    /// Convert back to AoS (for comparison).
    fn to_aos(&self) -> Vec<Particle> {
        todo!("zip all arrays and build Particle structs")
    }
}

/// Update positions for SoA: iterate over xs and vxs together, then ys and vys.
/// Each inner loop touches only the arrays it needs — maximum cache utilization.
fn update_positions_soa(particles: &mut ParticlesSoA, dt: f64) {
    todo!(
        "for i in 0..len: xs[i] += vxs[i] * dt
         for i in 0..len: ys[i] += vys[i] * dt"
    )
}

/// Compute the average x position for both layouts.
fn average_x_aos(particles: &[Particle]) -> f64 {
    todo!("sum all x values, divide by count")
}

fn average_x_soa(particles: &ParticlesSoA) -> f64 {
    todo!("sum xs array, divide by count")
}
`,
    solutionCode: `#[derive(Debug, Clone, PartialEq)]
struct Particle {
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
}

fn update_positions_aos(particles: &mut Vec<Particle>, dt: f64) {
    for p in particles.iter_mut() {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
    }
}

struct ParticlesSoA {
    xs: Vec<f64>,
    ys: Vec<f64>,
    vxs: Vec<f64>,
    vys: Vec<f64>,
}

impl ParticlesSoA {
    fn new() -> Self {
        ParticlesSoA {
            xs: Vec::new(),
            ys: Vec::new(),
            vxs: Vec::new(),
            vys: Vec::new(),
        }
    }

    fn len(&self) -> usize {
        self.xs.len()
    }

    fn push(&mut self, x: f64, y: f64, vx: f64, vy: f64) {
        self.xs.push(x);
        self.ys.push(y);
        self.vxs.push(vx);
        self.vys.push(vy);
    }

    fn from_aos(particles: &[Particle]) -> Self {
        let mut soa = ParticlesSoA::new();
        for p in particles {
            soa.push(p.x, p.y, p.vx, p.vy);
        }
        soa
    }

    fn to_aos(&self) -> Vec<Particle> {
        (0..self.len())
            .map(|i| Particle {
                x: self.xs[i],
                y: self.ys[i],
                vx: self.vxs[i],
                vy: self.vys[i],
            })
            .collect()
    }
}

fn update_positions_soa(particles: &mut ParticlesSoA, dt: f64) {
    for i in 0..particles.len() {
        particles.xs[i] += particles.vxs[i] * dt;
    }
    for i in 0..particles.len() {
        particles.ys[i] += particles.vys[i] * dt;
    }
}

fn average_x_aos(particles: &[Particle]) -> f64 {
    if particles.is_empty() { return 0.0; }
    let sum: f64 = particles.iter().map(|p| p.x).sum();
    sum / particles.len() as f64
}

fn average_x_soa(particles: &ParticlesSoA) -> f64 {
    if particles.len() == 0 { return 0.0; }
    let sum: f64 = particles.xs.iter().sum();
    sum / particles.len() as f64
}
`,
    testCode: `let mut aos = vec![
        Particle { x: 0.0, y: 0.0, vx: 1.0, vy: 2.0 },
        Particle { x: 10.0, y: 20.0, vx: -1.0, vy: 0.5 },
    ];
    update_positions_aos(&mut aos, 1.0);
    assert_test_eq("aos p0 x", 1.0f64, aos[0].x);
    assert_test_eq("aos p0 y", 2.0f64, aos[0].y);
    assert_test_eq("aos p1 x", 9.0f64, aos[1].x);
    assert_test_eq("aos p1 y", 20.5f64, aos[1].y);
    let mut soa = ParticlesSoA::new();
    soa.push(0.0, 0.0, 1.0, 2.0);
    soa.push(10.0, 20.0, -1.0, 0.5);
    update_positions_soa(&mut soa, 1.0);
    assert_test_eq("soa x0", 1.0f64, soa.xs[0]);
    assert_test_eq("soa y0", 2.0f64, soa.ys[0]);
    assert_test_eq("soa x1", 9.0f64, soa.xs[1]);
    assert_test_eq("soa y1", 20.5f64, soa.ys[1]);
    let aos_orig = vec![
        Particle { x: 1.0, y: 2.0, vx: 3.0, vy: 4.0 },
        Particle { x: 5.0, y: 6.0, vx: 7.0, vy: 8.0 },
    ];
    let soa_conv = ParticlesSoA::from_aos(&aos_orig);
    assert_test_eq("from_aos len", 2usize, soa_conv.len());
    let back = soa_conv.to_aos();
    assert_test_eq("roundtrip", aos_orig, back);
    assert_test_eq("avg_x_aos", 5.0f64, average_x_aos(&[
        Particle { x: 0.0, y: 0.0, vx: 0.0, vy: 0.0 },
        Particle { x: 10.0, y: 0.0, vx: 0.0, vy: 0.0 },
    ]));
    let mut soa_avg = ParticlesSoA::new();
    soa_avg.push(0.0, 0.0, 0.0, 0.0);
    soa_avg.push(10.0, 0.0, 0.0, 0.0);
    assert_test_eq("avg_x_soa", 5.0f64, average_x_soa(&soa_avg));`,
    hints: [
      'For <code>update_positions_aos</code>, iterate with <code>particles.iter_mut()</code> and update <code>p.x += p.vx * dt</code> and <code>p.y += p.vy * dt</code> for each particle.',
      'For <code>from_aos</code>, iterate over the AoS slice and push each field into the corresponding SoA Vec. For <code>to_aos</code>, iterate over indices and reconstruct each Particle.',
      'For <code>update_positions_soa</code>, use TWO separate loops: first update all x positions, then all y positions. This maximizes cache line utilization — each loop touches only two arrays.',
      'For <code>average_x_aos</code>, use <code>.iter().map(|p| p.x).sum()</code>. For SoA, use <code>.xs.iter().sum()</code> — notice how SoA makes this simpler and more cache-friendly since it only touches the xs array.',
    ],
    concepts: ['AoS vs SoA', 'cache lines', 'data-oriented design', 'ECS', 'memory layout', 'spatial locality'],
    successPatterns: [
      'ParticlesSoA',
      'xs\\.push|xs\\[',
      'iter_mut\\(\\)',
      'from_aos|to_aos',
    ],
    testNames: [
      'AoS update: particle 0 x position',
      'AoS update: particle 0 y position',
      'AoS update: particle 1 x position',
      'AoS update: particle 1 y position',
      'SoA update: x[0] position',
      'SoA update: y[0] position',
      'SoA update: x[1] position',
      'SoA update: y[1] position',
      'AoS to SoA conversion preserves length',
      'AoS -> SoA -> AoS roundtrip is lossless',
      'Average X for AoS is correct',
      'Average X for SoA is correct',
    ],
  },

  'rust-arena-allocation': {
    id: 'rust-arena-allocation',
    language: 'rust',
    title: 'Arena Allocation: The Best Allocator Is No Allocator',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Real Problem: Death by a Thousand Allocations</h3>

<p>General-purpose allocators (malloc/free) are optimized for flexibility, not speed. Every allocation searches free lists, updates metadata, and may acquire locks. For workloads that create many small objects (parsers, compilers, game entities), this overhead dominates.</p>

<pre><code>// The slow way: individual heap allocations
for _ in 0..10_000 {
    let node = Box::new(AstNode { ... });  // 10,000 malloc calls
    nodes.push(node);
}
// Then 10,000 free calls when nodes is dropped</code></pre>

<h3>Arena Allocation</h3>

<p>An arena allocates a large chunk upfront and hands out pointers into it. Individual objects are never freed — the entire arena is freed at once. This gives you:</p>

<ul>
<li><strong>O(1) allocation</strong>: just bump a pointer</li>
<li><strong>Zero individual drops</strong>: one bulk deallocation</li>
<li><strong>Cache-friendly</strong>: objects are contiguous in memory</li>
<li><strong>Safe references</strong>: all references last as long as the arena</li>
</ul>

<h3>The Taste Principle</h3>

<blockquote>"The fastest allocation is the one you don't do." Arenas trade individual deallocation for bulk deallocation. For phase-based workloads (parse, compile, done), this is optimal.</blockquote>

<h3>Your Task</h3>
<p>Build a typed arena using <code>RefCell&lt;Vec&lt;T&gt;&gt;</code> that hands out references with the arena's lifetime.</p>
`,
    starterCode: `// Arena Allocation: The Best Allocator Is No Allocator
//
// Bulk allocation, zero individual drops, cache-friendly.
// Uses RefCell<Vec<T>> for interior mutability.

use std::cell::RefCell;

/// A typed arena that allocates objects and returns references to them.
/// All references live as long as the arena.
struct Arena<T> {
    chunks: RefCell<Vec<Vec<T>>>,
    chunk_capacity: usize,
}

impl<T> Arena<T> {
    /// Create an arena where each internal chunk can hold \`chunk_capacity\` items.
    fn new(chunk_capacity: usize) -> Self {
        todo!("initialize with one empty chunk pre-allocated")
    }

    /// Allocate a value in the arena and return a reference to it.
    /// The reference lives as long as the arena (&self lifetime).
    fn alloc(&self, val: T) -> &T {
        todo!(
            "1. Borrow chunks mutably
             2. If current chunk is full, push a new chunk
             3. Push val to current chunk
             4. Return a reference to the just-pushed element
             NOTE: Use unsafe to extend the lifetime of the reference"
        )
    }

    /// Returns the total number of allocated objects.
    fn count(&self) -> usize {
        todo!("sum the lengths of all chunks")
    }
}

/// Demonstrates arena usage: allocate many strings, collect references.
fn arena_demo() -> Vec<String> {
    todo!(
        "1. Create Arena<String> with capacity 4
         2. Allocate 6 strings
         3. Collect the references into a Vec<String> by cloning
         4. Return the Vec"
    )
}

/// A simple tree node that references other nodes in the same arena.
/// This pattern is common in compilers and interpreters.
#[derive(Debug)]
struct TreeNode<'arena> {
    value: i32,
    children: Vec<&'arena TreeNode<'arena>>,
}

/// Build a tree using arena allocation.
/// All nodes live in the arena — no Box, no Rc, just references.
fn build_tree<'a>(arena: &'a Arena<TreeNode<'a>>) -> &'a TreeNode<'a> {
    todo!(
        "1. Allocate leaf nodes (value: 1, 2, 3) with empty children
         2. Allocate root (value: 0) with children pointing to the leaves
         3. Return &root"
    )
}
`,
    solutionCode: `use std::cell::RefCell;

struct Arena<T> {
    chunks: RefCell<Vec<Vec<T>>>,
    chunk_capacity: usize,
}

impl<T> Arena<T> {
    fn new(chunk_capacity: usize) -> Self {
        Arena {
            chunks: RefCell::new(vec![Vec::with_capacity(chunk_capacity)]),
            chunk_capacity,
        }
    }

    fn alloc(&self, val: T) -> &T {
        let mut chunks = self.chunks.borrow_mut();
        let needs_new_chunk = {
            let last = chunks.last().unwrap();
            last.len() >= self.chunk_capacity
        };
        if needs_new_chunk {
            chunks.push(Vec::with_capacity(self.chunk_capacity));
        }
        let last = chunks.last_mut().unwrap();
        last.push(val);
        let reference = last.last().unwrap();
        unsafe { &*(reference as *const T) }
    }

    fn count(&self) -> usize {
        let chunks = self.chunks.borrow();
        chunks.iter().map(|c| c.len()).sum()
    }
}

fn arena_demo() -> Vec<String> {
    let arena = Arena::<String>::new(4);
    let refs: Vec<&String> = (0..6)
        .map(|i| arena.alloc(format!("item_{}", i)))
        .collect();
    refs.into_iter().map(|s| s.clone()).collect()
}

#[derive(Debug)]
struct TreeNode<'arena> {
    value: i32,
    children: Vec<&'arena TreeNode<'arena>>,
}

fn build_tree<'a>(arena: &'a Arena<TreeNode<'a>>) -> &'a TreeNode<'a> {
    let leaf1 = arena.alloc(TreeNode { value: 1, children: vec![] });
    let leaf2 = arena.alloc(TreeNode { value: 2, children: vec![] });
    let leaf3 = arena.alloc(TreeNode { value: 3, children: vec![] });
    let root = arena.alloc(TreeNode {
        value: 0,
        children: vec![leaf1, leaf2, leaf3],
    });
    root
}
`,
    testCode: `let arena: Arena<i32> = Arena::new(4);
    let r1 = arena.alloc(10);
    let r2 = arena.alloc(20);
    let r3 = arena.alloc(30);
    assert_test_eq("alloc 1", &10, r1);
    assert_test_eq("alloc 2", &20, r2);
    assert_test_eq("alloc 3", &30, r3);
    assert_test_eq("count 3", 3usize, arena.count());
    let r4 = arena.alloc(40);
    let r5 = arena.alloc(50);
    assert_test_eq("count 5 (spans chunks)", 5usize, arena.count());
    assert_test_eq("alloc 4 after chunk boundary", &40, r4);
    assert_test_eq("alloc 5 after chunk boundary", &50, r5);
    let demo = arena_demo();
    assert_test_eq("demo len", 6usize, demo.len());
    assert_test_eq("demo first", String::from("item_0"), demo[0]);
    assert_test_eq("demo last", String::from("item_5"), demo[5]);
    let tree_arena: Arena<TreeNode> = Arena::new(8);
    let root = build_tree(&tree_arena);
    assert_test_eq("tree root value", 0i32, root.value);
    assert_test_eq("tree children count", 3usize, root.children.len());
    assert_test_eq("tree child 0", 1i32, root.children[0].value);
    assert_test_eq("tree child 2", 3i32, root.children[2].value);`,
    hints: [
      'In <code>new()</code>, initialize <code>chunks</code> with <code>vec![Vec::with_capacity(chunk_capacity)]</code> to pre-allocate one chunk.',
      'In <code>alloc()</code>, borrow the chunks mutably. Check if the last chunk is full (<code>len() >= chunk_capacity</code>). If so, push a new <code>Vec::with_capacity()</code>. Push the value to the last chunk, then use <code>unsafe { &amp;*(reference as *const T) }</code> to extend the reference lifetime.',
      'The <code>unsafe</code> in <code>alloc()</code> is sound because: (1) the Vec never reallocates once full (we create a new chunk instead), and (2) the reference lives as long as the arena since chunks are never dropped while the arena lives.',
      'For <code>build_tree()</code>, allocate leaf nodes first (they have empty children vecs), then allocate the root node with children pointing to the leaves. All nodes live in the same arena, so references are valid for the same lifetime.',
    ],
    concepts: ['arena allocation', 'bulk allocation', 'cache locality', 'RefCell', 'lifetime extension', 'zero-cost trees'],
    successPatterns: [
      'RefCell::new',
      'as \\*const',
      'with_capacity',
      'Arena<',
    ],
    testNames: [
      'Arena alloc returns correct value (1)',
      'Arena alloc returns correct value (2)',
      'Arena alloc returns correct value (3)',
      'Arena count after 3 allocs',
      'Arena count spans chunk boundaries',
      'Arena alloc works across chunks (4)',
      'Arena alloc works across chunks (5)',
      'arena_demo returns 6 items',
      'arena_demo first item is correct',
      'arena_demo last item is correct',
      'Tree root value is 0',
      'Tree has 3 children',
      'Tree child 0 value is 1',
      'Tree child 2 value is 3',
    ],
  },

  'rust-simd-basics': {
    id: 'rust-simd-basics',
    language: 'rust',
    title: 'SIMD Thinking: Data Parallelism by Hand',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>The Real Problem: Processing One Element at a Time</h3>

<p>Scalar code processes one value per instruction. But CPUs have SIMD registers (128-bit SSE, 256-bit AVX, 512-bit AVX-512) that can process 4, 8, or 16 values <em>simultaneously</em>. A 16-byte SIMD register can XOR sixteen u8 values in a single instruction — 16x throughput.</p>

<pre><code>// Scalar: 16 iterations, 16 instructions
for i in 0..16 { result[i] = a[i] ^ b[i]; }

// SIMD: 1 iteration, 1 instruction (conceptually)
result = _mm_xor_si128(a, b);  // all 16 bytes at once</code></pre>

<h3>SIMD Thinking Without std::simd</h3>

<p>Since <code>std::simd</code> is nightly-only, we'll teach the <em>mental model</em> using fixed-size arrays. The key insight: <strong>operate on arrays as single units</strong>. Don't think "loop over elements" — think "apply operation to the whole vector."</p>

<h3>The Taste Principle</h3>

<blockquote>"Think in vectors, not scalars." The SIMD mindset transforms how you structure algorithms: you work on arrays of values rather than individual values. Even without hardware SIMD, this often leads to better cache performance and auto-vectorization.</blockquote>

<h3>Your Task</h3>
<p>Implement vectorized operations on <code>[u8; 16]</code> arrays: add, xor, mask, and search. Process all 16 elements as a unit.</p>
`,
    starterCode: `// SIMD Thinking: Data Parallelism by Hand
//
// Process [u8; 16] arrays as single units.
// This is the mental model behind real SIMD instructions.

type Lane = [u8; 16];

/// Element-wise addition with wrapping (overflow wraps to 0).
/// Simulates: _mm_add_epi8 (SSE2)
fn lane_add(a: &Lane, b: &Lane) -> Lane {
    todo!("for each i: result[i] = a[i].wrapping_add(b[i])")
}

/// Element-wise XOR.
/// Simulates: _mm_xor_si128 (SSE2)
fn lane_xor(a: &Lane, b: &Lane) -> Lane {
    todo!("for each i: result[i] = a[i] ^ b[i]")
}

/// Element-wise comparison: produces a mask where each byte is
/// 0xFF if a[i] == b[i], 0x00 otherwise.
/// Simulates: _mm_cmpeq_epi8 (SSE2)
fn lane_cmpeq(a: &Lane, b: &Lane) -> Lane {
    todo!("for each i: result[i] = if a[i] == b[i] { 0xFF } else { 0x00 }")
}

/// Reduce: count how many bytes in the lane are non-zero.
/// Simulates: _mm_movemask_epi8 + popcnt (SSE2)
fn lane_count_nonzero(a: &Lane) -> u32 {
    todo!("count elements where a[i] != 0")
}

/// Saturating add: adds but clamps at 255 instead of wrapping.
/// Simulates: _mm_adds_epu8 (SSE2)
fn lane_adds(a: &Lane, b: &Lane) -> Lane {
    todo!("for each i: result[i] = a[i].saturating_add(b[i])")
}

/// Select: use mask to choose between two lanes.
/// Where mask[i] is 0xFF, take from a; where 0x00, take from b.
/// Simulates: _mm_blendv_epi8 (SSE4.1)
fn lane_select(mask: &Lane, a: &Lane, b: &Lane) -> Lane {
    todo!("for each i: result[i] = if mask[i] != 0 { a[i] } else { b[i] }")
}

/// Find the index of the first occurrence of \`needle\` in the lane.
/// Returns None if not found. Uses lane_cmpeq internally.
fn lane_find(haystack: &Lane, needle: u8) -> Option<usize> {
    todo!(
        "1. Create a lane filled with needle
         2. Use lane_cmpeq to find matches
         3. Find first non-zero index"
    )
}

/// Apply a simple byte cipher: XOR each byte with a repeating key pattern.
fn lane_cipher(data: &Lane, key: &Lane) -> Lane {
    todo!("just use lane_xor — XOR cipher is its own inverse")
}
`,
    solutionCode: `type Lane = [u8; 16];

fn lane_add(a: &Lane, b: &Lane) -> Lane {
    let mut result = [0u8; 16];
    for i in 0..16 {
        result[i] = a[i].wrapping_add(b[i]);
    }
    result
}

fn lane_xor(a: &Lane, b: &Lane) -> Lane {
    let mut result = [0u8; 16];
    for i in 0..16 {
        result[i] = a[i] ^ b[i];
    }
    result
}

fn lane_cmpeq(a: &Lane, b: &Lane) -> Lane {
    let mut result = [0u8; 16];
    for i in 0..16 {
        result[i] = if a[i] == b[i] { 0xFF } else { 0x00 };
    }
    result
}

fn lane_count_nonzero(a: &Lane) -> u32 {
    let mut count = 0u32;
    for i in 0..16 {
        if a[i] != 0 {
            count += 1;
        }
    }
    count
}

fn lane_adds(a: &Lane, b: &Lane) -> Lane {
    let mut result = [0u8; 16];
    for i in 0..16 {
        result[i] = a[i].saturating_add(b[i]);
    }
    result
}

fn lane_select(mask: &Lane, a: &Lane, b: &Lane) -> Lane {
    let mut result = [0u8; 16];
    for i in 0..16 {
        result[i] = if mask[i] != 0 { a[i] } else { b[i] };
    }
    result
}

fn lane_find(haystack: &Lane, needle: u8) -> Option<usize> {
    let needle_lane = [needle; 16];
    let mask = lane_cmpeq(haystack, &needle_lane);
    for i in 0..16 {
        if mask[i] != 0 {
            return Some(i);
        }
    }
    None
}

fn lane_cipher(data: &Lane, key: &Lane) -> Lane {
    lane_xor(data, key)
}
`,
    testCode: `let a: Lane = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    let b: Lane = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    let sum = lane_add(&a, &b);
    assert_test_eq("add uniform", [17u8; 16], sum);
    let wrap_a: Lane = [200; 16];
    let wrap_b: Lane = [100; 16];
    let wrap_sum = lane_add(&wrap_a, &wrap_b);
    assert_test_eq("add wrapping", [44u8; 16], wrap_sum);
    let x = lane_xor(&a, &b);
    assert_test_eq("xor [0]", 17u8, x[0]);
    let x2 = lane_xor(&a, &a);
    assert_test_eq("xor self is zero", [0u8; 16], x2);
    let eq = lane_cmpeq(&a, &a);
    assert_test_eq("cmpeq identical", [0xFFu8; 16], eq);
    let neq = lane_cmpeq(&a, &b);
    assert_test_eq("cmpeq different count", 0u32, lane_count_nonzero(&neq));
    let sat = lane_adds(&[250; 16], &[10; 16]);
    assert_test_eq("saturating add clamps", [255u8; 16], sat);
    let mask: Lane = [0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0];
    let sel = lane_select(&mask, &a, &b);
    assert_test_eq("select idx0 from a", 1u8, sel[0]);
    assert_test_eq("select idx1 from b", 15u8, sel[1]);
    let haystack: Lane = [0, 0, 0, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    assert_test_eq("find 42", Some(3usize), lane_find(&haystack, 42));
    assert_test_eq("find missing", None::<usize>, lane_find(&haystack, 99));
    let key: Lane = [0xAA; 16];
    let encrypted = lane_cipher(&a, &key);
    let decrypted = lane_cipher(&encrypted, &key);
    assert_test_eq("cipher roundtrip", a, decrypted);`,
    hints: [
      'All operations follow the same pattern: create <code>let mut result = [0u8; 16];</code>, loop <code>for i in 0..16</code>, compute <code>result[i]</code>, return <code>result</code>. The compiler can auto-vectorize these loops into actual SIMD instructions.',
      'Use <code>.wrapping_add()</code> for <code>lane_add</code> (overflow wraps around) and <code>.saturating_add()</code> for <code>lane_adds</code> (overflow clamps at 255). These correspond to different SIMD instructions.',
      'For <code>lane_find()</code>, first create a lane filled with the needle: <code>[needle; 16]</code>. Then use <code>lane_cmpeq</code> to get a mask of matches. Then find the first index where the mask is non-zero.',
      'XOR cipher is its own inverse: <code>(data ^ key) ^ key == data</code>. So <code>lane_cipher</code> is just <code>lane_xor</code>. This is how real stream ciphers (RC4, ChaCha20) work at the byte level.',
    ],
    concepts: ['SIMD', 'data parallelism', 'lane operations', 'auto-vectorization', 'wrapping vs saturating arithmetic'],
    successPatterns: [
      '\\.wrapping_add\\(b\\[i\\]\\);',
      '\\.saturating_add\\(b\\[i\\]\\);',
      'let mut result = \\[0u8; 16\\]',
      'lane_cmpeq\\(haystack',
    ],
    testNames: [
      'lane_add produces uniform sum',
      'lane_add wraps on overflow',
      'lane_xor produces correct result',
      'lane_xor with self is zero',
      'lane_cmpeq identical lanes all 0xFF',
      'lane_cmpeq different lanes no matches',
      'lane_adds saturates at 255',
      'lane_select picks from a where mask is set',
      'lane_select picks from b where mask is clear',
      'lane_find locates needle at index 3',
      'lane_find returns None for missing needle',
      'XOR cipher roundtrip recovers original',
    ],
  },

  'rust-zero-copy': {
    id: 'rust-zero-copy',
    language: 'rust',
    title: 'Zero-Copy Parsing: The Fastest Operation Is None',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Real Problem: Parsing by Copying</h3>

<p>The typical CSV parser allocates a new String for every field. For a 1GB file with 10 million rows and 10 columns, that's 100 million allocations — each one calling malloc, copying bytes, and eventually calling free.</p>

<pre><code>// The allocating approach (slow):
fn parse_field(input: &amp;str) -&gt; String {
    input.to_string()  // COPIES every field into a new heap allocation
}
// 100 million fields × 1 allocation each = slow</code></pre>

<h3>Zero-Copy: Borrow, Don't Own</h3>

<p>If the original input string lives long enough, we can return <em>slices into it</em> instead of copying. A <code>&amp;str</code> is just a pointer and a length — no allocation, no copy, no deallocation.</p>

<pre><code>// The zero-copy approach (fast):
fn parse_field&lt;'a&gt;(input: &amp;'a str) -&gt; &amp;'a str {
    input  // returns a VIEW into the original data
}
// 100 million fields × 0 allocations each = fast</code></pre>

<h3>The Taste Principle</h3>

<blockquote>"The fastest operation is the one you don't do." Every allocation you skip is a malloc + memcpy + free you don't pay for. Rust's lifetime system makes zero-copy parsing <em>safe</em> — the compiler proves that your slices don't outlive the source data.</blockquote>

<h3>Your Task</h3>
<p>Implement a zero-copy CSV parser that returns <code>&amp;str</code> slices into the original input. No allocations for field values.</p>
`,
    starterCode: `// Zero-Copy Parsing: The Fastest Operation Is None
//
// Parse CSV without copying field values.
// Return &str slices into the original input.

/// Parse a single CSV line into fields, returning slices into the input.
/// Fields are separated by commas. No quoting support needed.
fn parse_line<'a>(line: &'a str) -> Vec<&'a str> {
    todo!("split by ',' and trim whitespace from each field")
}

/// Parse an entire CSV string into rows of fields.
/// Returns Vec<Vec<&str>> — every &str is a zero-copy slice of the input.
fn parse_csv<'a>(input: &'a str) -> Vec<Vec<&'a str>> {
    todo!("split by newlines, parse each non-empty line")
}

/// Find all values in a specific column (by index).
/// Returns slices into the original input.
fn column<'a>(rows: &[Vec<&'a str>], col: usize) -> Vec<&'a str> {
    todo!("collect row[col] for each row that has enough columns")
}

/// Find rows where a specific column matches a predicate.
/// Returns the matching rows (still zero-copy slices).
fn filter_rows<'a, F>(rows: &[Vec<&'a str>], col: usize, pred: F) -> Vec<Vec<&'a str>>
where
    F: Fn(&str) -> bool,
{
    todo!("keep rows where pred(row[col]) is true")
}

/// Demonstrate that all returned slices point into the original string.
/// Returns true if every field slice is a sub-slice of the input.
fn verify_zero_copy(input: &str, rows: &[Vec<&str>]) -> bool {
    todo!(
        "for every field in every row, check that the field's pointer
         falls within the input string's memory range"
    )
}

/// Parse CSV with a header row. Returns (headers, data_rows).
fn parse_with_header<'a>(input: &'a str) -> (Vec<&'a str>, Vec<Vec<&'a str>>) {
    todo!(
        "parse all rows, split off the first row as headers,
         return (headers, remaining_rows)"
    )
}
`,
    solutionCode: `fn parse_line<'a>(line: &'a str) -> Vec<&'a str> {
    line.split(',').map(|field| field.trim()).collect()
}

fn parse_csv<'a>(input: &'a str) -> Vec<Vec<&'a str>> {
    input
        .lines()
        .filter(|line| !line.trim().is_empty())
        .map(|line| parse_line(line))
        .collect()
}

fn column<'a>(rows: &[Vec<&'a str>], col: usize) -> Vec<&'a str> {
    rows.iter()
        .filter_map(|row| row.get(col).copied())
        .collect()
}

fn filter_rows<'a, F>(rows: &[Vec<&'a str>], col: usize, pred: F) -> Vec<Vec<&'a str>>
where
    F: Fn(&str) -> bool,
{
    rows.iter()
        .filter(|row| row.get(col).map_or(false, |val| pred(val)))
        .cloned()
        .collect()
}

fn verify_zero_copy(input: &str, rows: &[Vec<&str>]) -> bool {
    let input_start = input.as_ptr() as usize;
    let input_end = input_start + input.len();
    for row in rows {
        for field in row {
            let field_start = field.as_ptr() as usize;
            let field_end = field_start + field.len();
            if field.is_empty() { continue; }
            if field_start < input_start || field_end > input_end {
                return false;
            }
        }
    }
    true
}

fn parse_with_header<'a>(input: &'a str) -> (Vec<&'a str>, Vec<Vec<&'a str>>) {
    let mut rows = parse_csv(input);
    if rows.is_empty() {
        return (vec![], vec![]);
    }
    let header = rows.remove(0);
    (header, rows)
}
`,
    testCode: `let line = "alice, 30, engineer";
    let fields = parse_line(line);
    assert_test_eq("parse_line count", 3usize, fields.len());
    assert_test_eq("parse_line field 0", "alice", fields[0]);
    assert_test_eq("parse_line field 1", "30", fields[1]);
    assert_test_eq("parse_line field 2", "engineer", fields[2]);
    let csv = "name,age,role\nalice,30,engineer\nbob,25,designer\ncarol,35,manager";
    let rows = parse_csv(csv);
    assert_test_eq("parse_csv row count", 4usize, rows.len());
    assert_test_eq("parse_csv header", vec!["name", "age", "role"], rows[0]);
    let ages = column(&rows[1..], 1);
    assert_test_eq("column ages", vec!["30", "25", "35"], ages);
    let seniors = filter_rows(&rows[1..], 1, |age| {
        age.parse::<u32>().map_or(false, |a| a >= 30)
    });
    assert_test_eq("filter seniors count", 2usize, seniors.len());
    assert_test_eq("filter senior 0 name", "alice", seniors[0][0]);
    assert_test_eq("filter senior 1 name", "carol", seniors[1][0]);
    assert_test("zero copy verified", verify_zero_copy(csv, &rows));
    let (header, data) = parse_with_header(csv);
    assert_test_eq("header count", 3usize, header.len());
    assert_test_eq("header 0", "name", header[0]);
    assert_test_eq("data row count", 3usize, data.len());
    assert_test_eq("data row 0 col 0", "alice", data[0][0]);`,
    hints: [
      'For <code>parse_line()</code>, use <code>line.split(\',\').map(|f| f.trim()).collect()</code>. The <code>trim()</code> method returns a <code>&amp;str</code> that is a sub-slice of the original — still zero-copy.',
      'For <code>parse_csv()</code>, use <code>input.lines()</code> to split by newline, filter out empty lines with <code>.filter(|l| !l.trim().is_empty())</code>, and map each line through <code>parse_line</code>.',
      'For <code>verify_zero_copy()</code>, use <code>.as_ptr() as usize</code> to get the memory address of each field slice. Check that it falls within <code>input.as_ptr()..input.as_ptr()+input.len()</code>. This proves the fields are sub-slices of the input.',
      'For <code>filter_rows()</code>, use <code>rows.iter().filter(|row| row.get(col).map_or(false, |v| pred(v))).cloned().collect()</code>. The <code>.cloned()</code> clones the <code>Vec&lt;&amp;str&gt;</code> (cheap — just copies pointers), not the strings themselves.',
    ],
    concepts: ['zero-copy parsing', 'lifetimes', 'string slices', 'memory efficiency', 'borrow not own'],
    successPatterns: [
      "parse_line|parse_csv",
      "\\.split\\('",
      "as_ptr",
      "filter_map|filter",
    ],
    testNames: [
      'parse_line splits into correct count',
      'parse_line field 0 is alice',
      'parse_line field 1 is 30',
      'parse_line field 2 is engineer',
      'parse_csv parses all rows',
      'parse_csv header row is correct',
      'column extracts ages correctly',
      'filter_rows finds 2 seniors',
      'filter_rows first senior is alice',
      'filter_rows second senior is carol',
      'verify_zero_copy confirms no copies',
      'parse_with_header extracts header',
      'parse_with_header correct header field',
      'parse_with_header correct data count',
      'parse_with_header correct data field',
    ],
  },
};
