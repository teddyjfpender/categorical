import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  // ─────────────────────────────────────────────
  // Module 1: HIP Fundamentals
  // "Write once, run everywhere (almost)"
  // ─────────────────────────────────────────────

  'rocm-hip-basics': {
    id: 'rocm-hip-basics',
    language: 'rocm',
    title: 'HIP: The Portability Promise',
    difficulty: 'beginner',
    order: 1,
    description: `
<h3>Why Portability Matters</h3>
<p>The GPU market is not a monopoly. NVIDIA dominates training, but AMD powers many supercomputers (Frontier, El Capitan), and the cloud offers both. Writing vendor-locked code means rewriting when hardware changes. <strong>HIP is AMD's answer to this problem.</strong></p>

<h3>The Promise: One Source, Two Backends</h3>
<pre>
Your HIP Code
     │
     ├──→ hipcc --platform nvidia  →  Runs on NVIDIA GPUs (via CUDA)
     │
     └──→ hipcc --platform amd     →  Runs on AMD GPUs (via ROCm)
</pre>

<p>HIP mirrors CUDA's API almost exactly. The kernel syntax, thread indexing, memory management — all identical. The differences are in the <em>runtime library names</em> and a few behavioral details.</p>

<h3>What Is Truly Identical</h3>
<table>
  <thead><tr><th>Feature</th><th>CUDA</th><th>HIP</th><th>Identical?</th></tr></thead>
  <tbody>
    <tr><td>Kernel declaration</td><td><code>__global__ void f()</code></td><td><code>__global__ void f()</code></td><td>Yes</td></tr>
    <tr><td>Launch syntax</td><td><code>f&lt;&lt;&lt;g,b&gt;&gt;&gt;()</code></td><td><code>f&lt;&lt;&lt;g,b&gt;&gt;&gt;()</code></td><td>Yes</td></tr>
    <tr><td>Thread indexing</td><td><code>threadIdx.x</code></td><td><code>threadIdx.x</code></td><td>Yes</td></tr>
    <tr><td>Shared memory</td><td><code>__shared__</code></td><td><code>__shared__</code></td><td>Yes</td></tr>
    <tr><td>Synchronization</td><td><code>__syncthreads()</code></td><td><code>__syncthreads()</code></td><td>Yes</td></tr>
    <tr><td>Memory alloc</td><td><code>cudaMalloc</code></td><td><code>hipMalloc</code></td><td>API rename only</td></tr>
    <tr><td>Memory copy</td><td><code>cudaMemcpy</code></td><td><code>hipMemcpy</code></td><td>API rename only</td></tr>
    <tr><td>Device sync</td><td><code>cudaDeviceSynchronize</code></td><td><code>hipDeviceSynchronize</code></td><td>API rename only</td></tr>
  </tbody>
</table>

<h3>What Is NOT Identical (The Fine Print)</h3>
<pre>
1. Warp size: NVIDIA = 32, AMD = 64 (this matters for reductions!)
2. Memory hierarchy details differ (bank count, cache behavior)
3. Some CUDA extensions (cooperative groups, tensor cores) have
   no HIP equivalent
4. Performance characteristics differ even for identical code
</pre>

<h3>Design Principle</h3>
<p><em>"Portability is a design constraint worth respecting."</em> Writing portable GPU code from the start costs almost nothing — mostly replacing <code>cuda</code> prefixes with <code>hip</code> prefixes. But rewriting a non-portable codebase later costs months. The discipline of portability pays compound interest.</p>

<h3>Your Task</h3>
<p>Write a complete, genuinely portable HIP program. This means: no CUDA-specific headers, no hardcoded warp size assumptions, and proper HIP API calls throughout. The kernel should perform a vector addition with bounds checking.</p>
`,
    starterCode: `#include <hip/hip_runtime.h>
#include <stdio.h>

// TODO: Write a portable vector addition kernel
// Requirements:
// 1. __global__ function signature
// 2. Global thread ID calculation (same as CUDA)
// 3. Bounds checking (tid < n)
// 4. c[tid] = a[tid] + b[tid]

// __global__ void vectorAdd(const float* a, const float* b,
//                           float* c, int n) {
//     ...
// }

int main() {
    const int N = 4096;
    size_t bytes = N * sizeof(float);

    // Host arrays
    float *h_a, *h_b, *h_c;
    h_a = (float*)malloc(bytes);
    h_b = (float*)malloc(bytes);
    h_c = (float*)malloc(bytes);

    for (int i = 0; i < N; i++) {
        h_a[i] = (float)i;
        h_b[i] = (float)(i * 2);
    }

    // Device arrays
    float *d_a, *d_b, *d_c;

    // TODO: Allocate device memory for all three arrays
    // hipMalloc(&d_a, bytes);
    // hipMalloc(&d_b, bytes);
    // hipMalloc(&d_c, bytes);

    // TODO: Copy input arrays to device
    // hipMemcpy(d_a, h_a, bytes, hipMemcpyHostToDevice);
    // hipMemcpy(d_b, h_b, bytes, hipMemcpyHostToDevice);

    // TODO: Launch kernel
    // Use 256 threads/block, calculate grid size
    // int blockSize = 256;
    // int gridSize = (N + blockSize - 1) / blockSize;
    // vectorAdd<<<gridSize, blockSize>>>(d_a, d_b, d_c, N);

    // TODO: Copy result back
    // hipMemcpy(h_c, d_c, bytes, hipMemcpyDeviceToHost);

    // TODO: Clean up — free device and host memory
    // hipFree(d_a); hipFree(d_b); hipFree(d_c);

    free(h_a); free(h_b); free(h_c);
    return 0;
}
`,
    solutionCode: `#include <hip/hip_runtime.h>
#include <stdio.h>

// Portable kernel — compiles on both AMD and NVIDIA
__global__ void vectorAdd(const float* a, const float* b,
                          float* c, int n) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid < n) {
        c[tid] = a[tid] + b[tid];
    }
}

int main() {
    const int N = 4096;
    size_t bytes = N * sizeof(float);

    float *h_a, *h_b, *h_c;
    h_a = (float*)malloc(bytes);
    h_b = (float*)malloc(bytes);
    h_c = (float*)malloc(bytes);

    for (int i = 0; i < N; i++) {
        h_a[i] = (float)i;
        h_b[i] = (float)(i * 2);
    }

    float *d_a, *d_b, *d_c;

    // HIP memory management — identical pattern to CUDA
    hipMalloc(&d_a, bytes);
    hipMalloc(&d_b, bytes);
    hipMalloc(&d_c, bytes);

    hipMemcpy(d_a, h_a, bytes, hipMemcpyHostToDevice);
    hipMemcpy(d_b, h_b, bytes, hipMemcpyHostToDevice);

    // Launch configuration — same <<<>>> syntax
    int blockSize = 256;
    int gridSize = (N + blockSize - 1) / blockSize;
    vectorAdd<<<gridSize, blockSize>>>(d_a, d_b, d_c, N);

    hipMemcpy(h_c, d_c, bytes, hipMemcpyDeviceToHost);

    hipFree(d_a);
    hipFree(d_b);
    hipFree(d_c);

    free(h_a); free(h_b); free(h_c);
    return 0;
}

// PORTABILITY NOTES:
// - This exact code compiles with hipcc on AMD and NVIDIA
// - No warp-size assumptions (we use 256 threads, works on both)
// - No vendor-specific extensions
// - The only "cost" of portability: using hip* instead of cuda*
//   and including hip/hip_runtime.h instead of cuda_runtime.h
`,
    testCode: '',
    hints: [
      'The kernel is identical to CUDA: <code>int tid = blockIdx.x * blockDim.x + threadIdx.x;</code> then bounds check and compute.',
      'Memory allocation uses <code>hipMalloc</code> — takes a pointer-to-pointer just like cudaMalloc.',
      'Use <code>hipMemcpyHostToDevice</code> and <code>hipMemcpyDeviceToHost</code> for transfer direction.',
      'Block size of 256 is portable: it works on both NVIDIA (8 warps of 32) and AMD (4 wavefronts of 64).',
    ],
    concepts: [
      'HIP portability',
      'hipMalloc',
      'hipMemcpy',
      'kernel launch',
      'vendor-neutral GPU programming',
      'host-device data transfer',
    ],
    successPatterns: [
      '__global__\\s+void\\s+vectorAdd',
      'blockIdx\\.x\\s*\\*\\s*blockDim\\.x\\s*\\+\\s*threadIdx\\.x',
      'hipMalloc\\(&d_a',
      'hipMalloc\\(&d_b',
      'hipMalloc\\(&d_c',
      'hipMemcpy.*hipMemcpyHostToDevice',
      'hipMemcpy.*hipMemcpyDeviceToHost',
      'hipFree\\(d_a\\)',
    ],
    testNames: [
      'declares portable __global__ vectorAdd kernel',
      'computes global thread ID correctly',
      'allocates device memory for all three arrays',
      'copies input data to device (HostToDevice)',
      'copies result back to host (DeviceToHost)',
      'frees device memory',
    ],
  },

  'rocm-cuda-translation': {
    id: 'rocm-cuda-translation',
    language: 'rocm',
    title: 'CUDA-to-HIP Translation: Know Where Abstractions Leak',
    difficulty: 'beginner',
    order: 2,
    description: `
<h3>The Real Skill: Reading CUDA Code Portably</h3>
<p>Most existing GPU code is in CUDA. The practical skill is reading CUDA code and knowing <em>exactly</em> what translates mechanically, what needs behavioral adjustment, and what has no portable equivalent.</p>

<h3>Tier 1: Mechanical Translation (Safe)</h3>
<pre>
These are pure name changes. Behavior is identical.

cudaMalloc         → hipMalloc
cudaMemcpy         → hipMemcpy
cudaFree           → hipFree
cudaDeviceSynchronize → hipDeviceSynchronize
cudaGetLastError   → hipGetLastError
cudaMemset         → hipMemset
cudaEventCreate    → hipEventCreate
cudaEventRecord    → hipEventRecord
cudaStreamCreate   → hipStreamCreate
</pre>

<h3>Tier 2: Behavioral Differences (Careful)</h3>
<pre>
1. warpSize
   CUDA: always 32       HIP: 32 (NVIDIA) or 64 (AMD)
   FIX:  Use warpSize built-in, never hardcode 32

2. __shfl_sync → __shfl
   HIP uses the same function names, but the mask
   parameter behavior differs on AMD (64-bit wavefronts
   need a 64-bit mask)

3. cudaDeviceProp.warpSize
   → hipDeviceProp_t.warpSize
   DIFFERENT STRUCT NAME, same field concept

4. Cooperative Groups
   Limited HIP support — prefer __syncthreads()
</pre>

<h3>Tier 3: No Portable Equivalent (Redesign Required)</h3>
<pre>
CUDA Tensor Cores (wmma)    → No HIP equivalent (use rocBLAS)
CUDA Dynamic Parallelism    → Limited HIP support
CUDA Graphs (complex)       → hipGraph (partial support)
cuDNN                       → MIOpen (different API entirely)
Thrust                      → rocThrust (mostly compatible)
</pre>

<h3>Design Principle</h3>
<p><em>"Understand abstractions well enough to know where they leak."</em> The HIP abstraction covers 90% of CUDA perfectly. The remaining 10% is where bugs and performance cliffs hide. Knowing the boundary is more important than memorizing the translation table.</p>

<h3>Your Task</h3>
<p>Translate a CUDA program to HIP. Most translations are mechanical, but several require careful attention to behavioral differences. Identify and handle each correctly.</p>
`,
    starterCode: `// CUDA-to-HIP Translation Exercise
// Translate each CUDA snippet to its HIP equivalent.
// For each, indicate the translation tier:
// "mechanical" = pure rename, "behavioral" = subtle difference

#include <hip/hip_runtime.h>

// ============================================
// Translation 1: Memory allocation
// CUDA:  cudaMalloc(&d_ptr, size);
// HIP:   ???
// Tier:  ???
// ============================================
// TODO: Write the HIP equivalent
// float* d_ptr;
// ??? (&d_ptr, 1024 * sizeof(float));
const char* tier1 = "?";  // "mechanical" or "behavioral"

// ============================================
// Translation 2: Kernel with warp-level code
// CUDA:
//   unsigned mask = 0xFFFFFFFF;  // 32-bit: all lanes
//   float val = __shfl_down_sync(mask, myVal, 16);
//
// HIP equivalent — what changes for AMD?
// ============================================
// TODO: Write the portable version
// Hint: On AMD, wavefronts are 64 threads.
//       The mask should cover all lanes.
// unsigned long long mask = ???;
// float val = __shfl_down(myVal, ???);
const char* tier2 = "?";

// ============================================
// Translation 3: Device properties
// CUDA:
//   cudaDeviceProp props;
//   cudaGetDeviceProperties(&props, 0);
//   int warpsz = props.warpSize;
//
// HIP equivalent?
// ============================================
// TODO: Translate the struct and function names
// ??? props;
// ???(&props, 0);
// int warpsz = props.warpSize;
const char* tier3 = "?";

// ============================================
// Translation 4: Error checking pattern
// CUDA:
//   cudaError_t err = cudaMalloc(&ptr, size);
//   if (err != cudaSuccess)
//       printf("Error: %s\\n", cudaGetErrorString(err));
//
// HIP equivalent?
// ============================================
// TODO: Translate error types and functions
const char* tier4 = "?";

// ============================================
// Translation 5: Which of these CANNOT be
//   directly translated to portable HIP?
//   a) cudaMalloc
//   b) __syncthreads()
//   c) wmma::mma_sync (tensor cores)
//   d) atomicAdd
// ============================================
const char cannot_translate = '?';  // 'a', 'b', 'c', or 'd'
`,
    solutionCode: `// CUDA-to-HIP Translation — Solutions
#include <hip/hip_runtime.h>

// Translation 1: Pure name change
float* d_ptr;
hipMalloc(&d_ptr, 1024 * sizeof(float));
const char* tier1 = "mechanical";

// Translation 2: Behavioral difference!
// On AMD, wavefronts are 64 wide. The mask must be 64-bit.
// Portable approach: use __shfl_down without explicit mask
// on HIP, or use the warpSize built-in to determine width.
// HIP's __shfl_down handles the architecture difference internally.
unsigned long long mask = 0xFFFFFFFFFFFFFFFFULL; // 64-bit for AMD
float val = __shfl_down(myVal, 16);
const char* tier2 = "behavioral";
// NOTE: On NVIDIA via HIP, this still works — HIP translates
// to the 32-bit version. The behavioral difference is that
// the offset (16) means different things:
// NVIDIA: thread talks to thread+16 within a 32-lane warp
// AMD: thread talks to thread+16 within a 64-lane wavefront
// For reductions, this changes the number of steps needed!

// Translation 3: Struct and function name change
hipDeviceProp_t props;
hipGetDeviceProperties(&props, 0);
int warpsz = props.warpSize;  // Returns 32 (NVIDIA) or 64 (AMD)
const char* tier3 = "mechanical";

// Translation 4: Error handling — pure rename
hipError_t err = hipMalloc(&d_ptr, 1024);
if (err != hipSuccess)
    printf("Error: %s\\n", hipGetErrorString(err));
const char* tier4 = "mechanical";

// Translation 5: Tensor core operations (wmma) have NO
// HIP equivalent. AMD has matrix cores but uses a completely
// different API (rocWMMA or inline assembly).
const char cannot_translate = 'c';

// SUMMARY OF TIERS:
// Mechanical (safe): cudaMalloc, cudaMemcpy, cudaFree,
//   cudaDeviceSynchronize, error types, events, streams
//
// Behavioral (careful): warp/wavefront size, shuffle width,
//   mask bit width, some memory ordering guarantees
//
// No equivalent (redesign): tensor cores, dynamic parallelism,
//   some cooperative group features, vendor libraries
`,
    testCode: '',
    hints: [
      'hipMalloc has the exact same signature as cudaMalloc — this is a pure mechanical translation.',
      'The warp shuffle is behavioral: AMD wavefronts are 64 threads, so the mask and reduction steps differ. Use <code>__shfl_down</code> without the _sync suffix for HIP portability.',
      'Device properties: the struct is <code>hipDeviceProp_t</code> (not hipDeviceProp). The function is <code>hipGetDeviceProperties</code>.',
      'Tensor cores (<code>wmma::mma_sync</code>) are NVIDIA-specific hardware. AMD has matrix cores but with a completely different API.',
    ],
    concepts: [
      'CUDA-to-HIP translation',
      'mechanical vs behavioral differences',
      'portability tiers',
      'warp vs wavefront',
      'vendor-specific features',
      'abstraction leaks',
    ],
    successPatterns: [
      'hipMalloc\\(&d_ptr',
      'tier1\\s*=\\s*"mechanical"',
      'tier2\\s*=\\s*"behavioral"',
      '__shfl_down\\(',
      'hipDeviceProp_t\\s+props',
      'hipGetDeviceProperties',
      'hipError_t',
      'cannot_translate\\s*=\\s*\'c\'',
    ],
    testNames: [
      'translates cudaMalloc to hipMalloc correctly',
      'identifies memory allocation as mechanical translation',
      'identifies warp shuffle as behavioral translation',
      'uses HIP shuffle primitive (__shfl_down)',
      'uses hipDeviceProp_t for device properties',
      'uses hipGetDeviceProperties correctly',
      'translates error handling to hip equivalents',
      'identifies tensor cores (wmma) as non-translatable',
    ],
  },

  'rocm-portable-kernels': {
    id: 'rocm-portable-kernels',
    language: 'rocm',
    title: 'Portable Kernels: Optimizing for Two Architectures',
    difficulty: 'intermediate',
    order: 3,
    description: `
<h3>The Design Challenge</h3>
<p>Writing code that <em>compiles</em> on both NVIDIA and AMD is easy. Writing code that is <em>fast</em> on both is harder. The architectures have different sweet spots, and sometimes you must accept bounded suboptimality to maintain a single codebase.</p>

<h3>The Key Difference: Warp Width</h3>
<pre>
NVIDIA: warp = 32 threads (SIMT unit)
AMD:    wavefront = 64 threads (SIMD unit)

This affects EVERY warp-level operation:
- Reduction needs 5 steps on NVIDIA (log2(32) = 5)
- Reduction needs 6 steps on AMD (log2(64) = 6)
- Shared memory bank count differs (32 vs 64)
- Occupancy calculations change
</pre>

<h3>Strategy 1: Parameterize by warpSize</h3>
<pre>
// PORTABLE: use the built-in warpSize
__device__ float warpReduce(float val) {
    for (int offset = warpSize / 2; offset > 0; offset /= 2) {
        val += __shfl_down(val, offset);
    }
    return val;
}
// Compiles to 5 steps on NVIDIA, 6 steps on AMD. Correct on both.
</pre>

<h3>Strategy 2: Conditional Compilation (When Performance Demands It)</h3>
<pre>
#ifdef __HIP_PLATFORM_AMD__
    // AMD-specific optimization (e.g., 64-wide operations)
    #define WARP_SIZE 64
    #define BANKS 32
#else
    // NVIDIA path
    #define WARP_SIZE 32
    #define BANKS 32
#endif

// Use WARP_SIZE in kernel code. Different binary, same source.
</pre>

<h3>Strategy 3: Accept Bounded Suboptimality</h3>
<p>A block size of 256 is good (not perfect) on both architectures. On NVIDIA, it gives 8 warps. On AMD, it gives 4 wavefronts. Neither is optimal, but both are within 10-15% of the best possible. <strong>Maintaining one codebase is often worth a 10% performance loss.</strong></p>

<h3>Design Principle</h3>
<p><em>"Portable code accepts bounded suboptimality for maintainability."</em> The question is never "can I get 100% of peak on both?" — it is "how much performance am I giving up for a single codebase, and is that acceptable?"</p>

<h3>Your Task</h3>
<p>Write a portable warp-level reduction and a portable block-level reduction that work correctly on both NVIDIA (warp=32) and AMD (wavefront=64), using <code>warpSize</code> instead of hardcoded constants.</p>
`,
    starterCode: `#include <hip/hip_runtime.h>

// ============================================
// Part 1: Portable Warp Reduction
// Must work for both warpSize=32 and warpSize=64
// Do NOT hardcode 32 or 16 as the starting offset!
// ============================================
__device__ float portableWarpReduce(float val) {
    // TODO: Use warpSize to determine the number of steps
    // for (int offset = warpSize / 2; offset > 0; offset /= 2) {
    //     val += __shfl_down(val, offset);
    // }
    return val;
}

// ============================================
// Part 2: Portable Block Reduction
// blockDim.x = 256
// On NVIDIA: 256/32 = 8 warps
// On AMD:    256/64 = 4 wavefronts
// The number of warp sums to combine differs!
// ============================================
__global__ void portableBlockReduce(float *input, float *output, int n) {
    // Shared memory for warp results
    // Max warps per block: 256/32 = 8 (NVIDIA) or 256/64 = 4 (AMD)
    __shared__ float warpSums[8];  // 8 is safe upper bound

    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    float val = (tid < n) ? input[tid] : 0.0f;

    // TODO: Step 1 — reduce within each warp
    // val = portableWarpReduce(val);

    // TODO: Step 2 — first lane of each warp stores result
    // int warpId = threadIdx.x / warpSize;    // PORTABLE!
    // int laneId = threadIdx.x % warpSize;    // PORTABLE!
    // if (laneId == 0) warpSums[warpId] = val;

    // TODO: __syncthreads();

    // TODO: Step 3 — first warp reduces warp sums
    // Number of warps = blockDim.x / warpSize (PORTABLE!)
    // if (warpId == 0) {
    //     int numWarps = blockDim.x / warpSize;
    //     val = (laneId < numWarps) ? warpSums[laneId] : 0.0f;
    //     val = portableWarpReduce(val);
    //     if (laneId == 0) output[blockIdx.x] = val;
    // }
}

// ============================================
// Part 3: Knowledge Check
// Replace -1 with correct answers
// ============================================

// How many reduction steps for warpSize=32?
const int steps_nvidia = -1;  // log2(32)

// How many reduction steps for warpSize=64?
const int steps_amd = -1;     // log2(64)

// If blockDim.x=256, how many warps on NVIDIA?
const int warps_nvidia = -1;

// If blockDim.x=256, how many wavefronts on AMD?
const int warps_amd = -1;
`,
    solutionCode: `#include <hip/hip_runtime.h>

// Portable Warp Reduction — works on both architectures
__device__ float portableWarpReduce(float val) {
    // warpSize is a built-in: 32 on NVIDIA, 64 on AMD
    for (int offset = warpSize / 2; offset > 0; offset /= 2) {
        val += __shfl_down(val, offset);
    }
    return val;
    // On NVIDIA: 5 iterations (16, 8, 4, 2, 1)
    // On AMD:    6 iterations (32, 16, 8, 4, 2, 1)
}

// Portable Block Reduction
__global__ void portableBlockReduce(float *input, float *output, int n) {
    __shared__ float warpSums[8]; // max warps for blockDim=256

    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    float val = (tid < n) ? input[tid] : 0.0f;

    // Step 1: Warp-level reduction (portable)
    val = portableWarpReduce(val);

    // Step 2: Per-warp results to shared memory
    int warpId = threadIdx.x / warpSize;  // PORTABLE
    int laneId = threadIdx.x % warpSize;  // PORTABLE
    if (laneId == 0) warpSums[warpId] = val;

    __syncthreads();

    // Step 3: First warp combines all warp results
    if (warpId == 0) {
        int numWarps = blockDim.x / warpSize;
        // Load warp sum if this lane has one, else 0
        val = (laneId < numWarps) ? warpSums[laneId] : 0.0f;
        val = portableWarpReduce(val);
        if (laneId == 0) output[blockIdx.x] = val;
    }
}

// Knowledge Check — Solutions
const int steps_nvidia = 5;  // log2(32) = 5
const int steps_amd = 6;     // log2(64) = 6
const int warps_nvidia = 8;  // 256 / 32 = 8
const int warps_amd = 4;     // 256 / 64 = 4

// THE PORTABILITY INSIGHT:
// By using warpSize instead of 32, the SAME source code
// generates correct (and reasonably efficient) code on both.
//
// The AMD version does 1 more shuffle step per warp but has
// half as many warps to combine. Total work is similar.
//
// Trade-off: a hand-tuned NVIDIA kernel with hardcoded 32
// might be 5% faster, but you'd need to maintain two codepaths.
// For most applications, the portable version is the right choice.
`,
    testCode: '',
    hints: [
      'Use <code>warpSize</code> (the built-in variable) instead of 32 or 64. It automatically adapts to the hardware.',
      'Lane ID and warp ID must also use warpSize: <code>threadIdx.x / warpSize</code> and <code>threadIdx.x % warpSize</code>.',
      'The number of warps in a block is <code>blockDim.x / warpSize</code>. On NVIDIA with 256 threads: 8 warps. On AMD: 4.',
      'log2(32) = 5 steps for NVIDIA warp reduction. log2(64) = 6 steps for AMD wavefront reduction.',
    ],
    concepts: [
      'portable warp operations',
      'warpSize built-in',
      'parameterized algorithms',
      'NVIDIA vs AMD differences',
      'bounded suboptimality',
      'maintainable GPU code',
    ],
    successPatterns: [
      'warpSize\\s*/\\s*2',
      '__shfl_down\\(val,\\s*offset\\)',
      'threadIdx\\.x\\s*/\\s*warpSize',
      'threadIdx\\.x\\s*%\\s*warpSize',
      'blockDim\\.x\\s*/\\s*warpSize',
      'steps_nvidia\\s*=\\s*5',
      'steps_amd\\s*=\\s*6',
      'warps_nvidia\\s*=\\s*8',
      'warps_amd\\s*=\\s*4',
    ],
    testNames: [
      'warp reduction uses warpSize/2 as starting offset',
      'uses __shfl_down with portable offset',
      'computes warp ID using warpSize (not hardcoded 32)',
      'computes lane ID using warpSize (not hardcoded 32)',
      'computes number of warps using blockDim.x / warpSize',
      'NVIDIA warp reduction is 5 steps (log2(32))',
      'AMD wavefront reduction is 6 steps (log2(64))',
      'NVIDIA has 8 warps per 256-thread block',
      'AMD has 4 wavefronts per 256-thread block',
    ],
  },

  'rocm-hipify': {
    id: 'rocm-hipify',
    language: 'rocm',
    title: 'hipify: When Tools Handle Syntax but Not Semantics',
    difficulty: 'beginner',
    order: 4,
    description: `
<h3>The Tool: hipify-clang</h3>
<p><code>hipify-clang</code> automatically translates CUDA source code to HIP. It handles the mechanical translations: renaming APIs, adjusting headers, converting types. For 90% of CUDA code, it produces correct, compilable HIP code.</p>

<h3>What hipify Does Well</h3>
<pre>
Input (CUDA):
  #include &lt;cuda_runtime.h&gt;
  cudaMalloc(&ptr, size);
  cudaMemcpy(dst, src, n, cudaMemcpyHostToDevice);
  kernel&lt;&lt;&lt;grid, block&gt;&gt;&gt;(args);
  cudaDeviceSynchronize();

Output (HIP) — automatic:
  #include &lt;hip/hip_runtime.h&gt;
  hipMalloc(&ptr, size);
  hipMemcpy(dst, src, n, hipMemcpyHostToDevice);
  kernel&lt;&lt;&lt;grid, block&gt;&gt;&gt;(args);
  hipDeviceSynchronize();
</pre>

<h3>What hipify Gets Wrong (Or Suboptimal)</h3>
<pre>
Case 1: Hardcoded warp size
  CUDA:  if (threadIdx.x < 32)  // first warp
  HIP:   if (threadIdx.x < 32)  // hipify preserves this — WRONG on AMD!
  FIX:   if (threadIdx.x < warpSize)

Case 2: Warp shuffle masks
  CUDA:  __shfl_down_sync(0xFFFFFFFF, val, 1)
  HIP:   __shfl_down(val, 1)  // hipify converts, but 32-bit mask
                                // is wrong for 64-thread wavefronts

Case 3: Performance-critical shared memory
  CUDA:  __shared__ float s[32];  // sized for 32-thread warp
  HIP:   __shared__ float s[32];  // hipify preserves — UNDERSIZED for AMD!
  FIX:   __shared__ float s[warpSize]; // or use dynamic shared memory

Case 4: Vendor library calls
  CUDA:  cublasSgemm(...)
  HIP:   hipify has NO automatic translation for this
  FIX:   Manually replace with rocBLAS API (similar but not identical)
</pre>

<h3>The Lesson</h3>
<p>hipify handles syntax. You handle semantics. The tool cannot reason about <em>why</em> a constant is 32 — is it the warp size, an array dimension, or a loop count? Only you know the intent, and only you can decide if it needs to change.</p>

<h3>Design Principle</h3>
<p><em>"Automation handles the boring parts; taste handles the interesting ones."</em> Use hipify for the bulk translation, then manually review every warp-size assumption, every hardcoded constant, and every vendor library call.</p>

<h3>Your Task</h3>
<p>hipify has translated a CUDA kernel to HIP. The translation is syntactically correct but has semantic problems. Find and fix each issue. This is the review process every engineer must do after running hipify.</p>
`,
    starterCode: `#include <hip/hip_runtime.h>

// ============================================
// This kernel was auto-translated by hipify.
// It compiles. It even runs. But it has BUGS
// and PERFORMANCE ISSUES on AMD hardware.
// Find and fix each problem.
// ============================================

#define WARP_SIZE 32  // PROBLEM 1: Hardcoded warp size

__device__ float warpReduceSum(float val) {
    // PROBLEM 2: Hardcoded shuffle steps for 32-thread warp
    val += __shfl_down(val, 16);
    val += __shfl_down(val, 8);
    val += __shfl_down(val, 4);
    val += __shfl_down(val, 2);
    val += __shfl_down(val, 1);
    return val;
}

__global__ void reductionKernel(float *input, float *output, int n) {
    __shared__ float warpResults[32];  // PROBLEM 3: Sized for 32 warps?

    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    float val = (tid < n) ? input[tid] : 0.0f;

    val = warpReduceSum(val);

    // PROBLEM 4: Uses hardcoded 32 for warp calculations
    int warpId = threadIdx.x / 32;
    int laneId = threadIdx.x % 32;

    if (laneId == 0) {
        warpResults[warpId] = val;
    }

    __syncthreads();

    // PROBLEM 5: Assumes exactly 8 warps (256/32)
    if (threadIdx.x < 8) {
        val = warpResults[threadIdx.x];
        val = warpReduceSum(val);
        if (threadIdx.x == 0) {
            output[blockIdx.x] = val;
        }
    }
}

// ============================================
// Fix all 5 problems to make this kernel
// portable across NVIDIA and AMD GPUs.
// Replace hardcoded constants with warpSize
// or computed values.
// ============================================
`,
    solutionCode: `#include <hip/hip_runtime.h>

// FIXED: No hardcoded warp size constant
// warpSize is a built-in variable on both platforms

__device__ float warpReduceSum(float val) {
    // FIXED: Loop uses warpSize for correct step count
    // On NVIDIA: 5 iterations (32 → 1)
    // On AMD:    6 iterations (64 → 1)
    for (int offset = warpSize / 2; offset > 0; offset /= 2) {
        val += __shfl_down(val, offset);
    }
    return val;
}

__global__ void reductionKernel(float *input, float *output, int n) {
    // FIXED: Sized for max warps per block (256/32=8 or 256/64=4)
    // Use 8 as safe upper bound, or compute dynamically
    __shared__ float warpResults[8];

    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    float val = (tid < n) ? input[tid] : 0.0f;

    val = warpReduceSum(val);

    // FIXED: Use warpSize for portable warp/lane calculation
    int warpId = threadIdx.x / warpSize;
    int laneId = threadIdx.x % warpSize;

    if (laneId == 0) {
        warpResults[warpId] = val;
    }

    __syncthreads();

    // FIXED: Compute number of warps portably
    int numWarps = blockDim.x / warpSize;
    if (warpId == 0) {
        val = (laneId < numWarps) ? warpResults[laneId] : 0.0f;
        val = warpReduceSum(val);
        if (laneId == 0) {
            output[blockIdx.x] = val;
        }
    }
}

// HIPIFY REVIEW CHECKLIST:
// [x] Remove all #define WARP_SIZE 32 — use warpSize built-in
// [x] Replace hardcoded shuffle sequences with warpSize-based loops
// [x] Replace threadIdx.x / 32 with threadIdx.x / warpSize
// [x] Replace threadIdx.x % 32 with threadIdx.x % warpSize
// [x] Replace "if (tid < 8)" with computed numWarps
// [x] Verify shared memory sizes accommodate both architectures
//
// The tool handled: cuda→hip API renames, header changes
// The engineer handled: warp size assumptions, semantic correctness
`,
    testCode: '',
    hints: [
      'Remove the <code>#define WARP_SIZE 32</code> entirely — use the built-in <code>warpSize</code> variable instead.',
      'The warp reduction needs a loop: <code>for (int offset = warpSize/2; offset > 0; offset /= 2)</code>. This generates the right number of steps on both architectures.',
      'Replace all <code>/ 32</code> and <code>% 32</code> with <code>/ warpSize</code> and <code>% warpSize</code>.',
      'The number of warps is <code>blockDim.x / warpSize</code>, not hardcoded 8. Use this for the final reduction guard.',
    ],
    concepts: [
      'hipify limitations',
      'semantic vs syntactic translation',
      'warp size portability',
      'post-translation review',
      'hardcoded constant detection',
      'automation boundaries',
    ],
    successPatterns: [
      'warpSize\\s*/\\s*2',
      'for\\s*\\(.*offset.*warpSize',
      'threadIdx\\.x\\s*/\\s*warpSize',
      'threadIdx\\.x\\s*%\\s*warpSize',
      'blockDim\\.x\\s*/\\s*warpSize',
      'laneId\\s*<\\s*numWarps',
    ],
    testNames: [
      'warp reduction uses warpSize-based loop (not hardcoded steps)',
      'shuffle offset starts at warpSize/2',
      'warp ID computed with warpSize (not 32)',
      'lane ID computed with warpSize (not 32)',
      'number of warps computed portably (blockDim.x / warpSize)',
      'final reduction uses computed numWarps (not hardcoded 8)',
    ],
  },

  // ─────────────────────────────────────────────
  // Module 2: AMD Architecture
  // "Know your hardware"
  // ─────────────────────────────────────────────

  'rocm-wavefronts': {
    id: 'rocm-wavefronts',
    language: 'rocm',
    title: 'Wavefronts: When 64 Is Not Just a Bigger 32',
    difficulty: 'intermediate',
    order: 5,
    description: `
<h3>The Fundamental Difference</h3>
<p>AMD wavefronts execute <strong>64 threads in lockstep</strong>, compared to NVIDIA's 32-thread warps. This is not just "more threads per group" — it changes the design of every warp-level algorithm.</p>

<h3>How Wavefront Width Affects Algorithms</h3>
<table>
  <thead><tr><th>Algorithm</th><th>NVIDIA (warp=32)</th><th>AMD (wave=64)</th><th>Impact</th></tr></thead>
  <tbody>
    <tr><td><strong>Warp reduction</strong></td><td>5 shuffle steps</td><td>6 shuffle steps</td><td>1 extra step (minor)</td></tr>
    <tr><td><strong>Block reduction (256 threads)</strong></td><td>8 warp results to combine</td><td>4 wavefront results</td><td>Fewer cross-warp syncs</td></tr>
    <tr><td><strong>Warp vote</strong></td><td>32-bit ballot mask</td><td>64-bit ballot mask</td><td>Different type needed</td></tr>
    <tr><td><strong>Divergence cost</strong></td><td>Up to 32 threads idle</td><td>Up to 64 threads idle</td><td>Divergence is MORE costly on AMD</td></tr>
    <tr><td><strong>Occupancy</strong></td><td>64 warps/SM max</td><td>32 wavefronts/CU max</td><td>Different occupancy math</td></tr>
  </tbody>
</table>

<h3>The Divergence Amplification Problem</h3>
<pre>
Consider: if (threadIdx.x < 16) { doWork(); }

NVIDIA warp (32 threads):
  Threads 0-15 work, threads 16-31 idle.
  50% utilization within the warp.

AMD wavefront (64 threads):
  Threads 0-15 work, threads 16-63 idle.
  25% utilization within the wavefront!
  The SAME code is 2x MORE wasteful on AMD.
</pre>

<p>This means AMD hardware is MORE sensitive to divergence. Code that causes minor divergence on NVIDIA can cause major performance loss on AMD.</p>

<h3>The Design Lesson</h3>
<p>The solution is not to avoid AMD — it is to write algorithms that are <strong>parameterized by warp width</strong>. When your reduction loop says <code>warpSize/2</code> instead of <code>16</code>, it automatically adapts. When your divergence is aligned to wavefront boundaries, it costs nothing on either platform.</p>

<h3>Design Principle</h3>
<p><em>"Parameterize, don't hardcode."</em> Every algorithm that touches warp-level behavior should use <code>warpSize</code> as a parameter. This isn't just portability — it future-proofs your code against new architectures with different SIMT widths.</p>

<h3>Your Task</h3>
<p>Analyze how wavefront width affects specific algorithms. Compute the performance differences and implement portable alternatives.</p>
`,
    starterCode: `// Wavefront Analysis — 64 vs 32
// Replace each -1 with the correct value.

// ============================================
// Q1: Warp-level scan (prefix sum)
// On NVIDIA: log2(32) = 5 steps
// On AMD: how many steps for a full wavefront scan?
// ============================================
const int scan_steps_amd = -1;

// ============================================
// Q2: Block of 512 threads performing reduction.
// On NVIDIA: how many warps?
// On AMD: how many wavefronts?
// ============================================
const int warps_nvidia_512 = -1;
const int waves_amd_512 = -1;

// ============================================
// Q3: Divergence analysis
// if (threadIdx.x < 48) { doWork(); }
// On NVIDIA: how many warps diverge?
//   (warp 0: all active, warp 1: 16/32 active)
// On AMD: what fraction of the wavefront is idle?
// ============================================
const int nvidia_divergent_warps = -1;
const int amd_idle_threads = -1;  // out of 64

// ============================================
// Q4: __ballot (warp vote)
// On NVIDIA: returns unsigned int (32-bit)
// On AMD: what type should the ballot return?
// Size in bits?
// ============================================
const int ballot_bits_nvidia = -1;
const int ballot_bits_amd = -1;

// ============================================
// Q5: Portable warp-level prefix sum
// Implement for arbitrary warpSize.
// ============================================
__device__ float portableWarpScan(float val) {
    // TODO: Inclusive scan using shuffle
    // for (int offset = 1; offset < warpSize; offset *= 2) {
    //     float n = __shfl_up(val, offset);
    //     if (laneId >= offset) val += n;
    // }
    // where laneId = threadIdx.x % warpSize

    return val;
}
`,
    solutionCode: `// Wavefront Analysis — Solutions

// Q1: log2(64) = 6 steps for AMD wavefront scan
const int scan_steps_amd = 6;

// Q2: 512 / 32 = 16 warps on NVIDIA
//     512 / 64 = 8 wavefronts on AMD
const int warps_nvidia_512 = 16;
const int waves_amd_512 = 8;

// Q3: Divergence for (threadIdx.x < 48):
// NVIDIA: warp 0 (threads 0-31) all active, no divergence
//         warp 1 (threads 32-63): threads 32-47 active, 48-63 idle
//         1 warp diverges
// AMD: wavefront 0 (threads 0-63): threads 0-47 active, 48-63 idle
//      16 threads idle out of 64
const int nvidia_divergent_warps = 1;
const int amd_idle_threads = 16;

// Q4: Ballot must cover all lanes in the execution group
// NVIDIA: 32 lanes → 32-bit unsigned int
// AMD: 64 lanes → 64-bit unsigned long long
const int ballot_bits_nvidia = 32;
const int ballot_bits_amd = 64;

// Q5: Portable warp-level inclusive prefix sum
__device__ float portableWarpScan(float val) {
    int laneId = threadIdx.x % warpSize;
    for (int offset = 1; offset < warpSize; offset *= 2) {
        float n = __shfl_up(val, offset);
        if (laneId >= offset) val += n;
    }
    return val;
    // On NVIDIA: 5 iterations (offsets 1, 2, 4, 8, 16)
    // On AMD:    6 iterations (offsets 1, 2, 4, 8, 16, 32)
    // Correct and reasonably efficient on both.
}

// KEY INSIGHTS:
// 1. Wider wavefronts mean divergence is more costly on AMD
// 2. Wider wavefronts mean fewer groups to combine (often faster!)
// 3. Ballot/vote operations need wider bit fields on AMD
// 4. All of this is handled by parameterizing with warpSize
//
// The architecture difference is real, but code that respects
// warpSize as a parameter handles it gracefully.
`,
    testCode: '',
    hints: [
      'log2(64) = 6. AMD wavefront scan needs one more step than NVIDIA warp scan.',
      'For 512 threads: divide by warp/wavefront size. 512/32 = 16 warps, 512/64 = 8 wavefronts.',
      'With 64-wide wavefronts, threads 48-63 are idle when the condition is <code>threadIdx.x < 48</code>. That is 16 idle threads.',
      'Warp scan uses __shfl_up with offsets 1, 2, 4, 8, 16 (NVIDIA) or 1, 2, 4, 8, 16, 32 (AMD). The loop <code>offset < warpSize</code> handles both.',
    ],
    concepts: [
      'wavefront width',
      'divergence amplification',
      'ballot bit width',
      'warp scan',
      'parameterized algorithms',
      'architecture sensitivity',
    ],
    successPatterns: [
      'scan_steps_amd\\s*=\\s*6',
      'warps_nvidia_512\\s*=\\s*16',
      'waves_amd_512\\s*=\\s*8',
      'nvidia_divergent_warps\\s*=\\s*1',
      'amd_idle_threads\\s*=\\s*16',
      'ballot_bits_amd\\s*=\\s*64',
      '__shfl_up\\(val,\\s*offset\\)',
      'offset\\s*<\\s*warpSize',
    ],
    testNames: [
      'AMD wavefront scan needs 6 steps (log2(64))',
      '512 threads = 16 NVIDIA warps',
      '512 threads = 8 AMD wavefronts',
      'one NVIDIA warp diverges for threadIdx.x < 48',
      '16 AMD threads idle for threadIdx.x < 48',
      'AMD ballot needs 64 bits',
      'portable scan uses __shfl_up with dynamic offset',
      'scan loop bounded by warpSize (not hardcoded)',
    ],
  },

  'rocm-lds': {
    id: 'rocm-lds',
    language: 'rocm',
    title: 'LDS Bank Conflicts: When Shared Memory Behaves Differently',
    difficulty: 'intermediate',
    order: 6,
    description: `
<h3>Local Data Share (LDS): AMD's Shared Memory</h3>
<p>AMD's <code>__shared__</code> memory is called the <strong>Local Data Share (LDS)</strong>. It serves the same purpose as NVIDIA's shared memory — fast, on-chip storage shared by all threads in a block. But the banking rules differ in subtle ways that can create performance cliffs.</p>

<h3>Bank Conflicts: The Fundamental Problem</h3>
<p>Shared memory is divided into <strong>banks</strong>. Each bank can serve one request per cycle. When two threads in the same warp/wavefront access the same bank (but different addresses), they <strong>serialize</strong>. This is a bank conflict.</p>

<pre>
// 32 banks, each 4 bytes wide. Address maps to bank:
// bank = (address / 4) % 32

// NO CONFLICT: consecutive threads access consecutive floats
// Thread 0 → bank 0, Thread 1 → bank 1, ... Thread 31 → bank 31
sdata[threadIdx.x]  // Perfect: each thread hits a different bank

// 32-WAY CONFLICT: all threads access the same bank
// Thread 0 → bank 0, Thread 1 → bank 0, ... Thread 31 → bank 0
sdata[threadIdx.x * 32]  // Disaster: all map to bank 0
</pre>

<h3>Where AMD Differs</h3>
<table>
  <thead><tr><th>Property</th><th>NVIDIA</th><th>AMD (GCN/CDNA)</th><th>Impact</th></tr></thead>
  <tbody>
    <tr><td><strong>Bank count</strong></td><td>32</td><td>32</td><td>Same formula for conflicts</td></tr>
    <tr><td><strong>Bank width</strong></td><td>4 bytes</td><td>4 bytes (GCN) / varies (RDNA)</td><td>Some AMD GPUs differ</td></tr>
    <tr><td><strong>Wavefront width</strong></td><td>32 (warp)</td><td>64 (wavefront)</td><td>64 threads compete for 32 banks — conflicts are <em>more likely</em></td></tr>
    <tr><td><strong>Broadcast</strong></td><td>Free for same-address</td><td>Free for same-address</td><td>Same optimization</td></tr>
  </tbody>
</table>

<h3>The Critical Insight: 64 Threads, 32 Banks</h3>
<pre>
NVIDIA (32 threads, 32 banks):
  sdata[threadIdx.x] → threads 0-31 each hit a unique bank. No conflicts.

AMD (64 threads, 32 banks):
  sdata[threadIdx.x] → threads 0-31 hit banks 0-31 (OK)
                        threads 32-63 ALSO hit banks 0-31 (CONFLICT!)
  The wavefront is split into two halves, each serviced in one cycle.
  This is handled by the hardware, but more complex patterns can
  cause worse conflicts on AMD than NVIDIA.
</pre>

<h3>Design Principle</h3>
<p><em>"Performance is platform-specific; correctness should not be."</em> Bank conflicts affect performance, never correctness. The same shared memory code produces the same results on both platforms — just at different speeds. Profile on the target hardware.</p>

<h3>Your Task</h3>
<p>Analyze access patterns for bank conflicts on both NVIDIA and AMD. Identify which patterns are safe on NVIDIA but problematic on AMD, and fix them with padding.</p>
`,
    starterCode: `// LDS Bank Conflict Analysis
// 32 banks, 4 bytes per bank, bank = (addr/4) % 32
// Replace each -1 or "?" with the correct answer.

// ============================================
// Pattern 1: sdata[threadIdx.x]
// NVIDIA (32 threads): bank = threadIdx.x % 32
// AMD (64 threads): bank = threadIdx.x % 32
// Conflicts on NVIDIA?
// Conflicts on AMD?
// ============================================
const int conflicts_p1_nvidia = -1;  // 0 = no conflicts
const int conflicts_p1_amd = -1;     // 0 = no, 1 = yes (2-way)

// ============================================
// Pattern 2: sdata[threadIdx.x * 2]
// Thread 0 → bank 0, Thread 1 → bank 2, ...
// Thread 16 → bank 0 again!
// How many conflicts on NVIDIA? (n-way)
// How many on AMD?
// ============================================
const int conflict_way_p2_nvidia = -1;  // n-way conflict
const int conflict_way_p2_amd = -1;

// ============================================
// Pattern 3: Matrix stored as sdata[row][col]
//   with dimensions [32][32]
//   Threads read column-wise: sdata[threadIdx.x][colIdx]
// This causes 32-way bank conflicts!
//
// FIX: Pad to sdata[32][33]
// Why does adding 1 column fix it?
// Bank of sdata[row][col] in padded: (row * 33 + col) % 32
// Thread 0 (row=0): bank = (0*33 + col) % 32 = col
// Thread 1 (row=1): bank = (1*33 + col) % 32 = (33+col) % 32 = (1+col) % 32
// Now each row maps to a DIFFERENT bank. Conflict gone!
// ============================================
const int padded_cols = -1;  // original 32 + padding

// ============================================
// Q4: On AMD with 64-thread wavefronts, even
// the simple pattern sdata[threadIdx.x] causes
// the wavefront to be processed in how many
// cycles? (32 banks, 64 threads)
// ============================================
const int cycles_simple_amd = -1;

// ============================================
// Q5: The padding trick ([][33] instead of [][32])
// works on both NVIDIA and AMD. True or false?
// (1 = true, 0 = false)
// ============================================
const int padding_portable = -1;
`,
    solutionCode: `// LDS Bank Conflict Analysis — Solutions

// Pattern 1: sdata[threadIdx.x]
// NVIDIA: 32 threads, 32 banks → each thread hits unique bank. 0 conflicts.
// AMD: 64 threads, 32 banks → threads 0-31 and 32-63 each hit all banks.
// The hardware processes this as two half-wavefronts, each conflict-free.
// This is a 2-way access but the hardware handles it naturally.
const int conflicts_p1_nvidia = 0;
const int conflicts_p1_amd = 0;  // Hardware handles the two halves

// Pattern 2: sdata[threadIdx.x * 2]
// Thread 0→bank 0, Thread 1→bank 2, ..., Thread 16→bank 0 again
// NVIDIA: 2-way conflict (thread i and thread i+16 hit same bank)
// AMD: 4-way conflict (thread i, i+16, i+32, i+48 hit same bank)
const int conflict_way_p2_nvidia = 2;
const int conflict_way_p2_amd = 4;

// Pattern 3: Padding fixes column-wise access
// Original [32][32]: column access → 32-way conflict
// Padded [32][33]: each row shifts by 1 bank → all unique
const int padded_cols = 33;

// Q4: sdata[threadIdx.x] with 64 threads and 32 banks
// The hardware processes the wavefront in 2 cycles:
//   Cycle 1: threads 0-31 (each hits unique bank)
//   Cycle 2: threads 32-63 (each hits unique bank)
const int cycles_simple_amd = 2;

// Q5: Padding works on both platforms
// The math is architecture-independent: adding 1 to the stride
// breaks the bank alignment pattern regardless of warp/wavefront size.
const int padding_portable = 1;

// THE PERFORMANCE INSIGHT:
// The same code can have different conflict patterns on AMD vs NVIDIA.
// Stride-2 access: 2-way conflict on NVIDIA, 4-way on AMD (because
// the wavefront is wider, more threads alias to the same bank).
//
// The padding trick is universal — it works by changing the stride
// of row-major access, which benefits any bank count.
//
// CORRECTNESS is always the same. PERFORMANCE varies by platform.
// Profile on your target hardware.
`,
    testCode: '',
    hints: [
      'For pattern 1 (consecutive access), NVIDIA has no conflicts. AMD processes 64 threads over 32 banks, but the hardware handles this as two conflict-free half-wavefronts.',
      'For stride-2 access, thread i and thread i+16 map to the same bank (i*2 mod 32 = (i+16)*2 mod 32). On AMD with 64 threads, thread i+32 and i+48 also alias.',
      'Padding to 33 columns: bank = (row * 33 + col) % 32. Since 33 mod 32 = 1, each row shifts by 1 bank. All rows get unique banks for the same column.',
      'With 64 threads and 32 banks, even conflict-free patterns need 2 cycles. The hardware splits the wavefront into two halves of 32.',
    ],
    concepts: [
      'LDS bank conflicts',
      'bank addressing',
      'padding optimization',
      'wavefront banking',
      'NVIDIA vs AMD conflict patterns',
      'shared memory performance',
    ],
    successPatterns: [
      'conflicts_p1_nvidia\\s*=\\s*0',
      'conflicts_p1_amd\\s*=\\s*0',
      'conflict_way_p2_nvidia\\s*=\\s*2',
      'conflict_way_p2_amd\\s*=\\s*4',
      'padded_cols\\s*=\\s*33',
      'cycles_simple_amd\\s*=\\s*2',
      'padding_portable\\s*=\\s*1',
    ],
    testNames: [
      'consecutive access: no conflicts on NVIDIA',
      'consecutive access: hardware-managed on AMD',
      'stride-2 access: 2-way conflict on NVIDIA',
      'stride-2 access: 4-way conflict on AMD (wider wavefront)',
      'padding to 33 columns fixes column-wise bank conflicts',
      'AMD processes 64 threads over 32 banks in 2 cycles',
      'padding trick is portable across architectures',
    ],
  },

  'rocm-gcn-rdna': {
    id: 'rocm-gcn-rdna',
    language: 'rocm',
    title: 'GCN to RDNA: Architecture Generations Change, Principles Don\'t',
    difficulty: 'advanced',
    order: 7,
    description: `
<h3>Two Generations of AMD GPUs</h3>
<p>AMD has two major GPU architecture families for compute:</p>
<table>
  <thead><tr><th>Feature</th><th>GCN / CDNA (datacenter)</th><th>RDNA (consumer/gaming)</th></tr></thead>
  <tbody>
    <tr><td><strong>Target</strong></td><td>HPC, ML training</td><td>Gaming, consumer workloads</td></tr>
    <tr><td><strong>Wavefront</strong></td><td>64 threads (always)</td><td>32 <em>or</em> 64 threads (wave32/wave64)</td></tr>
    <tr><td><strong>SIMD units</strong></td><td>4x 16-wide SIMDs per CU</td><td>2x 32-wide SIMDs per WGP</td></tr>
    <tr><td><strong>Shared memory</strong></td><td>64 KB per CU</td><td>128 KB per WGP (shared between 2 CUs)</td></tr>
    <tr><td><strong>Examples</strong></td><td>MI250, MI300 (datacenter)</td><td>RX 7900 (consumer)</td></tr>
  </tbody>
</table>

<h3>RDNA's Wave32 Mode: The Game-Changer</h3>
<p>RDNA introduced <strong>wave32</strong>: wavefronts of 32 threads, matching NVIDIA's warp size. This means:</p>
<pre>
1. Code with hardcoded 32 now works correctly on RDNA
   (but was wrong on GCN!)

2. Warp-level primitives behave identically to NVIDIA in wave32

3. BUT: GCN code optimized for 64-wide wavefronts may need
   adjustment for wave32 RDNA

4. RDNA can ALSO run wave64 mode — the hardware emulates
   it by running two wave32s in sequence. Slower, but compatible.
</pre>

<h3>What This Means for Portability</h3>
<pre>
If you write: warpSize-parameterized code
  → GCN sees warpSize=64, runs correctly with 64-wide waves
  → RDNA/wave32 sees warpSize=32, runs correctly with 32-wide waves
  → RDNA/wave64 sees warpSize=64, runs correctly
  → NVIDIA sees warpSize=32, runs correctly
  → Future 128-wide arch? Still works.

If you hardcode 32:
  → NVIDIA: works
  → RDNA/wave32: works
  → GCN: BROKEN
  → RDNA/wave64: BROKEN
</pre>

<h3>Architecture-Specific Optimization</h3>
<pre>
GCN/CDNA optimization: maximize wave64 occupancy
  - Large wavefronts hide memory latency well
  - Prefer high thread counts per CU
  - Optimize for 64-wide vector operations

RDNA optimization: leverage wave32 for lower latency
  - Smaller wavefronts have less divergence overhead
  - Better for irregular workloads
  - Each wave32 completes faster (fewer lanes to fill)
</pre>

<h3>Design Principle</h3>
<p><em>"Architecture generations change; fundamental principles don't."</em> Coalesced memory access matters on all architectures. Occupancy matters everywhere. Minimizing divergence is always good. The specific numbers (warp size, bank count, register file size) change; the principles (locality, parallelism, latency hiding) are permanent.</p>

<h3>Your Task</h3>
<p>Analyze how the same kernel behaves across GCN (wave64), RDNA/wave32, and NVIDIA. Identify which optimizations are universal and which are architecture-specific.</p>
`,
    starterCode: `// GCN vs RDNA Analysis
// Replace each -1 or "?" with the correct answer.

// ============================================
// Q1: A reduction kernel uses this loop:
//   for (int offset = 16; offset > 0; offset /= 2)
//       val += __shfl_down(val, offset);
//
// On which architectures does this produce
// CORRECT results? (1=correct, 0=broken)
// ============================================
const int correct_nvidia = -1;       // warpSize = 32
const int correct_rdna_wave32 = -1;  // warpSize = 32
const int correct_gcn = -1;          // warpSize = 64
const int correct_rdna_wave64 = -1;  // warpSize = 64

// ============================================
// Q2: The same kernel with a portable loop:
//   for (int offset = warpSize/2; offset > 0; offset /= 2)
//       val += __shfl_down(val, offset);
//
// Correct on all four?
// ============================================
const int portable_nvidia = -1;
const int portable_rdna32 = -1;
const int portable_gcn = -1;
const int portable_rdna64 = -1;

// ============================================
// Q3: Occupancy comparison
// Kernel uses 256 threads per block.
// GCN CU: max 40 wavefronts (wave64)
// RDNA WGP: max 32 wavefronts (wave32 mode)
// NVIDIA SM: max 64 warps
//
// How many wavefronts/warps does one block create?
// ============================================
const int waves_gcn = -1;     // 256 / 64
const int waves_rdna32 = -1;  // 256 / 32
const int warps_nvidia = -1;  // 256 / 32

// ============================================
// Q4: Which optimization is UNIVERSAL across
//     all architectures? (1=universal, 0=arch-specific)
// ============================================
const int universal_coalescing = -1;
const int universal_tiling = -1;
const int universal_warp_shuffle = -1;  // semantics differ!
const int universal_occupancy = -1;

// ============================================
// Q5: RDNA wave32 vs wave64 tradeoff
// Wave32: each wavefront completes in half the
//   cycles, but you need twice as many to fill
//   the same hardware. Better for ??? workloads.
// Wave64: each wavefront has more latency hiding
//   potential. Better for ??? workloads.
// Answer: "irregular" or "regular"
// ============================================
const char* wave32_best_for = "?";
const char* wave64_best_for = "?";
`,
    solutionCode: `// GCN vs RDNA Analysis — Solutions

// Q1: Hardcoded offset=16 (assumes warpSize=32)
// max shuffle offset needed = warpSize/2
// For warpSize=32: max offset = 16 ✓
// For warpSize=64: max offset should be 32, but starts at 16 ✗
//   Only reduces within half the wavefront — WRONG result!
const int correct_nvidia = 1;       // warpSize=32, offset 16 is correct
const int correct_rdna_wave32 = 1;  // warpSize=32 in wave32 mode
const int correct_gcn = 0;          // warpSize=64, misses offset=32 step
const int correct_rdna_wave64 = 0;  // warpSize=64, same problem

// Q2: warpSize/2 adapts to any architecture
const int portable_nvidia = 1;
const int portable_rdna32 = 1;
const int portable_gcn = 1;
const int portable_rdna64 = 1;

// Q3: Waves/warps per block of 256 threads
const int waves_gcn = 4;     // 256 / 64 = 4 wavefronts
const int waves_rdna32 = 8;  // 256 / 32 = 8 wavefronts
const int warps_nvidia = 8;  // 256 / 32 = 8 warps

// Q4: Universal optimizations
const int universal_coalescing = 1;  // Memory coalescing matters everywhere
const int universal_tiling = 1;      // Data locality is always beneficial
const int universal_warp_shuffle = 0; // Width & mask semantics differ!
const int universal_occupancy = 1;   // Latency hiding always helps

// Q5: Wave32 completes faster per-wavefront but hides less latency.
// Better for irregular/divergent workloads where smaller groups
// waste less on idle threads.
// Wave64 has more in-flight threads per wavefront, hiding more
// memory latency. Better for regular, bandwidth-bound workloads.
const char* wave32_best_for = "irregular";
const char* wave64_best_for = "regular";

// THE META-PRINCIPLE:
// GCN → RDNA was a major architecture shift, but notice:
// - Coalesced access? Still matters.
// - Shared memory tiling? Still essential.
// - Minimizing divergence? Still critical.
// - Occupancy management? Still necessary.
//
// What changed: the specific numbers (wavefront width, CU layout).
// What didn't: the fundamental principles of GPU optimization.
// Write code that respects the principles, parameterize the
// numbers, and you survive architecture transitions.
`,
    testCode: '',
    hints: [
      'A reduction starting at offset=16 only reduces 32 values. On wave64, threads 32-63 are never combined. The result is wrong.',
      'The portable version with <code>warpSize/2</code> automatically starts at 32 on wave64 and 16 on wave32. Correct everywhere.',
      '256 threads / 64 per wavefront = 4 wavefronts (GCN). 256 / 32 = 8 (RDNA wave32 and NVIDIA).',
      'Memory coalescing, tiling, and occupancy are hardware-universal principles. Warp shuffle semantics (mask width, step count) are architecture-specific.',
    ],
    concepts: [
      'GCN vs RDNA architecture',
      'wave32 vs wave64',
      'portability across generations',
      'universal vs specific optimizations',
      'architecture evolution',
      'future-proof code',
    ],
    successPatterns: [
      'correct_nvidia\\s*=\\s*1',
      'correct_gcn\\s*=\\s*0',
      'portable_nvidia\\s*=\\s*1',
      'portable_gcn\\s*=\\s*1',
      'waves_gcn\\s*=\\s*4',
      'waves_rdna32\\s*=\\s*8',
      'universal_coalescing\\s*=\\s*1',
      'universal_warp_shuffle\\s*=\\s*0',
      'wave32_best_for\\s*=\\s*"irregular"',
      'wave64_best_for\\s*=\\s*"regular"',
    ],
    testNames: [
      'hardcoded reduction correct on NVIDIA (warpSize=32)',
      'hardcoded reduction BROKEN on GCN (warpSize=64)',
      'portable reduction correct on all architectures',
      'GCN: 4 wavefronts per 256-thread block',
      'RDNA wave32: 8 wavefronts per 256-thread block',
      'coalescing is a universal optimization',
      'warp shuffle is NOT universal (semantics differ)',
      'wave32 better for irregular workloads',
      'wave64 better for regular/bandwidth-bound workloads',
    ],
  },

  'rocm-profiling': {
    id: 'rocm-profiling',
    language: 'rocm',
    title: 'rocprof: Measurement Replaces Intuition',
    difficulty: 'advanced',
    order: 8,
    description: `
<h3>The Profiling Principle</h3>
<p>Butler Lampson's systems design hint: <em>"Measure. Don't tune for speed until you've measured."</em> This applies doubly to GPUs, where intuition about performance is notoriously wrong. A kernel that "looks fast" can be 10x slower than expected due to invisible bottlenecks.</p>

<h3>rocprof: AMD's GPU Profiler</h3>
<pre>
# Basic kernel timing
$ rocprof --stats myapp
# Output: kernel durations, launch configs, memory transfers

# Hardware counters
$ rocprof -i counters.txt myapp
# counters.txt:
#   pmc: SQ_WAVES, SQ_INSTS_VALU, FETCH_SIZE, WRITE_SIZE

# Application tracing
$ rocprof --hip-trace --hsa-trace myapp
# Output: timeline of all HIP API calls and HSA operations
</pre>

<h3>The Key Metrics</h3>
<table>
  <thead><tr><th>Metric</th><th>What It Tells You</th><th>Healthy Range</th></tr></thead>
  <tbody>
    <tr><td><strong>SQ_WAVES</strong></td><td>Total wavefronts launched</td><td>Sanity check for launch config</td></tr>
    <tr><td><strong>SQ_INSTS_VALU</strong></td><td>Vector ALU instructions executed</td><td>High = compute-heavy kernel</td></tr>
    <tr><td><strong>FETCH_SIZE</strong></td><td>Bytes read from memory</td><td>Compare to theoretical minimum</td></tr>
    <tr><td><strong>WRITE_SIZE</strong></td><td>Bytes written to memory</td><td>Compare to theoretical minimum</td></tr>
    <tr><td><strong>MemUnitBusy</strong></td><td>Memory unit utilization %</td><td>>60% = memory-bound</td></tr>
    <tr><td><strong>ALUBusy</strong></td><td>ALU utilization %</td><td>>60% = compute-bound</td></tr>
    <tr><td><strong>Wavefronts</strong></td><td>Active wavefronts per CU</td><td>Higher = better latency hiding</td></tr>
  </tbody>
</table>

<h3>The Diagnostic Process (Same as CUDA, Different Tools)</h3>
<pre>
Profile output for a matrix multiply kernel:
  FETCH_SIZE:  134,217,728 bytes (128 MB)
  Theoretical: 16,777,216 bytes (16 MB)  ← 2 * N² * sizeof(float)
  Ratio: 8x more data fetched than necessary

  Diagnosis: DATA REUSE IS POOR — same data loaded multiple times
  Fix: Shared memory tiling (reduce FETCH_SIZE to near theoretical)
</pre>

<h3>Comparing Against Roofline</h3>
<pre>
AMD MI250 specs:
  Peak compute: ~45 TFLOPS (FP32)
  Peak bandwidth: ~1600 GB/s (HBM2e)
  Balance point: 45e12 / 1600e9 = 28 FLOPs/byte

Your kernel:
  Achieved: 5 TFLOPS compute, 1400 GB/s bandwidth
  Arithmetic intensity: 5e12 / 1400e9 = 3.6 FLOPs/byte

  Diagnosis: At 3.6 FLOPs/byte, you're deep in the memory-bound
  regime. Bandwidth is near peak (1400/1600 = 87.5%).
  Compute optimization won't help — you need tiling.
</pre>

<h3>Design Principle</h3>
<p><em>"Measurement replaces intuition — profile, don't guess."</em> This is the same principle as Lampson's systems hints. The profiler tells you where the time actually goes. Your intuition tells you where you think it goes. They rarely agree, especially on GPUs.</p>

<h3>Your Task</h3>
<p>Read profiling output, diagnose bottlenecks, and recommend the correct optimization. This is the GPU equivalent of reading a medical chart — the numbers tell the story.</p>
`,
    starterCode: `// rocprof Performance Diagnosis
// AMD MI250: 45 TFLOPS FP32, 1600 GB/s HBM bandwidth
// Replace each "?" with the correct answer.

// ============================================
// Kernel 1 Profile:
//   Duration:    2.5 ms
//   FETCH_SIZE:  400 MB
//   WRITE_SIZE:  100 MB
//   SQ_INSTS_VALU: 50,000,000
//   MemUnitBusy: 92%
//   ALUBusy:     15%
//
// Q1a: Bottleneck? ("memory", "compute", "latency")
// Q1b: Achieved bandwidth? (total bytes / duration)
// Q1c: What percentage of peak bandwidth?
// ============================================
const char* bottleneck1 = "?";
const int bandwidth1_gbps = -1;  // (400+100) MB / 2.5ms = ? GB/s
const int pct_peak_bw1 = -1;     // bandwidth / 1600 * 100

// ============================================
// Kernel 2 Profile:
//   Duration:    1.0 ms
//   FETCH_SIZE:  50 MB
//   WRITE_SIZE:  10 MB
//   SQ_INSTS_VALU: 2,000,000,000
//   MemUnitBusy: 8%
//   ALUBusy:     85%
//
// Q2a: Bottleneck?
// Q2b: Approximately how many TFLOPS achieved?
//      (Assume ~2 FLOPs per VALU instruction on average)
// ============================================
const char* bottleneck2 = "?";
const int tflops2 = -1;  // 2B * 2 / 1ms = ? TFLOPS

// ============================================
// Kernel 3 Profile:
//   Duration:    5.0 ms
//   FETCH_SIZE:  200 MB
//   WRITE_SIZE:  50 MB
//   MemUnitBusy: 12%
//   ALUBusy:     8%
//   Wavefronts per CU: 4 (out of max 32)
//
// Q3a: Bottleneck?
// Q3b: What does low wavefront count indicate?
// Q3c: Best fix?
// ============================================
const char* bottleneck3 = "?";
const char* wavefront_problem = "?";
// Use: "low_occupancy", "bank_conflicts", "divergence"
const char* fix3 = "?";
// Use: "add_tiling", "reduce_instructions",
//      "increase_occupancy", "fix_coalescing"

// ============================================
// Kernel 4 Profile:
//   FETCH_SIZE:  512 MB
//   Theoretical minimum fetch: 64 MB
//   (Matrix multiply: 2 * N^2 * 4 bytes)
//
// Q4a: How many times is data re-fetched?
// Q4b: What fix reduces FETCH_SIZE to near 64 MB?
// ============================================
const int refetch_ratio = -1;  // 512 / 64
const char* fix4 = "?";
// Use: "shared_memory_tiling", "loop_unrolling",
//      "register_blocking", "warp_shuffle"

// ============================================
// Q5: Roofline analysis
//   Kernel achieves 8 TFLOPS and 1200 GB/s
//   Arithmetic intensity = 8e12 / 1200e9 = 6.67 FLOPs/byte
//   Balance point = 45e12 / 1600e9 = 28 FLOPs/byte
//   Is this kernel memory-bound or compute-bound?
// ============================================
const char* roofline5 = "?";  // "memory" or "compute"
`,
    solutionCode: `// rocprof Performance Diagnosis — Solutions

// Kernel 1: Memory unit at 92%, ALU at 15%.
// Classic memory-bound kernel.
const char* bottleneck1 = "memory";
// (400 + 100) MB / 2.5 ms = 500 / 0.0025 = 200,000 MB/s = 200 GB/s
const int bandwidth1_gbps = 200;
// 200 / 1600 * 100 = 12.5% — wait, that's low for 92% MemUnitBusy!
// This suggests uncoalesced access: the memory unit is busy
// processing MANY small transactions, but effective bandwidth is low.
const int pct_peak_bw1 = 12;

// Kernel 2: ALU at 85%, memory at 8%.
// Compute-bound kernel — the ALU is the bottleneck.
const char* bottleneck2 = "compute";
// 2 billion VALU * 2 FLOPs = 4 TFLOPS / 1ms = 4 TFLOPS
const int tflops2 = 4;

// Kernel 3: Both memory (12%) and ALU (8%) are low.
// Only 4 wavefronts per CU (out of 32 max) = 12.5% occupancy.
// Not enough active threads to hide latency.
const char* bottleneck3 = "latency";
const char* wavefront_problem = "low_occupancy";
// More wavefronts = more threads to schedule during stalls.
const char* fix3 = "increase_occupancy";

// Kernel 4: Fetching 8x more data than theoretically needed.
// The same matrix elements are being loaded multiple times
// from global memory. Shared memory tiling caches tiles on-chip.
const int refetch_ratio = 8;
const char* fix4 = "shared_memory_tiling";

// Q5: Arithmetic intensity 6.67 << balance point 28
// The kernel is far to the left of the roofline ridge point.
// It is deeply memory-bound: limited by bandwidth, not compute.
const char* roofline5 = "memory";

// PROFILING WORKFLOW SUMMARY:
// 1. Run rocprof with hardware counters
// 2. Check MemUnitBusy and ALUBusy:
//    - One high, one low → that's your bottleneck
//    - Both low → latency-bound (check occupancy)
// 3. Compare FETCH_SIZE to theoretical minimum
//    - Ratio > 2x → data reuse problem → add tiling
// 4. Compare achieved bandwidth to roofline
//    - Below ridge point → memory-bound
//    - Above ridge point → compute-bound
// 5. Only then choose an optimization strategy
//
// This is the same process as CUDA's Nsight Compute,
// just with different tool names and counter names.
// The DIAGNOSTIC THINKING is identical.
`,
    testCode: '',
    hints: [
      'Bandwidth = total bytes transferred / duration. (400+100) MB / 2.5ms. Convert ms to seconds first.',
      'MemUnitBusy 92% but low effective bandwidth suggests the memory unit is processing many small, inefficient transactions (uncoalesced access).',
      'When both MemUnitBusy and ALUBusy are low, the GPU is stalling. Low wavefront count = low occupancy = not enough threads to hide latency.',
      'FETCH_SIZE / theoretical minimum gives the re-fetch ratio. 8x means the same data is loaded 8 times — shared memory tiling fixes this.',
    ],
    concepts: [
      'rocprof profiling',
      'hardware counters',
      'roofline analysis',
      'bottleneck diagnosis',
      'memory-bound vs compute-bound',
      'occupancy analysis',
      'data reuse measurement',
    ],
    successPatterns: [
      'bottleneck1\\s*=\\s*"memory"',
      'bandwidth1_gbps\\s*=\\s*200',
      'bottleneck2\\s*=\\s*"compute"',
      'tflops2\\s*=\\s*4',
      'bottleneck3\\s*=\\s*"latency"',
      'wavefront_problem\\s*=\\s*"low_occupancy"',
      'fix3\\s*=\\s*"increase_occupancy"',
      'refetch_ratio\\s*=\\s*8',
      'fix4\\s*=\\s*"shared_memory_tiling"',
      'roofline5\\s*=\\s*"memory"',
    ],
    testNames: [
      'Kernel 1 diagnosed as memory-bound (92% MemUnitBusy)',
      'Kernel 1 achieved bandwidth is 200 GB/s',
      'Kernel 2 diagnosed as compute-bound (85% ALUBusy)',
      'Kernel 2 achieves approximately 4 TFLOPS',
      'Kernel 3 diagnosed as latency-bound (both metrics low)',
      'low wavefront count indicates low occupancy',
      'latency-bound fix: increase occupancy',
      'data re-fetched 8x more than theoretical minimum',
      'shared memory tiling fixes data reuse problem',
      'roofline: intensity 6.67 << 28 balance point → memory-bound',
    ],
  },
};
