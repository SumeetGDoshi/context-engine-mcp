# Validation Phase Instructions

You are validating that an implementation plan was correctly executed.

## Process:

### 1. Determine Context
- Are you in an existing conversation or starting fresh?
- If existing: Review what was implemented in this session
- If fresh: Discover through git and codebase analysis

### 2. Locate the Plan
- If plan path provided, use it
- Otherwise, search recent commits for plan references or ask user

### 3. Gather Implementation Evidence
```bash
# Check recent commits
git log --oneline -n 20
git diff HEAD~N..HEAD  # Where N covers implementation

# Run comprehensive checks
make check test
```

## Validation Steps:

### Step 1: Context Discovery

1. **Read the implementation plan** completely
2. **Identify what should have changed**:
   - List all files that should be modified
   - Note all success criteria (automated and manual)
   - Identify key functionality to verify

3. **Spawn parallel research tasks**:
   ```
   Task 1 - Verify changes:
   Research if [specific changes] were implemented.
   Check: [files mentioned in plan]
   Return: What was implemented vs what plan specified

   Task 2 - Verify tests:
   Check if tests were added/modified as specified.
   Run test commands and capture results.
   Return: Test status and missing coverage

   Task 3 - Check automated criteria:
   Run all automated verification commands from plan.
   Return: Pass/fail for each criterion
   ```

### Step 2: Systematic Validation

For each phase in the plan:

1. **Check completion status**:
   - Look for checkmarks in plan (- [x])
   - Verify actual code matches claimed completion

2. **Run automated verification**:
   - Execute each command from "Automated Verification"
   - Document pass/fail status
   - If failures, investigate root cause

3. **Assess manual criteria**:
   - List what needs manual testing
   - Provide clear steps for user verification

4. **Think about edge cases**:
   - Were error conditions handled?
   - Missing validations?
   - Could implementation break existing functionality?

### Step 3: Generate Validation Report

Create comprehensive summary:

```markdown
## Validation Report: [Plan Name]

### Implementation Status
✓ Phase 1: [Name] - Fully implemented
✓ Phase 2: [Name] - Fully implemented  
⚠️ Phase 3: [Name] - Partially implemented (see issues)

### Automated Verification Results
✓ Build passes: `make build`
✓ Tests pass: `make test`
✗ Linting issues: `make lint` (3 warnings)

### Code Review Findings

#### Matches Plan:
- Database migration correctly adds [table]
- API endpoints implement specified methods
- Error handling follows plan

#### Deviations from Plan:
- Used different variable names in [file:line]
- Added extra validation in [file:line] (improvement)

#### Potential Issues:
- Missing index on foreign key (performance concern)
- No rollback handling in migration

### Manual Testing Required:
1. UI functionality:
   - [ ] Verify [feature] appears correctly
   - [ ] Test error states with invalid input

2. Integration:
   - [ ] Confirm works with existing [component]
   - [ ] Check performance with large datasets

### Recommendations:
- Address linting warnings before merge
- Consider adding integration test for [scenario]
- Document new API endpoints

### Overall Status: [PASS / NEEDS WORK / FAIL]
```

## Important Guidelines:

1. **Be thorough** - Don't skip verification commands
2. **Run all automated checks** - Execute every command in plan
3. **Document everything** - Both successes and issues
4. **Think critically** - Does this truly solve the problem?
5. **Consider maintenance** - Will this be maintainable?

## Validation Checklist:

Always verify:
- [ ] All phases marked complete are actually done
- [ ] Automated tests pass
- [ ] Code follows existing patterns
- [ ] No regressions introduced
- [ ] Error handling is robust
- [ ] Documentation updated if needed
- [ ] Manual test steps are clear

## Working with Existing Context:

If you were part of implementation:
- Review conversation history
- Check your todo list for completed items
- Focus validation on work done in this session
- Be honest about shortcuts or incomplete items

Remember: Good validation catches issues before production. Be constructive but thorough.
