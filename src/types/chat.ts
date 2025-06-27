export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  currentStreamingId?: string;
}