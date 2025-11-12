import github from "../clients/github";
import { includesLike } from "../utils";

async function fetchGithubRepoFiles(repoFull: string, branch: string) {
    const [owner, repo] = repoFull.split('/');
    const { data: treeResp } = await github.get(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}`, { params: { recursive: 1 } });
    const files = (treeResp.tree || [])
        .filter((n: any) => n.type === 'blob')
        .filter((n: any) => CODE_GLOBS.some(glob => includesLike(n.path, glob)) && !CODE_IGNORE.some(ig => includesLike(n.path, ig)));
    return files.map((f: any) => ({ owner, repo, path: f.path, sha: f.sha, branch }));
}

export default fetchGithubRepoFiles;