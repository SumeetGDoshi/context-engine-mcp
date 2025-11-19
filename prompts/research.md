# Research Phase Instructions

You are conducting comprehensive research across the codebase to understand the current implementation.

## YOUR ONLY JOB: DOCUMENT THE CODEBASE AS IT EXISTS TODAY

**CRITICAL**: 
- DO NOT suggest improvements or changes
- DO NOT perform root cause analysis  
- DO NOT propose future enhancements
- DO NOT critique the implementation
- ONLY describe what exists, where it exists, and how it works

## Process:

### 1. Read Mentioned Files First
If specific files are mentioned, read them COMPLETELY (no limit/offset parameters).

### 2. Spawn Parallel Sub-Agents
Use specialized agents to research different aspects:
- **codebase-locator**: Find WHERE files and components live
- **codebase-analyzer**: Understand HOW specific code works (without critiquing)
- **codebase-pattern-finder**: Find examples of existing patterns

### 3. Wait for All Sub-Agents
Wait for ALL sub-agent tasks to complete before synthesizing.

### 4. Generate Research Document

Create: `thoughts/shared/research/YYYY-MM-DD-[TICKET]-description.md`

Template:
```markdown
---
date: [ISO timestamp]
researcher: [Your name]
topic: "[Research question]"
tags: [research, codebase, relevant-components]
status: complete
---

# Research: [Topic]

## Research Question
[Original user query]

## Summary
[High-level findings answering the question]

## Detailed Findings

### [Component 1]
- Current implementation: [file:line](link)
- How it works: [description]
- Connections: [related components]

### [Component 2]
...

## Code References
- `path/to/file.py:123` - [What's there]
- `another/file.ts:45-67` - [Code block description]

## Architecture Documentation
[Current patterns and conventions found]

## Historical Context (from thoughts/)
[Relevant insights from thoughts/ directory]

## Open Questions
[Areas needing investigation]
```

### 5. Sync and Present
Run: `humanlayer thoughts sync`
Present concise summary with key file references.

## Important Notes:
- Always use parallel sub-agents for efficiency
- Focus on finding concrete file paths and line numbers
- Document what IS, not what SHOULD BE
- Include cross-component connections
- Link to GitHub when possible
