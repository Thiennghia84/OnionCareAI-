import { AppData, AppSettings, HistoryItem } from '../types';

const STORAGE_KEY = 'skill_edu_data';

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'vi',
  apiKey: '',
  selectedModel: 'gemini-3-flash-preview',
  moistureThreshold: 40,
};

const defaultData: AppData = {
  items: [],
  history: [
    {
      id: 'welcome-1',
      action: 'learning',
      data: { status: 'started', time: 'Môn: Tiếng Anh' },
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: 'welcome-2',
      action: 'diagnosis',
      data: { result: 'Bài viết của bạn rất tốt, cần chú ý hơn về cấu trúc ngữ pháp ở đoạn 2.', type: 'ai-consulting' },
      timestamp: Date.now() - 1000 * 60 * 60 * 48,
    }
  ],
  settings: defaultSettings,
};

export const storage = {
  get: (): AppData => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...defaultData,
          ...parsed,
          settings: { ...defaultSettings, ...(parsed.settings || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to parse storage data', e);
    }
    return defaultData;
  },

  set: (data: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  updateSettings: (settings: Partial<AppSettings>) => {
    const data = storage.get();
    data.settings = { ...data.settings, ...settings };
    storage.set(data);
  },

  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const data = storage.get();
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    data.history = [newItem, ...data.history];
    storage.set(data);
    return newItem;
  },
  
  clearHistory: () => {
    const data = storage.get();
    data.history = [];
    storage.set(data);
  }
};
