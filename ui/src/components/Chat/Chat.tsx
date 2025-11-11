import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { Message, MessageData, MessageSender } from '../../types';
import ChatArea from './components/ChatArea/ChatArea';
import ChatBox, { ChatBoxApi } from './components/ChatBox/ChatBox';
import ErrorModal from '../ErrorModal/ErrorModal';

import './Chat.scss';

const Chat = () => {
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<MessageData>>([]);
  const chatBoxRef = useRef<ChatBoxApi | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get<{ messages: Array<Message> }>('/messages')
      .then(({ messages }) => {
        setMessages(messages);
        focusChatBox();
      })
      .catch((ex) => {
        console.error('Error loading messages:', ex);
        setError(ex.message ?? ex);
      })
      .finally(() =>{
        setLoading(false);
      });
  }, []);

  const focusChatBox = () => {
    chatBoxRef.current?.focus();
  };

  const createMessage = (content: string, sender: MessageSender): MessageData => {
    return { content, sender, timestamp: Date.now() };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    const message = input.trim();

    e?.preventDefault();

    if (!message) {
      return;
    }

    try {
      setLoading(true);

      // Append the user message immediately, for better UX.
      setMessages((prev) => [...prev, createMessage(message, MessageSender.USER)]);
      setInput('');
      focusChatBox();

      const { response } = await api.post<{ response: string }>('/messages', { message });

      setMessages((prev) => [...prev, createMessage(response, MessageSender.AI)]);
    } catch (ex: Error | any) {
      console.error('Error submitting message:', ex);
      setError(ex.message ?? ex);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setError('');
  };

  return (
    <div className="chatWrapper">
      <ChatArea loading={loading} messages={messages} />

      <ChatBox
        loading={loading}
        placeholder="Ask anything (Ctrl+Enter to submit)"
        ref={chatBoxRef}
        value={input}
        onInput={setInput}
        onSubmit={handleSubmit}
      />

      <ErrorModal error={error} onClose={handleModalClose} />
    </div>
  );
};

export default Chat;
