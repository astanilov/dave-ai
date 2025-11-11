import { useState, useRef, useEffect } from 'react';
import { type MessageData } from '../../../../types';
import ChatMessage from '../ChatMessage/ChatMessage';

import './ChatArea.scss';

interface ChatAreaProps {
  loading: boolean;
  messages: Array<MessageData>;
}

const ChatArea = ({ loading, messages }: ChatAreaProps) => {
  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>('auto');
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({ behavior: scrollBehavior });
    });

    // Use auto scroll initially, to jump to the end of the conversation,
    // and smooth scrolling later, when displaying new messages.
    if (scrollBehavior === 'auto') {
      setScrollBehavior('smooth');
    }
  }, [loading, messages]);

  return (
    <div className="chatArea">
      <div className="messageList">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {loading && (
          <div className="loadingIndicator">
            {messages.length ? 'AI is thinking...' : 'Loading, please wait...'}
          </div>
        )}
        <div ref={scrollAnchorRef} className="scrollAnchor">&nbsp;</div>
      </div>
    </div>
  );
};

export default ChatArea;
