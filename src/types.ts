export type ViewState = 'dashboard' | 'diagnosis' | 'history' | 'settings';

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  apiKey: string;
  selectedModel: string;
  moistureThreshold: number;
}

export interface HistoryItem {
  id: string;
  action: 'diagnosis' | 'irrigation' | 'learning';
  data: any;
  timestamp: number;
}

export interface AppData {
  items: any[];
  history: HistoryItem[];
  settings: AppSettings;
}

export interface SensorData {
  moisture: number;
  temperature: number;
  humidity: number;
  lastUpdated: number;
  isIrrigating: boolean;
}
