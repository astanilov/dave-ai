import atlassian from "../clients/atlassian";

async function fetchJiraIssues({ jql, projectKey, max = 100 }: { jql?: string; projectKey?: string; max?: number; }) {
  const issues: any[] = [];
  let startAt = 0;
  let nextPageToken: string | null = null;
  const query = jql || (projectKey ? `project=${projectKey} ORDER BY updated DESC` : '');

  console.log('fetchJiraIssues called with:', { query, projectKey, max });

  if (!query) return issues;

  while (true) {
    const { data }: any = await atlassian.get('/rest/api/3/search/jql', {
      params: {
        jql: query,
        maxResults: Math.min(max, 100),
        nextPageToken,
        startAt,
        fields: [
          'summary','description','status','labels','created','updated','assignee','reporter','issuetype','project'
        ].join(','),
      },
    });

    for (const issue of data.issues || []) issues.push(issue);
    startAt += data.issues.length;
    nextPageToken = data.nextPageToken || null;
    if (startAt >= max || !!data.isLast) break;
  }
  console.log(`Fetched ${issues.length} Jira issues`);
  return issues;
}

export default fetchJiraIssues;