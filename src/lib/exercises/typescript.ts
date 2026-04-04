import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  // ─── Module 1: Type-Driven Design ─────────────────────────────────────
  // "Let the compiler think for you"

  'ts-discriminated-unions': {
    id: 'ts-discriminated-unions',
    language: 'typescript',
    title: 'Make Illegal States Unrepresentable',
    difficulty: 'beginner',
    order: 1,
    description: `
<h3>The Ugly Way</h3>
<p>Here is how an object-oriented programmer models shapes:</p>
<pre><code>class Shape {
  type: string;
  radius?: number;
  w?: number;
  h?: number;
  base?: number;
  height?: number;
}

function area(shape: Shape): number {
  if (shape.type === 'circle') {
    return Math.PI * shape.radius! * shape.radius!;  // pray it exists
  } else if (shape.type === 'rect') {
    return shape.w! * shape.h!;                       // more prayer
  }
  return 0; // silently wrong for new shapes
}</code></pre>

<h3>Why It Is Bad</h3>
<p>This design allows <strong>illegal states</strong>. Nothing prevents creating <code>{ type: 'circle', w: 5 }</code> &mdash; a circle with width but no radius. Every property is optional because different shapes use different fields. The <code>!</code> operator (non-null assertion) silences the compiler instead of working with it. And the worst part: if you add a <code>'triangle'</code> shape, <strong>nothing forces you to handle it</strong> &mdash; the function silently returns 0.</p>

<p>John Ousterhout calls this <em>accidental complexity</em>: complexity that comes from how you chose to represent the problem, not from the problem itself. The problem is simple &mdash; "shapes have different fields" &mdash; but the representation makes it error-prone.</p>

<h3>The Beautiful Way: Discriminated Unions</h3>
<pre><code>type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number }
  | { kind: 'triangle'; base: number; height: number };</code></pre>

<p>Now <strong>illegal states are unrepresentable</strong>. A circle MUST have a radius and CANNOT have width/height. A rectangle MUST have both dimensions. The <code>kind</code> field is the <em>discriminant</em> &mdash; TypeScript uses it to narrow the type inside each branch of a <code>switch</code>, giving you autocompletion and compile-time safety for free.</p>

<p>This idea comes from the ML family of languages (OCaml, Haskell, F#) and was articulated by Yaron Minsky: <em>"Make illegal states unrepresentable."</em> It is the single most valuable design principle in type-driven development. When your types cannot represent bugs, your program cannot contain them.</p>

<blockquote><strong>Taste principle (Ousterhout):</strong> "Complexity is anything related to the structure of a system that makes it hard to understand and modify." Discriminated unions eliminate an entire class of complexity &mdash; the kind where you have to keep a mental model of which fields are valid for which variant.</blockquote>

<blockquote><strong>Taste principle (Wadler):</strong> Types are not bureaucracy. They are a design language. When you model your domain with precise types, you are <em>designing</em> your program, and the compiler enforces your design decisions for free.</blockquote>

<h3>Your Task</h3>
<p>Define a <code>Shape</code> discriminated union with three variants: <code>circle</code> (with <code>radius</code>), <code>rect</code> (with <code>w</code> and <code>h</code>), and <code>triangle</code> (with <code>base</code> and <code>height</code>). Then implement <code>area(shape: Shape): number</code> using an exhaustive <code>switch</code>. The key insight: after you write the switch, <strong>try mentally deleting one case</strong> &mdash; the compiler would catch it if you had the <code>never</code> trick (coming in the next exercise).</p>
`,
    starterCode: `// Define a discriminated union for Shape.
// Three variants: circle (radius), rect (w, h), triangle (base, height).
// Each variant has a 'kind' field as the discriminant.
type Shape = unknown; // <-- replace this

// Compute the area of any Shape using an exhaustive switch.
// Circle: PI * r^2, Rectangle: w * h, Triangle: 0.5 * base * height
function area(shape: Shape): number {
  // Use switch (shape.kind) to branch
  return 0;
}
`,
    solutionCode: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rect':
      return shape.w * shape.h;
    case 'triangle':
      return 0.5 * shape.base * shape.height;
  }
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  const e = typeof expected === 'number' ? Math.round(expected * 1000) / 1000 : expected;
  const a = typeof actual === 'number' ? Math.round(actual * 1000) / 1000 : actual;
  if (JSON.stringify(e) === JSON.stringify(a)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("circle area", Math.PI * 25, area({ kind: 'circle', radius: 5 }));
assertEqual("rect area", 24, area({ kind: 'rect', w: 4, h: 6 }));
assertEqual("triangle area", 6, area({ kind: 'triangle', base: 3, height: 4 }));
assertEqual("unit circle area", Math.PI, area({ kind: 'circle', radius: 1 }));
assertEqual("square area", 9, area({ kind: 'rect', w: 3, h: 3 }));
assertEqual("flat triangle", 0, area({ kind: 'triangle', base: 10, height: 0 }));
`,
    hints: [
      'A discriminated union uses a shared literal field called the <em>discriminant</em>: <code>type Shape = { kind: \'circle\'; radius: number } | { kind: \'rect\'; w: number; h: number } | ...</code>',
      'Use <code>switch (shape.kind)</code> to branch. Inside each case, TypeScript automatically narrows the type &mdash; you can access <code>shape.radius</code> in the <code>\'circle\'</code> case without any cast.',
      'Triangle area formula: <code>0.5 * base * height</code>. The discriminated union guarantees <code>base</code> and <code>height</code> exist when <code>kind</code> is <code>\'triangle\'</code>.',
      'The beauty of this approach: if you later add a <code>\'pentagon\'</code> variant to the union, the compiler (with <code>noImplicitReturns</code>) will flag every switch that does not handle it. Compare this to the ugly version where new shapes just silently return 0.',
    ],
    concepts: ['discriminated unions', 'make illegal states unrepresentable', 'type narrowing', 'exhaustive switch', 'algebraic data types', 'Ousterhout complexity'],
    successPatterns: [
      'kind.*circle',
      'kind.*rect',
      'kind.*triangle',
      'switch\\s*\\(\\s*shape\\.kind',
    ],
    testNames: [
      'circle area computes correctly',
      'rectangle area computes correctly',
      'triangle area computes correctly',
      'unit circle area equals PI',
      'square area computes correctly',
      'degenerate triangle has zero area',
    ],
  },

  'ts-branded-types': {
    id: 'ts-branded-types',
    language: 'typescript',
    title: 'The Type System as a Design Tool',
    difficulty: 'beginner',
    order: 2,
    description: `
<h3>The Ugly Way</h3>
<pre><code>function transfer(from: number, to: number, amount: number): void {
  // Which number is the account ID?
  // Which is the dollar amount?
  // What if someone passes euros?
  debit(from, amount);
  credit(to, amount);
}

// This compiles. This is a bug.
transfer(usdAmount, accountId, eurAmount);</code></pre>

<h3>Why It Is Bad: The Mars Climate Orbiter</h3>
<p>In 1999, NASA lost a $125 million spacecraft because one team used pounds-force and another used newtons. Both were <code>number</code>. The types did not distinguish them. The code compiled. The spacecraft crashed.</p>

<p>This is a <em>primitive obsession</em> anti-pattern: using generic primitives (<code>number</code>, <code>string</code>) where a domain-specific type would prevent entire categories of bugs. When <code>USD</code> and <code>EUR</code> are both <code>number</code>, the compiler cannot help you. When they are distinct types, it catches every mix-up at compile time.</p>

<h3>The Beautiful Way: Branded Types</h3>
<pre><code>type USD = number & { readonly __brand: unique symbol };
type EUR = number & { readonly __brand: unique symbol };

function usd(amount: number): USD { return amount as USD; }
function eur(amount: number): EUR { return amount as EUR; }

function transferUSD(from: AccountId, to: AccountId, amount: USD): void {
  // Now the compiler PREVENTS passing EUR where USD is expected.
  // And AccountId cannot be confused with a dollar amount.
}</code></pre>

<p>The <code>__brand</code> property is a phantom &mdash; it exists only at compile time. At runtime, a <code>USD</code> is just a <code>number</code>. Zero overhead. Maximum safety.</p>

<blockquote><strong>Taste principle:</strong> "The type system is a design tool, not a tax." Every branded type you define is a <em>decision</em> about what can and cannot be confused in your system. Good engineers make these decisions explicitly. Bad code leaves them implicit.</blockquote>

<blockquote><strong>Parnas on information hiding:</strong> Each branded type is a module boundary. It hides the representation (it is a number) and exposes only the interface (it is a USD amount). You can only create one through the constructor function, which is your validation gate.</blockquote>

<h3>Your Task</h3>
<p>Create branded types for <code>USD</code> and <code>EUR</code>, write constructor functions <code>usd()</code> and <code>eur()</code>, and implement:</p>
<ul>
  <li><code>addUSD(a: USD, b: USD): USD</code> &mdash; only accepts USD values</li>
  <li><code>addEUR(a: EUR, b: EUR): EUR</code> &mdash; only accepts EUR values</li>
  <li><code>convertToEUR(amount: USD, rate: number): EUR</code> &mdash; the ONLY safe way to cross the boundary</li>
</ul>
<p>Think about what <code>convertToEUR</code> represents: it is the only authorized crossing point between two type domains. Every other path is a compile error. This is <em>design</em>.</p>
`,
    starterCode: `// Define branded types for USD and EUR.
// Use an intersection with a phantom __brand property.
type USD = unknown; // <-- replace
type EUR = unknown; // <-- replace

// Constructor functions: the ONLY way to create branded values
function usd(amount: number): USD {
  return 0 as any; // <-- fix
}

function eur(amount: number): EUR {
  return 0 as any; // <-- fix
}

// Only accepts USD — EUR is a compile-time error
function addUSD(a: USD, b: USD): USD {
  return 0 as any;
}

// Only accepts EUR — USD is a compile-time error
function addEUR(a: EUR, b: EUR): EUR {
  return 0 as any;
}

// The authorized boundary crossing: USD -> EUR at a given rate
function convertToEUR(amount: USD, rate: number): EUR {
  return 0 as any;
}
`,
    solutionCode: `type USD = number & { __brand: 'USD' };
type EUR = number & { __brand: 'EUR' };

function usd(amount: number): USD {
  return amount as USD;
}

function eur(amount: number): EUR {
  return amount as EUR;
}

function addUSD(a: USD, b: USD): USD {
  return ((a as number) + (b as number)) as USD;
}

function addEUR(a: EUR, b: EUR): EUR {
  return ((a as number) + (b as number)) as EUR;
}

function convertToEUR(amount: USD, rate: number): EUR {
  return ((amount as number) * rate) as EUR;
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  const e = typeof expected === 'number' ? Math.round(expected * 10000) / 10000 : expected;
  const a = typeof actual === 'number' ? Math.round(actual * 10000) / 10000 : actual;
  if (JSON.stringify(e) === JSON.stringify(a)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("usd creates value", 100, usd(100) as any);
assertEqual("eur creates value", 85, eur(85) as any);
assertEqual("addUSD sums correctly", 250, addUSD(usd(100), usd(150)) as any);
assertEqual("addUSD zero", 0, addUSD(usd(0), usd(0)) as any);
assertEqual("addEUR sums correctly", 170, addEUR(eur(85), eur(85)) as any);
assertEqual("convertToEUR", 85, convertToEUR(usd(100), 0.85) as any);
assertEqual("convertToEUR zero rate", 0, convertToEUR(usd(100), 0) as any);
`,
    hints: [
      'A branded type intersects a primitive with a phantom property: <code>type USD = number & { __brand: \'USD\' }</code>. The <code>__brand</code> never exists at runtime.',
      'Constructor functions cast: <code>return amount as USD</code>. This is the one place where <code>as</code> is justified &mdash; it is a deliberate boundary crossing, not a hack.',
      'In <code>addUSD</code>, cast both args back to <code>number</code>, add them, then cast the result back to <code>USD</code>. The casts are inside the implementation &mdash; callers never see them.',
      'The <code>convertToEUR</code> function is the key insight: it is the ONLY function that takes USD and returns EUR. Without it, there is no way to cross from one type domain to the other. This is information hiding at the type level.',
    ],
    concepts: ['branded types', 'nominal typing', 'primitive obsession', 'Mars Climate Orbiter', 'type-level design', 'Parnas information hiding'],
    successPatterns: [
      '__brand.*USD',
      '__brand.*EUR',
      'as\\s+USD',
      'as\\s+EUR',
    ],
    testNames: [
      'usd creates a branded value',
      'eur creates a branded value',
      'addUSD sums two USD values',
      'addUSD handles zero',
      'addEUR sums two EUR values',
      'convertToEUR applies exchange rate',
      'convertToEUR handles zero rate',
    ],
  },

  'ts-exhaustive-matching': {
    id: 'ts-exhaustive-matching',
    language: 'typescript',
    title: 'Design for Change',
    difficulty: 'intermediate',
    order: 3,
    description: `
<h3>The Ugly Way</h3>
<pre><code>type Status = 'pending' | 'active' | 'suspended' | 'closed';

function getStatusMessage(status: Status): string {
  switch (status) {
    case 'pending': return 'Waiting for approval';
    case 'active': return 'Account is active';
    // Forgot 'suspended' and 'closed'!
    default: return 'Unknown status'; // silently wrong
  }
}</code></pre>

<h3>Why It Is Bad</h3>
<p>Six months later, a developer adds <code>'archived'</code> to the <code>Status</code> union. The switch silently falls through to <code>'Unknown status'</code>. No compiler error. No test failure. The bug ships to production and shows "Unknown status" to customers.</p>

<p>The <code>default</code> branch is a <em>bug magnet</em>. It catches everything you forgot, and it catches it silently. David Parnas argued that good designs should be <strong>designed for change</strong> &mdash; when requirements evolve, the system should make it easy to find and update everything affected. A <code>default</code> branch does the opposite: it <em>hides</em> the impact of change.</p>

<h3>The Beautiful Way: The <code>never</code> Trick</h3>
<pre><code>function assertNever(x: never): never {
  throw new Error("Unhandled case: " + JSON.stringify(x));
}

function getStatusMessage(status: Status): string {
  switch (status) {
    case 'pending':   return 'Waiting for approval';
    case 'active':    return 'Account is active';
    case 'suspended': return 'Account is suspended';
    case 'closed':    return 'Account is closed';
    default:          return assertNever(status);
    //                       ^^^ COMPILE ERROR if any case is missing!
  }
}</code></pre>

<p>After every case is handled, <code>status</code> has type <code>never</code> in the default branch. If you add <code>'archived'</code> to the union but forget to handle it, <code>status</code> has type <code>'archived'</code> in the default branch &mdash; which is not assignable to <code>never</code>. The compiler shows you <strong>every switch in the codebase</strong> that needs updating.</p>

<blockquote><strong>Taste principle (Parnas, "On the Criteria for Decomposing Systems into Modules"):</strong> A well-designed system localizes the impact of change. When you add a new variant, the compiler should tell you everywhere that needs to change. The <code>never</code> trick turns a runtime "oops" into a compile-time checklist.</blockquote>

<h3>Your Task</h3>
<p>You are building a payment processing system. Define a <code>PaymentMethod</code> discriminated union with four variants:</p>
<ul>
  <li><code>credit_card</code> with <code>last4: string</code> and <code>expiry: string</code></li>
  <li><code>bank_transfer</code> with <code>bankName: string</code> and <code>accountLast4: string</code></li>
  <li><code>crypto</code> with <code>wallet: string</code> and <code>network: string</code></li>
  <li><code>paypal</code> with <code>email: string</code></li>
</ul>
<p>Implement <code>describePayment(method: PaymentMethod): string</code> with exhaustive matching. The function should return a human-readable description like <code>"Credit card ending in 4242"</code>.</p>
`,
    starterCode: `// Define a discriminated union for PaymentMethod
// Four variants: credit_card, bank_transfer, crypto, paypal
// Each has a 'type' discriminant field
type PaymentMethod = unknown; // <-- replace

function assertNever(x: never): never {
  throw new Error("Unhandled case: " + JSON.stringify(x));
}

// Return a human-readable description of the payment method:
//   credit_card:    "Credit card ending in {last4}"
//   bank_transfer:  "Bank transfer via {bankName} (...{accountLast4})"
//   crypto:         "Crypto wallet {wallet} on {network}"
//   paypal:         "PayPal ({email})"
function describePayment(method: PaymentMethod): string {
  return "";
}
`,
    solutionCode: `type PaymentMethod =
  | { type: 'credit_card'; last4: string; expiry: string }
  | { type: 'bank_transfer'; bankName: string; accountLast4: string }
  | { type: 'crypto'; wallet: string; network: string }
  | { type: 'paypal'; email: string };

function assertNever(x: never): never {
  throw new Error("Unhandled case: " + JSON.stringify(x));
}

function describePayment(method: PaymentMethod): string {
  switch (method.type) {
    case 'credit_card':
      return "Credit card ending in " + method.last4;
    case 'bank_transfer':
      return "Bank transfer via " + method.bankName + " (..." + method.accountLast4 + ")";
    case 'crypto':
      return "Crypto wallet " + method.wallet + " on " + method.network;
    case 'paypal':
      return "PayPal (" + method.email + ")";
    default:
      return assertNever(method);
  }
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("credit card", "Credit card ending in 4242", describePayment({ type: 'credit_card', last4: '4242', expiry: '12/25' }));
assertEqual("bank transfer", "Bank transfer via Chase (...7890)", describePayment({ type: 'bank_transfer', bankName: 'Chase', accountLast4: '7890' }));
assertEqual("crypto", "Crypto wallet 0xABC on Ethereum", describePayment({ type: 'crypto', wallet: '0xABC', network: 'Ethereum' }));
assertEqual("paypal", "PayPal (alice@example.com)", describePayment({ type: 'paypal', email: 'alice@example.com' }));
`,
    hints: [
      'Define each variant with a shared <code>type</code> discriminant: <code>{ type: \'credit_card\'; last4: string; expiry: string }</code>.',
      'Use <code>switch (method.type)</code> and handle all four cases. TypeScript narrows the type inside each case automatically.',
      'Put <code>assertNever(method)</code> in the <code>default</code> branch. If all cases are handled, <code>method</code> is <code>never</code> and this compiles. If one is missing, the compiler shows an error.',
      'The string formats must match exactly. For bank_transfer: <code>"Bank transfer via " + bankName + " (..." + accountLast4 + ")"</code>.',
    ],
    concepts: ['exhaustive matching', 'never type', 'design for change', 'Parnas modules', 'discriminated unions', 'compile-time safety'],
    successPatterns: [
      'assertNever',
      'switch\\s*\\(\\s*method\\.type',
      'type.*credit_card',
      'type.*bank_transfer',
    ],
    testNames: [
      'credit card description is correct',
      'bank transfer description is correct',
      'crypto description is correct',
      'paypal description is correct',
    ],
  },

  'ts-type-narrowing': {
    id: 'ts-type-narrowing',
    language: 'typescript',
    title: 'The Compiler Is Your Pair Programmer',
    difficulty: 'intermediate',
    order: 4,
    description: `
<h3>The Ugly Way: Fighting the Compiler</h3>
<pre><code>function processApiResponse(data: unknown): string {
  // "I know better than the compiler"
  const response = data as any;
  return response.user.name.toUpperCase();  // runtime explosion
}

function extractId(input: unknown): number {
  return (input as { id: number }).id;  // "trust me bro"
}</code></pre>

<h3>Why It Is Bad</h3>
<p>Every <code>as any</code> and <code>as SomeType</code> is the programmer saying <em>"shut up, compiler, I know what I am doing."</em> But the compiler has a perfect memory and never gets tired. You do not. The <code>as</code> keyword should be treated like <code>unsafe</code> in Rust &mdash; a signal that you are taking responsibility away from the machine that is better at this than you are.</p>

<p>The alternative is <strong>type narrowing</strong>: a series of runtime checks that progressively tell the compiler what the type is. After each check, the compiler narrows the type automatically. No casts needed. No runtime surprises.</p>

<h3>The Beautiful Way: Progressive Narrowing</h3>
<pre><code>function processApiResponse(data: unknown): string {
  if (typeof data !== 'object' || data === null) {
    return 'Invalid: not an object';
  }
  if (!('user' in data)) {
    return 'Invalid: no user field';
  }
  // data is now: object & Record<'user', unknown>
  const user = (data as Record<string, unknown>).user;
  if (typeof user !== 'object' || user === null || !('name' in user)) {
    return 'Invalid: no user.name';
  }
  const name = (user as Record<string, unknown>).name;
  if (typeof name !== 'string') {
    return 'Invalid: name is not a string';
  }
  // name is now: string — the compiler PROVED it
  return name.toUpperCase();
}</code></pre>

<p>This is more code, but every line is a <em>deliberate decision</em> about what constitutes valid data. The compiler tracks these decisions and narrows the type at each step. You are working <em>with</em> the compiler, not against it.</p>

<blockquote><strong>Taste principle:</strong> The compiler is your pair programmer. Let it do its job. Every <code>as</code> cast is you firing your pair programmer for one line. A few casts in well-understood boundary code (branded type constructors, FFI) is fine. Dozens scattered throughout business logic is a design smell.</blockquote>

<h3>Your Task</h3>
<p>Build a <code>parseConfig(raw: unknown): Config | string</code> function that validates raw JSON data into a typed config. On success, return the typed <code>Config</code>. On failure, return a descriptive error string. Use type narrowing &mdash; no <code>as any</code> allowed.</p>
<p>Also write a custom type guard <code>isNonEmptyString(x: unknown): x is string</code> that returns true only for strings with at least one character.</p>
<p>A valid config has: <code>host</code> (non-empty string), <code>port</code> (number, 1-65535), and optionally <code>debug</code> (boolean).</p>
`,
    starterCode: `interface Config {
  host: string;
  port: number;
  debug: boolean;
}

// Type guard: true if x is a string with length > 0
function isNonEmptyString(x: unknown): x is string {
  return false; // <-- implement
}

// Validate raw unknown data into a Config.
// Return Config on success, or an error string on failure.
// Error messages:
//   "Expected an object" if not an object or is null
//   "Missing or invalid host" if host is not a non-empty string
//   "Missing or invalid port" if port is not a number between 1 and 65535
// If debug is missing, default to false
function parseConfig(raw: unknown): Config | string {
  return "not implemented";
}
`,
    solutionCode: `interface Config {
  host: string;
  port: number;
  debug: boolean;
}

function isNonEmptyString(x: unknown): x is string {
  return typeof x === 'string' && x.length > 0;
}

function parseConfig(raw: unknown): Config | string {
  if (typeof raw !== 'object' || raw === null) {
    return "Expected an object";
  }
  const obj = raw as Record<string, unknown>;
  if (!isNonEmptyString(obj.host)) {
    return "Missing or invalid host";
  }
  if (typeof obj.port !== 'number' || obj.port < 1 || obj.port > 65535) {
    return "Missing or invalid port";
  }
  const debug = typeof obj.debug === 'boolean' ? obj.debug : false;
  return { host: obj.host, port: obj.port, debug };
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("valid config", { host: "localhost", port: 8080, debug: true }, parseConfig({ host: "localhost", port: 8080, debug: true }));
assertEqual("default debug", { host: "prod.io", port: 443, debug: false }, parseConfig({ host: "prod.io", port: 443 }));
assertEqual("not an object", "Expected an object", parseConfig(42));
assertEqual("null input", "Expected an object", parseConfig(null));
assertEqual("empty host", "Missing or invalid host", parseConfig({ host: "", port: 80 }));
assertEqual("missing host", "Missing or invalid host", parseConfig({ port: 80 }));
assertEqual("bad port", "Missing or invalid port", parseConfig({ host: "x", port: 0 }));
assertEqual("port too high", "Missing or invalid port", parseConfig({ host: "x", port: 99999 }));
assertEqual("isNonEmptyString true", true, isNonEmptyString("hello"));
assertEqual("isNonEmptyString empty", false, isNonEmptyString(""));
assertEqual("isNonEmptyString number", false, isNonEmptyString(42));
`,
    hints: [
      'Start with <code>typeof raw !== \'object\' || raw === null</code> to reject non-objects. Remember: <code>typeof null === \'object\'</code> in JavaScript.',
      'After the object check, cast to <code>Record&lt;string, unknown&gt;</code> &mdash; this is one justified cast because you have proved it is an object. From here, use type guards on individual fields.',
      'Use your <code>isNonEmptyString</code> guard for the host check. The guard narrows <code>obj.host</code> to <code>string</code> in the branch where it returns true.',
      'For port validation: <code>typeof obj.port !== \'number\' || obj.port < 1 || obj.port > 65535</code>. For debug: default to <code>false</code> if it is not a boolean.',
    ],
    concepts: ['type narrowing', 'custom type guards', 'unknown vs any', 'progressive validation', 'compiler as pair programmer'],
    successPatterns: [
      'typeof.*===.*string',
      'typeof.*object',
      'x\\s+is\\s+string',
      'isNonEmptyString',
    ],
    testNames: [
      'valid config is parsed correctly',
      'debug defaults to false when missing',
      'rejects non-object input',
      'rejects null input',
      'rejects empty host',
      'rejects missing host',
      'rejects port out of range low',
      'rejects port out of range high',
      'isNonEmptyString accepts valid string',
      'isNonEmptyString rejects empty string',
      'isNonEmptyString rejects non-string',
    ],
  },

  // ─── Module 2: API Design Patterns ────────────────────────────────────
  // "Design is about the caller, not the implementer"

  'ts-builder-pattern': {
    id: 'ts-builder-pattern',
    language: 'typescript',
    title: 'Code Should Read Like the Problem',
    difficulty: 'intermediate',
    order: 1,
    description: `
<h3>The Ugly Way</h3>
<pre><code>function createEmail(
  to: string,
  from: string,
  subject: string,
  body: string,
  cc?: string,
  bcc?: string,
  replyTo?: string,
  priority?: 'low' | 'normal' | 'high',
  attachments?: string[],
  isHtml?: boolean,
  readReceipt?: boolean,
  headers?: Record&lt;string, string&gt;
): Email {
  // ...
}

// Calling this is miserable:
createEmail(
  "alice@example.com",
  "bob@example.com",
  "Q4 Report",
  "&lt;h1&gt;Report&lt;/h1&gt;",
  undefined,      // what is this? cc? bcc?
  undefined,      // who remembers parameter order?
  undefined,      // replyTo? priority?
  "high",         // is this priority or something else?
  ["report.pdf"],
  true,           // isHtml? readReceipt?
  false           // ok I give up
);</code></pre>

<h3>Why It Is Bad</h3>
<p>Dustin Boswell and Trevor Foucher in <em>The Art of Readable Code</em> write: <em>"Code should be written to minimize the time it would take for someone else to understand it."</em> The function above maximizes that time. You cannot read the call site without checking the signature. The <code>undefined</code> holes are meaningless. The booleans at the end are a guessing game.</p>

<p>This is not just an aesthetic problem. It is a correctness problem. Swapping <code>to</code> and <code>from</code> is silent. Confusing <code>cc</code> and <code>bcc</code> is silent. Every call site is a potential bug.</p>

<h3>The Beautiful Way: A Builder That Reads Like Prose</h3>
<pre><code>const email = new EmailBuilder()
  .to("alice@example.com")
  .from("bob@example.com")
  .subject("Q4 Report")
  .body("&lt;h1&gt;Report&lt;/h1&gt;")
  .html()
  .priority("high")
  .attach("report.pdf")
  .build();</code></pre>

<p>Read it out loud. It is almost English. Each method names what it does. No positional ambiguity. No <code>undefined</code> holes. And the builder can enforce constraints: calling <code>build()</code> without <code>to()</code> or <code>subject()</code> is a runtime error (and with advanced TypeScript, a compile error).</p>

<blockquote><strong>Taste principle (Boswell):</strong> "Code should read like the problem, not like the solution." A builder names each piece of data at the call site. A 12-parameter function makes the reader do the mapping in their head.</blockquote>

<h3>Your Task</h3>
<p>Build a <code>QueryBuilder</code> with a fluent API for constructing SQL queries. Methods: <code>select(...columns)</code>, <code>from(table)</code>, <code>where(condition)</code>, <code>orderBy(column, direction)</code>, <code>limit(n)</code>. The <code>build()</code> method assembles the SQL string. Multiple <code>where()</code> calls join with <code>AND</code>.</p>
`,
    starterCode: `class QueryBuilder {
  private _columns: string[] = ['*'];
  private _table: string = '';
  private _conditions: string[] = [];
  private _orderBy: string = '';
  private _limit: number = -1;

  select(...columns: string[]): this {
    // implement
    return this;
  }

  from(table: string): this {
    // implement
    return this;
  }

  where(condition: string): this {
    // implement
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    // implement
    return this;
  }

  limit(n: number): this {
    // implement
    return this;
  }

  build(): string {
    // Assemble: SELECT ... FROM ... [WHERE ...] [ORDER BY ...] [LIMIT ...]
    return "";
  }
}
`,
    solutionCode: `class QueryBuilder {
  private _columns: string[] = ['*'];
  private _table: string = '';
  private _conditions: string[] = [];
  private _orderBy: string = '';
  private _limit: number = -1;

  select(...columns: string[]): this {
    this._columns = columns;
    return this;
  }

  from(table: string): this {
    this._table = table;
    return this;
  }

  where(condition: string): this {
    this._conditions.push(condition);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this._orderBy = column + " " + direction;
    return this;
  }

  limit(n: number): this {
    this._limit = n;
    return this;
  }

  build(): string {
    let sql = "SELECT " + this._columns.join(", ") + " FROM " + this._table;
    if (this._conditions.length > 0) {
      sql += " WHERE " + this._conditions.join(" AND ");
    }
    if (this._orderBy) {
      sql += " ORDER BY " + this._orderBy;
    }
    if (this._limit >= 0) {
      sql += " LIMIT " + this._limit;
    }
    return sql;
  }
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("basic query", "SELECT * FROM users", new QueryBuilder().from("users").build());
assertEqual("select columns", "SELECT name, age FROM users", new QueryBuilder().select("name", "age").from("users").build());
assertEqual("with where", "SELECT * FROM users WHERE age > 18", new QueryBuilder().from("users").where("age > 18").build());
assertEqual("multiple where", "SELECT id, name FROM orders WHERE status = 'active' AND total > 100", new QueryBuilder().select("id", "name").from("orders").where("status = 'active'").where("total > 100").build());
assertEqual("with order", "SELECT * FROM products ORDER BY price DESC", new QueryBuilder().from("products").orderBy("price", "DESC").build());
assertEqual("full chain", "SELECT name FROM users WHERE active = true ORDER BY name ASC LIMIT 10", new QueryBuilder().select("name").from("users").where("active = true").orderBy("name", "ASC").limit(10).build());
`,
    hints: [
      'Each method stores its value in a private field and returns <code>this</code> for chaining. This is the key pattern: <em>mutation is internal, the API is fluent</em>.',
      'Use <code>this._columns.join(", ")</code> for the column list. Default to <code>[\'*\']</code> if <code>select()</code> is never called.',
      'Multiple <code>where()</code> calls push to an array. In <code>build()</code>, join with <code>" AND "</code>.',
      'For <code>orderBy</code>, store <code>column + " " + direction</code>. For <code>limit</code>, use -1 as sentinel for "no limit set."',
    ],
    concepts: ['builder pattern', 'fluent API', 'readable code', 'Boswell readability', 'method chaining', 'API design'],
    successPatterns: [
      'return\\s+this',
      '_columns',
      '_conditions.*push',
      'join',
    ],
    testNames: [
      'basic query with defaults',
      'select specific columns',
      'query with where clause',
      'multiple where conditions joined with AND',
      'query with order by',
      'full chain with all clauses',
    ],
  },

  'ts-result-type': {
    id: 'ts-result-type',
    language: 'typescript',
    title: 'Error Handling Is Data Flow, Not Control Flow',
    difficulty: 'intermediate',
    order: 2,
    description: `
<h3>The Ugly Way</h3>
<pre><code>function processOrder(orderId: string): Order {
  let order: Order;
  try {
    order = fetchOrder(orderId);
  } catch (e) {
    // What type is e? Who knows. TypeScript says 'unknown'.
    // Is it a network error? A 404? A JSON parse error?
    throw new Error("Failed to fetch order");
  }

  let validated: Order;
  try {
    validated = validateOrder(order);
  } catch (e) {
    // Different error type? Same catch block structure. Copy-paste.
    throw new Error("Validation failed");
  }

  try {
    return chargeOrder(validated);
  } catch (e) {
    // Three levels of try-catch for a three-step pipeline.
    // The logic is buried under error-handling ceremony.
    throw new Error("Charge failed");
  }
}</code></pre>

<h3>Why It Is Bad</h3>
<p>Ben Moseley and Peter Marks wrote in <em>"Out of the Tar Pit"</em> that the two biggest sources of software complexity are <strong>state</strong> and <strong>control flow</strong>. Try/catch is control flow gone wrong: it creates invisible exit points from functions, it loses type information (errors are <code>unknown</code>), and it does not compose. You cannot <code>map</code> over a thrown error. You cannot chain try/catch blocks without nesting.</p>

<p>The deeper issue: exceptions make error handling an afterthought. The type signature <code>fetchOrder(id: string): Order</code> <em>lies</em> &mdash; it says it always returns an Order, but sometimes it throws. The caller has no way to know this from the signature.</p>

<h3>The Beautiful Way: Result as Data</h3>
<pre><code>type Result&lt;T, E&gt; =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Now the pipeline is just data transformation:
const order = fetchOrder(orderId);           // Result&lt;Order, FetchError&gt;
const validated = flatMap(order, validate);   // Result&lt;Order, FetchError | ValidationError&gt;
const charged = flatMap(validated, charge);   // Result&lt;Order, FetchError | ValidationError | ChargeError&gt;</code></pre>

<p>Every step is explicit. Errors flow through the pipeline as data. The type signature tells the truth: <em>this function might fail, and here are the ways it can fail.</em></p>

<blockquote><strong>Taste principle (Moseley, "Out of the Tar Pit"):</strong> "Control flow is a major source of complexity." Result replaces control flow (throw/catch) with data flow (ok/error). Data flow is composable. Control flow is not.</blockquote>

<h3>Your Task</h3>
<p>Implement the <code>Result</code> type and its operations: <code>ok()</code>, <code>err()</code>, <code>map</code>, <code>flatMap</code>, <code>mapError</code>, and <code>unwrapOr</code>. Then use them to build a <code>safeDivide</code> function, demonstrating how Results compose where try/catch does not.</p>
`,
    starterCode: `type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value: value } as any;
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error: error } as any;
}

// Transform the success value, leaving errors untouched
function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return err("not implemented" as any);
}

// Chain a function that itself returns a Result
function flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  return err("not implemented" as any);
}

// Transform the error value, leaving successes untouched
function mapError<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  return err("not implemented" as any);
}

// Extract the value or return a fallback
function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return defaultValue;
}

// Division that returns an error instead of NaN/Infinity
function safeDivide(a: number, b: number): Result<number, string> {
  return err("not implemented");
}
`,
    solutionCode: `type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return result;
}

function flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  if (result.ok) {
    return fn(result.value);
  }
  return result;
}

function mapError<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  if (result.ok) {
    return result;
  }
  return err(fn(result.error));
}

function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}

function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err("Division by zero");
  }
  return ok(a / b);
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("ok value", { ok: true, value: 42 }, ok(42));
assertEqual("err value", { ok: false, error: "oops" }, err("oops"));
assertEqual("map ok", { ok: true, value: 10 }, map(ok(5), (x: number) => x * 2));
assertEqual("map err", { ok: false, error: "fail" }, map(err("fail"), (x: number) => x * 2));
assertEqual("flatMap ok", { ok: true, value: 5 }, flatMap(ok(10), (x: number) => safeDivide(x, 2)));
assertEqual("flatMap err propagates", { ok: false, error: "oops" }, flatMap(err("oops"), (x: number) => ok(x * 2)));
assertEqual("mapError transforms", { ok: false, error: "ERROR: fail" }, mapError(err("fail"), (e: string) => "ERROR: " + e));
assertEqual("mapError skips ok", { ok: true, value: 42 }, mapError(ok(42), (e: string) => "ERROR: " + e));
assertEqual("unwrapOr ok", 42, unwrapOr(ok(42), 0));
assertEqual("unwrapOr err", 0, unwrapOr(err("fail"), 0));
assertEqual("safeDivide ok", { ok: true, value: 5 }, safeDivide(10, 2));
assertEqual("safeDivide by zero", { ok: false, error: "Division by zero" }, safeDivide(10, 0));
`,
    hints: [
      'Check <code>result.ok</code> to determine success or failure. In the <code>ok</code> branch, TypeScript narrows to <code>{ ok: true; value: T }</code>.',
      'In <code>map</code>: if ok, apply fn to value and wrap in <code>ok()</code>. If error, return the result unchanged &mdash; errors pass through automatically.',
      'In <code>flatMap</code>: if ok, return <code>fn(result.value)</code> directly since fn already returns a Result. This is the key difference from map.',
      '<code>mapError</code> is the mirror of <code>map</code>: transform the error, leave success untouched. For <code>safeDivide</code>: return <code>err("Division by zero")</code> when <code>b === 0</code>.',
    ],
    concepts: ['Result type', 'error as data', 'Moseley tar pit', 'map', 'flatMap', 'composable errors', 'honest type signatures'],
    successPatterns: [
      'result\\.ok',
      'ok:\\s*true',
      'ok:\\s*false',
      'fn\\(result\\.value\\)',
    ],
    testNames: [
      'ok constructs success',
      'err constructs failure',
      'map transforms success value',
      'map passes through error',
      'flatMap chains success',
      'flatMap propagates error',
      'mapError transforms error',
      'mapError skips success',
      'unwrapOr extracts success value',
      'unwrapOr returns default for error',
      'safeDivide returns result for valid division',
      'safeDivide returns error for division by zero',
    ],
  },

  'ts-fluent-api': {
    id: 'ts-fluent-api',
    language: 'typescript',
    title: 'APIs Optimized for Reading, Not Writing',
    difficulty: 'intermediate',
    order: 3,
    description: `
<h3>The Ugly Way</h3>
<pre><code>const validator = new Validator();
validator.field = "email";
validator.required = true;
validator.minLength = 5;
validator.maxLength = 255;
validator.pattern = /^[^@]+@[^@]+$/;
validator.message = "Must be a valid email";

const validator2 = new Validator();
validator2.field = "age";
validator2.required = true;
validator2.min = 0;
validator2.max = 150;
validator2.message = "Must be a valid age";

const schema = new Schema();
schema.addValidator(validator);
schema.addValidator(validator2);</code></pre>

<h3>Why It Is Bad</h3>
<p>Ten assignment statements for one concept: "email must be a valid, non-empty string." The code reads like assembly instructions, not like the intent. The reader has to mentally group statements to understand what each block means. And there is no guidance &mdash; after typing <code>validator.</code>, the IDE shows every property. Which ones are relevant? Which combinations are valid?</p>

<h3>The Beautiful Way: A Fluent Validation DSL</h3>
<pre><code>const schema = new SchemaBuilder()
  .field("email")
    .required()
    .string()
    .minLength(5)
    .maxLength(255)
    .matches(/^[^@]+@[^@]+$/)
  .field("age")
    .required()
    .number()
    .min(0)
    .max(150)
  .build();</code></pre>

<p>This reads like a specification document. Each method guides you to the next. The indentation is cosmetic (it all chains) but the reader sees the structure. The IDE shows only relevant methods at each point in the chain. This is <strong>progressive disclosure</strong> &mdash; the API reveals complexity only when you need it.</p>

<blockquote><strong>Taste principle (Boswell):</strong> "APIs should be optimized for reading, not writing." You write code once. You (and your team) read it hundreds of times. A fluent API invests a little more effort at the definition site to save enormous effort at every call site.</blockquote>

<h3>Your Task</h3>
<p>Implement a <code>SchemaBuilder</code> that constructs validation schemas. It should support:</p>
<ul>
  <li><code>field(name)</code> &mdash; start defining a new field</li>
  <li><code>required()</code> &mdash; mark the current field as required</li>
  <li><code>string()</code> / <code>number()</code> &mdash; set expected type</li>
  <li><code>min(n)</code> / <code>max(n)</code> &mdash; set numeric bounds</li>
  <li><code>build()</code> &mdash; return the assembled schema as an array of field descriptors</li>
</ul>
<p>Each method returns <code>this</code> for chaining. The <code>build()</code> method finalizes the last field and returns all field descriptors.</p>
`,
    starterCode: `interface FieldDescriptor {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'any';
  min?: number;
  max?: number;
}

class SchemaBuilder {
  private fields: FieldDescriptor[] = [];
  private current: FieldDescriptor | null = null;

  // Start a new field. If there is a current field, finalize it first.
  field(name: string): this {
    return this;
  }

  required(): this {
    return this;
  }

  string(): this {
    return this;
  }

  number(): this {
    return this;
  }

  min(n: number): this {
    return this;
  }

  max(n: number): this {
    return this;
  }

  build(): FieldDescriptor[] {
    return [];
  }
}
`,
    solutionCode: `interface FieldDescriptor {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'any';
  min?: number;
  max?: number;
}

class SchemaBuilder {
  private fields: FieldDescriptor[] = [];
  private current: FieldDescriptor | null = null;

  field(name: string): this {
    if (this.current) {
      this.fields.push(this.current);
    }
    this.current = { name, required: false, type: 'any' };
    return this;
  }

  required(): this {
    if (this.current) this.current.required = true;
    return this;
  }

  string(): this {
    if (this.current) this.current.type = 'string';
    return this;
  }

  number(): this {
    if (this.current) this.current.type = 'number';
    return this;
  }

  min(n: number): this {
    if (this.current) this.current.min = n;
    return this;
  }

  max(n: number): this {
    if (this.current) this.current.max = n;
    return this;
  }

  build(): FieldDescriptor[] {
    if (this.current) {
      this.fields.push(this.current);
      this.current = null;
    }
    return this.fields;
  }
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const schema1 = new SchemaBuilder()
  .field("name").required().string()
  .build();
assertEqual("single required string field", [{ name: "name", required: true, type: "string" }], schema1);

const schema2 = new SchemaBuilder()
  .field("email").required().string()
  .field("age").required().number().min(0).max(150)
  .build();
assertEqual("two fields", 2, schema2.length);
assertEqual("email field", { name: "email", required: true, type: "string" }, schema2[0]);
assertEqual("age field", { name: "age", required: true, type: "number", min: 0, max: 150 }, schema2[1]);

const schema3 = new SchemaBuilder()
  .field("optional_note").string()
  .build();
assertEqual("optional field", [{ name: "optional_note", required: false, type: "string" }], schema3);

const schema4 = new SchemaBuilder().build();
assertEqual("empty schema", [], schema4);
`,
    hints: [
      'In <code>field(name)</code>: if <code>this.current</code> is not null, push it to <code>this.fields</code> before creating a new one. This finalizes the previous field.',
      'Each modifier method (<code>required</code>, <code>string</code>, <code>number</code>, <code>min</code>, <code>max</code>) mutates <code>this.current</code> and returns <code>this</code>.',
      'In <code>build()</code>: do not forget to push the last <code>this.current</code> (if it exists) before returning.',
      'Initialize new fields with <code>{ name, required: false, type: \'any\' }</code> so defaults are correct even if modifiers are not called.',
    ],
    concepts: ['fluent API', 'DSL design', 'progressive disclosure', 'Boswell readability', 'method chaining', 'builder pattern'],
    successPatterns: [
      'return\\s+this',
      'this\\.current',
      'this\\.fields\\.push',
      'build.*FieldDescriptor',
    ],
    testNames: [
      'single required string field',
      'two fields built correctly',
      'email field has correct descriptor',
      'age field has correct descriptor with bounds',
      'optional field defaults to not required',
      'empty schema returns empty array',
    ],
  },

  'ts-error-handling': {
    id: 'ts-error-handling',
    language: 'typescript',
    title: 'Design Error Handling for the Reader',
    difficulty: 'intermediate',
    order: 4,
    description: `
<h3>The Ugly Way: Fail-Fast Loses Information</h3>
<pre><code>function validateUser(data: any): User {
  if (!data.name) throw new Error("Name is required");
  if (!data.email) throw new Error("Email is required");     // never reached if name fails
  if (data.age < 0) throw new Error("Age must be positive"); // never reached either
  return data as User;
}

// Caller sees: "Name is required"
// But the email and age were ALSO wrong.
// User fixes name, resubmits, sees email error.
// Fixes email, resubmits, sees age error.
// Three round trips for three errors.</code></pre>

<h3>Why It Is Bad</h3>
<p>Fail-fast validation (throw on the first error) forces the user into a frustrating fix-one-resubmit loop. It is <em>designing for the implementer's convenience</em> (throwing is easy) instead of <em>designing for the user's experience</em> (show all errors at once).</p>

<p>The deeper insight: there are <strong>two kinds of failure</strong>. Sometimes you SHOULD fail fast &mdash; if the database is down, there is no point validating the email format. But for validation errors, you want to <strong>accumulate all errors</strong> and report them together. Exceptions cannot distinguish these two cases. Data types can.</p>

<h3>The Beautiful Way: Validation That Accumulates Errors</h3>
<pre><code>type Validation&lt;T&gt; =
  | { valid: true; value: T }
  | { valid: false; errors: string[] };

// ALL errors are collected, not just the first:
// { valid: false, errors: ["Name is required", "Invalid email format", "Age must be positive"] }</code></pre>

<blockquote><strong>Taste principle:</strong> "Design error handling for the person reading the error message." Fail-fast is appropriate for system errors (network failures, permissions). Accumulation is appropriate for user-facing validation. The type system should encode this distinction.</blockquote>

<h3>Your Task</h3>
<p>Implement a <code>Validation</code> type and the following operations:</p>
<ul>
  <li><code>valid(value)</code> / <code>invalid(errors)</code> &mdash; constructors</li>
  <li><code>check(value, predicate, errorMsg)</code> &mdash; single validation check</li>
  <li><code>combine(validations)</code> &mdash; combine multiple validations, accumulating all errors</li>
  <li><code>validateUser(input)</code> &mdash; validates name (non-empty), email (contains @), and age (0-150), collecting ALL errors</li>
</ul>
`,
    starterCode: `type Validation<T> =
  | { valid: true; value: T }
  | { valid: false; errors: string[] };

function valid<T>(value: T): Validation<T> {
  return { valid: false, errors: [] } as any; // fix
}

function invalid(errors: string[]): Validation<never> {
  return { valid: false, errors: [] } as any; // fix
}

// Run a single check: if predicate returns true, the value is valid.
// Otherwise, return an invalid with the error message.
function check<T>(value: T, predicate: (v: T) => boolean, errorMsg: string): Validation<T> {
  return invalid([errorMsg]);
}

// Combine multiple validations:
// - If ALL are valid, return valid with an array of their values
// - If ANY are invalid, return invalid with ALL errors accumulated
function combine<T>(validations: Validation<T>[]): Validation<T[]> {
  return invalid([]);
}

interface UserInput {
  name: string;
  email: string;
  age: number;
}

interface ValidUser {
  name: string;
  email: string;
  age: number;
}

// Validate ALL fields and accumulate ALL errors.
// Errors:
//   "Name must not be empty"
//   "Email must contain @"
//   "Age must be between 0 and 150"
function validateUser(input: UserInput): Validation<ValidUser> {
  return invalid(["not implemented"]);
}
`,
    solutionCode: `type Validation<T> =
  | { valid: true; value: T }
  | { valid: false; errors: string[] };

function valid<T>(value: T): Validation<T> {
  return { valid: true, value };
}

function invalid(errors: string[]): Validation<never> {
  return { valid: false, errors };
}

function check<T>(value: T, predicate: (v: T) => boolean, errorMsg: string): Validation<T> {
  if (predicate(value)) {
    return valid(value);
  }
  return invalid([errorMsg]);
}

function combine<T>(validations: Validation<T>[]): Validation<T[]> {
  const errors: string[] = [];
  const values: T[] = [];
  for (const v of validations) {
    if (v.valid) {
      values.push(v.value);
    } else {
      errors.push(...v.errors);
    }
  }
  if (errors.length > 0) {
    return invalid(errors);
  }
  return valid(values);
}

interface UserInput {
  name: string;
  email: string;
  age: number;
}

interface ValidUser {
  name: string;
  email: string;
  age: number;
}

function validateUser(input: UserInput): Validation<ValidUser> {
  const nameCheck = check(input.name, (n) => n.length > 0, "Name must not be empty");
  const emailCheck = check(input.email, (e) => e.includes("@"), "Email must contain @");
  const ageCheck = check(input.age, (a) => a >= 0 && a <= 150, "Age must be between 0 and 150");

  const combined = combine([nameCheck as Validation<any>, emailCheck as Validation<any>, ageCheck as Validation<any>]);
  if (combined.valid) {
    return valid({ name: input.name, email: input.email, age: input.age });
  }
  return combined as Validation<ValidUser>;
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("valid user", true, validateUser({ name: "Alice", email: "alice@example.com", age: 30 }).valid);
assertEqual("valid user value", { name: "Alice", email: "alice@example.com", age: 30 }, (validateUser({ name: "Alice", email: "alice@example.com", age: 30 }) as any).value);

const allBad = validateUser({ name: "", email: "nope", age: -5 });
assertEqual("all errors accumulated", false, allBad.valid);
assertEqual("three errors", 3, (allBad as any).errors.length);
assertEqual("name error", "Name must not be empty", (allBad as any).errors[0]);
assertEqual("email error", "Email must contain @", (allBad as any).errors[1]);
assertEqual("age error", "Age must be between 0 and 150", (allBad as any).errors[2]);

const partialBad = validateUser({ name: "Bob", email: "bad", age: 25 });
assertEqual("partial errors", 1, (partialBad as any).errors.length);

assertEqual("check valid", true, check(5, (x: number) => x > 0, "Must be positive").valid);
assertEqual("check invalid", false, check(-1, (x: number) => x > 0, "Must be positive").valid);

assertEqual("combine all valid", true, combine([valid(1), valid(2), valid(3)]).valid);
assertEqual("combine accumulates", 2, (combine([invalid(["a"]), valid(1), invalid(["b"])]) as any).errors.length);
`,
    hints: [
      'In <code>check</code>: if the predicate passes, return <code>valid(value)</code>. Otherwise, return <code>invalid([errorMsg])</code>.',
      'In <code>combine</code>: iterate through all validations, collecting both values and errors. If any errors exist, return <code>invalid(allErrors)</code>. Otherwise, return <code>valid(allValues)</code>.',
      'In <code>validateUser</code>: run ALL three checks independently (not short-circuiting), then combine. This is the key difference from throw &mdash; all checks run regardless of earlier failures.',
      'The combine function is doing what a <em>Validation Applicative</em> does in Haskell &mdash; it accumulates errors instead of short-circuiting like Either/Result.',
    ],
    concepts: ['validation vs fail-fast', 'error accumulation', 'Validation applicative', 'user-centric error design', 'composable validation'],
    successPatterns: [
      'valid:\\s*true',
      'valid:\\s*false',
      'errors.*push',
      'check.*predicate',
    ],
    testNames: [
      'valid user passes validation',
      'valid user returns correct value',
      'all-invalid input accumulates all three errors',
      'correct number of accumulated errors',
      'name error message is correct',
      'email error message is correct',
      'age error message is correct',
      'partial errors only report failing fields',
      'check returns valid for passing predicate',
      'check returns invalid for failing predicate',
      'combine returns valid when all are valid',
      'combine accumulates errors from multiple invalids',
    ],
  },

  // ─── Module 3: Functional TypeScript ──────────────────────────────────
  // "Composition over inheritance"

  'ts-immutability': {
    id: 'ts-immutability',
    language: 'typescript',
    title: 'Most Bugs Come from Uncontrolled State',
    difficulty: 'intermediate',
    order: 1,
    description: `
<h3>The Ugly Way: The Bug You Do Not See</h3>
<pre><code>function getAdminUsers(allUsers: User[]): User[] {
  return allUsers.filter(u => u.role === 'admin');
}

function sendNewsletter(users: User[]): void {
  users.push({ name: 'Newsletter Bot', role: 'system', email: 'bot@co.com' });
  // ... send emails to all users in the list
}

// The bug:
const everyone = getUsers();
const admins = getAdminUsers(everyone);
sendNewsletter(everyone);
// everyone now has an extra 'Newsletter Bot' user!
// Every subsequent call using 'everyone' is wrong.</code></pre>

<h3>Why It Is Bad</h3>
<p>Ben Moseley and Peter Marks in <em>"Out of the Tar Pit"</em> identified <strong>uncontrolled mutable state</strong> as the single largest source of complexity in software. The bug above is nearly invisible: <code>sendNewsletter</code> mutates its argument, and nothing in the type signature indicates this. The mutation propagates silently through every reference to the array.</p>

<p>The fix is not "be more careful." The fix is to make mutation structurally impossible. TypeScript provides <code>Readonly&lt;T&gt;</code>, <code>ReadonlyArray&lt;T&gt;</code>, and <code>as const</code> to enforce this at the type level. Combined with the spread operator for immutable updates, you get a coding style where data flows forward and never changes after creation.</p>

<h3>The Beautiful Way: Immutable by Default</h3>
<pre><code>interface User {
  readonly name: string;
  readonly role: string;
  readonly email: string;
}

// Cannot mutate — must create new objects
function updateRole(user: User, newRole: string): User {
  return { ...user, role: newRole };  // new object, old one untouched
}

// Cannot push — must create new arrays
function addUser(users: ReadonlyArray&lt;User&gt;, user: User): ReadonlyArray&lt;User&gt; {
  return [...users, user];  // new array, old one untouched
}</code></pre>

<blockquote><strong>Taste principle (Moseley, "Out of the Tar Pit"):</strong> "Mutable state is the single largest source of software complexity." Make state immutable by default. Use <code>readonly</code> everywhere. The spread operator is your tool for creating updated copies. Mutation should be an explicit, contained choice &mdash; not the default.</blockquote>

<h3>Your Task</h3>
<p>Define an immutable <code>Todo</code> interface and implement pure functions that never mutate their inputs:</p>
<ul>
  <li><code>createTodo(title)</code> &mdash; factory with defaults</li>
  <li><code>toggleComplete(todo)</code> &mdash; returns a new Todo with <code>completed</code> flipped</li>
  <li><code>addTodo(list, todo)</code> &mdash; returns a new list with the todo appended</li>
  <li><code>removeTodo(list, id)</code> &mdash; returns a new list without the matching todo</li>
  <li><code>updateTitle(list, id, newTitle)</code> &mdash; returns a new list with one todo's title changed</li>
</ul>
<p>Crucially: after every operation, the ORIGINAL data must be unchanged.</p>
`,
    starterCode: `interface Todo {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}

let nextId = 1;

// Create a new Todo with completed = false, auto-incrementing id
function createTodo(title: string): Todo {
  return { id: 0, title: '', completed: false }; // fix
}

// Return a new Todo with completed flipped
function toggleComplete(todo: Todo): Todo {
  return todo; // fix — must not mutate!
}

// Return a new list with the todo appended
function addTodo(list: ReadonlyArray<Todo>, todo: Todo): ReadonlyArray<Todo> {
  return list; // fix
}

// Return a new list without the todo matching the given id
function removeTodo(list: ReadonlyArray<Todo>, id: number): ReadonlyArray<Todo> {
  return list; // fix
}

// Return a new list with the matching todo's title updated
function updateTitle(list: ReadonlyArray<Todo>, id: number, newTitle: string): ReadonlyArray<Todo> {
  return list; // fix
}
`,
    solutionCode: `interface Todo {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}

let nextId = 1;

function createTodo(title: string): Todo {
  return { id: nextId++, title, completed: false };
}

function toggleComplete(todo: Todo): Todo {
  return { ...todo, completed: !todo.completed };
}

function addTodo(list: ReadonlyArray<Todo>, todo: Todo): ReadonlyArray<Todo> {
  return [...list, todo];
}

function removeTodo(list: ReadonlyArray<Todo>, id: number): ReadonlyArray<Todo> {
  return list.filter(t => t.id !== id);
}

function updateTitle(list: ReadonlyArray<Todo>, id: number, newTitle: string): ReadonlyArray<Todo> {
  return list.map(t => t.id === id ? { ...t, title: newTitle } : t);
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

nextId = 1;
const t1 = createTodo("Learn TypeScript");
assertEqual("createTodo title", "Learn TypeScript", t1.title);
assertEqual("createTodo completed", false, t1.completed);
assertEqual("createTodo id", 1, t1.id);

const t2 = toggleComplete(t1);
assertEqual("toggle creates new", true, t2.completed);
assertEqual("toggle original unchanged", false, t1.completed);

const list1: ReadonlyArray<Todo> = [];
const list2 = addTodo(list1, t1);
assertEqual("addTodo length", 1, list2.length);
assertEqual("addTodo original unchanged", 0, list1.length);

const t3 = createTodo("Build project");
const list3 = addTodo(list2, t3);
const list4 = removeTodo(list3, t1.id);
assertEqual("removeTodo length", 1, list4.length);
assertEqual("removeTodo kept correct item", t3.id, list4[0].id);
assertEqual("removeTodo original unchanged", 2, list3.length);

const list5 = updateTitle(list3, t1.id, "Master TypeScript");
assertEqual("updateTitle changed", "Master TypeScript", list5[0].title);
assertEqual("updateTitle original unchanged", "Learn TypeScript", list3[0].title);
`,
    hints: [
      'For <code>createTodo</code>: use <code>nextId++</code> for auto-incrementing IDs. Return <code>{ id: nextId++, title, completed: false }</code>.',
      'For <code>toggleComplete</code>: use the spread operator to create a copy with one field changed: <code>{ ...todo, completed: !todo.completed }</code>.',
      'For <code>addTodo</code>: <code>[...list, todo]</code> creates a new array with the todo appended. Never use <code>.push()</code> on a ReadonlyArray.',
      'For <code>removeTodo</code>: <code>list.filter(t => t.id !== id)</code>. For <code>updateTitle</code>: <code>list.map(t => t.id === id ? { ...t, title: newTitle } : t)</code>. Both return new arrays.',
    ],
    concepts: ['immutability', 'Moseley tar pit', 'spread operator', 'ReadonlyArray', 'pure functions', 'structural sharing'],
    successPatterns: [
      '\\.\\.\\.',
      'readonly',
      'ReadonlyArray',
      'filter|map',
    ],
    testNames: [
      'createTodo sets title',
      'createTodo defaults to not completed',
      'createTodo assigns incrementing id',
      'toggleComplete creates new todo with flipped state',
      'toggleComplete does not mutate original',
      'addTodo adds to list',
      'addTodo does not mutate original list',
      'removeTodo removes matching item',
      'removeTodo keeps other items',
      'removeTodo does not mutate original list',
      'updateTitle changes matching title',
      'updateTitle does not mutate original list',
    ],
  },

  'ts-pipe-compose': {
    id: 'ts-pipe-compose',
    language: 'typescript',
    title: 'Composition Is the Fundamental Tool',
    difficulty: 'intermediate',
    order: 2,
    description: `
<h3>The Ugly Way: One Big Function</h3>
<pre><code>function processUserData(rawInput: string): string {
  // Parse
  const data = JSON.parse(rawInput);
  // Validate
  if (!data.name || typeof data.name !== 'string') {
    return 'ERROR: invalid name';
  }
  if (!data.age || typeof data.age !== 'number') {
    return 'ERROR: invalid age';
  }
  // Transform
  const name = data.name.trim().toLowerCase();
  const birthYear = new Date().getFullYear() - data.age;
  // Format
  return name + ' (born ~' + birthYear + ')';
}
// 15 lines. 4 concerns. 0 reusability. 0 testability per step.</code></pre>

<h3>Why It Is Bad</h3>
<p>John Hughes in <em>"Why Functional Programming Matters"</em> makes a profound argument: the most important property of a programming paradigm is not what it includes but <strong>what tools it provides for modular decomposition</strong>. The function above cannot be decomposed. You cannot reuse the validation logic. You cannot test the formatting independently. You cannot swap the parsing step.</p>

<h3>The Beautiful Way: Small Functions, Composed</h3>
<pre><code>const process = pipe(
  parse,       // string -> RawData
  validate,    // RawData -> ValidData
  transform,   // ValidData -> TransformedData
  format       // TransformedData -> string
);

// Each step is:
// - independently testable
// - independently reusable
// - independently understandable
// The pipe is the composition operator that glues them together.</code></pre>

<p>Hughes' key insight: <em>smaller functions composed together</em> are strictly more powerful than one big function, because the pieces can be recombined in ways the original author never anticipated. The <code>pipe</code> function is the composition operator &mdash; it is to functions what <code>+</code> is to numbers.</p>

<blockquote><strong>Taste principle (Hughes):</strong> "The ways in which one can divide up the original problem depend directly on the ways in which one can glue solutions together." Composition (pipe, map, flatMap) is the fundamental glue. The better your glue, the smaller your pieces can be, and the more reusable they become.</blockquote>

<h3>Your Task</h3>
<p>Implement <code>pipe</code> (general), <code>compose</code> (right-to-left), and demonstrate them with a data processing pipeline that normalizes, validates, and formats user names.</p>
`,
    starterCode: `// General pipe: value flows left-to-right through functions
function pipe(value: any, ...fns: Array<(x: any) => any>): any {
  return undefined; // implement
}

// Compose: create a new function by composing right-to-left
// compose(f, g, h)(x) === f(g(h(x)))
function compose(...fns: Array<(x: any) => any>): (x: any) => any {
  return (x) => x; // implement
}

// Small, reusable functions — each does ONE thing
function trim(s: string): string { return s.trim(); }
function toLowerCase(s: string): string { return s.toLowerCase(); }
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function removeDuplicateSpaces(s: string): string {
  return s.replace(/\\s+/g, ' ');
}

// Use pipe to build a name normalizer:
// trim -> removeDuplicateSpaces -> toLowerCase -> capitalize
function normalizeName(name: string): string {
  return ""; // implement using pipe
}

// Use compose to build the same normalizer (for comparison):
const normalizeNameComposed: (name: string) => string = (name) => name; // implement using compose
`,
    solutionCode: `function pipe(value: any, ...fns: Array<(x: any) => any>): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

function compose(...fns: Array<(x: any) => any>): (x: any) => any {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

function trim(s: string): string { return s.trim(); }
function toLowerCase(s: string): string { return s.toLowerCase(); }
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function removeDuplicateSpaces(s: string): string {
  return s.replace(/\\s+/g, ' ');
}

function normalizeName(name: string): string {
  return pipe(name, trim, removeDuplicateSpaces, toLowerCase, capitalize);
}

const normalizeNameComposed = compose(capitalize, toLowerCase, removeDuplicateSpaces, trim);
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("pipe single fn", 6, pipe(3, (x: number) => x * 2));
assertEqual("pipe chain", "84", pipe("41", (s: string) => Number(s), (n: number) => n * 2, (n: number) => String(n)));
assertEqual("pipe identity", 5, pipe(5));

assertEqual("compose single", 6, compose((x: number) => x * 2)(3));
assertEqual("compose chain", 42, compose((x: number) => x + 2, (x: number) => x * 2)(20));

assertEqual("normalizeName basic", "Alice", normalizeName("  alice  "));
assertEqual("normalizeName messy", "John smith", normalizeName("  JOHN   smith  "));
assertEqual("normalizeName composed", "Alice", normalizeNameComposed("  alice  "));
assertEqual("normalizeName composed messy", "John smith", normalizeNameComposed("  JOHN   smith  "));
`,
    hints: [
      '<code>pipe</code> uses <code>reduce</code>: <code>fns.reduce((acc, fn) => fn(acc), value)</code>. Each function is applied to the result of the previous one, left to right.',
      '<code>compose</code> uses <code>reduceRight</code>: <code>(x) => fns.reduceRight((acc, fn) => fn(acc), x)</code>. Same idea but right to left, like mathematical function composition.',
      'For <code>normalizeName</code>: <code>pipe(name, trim, removeDuplicateSpaces, toLowerCase, capitalize)</code>. Read it as a pipeline: trim first, then remove extra spaces, then lowercase, then capitalize.',
      'For <code>normalizeNameComposed</code>: <code>compose(capitalize, toLowerCase, removeDuplicateSpaces, trim)</code>. Note the reversed order &mdash; compose reads right to left (innermost first).',
    ],
    concepts: ['pipe', 'compose', 'Hughes composition', 'function composition', 'reduce', 'small reusable functions', 'data pipeline'],
    successPatterns: [
      'reduce',
      'reduceRight',
      'pipe\\(name',
      'compose\\(',
    ],
    testNames: [
      'pipe with single function',
      'pipe chains multiple functions',
      'pipe with no functions is identity',
      'compose with single function',
      'compose chains right-to-left',
      'normalizeName handles basic case',
      'normalizeName handles messy input',
      'normalizeNameComposed handles basic case',
      'normalizeNameComposed handles messy input',
    ],
  },

  'ts-option-pattern': {
    id: 'ts-option-pattern',
    language: 'typescript',
    title: 'Null Is Not a Value, It Is the Absence of One',
    difficulty: 'intermediate',
    order: 3,
    description: `
<h3>The Ugly Way: The Pyramid of Doom</h3>
<pre><code>function getUserCity(db: Database, userId: string): string | null {
  const user = db.getUser(userId);
  if (user !== null) {
    const profile = db.getProfile(user.profileId);
    if (profile !== null) {
      const address = db.getAddress(profile.addressId);
      if (address !== null) {
        return address.city;
      }
    }
  }
  return null;
}
// Three levels of nesting for three lookups.
// Each null check is identical boilerplate.
// The actual logic (getting the city) is buried at indent level 3.</code></pre>

<h3>Why It Is Bad</h3>
<p>Tony Hoare called null his "billion-dollar mistake." The problem is not that absence exists &mdash; of course sometimes a user is not found. The problem is that <code>null</code> is invisible. Nothing in the type <code>User</code> tells you which operations might return nothing. And <code>null</code> does not compose: you cannot <code>map</code> over it, you cannot chain null checks without nesting.</p>

<h3>The Beautiful Way: Option with Chaining</h3>
<pre><code>function getUserCity(db: Database, userId: string): Option&lt;string&gt; {
  return pipe(
    db.getUser(userId),           // Option&lt;User&gt;
    flatMap(u => db.getProfile(u.profileId)),  // Option&lt;Profile&gt;
    flatMap(p => db.getAddress(p.addressId)),   // Option&lt;Address&gt;
    map(a => a.city)                            // Option&lt;string&gt;
  );
}
// Flat. Linear. Each step is one line.
// If any step returns none, everything after it is skipped automatically.</code></pre>

<p>Option forces you to handle absence explicitly. You cannot accidentally call <code>.city</code> on a null value because the compiler requires you to unwrap the Option first. And <code>flatMap</code> chains elegantly &mdash; no nesting, no pyramid.</p>

<blockquote><strong>Taste principle:</strong> "Handle absence explicitly. Null is not a value &mdash; it is the absence of one." When absence is encoded in the type (<code>Option&lt;T&gt;</code>), the compiler forces every caller to make a conscious decision: provide a default (<code>getOrElse</code>), transform if present (<code>map</code>), or chain to another optional operation (<code>flatMap</code>).</blockquote>

<h3>Your Task</h3>
<p>Implement the <code>Option</code> type with <code>some</code>, <code>none</code>, <code>map</code>, <code>flatMap</code>, <code>getOrElse</code>, and <code>filter</code>. Then use them to implement <code>findUserEmail</code> &mdash; a chain of lookups that any step might fail.</p>
`,
    starterCode: `type Option<T> =
  | { tag: 'some'; value: T }
  | { tag: 'none' };

function some<T>(value: T): Option<T> {
  return { tag: 'none' }; // fix
}

function none<T>(): Option<T> {
  return { tag: 'none' };
}

function mapOption<T, U>(opt: Option<T>, fn: (value: T) => U): Option<U> {
  return none(); // implement
}

function flatMapOption<T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U> {
  return none(); // implement
}

function getOrElse<T>(opt: Option<T>, defaultValue: T): T {
  return defaultValue; // implement
}

// Return some(value) if predicate is true, none() if false
function filterOption<T>(opt: Option<T>, predicate: (value: T) => boolean): Option<T> {
  return none(); // implement
}

// Mini database
const users: Record<string, { name: string; profileId: string }> = {
  'u1': { name: 'Alice', profileId: 'p1' },
  'u2': { name: 'Bob', profileId: 'p2' },
};
const profiles: Record<string, { email: string }> = {
  'p1': { email: 'alice@example.com' },
};

function findUser(id: string): Option<{ name: string; profileId: string }> {
  return id in users ? some(users[id]) : none();
}

function findProfile(profileId: string): Option<{ email: string }> {
  return profileId in profiles ? some(profiles[profileId]) : none();
}

// Chain: find user -> find profile -> extract email
function findUserEmail(userId: string): Option<string> {
  return none(); // implement using flatMapOption and mapOption
}
`,
    solutionCode: `type Option<T> =
  | { tag: 'some'; value: T }
  | { tag: 'none' };

function some<T>(value: T): Option<T> {
  return { tag: 'some', value };
}

function none<T>(): Option<T> {
  return { tag: 'none' };
}

function mapOption<T, U>(opt: Option<T>, fn: (value: T) => U): Option<U> {
  if (opt.tag === 'some') {
    return some(fn(opt.value));
  }
  return none();
}

function flatMapOption<T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U> {
  if (opt.tag === 'some') {
    return fn(opt.value);
  }
  return none();
}

function getOrElse<T>(opt: Option<T>, defaultValue: T): T {
  if (opt.tag === 'some') {
    return opt.value;
  }
  return defaultValue;
}

function filterOption<T>(opt: Option<T>, predicate: (value: T) => boolean): Option<T> {
  if (opt.tag === 'some' && predicate(opt.value)) {
    return opt;
  }
  return none();
}

const users: Record<string, { name: string; profileId: string }> = {
  'u1': { name: 'Alice', profileId: 'p1' },
  'u2': { name: 'Bob', profileId: 'p2' },
};
const profiles: Record<string, { email: string }> = {
  'p1': { email: 'alice@example.com' },
};

function findUser(id: string): Option<{ name: string; profileId: string }> {
  return id in users ? some(users[id]) : none();
}

function findProfile(profileId: string): Option<{ email: string }> {
  return profileId in profiles ? some(profiles[profileId]) : none();
}

function findUserEmail(userId: string): Option<string> {
  return mapOption(
    flatMapOption(
      findUser(userId),
      (user) => findProfile(user.profileId)
    ),
    (profile) => profile.email
  );
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("some wraps value", { tag: "some", value: 42 }, some(42));
assertEqual("none is empty", { tag: "none" }, none());
assertEqual("map some", { tag: "some", value: 10 }, mapOption(some(5), (x: number) => x * 2));
assertEqual("map none", { tag: "none" }, mapOption(none<number>(), (x: number) => x * 2));
assertEqual("flatMap some", { tag: "some", value: 42 }, flatMapOption(some(42), (x: number) => some(x)));
assertEqual("flatMap none", { tag: "none" }, flatMapOption(none<number>(), (x: number) => some(x)));
assertEqual("getOrElse some", 42, getOrElse(some(42), 0));
assertEqual("getOrElse none", 0, getOrElse(none<number>(), 0));
assertEqual("filter passes", { tag: "some", value: 5 }, filterOption(some(5), (x: number) => x > 0));
assertEqual("filter fails", { tag: "none" }, filterOption(some(-1), (x: number) => x > 0));
assertEqual("filter none", { tag: "none" }, filterOption(none<number>(), (x: number) => x > 0));
assertEqual("findUserEmail found", { tag: "some", value: "alice@example.com" }, findUserEmail("u1"));
assertEqual("findUserEmail no profile", { tag: "none" }, findUserEmail("u2"));
assertEqual("findUserEmail no user", { tag: "none" }, findUserEmail("u99"));
`,
    hints: [
      'Check <code>opt.tag === \'some\'</code> before accessing <code>opt.value</code>. This is the discriminated union pattern from Module 1.',
      'In <code>flatMapOption</code>: return <code>fn(opt.value)</code> directly since fn already returns an Option. In <code>mapOption</code>: wrap fn\'s result in <code>some()</code>.',
      'In <code>filterOption</code>: if it is some AND the predicate passes, return the option. Otherwise return <code>none()</code>.',
      'For <code>findUserEmail</code>: <code>flatMapOption(findUser(userId), user => findProfile(user.profileId))</code> chains the lookups, then <code>mapOption(..., profile => profile.email)</code> extracts the email.',
    ],
    concepts: ['Option type', 'billion-dollar mistake', 'null safety', 'map', 'flatMap', 'filter', 'monadic chaining'],
    successPatterns: [
      'tag.*some',
      'tag.*none',
      'opt\\.tag\\s*===',
      'flatMapOption',
    ],
    testNames: [
      'some wraps a value',
      'none creates empty Option',
      'map transforms some',
      'map passes through none',
      'flatMap chains some',
      'flatMap passes through none',
      'getOrElse extracts some',
      'getOrElse returns default for none',
      'filter keeps matching value',
      'filter rejects non-matching value',
      'filter on none returns none',
      'findUserEmail resolves full chain',
      'findUserEmail returns none when profile missing',
      'findUserEmail returns none when user missing',
    ],
  },

  'ts-algebraic-effects': {
    id: 'ts-algebraic-effects',
    language: 'typescript',
    title: 'Separating What from How',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Ugly Way: Logic Tangled with Infrastructure</h3>
<pre><code>async function processOrder(orderId: string): Promise&lt;void&gt; {
  console.log("[INFO] Processing order " + orderId);
  const now = Date.now();
  const order = await fetch("/api/orders/" + orderId).then(r => r.json());

  if (order.total > 1000) {
    console.log("[WARN] High-value order detected");
    await fetch("/api/alerts", {
      method: "POST",
      body: JSON.stringify({ type: "high-value", orderId })
    });
  }

  const tax = order.total * 0.08;
  await fetch("/api/orders/" + orderId, {
    method: "PATCH",
    body: JSON.stringify({ tax, processedAt: now })
  });
  console.log("[INFO] Order processed in " + (Date.now() - now) + "ms");
}</code></pre>

<h3>Why It Is Bad</h3>
<p>The business logic ("orders over $1000 get an alert, tax is 8%") is <strong>tangled</strong> with infrastructure (fetch, console.log, Date.now). You cannot test the business logic without mocking fetch. You cannot run it against a different database without rewriting the function. You cannot replay it deterministically because Date.now() changes.</p>

<p>John Hughes argued that the power of functional programming comes from <em>separating specification from implementation</em>. The specification is: "compute tax, flag high-value orders." The implementation is: "use fetch to talk to this API, console.log to record events." These should be independent.</p>

<h3>The Beautiful Way: Effects as an Interface</h3>
<pre><code>interface OrderEffects {
  log(level: string, message: string): void;
  getTime(): number;
  fetchOrder(id: string): Order;
  sendAlert(alert: Alert): void;
  updateOrder(id: string, updates: Partial&lt;Order&gt;): void;
}

function processOrder(fx: OrderEffects, orderId: string): void {
  fx.log("INFO", "Processing order " + orderId);
  const now = fx.getTime();
  const order = fx.fetchOrder(orderId);
  // ... pure business logic using fx instead of globals
}</code></pre>

<p>Now you can test with a mock interpreter, run in production with a real one, and replay with a deterministic one. The business logic is <strong>the same function</strong> in all three cases.</p>

<blockquote><strong>Taste principle (Hughes):</strong> "Separate specification from implementation." Your business logic specifies WHAT effects it needs. The interpreter decides HOW to fulfill them. This separation is the deepest form of modularity &mdash; it decouples the logic from the entire outside world.</blockquote>

<h3>Your Task</h3>
<p>Define a <code>Logger</code> and <code>Clock</code> effects interface. Implement a <code>processEvents</code> function that uses these effects. Create both a <code>testEffects</code> (deterministic, captures logs) and demonstrate that the same business logic can be tested purely.</p>
`,
    starterCode: `// Effects interface: WHAT our program needs from the world
interface Effects {
  log(message: string): void;
  getTime(): number;      // returns hour (0-23)
  getRandom(): number;    // returns a number 0-1
}

// Business logic: process a greeting based on time and randomness.
// 1. Log "Processing greeting for {name}"
// 2. If hour < 12, greeting = "Good morning"
//    If hour < 18, greeting = "Good afternoon"
//    Otherwise, greeting = "Good evening"
// 3. If getRandom() > 0.5, append "! Have a great day" to greeting
//    Otherwise, append "."
// 4. Log "Generated: {fullGreeting}"
// 5. Return the full greeting string: e.g., "Good morning, Alice! Have a great day"
function generateGreeting(fx: Effects, name: string): string {
  return ""; // implement
}

// Test interpreter: captures logs, returns fixed values
function createTestEffects(fixedHour: number, fixedRandom: number): Effects & { logs: string[] } {
  return {
    log: (_msg: string) => {},
    getTime: () => 0,
    getRandom: () => 0,
    logs: [],
  }; // fix
}

// Production interpreter (for reference, not tested):
function createRealEffects(): Effects {
  return {
    log: (msg: string) => console.log(msg),
    getTime: () => new Date().getHours(),
    getRandom: () => Math.random(),
  };
}
`,
    solutionCode: `interface Effects {
  log(message: string): void;
  getTime(): number;
  getRandom(): number;
}

function generateGreeting(fx: Effects, name: string): string {
  fx.log("Processing greeting for " + name);
  const hour = fx.getTime();
  let greeting: string;
  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  const suffix = fx.getRandom() > 0.5 ? "! Have a great day" : ".";
  const full = greeting + ", " + name + suffix;
  fx.log("Generated: " + full);
  return full;
}

function createTestEffects(fixedHour: number, fixedRandom: number): Effects & { logs: string[] } {
  const logs: string[] = [];
  return {
    log: (message: string) => { logs.push(message); },
    getTime: () => fixedHour,
    getRandom: () => fixedRandom,
    logs,
  };
}

function createRealEffects(): Effects {
  return {
    log: (msg: string) => console.log(msg),
    getTime: () => new Date().getHours(),
    getRandom: () => Math.random(),
  };
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const morning = createTestEffects(9, 0.8);
assertEqual("morning enthusiastic", "Good morning, Alice! Have a great day", generateGreeting(morning, "Alice"));
assertEqual("morning logs count", 2, morning.logs.length);
assertEqual("morning log start", "Processing greeting for Alice", morning.logs[0]);

const afternoon = createTestEffects(14, 0.3);
assertEqual("afternoon calm", "Good afternoon, Bob.", generateGreeting(afternoon, "Bob"));
assertEqual("afternoon log end", "Generated: Good afternoon, Bob.", afternoon.logs[1]);

const evening = createTestEffects(20, 0.9);
assertEqual("evening enthusiastic", "Good evening, Eve! Have a great day", generateGreeting(evening, "Eve"));

const midnight = createTestEffects(0, 0.1);
assertEqual("midnight is morning", "Good morning, Dave.", generateGreeting(midnight, "Dave"));

const exactNoon = createTestEffects(12, 0.5);
assertEqual("noon is afternoon", "Good afternoon, Carl.", generateGreeting(exactNoon, "Carl"));

const exactSixPM = createTestEffects(18, 0.51);
assertEqual("6pm is evening", "Good evening, Fay! Have a great day", generateGreeting(exactSixPM, "Fay"));
`,
    hints: [
      'Call <code>fx.log()</code>, <code>fx.getTime()</code>, and <code>fx.getRandom()</code> instead of console.log, Date, and Math.random. This is the whole point: the function declares what it needs, the interpreter provides it.',
      'Use three time ranges: <code>hour < 12</code> (morning), <code>hour < 18</code> (afternoon), else (evening). The suffix depends on <code>fx.getRandom() > 0.5</code>.',
      'Format: <code>greeting + ", " + name + suffix</code>. Do not forget the comma and space before the name.',
      'In <code>createTestEffects</code>: create a <code>logs</code> array, push to it in <code>log</code>, return <code>fixedHour</code> from <code>getTime</code> and <code>fixedRandom</code> from <code>getRandom</code>. Deterministic effects make tests reproducible.',
    ],
    concepts: ['algebraic effects', 'dependency injection', 'Hughes separation', 'testability', 'pure business logic', 'interpreter pattern'],
    successPatterns: [
      'fx\\.log',
      'fx\\.getTime',
      'fx\\.getRandom',
      'logs\\.push',
    ],
    testNames: [
      'morning greeting with enthusiastic suffix',
      'logs are captured correctly',
      'first log is processing message',
      'afternoon greeting with calm suffix',
      'last log contains generated greeting',
      'evening greeting is correct',
      'midnight counts as morning',
      'noon counts as afternoon',
      '6pm counts as evening',
    ],
  },

  // ─── Module 4: Advanced Type System ───────────────────────────────────
  // "The type system is a programming language"

  'ts-mapped-types': {
    id: 'ts-mapped-types',
    language: 'typescript',
    title: 'DRY at the Type Level',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Ugly Way: Copy-Paste Types</h3>
<pre><code>interface User {
  name: string;
  email: string;
  age: number;
}

// Needed for forms: all fields optional
interface UserDraft {
  name?: string;
  email?: string;
  age?: number;
}

// Needed for display: all fields readonly
interface UserView {
  readonly name: string;
  readonly email: string;
  readonly age: number;
}

// Needed for updates: all fields optional AND partial
interface UserUpdate {
  name?: string;
  email?: string;
  age?: number;
}

// Needed for tracking which fields the user has touched
interface UserTouched {
  name: boolean;
  email: boolean;
  age: boolean;
}</code></pre>

<h3>Why It Is Bad</h3>
<p>Five types that are all derived from <code>User</code>. If you add a <code>phone</code> field to <code>User</code>, you must update <strong>all five</strong>. You will forget at least one. This is the type-level equivalent of copy-paste programming.</p>

<h3>The Beautiful Way: Mapped Types Derive Types from Types</h3>
<pre><code>type UserDraft   = Partial&lt;User&gt;;
type UserView    = Readonly&lt;User&gt;;
type UserUpdate  = Partial&lt;User&gt;;
type UserTouched = { [K in keyof User]: boolean };</code></pre>

<p>Now there is <strong>one source of truth</strong>: the <code>User</code> interface. All other types are derived from it. Add a field once, and every derived type updates automatically.</p>

<p>Mapped types use the syntax <code>{ [K in keyof T]: ... }</code> to iterate over every key of <code>T</code> and produce a new type. You can add modifiers (<code>?</code>, <code>readonly</code>), remove them (<code>-?</code>, <code>-readonly</code>), or transform the value type.</p>

<blockquote><strong>Taste principle (DRY at the type level):</strong> Every piece of knowledge should have a single, unambiguous representation. Mapped types apply this principle to the type system itself. Instead of maintaining five parallel type definitions, you write one and derive the rest.</blockquote>

<h3>Your Task</h3>
<p>Implement these mapped types from scratch (do not use built-in utilities):</p>
<ul>
  <li><code>MyPartial&lt;T&gt;</code> &mdash; all properties optional</li>
  <li><code>MyRequired&lt;T&gt;</code> &mdash; all properties required</li>
  <li><code>MyReadonly&lt;T&gt;</code> &mdash; all properties readonly</li>
  <li><code>MyPick&lt;T, K&gt;</code> &mdash; only the specified keys</li>
  <li><code>Touched&lt;T&gt;</code> &mdash; every property becomes <code>boolean</code> (a REAL use case: form state tracking)</li>
</ul>
`,
    starterCode: `// Make all properties optional
type MyPartial<T> = any; // <-- implement with mapped type syntax

// Make all properties required (remove optional)
type MyRequired<T> = any; // <-- implement

// Make all properties readonly
type MyReadonly<T> = any; // <-- implement

// Pick only the specified keys
type MyPick<T, K extends keyof T> = any; // <-- implement

// Transform every property to boolean (for form "touched" state)
type Touched<T> = any; // <-- implement

// Test interface
interface FormData {
  username: string;
  email: string;
  age: number;
}

// Runtime verification functions
function makePartial(data: MyPartial<FormData>): MyPartial<FormData> {
  return data;
}

function makeRequired(data: MyRequired<FormData>): MyRequired<FormData> {
  return data;
}

function makeReadonly(data: MyReadonly<FormData>): MyReadonly<FormData> {
  return data;
}

function pickUsername(data: MyPick<FormData, 'username'>): MyPick<FormData, 'username'> {
  return data;
}

function makeTouched(data: Touched<FormData>): Touched<FormData> {
  return data;
}
`,
    solutionCode: `type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Touched<T> = {
  [K in keyof T]: boolean;
};

interface FormData {
  username: string;
  email: string;
  age: number;
}

function makePartial(data: MyPartial<FormData>): MyPartial<FormData> {
  return data;
}

function makeRequired(data: MyRequired<FormData>): MyRequired<FormData> {
  return data;
}

function makeReadonly(data: MyReadonly<FormData>): MyReadonly<FormData> {
  return data;
}

function pickUsername(data: MyPick<FormData, 'username'>): MyPick<FormData, 'username'> {
  return data;
}

function makeTouched(data: Touched<FormData>): Touched<FormData> {
  return data;
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("partial allows empty", {}, makePartial({}));
assertEqual("partial allows subset", { username: "alice" }, makePartial({ username: "alice" }));
assertEqual("required has all fields", { username: "a", email: "b", age: 1 }, makeRequired({ username: "a", email: "b", age: 1 }));
assertEqual("readonly preserves values", { username: "a", email: "b", age: 1 }, makeReadonly({ username: "a", email: "b", age: 1 }));
assertEqual("pick username only", { username: "alice" }, pickUsername({ username: "alice" }));
assertEqual("touched all booleans", { username: false, email: false, age: true }, makeTouched({ username: false, email: false, age: true }));
`,
    hints: [
      'The mapped type syntax is <code>{ [K in keyof T]: T[K] }</code> &mdash; this copies all properties unchanged. Add modifiers to transform them.',
      'For optional: add <code>?</code> after the key: <code>[K in keyof T]?: T[K]</code>. For required: remove <code>?</code> with <code>[K in keyof T]-?: T[K]</code>.',
      'For readonly: add <code>readonly</code> before the key: <code>readonly [K in keyof T]: T[K]</code>.',
      'For <code>Touched</code>: replace the value type with <code>boolean</code>: <code>[K in keyof T]: boolean</code>. This is the pattern for deriving a structurally different type that follows the same shape.',
    ],
    concepts: ['mapped types', 'keyof', 'type-level DRY', 'Partial', 'Required', 'Readonly', 'Pick', 'form state tracking'],
    successPatterns: [
      'K\\s+in\\s+keyof\\s+T',
      '\\?:\\s*T\\[K\\]',
      '-\\?',
      'readonly',
    ],
    testNames: [
      'MyPartial allows empty object',
      'MyPartial allows subset of fields',
      'MyRequired enforces all fields',
      'MyReadonly preserves values',
      'MyPick selects only specified keys',
      'Touched maps all properties to boolean',
    ],
  },

  'ts-conditional-types': {
    id: 'ts-conditional-types',
    language: 'typescript',
    title: 'Make the Type System Work FOR You',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Ugly Way: Parallel Type Definitions</h3>
<pre><code>interface ClickEvent { x: number; y: number }
interface HoverEvent { x: number; y: number; target: string }
interface KeyEvent   { key: string; modifiers: string[] }

// For every event, a manually-maintained handler type:
type ClickHandler = (event: ClickEvent) => void;
type HoverHandler = (event: HoverEvent) => void;
type KeyHandler   = (event: KeyEvent) => void;

// And a manually-maintained emitter:
function onEvent(type: 'click', handler: ClickHandler): void;
function onEvent(type: 'hover', handler: HoverHandler): void;
function onEvent(type: 'key',   handler: KeyHandler): void;
function onEvent(type: string, handler: any): void {
  // ...
}
// Add a new event type? Update THREE places. Miss one? Silent bug.</code></pre>

<h3>Why It Is Bad</h3>
<p>The event name, its data type, and its handler type are three representations of the same knowledge. They must stay in sync manually. This violates DRY at the type level and guarantees drift.</p>

<h3>The Beautiful Way: Conditional Types + Mapped Types</h3>
<pre><code>interface EventMap {
  click: { x: number; y: number };
  hover: { x: number; y: number; target: string };
  key:   { key: string; modifiers: string[] };
}

// Derive the handler type FROM the event map:
type EventHandler&lt;K extends keyof EventMap&gt; = (event: EventMap[K]) => void;

// One generic function handles all events, type-safely:
function onEvent&lt;K extends keyof EventMap&gt;(type: K, handler: EventHandler&lt;K&gt;): void {
  // ...
}</code></pre>

<p>Now there is <strong>one source of truth</strong>: the <code>EventMap</code>. Add a new event in one place, and the types flow everywhere automatically.</p>

<p>Conditional types go further. They let you write <strong>type-level if/else</strong>: <code>T extends U ? X : Y</code>. Combined with <code>infer</code>, you can <em>extract</em> types from within other types. This is programming at the type level.</p>

<blockquote><strong>Taste principle:</strong> "Make the type system work FOR you, not against you." Every manually-maintained type correspondence is a potential inconsistency. If you can derive one type from another, do it. Conditional types and mapped types are the tools.</blockquote>

<h3>Your Task</h3>
<p>Build a type-safe event system. Define:</p>
<ul>
  <li><code>EventMap</code> mapping event names to their data types</li>
  <li><code>EventHandler&lt;K&gt;</code> derived from EventMap</li>
  <li>A conditional type <code>IsString&lt;T&gt;</code> that evaluates to <code>true</code> or <code>false</code></li>
  <li><code>MyReturnType&lt;T&gt;</code> using <code>infer</code> to extract a function's return type</li>
  <li>An <code>EventEmitter</code> class with type-safe <code>on()</code> and <code>emit()</code></li>
</ul>
`,
    starterCode: `// The event map: single source of truth
interface EventMap {
  click: { x: number; y: number };
  hover: { x: number; y: number; target: string };
  focus: { elementId: string };
}

// Derive handler type from the map
type EventHandler<K extends keyof EventMap> = any; // <-- implement

// Conditional type: is T a string?
type IsString<T> = any; // <-- implement

// Extract return type of a function using infer
type MyReturnType<T> = any; // <-- implement

// Type-safe event emitter
class EventEmitter {
  private handlers: { [K in keyof EventMap]?: Array<(data: EventMap[K]) => void> } = {};

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    // implement
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    // implement
  }
}

// Runtime type checks for testing
function checkIsString(value: any, expected: boolean): boolean {
  return expected;
}

function testReturnType(fn: () => number): number {
  return fn();
}
`,
    solutionCode: `interface EventMap {
  click: { x: number; y: number };
  hover: { x: number; y: number; target: string };
  focus: { elementId: string };
}

type EventHandler<K extends keyof EventMap> = (event: EventMap[K]) => void;

type IsString<T> = T extends string ? true : false;

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

class EventEmitter {
  private handlers: { [K in keyof EventMap]?: Array<(data: EventMap[K]) => void> } = {};

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    if (!this.handlers[event]) {
      (this.handlers[event] as any) = [];
    }
    (this.handlers[event] as any).push(handler);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const fns = this.handlers[event];
    if (fns) {
      (fns as any[]).forEach((fn: any) => fn(data));
    }
  }
}

function checkIsString(value: any, expected: boolean): boolean {
  return expected;
}

function testReturnType(fn: () => number): number {
  return fn();
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("IsString string", true, checkIsString("hello", true));
assertEqual("IsString number", true, checkIsString(42, true));
assertEqual("ReturnType", 42, testReturnType(() => 42));

let clickData: any = null;
let focusData: any = null;
const emitter = new EventEmitter();
emitter.on("click", (data) => { clickData = data; });
emitter.emit("click", { x: 10, y: 20 });
assertEqual("emit click", { x: 10, y: 20 }, clickData);

emitter.on("focus", (data) => { focusData = data; });
emitter.emit("focus", { elementId: "input-1" });
assertEqual("emit focus", { elementId: "input-1" }, focusData);

let hoverData: any = null;
emitter.on("hover", (data) => { hoverData = data; });
emitter.emit("hover", { x: 5, y: 15, target: "button" });
assertEqual("emit hover", { x: 5, y: 15, target: "button" }, hoverData);
`,
    hints: [
      '<code>EventHandler&lt;K&gt;</code> is simply: <code>(event: EventMap[K]) => void</code>. The <code>K</code> generic parameter indexes into <code>EventMap</code> to get the correct data type.',
      '<code>IsString</code>: <code>T extends string ? true : false</code>. This is a conditional type &mdash; type-level if/else.',
      '<code>MyReturnType</code>: <code>T extends (...args: any[]) => infer R ? R : never</code>. The <code>infer R</code> keyword tells TypeScript to extract and bind the return type.',
      'In the EventEmitter, <code>on()</code> pushes to the handlers array (creating it if needed). <code>emit()</code> iterates and calls each handler with the data.',
    ],
    concepts: ['conditional types', 'infer', 'type-safe events', 'EventMap pattern', 'mapped types', 'DRY types', 'type-level programming'],
    successPatterns: [
      'extends\\s+string\\s*\\?',
      'infer\\s+R',
      'EventMap\\[K\\]',
      'handlers\\[event\\]',
    ],
    testNames: [
      'IsString detects string type',
      'IsString rejects number type',
      'ReturnType extracts number',
      'emit and receive click event',
      'emit and receive focus event',
      'emit and receive hover event',
    ],
  },

  'ts-template-literals': {
    id: 'ts-template-literals',
    language: 'typescript',
    title: 'Express It in the Type, Express It in the Type',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>The Ugly Way: Stringly Typed</h3>
<pre><code>function getRoute(path: string, params: Record&lt;string, string&gt;): string {
  return path.replace(/:([a-zA-Z]+)/g, (_, key) => params[key] ?? '');
}

// No type safety. Typos compile fine. Missing params compile fine.
getRoute("/users/:id/posts/:postId", { id: "5" });
// Missing 'postId' — runtime bug, not a compile error.

getRoute("/users/:id", { idd: "5" });
// Typo 'idd' — runtime bug, not a compile error.</code></pre>

<h3>Why It Is Bad</h3>
<p>The route string <code>"/users/:id/posts/:postId"</code> contains structured information (two parameters named "id" and "postId"), but it is typed as plain <code>string</code>. All structure is lost. The compiler cannot help you pass the right parameters.</p>

<h3>The Beautiful Way: Template Literal Types Parse Strings at Compile Time</h3>
<pre><code>type ExtractParams&lt;Path extends string&gt; =
  Path extends \`\${infer _Start}:\${infer Param}/\${infer Rest}\`
    ? { [K in Param | keyof ExtractParams&lt;Rest&gt;]: string }
    : Path extends \`\${infer _Start}:\${infer Param}\`
      ? { [K in Param]: string }
      : {};

type Params = ExtractParams&lt;"/users/:id/posts/:postId"&gt;;
// = { id: string; postId: string }
// The type system PARSED the route string!</code></pre>

<p>This is the "wow" moment. TypeScript's type system is a programming language. The input is a type (a string literal). The output is a type (an object with the extracted parameter names). The compiler runs this "program" at build time.</p>

<blockquote><strong>Taste principle:</strong> "If you can express a constraint in the type, express it in the type." Every constraint that lives in the type system is enforced automatically, everywhere, forever. Constraints that live only in documentation or runtime checks must be remembered, tested, and maintained manually.</blockquote>

<h3>Your Task</h3>
<p>Build type-safe route utilities:</p>
<ul>
  <li>A <code>HandlerName</code> type that transforms event names to handler names using template literals: <code>"click" -> "onClick"</code></li>
  <li>A <code>getHandlerName</code> function that computes this at runtime</li>
  <li>A type-safe <code>buildPath</code> function that constructs paths with parameter substitution</li>
</ul>
`,
    starterCode: `type EventName = 'click' | 'hover' | 'focus';

// Generate handler method names: 'onClick' | 'onHover' | 'onFocus'
type HandlerName = any; // <-- implement using template literal types

// Map from event name to its data type
interface EventMap {
  click: { x: number; y: number };
  hover: { x: number; y: number };
  focus: { target: string };
}

// Compute handler name at runtime
function getHandlerName<K extends EventName>(event: K): \`on\${Capitalize<K>}\` {
  return "" as any; // implement
}

// Type-safe path builder
// Given a path template and params, substitute :param with values
function buildPath(template: string, params: Record<string, string>): string {
  return ""; // implement
}

// Type for CSS property names: convert camelCase to kebab-case display
type CSSPropDisplay = \`--\${string}\`;
function cssVar(name: string): CSSPropDisplay {
  return "" as any; // implement
}
`,
    solutionCode: `type EventName = 'click' | 'hover' | 'focus';

type HandlerName = \`on\${Capitalize<EventName>}\`;

interface EventMap {
  click: { x: number; y: number };
  hover: { x: number; y: number };
  focus: { target: string };
}

function getHandlerName<K extends EventName>(event: K): \`on\${Capitalize<K>}\` {
  return ("on" + event.charAt(0).toUpperCase() + event.slice(1)) as \`on\${Capitalize<K>}\`;
}

function buildPath(template: string, params: Record<string, string>): string {
  return template.replace(/:([a-zA-Z]+)/g, (_, key) => params[key] ?? ':' + key);
}

type CSSPropDisplay = \`--\${string}\`;
function cssVar(name: string): CSSPropDisplay {
  return ("--" + name) as CSSPropDisplay;
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("handler name click", "onClick", getHandlerName("click"));
assertEqual("handler name hover", "onHover", getHandlerName("hover"));
assertEqual("handler name focus", "onFocus", getHandlerName("focus"));

assertEqual("buildPath simple", "/users/42", buildPath("/users/:id", { id: "42" }));
assertEqual("buildPath multiple", "/users/5/posts/99", buildPath("/users/:id/posts/:postId", { id: "5", postId: "99" }));
assertEqual("buildPath no params", "/about", buildPath("/about", {}));

assertEqual("cssVar", "--primary-color", cssVar("primary-color"));
assertEqual("cssVar spacing", "--spacing-md", cssVar("spacing-md"));
`,
    hints: [
      'Template literal type syntax: <code>type HandlerName = \\`on\\${Capitalize<EventName>}\\`</code>. TypeScript distributes over the union, generating one string type per event.',
      'In <code>getHandlerName</code>: build the string at runtime with <code>"on" + event.charAt(0).toUpperCase() + event.slice(1)</code>, then cast to the template literal return type.',
      'In <code>buildPath</code>: use <code>template.replace(/:([a-zA-Z]+)/g, (_, key) => params[key])</code> to substitute parameters.',
      'In <code>cssVar</code>: prepend <code>"--"</code> to the name and cast to <code>CSSPropDisplay</code>.',
    ],
    concepts: ['template literal types', 'Capitalize', 'type-safe routing', 'string manipulation at type level', 'express constraints in types'],
    successPatterns: [
      'Capitalize',
      'on\\$\\{',
      'replace.*:',
      '--',
    ],
    testNames: [
      'handler name for click',
      'handler name for hover',
      'handler name for focus',
      'buildPath with single parameter',
      'buildPath with multiple parameters',
      'buildPath with no parameters',
      'cssVar creates custom property',
      'cssVar with compound name',
    ],
  },

  'ts-type-challenges': {
    id: 'ts-type-challenges',
    language: 'typescript',
    title: 'Programs That Run at Compile Time',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>Type-Level Thinking</h3>
<p>Everything you have learned in this module builds to one insight: <strong>the TypeScript type system is a programming language</strong>. The inputs are types. The outputs are types. The "programs" run at compile time. You have already used the primitives:</p>

<ul>
  <li><strong>Mapped types</strong> are loops: <code>{ [K in keyof T]: ... }</code></li>
  <li><strong>Conditional types</strong> are if/else: <code>T extends U ? X : Y</code></li>
  <li><strong>Infer</strong> is pattern matching: <code>T extends Array&lt;infer E&gt; ? E : never</code></li>
  <li><strong>Recursive types</strong> are recursion: a type that references itself</li>
</ul>

<p>With these four primitives, you can write programs of surprising complexity that execute entirely at compile time. The "output" is a type that constrains your runtime code. If the type-level program produces the right constraints, entire categories of runtime bugs become impossible.</p>

<blockquote><strong>Taste principle (Curry-Howard correspondence):</strong> Types are propositions. Programs are proofs. When you write a type like <code>DeepReadonly&lt;T&gt;</code>, you are stating a proposition: "this value and all its nested values are immutable." When TypeScript accepts your code, it has <em>proved</em> that proposition. If you did the Haskell track, this is the same correspondence &mdash; types as logic, programs as evidence.</blockquote>

<h3>Your Challenges</h3>
<p>Implement three type-level "programs":</p>

<h4>1. DeepReadonly&lt;T&gt;</h4>
<p>The built-in <code>Readonly</code> only works one level deep. <code>DeepReadonly</code> recursively makes ALL nested objects and arrays readonly. This is loops + conditionals + recursion.</p>

<h4>2. Flatten&lt;T&gt;</h4>
<p>Takes a tuple that may contain nested arrays and flattens one level: <code>Flatten&lt;[1, [2, 3], [4]]&gt;</code> becomes <code>[1, 2, 3, 4]</code>. This uses variadic tuple types + conditional + recursion.</p>

<h4>3. TupleToUnion&lt;T&gt;</h4>
<p>Converts a tuple to a union of its elements: <code>TupleToUnion&lt;[string, number]&gt;</code> becomes <code>string | number</code>. This has a beautifully simple solution.</p>
`,
    starterCode: `// Recursively make all properties and nested objects readonly
type DeepReadonly<T> = any; // <-- implement

// Flatten a tuple one level: [1, [2, 3], [4]] -> [1, 2, 3, 4]
type Flatten<T extends any[]> = any; // <-- implement

// Convert a tuple to a union of its elements
type TupleToUnion<T extends any[]> = any; // <-- implement

// Runtime verification helpers
interface Nested {
  name: string;
  settings: {
    theme: string;
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
  tags: string[];
}

function deepFreeze<T>(obj: T): DeepReadonly<T> {
  return obj as any;
}

function flattenArray<T extends any[]>(arr: T): Flatten<T> {
  return ([] as any[]).concat(...arr) as any;
}

function tupleElement<T extends any[]>(tuple: T, index: number): TupleToUnion<T> {
  return tuple[index];
}
`,
    solutionCode: `type DeepReadonly<T> = T extends (infer E)[]
  ? ReadonlyArray<DeepReadonly<E>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...First, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];

type TupleToUnion<T extends any[]> = T[number];

interface Nested {
  name: string;
  settings: {
    theme: string;
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
  tags: string[];
}

function deepFreeze<T>(obj: T): DeepReadonly<T> {
  return obj as any;
}

function flattenArray<T extends any[]>(arr: T): Flatten<T> {
  return ([] as any[]).concat(...arr) as any;
}

function tupleElement<T extends any[]>(tuple: T, index: number): TupleToUnion<T> {
  return tuple[index];
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const frozen = deepFreeze({
  name: "Alice",
  settings: { theme: "dark", notifications: { email: true, sms: false } },
  tags: ["admin"]
});
assertEqual("deepFreeze top level", "Alice", frozen.name);
assertEqual("deepFreeze nested", "dark", frozen.settings.theme);
assertEqual("deepFreeze deep nested", true, frozen.settings.notifications.email);

assertEqual("flatten nested", [1, 2, 3, 4], flattenArray([1, [2, 3], [4]]));
assertEqual("flatten empty", [], flattenArray([]));
assertEqual("flatten already flat", [1, 2, 3], flattenArray([1, 2, 3]));
assertEqual("flatten single nested", [1, 2], flattenArray([[1, 2]]));

assertEqual("tupleToUnion first", "hello", tupleElement(["hello", 42, true], 0));
assertEqual("tupleToUnion second", 42, tupleElement(["hello", 42, true], 1));
`,
    hints: [
      'For <code>DeepReadonly</code>: first check if T is an array (<code>T extends (infer E)[]</code>), then if it is an object. For arrays, produce <code>ReadonlyArray&lt;DeepReadonly&lt;E&gt;&gt;</code>. For objects, produce <code>{ readonly [K in keyof T]: DeepReadonly&lt;T[K]&gt; }</code>. For primitives, return <code>T</code>.',
      'For <code>Flatten</code>: use variadic tuples. <code>T extends [infer First, ...infer Rest]</code> destructures the tuple. If <code>First extends any[]</code>, spread it: <code>[...First, ...Flatten&lt;Rest&gt;]</code>. Otherwise: <code>[First, ...Flatten&lt;Rest&gt;]</code>. Base case: empty tuple returns <code>[]</code>.',
      '<code>TupleToUnion</code> has an elegant one-liner: <code>T[number]</code>. Indexing a tuple with <code>number</code> gives the union of all element types.',
      'These are recursive type-level programs. <code>DeepReadonly</code> recurses into nested objects. <code>Flatten</code> recurses through tuple elements. Think of them as compile-time algorithms.',
    ],
    concepts: ['DeepReadonly', 'Flatten', 'TupleToUnion', 'recursive types', 'type-level programming', 'Curry-Howard', 'compile-time computation'],
    successPatterns: [
      'DeepReadonly',
      'T\\[number\\]',
      'infer.*First',
      'readonly.*keyof',
    ],
    testNames: [
      'deepFreeze preserves top-level values',
      'deepFreeze preserves nested values',
      'deepFreeze preserves deeply nested values',
      'flatten nested arrays',
      'flatten empty array',
      'flatten already flat array',
      'flatten single nested array',
      'tupleToUnion accesses first element',
      'tupleToUnion accesses second element',
    ],
  },
};
