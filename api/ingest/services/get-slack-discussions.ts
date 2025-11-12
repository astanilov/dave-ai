import pLimit from 'p-limit';
import slack from '../clients/slack';

async function fetchSlackDiscussions({
  channelId,
  oldestTs = undefined,
  latestTs = undefined,
}: {
  channelId?: string;
  oldestTs?: string;
  latestTs?: string;
}) {
  if (!channelId) return [];
  const messages = [];
  let cursor;
  do {
    const resp = await slack.conversations.history({
      channel: channelId,
      limit: 1000,
      cursor,
      oldest: oldestTs,
      latest: latestTs,
      inclusive: false,
    });
    for (const msg of resp.messages || []) messages.push(msg);
    cursor = resp.response_metadata && resp.response_metadata.next_cursor;
  } while (cursor);

  // Pull threaded replies
  const limit = pLimit(6);
  const threaded = await Promise.all(
    messages
      .filter(m => m.thread_ts && m.reply_count && m.reply_count > 0)
      .map(m =>
        limit(async () => {
          const replies = [];
          let cur;
          do {
            const r = await slack.conversations.replies({
              channel: channelId,
              ts: m.thread_ts as string,
              limit: 1000,
              cursor: cur,
            });
            for (const msg of r.messages || []) replies.push(msg);
            cur = r.response_metadata && r.response_metadata.next_cursor;
          } while (cur);
          return { thread_ts: m.thread_ts, messages: replies };
        })
      )
  );

  const repliesByThread = new Map(threaded.map(t => [t.thread_ts, t.messages]));
  return { channelId, rootMessages: messages, repliesByThread };
}

export default fetchSlackDiscussions;
