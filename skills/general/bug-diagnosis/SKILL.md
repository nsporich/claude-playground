---
name: bug-diagnosis
description: Scientific bug diagnosis and fix with root-cause investigation
tags: [debugging, tdd, general]
---

# Bug Diagnosis

Fix bugs through disciplined investigation, not guesswork. Reproduce it, isolate it, form a hypothesis, prove the hypothesis, then fix exactly one thing. Every phase exists to prevent the most common debugging failure: changing code before understanding the problem.

## Workflow

```
Reproduce → Isolate → Hypothesize → Fix (test-first) → Verify
```

---

## Phase 1: Reproduce

You cannot fix what you cannot reproduce. Before touching any code:

1. **Capture the exact symptom** — error message, stack trace, incorrect output, unexpected behavior. Copy it verbatim, don't paraphrase.
2. **Identify the trigger** — what input, state, or sequence of actions causes it? Be specific: "clicking submit with an empty email field" not "the form is broken."
3. **Reproduce it yourself** — run the steps and observe the failure. If you can't reproduce it, gather more information before proceeding.
4. **Note consistency** — does it happen every time, or intermittently? Intermittent bugs often involve timing, state, or concurrency.

**Exit criteria:** You can trigger the bug on demand with a known set of steps.

---

## Phase 2: Isolate

Narrow down where the bug lives. Work from the error backward, not from the code forward.

- **Read the stack trace** — it tells you exactly where the failure occurred. Start there, not at your best guess.
- **Check recent changes** — `git log --oneline -10` and `git diff`. Did this work before? What changed?
- **Add strategic logging** — log inputs and outputs at key boundaries. Don't scatter print statements everywhere — pick the 2-3 junctions where data flows between components.
- **Shrink the reproduction** — strip away unrelated state and input until you have the smallest case that still triggers the bug.
- **Use git bisect** — if you know it used to work, bisect to find the exact commit that broke it. This is underused and extremely effective.

**Exit criteria:** You can point to a specific function, module, or interaction where the bug occurs.

---

## Phase 3: Hypothesize

Form an explicit hypothesis before changing any code. Write it down.

**Format:** "The bug is caused by [specific cause] because [evidence]."

Examples:
- "The bug is caused by the date parser receiving UTC timestamps but formatting them as local time, because the output is consistently 5 hours ahead."
- "The bug is caused by a missing null check on `user.email` because the stack trace shows TypeError at line 42 and the test user has no email set."

Then test the hypothesis:
1. **Predict what you should see** if the hypothesis is correct.
2. **Run the smallest experiment** to check — add a log, inspect a variable, write a minimal test case.
3. **Evaluate the result:**
   - **Confirmed:** Move to Phase 4.
   - **Disproved:** Return to Phase 2 with what you learned. Update your mental model.

### Escalation Rule

After **3 failed hypotheses**, stop and reassess:
- Are you looking at the right layer? (Maybe the bug is in the data, not the code.)
- Are your assumptions about the expected behavior correct? (Maybe the spec is wrong.)
- Is there a second bug masking the first?
- Should you read the relevant documentation or source code more carefully?

Do not continue guessing. Step back and re-examine your understanding of the system.

---

## Phase 4: Fix

### Write a regression test (strongly recommended)

Before writing the fix, write a test that:
- Reproduces the exact bug condition
- Fails right now
- Will pass once the fix is applied

This serves two purposes: it proves your hypothesis is correct, and it prevents the bug from recurring.

**If a test isn't practical** (pure UI bug, environment-specific issue, race condition that's hard to trigger in tests), document why and write down the manual verification steps you'll use in Phase 5 instead.

### Apply the fix

- **Change one thing.** If you need to change multiple things, make each change a separate commit so you can bisect later.
- **Fix the bug, not the symptoms.** If the root cause is bad input, fix the input validation — don't add a null check in every downstream function.
- **Don't refactor while fixing.** Fix the bug in one commit. Refactor in a separate commit if needed. Bundled changes make it impossible to tell what actually fixed the issue.

---

## Phase 5: Verify

Verification means proving the bug is gone, not just observing that it seems to work.

1. **Run the regression test** — it should pass now.
2. **Run the full test suite** — check for regressions. Your fix might break something else.
3. **Re-run the original reproduction steps** — manually walk through the same trigger from Phase 1. Don't skip this even if the test passes.
4. **Check for siblings** — if the bug was an off-by-one error, check similar loops. If it was a missing null check, check similar access patterns. Same class of bug often appears in multiple places.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I can see the bug, let me just fix it" | You see *a* potential issue. Without reproduction, you don't know if it's *the* bug the user is experiencing. |
| "It's obvious, no need to isolate" | Obvious bugs don't survive to be reported. If it's in front of you now, something non-obvious is going on. |
| "Let me fix this and two other things while I'm here" | Bundled fixes are impossible to bisect later. One bug, one fix, one commit. |
| "I can't write a test for this" | Usually means you haven't isolated the bug enough. Push harder on Phase 2 before giving up on testing. |
| "It works on my machine now" | That's not verification. Reproduce the original failure path and confirm it no longer fails. |
| "Let me try a different approach" | Did you disprove your hypothesis, or just get impatient? State what you learned before switching. Undocumented attempts waste future debugging time. |
| "I'll just add a try/catch" | Exception swallowing hides bugs, it doesn't fix them. Find the root cause. |
| "This is probably a flaky test" | Flaky tests have root causes too. If the test failed, something triggered it. Investigate before dismissing. |

## Red Flags

- Changing code before reproducing the bug
- Testing multiple hypotheses at once (changing 3 things simultaneously)
- No explicit hypothesis — just "trying things"
- Fixing without a regression test and no documented justification
- Declaring "fixed" without re-running the original reproduction steps from Phase 1
- Catching/suppressing an exception instead of fixing the cause
- Blaming the framework, library, or environment without evidence

## Cross-References

- If the bug was discovered during feature work, return to the **feature-implementation** skill after the fix is verified.
- Use the **code-review** skill to review fixes that touch security-sensitive or critical code paths.
