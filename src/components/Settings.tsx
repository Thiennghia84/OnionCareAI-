import React, { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { AppSettings } from '../types';
import { Save, Key, LayoutGrid, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { MODELS as AI_MODELS } from '../lib/ai';
import { cn } from '../lib/utils';

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'vi',
    apiKey: '',
    selectedModel: 'gemini-3-flash-preview',
    moistureThreshold: 40,
  });

  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setSettings(storage.get().settings);
  }, []);

  const handleSave = () => {
    storage.updateSettings(settings);
    Swal.fire({
      title: 'Đã cập nhật',
      text: 'Cấu hình hệ thống đã được lưu thành công',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cấu hình hệ thống</h1>
        <p className="text-slate-500 mt-2">Quản lý API Key và tùy chỉnh các mô hình ngôn ngữ AI của Skill Education.</p>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* API Key Section */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Key className="w-6 h-6 text-amber-500" />
            </div>
            Xác thực Google Gemini
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">API Key cá nhân</label>
              <div className="relative group">
                <input
                  type={showKey ? "text" : "password"}
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="Nhập Google Gemini API Key (AIza...)"
                  className="w-full pl-5 pr-20 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all group-hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-slate-500 hover:text-slate-900 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
                >
                  {showKey ? 'Ẩn key' : 'Hiện key'}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Dữ liệu được lưu trữ trực tiếp trên thiết bị của bạn.
              </p>
            </div>
          </div>
        </section>

        {/* Model Selection Section */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-50 rounded-xl">
              <LayoutGrid className="w-6 h-6 text-primary-500" />
            </div>
            Chọn mô hình thông minh
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSettings({ ...settings, selectedModel: model.id })}
                className={cn(
                  "relative p-5 rounded-2xl text-left border-2 transition-all duration-300 transform active:scale-[0.98]",
                  settings.selectedModel === model.id
                    ? "border-primary-600 bg-primary-50/50 shadow-md ring-4 ring-primary-100"
                    : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {settings.selectedModel === model.id && (
                  <div className="absolute top-3 right-3 bg-primary-600 text-white rounded-full p-1 border-2 border-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
                <div className="font-bold text-slate-900 text-sm mb-1">{model.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{model.id}</div>
                
                <div className="mt-4 flex items-center gap-1.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    model.id.includes('pro') ? "bg-purple-500" : "bg-emerald-500"
                  )} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {model.id.includes('pro') ? 'Công suất cao' : 'Tốc độ cao'}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-400 leading-relaxed italic">
            * Hệ thống sẽ tự động thử các mô hình tiếp theo nếu phiên bản hiện tại gặp lỗi quota hoặc giới hạn tốc độ.
          </p>
        </section>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="group px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
          >
            <Save className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            Lưu thay đổi cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
