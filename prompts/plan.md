# Planning Phase Instructions

You are creating a detailed implementation plan through an interactive, iterative process.

## Process:

### 1. Read Context Files Completely
- Ticket files
- Research documents  
- Related plans
- ANY mentioned files - read them FULLY (no limit/offset)

### 2. Spawn Research Tasks
Before asking questions, use agents to gather context:
- **codebase-locator**: Find related files
- **codebase-analyzer**: Understand current implementation
- **thoughts-locator**: Find existing thoughts documents

### 3. Read All Identified Files
After research completes, read ALL identified files FULLY.

### 4. Present Understanding & Ask Questions
```
Based on the ticket and research, I understand we need to [summary].

I've found:
- [Current implementation with file:line]
- [Relevant patterns discovered]
- [Potential complexities identified]

Questions I cannot answer through code:
- [Specific technical question requiring human judgment]
- [Business logic clarification]
- [Design preference]
```

Only ask questions you cannot answer through code investigation.

### 5. Create Plan Structure
```
Here's my proposed plan structure:

## Overview
[1-2 sentence summary]

## Implementation Phases:
1. [Phase name] - [what it accomplishes]
2. [Phase name] - [what it accomplishes]  
3. [Phase name] - [what it accomplishes]

Does this phasing make sense?
```

Get feedback before writing details.

### 6. Write Detailed Plan

Create: `thoughts/shared/plans/YYYY-MM-DD-[TICKET]-description.md`

Template:
```markdown
# [Feature] Implementation Plan

## Overview
[What we're building and why]

## Current State Analysis
[What exists now, what's missing, constraints]

## Desired End State
[Specification of desired state and how to verify]

## What We're NOT Doing
[Explicitly list out-of-scope items]

## Phase 1: [Name]

### Overview
[What this phase accomplishes]

### Changes Required:

#### 1. [Component/File]
**File**: `path/to/file.ext`
**Changes**: [Summary]

```[language]
// Specific code to add/modify
```

### Success Criteria:

#### Automated Verification:
- [ ] Migration runs: `make migrate`
- [ ] Tests pass: `make test`
- [ ] Linting passes: `make lint`
- [ ] Type checking: `npm run typecheck`

#### Manual Verification:
- [ ] Feature works when tested via UI
- [ ] Performance acceptable under load
- [ ] Edge cases verified
- [ ] No regressions

**Implementation Note**: After automated verification passes, pause for manual confirmation before next phase.

---

## Phase 2: [Name]
[Same structure...]

---

## Testing Strategy
### Unit Tests:
- [What to test]

### Integration Tests:
- [End-to-end scenarios]

### Manual Testing Steps:
1. [Specific verification step]
2. [Edge case to test]

## References
- Ticket: `thoughts/allison/tickets/[ticket].md`
- Research: `thoughts/shared/research/[research].md`
```

### 7. Sync and Review
Run: `humanlayer thoughts sync`

Present:
```
Plan created at: thoughts/shared/plans/YYYY-MM-DD-topic.md

Please review:
- Are phases properly scoped?
- Are success criteria specific enough?
- Missing edge cases?
```

Iterate based on feedback.

## Critical Guidelines:

1. **Be Skeptical**: Question vague requirements, verify with code
2. **Be Interactive**: Get buy-in at each step, allow corrections
3. **Be Thorough**: Read all files COMPLETELY, include file:line numbers
4. **Be Practical**: Incremental changes, testable phases
5. **No Open Questions**: Resolve ALL questions before finalizing plan

## Success Criteria Requirements:

**Always separate:**
- **Automated Verification**: Commands that can be run (`make test`, etc.)
- **Manual Verification**: Human judgment required (UI, performance, UX)

Use `make` commands whenever possible.

## Important:
- If user corrects you, spawn NEW research tasks to verify
- DO NOT write plan with placeholder values
- WAIT for all sub-agents before synthesizing
- Plans must be complete and actionable
