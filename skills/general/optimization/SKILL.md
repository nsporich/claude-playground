---
name: optimization
description: Performance profiling, benchmarking, and bottleneck elimination
tags: [performance, optimization, general]
---

# Optimization

Improve performance through measurement, not intuition. Profile first, identify the bottleneck, benchmark before and after, and prove the improvement with numbers. Never optimize without evidence.

## Workflow

```
Measure → Identify → Benchmark → Optimize → Verify
```

---

## Phase 1: Measure

Understand current performance before changing anything.

1. **Define the metric** — what are you optimizing? Response time, throughput, memory usage, bundle size, startup time? Be specific.
2. **Establish a baseline** — measure the current value of that metric under realistic conditions. Record the exact conditions (data size, concurrency, hardware).
3. **Profile** — use language-appropriate profiling tools to identify where time and resources are spent.

Common profiling tools:
- **JavaScript/Node:** Chrome DevTools, `node --prof`, `clinic.js`
- **Python:** `cProfile`, `py-spy`, `line_profiler`
- **Go:** `pprof`, `trace`
- **General:** `time`, `perf`, `valgrind`, `strace`
- **Web:** Lighthouse, WebPageTest, browser DevTools Performance tab

**Exit criteria:** You have a baseline measurement and a profile showing where the bottleneck is.

---

## Phase 2: Identify

Find the actual bottleneck — not what you think is slow.

1. **Follow the data** — the profile tells you where time is spent. Start with the hottest path.
2. **Classify the bottleneck:**
   - **CPU-bound** — computation, parsing, serialization, complex algorithms
   - **I/O-bound** — network requests, disk reads, database queries
   - **Memory-bound** — excessive allocation, GC pressure, memory leaks
   - **Concurrency** — lock contention, thread starvation, connection pool exhaustion
3. **Quantify the impact** — how much of the total time does this bottleneck represent? Optimizing something that's 2% of total time saves almost nothing (Amdahl's law).

**Exit criteria:** You can name the specific bottleneck, its category, and its percentage of total cost.

---

## Phase 3: Benchmark

Set up repeatable benchmarks before making changes.

1. **Write a benchmark** — an automated, repeatable test that exercises the bottleneck under realistic conditions.
2. **Run it multiple times** — 5-10 runs minimum. Record mean, median, and standard deviation. Single runs are meaningless due to variance.
3. **Control the environment** — same machine, same data, same conditions every time. Close other applications. Pin to CPU cores if variance is high.
4. **Record the baseline** — save the exact results. You'll compare against these after optimization.

**Exit criteria:** A repeatable benchmark with stable baseline results.

---

## Phase 4: Optimize

Apply targeted changes to the identified bottleneck.

### Strategies by bottleneck type

**CPU-bound:**
- Reduce algorithmic complexity (O(n²) → O(n log n))
- Cache computed results (memoization)
- Avoid redundant work (deduplication, short-circuit evaluation)
- Use more efficient data structures (hash map vs. linear search)

**I/O-bound:**
- Batch requests (N queries → 1 query)
- Add caching (in-memory, Redis, CDN)
- Parallelize independent I/O operations
- Reduce payload size (pagination, field selection, compression)

**Memory-bound:**
- Stream instead of loading everything into memory
- Pool and reuse objects instead of allocating new ones
- Fix leaks (unclosed connections, growing caches without eviction)
- Use compact data representations

**Concurrency:**
- Reduce lock scope and duration
- Use lock-free data structures where appropriate
- Increase pool sizes for genuine resource starvation
- Add backpressure to prevent overload

### Rules

- **One change at a time.** Measure after each change. Bundled changes make it impossible to attribute improvement.
- **Don't sacrifice correctness.** A fast wrong answer is worse than a slow right answer. Run your test suite after every change.
- **Don't optimize readability away.** If the optimized code is significantly harder to understand, document why the optimization is necessary and what it does.

---

## Phase 5: Verify

Prove the optimization worked with numbers.

1. **Run the benchmark** — same conditions as baseline. Record results.
2. **Compare** — calculate the percentage improvement. Is it meaningful? (<5% is often noise.)
3. **Run the test suite** — ensure no regressions. Optimization must not break correctness.
4. **Check for side effects** — did you trade CPU for memory? Speed for readability? Make the trade-off explicit.
5. **Document the results** — record before/after numbers, the change made, and why it works. Include this in the commit message or PR description.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I know what's slow" | Intuition about performance is wrong more often than right. Profile first. |
| "This optimization is obvious" | Even obvious optimizations need measurements. Sometimes the "obvious" fix makes things worse. |
| "Let me optimize everything while I'm here" | Optimize the bottleneck. Everything else is wasted effort (Amdahl's law). |
| "I don't need benchmarks for this" | Without before/after numbers, you don't know if you improved anything. You might have made it worse. |
| "Premature optimization is the root of all evil" | This quote is about optimizing without profiling. Once you've profiled and found the bottleneck, optimizing it is the right call. |
| "It's fast enough" | Define "fast enough" with a number. If current performance meets that number, don't optimize. If it doesn't, optimize. |

## Red Flags

- Optimizing without profiling first
- No baseline measurement before making changes
- Making multiple changes between benchmark runs
- Optimizing code that's <5% of total execution time
- Sacrificing correctness for performance without explicit justification
- No before/after comparison with actual numbers
- Optimizing for a metric nobody asked about

## Cross-References

- Use the **tdd** skill to ensure optimizations don't break correctness.
- Use the **code-review** skill to review optimizations that sacrifice readability.
