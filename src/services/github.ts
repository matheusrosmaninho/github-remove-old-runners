import { Octokit, RequestError } from "octokit";
import { Runs } from "../entities/runs.js";
import { WorkflowRun } from "../entities/workflowRun.js";
import { Paginate } from "../helpers/paginate.js";

export class GithubService {
    static readonly API_BASE_URL = 'https://api.github.com';
    private readonly octokit: Octokit;

    constructor(
        private readonly token: string,
        private readonly owner: string,
        private readonly repo: string,
    ) {
        this.octokit = new Octokit({
            baseUrl: GithubService.API_BASE_URL,
            auth: token,
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
            }
        })
    }

    async getWorkflowRuns(page: number = 1): Promise<Runs> {
        try {
            const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs?page={page}&per_page={itemsPerPage}', {
                owner: this.owner,
                repo: this.repo,
                page: page,
                itemsPerPage: Paginate.ITEMS_PER_PAGE
            })

            if (response.status < 200 || response.status >= 300) {
                throw new Error(`Status: ${response.status}. Mensagem: ${response}`)
            }

            const data = await response.data

        if (!data) {
            throw new Error('No data received from GitHub API');
        }

        if (!data.workflow_runs || !Array.isArray(data.workflow_runs)) {
            throw new Error('Invalid workflow runs data format');
        }

        if (typeof data.total_count !== 'number') {
            throw new Error('Invalid total count in workflow runs data');
        }

        const workflowRuns = data.workflow_runs.map((run: any) => new WorkflowRun(
            run.id,
            run.name,
            run.status,
            new Date(run.created_at),
            new Date(run.updated_at),
        ));

        return new Runs(data.total_count, workflowRuns);

        } catch(error: unknown) {
            if (error instanceof RequestError) throw new Error(`Erro da api: ${error.message}`)
            throw new Error(`Erro desconhecido: ${error}`)
        }
    }

    async deleteWorkflowRun(runId: number): Promise<void> {
        try {
            const response = await this.octokit.request('DELETE /repos/{owner}/{repo}/actions/runs/{run_id}', {
                owner: this.owner,
                repo: this.repo,
                run_id: runId
            });

            if (response.status < 200 || response.status >= 300) {
                throw new Error(`Status: ${response.status}. Mensagem: ${response}`);
            }
        } catch (error: unknown) {
            if (error instanceof RequestError) throw new Error(`Erro da api: ${error.message}`)
            throw new Error(`Erro desconhecido: ${error}`)
        }
    }
}