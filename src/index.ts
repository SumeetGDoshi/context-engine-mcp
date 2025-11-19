#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { StateManager } from './state.js';
import { z } from 'zod';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to ensure directory exists
function ensureDirectoryExists(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}

// Initialize state manager
const stateManager = new StateManager(process.cwd());

// Load prompt templates
function loadPromptTemplate(name: string): string {
  const templatePath = join(__dirname, '..', 'prompts', `${name}.md`);
  return readFileSync(templatePath, 'utf-8');
}

// Tool definitions
const tools: Tool[] = [
  {
    name: 'workflow_status',
    description: 'Check current workflow status and what phase you are in. Use this first to understand what to do next.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'research_codebase',
    description: 'Start the research phase. Analyzes the codebase to understand current implementation. MUST be done before planning.',
    inputSchema: {
      type: 'object',
      properties: {
        task_description: {
          type: 'string',
          description: 'Description of what you want to build or change',
        },
        ticket_id: {
          type: 'string',
          description: 'Optional ticket/issue ID (e.g., ENG-1234)',
        },
      },
      required: ['task_description'],
    },
  },
  {
    name: 'create_plan',
    description: 'Create an implementation plan. Requires research to be complete first. Generates a detailed spec of all changes.',
    inputSchema: {
      type: 'object',
      properties: {
        ticket_file: {
          type: 'string',
          description: 'Optional path to ticket file or detailed requirements',
        },
      },
      required: [],
    },
  },
  {
    name: 'approve_plan',
    description: 'Approve the implementation plan. User must review and explicitly approve before implementation can begin.',
    inputSchema: {
      type: 'object',
      properties: {
        approved: {
          type: 'boolean',
          description: 'True to approve, false to reject',
        },
        feedback: {
          type: 'string',
          description: 'Optional feedback or requested changes',
        },
      },
      required: ['approved'],
    },
  },
  {
    name: 'implement_plan',
    description: 'Begin implementation of the approved plan. Requires an approved plan to exist. Coordinates with Cursor/IDE to execute changes.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'complete_implementation',
    description: 'Mark implementation as complete and automatically trigger validation phase. MUST be called after all implementation work is done.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'validate_implementation',
    description: 'Validate that implementation matches the plan. Runs automated checks and generates validation report.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'complete_validation',
    description: 'Mark validation as complete. Call this after generating the validation report with pass/fail status.',
    inputSchema: {
      type: 'object',
      properties: {
        passed: {
          type: 'boolean',
          description: 'True if validation passed all checks, false if issues were found',
        },
        summary: {
          type: 'string',
          description: 'Brief summary of validation results',
        },
      },
      required: ['passed'],
    },
  },
  {
    name: 'reset_workflow',
    description: 'Reset workflow state. Use when starting a completely new task.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: 'context-engine',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool list requests
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'workflow_status': {
        const state = stateManager.getState();
        const statusMessage = stateManager.getStatusMessage();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: statusMessage,
                currentPhase: state.currentPhase,
                hasResearch: stateManager.hasResearch(),
                hasPlan: stateManager.hasPlan(),
                planApproved: stateManager.isPlanApproved(),
                canImplement: stateManager.canImplement(),
                canValidate: stateManager.canValidate(),
                researchPath: state.researchPath,
                planPath: state.planPath,
                taskDescription: state.metadata.taskDescription,
              }, null, 2),
            },
          ],
        };
      }

      case 'research_codebase': {
        const { task_description, ticket_id } = args as {
          task_description: string;
          ticket_id?: string;
        };

        // Sync state with filesystem before checking phase
        stateManager.syncToFileSystem();

        // Check if already in research phase
        if (stateManager.getCurrentPhase() !== 'idle') {
          throw new Error(`Cannot start research while in ${stateManager.getCurrentPhase()} phase`);
        }

        // Ensure research directory exists
        const researchDir = join(process.cwd(), 'mcpDocs', 'research');
        ensureDirectoryExists(researchDir);

        // Generate filename for research doc
        const date = new Date().toISOString().split('T')[0];
        const ticketPart = ticket_id ? `-${ticket_id}` : '';
        const descSlug = task_description
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 50);
        const researchFilename = `${date}${ticketPart}-${descSlug}.md`;
        const researchPath = join(researchDir, researchFilename);

        // Start research phase with path
        stateManager.startResearch(task_description, ticket_id, researchPath);

        // Load and return research prompt
        const researchPrompt = loadPromptTemplate('research');

        return {
          content: [
            {
              type: 'text',
              text: `🔍 Starting research phase for: "${task_description}"

${researchPrompt}

**Your task**: Research the codebase to understand the current implementation related to this task.

**Output**: Create research document at: \`${researchPath}\`

After completing research, the document path will be saved and you can proceed to planning.`,
            },
          ],
        };
      }

      case 'create_plan': {
        // Sync state with filesystem before checking
        stateManager.syncToFileSystem();

        // Enforce: Must have research first
        if (!stateManager.hasResearch()) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ BLOCKED: Cannot create plan without research.

${stateManager.getStatusMessage()}

Please run 'research_codebase' first to understand the codebase before planning.`,
              },
            ],
          };
        }

        const { ticket_file } = args as { ticket_file?: string };

        // Load planning prompt
        const planPrompt = loadPromptTemplate('plan');

        // Ensure plans directory exists
        const plansDir = join(process.cwd(), 'mcpDocs', 'plans');
        ensureDirectoryExists(plansDir);

        // Generate filename for plan doc
        const state = stateManager.getState();
        const date = new Date().toISOString().split('T')[0];
        const ticketPart = state.taskId ? `-${state.taskId}` : '';
        const descSlug = (state.metadata.taskDescription || 'task')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 50);
        const planFilename = `${date}${ticketPart}-${descSlug}.md`;
        const planPath = join(plansDir, planFilename);

        // Start planning phase with path
        stateManager.startPlanning(planPath);

        return {
          content: [
            {
              type: 'text',
              text: `📋 Starting planning phase

Research completed at: \`${state.researchPath}\`

${planPrompt}

**Your task**: Create a detailed implementation plan based on the research findings.

${ticket_file ? `**Ticket file**: ${ticket_file}` : ''}

**Output**: Create plan document at: \`${planPath}\`

The plan must include:
- Phased implementation approach
- Specific file changes with code snippets
- Both automated AND manual success criteria
- What we're NOT doing (scope control)

After creating the plan, wait for human approval before proceeding.`,
            },
          ],
        };
      }

      case 'approve_plan': {
        // Sync state with filesystem before checking
        stateManager.syncToFileSystem();

        const { approved, feedback } = args as {
          approved: boolean;
          feedback?: string;
        };

        if (!stateManager.hasPlan()) {
          throw new Error('No plan exists to approve');
        }

        if (approved) {
          stateManager.approvePlan();
          return {
            content: [
              {
                type: 'text',
                text: `✅ Plan approved!

${feedback ? `Feedback: ${feedback}` : ''}

You can now proceed with implementation using 'implement_plan'.`,
              },
            ],
          };
        } else {
          stateManager.rejectPlan();
          return {
            content: [
              {
                type: 'text',
                text: `❌ Plan rejected.

Feedback: ${feedback || 'No feedback provided'}

Please revise the plan and resubmit for approval.`,
              },
            ],
          };
        }
      }

      case 'implement_plan': {
        // Sync state with filesystem before checking
        stateManager.syncToFileSystem();

        // Enforce: Must have approved plan
        if (!stateManager.canImplement()) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ BLOCKED: Cannot implement without approved plan.

${stateManager.getStatusMessage()}

Workflow required:
1. ✓ Research codebase
2. ✓ Create implementation plan
3. ✗ Get plan approved
4. Implementation (blocked)

Please get the plan approved first.`,
              },
            ],
          };
        }

        // Start implementation phase
        stateManager.startImplementation();
        
        const state = stateManager.getState();
        const implementPrompt = loadPromptTemplate('implement');

        return {
          content: [
            {
              type: 'text',
              text: `🚀 Implementation phase started

Plan: \`${state.planPath}\`
Research: \`${state.researchPath}\`

${implementPrompt}

**Your task**: Implement the approved plan phase by phase.

**Critical rules**:
- Keep context utilization under 40%
- Update the plan document as phases complete
- Reference the plan in all code changes
- Stop for human review between phases if manual validation is required

⚠️ **CRITICAL - MANDATORY COMPLETION STEP**:

When you have finished ALL implementation work, you MUST call the 'complete_implementation' tool.

This will AUTOMATICALLY:
- Mark your implementation as complete
- Transition you to the VALIDATION phase
- Provide validation instructions

You CANNOT skip validation - calling 'complete_implementation' forces you into validation phase.

**DO NOT say "implementation complete" without calling complete_implementation tool first.**`,
              },
            ],
        };
      }

      case 'complete_implementation': {
        // Sync state with filesystem before checking
        stateManager.syncToFileSystem();

        // Enforce: Must be in implementation phase
        if (stateManager.getCurrentPhase() !== 'implement') {
          throw new Error('Not in implementation phase. Call implement_plan first.');
        }

        // AUTOMATICALLY transition to validation phase
        stateManager.startValidation();

        const state = stateManager.getState();
        const validatePrompt = loadPromptTemplate('validate');

        return {
          content: [
            {
              type: 'text',
              text: `✅ Implementation marked as complete!

⚠️ **VALIDATION IS NOW REQUIRED** - You have been automatically transitioned to the VALIDATION phase.

You CANNOT exit this phase without completing validation. The workflow will remain in validation phase until you call 'complete_validation'.

Plan: \`${state.planPath}\`
Research: \`${state.researchPath}\`

${validatePrompt}

**Your mandatory tasks**:
1. Read the implementation plan completely
2. Verify each phase was implemented as specified
3. Run ALL automated verification commands from the plan
4. Check for deviations or issues
5. Generate a validation report with:
   - ✓/✗ status for each phase
   - Automated verification results
   - Code review findings
   - Overall PASS/FAIL status
6. Call 'complete_validation' tool with results

**Remember**: This is NOT optional. You must validate and call complete_validation to finish the workflow.`,
            },
          ],
        };
      }

      case 'validate_implementation': {
        // Sync state with filesystem before checking
        stateManager.syncToFileSystem();

        // Enforce: Must have started implementation
        if (!stateManager.canValidate()) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ BLOCKED: Cannot validate without implementation.

${stateManager.getStatusMessage()}

Complete the implementation first, then run validation.`,
              },
            ],
          };
        }

        // Start validation phase
        stateManager.startValidation();
        
        const state = stateManager.getState();
        const validatePrompt = loadPromptTemplate('validate');

        return {
          content: [
            {
              type: 'text',
              text: `✅ Validation phase started

Plan: \`${state.planPath}\`
Research: \`${state.researchPath}\`

${validatePrompt}

**Your task**: Validate that implementation matches the plan exactly.

**Checks to perform**:
1. Run all automated success criteria from plan
2. Compare git diff to planned changes
3. Identify any deviations
4. Generate validation report

After validation, report pass/fail status with detailed findings.`,
              },
            ],
        };
      }

      case 'complete_validation': {
        const { passed, summary } = args as {
          passed: boolean;
          summary?: string;
        };

        // Check if we're in validation phase
        if (stateManager.getCurrentPhase() !== 'validate') {
          throw new Error('No validation in progress. Start validation first with validate_implementation.');
        }

        // Mark validation as complete
        stateManager.completeValidation(passed);

        const status = passed ? 'PASSED ✅' : 'FAILED ❌';
        const emoji = passed ? '🎉' : '⚠️';

        return {
          content: [
            {
              type: 'text',
              text: `${emoji} Validation Complete: ${status}

${summary ? `**Summary**: ${summary}` : ''}

**Status**: Validation has been recorded in workflow state.
${passed ? '\n✅ Implementation meets plan requirements. Ready for deployment or next task!' : '\n❌ Issues found. Review validation report and address problems before proceeding.'}

You can now start a new task or run 'reset_workflow' to clear all state.`,
            },
          ],
        };
      }

      case 'reset_workflow': {
        stateManager.reset();
        return {
          content: [
            {
              type: 'text',
              text: '🔄 Workflow reset. Ready to start fresh with research → plan → validate.',
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Context Engine MCP Server running on stdio');
  console.error('Enforcing: Research → Plan → Validate workflow');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
