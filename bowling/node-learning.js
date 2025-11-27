// function asyncMultiply(a: number, b: number, callback: (result: number) => void) {
//     setTimeout(() => {
//         callback(a * b);
//     }, 1000); // Takes 1 second
// }

// async function delayedMultiply(func: (a: number, b: number, callback: (result: number) => void) => void, nums: number[], cb: (result: number) => void, index = 0, res = 1) {
//     if (index === nums.length) return cb(res);
//     func(res, nums[index] as number, (result: number) => {
//         delayedMultiply(func, nums, cb, index + 1, result);
//     })
// }

// delayedMultiply(asyncMultiply, [2, 3, 4], (result: number) => {
//     console.log(result); // After ~3 sec, logs 24 (2*3=6, then 6*4=24)
// });

/**
 * CORE NODE.JS CONCEPTS
 * A comprehensive guide with explanations and examples
 */

// ============================================================================
// 1. THE NODE.JS EVENT LOOP
// ============================================================================

/**
 * The Event Loop is the heart of Node.js's non-blocking I/O model.
 * 
 * HOW IT WORKS:
 * - Node.js runs JavaScript in a single thread
 * - The event loop continuously checks for tasks to execute
 * - It processes callbacks from completed async operations
 * 
 * EVENT LOOP PHASES (in order):
 * 1. Timers - executes setTimeout() and setInterval() callbacks
 * 2. Pending callbacks - executes I/O callbacks deferred to next loop
 * 3. Idle, prepare - internal use only
 * 4. Poll - retrieves new I/O events, executes I/O callbacks
 * 5. Check - executes setImmediate() callbacks
 * 6. Close callbacks - executes close event callbacks (e.g., socket.on('close'))
 * 
 * Between each phase, Node.js checks for process.nextTick() and microtasks (Promises)
 */

console.log('\n=== EVENT LOOP EXAMPLE ===\n');

console.log('1. Synchronous code');

setTimeout(() => {
  console.log('4. setTimeout (Timers phase)');
}, 0);

setImmediate(() => {
  console.log('5. setImmediate (Check phase)');
});

Promise.resolve().then(() => {
  console.log('3. Promise (Microtask queue)');
});

process.nextTick(() => {
  console.log('2. process.nextTick (Next tick queue)');
});

console.log('1. More synchronous code');

// ============================================================================
// 2. process.nextTick() vs setImmediate() vs setTimeout()
// ============================================================================

/**
 * DIFFERENCES:
 * 
 * process.nextTick():
 * - Executes BEFORE the event loop continues
 * - Runs after current operation completes, before any I/O
 * - Has highest priority (can starve the event loop if overused)
 * - Use for: handling errors, cleanup, or retrying operations before continuing
 * 
 * setImmediate():
 * - Executes in the CHECK phase of the event loop
 * - Runs after I/O events
 * - Use for: breaking up long-running operations, deferring work after I/O
 * 
 * setTimeout(fn, 0):
 * - Executes in the TIMERS phase of the event loop
 * - Minimum delay, not guaranteed to be exactly 0ms
 * - Use for: scheduling work with a delay
 */

console.log('\n=== TIMING COMPARISON ===\n');

function demonstrateTiming() {
  console.log('Start');
  
  setTimeout(() => console.log('setTimeout 0ms'), 0);
  setTimeout(() => console.log('setTimeout 10ms'), 10);
  
  setImmediate(() => console.log('setImmediate'));
  
  process.nextTick(() => console.log('nextTick 1'));
  process.nextTick(() => console.log('nextTick 2'));
  
  Promise.resolve().then(() => console.log('Promise'));
  
  console.log('End');
}

// Uncomment to run:
// demonstrateTiming();

// ============================================================================
// 3. HOW NODE.JS HANDLES ASYNCHRONOUS OPERATIONS
// ============================================================================

/**
 * Node.js uses several mechanisms for async operations:
 * 
 * 1. CALLBACKS (traditional pattern):
 *    - Function passed as argument, called when operation completes
 *    - Can lead to "callback hell" with nested callbacks
 * 
 * 2. PROMISES:
 *    - Object representing eventual completion/failure
 *    - Chainable with .then() and .catch()
 *    - Better error handling than callbacks
 * 
 * 3. ASYNC/AWAIT:
 *    - Syntactic sugar over Promises
 *    - Makes async code look synchronous
 *    - Easier to read and maintain
 * 
 * 4. EVENT EMITTERS:
 *    - For operations that emit multiple events over time
 *    - Used extensively in Node.js core (streams, HTTP, etc.)
 */

console.log('\n=== ASYNC PATTERNS ===\n');

const fs = require('fs');
const { promisify } = require('util');

// 1. CALLBACK PATTERN
function readFileCallback(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, data);
  });
}

// 2. PROMISE PATTERN
const readFilePromise = promisify(fs.readFile);

function readFileWithPromise(filename) {
  return readFilePromise(filename, 'utf8')
    .then(data => {
      console.log('File read successfully');
      return data;
    })
    .catch(err => {
      console.error('Error reading file:', err.message);
      throw err;
    });
}

// 3. ASYNC/AWAIT PATTERN (recommended)
async function readFileAsync(filename) {
  try {
    const data = await readFilePromise(filename, 'utf8');
    console.log('File read successfully');
    return data;
  } catch (err) {
    console.error('Error reading file:', err.message);
    throw err;
  }
}

// 4. EVENT EMITTER PATTERN
const EventEmitter = require('events');

class DataProcessor extends EventEmitter {
  process(data) {
    this.emit('start', data.length);
    
    // Simulate processing
    setTimeout(() => {
      this.emit('progress', 50);
    }, 100);
    
    setTimeout(() => {
      this.emit('complete', data);
    }, 200);
  }
}

const processor = new DataProcessor();
processor.on('start', (size) => console.log(`Processing ${size} bytes`));
processor.on('progress', (percent) => console.log(`Progress: ${percent}%`));
processor.on('complete', () => console.log('Processing complete'));

// ============================================================================
// 4. THE ROLE OF LIBUV
// ============================================================================

/**
 * LIBUV is a C library that provides:
 * 
 * 1. EVENT LOOP IMPLEMENTATION:
 *    - Cross-platform event loop
 *    - Handles async I/O operations
 * 
 * 2. THREAD POOL:
 *    - Default size: 4 threads (configurable via UV_THREADPOOL_SIZE)
 *    - Used for operations that can't be done asynchronously at OS level:
 *      * File system operations (fs.readFile, fs.writeFile)
 *      * DNS lookups (dns.lookup)
 *      * Crypto operations (crypto.pbkdf2, crypto.randomBytes)
 *      * Zlib compression
 * 
 * 3. ASYNC I/O:
 *    - Network I/O (uses OS-level async: epoll, kqueue, IOCP)
 *    - File I/O (uses thread pool)
 *    - Child processes
 *    - Timers
 * 
 * 4. CROSS-PLATFORM ABSTRACTION:
 *    - Provides consistent API across Windows, Linux, macOS
 */

console.log('\n=== LIBUV THREAD POOL EXAMPLE ===\n');

const crypto = require('crypto');

// This operation uses the libuv thread pool
function heavyCryptoOperation() {
  const start = Date.now();
  crypto.pbkdf2('password', 'salt', 100000, 512, 'sha512', (err, key) => {
    console.log(`Crypto operation took: ${Date.now() - start}ms`);
  });
}

// Run multiple operations to see thread pool in action
// Default pool size is 4, so 5th operation will wait
console.log('Starting 5 crypto operations (thread pool size: 4)');
// Uncomment to run:
// for (let i = 0; i < 5; i++) {
//   heavyCryptoOperation();
// }

// To increase thread pool size:
// process.env.UV_THREADPOOL_SIZE = 8;

// ============================================================================
// 5. COMMONJS vs ES MODULES
// ============================================================================

/**
 * COMMONJS (CJS) - Traditional Node.js module system:
 * 
 * CHARACTERISTICS:
 * - Uses require() and module.exports
 * - Synchronous loading
 * - Dynamic imports (can use variables in require())
 * - Default in Node.js for .js files
 * - Modules are cached after first load
 * - 'this' refers to module.exports
 * 
 * PROS:
 * - Widely supported, mature ecosystem
 * - Can conditionally require modules
 * - Simpler for beginners
 * 
 * CONS:
 * - Synchronous (blocks execution)
 * - No tree-shaking (dead code elimination)
 * - Not browser-compatible
 */

// CommonJS Example:
// const express = require('express');
// const { readFile } = require('fs');
// 
// function myFunction() {
//   return 'Hello';
// }
// 
// module.exports = myFunction;
// // or
// module.exports = { myFunction, anotherFunction };
// // or
// exports.myFunction = myFunction;

/**
 * ES MODULES (ESM) - Modern JavaScript module system:
 * 
 * CHARACTERISTICS:
 * - Uses import and export
 * - Asynchronous loading
 * - Static imports (must be at top level)
 * - Use .mjs extension or "type": "module" in package.json
 * - Strict mode by default
 * - 'this' is undefined at top level
 * 
 * PROS:
 * - Standard across JavaScript (browser + Node.js)
 * - Tree-shaking support (smaller bundles)
 * - Better static analysis
 * - Named exports are clearer
 * 
 * CONS:
 * - Can't conditionally import (must use dynamic import())
 * - Some older packages don't support it yet
 */

// ES Modules Example:
// import express from 'express';
// import { readFile } from 'fs';
// import * as fs from 'fs';
// 
// export function myFunction() {
//   return 'Hello';
// }
// 
// export default myFunction;
// 
// // Dynamic import (async)
// const module = await import('./my-module.js');

/**
 * KEY DIFFERENCES:
 * 
 * 1. SYNTAX:
 *    CJS: const x = require('x'); module.exports = y;
 *    ESM: import x from 'x'; export default y;
 * 
 * 2. LOADING:
 *    CJS: Synchronous
 *    ESM: Asynchronous
 * 
 * 3. WHEN RESOLVED:
 *    CJS: Runtime (can use variables)
 *    ESM: Parse time (static)
 * 
 * 4. FILE EXTENSIONS:
 *    CJS: .js, .cjs
 *    ESM: .mjs, .js (with "type": "module")
 * 
 * 5. TOP-LEVEL AWAIT:
 *    CJS: Not supported
 *    ESM: Supported
 * 
 * 6. __dirname, __filename:
 *    CJS: Available
 *    ESM: Not available (use import.meta.url)
 */

// ESM equivalent of __dirname and __filename:
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

/**
 * INTEROPERABILITY:
 * - ESM can import CJS (default export only)
 * - CJS can import ESM using dynamic import()
 */

// Example: Using ESM in CJS
// (async () => {
//   const esmModule = await import('./esm-module.mjs');
//   esmModule.default();
// })();

// ============================================================================
// 6. CLUSTERING IN NODE.JS
// ============================================================================

/**
 * WHAT IS CLUSTERING?
 * 
 * Clustering allows you to create multiple Node.js processes (workers) that
 * share the same server port. This enables you to:
 * - Utilize all CPU cores (Node.js is single-threaded by default)
 * - Improve application performance and throughput
 * - Increase reliability (if one worker crashes, others continue)
 * 
 * HOW IT WORKS:
 * - Master process spawns worker processes
 * - Workers share the same server port
 * - Master distributes incoming connections to workers (round-robin by default)
 * - Each worker runs in its own V8 instance with separate memory
 */

const cluster = require('cluster');
const http = require('http');
const os = require('os');

/**
 * WHEN TO USE CLUSTERING:
 * 
 * ✅ USE CLUSTERING WHEN:
 * - CPU-intensive operations (calculations, data processing)
 * - High traffic applications that need to handle many requests
 * - You want to maximize hardware utilization
 * - You need zero-downtime restarts (restart workers one at a time)
 * - Production environments with multi-core servers
 * 
 * ❌ DON'T USE CLUSTERING WHEN:
 * - I/O-bound operations (Node.js already handles these efficiently)
 * - Development environment (adds complexity)
 * - Using a process manager like PM2 (it handles clustering)
 * - Running in containers with orchestration (Kubernetes handles scaling)
 * - Shared state is critical (workers don't share memory)
 */

// BASIC CLUSTERING EXAMPLE
if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);
  
  // Fork workers (one per CPU core)
  const numCPUs = os.cpus().length;
  console.log(`Forking ${numCPUs} workers...`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker...');
    cluster.fork(); // Restart the worker
  });
  
  // Handle worker messages
  cluster.on('message', (worker, message) => {
    console.log(`Message from worker ${worker.process.pid}:`, message);
  });
  
} else {
  // Workers can share any TCP connection
  // In this case, it's an HTTP server
  const server = http.createServer((req, res) => {
    // Simulate some work
    const start = Date.now();
    while (Date.now() - start < 10) {} // 10ms of work
    
    res.writeHead(200);
    res.end(`Handled by worker ${process.pid}\n`);
  });
  
  server.listen(8000);
  console.log(`Worker ${process.pid} started`);
  
  // Workers can send messages to master
  process.send({ msg: 'Worker ready' });
}

/**
 * ADVANCED CLUSTERING PATTERNS:
 */

// 1. GRACEFUL SHUTDOWN
function gracefulShutdown() {
  if (cluster.isWorker) {
    // Stop accepting new connections
    server.close(() => {
      console.log(`Worker ${process.pid} closed all connections`);
      process.exit(0);
    });
    
    // Force exit after timeout
    setTimeout(() => {
      console.error(`Worker ${process.pid} forcing exit`);
      process.exit(1);
    }, 10000);
  }
}

// 2. ZERO-DOWNTIME RESTART
function restartWorkers() {
  if (cluster.isMaster) {
    const workers = Object.values(cluster.workers);
    
    function restartWorker(index) {
      if (index >= workers.length) return;
      
      const worker = workers[index];
      console.log(`Restarting worker ${worker.process.pid}`);
      
      worker.disconnect();
      
      cluster.once('exit', (deadWorker) => {
        if (deadWorker.id === worker.id) {
          const newWorker = cluster.fork();
          newWorker.once('listening', () => {
            console.log(`New worker ${newWorker.process.pid} is ready`);
            // Restart next worker after a delay
            setTimeout(() => restartWorker(index + 1), 1000);
          });
        }
      });
    }
    
    restartWorker(0);
  }
}

/**
 * CLUSTERING ALTERNATIVES:
 * 
 * 1. PM2 (Process Manager):
 *    - Handles clustering automatically
 *    - Built-in monitoring and logging
 *    - Zero-downtime reloads
 *    Command: pm2 start app.js -i max
 * 
 * 2. Worker Threads:
 *    - For CPU-intensive tasks within same process
 *    - Share memory (unlike cluster)
 *    - Better for parallel computation
 * 
 * 3. Container Orchestration:
 *    - Kubernetes, Docker Swarm
 *    - Run multiple container instances
 *    - Better for cloud deployments
 */

// WORKER THREADS EXAMPLE (alternative to clustering)
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // Main thread
  function runWorkerThread(data) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename);
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.postMessage(data);
    });
  }
  
  // Example usage:
  // runWorkerThread({ task: 'heavy computation' })
  //   .then(result => console.log('Result:', result));
  
} else {
  // Worker thread
  parentPort.on('message', (data) => {
    // Perform heavy computation
    const result = data.task + ' completed';
    parentPort.postMessage(result);
  });
}

/**
 * SUMMARY:
 * 
 * - Event Loop: Single-threaded async execution model with phases
 * - nextTick > Microtasks > setImmediate > setTimeout
 * - Async: Callbacks → Promises → Async/Await → Event Emitters
 * - Libuv: Provides event loop, thread pool, and cross-platform I/O
 * - CommonJS: require/module.exports (sync, traditional)
 * - ES Modules: import/export (async, modern, tree-shakeable)
 * - Clustering: Multi-process for CPU-bound tasks and high traffic
 */

console.log('\n=== Node.js Core Concepts Guide Complete ===\n');
console.log('Uncomment examples to run them individually.\n');
