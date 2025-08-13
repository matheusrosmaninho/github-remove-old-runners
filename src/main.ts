import * as core from '@actions/core'
import { GithubService } from './services/github.js'
import { Paginate } from './helpers/paginate.js'
import type { Runs } from './entities/runs.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const apiToken: string = core.getInput('api_token')
    const repoOwner: string = core.getInput('repo_owner')
    const repoName: string = core.getInput('repo_name')
    const daysRetention: number = parseInt(core.getInput('days_retention'))
    let runs: Runs | null = null
    const githubService = new GithubService(apiToken, repoOwner, repoName);

    let currentPage = 1;
    let totalPages = 1;
    let deletedPages = 0;

    core.info(`Fetching workflow runs for ${repoOwner}/${repoName}...`);

    do {
      runs = await githubService.getWorkflowRuns(currentPage);

      if (currentPage === 1) {
        const pagination = new Paginate(runs.total, 1);
        totalPages = pagination.totalPages;
        core.info(`Total de páginas: ${totalPages}`);
      }

      core.info(`Página atual: ${currentPage} de ${totalPages}`);

      await Promise.all(
        runs.workflowRuns.map(async (run) => {
          if (run.isCustomDateAfterCreatedAt(daysRetention)) {
            await githubService.deleteWorkflowRun(run.id);
            core.info(`Workflow run ${run.id} deleted.`);
            deletedPages++;
          }
        })
      );

      currentPage++;
    } while (currentPage <= totalPages);

    core.info(`Processamento concluído. Total de páginas processadas: ${currentPage - 1}`);

    // Set outputs for other workflow steps to use
    core.setOutput('totalPages', totalPages)
    core.setOutput('deletedPages', deletedPages)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}