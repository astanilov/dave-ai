import { MessageSender } from './MessageSender';
import { Reference } from './Reference';

export interface MessageData {
  content: string;
  references?: Array<Reference>;
  sender: MessageSender;
  timestamp: number;
}
