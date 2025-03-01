export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface SearchResult {
  platform: string;
  title: string;
  content: string;
  relevance: number;
}

export interface DocumentSection {
  platform: string;
  title: string;
  content: string;
}