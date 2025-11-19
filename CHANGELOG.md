# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-11-19

### Changed
- Updated LICENSE copyright to Sumeet G. Doshi (Contexter)

## [0.1.0] - 2025-11-19

### Added

#### Core Workflow Tools
- `workflow_status` - Check current workflow phase and state
- `research_codebase` - Start research phase and create research documents
- `create_plan` - Create detailed implementation plans after research
- `approve_plan` - Approve implementation plans to proceed
- `reject_plan` - Reject plans that need revision
- `implement_plan` - Execute approved plans phase by phase
- `complete_implementation` - Mark implementation complete and auto-trigger validation
- `validate_implementation` - Validate implementation against plan
- `complete_validation` - Complete validation phase with results
- `reset_workflow` - Reset workflow to idle state

#### Workflow State Management
- State machine with phases: idle → research → plan → implement → validate
- Persistent state storage in `.context-engine/workflow-state.json`
- Auto-discovery of research and plan documents when state paths are missing
- Auto-sync between file system and in-memory state on phase transitions
- Project-local file storage in `mcpDocs/` directory

#### Workflow Enforcement
- Cannot create plan without research
- Cannot implement without approved plan
- Cannot skip validation after implementation (technically enforced)
- Automatic validation phase trigger when implementation completes
- Clear status messages and blocking behavior for workflow violations

#### Documentation
- Comprehensive README with quick start guide
- Structured research document templates
- Implementation plan templates with phased approach
- Validation report templates
- Context optimization guidelines (keep under 40% utilization)

#### Integration Support
- Cursor IDE configuration examples
- Claude Desktop configuration examples
- GitHub Actions workflow validation example
- Pre-commit hooks for plan references

### Fixed
- State synchronization issues when restarting MCP server
- Research and plan detection always returning false
- Path mismatches between file creation and discovery
- AI agents skipping validation phase despite warnings
- Incomplete validation workflow (missing completion mechanism)

### Technical Details
- Built with TypeScript 5.3.3
- Uses MCP SDK 0.5.0
- Requires Node.js 18+
- File structure: Research in `mcpDocs/research/`, Plans in `mcpDocs/plans/`

### Known Limitations
- Single-user workflow (no team collaboration yet)
- No cloud sync or analytics dashboard
- Manual verification steps require user confirmation
- Context compaction not yet fully automated

[0.1.1]: https://github.com/SumeetGDoshi/context-engine-mcp/releases/tag/v0.1.1
[0.1.0]: https://github.com/SumeetGDoshi/context-engine-mcp/releases/tag/v0.1.0
