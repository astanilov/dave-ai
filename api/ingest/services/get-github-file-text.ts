import github from '../clients/github';

async function readGithubFileText(
  owner: string,
  repo: string,
  filePath: string,
  ref: string
) {
  const { data } = await github.get(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`,
    { params: { ref } }
  );
  if (data && data.content && data.encoding === 'base64')
    return Buffer.from(data.content, 'base64').toString('utf8');
  return '';
}

export default readGithubFileText;
