import axios from "axios";
import cfg from "../config";

  if (!cfg.githubToken) {
    console.warn('[WARN] Missing GitHub token — GitHub calls will fail.');
  };

  const github = axios.create({ baseURL: 'https://api.github.com', timeout: 30000 });

  github.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${cfg.githubToken}`;
    config.headers['X-GitHub-Api-Version'] = '2022-11-28';
    return config;
  });

  github.interceptors.response.use(undefined, async (error) => {
    const { response, config } = error || {};
    if (response && response.status === 403 && response.headers['x-ratelimit-remaining'] === '0') {
      const reset = Number(response.headers['x-ratelimit-reset'] || 0) * 1000;
      const wait = Math.max(0, reset - Date.now());
      console.log(`[GitHub] Rate limit hit. Waiting ${Math.ceil(wait/1000)}s...`);
      await new Promise(r => setTimeout(r, wait));
      return github(config);
    }
    throw error;
  });

  export default github;