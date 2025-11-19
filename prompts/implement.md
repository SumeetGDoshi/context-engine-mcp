# Implementation Phase Instructions

You are executing an approved implementation plan phase by phase.

## CRITICAL RULES:

### 1. Context Management (MOST IMPORTANT)
- **Keep context utilization under 40%**
- Check context usage frequently
- If approaching 40%, stop and compact:
  - Update plan with progress checkmarks
  - Note current phase and next steps
  - Start fresh context with updated plan

### 2. Phase-by-Phase Execution
- Implement ONE phase at a time
- Do not jump ahead to next phase
- After each phase:
  1. Run automated verification commands
  2. Update plan document (mark phase complete)
  3. If manual verification required, STOP and ask user
  4. Only proceed after user confirms manual tests passed

### 3. Reference the Plan
- Add comments in code referencing plan:
  ```typescript
  // Implementing Phase 2: API Endpoints
  // Plan: thoughts/shared/plans/2025-11-16-feature-x.md
  ```
- Keep plan open for reference
- If you deviate from plan, note why in plan document

### 4. Track Progress
Use the plan document as your checklist:
```markdown
## Phase 1: Database Schema ✓
- [x] Create migration
- [x] Add foreign keys
- [x] Update models

## Phase 2: API Endpoints (IN PROGRESS)
- [x] Create route handlers
- [x] Add validation middleware
- [ ] Write integration tests  ← Current task
```

## Implementation Workflow:

### Step 1: Read the Plan
Read the entire plan before starting. Understand:
- Overall architecture
- All phases and their dependencies
- Success criteria for each phase
- What we're NOT doing (scope boundaries)

### Step 2: Set Up Phase
For current phase:
1. Read all files that will be modified
2. Understand existing patterns
3. Check for dependencies on previous phases
4. Review success criteria

### Step 3: Implement Phase
Make the changes specified in the plan:
- Follow existing code patterns
- Use same naming conventions
- Match code style
- Add proper error handling
- Include logging where appropriate

### Step 4: Verify Phase
After coding, run automated checks:
```bash
# Run all commands from plan's "Automated Verification"
make test
make lint
npm run typecheck
# etc.
```

If any fail:
- Fix the issues
- Re-run verification
- Update plan with findings

### Step 5: Manual Verification Gate
If phase has "Manual Verification" criteria:

**STOP and ask user:**
```
Phase [N] implementation complete.

Automated verification: ✓ All passed

Manual verification required:
- [ ] [Manual test 1]
- [ ] [Manual test 2]

Please test these items and confirm before I proceed to next phase.
```

**DO NOT proceed without confirmation.**

### Step 6: Update Progress
Mark phase complete in plan:
```markdown
## Phase 1: Database Schema ✓
**Status**: Complete
**Completed**: 2025-11-16 14:30
**Notes**: Migration applied successfully, all tests pass
```

### Step 7: Move to Next Phase
If more phases remain:
- Check context utilization
- If under 40%, continue to next phase
- If approaching 40%, compact and continue fresh
- If all phases complete, suggest running validation

## Context Compaction Strategy:

When approaching 40% context:

1. **Update plan document** with detailed progress:
```markdown
## Implementation Progress Update

### Completed:
- ✓ Phase 1: [Name] - All automated checks pass
- ✓ Phase 2: [Name] - Manual verification confirmed

### Current:
- Phase 3: [Name] - In progress
  - ✓ Completed: Files X, Y modified
  - ⧗ Next: Need to add tests

### Next Steps:
1. Complete Phase 3 tests
2. Run automated verification
3. Request manual testing
4. Proceed to Phase 4
```

2. **Start fresh context** with:
- Updated plan (with progress)
- Files for current phase only
- Next steps clearly stated

## Common Patterns:

### Database Changes:
1. Create migration first
2. Test migration up/down
3. Update models
4. Update queries
5. Run tests

### API Changes:
1. Define routes
2. Add handlers
3. Add validation
4. Add tests
5. Update docs

### UI Changes:
1. Update components
2. Add props/types
3. Handle state
4. Add error handling
5. Test manually

## Error Handling:

If you encounter unexpected issues:
1. Document the issue in plan
2. Check if deviation from plan is needed
3. If yes, update plan with reasoning
4. Ask user if significant scope change
5. Continue once aligned

## Reminders:

- ✅ Execute plan exactly as written
- ✅ Keep context under 40%
- ✅ Stop for manual verification between phases
- ✅ Update plan document with progress
- ✅ Reference plan in code comments
- ❌ Don't skip phases
- ❌ Don't deviate without documenting
- ❌ Don't proceed without manual confirmation when required

## When Complete:

After all phases implemented:

⚠️ **CRITICAL - YOU MUST CALL `complete_implementation` TOOL**

This is NOT optional. You MUST follow this workflow:

### Step 1: Call `complete_implementation` Tool

When ALL implementation work is done, immediately call:
```
complete_implementation
```

This will AUTOMATICALLY:
- Mark your implementation as complete
- Transition you to VALIDATION phase
- Provide detailed validation instructions
- **Make validation mandatory** (you cannot skip it)

### Step 2: Perform Validation (Automatic)

After calling `complete_implementation`, you will be IN validation phase and MUST:

1. **Read the implementation plan** completely
2. **Verify each phase** was implemented as specified
3. **Run ALL automated verification commands** from the plan
4. **Check for deviations** or issues
5. **Generate validation report** with:
   - ✓/✗ status for each phase
   - Automated verification results
   - Code review findings
   - Any deviations from plan
   - Overall PASS/FAIL status

### Step 3: Call `complete_validation` Tool

Complete the workflow by calling:
```
complete_validation(
  passed: true/false,
  summary: "Brief summary"
)
```

**You will remain stuck in validation phase until you call this tool.**

---

## Complete Workflow Example:

```
[All implementation phases done]

⚠️ Calling complete_implementation tool...

✅ Implementation marked complete!
⚠️ VALIDATION PHASE STARTED (automatic)

[Received validation instructions]

[Performing validation...]
- Reading plan
- Checking all phases
- Running automated tests
- Generating report

[Creating validation report]

✅ Calling complete_validation tool...
   passed: true
   summary: "All phases implemented correctly, tests pass"

🎉 Workflow complete!
```

---

## IMPORTANT REMINDERS:

❌ **DO NOT** say "implementation complete" without calling `complete_implementation`
❌ **DO NOT** try to skip validation - it's technically enforced
❌ **DO NOT** forget to call `complete_validation` when done validating

✅ **DO** call `complete_implementation` when all code changes are done
✅ **DO** follow the validation instructions you receive
✅ **DO** call `complete_validation` with honest results

**The workflow will BLOCK you in validation phase until you complete it properly!**
