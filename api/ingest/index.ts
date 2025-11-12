import { AxiosError } from 'axios';
import { toRagChunks } from './chunkers';
import cfg from './config';
import {
  fromCodeFile,
  fromConfluencePage,
  fromJiraIssue /*, fromSlackMessage */,
} from './normalizers';
import fetchJiraIssues from './services/get-jira-issues';
import fetchConfluenceContent from './services/get-confluence-pages';
//import fetchSlackDiscussions from "./services/get-slack-discussions";
//import slack from "./clients/slack";
import { outFile } from './setup';
import fs from 'fs';
import pLimit from 'p-limit';
import fetchGithubRepoFiles from './services/get-github-files';
import readGithubFileText from './services/get-github-file-text';
//import path from "path";
//import pLimit from "p-limit";

// --- Main Orchestration -----------------------------------------------------
async function main() {
  console.log('🔍 Starting data ingestion from external sources...');
  const rows = [];

  // Jira
  try {
    const jiraIssues = await fetchJiraIssues({
      jql: cfg.jiraJql,
      projectKey: cfg.jiraProjectKey,
      max: cfg.jiraMaxIssues,
    });
    const jiraNorm = jiraIssues.map(fromJiraIssue);
    rows.push(...(await Promise.all(jiraNorm.flatMap(toRagChunks))));
    console.log(
      `[Jira] fetched ${jiraIssues.length} issues → ${rows.length} total chunks so far`
    );
  } catch (err: AxiosError | any) {
    console.error('[Jira] Error:', err.response?.data || err.message);
  }

  // Confluence
  try {
    const pages = await fetchConfluenceContent({
      spaceKey: cfg.confluenceSpaceKey,
    });
    const confNorm = pages.map(fromConfluencePage);
    rows.push(...(await Promise.all(confNorm.flatMap(toRagChunks))));
    console.log(
      `[Confluence] fetched ${pages.length} pages → ${rows.length} total chunks so far`
    );
  } catch (err: AxiosError | any) {
    console.error('[Confluence] Error:', err.response?.data || err.message);
  }

  // GitHub
  //   let repoFull = '';
  //   try {
  //     const limit = pLimit(4);
  //     for (const repoWithBranch of cfg.githubReposWithBranch) {
  //         repoFull = repoWithBranch.repo.trim();
  //         const files = await fetchGithubRepoFiles(repoFull, repoWithBranch.branch);
  //         await Promise.all(files.map((f: any) => limit(async () => {
  //           const content = await readGithubFileText(f.owner, f.repo, f.path, f.branch);
  //           rows.push(...fromCodeFile({ origin: 'github', owner: f.owner, repo: f.repo, path: f.path, branch: f.branch, content }));
  //         })));
  //         console.log(`[Repo:github] ${repoFull} → ${files.length} files → ${rows.length} chunks so far`);
  //     }
  //   } catch (e: AxiosError | any) {
  //         console.error(`[Repo:github] ${repoFull} error:`, e.response?.data || e.message);
  //   }

  // Slack
  //   try {
  //     const channelData = await fetchSlackDiscussions({ channelId: cfg.slackChannelId });
  //     const { channelId, rootMessages, repliesByThread } = channelData;

  //     // Hydrate permalinks in batches (optional but nice)
  //     const limit = pLimit(6);
  //     await Promise.all(rootMessages.map(m => limit(async () => {
  //       try {
  //         const link = await slack.chat.getPermalink({ channel: channelId, message_ts: m.ts });
  //         m.permalink = link.permalink;
  //       } catch (_) {}
  //     })));

  //     // Flatten messages + replies
  //     const allMsgs = [];
  //     for (const m of rootMessages) {
  //       allMsgs.push(m);
  //       const replies = repliesByThread.get(m.thread_ts) || [];
  //       for (const r of replies) {
  //         // Skip duplicate inclusion of the root message which Slack includes in replies
  //         if (r.ts !== m.ts) allMsgs.push(r);
  //       }
  //     }

  //     const slackNorm = allMsgs.map(m => fromSlackMessage(channelId, m));
  //     rows.push(...(await Promise.all(slackNorm.flatMap(toRagChunks))));
  //     console.log(`[Slack] fetched ${allMsgs.length} messages → ${rows.length} total chunks so far`);
  //   } catch (err: any) {
  //     console.error('[Slack] Error:', err.data || err.message);
  //   }

  // Write JSONL
  const stream = fs.createWriteStream(outFile, { flags: 'w' });
  for (const r of rows) stream.write(JSON.stringify(r) + '\n');
  stream.end();

  console.log(`\n✅ Wrote ${rows.length} chunks to ${outFile}`);
}

export default main;
