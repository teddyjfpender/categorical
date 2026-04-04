import type { Exercise } from '../types/exercise';

export const exercises: Record<string, Exercise> = {
  // ─────────────────────────────────────────────
  // Module 1: HIP Fundamentals
  // ─────────────────────────────────────────────

  'rocm-hip-basics': {
    id: 'rocm-hip-basics',
    language: 'rocm',
    title: 'HIP Basics: AMD GPU Programming',
    difficulty: 'beginner',
    order: 1,
    description: `
<p><strong>HIP</strong> (Heterogeneous-compute Interface for Portability) is AMD's GPU programming API. It is intentionally designed to mirror CUDA's API almost identically, making it easy to port GPU code between NVIDIA and AMD hardware.</p>

<h3>HIP vs CUDA API Mapping</h3>
<pre>
CUDA                          HIP
──────────────────────────────────────────────
cudaMalloc(&ptr, size)   →   hipMalloc(&ptr, size)
cudaMemcpy(dst,src,n,k)  →   hipMemcpy(dst,src,n,k)
cudaFree(ptr)            →   hipFree(ptr)
cudaDeviceSynchronize()  →   hipDeviceSynchronize()
cudaGetDeviceProperties  →   hipGetDeviceProperties

__global__ void kernel() →   __global__ void kernel()  (SAME!)
kernel<<<g,b>>>()        →   kernel<<<g,b>>>()         (SAME!)
__shared__ float s[]     →   __shared__ float s[]      (SAME!)
threadIdx.x              →   threadIdx.x               (SAME!)
blockIdx.x               →   blockIdx.x                (SAME!)
blockDim.x               →   blockDim.x                (SAME!)
</pre>

<h3>The HIP Workflow</h3>
<pre>
1. Allocate device memory     hipMalloc()
2. Copy data to device        hipMemcpy(... hipMemcpyHostToDevice)
3. Launch kernel              kernel<<<blocks, threads>>>(...)
4. Copy results back          hipMemcpy(... hipMemcpyDeviceToHost)
5. Free device memory         hipFree()

  CPU (Host)                  GPU (Device)
  ┌──────────┐   hipMemcpy   ┌──────────┐
  │ h_data[] │ ──────────→   │ d_data[] │
  └──────────┘               │          │
                              │ kernel() │
  ┌──────────┐   hipMemcpy   │          │
  │ h_out[]  │ ←──────────   │ d_out[]  │
  └──────────┘               └──────────┘
</pre>

<h3>Your Task</h3>
<p>Write a complete HIP program that allocates device memory, copies data, launches a vector-scale kernel (multiply every element by a scalar), and copies results back.</p>
`,
    starterCode: `#include <hip/hip_runtime.h>
#include <stdio.h>

// TODO: Write a HIP kernel that scales every element by a factor
// __global__ void vectorScale(float* data, float factor, int n) {
//     ...
// }

int main() {
    const int N = 1024;
    const float scale = 2.5f;
    float h_data[N];

    // Initialize host data
    for (int i = 0; i < N; i++) h_data[i] = (float)i;

    float* d_data;

    // TODO: Allocate device memory
    // hipMalloc(&d_data, N * sizeof(float));

    // TODO: Copy host data to device
    // hipMemcpy(d_data, h_data, N * sizeof(float), hipMemcpyHostToDevice);

    // TODO: Launch kernel with 256 threads per block
    // int blocks = (N + 255) / 256;
    // vectorScale<<<blocks, 256>>>(d_data, scale, N);

    // TODO: Copy results back to host
    // hipMemcpy(h_data, d_data, N * sizeof(float), hipMemcpyDeviceToHost);

    // TODO: Free device memory
    // hipFree(d_data);

    return 0;
}
`,
    solutionCode: `#include <hip/hip_runtime.h>
#include <stdio.h>

__global__ void vectorScale(float* data, float factor, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) {
        data[i] = data[i] * factor;
    }
}

int main() {
    const int N = 1024;
    const float scale = 2.5f;
    float h_data[N];

    for (int i = 0; i < N; i++) h_data[i] = (float)i;

    float* d_data;

    hipMalloc(&d_data, N * sizeof(float));

    hipMemcpy(d_data, h_data, N * sizeof(float), hipMemcpyHostToDevice);

    int blocks = (N + 255) / 256;
    vectorScale<<<blocks, 256>>>(d_data, scale, N);

    hipMemcpy(h_data, d_data, N * sizeof(float), hipMemcpyDeviceToHost);

    hipFree(d_data);

    return 0;
}
`,
    testCode: '',
    hints: [
      'The kernel is almost identical to CUDA: <code>__global__ void vectorScale(float* data, float factor, int n)</code> with global ID calculation and bounds check.',
      'Allocate device memory with <code>hipMalloc(&d_data, N * sizeof(float));</code> — the ampersand is required since hipMalloc takes a pointer-to-pointer.',
      'Use <code>hipMemcpyHostToDevice</code> when copying TO the GPU and <code>hipMemcpyDeviceToHost</code> when copying FROM the GPU.',
      'Free device memory with <code>hipFree(d_data);</code> — always clean up to prevent memory leaks.',
    ],
    concepts: [
      'HIP',
      'hipMalloc',
      'hipMemcpy',
      'hipFree',
      'kernel launch',
      'device memory',
      'host-device transfer',
    ],
    successPatterns: [
      '__global__\\s+void\\s+vectorScale',
      'hipMalloc\\s*\\(\\s*&d_data',
      'hipMemcpy.*hipMemcpyHostToDevice',
      'hipMemcpy.*hipMemcpyDeviceToHost',
      'hipFree\\(d_data\\)',
    ],
    testNames: [
      'declares __global__ vectorScale kernel',
      'allocates device memory with hipMalloc',
      'copies data to device with hipMemcpyHostToDevice',
      'copies results back with hipMemcpyDeviceToHost',
      'frees device memory with hipFree',
    ],
  },

  'rocm-cuda-translation': {
    id: 'rocm-cuda-translation',
    language: 'rocm',
    title: 'Translating CUDA to HIP',
    difficulty: 'intermediate',
    order: 2,
    description: `
<p>One of HIP's greatest strengths is how closely it mirrors CUDA. Most translations are <strong>mechanical</strong> — just prefix substitution. But a few require genuine thought.</p>

<h3>Mechanical Translations (find-and-replace)</h3>
<pre>
cuda  →  hip     (prefix swap)
──────────────────────────────────────
cudaMalloc          →  hipMalloc
cudaMemcpy          →  hipMemcpy
cudaFree            →  hipFree
cudaDeviceSynchronize → hipDeviceSynchronize
cudaMemcpyHostToDevice → hipMemcpyHostToDevice
cudaMemcpyDeviceToHost → hipMemcpyDeviceToHost
cudaGetLastError    →  hipGetLastError
cudaError_t         →  hipError_t
cudaSuccess         →  hipSuccess
</pre>

<h3>Things That Stay the Same</h3>
<pre>
__global__, __device__, __host__       (identical)
__shared__, __constant__               (identical)
threadIdx, blockIdx, blockDim, gridDim (identical)
<<<blocks, threads>>>                  (identical)
__syncthreads()                        (identical)
atomicAdd, atomicMax, etc.             (identical)
</pre>

<h3>Things That Need Thought</h3>
<pre>
CUDA                        HIP                          Note
───────────────────────────────────────────────────────────────────
cudaStream_t               hipStream_t                  Type rename
cudaEvent_t                hipEvent_t                   Type rename
__shfl_sync(m,v,s)         __shfl(v,s)                  Mask implicit*
warpSize (32)              warpSize (64 on AMD!)        CRITICAL!
cub::DeviceReduce          hipcub::DeviceReduce         Library change
thrust::...                thrust::... (via rocThrust)  Different backend
</pre>
<p><small>*HIP on AMD uses implicit masking for wave operations; the mask parameter is ignored.</small></p>

<h3>Your Task</h3>
<p>Translate the following CUDA program to HIP. The kernel logic stays identical — only API calls change.</p>
`,
    starterCode: `// ORIGINAL CUDA CODE — Translate this to HIP
// Replace each CUDA API call with its HIP equivalent

#include <hip/hip_runtime.h>  // Already changed from cuda_runtime.h

__global__ void saxpy(float a, const float* x, float* y, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) {
        y[i] = a * x[i] + y[i];
    }
}

int main() {
    const int N = 1 << 20;
    float *d_x, *d_y;
    float *h_x, *h_y;

    h_x = (float*)malloc(N * sizeof(float));
    h_y = (float*)malloc(N * sizeof(float));

    // TODO: Replace cudaMalloc with HIP equivalent
    // cudaMalloc(&d_x, N * sizeof(float));
    // cudaMalloc(&d_y, N * sizeof(float));

    // TODO: Replace cudaMemcpy with HIP equivalent
    // cudaMemcpy(d_x, h_x, N * sizeof(float), cudaMemcpyHostToDevice);
    // cudaMemcpy(d_y, h_y, N * sizeof(float), cudaMemcpyHostToDevice);

    int threads = 256;
    int blocks = (N + threads - 1) / threads;
    saxpy<<<blocks, threads>>>(2.0f, d_x, d_y, N);

    // TODO: Replace cudaDeviceSynchronize
    // cudaDeviceSynchronize();

    // TODO: Replace cudaMemcpy for device-to-host
    // cudaMemcpy(h_y, d_y, N * sizeof(float), cudaMemcpyDeviceToHost);

    // TODO: Replace cudaFree
    // cudaFree(d_x);
    // cudaFree(d_y);

    free(h_x);
    free(h_y);
    return 0;
}
`,
    solutionCode: `#include <hip/hip_runtime.h>

__global__ void saxpy(float a, const float* x, float* y, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) {
        y[i] = a * x[i] + y[i];
    }
}

int main() {
    const int N = 1 << 20;
    float *d_x, *d_y;
    float *h_x, *h_y;

    h_x = (float*)malloc(N * sizeof(float));
    h_y = (float*)malloc(N * sizeof(float));

    hipMalloc(&d_x, N * sizeof(float));
    hipMalloc(&d_y, N * sizeof(float));

    hipMemcpy(d_x, h_x, N * sizeof(float), hipMemcpyHostToDevice);
    hipMemcpy(d_y, h_y, N * sizeof(float), hipMemcpyHostToDevice);

    int threads = 256;
    int blocks = (N + threads - 1) / threads;
    saxpy<<<blocks, threads>>>(2.0f, d_x, d_y, N);

    hipDeviceSynchronize();

    hipMemcpy(h_y, d_y, N * sizeof(float), hipMemcpyDeviceToHost);

    hipFree(d_x);
    hipFree(d_y);

    free(h_x);
    free(h_y);
    return 0;
}
`,
    testCode: '',
    hints: [
      'The translation is mostly mechanical: <code>cuda</code> prefix becomes <code>hip</code>. For example, <code>cudaMalloc</code> becomes <code>hipMalloc</code>.',
      'The copy direction constants change similarly: <code>cudaMemcpyHostToDevice</code> becomes <code>hipMemcpyHostToDevice</code>.',
      'The kernel code, launch syntax (<<<>>>), and all built-in variables (threadIdx, blockIdx, etc.) are <strong>identical</strong> between CUDA and HIP.',
      '<code>cudaDeviceSynchronize()</code> becomes <code>hipDeviceSynchronize()</code>. <code>cudaFree</code> becomes <code>hipFree</code>.',
    ],
    concepts: [
      'CUDA to HIP translation',
      'hipMalloc',
      'hipMemcpy',
      'hipDeviceSynchronize',
      'API portability',
      'SAXPY',
    ],
    successPatterns: [
      'hipMalloc\\(&d_x',
      'hipMalloc\\(&d_y',
      'hipMemcpy.*hipMemcpyHostToDevice',
      'hipDeviceSynchronize\\(\\)',
      'hipFree\\(d_x\\)',
      'hipFree\\(d_y\\)',
    ],
    testNames: [
      'translates cudaMalloc to hipMalloc for d_x',
      'translates cudaMalloc to hipMalloc for d_y',
      'translates cudaMemcpy with hipMemcpyHostToDevice',
      'translates cudaDeviceSynchronize to hipDeviceSynchronize',
      'translates cudaFree to hipFree for d_x',
      'translates cudaFree to hipFree for d_y',
    ],
  },

  'rocm-portable-kernels': {
    id: 'rocm-portable-kernels',
    language: 'rocm',
    title: 'Writing Portable GPU Kernels',
    difficulty: 'intermediate',
    order: 3,
    description: `
<p>The holy grail of GPU programming: code that compiles and runs on <strong>both</strong> NVIDIA and AMD hardware. HIP makes this possible, but some platform differences require conditional compilation.</p>

<h3>Platform Detection Macros</h3>
<pre>
Macro                         Defined When
──────────────────────────────────────────────────────
__HIP_PLATFORM_AMD__         Compiling for AMD GPU
__HIP_PLATFORM_NVIDIA__      Compiling for NVIDIA GPU
__CUDA_ARCH__                Inside a CUDA device function
__HIP_DEVICE_COMPILE__       Inside a HIP device function
</pre>

<h3>The Warp/Wave Size Problem</h3>
<pre>
NVIDIA: warpSize = 32  (warp of 32 threads)
AMD:    warpSize = 64  (wavefront of 64 threads)

This affects:
  - Reduction algorithms (number of shuffle steps)
  - Shared memory sizing (per-warp scratch space)
  - Ballot/vote operations (32-bit vs 64-bit mask)
  - Bank conflict patterns

Solution: Use warpSize variable (runtime) or
          compile-time constant with #ifdef
</pre>

<h3>Portable Warp Reduction</h3>
<pre>
#ifdef __HIP_PLATFORM_AMD__
  #define WARP_SIZE 64
  typedef unsigned long long warp_mask_t;
#else
  #define WARP_SIZE 32
  typedef unsigned int warp_mask_t;
#endif

#define FULL_MASK ((warp_mask_t)-1)  // All bits set
</pre>

<h3>Your Task</h3>
<p>Write a portable reduction kernel that works correctly on both 32-thread warps (NVIDIA) and 64-thread wavefronts (AMD). Use preprocessor guards for platform-specific code.</p>
`,
    starterCode: `// Portable GPU Kernel — works on both NVIDIA and AMD

// TODO: Define WARP_SIZE based on platform
// #ifdef __HIP_PLATFORM_AMD__
//   #define WARP_SIZE 64
// #else
//   #define WARP_SIZE 32
// #endif

// TODO: Define the full mask type (64-bit for AMD, 32-bit for NVIDIA)
// #ifdef __HIP_PLATFORM_AMD__
//   typedef unsigned long long warp_mask_t;
// #else
//   typedef unsigned int warp_mask_t;
// #endif

#define FULL_MASK ((warp_mask_t)-1)

// TODO: Implement portable warp reduction
// Must handle both 32-thread and 64-thread cases
__device__ float portableWarpReduce(float val) {
    // For WARP_SIZE 64: start delta at 32, then 16, 8, 4, 2, 1
    // For WARP_SIZE 32: start delta at 16, then 8, 4, 2, 1

    // TODO: Use a loop or unrolled shuffles
    // for (int delta = WARP_SIZE / 2; delta > 0; delta >>= 1) {
    //     val += __shfl_down(val, delta);
    // }

    return val;
}

// Portable block reduction
__global__ void portableReduce(const float* input, float* output, int n) {
    // TODO: Shared memory sized by actual warp count
    // __shared__ float warp_sums[???];  // blockDim.x / WARP_SIZE

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int lane = tid % WARP_SIZE;
    int warpId = tid / WARP_SIZE;

    float val = (i < n) ? input[i] : 0.0f;

    // TODO: Warp-level reduction
    // val = portableWarpReduce(val);

    // TODO: Cross-warp reduction via shared memory
    // if (lane == 0) warp_sums[warpId] = val;
    // __syncthreads();
    // val = (tid < blockDim.x / WARP_SIZE) ? warp_sums[lane] : 0.0f;
    // if (warpId == 0) val = portableWarpReduce(val);

    if (tid == 0) output[blockIdx.x] = val;
}
`,
    solutionCode: `// Portable GPU Kernel — works on both NVIDIA and AMD

#ifdef __HIP_PLATFORM_AMD__
  #define WARP_SIZE 64
  typedef unsigned long long warp_mask_t;
#else
  #define WARP_SIZE 32
  typedef unsigned int warp_mask_t;
#endif

#define FULL_MASK ((warp_mask_t)-1)

__device__ float portableWarpReduce(float val) {
    for (int delta = WARP_SIZE / 2; delta > 0; delta >>= 1) {
        val += __shfl_down(val, delta);
    }
    return val;
}

__global__ void portableReduce(const float* input, float* output, int n) {
    __shared__ float warp_sums[32];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int lane = tid % WARP_SIZE;
    int warpId = tid / WARP_SIZE;

    float val = (i < n) ? input[i] : 0.0f;

    val = portableWarpReduce(val);

    if (lane == 0) warp_sums[warpId] = val;

    __syncthreads();

    val = (tid < blockDim.x / WARP_SIZE) ? warp_sums[lane] : 0.0f;
    if (warpId == 0) val = portableWarpReduce(val);

    if (tid == 0) output[blockIdx.x] = val;
}
`,
    testCode: '',
    hints: [
      'Use <code>#ifdef __HIP_PLATFORM_AMD__</code> to detect AMD. Define WARP_SIZE as 64 for AMD, 32 for NVIDIA.',
      'AMD uses 64-bit masks for wave operations (<code>unsigned long long</code>), while NVIDIA uses 32-bit (<code>unsigned int</code>).',
      'The warp reduction loop works for any WARP_SIZE: <code>for (int delta = WARP_SIZE/2; delta > 0; delta >>= 1)</code>.',
      'For shared memory sizing, use a fixed 32-element array (sufficient for up to 1024 threads per block with either warp size).',
    ],
    concepts: [
      'portable kernels',
      'conditional compilation',
      '__HIP_PLATFORM_AMD__',
      'warp vs wavefront',
      'warp size differences',
      'cross-platform GPU code',
    ],
    successPatterns: [
      '#ifdef\\s+__HIP_PLATFORM_AMD__',
      '#define\\s+WARP_SIZE\\s+64',
      '#define\\s+WARP_SIZE\\s+32',
      '__shfl_down\\(val,\\s*delta\\)',
      'portableWarpReduce\\(val\\)',
    ],
    testNames: [
      'uses #ifdef __HIP_PLATFORM_AMD__ for platform detection',
      'defines WARP_SIZE 64 for AMD',
      'defines WARP_SIZE 32 for NVIDIA',
      'implements warp reduction with __shfl_down',
      'calls portableWarpReduce for block reduction',
    ],
  },

  'rocm-hipify': {
    id: 'rocm-hipify',
    language: 'rocm',
    title: 'Hipify: Automated CUDA-to-HIP Conversion',
    difficulty: 'intermediate',
    order: 4,
    description: `
<p>AMD provides <strong>hipify-perl</strong> and <strong>hipify-clang</strong> tools that automatically convert CUDA source code to HIP. Most transformations are mechanical, but some require human judgment.</p>

<h3>What Hipify Handles Automatically</h3>
<pre>
✓ API renames:    cudaMalloc → hipMalloc
✓ Type renames:   cudaError_t → hipError_t
✓ Enum renames:   cudaSuccess → hipSuccess
✓ Header swaps:   cuda_runtime.h → hip/hip_runtime.h
✓ Library calls:  cublasSgemm → hipblasSgemm
</pre>

<h3>What Requires Human Thought</h3>
<pre>
⚠ Warp size assumptions:
    // CUDA code assumes warpSize == 32
    __shared__ float warp_scratch[32];     // WRONG on AMD (need 64)
    unsigned mask = __ballot_sync(0xFFFFFFFF, pred);
    // 32-bit mask insufficient for 64-thread wavefront!

⚠ Architecture-specific intrinsics:
    // CUDA-only intrinsics with no HIP equivalent
    __ldg()     // Load through texture cache (use __builtin_nontemporal_load on AMD)

⚠ Inline PTX assembly:
    asm("mov.u32 %0, %%laneid;" : "=r"(lane));
    // Must be rewritten for AMD GCN/RDNA ISA

⚠ Library differences:
    // cuDNN → MIOpen (different API entirely)
    // cuBLAS → hipBLAS (close but not identical)
    // Thrust → rocThrust (mostly compatible)

⚠ Hardcoded constants:
    const int WARPS = blockDim.x / 32;    // Should use warpSize
</pre>

<h3>Your Task</h3>
<p>Convert the following CUDA program to HIP. Identify which changes are <strong>mechanical</strong> (just rename) and which require <strong>architectural thought</strong> (warp size, masks, etc.).</p>
`,
    starterCode: `// CUDA Program — Convert to HIP
// Mark each change as MECHANICAL or ARCHITECTURAL

// TODO: Change header (MECHANICAL)
// #include <cuda_runtime.h>
#include <hip/hip_runtime.h>

// TODO: Fix the warp size constant (ARCHITECTURAL)
// This is hardcoded to 32 — AMD wavefronts are 64!
#define WARP_SIZE 32  // FIX THIS

__device__ int countSetBits(int val) {
    // TODO: This ballot uses a 32-bit mask (ARCHITECTURAL)
    // AMD needs a 64-bit mask for full wavefront
    unsigned mask = __ballot_sync(0xFFFFFFFF, val > 0);
    return __popc(mask);
}

__global__ void process(const float* input, float* output, int n) {
    // TODO: Fix shared memory size (ARCHITECTURAL)
    // Sized for 32-thread warps, wrong for AMD
    __shared__ float warp_data[32];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int lane = tid % WARP_SIZE;
    int warpId = tid / WARP_SIZE;

    float val = (i < n) ? input[i] : 0.0f;

    // Warp-level reduction
    for (int delta = WARP_SIZE / 2; delta > 0; delta >>= 1) {
        val += __shfl_down_sync(0xFFFFFFFF, val, delta);
    }

    if (lane == 0) warp_data[warpId] = val;
    __syncthreads();

    if (tid == 0) {
        float sum = 0.0f;
        int numWarps = blockDim.x / WARP_SIZE;
        for (int w = 0; w < numWarps; w++) {
            sum += warp_data[w];
        }
        output[blockIdx.x] = sum;
    }
}

int main() {
    float *d_in, *d_out;

    // TODO: Convert these (MECHANICAL)
    // cudaMalloc(&d_in, 1024 * sizeof(float));
    // cudaMalloc(&d_out, 4 * sizeof(float));

    process<<<4, 256>>>(d_in, d_out, 1024);

    // TODO: Convert (MECHANICAL)
    // cudaDeviceSynchronize();
    // cudaFree(d_in);
    // cudaFree(d_out);

    return 0;
}
`,
    solutionCode: `// HIP Program — Converted from CUDA
// Changes marked as MECHANICAL or ARCHITECTURAL

// MECHANICAL: Header swap
#include <hip/hip_runtime.h>

// ARCHITECTURAL: Warp/wavefront size depends on platform
#ifdef __HIP_PLATFORM_AMD__
  #define WARP_SIZE 64
#else
  #define WARP_SIZE 32
#endif

__device__ int countSetBits(int val) {
    // ARCHITECTURAL: Use __ballot and platform-appropriate popcount
    // On AMD, __ballot returns 64-bit mask for wavefront
    #ifdef __HIP_PLATFORM_AMD__
    unsigned long long mask = __ballot(val > 0);
    return __popcll(mask);
    #else
    unsigned mask = __ballot_sync(0xFFFFFFFF, val > 0);
    return __popc(mask);
    #endif
}

__global__ void process(const float* input, float* output, int n) {
    // ARCHITECTURAL: Shared memory sized for actual warp count
    __shared__ float warp_data[1024 / WARP_SIZE];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int lane = tid % WARP_SIZE;
    int warpId = tid / WARP_SIZE;

    float val = (i < n) ? input[i] : 0.0f;

    for (int delta = WARP_SIZE / 2; delta > 0; delta >>= 1) {
        val += __shfl_down(val, delta);
    }

    if (lane == 0) warp_data[warpId] = val;
    __syncthreads();

    if (tid == 0) {
        float sum = 0.0f;
        int numWarps = blockDim.x / WARP_SIZE;
        for (int w = 0; w < numWarps; w++) {
            sum += warp_data[w];
        }
        output[blockIdx.x] = sum;
    }
}

int main() {
    float *d_in, *d_out;

    // MECHANICAL: cuda → hip prefix
    hipMalloc(&d_in, 1024 * sizeof(float));
    hipMalloc(&d_out, 4 * sizeof(float));

    process<<<4, 256>>>(d_in, d_out, 1024);

    // MECHANICAL: cuda → hip prefix
    hipDeviceSynchronize();
    hipFree(d_in);
    hipFree(d_out);

    return 0;
}
`,
    testCode: '',
    hints: [
      'The mechanical changes are pure prefix swaps: <code>cudaMalloc → hipMalloc</code>, <code>cudaFree → hipFree</code>, <code>cudaDeviceSynchronize → hipDeviceSynchronize</code>.',
      'The WARP_SIZE must be conditional: <code>#ifdef __HIP_PLATFORM_AMD__</code> → 64, else 32. Hardcoding 32 will produce wrong results on AMD.',
      'On AMD, <code>__ballot</code> returns a 64-bit <code>unsigned long long</code>. Use <code>__popcll</code> instead of <code>__popc</code> to count bits in a 64-bit mask.',
      'The shared memory array <code>warp_data</code> must be sized for the actual number of warps: <code>blockDim.x / WARP_SIZE</code>. With WARP_SIZE=64, a 256-thread block has only 4 warps, not 8.',
    ],
    concepts: [
      'hipify',
      'mechanical translation',
      'architectural changes',
      'warp size portability',
      '__ballot',
      'conditional compilation',
    ],
    successPatterns: [
      '#ifdef\\s+__HIP_PLATFORM_AMD__',
      '#define\\s+WARP_SIZE\\s+64',
      'hipMalloc\\(&d_in',
      'hipDeviceSynchronize\\(\\)',
      'hipFree\\(d_in\\)',
      '__shfl_down\\(',
    ],
    testNames: [
      'uses #ifdef for platform-specific WARP_SIZE',
      'defines WARP_SIZE 64 for AMD',
      'converts cudaMalloc to hipMalloc',
      'converts cudaDeviceSynchronize to hipDeviceSynchronize',
      'converts cudaFree to hipFree',
      'uses __shfl_down for HIP shuffle operations',
    ],
  },

  // ─────────────────────────────────────────────
  // Module 2: AMD Architecture
  // ─────────────────────────────────────────────

  'rocm-wavefronts': {
    id: 'rocm-wavefronts',
    language: 'rocm',
    title: 'Wavefronts: AMD\'s Execution Model',
    difficulty: 'advanced',
    order: 1,
    description: `
<p>AMD GPUs execute threads in groups of <strong>64</strong> called <strong>wavefronts</strong>, compared to NVIDIA's groups of 32 called warps. This seemingly small difference has significant algorithmic implications.</p>

<h3>Warp (NVIDIA) vs Wavefront (AMD)</h3>
<pre>
NVIDIA Warp:                     AMD Wavefront:
┌─────────────────────────┐     ┌─────────────────────────────────────────────────┐
│ 32 threads, lockstep    │     │ 64 threads, lockstep                            │
│ T0 T1 T2 ... T31        │     │ T0 T1 T2 ... T31 T32 T33 ... T63               │
└─────────────────────────┘     └─────────────────────────────────────────────────┘

Same block of 256 threads:
  NVIDIA: 256 / 32 = 8 warps
  AMD:    256 / 64 = 4 wavefronts
</pre>

<h3>Impact on Algorithms</h3>
<pre>
Reduction (shuffle steps):
  NVIDIA (32): delta = 16, 8, 4, 2, 1       → 5 steps
  AMD    (64): delta = 32, 16, 8, 4, 2, 1   → 6 steps

Ballot mask:
  NVIDIA: 32-bit unsigned int
  AMD:    64-bit unsigned long long

Shared memory per-warp scratch:
  NVIDIA: 8 warps/block × scratch = more shared mem
  AMD:    4 wavefronts/block × scratch = less shared mem
  (but each wavefront does more work!)

Divergence cost:
  NVIDIA: branch divergence affects 32 threads
  AMD:    branch divergence affects 64 threads!
  → AMD pays a HIGHER penalty for divergent code
</pre>

<h3>RDNA Wave32 Mode</h3>
<p>AMD's newer RDNA architecture supports <strong>wave32</strong> mode (32 threads per wavefront), matching NVIDIA. The compiler or programmer can choose wave32 or wave64. This makes porting even easier.</p>

<h3>Your Task</h3>
<p>Adapt a reduction algorithm for AMD's 64-thread wavefronts. Compute the correct values for each architecture.</p>
`,
    starterCode: `// Wavefront Analysis — Predict the Answer

// ============================================
// Q1: Thread Organization
// A block has 512 threads. How many execution units?
// ============================================
const int nvidia_warps = -1;       // 512 / 32
const int amd_wavefronts = -1;     // 512 / 64

// ============================================
// Q2: Shuffle Reduction Steps
// How many __shfl_down steps to reduce within one unit?
// ============================================
const int nvidia_shfl_steps = -1;  // log2(32)
const int amd_shfl_steps = -1;     // log2(64)

// ============================================
// Q3: Cross-unit shared memory
// For block-level reduction, how many warp/wavefront
// sums need to be stored in shared memory?
// (block size = 512)
// ============================================
const int nvidia_warp_sums = -1;   // 512 / 32
const int amd_warp_sums = -1;      // 512 / 64

// ============================================
// Q4: Ballot mask type
// How many bits in the ballot result?
// ============================================
const int nvidia_ballot_bits = -1; // threads per warp
const int amd_ballot_bits = -1;    // threads per wavefront

// ============================================
// Q5: Divergence penalty
// If an if/else has 50/50 branch probability:
// How many threads are idle during each branch?
// ============================================
const int nvidia_idle_threads = -1;  // half of warp
const int amd_idle_threads = -1;     // half of wavefront

// ============================================
// Q6: Implement the AMD wavefront reduction
// ============================================
__device__ float wavefrontReduce(float val) {
    // TODO: 6 steps for 64-thread wavefront
    // delta = 32, 16, 8, 4, 2, 1
    // val += __shfl_down(val, delta);

    return val;
}
`,
    solutionCode: `// Wavefront Analysis — Solutions

// Q1: 512 threads
const int nvidia_warps = 16;       // 512 / 32
const int amd_wavefronts = 8;      // 512 / 64

// Q2: Shuffle steps = log2(unit size)
const int nvidia_shfl_steps = 5;   // log2(32) = 5
const int amd_shfl_steps = 6;      // log2(64) = 6

// Q3: Shared memory entries for cross-unit reduction
const int nvidia_warp_sums = 16;   // 512 / 32
const int amd_warp_sums = 8;       // 512 / 64

// Q4: Ballot bits = threads per execution unit
const int nvidia_ballot_bits = 32;
const int amd_ballot_bits = 64;

// Q5: 50/50 branch: half the unit is idle
const int nvidia_idle_threads = 16;  // 32 / 2
const int amd_idle_threads = 32;     // 64 / 2

// Q6: Wavefront reduction (64 threads)
__device__ float wavefrontReduce(float val) {
    val += __shfl_down(val, 32);
    val += __shfl_down(val, 16);
    val += __shfl_down(val, 8);
    val += __shfl_down(val, 4);
    val += __shfl_down(val, 2);
    val += __shfl_down(val, 1);
    return val;
}
`,
    testCode: '',
    hints: [
      'NVIDIA warps have 32 threads, AMD wavefronts have 64. Just divide the block size by each.',
      'The number of shuffle steps is log2 of the unit size: log2(32) = 5, log2(64) = 6. Each step halves the distance.',
      'For ballot operations, each thread contributes one bit. 32-thread warp = 32-bit mask, 64-thread wavefront = 64-bit mask.',
      'When a branch diverges in a warp/wavefront, both paths execute serially. With 50/50 probability, half the threads are idle during each branch.',
    ],
    concepts: [
      'wavefront',
      'warp vs wavefront',
      '64 threads',
      'divergence cost',
      'ballot mask width',
      'wave32',
      'RDNA',
    ],
    successPatterns: [
      'nvidia_warps\\s*=\\s*16',
      'amd_wavefronts\\s*=\\s*8',
      'amd_shfl_steps\\s*=\\s*6',
      'amd_idle_threads\\s*=\\s*32',
      '__shfl_down\\(val,\\s*32\\)',
    ],
    testNames: [
      'correctly computes 16 NVIDIA warps for 512 threads',
      'correctly computes 8 AMD wavefronts for 512 threads',
      'AMD wavefront reduction needs 6 shuffle steps',
      'AMD divergence idles 32 threads on 50/50 branch',
      'wavefront reduction starts with __shfl_down delta 32',
    ],
  },

  'rocm-lds': {
    id: 'rocm-lds',
    language: 'rocm',
    title: 'Local Data Share (LDS) on AMD',
    difficulty: 'advanced',
    order: 2,
    description: `
<p>AMD's <strong>Local Data Share (LDS)</strong> is the equivalent of NVIDIA's shared memory. While the programming model is identical (<code>__shared__</code>), the hardware details differ — especially bank conflict rules.</p>

<h3>LDS vs NVIDIA Shared Memory</h3>
<pre>
Property             NVIDIA (Ampere)       AMD (CDNA2/RDNA3)
──────────────────────────────────────────────────────────────
Name                 Shared Memory         Local Data Share (LDS)
Size per CU/SM       Up to 164 KB          64 KB per CU
Banks                32 banks              32 banks
Bank width           4 bytes               4 bytes
Wavefront/Warp       32 threads            64 threads
Bank access pattern  Half-warp (16)        Quarter-wavefront (16)
</pre>

<h3>AMD Bank Conflict Rules</h3>
<p>AMD processes LDS requests in groups of 16 threads (quarter-wavefront). Bank conflicts occur when multiple threads in the <strong>same quarter</strong> access different addresses in the same bank.</p>

<pre>
32 banks, 4 bytes each:
Bank:  0    1    2    3    ... 31
Addr:  0    4    8   12    ... 124   (first row)
      128  132  136  140   ... 252   (second row)
      256  260  264  268   ... 380   (third row)

Thread-to-bank mapping:
  bank = (address / 4) % 32

NO conflict:   threads access different banks
NO conflict:   threads access SAME address (broadcast)
CONFLICT:      threads access same bank, different address → serialized
</pre>

<h3>Avoiding Bank Conflicts</h3>
<pre>
Matrix stored in LDS: float tile[32][32]

Column access (BAD):
  Thread 0 → tile[0][0]  → bank 0
  Thread 1 → tile[1][0]  → bank 0  ← CONFLICT!
  Thread 2 → tile[2][0]  → bank 0  ← CONFLICT!

With padding: float tile[32][33]  (32+1 padding)
  Thread 0 → tile[0][0]  → bank 0
  Thread 1 → tile[1][0]  → bank 1   ← Different bank!
  Thread 2 → tile[2][0]  → bank 2   ← Different bank!
</pre>

<h3>Your Task</h3>
<p>Analyze bank conflict scenarios and fix a kernel that suffers from LDS bank conflicts on AMD hardware.</p>
`,
    starterCode: `// LDS Bank Conflict Analysis and Optimization

// ============================================
// PART 1: Predict bank conflicts (replace -1)
// 32 banks, 4 bytes per bank
// ============================================

// Scenario A: Sequential access
// Thread 0 reads float at index 0 (bank 0)
// Thread 1 reads float at index 1 (bank 1)
// ...
// Thread 15 reads float at index 15 (bank 15)
const int scenarioA_conflicts = -1;  // How many conflicts?

// Scenario B: Stride-2 access
// Thread 0 reads float at index 0 (bank 0)
// Thread 1 reads float at index 2 (bank 2)
// Thread 2 reads float at index 4 (bank 4)
// ...
// Thread 15 reads float at index 30 (bank 30)
const int scenarioB_conflicts = -1;  // How many conflicts?

// Scenario C: Stride-32 access (column of a 32-wide matrix)
// Thread 0 reads float at index 0  (bank 0)
// Thread 1 reads float at index 32 (bank 0!)
// Thread 2 reads float at index 64 (bank 0!)
// All threads hit the SAME bank
const int scenarioC_conflicts = -1;  // How many conflicts?

// Scenario D: All threads read the SAME address
const int scenarioD_conflicts = -1;  // How many conflicts?

// ============================================
// PART 2: Fix the bank-conflicted kernel
// ============================================

#define TILE 32

// BAD: Column access causes 16-way bank conflicts
__global__ void transposeNaive(float* out, const float* in, int N) {
    __shared__ float tile[TILE][TILE];  // Bank conflicts on column read!

    int x = blockIdx.x * TILE + threadIdx.x;
    int y = blockIdx.y * TILE + threadIdx.y;

    tile[threadIdx.y][threadIdx.x] = in[y * N + x];
    __syncthreads();

    // This read hits bank conflicts:
    out[x * N + y] = tile[threadIdx.x][threadIdx.y];
}

// TODO: Fix using padding
__global__ void transposePadded(float* out, const float* in, int N) {
    // TODO: Add +1 padding to avoid bank conflicts
    // __shared__ float tile[TILE][TILE + 1];

    int x = blockIdx.x * TILE + threadIdx.x;
    int y = blockIdx.y * TILE + threadIdx.y;

    // TODO: Same logic, but bank conflicts are gone due to padding
}
`,
    solutionCode: `// LDS Bank Conflict Analysis and Optimization

// PART 1: Predict bank conflicts

// Scenario A: Sequential — each thread hits a different bank
const int scenarioA_conflicts = 0;

// Scenario B: Stride-2 — uses banks 0,2,4,...30 — all different
const int scenarioB_conflicts = 0;

// Scenario C: Stride-32 — all 16 threads hit bank 0 → 16-way conflict
const int scenarioC_conflicts = 16;

// Scenario D: Same address → broadcast (no conflict)
const int scenarioD_conflicts = 0;

// PART 2: Fixed transpose with padding
#define TILE 32

__global__ void transposePadded(float* out, const float* in, int N) {
    __shared__ float tile[TILE][TILE + 1];

    int x = blockIdx.x * TILE + threadIdx.x;
    int y = blockIdx.y * TILE + threadIdx.y;

    tile[threadIdx.y][threadIdx.x] = in[y * N + x];
    __syncthreads();

    out[x * N + y] = tile[threadIdx.x][threadIdx.y];
}
`,
    testCode: '',
    hints: [
      'Scenario A: threads 0-15 access indices 0-15, hitting banks 0-15. All different banks = <strong>zero</strong> conflicts.',
      'Scenario C: stride-32 means index jumps by 32 each thread. Since 32 mod 32 = 0, every thread hits bank 0. That is a 16-way conflict (16 threads in a quarter-wavefront).',
      'Scenario D: when ALL threads read the exact same address, the hardware performs a <strong>broadcast</strong>. This counts as zero conflicts.',
      'For the padded transpose, change <code>tile[TILE][TILE]</code> to <code>tile[TILE][TILE + 1]</code>. The extra column shifts each row by one bank, eliminating column-access conflicts.',
    ],
    concepts: [
      'LDS',
      'Local Data Share',
      'bank conflicts',
      'padding',
      'quarter-wavefront',
      'broadcast',
      '32 banks',
    ],
    successPatterns: [
      'scenarioA_conflicts\\s*=\\s*0',
      'scenarioC_conflicts\\s*=\\s*16',
      'scenarioD_conflicts\\s*=\\s*0',
      'tile\\[TILE\\]\\[TILE\\s*\\+\\s*1\\]',
      'tile\\[threadIdx\\.x\\]\\[threadIdx\\.y\\]',
    ],
    testNames: [
      'sequential access has 0 bank conflicts',
      'stride-32 access has 16-way bank conflicts',
      'same-address broadcast has 0 conflicts',
      'uses TILE+1 padding to avoid bank conflicts',
      'reads transposed indices from padded tile',
    ],
  },

  'rocm-gcn-rdna': {
    id: 'rocm-gcn-rdna',
    language: 'rocm',
    title: 'GCN vs RDNA Architecture',
    difficulty: 'advanced',
    order: 3,
    description: `
<p>AMD has two GPU architecture families: <strong>GCN</strong> (Graphics Core Next, used in data center/HPC) and <strong>RDNA</strong> (Radeon DNA, used in consumer/gaming GPUs). Understanding their differences is crucial for writing high-performance AMD GPU code.</p>

<h3>Architecture Comparison</h3>
<pre>
Feature              GCN (MI100/MI210)      RDNA (RX 7900 XT)
──────────────────────────────────────────────────────────────────
Wavefront size       64 threads             32 or 64 (selectable!)
Execution unit       Compute Unit (CU)      Work Group Processor (WGP)
SIMD width           4 SIMD16 units         2 SIMD32 units
Register file        256 VGPRs/thread       256 VGPRs (wave32)
LDS                  64 KB per CU           128 KB per WGP
L1 Cache             16 KB per CU           32 KB per WGP
Scheduling           1 wavefront/SIMD/cycle Up to 2 wave32/SIMD/cycle
</pre>

<h3>VGPR and SGPR</h3>
<pre>
AMD GPUs have TWO types of registers:

VGPR (Vector General Purpose Register):
  - One value PER THREAD in the wavefront
  - Used for thread-specific data (array indices, local computations)
  - 256 VGPRs available per thread (wave64 GCN)
  - Limits occupancy: more VGPRs per thread = fewer wavefronts

SGPR (Scalar General Purpose Register):
  - One value shared across ALL threads in wavefront
  - Used for uniform data (loop counters, base addresses, constants)
  - 102 SGPRs available per wavefront
  - FREE to use — no impact on occupancy!

Optimization: move uniform values into SGPRs to free VGPRs

Example:
  float base_addr = input;          // SGPR (same for all threads)
  int tid = threadIdx.x;            // VGPR (different per thread)
  float val = input[tid];           // VGPR (different per thread)
  const float scale = 2.0f;         // SGPR (uniform constant)
</pre>

<h3>RDNA Wave32 Mode</h3>
<pre>
GCN:   Always wave64 (64 threads per wavefront)
RDNA:  Choose wave32 or wave64 per kernel

Wave32 advantages:
  ✓ Fewer shuffle steps for reduction (5 vs 6)
  ✓ Lower divergence penalty (32 vs 64 threads)
  ✓ More wavefronts per CU (higher occupancy)
  ✓ Better compatibility with NVIDIA-optimized code

Wave64 advantages:
  ✓ Better memory latency hiding (more threads in flight)
  ✓ Higher throughput for memory-bound kernels
  ✓ Fewer wavefronts to schedule
</pre>

<h3>Your Task</h3>
<p>Classify variables as VGPR or SGPR, and analyze the impact of wave32 vs wave64 on a kernel's resource usage.</p>
`,
    starterCode: `// GCN vs RDNA Architecture Analysis

// ============================================
// PART 1: Classify as VGPR or SGPR
// Replace "UNKNOWN" with "VGPR" or "SGPR"
// ============================================

__global__ void classify(const float* input, float* output,
                          float scale, int n) {
    // Which register type holds each variable?
    int tid = threadIdx.x;              // Type: UNKNOWN  (different per thread?)
    int gid = blockIdx.x * 256 + tid;   // Type: UNKNOWN  (different per thread?)
    const float s = scale;               // Type: UNKNOWN  (same for all threads?)
    float val = input[gid];              // Type: UNKNOWN  (different per thread?)
    int numBlocks = gridDim.x;           // Type: UNKNOWN  (same for all threads?)
    float result = val * s;              // Type: UNKNOWN  (different per thread?)
}

// ============================================
// PART 2: Wave32 vs Wave64 resource analysis
// Given a kernel that uses 40 VGPRs per thread
// and an RDNA3 CU with 1024 VGPRs total per SIMD
// ============================================

// Wave64 mode: each wavefront needs 40 * 64 = 2560 VGPRs
// But wait — VGPRs are allocated PER THREAD, and
// the CU has a VGPR file of 1536 entries per SIMD
const int wave64_max_wavefronts_per_simd = -1;
// floor(1536 / 40) = 38 threads... but wavefronts are
// scheduled in units of 64: floor(1536 / 40) / 64 = ?
// Simpler: floor(total_vgprs / vgprs_per_thread) / wave_size

// Actually for GCN: 256 VGPRs per thread max, 65536 VGPRs per CU
// Occupancy = floor(65536 / (40 * 64)) = floor(65536 / 2560) = ?
const int gcn_max_waves_per_cu = -1;

// For RDNA wave32: same VGPRs, half the threads
// Occupancy = floor(65536 / (40 * 32)) = floor(65536 / 1280) = ?
const int rdna_wave32_max_waves_per_cu = -1;

// ============================================
// PART 3: Which wave mode would you choose?
// Replace "UNKNOWN" with "WAVE32" or "WAVE64"
// ============================================

// Kernel A: Highly divergent control flow
const char* kernelA_best_mode = "UNKNOWN";

// Kernel B: Memory-bound, needs latency hiding
const char* kernelB_best_mode = "UNKNOWN";

// Kernel C: Ported from CUDA with hardcoded warpSize=32
const char* kernelC_best_mode = "UNKNOWN";
`,
    solutionCode: `// GCN vs RDNA Architecture Analysis

// PART 1: Register classification
__global__ void classify(const float* input, float* output,
                          float scale, int n) {
    int tid = threadIdx.x;              // Type: VGPR  (different per thread)
    int gid = blockIdx.x * 256 + tid;   // Type: VGPR  (different per thread)
    const float s = scale;               // Type: SGPR  (same for all threads)
    float val = input[gid];              // Type: VGPR  (different per thread)
    int numBlocks = gridDim.x;           // Type: SGPR  (same for all threads)
    float result = val * s;              // Type: VGPR  (different per thread)
}

// PART 2: Resource analysis
// GCN: 65536 VGPRs per CU, wave64
// 65536 / (40 * 64) = 65536 / 2560 = 25.6 → floor = 25
const int gcn_max_waves_per_cu = 25;

// RDNA wave32: 65536 VGPRs per CU, wave32
// 65536 / (40 * 32) = 65536 / 1280 = 51.2 → floor = 51
const int rdna_wave32_max_waves_per_cu = 51;

// PART 3: Best wave mode selection
// Kernel A: Divergent → WAVE32 (lower penalty: 32 idle vs 64 idle)
const char* kernelA_best_mode = "WAVE32";

// Kernel B: Memory-bound → WAVE64 (more threads hide latency)
const char* kernelB_best_mode = "WAVE64";

// Kernel C: CUDA port with warpSize=32 → WAVE32 (direct compatibility)
const char* kernelC_best_mode = "WAVE32";
`,
    testCode: '',
    hints: [
      'VGPR values differ per thread (like threadIdx.x, array lookups). SGPR values are the same across all threads in a wavefront (like kernel parameters, gridDim, constants).',
      'For GCN occupancy: total VGPRs (65536) divided by VGPRs consumed per wavefront (40 regs * 64 threads = 2560). Floor the result.',
      'Wave32 doubles potential occupancy because each wavefront uses half the VGPRs (40 * 32 = 1280 instead of 40 * 64 = 2560).',
      'Wave32 is better for divergent code (fewer idle threads) and CUDA ports. Wave64 is better for memory-bound kernels (more threads to hide latency).',
    ],
    concepts: [
      'GCN',
      'RDNA',
      'VGPR',
      'SGPR',
      'wave32',
      'wave64',
      'compute unit',
      'register pressure',
      'occupancy',
    ],
    successPatterns: [
      'VGPR.*different per thread',
      'SGPR.*same for all threads',
      'gcn_max_waves_per_cu\\s*=\\s*25',
      'rdna_wave32_max_waves_per_cu\\s*=\\s*51',
      'kernelA_best_mode\\s*=\\s*"WAVE32"',
      'kernelB_best_mode\\s*=\\s*"WAVE64"',
    ],
    testNames: [
      'correctly identifies VGPR variables (per-thread)',
      'correctly identifies SGPR variables (uniform)',
      'GCN occupancy: 25 wavefronts at 40 VGPRs/thread',
      'RDNA wave32 occupancy: 51 wavefronts at 40 VGPRs/thread',
      'chooses WAVE32 for divergent kernels',
      'chooses WAVE64 for memory-bound kernels',
    ],
  },

  'rocm-profiling': {
    id: 'rocm-profiling',
    language: 'rocm',
    title: 'Profiling with rocprof',
    difficulty: 'advanced',
    order: 4,
    description: `
<p><strong>rocprof</strong> is AMD's GPU profiling tool, analogous to NVIDIA's <code>nsight compute</code>. It collects hardware performance counters that reveal exactly what your kernel is doing — and where it is bottlenecked.</p>

<h3>Key rocprof Metrics</h3>
<pre>
Metric                        What It Measures
──────────────────────────────────────────────────────────────────
GRBM_COUNT                    GPU clock cycles active
SQ_WAVES                      Number of wavefronts launched
SQ_INSTS_VALU                 Vector ALU instructions
SQ_INSTS_SALU                 Scalar ALU instructions
SQ_INSTS_LDS                  LDS (shared memory) instructions
SQ_INSTS_SMEM                 Scalar memory (constant/uniform) loads
SQ_INSTS_FLAT                 Flat memory instructions
SQ_WAIT_INST_LDS              Cycles waiting for LDS
TA_FLAT_READ_WAVEFRONTS       Global memory read wavefronts
TA_FLAT_WRITE_WAVEFRONTS      Global memory write wavefronts
TCC_HIT                       L2 cache hits
TCC_MISS                      L2 cache misses
SQ_THREAD_CYCLES_VALU         Thread-cycles spent on VALU
FETCH_SIZE                    Total bytes fetched from memory
WRITE_SIZE                    Total bytes written to memory
</pre>

<h3>Reading a Profile</h3>
<pre>
Example rocprof output:
┌─────────────────────────────────────────────────────────────┐
│ Kernel: matMulNaive                                         │
│ Duration: 2.4 ms                                            │
│ Grid: (64,64,1)  Block: (16,16,1)                          │
│                                                              │
│ SQ_WAVES:              16384                                 │
│ SQ_INSTS_VALU:         4,194,304                            │
│ SQ_INSTS_LDS:          0                                    │
│ FETCH_SIZE:            2,147,483,648 bytes (2 GB!)           │
│ WRITE_SIZE:            16,777,216 bytes (16 MB)              │
│ TCC_HIT:               1,048,576                             │
│ TCC_MISS:              15,728,640                            │
│                                                              │
│ L2 hit rate: 1M / (1M + 15.7M) = 6.3%                      │
│ Bytes/FLOP: 2GB / 4M_VALU ≈ 512 bytes/FLOP                │
│ → EXTREMELY memory-bound                                    │
└─────────────────────────────────────────────────────────────┘
</pre>

<h3>Diagnosis Framework</h3>
<pre>
High FETCH_SIZE, low SQ_INSTS_VALU  → Memory-bound
Low FETCH_SIZE, high SQ_INSTS_VALU  → Compute-bound
High SQ_WAIT_INST_LDS               → LDS bank conflicts
Low TCC_HIT / (TCC_HIT+TCC_MISS)   → Poor cache utilization
High SQ_WAVES but low throughput    → Occupancy limited
SQ_INSTS_LDS = 0 for matmul        → Not using shared memory!
</pre>

<h3>Your Task</h3>
<p>Analyze three kernel profiles from rocprof output and diagnose the bottleneck for each. Then recommend the optimization.</p>
`,
    starterCode: `// rocprof Profile Analysis — Predict the Answer

// ============================================
// Profile 1: Naive Matrix Multiply
// ============================================
// Kernel: matMulNaive, Grid: (64,64,1), Block: (16,16,1)
// Duration: 2.4 ms
// SQ_WAVES: 16384
// SQ_INSTS_VALU: 4,194,304
// SQ_INSTS_LDS: 0
// FETCH_SIZE: 2,147,483,648 bytes
// WRITE_SIZE: 16,777,216 bytes
// TCC_HIT: 1,048,576
// TCC_MISS: 15,728,640

const char* profile1_bottleneck = "UNKNOWN";  // "MEMORY", "COMPUTE", or "LDS"
const char* profile1_key_evidence = "UNKNOWN";
// Options: "ZERO_LDS_USAGE", "HIGH_FETCH_SIZE", "LOW_VALU", "HIGH_TCC_MISS"
const char* profile1_optimization = "UNKNOWN";
// Options: "ADD_SHARED_MEMORY_TILING", "REDUCE_VGPRS", "FIX_BANK_CONFLICTS"

// ============================================
// Profile 2: Tiled Matrix Multiply (with LDS issues)
// ============================================
// Kernel: matMulTiled, Grid: (64,64,1), Block: (16,16,1)
// Duration: 0.8 ms  (3x faster than naive!)
// SQ_WAVES: 16384
// SQ_INSTS_VALU: 4,194,304
// SQ_INSTS_LDS: 2,097,152
// SQ_WAIT_INST_LDS: 524,288  (25% of LDS instructions stall!)
// FETCH_SIZE: 134,217,728 bytes (16x less than naive)
// TCC_HIT: 8,388,608
// TCC_MISS: 524,288

const char* profile2_bottleneck = "UNKNOWN";  // "MEMORY", "COMPUTE", or "LDS"
const char* profile2_key_evidence = "UNKNOWN";
// Options: "HIGH_LDS_WAIT", "HIGH_FETCH_SIZE", "LOW_VALU", "HIGH_TCC_MISS"
const char* profile2_optimization = "UNKNOWN";
// Options: "ADD_SHARED_MEMORY_TILING", "REDUCE_VGPRS", "FIX_BANK_CONFLICTS"

// ============================================
// Profile 3: Optimized Reduction
// ============================================
// Kernel: reduceOptimized, Grid: (4096,1,1), Block: (256,1,1)
// Duration: 0.1 ms
// SQ_WAVES: 16384
// SQ_INSTS_VALU: 262,144
// SQ_INSTS_LDS: 65,536
// SQ_WAIT_INST_LDS: 128  (negligible)
// FETCH_SIZE: 16,777,216 bytes
// WRITE_SIZE: 16,384 bytes
// TCC_HIT: 262,000
// TCC_MISS: 262,144

// What is the L2 cache hit rate?
const int profile3_l2_hit_pct = -1;  // round to nearest integer
// The kernel is well-optimized. What would you look at next?
const char* profile3_next_step = "UNKNOWN";
// Options: "CHECK_OCCUPANCY", "ADD_MORE_LDS", "INCREASE_GRID_SIZE", "DONE"
`,
    solutionCode: `// rocprof Profile Analysis — Solutions

// Profile 1: Naive Matrix Multiply
// 2 GB fetched, 0 LDS instructions, 6.3% L2 hit rate
const char* profile1_bottleneck = "MEMORY";
const char* profile1_key_evidence = "ZERO_LDS_USAGE";
const char* profile1_optimization = "ADD_SHARED_MEMORY_TILING";

// Profile 2: Tiled Matrix Multiply
// 25% of LDS instructions cause stalls → bank conflicts
const char* profile2_bottleneck = "LDS";
const char* profile2_key_evidence = "HIGH_LDS_WAIT";
const char* profile2_optimization = "FIX_BANK_CONFLICTS";

// Profile 3: Optimized Reduction
// L2 hit rate: 262000 / (262000 + 262144) ≈ 50%
const int profile3_l2_hit_pct = 50;
// Well-optimized kernel, check if occupancy can be improved
const char* profile3_next_step = "CHECK_OCCUPANCY";
`,
    testCode: '',
    hints: [
      'Profile 1: The key tell is <code>SQ_INSTS_LDS: 0</code> — no shared memory usage at all! Combined with 2 GB fetch for a matmul, this is clearly memory-bound with no tiling.',
      'Profile 2: <code>SQ_WAIT_INST_LDS</code> is 25% of all LDS instructions. High LDS wait means threads are stalling on shared memory access — classic bank conflicts.',
      'For the L2 hit rate: hits / (hits + misses) * 100. Profile 3: 262000 / (262000 + 262144) = ~50%.',
      'Profile 3 is well-optimized (low LDS waits, reasonable memory traffic). The next step would be to check occupancy — maybe more wavefronts could hide remaining latency.',
    ],
    concepts: [
      'rocprof',
      'performance counters',
      'SQ_WAVES',
      'SQ_INSTS_VALU',
      'SQ_INSTS_LDS',
      'TCC_HIT',
      'FETCH_SIZE',
      'bottleneck analysis',
      'L2 cache hit rate',
    ],
    successPatterns: [
      'profile1_bottleneck\\s*=\\s*"MEMORY"',
      'profile1_optimization\\s*=\\s*"ADD_SHARED_MEMORY_TILING"',
      'profile2_bottleneck\\s*=\\s*"LDS"',
      'profile2_optimization\\s*=\\s*"FIX_BANK_CONFLICTS"',
      'profile3_l2_hit_pct\\s*=\\s*50',
      'profile3_next_step\\s*=\\s*"CHECK_OCCUPANCY"',
    ],
    testNames: [
      'identifies naive matmul as memory-bound',
      'prescribes shared memory tiling for naive matmul',
      'identifies tiled matmul bottleneck as LDS bank conflicts',
      'prescribes fixing bank conflicts for tiled matmul',
      'computes L2 hit rate as 50%',
      'recommends checking occupancy as next optimization step',
    ],
  },
};
