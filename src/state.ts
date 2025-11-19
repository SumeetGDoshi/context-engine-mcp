import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export type WorkflowPhase = 'idle' | 'research' | 'plan' | 'implement' | 'validate';

export interface WorkflowState {
  currentPhase: WorkflowPhase;
  taskId?: string;
  researchPath?: string;
  planPath?: string;
  planApproved: boolean;
  implementationStarted: boolean;
  validationComplete: boolean;
  metadata: {
    createdAt: string;
    updatedAt: string;
    taskDescription?: string;
  };
}

export class StateManager {
  private stateDir: string;
  private statePath: string;
  private state: WorkflowState;
  private projectRoot: string;

  constructor(projectRoot?: string) {
    // Store project root for path discovery
    this.projectRoot = projectRoot || process.cwd();

    // Use project-specific state or fallback to global
    this.stateDir = projectRoot
      ? join(projectRoot, '.context-engine')
      : join(homedir(), '.context-engine');
    
    this.statePath = join(this.stateDir, 'workflow-state.json');
    
    // Ensure state directory exists
    if (!existsSync(this.stateDir)) {
      mkdirSync(this.stateDir, { recursive: true });
    }
    
    // Load existing state or create new
    this.state = this.loadState();
  }

  private loadState(): WorkflowState {
    if (existsSync(this.statePath)) {
      try {
        const data = readFileSync(this.statePath, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        console.error('Failed to load state, creating fresh:', error);
      }
    }
    
    return this.createFreshState();
  }

  private createFreshState(): WorkflowState {
    return {
      currentPhase: 'idle',
      planApproved: false,
      implementationStarted: false,
      validationComplete: false,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  private saveState(): void {
    this.state.metadata.updatedAt = new Date().toISOString();
    writeFileSync(this.statePath, JSON.stringify(this.state, null, 2));
  }

  // Getters
  getCurrentPhase(): WorkflowPhase {
    return this.state.currentPhase;
  }

  getState(): WorkflowState {
    return { ...this.state };
  }

  hasResearch(): boolean {
    // If we have a path, check if file exists
    if (this.state.researchPath && existsSync(this.state.researchPath)) {
      return true;
    }

    // Auto-discover research files when path is missing
    if (this.state.currentPhase === 'research' && this.state.metadata.taskDescription) {
      const researchDir = join(this.projectRoot, 'mcpDocs', 'research');

      if (!existsSync(researchDir)) {
        return false;
      }

      try {
        // Look for today's research files
        const files = readdirSync(researchDir);
        const today = new Date().toISOString().split('T')[0];
        const matchingFiles = files.filter(f =>
          f.startsWith(today) && f.endsWith('.md')
        );

        if (matchingFiles.length > 0) {
          // Auto-set the research path to the most recent file
          const discoveredPath = join(researchDir, matchingFiles[matchingFiles.length - 1]);
          this.state.researchPath = discoveredPath;
          this.saveState();
          return true;
        }
      } catch (error) {
        // If discovery fails, return false
        return false;
      }
    }

    return false;
  }

  hasPlan(): boolean {
    // If we have a path, check if file exists
    if (this.state.planPath && existsSync(this.state.planPath)) {
      return true;
    }

    // Auto-discover plan files when path is missing
    if (this.state.currentPhase === 'plan' && this.state.metadata.taskDescription) {
      const plansDir = join(this.projectRoot, 'mcpDocs', 'plans');

      if (!existsSync(plansDir)) {
        return false;
      }

      try {
        // Look for today's plan files
        const files = readdirSync(plansDir);
        const today = new Date().toISOString().split('T')[0];
        const matchingFiles = files.filter(f =>
          f.startsWith(today) && f.endsWith('.md')
        );

        if (matchingFiles.length > 0) {
          // Auto-set the plan path to the most recent file
          const discoveredPath = join(plansDir, matchingFiles[matchingFiles.length - 1]);
          this.state.planPath = discoveredPath;
          this.saveState();
          return true;
        }
      } catch (error) {
        // If discovery fails, return false
        return false;
      }
    }

    return false;
  }

  isPlanApproved(): boolean {
    return this.state.planApproved;
  }

  canImplement(): boolean {
    return this.hasResearch() && this.hasPlan() && this.isPlanApproved();
  }

  canValidate(): boolean {
    return this.state.implementationStarted;
  }

  // Setters
  startResearch(taskDescription: string, taskId?: string, researchPath?: string): void {
    this.state.currentPhase = 'research';
    this.state.taskId = taskId;
    this.state.researchPath = researchPath;
    this.state.metadata.taskDescription = taskDescription;
    this.saveState();
  }

  completeResearch(researchPath: string): void {
    this.state.researchPath = researchPath;
    this.state.currentPhase = 'idle';
    this.saveState();
  }

  startPlanning(planPath?: string): void {
    if (!this.hasResearch()) {
      throw new Error('Cannot start planning without research');
    }
    this.state.currentPhase = 'plan';
    this.state.planPath = planPath;
    this.saveState();
  }

  completePlanning(planPath: string): void {
    this.state.planPath = planPath;
    this.state.currentPhase = 'idle';
    this.saveState();
  }

  approvePlan(): void {
    if (!this.hasPlan()) {
      throw new Error('Cannot approve plan that does not exist');
    }
    this.state.planApproved = true;
    this.saveState();
  }

  rejectPlan(): void {
    this.state.planApproved = false;
    this.saveState();
  }

  startImplementation(): void {
    if (!this.canImplement()) {
      throw new Error('Cannot start implementation without approved plan');
    }
    this.state.currentPhase = 'implement';
    this.state.implementationStarted = true;
    this.saveState();
  }

  completeImplementation(): void {
    this.state.currentPhase = 'idle';
    this.saveState();
  }

  startValidation(): void {
    if (!this.canValidate()) {
      throw new Error('Cannot validate without implementation');
    }
    this.state.currentPhase = 'validate';
    this.saveState();
  }

  completeValidation(passed: boolean): void {
    this.state.validationComplete = passed;
    this.state.currentPhase = 'idle';
    this.saveState();
  }

  reset(): void {
    this.state = this.createFreshState();
    this.saveState();
  }

  // Synchronize state with filesystem
  // Auto-completes phases if their output files exist
  syncToFileSystem(): void {
    // Auto-complete research if file exists but state is still "research"
    if (this.state.currentPhase === 'research' && this.hasResearch()) {
      this.state.currentPhase = 'idle';
      this.saveState();
    }

    // Auto-complete planning if file exists but state is still "plan"
    if (this.state.currentPhase === 'plan' && this.hasPlan()) {
      this.state.currentPhase = 'idle';
      this.saveState();
    }
  }

  // Get helpful status message
  getStatusMessage(): string {
    const { currentPhase, planApproved, implementationStarted } = this.state;

    if (currentPhase === 'implement') {
      return `⚠️ Currently in IMPLEMENTATION phase. After completing all changes, you MUST call validate_implementation tool.`;
    }

    if (currentPhase === 'validate') {
      return `⚠️ Currently in VALIDATION phase. After generating validation report, you MUST call complete_validation tool.`;
    }

    if (currentPhase !== 'idle') {
      return `Currently in ${currentPhase} phase`;
    }
    
    if (!this.hasResearch()) {
      return '⚠️  No research found. Start with /research to analyze the codebase.';
    }
    
    if (!this.hasPlan()) {
      return '⚠️  Research complete, but no plan exists. Run /plan to create implementation spec.';
    }
    
    if (!planApproved) {
      return '⚠️  Plan exists but not approved. Review and approve before implementing.';
    }
    
    if (!implementationStarted) {
      return '✅ Ready to implement! Plan approved and waiting for execution.';
    }
    
    return '✅ Implementation complete. Run /validate to verify against plan.';
  }
}
