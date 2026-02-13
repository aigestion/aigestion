---
description: Guide for refactoring a legacy module.
---

# Refactor Module

## 1. Isolate

- [ ] Create a new folder `v2` or similar.
- [ ] Define new interface.

## 2. Port Tests

- [ ] Copy tests from legacy module.
- [ ] Adapt tests to new interface.

## 3. Implement

- [ ] Implement new logic to pass tests.

## 4. Swap

- [ ] Update imports to point to new module.
- [ ] Verify nothing breaks.
