import atlassian from "../clients/atlassian";

async function fetchConfluenceContent({ spaceKey, limit = 100 }: { spaceKey?: string; limit?: number; }) {
    console.log('fetchConfluenceContent called with:', { spaceKey, limit });
  if (!spaceKey) return [];
  const results = [];
  let start = 0;
  while (true) {
    const { data } = await atlassian.get('/wiki/rest/api/content', {
      params: {
        spaceKey,
        expand: 'body.storage,history,version,metadata.labels,space,ancestors',
        limit: Math.min(limit, 100),
        start,
        type: 'page', // change to 'blogpost' to include blogs; or remove to fetch both separately
      },
    });
    for (const page of data.results || []) results.push(page);
    start = data._links && data._links.next ? start + data.limit : null;
    if (start == null) break;
  }
  return results;
}

export default fetchConfluenceContent;