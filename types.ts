export interface MedicineResult {
  name: string;
  location?: string;
  category?: string;
  source: 'DATABASE' | 'AI_CLASSIFICATION';
  found: boolean;
  timestamp: string;
}

export interface TelegramConfig {
  chatId: string;
  botToken: string;
}

export enum SearchStatus {
  IDLE,
  SEARCHING,
  CLASSIFYING,
  SUCCESS,
  ERROR
}