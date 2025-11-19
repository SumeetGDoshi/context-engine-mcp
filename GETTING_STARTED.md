# Getting Started with Context Engine

A step-by-step guide to start using Context Engine MCP Server.

## Prerequisites

- Node.js 18 or higher
- One of:
  - Cursor IDE
  - Claude Desktop
  - Any MCP-compatible client

## Installation

### Option 1: Quick Install Script (Recommended)

```bash
curl -fsSL https://context-engine.dev/install.sh | bash
```

This will:
- Install the MCP server
- Create necessary directories
- Configure your IDE automatically
- Set up `.gitignore`

### Option 2: Manual Installation

#### Step 1: Install Package

**Global installation** (recommended):
```bash
npm install -g @context-engine/mcp-server
```

**Project installation**:
```bash
npm install --save-dev @context-engine/mcp-server
```

#### Step 2: Create Directory Structure

```bash
mkdir -p thoughts/shared/{research,plans}
mkdir -p thoughts/allison/tickets
mkdir -p .context-engine
```

Add to `.gitignore`:
```
.context-engine/
```

#### Step 3: Configure Your IDE

**For Cursor:**

Create/edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "context-engine": {
      "command": "context-engine"
    }
  }
}
```

If installed locally, use:
```json
{
  "mcpServers": {
    "context-engine": {
      "command": "npx",
      "args": ["@context-engine/mcp-server"]
    }
  }
}
```

**For Claude Desktop:**

Create/edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "context-engine": {
      "command": "npx",
      "args": ["@context-engine/mcp-server"]
    }
  }
}
```

#### Step 4: Restart IDE

Close and restart Cursor or Claude Desktop for changes to take effect.

## Verify Installation

Open Cursor/Claude and try:

```
You: What's my workflow status?
```

You should see:
```
⚠️  No research found. Start with /research to analyze the codebase.
```

✅ If you see this, Context Engine is working!

## Your First Workflow

Let's walk through a complete example.

### 1. Start with a Task

```
You: I need to add rate limiting to my API
```

Context Engine will guide you:
```
⚠️  No research found. Start with research to analyze the codebase.

Even for implementation tasks, research helps understand:
- Current middleware patterns
- Existing rate limiting (if any)
- API route structure
- Configuration management

Shall I research your codebase first?
```

### 2. Research Phase

```
You: Yes, research it
```

Context Engine will:
1. Spawn parallel agents to find relevant files
2. Analyze your current implementation
3. Generate a research document

Output: `thoughts/shared/research/2025-11-16-rate-limiting.md`

```markdown
# Research: Rate Limiting

## Current State
- Express API at src/app.ts
- No rate limiting currently
- Middleware pattern exists (src/middleware/logger.ts)

## Findings
- Routes defined in src/routes/
- Config in src/config/
- Use express-rate-limit library (standard)
```

### 3. Planning Phase

After research completes:

```
You: Create implementation plan
```

Context Engine will:
1. Check that research exists (✓)
2. Create detailed implementation plan
3. Wait for your approval

Output: `thoughts/shared/plans/2025-11-16-rate-limiting.md`

```markdown
# Rate Limiting Implementation Plan

## Phase 1: Install Dependencies
- Install express-rate-limit
- Add TypeScript types

## Phase 2: Create Middleware
- Create src/middleware/rateLimiter.ts
- Configure limits

## Phase 3: Apply to Routes
- Add to sensitive endpoints
- Configure per-route limits

## Success Criteria:
### Automated:
- [ ] Tests pass: make test
- [ ] Build succeeds: npm run build

### Manual:
- [ ] Rate limiting triggers after limit
- [ ] Correct error messages shown
```

### 4. Review & Approve

```
You: Approve the plan
```

Or if changes needed:
```
You: Reject - also add IP whitelist functionality
```

### 5. Implementation

After approval:

```
You: Implement the plan
```

Context Engine will:
1. Reference the approved plan
2. Execute phase by phase
3. Run automated checks after each phase
4. Stop for manual verification when needed

### 6. Validation

After implementation:

```
You: Validate implementation
```

Context Engine will:
1. Run all automated checks from plan
2. Compare git diff to plan
3. Generate validation report
4. List manual testing requirements

Output:
```
✅ Validation Report

Implementation Status: ✓ Complete
Automated Checks: ✓ All passing
Deviations: 1 improvement (added logging)

Manual Testing Required:
- [ ] Test rate limiting with >100 requests
- [ ] Verify error messages
```

## Workflow Commands

### Check Status
```
What's my workflow status?
```
Shows current phase and what to do next.

### Research
```
Research [topic]
```
Analyzes codebase to understand current state.

### Plan
```
Create implementation plan
```
Generates detailed spec of all changes.

### Approve/Reject
```
Approve the plan
```
or
```
Reject plan - [feedback]
```

### Implement
```
Implement the plan
```
Executes approved plan phase by phase.

### Validate
```
Validate implementation
```
Verifies implementation matches plan.

### Reset
```
Reset workflow
```
Starts fresh for a new task.

## Understanding the Workflow

### The Hierarchy

From Dex's talk:
> A bad line of research → 1000s of bad lines of code
> A bad line in a plan → 100s of bad lines of code  
> A bad line of code → 1 bad line of code

**Invest time at the top of the hierarchy.**

### Why Research First?

Without research:
- ❌ Don't know existing patterns
- ❌ Might conflict with architecture
- ❌ Could duplicate existing code
- ❌ Miss important constraints

With research:
- ✅ Understand what exists
- ✅ Follow established patterns
- ✅ Reuse existing components
- ✅ Respect constraints

### Why Plan Before Coding?

Without a plan:
- ❌ Unclear scope
- ❌ No success criteria
- ❌ Hard to review
- ❌ Leads to rework

With a plan:
- ✅ Clear scope and phases
- ✅ Testable criteria
- ✅ Easy to review
- ✅ First-try success

### Why Validate After?

Without validation:
- ❌ Don't know if complete
- ❌ Miss edge cases
- ❌ Unclear what to test
- ❌ Regressions slip through

With validation:
- ✅ Verify completeness
- ✅ Catch deviations
- ✅ Clear testing steps
- ✅ Confidence in changes

## Tips for Success

### 1. Trust the Process
Research feels slow but saves hours of rework.

### 2. Review Plans Carefully
Plans are easier to fix than code.

### 3. Use Manual Verification
Let humans verify UX, performance, edge cases.

### 4. Keep Context Low
Better to split into smaller tasks than overwhelm context.

### 5. Document Decisions
Future you (and your team) will thank you.

## Common Scenarios

### Small Bug Fix
```
Research → Quick plan → Fix → Validate
(15 min total, prevents related issues)
```

### New Feature
```
Deep research → Detailed plan → Phased implementation → Full validation
(1-2 days, but zero rework)
```

### Refactoring
```
Research architecture → Migration plan → Incremental phases → Regression testing
(Safer, maintains team alignment)
```

## Troubleshooting

### "MCP Server not found"
- Verify installation: `npm list -g @context-engine/mcp-server`
- Check IDE config file path
- Restart IDE

### "Cannot create research doc"
- Verify directories exist: `thoughts/shared/research/`
- Check write permissions
- Ensure you're in project root

### "Workflow state corrupted"
- Reset: `rm -rf .context-engine/`
- Restart workflow

### "Plan won't approve"
- Check plan exists in `thoughts/shared/plans/`
- Review plan for completeness
- Ensure no placeholder values

## Next Steps

1. **Try a small task** - Get familiar with workflow
2. **Read EXAMPLES.md** - See complete workflows
3. **Join Discord** - Ask questions, share experiences
4. **Read Dex's talk transcript** - Understand the methodology

## Resources

- [Full Documentation](README.md)
- [Example Workflows](EXAMPLES.md)
- [Dex's AI Engineer Talk](https://youtube.com/watch?v=example)
- [Discord Community](https://discord.gg/context-engine)

---

**Questions?** Open an issue or ask in Discord!
