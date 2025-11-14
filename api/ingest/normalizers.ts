import { v5 as uuidv5 } from 'uuid';
import { type CodebaseOrigin, ReferenceOrigin } from '../types';
import { getCodebaseUrl } from '../utils';
import { chunkText } from './chunkers';
import cfg from './config';
import {
  cleanText,
  extractTextFromADF,
  htmlToText,
  isMarkdown,
  isTestPath,
  markdownToText,
  personLite,
  slackText,
  truncate,
  tsToISO,
} from './utils';

function fromJiraIssue(issue: Record<string, any>) {
  const key = issue.key;
  const f = issue.fields || {};
  const url = `${cfg.atlassianBaseUrl}/browse/${key}`;
  // Jira Cloud may deliver description in ADF (rich text). Try a basic plain-text extraction.
  let description = f.description ?? '';

  if (f.description && typeof f.description === 'object' && f.description?.type === 'doc') {
    try {
      description = extractTextFromADF(f.description);
    } catch {
      console.warn(`[Jira] Failed to extract description for issue "${key}", falling back to raw text.`);
    }
  }

  return {
    id: uuidv5(url, uuidv5.URL),
    source: ReferenceOrigin.JIRA,
    type: (f.issuetype && f.issuetype.name) || 'issue',
    title: f.summary || '',
    content_text: cleanText(description),
    url,
    created_at: f.created,
    updated_at: f.updated,
    author: personLite(f.reporter),
    metadata: {
      issue_key: issue.key,
      issue_type: f.issuetype && f.issuetype.name,
      status: f.status && f.status.name,
      assignee: personLite(f.assignee),
      labels: f.labels || [],
      project: f.project && f.project.key,
    },
  };
}

function fromConfluencePage(page: any) {
  const bodyHtml = (page.body && page.body.storage && page.body.storage.value) || '';
  const text = htmlToText(bodyHtml);
  const url = `${cfg.atlassianBaseUrl}/wiki${(page._links && page._links.webui) || ''}`;

  return {
    id: uuidv5(url, uuidv5.URL),
    source: ReferenceOrigin.CONFLUENCE,
    type: page.type || 'page',
    title: page.title || '',
    content_text: cleanText(text),
    url,
    created_at: page.history && page.history.createdDate,
    updated_at: page.version && page.version.when,
    author: page.history && personLite(page.history.createdBy),
    metadata: {
      page_id: page.id,
      space: page.space && page.space.key,
      ancestors: (page.ancestors || []).map((a: any) => a.id),
      labels: (
        (page.metadata &&
          page.metadata.labels &&
          page.metadata.labels.results) ||
        []
      ).map((l: any) => l.name),
      version: page.version && page.version.number,
    },
  };
}

function fromSlackMessage(channelId: string, msg: any) {
  const url = msg.permalink; // later we can hydrate permalinks

  return {
    id: uuidv5(url || `${channelId}-${msg.ts}`, uuidv5.URL),
    source: ReferenceOrigin.SLACK,
    type:
      msg.thread_ts && msg.thread_ts !== msg.ts
        ? 'reply'
        : msg.reply_count
          ? 'thread_root'
          : 'message',
    title:
      (msg.subtype ? `[${msg.subtype}] ` : '') +
      (msg.text ? truncate(msg.text, 80) : 'Slack message'),
    content_text: cleanText(slackText(msg)),
    url,
    created_at: tsToISO(msg.ts),
    updated_at: tsToISO(msg.ts),
    author: { id: msg.user, name: undefined, email: undefined },
    metadata: {
      channel: channelId,
      thread_ts: msg.thread_ts || null,
      parent_ts:
        msg.thread_ts && msg.thread_ts !== msg.ts ? msg.thread_ts : null,
      reactions: (msg.reactions || []).map((r: any) => ({
        name: r.name,
        count: r.count,
      })),
      files: (msg.files || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        mimetype: f.mimetype,
        url_private: f.url_private,
      })),
    },
  };
}

async function fromCodeFile({
  origin,
  repo,
  owner,
  path: relPath,
  branch,
  content,
}: {
  origin: CodebaseOrigin;
  repo: string;
  owner?: string;
  path: string;
  branch?: string;
  content: string;
}) {
  const url = getCodebaseUrl(origin, repo, owner || '', relPath, branch || 'main');
  const type = isMarkdown(relPath)
    ? 'markdown'
    : isTestPath(relPath)
      ? 'test'
      : 'code';
  const title = relPath.split(/[\\\/]/).slice(-1)[0];
  const text = isMarkdown(relPath) ? markdownToText(content) : content;

  const normalized = {
    id: uuidv5(url || [origin, owner || repo, relPath].filter(Boolean).join('/'), uuidv5.URL),
    source: ReferenceOrigin.CODEBASE,
    type,
    title,
    content_text: cleanText(text),
    url,
    created_at: undefined,
    updated_at: undefined,
    author: undefined,
    metadata: {
      repo: owner ? `${owner}/${repo}` : repo,
      path: relPath,
      branch: branch || undefined,
      origin,
      is_markdown: isMarkdown(relPath),
      is_test: isTestPath(relPath),
    },
  };

  const chunks = await chunkText(normalized.content_text);

  return chunks.map((text, idx) => ({
    id: `${normalized.source}:${normalized.id}#${idx + 1}`,
    text,
    metadata: {
      source: normalized.source,
      type: normalized.type,
      title: normalized.title,
      url: normalized.url,
      created_at: normalized.created_at,
      updated_at: normalized.updated_at,
      author: normalized.author,
      parent_id: `${normalized.source}:${normalized.id}`,
      domain: normalized.metadata,
    },
  }));
}

export { fromJiraIssue, fromConfluencePage, fromSlackMessage, fromCodeFile };
