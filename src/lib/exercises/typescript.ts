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

  // ─── Module 5: Architecture ─────────────────────────────────────────────
  // "Structure is the first design decision"

  'ts-dependency-injection': {
    id: 'ts-dependency-injection',
    language: 'typescript',
    title: 'Dependency Injection Through Interfaces',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Ugly Way</h3>
<pre><code>class UserService {
  private db = new PostgresConnection("localhost:5432");
  private logger = new FileLogger("/var/log/app.log");

  async getUser(id: string) {
    this.logger.log("Fetching user " + id);
    return this.db.query("SELECT * FROM users WHERE id = $1", [id]);
  }
}

// Cannot test without a real database
// Cannot swap logger without editing the class
// Cannot reuse in a different environment
const service = new UserService();</code></pre>

<h3>Why It Is Bad</h3>
<p>This class secretly depends on a Postgres database and a filesystem logger. You cannot see these dependencies from the outside. You cannot test <code>getUser</code> without spinning up a real database. You cannot use this service in a Lambda function where the filesystem is read-only. Every concrete dependency is a hidden coupling that makes the code brittle and untestable.</p>

<p>David Parnas called this the key insight of <em>information hiding</em>: a module should depend on <strong>interfaces</strong>, not on the implementation details of other modules. When <code>UserService</code> hard-codes <code>PostgresConnection</code>, it has violated this principle &mdash; it knows <em>how</em> data is stored, not just <em>that</em> data can be stored.</p>

<h3>The Beautiful Way: Constructor-Injected Dependencies</h3>
<pre><code>interface Database {
  query(sql: string, params: unknown[]): Promise<unknown>;
}

interface Logger {
  log(message: string): void;
}

interface UserServiceDeps {
  db: Database;
  logger: Logger;
}

function createUserService(deps: UserServiceDeps) {
  return {
    getUser: async (id: string) => {
      deps.logger.log("Fetching user " + id);
      return deps.db.query("SELECT * FROM users WHERE id = $1", [id]);
    }
  };
}</code></pre>

<p>Now the dependencies are <strong>visible, swappable, and testable</strong>. Pass a mock database for tests. Pass a console logger for development. Pass a cloud logger for production. The <code>UserService</code> does not know or care.</p>

<blockquote><strong>Taste principle (Parnas, 1972):</strong> "One must provide the intended user with all the information needed to make proper use of the module, and nothing more." Dependencies should be explicit in the interface, not hidden in the implementation.</blockquote>

<h3>Your Task</h3>
<p>Refactor a <code>NotificationService</code> that internally creates its own email client, SMS client, and logger. Define interfaces for each dependency, create a <code>NotificationServiceDeps</code> type, and implement <code>createNotificationService(deps)</code> that accepts them via constructor injection. Then demonstrate testability by creating a mock version.</p>
`,
    starterCode: `// UGLY: The service creates its own dependencies internally
// Refactor this into clean dependency injection

// Step 1: Define interfaces for each dependency
// interface EmailClient { ... }
// interface SmsClient { ... }
// interface Logger { ... }

// Step 2: Define a Deps type grouping all dependencies
// interface NotificationServiceDeps { ... }

// Step 3: Implement the factory function
// function createNotificationService(deps: NotificationServiceDeps) { ... }

// The service should have these methods:
// - sendEmail(to: string, subject: string, body: string): boolean
// - sendSms(to: string, message: string): boolean
// - getLog(): string[]

// Step 4: Create mock implementations for testing
// function createMockDeps(): NotificationServiceDeps { ... }
`,
    solutionCode: `interface EmailClient {
  send(to: string, subject: string, body: string): boolean;
}

interface SmsClient {
  send(to: string, message: string): boolean;
}

interface Logger {
  log(message: string): void;
  getEntries(): string[];
}

interface NotificationServiceDeps {
  email: EmailClient;
  sms: SmsClient;
  logger: Logger;
}

function createNotificationService(deps: NotificationServiceDeps) {
  return {
    sendEmail(to: string, subject: string, body: string): boolean {
      deps.logger.log(\`email:\${to}:\${subject}\`);
      return deps.email.send(to, subject, body);
    },
    sendSms(to: string, message: string): boolean {
      deps.logger.log(\`sms:\${to}:\${message}\`);
      return deps.sms.send(to, message);
    },
    getLog(): string[] {
      return deps.logger.getEntries();
    }
  };
}

function createMockDeps(): NotificationServiceDeps {
  const entries: string[] = [];
  return {
    email: { send: (_to, _subj, _body) => true },
    sms: { send: (_to, _msg) => true },
    logger: {
      log: (msg: string) => entries.push(msg),
      getEntries: () => entries,
    }
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

const mockDeps = createMockDeps();
const service = createNotificationService(mockDeps);

assertEqual("sendEmail returns true", true, service.sendEmail("a@b.com", "Hi", "Hello"));
assertEqual("sendSms returns true", true, service.sendSms("+1234", "Hey"));
assertEqual("log has two entries", 2, service.getLog().length);
assertEqual("log first entry is email", true, service.getLog()[0].includes("email"));
assertEqual("log second entry is sms", true, service.getLog()[1].includes("sms"));

const mockDeps2 = createMockDeps();
const service2 = createNotificationService(mockDeps2);
assertEqual("fresh service has empty log", 0, service2.getLog().length);
`,
    hints: [
      'Start by defining three interfaces: <code>EmailClient</code> with a <code>send(to, subject, body)</code> method, <code>SmsClient</code> with <code>send(to, message)</code>, and <code>Logger</code> with <code>log(message)</code> and <code>getEntries()</code>.',
      'Group all dependencies into a single <code>NotificationServiceDeps</code> interface: <code>{ email: EmailClient; sms: SmsClient; logger: Logger }</code>. This makes the full dependency surface visible at a glance.',
      'The factory function <code>createNotificationService(deps)</code> returns an object with methods that delegate to <code>deps</code>. Each method should log its action via <code>deps.logger.log()</code> before calling the underlying client.',
      'For <code>createMockDeps()</code>, create simple objects that satisfy each interface. The mock email/sms clients can just return <code>true</code>. The mock logger stores entries in a closure-captured array.',
    ],
    concepts: ['dependency injection', 'interface segregation', 'inversion of control', 'testability', 'Parnas information hiding', 'constructor injection'],
    successPatterns: [
      'interface\\s+EmailClient',
      'interface\\s+NotificationServiceDeps',
      'createNotificationService\\s*\\(\\s*deps',
      'createMockDeps',
    ],
    testNames: [
      'sendEmail returns true with mock',
      'sendSms returns true with mock',
      'log has two entries after two sends',
      'log first entry is email',
      'log second entry is sms',
      'fresh service has empty log',
    ],
  },

  'ts-state-machines': {
    id: 'ts-state-machines',
    language: 'typescript',
    title: 'Type-Level State Machines',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Ugly Way</h3>
<pre><code>class Document {
  state: string = "draft";

  publish() {
    if (this.state === "reviewed") {
      this.state = "published";
    } else {
      throw new Error("Can only publish reviewed documents");
    }
  }

  archive() {
    if (this.state === "published") {
      this.state = "archived";
    } else {
      throw new Error("Can only archive published documents");
    }
  }
}

// This compiles! But crashes at runtime.
const doc = new Document();
doc.publish(); // Error: Can only publish reviewed documents</code></pre>

<h3>Why It Is Bad</h3>
<p>The state is a <code>string</code>. Every transition requires a runtime check. Invalid transitions compile just fine and blow up in production. Adding a new state means auditing every method to find which transitions are affected. This is exactly the situation where "make illegal states unrepresentable" applies &mdash; the type system should prevent calling <code>publish()</code> on a draft, not a runtime <code>if</code> check.</p>

<h3>The Beautiful Way: Discriminated Union State Machine</h3>
<pre><code>type Draft = { state: 'draft'; content: string };
type InReview = { state: 'review'; content: string; reviewer: string };
type Published = { state: 'published'; content: string; publishedAt: Date };
type Archived = { state: 'archived'; content: string; archivedAt: Date };

type Document = Draft | InReview | Published | Archived;

// These functions encode VALID transitions in the type system
function submitForReview(doc: Draft, reviewer: string): InReview { ... }
function approve(doc: InReview): Published { ... }
function archive(doc: Published): Archived { ... }
// approve(draft) is a COMPILE ERROR - not a runtime error</code></pre>

<p>Now the compiler enforces the workflow. You literally cannot call <code>approve</code> on a <code>Draft</code> &mdash; the types do not allow it. Each state carries exactly the data it needs (a <code>Draft</code> has no <code>publishedAt</code>; a <code>Published</code> document must have one).</p>

<blockquote><strong>Taste principle (Minsky):</strong> "Make illegal states unrepresentable." When your state machine is encoded in the type system, invalid transitions are compile errors, not runtime exceptions. The compiler becomes your workflow engine.</blockquote>

<h3>Your Task</h3>
<p>Model a document workflow with four states: <code>Draft</code>, <code>InReview</code>, <code>Published</code>, and <code>Archived</code>. Implement transition functions where each function only accepts the correct input state and returns the next state. Also implement a <code>getStatusLine(doc: Document): string</code> function that returns a description via exhaustive pattern matching.</p>
`,
    starterCode: `// Model a document workflow as a type-level state machine.
// States: Draft -> InReview -> Published -> Archived
// Invalid transitions should be COMPILE ERRORS, not runtime errors.

// Step 1: Define each state as a distinct type with appropriate data
// type Draft = { state: 'draft'; ... }
// type InReview = { state: 'review'; ... }
// type Published = { state: 'published'; ... }
// type Archived = { state: 'archived'; ... }

// Step 2: Union them into a Document type
// type Document = Draft | InReview | Published | Archived;

// Step 3: Implement transition functions
// function createDraft(content: string): Draft
// function submitForReview(doc: Draft, reviewer: string): InReview
// function approve(doc: InReview): Published
// function archive(doc: Published): Archived

// Step 4: Implement an exhaustive status function
// function getStatusLine(doc: Document): string
`,
    solutionCode: `type Draft = { state: 'draft'; content: string };
type InReview = { state: 'review'; content: string; reviewer: string };
type Published = { state: 'published'; content: string; publishedAt: number };
type Archived = { state: 'archived'; content: string; archivedAt: number };

type Document = Draft | InReview | Published | Archived;

function createDraft(content: string): Draft {
  return { state: 'draft', content };
}

function submitForReview(doc: Draft, reviewer: string): InReview {
  return { state: 'review', content: doc.content, reviewer };
}

function approve(doc: InReview): Published {
  return { state: 'published', content: doc.content, publishedAt: Date.now() };
}

function archive(doc: Published): Archived {
  return { state: 'archived', content: doc.content, archivedAt: Date.now() };
}

function getStatusLine(doc: Document): string {
  switch (doc.state) {
    case 'draft': return \`Draft: \${doc.content}\`;
    case 'review': return \`In review by \${doc.reviewer}\`;
    case 'published': return \`Published: \${doc.content}\`;
    case 'archived': return \`Archived: \${doc.content}\`;
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

const draft = createDraft("Hello World");
assertEqual("draft state", "draft", draft.state);
assertEqual("draft content", "Hello World", draft.content);

const reviewed = submitForReview(draft, "Alice");
assertEqual("review state", "review", reviewed.state);
assertEqual("review reviewer", "Alice", reviewed.reviewer);

const published = approve(reviewed);
assertEqual("published state", "published", published.state);
assertEqual("published has publishedAt", true, typeof published.publishedAt === "number");

const archived = archive(published);
assertEqual("archived state", "archived", archived.state);

assertEqual("draft status line", "Draft: Hello World", getStatusLine(draft));
assertEqual("review status line", true, getStatusLine(reviewed).includes("Alice"));
assertEqual("published status line", true, getStatusLine(published).includes("Published"));
assertEqual("archived status line", true, getStatusLine(archived).includes("Archived"));
`,
    hints: [
      'Each state is a separate type with a <code>state</code> discriminant field. <code>Draft</code> has <code>state: \'draft\'</code> and <code>content: string</code>. <code>InReview</code> adds <code>reviewer: string</code>. <code>Published</code> adds <code>publishedAt: number</code>.',
      'Transition functions accept ONLY the valid input state. <code>submitForReview(doc: Draft, ...)</code> &mdash; not <code>Document</code>, specifically <code>Draft</code>. This makes calling <code>submitForReview(published)</code> a compile error.',
      'Each transition returns a new object with the next state\'s discriminant. <code>submitForReview</code> takes a <code>Draft</code> and returns <code>InReview</code> by spreading relevant fields and adding the new state.',
      'For <code>getStatusLine</code>, switch on <code>doc.state</code>. TypeScript narrows the type in each branch, so you can access <code>doc.reviewer</code> in the <code>\'review\'</code> case. The exhaustive switch ensures all states are handled.',
    ],
    concepts: ['state machines', 'discriminated unions', 'make illegal states unrepresentable', 'type-level transitions', 'exhaustive matching', 'workflow modeling'],
    successPatterns: [
      "state:\\s*'draft'",
      "state:\\s*'review'",
      "state:\\s*'published'",
      'function\\s+submitForReview\\s*\\(\\s*doc:\\s*Draft',
    ],
    testNames: [
      'draft has correct state',
      'draft has correct content',
      'review has correct state',
      'review has correct reviewer',
      'published has correct state',
      'published has publishedAt timestamp',
      'archived has correct state',
      'draft status line is correct',
      'review status line includes reviewer',
      'published status line includes Published',
      'archived status line includes Archived',
    ],
  },

  'ts-plugin-system': {
    id: 'ts-plugin-system',
    language: 'typescript',
    title: 'Typed Plugin Architecture',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>The Ugly Way</h3>
<pre><code>const plugins: Record<string, any> = {};

function registerPlugin(name: string, plugin: any) {
  plugins[name] = plugin;
}

function runPlugin(name: string, data: any): any {
  return plugins[name]?.process(data);
}

// No type safety. What capabilities does "analytics" have?
// What shape is "data"? What does process return?
registerPlugin("analytics", { process: (x: any) => x });
const result = runPlugin("analytics", { event: "click" }); // result is any</code></pre>

<h3>Why It Is Bad</h3>
<p>Everything is <code>any</code>. You cannot discover what a plugin can do without reading its source code. You cannot verify that a plugin conforms to a contract. You cannot get autocompletion when using a plugin. The plugin registry is a typed black hole &mdash; types go in, <code>any</code> comes out.</p>

<h3>The Beautiful Way: Generic Plugin Types</h3>
<pre><code>interface Plugin&lt;TInput, TOutput&gt; {
  name: string;
  process(input: TInput): TOutput;
}

interface PluginRegistry {
  register&lt;I, O&gt;(plugin: Plugin&lt;I, O&gt;): void;
  get&lt;I, O&gt;(name: string): Plugin&lt;I, O&gt; | undefined;
}</code></pre>

<p>Now each plugin declares its input and output types. The registry preserves those types. Consumers know exactly what shape data goes in and what comes out, with full IDE support.</p>

<blockquote><strong>Taste principle (Meyer, Open/Closed):</strong> "Software entities should be open for extension, but closed for modification." A well-typed plugin system lets you add new capabilities without modifying the host. The type system ensures each extension conforms to the contract.</blockquote>

<h3>Your Task</h3>
<p>Build a typed plugin system. Define a <code>Plugin&lt;TInput, TOutput&gt;</code> interface, implement a <code>PluginHost</code> that can register and execute plugins by name, and create concrete plugins (a Validator and a Transformer) that demonstrate type-safe composition.</p>
`,
    starterCode: `// Build a typed plugin system.
// No 'any' allowed except where absolutely necessary for the internal registry.

// Step 1: Define the Plugin interface
// interface Plugin<TInput, TOutput> { ... }

// Step 2: Create a PluginHost that manages registration and execution
// function createPluginHost() { ... }
// It should have:
//   register<I, O>(plugin: Plugin<I, O>): void
//   execute<I, O>(name: string, input: I): O | undefined
//   listPlugins(): string[]

// Step 3: Create concrete plugins
// A string-validator plugin: input string, output { valid: boolean; errors: string[] }
// A number-doubler plugin: input number, output number

// Step 4: Wire them together and demonstrate
`,
    solutionCode: `interface Plugin<TInput, TOutput> {
  name: string;
  process(input: TInput): TOutput;
}

function createPluginHost() {
  const registry = new Map<string, Plugin<unknown, unknown>>();

  return {
    register<I, O>(plugin: Plugin<I, O>): void {
      registry.set(plugin.name, plugin as Plugin<unknown, unknown>);
    },
    execute<I, O>(name: string, input: I): O | undefined {
      const plugin = registry.get(name);
      if (!plugin) return undefined;
      return plugin.process(input) as O;
    },
    listPlugins(): string[] {
      return Array.from(registry.keys());
    }
  };
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const stringValidator: Plugin<string, ValidationResult> = {
  name: 'string-validator',
  process(input: string): ValidationResult {
    const errors: string[] = [];
    if (input.length === 0) errors.push('empty string');
    if (input.length > 100) errors.push('too long');
    return { valid: errors.length === 0, errors };
  }
};

const numberDoubler: Plugin<number, number> = {
  name: 'number-doubler',
  process(input: number): number {
    return input * 2;
  }
};

const host = createPluginHost();
host.register(stringValidator);
host.register(numberDoubler);
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("listPlugins has two", 2, host.listPlugins().length);
assertEqual("listPlugins includes validator", true, host.listPlugins().includes("string-validator"));
assertEqual("listPlugins includes doubler", true, host.listPlugins().includes("number-doubler"));

const validResult = host.execute<string, ValidationResult>("string-validator", "hello");
assertEqual("valid string passes", true, validResult?.valid);
assertEqual("valid string no errors", 0, validResult?.errors.length);

const invalidResult = host.execute<string, ValidationResult>("string-validator", "");
assertEqual("empty string fails", false, invalidResult?.valid);
assertEqual("empty string has error", 1, invalidResult?.errors.length);

const doubled = host.execute<number, number>("number-doubler", 21);
assertEqual("doubler works", 42, doubled);

const missing = host.execute<string, string>("nonexistent", "test");
assertEqual("missing plugin returns undefined", undefined, missing);
`,
    hints: [
      'The <code>Plugin&lt;TInput, TOutput&gt;</code> interface needs a <code>name: string</code> for registry lookup and a <code>process(input: TInput): TOutput</code> method for execution.',
      'Internally, the <code>PluginHost</code> stores plugins as <code>Map&lt;string, Plugin&lt;unknown, unknown&gt;&gt;</code>. You need to cast when storing and retrieving, but the public API stays generic and type-safe.',
      'When creating concrete plugins, explicitly type them: <code>const myPlugin: Plugin&lt;string, ValidationResult&gt; = { ... }</code>. This ensures the plugin conforms to the interface at the definition site.',
      'The <code>execute</code> method returns <code>O | undefined</code> to handle the case where no plugin is registered for that name. Use the <code>Map.get()</code> method and check for <code>undefined</code>.',
    ],
    concepts: ['plugin architecture', 'open/closed principle', 'generic interfaces', 'type-safe registry', 'extension points', 'composition over inheritance'],
    successPatterns: [
      'interface\\s+Plugin\\s*<',
      'createPluginHost',
      'registry\\.set',
      'Plugin<string,\\s*ValidationResult>',
    ],
    testNames: [
      'listPlugins has two registered',
      'listPlugins includes validator',
      'listPlugins includes doubler',
      'valid string passes validation',
      'valid string has no errors',
      'empty string fails validation',
      'empty string has error message',
      'doubler doubles correctly',
      'missing plugin returns undefined',
    ],
  },

  'ts-module-boundaries': {
    id: 'ts-module-boundaries',
    language: 'typescript',
    title: 'Clean Module Boundaries',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Ugly Way</h3>
<pre><code>// user-module.ts — exports EVERYTHING
export function hashPassword(pw: string): string { ... }
export function validateEmail(email: string): boolean { ... }
export function generateUserId(): string { ... }
export function formatUserForDb(user: User): DbRow { ... }
export function parseUserFromDb(row: DbRow): User { ... }
export function normalizeUsername(name: string): string { ... }
export function checkPasswordStrength(pw: string): number { ... }
export interface DbRow { [key: string]: unknown }
export interface User { id: string; name: string; email: string }
export interface UserPreferences { theme: string; lang: string }
// ... 20 more exports

// consumer.ts — depends on internal helpers
import { hashPassword, formatUserForDb, parseUserFromDb,
         normalizeUsername, DbRow } from './user-module';</code></pre>

<h3>Why It Is Bad</h3>
<p>When a module exports everything, consumers couple to internal implementation details. If you rename <code>formatUserForDb</code> or change <code>DbRow</code>, you break consumers who should never have used those internals. There is no boundary between "public API" and "internal helpers." The module has no shape &mdash; it is a bag of functions.</p>

<h3>The Beautiful Way: Facade Pattern</h3>
<pre><code>// Public API — the only thing consumers import
export interface UserModule {
  createUser(name: string, email: string, password: string): User;
  getUser(id: string): User | undefined;
  updateUser(id: string, updates: Partial<Pick<User, 'name' | 'email'>>): User;
  authenticate(email: string, password: string): User | undefined;
}

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

// Everything else is internal — not exported</code></pre>

<p>Now the module has a clear, small surface area. Consumers depend on the <em>contract</em>, not the implementation. You can refactor every internal function without breaking anyone.</p>

<blockquote><strong>Taste principle (Parnas, 1972):</strong> "The connections between modules are the assumptions which the modules make about each other." A clean module boundary minimizes these assumptions. The fewer exports, the fewer assumptions, the more freedom to change.</blockquote>

<h3>Your Task</h3>
<p>You are given a module that exports all its internals. Refactor it into a clean facade: define a public <code>UserModule</code> interface with only the operations consumers need, implement it with a factory function that hides all internals in a closure, and export only the interface and the factory.</p>
`,
    starterCode: `// UGLY: Everything is exported, consumers depend on internals
// Refactor into a clean module with a small public API

// Internal helpers (should NOT be in the public API)
function hashPassword(pw: string): string {
  return "hashed_" + pw;
}

function generateId(): string {
  return "uid_" + Math.random().toString(36).slice(2, 8);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Step 1: Define the public User type (readonly fields)
// interface User { ... }

// Step 2: Define the public UserModule interface
// Only expose: createUser, getUser, authenticate, listUsers
// interface UserModule { ... }

// Step 3: Implement createUserModule() that hides all internals in a closure
// function createUserModule(): UserModule { ... }
// Internally it manages a Map<string, { ...user, passwordHash: string }>
`,
    solutionCode: `function hashPassword(pw: string): string {
  return "hashed_" + pw;
}

function generateId(): string {
  return "uid_" + Math.random().toString(36).slice(2, 8);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

interface UserModule {
  createUser(name: string, email: string, password: string): User;
  getUser(id: string): User | undefined;
  authenticate(email: string, password: string): User | undefined;
  listUsers(): User[];
}

function createUserModule(): UserModule {
  const store = new Map<string, { id: string; name: string; email: string; passwordHash: string }>();

  function toPublicUser(record: { id: string; name: string; email: string }): User {
    return { id: record.id, name: record.name, email: record.email };
  }

  return {
    createUser(name: string, email: string, password: string): User {
      const id = generateId();
      const normalizedEmail = normalizeEmail(email);
      const passwordHash = hashPassword(password);
      const record = { id, name, email: normalizedEmail, passwordHash };
      store.set(id, record);
      return toPublicUser(record);
    },
    getUser(id: string): User | undefined {
      const record = store.get(id);
      return record ? toPublicUser(record) : undefined;
    },
    authenticate(email: string, password: string): User | undefined {
      const normalizedEmail = normalizeEmail(email);
      const hash = hashPassword(password);
      for (const record of store.values()) {
        if (record.email === normalizedEmail && record.passwordHash === hash) {
          return toPublicUser(record);
        }
      }
      return undefined;
    },
    listUsers(): User[] {
      return Array.from(store.values()).map(toPublicUser);
    }
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

const mod = createUserModule();
const user = mod.createUser("Alice", " Alice@Example.COM ", "secret123");

assertEqual("createUser returns name", "Alice", user.name);
assertEqual("createUser normalizes email", "alice@example.com", user.email);
assertEqual("createUser returns id", true, user.id.startsWith("uid_"));

const fetched = mod.getUser(user.id);
assertEqual("getUser returns same user", user.id, fetched?.id);
assertEqual("getUser returns name", "Alice", fetched?.name);

const authed = mod.authenticate("alice@example.com", "secret123");
assertEqual("authenticate succeeds", user.id, authed?.id);

const wrongPw = mod.authenticate("alice@example.com", "wrong");
assertEqual("wrong password fails", undefined, wrongPw);

assertEqual("listUsers has one", 1, mod.listUsers().length);

const user2 = mod.createUser("Bob", "bob@test.com", "pw");
assertEqual("listUsers has two", 2, mod.listUsers().length);
`,
    hints: [
      'The <code>User</code> interface should only have <code>readonly</code> fields: <code>id</code>, <code>name</code>, <code>email</code>. No <code>passwordHash</code> &mdash; that is an internal detail that should never leak through the public API.',
      'The <code>UserModule</code> interface defines the four public methods: <code>createUser</code>, <code>getUser</code>, <code>authenticate</code>, <code>listUsers</code>. This is the entire surface area consumers see.',
      'Inside <code>createUserModule()</code>, store records in a <code>Map</code> with password hashes. Create a private <code>toPublicUser()</code> helper that strips internal fields before returning to consumers.',
      'For <code>authenticate</code>, normalize the input email and hash the password, then search the store for a matching record. Return the public user (without hash) or <code>undefined</code>.',
    ],
    concepts: ['module boundaries', 'facade pattern', 'information hiding', 'Parnas decomposition', 'encapsulation', 'public API design', 'closure-based privacy'],
    successPatterns: [
      'interface\\s+UserModule',
      'interface\\s+User',
      'createUserModule\\s*\\(\\s*\\)\\s*:\\s*UserModule',
      'toPublicUser',
    ],
    testNames: [
      'createUser returns correct name',
      'createUser normalizes email',
      'createUser returns prefixed id',
      'getUser retrieves by id',
      'getUser returns correct name',
      'authenticate succeeds with correct password',
      'authenticate fails with wrong password',
      'listUsers returns one after first create',
      'listUsers returns two after second create',
    ],
  },

  // ─── Module 6: Advanced Patterns ────────────────────────────────────────
  // "Types as a design language"

  'ts-phantom-types': {
    id: 'ts-phantom-types',
    language: 'typescript',
    title: 'Phantom Types for Compile-Time State',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Ugly Way</h3>
<pre><code>class FileHandle {
  private path: string;
  private isOpen: boolean = false;

  open() { this.isOpen = true; }
  close() { this.isOpen = false; }

  write(data: string) {
    if (!this.isOpen) throw new Error("Cannot write to closed file!");
    // ... write data
  }

  read(): string {
    if (!this.isOpen) throw new Error("Cannot read from closed file!");
    return "data";
  }
}

// Compiles fine, crashes at runtime
const f = new FileHandle();
f.write("data"); // Runtime error!</code></pre>

<h3>Why It Is Bad</h3>
<p>The handle tracks its state with a boolean at runtime. Every operation must check the boolean. The compiler happily lets you write to a closed file &mdash; you only discover the bug when the code runs. And the boolean can get out of sync with the actual OS-level file state.</p>

<h3>The Beautiful Way: Phantom Types</h3>
<pre><code>type Open = { readonly __state: unique symbol };
type Closed = { readonly __state: unique symbol };

interface Handle&lt;State&gt; {
  readonly path: string;
  readonly _phantom?: State; // never actually used at runtime
}

function openFile(path: string): Handle&lt;Open&gt; { ... }
function writeFile(handle: Handle&lt;Open&gt;, data: string): void { ... }
function closeFile(handle: Handle&lt;Open&gt;): Handle&lt;Closed&gt; { ... }

// writeFile(closedHandle, "data") — COMPILE ERROR!
// The type system tracks file state without any runtime cost.</code></pre>

<p>Phantom types are type parameters that exist only at the type level &mdash; they have no runtime representation. They let you encode state transitions in the type system so that invalid operations are compile errors, not runtime exceptions.</p>

<blockquote><strong>Taste principle:</strong> Compile-time state tracking. If a constraint can be checked by the compiler, it should be. Runtime checks are for things the compiler genuinely cannot know (user input, network responses). File handle state is deterministic from the code path &mdash; the compiler CAN track it.</blockquote>

<h3>Your Task</h3>
<p>Implement a file handle system using phantom types. Create <code>Open</code> and <code>Closed</code> marker types, a <code>Handle&lt;State&gt;</code> type, and functions <code>openFile</code>, <code>writeFile</code>, <code>readFile</code>, <code>closeFile</code> where read/write only accept <code>Handle&lt;Open&gt;</code> and <code>closeFile</code> returns <code>Handle&lt;Closed&gt;</code>.</p>
`,
    starterCode: `// Implement phantom types for file handle state tracking.
// The goal: write() and read() only accept open handles.
// closeFile() transitions Handle<Open> to Handle<Closed>.

// Step 1: Define phantom marker types
// type Open = ...
// type Closed = ...

// Step 2: Define Handle<State> that carries the phantom type
// interface Handle<State> { ... }

// Step 3: Implement state-aware functions
// function openFile(path: string): Handle<Open>
// function writeFile(handle: Handle<Open>, data: string): string
// function readFile(handle: Handle<Open>): string
// function closeFile(handle: Handle<Open>): Handle<Closed>

// Step 4: Create a demo function that uses the full lifecycle
// function processFile(path: string): string[]
`,
    solutionCode: `type Open = { readonly __state: 'open' };
type Closed = { readonly __state: 'closed' };

interface Handle<State> {
  readonly path: string;
  readonly _phantom?: State;
  readonly _log: string[];
}

function openFile(path: string): Handle<Open> {
  return { path, _log: [\`opened:\${path}\`] };
}

function writeFile(handle: Handle<Open>, data: string): string {
  handle._log.push(\`write:\${data}\`);
  return \`wrote \${data.length} bytes\`;
}

function readFile(handle: Handle<Open>): string {
  handle._log.push("read");
  return \`content of \${handle.path}\`;
}

function closeFile(handle: Handle<Open>): Handle<Closed> {
  return { path: handle.path, _log: [...handle._log, "closed"] };
}

function processFile(path: string): string[] {
  const h = openFile(path);
  writeFile(h, "hello");
  const data = readFile(h);
  const closed = closeFile(h);
  return [...h._log, \`final:\${closed.path}\`];
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const h = openFile("/tmp/test.txt");
assertEqual("openFile returns path", "/tmp/test.txt", h.path);
assertEqual("openFile logs open", true, h._log[0].includes("opened"));

const writeResult = writeFile(h, "hello world");
assertEqual("writeFile returns byte info", true, writeResult.includes("11"));

const content = readFile(h);
assertEqual("readFile returns content", true, content.includes("/tmp/test.txt"));

const closed = closeFile(h);
assertEqual("closeFile returns path", "/tmp/test.txt", closed.path);
assertEqual("closeFile logs close", true, closed._log[closed._log.length - 1] === "closed");

const results = processFile("/data/file.csv");
assertEqual("processFile returns array", true, Array.isArray(results));
assertEqual("processFile has entries", true, results.length >= 3);
`,
    hints: [
      'Phantom marker types just need to be distinct. The simplest approach: <code>type Open = { readonly __state: \'open\' };</code> and <code>type Closed = { readonly __state: \'closed\' };</code>. These types are never instantiated at runtime.',
      '<code>Handle&lt;State&gt;</code> carries the phantom type parameter but never uses it at runtime. The optional <code>_phantom?: State</code> field makes TypeScript treat <code>Handle&lt;Open&gt;</code> and <code>Handle&lt;Closed&gt;</code> as different types.',
      'Functions like <code>writeFile(handle: Handle&lt;Open&gt;, data: string)</code> only accept open handles. <code>closeFile(handle: Handle&lt;Open&gt;): Handle&lt;Closed&gt;</code> transitions the phantom type from Open to Closed.',
      'The <code>processFile</code> function demonstrates the full lifecycle: open, write, read, close. Notice how the types guide you &mdash; you cannot accidentally read after closing because the closed handle has the wrong phantom type.',
    ],
    concepts: ['phantom types', 'compile-time state', 'type-level state machine', 'zero-cost abstraction', 'file handle safety', 'marker types'],
    successPatterns: [
      'type\\s+Open\\s*=',
      'type\\s+Closed\\s*=',
      'Handle<\\s*Open\\s*>',
      'Handle<\\s*Closed\\s*>',
    ],
    testNames: [
      'openFile returns correct path',
      'openFile logs open event',
      'writeFile returns byte count info',
      'readFile returns file content',
      'closeFile returns correct path',
      'closeFile logs close event',
      'processFile returns array',
      'processFile has multiple entries',
    ],
  },

  'ts-opaque-types': {
    id: 'ts-opaque-types',
    language: 'typescript',
    title: 'Opaque Types via Branding',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Ugly Way</h3>
<pre><code>function getUser(id: string): User { ... }
function getOrder(id: string): Order { ... }

const userId = "user_123";
const orderId = "order_456";

// This compiles. This is a bug.
getUser(orderId);  // Passing an order ID where a user ID is expected
getOrder(userId);  // Passing a user ID where an order ID is expected</code></pre>

<h3>Why It Is Bad</h3>
<p>Both IDs are <code>string</code>. TypeScript's structural type system treats them as interchangeable. You can pass an order ID to <code>getUser()</code> and the compiler will not complain. This is the same class of bug as the Mars Climate Orbiter: two values with the same representation but different semantics, and no type-level distinction.</p>

<h3>The Beautiful Way: Branded Opaque Types</h3>
<pre><code>declare const UserIdBrand: unique symbol;
type UserId = string & { readonly [UserIdBrand]: typeof UserIdBrand };

declare const OrderIdBrand: unique symbol;
type OrderId = string & { readonly [OrderIdBrand]: typeof OrderIdBrand };

function makeUserId(raw: string): UserId {
  return raw as UserId;  // validated constructor
}

function getUser(id: UserId): User { ... }
getUser(orderId); // COMPILE ERROR: OrderId is not assignable to UserId</code></pre>

<p>The brand is a phantom property that exists only in the type system. At runtime, a <code>UserId</code> is still just a string. But at compile time, it is structurally incompatible with <code>OrderId</code>, even though both are branded strings.</p>

<blockquote><strong>Taste principle:</strong> Encapsulation via types. An opaque type hides its representation and forces consumers to go through validated constructors. This is the type-level equivalent of a module boundary: you control how values are created, ensuring invariants hold.</blockquote>

<h3>Your Task</h3>
<p>Create opaque branded types for <code>UserId</code>, <code>OrderId</code>, and <code>Email</code>. Each should have a validated constructor that enforces format rules. Then build functions that accept ONLY the correct branded type.</p>
`,
    starterCode: `// Create opaque branded types that prevent mixing up different string IDs.

// Step 1: Define branded types using unique symbols
// type UserId = string & { readonly __brand: ... }
// type OrderId = string & { readonly __brand: ... }
// type Email = string & { readonly __brand: ... }

// Step 2: Validated constructors (return the branded type or throw)
// function makeUserId(raw: string): UserId
// function makeOrderId(raw: string): OrderId
// function makeEmail(raw: string): Email

// Step 3: Functions that require specific branded types
// function getUserName(id: UserId): string
// function getOrderTotal(id: OrderId): number
// function sendEmail(to: Email, body: string): string

// Validation rules:
// - UserId: must start with "user_"
// - OrderId: must start with "order_"
// - Email: must contain "@"
`,
    solutionCode: `declare const UserIdBrand: unique symbol;
type UserId = string & { readonly [UserIdBrand]: typeof UserIdBrand };

declare const OrderIdBrand: unique symbol;
type OrderId = string & { readonly [OrderIdBrand]: typeof OrderIdBrand };

declare const EmailBrand: unique symbol;
type Email = string & { readonly [EmailBrand]: typeof EmailBrand };

function makeUserId(raw: string): UserId {
  if (!raw.startsWith("user_")) throw new Error("UserId must start with user_");
  return raw as UserId;
}

function makeOrderId(raw: string): OrderId {
  if (!raw.startsWith("order_")) throw new Error("OrderId must start with order_");
  return raw as OrderId;
}

function makeEmail(raw: string): Email {
  if (!raw.includes("@")) throw new Error("Email must contain @");
  return raw as Email;
}

function getUserName(id: UserId): string {
  return \`User(\${id})\`;
}

function getOrderTotal(id: OrderId): number {
  return 99.99;
}

function sendEmail(to: Email, body: string): string {
  return \`Sent to \${to}: \${body}\`;
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const uid = makeUserId("user_123");
assertEqual("makeUserId succeeds", "user_123", uid as string);

const oid = makeOrderId("order_456");
assertEqual("makeOrderId succeeds", "order_456", oid as string);

const email = makeEmail("alice@test.com");
assertEqual("makeEmail succeeds", "alice@test.com", email as string);

let userIdError = false;
try { makeUserId("order_789"); } catch { userIdError = true; }
assertEqual("makeUserId rejects bad prefix", true, userIdError);

let orderIdError = false;
try { makeOrderId("user_789"); } catch { orderIdError = true; }
assertEqual("makeOrderId rejects bad prefix", true, orderIdError);

let emailError = false;
try { makeEmail("not-an-email"); } catch { emailError = true; }
assertEqual("makeEmail rejects missing @", true, emailError);

assertEqual("getUserName works", true, getUserName(uid).includes("user_123"));
assertEqual("getOrderTotal returns number", 99.99, getOrderTotal(oid));
assertEqual("sendEmail works", true, sendEmail(email, "hi").includes("alice@test.com"));
`,
    hints: [
      'Declare a unique symbol for each brand: <code>declare const UserIdBrand: unique symbol;</code>. Then intersect it with string: <code>type UserId = string & { readonly [UserIdBrand]: typeof UserIdBrand };</code>.',
      'The <code>declare const</code> keyword means the symbol exists only in the type system &mdash; no runtime value is created. The intersection type makes <code>UserId</code> structurally different from <code>OrderId</code> even though both are strings at runtime.',
      'Validated constructors use <code>as</code> to cast after validation: <code>return raw as UserId;</code>. This is the ONE place where the cast is acceptable &mdash; the validation ensures the invariant holds.',
      'Functions like <code>getUserName(id: UserId)</code> will reject <code>OrderId</code> and plain <code>string</code> at compile time. Only values created through <code>makeUserId()</code> have the <code>UserId</code> brand.',
    ],
    concepts: ['opaque types', 'branded types', 'unique symbol', 'type-level encapsulation', 'validated constructors', 'nominal typing in structural systems'],
    successPatterns: [
      'unique\\s+symbol',
      'type\\s+UserId\\s*=\\s*string\\s*&',
      'type\\s+OrderId\\s*=\\s*string\\s*&',
      'return\\s+raw\\s+as\\s+UserId',
    ],
    testNames: [
      'makeUserId succeeds with valid prefix',
      'makeOrderId succeeds with valid prefix',
      'makeEmail succeeds with valid email',
      'makeUserId rejects bad prefix',
      'makeOrderId rejects bad prefix',
      'makeEmail rejects missing @',
      'getUserName works with UserId',
      'getOrderTotal returns number',
      'sendEmail works with Email',
    ],
  },

  'ts-type-safe-events': {
    id: 'ts-type-safe-events',
    language: 'typescript',
    title: 'Type-Safe Event Emitter',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>The Ugly Way</h3>
<pre><code>class EventEmitter {
  private handlers: Record<string, Function[]> = {};

  on(event: string, handler: Function) {
    (this.handlers[event] ??= []).push(handler);
  }

  emit(event: string, ...args: any[]) {
    this.handlers[event]?.forEach(h => h(...args));
  }
}

const emitter = new EventEmitter();
emitter.on('click', (x: number, y: number) => { ... });
emitter.emit('click', "not a number", "oops"); // No type error!</code></pre>

<h3>Why It Is Bad</h3>
<p>The event name is an untyped string. The handler is <code>Function</code>. The emit args are <code>any[]</code>. There is zero connection between the event name and the expected payload. You can emit a click event with string arguments and the compiler does not care. This defeats the entire purpose of using TypeScript.</p>

<h3>The Beautiful Way: Mapped Event Types</h3>
<pre><code>interface EventMap {
  click: { x: number; y: number };
  resize: { width: number; height: number };
  close: void;
}

interface TypedEmitter&lt;Events&gt; {
  on&lt;K extends keyof Events&gt;(event: K, handler: (payload: Events[K]) => void): void;
  emit&lt;K extends keyof Events&gt;(event: K, payload: Events[K]): void;
}

// emitter.emit('click', { x: 10, y: 20 }); // OK
// emitter.emit('click', "wrong");           // COMPILE ERROR</code></pre>

<p>Now the event map is the single source of truth. When you write <code>on('click', handler)</code>, TypeScript knows the handler receives <code>{ x: number; y: number }</code>. When you emit, you must provide the correct payload. Add a new event? Just extend the map. The compiler enforces everything.</p>

<blockquote><strong>Taste principle:</strong> Composition + safety. A well-typed event emitter composes the open-ended nature of events (anyone can listen) with the closed safety of types (payloads must match). This is what good API design looks like: flexible where it should be, strict where it must be.</blockquote>

<h3>Your Task</h3>
<p>Build a fully typed event emitter. Define an <code>EventMap</code> interface, implement <code>createEmitter&lt;Events&gt;()</code> that returns <code>on</code>, <code>emit</code>, and <code>off</code> methods, all fully typed against the event map.</p>
`,
    starterCode: `// Build a type-safe event emitter where the event map
// determines handler payload types at compile time.

// Step 1: Define an event map for a UI component
// interface AppEvents {
//   click: { x: number; y: number };
//   keypress: { key: string; shift: boolean };
//   close: void;
// }

// Step 2: Implement createEmitter<Events>()
// Returns: {
//   on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void;
//   off<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void;
//   emit<K extends keyof Events>(event: K, payload: Events[K]): void;
//   listenerCount<K extends keyof Events>(event: K): number;
// }

// Step 3: Wire up a demo with AppEvents
`,
    solutionCode: `interface AppEvents {
  click: { x: number; y: number };
  keypress: { key: string; shift: boolean };
  close: void;
}

function createEmitter<Events>() {
  const handlers = new Map<keyof Events, Array<(payload: any) => void>>();

  return {
    on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void {
      if (!handlers.has(event)) handlers.set(event, []);
      handlers.get(event)!.push(handler as (payload: any) => void);
    },
    off<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void {
      const list = handlers.get(event);
      if (!list) return;
      const idx = list.indexOf(handler as (payload: any) => void);
      if (idx >= 0) list.splice(idx, 1);
    },
    emit<K extends keyof Events>(event: K, payload: Events[K]): void {
      const list = handlers.get(event);
      if (list) list.forEach(h => h(payload));
    },
    listenerCount<K extends keyof Events>(event: K): number {
      return handlers.get(event)?.length ?? 0;
    }
  };
}

const emitter = createEmitter<AppEvents>();
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

let clickPayload: any = null;
const clickHandler = (p: { x: number; y: number }) => { clickPayload = p; };
emitter.on('click', clickHandler);

emitter.emit('click', { x: 10, y: 20 });
assertEqual("click handler receives payload", 10, clickPayload?.x);
assertEqual("click handler y value", 20, clickPayload?.y);
assertEqual("click listener count", 1, emitter.listenerCount('click'));

let keyPayload: any = null;
emitter.on('keypress', (p) => { keyPayload = p; });
emitter.emit('keypress', { key: 'a', shift: false });
assertEqual("keypress handler receives key", 'a', keyPayload?.key);
assertEqual("keypress handler receives shift", false, keyPayload?.shift);

emitter.off('click', clickHandler);
assertEqual("click listener count after off", 0, emitter.listenerCount('click'));

let closeFired = false;
emitter.on('close', () => { closeFired = true; });
emitter.emit('close', undefined as void);
assertEqual("close event fires", true, closeFired);
`,
    hints: [
      'The event map is just an interface mapping event names to payload types: <code>interface AppEvents { click: { x: number; y: number }; close: void; }</code>.',
      '<code>createEmitter&lt;Events&gt;()</code> is generic over the event map. Each method constrains its key with <code>K extends keyof Events</code>, and the payload type is <code>Events[K]</code> &mdash; looked up from the map.',
      'Internally, store handlers in a <code>Map&lt;keyof Events, Array&lt;(payload: any) =&gt; void&gt;&gt;</code>. The <code>any</code> is hidden inside the implementation; the public API is fully typed.',
      'For <code>off</code>, find the handler by reference (<code>indexOf</code>) and splice it out. <code>listenerCount</code> returns the length of the handler array for that event, defaulting to 0.',
    ],
    concepts: ['typed event emitter', 'mapped types', 'keyof constraint', 'indexed access types', 'generic functions', 'composition and safety'],
    successPatterns: [
      'interface\\s+AppEvents',
      'createEmitter<',
      'K\\s+extends\\s+keyof\\s+Events',
      'Events\\[K\\]',
    ],
    testNames: [
      'click handler receives x payload',
      'click handler receives y payload',
      'click listener count is 1',
      'keypress handler receives key',
      'keypress handler receives shift',
      'click listener count after off is 0',
      'close event fires',
    ],
  },

  'ts-property-testing': {
    id: 'ts-property-testing',
    language: 'typescript',
    title: 'Property-Based Testing Framework',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Ugly Way</h3>
<pre><code>// Testing with specific examples only
test("reverse reverses", () => {
  expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
});

// What about empty arrays? Single elements? Very long arrays?
// What about arrays with duplicates? Negative numbers?
// You test what you think of, and miss what you don't.</code></pre>

<h3>Why It Is Bad</h3>
<p>Example-based tests only cover the cases you thought of. They are biased by your mental model &mdash; which is the same mental model that wrote the buggy code. The bugs are in the cases you <em>did not</em> think of.</p>

<h3>The Beautiful Way: Property-Based Testing</h3>
<pre><code>// Test the PROPERTY, not specific examples
property(
  "reverse is its own inverse",
  Gen.array(Gen.int(-100, 100)),
  (arr) => deepEqual(reverse(reverse(arr)), arr)
);

// This generates hundreds of random arrays and checks the property.
// If it fails, it SHRINKS to the minimal failing case.</code></pre>

<p>Property-based testing checks universal truths about your code. Instead of "does reverse([1,2,3]) equal [3,2,1]?", it asks "is reverse(reverse(x)) always equal to x?" for hundreds of random inputs. When it finds a failure, it shrinks to the simplest failing case.</p>

<blockquote><strong>Taste principle:</strong> Test what matters, not what is easy. Example-based tests are easy to write but test shallow properties. Property-based tests require thinking about invariants &mdash; which forces you to understand your code more deeply.</blockquote>

<h3>Your Task</h3>
<p>Build a mini property-testing framework with: <code>Gen&lt;T&gt;</code> generators (<code>Gen.int</code>, <code>Gen.string</code>, <code>Gen.array</code>), a <code>property()</code> function that runs tests, and basic shrinking for integers.</p>
`,
    starterCode: `// Build a mini property-based testing framework.

// Step 1: Define Gen<T> — a generator that produces random values
// interface Gen<T> {
//   generate(seed: number): T;
//   shrink(value: T): T[];
// }

// Step 2: Implement basic generators
// Gen.int(min, max): Gen<number>
// Gen.string(maxLen): Gen<string>
// Gen.array<T>(elemGen: Gen<T>, maxLen?: number): Gen<T[]>

// Step 3: Implement the property checker
// function property<T>(name: string, gen: Gen<T>, predicate: (value: T) => boolean, numTests?: number): PropertyResult

// Step 4: Define the result type
// interface PropertyResult { passed: boolean; numTests: number; counterexample?: any; shrunk?: any }
`,
    solutionCode: `interface Gen<T> {
  generate(seed: number): T;
  shrink(value: T): T[];
}

interface PropertyResult {
  passed: boolean;
  numTests: number;
  counterexample?: unknown;
  shrunk?: unknown;
}

const Gen = {
  int(min: number, max: number): Gen<number> {
    return {
      generate(seed: number): number {
        const range = max - min + 1;
        return min + Math.abs(Math.floor(seed * 9301 + 49297) % range);
      },
      shrink(value: number): number[] {
        const results: number[] = [];
        if (value > 0) results.push(value - 1, Math.floor(value / 2));
        if (value < 0) results.push(value + 1, Math.ceil(value / 2));
        if (value !== 0) results.push(0);
        return results.filter(v => v >= min && v <= max);
      }
    };
  },

  string(maxLen: number): Gen<string> {
    return {
      generate(seed: number): string {
        const len = Math.abs(seed * 9301 + 49297) % (maxLen + 1);
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        let s = seed;
        for (let i = 0; i < len; i++) {
          s = (s * 9301 + 49297) % 233280;
          result += chars[Math.abs(s) % chars.length];
        }
        return result;
      },
      shrink(value: string): string[] {
        if (value.length === 0) return [];
        return [value.slice(0, -1), value.slice(1), ''];
      }
    };
  },

  array<T>(elemGen: Gen<T>, maxLen: number = 5): Gen<T[]> {
    return {
      generate(seed: number): T[] {
        const len = Math.abs(seed * 9301 + 49297) % (maxLen + 1);
        const result: T[] = [];
        let s = seed;
        for (let i = 0; i < len; i++) {
          s = (s * 9301 + 49297) % 233280;
          result.push(elemGen.generate(s));
        }
        return result;
      },
      shrink(value: T[]): T[][] {
        if (value.length === 0) return [];
        const results: T[][] = [[], value.slice(1), value.slice(0, -1)];
        return results;
      }
    };
  }
};

function property<T>(name: string, gen: Gen<T>, predicate: (value: T) => boolean, numTests: number = 50): PropertyResult {
  for (let i = 0; i < numTests; i++) {
    const value = gen.generate(i);
    if (!predicate(value)) {
      let shrunk = value;
      const candidates = gen.shrink(value);
      for (const candidate of candidates) {
        if (!predicate(candidate)) {
          shrunk = candidate;
          break;
        }
      }
      return { passed: false, numTests: i + 1, counterexample: value, shrunk };
    }
  }
  return { passed: true, numTests };
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const intGen = Gen.int(0, 100);
const val = intGen.generate(42);
assertEqual("int generator produces number", true, typeof val === 'number');
assertEqual("int generator in range", true, val >= 0 && val <= 100);

const shrunk = intGen.shrink(10);
assertEqual("int shrink produces candidates", true, shrunk.length > 0);
assertEqual("int shrink includes smaller values", true, shrunk.some(v => v < 10));

const strGen = Gen.string(10);
const str = strGen.generate(7);
assertEqual("string generator produces string", true, typeof str === 'string');
assertEqual("string generator respects maxLen", true, str.length <= 10);

const arrGen = Gen.array(Gen.int(0, 10), 5);
const arr = arrGen.generate(3);
assertEqual("array generator produces array", true, Array.isArray(arr));
assertEqual("array generator respects maxLen", true, arr.length <= 5);

const passingResult = property("x >= 0", Gen.int(0, 100), x => x >= 0);
assertEqual("passing property passes", true, passingResult.passed);
assertEqual("passing property ran tests", 50, passingResult.numTests);

const failResult = property("x < 5", Gen.int(0, 100), x => x < 5);
assertEqual("failing property fails", false, failResult.passed);
assertEqual("failing property has counterexample", true, failResult.counterexample !== undefined);
`,
    hints: [
      '<code>Gen&lt;T&gt;</code> needs two methods: <code>generate(seed: number): T</code> for creating values and <code>shrink(value: T): T[]</code> for producing smaller counterexamples. The seed ensures reproducibility.',
      'For <code>Gen.int(min, max)</code>: use a simple hash function like <code>Math.abs(seed * 9301 + 49297) % range + min</code>. For shrinking, try: value - 1, value / 2, and 0 (all clamped to the valid range).',
      '<code>Gen.array(elemGen)</code> uses <code>elemGen.generate()</code> in a loop to build arrays. For shrinking, try: empty array, drop first element, drop last element.',
      'The <code>property()</code> function runs <code>generate(i)</code> for i = 0..numTests-1. On failure, try all <code>shrink()</code> candidates and return the first one that also fails as the shrunk counterexample.',
    ],
    concepts: ['property-based testing', 'generators', 'shrinking', 'invariant testing', 'randomized testing', 'test design'],
    successPatterns: [
      'interface\\s+Gen<',
      'int\\(min:\\s*number,\\s*max:\\s*number\\)',
      'array.*elemGen:\\s*Gen<T>',
      'function\\s+property',
    ],
    testNames: [
      'int generator produces number',
      'int generator value in range',
      'int shrink produces candidates',
      'int shrink includes smaller values',
      'string generator produces string',
      'string generator respects maxLen',
      'array generator produces array',
      'array generator respects maxLen',
      'passing property passes',
      'passing property ran correct count',
      'failing property fails',
      'failing property has counterexample',
    ],
  },

  // ─── Module 7: Performance Patterns ─────────────────────────────────────
  // "Measure first, optimize second"

  'ts-structural-sharing': {
    id: 'ts-structural-sharing',
    language: 'typescript',
    title: 'Persistent Data with Structural Sharing',
    difficulty: 'advanced',
    order: 1,
    description: `
<h3>The Ugly Way</h3>
<pre><code>function updateMap(map: Map<string, number>, key: string, value: number): Map<string, number> {
  // Deep copy the entire map on every update
  const newMap = new Map(map);
  newMap.set(key, value);
  return newMap;
}

// 10,000 entries? Copy ALL of them for each update. O(n) per update.</code></pre>

<h3>Why It Is Bad</h3>
<p>Full copy on every update is O(n). For immutable data structures, this means performance degrades linearly with size. If you have 10,000 entries and update one, you copy 9,999 unchanged entries. This is why people say "immutability is expensive" &mdash; but only with naive implementations.</p>

<h3>The Beautiful Way: Structural Sharing</h3>
<pre><code>// A trie-based map shares unchanged branches.
// Updating one key only copies the nodes along the path to that key.
// All other branches are SHARED between old and new versions.
// O(log n) per update, O(1) sharing of unchanged data.</code></pre>

<p>Persistent data structures share unchanged portions between versions. When you update a key, only the path from root to that key is copied. Everything else is shared. This gives you immutability with O(log n) updates instead of O(n).</p>

<blockquote><strong>Taste principle:</strong> Immutability without copy cost. Structural sharing is the technique that makes immutable data structures practical. It is how Git stores commits, how React compares virtual DOM trees, and how Clojure implements its persistent collections.</blockquote>

<h3>Your Task</h3>
<p>Implement a simple persistent map using a binary trie keyed on string hash codes. The key operations: <code>set</code> returns a NEW map (old one unchanged), <code>get</code> retrieves by key, and unchanged branches are shared between versions.</p>
`,
    starterCode: `// Implement a persistent map with structural sharing.
// set() returns a NEW map; the old map is unchanged.
// Unchanged branches are shared (not copied).

// Step 1: Define the trie node structure
// interface TrieNode<V> {
//   key?: string;
//   value?: V;
//   left?: TrieNode<V>;
//   right?: TrieNode<V>;
// }

// Step 2: Implement a simple hash function for strings
// function hashKey(key: string): number

// Step 3: Implement the PersistentMap
// interface PersistentMap<V> {
//   get(key: string): V | undefined;
//   set(key: string, value: V): PersistentMap<V>;
//   has(key: string): boolean;
//   size: number;
// }

// Step 4: Factory function
// function createPersistentMap<V>(): PersistentMap<V>
`,
    solutionCode: `interface TrieNode<V> {
  key?: string;
  value?: V;
  left?: TrieNode<V>;
  right?: TrieNode<V>;
}

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) - h + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function trieGet<V>(node: TrieNode<V> | undefined, key: string, hash: number, depth: number): V | undefined {
  if (!node) return undefined;
  if (node.key === key) return node.value;
  const bit = (hash >>> depth) & 1;
  return bit === 0 ? trieGet(node.left, key, hash, depth + 1) : trieGet(node.right, key, hash, depth + 1);
}

function trieSet<V>(node: TrieNode<V> | undefined, key: string, value: V, hash: number, depth: number): TrieNode<V> {
  if (!node) return { key, value };
  if (node.key === key) return { ...node, value };
  const bit = (hash >>> depth) & 1;
  if (bit === 0) {
    return { ...node, left: trieSet(node.left, key, value, hash, depth + 1) };
  } else {
    return { ...node, right: trieSet(node.right, key, value, hash, depth + 1) };
  }
}

interface PersistentMap<V> {
  get(key: string): V | undefined;
  set(key: string, value: V): PersistentMap<V>;
  has(key: string): boolean;
  size: number;
}

function createPersistentMap<V>(): PersistentMap<V> {
  function makeMap(root: TrieNode<V> | undefined, count: number): PersistentMap<V> {
    return {
      get(key: string): V | undefined {
        return trieGet(root, key, hashKey(key), 0);
      },
      set(key: string, value: V): PersistentMap<V> {
        const existing = this.has(key);
        const newRoot = trieSet(root, key, value, hashKey(key), 0);
        return makeMap(newRoot, existing ? count : count + 1);
      },
      has(key: string): boolean {
        return trieGet(root, key, hashKey(key), 0) !== undefined;
      },
      get size() { return count; }
    };
  }
  return makeMap(undefined, 0);
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const empty = createPersistentMap<number>();
assertEqual("empty map size", 0, empty.size);
assertEqual("empty map get", undefined, empty.get("x"));

const m1 = empty.set("a", 1);
assertEqual("m1 has a", 1, m1.get("a"));
assertEqual("m1 size", 1, m1.size);
assertEqual("empty still empty", 0, empty.size);

const m2 = m1.set("b", 2);
assertEqual("m2 has a", 1, m2.get("a"));
assertEqual("m2 has b", 2, m2.get("b"));
assertEqual("m2 size", 2, m2.size);
assertEqual("m1 unchanged", undefined, m1.get("b"));

const m3 = m2.set("a", 99);
assertEqual("m3 updated a", 99, m3.get("a"));
assertEqual("m3 keeps b", 2, m3.get("b"));
assertEqual("m2 a unchanged", 1, m2.get("a"));
assertEqual("m3 size unchanged", 2, m3.size);

assertEqual("has returns true", true, m2.has("a"));
assertEqual("has returns false", false, m2.has("z"));
`,
    hints: [
      'The trie node has optional <code>left</code> and <code>right</code> children plus an optional <code>key/value</code> pair. Use a simple hash function to convert string keys to numbers, then use bits of the hash to navigate left (0) or right (1).',
      '<code>trieSet</code> creates a new node on the path being modified but <strong>reuses</strong> the unchanged branch. For example, if you go left, the new node shares the old node\'s <code>right</code> subtree: <code>{ ...node, left: trieSet(node.left, ...) }</code>.',
      'The <code>PersistentMap</code> interface wraps the trie. <code>set()</code> returns a NEW map with a new root, while the old map still points to the old root. This is structural sharing in action.',
      'Track size by checking if the key already exists before setting. If it is a new key, increment count. If it is an update, keep the same count. The <code>makeMap</code> closure captures the root and count.',
    ],
    concepts: ['structural sharing', 'persistent data structures', 'binary trie', 'immutability', 'copy-on-write paths', 'Git-style versioning'],
    successPatterns: [
      'interface\\s+TrieNode',
      '\\{\\s*\\.\\.\\.node',
      'interface\\s+PersistentMap',
      'createPersistentMap',
    ],
    testNames: [
      'empty map has size 0',
      'empty map returns undefined',
      'set creates new map with value',
      'new map has size 1',
      'original map unchanged after set',
      'second set preserves first value',
      'second set has new value',
      'second set has size 2',
      'original not mutated by second set',
      'update preserves other keys',
      'update changes target key',
      'original unchanged after update',
      'update does not change size',
      'has returns true for existing',
      'has returns false for missing',
    ],
  },

  'ts-lazy-evaluation': {
    id: 'ts-lazy-evaluation',
    language: 'typescript',
    title: 'Lazy Sequences for Modular Composition',
    difficulty: 'advanced',
    order: 2,
    description: `
<h3>The Ugly Way</h3>
<pre><code>const data = getMillionRecords();
const filtered = data.filter(x => x.active);    // new array: 500K items
const mapped = filtered.map(x => x.name);        // new array: 500K strings
const first10 = mapped.slice(0, 10);              // we only needed 10!

// Created 2 intermediate arrays of 500K items each
// to get 10 results. Wasteful.</code></pre>

<h3>Why It Is Bad</h3>
<p>Eager evaluation creates intermediate arrays at every step. If you have a million records and only need the first 10 that match, you still process all one million. Each <code>filter</code> and <code>map</code> allocates a full new array. For large datasets, this is a massive waste of memory and CPU.</p>

<h3>The Beautiful Way: Lazy Sequences</h3>
<pre><code>const result = LazySeq.from(getMillionRecords())
  .filter(x => x.active)
  .map(x => x.name)
  .take(10)
  .toArray();

// Only processes records until 10 matches are found.
// No intermediate arrays. Elements flow through the pipeline one at a time.</code></pre>

<p>Lazy sequences defer computation until the result is consumed. <code>filter</code> and <code>map</code> do not execute immediately &mdash; they build up a pipeline. Only when <code>toArray()</code> is called does the pipeline start pulling elements through, stopping as soon as 10 are collected.</p>

<blockquote><strong>Taste principle (Hughes, "Why Functional Programming Matters"):</strong> Laziness is a powerful tool for modularity. It lets you separate the <em>description</em> of a computation from its <em>execution</em>. You can compose infinite pipelines and only materialize what you need.</blockquote>

<h3>Your Task</h3>
<p>Implement a <code>LazySeq&lt;T&gt;</code> class with <code>map</code>, <code>filter</code>, <code>take</code>, and <code>toArray</code>. Use generator functions internally so nothing executes until consumed.</p>
`,
    starterCode: `// Implement lazy sequences using generators.
// Nothing executes until toArray() is called.

// Step 1: Define LazySeq<T>
// class LazySeq<T> {
//   constructor(private generator: () => Generator<T>) {}
//   static from<T>(items: T[]): LazySeq<T>
//   static range(start: number, end: number): LazySeq<number>
//   map<U>(fn: (item: T) => U): LazySeq<U>
//   filter(fn: (item: T) => boolean): LazySeq<T>
//   take(n: number): LazySeq<T>
//   toArray(): T[]
//   reduce<U>(fn: (acc: U, item: T) => U, initial: U): U
// }

// Step 2: Demonstrate that operations are lazy
// Track how many items are actually processed
`,
    solutionCode: `class LazySeq<T> {
  constructor(private generator: () => Generator<T>) {}

  static from<T>(items: T[]): LazySeq<T> {
    return new LazySeq(function* () {
      for (const item of items) yield item;
    });
  }

  static range(start: number, end: number): LazySeq<number> {
    return new LazySeq(function* () {
      for (let i = start; i < end; i++) yield i;
    });
  }

  map<U>(fn: (item: T) => U): LazySeq<U> {
    const source = this.generator;
    return new LazySeq(function* () {
      for (const item of source()) yield fn(item);
    });
  }

  filter(fn: (item: T) => boolean): LazySeq<T> {
    const source = this.generator;
    return new LazySeq(function* () {
      for (const item of source()) {
        if (fn(item)) yield item;
      }
    });
  }

  take(n: number): LazySeq<T> {
    const source = this.generator;
    return new LazySeq(function* () {
      let count = 0;
      for (const item of source()) {
        if (count >= n) return;
        yield item;
        count++;
      }
    });
  }

  toArray(): T[] {
    const result: T[] = [];
    for (const item of this.generator()) result.push(item);
    return result;
  }

  reduce<U>(fn: (acc: U, item: T) => U, initial: U): U {
    let acc = initial;
    for (const item of this.generator()) acc = fn(acc, item);
    return acc;
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

assertEqual("from + toArray", [1, 2, 3], LazySeq.from([1, 2, 3]).toArray());

assertEqual("range produces sequence", [0, 1, 2, 3, 4], LazySeq.range(0, 5).toArray());

assertEqual("map doubles", [2, 4, 6], LazySeq.from([1, 2, 3]).map(x => x * 2).toArray());

assertEqual("filter evens", [2, 4], LazySeq.from([1, 2, 3, 4, 5]).filter(x => x % 2 === 0).toArray());

assertEqual("take limits", [1, 2, 3], LazySeq.from([1, 2, 3, 4, 5]).take(3).toArray());

assertEqual("chained pipeline", [4, 16], LazySeq.range(1, 10).filter(x => x % 2 === 0).map(x => x * x).take(2).toArray());

let processedCount = 0;
const result = LazySeq.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .filter(x => { processedCount++; return x > 5; })
  .take(2)
  .toArray();
assertEqual("lazy take processes minimum", true, processedCount < 10);
assertEqual("lazy take correct result", [6, 7], result);

const sum = LazySeq.from([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0);
assertEqual("reduce sums", 10, sum);
`,
    hints: [
      '<code>LazySeq</code> wraps a generator factory: <code>() =&gt; Generator&lt;T&gt;</code>. The factory is called only when <code>toArray()</code> or <code>reduce()</code> consumes the sequence.',
      '<code>map</code> and <code>filter</code> return NEW <code>LazySeq</code> instances with generator factories that wrap the source generator. <code>map</code> yields <code>fn(item)</code>; <code>filter</code> yields items where <code>fn(item)</code> is true.',
      '<code>take(n)</code> wraps the source generator and stops yielding after <code>n</code> items. This is what makes the whole pipeline lazy &mdash; once take has enough items, the source generator stops being pulled.',
      'Use <code>function*</code> generator syntax. <code>yield</code> produces values one at a time. <code>for (const item of source())</code> pulls values from the upstream generator lazily.',
    ],
    concepts: ['lazy evaluation', 'generators', 'deferred computation', 'pipeline composition', 'Hughes laziness-as-modularity', 'iterator protocol'],
    successPatterns: [
      'class\\s+LazySeq',
      'function\\s*\\*',
      'yield\\s',
      'take\\(n:\\s*number\\)',
    ],
    testNames: [
      'from and toArray round-trip',
      'range produces correct sequence',
      'map transforms elements',
      'filter selects matching',
      'take limits output count',
      'chained pipeline works correctly',
      'lazy take processes minimum elements',
      'lazy take produces correct result',
      'reduce accumulates values',
    ],
  },

  'ts-object-pooling': {
    id: 'ts-object-pooling',
    language: 'typescript',
    title: 'Object Pool for Hot Paths',
    difficulty: 'advanced',
    order: 3,
    description: `
<h3>The Ugly Way</h3>
<pre><code>function processFrame(particles: Particle[]) {
  for (const p of particles) {
    // Allocate a new Vec2 EVERY FRAME for EVERY PARTICLE
    const velocity = new Vec2(p.vx, p.vy);
    const position = new Vec2(p.x, p.y);
    const newPos = position.add(velocity);
    p.x = newPos.x;
    p.y = newPos.y;
  }
  // 10,000 particles * 60fps = 600,000 allocations/second
  // GC pauses make the animation stutter
}</code></pre>

<h3>Why It Is Bad</h3>
<p>In performance-critical code (game loops, animation frames, real-time audio), creating and discarding thousands of small objects per frame puts enormous pressure on the garbage collector. GC pauses cause visible stuttering and latency spikes.</p>

<h3>The Beautiful Way: Object Pool</h3>
<pre><code>const pool = createPool(() => new Vec2(0, 0), v => { v.x = 0; v.y = 0; });

function processFrame(particles: Particle[]) {
  for (const p of particles) {
    const velocity = pool.acquire();
    velocity.x = p.vx; velocity.y = p.vy;
    // ... use velocity ...
    pool.release(velocity); // back to the pool, no GC needed
  }
}</code></pre>

<p>An object pool pre-allocates objects and recycles them. <code>acquire()</code> pulls from the pool (or creates if empty), <code>release()</code> returns it. No garbage collection needed for pooled objects.</p>

<blockquote><strong>Taste principle:</strong> Profile before optimizing. Object pooling adds complexity. Use it ONLY when profiling shows GC pressure is a real bottleneck (game loops, audio processing, high-frequency trading). For typical web apps, the GC is fine. The <em>taste</em> is knowing when NOT to optimize.</blockquote>

<h3>Your Task</h3>
<p>Implement a generic <code>ObjectPool&lt;T&gt;</code> with <code>acquire()</code>, <code>release()</code>, stats tracking, and configurable pool limits. Include a <code>reset</code> function to clean objects before reuse.</p>
`,
    starterCode: `// Implement a generic object pool for GC-sensitive hot paths.
// Key: acquire() returns an object, release() recycles it.

// Step 1: Define the pool interface
// interface ObjectPool<T> {
//   acquire(): T;
//   release(obj: T): void;
//   size: number;        // currently available in pool
//   totalCreated: number; // total objects ever created
//   inUse: number;       // currently acquired, not yet released
// }

// Step 2: Implement createPool<T>(factory, reset, maxSize?)
// factory: () => T         — creates new instances
// reset: (obj: T) => void  — cleans object before reuse
// maxSize: number           — cap on pool size (default 100)

// Step 3: Demonstrate with a Vec2 example
// interface Vec2 { x: number; y: number }
`,
    solutionCode: `interface ObjectPool<T> {
  acquire(): T;
  release(obj: T): void;
  size: number;
  totalCreated: number;
  inUse: number;
}

function createPool<T>(
  factory: () => T,
  reset: (obj: T) => void,
  maxSize: number = 100
): ObjectPool<T> {
  const available: T[] = [];
  let totalCreated = 0;
  let inUse = 0;

  return {
    acquire(): T {
      let obj: T;
      if (available.length > 0) {
        obj = available.pop()!;
      } else {
        obj = factory();
        totalCreated++;
      }
      inUse++;
      return obj;
    },
    release(obj: T): void {
      if (inUse > 0) inUse--;
      reset(obj);
      if (available.length < maxSize) {
        available.push(obj);
      }
    },
    get size() { return available.length; },
    get totalCreated() { return totalCreated; },
    get inUse() { return inUse; }
  };
}

interface Vec2 { x: number; y: number; }

const vec2Pool = createPool<Vec2>(
  () => ({ x: 0, y: 0 }),
  (v) => { v.x = 0; v.y = 0; },
  50
);
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("initial pool size", 0, vec2Pool.size);
assertEqual("initial totalCreated", 0, vec2Pool.totalCreated);
assertEqual("initial inUse", 0, vec2Pool.inUse);

const v1 = vec2Pool.acquire();
v1.x = 10; v1.y = 20;
assertEqual("acquire returns object", true, typeof v1.x === 'number');
assertEqual("totalCreated after first acquire", 1, vec2Pool.totalCreated);
assertEqual("inUse after acquire", 1, vec2Pool.inUse);

vec2Pool.release(v1);
assertEqual("pool size after release", 1, vec2Pool.size);
assertEqual("inUse after release", 0, vec2Pool.inUse);

const v2 = vec2Pool.acquire();
assertEqual("reused object is reset x", 0, v2.x);
assertEqual("reused object is reset y", 0, v2.y);
assertEqual("totalCreated unchanged on reuse", 1, vec2Pool.totalCreated);

const poolSmall = createPool<Vec2>(() => ({ x: 0, y: 0 }), v => { v.x = 0; v.y = 0; }, 2);
const a = poolSmall.acquire();
const b = poolSmall.acquire();
const c = poolSmall.acquire();
poolSmall.release(a);
poolSmall.release(b);
poolSmall.release(c);
assertEqual("pool respects maxSize", 2, poolSmall.size);
`,
    hints: [
      'The pool maintains an array of available objects. <code>acquire()</code> pops from the array if non-empty, otherwise calls <code>factory()</code> to create a new one.',
      '<code>release(obj)</code> calls <code>reset(obj)</code> to clean the object, then pushes it back to the available array &mdash; but only if the pool has not reached <code>maxSize</code>.',
      'Track three counters: <code>available.length</code> (pool size), <code>totalCreated</code> (incremented only when factory is called), and <code>inUse</code> (incremented on acquire, decremented on release).',
      'The <code>reset</code> function is crucial &mdash; without it, released objects carry stale data. For <code>Vec2</code>, reset sets x and y back to 0. This ensures acquired objects are always in a clean state.',
    ],
    concepts: ['object pooling', 'GC pressure', 'memory management', 'hot path optimization', 'profiling-driven optimization', 'resource recycling'],
    successPatterns: [
      'interface\\s+ObjectPool',
      'createPool',
      'available\\.pop\\(\\)',
      'reset\\(obj\\)',
    ],
    testNames: [
      'initial pool size is 0',
      'initial totalCreated is 0',
      'initial inUse is 0',
      'acquire returns object with number fields',
      'totalCreated increments on new object',
      'inUse increments on acquire',
      'pool size increases after release',
      'inUse decrements after release',
      'reused object x is reset',
      'reused object y is reset',
      'totalCreated unchanged on reuse',
      'pool respects maxSize limit',
    ],
  },

  'ts-memoization': {
    id: 'ts-memoization',
    language: 'typescript',
    title: 'Type-Safe Memoization with WeakMap',
    difficulty: 'advanced',
    order: 4,
    description: `
<h3>The Ugly Way</h3>
<pre><code>const cache: Record<string, any> = {};

function memoize(fn: Function): Function {
  return function (...args: any[]) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

// Problems:
// 1. Global cache leaks memory forever
// 2. JSON.stringify loses type information and fails on circular refs
// 3. Return type is Function (any)
// 4. Object keys create identical strings for different objects</code></pre>

<h3>Why It Is Bad</h3>
<p>This memoization has four flaws: (1) the cache grows without bound and never releases memory, (2) <code>JSON.stringify</code> is unreliable as a key (fails on circular references, treats different objects with same structure as identical), (3) no type safety (input and output types are lost), and (4) it is a global singleton that leaks across unrelated calls.</p>

<h3>The Beautiful Way: WeakMap + Type Safety</h3>
<pre><code>function memoize<A extends object, R>(fn: (arg: A) => R): (arg: A) => R {
  const cache = new WeakMap<A, R>();
  return (arg: A): R => {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}</code></pre>

<p><code>WeakMap</code> keys are held weakly &mdash; when the object is garbage collected, its cache entry is automatically cleaned up. No memory leaks. The generic types preserve input/output type information. And identity-based keying means different objects are always distinct keys.</p>

<blockquote><strong>Taste principle:</strong> Space-time tradeoff done correctly. Memoization trades memory for speed, but a good implementation also manages that memory wisely. WeakMap gives you automatic cache cleanup. Generics give you type safety. Together, they make memoization a zero-maintenance optimization.</blockquote>

<h3>Your Task</h3>
<p>Implement three memoization strategies: (1) <code>memoizeWeak</code> using WeakMap for single object args, (2) <code>memoizeByKey</code> using a custom key function for primitives, and (3) <code>memoizeMultiArg</code> using nested Maps for multi-argument functions. Each should be fully typed and track cache hit statistics.</p>
`,
    starterCode: `// Implement type-safe memoization with proper cache management.

// Step 1: memoizeWeak — for single object arguments
// Uses WeakMap for automatic GC of unused entries
// function memoizeWeak<A extends object, R>(fn: (arg: A) => R): MemoizedFn<A, R>

// Step 2: memoizeByKey — for primitive arguments
// Uses a custom key function to derive cache keys
// function memoizeByKey<A, R>(fn: (arg: A) => R, keyFn: (arg: A) => string): MemoizedFn<A, R>

// Step 3: memoizeMultiArg — for two-argument functions
// Uses nested Maps: Map<A1, Map<A2, R>>
// function memoizeMultiArg<A1, A2, R>(fn: (a1: A1, a2: A2) => R): MemoizedMulti<A1, A2, R>

// Each memoized function should expose:
// - hits: number (cache hit count)
// - misses: number (cache miss count)

// interface MemoizedFn<A, R> {
//   (arg: A): R;
//   hits: number;
//   misses: number;
// }
`,
    solutionCode: `interface MemoizedFn<A, R> {
  (arg: A): R;
  hits: number;
  misses: number;
}

interface MemoizedMulti<A1, A2, R> {
  (a1: A1, a2: A2): R;
  hits: number;
  misses: number;
}

function memoizeWeak<A extends object, R>(fn: (arg: A) => R): MemoizedFn<A, R> {
  const cache = new WeakMap<A, R>();
  const memoized = function (arg: A): R {
    if (cache.has(arg)) {
      memoized.hits++;
      return cache.get(arg)!;
    }
    memoized.misses++;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  } as MemoizedFn<A, R>;
  memoized.hits = 0;
  memoized.misses = 0;
  return memoized;
}

function memoizeByKey<A, R>(fn: (arg: A) => R, keyFn: (arg: A) => string): MemoizedFn<A, R> {
  const cache = new Map<string, R>();
  const memoized = function (arg: A): R {
    const key = keyFn(arg);
    if (cache.has(key)) {
      memoized.hits++;
      return cache.get(key)!;
    }
    memoized.misses++;
    const result = fn(arg);
    cache.set(key, result);
    return result;
  } as MemoizedFn<A, R>;
  memoized.hits = 0;
  memoized.misses = 0;
  return memoized;
}

function memoizeMultiArg<A1, A2, R>(fn: (a1: A1, a2: A2) => R): MemoizedMulti<A1, A2, R> {
  const cache = new Map<A1, Map<A2, R>>();
  const memoized = function (a1: A1, a2: A2): R {
    if (cache.has(a1) && cache.get(a1)!.has(a2)) {
      memoized.hits++;
      return cache.get(a1)!.get(a2)!;
    }
    memoized.misses++;
    const result = fn(a1, a2);
    if (!cache.has(a1)) cache.set(a1, new Map());
    cache.get(a1)!.set(a2, result);
    return result;
  } as MemoizedMulti<A1, A2, R>;
  memoized.hits = 0;
  memoized.misses = 0;
  return memoized;
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

let weakCallCount = 0;
const processObj = memoizeWeak((obj: { n: number }) => { weakCallCount++; return obj.n * 2; });

const obj1 = { n: 5 };
assertEqual("weak first call", 10, processObj(obj1));
assertEqual("weak second call cached", 10, processObj(obj1));
assertEqual("weak fn called once", 1, weakCallCount);
assertEqual("weak hits", 1, processObj.hits);
assertEqual("weak misses", 1, processObj.misses);

const obj2 = { n: 5 };
processObj(obj2);
assertEqual("weak different object is miss", 2, processObj.misses);

let keyCallCount = 0;
const factorial = memoizeByKey((n: number) => {
  keyCallCount++;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}, n => String(n));

assertEqual("key first call", 120, factorial(5));
assertEqual("key second call cached", 120, factorial(5));
assertEqual("key fn called once", 1, keyCallCount);
assertEqual("key hits", 1, factorial.hits);

let multiCount = 0;
const add = memoizeMultiArg((a: number, b: number) => { multiCount++; return a + b; });

assertEqual("multi first call", 3, add(1, 2));
assertEqual("multi cached call", 3, add(1, 2));
assertEqual("multi fn called once", 1, multiCount);
assertEqual("multi different args", 7, add(3, 4));
assertEqual("multi hits", 1, add.hits);
assertEqual("multi misses", 2, add.misses);
`,
    hints: [
      '<code>memoizeWeak</code> uses <code>WeakMap&lt;A, R&gt;</code> where A is constrained to <code>object</code>. Check with <code>cache.has(arg)</code>, return <code>cache.get(arg)!</code> on hit, compute and <code>cache.set(arg, result)</code> on miss.',
      '<code>memoizeByKey</code> uses a regular <code>Map&lt;string, R&gt;</code> with a custom key function: <code>const key = keyFn(arg)</code>. This works for primitive arguments where WeakMap cannot be used.',
      '<code>memoizeMultiArg</code> uses nested Maps: <code>Map&lt;A1, Map&lt;A2, R&gt;&gt;</code>. Check both levels: <code>cache.has(a1) && cache.get(a1)!.has(a2)</code>. On miss, create the inner Map if needed.',
      'To expose <code>hits</code> and <code>misses</code> on the function, create the function first, then assign properties: <code>const memoized = function(...) { ... } as MemoizedFn&lt;A, R&gt;; memoized.hits = 0;</code>.',
    ],
    concepts: ['memoization', 'WeakMap', 'cache management', 'space-time tradeoff', 'type-safe generics', 'nested Map strategy', 'automatic GC cleanup'],
    successPatterns: [
      'WeakMap',
      'memoizeWeak',
      'memoizeByKey',
      'memoizeMultiArg',
    ],
    testNames: [
      'weak memoize first call computes',
      'weak memoize second call cached',
      'weak function called once',
      'weak hits count correct',
      'weak misses count correct',
      'weak different object identity is miss',
      'key memoize first call computes',
      'key memoize second call cached',
      'key function called once',
      'key hits count correct',
      'multi first call computes',
      'multi second call cached',
      'multi function called once',
      'multi different args computes',
      'multi hits count correct',
      'multi misses count correct',
    ],
  },
};
