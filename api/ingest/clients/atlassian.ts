import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import cfg from "../config";
import { sleep } from "../utils";

if (!cfg.atlassianBaseUrl || !cfg.atlassianEmail || !cfg.atlassianApiToken) {
  console.warn('[WARN] Missing Atlassian credentials — Jira/Confluence calls will fail.');
}
if (!cfg.slackToken) {
  console.warn('[WARN] Missing Slack token — Slack calls will fail.');
}

// Axios client with simple 429 retry for Atlassian APIs
const atlassian = axios.create({ baseURL: cfg.atlassianBaseUrl, timeout: 30000 });

atlassian.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
  config.auth = { username: cfg.atlassianEmail as string, password: cfg.atlassianApiToken as string };
  return config;
});

atlassian.interceptors.response.use(undefined, async (error: AxiosError) => {
  const { response, config } = error || {};
  if (response && response.status === 429) {
    const retryAfter = Number(response.headers['retry-after'] || 3);
    console.log(`[Atlassian] 429 received. Retrying in ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return atlassian(config as InternalAxiosRequestConfig<any>);
  }
  throw error;
});

export default atlassian;