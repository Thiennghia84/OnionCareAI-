import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle, ShieldCheck } from 'lucide-react';
import { storage } from '../lib/storage';

interface ApiKeyModalProps {
  onSuccess: () => void;
}

export function ApiKeyModal({ onSuccess }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Vui lòng nhập API Key để tiếp tục');
      return;
    }
    if (!apiKey.startsWith('AIza')) {
       setError('API Key không hợp lệ (thường bắt đầu bằng AIza)');
       return;
    }

    const current = storage.get();
    storage.updateSettings({ ...current.settings, apiKey: apiKey.trim() });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-primary-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-sm">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Chào mừng bạn!</h2>
            <p className="text-primary-100 text-sm">Vui lòng cung cấp API Key để kích hoạt các tính năng AI của Skill Education.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-700 text-xs leading-relaxed">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <p>API Key của bạn được lưu trữ an toàn tại <b>LocalStorage</b> trên trình duyệt cá nhân, không bao giờ được gửi về máy chủ của chúng tôi.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Google Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder="Nhập AIza..."
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-xs font-medium animate-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all active:scale-[0.98]"
          >
            Bắt đầu sử dụng
          </button>

          <div className="text-center pt-2">
            <a 
              href="https://aistudio.google.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors"
            >
              Lấy API Key miễn phí tại đây
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
