# Context Engine MCP Server

> Stop wasting 50% of your AI-generated code. Ship production-ready code on the first try.

An MCP (Model Context Protocol) server that automates the **Research → Plan → Validate** workflow for AI coding tools like Cursor, Claude Code, and Copilot.

## 🎯 The Problem

The Stanford study found that **50% of AI-generated code needs to be rewritten**. Why?

- Developers skip research and jump straight to coding
- No detailed planning before implementation
- No systematic validation after coding
- AI agents lack understanding of existing codebase

**Result**: Lots of code that doesn't fit the architecture, breaks patterns, or solves the wrong problem.

## 💡 The Solution

Context Engine enforces a proven workflow:

```
1. 🔍 Research  → Understand existing codebase first
2. 📋 Plan      → Specify every change before coding  
3. ✅ Validate  → Verify implementation matches spec
```

This is the workflow that enabled:
- **35k lines of code shipped in one day** (Boundary use case)
- **Zero rework** on 300k line Rust codebase (BAML case study)
- **2 PRs on first day** for engineering interns

[Watch Dex's talk](https://www.youtube.com/watch?v=IS_y40zY-hc) explaining the methodology.

## 🚀 Quick Start

### Installation

```bash
npm install -g @context-engine/mcp-server
```

### Configure with Cursor

Add to your Cursor MCP settings (`~/.cursor/mcp.json`):

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

### Configure with Claude Desktop

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

Restart your IDE.

## 📖 Usage

### Check Workflow Status

```
You: What's my workflow status?
```

The MCP server will tell you what phase you're in and what to do next.

### Full Workflow Example

#### 1. Research Phase

```
You: I need to add authentication to my API
```

The server will:
- ❌ Block immediate implementation
- ✅ Guide you to research first
- ✅ Generate research document at `mcpDocs/research/2025-11-16-authentication.md`
- ✅ Include file:line references to existing code

#### 2. Planning Phase

After research completes:

```
You: Create implementation plan
```

The server will:
- ✅ Check that research exists (or block)
- ✅ Create detailed plan at `mcpDocs/plans/2025-11-16-authentication.md`
- ✅ Include phases, success criteria, file changes
- ⏸️ Wait for your approval

#### 3. Approve Plan

Review the plan, then:

```
You: Approve the plan
```

Or if changes needed:

```
You: Reject plan - need to add rate limiting
```

#### 4. Implementation

After approval:

```
You: Implement the plan
```

The server will:
- ✅ Provide implementation instructions
- ✅ Reference the plan in all changes
- ✅ Keep context under 40%
- ⏸️ Stop between phases for manual verification

#### 5. Validation

After implementation:

```
You: Validate implementation
```

The server will:
- ✅ Run all automated checks from plan
- ✅ Compare git diff to planned changes
- ✅ Generate validation report
- ✅ Report pass/fail status

## 🎯 Key Features

### ✅ Workflow Enforcement

**Can't skip steps:**
- No planning without research
- No implementation without approved plan
- No merge without validation

**Gentle redirection:**
```
❌ BLOCKED: Cannot create plan without research.

⚠️  No research found. Start with research to analyze the codebase.

Please run 'research_codebase' first.
```

### 📊 Workflow State Tracking

The server maintains state in `.context-engine/workflow-state.json`:

```json
{
  "currentPhase": "plan",
  "researchPath": "mcpDocs/research/2025-11-16-auth.md",
  "planPath": "mcpDocs/plans/2025-11-16-auth.md",
  "planApproved": false,
  "metadata": {
    "taskDescription": "Add authentication to API"
  }
}
```

### 🎨 Structured Outputs

All documents follow consistent templates:

**Research docs** include:
- What exists today (file:line references)
- How components connect
- Current patterns and conventions
- Historical context from codebase

**Implementation plans** include:
- Phased approach (Phase 1, 2, 3...)
- Specific file changes with code snippets
- Automated verification (make test, etc.)
- Manual verification (UI testing, performance)

**Validation reports** include:
- Phase-by-phase status
- Automated check results
- Deviations from plan
- Manual testing requirements

### ⚡ Context Optimization

Following Dex's principle: **Keep context under 40%**

The server ensures:
- Research is done by parallel sub-agents
- Plans are created incrementally
- Implementation happens phase-by-phase
- Fresh context between major phases

## 🏗️ Directory Structure

Context Engine creates this structure in your project:

```
your-project/
├── .context-engine/
│   └── workflow-state.json          # Workflow state
├── mcpDocs/                         # Auto-created by MCP server
│   ├── research/                    # Research documents
│   │   └── 2025-11-16-auth.md
│   └── plans/                       # Implementation plans
│       └── 2025-11-16-auth.md
└── src/                             # Your code
```

The `mcpDocs/` folder is automatically created when you start research or planning. No manual setup needed!

## 🎓 Understanding the Workflow

### Why This Works

From Dex's talk at AI Engineer Summit:

> "A bad line of code is a bad line of code. But a bad part of a plan can be hundreds of bad lines of code. And a bad line of research—a misunderstanding of how the system works—can be thousands of bad lines of code."

**The hierarchy:**
1. **Bad research** → 1000s of bad lines
2. **Bad plan** → 100s of bad lines
3. **Bad code** → 1 bad line

**Invest time at the top of the hierarchy.**

### Context is Everything

LLMs are pure functions. The ONLY thing that affects output quality is input quality (context).

**Goal**: Keep context utilization under 40%

**Why?** The less context used, the better the results. By:
- Researching first (parallel agents)
- Planning before coding
- Compacting between phases

You maximize the "tokens available for thinking" at each step.

### Spec-First Development

In the AI future, **specifications are the valuable asset**, not the generated code.

- Code can be regenerated from spec
- Specs capture intent and decisions
- Specs enable mental alignment across teams
- Specs prevent rework

Context Engine treats plans as first-class artifacts.

## 🛠️ Advanced Usage

### Custom Research Agents

The research phase spawns parallel agents:
- `codebase-locator` - Finds files and components
- `codebase-analyzer` - Understands how code works
- `codebase-pattern-finder` - Finds similar implementations
- `thoughts-locator` - Searches historical decisions

### Success Criteria Format

Plans must separate automated vs manual verification:

```markdown
### Success Criteria:

#### Automated Verification:
- [ ] Tests pass: `make test`
- [ ] Linting passes: `make lint`
- [ ] Build succeeds: `make build`

#### Manual Verification:
- [ ] UI works correctly when tested
- [ ] Performance acceptable under load
- [ ] No regressions in related features
```

This enables:
- Automated validation to run checks
- Clear handoff for manual testing
- Phase-by-phase verification

### Context Compaction

When context approaches 40%, the implementation phase:
1. Updates plan with progress checkmarks
2. Notes current state and next steps
3. Starts fresh context with updated plan

This maintains high-quality outputs throughout implementation.

## 📊 Metrics & Analytics

Context Engine tracks:

- **Workflow adherence** - % of tasks following proper workflow
- **Rework prevented** - Estimated hours saved
- **Context efficiency** - Average context utilization
- **First-try success** - % of implementations passing validation

(Pro/Enterprise features - coming soon)

## 🤝 Integration with Other Tools

### GitHub Actions

Validate PRs automatically:

```yaml
# .github/workflows/validate-workflow.yml
name: Validate Workflow

on: pull_request

jobs:
  check-workflow:
    runs-on: ubuntu-latest
    steps:
      - name: Check for plan
        run: |
          grep -q "mcpDocs/plans/" PR_DESCRIPTION || exit 1
      
      - name: Run validation
        run: |
          npx @context-engine/mcp-server validate
```

### Pre-commit Hooks

Enforce plan references in commits:

```bash
#!/bin/bash
# .git/hooks/commit-msg

if ! grep -q "Plan:" "$1"; then
    echo "❌ Commit must reference implementation plan"
    echo "Format: 'Plan: mcpDocs/plans/2025-11-16-feature.md'"
    exit 1
fi
```

### Linear/Jira Integration

Link research and plans to tickets automatically.

## 🗺️ Roadmap

### v0.1 (Current)
- ✅ Core MCP server
- ✅ Workflow state management
- ✅ Research/Plan/Validate tools
- ✅ Cursor/Claude integration

### v0.2 (Next)
- [ ] Analytics dashboard
- [ ] Team collaboration features
- [ ] Cloud sync for documents
- [ ] Slack/Discord integration

### v1.0 (Future)
- [ ] Enterprise SSO/SAML
- [ ] Custom workflow templates
- [ ] Advanced metrics & insights
- [ ] API for integrations

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
We welcome support buymeacoffee.com/thecodershow

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/context-engine/mcp-server/issues)

## 🙏 Acknowledgments

Built on the workflow pioneered by:
- [Dex](https://twitter.com/dexhorthy) and the Human Layer team
- The [MCP](https://modelcontextprotocol.io) team at Anthropic
- The AI engineering community

---

**Stop wasting 50% of your AI code. Start using Context Engine today.**

```bash
npm install -g @contexter/mcp-server
```
