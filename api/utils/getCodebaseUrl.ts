import { CodebaseOrigin } from '../types';

/**
 * Generate a file URL for Github, Gitlab, or Bitbucket origins.
 * @param origin - Repository origin ('github' | 'gitlab' | 'bitbucket').
 * @param name - Repository name.
 * @param owner - Repository owner.
 * @param path - File path within the repository.
 * @param branch - Branch name (optional).
 */
export function getCodebaseUrl(
  origin: CodebaseOrigin,
  name: string,
  owner: string,
  path: string,
  branch: string = 'main',
): string {
  if (!owner || !name || !path) {
    throw new Error('Missing parameters: owner, name, and path are required to generate codebase URL.');
  }

  switch (origin) {
    case CodebaseOrigin.GITHUB:
      return `https://github.com/${owner}/${name}/blob/${branch}/${path}`;

    case CodebaseOrigin.GITLAB:
      return `https://gitlab.com/${owner}/${name}/-/blob/${branch}/${path}`;

    case CodebaseOrigin.BITBUCKET:
      return `https://bitbucket.org/${owner}/${name}/src/${branch}/${path}`;

    default:
      throw new Error(`Unsupported codebase origin: "${origin}".`);
  }
}
