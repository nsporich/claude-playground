---
name: tdd
description: Test-driven development with red-green-refactor discipline
tags: [tdd, testing, general]
---

# Test-Driven Development

Write tests before implementation. Every behavior change starts with a failing test. This isn't a suggestion — it's the process. Red, green, refactor. No exceptions.

## Workflow

```
Red → Green → Refactor → Repeat
```

---

## Phase 1: Red (Write a Failing Test)

Write exactly one test that describes the next behavior you need.

1. **Name the behavior** — not the function. "returns 404 when user doesn't exist" not "test getUserById."
2. **Write the test** — assert the expected outcome. Use the simplest assertion that proves the behavior.
3. **Run it** — the test must fail. If it passes, either the behavior already exists or your test doesn't test what you think it tests.
4. **Verify the failure reason** — it should fail because the feature is missing, not because of a typo, import error, or test setup bug. Fix test infrastructure issues before proceeding.

**Exit criteria:** One test fails for the right reason.

---

## Phase 2: Green (Make It Pass)

Write the minimum code to make the failing test pass.

1. **Solve for the test** — not for the general case. If the test expects `return 42`, you can literally `return 42`. The next test will force you to generalize.
2. **No extra code** — don't add error handling you haven't tested for. Don't handle edge cases you haven't written tests for. Don't add abstractions you don't need yet.
3. **Run all tests** — not just the new one. Catch regressions immediately.

**Exit criteria:** All tests pass, including the new one.

---

## Phase 3: Refactor

Now that tests are green, clean up without changing behavior.

1. **Remove duplication** — if the same logic appears twice, extract it.
2. **Clarify naming** — rename variables, functions, or files if the intent is unclear.
3. **Simplify structure** — if a function is doing too many things, split it. If an abstraction isn't earning its keep, inline it.
4. **Run all tests after every change** — refactoring must not change behavior. If a test breaks, you changed behavior. Undo and try again.

**Exit criteria:** Code is clean, all tests still pass.

---

## Phase 4: Repeat

Go back to Phase 1 with the next behavior. Each cycle should take 2-10 minutes. If a cycle takes longer than 15 minutes, you've bitten off too much — break it into smaller behaviors.

---

## Choosing What to Test

### Test behaviors, not implementations

```
Good: "returns empty array when no results match"
Bad:  "calls database query with correct SQL"
```

### Test boundaries and edge cases

For each behavior, consider:
- **Happy path** — normal input, expected output
- **Empty/zero/null** — what happens with nothing?
- **Boundary values** — off-by-one, max length, exactly at limit
- **Error cases** — invalid input, missing resources, network failures

### Don't test

- Private implementation details (they change during refactoring)
- Framework/library internals (trust your dependencies)
- Trivial getters/setters with no logic

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I'll write tests after" | Tests written after confirm your implementation, not your intent. They encode your blind spots. |
| "This is too simple to test" | Simple things have a way of becoming complex. The test takes 30 seconds now and saves 30 minutes later. |
| "I need to see the code first to know what to test" | That's backwards. The test defines what the code should do. Write the test, then write the code to satisfy it. |
| "Let me get it working first" | You don't know if it works without a test. "It runs" is not the same as "it's correct." |
| "TDD is too slow" | Writing code without tests is fast until something breaks. Then it's very slow. TDD is consistently paced. |
| "I can't test this" | Usually means you can't test it *the way it's currently structured*. That's a design signal — restructure for testability. |
| "The existing code doesn't have tests" | That's an argument for starting, not for continuing. Add tests for the code you write. |

## Red Flags

- Writing more than 10 lines of production code without a failing test
- A test that passes on the first run (you didn't see it fail — you don't know what it tests)
- Spending more than 15 minutes in a single red-green-refactor cycle
- Writing multiple tests before writing any production code (write one, pass one)
- Refactoring while the tests are red (get to green first, then refactor)
- Adding code "just in case" that no test requires
- Skipping the refactor phase ("it works, ship it")

## Cross-References

- Use the **bug-diagnosis** skill when a test reveals unexpected behavior in existing code.
- Use the **code-review** skill to review test quality alongside implementation quality.
