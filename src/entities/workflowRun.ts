export class WorkflowRun {
    static readonly STATUS_COMPLETED = 'completed';
    static readonly STATUS_IN_PROGRESS = 'in_progress';
    static readonly STATUS_QUEUED = 'queued';
    static readonly STATUS_CANCELLED = 'cancelled';

    constructor(
        readonly id: number,
        readonly name: string,
        readonly status: string,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    isCustomDateAfterCreatedAt(days: number): boolean {
        const customDate = new Date();
        customDate.setDate(customDate.getDate() - days);
        return customDate > this.createdAt;
    }

    isCompleted(): boolean {
        return this.status === WorkflowRun.STATUS_COMPLETED;
    }
}