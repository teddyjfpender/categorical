import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  // ─── Module 1: Type-Driven Design ────────────────────────────────────

  'ts-discriminated-unions': {
    id: 'ts-discriminated-unions',
    language: 'typescript',
    title: 'Discriminated Unions',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>Object-oriented languages model variants with class hierarchies: a base <code>Shape</code> class and subclasses <code>Circle</code>, <code>Rect</code>, etc. This spreads logic across files and makes exhaustive handling fragile.</p>

<p>TypeScript offers a better alternative: <strong>discriminated unions</strong>. You define a union of object types that share a common literal field (the <em>discriminant</em>), then use a <code>switch</code> on that field to handle each case.</p>

<h3>The Pattern</h3>
<pre><code>type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rect':   return shape.w * shape.h;
  }
}</code></pre>

<p>Inside each <code>case</code>, TypeScript <em>narrows</em> the type automatically &mdash; you get autocompletion for <code>radius</code> inside the <code>'circle'</code> branch without any casts.</p>

<h3>Why This Beats Class Hierarchies</h3>
<ul>
  <li><strong>All variants in one place.</strong> You see every possibility at a glance.</li>
  <li><strong>Exhaustive checking.</strong> If you add a new variant, the compiler tells you everywhere you forgot to handle it.</li>
  <li><strong>No runtime overhead.</strong> Plain objects &mdash; no prototype chains or <code>instanceof</code> checks.</li>
</ul>

<h3>Your Task</h3>
<p>Define the <code>Shape</code> type as a discriminated union with <code>circle</code> and <code>rect</code> variants, then implement the <code>area</code> function using an exhaustive <code>switch</code>.</p>
`,
    starterCode: `// Define a discriminated union for Shape
// 'circle' has a radius, 'rect' has w and h
type Shape = unknown; // <-- replace this

// Compute the area of any Shape
function area(shape: Shape): number {
  // Use a switch on shape.kind
  return 0;
}
`,
    solutionCode: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rect':
      return shape.w * shape.h;
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
assertEqual("unit circle area", Math.PI, area({ kind: 'circle', radius: 1 }));
assertEqual("square area", 9, area({ kind: 'rect', w: 3, h: 3 }));
`,
    hints: [
      'A discriminated union uses a shared literal field. Define <code>type Shape = { kind: \'circle\'; radius: number } | { kind: \'rect\'; w: number; h: number }</code>.',
      'Use <code>switch (shape.kind)</code> to branch on the discriminant.',
      'Circle area is <code>Math.PI * radius ** 2</code>. Rectangle area is <code>w * h</code>.',
      'TypeScript narrows the type inside each <code>case</code> block, so you can access <code>shape.radius</code> directly in the <code>\'circle\'</code> case.',
    ],
    concepts: ['discriminated unions', 'type narrowing', 'switch', 'exhaustive matching', 'algebraic data types'],
    successPatterns: [
      'kind.*circle',
      'kind.*rect',
      'switch\\s*\\(\\s*shape\\.kind',
      'Math\\.PI',
    ],
    testNames: [
      'circle area computes correctly',
      'rect area computes correctly',
      'unit circle area equals PI',
      'square area computes correctly',
    ],
  },

  'ts-branded-types': {
    id: 'ts-branded-types',
    language: 'typescript',
    title: 'Branded Types',
    difficulty: 'beginner',
    order: 2,
    description: `
<p>TypeScript uses <em>structural</em> typing: if two types have the same shape, they are compatible. This is usually great, but sometimes it is dangerous. Consider currencies:</p>

<pre><code>function addUSD(a: number, b: number): number {
  return a + b;
}

const priceUSD = 100;
const priceEUR = 85;
addUSD(priceUSD, priceEUR); // No error! But this is a bug.</code></pre>

<p>Both values are plain <code>number</code>, so TypeScript happily lets you mix dollars and euros. The fix is <strong>branded types</strong> (also called <em>opaque types</em> or <em>nominal types</em>).</p>

<h3>The Branding Trick</h3>
<pre><code>type USD = number & { __brand: 'USD' };
type EUR = number & { __brand: 'EUR' };</code></pre>

<p>The intersection with <code>{ __brand: 'USD' }</code> creates a type that is structurally different from plain <code>number</code> and from <code>EUR</code>. At runtime the brand does not exist &mdash; it is purely a compile-time guard. You create branded values with constructor functions that cast:</p>

<pre><code>function usd(amount: number): USD {
  return amount as USD;
}</code></pre>

<h3>Your Task</h3>
<p>Define <code>USD</code> and <code>EUR</code> branded types, write constructor functions <code>usd()</code> and <code>eur()</code>, and implement <code>addUSD(a: USD, b: USD): USD</code> that only accepts USD values.</p>
`,
    starterCode: `// Define branded types for USD and EUR
type USD = unknown; // <-- replace
type EUR = unknown; // <-- replace

// Constructor functions
function usd(amount: number): USD {
  // return a branded USD value
  return 0 as any;
}

function eur(amount: number): EUR {
  // return a branded EUR value
  return 0 as any;
}

// Only accepts USD — should reject EUR at compile time
function addUSD(a: USD, b: USD): USD {
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
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("usd creates value", 100, usd(100) as any);
assertEqual("eur creates value", 85, eur(85) as any);
assertEqual("addUSD sums correctly", 250, addUSD(usd(100), usd(150)) as any);
assertEqual("addUSD zero", 0, addUSD(usd(0), usd(0)) as any);
`,
    hints: [
      'A branded type intersects a primitive with a phantom property: <code>type USD = number & { __brand: \'USD\' }</code>.',
      'Constructor functions cast with <code>as</code>: <code>return amount as USD</code>.',
      'In <code>addUSD</code>, cast both arguments back to <code>number</code> to add them, then cast the result to <code>USD</code>.',
      'The brand property never exists at runtime &mdash; it is purely a compile-time safety net.',
    ],
    concepts: ['branded types', 'nominal typing', 'structural typing', 'type safety', 'intersection types'],
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
    ],
  },

  'ts-exhaustive-matching': {
    id: 'ts-exhaustive-matching',
    language: 'typescript',
    title: 'Exhaustive Matching with never',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>Discriminated unions are powerful, but what happens when you add a new variant and forget to update a <code>switch</code>? By default, TypeScript might just return <code>undefined</code>. You can catch this at compile time using the <code>never</code> trick.</p>

<h3>The never Trick</h3>
<pre><code>function assertNever(x: never): never {
  throw new Error("Unexpected value: " + x);
}

switch (shape.kind) {
  case 'circle': return ...;
  case 'rect':   return ...;
  default:       return assertNever(shape);
  //             ^^^ compile error if a case is missing!
}</code></pre>

<p>If every variant is handled, <code>shape</code> has type <code>never</code> in the <code>default</code> branch, and the assignment succeeds. If you add <code>'triangle'</code> to the union but forget to handle it, <code>shape</code> has type <code>{ kind: 'triangle'; ... }</code> in the default &mdash; which is not assignable to <code>never</code>, so you get a compile error.</p>

<h3>Your Task</h3>
<p>Extend the <code>Shape</code> union to include <code>'triangle'</code> (with <code>base</code> and <code>height</code>), then implement <code>describe(shape: Shape): string</code> that returns a human-readable description of each shape. Use the <code>never</code> trick to guarantee exhaustiveness.</p>
`,
    starterCode: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number }
  // Add a 'triangle' variant with base and height

function assertNever(x: never): never {
  throw new Error("Unexpected value: " + x);
}

// Return a string like "Circle with radius 5"
// or "Rectangle 4x6" or "Triangle with base 3 and height 4"
function describe(shape: Shape): string {
  return "";
}
`,
    solutionCode: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number }
  | { kind: 'triangle'; base: number; height: number };

function assertNever(x: never): never {
  throw new Error("Unexpected value: " + x);
}

function describe(shape: Shape): string {
  switch (shape.kind) {
    case 'circle':
      return "Circle with radius " + shape.radius;
    case 'rect':
      return "Rectangle " + shape.w + "x" + shape.h;
    case 'triangle':
      return "Triangle with base " + shape.base + " and height " + shape.height;
    default:
      return assertNever(shape);
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

assertEqual("describe circle", "Circle with radius 5", describe({ kind: 'circle', radius: 5 }));
assertEqual("describe rect", "Rectangle 4x6", describe({ kind: 'rect', w: 4, h: 6 }));
assertEqual("describe triangle", "Triangle with base 3 and height 4", describe({ kind: 'triangle', base: 3, height: 4 }));
assertEqual("describe unit circle", "Circle with radius 1", describe({ kind: 'circle', radius: 1 }));
`,
    hints: [
      'Add <code>| { kind: \'triangle\'; base: number; height: number }</code> to the Shape union.',
      'Use a <code>switch (shape.kind)</code> with cases for <code>\'circle\'</code>, <code>\'rect\'</code>, and <code>\'triangle\'</code>.',
      'In the <code>default</code> branch, call <code>assertNever(shape)</code> to ensure exhaustiveness.',
      'The descriptions should match exactly: <code>"Circle with radius 5"</code>, <code>"Rectangle 4x6"</code>, <code>"Triangle with base 3 and height 4"</code>.',
    ],
    concepts: ['exhaustive matching', 'never type', 'discriminated unions', 'compile-time safety', 'type narrowing'],
    successPatterns: [
      'kind.*triangle',
      'assertNever',
      'switch\\s*\\(\\s*shape\\.kind',
      'base.*height',
    ],
    testNames: [
      'describe circle returns correct string',
      'describe rect returns correct string',
      'describe triangle returns correct string',
      'describe unit circle returns correct string',
    ],
  },

  'ts-type-narrowing': {
    id: 'ts-type-narrowing',
    language: 'typescript',
    title: 'Type Narrowing and Type Guards',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p>TypeScript can <em>narrow</em> the type of a variable based on runtime checks. After a check, the type is automatically refined in that branch.</p>

<h3>Built-in Narrowing</h3>
<pre><code>function handle(x: string | number) {
  if (typeof x === 'string') {
    // x is string here — .toUpperCase() works
    return x.toUpperCase();
  }
  // x is number here
  return x * 2;
}</code></pre>

<h3>The <code>in</code> Operator</h3>
<pre><code>type Dog = { bark(): void };
type Cat = { meow(): void };

function speak(pet: Dog | Cat) {
  if ('bark' in pet) {
    pet.bark(); // narrowed to Dog
  } else {
    pet.meow(); // narrowed to Cat
  }
}</code></pre>

<h3>Custom Type Guards</h3>
<p>For complex checks, write a function that returns <code>x is SomeType</code>:</p>
<pre><code>function isString(x: unknown): x is string {
  return typeof x === 'string';
}</code></pre>

<h3>Your Task</h3>
<p>Implement <code>processInput(input: string | number | { name: string }): string</code> that:</p>
<ul>
  <li>If <code>input</code> is a <code>string</code>, returns it uppercased.</li>
  <li>If <code>input</code> is a <code>number</code>, returns it doubled as a string.</li>
  <li>If <code>input</code> is an object with <code>name</code>, returns <code>"Hello, {name}"</code>.</li>
</ul>
<p>Also implement a custom type guard <code>hasName(x: unknown): x is { name: string }</code>.</p>
`,
    starterCode: `// Custom type guard: checks if x is an object with a 'name' property
function hasName(x: unknown): x is { name: string } {
  return false; // <-- implement
}

// Process different input types using narrowing
function processInput(input: string | number | { name: string }): string {
  return ""; // <-- implement
}
`,
    solutionCode: `function hasName(x: unknown): x is { name: string } {
  return typeof x === 'object' && x !== null && 'name' in x && typeof (x as any).name === 'string';
}

function processInput(input: string | number | { name: string }): string {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  if (typeof input === 'number') {
    return String(input * 2);
  }
  return "Hello, " + input.name;
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("string input", "HELLO", processInput("hello"));
assertEqual("number input", "42", processInput(21));
assertEqual("object input", "Hello, Alice", processInput({ name: "Alice" }));
assertEqual("hasName true", true, hasName({ name: "Bob" }));
assertEqual("hasName false", false, hasName(42));
assertEqual("hasName null", false, hasName(null));
`,
    hints: [
      'Use <code>typeof input === \'string\'</code> to check for strings, <code>typeof input === \'number\'</code> for numbers.',
      'After each <code>typeof</code> check and early return, TypeScript narrows the remaining type automatically.',
      'For the custom type guard, check <code>typeof x === \'object\' && x !== null && \'name\' in x</code>.',
      'Convert a number to a string with <code>String(n)</code> or <code>n.toString()</code>.',
    ],
    concepts: ['type narrowing', 'typeof', 'in operator', 'custom type guards', 'is keyword', 'control flow analysis'],
    successPatterns: [
      'typeof.*===.*string',
      'typeof.*===.*number',
      'x\\s+is\\s+\\{',
      'toUpperCase',
    ],
    testNames: [
      'string input is uppercased',
      'number input is doubled and stringified',
      'object input gets greeting',
      'hasName returns true for objects with name',
      'hasName returns false for non-objects',
      'hasName returns false for null',
    ],
  },

  // ─── Module 2: API Design Patterns ───────────────────────────────────

  'ts-builder-pattern': {
    id: 'ts-builder-pattern',
    language: 'typescript',
    title: 'Builder Pattern',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>The Builder pattern constructs complex objects step by step. In TypeScript, you can make it <em>chainable</em> by returning <code>this</code> from each method, and even use the type system to enforce required steps.</p>

<h3>Chainable Builders</h3>
<pre><code>class QueryBuilder {
  private _table = '';
  private _columns: string[] = ['*'];

  from(table: string): this {
    this._table = table;
    return this;
  }

  select(...cols: string[]): this {
    this._columns = cols;
    return this;
  }
}</code></pre>

<p>By returning <code>this</code> instead of <code>QueryBuilder</code>, each method call chains naturally: <code>new QueryBuilder().from("users").select("name")</code>.</p>

<h3>Your Task</h3>
<p>Implement a <code>QueryBuilder</code> with methods <code>select(...columns)</code>, <code>from(table)</code>, <code>where(condition)</code>, and <code>build()</code> that returns the SQL string. The <code>build()</code> method should produce a string like <code>"SELECT name, age FROM users WHERE age > 18"</code>.</p>
`,
    starterCode: `class QueryBuilder {
  private _columns: string[] = ['*'];
  private _table: string = '';
  private _conditions: string[] = [];

  select(...columns: string[]): this {
    // set columns and return this
    return this;
  }

  from(table: string): this {
    // set table and return this
    return this;
  }

  where(condition: string): this {
    // add condition and return this
    return this;
  }

  build(): string {
    // build the SQL string
    return "";
  }
}
`,
    solutionCode: `class QueryBuilder {
  private _columns: string[] = ['*'];
  private _table: string = '';
  private _conditions: string[] = [];

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

  build(): string {
    let sql = "SELECT " + this._columns.join(", ") + " FROM " + this._table;
    if (this._conditions.length > 0) {
      sql += " WHERE " + this._conditions.join(" AND ");
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
assertEqual("full chain", "SELECT id, name FROM orders WHERE status = 'active' AND total > 100", new QueryBuilder().select("id", "name").from("orders").where("status = 'active'").where("total > 100").build());
`,
    hints: [
      'Each method should modify internal state and <code>return this</code> for chaining.',
      'Use <code>this._columns.join(", ")</code> to format the column list.',
      'Multiple <code>where()</code> calls should push to an array and join with <code>" AND "</code>.',
      '<code>build()</code> assembles: <code>"SELECT " + columns + " FROM " + table</code>, plus optional <code>" WHERE " + conditions</code>.',
    ],
    concepts: ['builder pattern', 'method chaining', 'fluent API', 'this return type', 'encapsulation'],
    successPatterns: [
      'return\\s+this',
      '_columns',
      '_table',
      'join',
    ],
    testNames: [
      'basic query with defaults',
      'select specific columns',
      'query with where clause',
      'full chain with multiple conditions',
    ],
  },

  'ts-result-type': {
    id: 'ts-result-type',
    language: 'typescript',
    title: 'The Result Type',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>Exceptions are invisible in type signatures. A function that throws gives no compile-time indication that it can fail. The <code>Result</code> type makes failure <em>explicit</em> and <em>composable</em>.</p>

<h3>Defining Result</h3>
<pre><code>type Result&lt;T, E&gt; =
  | { ok: true; value: T }
  | { ok: false; error: E };</code></pre>

<p>This is a discriminated union &mdash; <code>ok</code> is the discriminant. You can pattern match on it to safely handle both cases.</p>

<h3>Composing Results</h3>
<p>Instead of nested try/catch, you chain operations:</p>
<ul>
  <li><code>map</code> transforms the success value, leaving errors untouched.</li>
  <li><code>flatMap</code> chains operations that themselves return Results.</li>
  <li><code>unwrapOr</code> extracts the value with a default fallback.</li>
</ul>

<h3>Your Task</h3>
<p>Implement <code>ok()</code>, <code>err()</code> constructors and the <code>map</code>, <code>flatMap</code>, and <code>unwrapOr</code> functions for the Result type.</p>
`,
    starterCode: `type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  // return a success Result
  return { ok: true, value: value } as any;
}

function err<E>(error: E): Result<never, E> {
  // return a failure Result
  return { ok: false, error: error } as any;
}

// Transform the value inside a Result (if ok), leave errors unchanged
function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return err("not implemented" as any);
}

// Chain a function that returns a Result
function flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  return err("not implemented" as any);
}

// Extract value or return a default
function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return defaultValue;
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

function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
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
assertEqual("flatMap ok", { ok: true, value: 10 }, flatMap(ok(5), (x: number) => ok(x * 2)));
assertEqual("flatMap err", { ok: false, error: "fail" }, flatMap(err("fail"), (x: number) => ok(x * 2)));
assertEqual("unwrapOr ok", 42, unwrapOr(ok(42), 0));
assertEqual("unwrapOr err", 0, unwrapOr(err("fail"), 0));
`,
    hints: [
      'Check <code>result.ok</code> to determine if it is a success or failure.',
      'In <code>map</code>, if <code>result.ok</code>, apply <code>fn</code> to the value and wrap in <code>ok()</code>. Otherwise, return the error unchanged.',
      'In <code>flatMap</code>, if <code>result.ok</code>, return <code>fn(result.value)</code> directly (it already returns a Result).',
      '<code>unwrapOr</code> returns <code>result.value</code> if ok, otherwise the <code>defaultValue</code>.',
    ],
    concepts: ['Result type', 'error handling', 'discriminated unions', 'map', 'flatMap', 'functional composition'],
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
      'flatMap passes through error',
      'unwrapOr extracts success value',
      'unwrapOr returns default for error',
    ],
  },

  'ts-fluent-api': {
    id: 'ts-fluent-api',
    language: 'typescript',
    title: 'Fluent Configuration API',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>A <em>fluent API</em> reads like a sentence by chaining method calls. Each method returns <code>this</code> so calls can be strung together. This pattern is especially useful for configuration objects.</p>

<h3>The Pattern</h3>
<pre><code>const config = new Config()
  .setHost("localhost")
  .setPort(8080)
  .setDebug(true)
  .build();</code></pre>

<p>The <code>build()</code> method finalizes the configuration and returns a plain object. This is a stricter variant of the Builder pattern where the focus is on readability and discoverability.</p>

<h3>Why Fluent APIs?</h3>
<ul>
  <li>Self-documenting &mdash; reads like a description of the desired state.</li>
  <li>IDE-friendly &mdash; each method call triggers autocompletion for the next.</li>
  <li>Immutable result &mdash; <code>build()</code> produces a frozen snapshot.</li>
</ul>

<h3>Your Task</h3>
<p>Implement a <code>Config</code> class with <code>setHost(host)</code>, <code>setPort(port)</code>, <code>setDebug(debug)</code>, and <code>build()</code>. The <code>build()</code> method should return <code>{ host: string; port: number; debug: boolean }</code>.</p>
`,
    starterCode: `interface ServerConfig {
  host: string;
  port: number;
  debug: boolean;
}

class Config {
  private _host: string = 'localhost';
  private _port: number = 3000;
  private _debug: boolean = false;

  setHost(host: string): this {
    // implement
    return this;
  }

  setPort(port: number): this {
    // implement
    return this;
  }

  setDebug(debug: boolean): this {
    // implement
    return this;
  }

  build(): ServerConfig {
    // return the config object
    return { host: '', port: 0, debug: false };
  }
}
`,
    solutionCode: `interface ServerConfig {
  host: string;
  port: number;
  debug: boolean;
}

class Config {
  private _host: string = 'localhost';
  private _port: number = 3000;
  private _debug: boolean = false;

  setHost(host: string): this {
    this._host = host;
    return this;
  }

  setPort(port: number): this {
    this._port = port;
    return this;
  }

  setDebug(debug: boolean): this {
    this._debug = debug;
    return this;
  }

  build(): ServerConfig {
    return { host: this._host, port: this._port, debug: this._debug };
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

assertEqual("defaults", { host: "localhost", port: 3000, debug: false }, new Config().build());
assertEqual("set host", { host: "example.com", port: 3000, debug: false }, new Config().setHost("example.com").build());
assertEqual("full chain", { host: "prod.io", port: 443, debug: true }, new Config().setHost("prod.io").setPort(443).setDebug(true).build());
assertEqual("order independent", { host: "dev.io", port: 8080, debug: true }, new Config().setDebug(true).setPort(8080).setHost("dev.io").build());
`,
    hints: [
      'Each setter should assign to the private field and <code>return this</code>.',
      'The <code>build()</code> method should return a plain object with <code>host</code>, <code>port</code>, and <code>debug</code> properties.',
      'Default values are <code>"localhost"</code>, <code>3000</code>, and <code>false</code>.',
      'The order of <code>setHost</code>, <code>setPort</code>, <code>setDebug</code> calls should not matter.',
    ],
    concepts: ['fluent API', 'builder pattern', 'method chaining', 'configuration', 'this return type'],
    successPatterns: [
      'return\\s+this',
      'this\\._host\\s*=',
      'this\\._port\\s*=',
      'build.*ServerConfig',
    ],
    testNames: [
      'defaults are correct',
      'setHost works',
      'full chain configures all fields',
      'order of setter calls is independent',
    ],
  },

  'ts-error-handling': {
    id: 'ts-error-handling',
    language: 'typescript',
    title: 'Composable Error Handling',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p>Exceptions interrupt control flow and are invisible in type signatures. The <code>Result</code> type makes errors explicit, but wrapping every call in a check is verbose. The solution is a <code>tryCatch</code> helper that bridges the exception world into the Result world.</p>

<h3>tryCatch</h3>
<pre><code>function tryCatch&lt;T&gt;(fn: () => T): Result&lt;T, Error&gt; {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
  }
}</code></pre>

<h3>Validation Pipelines</h3>
<p>When you have multiple validation steps that can each fail, Results compose cleanly:</p>
<pre><code>const result = tryCatch(() => JSON.parse(input));
const validated = map(result, validate);
const processed = flatMap(validated, process);</code></pre>

<h3>Your Task</h3>
<p>Implement <code>tryCatch</code>, then build a validation pipeline: <code>parseAge(input: string): Result&lt;number, string&gt;</code> that parses a string to a number, validates it is between 0 and 150, and returns a descriptive error message on failure.</p>
`,
    starterCode: `type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Wrap a function that might throw into a Result
function tryCatch<T>(fn: () => T): Result<T, Error> {
  // implement
  return err(new Error("not implemented"));
}

// Parse a string into a validated age (0-150)
// Return descriptive error messages:
//   "Invalid number" if parsing fails
//   "Age must be between 0 and 150" if out of range
function parseAge(input: string): Result<number, string> {
  // implement
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

function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

function parseAge(input: string): Result<number, string> {
  const n = Number(input);
  if (isNaN(n)) {
    return err("Invalid number");
  }
  if (n < 0 || n > 150) {
    return err("Age must be between 0 and 150");
  }
  return ok(n);
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("tryCatch success", true, tryCatch(() => 42).ok);
assertEqual("tryCatch value", 42, (tryCatch(() => 42) as any).value);
assertEqual("tryCatch failure", false, tryCatch(() => { throw new Error("boom"); }).ok);
assertEqual("parseAge valid", { ok: true, value: 25 }, parseAge("25"));
assertEqual("parseAge invalid", { ok: false, error: "Invalid number" }, parseAge("abc"));
assertEqual("parseAge too high", { ok: false, error: "Age must be between 0 and 150" }, parseAge("200"));
assertEqual("parseAge zero", { ok: true, value: 0 }, parseAge("0"));
assertEqual("parseAge negative", { ok: false, error: "Age must be between 0 and 150" }, parseAge("-5"));
`,
    hints: [
      'In <code>tryCatch</code>, use a standard try/catch block. On success, return <code>ok(fn())</code>.',
      'In the catch block, check <code>e instanceof Error</code> and wrap non-Error values with <code>new Error(String(e))</code>.',
      'In <code>parseAge</code>, use <code>Number(input)</code> and check <code>isNaN(n)</code> for parse failure.',
      'Validate the range with <code>n < 0 || n > 150</code> for the out-of-range error.',
    ],
    concepts: ['error handling', 'Result type', 'tryCatch', 'validation pipeline', 'composable errors'],
    successPatterns: [
      'try\\s*\\{',
      'catch',
      'isNaN',
      'ok:\\s*true',
    ],
    testNames: [
      'tryCatch wraps success',
      'tryCatch extracts value',
      'tryCatch wraps thrown error',
      'parseAge valid input',
      'parseAge invalid number',
      'parseAge out of range high',
      'parseAge zero is valid',
      'parseAge negative is invalid',
    ],
  },

  // ─── Module 3: Functional TypeScript ─────────────────────────────────

  'ts-immutability': {
    id: 'ts-immutability',
    language: 'typescript',
    title: 'Immutability Patterns',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>Mutation is the root cause of many bugs: shared mutable state, stale references, race conditions. TypeScript provides tools to enforce immutability at the type level.</p>

<h3>Readonly and ReadonlyArray</h3>
<pre><code>interface User {
  readonly name: string;
  readonly age: number;
}

const nums: ReadonlyArray&lt;number&gt; = [1, 2, 3];
// nums.push(4); // Error! Property 'push' does not exist</code></pre>

<h3>Readonly&lt;T&gt; Utility</h3>
<pre><code>type ReadonlyUser = Readonly&lt;User&gt;;
// All properties become readonly</code></pre>

<h3>Pure Update Functions</h3>
<p>Instead of mutating, create new objects with the spread operator:</p>
<pre><code>function updateAge(user: User, age: number): User {
  return { ...user, age };
}</code></pre>

<h3>Your Task</h3>
<p>Define a <code>User</code> type with <code>name</code>, <code>age</code>, and <code>email</code>. Implement pure update functions: <code>updateUser</code> (merge partial updates), <code>addTag</code> (append to a readonly tags array), and <code>createUser</code> (factory with defaults).</p>
`,
    starterCode: `interface User {
  readonly name: string;
  readonly age: number;
  readonly email: string;
  readonly tags: ReadonlyArray<string>;
}

// Create a user with defaults: age=0, email='', tags=[]
function createUser(name: string): User {
  return { name: '', age: 0, email: '', tags: [] };
}

// Return a new User with the updates applied (do NOT mutate)
function updateUser(user: User, updates: Partial<Pick<User, 'name' | 'age' | 'email'>>): User {
  return user;
}

// Return a new User with tag added to the tags array
function addTag(user: User, tag: string): User {
  return user;
}
`,
    solutionCode: `interface User {
  readonly name: string;
  readonly age: number;
  readonly email: string;
  readonly tags: ReadonlyArray<string>;
}

function createUser(name: string): User {
  return { name, age: 0, email: '', tags: [] };
}

function updateUser(user: User, updates: Partial<Pick<User, 'name' | 'age' | 'email'>>): User {
  return { ...user, ...updates };
}

function addTag(user: User, tag: string): User {
  return { ...user, tags: [...user.tags, tag] };
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const u1 = createUser("Alice");
assertEqual("createUser name", "Alice", u1.name);
assertEqual("createUser defaults", 0, u1.age);

const u2 = updateUser(u1, { age: 30, email: "alice@example.com" });
assertEqual("updateUser age", 30, u2.age);
assertEqual("updateUser email", "alice@example.com", u2.email);
assertEqual("original unchanged", 0, u1.age);

const u3 = addTag(u2, "admin");
assertEqual("addTag", ["admin"], u3.tags as any);
assertEqual("addTag original unchanged", [], u2.tags as any);
`,
    hints: [
      '<code>createUser</code> should return <code>{ name, age: 0, email: \'\', tags: [] }</code>.',
      'Use the spread operator: <code>{ ...user, ...updates }</code> to merge updates immutably.',
      'For <code>addTag</code>, spread the existing tags array: <code>[...user.tags, tag]</code>.',
      'Never call <code>.push()</code> or directly assign to a <code>readonly</code> property &mdash; always create new objects.',
    ],
    concepts: ['immutability', 'Readonly', 'ReadonlyArray', 'spread operator', 'pure functions', 'Partial'],
    successPatterns: [
      '\\.\\.\\.',
      'readonly',
      'ReadonlyArray',
      'Partial',
    ],
    testNames: [
      'createUser sets name',
      'createUser has default age',
      'updateUser changes age',
      'updateUser changes email',
      'original is not mutated',
      'addTag appends tag',
      'addTag does not mutate original',
    ],
  },

  'ts-pipe-compose': {
    id: 'ts-pipe-compose',
    language: 'typescript',
    title: 'Pipe and Compose',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>Deeply nested function calls are hard to read:</p>
<pre><code>const result = toString(double(increment(parse("41"))));</code></pre>

<p>A <code>pipe</code> function transforms this into a left-to-right pipeline:</p>
<pre><code>const result = pipe("41", parse, increment, double, toString);</code></pre>

<h3>How pipe Works</h3>
<p>The simplest pipe takes a value and a sequence of functions, applying each one to the result of the previous:</p>
<pre><code>function pipe(value, fn1, fn2, fn3) {
  return fn3(fn2(fn1(value)));
}</code></pre>

<h3>Your Task</h3>
<p>Implement <code>pipe2</code> (value + 2 functions), <code>pipe3</code> (value + 3 functions), and a general <code>pipe</code> that accepts a value and an array of functions. Then demonstrate the pipeline by composing <code>parse</code>, <code>double</code>, and <code>toString</code>.</p>
`,
    starterCode: `// Pipe a value through 2 functions
function pipe2<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C {
  return undefined as any;
}

// Pipe a value through 3 functions
function pipe3<A, B, C, D>(
  value: A, fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D
): D {
  return undefined as any;
}

// General pipe: value + array of functions
function pipe(value: any, ...fns: Array<(x: any) => any>): any {
  return undefined;
}

// Helper functions for testing
function increment(x: number): number { return x + 1; }
function double(x: number): number { return x * 2; }
function toString(x: number): string { return String(x); }
function parse(x: string): number { return Number(x); }
`,
    solutionCode: `function pipe2<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C {
  return fn2(fn1(value));
}

function pipe3<A, B, C, D>(
  value: A, fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D
): D {
  return fn3(fn2(fn1(value)));
}

function pipe(value: any, ...fns: Array<(x: any) => any>): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

function increment(x: number): number { return x + 1; }
function double(x: number): number { return x * 2; }
function toString(x: number): string { return String(x); }
function parse(x: string): number { return Number(x); }
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("pipe2", "6", pipe2(3, double, toString));
assertEqual("pipe3", "84", pipe3("41", parse, double, toString));
assertEqual("pipe general 1", 6, pipe(3, double));
assertEqual("pipe general 2", "84", pipe("41", parse, double, toString));
assertEqual("pipe identity", 5, pipe(5));
assertEqual("pipe chain 4", 22, pipe(5, increment, double, increment, double));
`,
    hints: [
      '<code>pipe2</code> simply applies: <code>fn2(fn1(value))</code>.',
      '<code>pipe3</code> extends the pattern: <code>fn3(fn2(fn1(value)))</code>.',
      'The general <code>pipe</code> uses <code>reduce</code>: <code>fns.reduce((acc, fn) => fn(acc), value)</code>.',
      'If no functions are provided, <code>pipe(value)</code> should return the value unchanged (reduce with empty array returns the initial value).',
    ],
    concepts: ['pipe', 'compose', 'function composition', 'reduce', 'point-free style', 'data pipeline'],
    successPatterns: [
      'fn2\\(fn1\\(',
      'reduce',
      'fns\\.reduce',
      '\\.\\.\\.',
    ],
    testNames: [
      'pipe2 chains two functions',
      'pipe3 chains three functions',
      'general pipe with one function',
      'general pipe with three functions',
      'pipe with no functions is identity',
      'pipe with four functions',
    ],
  },

  'ts-option-pattern': {
    id: 'ts-option-pattern',
    language: 'typescript',
    title: 'The Option Pattern',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p><code>null</code> and <code>undefined</code> are the source of countless bugs. Tony Hoare called null his "billion-dollar mistake." The <code>Option</code> type (called <code>Maybe</code> in Haskell) makes the absence of a value explicit and forces you to handle it.</p>

<h3>Defining Option</h3>
<pre><code>type Option&lt;T&gt; =
  | { tag: 'some'; value: T }
  | { tag: 'none' };</code></pre>

<p>This is a discriminated union &mdash; <code>tag</code> is the discriminant. If you have done the Haskell track, this is exactly <code>data Maybe a = Just a | Nothing</code>.</p>

<h3>Working with Option</h3>
<ul>
  <li><code>map</code> &mdash; transform the inner value if present</li>
  <li><code>flatMap</code> &mdash; chain operations that themselves return Option</li>
  <li><code>getOrElse</code> &mdash; unwrap with a default value</li>
</ul>

<h3>Your Task</h3>
<p>Implement <code>some()</code>, <code>none()</code>, <code>map</code>, <code>flatMap</code>, and <code>getOrElse</code> for the Option type. Then implement <code>safeDiv(a, b)</code> that returns <code>none</code> on division by zero.</p>
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
  return none();
}

function flatMapOption<T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U> {
  return none();
}

function getOrElse<T>(opt: Option<T>, defaultValue: T): T {
  return defaultValue;
}

// Safe division: returns none if divisor is 0
function safeDiv(a: number, b: number): Option<number> {
  return none();
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

function safeDiv(a: number, b: number): Option<number> {
  if (b === 0) {
    return none();
  }
  return some(a / b);
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

assertEqual("some", { tag: "some", value: 42 }, some(42));
assertEqual("none", { tag: "none" }, none());
assertEqual("map some", { tag: "some", value: 10 }, mapOption(some(5), (x: number) => x * 2));
assertEqual("map none", { tag: "none" }, mapOption(none<number>(), (x: number) => x * 2));
assertEqual("flatMap some", { tag: "some", value: 5 }, flatMapOption(some(10), (x: number) => safeDiv(x, 2)));
assertEqual("flatMap none", { tag: "none" }, flatMapOption(none<number>(), (x: number) => safeDiv(x, 2)));
assertEqual("getOrElse some", 42, getOrElse(some(42), 0));
assertEqual("getOrElse none", 0, getOrElse(none<number>(), 0));
assertEqual("safeDiv ok", { tag: "some", value: 5 }, safeDiv(10, 2));
assertEqual("safeDiv by zero", { tag: "none" }, safeDiv(10, 0));
`,
    hints: [
      '<code>some(value)</code> returns <code>{ tag: \'some\', value }</code>.',
      'Check <code>opt.tag === \'some\'</code> before accessing <code>opt.value</code>.',
      'In <code>flatMapOption</code>, return <code>fn(opt.value)</code> directly when tag is <code>\'some\'</code> since <code>fn</code> already returns an Option.',
      'In <code>safeDiv</code>, return <code>none()</code> when <code>b === 0</code>, otherwise <code>some(a / b)</code>.',
    ],
    concepts: ['Option type', 'Maybe', 'null safety', 'map', 'flatMap', 'discriminated unions', 'safe division'],
    successPatterns: [
      'tag.*some',
      'tag.*none',
      'opt\\.tag\\s*===',
      'b\\s*===\\s*0',
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
      'safeDiv returns some for valid division',
      'safeDiv returns none for division by zero',
    ],
  },

  'ts-algebraic-effects': {
    id: 'ts-algebraic-effects',
    language: 'typescript',
    title: 'Algebraic Effects (Simple)',
    difficulty: 'advanced',
    order: 4,
    description: `
<p>In most programs, business logic is tangled with side effects: logging, state changes, API calls. <strong>Algebraic effects</strong> separate the <em>description</em> of what to do from the <em>execution</em> of how to do it. This is the core idea behind dependency injection, but taken to its logical conclusion.</p>

<h3>The Pattern: Effect Handlers</h3>
<p>Instead of calling <code>console.log</code> directly, your computation <em>requests</em> a log effect. An interpreter decides what to do with it:</p>

<pre><code>// Define effects as an interface
interface Effects {
  log(message: string): void;
  getTime(): number;
}

// Business logic depends on the interface, not implementation
function greet(effects: Effects, name: string): string {
  effects.log("Greeting " + name);
  const hour = effects.getTime();
  return hour &lt; 12 ? "Good morning" : "Good afternoon";
}</code></pre>

<h3>Why This Matters</h3>
<ul>
  <li><strong>Testability.</strong> Swap in a mock interpreter for tests &mdash; no spying or patching required.</li>
  <li><strong>Reusability.</strong> The same logic runs with a console logger in dev and a structured logger in production.</li>
  <li><strong>Purity.</strong> The business logic is a pure function of its inputs plus the effects interface.</li>
</ul>

<h3>Your Task</h3>
<p>Define an <code>Effects</code> interface with <code>log</code> and <code>getTime</code>. Implement <code>greet(effects, name)</code> that logs and returns a time-based greeting. Then create two interpreters: <code>realEffects</code> (uses console/Date) and <code>testEffects</code> (captures logs, returns fixed time).</p>
`,
    starterCode: `interface Effects {
  log(message: string): void;
  getTime(): number; // returns hour (0-23)
}

// Return "Good morning, {name}" if hour < 12, else "Good afternoon, {name}"
// Must call effects.log("Greeting " + name) before returning
function greet(effects: Effects, name: string): string {
  return "";
}

// Create a test interpreter that records logs and returns a fixed hour
function createTestEffects(fixedHour: number): Effects & { logs: string[] } {
  return { log: (_msg: string) => {}, getTime: () => 0, logs: [] };
}
`,
    solutionCode: `interface Effects {
  log(message: string): void;
  getTime(): number;
}

function greet(effects: Effects, name: string): string {
  effects.log("Greeting " + name);
  const hour = effects.getTime();
  if (hour < 12) {
    return "Good morning, " + name;
  }
  return "Good afternoon, " + name;
}

function createTestEffects(fixedHour: number): Effects & { logs: string[] } {
  const logs: string[] = [];
  return {
    log: (message: string) => { logs.push(message); },
    getTime: () => fixedHour,
    logs,
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

const morning = createTestEffects(9);
assertEqual("morning greeting", "Good morning, Alice", greet(morning, "Alice"));
assertEqual("morning logs", ["Greeting Alice"], morning.logs);

const afternoon = createTestEffects(14);
assertEqual("afternoon greeting", "Good afternoon, Bob", greet(afternoon, "Bob"));
assertEqual("afternoon logs", ["Greeting Bob"], afternoon.logs);

const noon = createTestEffects(12);
assertEqual("noon is afternoon", "Good afternoon, Eve", greet(noon, "Eve"));

const midnight = createTestEffects(0);
assertEqual("midnight is morning", "Good morning, Dave", greet(midnight, "Dave"));
`,
    hints: [
      'Call <code>effects.log("Greeting " + name)</code> first, then check <code>effects.getTime()</code>.',
      'If the hour is less than 12, return <code>"Good morning, " + name</code>, otherwise <code>"Good afternoon, " + name</code>.',
      'In <code>createTestEffects</code>, create a <code>logs</code> array and push to it in the <code>log</code> method.',
      'Return <code>fixedHour</code> from <code>getTime</code> to make tests deterministic.',
    ],
    concepts: ['algebraic effects', 'dependency injection', 'testability', 'pure functions', 'interpreters', 'effect handlers'],
    successPatterns: [
      'effects\\.log',
      'effects\\.getTime',
      'logs\\.push',
      'fixedHour',
    ],
    testNames: [
      'morning greeting is correct',
      'morning log is recorded',
      'afternoon greeting is correct',
      'afternoon log is recorded',
      'noon counts as afternoon',
      'midnight counts as morning',
    ],
  },

  // ─── Module 4: Advanced Type System ──────────────────────────────────

  'ts-mapped-types': {
    id: 'ts-mapped-types',
    language: 'typescript',
    title: 'Mapped Types',
    difficulty: 'advanced',
    order: 1,
    description: `
<p>Mapped types let you create new types by transforming the properties of existing ones. TypeScript's built-in utilities like <code>Partial</code>, <code>Required</code>, <code>Pick</code>, and <code>Omit</code> are all implemented as mapped types.</p>

<h3>The Syntax</h3>
<pre><code>type MyPartial&lt;T&gt; = {
  [K in keyof T]?: T[K];
};</code></pre>

<p>This iterates over every key <code>K</code> of <code>T</code>, keeps the same value type <code>T[K]</code>, and adds the <code>?</code> modifier to make each property optional.</p>

<h3>Modifiers</h3>
<ul>
  <li><code>?</code> &mdash; make optional</li>
  <li><code>-?</code> &mdash; make required (remove optional)</li>
  <li><code>readonly</code> &mdash; make readonly</li>
  <li><code>-readonly</code> &mdash; make mutable (remove readonly)</li>
</ul>

<h3>Your Task</h3>
<p>Implement your own versions of <code>MyPartial</code>, <code>MyRequired</code>, <code>MyPick</code>, and <code>MyReadonly</code> from scratch using mapped types. Then verify they work with a test type.</p>
`,
    starterCode: `// Make all properties optional
type MyPartial<T> = any; // <-- implement with mapped type

// Make all properties required
type MyRequired<T> = any; // <-- implement with mapped type

// Pick only the specified keys
type MyPick<T, K extends keyof T> = any; // <-- implement with mapped type

// Make all properties readonly
type MyReadonly<T> = any; // <-- implement with mapped type

// Test interface
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// These functions verify the types work at runtime
function makePartial(todo: MyPartial<Todo>): MyPartial<Todo> {
  return todo;
}

function makeRequired(todo: MyRequired<Todo>): MyRequired<Todo> {
  return todo;
}

function pickTitle(todo: MyPick<Todo, 'title'>): MyPick<Todo, 'title'> {
  return todo;
}

function makeReadonly(todo: MyReadonly<Todo>): MyReadonly<Todo> {
  return todo;
}
`,
    solutionCode: `type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

function makePartial(todo: MyPartial<Todo>): MyPartial<Todo> {
  return todo;
}

function makeRequired(todo: MyRequired<Todo>): MyRequired<Todo> {
  return todo;
}

function pickTitle(todo: MyPick<Todo, 'title'>): MyPick<Todo, 'title'> {
  return todo;
}

function makeReadonly(todo: MyReadonly<Todo>): MyReadonly<Todo> {
  return todo;
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
assertEqual("partial allows subset", { title: "test" }, makePartial({ title: "test" }));
assertEqual("required has all fields", { title: "a", description: "b", completed: true }, makeRequired({ title: "a", description: "b", completed: true }));
assertEqual("pick title only", { title: "hello" }, pickTitle({ title: "hello" }));
assertEqual("readonly preserves values", { title: "a", description: "b", completed: false }, makeReadonly({ title: "a", description: "b", completed: false }));
`,
    hints: [
      'Mapped type syntax: <code>{ [K in keyof T]: T[K] }</code> copies all properties unchanged.',
      'Add <code>?</code> after the key to make optional: <code>[K in keyof T]?: T[K]</code>.',
      'Use <code>-?</code> to remove optionality: <code>[K in keyof T]-?: T[K]</code>.',
      'For <code>MyPick</code>, iterate over <code>K</code> (the selected keys) instead of <code>keyof T</code>: <code>[P in K]: T[P]</code>.',
    ],
    concepts: ['mapped types', 'keyof', 'Partial', 'Required', 'Pick', 'Readonly', 'type-level programming'],
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
      'MyPick selects only specified keys',
      'MyReadonly preserves values',
    ],
  },

  'ts-conditional-types': {
    id: 'ts-conditional-types',
    language: 'typescript',
    title: 'Conditional Types',
    difficulty: 'advanced',
    order: 2,
    description: `
<p>Conditional types let you express type-level <code>if/else</code> logic. They follow the pattern <code>T extends U ? X : Y</code> &mdash; if <code>T</code> is assignable to <code>U</code>, the type resolves to <code>X</code>, otherwise <code>Y</code>.</p>

<h3>Basic Conditional Types</h3>
<pre><code>type IsString&lt;T&gt; = T extends string ? true : false;

type A = IsString&lt;string&gt;;  // true
type B = IsString&lt;number&gt;;  // false</code></pre>

<h3>The <code>infer</code> Keyword</h3>
<p><code>infer</code> lets you extract types from within other types:</p>
<pre><code>type ReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : never;

type X = ReturnType&lt;() => string&gt;;  // string</code></pre>

<h3>Your Task</h3>
<p>Implement <code>IsString</code>, <code>MyReturnType</code>, and <code>ArrayElement</code> (extracts the element type from an array type). Use runtime verification functions to test them.</p>
`,
    starterCode: `// Returns true if T is string, false otherwise
type IsString<T> = any; // <-- implement

// Extracts the return type of a function type
type MyReturnType<T> = any; // <-- implement

// Extracts the element type from an array
type ArrayElement<T> = any; // <-- implement

// Runtime verification functions
function checkIsString<T>(value: T, expected: boolean): boolean {
  return expected; // The real check is at the type level
}

function testReturnType(fn: () => number): MyReturnType<typeof fn> {
  return fn();
}

function testArrayElement(arr: number[]): ArrayElement<typeof arr> {
  return arr[0];
}
`,
    solutionCode: `type IsString<T> = T extends string ? true : false;

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type ArrayElement<T> = T extends (infer E)[] ? E : never;

function checkIsString<T>(value: T, expected: boolean): boolean {
  return expected;
}

function testReturnType(fn: () => number): MyReturnType<typeof fn> {
  return fn();
}

function testArrayElement(arr: number[]): ArrayElement<typeof arr> {
  return arr[0];
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
assertEqual("ArrayElement", 1, testArrayElement([1, 2, 3]));
assertEqual("ReturnType string fn", "hello", (() => { function f(): string { return "hello"; } return (f as any)() })());
`,
    hints: [
      'The conditional type syntax is <code>T extends U ? TrueType : FalseType</code>.',
      'For <code>IsString</code>: <code>T extends string ? true : false</code>.',
      'For <code>MyReturnType</code>: <code>T extends (...args: any[]) => infer R ? R : never</code>. The <code>infer R</code> captures the return type.',
      'For <code>ArrayElement</code>: <code>T extends (infer E)[] ? E : never</code>. The <code>infer E</code> captures the element type.',
    ],
    concepts: ['conditional types', 'infer', 'extends', 'type-level programming', 'ReturnType', 'type extraction'],
    successPatterns: [
      'extends\\s+string\\s*\\?',
      'infer\\s+R',
      'infer\\s+E',
      'extends.*=>.*\\?',
    ],
    testNames: [
      'IsString detects string',
      'IsString rejects number',
      'ReturnType extracts number',
      'ArrayElement extracts element type',
      'ReturnType works with string functions',
    ],
  },

  'ts-template-literals': {
    id: 'ts-template-literals',
    language: 'typescript',
    title: 'Template Literal Types',
    difficulty: 'advanced',
    order: 3,
    description: `
<p>Template literal types let you manipulate string types at the type level. Combined with union types, they can generate many specific string types from a small definition.</p>

<h3>Basic Template Literals</h3>
<pre><code>type Greeting = \`Hello, \${string}\`;
// Matches "Hello, Alice", "Hello, Bob", etc.

type EventName = 'click' | 'hover' | 'focus';
type Handler = \`on\${Capitalize&lt;EventName&gt;}\`;
// = 'onClick' | 'onHover' | 'onFocus'</code></pre>

<h3>Built-in String Utilities</h3>
<ul>
  <li><code>Capitalize&lt;S&gt;</code> &mdash; <code>"click"</code> becomes <code>"Click"</code></li>
  <li><code>Uncapitalize&lt;S&gt;</code> &mdash; <code>"Click"</code> becomes <code>"click"</code></li>
  <li><code>Uppercase&lt;S&gt;</code> &mdash; <code>"click"</code> becomes <code>"CLICK"</code></li>
  <li><code>Lowercase&lt;S&gt;</code> &mdash; <code>"CLICK"</code> becomes <code>"click"</code></li>
</ul>

<h3>Your Task</h3>
<p>Build a type-safe event system. Define event names as a union, generate handler names using template literals, and implement a typed <code>EventEmitter</code> class with <code>on()</code> and <code>emit()</code> methods.</p>
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

class EventEmitter {
  private handlers: { [K in EventName]?: Array<(data: EventMap[K]) => void> } = {};

  // Register a handler for an event
  on<K extends EventName>(event: K, handler: (data: EventMap[K]) => void): void {
    // implement
  }

  // Emit an event with data
  emit<K extends EventName>(event: K, data: EventMap[K]): void {
    // implement
  }
}

// Helper to get handler name from event name
function getHandlerName<K extends EventName>(event: K): \`on\${Capitalize<K>}\` {
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

class EventEmitter {
  private handlers: { [K in EventName]?: Array<(data: EventMap[K]) => void> } = {};

  on<K extends EventName>(event: K, handler: (data: EventMap[K]) => void): void {
    if (!this.handlers[event]) {
      (this.handlers[event] as any) = [];
    }
    (this.handlers[event] as any).push(handler);
  }

  emit<K extends EventName>(event: K, data: EventMap[K]): void {
    const fns = this.handlers[event];
    if (fns) {
      (fns as any[]).forEach((fn: any) => fn(data));
    }
  }
}

function getHandlerName<K extends EventName>(event: K): \`on\${Capitalize<K>}\` {
  return ("on" + event.charAt(0).toUpperCase() + event.slice(1)) as \`on\${Capitalize<K>}\`;
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

let received: any = null;
const emitter = new EventEmitter();
emitter.on("click", (data) => { received = data; });
emitter.emit("click", { x: 10, y: 20 });
assertEqual("emit click", { x: 10, y: 20 }, received);

received = null;
emitter.on("focus", (data) => { received = data; });
emitter.emit("focus", { target: "input" });
assertEqual("emit focus", { target: "input" }, received);
`,
    hints: [
      'Template literal type syntax: <code>type HandlerName = \\`on\\${Capitalize<EventName>}\\`</code>.',
      'In <code>on()</code>, initialize the array if it does not exist, then push the handler.',
      'In <code>emit()</code>, iterate over the handlers array and call each one with the data.',
      'For <code>getHandlerName</code>, build the string at runtime: <code>"on" + event.charAt(0).toUpperCase() + event.slice(1)</code>.',
    ],
    concepts: ['template literal types', 'Capitalize', 'event system', 'generics', 'type-safe events', 'mapped types'],
    successPatterns: [
      'Capitalize',
      'on\\$\\{',
      'handlers\\[event\\]',
      'forEach',
    ],
    testNames: [
      'handler name for click',
      'handler name for hover',
      'handler name for focus',
      'emit and receive click event',
      'emit and receive focus event',
    ],
  },

  'ts-type-challenges': {
    id: 'ts-type-challenges',
    language: 'typescript',
    title: 'Type-Level Challenges',
    difficulty: 'advanced',
    order: 4,
    description: `
<p>This capstone exercise tests your mastery of TypeScript's type system with three classic challenges from the type-level programming community.</p>

<h3>Challenge 1: DeepReadonly</h3>
<p>The built-in <code>Readonly</code> only works one level deep. Implement <code>DeepReadonly&lt;T&gt;</code> that recursively makes all properties and nested objects readonly.</p>

<h3>Challenge 2: Flatten</h3>
<p>Implement <code>Flatten&lt;T&gt;</code> that takes a nested array type and flattens it one level: <code>Flatten&lt;[1, [2, 3], [4]]&gt;</code> becomes <code>[1, 2, 3, 4]</code>.</p>

<h3>Challenge 3: TupleToUnion</h3>
<p>Implement <code>TupleToUnion&lt;T&gt;</code> that converts a tuple type to a union of its elements: <code>TupleToUnion&lt;[string, number, boolean]&gt;</code> becomes <code>string | number | boolean</code>.</p>

<h3>Your Task</h3>
<p>Implement all three type utilities. Runtime verification functions are provided to test them.</p>
`,
    starterCode: `// Recursively make all properties readonly
type DeepReadonly<T> = any; // <-- implement

// Flatten a nested array type one level
type Flatten<T extends any[]> = any; // <-- implement

// Convert a tuple to a union of its elements
type TupleToUnion<T extends any[]> = any; // <-- implement

// Runtime verification
interface Nested {
  name: string;
  address: {
    street: string;
    city: string;
  };
  tags: string[];
}

function deepFreeze<T>(obj: T): DeepReadonly<T> {
  return obj as any;
}

function flattenArray<T extends any[]>(arr: T): Flatten<T> {
  return ([] as any[]).concat(...arr) as any;
}

function tupleToUnionValue<T extends any[]>(tuple: T): TupleToUnion<T> {
  return tuple[0];
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
  address: {
    street: string;
    city: string;
  };
  tags: string[];
}

function deepFreeze<T>(obj: T): DeepReadonly<T> {
  return obj as any;
}

function flattenArray<T extends any[]>(arr: T): Flatten<T> {
  return ([] as any[]).concat(...arr) as any;
}

function tupleToUnionValue<T extends any[]>(tuple: T): TupleToUnion<T> {
  return tuple[0];
}
`,
    testCode: `function assertEqual(name: string, expected: any, actual: any) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + ": Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

const frozen = deepFreeze({ name: "Alice", address: { street: "Main St", city: "NYC" }, tags: ["admin"] });
assertEqual("deepFreeze preserves values", "Alice", frozen.name);
assertEqual("deepFreeze nested", "Main St", frozen.address.street);

assertEqual("flatten", [1, 2, 3, 4], flattenArray([1, [2, 3], [4]]));
assertEqual("flatten empty", [], flattenArray([]));
assertEqual("flatten no nesting", [1, 2, 3], flattenArray([1, 2, 3]));

assertEqual("tupleToUnion", "hello", tupleToUnionValue(["hello", 42, true]));
`,
    hints: [
      'For <code>DeepReadonly</code>, check if <code>T extends object</code> and recursively apply: <code>{ readonly [K in keyof T]: DeepReadonly<T[K]> }</code>. Handle arrays separately.',
      'For <code>Flatten</code>, use variadic tuple types: <code>T extends [infer First, ...infer Rest]</code>. If <code>First extends any[]</code>, spread it.',
      '<code>TupleToUnion</code> has a surprisingly simple solution: <code>T[number]</code> indexes a tuple with <code>number</code> to get the union of all element types.',
      'Remember to handle base cases: empty arrays for <code>Flatten</code>, primitives for <code>DeepReadonly</code>.',
    ],
    concepts: ['DeepReadonly', 'Flatten', 'TupleToUnion', 'recursive types', 'conditional types', 'infer', 'variadic tuples'],
    successPatterns: [
      'DeepReadonly',
      'T\\[number\\]',
      'infer.*First',
      'readonly.*keyof',
    ],
    testNames: [
      'deepFreeze preserves top-level values',
      'deepFreeze preserves nested values',
      'flatten nested arrays',
      'flatten empty array',
      'flatten already flat array',
      'tupleToUnion extracts first element',
    ],
  },
};
