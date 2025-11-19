# Context Engine MCP Server - Project Overview

## 🎯 What Is This?

An MCP (Model Context Protocol) server that **automates the Research → Plan → Validate workflow** for AI coding tools.

**Problem it solves**: The Stanford study found 50% of AI-generated code needs to be rewritten because developers skip research and planning.

**Solution**: Enforce a proven workflow that prevents rework by understanding the codebase first, planning changes systematically, and validating implementation.

## 📦 What's Included

### Core Components

1. **MCP Server** (`src/index.ts`)
   - Provides tools for each workflow phase
   - Enforces phase ordering (can't skip research/planning)
   - Integrates with Cursor, Claude Desktop, etc.

2. **State Manager** (`src/state.ts`)
   - Tracks current workflow phase
   - Persists state across IDE restarts
   - Manages document paths and approvals

3. **Prompt Templates** (`prompts/`)
   - Research phase instructions
   - Planning phase instructions
   - Implementation phase instructions
   - Validation phase instructions

### Documentation

- **README.md** - Main documentation
- **GETTING_STARTED.md** - Step-by-step setup guide
- **EXAMPLES.md** - Complete workflow examples
- **DEVELOPMENT.md** - Development and contribution guide

### Tools & Scripts

- **install.sh** - Automated setup script
- **package.json** - Node.js configuration
- **tsconfig.json** - TypeScript configuration
- **.eslintrc.json** - Code linting rules

## 🚀 Quick Start

### Install
```bash
npm install -g @context-engine/mcp-server
```

### Configure Cursor
Add to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "context-engine": {
      "command": "context-engine"
    }
  }
}
```

### Use
```
You: I need to add authentication
Context Engine: Let me research your codebase first...
```

## 🎨 How It Works

### The Workflow

```
User Request
    ↓
Research Phase (understand existing code)
    ↓
Planning Phase (spec all changes)
    ↓
Approval Gate (human reviews plan)
    ↓
Implementation Phase (execute plan)
    ↓
Validation Phase (verify vs plan)
    ↓
Done (production-ready code)
```

### Workflow Enforcement

The MCP server uses a state machine to enforce ordering:

```typescript
// Can't plan without research
if (!state.hasResearch()) {
  return "❌ BLOCKED: Research required first";
}

// Can't implement without approved plan
if (!state.isPlanApproved()) {
  return "❌ BLOCKED: Plan approval required";
}
```

### Document Generation

Each phase creates structured documents:

- `thoughts/shared/research/` - Research findings
- `thoughts/shared/plans/` - Implementation plans

These documents become the source of truth and enable:
- Team alignment
- Code review on specs (not just code)
- Historical context
- Reproducible builds

## 🎯 Target Users

### Primary: Individual Developers
- Using Cursor, Copilot, Claude Code
- Tired of rewriting AI-generated code
- Want professional-quality output

### Secondary: Engineering Teams
- Need workflow consistency
- Want better code review process
- Require documentation

### Tertiary: Enterprises
- Complex codebases
- Compliance requirements
- Need audit trails

## 💰 Monetization Strategy

### Free Tier (MCP Server)
- Open source, unlimited use
- Local execution
- Community support
- **Goal**: Viral adoption

### Pro Tier ($29-99/mo)
- Cloud sync & backup
- Analytics dashboard
- Team collaboration
- GitHub/Slack integration
- **Goal**: Individual developers & small teams

### Enterprise (Custom)
- On-prem deployment
- SSO/SAML
- Custom workflows
- Training & support
- **Goal**: Large organizations

## 📊 Key Metrics

### User Metrics
- MCP server installs
- Active users (using tools daily)
- Free → Pro conversion rate

### Value Metrics
- Rework prevented (hours)
- Code quality score
- First-try success rate
- Plan approval rate

### Business Metrics
- MRR growth
- Churn rate
- NPS score

## 🏗️ Technical Architecture

```
┌─────────────────────┐
│   IDE (Cursor)      │
│                     │
│  User interacts     │
└──────────┬──────────┘
           │ MCP Protocol (stdio)
┌──────────▼──────────┐
│   MCP Server        │
│                     │
│ ┌─────────────────┐ │
│ │ State Machine   │ │
│ │ - Track phase   │ │
│ │ - Enforce gates │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ Tools           │ │
│ │ - research      │ │
│ │ - plan          │ │
│ │ - implement     │ │
│ │ - validate      │ │
│ └─────────────────┘ │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Filesystem        │
│                     │
│ - Research docs     │
│ - Implementation    │
│   plans             │
│ - Workflow state    │
└─────────────────────┘
```

## 🚦 Development Status

### ✅ Completed (v0.1 MVP)
- [x] Core MCP server implementation
- [x] State management system
- [x] All workflow phase tools
- [x] Prompt templates
- [x] Documentation
- [x] Installation scripts

### 🔄 In Progress
- [ ] Unit tests
- [ ] Integration tests
- [ ] npm package publishing

### 📋 Planned (v0.2)
- [ ] Analytics dashboard
- [ ] Cloud sync
- [ ] Team features
- [ ] GitHub Actions integration

### 🎯 Future (v1.0)
- [ ] Enterprise features
- [ ] Custom templates
- [ ] Advanced metrics
- [ ] API for integrations

## 📚 Key Resources

### Methodology
- [Dex's AI Engineer Talk](https://youtube.com/watch?v=example) - The workflow explained
- [12 Factor Agents](https://example.com) - Original context engineering principles
- [Stanford Study](https://example.com) - The 50% rework problem

### Technical
- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community
- GitHub: `github.com/context-engine/mcp-server`
- Discord: `discord.gg/context-engine`
- Twitter: `@context_engine`

## 🎓 Educational Value

This project demonstrates:

1. **MCP Server Implementation**
   - How to build an MCP server
   - Tool definition and handling
   - State management patterns

2. **Workflow Automation**
   - State machines for process enforcement
   - Human-in-the-loop patterns
   - Document-driven development

3. **AI Coding Best Practices**
   - Context optimization
   - Spec-first development
   - Validation strategies

4. **Product Development**
   - Open source → freemium → enterprise
   - Developer tools go-to-market
   - Community-driven growth

## 🤝 Contributing

We welcome contributions!

**Areas to help:**
- Add more prompt templates
- Improve error messages
- Write tests
- Create examples
- Improve documentation
- Build integrations

See [DEVELOPMENT.md](DEVELOPMENT.md) for setup instructions.

## 📄 License

MIT License - See [LICENSE](LICENSE) file.

Free to use, modify, and distribute.

## 🙏 Acknowledgments

Built on work by:
- **Dex Horthy** - Human Layer methodology
- **Anthropic** - MCP protocol
- **AI Engineering community** - Best practices and feedback

## 🚀 Next Steps

### For Users
1. [Install Context Engine](GETTING_STARTED.md)
2. [Try example workflows](EXAMPLES.md)
3. [Join Discord community](https://discord.gg/context-engine)

### For Contributors
1. [Set up development environment](DEVELOPMENT.md)
2. [Pick an issue to work on](https://github.com/context-engine/mcp-server/issues)
3. [Submit a pull request](https://github.com/context-engine/mcp-server/pulls)

### For Investors/Partners
1. [Review business plan](#monetization-strategy)
2. [See traction metrics](#key-metrics)
3. [Contact team](mailto:hello@context-engine.dev)

---

**Built with ❤️ by developers, for developers**

Stop wasting 50% of your AI code. Start using Context Engine today.
