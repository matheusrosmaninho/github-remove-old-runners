import type { WorkflowRun } from "./workflowRun.js";

export class Runs {
    constructor(
        readonly total: number,
        readonly workflowRuns: WorkflowRun[],
    ) {}
}