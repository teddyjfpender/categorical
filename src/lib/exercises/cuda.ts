import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  // ─────────────────────────────────────────────
  // Module 1: Parallel Fundamentals
  // "The hardware dictates the algorithm"
  // ─────────────────────────────────────────────

  'cuda-thread-hierarchy': {
    id: 'cuda-thread-hierarchy',
    language: 'cuda',
    title: 'SIMT Execution and the Thread Hierarchy',
    difficulty: 'beginner',
    order: 1,
    description: `
<h3>Why Does the Hierarchy Exist?</h3>
<p>Most tutorials start with <code>threadIdx</code> and <code>blockIdx</code> and move on. That skips the important question: <em>why does CUDA organize threads this way at all?</em> The answer is hardware.</p>

<p>An NVIDIA GPU executes threads in groups of <strong>32 called warps</strong>. Every thread in a warp executes the <em>same instruction at the same time</em> — this is <strong>SIMT</strong> (Single Instruction, Multiple Threads). The warp is not a software abstraction; it is a physical constraint of the silicon.</p>

<h3>The Serial Version: Why Not Just Loops?</h3>
<pre>
// CPU: one thread, N iterations
for (int i = 0; i < N; i++) {
    output[i] = process(input[i]);
}
// Time: N * cost_per_element
</pre>

<p>A CPU processes elements one at a time. Even with 16 cores, you get 16x speedup at best. A GPU launches <em>thousands</em> of threads — but it doesn't give each thread its own instruction decoder. Instead, 32 threads share one decoder and execute in lockstep.</p>

<h3>What Happens When Warps Diverge</h3>
<p>Because warps execute in lockstep, an <code>if/else</code> becomes a <strong>performance cliff</strong>:</p>
<pre>
// DANGEROUS: warp divergence
if (threadIdx.x % 2 == 0) {
    doExpensiveWork();   // Half the warp does this...
} else {
    doOtherWork();       // ...while the other half WAITS
}
// Both paths execute SERIALLY — you just halved your throughput
</pre>

<p>The GPU doesn't skip one path. It executes <em>both</em> paths, masking out threads that shouldn't participate. Divergence within a warp means you pay for both branches.</p>

<h3>The Three-Level Hierarchy Follows from Hardware</h3>
<table>
  <thead><tr><th>Level</th><th>Maps to Hardware</th><th>Why It Exists</th></tr></thead>
  <tbody>
    <tr><td><strong>Thread</strong></td><td>One lane of a SIMT unit</td><td>Finest grain of work</td></tr>
    <tr><td><strong>Warp</strong> (32 threads)</td><td>One SIMT execution unit</td><td>Lockstep execution — not optional</td></tr>
    <tr><td><strong>Block</strong> (up to 1024 threads)</td><td>One Streaming Multiprocessor (SM)</td><td>Shared memory + synchronization boundary</td></tr>
    <tr><td><strong>Grid</strong> (all blocks)</td><td>The entire GPU</td><td>Blocks scheduled across all SMs</td></tr>
  </tbody>
</table>

<h3>Design Principle</h3>
<p><em>"Understand the hardware before you write the code."</em> The thread hierarchy isn't arbitrary — it mirrors the GPU's physical execution model. When you choose block sizes, you're choosing how many warps execute on each SM. When you write conditionals, you're deciding whether warps diverge.</p>

<h3>Your Task</h3>
<p>Answer the questions below to prove you understand not just the indexing math, but the hardware consequences. Replace each <code>-1</code> with the correct value.</p>
`,
    starterCode: `// CUDA Thread Hierarchy — Hardware-Aware Thinking
// Launch: <<<4, 128>>> (4 blocks, 128 threads/block)

// ============================================
// Q1: How many WARPS does each block contain?
//     (A warp is always 32 threads)
// ============================================
const int warps_per_block = -1;

// ============================================
// Q2: How many TOTAL warps are launched?
// ============================================
const int total_warps = -1;

// ============================================
// Q3: Block 2, Thread 67 — what is its global ID?
//     globalId = blockIdx.x * blockDim.x + threadIdx.x
// ============================================
const int global_id = -1;

// ============================================
// Q4: Block 2, Thread 67 — which WARP within
//     its block does it belong to?
//     (warp_id = threadIdx.x / 32)
// ============================================
const int warp_id = -1;

// ============================================
// Q5: A kernel has an if/else where threads
//     0-15 take the if-branch and 16-31 take
//     the else-branch (within each warp).
//     What fraction of the warp's compute is
//     WASTED due to divergence?
//     Express as a percentage (integer).
// ============================================
const int wasted_percent = -1;

// ============================================
// Q6: Same if/else, but threads 0-31 take the
//     if-branch, threads 32-63 take the else.
//     (Entire warps go one way or the other.)
//     What fraction is wasted?
// ============================================
const int wasted_no_diverge = -1;
`,
    solutionCode: `// CUDA Thread Hierarchy — Solutions

// Q1: 128 threads / 32 threads-per-warp = 4 warps per block
const int warps_per_block = 4;

// Q2: 4 blocks * 4 warps/block = 16 total warps
const int total_warps = 16;

// Q3: 2 * 128 + 67 = 323
const int global_id = 323;

// Q4: 67 / 32 = 2 (integer division: warp 0 has threads 0-31,
//     warp 1 has 32-63, warp 2 has 64-95)
const int warp_id = 2;

// Q5: 50% wasted — divergence means both paths execute serially
//     within the warp, so half the lanes are idle on each path
const int wasted_percent = 50;

// Q6: 0% wasted — when entire warps go one direction, no
//     divergence occurs. Only intra-warp branching causes
//     divergence. This is why you align branches to warp
//     boundaries when possible.
const int wasted_no_diverge = 0;
`,
    testCode: '',
    hints: [
      'A warp is always exactly 32 threads. Divide blockDim.x by 32 to get warps per block.',
      'Global ID = blockIdx.x * blockDim.x + threadIdx.x. For Block 2, Thread 67: 2*128+67.',
      'Warp divergence only happens when threads <em>within the same warp</em> take different paths. If all 32 threads go the same way, there is zero divergence.',
      'When divergence occurs, both branches execute serially. Half the lanes are masked off during each branch, so 50% of compute is wasted.',
    ],
    concepts: [
      'SIMT execution',
      'warp divergence',
      'thread hierarchy',
      'warp size',
      'lockstep execution',
      'global thread ID',
    ],
    successPatterns: [
      'warps_per_block\\s*=\\s*4',
      'total_warps\\s*=\\s*16',
      'global_id\\s*=\\s*323',
      'warp_id\\s*=\\s*2',
      'wasted_percent\\s*=\\s*50',
      'wasted_no_diverge\\s*=\\s*0',
    ],
    testNames: [
      'warps_per_block equals 4 (128 / 32)',
      'total_warps equals 16 (4 blocks * 4 warps)',
      'global_id of Block 2, Thread 67 equals 323',
      'warp_id of thread 67 equals 2 (threads 64-95)',
      'warp divergence wastes 50% of compute',
      'aligned branches cause 0% divergence',
    ],
  },

  'cuda-kernel-launch': {
    id: 'cuda-kernel-launch',
    language: 'cuda',
    title: 'Launch Configuration: The Resource Balancing Act',
    difficulty: 'beginner',
    order: 2,
    description: `
<h3>The Decision You Actually Have to Make</h3>
<p>Most tutorials show <code>kernel&lt;&lt;&lt;gridSize, blockSize&gt;&gt;&gt;()</code> and move on. The real skill is choosing <code>blockSize</code>. This is not a syntax question — it is a <strong>resource engineering</strong> question with real tradeoffs.</p>

<h3>Why Block Size Matters: Three Failure Modes</h3>
<table>
  <thead><tr><th>Block Size</th><th>Problem</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td><strong>Too small</strong> (e.g., 32)</td><td>GPU underutilized</td><td>Each SM can run multiple blocks, but with tiny blocks you may not have enough warps to hide memory latency</td></tr>
    <tr><td><strong>Too large</strong> (e.g., 1024)</td><td>Register pressure</td><td>More threads per block means fewer registers per thread; the compiler starts spilling to slow local memory</td></tr>
    <tr><td><strong>Not a multiple of 32</strong></td><td>Wasted lanes</td><td>The last warp in each block will have idle threads that still consume scheduling resources</td></tr>
  </tbody>
</table>

<h3>The Thought Process</h3>
<pre>
Step 1: Start with 256 threads/block (good default)
        - 8 warps per block: enough for latency hiding
        - Not so many that register pressure is severe

Step 2: Calculate grid size
        gridSize = (N + blockSize - 1) / blockSize

Step 3: Add bounds checking in the kernel
        if (tid < N) { ... }  // Extra threads do nothing

Step 4: Profile and adjust
        - If occupancy is low, try 128 or 512
        - If register usage is high, try smaller blocks
</pre>

<h3>The Deeper Point</h3>
<p>On a CPU, you write a loop and the hardware figures out how to execute it. On a GPU, <em>you</em> decide how to partition work across thousands of threads. <strong>GPU programming is about managing resources, not writing loops.</strong></p>

<h3>Your Task</h3>
<p>For each scenario, compute the correct launch configuration. Think about why each answer is what it is — the grid size calculation and the block size choice both reflect resource management.</p>
`,
    starterCode: `// Kernel Launch Configuration — Resource Engineering
// For each scenario, fill in the correct value.

// ============================================
// Scenario 1: Process 10000 elements
//   blockSize = 256
//   What gridSize covers ALL elements?
// ============================================
const int gridSize_1 = -1;  // must be >= ceil(10000/256)

// ============================================
// Scenario 2: Process 1000 elements
//   blockSize = 256, gridSize from above
//   How many threads are launched TOTAL?
//   How many threads are "wasted" (do no work)?
// ============================================
const int gridSize_2 = -1;
const int total_threads_2 = -1;
const int wasted_threads_2 = -1;

// ============================================
// Scenario 3: A kernel uses 64 registers per
//   thread. The GPU has 65536 registers per SM.
//   What is the MAX threads per SM?
// ============================================
const int max_threads_per_sm = -1;

// ============================================
// Scenario 4: With max 1024 threads from
//   register pressure, and blockSize=256,
//   how many blocks can run on one SM at once?
// ============================================
const int concurrent_blocks = -1;

// ============================================
// Scenario 5: You chose blockSize = 100.
//   How many threads in the last warp of each
//   block are wasted? (warp size = 32)
//   Think: 100 = 3*32 + ?  The last warp has
//   only ? active threads, so 32 - ? are idle.
// ============================================
const int wasted_in_last_warp = -1;
`,
    solutionCode: `// Kernel Launch Configuration — Solutions

// Scenario 1: ceil(10000 / 256) = (10000 + 255) / 256 = 40
// 40 * 256 = 10240 >= 10000 ✓
const int gridSize_1 = 40;

// Scenario 2: ceil(1000 / 256) = 4
// Total: 4 * 256 = 1024
// Wasted: 1024 - 1000 = 24
const int gridSize_2 = 4;
const int total_threads_2 = 1024;
const int wasted_threads_2 = 24;

// Scenario 3: 65536 / 64 = 1024 threads max per SM
// This is register-limited: even if the SM could
// run more, you're out of registers.
const int max_threads_per_sm = 1024;

// Scenario 4: 1024 / 256 = 4 blocks concurrently
const int concurrent_blocks = 4;

// Scenario 5: 100 = 3*32 + 4
// Last warp has 4 active threads, 28 are idle
const int wasted_in_last_warp = 28;
`,
    testCode: '',
    hints: [
      'Grid size for N elements with B threads/block: <code>(N + B - 1) / B</code>. This is integer ceiling division.',
      'For scenario 2: compute gridSize first, then total = gridSize * blockSize. Wasted = total - N.',
      'Register-limited threads: divide total registers by registers-per-thread.',
      'blockSize = 100: 100 mod 32 = 4, so the last warp has only 4 active threads. 32 - 4 = 28 wasted.',
    ],
    concepts: [
      'launch configuration',
      'block size selection',
      'grid size calculation',
      'register pressure',
      'warp occupancy',
      'resource management',
    ],
    successPatterns: [
      'gridSize_1\\s*=\\s*40',
      'gridSize_2\\s*=\\s*4',
      'total_threads_2\\s*=\\s*1024',
      'wasted_threads_2\\s*=\\s*24',
      'max_threads_per_sm\\s*=\\s*1024',
      'concurrent_blocks\\s*=\\s*4',
      'wasted_in_last_warp\\s*=\\s*28',
    ],
    testNames: [
      'gridSize for 10000 elements with 256 blockSize equals 40',
      'gridSize for 1000 elements with 256 blockSize equals 4',
      'total threads launched for 1000 elements equals 1024',
      'wasted threads equals 24 (1024 - 1000)',
      'max threads per SM with 64 regs/thread equals 1024',
      'concurrent blocks on SM equals 4 (1024/256)',
      'non-32-aligned block wastes 28 threads in last warp',
    ],
  },

  'cuda-memory-spaces': {
    id: 'cuda-memory-spaces',
    language: 'cuda',
    title: 'Memory Bandwidth: The Real Bottleneck',
    difficulty: 'beginner',
    order: 3,
    description: `
<h3>The Insight That Changes Everything</h3>
<p>Most beginning GPU programmers think their kernels are compute-bound. They are almost always wrong. <strong>The overwhelming majority of GPU kernels are memory-bound.</strong> The arithmetic units sit idle, waiting for data to arrive from memory.</p>

<h3>Why Memory Dominates</h3>
<pre>
Modern GPU:   ~20 TFLOPS (20 trillion operations/sec)
              ~900 GB/s memory bandwidth

To keep the GPU busy with float32 adds:
  20 TFLOPS / (900 GB/s / 4 bytes) = 89 FLOPs per byte loaded

You need 89 floating-point operations per byte of data
just to make the kernel compute-bound!

Most kernels do 1-10 FLOPs per byte loaded.
They are profoundly memory-bound.
</pre>

<h3>The Memory Hierarchy</h3>
<table>
  <thead><tr><th>Memory</th><th>Size</th><th>Latency</th><th>Bandwidth</th><th>Scope</th></tr></thead>
  <tbody>
    <tr><td><strong>Registers</strong></td><td>~256 KB/SM</td><td>0 cycles</td><td>Highest</td><td>Per thread</td></tr>
    <tr><td><strong>Shared memory</strong></td><td>~100 KB/SM</td><td>~5 cycles</td><td>~12 TB/s</td><td>Per block</td></tr>
    <tr><td><strong>L2 cache</strong></td><td>~6 MB</td><td>~200 cycles</td><td>~3 TB/s</td><td>All SMs</td></tr>
    <tr><td><strong>Global (DRAM)</strong></td><td>~24 GB</td><td>~400 cycles</td><td>~900 GB/s</td><td>All SMs</td></tr>
  </tbody>
</table>

<p>Global memory is <strong>~80x slower</strong> than shared memory. Yet naive kernels read everything from global memory. The entire art of GPU optimization is moving data into faster memory before computing on it.</p>

<h3>Profiling First</h3>
<p>The first question for any kernel should be: <em>"Am I memory-bound or compute-bound?"</em> If your kernel does fewer than ~50 FLOPs per byte loaded, it is memory-bound, and no amount of compute optimization will help. You need to reduce memory traffic or use faster memory.</p>

<h3>Design Principle</h3>
<p><em>"Profile before you optimize — most GPU code is memory-limited."</em></p>

<h3>Your Task</h3>
<p>Classify each operation by its arithmetic intensity (FLOPs per byte) and identify which memory space should be used. This is the diagnostic skill that separates effective GPU engineers from people who guess at optimizations.</p>
`,
    starterCode: `// Memory Spaces — Diagnosing the Bottleneck
// Replace each -1 with the correct value.

// ============================================
// Q1: A kernel loads one float32 (4 bytes)
//     and performs one addition.
//     Arithmetic intensity = FLOPs / bytes
// ============================================
const float intensity_1 = -1;  // FLOPs per byte

// ============================================
// Q2: A kernel loads two float32s (8 bytes)
//     and performs 100 fused multiply-adds.
//     (Each FMA = 2 FLOPs)
// ============================================
const float intensity_2 = -1;  // FLOPs per byte

// ============================================
// Q3: At what arithmetic intensity (FLOPs/byte)
//     does a GPU with 20 TFLOPS compute and
//     900 GB/s bandwidth become compute-bound?
//     (Round to nearest integer)
// ============================================
const int crossover_point = -1;

// ============================================
// Q4: kernel_a loads 256 bytes, does 50 FLOPs
//     kernel_b loads 8 bytes, does 200 FLOPs
//     Which is memory-bound? (answer: 'a' or 'b')
//     Which is compute-bound?
// ============================================
const char memory_bound = '?';   // 'a' or 'b'
const char compute_bound = '?';  // 'a' or 'b'

// ============================================
// Q5: Shared memory is ~80x faster than global.
//     If a kernel re-reads the same data 10
//     times from global memory, how much faster
//     would it be with the data in shared memory?
//     (Approximate speedup factor as integer)
// ============================================
const int shared_speedup = -1;

// ============================================
// Q6: Registers are per-thread. Shared memory
//     is per-block. Global memory is per-grid.
//     Which should store a loop accumulator?
//     Which should store data shared across
//     threads in a block? (answer: "register",
//     "shared", or "global")
// ============================================
const char* accumulator = "?";
const char* block_shared_data = "?";
`,
    solutionCode: `// Memory Spaces — Solutions

// Q1: 1 FLOP / 4 bytes = 0.25 FLOPs/byte
// This is extremely memory-bound.
const float intensity_1 = 0.25;

// Q2: 100 FMAs * 2 FLOPs = 200 FLOPs / 8 bytes = 25 FLOPs/byte
// Getting closer to compute-bound, but still memory-bound
// on modern hardware.
const float intensity_2 = 25.0;

// Q3: 20 TFLOPS / 900 GB/s = 20e12 / 900e9 = 22.2
// Rounded: 22 FLOPs/byte
// Below this = memory-bound, above = compute-bound
const int crossover_point = 22;

// Q4: kernel_a: 50/256 = 0.2 FLOPs/byte → memory-bound
//     kernel_b: 200/8 = 25 FLOPs/byte → compute-bound
const char memory_bound = 'a';
const char compute_bound = 'b';

// Q5: With data in shared memory, the 10 re-reads
// go through ~80x faster memory. Effective speedup
// depends on access pattern, but approximately 8x
// (10 reads become effectively 1 slow + 9 fast)
const int shared_speedup = 8;

// Q6: Accumulators are per-thread → register
//     Data shared across block → shared memory
const char* accumulator = "register";
const char* block_shared_data = "shared";
`,
    testCode: '',
    hints: [
      'Arithmetic intensity = total FLOPs / total bytes loaded. For Q1: 1 FLOP, 4 bytes loaded.',
      'FMA (fused multiply-add) counts as 2 FLOPs. 100 FMAs = 200 FLOPs.',
      'The crossover point (sometimes called the "ridge point") = peak compute / peak bandwidth.',
      'If data is read 10 times from global, putting it in shared saves 9 of those reads. 1 slow read + 9 fast reads vs 10 slow reads.',
    ],
    concepts: [
      'arithmetic intensity',
      'memory-bound vs compute-bound',
      'memory hierarchy',
      'roofline model',
      'shared memory',
      'registers',
      'global memory bandwidth',
    ],
    successPatterns: [
      'intensity_1\\s*=\\s*0\\.25',
      'intensity_2\\s*=\\s*25',
      'crossover_point\\s*=\\s*22',
      'memory_bound\\s*=\\s*\'a\'',
      'compute_bound\\s*=\\s*\'b\'',
      'shared_speedup\\s*=\\s*8',
      'accumulator\\s*=\\s*"register"',
      'block_shared_data\\s*=\\s*"shared"',
    ],
    testNames: [
      'intensity of 1 FLOP / 4 bytes = 0.25',
      'intensity of 200 FLOPs / 8 bytes = 25',
      'crossover point is ~22 FLOPs/byte',
      'kernel_a is memory-bound (0.2 FLOPs/byte)',
      'kernel_b is compute-bound (25 FLOPs/byte)',
      'shared memory re-read speedup is ~8x',
      'loop accumulators go in registers',
      'block-shared data goes in shared memory',
    ],
  },

  'cuda-synchronization': {
    id: 'cuda-synchronization',
    language: 'cuda',
    title: 'Synchronization: The Cost of Coordination',
    difficulty: 'beginner',
    order: 4,
    description: `
<h3>The Problem: Race Conditions</h3>
<p>When multiple threads read and write the same memory location, the result depends on <em>which thread gets there first</em>. This is a <strong>race condition</strong>, and on a GPU with thousands of threads, it happens constantly if you are not careful.</p>

<h3>A Concrete Race Condition</h3>
<pre>
// BROKEN: multiple threads writing to shared_sum
__shared__ float shared_sum;
shared_sum = 0;

// Thread 0: reads shared_sum (0), adds its value (5), writes 5
// Thread 1: reads shared_sum (0), adds its value (3), writes 3
// Thread 2: reads shared_sum (0), adds its value (7), writes 7

// Result: shared_sum = 7 (WRONG — should be 15)
// All three threads read 0 before any write landed.
</pre>

<h3>The Fix: __syncthreads() and Atomics</h3>
<pre>
// Fix 1: Barrier synchronization
__shared__ float partial[256];
partial[threadIdx.x] = myValue;
__syncthreads();  // ALL threads in the block reach here before ANY proceed
// Now safe to read partial[any_index]

// Fix 2: Atomic operations
atomicAdd(&shared_sum, myValue);
// Hardware guarantees read-modify-write is indivisible
</pre>

<h3>The Deeper Lesson: Synchronization Is Expensive</h3>
<table>
  <thead><tr><th>Mechanism</th><th>Cost</th><th>Scope</th></tr></thead>
  <tbody>
    <tr><td><code>__syncthreads()</code></td><td>Blocks all threads in the block until all arrive</td><td>Within a block</td></tr>
    <tr><td><code>atomicAdd()</code></td><td>Serializes access to one memory location</td><td>Global or shared</td></tr>
    <tr><td><code>__syncwarp()</code></td><td>Lighter — only synchronizes within a warp</td><td>Within a warp</td></tr>
    <tr><td>No sync needed</td><td>Free — if threads access independent data</td><td>N/A</td></tr>
  </tbody>
</table>

<p>The <strong>best-performing GPU code is designed so that synchronization is rarely needed</strong>. If every thread works on independent data, no coordination is required. The art is structuring algorithms so that dependencies between threads are minimized.</p>

<h3>Design Principle</h3>
<p><em>"The fastest synchronization is the one you don't need."</em></p>

<h3>Your Task</h3>
<p>For each scenario, identify whether synchronization is needed, what kind, and what happens without it. This is about developing the instinct to spot race conditions before they become bugs.</p>
`,
    starterCode: `// Synchronization — Spotting Race Conditions
// Replace each -1 or "?" with the correct answer.

// ============================================
// Scenario 1: Each thread writes to its own
//   index: output[threadIdx.x] = input[threadIdx.x] * 2;
//   Is synchronization needed? (0=no, 1=yes)
// ============================================
const int needs_sync_1 = -1;

// ============================================
// Scenario 2: Thread i reads shared[i] and
//   writes shared[i+1]. All threads in a block.
//   Is synchronization needed?
// ============================================
const int needs_sync_2 = -1;

// ============================================
// Scenario 3: 256 threads each atomicAdd to
//   a single global counter. What is the
//   performance problem? How many serialized
//   operations occur at that address?
// ============================================
const int serialized_ops = -1;

// ============================================
// Scenario 4: Load phase then compute phase:
//   shared[tid] = global[tid];
//   // ??? <-- something needed here?
//   result = shared[tid] + shared[tid + 1];
//   What goes in the blank? (answer: "syncthreads",
//   "atomic", or "nothing")
// ============================================
const char* sync_type = "?";

// ============================================
// Scenario 5: BETTER DESIGN — Instead of 256
//   threads atomicAdd-ing to one location, each
//   thread stores to shared[tid], then a tree
//   reduction combines values. How many
//   __syncthreads() calls does a 256-thread
//   reduction need? (one per halving step)
//   256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1
// ============================================
const int sync_calls_reduction = -1;

// ============================================
// Q6: Once you're within a single warp (32
//     threads), do you need __syncthreads()?
//     (0=no, 1=yes) — think about SIMT
// ============================================
const int need_sync_in_warp = -1;
`,
    solutionCode: `// Synchronization — Solutions

// Scenario 1: No sync needed — each thread accesses
// only its own index. No shared data = no race condition.
const int needs_sync_1 = 0;

// Scenario 2: Yes — thread i writes to shared[i+1]
// while thread i+1 reads from shared[i+1]. Classic
// read-after-write hazard.
const int needs_sync_2 = 1;

// Scenario 3: All 256 atomicAdd operations serialize
// at the same address. The GPU processes them one by one.
const int serialized_ops = 256;

// Scenario 4: __syncthreads() — you need all threads
// to finish writing to shared[] before any thread reads
// shared[tid + 1] (which was written by another thread).
const char* sync_type = "syncthreads";

// Scenario 5: log2(256) = 8 halving steps, but the last
// 5 steps (32 -> 1) are within a warp and can use warp
// shuffle instead. With __syncthreads(): 8 steps if done
// naively, but conventionally we count 8 sync points.
// 256->128->64->32->16->8->4->2->1 = 8 halvings
const int sync_calls_reduction = 8;

// Q6: Within a single warp, threads execute in lockstep
// (SIMT). Warp-synchronous code doesn't need
// __syncthreads() — though modern CUDA recommends
// __syncwarp() for forward compatibility.
const int need_sync_in_warp = 0;
`,
    testCode: '',
    hints: [
      'No synchronization is needed when threads access completely independent memory locations.',
      'When thread i writes to location i+1 while thread i+1 might read the same location, you have a read-after-write hazard.',
      '256 atomicAdd operations to one address = 256 serialized operations. Atomics guarantee correctness but destroy parallelism.',
      'Within a warp, all threads execute in lockstep (SIMT), so no explicit sync is needed for data that has been written by the same instruction.',
    ],
    concepts: [
      'race conditions',
      '__syncthreads',
      'atomic operations',
      'warp-synchronous execution',
      'synchronization cost',
      'algorithm design',
    ],
    successPatterns: [
      'needs_sync_1\\s*=\\s*0',
      'needs_sync_2\\s*=\\s*1',
      'serialized_ops\\s*=\\s*256',
      'sync_type\\s*=\\s*"syncthreads"',
      'sync_calls_reduction\\s*=\\s*8',
      'need_sync_in_warp\\s*=\\s*0',
    ],
    testNames: [
      'independent writes need no synchronization',
      'cross-thread read/write needs synchronization',
      '256 atomics to one address = 256 serialized ops',
      'load-then-read pattern needs __syncthreads()',
      'tree reduction of 256 threads needs 8 sync steps',
      'warp-synchronous execution needs no __syncthreads()',
    ],
  },

  // ─────────────────────────────────────────────
  // Module 2: Memory Hierarchy
  // "Data movement costs more than computation"
  // ─────────────────────────────────────────────

  'cuda-global-memory': {
    id: 'cuda-global-memory',
    language: 'cuda',
    title: 'Coalesced Access: The 10x Performance Cliff',
    difficulty: 'intermediate',
    order: 5,
    description: `
<h3>The Same Algorithm, 10x Different Speed</h3>
<p>Global memory on a GPU is accessed in <strong>128-byte transactions</strong>. When a warp of 32 threads accesses memory, the hardware groups their requests into the fewest possible transactions. This grouping is called <strong>coalescing</strong>.</p>

<h3>Coalesced vs. Uncoalesced — The Visual</h3>
<pre>
COALESCED: Warp threads access consecutive addresses
Thread:   0    1    2    3    4   ...  31
Address:  [0]  [1]  [2]  [3]  [4] ... [31]
→ ONE 128-byte transaction. Perfect.

STRIDED: Warp threads access every Nth element
Thread:   0    1    2    3    4   ...  31
Address:  [0]  [N]  [2N] [3N] [4N]... [31N]
→ UP TO 32 separate transactions. Terrible.

RANDOM: Warp threads access scattered addresses
Thread:   0     1     2     3    ...  31
Address:  [17]  [502] [8]   [941]... [73]
→ UP TO 32 separate transactions. Worst case.
</pre>

<h3>The Classic Example: Matrix Transpose</h3>
<pre>
// Matrix stored in ROW-MAJOR order:
// A[i][j] is at address: i * width + j

// NAIVE TRANSPOSE: reads are coalesced, writes are strided
// Thread (tx,ty) reads  A[ty][tx] → consecutive in tx ✓
// Thread (tx,ty) writes B[tx][ty] → stride of 'width' in tx ✗

// 10x slower than it needs to be, purely from access pattern
</pre>

<p>The fix is not a different algorithm — it is the same algorithm with data laid out differently, or with shared memory used as a reordering buffer.</p>

<h3>The Row-Major / Column-Major Trap</h3>
<p>In C/CUDA, 2D arrays are row-major. If your kernel iterates over columns (each thread handles one column), consecutive threads access addresses separated by <code>width</code> — a stride-N pattern. The fix: transpose your iteration order so consecutive threads access consecutive addresses.</p>

<h3>Design Principle</h3>
<p><em>"Structure your data for the hardware, not for human readability."</em></p>

<h3>Your Task</h3>
<p>Implement a coalescing-aware matrix transpose. The naive version reads rows (coalesced) but writes columns (uncoalesced). Your version must use shared memory as a staging area to make <strong>both</strong> reads and writes coalesced.</p>
`,
    starterCode: `// Matrix Transpose: Coalesced vs. Uncoalesced Access
// Fix the naive transpose so both reads AND writes are coalesced.
// Matrix is TILE_DIM x TILE_DIM, one block handles one tile.

#define TILE_DIM 32

// NAIVE VERSION (for reference — reads coalesced, writes NOT):
// __global__ void transposeNaive(float *out, float *in, int width) {
//     int x = blockIdx.x * TILE_DIM + threadIdx.x;
//     int y = blockIdx.y * TILE_DIM + threadIdx.y;
//     out[x * width + y] = in[y * width + x];  // write is strided!
// }

// YOUR TASK: Complete the shared-memory version.
// Strategy:
//   1. Load a tile from 'in' into shared memory (coalesced read)
//   2. __syncthreads()
//   3. Write from shared memory to 'out' (coalesced write)
//   The trick: read shared memory with transposed indices.

__global__ void transposeCoalesced(float *out, float *in, int width) {
    __shared__ float tile[TILE_DIM][TILE_DIM];

    int xIn = blockIdx.x * TILE_DIM + threadIdx.x;
    int yIn = blockIdx.y * TILE_DIM + threadIdx.y;

    // Step 1: Load from global into shared (coalesced read)
    // TODO: tile[threadIdx.y][threadIdx.x] = in[???];

    __syncthreads();

    // Step 2: Write from shared to global (coalesced write)
    // Compute output coordinates — note the block indices are swapped
    int xOut = blockIdx.y * TILE_DIM + threadIdx.x;
    int yOut = blockIdx.x * TILE_DIM + threadIdx.y;

    // TODO: out[???] = tile[???][???];
    // Read shared with transposed indices so the write is coalesced
}
`,
    solutionCode: `// Matrix Transpose: Coalesced with Shared Memory
#define TILE_DIM 32

__global__ void transposeCoalesced(float *out, float *in, int width) {
    __shared__ float tile[TILE_DIM][TILE_DIM];

    int xIn = blockIdx.x * TILE_DIM + threadIdx.x;
    int yIn = blockIdx.y * TILE_DIM + threadIdx.y;

    // Step 1: Coalesced read from global into shared memory
    // Consecutive threads (threadIdx.x) read consecutive addresses
    tile[threadIdx.y][threadIdx.x] = in[yIn * width + xIn];

    __syncthreads();

    // Step 2: Coalesced write from shared to global
    // Swap block indices so we write to transposed location
    int xOut = blockIdx.y * TILE_DIM + threadIdx.x;
    int yOut = blockIdx.x * TILE_DIM + threadIdx.y;

    // Read shared memory with transposed indices (threadIdx.x reads
    // along the column of tile, which was the row of the input)
    // Consecutive threads (threadIdx.x) write consecutive addresses
    out[yOut * width + xOut] = tile[threadIdx.x][threadIdx.y];
}

// WHY THIS WORKS:
// Reading in:  threads vary in threadIdx.x → consecutive addresses  ✓
// Writing out: threads vary in threadIdx.x → consecutive addresses  ✓
// The shared memory acts as a reordering buffer between the
// row-major read and the transposed row-major write.
//
// Performance: ~10x faster than naive on large matrices.
// The algorithm is identical — only the memory access pattern changed.
`,
    testCode: '',
    hints: [
      'The coalesced read: <code>tile[threadIdx.y][threadIdx.x] = in[yIn * width + xIn]</code>. Consecutive threadIdx.x values give consecutive addresses.',
      'For the write, you must swap the block indices: <code>xOut = blockIdx.y * TILE_DIM + threadIdx.x</code>.',
      'The transposed read from shared: <code>tile[threadIdx.x][threadIdx.y]</code> — note x and y are swapped compared to the write.',
      'The key insight: shared memory has no coalescing requirement. You can read it in any order. Use it to reorder between a coalesced read and a coalesced write.',
    ],
    concepts: [
      'memory coalescing',
      'global memory transactions',
      'matrix transpose',
      'shared memory as staging',
      'access patterns',
      'stride-N penalty',
    ],
    successPatterns: [
      'tile\\[threadIdx\\.y\\]\\[threadIdx\\.x\\]\\s*=\\s*in\\[',
      'in\\[yIn\\s*\\*\\s*width\\s*\\+\\s*xIn\\]',
      'out\\[yOut\\s*\\*\\s*width\\s*\\+\\s*xOut\\]\\s*=\\s*tile\\[threadIdx\\.x\\]\\[threadIdx\\.y\\]',
      '__syncthreads',
    ],
    testNames: [
      'loads tile with coalesced read pattern (tile[y][x] = in[...])',
      'reads input with row-major index (yIn * width + xIn)',
      'writes output with transposed coalesced pattern',
      'uses __syncthreads between load and store',
    ],
  },

  'cuda-shared-memory': {
    id: 'cuda-shared-memory',
    language: 'cuda',
    title: 'Shared Memory Tiling: From Bandwidth-Limited to Compute-Limited',
    difficulty: 'intermediate',
    order: 6,
    description: `
<h3>The Fundamental Optimization: Tiling</h3>
<p>Consider multiplying two 1024x1024 matrices. Each output element requires a dot product of 1024 pairs. A naive implementation loads these values from global memory every time — the same data gets loaded by hundreds of threads.</p>

<h3>The Naive Approach: Drowning in Memory Traffic</h3>
<pre>
// Each thread computes one element of C
float sum = 0;
for (int k = 0; k < width; k++) {
    sum += A[row][k] * B[k][col];  // TWO global loads per iteration
}
C[row][col] = sum;

// Thread (0,0) loads A[0][0], A[0][1], ... A[0][1023]
// Thread (0,1) loads A[0][0], A[0][1], ... A[0][1023]  ← SAME DATA!
// 1024 threads in a row all load the same A values.
// Total redundant loads: enormous.
</pre>

<h3>The Fix: Tiling with Shared Memory</h3>
<pre>
The assembly-line analogy:
┌─────────┐    ┌─────────┐    ┌─────────┐
│ LOAD    │ →  │ COMPUTE │ →  │ STORE   │
│ tile    │    │ on tile │    │ partial │
│ from    │    │ in fast │    │ result  │
│ global  │    │ shared  │    │         │
└─────────┘    └─────────┘    └─────────┘
     ↑              ↑
     slow           fast
     (~400 cycles)  (~5 cycles)
</pre>

<p>Instead of loading one element at a time from global memory, we load an entire <strong>tile</strong> (say 32x32) into shared memory. Then all threads in the block compute using the fast shared copy. We repeat for each tile.</p>

<h3>The Data Reuse Ratio</h3>
<pre>
Without tiling: each thread loads 2*N values from global memory
With TILE_SIZE tiling: each thread loads 2*(N/TILE_SIZE) from global
Data reuse ratio: TILE_SIZE (each global load serves TILE_SIZE threads)

TILE_SIZE=32 → 32x reduction in global memory traffic
This alone can turn a bandwidth-limited kernel into a compute-limited one.
</pre>

<h3>Design Principle</h3>
<p><em>"Caching is the fundamental optimization."</em> This is the same insight behind CPU L1/L2 caches, but on the GPU you manage it explicitly. The pattern — load a tile, synchronize, compute, synchronize, repeat — is the most important pattern in GPU programming.</p>

<h3>Your Task</h3>
<p>Implement the tiled matrix multiply. Fill in the shared memory loading and the accumulation loop. This is the most important exercise in this course.</p>
`,
    starterCode: `// Tiled Matrix Multiply with Shared Memory
// C[M][N] = A[M][K] * B[K][N]
// Each block computes a TILE_SIZE x TILE_SIZE sub-matrix of C.

#define TILE_SIZE 32

__global__ void matmulTiled(float *C, float *A, float *B,
                            int M, int N, int K) {
    __shared__ float tileA[TILE_SIZE][TILE_SIZE];
    __shared__ float tileB[TILE_SIZE][TILE_SIZE];

    int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    int col = blockIdx.x * TILE_SIZE + threadIdx.x;

    float sum = 0.0f;

    // Loop over tiles along the K dimension
    for (int t = 0; t < (K + TILE_SIZE - 1) / TILE_SIZE; t++) {

        // TODO: Load one element of A into tileA
        // Each thread loads tileA[threadIdx.y][threadIdx.x]
        // from A[row][t * TILE_SIZE + threadIdx.x]
        // (add bounds checking: if out of range, load 0.0f)


        // TODO: Load one element of B into tileB
        // Each thread loads tileB[threadIdx.y][threadIdx.x]
        // from B[t * TILE_SIZE + threadIdx.y][col]
        // (add bounds checking: if out of range, load 0.0f)


        // TODO: Synchronize — all threads must finish loading
        // before any thread starts computing


        // TODO: Accumulate the dot product for this tile
        // for (int i = 0; i < TILE_SIZE; i++)
        //     sum += tileA[threadIdx.y][i] * tileB[i][threadIdx.x];


        // TODO: Synchronize again — all threads must finish
        // computing before the next tile overwrites shared memory

    }

    // Write result (with bounds check)
    if (row < M && col < N) {
        C[row * N + col] = sum;
    }
}
`,
    solutionCode: `// Tiled Matrix Multiply — The Canonical GPU Algorithm
#define TILE_SIZE 32

__global__ void matmulTiled(float *C, float *A, float *B,
                            int M, int N, int K) {
    __shared__ float tileA[TILE_SIZE][TILE_SIZE];
    __shared__ float tileB[TILE_SIZE][TILE_SIZE];

    int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    int col = blockIdx.x * TILE_SIZE + threadIdx.x;

    float sum = 0.0f;

    for (int t = 0; t < (K + TILE_SIZE - 1) / TILE_SIZE; t++) {

        // Load tile of A: coalesced read (consecutive threadIdx.x)
        int aCol = t * TILE_SIZE + threadIdx.x;
        if (row < M && aCol < K)
            tileA[threadIdx.y][threadIdx.x] = A[row * K + aCol];
        else
            tileA[threadIdx.y][threadIdx.x] = 0.0f;

        // Load tile of B: coalesced read (consecutive threadIdx.x)
        int bRow = t * TILE_SIZE + threadIdx.y;
        if (bRow < K && col < N)
            tileB[threadIdx.y][threadIdx.x] = B[bRow * N + col];
        else
            tileB[threadIdx.y][threadIdx.x] = 0.0f;

        __syncthreads();  // Wait for all loads to complete

        // Accumulate: all data is now in fast shared memory
        for (int i = 0; i < TILE_SIZE; i++) {
            sum += tileA[threadIdx.y][i] * tileB[i][threadIdx.x];
        }

        __syncthreads();  // Wait before overwriting shared memory
    }

    if (row < M && col < N) {
        C[row * N + col] = sum;
    }
}

// KEY INSIGHT:
// Without tiling: 2*K global loads per output element
// With tiling:    2*K/TILE_SIZE global loads per element
// TILE_SIZE=32 → 32x less global memory traffic
// This transforms a bandwidth-limited kernel into a compute-limited one.
`,
    testCode: '',
    hints: [
      'Loading tileA: <code>tileA[threadIdx.y][threadIdx.x] = A[row * K + (t * TILE_SIZE + threadIdx.x)]</code>. Add bounds check with 0.0f for out-of-range.',
      'Loading tileB: <code>tileB[threadIdx.y][threadIdx.x] = B[(t * TILE_SIZE + threadIdx.y) * N + col]</code>. Same bounds check pattern.',
      'You need TWO __syncthreads() calls per tile: one after loading (before compute) and one after computing (before next load).',
      'The inner loop accumulates: <code>sum += tileA[threadIdx.y][i] * tileB[i][threadIdx.x]</code> for i in 0..TILE_SIZE.',
    ],
    concepts: [
      'tiled matrix multiply',
      'shared memory tiling',
      'data reuse',
      'bandwidth to compute transition',
      '__syncthreads pattern',
      'coalesced loading',
    ],
    successPatterns: [
      'tileA\\[threadIdx\\.y\\]\\[threadIdx\\.x\\]\\s*=\\s*A\\[',
      'tileB\\[threadIdx\\.y\\]\\[threadIdx\\.x\\]\\s*=\\s*B\\[',
      '__syncthreads\\(\\)',
      'tileA\\[threadIdx\\.y\\]\\[i\\]\\s*\\*\\s*tileB\\[i\\]\\[threadIdx\\.x\\]',
    ],
    testNames: [
      'loads tileA from global memory with bounds check',
      'loads tileB from global memory with bounds check',
      'uses __syncthreads() for load/compute synchronization',
      'accumulates dot product from shared memory tiles',
    ],
  },

  'cuda-tiling': {
    id: 'cuda-tiling',
    language: 'cuda',
    title: 'The Assembly Line: Overlapping Load, Compute, Store',
    difficulty: 'intermediate',
    order: 7,
    description: `
<h3>Beyond Basic Tiling: The Pipeline</h3>
<p>In the previous exercise, each tile iteration does: load → sync → compute → sync. The GPU is idle during loads (waiting for global memory) and idle during compute (not issuing loads). The next optimization is to <strong>overlap these phases</strong>.</p>

<h3>The Batch Process vs. The Assembly Line</h3>
<pre>
BATCH PROCESS (basic tiling):
Time: |--load--||--compute--||--load--||--compute--|
       tile 0    tile 0       tile 1    tile 1
GPU utilization: ~50% (idle during loads)

ASSEMBLY LINE (double buffering):
Time: |--load--||--compute--| |--compute--|
       tile 0  ||--load-----|  |--load-----|
                 tile 1        tile 2
GPU utilization: ~100% (load and compute overlap)
</pre>

<h3>Double Buffering: Two Tiles in Flight</h3>
<pre>
__shared__ float tileA[2][TILE_SIZE][TILE_SIZE]; // TWO buffers
__shared__ float tileB[2][TILE_SIZE][TILE_SIZE];

// Pre-load tile 0 into buffer 0
loadTile(tileA[0], tileB[0], t=0);
__syncthreads();

for (int t = 0; t < numTiles - 1; t++) {
    int curr = t % 2;      // buffer we compute from
    int next = (t+1) % 2;  // buffer we load into

    // OVERLAP: compute on curr while loading next
    loadTile(tileA[next], tileB[next], t+1);  // async load
    computeTile(tileA[curr], tileB[curr]);     // compute
    __syncthreads();
}
// Process final tile
computeTile(tileA[(numTiles-1)%2], tileB[(numTiles-1)%2]);
</pre>

<h3>Why This Matters</h3>
<p>The GPU has separate units for memory access and computation. Double buffering lets both units stay busy simultaneously. This is the same principle as CPU prefetching, but on the GPU you manage it explicitly.</p>

<h3>Design Principle</h3>
<p><em>"The best GPU code is an assembly line, not a batch process."</em> Every stage should be working at all times. When the compute units are crunching tile N, the memory units should be loading tile N+1.</p>

<h3>Your Task</h3>
<p>Convert the basic tiled matrix multiply into a double-buffered version. The structure is provided — fill in the loading and computing steps, keeping track of which buffer is current and which is next.</p>
`,
    starterCode: `// Double-Buffered Tiled Matrix Multiply
// Overlap loading tile N+1 while computing on tile N.
#define TILE_SIZE 32

__global__ void matmulPipelined(float *C, float *A, float *B,
                                int M, int N, int K) {
    // Double buffers for A and B tiles
    __shared__ float tileA[2][TILE_SIZE][TILE_SIZE];
    __shared__ float tileB[2][TILE_SIZE][TILE_SIZE];

    int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    int col = blockIdx.x * TILE_SIZE + threadIdx.x;
    int numTiles = (K + TILE_SIZE - 1) / TILE_SIZE;

    float sum = 0.0f;

    // ============================================
    // TODO: Pre-load first tile (t=0) into buffer 0
    // Load tileA[0][threadIdx.y][threadIdx.x] from A
    // Load tileB[0][threadIdx.y][threadIdx.x] from B
    // (with bounds checking, load 0.0f if out of range)
    // ============================================


    __syncthreads();

    // Main loop: compute on current buffer, load into next
    for (int t = 0; t < numTiles - 1; t++) {
        int curr = t % 2;
        int next = (t + 1) % 2;

        // ============================================
        // TODO: Load next tile (t+1) into buffer 'next'
        // ============================================


        // ============================================
        // TODO: Compute dot product from buffer 'curr'
        // for (int i = 0; i < TILE_SIZE; i++)
        //     sum += tileA[curr][...][i] * tileB[curr][i][...];
        // ============================================


        __syncthreads();
    }

    // ============================================
    // TODO: Compute the final tile
    // (last buffer index: (numTiles-1) % 2)
    // ============================================


    if (row < M && col < N) {
        C[row * N + col] = sum;
    }
}
`,
    solutionCode: `// Double-Buffered Tiled Matrix Multiply — Solution
#define TILE_SIZE 32

__global__ void matmulPipelined(float *C, float *A, float *B,
                                int M, int N, int K) {
    __shared__ float tileA[2][TILE_SIZE][TILE_SIZE];
    __shared__ float tileB[2][TILE_SIZE][TILE_SIZE];

    int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    int col = blockIdx.x * TILE_SIZE + threadIdx.x;
    int numTiles = (K + TILE_SIZE - 1) / TILE_SIZE;

    float sum = 0.0f;

    // Pre-load first tile into buffer 0
    int aCol0 = 0 * TILE_SIZE + threadIdx.x;
    int bRow0 = 0 * TILE_SIZE + threadIdx.y;
    tileA[0][threadIdx.y][threadIdx.x] =
        (row < M && aCol0 < K) ? A[row * K + aCol0] : 0.0f;
    tileB[0][threadIdx.y][threadIdx.x] =
        (bRow0 < K && col < N) ? B[bRow0 * N + col] : 0.0f;

    __syncthreads();

    for (int t = 0; t < numTiles - 1; t++) {
        int curr = t % 2;
        int next = (t + 1) % 2;

        // Load next tile into alternate buffer
        int aColNext = (t + 1) * TILE_SIZE + threadIdx.x;
        int bRowNext = (t + 1) * TILE_SIZE + threadIdx.y;
        tileA[next][threadIdx.y][threadIdx.x] =
            (row < M && aColNext < K) ? A[row * K + aColNext] : 0.0f;
        tileB[next][threadIdx.y][threadIdx.x] =
            (bRowNext < K && col < N) ? B[bRowNext * N + col] : 0.0f;

        // Compute on current buffer (overlaps with load)
        for (int i = 0; i < TILE_SIZE; i++) {
            sum += tileA[curr][threadIdx.y][i] * tileB[curr][i][threadIdx.x];
        }

        __syncthreads();
    }

    // Compute final tile
    int last = (numTiles - 1) % 2;
    for (int i = 0; i < TILE_SIZE; i++) {
        sum += tileA[last][threadIdx.y][i] * tileB[last][i][threadIdx.x];
    }

    if (row < M && col < N) {
        C[row * N + col] = sum;
    }
}

// THE PIPELINE:
// Iteration 0: compute buffer 0, load buffer 1
// Iteration 1: compute buffer 1, load buffer 0
// Iteration 2: compute buffer 0, load buffer 1 ...
// Final:       compute last buffer
//
// Memory and compute units stay busy simultaneously.
// ~1.5-2x speedup over single-buffered tiling on large matrices.
`,
    testCode: '',
    hints: [
      'Pre-loading: same as regular tiling but store into tileA[0] and tileB[0] with the extra dimension.',
      'In the loop, load into buffer <code>next = (t+1) % 2</code> while computing from buffer <code>curr = t % 2</code>.',
      'The final tile uses buffer index <code>(numTiles-1) % 2</code>. Don\'t forget to compute it after the loop.',
      'Double buffering uses 2x shared memory. This reduces occupancy — it is a tradeoff, not a free optimization.',
    ],
    concepts: [
      'double buffering',
      'software pipelining',
      'memory-compute overlap',
      'latency hiding',
      'shared memory management',
      'assembly-line execution',
    ],
    successPatterns: [
      'tileA\\[0\\]\\[threadIdx\\.y\\]\\[threadIdx\\.x\\]',
      'tileA\\[next\\]\\[threadIdx\\.y\\]\\[threadIdx\\.x\\]',
      'tileA\\[curr\\]\\[threadIdx\\.y\\]\\[i\\]\\s*\\*\\s*tileB\\[curr\\]\\[i\\]\\[threadIdx\\.x\\]',
      'tileA\\[last\\]\\[threadIdx\\.y\\]\\[i\\]',
    ],
    testNames: [
      'pre-loads first tile into buffer 0',
      'loads next tile into alternate buffer in loop',
      'computes dot product from current buffer',
      'computes final tile after loop',
    ],
  },

  'cuda-occupancy': {
    id: 'cuda-occupancy',
    language: 'cuda',
    title: 'Occupancy: The Resource Balancing Game',
    difficulty: 'intermediate',
    order: 8,
    description: `
<h3>The Tradeoff That Defines GPU Optimization</h3>
<p>Occupancy is the ratio of active warps to the maximum warps an SM can support. Higher occupancy means more warps available to hide latency. But higher occupancy also means <strong>fewer resources per thread</strong>.</p>

<h3>The Three Resources That Limit Occupancy</h3>
<table>
  <thead><tr><th>Resource</th><th>Per SM (typical)</th><th>Consumed By</th><th>Effect of Increase</th></tr></thead>
  <tbody>
    <tr><td><strong>Registers</strong></td><td>65536</td><td>Each thread</td><td>More regs/thread → fewer concurrent threads</td></tr>
    <tr><td><strong>Shared Memory</strong></td><td>100 KB</td><td>Each block</td><td>More shmem/block → fewer concurrent blocks</td></tr>
    <tr><td><strong>Thread Slots</strong></td><td>2048</td><td>Each thread</td><td>Hard limit: max 2048 threads per SM</td></tr>
  </tbody>
</table>

<h3>The Calculation</h3>
<pre>
Given: 48 registers/thread, blockSize=256, 8KB shared mem/block

Registers: 65536 / (48 * 256) = 5.3 → 5 blocks fit
Shared mem: 102400 / 8192 = 12.5 → 12 blocks fit
Thread slots: 2048 / 256 = 8 blocks fit

Limiting factor: registers → 5 blocks
Active warps: 5 * 256/32 = 40 warps
Max warps: 2048 / 32 = 64
Occupancy: 40 / 64 = 62.5%
</pre>

<h3>Why 100% Occupancy Isn't Always Better</h3>
<p>More occupancy means fewer registers per thread. Fewer registers means more <strong>register spilling</strong> — the compiler stores variables in slow local memory instead of fast registers. A kernel at 50% occupancy with all data in registers can be faster than one at 100% occupancy with register spills.</p>

<h3>The Decision Framework</h3>
<pre>
Memory-bound kernel → Maximize occupancy (more warps = better latency hiding)
Compute-bound kernel → Maximize registers (more regs = fewer spills)
Latency-bound kernel → Maximize occupancy (more warps = overlap latency)
</pre>

<h3>Design Principle</h3>
<p><em>"GPU optimization is a game of resource balancing — there is no single 'fast' configuration."</em></p>

<h3>Your Task</h3>
<p>Calculate occupancy for different configurations and identify the limiting resource. This is the analysis every GPU engineer does before deciding on launch parameters.</p>
`,
    starterCode: `// Occupancy Calculation — Resource Balancing
// SM specs: 65536 registers, 100KB shared mem, 2048 max threads
// Replace each -1 with the correct answer.

// ============================================
// Config A: 32 regs/thread, blockSize=256, 0 shared mem
// ============================================
// How many blocks fit (register-limited)?
const int blocksA_reg = -1;  // 65536 / (32 * 256)
// How many blocks fit (thread-limited)?
const int blocksA_thr = -1;  // 2048 / 256
// Actual blocks per SM (minimum of limits)?
const int blocksA = -1;
// Active warps?
const int warpsA = -1;  // blocksA * (256/32)
// Occupancy percentage?
const int occupancyA = -1;  // warps / 64 * 100

// ============================================
// Config B: 64 regs/thread, blockSize=256, 0 shared mem
// ============================================
const int blocksB_reg = -1;  // 65536 / (64 * 256)
const int blocksB = -1;      // min of all limits
const int warpsB = -1;
const int occupancyB = -1;

// ============================================
// Config C: 32 regs/thread, blockSize=256, 48KB shared/block
// ============================================
const int blocksC_shmem = -1; // 102400 / 49152
const int blocksC = -1;       // min of register, shmem, thread limits
const int occupancyC = -1;

// ============================================
// Q: Which config has highest occupancy?
//    Which has the most registers available?
//    (answer: 'A', 'B', or 'C')
// ============================================
const char highest_occ = '?';
const char most_regs = '?';
`,
    solutionCode: `// Occupancy Calculation — Solutions

// Config A: 32 regs/thread, blockSize=256, no shared mem
const int blocksA_reg = 8;   // 65536 / (32*256) = 8
const int blocksA_thr = 8;   // 2048 / 256 = 8
const int blocksA = 8;       // min(8, 8) = 8
const int warpsA = 64;       // 8 * 8 = 64
const int occupancyA = 100;  // 64/64 = 100%

// Config B: 64 regs/thread, blockSize=256, no shared mem
const int blocksB_reg = 4;   // 65536 / (64*256) = 4
const int blocksB = 4;       // min(4, 8) = 4 (register-limited)
const int warpsB = 32;       // 4 * 8 = 32
const int occupancyB = 50;   // 32/64 = 50%

// Config C: 32 regs/thread, blockSize=256, 48KB shared/block
const int blocksC_shmem = 2; // 102400 / 49152 = 2.08 → 2
const int blocksC = 2;       // min(8, 2, 8) = 2 (shared-mem-limited)
const int occupancyC = 25;   // 2*8=16 warps, 16/64 = 25%

// Config A has highest occupancy (100%)
// Config B has most registers per thread (64 regs)
const char highest_occ = 'A';
const char most_regs = 'B';

// THE TRADEOFF:
// Config A: 100% occupancy, but only 32 regs — may spill
// Config B: 50% occupancy, but 64 regs — complex kernels run faster
// Config C: 25% occupancy — shared memory dominated, but
//           each block has a large working set to exploit
//
// The right choice depends on whether the kernel is
// memory-bound, compute-bound, or latency-bound.
`,
    testCode: '',
    hints: [
      'Register-limited blocks: floor(total_regs / (regs_per_thread * threads_per_block)).',
      'Thread-limited blocks: floor(max_threads / threads_per_block).',
      'Shared-memory-limited blocks: floor(total_shmem / shmem_per_block). 100KB = 102400 bytes.',
      'Occupancy = active_warps / max_warps * 100. Max warps per SM = 2048/32 = 64.',
    ],
    concepts: [
      'occupancy',
      'register pressure',
      'shared memory budget',
      'resource balancing',
      'latency hiding',
      'register spilling',
    ],
    successPatterns: [
      'blocksA_reg\\s*=\\s*8',
      'occupancyA\\s*=\\s*100',
      'blocksB_reg\\s*=\\s*4',
      'occupancyB\\s*=\\s*50',
      'blocksC_shmem\\s*=\\s*2',
      'occupancyC\\s*=\\s*25',
      'highest_occ\\s*=\\s*\'A\'',
      'most_regs\\s*=\\s*\'B\'',
    ],
    testNames: [
      'Config A: 8 blocks fit by register count',
      'Config A: 100% occupancy (all warps active)',
      'Config B: 4 blocks (register-limited at 64 regs/thread)',
      'Config B: 50% occupancy',
      'Config C: 2 blocks (shared-memory-limited at 48KB/block)',
      'Config C: 25% occupancy',
      'Config A has highest occupancy',
      'Config B has most registers per thread',
    ],
  },

  // ─────────────────────────────────────────────
  // Module 3: Advanced Patterns
  // "Algorithms that think in parallel"
  // ─────────────────────────────────────────────

  'cuda-warp-primitives': {
    id: 'cuda-warp-primitives',
    language: 'cuda',
    title: 'Warp-Level Communication: Below Shared Memory',
    difficulty: 'advanced',
    order: 9,
    description: `
<h3>The Third Level of the Memory Hierarchy</h3>
<p>You know registers (per-thread) and shared memory (per-block). There is a level in between: <strong>warp-level communication</strong>. Threads within a warp can directly exchange register values without going through shared memory at all.</p>

<h3>Why This Matters</h3>
<pre>
Shared memory reduction (32 values → 1):
  Store to shared[tid]     → ~5 cycles
  __syncthreads()          → barrier overhead
  Read from shared[other]  → ~5 cycles
  Repeat 5 times           → ~50+ cycles total

Warp shuffle reduction (32 values → 1):
  __shfl_down_sync(val, 16) → ~1 cycle
  __shfl_down_sync(val, 8)  → ~1 cycle
  __shfl_down_sync(val, 4)  → ~1 cycle
  __shfl_down_sync(val, 2)  → ~1 cycle
  __shfl_down_sync(val, 1)  → ~1 cycle
  Total: ~5 cycles          → 10x faster!
</pre>

<h3>The Three Key Primitives</h3>
<table>
  <thead><tr><th>Primitive</th><th>What It Does</th><th>Use Case</th></tr></thead>
  <tbody>
    <tr><td><code>__shfl_sync(mask, val, src)</code></td><td>Read <code>val</code> from lane <code>src</code></td><td>Broadcast, gather</td></tr>
    <tr><td><code>__shfl_down_sync(mask, val, d)</code></td><td>Read <code>val</code> from lane <code>tid + d</code></td><td>Reduction (sum/max/min)</td></tr>
    <tr><td><code>__ballot_sync(mask, pred)</code></td><td>Collect one bit per lane → 32-bit int</td><td>Counting, compaction</td></tr>
  </tbody>
</table>

<h3>Warp Reduction: The Pattern</h3>
<pre>
float val = myValue;
// Tree reduction across 32 lanes
val += __shfl_down_sync(0xFFFFFFFF, val, 16);  // lanes 0-15 get sum with 16-31
val += __shfl_down_sync(0xFFFFFFFF, val, 8);   // lanes 0-7 get partial sum
val += __shfl_down_sync(0xFFFFFFFF, val, 4);
val += __shfl_down_sync(0xFFFFFFFF, val, 2);
val += __shfl_down_sync(0xFFFFFFFF, val, 1);
// Lane 0 now holds the sum of all 32 values
</pre>

<h3>Design Principle</h3>
<p><em>"The right level of abstraction depends on the problem size."</em> For 32 or fewer values, warp shuffles beat shared memory. For larger reductions, use warp shuffles within each warp, then shared memory across warps. Match the primitive to the scale.</p>

<h3>Your Task</h3>
<p>Implement a warp-level reduction and a __ballot_sync counting operation. Then combine them for a block-level reduction that uses warp shuffles within each warp and shared memory only to combine warp results.</p>
`,
    starterCode: `// Warp Primitives — Below Shared Memory
// All lanes active: mask = 0xFFFFFFFF

// ============================================
// Part 1: Warp Reduction
// Each of the 32 lanes has a value.
// Use __shfl_down_sync to sum them all.
// ============================================
__device__ float warpReduce(float val) {
    // TODO: 5 steps of __shfl_down_sync
    // Step 1: val += __shfl_down_sync(0xFFFFFFFF, val, 16);
    // Step 2: val += __shfl_down_sync(0xFFFFFFFF, val, 8);
    // Steps 3-5: offsets 4, 2, 1


    return val;  // lane 0 holds the total sum
}

// ============================================
// Part 2: Ballot — count how many threads
// in a warp satisfy a predicate
// ============================================
__device__ int warpCount(bool predicate) {
    // TODO: Use __ballot_sync to collect predicates
    // unsigned mask = __ballot_sync(0xFFFFFFFF, predicate);
    // Then use __popc(mask) to count set bits


    return -1;
}

// ============================================
// Part 3: Block-level reduction using warp
// primitives + shared memory
// blockDim.x = 256 (8 warps)
// ============================================
__global__ void blockReduce(float *input, float *output, int n) {
    __shared__ float warpSums[8];  // one per warp

    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    float val = (tid < n) ? input[tid] : 0.0f;

    // Step 1: Reduce within each warp
    // TODO: val = warpReduce(val);

    // Step 2: First lane of each warp stores to shared
    int warpId = threadIdx.x / 32;
    int laneId = threadIdx.x % 32;
    // TODO: if (laneId == 0) warpSums[warpId] = val;

    // TODO: __syncthreads();

    // Step 3: First warp reduces the warp sums
    // TODO: if (warpId == 0) {
    //     val = (laneId < 8) ? warpSums[laneId] : 0.0f;
    //     val = warpReduce(val);
    //     if (laneId == 0) output[blockIdx.x] = val;
    // }
}
`,
    solutionCode: `// Warp Primitives — Solutions

__device__ float warpReduce(float val) {
    val += __shfl_down_sync(0xFFFFFFFF, val, 16);
    val += __shfl_down_sync(0xFFFFFFFF, val, 8);
    val += __shfl_down_sync(0xFFFFFFFF, val, 4);
    val += __shfl_down_sync(0xFFFFFFFF, val, 2);
    val += __shfl_down_sync(0xFFFFFFFF, val, 1);
    return val;  // lane 0 has the sum
}

__device__ int warpCount(bool predicate) {
    unsigned mask = __ballot_sync(0xFFFFFFFF, predicate);
    return __popc(mask);
}

__global__ void blockReduce(float *input, float *output, int n) {
    __shared__ float warpSums[8];

    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    float val = (tid < n) ? input[tid] : 0.0f;

    // Step 1: Warp-level reduction (no shared memory needed)
    val = warpReduce(val);

    int warpId = threadIdx.x / 32;
    int laneId = threadIdx.x % 32;

    // Step 2: Lane 0 of each warp stores result
    if (laneId == 0) warpSums[warpId] = val;

    __syncthreads();  // Only sync needed: between warps

    // Step 3: First warp reduces the 8 warp sums
    if (warpId == 0) {
        val = (laneId < 8) ? warpSums[laneId] : 0.0f;
        val = warpReduce(val);
        if (laneId == 0) output[blockIdx.x] = val;
    }
}

// COMPARISON:
// Pure shared memory reduction: ~10 __syncthreads() calls
// Warp shuffle + shared hybrid:  1 __syncthreads() call
//
// The warp shuffle handles intra-warp communication for free.
// Shared memory is only needed to bridge between warps.
// This is why understanding the hardware hierarchy matters.
`,
    testCode: '',
    hints: [
      'The warp reduction is 5 steps with decreasing offsets: 16, 8, 4, 2, 1. Each step adds the value from a lane that is <code>offset</code> positions away.',
      '__ballot_sync returns a 32-bit mask where bit i is set if lane i\'s predicate is true. __popc counts set bits.',
      'For the block reduction, only ONE __syncthreads() is needed — between the warp-level reduction and the cross-warp reduction.',
      'The first warp reads from warpSums[laneId] (only 8 valid values since 256/32 = 8 warps). Extra lanes load 0.',
    ],
    concepts: [
      '__shfl_down_sync',
      '__ballot_sync',
      '__popc',
      'warp reduction',
      'hybrid reduction',
      'warp-level communication',
    ],
    successPatterns: [
      '__shfl_down_sync\\(0xFFFFFFFF,\\s*val,\\s*16\\)',
      '__shfl_down_sync\\(0xFFFFFFFF,\\s*val,\\s*1\\)',
      '__ballot_sync\\(0xFFFFFFFF,\\s*predicate\\)',
      '__popc\\(mask\\)',
      'warpSums\\[warpId\\]\\s*=\\s*val',
      'warpReduce\\(val\\)',
    ],
    testNames: [
      'warp reduction uses __shfl_down_sync with offset 16',
      'warp reduction uses all 5 shuffle steps (16,8,4,2,1)',
      'warpCount uses __ballot_sync to collect predicates',
      'warpCount uses __popc to count set bits',
      'block reduction stores warp results to shared memory',
      'block reduction uses warpReduce for final combination',
    ],
  },

  'cuda-reduction': {
    id: 'cuda-reduction',
    language: 'cuda',
    title: 'Parallel Reduction: A Study in Principled Optimization',
    difficulty: 'advanced',
    order: 10,
    description: `
<h3>The Classic GPU Algorithm</h3>
<p>Reducing N values to one (sum, max, min) is deceptively simple serially and <em>surprisingly subtle</em> in parallel. The optimization journey through parallel reduction teaches more about GPU hardware than almost any other algorithm.</p>

<h3>Level 0: Serial (Baseline)</h3>
<pre>
float sum = 0;
for (int i = 0; i < N; i++) sum += data[i];
// Time: O(N). Simple. Slow.
</pre>

<h3>Level 1: Naive Parallel (Interleaved Addressing)</h3>
<pre>
// Each thread handles one element, then half the threads go idle
for (int stride = 1; stride < blockDim.x; stride *= 2) {
    if (threadIdx.x % (2 * stride) == 0)
        sdata[threadIdx.x] += sdata[threadIdx.x + stride];
    __syncthreads();
}
// PROBLEM: The modulo causes warp divergence.
// In the first step, only even threads work (50% idle).
// Worse: active threads are INTERLEAVED, so every warp diverges.
</pre>

<h3>Level 2: Sequential Addressing (Fix Divergence)</h3>
<pre>
for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
    if (threadIdx.x < stride)
        sdata[threadIdx.x] += sdata[threadIdx.x + stride];
    __syncthreads();
}
// FIX: Active threads are contiguous (0..stride-1).
// Entire warps are either all-active or all-idle.
// No warp divergence! Same algorithm, ~2x faster.
</pre>

<h3>Level 3: First-Add-During-Load (Reduce Memory Traffic)</h3>
<pre>
// Load TWO elements per thread, add them immediately
int i = blockIdx.x * (blockDim.x * 2) + threadIdx.x;
sdata[threadIdx.x] = data[i] + data[i + blockDim.x];
// Now the tree reduction starts with half the data already combined.
// Same compute, half the tree depth, fewer __syncthreads() calls.
</pre>

<h3>Design Principle</h3>
<p><em>"Performance engineering is a series of small, principled improvements."</em> Each level fixes one specific hardware inefficiency: divergence, memory traffic, synchronization overhead. The good engineer knows which optimization to apply and why.</p>

<h3>Your Task</h3>
<p>Implement the Level 2 (sequential addressing) and Level 3 (first-add-during-load) reductions. Explain why each improvement works.</p>
`,
    starterCode: `// Parallel Reduction — From Naive to Optimized
// blockDim.x = 256

// ============================================
// Level 2: Sequential Addressing Reduction
// Fixes the warp divergence of interleaved addressing.
// ============================================
__global__ void reduceSequential(float *input, float *output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    sdata[tid] = (i < n) ? input[i] : 0.0f;
    __syncthreads();

    // TODO: Tree reduction with sequential addressing
    // Start stride at blockDim.x / 2, halve each step
    // Active threads: 0 to stride-1 (contiguous!)
    // for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
    //     if (tid < stride)
    //         sdata[tid] += sdata[tid + stride];
    //     __syncthreads();
    // }


    if (tid == 0) output[blockIdx.x] = sdata[0];
}

// ============================================
// Level 3: First-Add-During-Load
// Each thread loads TWO elements and adds them
// before the tree reduction begins.
// ============================================
__global__ void reduceFirstAdd(float *input, float *output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;

    // TODO: Load two elements and add them
    // Each block now covers blockDim.x * 2 elements
    // int i = blockIdx.x * (blockDim.x * 2) + threadIdx.x;
    // sdata[tid] = input[i] + input[i + blockDim.x];
    // (add bounds checking)


    __syncthreads();

    // TODO: Same sequential addressing tree reduction as above
    // for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
    //     if (tid < stride)
    //         sdata[tid] += sdata[tid + stride];
    //     __syncthreads();
    // }


    if (tid == 0) output[blockIdx.x] = sdata[0];
}
`,
    solutionCode: `// Parallel Reduction — Solutions

// Level 2: Sequential Addressing
__global__ void reduceSequential(float *input, float *output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    sdata[tid] = (i < n) ? input[i] : 0.0f;
    __syncthreads();

    // Sequential addressing: contiguous active threads
    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride)
            sdata[tid] += sdata[tid + stride];
        __syncthreads();
    }
    // Step 1: threads 0-127 add from 128-255
    // Step 2: threads 0-63 add from 64-127
    // ...until thread 0 has the final sum.
    // NO WARP DIVERGENCE: entire warps are active or idle.

    if (tid == 0) output[blockIdx.x] = sdata[0];
}

// Level 3: First-Add-During-Load
__global__ void reduceFirstAdd(float *input, float *output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * (blockDim.x * 2) + threadIdx.x;

    // Load two elements and add immediately
    float a = (i < n) ? input[i] : 0.0f;
    float b = (i + blockDim.x < n) ? input[i + blockDim.x] : 0.0f;
    sdata[tid] = a + b;

    __syncthreads();

    // Same tree reduction, but starts with half the data
    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride)
            sdata[tid] += sdata[tid + stride];
        __syncthreads();
    }

    if (tid == 0) output[blockIdx.x] = sdata[0];
}

// OPTIMIZATION SUMMARY:
// Level 1 (interleaved): warp divergence, O(log N) steps
// Level 2 (sequential):  no divergence, O(log N) steps — ~2x faster
// Level 3 (first-add):   no divergence, O(log N/2) steps — ~1.5x more
//
// Each optimization targets a specific hardware issue:
// Level 2: eliminates warp divergence
// Level 3: reduces memory traffic and tree depth
// A real production kernel would add warp shuffle for the last 5 steps.
`,
    testCode: '',
    hints: [
      'Sequential addressing: <code>for (int stride = blockDim.x/2; stride > 0; stride >>= 1)</code>. Thread tid adds sdata[tid + stride].',
      'The key insight: with sequential addressing, threads 0..stride-1 are active. Entire warps are either fully active or fully idle — no divergence.',
      'First-add: <code>int i = blockIdx.x * (blockDim.x * 2) + threadIdx.x</code>. Each block covers 2x the range. Load input[i] + input[i + blockDim.x].',
      'Don\'t forget bounds checking for first-add: both <code>i < n</code> and <code>i + blockDim.x < n</code>.',
    ],
    concepts: [
      'parallel reduction',
      'warp divergence elimination',
      'sequential addressing',
      'first-add-during-load',
      'tree reduction',
      'principled optimization',
    ],
    successPatterns: [
      'stride\\s*=\\s*blockDim\\.x\\s*/\\s*2.*stride\\s*>\\s*0.*stride\\s*>>=\\s*1',
      'sdata\\[tid\\]\\s*\\+=\\s*sdata\\[tid\\s*\\+\\s*stride\\]',
      'blockDim\\.x\\s*\\*\\s*2',
      'input\\[i\\s*\\+\\s*blockDim',
    ],
    testNames: [
      'sequential addressing: stride halves from blockDim.x/2',
      'sequential addressing: contiguous threads add sdata[tid + stride]',
      'first-add: each block covers blockDim.x * 2 elements',
      'first-add: loads two elements and adds before tree reduction',
    ],
  },

  'cuda-scan': {
    id: 'cuda-scan',
    language: 'cuda',
    title: 'Prefix Sum: The Most Important Parallel Primitive',
    difficulty: 'advanced',
    order: 11,
    description: `
<h3>Why Prefix Sum Is Fundamental</h3>
<p>Prefix sum (scan) computes running totals: given [3, 1, 7, 0, 4, 1, 6, 3], produce [3, 4, 11, 11, 15, 16, 22, 25]. This seems simple, but it is the <strong>most important building block in parallel algorithms</strong>.</p>

<h3>What Reduces to Scan</h3>
<table>
  <thead><tr><th>Algorithm</th><th>Uses Scan For</th></tr></thead>
  <tbody>
    <tr><td><strong>Sort</strong> (radix sort)</td><td>Computing destination indices for each bit group</td></tr>
    <tr><td><strong>Stream compaction</strong></td><td>Packing non-null elements into a dense array</td></tr>
    <tr><td><strong>Histogram</strong></td><td>Computing output offsets per bin</td></tr>
    <tr><td><strong>Sparse matrix ops</strong></td><td>CSR row pointer computation</td></tr>
    <tr><td><strong>Dynamic allocation</strong></td><td>Per-thread memory offsets</td></tr>
  </tbody>
</table>

<p>If you master scan, you can implement all of the above. This is Hughes' argument for composability applied to GPU programming: <em>master the primitives, and complex algorithms follow</em>.</p>

<h3>Blelloch Scan: The Two-Phase Algorithm</h3>
<pre>
Phase 1: UP-SWEEP (reduce)
Build partial sums in a tree structure:
[3, 1, 7, 0, 4, 1, 6, 3]
[3, 4, 7, 8, 4, 5, 6, 14]   stride=1: add pairs
[3, 4, 7, 12, 4, 5, 6, 19]  stride=2: add pairs
[3, 4, 7, 12, 4, 5, 6, 25]  stride=4: final sum at end

Phase 2: DOWN-SWEEP (distribute)
Set last element to 0 (exclusive scan), push sums down:
[3, 4, 7, 12, 4, 5, 6, 0]   set last to identity (0)
[3, 4, 7, 0, 4, 5, 6, 12]   stride=4: swap and add
[3, 0, 7, 4, 4, 12, 6, 17]  stride=2: swap and add
[0, 3, 4, 11, 11, 15, 16, 22] stride=1: final exclusive scan
</pre>

<h3>Why Not Just Scan Serially?</h3>
<p>Serial scan is O(N) — and on a GPU with thousands of threads, most sit idle. Blelloch scan is O(N/P) work per thread with O(log N) steps. For N=1M elements on a GPU with 100K threads, the parallel version is orders of magnitude faster.</p>

<h3>Design Principle</h3>
<p><em>"Master the primitives and complex algorithms follow."</em> Scan is to parallel computing what fold is to functional programming — a universal building block.</p>

<h3>Your Task</h3>
<p>Implement both phases of the Blelloch exclusive scan for a single block. Fill in the up-sweep and down-sweep loops.</p>
`,
    starterCode: `// Blelloch Exclusive Scan — The Universal Primitive
// blockDim.x = N/2 (each thread handles two elements)
// Works on shared memory array of size N (power of 2)

__global__ void blellochScan(float *data, int n) {
    extern __shared__ float sdata[];

    int tid = threadIdx.x;

    // Load input into shared memory
    sdata[2 * tid]     = data[2 * tid];
    sdata[2 * tid + 1] = data[2 * tid + 1];

    // ============================================
    // Phase 1: UP-SWEEP (Reduce)
    // Build the partial sum tree from leaves to root.
    // At each level, add the left child to the right child.
    // ============================================
    // TODO: for (int stride = 1; stride < n; stride *= 2) {
    //     int idx = (tid + 1) * stride * 2 - 1;
    //     if (idx < n)
    //         sdata[idx] += sdata[idx - stride];
    //     __syncthreads();
    // }


    // ============================================
    // Set root to zero (exclusive scan identity)
    // ============================================
    // TODO: if (tid == 0) sdata[n - 1] = 0;
    // __syncthreads();


    // ============================================
    // Phase 2: DOWN-SWEEP (Distribute)
    // Push partial sums down the tree.
    // At each level: swap right with sum, add old right to left.
    // ============================================
    // TODO: for (int stride = n / 2; stride > 0; stride /= 2) {
    //     int idx = (tid + 1) * stride * 2 - 1;
    //     if (idx < n) {
    //         float temp = sdata[idx - stride];
    //         sdata[idx - stride] = sdata[idx];
    //         sdata[idx] += temp;
    //     }
    //     __syncthreads();
    // }


    // Write results back
    data[2 * tid]     = sdata[2 * tid];
    data[2 * tid + 1] = sdata[2 * tid + 1];
}
`,
    solutionCode: `// Blelloch Exclusive Scan — Solution

__global__ void blellochScan(float *data, int n) {
    extern __shared__ float sdata[];

    int tid = threadIdx.x;

    // Load input into shared memory
    sdata[2 * tid]     = data[2 * tid];
    sdata[2 * tid + 1] = data[2 * tid + 1];

    // Phase 1: UP-SWEEP (Reduce)
    // At each level, thread computes: sdata[right] += sdata[left]
    // This builds a tree of partial sums. After completion,
    // sdata[n-1] contains the total sum.
    for (int stride = 1; stride < n; stride *= 2) {
        __syncthreads();
        int idx = (tid + 1) * stride * 2 - 1;
        if (idx < n)
            sdata[idx] += sdata[idx - stride];
    }

    __syncthreads();

    // Set root to zero — this makes it an exclusive scan
    if (tid == 0) sdata[n - 1] = 0;

    __syncthreads();

    // Phase 2: DOWN-SWEEP (Distribute)
    // At each level: swap right child with sum, propagate
    // This distributes the partial sums to produce the final scan
    for (int stride = n / 2; stride > 0; stride /= 2) {
        __syncthreads();
        int idx = (tid + 1) * stride * 2 - 1;
        if (idx < n) {
            float temp = sdata[idx - stride]; // save left child
            sdata[idx - stride] = sdata[idx]; // left = right (partial sum)
            sdata[idx] += temp;               // right = right + old left
        }
    }

    __syncthreads();

    // Write results back to global memory
    data[2 * tid]     = sdata[2 * tid];
    data[2 * tid + 1] = sdata[2 * tid + 1];
}

// TRACE for [3, 1, 7, 0, 4, 1, 6, 3]:
//
// Up-sweep:
//   stride=1: [3, 4, 7, 7, 4, 5, 6, 9]
//   stride=2: [3, 4, 7, 11, 4, 5, 6, 14]
//   stride=4: [3, 4, 7, 11, 4, 5, 6, 25]
//
// Set root to 0: sdata[7] = 0
//
// Down-sweep:
//   stride=4: [3, 4, 7, 11, 4, 5, 6, 0] → [3, 4, 7, 0, 4, 5, 6, 11]
//   stride=2: [3, 4, 7, 0, 4, 5, 6, 11] → [3, 0, 7, 4, 4, 11, 6, 17]
//   stride=1: → [0, 3, 4, 11, 11, 15, 16, 22]
//
// Exclusive scan: each element = sum of all preceding elements.
`,
    testCode: '',
    hints: [
      'Up-sweep: <code>for (stride = 1; stride < n; stride *= 2)</code>. Thread computes index <code>(tid+1) * stride * 2 - 1</code> and adds from <code>idx - stride</code>.',
      'After the up-sweep, sdata[n-1] holds the total sum. Set it to 0 for exclusive scan.',
      'Down-sweep goes in reverse: <code>for (stride = n/2; stride > 0; stride /= 2)</code>. At each step, save left, copy right to left, add old left to right.',
      'The down-sweep is the trickiest part. Think of it as distributing the accumulated sums back down the tree.',
    ],
    concepts: [
      'prefix sum',
      'Blelloch scan',
      'up-sweep',
      'down-sweep',
      'exclusive scan',
      'parallel primitives',
      'composability',
    ],
    successPatterns: [
      'stride\\s*=\\s*1.*stride\\s*<\\s*n.*stride\\s*\\*=\\s*2',
      'sdata\\[idx\\]\\s*\\+=\\s*sdata\\[idx\\s*-\\s*stride\\]',
      'sdata\\[n\\s*-\\s*1\\]\\s*=\\s*0',
      'stride\\s*=\\s*n\\s*/\\s*2.*stride\\s*>\\s*0.*stride\\s*/=\\s*2',
      'sdata\\[idx\\]\\s*\\+=\\s*temp',
    ],
    testNames: [
      'up-sweep iterates with doubling stride',
      'up-sweep accumulates sdata[idx] += sdata[idx - stride]',
      'sets root (sdata[n-1]) to 0 for exclusive scan',
      'down-sweep iterates with halving stride',
      'down-sweep performs swap-and-add pattern',
    ],
  },

  'cuda-performance': {
    id: 'cuda-performance',
    language: 'cuda',
    title: 'Performance Diagnosis: Profile, Don\'t Guess',
    difficulty: 'advanced',
    order: 12,
    description: `
<h3>The Capstone: Diagnostic Thinking</h3>
<p>Writing a correct GPU kernel is the easy part. Making it fast requires <strong>diagnosis</strong>. The three bottlenecks are memory bandwidth, compute throughput, and latency. The wrong diagnosis leads to wasted optimization effort.</p>

<h3>The Three Bottlenecks</h3>
<table>
  <thead><tr><th>Bottleneck</th><th>Symptoms</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td><strong>Memory bandwidth</strong></td><td>Low compute utilization, high memory throughput near peak</td><td>Coalescing, tiling, reduce data movement</td></tr>
    <tr><td><strong>Compute throughput</strong></td><td>High arithmetic utilization, memory bus idle</td><td>Reduce instructions, use fast math, vectorize</td></tr>
    <tr><td><strong>Latency</strong></td><td>Both memory and compute underutilized</td><td>Increase occupancy, overlap operations</td></tr>
  </tbody>
</table>

<h3>The Diagnostic Process</h3>
<pre>
Step 1: Profile the kernel
  - Measure achieved memory bandwidth vs. peak
  - Measure achieved FLOPS vs. peak
  - Measure occupancy

Step 2: Identify the bottleneck
  - Memory BW > 60% of peak → memory-bound
  - Compute > 60% of peak → compute-bound
  - Both low → latency-bound

Step 3: Choose the right optimization
  - Memory-bound → fix access patterns, add tiling
  - Compute-bound → reduce instructions, use intrinsics
  - Latency-bound → increase occupancy or overlap
</pre>

<h3>Common Anti-Patterns</h3>
<pre>
1. Optimizing compute on a memory-bound kernel
   → "I unrolled all my loops!" (makes no difference)

2. Increasing occupancy on a compute-bound kernel
   → "I reduced registers to get more threads!" (now it spills)

3. Adding shared memory to a latency-bound kernel
   → "I tiled everything!" (but occupancy dropped due to shmem)
</pre>

<h3>Design Principle</h3>
<p><em>"Good GPU engineers diagnose before they prescribe."</em> Like a doctor who orders tests before treatment, the first step is always measurement. The profiler tells you what is actually happening — your intuition is usually wrong.</p>

<h3>Your Task</h3>
<p>For each kernel profile, diagnose the bottleneck and choose the correct optimization. This is the skill that separates engineers who make code fast from those who just make it different.</p>
`,
    starterCode: `// Performance Diagnosis — Profile, Don't Guess
// GPU specs: 20 TFLOPS peak, 900 GB/s peak bandwidth
// Replace "?" with the correct answer.

// ============================================
// Kernel A Profile:
//   Achieved memory BW: 810 GB/s (90% of peak)
//   Achieved compute:   2 TFLOPS (10% of peak)
//   Occupancy: 75%
//
// Bottleneck? ("memory", "compute", or "latency")
// Best optimization?
// ============================================
const char* bottleneckA = "?";
// Best fix: ("coalesce", "reduce_instructions",
//            "increase_occupancy", "add_tiling")
const char* fixA = "?";

// ============================================
// Kernel B Profile:
//   Achieved memory BW: 200 GB/s (22% of peak)
//   Achieved compute:   18 TFLOPS (90% of peak)
//   Occupancy: 50%
// ============================================
const char* bottleneckB = "?";
const char* fixB = "?";

// ============================================
// Kernel C Profile:
//   Achieved memory BW: 150 GB/s (17% of peak)
//   Achieved compute:   1 TFLOPS (5% of peak)
//   Occupancy: 12%
// ============================================
const char* bottleneckC = "?";
const char* fixC = "?";

// ============================================
// Kernel D Profile:
//   Achieved memory BW: 800 GB/s (89% of peak)
//   Achieved compute:   3 TFLOPS (15% of peak)
//   A developer unrolled all loops. Did it help?
//   ("yes" or "no") Why?
// ============================================
const char* unroll_helped = "?";
const char* unroll_reason = "?";
// Use: "memory_bound_unroll_irrelevant" or
//      "compute_bound_unroll_helps"

// ============================================
// Kernel E Profile:
//   Achieved memory BW: 100 GB/s (11% of peak)
//   Achieved compute:   1.5 TFLOPS (7.5% of peak)
//   Occupancy: 87%
//   Kernel has random (scattered) global reads.
//   What is the most likely problem?
// ============================================
const char* problemE = "?";
// Use: "uncoalesced_access", "register_spill",
//      "warp_divergence", or "low_occupancy"
`,
    solutionCode: `// Performance Diagnosis — Solutions

// Kernel A: Memory BW at 90% of peak, compute at 10%
// This kernel is saturating the memory bus.
// Compute units are starved for data.
const char* bottleneckA = "memory";
// Tiling moves data into shared memory, reducing global traffic.
const char* fixA = "add_tiling";

// Kernel B: Compute at 90%, memory at 22%
// The kernel is doing lots of math on relatively little data.
// Memory bus is idle — plenty of bandwidth available.
const char* bottleneckB = "compute";
// Reducing instructions (fast math, intrinsics) helps.
const char* fixB = "reduce_instructions";

// Kernel C: Both memory (17%) and compute (5%) are low.
// Occupancy is only 12% — not enough warps to hide latency.
// The GPU is waiting, not working.
const char* bottleneckC = "latency";
// More concurrent warps = better latency hiding.
const char* fixC = "increase_occupancy";

// Kernel D: Memory at 89% of peak. This is memory-bound.
// Loop unrolling reduces instruction overhead (a compute opt).
// But the bottleneck is memory, not compute. Irrelevant.
const char* unroll_helped = "no";
const char* unroll_reason = "memory_bound_unroll_irrelevant";

// Kernel E: Both metrics low despite 87% occupancy.
// High occupancy + low bandwidth = the memory transactions
// are inefficient. Random (scattered) reads cause many
// transactions per warp — each warp issues 32 separate loads
// instead of 1 coalesced load.
const char* problemE = "uncoalesced_access";

// THE META-LESSON:
// 1. Always measure first (profiler, not intuition)
// 2. Identify which resource is saturated
// 3. Only optimize the actual bottleneck
// 4. Re-profile after each change — the bottleneck may shift
//
// The best GPU engineers spend more time in the profiler
// than in the editor.
`,
    testCode: '',
    hints: [
      'If memory bandwidth is near peak (>60%), the kernel is memory-bound. If compute is near peak, it is compute-bound. If both are low, it is latency-bound.',
      'Memory-bound kernels benefit from tiling and coalescing (reduce memory traffic). Compute optimizations have no effect.',
      'Latency-bound kernels (low occupancy, low utilization) need more active warps to hide the latency of memory and instruction pipeline.',
      'Uncoalesced access causes many memory transactions per warp. Even at high occupancy, effective bandwidth is low because each transaction carries little useful data.',
    ],
    concepts: [
      'performance diagnosis',
      'memory-bound',
      'compute-bound',
      'latency-bound',
      'profiling',
      'roofline model',
      'anti-patterns',
    ],
    successPatterns: [
      'bottleneckA\\s*=\\s*"memory"',
      'fixA\\s*=\\s*"add_tiling"',
      'bottleneckB\\s*=\\s*"compute"',
      'fixB\\s*=\\s*"reduce_instructions"',
      'bottleneckC\\s*=\\s*"latency"',
      'fixC\\s*=\\s*"increase_occupancy"',
      'unroll_helped\\s*=\\s*"no"',
      'unroll_reason\\s*=\\s*"memory_bound_unroll_irrelevant"',
      'problemE\\s*=\\s*"uncoalesced_access"',
    ],
    testNames: [
      'Kernel A diagnosed as memory-bound (90% BW utilization)',
      'Kernel A: tiling is the correct fix for memory-bound',
      'Kernel B diagnosed as compute-bound (90% compute utilization)',
      'Kernel B: reducing instructions is the correct fix',
      'Kernel C diagnosed as latency-bound (both metrics low)',
      'Kernel C: increasing occupancy is the correct fix',
      'loop unrolling does not help memory-bound kernels',
      'correctly identifies unroll irrelevance reason',
      'Kernel E: scattered reads cause uncoalesced access pattern',
    ],
  },
};
