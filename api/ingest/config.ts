const cfg = {
  atlassianBaseUrl: process.env.ATLASSIAN_BASE_URL,
  atlassianEmail: process.env.ATLASSIAN_EMAIL,
  atlassianApiToken: process.env.ATLASSIAN_API_TOKEN,

  jiraProjectKey: process.env.JIRA_PROJECT_KEY,
  jiraMaxIssues: Number(process.env.JIRA_MAX_ISSUES) || 500,
  jiraJql: process.env.JIRA_JQL,

  confluenceSpaceKey: process.env.CONFLUENCE_SPACE_KEY,

  githubToken: process.env.GITHUB_TOKEN,
  githubReposWithBranch: [
    { repo: 'https://github.com/QuickBase/qb-serverless', branch: 'main' },
    { repo: 'https://github.com/QuickBase/huey', branch: 'master' },
    // { repo: 'https://github.com/QuickBase/QuickBase', branch: 'develop' },
  ],

  slackToken: process.env.SLACK_BOT_TOKEN,
  slackChannelId: process.env.SLACK_CHANNEL_ID,
  // Tweak chunking for your RAG pipeline
  chunkSize: 1200, // characters per chunk
  chunkOverlap: 150,
};

export default cfg;