import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  // ─────────────────────────────────────────────
  // Module 1: Parallel Fundamentals
  // ─────────────────────────────────────────────

  'cuda-thread-hierarchy': {
    id: 'cuda-thread-hierarchy',
    language: 'cuda',
    title: 'Thread, Block, and Grid Hierarchy',
    difficulty: 'beginner',
    order: 1,
    description: `
<p>CUDA organizes parallel work into a <strong>three-level hierarchy</strong>: threads live inside blocks, and blocks live inside a grid. Understanding this hierarchy is the foundation of all GPU programming.</p>

<h3>The Hierarchy</h3>
<pre>
Grid (all blocks)
├── Block (0,0)
│   ├── Thread 0
│   ├── Thread 1
│   └── ...
├── Block (1,0)
│   ├── Thread 0
│   ├── Thread 1
│   └── ...
└── ...
</pre>

<h3>Built-in Variables</h3>
<table>
  <thead><tr><th>Variable</th><th>Meaning</th><th>Scope</th></tr></thead>
  <tbody>
    <tr><td><code>threadIdx.x</code></td><td>Thread index within its block</td><td>0 to blockDim.x - 1</td></tr>
    <tr><td><code>blockIdx.x</code></td><td>Block index within the grid</td><td>0 to gridDim.x - 1</td></tr>
    <tr><td><code>blockDim.x</code></td><td>Number of threads per block</td><td>Same for all blocks</td></tr>
    <tr><td><code>gridDim.x</code></td><td>Number of blocks in the grid</td><td>Set at launch</td></tr>
  </tbody>
</table>

<h3>Global Thread ID</h3>
<p>To get a unique index across the entire grid:</p>
<pre>
int globalId = blockIdx.x * blockDim.x + threadIdx.x;

Example: 4 blocks of 8 threads each
Block 0: threads 0-7   (globalId = 0*8+0 .. 0*8+7)
Block 1: threads 8-15  (globalId = 1*8+0 .. 1*8+7)
Block 2: threads 16-23 (globalId = 2*8+0 .. 2*8+7)
Block 3: threads 24-31 (globalId = 3*8+0 .. 3*8+7)
</pre>

<h3>Your Task</h3>
<p>Given a launch configuration of <strong>4 blocks with 8 threads per block</strong>, predict the values of the built-in variables and computed global IDs. Replace each <code>-1</code> with the correct answer.</p>
`,
    starterCode: `// CUDA Thread Hierarchy — Predict the Answer
// Launch configuration: <<<4, 8>>> (4 blocks, 8 threads/block)

// ============================================
// Q1: How many total threads are launched?
// ============================================
const int total_threads = -1;  // gridDim.x * blockDim.x

// ============================================
// Q2: For a thread in Block 2, Thread 5:
//     What is its global ID?
// ============================================
const int global_id_b2_t5 = -1;  // blockIdx.x * blockDim.x + threadIdx.x

// ============================================
// Q3: If we launch <<<8, 256>>>, what is the
//     global ID of Block 7, Thread 255?
// ============================================
const int global_id_b7_t255 = -1;

// ============================================
// Q4: What is the MAXIMUM number of threads
//     per block on modern NVIDIA GPUs?
//     (This is a hardware limit)
// ============================================
const int max_threads_per_block = -1;

// ============================================
// Q5: If you have an array of 1000 elements
//     and use 256 threads per block, how many
//     blocks do you need? (round up!)
// ============================================
const int blocks_needed = -1;  // ceil(1000 / 256)
`,
    solutionCode: `// CUDA Thread Hierarchy — Solutions
// Launch configuration: <<<4, 8>>> (4 blocks, 8 threads/block)

// Q1: 4 blocks * 8 threads = 32 total
const int total_threads = 32;

// Q2: Block 2, Thread 5: globalId = 2 * 8 + 5 = 21
const int global_id_b2_t5 = 21;

// Q3: Block 7, Thread 255: globalId = 7 * 256 + 255 = 2047
const int global_id_b7_t255 = 2047;

// Q4: 1024 threads per block (hardware limit since Fermi)
const int max_threads_per_block = 1024;

// Q5: ceil(1000/256) = 4 (4 * 256 = 1024 >= 1000)
const int blocks_needed = 4;
`,
    testCode: '',
    hints: [
      '<code>total_threads = gridDim.x * blockDim.x</code>. With 4 blocks and 8 threads each, that is 4 * 8.',
      'The global thread ID formula is <code>blockIdx.x * blockDim.x + threadIdx.x</code>. For Block 2, Thread 5: 2 * 8 + 5.',
      'For <<<8, 256>>>, Block 7, Thread 255: globalId = 7 * 256 + 255. Work out the multiplication first.',
      'To cover N elements with T threads per block, you need <code>ceil(N / T)</code> blocks. A common idiom is <code>(N + T - 1) / T</code>.',
    ],
    concepts: [
      'thread hierarchy',
      'threadIdx',
      'blockIdx',
      'blockDim',
      'gridDim',
      'global thread ID',
      'launch configuration',
    ],
    successPatterns: [
      'total_threads\\s*=\\s*32',
      'global_id_b2_t5\\s*=\\s*21',
      'global_id_b7_t255\\s*=\\s*2047',
      'max_threads_per_block\\s*=\\s*1024',
      'blocks_needed\\s*=\\s*4',
    ],
    testNames: [
      'total_threads equals 32 (4 blocks * 8 threads)',
      'global_id for Block 2, Thread 5 equals 21',
      'global_id for Block 7, Thread 255 equals 2047',
      'max threads per block is 1024',
      'blocks needed for 1000 elements with 256 threads is 4',
    ],
  },

  'cuda-kernel-launch': {
    id: 'cuda-kernel-launch',
    language: 'cuda',
    title: 'Writing and Launching Kernels',
    difficulty: 'beginner',
    order: 2,
    description: `
<p>A CUDA <strong>kernel</strong> is a function that runs on the GPU. It is declared with <code>__global__</code> and launched from the CPU using the <code>&lt;&lt;&lt;blocks, threads&gt;&gt;&gt;</code> syntax.</p>

<h3>Kernel Anatomy</h3>
<pre>
__global__ void myKernel(float* data, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) {
        data[i] = data[i] * 2.0f;
    }
}

// Launch: every thread processes one element
int threadsPerBlock = 256;
int blocks = (n + threadsPerBlock - 1) / threadsPerBlock;
myKernel<<<blocks, threadsPerBlock>>>(d_data, n);
</pre>

<h3>Function Qualifiers</h3>
<table>
  <thead><tr><th>Qualifier</th><th>Runs On</th><th>Called From</th></tr></thead>
  <tbody>
    <tr><td><code>__global__</code></td><td>GPU</td><td>CPU (or GPU with dynamic parallelism)</td></tr>
    <tr><td><code>__device__</code></td><td>GPU</td><td>GPU only</td></tr>
    <tr><td><code>__host__</code></td><td>CPU</td><td>CPU only</td></tr>
  </tbody>
</table>

<h3>The Bounds Check</h3>
<p>We often launch more threads than elements (due to rounding up). The <code>if (i &lt; n)</code> guard prevents out-of-bounds access. <strong>Never forget it.</strong></p>

<pre>
Array:  [a0] [a1] [a2] [a3] [a4]   (n = 5)
Threads: T0   T1   T2   T3   T4   T5  T6  T7  (8 threads launched)
                                    ^   ^   ^
                            These must NOT access the array!
</pre>

<h3>Your Task</h3>
<p>Complete the vector addition kernel. Each thread computes <code>C[i] = A[i] + B[i]</code> for one element.</p>
`,
    starterCode: `// Vector Addition Kernel
// Each thread computes one element: C[i] = A[i] + B[i]

__global__ void vectorAdd(const float* A, const float* B, float* C, int n) {
    // TODO: Compute the global thread index
    // int i = ???

    // TODO: Bounds check — only process if i < n

    // TODO: Compute C[i] = A[i] + B[i]
}

// Host code (for reference — focus on the kernel above)
// int threadsPerBlock = 256;
// int blocks = (n + threadsPerBlock - 1) / threadsPerBlock;
// vectorAdd<<<blocks, threadsPerBlock>>>(d_A, d_B, d_C, n);
`,
    solutionCode: `// Vector Addition Kernel
// Each thread computes one element: C[i] = A[i] + B[i]

__global__ void vectorAdd(const float* A, const float* B, float* C, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    if (i < n) {
        C[i] = A[i] + B[i];
    }
}

// Host code (for reference)
// int threadsPerBlock = 256;
// int blocks = (n + threadsPerBlock - 1) / threadsPerBlock;
// vectorAdd<<<blocks, threadsPerBlock>>>(d_A, d_B, d_C, n);
`,
    testCode: '',
    hints: [
      'The global thread index is computed as <code>int i = blockIdx.x * blockDim.x + threadIdx.x;</code>',
      'Always check <code>if (i < n)</code> before accessing any array. This prevents out-of-bounds memory access.',
      'The kernel body is just one line: <code>C[i] = A[i] + B[i];</code> — each thread does exactly one addition.',
      'The <code>__global__</code> qualifier is already provided. You only need to fill in the three TODOs inside the function body.',
    ],
    concepts: [
      '__global__',
      'kernel launch',
      '<<<blocks, threads>>>',
      'vector addition',
      'bounds checking',
      'global thread ID',
    ],
    successPatterns: [
      'blockIdx\\.x\\s*\\*\\s*blockDim\\.x\\s*\\+\\s*threadIdx\\.x',
      'if\\s*\\(\\s*i\\s*<\\s*n\\s*\\)',
      'C\\[i\\]\\s*=\\s*A\\[i\\]\\s*\\+\\s*B\\[i\\]',
    ],
    testNames: [
      'computes global thread index using blockIdx.x * blockDim.x + threadIdx.x',
      'includes bounds check (if i < n)',
      'computes C[i] = A[i] + B[i]',
    ],
  },

  'cuda-memory-spaces': {
    id: 'cuda-memory-spaces',
    language: 'cuda',
    title: 'GPU Memory Spaces',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>A GPU has multiple <strong>memory spaces</strong> with vastly different speeds. Understanding where your data lives is often the single biggest factor in kernel performance.</p>

<h3>Memory Hierarchy</h3>
<pre>
Speed      Memory           Scope          Size       Lifetime
──────────────────────────────────────────────────────────────────
Fastest    Registers        Per-thread     ~255 regs  Kernel
  |        Shared Memory    Per-block      ~48-164 KB Kernel
  |        L1/L2 Cache      Automatic      Varies     Automatic
  v        Global Memory    All threads    GBs        Allocated
Slowest    Host Memory      CPU only       System RAM N/A
</pre>

<h3>Keywords</h3>
<table>
  <thead><tr><th>Keyword</th><th>Memory Space</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>(none / local var)</td><td>Registers</td><td><code>int x = 5;</code></td></tr>
    <tr><td><code>__shared__</code></td><td>Shared Memory</td><td><code>__shared__ float tile[256];</code></td></tr>
    <tr><td><code>__device__</code></td><td>Global Memory</td><td><code>__device__ float* d_array;</code></td></tr>
    <tr><td><code>__constant__</code></td><td>Constant Memory</td><td><code>__constant__ float coeff[16];</code></td></tr>
  </tbody>
</table>

<h3>Shared Memory</h3>
<p>Shared memory is a fast, programmer-managed cache shared by all threads in a block. It is declared with <code>__shared__</code> and lives on-chip (SRAM), making it ~100x faster than global memory (DRAM).</p>

<pre>
Block 0                        Block 1
┌──────────────────────┐      ┌──────────────────────┐
│  __shared__ tile[]   │      │  __shared__ tile[]   │
│  (visible to all     │      │  (SEPARATE copy,     │
│   threads in block 0)│      │   block 1 only)      │
├──────────────────────┤      ├──────────────────────┤
│ Thread 0 | Thread 1  │      │ Thread 0 | Thread 1  │
│ regs     | regs      │      │ regs     | regs      │
└──────────────────────┘      └──────────────────────┘
         │                              │
         └──────── Global Memory ───────┘
              (visible to ALL threads)
</pre>

<h3>Your Task</h3>
<p>Annotate each variable with its memory space, and complete a kernel that uses shared memory as a staging area to reduce global memory accesses.</p>
`,
    starterCode: `// GPU Memory Spaces
// Annotate each variable and complete the shared memory kernel

// ============================================
// PART 1: Identify memory spaces
// Replace "UNKNOWN" with: REGISTER, SHARED, GLOBAL, or CONSTANT
// ============================================

__global__ void example(float* input, float* output, int n) {
    int tid = threadIdx.x;                        // Memory: UNKNOWN
    __shared__ float cache[256];                   // Memory: UNKNOWN
    float local_sum = 0.0f;                        // Memory: UNKNOWN
    // input and output are pointers to...         // Memory: UNKNOWN
}

// ============================================
// PART 2: Use shared memory to reverse a block
// Each block reverses its chunk of the array
// ============================================

__global__ void blockReverse(float* d_out, const float* d_in, int n) {
    // TODO: Declare a shared memory array for the block
    // __shared__ float temp[???];

    int i = blockIdx.x * blockDim.x + threadIdx.x;

    // TODO: Load element into shared memory
    // if (i < n) temp[???] = d_in[???];

    // TODO: Synchronize threads (all loads must complete)

    // TODO: Write reversed element to output
    // The thread at position threadIdx.x should write
    // the element from position (blockDim.x - 1 - threadIdx.x)
    // if (i < n) d_out[???] = temp[???];
}
`,
    solutionCode: `// GPU Memory Spaces

// PART 1: Identify memory spaces
__global__ void example(float* input, float* output, int n) {
    int tid = threadIdx.x;                        // Memory: REGISTER
    __shared__ float cache[256];                   // Memory: SHARED
    float local_sum = 0.0f;                        // Memory: REGISTER
    // input and output are pointers to...         // Memory: GLOBAL
}

// PART 2: Use shared memory to reverse a block
__global__ void blockReverse(float* d_out, const float* d_in, int n) {
    __shared__ float temp[256];

    int i = blockIdx.x * blockDim.x + threadIdx.x;

    if (i < n) temp[threadIdx.x] = d_in[i];

    __syncthreads();

    if (i < n) d_out[blockIdx.x * blockDim.x + (blockDim.x - 1 - threadIdx.x)] = temp[threadIdx.x];
}
`,
    testCode: '',
    hints: [
      'Local variables like <code>int tid</code> and <code>float local_sum</code> live in <strong>registers</strong> (fastest). The compiler allocates them per-thread.',
      'Anything declared with <code>__shared__</code> lives in <strong>shared memory</strong>. Pointer arguments to a kernel point to <strong>global memory</strong> (allocated with cudaMalloc).',
      'For the reverse kernel, declare <code>__shared__ float temp[256];</code> and load with <code>temp[threadIdx.x] = d_in[i];</code>',
      'You MUST call <code>__syncthreads()</code> between loading into shared memory and reading from it. Without this, some threads may read stale data.',
    ],
    concepts: [
      'registers',
      'shared memory',
      'global memory',
      'constant memory',
      '__shared__',
      '__syncthreads',
      'memory hierarchy',
    ],
    successPatterns: [
      '__shared__\\s+float\\s+cache',
      'blockIdx\\.x\\s*\\*\\s*blockDim',
      'temp\\[threadIdx',
      '__shared__\\s+float\\s+temp',
      '__syncthreads\\(\\)',
    ],
    testNames: [
      'correctly identifies register variables',
      'correctly identifies shared memory',
      'correctly identifies global memory pointers',
      'declares __shared__ temp array',
      'calls __syncthreads() between load and store',
    ],
  },

  'cuda-synchronization': {
    id: 'cuda-synchronization',
    language: 'cuda',
    title: 'Block-Level Synchronization',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p>When threads in a block share data through shared memory, you need <strong>synchronization</strong> to prevent race conditions. CUDA provides <code>__syncthreads()</code> as a block-level barrier.</p>

<h3>The Race Condition</h3>
<pre>
WITHOUT __syncthreads():
─────────────────────────────────
Time  Thread 0          Thread 1
─────────────────────────────────
 t0   shared[0] = a     shared[1] = b
 t1   read shared[1]    read shared[0]
       ↑ DANGER!          ↑ DANGER!
       Thread 1 might     Thread 0 might
       not have written    not have written
       yet!                yet!

WITH __syncthreads():
─────────────────────────────────
Time  Thread 0          Thread 1
─────────────────────────────────
 t0   shared[0] = a     shared[1] = b
      ── __syncthreads() BARRIER ──
      (ALL threads must reach here)
 t1   read shared[1] ✓  read shared[0] ✓
      (guaranteed b)     (guaranteed a)
</pre>

<h3>Rules for __syncthreads()</h3>
<ul>
  <li>Every thread in the block must reach the barrier (no divergent branches around it!)</li>
  <li>It only synchronizes within a <strong>single block</strong> — there is no global sync across blocks</li>
  <li>It acts as both an execution barrier and a <strong>memory fence</strong></li>
</ul>

<h3>Your Task</h3>
<p>Implement a block-level <strong>parallel reduction</strong> (sum) that requires synchronization at each step. The reduction halves the number of active threads at each level:</p>

<pre>
Step 0: [a0  a1  a2  a3  a4  a5  a6  a7]   (8 threads)
         \\+/     \\+/     \\+/     \\+/
Step 1: [s01  -  s23  -  s45  -  s67  - ]   (4 active)
         \\  +  /         \\  +  /
Step 2: [s03  -   -   -  s47  -   -   - ]   (2 active)
          \\     +      /
Step 3: [sum  -   -   -   -   -   -   - ]   (1 active)
</pre>
`,
    starterCode: `// Block-level parallel reduction (sum)
// Each block reduces its chunk to a single value

__global__ void blockReduce(const float* input, float* output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    // Load from global to shared memory
    sdata[tid] = (i < n) ? input[i] : 0.0f;

    // TODO: Add synchronization barrier here
    // (all data must be loaded before reduction begins)

    // Reduction loop: halve active threads each iteration
    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride) {
            // TODO: Add the element 'stride' positions away
            // sdata[tid] += sdata[???];
        }
        // TODO: Add synchronization barrier here
        // (must complete before next iteration reads updated values)
    }

    // Thread 0 writes the block's result
    if (tid == 0) {
        output[blockIdx.x] = sdata[0];
    }
}
`,
    solutionCode: `// Block-level parallel reduction (sum)
// Each block reduces its chunk to a single value

__global__ void blockReduce(const float* input, float* output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    // Load from global to shared memory
    sdata[tid] = (i < n) ? input[i] : 0.0f;

    __syncthreads();

    // Reduction loop: halve active threads each iteration
    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride) {
            sdata[tid] += sdata[tid + stride];
        }
        __syncthreads();
    }

    // Thread 0 writes the block's result
    if (tid == 0) {
        output[blockIdx.x] = sdata[0];
    }
}
`,
    testCode: '',
    hints: [
      'Place <code>__syncthreads();</code> after loading data into shared memory (after the <code>sdata[tid] = ...</code> line).',
      'In the reduction step, each thread at position <code>tid</code> adds the value at <code>sdata[tid + stride]</code>.',
      'You need <code>__syncthreads();</code> inside the loop too — after each addition, before the next iteration reads the updated values.',
      'The pattern is: (1) load into shared, (2) sync, (3) loop { add, sync }, (4) thread 0 writes result.',
    ],
    concepts: [
      '__syncthreads',
      'race condition',
      'barrier synchronization',
      'parallel reduction',
      'shared memory',
      'block-level sync',
    ],
    successPatterns: [
      'sdata\\[tid\\]\\s*\\+=\\s*sdata\\[tid\\s*\\+\\s*stride\\]',
      '__syncthreads\\(\\)',
    ],
    testNames: [
      'adds sdata[tid + stride] to sdata[tid] in reduction loop',
      'includes __syncthreads() barrier after shared memory load',
      'includes __syncthreads() barrier inside reduction loop',
    ],
  },

  // ─────────────────────────────────────────────
  // Module 2: Memory Hierarchy
  // ─────────────────────────────────────────────

  'cuda-global-memory': {
    id: 'cuda-global-memory',
    language: 'cuda',
    title: 'Coalesced Global Memory Access',
    difficulty: 'intermediate',
    order: 1,
    description: `
<p>Global memory access is the <strong>slowest</strong> operation on a GPU, but its performance depends dramatically on <em>how</em> you access it. <strong>Coalesced</strong> access can be 10-20x faster than uncoalesced.</p>

<h3>What is Coalescing?</h3>
<p>When threads in a warp (32 threads) access consecutive memory addresses, the hardware combines them into a single wide transaction. This is called <strong>coalescing</strong>.</p>

<pre>
COALESCED (good) — consecutive threads access consecutive addresses:
Thread:    T0    T1    T2    T3    ... T31
Address:  [0]   [1]   [2]   [3]   ... [31]
           └─────────────────────────────┘
            One 128-byte transaction ✓

STRIDED (bad) — threads skip elements:
Thread:    T0    T1    T2    T3    ... T31
Address:  [0]   [32]  [64]  [96]  ... [992]
           ↑     ↑     ↑     ↑
           32 separate transactions! ✗
</pre>

<h3>Array of Structures vs Structure of Arrays</h3>
<pre>
AoS (bad for GPU):              SoA (good for GPU):
struct Particle {               struct Particles {
  float x, y, z;                  float* x;  // all x values
};                                 float* y;  // all y values
Particle particles[N];            float* z;  // all z values
                                };
Access particles[i].x           Access x[i]
→ stride of 3 floats!          → stride of 1 float ✓
</pre>

<h3>Your Task</h3>
<p>Restructure the given kernel from an Array-of-Structures (AoS) pattern to a Structure-of-Arrays (SoA) pattern so that memory accesses are coalesced.</p>
`,
    starterCode: `// Coalesced Memory Access
// Transform this kernel from AoS to SoA pattern

// BAD: Array of Structures — uncoalesced access
// struct Particle { float x, y, z, vx, vy, vz; };
// __global__ void updateAoS(Particle* p, float dt, int n) {
//     int i = blockIdx.x * blockDim.x + threadIdx.x;
//     if (i < n) {
//         p[i].x += p[i].vx * dt;  // stride-6 access!
//         p[i].y += p[i].vy * dt;
//         p[i].z += p[i].vz * dt;
//     }
// }

// TODO: Rewrite using Structure of Arrays for coalesced access
// Each array (x, y, z, vx, vy, vz) is a separate float*
// so consecutive threads access consecutive memory locations

__global__ void updateSoA(
    float* x, float* y, float* z,
    const float* vx, const float* vy, const float* vz,
    float dt, int n)
{
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    // TODO: Bounds check

    // TODO: Update positions using velocities
    // x[i] += vx[i] * dt;  (and same for y, z)
}
`,
    solutionCode: `// Coalesced Memory Access — Structure of Arrays

__global__ void updateSoA(
    float* x, float* y, float* z,
    const float* vx, const float* vy, const float* vz,
    float dt, int n)
{
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    if (i < n) {
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;
        z[i] += vz[i] * dt;
    }
}
`,
    testCode: '',
    hints: [
      'The key insight: in the SoA version, thread <code>i</code> accesses <code>x[i]</code>, so consecutive threads access consecutive addresses. This is automatically coalesced.',
      'Start with the bounds check: <code>if (i < n)</code>.',
      'Each position update is one line: <code>x[i] += vx[i] * dt;</code>. Do the same for y and z.',
      'The AoS version had stride-6 access (sizeof Particle = 6 floats). The SoA version has stride-1 access. This alone can give 5-10x speedup.',
    ],
    concepts: [
      'coalesced access',
      'global memory',
      'memory transactions',
      'AoS vs SoA',
      'memory bandwidth',
      'stride',
    ],
    successPatterns: [
      'if\\s*\\(\\s*i\\s*<\\s*n\\s*\\)',
      'x\\[i\\]\\s*\\+=\\s*vx\\[i\\]\\s*\\*\\s*dt',
      'y\\[i\\]\\s*\\+=\\s*vy\\[i\\]\\s*\\*\\s*dt',
      'z\\[i\\]\\s*\\+=\\s*vz\\[i\\]\\s*\\*\\s*dt',
    ],
    testNames: [
      'includes bounds check (if i < n)',
      'updates x[i] with coalesced access pattern',
      'updates y[i] with coalesced access pattern',
      'updates z[i] with coalesced access pattern',
    ],
  },

  'cuda-shared-memory': {
    id: 'cuda-shared-memory',
    language: 'cuda',
    title: 'Shared Memory Matrix Transpose',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>Matrix transpose is the classic example of how <strong>shared memory</strong> transforms a memory-bound kernel. A naive transpose has terrible access patterns; tiling through shared memory fixes them.</p>

<h3>The Problem with Naive Transpose</h3>
<pre>
Reading A (row-major):            Writing B = A^T:
A[row][col] — coalesced reads     B[col][row] — strided writes!

Read:  T0→A[0][0], T1→A[0][1], T2→A[0][2]  ← consecutive ✓
Write: T0→B[0][0], T1→B[1][0], T2→B[2][0]  ← stride N ✗
</pre>

<h3>The Tiled Solution</h3>
<pre>
Step 1: Load a TILE_DIM x TILE_DIM tile into shared memory
        (coalesced read from global)
Step 2: __syncthreads()
Step 3: Write from shared memory with transposed indices
        (coalesced write to global)

┌──────────┐     ┌──────────┐     ┌──────────┐
│ Global A │ ──→ │ Shared   │ ──→ │ Global B │
│ (coalesce│     │ tile[][] │     │ (coalesce│
│  read)   │     │(transpose│     │  write)  │
└──────────┘     │ indices) │     └──────────┘
                 └──────────┘
</pre>

<h3>Bank Conflicts</h3>
<p>Shared memory is divided into 32 banks. If multiple threads in a warp access the same bank (but different addresses), they are serialized. Adding <strong>padding</strong> (<code>TILE_DIM+1</code>) avoids this.</p>

<h3>Your Task</h3>
<p>Implement the tiled matrix transpose using shared memory. Use padding to avoid bank conflicts.</p>
`,
    starterCode: `// Tiled Matrix Transpose with Shared Memory
#define TILE_DIM 32

__global__ void transposeShared(float* odata, const float* idata,
                                 int width, int height) {
    // TODO: Declare shared memory tile with padding to avoid bank conflicts
    // __shared__ float tile[TILE_DIM][TILE_DIM + 1];

    // Compute input coordinates
    int xIndex = blockIdx.x * TILE_DIM + threadIdx.x;
    int yIndex = blockIdx.y * TILE_DIM + threadIdx.y;

    // TODO: Load tile from global memory (coalesced read)
    // if (xIndex < width && yIndex < height)
    //     tile[threadIdx.y][threadIdx.x] = idata[yIndex * width + xIndex];

    // TODO: Synchronize — all loads must complete

    // Compute output coordinates (transposed block position)
    int outX = blockIdx.y * TILE_DIM + threadIdx.x;
    int outY = blockIdx.x * TILE_DIM + threadIdx.y;

    // TODO: Write transposed tile to global memory (coalesced write)
    // Note: read tile with transposed thread indices
    // if (outX < height && outY < width)
    //     odata[outY * height + outX] = tile[threadIdx.x][threadIdx.y];
}
`,
    solutionCode: `// Tiled Matrix Transpose with Shared Memory
#define TILE_DIM 32

__global__ void transposeShared(float* odata, const float* idata,
                                 int width, int height) {
    __shared__ float tile[TILE_DIM][TILE_DIM + 1];

    int xIndex = blockIdx.x * TILE_DIM + threadIdx.x;
    int yIndex = blockIdx.y * TILE_DIM + threadIdx.y;

    if (xIndex < width && yIndex < height)
        tile[threadIdx.y][threadIdx.x] = idata[yIndex * width + xIndex];

    __syncthreads();

    int outX = blockIdx.y * TILE_DIM + threadIdx.x;
    int outY = blockIdx.x * TILE_DIM + threadIdx.y;

    if (outX < height && outY < width)
        odata[outY * height + outX] = tile[threadIdx.x][threadIdx.y];
}
`,
    testCode: '',
    hints: [
      'The shared memory tile uses <code>TILE_DIM + 1</code> for the second dimension: <code>__shared__ float tile[TILE_DIM][TILE_DIM + 1];</code>. The +1 is padding to avoid bank conflicts.',
      'Load step: <code>tile[threadIdx.y][threadIdx.x] = idata[yIndex * width + xIndex];</code> — this is a coalesced read because consecutive threads read consecutive addresses.',
      'After loading, call <code>__syncthreads();</code> before any thread reads from the tile.',
      'Write step: <code>odata[outY * height + outX] = tile[threadIdx.x][threadIdx.y];</code> — note the swapped indices! threadIdx.x and threadIdx.y are swapped compared to the load.',
    ],
    concepts: [
      'shared memory',
      'matrix transpose',
      'bank conflicts',
      'padding',
      'tiling',
      'coalesced access',
    ],
    successPatterns: [
      '__shared__\\s+float\\s+tile\\[TILE_DIM\\]\\[TILE_DIM\\s*\\+\\s*1\\]',
      'tile\\[threadIdx\\.y\\]\\[threadIdx\\.x\\]\\s*=\\s*idata',
      '__syncthreads\\(\\)',
      'tile\\[threadIdx\\.x\\]\\[threadIdx\\.y\\]',
    ],
    testNames: [
      'declares shared tile with +1 padding for bank conflict avoidance',
      'loads tile with coalesced read pattern (tile[y][x] = idata[...])',
      'synchronizes threads between load and store',
      'writes with transposed indices (tile[x][y]) for coalesced output',
    ],
  },

  'cuda-tiling': {
    id: 'cuda-tiling',
    language: 'cuda',
    title: 'Tiled Matrix Multiplication',
    difficulty: 'advanced',
    order: 3,
    description: `
<p>Tiled matrix multiplication is the <strong>quintessential GPU optimization</strong>. By loading tiles into shared memory, we reduce global memory accesses from O(N) to O(N/TILE_WIDTH) per element.</p>

<h3>Why Tiling Matters</h3>
<pre>
Naive: Each thread computes C[row][col] by reading
       an entire row of A and column of B from global memory.
       → Each element of A and B is read N times total!

Tiled: Threads cooperatively load TILE x TILE chunks
       into shared memory, compute partial products,
       then move to the next tile.
       → Each element loaded from global only N/TILE times!

Arithmetic Intensity:
  Naive: 2 global loads per multiply → memory bound
  Tiled: 2 global loads per TILE multiplies → compute bound ✓
</pre>

<h3>The Algorithm</h3>
<pre>
C[row][col] = sum over k of A[row][k] * B[k][col]

For each tile phase p = 0, 1, ..., N/TILE - 1:
  1. Load A_tile: shared_A[ty][tx] = A[row][p*TILE + tx]
  2. Load B_tile: shared_B[ty][tx] = B[p*TILE + ty][col]
  3. __syncthreads()
  4. Accumulate: for k=0..TILE-1: sum += shared_A[ty][k] * shared_B[k][tx]
  5. __syncthreads()

C[row][col] = sum
</pre>

<pre>
     A (M x N)           B (N x P)            C (M x P)
  ┌─────┬────┐       ┌────┬────┐         ┌─────┬────┐
  │     │tile│ ──→   │tile│    │         │     │    │
  │     │ A  │       │ B  │    │  ──→    │     │ C  │
  │─────┼────│       │────┼────│         │─────┼────│
  │     │    │       │    │    │         │     │    │
  └─────┴────┘       └────┴────┘         └─────┴────┘
   Load row-tile      Load col-tile      Accumulate
   into shared_A      into shared_B      partial dot product
</pre>

<h3>Your Task</h3>
<p>Implement the inner loop of a tiled matrix multiply kernel. The loading and setup are provided; fill in the computation.</p>
`,
    starterCode: `// Tiled Matrix Multiplication: C = A * B
// A is M x N, B is N x P, C is M x P
#define TILE_WIDTH 16

__global__ void matMulTiled(const float* A, const float* B, float* C,
                             int M, int N, int P) {
    __shared__ float shared_A[TILE_WIDTH][TILE_WIDTH];
    __shared__ float shared_B[TILE_WIDTH][TILE_WIDTH];

    int row = blockIdx.y * TILE_WIDTH + threadIdx.y;
    int col = blockIdx.x * TILE_WIDTH + threadIdx.x;
    int tx = threadIdx.x;
    int ty = threadIdx.y;

    float sum = 0.0f;

    // Loop over tiles along the shared dimension (N)
    for (int t = 0; t < (N + TILE_WIDTH - 1) / TILE_WIDTH; t++) {

        // TODO: Load A tile — each thread loads one element
        // shared_A[ty][tx] = A[row * N + (t * TILE_WIDTH + tx)]
        // (with bounds check: use 0.0f if out of bounds)

        // TODO: Load B tile — each thread loads one element
        // shared_B[ty][tx] = B[(t * TILE_WIDTH + ty) * P + col]
        // (with bounds check: use 0.0f if out of bounds)

        // TODO: Synchronize after loading

        // TODO: Compute partial dot product for this tile
        // for (int k = 0; k < TILE_WIDTH; k++)
        //     sum += shared_A[ty][k] * shared_B[k][tx];

        // TODO: Synchronize before loading next tile
    }

    // Write result
    if (row < M && col < P) {
        C[row * P + col] = sum;
    }
}
`,
    solutionCode: `// Tiled Matrix Multiplication: C = A * B
#define TILE_WIDTH 16

__global__ void matMulTiled(const float* A, const float* B, float* C,
                             int M, int N, int P) {
    __shared__ float shared_A[TILE_WIDTH][TILE_WIDTH];
    __shared__ float shared_B[TILE_WIDTH][TILE_WIDTH];

    int row = blockIdx.y * TILE_WIDTH + threadIdx.y;
    int col = blockIdx.x * TILE_WIDTH + threadIdx.x;
    int tx = threadIdx.x;
    int ty = threadIdx.y;

    float sum = 0.0f;

    for (int t = 0; t < (N + TILE_WIDTH - 1) / TILE_WIDTH; t++) {

        if (row < M && (t * TILE_WIDTH + tx) < N)
            shared_A[ty][tx] = A[row * N + t * TILE_WIDTH + tx];
        else
            shared_A[ty][tx] = 0.0f;

        if ((t * TILE_WIDTH + ty) < N && col < P)
            shared_B[ty][tx] = B[(t * TILE_WIDTH + ty) * P + col];
        else
            shared_B[ty][tx] = 0.0f;

        __syncthreads();

        for (int k = 0; k < TILE_WIDTH; k++)
            sum += shared_A[ty][k] * shared_B[k][tx];

        __syncthreads();
    }

    if (row < M && col < P) {
        C[row * P + col] = sum;
    }
}
`,
    testCode: '',
    hints: [
      'For loading A: <code>shared_A[ty][tx] = (row < M && t*TILE_WIDTH+tx < N) ? A[row*N + t*TILE_WIDTH+tx] : 0.0f;</code>',
      'For loading B: <code>shared_B[ty][tx] = (t*TILE_WIDTH+ty < N && col < P) ? B[(t*TILE_WIDTH+ty)*P + col] : 0.0f;</code>',
      'You need TWO <code>__syncthreads()</code> calls: one after loading tiles (before compute), and one after computing (before loading next tile).',
      'The inner loop is: <code>for (int k = 0; k < TILE_WIDTH; k++) sum += shared_A[ty][k] * shared_B[k][tx];</code>. Each thread computes one element of the output tile.',
    ],
    concepts: [
      'tiled matrix multiplication',
      'shared memory tiling',
      'arithmetic intensity',
      'memory reuse',
      'tile loading',
      'partial dot product',
    ],
    successPatterns: [
      'shared_A\\[ty\\]\\[tx\\]\\s*=\\s*A\\[',
      'shared_B\\[ty\\]\\[tx\\]\\s*=\\s*B\\[',
      'shared_A\\[ty\\]\\[k\\]\\s*\\*\\s*shared_B\\[k\\]\\[tx\\]',
      '__syncthreads\\(\\)',
    ],
    testNames: [
      'loads A tile into shared memory with bounds checking',
      'loads B tile into shared memory with bounds checking',
      'computes partial dot product: shared_A[ty][k] * shared_B[k][tx]',
      'includes synchronization barriers between load and compute phases',
    ],
  },

  'cuda-occupancy': {
    id: 'cuda-occupancy',
    language: 'cuda',
    title: 'Occupancy and Resource Limits',
    difficulty: 'advanced',
    order: 4,
    description: `
<p><strong>Occupancy</strong> measures how well you utilize the GPU's streaming multiprocessors (SMs). It is the ratio of active warps to the maximum warps an SM can support. Higher occupancy generally hides latency better.</p>

<h3>SM Resources (example: A100 GPU)</h3>
<pre>
Resource                    Limit per SM
──────────────────────────────────────────
Max threads per SM:         2048
Max warps per SM:           64  (2048 / 32)
Max blocks per SM:          32
Shared memory per SM:       164 KB
Registers per SM:           65536
Max threads per block:      1024
</pre>

<h3>What Limits Occupancy?</h3>
<pre>
Your kernel uses:
  - 256 threads/block → 8 warps/block
  - 48 registers/thread → 256 * 48 = 12288 regs/block
  - 4 KB shared memory/block

How many blocks fit on one SM?
  By threads: 2048 / 256 = 8 blocks
  By registers: 65536 / 12288 = 5 blocks (floor)
  By shared mem: 164 KB / 4 KB = 41 blocks
  By block limit: 32 blocks

  BOTTLENECK: registers → 5 blocks max
  Active warps: 5 * 8 = 40 out of 64
  Occupancy: 40 / 64 = 62.5%
</pre>

<h3>Improving Occupancy</h3>
<ul>
  <li>Reduce registers per thread (use <code>__launch_bounds__</code>, simpler code, or <code>-maxrregcount</code>)</li>
  <li>Reduce shared memory per block (smaller tiles, dynamic allocation)</li>
  <li>Adjust block size to balance resources</li>
</ul>

<h3>Your Task</h3>
<p>Analyze three kernel configurations and compute their occupancy. Replace each <code>-1</code> with the correct value.</p>
`,
    starterCode: `// Occupancy Analysis — Predict the Answer
// GPU: A100-like specs
// Max threads/SM: 2048, Max warps/SM: 64, Max blocks/SM: 32
// Registers/SM: 65536, Shared memory/SM: 164 KB (167936 bytes)

// ============================================
// Kernel A: 512 threads/block, 32 regs/thread, 0 shared mem
// ============================================
const int kernelA_warps_per_block = -1;      // 512 / 32
const int kernelA_blocks_by_threads = -1;    // 2048 / 512
const int kernelA_blocks_by_regs = -1;       // 65536 / (512 * 32)
const int kernelA_max_blocks = -1;           // min of all limits
const int kernelA_active_warps = -1;         // max_blocks * warps_per_block
const int kernelA_occupancy_pct = -1;        // (active_warps / 64) * 100

// ============================================
// Kernel B: 256 threads/block, 64 regs/thread, 32 KB shared
// ============================================
const int kernelB_warps_per_block = -1;      // 256 / 32
const int kernelB_blocks_by_threads = -1;    // 2048 / 256
const int kernelB_blocks_by_regs = -1;       // 65536 / (256 * 64)
const int kernelB_blocks_by_shmem = -1;      // 167936 / 32768
const int kernelB_max_blocks = -1;           // min of all limits
const int kernelB_active_warps = -1;         // max_blocks * warps_per_block
const int kernelB_occupancy_pct = -1;        // (active_warps / 64) * 100

// ============================================
// Kernel C: 1024 threads/block, 24 regs/thread, 48 KB shared
// ============================================
const int kernelC_warps_per_block = -1;      // 1024 / 32
const int kernelC_blocks_by_threads = -1;    // 2048 / 1024
const int kernelC_blocks_by_regs = -1;       // 65536 / (1024 * 24)
const int kernelC_blocks_by_shmem = -1;      // 167936 / 49152
const int kernelC_max_blocks = -1;           // min of all limits
const int kernelC_active_warps = -1;         // max_blocks * warps_per_block
const int kernelC_occupancy_pct = -1;        // (active_warps / 64) * 100
`,
    solutionCode: `// Occupancy Analysis — Solutions

// Kernel A: 512 threads/block, 32 regs/thread, 0 shared mem
const int kernelA_warps_per_block = 16;      // 512 / 32
const int kernelA_blocks_by_threads = 4;     // 2048 / 512
const int kernelA_blocks_by_regs = 4;        // 65536 / (512 * 32) = 65536/16384 = 4
const int kernelA_max_blocks = 4;            // min(4, 4, 32) = 4
const int kernelA_active_warps = 64;         // 4 * 16
const int kernelA_occupancy_pct = 100;       // (64 / 64) * 100

// Kernel B: 256 threads/block, 64 regs/thread, 32 KB shared
const int kernelB_warps_per_block = 8;       // 256 / 32
const int kernelB_blocks_by_threads = 8;     // 2048 / 256
const int kernelB_blocks_by_regs = 4;        // 65536 / (256 * 64) = 65536/16384 = 4
const int kernelB_blocks_by_shmem = 5;       // 167936 / 32768 = 5.12 → floor = 5
const int kernelB_max_blocks = 4;            // min(8, 4, 5, 32) = 4
const int kernelB_active_warps = 32;         // 4 * 8
const int kernelB_occupancy_pct = 50;        // (32 / 64) * 100

// Kernel C: 1024 threads/block, 24 regs/thread, 48 KB shared
const int kernelC_warps_per_block = 32;      // 1024 / 32
const int kernelC_blocks_by_threads = 2;     // 2048 / 1024
const int kernelC_blocks_by_regs = 2;        // 65536 / (1024 * 24) = 65536/24576 = 2.67 → floor = 2
const int kernelC_blocks_by_shmem = 3;       // 167936 / 49152 = 3.42 → floor = 3
const int kernelC_max_blocks = 2;            // min(2, 2, 3, 32) = 2
const int kernelC_active_warps = 64;         // 2 * 32
const int kernelC_occupancy_pct = 100;       // (64 / 64) * 100
`,
    testCode: '',
    hints: [
      'Warps per block = threads per block / 32. Blocks by threads = max threads per SM / threads per block.',
      'Blocks by registers = floor(registers per SM / (threads per block * registers per thread)). Always round down.',
      'Blocks by shared memory = floor(shared memory per SM / shared memory per block). For Kernel B: floor(167936 / 32768) = 5.',
      'The maximum blocks that fit is the <strong>minimum</strong> across all resource limits (threads, registers, shared mem, block limit). Occupancy = (max_blocks * warps_per_block) / max_warps_per_SM * 100.',
    ],
    concepts: [
      'occupancy',
      'streaming multiprocessor',
      'register pressure',
      'shared memory budget',
      'warp scheduling',
      'launch bounds',
      'resource limits',
    ],
    successPatterns: [
      'kernelA_occupancy_pct\\s*=\\s*100',
      'kernelB_occupancy_pct\\s*=\\s*50',
      'kernelC_occupancy_pct\\s*=\\s*100',
      'kernelB_max_blocks\\s*=\\s*4',
      'kernelC_blocks_by_regs\\s*=\\s*2',
    ],
    testNames: [
      'Kernel A achieves 100% occupancy',
      'Kernel B occupancy is 50% (register-limited)',
      'Kernel C achieves 100% occupancy',
      'Kernel B max blocks correctly computed as 4',
      'Kernel C register limit correctly computed as 2 blocks',
    ],
  },

  // ─────────────────────────────────────────────
  // Module 3: Advanced Patterns
  // ─────────────────────────────────────────────

  'cuda-warp-primitives': {
    id: 'cuda-warp-primitives',
    language: 'cuda',
    title: 'Warp-Level Primitives',
    difficulty: 'advanced',
    order: 1,
    description: `
<p>Warp-level primitives allow threads within a <strong>warp</strong> (32 threads executing in lockstep) to communicate directly through registers — no shared memory needed. This is both faster and simpler for many patterns.</p>

<h3>Key Primitives</h3>
<table>
  <thead><tr><th>Primitive</th><th>What It Does</th></tr></thead>
  <tbody>
    <tr><td><code>__shfl_sync(mask, val, src)</code></td><td>Read <code>val</code> from thread <code>src</code></td></tr>
    <tr><td><code>__shfl_down_sync(mask, val, delta)</code></td><td>Read <code>val</code> from thread <code>lane + delta</code></td></tr>
    <tr><td><code>__shfl_up_sync(mask, val, delta)</code></td><td>Read <code>val</code> from thread <code>lane - delta</code></td></tr>
    <tr><td><code>__shfl_xor_sync(mask, val, mask)</code></td><td>Read from thread <code>lane XOR mask</code></td></tr>
    <tr><td><code>__ballot_sync(mask, pred)</code></td><td>Bitmask of threads where <code>pred</code> is true</td></tr>
    <tr><td><code>__popc(mask)</code></td><td>Count set bits (population count)</td></tr>
  </tbody>
</table>

<h3>Warp Reduction with Shuffle</h3>
<pre>
__shfl_down_sync: each thread reads from the thread 'delta' lanes ahead

Initial:  [a0] [a1] [a2] [a3] [a4] [a5] [a6] [a7] ...
delta=16: [a0+a16] [a1+a17] ...
delta=8:  [a0+a16+a8+a24] ...
delta=4:  ...
delta=2:  ...
delta=1:  [sum of all 32 values in lane 0]

Key: NO shared memory, NO __syncthreads()!
</pre>

<h3>The Mask Parameter</h3>
<p><code>0xFFFFFFFF</code> means "all 32 threads participate." Always use the full mask unless you intentionally want a subset. This was mandatory starting with Volta (independent thread scheduling).</p>

<h3>Your Task</h3>
<p>Implement a warp-level reduction (sum) using <code>__shfl_down_sync</code>. Then use it in a block reduction that only needs shared memory for cross-warp communication.</p>
`,
    starterCode: `// Warp-Level Reduction using Shuffle Primitives
#define FULL_MASK 0xFFFFFFFF
#define WARP_SIZE 32

// TODO: Implement warp-level reduction
// Sum all values within a single warp using __shfl_down_sync
__device__ float warpReduce(float val) {
    // Iteratively halve the distance:
    // delta = 16, 8, 4, 2, 1
    // At each step: val += __shfl_down_sync(FULL_MASK, val, delta);

    // TODO: Implement the 5 shuffle-down steps

    return val;  // Lane 0 now has the sum of all 32 values
}

// Block-level reduction using warp reduction
__global__ void blockReduceWarp(const float* input, float* output, int n) {
    // Only need shared memory for cross-warp sums
    __shared__ float warp_sums[32];  // max 32 warps per block

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int lane = tid % WARP_SIZE;
    int warpId = tid / WARP_SIZE;

    float val = (i < n) ? input[i] : 0.0f;

    // TODO: Reduce within each warp
    // val = warpReduce(val);

    // TODO: First thread of each warp stores to shared memory
    // if (lane == 0) warp_sums[warpId] = val;

    // TODO: Synchronize

    // TODO: First warp reduces the warp sums
    // val = (tid < blockDim.x / WARP_SIZE) ? warp_sums[lane] : 0.0f;
    // if (warpId == 0) val = warpReduce(val);

    if (tid == 0) output[blockIdx.x] = val;
}
`,
    solutionCode: `// Warp-Level Reduction using Shuffle Primitives
#define FULL_MASK 0xFFFFFFFF
#define WARP_SIZE 32

__device__ float warpReduce(float val) {
    val += __shfl_down_sync(FULL_MASK, val, 16);
    val += __shfl_down_sync(FULL_MASK, val, 8);
    val += __shfl_down_sync(FULL_MASK, val, 4);
    val += __shfl_down_sync(FULL_MASK, val, 2);
    val += __shfl_down_sync(FULL_MASK, val, 1);
    return val;
}

__global__ void blockReduceWarp(const float* input, float* output, int n) {
    __shared__ float warp_sums[32];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int lane = tid % WARP_SIZE;
    int warpId = tid / WARP_SIZE;

    float val = (i < n) ? input[i] : 0.0f;

    val = warpReduce(val);

    if (lane == 0) warp_sums[warpId] = val;

    __syncthreads();

    val = (tid < blockDim.x / WARP_SIZE) ? warp_sums[lane] : 0.0f;
    if (warpId == 0) val = warpReduce(val);

    if (tid == 0) output[blockIdx.x] = val;
}
`,
    testCode: '',
    hints: [
      'The warp reduction is 5 lines: <code>val += __shfl_down_sync(FULL_MASK, val, 16);</code> then 8, 4, 2, 1. Each step halves the distance.',
      'After <code>warpReduce(val)</code>, only lane 0 of each warp has the correct sum. Store it: <code>if (lane == 0) warp_sums[warpId] = val;</code>',
      'You need one <code>__syncthreads()</code> between writing warp_sums and reading it. The first warp then reduces the warp sums.',
      'The final reduction: load from warp_sums if this thread has a valid warp to sum, otherwise 0. Then warp 0 does the final warpReduce.',
    ],
    concepts: [
      '__shfl_down_sync',
      'warp primitives',
      'warp reduction',
      'shuffle instructions',
      'lane ID',
      'cross-warp communication',
    ],
    successPatterns: [
      '__shfl_down_sync\\(FULL_MASK,\\s*val,\\s*16\\)',
      '__shfl_down_sync\\(FULL_MASK,\\s*val,\\s*1\\)',
      'warpReduce\\(val\\)',
      'if\\s*\\(\\s*lane\\s*==\\s*0\\s*\\)\\s*warp_sums\\[warpId\\]',
    ],
    testNames: [
      'uses __shfl_down_sync with delta 16 for first reduction step',
      'uses __shfl_down_sync with delta 1 for final reduction step',
      'calls warpReduce for intra-warp reduction',
      'lane 0 stores warp sum to shared memory',
    ],
  },

  'cuda-reduction': {
    id: 'cuda-reduction',
    language: 'cuda',
    title: 'Parallel Reduction Strategies',
    difficulty: 'advanced',
    order: 2,
    description: `
<p><strong>Parallel reduction</strong> is one of the most fundamental GPU algorithms. We explore three strategies, each improving on the last, revealing key GPU performance principles.</p>

<h3>Strategy 1: Interleaved Addressing (Divergent)</h3>
<pre>
Step 0: stride=1    [a0+a1] [a1] [a2+a3] [a3] [a4+a5] [a5] [a6+a7] [a7]
Step 1: stride=2    [s01+s23] ...  [s01]  ...  [s45+s67] ...
Step 2: stride=4    [total] ...

Problem: threads 0,2,4,6 active at step 0 → warp divergence!
         Only EVEN threads work, but ODD threads still occupy the warp.
</pre>

<h3>Strategy 2: Sequential Addressing (No Divergence)</h3>
<pre>
Step 0: stride=N/2  [a0+a4] [a1+a5] [a2+a6] [a3+a7] | [a4] [a5] [a6] [a7]
Step 1: stride=N/4  [s04+s26] [s15+s37] | ...
Step 2: stride=1    [total] | ...

Better: first N/2 threads work, then N/4, etc.
        Contiguous threads → no warp divergence!
</pre>

<h3>Strategy 3: First-Add-During-Load</h3>
<pre>
Launch N/2 threads instead of N.
Each thread loads TWO elements and adds them:
  shared[tid] = input[i] + input[i + blockDim.x];

Then reduce as in Strategy 2.
Result: half the blocks, same work. Free performance!
</pre>

<h3>Your Task</h3>
<p>Implement Strategy 2 (sequential addressing) and Strategy 3 (first-add-during-load). Both avoid warp divergence.</p>
`,
    starterCode: `// Parallel Reduction Strategies

// Strategy 2: Sequential Addressing — no warp divergence
__global__ void reduceSequential(const float* input, float* output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    sdata[tid] = (i < n) ? input[i] : 0.0f;
    __syncthreads();

    // TODO: Reduction with sequential addressing
    // Start with stride = blockDim.x / 2, halve each step
    // Active threads: 0 to stride-1 (contiguous!)
    // for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
    //     if (tid < stride) {
    //         sdata[tid] += sdata[tid + stride];
    //     }
    //     __syncthreads();
    // }

    if (tid == 0) output[blockIdx.x] = sdata[0];
}

// Strategy 3: First-Add-During-Load
// Launch with HALF the number of threads!
__global__ void reduceFirstAdd(const float* input, float* output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * (blockDim.x * 2) + threadIdx.x;

    // TODO: Load two elements and add them
    // Each thread is responsible for TWO input elements
    // sdata[tid] = input[i] + input[i + blockDim.x];
    // (with bounds checking)

    // TODO: Synchronize after load

    // TODO: Same sequential reduction as Strategy 2
    // for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) ...

    if (tid == 0) output[blockIdx.x] = sdata[0];
}
`,
    solutionCode: `// Parallel Reduction Strategies

// Strategy 2: Sequential Addressing
__global__ void reduceSequential(const float* input, float* output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    sdata[tid] = (i < n) ? input[i] : 0.0f;
    __syncthreads();

    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride) {
            sdata[tid] += sdata[tid + stride];
        }
        __syncthreads();
    }

    if (tid == 0) output[blockIdx.x] = sdata[0];
}

// Strategy 3: First-Add-During-Load
__global__ void reduceFirstAdd(const float* input, float* output, int n) {
    __shared__ float sdata[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * (blockDim.x * 2) + threadIdx.x;

    float a = (i < n) ? input[i] : 0.0f;
    float b = (i + blockDim.x < n) ? input[i + blockDim.x] : 0.0f;
    sdata[tid] = a + b;

    __syncthreads();

    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride) {
            sdata[tid] += sdata[tid + stride];
        }
        __syncthreads();
    }

    if (tid == 0) output[blockIdx.x] = sdata[0];
}
`,
    testCode: '',
    hints: [
      'Strategy 2 is identical to the basic reduction from the sync exercise but written with the "stride starts large" pattern: <code>for (int stride = blockDim.x/2; stride > 0; stride >>= 1)</code>.',
      'The key: <code>if (tid < stride)</code> means contiguous threads are active. Threads 0..stride-1 all work, the rest idle. No warp divergence.',
      'For Strategy 3, the grid is launched with half the blocks. Each thread loads two elements: <code>sdata[tid] = input[i] + input[i + blockDim.x];</code> with bounds checks.',
      'Both strategies use the same reduction loop. The only difference is how data is loaded into shared memory.',
    ],
    concepts: [
      'parallel reduction',
      'warp divergence',
      'sequential addressing',
      'first-add-during-load',
      'algorithmic optimization',
      'thread utilization',
    ],
    successPatterns: [
      'sdata\\[tid\\]\\s*\\+=\\s*sdata\\[tid\\s*\\+\\s*stride\\]',
      'input\\[i\\s*\\+\\s*blockDim',
      'for\\s*\\(\\s*int\\s+stride\\s*=\\s*blockDim\\.x\\s*/\\s*2',
      '__syncthreads\\(\\)',
    ],
    testNames: [
      'implements sequential addressing reduction (sdata[tid] += sdata[tid + stride])',
      'loads two elements per thread in first-add strategy',
      'uses correct loop structure starting at blockDim.x / 2',
      'includes synchronization in reduction loop',
    ],
  },

  'cuda-scan': {
    id: 'cuda-scan',
    language: 'cuda',
    title: 'Parallel Prefix Sum (Scan)',
    difficulty: 'advanced',
    order: 3,
    description: `
<p><strong>Prefix sum</strong> (scan) computes running totals and is a fundamental building block for parallel sort, stream compaction, radix sort, and more. The <strong>Blelloch scan</strong> is work-efficient with O(N) work and O(log N) span.</p>

<h3>Inclusive vs Exclusive Scan</h3>
<pre>
Input:          [3,  1,  7,  0,  4,  1,  6,  3]

Inclusive scan: [3,  4, 11, 11, 15, 16, 22, 25]
  (element i = sum of input[0..i])

Exclusive scan: [0,  3,  4, 11, 11, 15, 16, 22]
  (element i = sum of input[0..i-1])
</pre>

<h3>Blelloch Scan Algorithm</h3>
<p>Two phases: <strong>up-sweep</strong> (reduce) and <strong>down-sweep</strong> (distribute).</p>

<pre>
UP-SWEEP (reduce phase):
  Build partial sums bottom-up
  [3, 1, 7, 0, 4, 1, 6, 3]
  [3, 4, 7, 7, 4, 5, 6, 9]     stride=1: pairs
  [3, 4, 7,11, 4, 5, 6,14]     stride=2: quads
  [3, 4, 7,11, 4, 5, 6,25]     stride=4: full sum at end

DOWN-SWEEP (distribute phase):
  Set last to 0, distribute partial sums top-down
  [3, 4, 7,11, 4, 5, 6, 0]     set last = 0
  [3, 4, 7, 0, 4, 5, 6,11]     stride=4: swap+add
  [3, 4, 7, 0, 4, 5, 6,11]
  [3, 0, 7, 4, 4,11, 6,14]     stride=2: swap+add
  [0, 3, 4,11,11,15,16,22]     stride=1: swap+add

Result: exclusive prefix sum!
</pre>

<h3>Your Task</h3>
<p>Implement the up-sweep and down-sweep phases of the Blelloch scan for a single block.</p>
`,
    starterCode: `// Blelloch Exclusive Scan (single block)
// Work-efficient O(N) work, O(log N) span

__global__ void blellochScan(float* data, int n) {
    extern __shared__ float temp[];

    int tid = threadIdx.x;

    // Load into shared memory
    temp[2 * tid]     = (2 * tid < n)     ? data[2 * tid]     : 0.0f;
    temp[2 * tid + 1] = (2 * tid + 1 < n) ? data[2 * tid + 1] : 0.0f;
    __syncthreads();

    // ==============================
    // UP-SWEEP (reduce) phase
    // ==============================
    // TODO: Build partial sums bottom-up
    // for (int stride = 1; stride <= n/2; stride *= 2) {
    //     int idx = (tid + 1) * stride * 2 - 1;
    //     if (idx < n) {
    //         temp[idx] += temp[idx - stride];
    //     }
    //     __syncthreads();
    // }

    // TODO: Set last element to 0 (identity for exclusive scan)
    // if (tid == 0) temp[n - 1] = 0.0f;
    // __syncthreads();

    // ==============================
    // DOWN-SWEEP (distribute) phase
    // ==============================
    // TODO: Distribute partial sums top-down
    // for (int stride = n/2; stride >= 1; stride /= 2) {
    //     int idx = (tid + 1) * stride * 2 - 1;
    //     if (idx < n) {
    //         float t = temp[idx - stride];  // save left child
    //         temp[idx - stride] = temp[idx]; // left = parent
    //         temp[idx] += t;                 // parent = parent + old_left
    //     }
    //     __syncthreads();
    // }

    // Write result back
    if (2 * tid < n)     data[2 * tid]     = temp[2 * tid];
    if (2 * tid + 1 < n) data[2 * tid + 1] = temp[2 * tid + 1];
}
`,
    solutionCode: `// Blelloch Exclusive Scan (single block)

__global__ void blellochScan(float* data, int n) {
    extern __shared__ float temp[];

    int tid = threadIdx.x;

    temp[2 * tid]     = (2 * tid < n)     ? data[2 * tid]     : 0.0f;
    temp[2 * tid + 1] = (2 * tid + 1 < n) ? data[2 * tid + 1] : 0.0f;
    __syncthreads();

    // UP-SWEEP (reduce) phase
    for (int stride = 1; stride <= n / 2; stride *= 2) {
        int idx = (tid + 1) * stride * 2 - 1;
        if (idx < n) {
            temp[idx] += temp[idx - stride];
        }
        __syncthreads();
    }

    // Set last element to 0
    if (tid == 0) temp[n - 1] = 0.0f;
    __syncthreads();

    // DOWN-SWEEP (distribute) phase
    for (int stride = n / 2; stride >= 1; stride /= 2) {
        int idx = (tid + 1) * stride * 2 - 1;
        if (idx < n) {
            float t = temp[idx - stride];
            temp[idx - stride] = temp[idx];
            temp[idx] += t;
        }
        __syncthreads();
    }

    if (2 * tid < n)     data[2 * tid]     = temp[2 * tid];
    if (2 * tid + 1 < n) data[2 * tid + 1] = temp[2 * tid + 1];
}
`,
    testCode: '',
    hints: [
      'The up-sweep doubles the stride each iteration: <code>for (int stride = 1; stride <= n/2; stride *= 2)</code>. Each active thread adds <code>temp[idx - stride]</code> to <code>temp[idx]</code>.',
      'After the up-sweep, the last element holds the total sum. Set it to 0 for exclusive scan: <code>if (tid == 0) temp[n-1] = 0.0f;</code>',
      'The down-sweep halves the stride each iteration. At each step: save left child, replace left with parent, add old left to parent.',
      'Every phase boundary needs <code>__syncthreads()</code>. That means sync after each stride iteration, and between the up-sweep and down-sweep.',
    ],
    concepts: [
      'prefix sum',
      'exclusive scan',
      'Blelloch scan',
      'up-sweep',
      'down-sweep',
      'work efficiency',
      'parallel primitives',
    ],
    successPatterns: [
      'temp\\[idx\\]\\s*\\+=\\s*temp\\[idx\\s*-\\s*stride\\]',
      'temp\\[n\\s*-\\s*1\\]\\s*=\\s*0',
      'temp\\[idx\\s*-\\s*stride\\]\\s*=\\s*temp\\[idx\\]',
      'temp\\[idx\\]\\s*\\+=\\s*t',
    ],
    testNames: [
      'up-sweep adds temp[idx - stride] to temp[idx]',
      'sets last element to 0 for exclusive scan',
      'down-sweep distributes: left child gets parent value',
      'down-sweep accumulates: parent gets parent + old left',
    ],
  },

  'cuda-performance': {
    id: 'cuda-performance',
    language: 'cuda',
    title: 'Kernel Performance Analysis',
    difficulty: 'advanced',
    order: 4,
    description: `
<p>The capstone exercise: given a kernel and its performance profile, <strong>identify the bottleneck</strong> and apply the correct optimization. Real GPU optimization requires understanding whether a kernel is <em>memory-bound</em> or <em>compute-bound</em>.</p>

<h3>Roofline Model</h3>
<pre>
Performance │
(GFLOPS)    │         ╱─────── Peak Compute
            │        ╱
            │       ╱
            │      ╱
            │     ╱
            │    ╱    ← Ridge Point
            │   ╱
            │  ╱
            │ ╱  ← Memory-bound region
            │╱
            └──────────────────────────
             Arithmetic Intensity (FLOPS/byte)

If your kernel is LEFT of the ridge: memory-bound → optimize memory
If your kernel is RIGHT of the ridge: compute-bound → optimize math
</pre>

<h3>Key Metrics</h3>
<table>
  <thead><tr><th>Metric</th><th>What It Means</th><th>Bottleneck Signal</th></tr></thead>
  <tbody>
    <tr><td>Memory throughput</td><td>GB/s achieved vs peak</td><td>&gt;80% of peak → memory-bound</td></tr>
    <tr><td>Compute throughput</td><td>GFLOPS achieved vs peak</td><td>&gt;80% of peak → compute-bound</td></tr>
    <tr><td>Arithmetic intensity</td><td>FLOPs per byte loaded</td><td>Low → memory-bound</td></tr>
    <tr><td>Occupancy</td><td>Active warps / max warps</td><td>Low → latency not hidden</td></tr>
    <tr><td>Warp stalls</td><td>Why warps are stalled</td><td>Memory/sync/other</td></tr>
  </tbody>
</table>

<h3>Your Task</h3>
<p>Analyze three kernel profiles and determine: (1) the bottleneck type, (2) the primary optimization to apply. Then fix a provided kernel using the technique you identified.</p>
`,
    starterCode: `// Kernel Performance Analysis — Capstone

// ============================================
// PART 1: Profile Analysis (replace "UNKNOWN")
// ============================================

// Kernel X profile:
//   Compute throughput: 15% of peak
//   Memory throughput: 92% of peak
//   Arithmetic intensity: 0.25 FLOPS/byte
//   Occupancy: 87%
const char* kernelX_bottleneck = "UNKNOWN";  // "MEMORY" or "COMPUTE"
const char* kernelX_optimization = "UNKNOWN";
// Options: "TILING", "COALESCING", "REDUCE_REGISTERS", "LOOP_UNROLLING"

// Kernel Y profile:
//   Compute throughput: 78% of peak
//   Memory throughput: 23% of peak
//   Arithmetic intensity: 48.0 FLOPS/byte
//   Occupancy: 95%
const char* kernelY_bottleneck = "UNKNOWN";  // "MEMORY" or "COMPUTE"
const char* kernelY_optimization = "UNKNOWN";
// Options: "TILING", "FAST_MATH", "REDUCE_REGISTERS", "COALESCING"

// Kernel Z profile:
//   Compute throughput: 8% of peak
//   Memory throughput: 12% of peak
//   Arithmetic intensity: 2.0 FLOPS/byte
//   Occupancy: 25%
const char* kernelZ_bottleneck = "UNKNOWN";  // "MEMORY", "COMPUTE", or "LATENCY"
const char* kernelZ_optimization = "UNKNOWN";
// Options: "INCREASE_OCCUPANCY", "COALESCING", "TILING", "FAST_MATH"

// ============================================
// PART 2: Apply the optimization
// This kernel has uncoalesced access. Fix it.
// ============================================

#define N 1024

// BAD: Column-major access in a row-major array
__global__ void sumColumns(const float* matrix, float* colSums, int rows, int cols) {
    int col = blockIdx.x * blockDim.x + threadIdx.x;

    if (col < cols) {
        float sum = 0.0f;
        for (int row = 0; row < rows; row++) {
            // TODO: This access pattern is already coalesced!
            // The real problem is the SERIAL loop over rows.
            // Use atomicAdd or a parallel reduction instead.
            // For now, just ensure the access is correct:
            sum += matrix[row * cols + col];
        }
        colSums[col] = sum;
    }
}

// BETTER: Use shared memory tiling to process a tile of rows at a time
__global__ void sumColumnsTiled(const float* matrix, float* colSums,
                                 int rows, int cols) {
    // TODO: Implement a tiled version that processes TILE rows at a time
    // using shared memory to stage data
    // __shared__ float tile[TILE][BLOCK_SIZE];

    int col = blockIdx.x * blockDim.x + threadIdx.x;
    if (col >= cols) return;

    float sum = 0.0f;

    // TODO: Process rows in tiles
    // for (int tileStart = 0; tileStart < rows; tileStart += TILE) {
    //     // Load tile into shared memory cooperatively
    //     // Reduce within tile
    //     // Accumulate into sum
    // }

    colSums[col] = sum;
}
`,
    solutionCode: `// Kernel Performance Analysis — Solutions

// PART 1: Profile Analysis
// Kernel X: 92% memory throughput, low arithmetic intensity → memory-bound
const char* kernelX_bottleneck = "MEMORY";
const char* kernelX_optimization = "TILING";

// Kernel Y: 78% compute throughput, high arithmetic intensity → compute-bound
const char* kernelY_bottleneck = "COMPUTE";
const char* kernelY_optimization = "FAST_MATH";

// Kernel Z: Low everything, only 25% occupancy → latency-bound
const char* kernelZ_bottleneck = "LATENCY";
const char* kernelZ_optimization = "INCREASE_OCCUPANCY";

// PART 2: Tiled column sum
#define N 1024
#define TILE_ROWS 32

__global__ void sumColumnsTiled(const float* matrix, float* colSums,
                                 int rows, int cols) {
    __shared__ float tile[TILE_ROWS][256];

    int col = blockIdx.x * blockDim.x + threadIdx.x;
    if (col >= cols) return;

    float sum = 0.0f;

    for (int tileStart = 0; tileStart < rows; tileStart += TILE_ROWS) {
        int row = tileStart + threadIdx.y;
        if (row < rows)
            tile[threadIdx.y][threadIdx.x] = matrix[row * cols + col];
        else
            tile[threadIdx.y][threadIdx.x] = 0.0f;

        __syncthreads();

        for (int k = 0; k < TILE_ROWS; k++)
            sum += tile[k][threadIdx.x];

        __syncthreads();
    }

    colSums[col] = sum;
}
`,
    testCode: '',
    hints: [
      'Kernel X has 92% memory throughput and 0.25 FLOPS/byte — it is clearly <strong>memory-bound</strong>. Tiling reduces global memory traffic.',
      'Kernel Y has 78% compute throughput and 48 FLOPS/byte — it is <strong>compute-bound</strong>. Fast math (<code>--use_fast_math</code>) trades precision for speed.',
      'Kernel Z has low everything with only 25% occupancy — it is <strong>latency-bound</strong>. The GPU cannot hide memory latency because too few warps are active.',
      'For the tiled kernel, declare shared memory, load a tile of rows cooperatively, sync, then accumulate the tile locally before moving to the next tile.',
    ],
    concepts: [
      'roofline model',
      'memory-bound',
      'compute-bound',
      'latency-bound',
      'arithmetic intensity',
      'occupancy',
      'performance profiling',
      'tiling optimization',
    ],
    successPatterns: [
      'kernelX_bottleneck\\s*=\\s*"MEMORY"',
      'kernelY_bottleneck\\s*=\\s*"COMPUTE"',
      'kernelZ_bottleneck\\s*=\\s*"LATENCY"',
      'kernelZ_optimization\\s*=\\s*"INCREASE_OCCUPANCY"',
      '__shared__',
    ],
    testNames: [
      'correctly identifies Kernel X as memory-bound',
      'correctly identifies Kernel Y as compute-bound',
      'correctly identifies Kernel Z as latency-bound',
      'prescribes occupancy increase for latency-bound kernel',
      'uses shared memory in tiled optimization',
    ],
  },
};
