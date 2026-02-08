
export enum AIModelType {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview'
}

export interface User {
  name: string;
  email: string;
}

export interface AIPersona {
  id: string;
  name: string;
  role: string;
  character: string; // e.g. 'Friendly', 'Strict', 'Academic'
  description: string;
  knowledgeBase: string[];
  brainType: 'standard' | 'high-performance';
  createdAt: number;
  apiKey: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CreationStep {
  id: number;
  title: string;
}
