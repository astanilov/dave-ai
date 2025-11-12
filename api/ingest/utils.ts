const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function tsToISO(ts: string | undefined) {
  if (!ts) return undefined;
  const ms = Math.floor(parseFloat(ts) * 1000);
  return new Date(ms).toISOString();
}

function truncate(str: string, n: number) {
  return (str || '').length > n ? str.slice(0, n - 1) + '…' : str || '';
}

function slackText(msg: any) {
  // Slack can include attachments/blocks; include basic text + fallback
  let t = msg.text || '';
  if (msg.attachments) {
    t +=
      '\n' +
      msg.attachments.map((a: any) => a.fallback || a.text || '').join('\n');
  }
  if (msg.blocks) {
    const bt = msg.blocks
      .map((b: any) =>
        b.elements
          ? b.elements
              .map((e: any) =>
                e.elements
                  ? e.elements.map((x: any) => x.text || '').join('')
                  : ''
              )
              .join('')
          : ''
      )
      .join('\n');
    if (bt.trim()) t += '\n' + bt;
  }
  return t;
}

function htmlToText(html: string) {
  // Lightweight HTML → text without extra deps; replace with a robust parser if needed
  return String(html)
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script>/gi, ' ')
    .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style>/gi, ' ')
    .replace(/<br\s*\/?/gi, '\n')
    .replace(/<\/(p|div|h\d|li|tr)>/gi, '\n')
    .replace(/<li>/gi, '- ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractTextFromADF(adfNode: any) {
  // Minimal ADF → text; extend as needed
  if (!adfNode) return '';
  if (adfNode.type === 'text') return adfNode.text || '';
  const children = adfNode.content || [];
  return children.map(extractTextFromADF).join('');
}

function personLite(p: Record<string, any> | undefined) {
  if (!p) return null;
  return {
    id: p.accountId || p.key || p.name || p.emailAddress || undefined,
    name: p.displayName || p.name || undefined,
    email: p.emailAddress || undefined,
  };
}

function cleanText(str = '') {
  return String(str)
    .replace(/\r\n|\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g,
      ' '
    ) // Remove emojis
    .trim();
}

function isMarkdown(p: string) {
  return /\.(md|mdx)$/i.test(p);
}

function isTestPath(p: string) {
  const s = p.toLowerCase();
  return (
    /\.(test|spec)\.[a-z0-9]+$/.test(s) ||
    s.includes('/__tests__/') ||
    s.includes('\\__tests__\\') ||
    s.includes('/e2e/') ||
    s.includes('\\e2e\\') ||
    s.includes('/integration/') ||
    s.includes('\\integration\\') ||
    s.includes('/cypress/') ||
    s.includes('\\cypress\\') ||
    s.includes('/playwright/') ||
    s.includes('\\playwright\\')
  );
}

function markdownToText(md: string) {
  return String(md)
    .replace(/^---[\s\S]*?---\n?/m, '') // frontmatter
    .replace(/```[\s\S]*?```/g, s => `\n\n[code block ${s.length} chars]\n\n`)
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\!\[[^\]]*\]\([^\)]*\)/g, '') // images
    .replace(/\[[^\]]*\]\(([^\)]*)\)/g, '$1') // links -> URL
    .replace(/^\s{0,3}#+\s+/gm, '') // headings
    .replace(/>\s?/g, '') // blockquotes
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function includesLike(file: string, pattern: string) {
  const p = pattern.replace('**/', '').replace('**', '').replace(/\*/g, '');
  return file.includes(p);
}

export {
  sleep,
  tsToISO,
  truncate,
  slackText,
  htmlToText,
  extractTextFromADF,
  personLite,
  cleanText,
  isMarkdown,
  isTestPath,
  markdownToText,
  includesLike,
};
