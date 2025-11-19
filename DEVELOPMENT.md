# Development Guide

Guide for developers working on Context Engine MCP Server.

## Project Structure

```
context-engine-mcp/
├── src/
│   ├── index.ts           # Main MCP server
│   └── state.ts           # Workflow state management
├── prompts/
│   ├── research.md        # Research phase prompt
│   ├── plan.md            # Planning phase prompt
│   ├── validate.md        # Validation phase prompt
│   └── implement.md       # Implementation phase prompt
├── build/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── README.md
├── GETTING_STARTED.md
├── EXAMPLES.md
└── install.sh
```

## Setup Development Environment

### 1. Clone and Install

```bash
git clone https://github.com/context-engine/mcp-server.git
cd mcp-server
npm install
```

### 2. Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in `build/` directory.

### 3. Development Mode

```bash
npm run watch
```

Runs TypeScript compiler in watch mode - rebuilds on file changes.

### 4. Run Locally

```bash
npm run dev
```

Starts the MCP server using tsx (no build step needed).

### 5. Test with Cursor

While developing, test by configuring Cursor to use your local build:

```json
{
  "mcpServers": {
    "context-engine-dev": {
      "command": "node",
      "args": ["/path/to/context-engine-mcp/build/index.js"]
    }
  }
}
```

## Development Workflow

### Making Changes

1. **Edit source files** in `src/`
2. **Rebuild**: `npm run build` or use watch mode
3. **Test**: Restart your IDE and test changes
4. **Lint**: `npm run lint`
5. **Commit**: Follow conventional commits

### Testing Changes

#### Manual Testing

Use Cursor/Claude Desktop with your local build:

```
# In Cursor:
You: What's my workflow status?
```

Should respond with current state.

#### Unit Tests (Coming Soon)

```bash
npm test
```

### Adding New Tools

To add a new tool to the MCP server:

1. **Define tool in `src/index.ts`**:

```typescript
const tools: Tool[] = [
  // ... existing tools
  {
    name: 'new_tool_name',
    description: 'What this tool does',
    inputSchema: {
      type: 'object',
      properties: {
        param_name: {
          type: 'string',
          description: 'What this parameter is for',
        },
      },
      required: ['param_name'],
    },
  },
];
```

2. **Add handler in CallToolRequestSchema**:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    // ... existing cases
    
    case 'new_tool_name': {
      const { param_name } = args as { param_name: string };
      
      // Tool logic here
      
      return {
        content: [
          {
            type: 'text',
            text: 'Tool response',
          },
        ],
      };
    }
  }
});
```

3. **Update state management if needed** in `src/state.ts`

4. **Create prompt template** in `prompts/` if needed

5. **Test thoroughly**

6. **Update documentation**

### Modifying Prompts

Prompt templates are in `prompts/`:

- `research.md` - Research phase instructions
- `plan.md` - Planning phase instructions  
- `validate.md` - Validation phase instructions
- `implement.md` - Implementation phase instructions

**Testing prompt changes:**

1. Edit the `.md` file
2. Rebuild: `npm run build`
3. Restart IDE
4. Trigger the tool that uses that prompt
5. Verify the output includes your changes

**Prompt Design Guidelines:**

- Keep instructions clear and actionable
- Use examples liberally
- Reference the methodology (Dex's workflow)
- Be explicit about constraints
- Include output format examples

## Code Style

We follow TypeScript best practices:

- **Explicit types** for function parameters and returns
- **Async/await** over promises
- **Early returns** for error cases
- **Descriptive names** over comments
- **Single responsibility** functions

### Linting

```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint -- --fix
```

## Release Process

### 1. Version Bump

```bash
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0
```

### 2. Build and Test

```bash
npm run build
npm test
```

### 3. Publish to npm

```bash
npm publish
```

### 4. Create GitHub Release

Tag version and create release notes:

```bash
git tag v0.1.1
git push origin v0.1.1
```

Then create release on GitHub with:
- Changelog
- Installation instructions
- Breaking changes (if any)

## Architecture Decisions

### Why MCP?

MCP (Model Context Protocol) allows any MCP-compatible client to use our workflow:
- Cursor
- Claude Desktop
- Future AI coding tools

This is more flexible than being tied to one IDE.

### Why Stdio Transport?

MCP servers communicate over stdio (standard input/output):
- Simple and universal
- Works with any process spawner
- Easy to debug
- Low overhead

### Why State in Filesystem?

We store workflow state in `.context-engine/workflow-state.json`:
- Survives IDE restarts
- Easy to inspect and debug
- Can be checked into git if desired
- Simple to implement

### Why Separate Prompts?

Prompt templates are in separate `.md` files:
- Easy to edit without touching code
- Can be customized per project
- Clear separation of concerns
- Easier to test and iterate

## Debugging

### Enable Debug Logging

Set environment variable:

```bash
DEBUG=context-engine:* npm run dev
```

### Inspect MCP Communication

MCP communication happens over stdio. To see messages:

1. Run server directly:
```bash
node build/index.js
```

2. Send JSON-RPC messages manually:
```json
{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}
```

### Check State File

```bash
cat .context-engine/workflow-state.json
```

Shows current workflow state.

### Common Issues

**"Cannot find module"**
- Run `npm run build` first
- Check `build/` directory exists

**"Tool not found"**
- Verify tool is in `tools` array
- Check tool name matches exactly
- Rebuild after changes

**"State not persisting"**
- Check `.context-engine/` directory exists
- Verify write permissions
- Check for errors in console

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code of conduct
- How to submit PRs
- Issue templates
- Review process

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Dex's Methodology](https://youtube.com/watch?v=example)

---

Questions? Open an issue or ask in Discord!
