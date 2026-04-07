import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Clock, Brain, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';
import { SensorData } from '../types';
import { storage } from '../lib/storage';
import { getFarmingAdvice } from '../lib/ai';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2';

export function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    moisture: 75, // Completion %
    temperature: 85, // Focus Level
    humidity: 120, // Study Time in minutes
    lastUpdated: Date.now(),
    isIrrigating: false // Learning Status
  });
  
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const settings = storage.get().settings;

  // Simulate learning progress
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => {
        const newStudyTime = prev.isIrrigating 
          ? prev.humidity + 1 
          : prev.humidity;
          
        const newFocus = prev.isIrrigating
          ? Math.min(100, prev.temperature + (Math.random() * 2 - 0.5))
          : Math.max(0, prev.temperature - (Math.random() * 1));

        return {
          ...prev,
          humidity: newStudyTime,
          temperature: newFocus,
          lastUpdated: Date.now(),
        };
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdvice = async () => {
    if (!settings.apiKey) {
      Swal.fire('Lỗi', 'Vui lòng cấu hình API Key trong phần Cài đặt', 'error');
      return;
    }
    setLoadingAdvice(true);
    try {
      const result = await getFarmingAdvice(sensorData);
      setAdvice(result);
    } catch (error: any) {
      Swal.fire('Lỗi', error.message, 'error');
    } finally {
      setLoadingAdvice(false);
    }
  };

  const toggleLearning = () => {
    const newState = !sensorData.isIrrigating;
    setSensorData(prev => ({ ...prev, isIrrigating: newState }));
    storage.addHistory({
      action: 'learning',
      data: { status: newState ? 'started' : 'paused', time: new Date().toLocaleTimeString() }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trung tâm Học tập</h1>
          <p className="text-slate-500 mt-1">Cập nhật lần cuối: {new Date(sensorData.lastUpdated).toLocaleTimeString()}</p>
        </div>
        <button 
          onClick={toggleLearning}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg transform active:scale-95 ${
            sensorData.isIrrigating 
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200'
          }`}
        >
          {sensorData.isIrrigating ? (
            <>
              <PauseCircle className="w-5 h-5" />
              Tạm dừng học
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5" />
              Bắt đầu học
            </>
          )}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-widest">Tiến độ</span>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">Hoàn thành bài tập</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{sensorData.moisture.toFixed(0)}</span>
            <span className="text-slate-400 font-bold">%</span>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000" 
              style={{ width: `${sensorData.moisture}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            {sensorData.temperature < 40 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
                <AlertCircle className="w-3 h-3" /> Cần tập trung
              </span>
            )}
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">Mức độ tập trung</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{sensorData.temperature.toFixed(0)}</span>
            <span className="text-slate-400 font-bold">/100</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">Thời gian</span>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">Thời gian học tập</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{sensorData.humidity}</span>
            <span className="text-slate-400 font-bold">phút</span>
          </div>
        </div>
      </div>

      {/* AI Advice Section */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-md">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-200">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gợi ý từ AI Skill Education</h2>
              <p className="text-sm text-slate-500">Phân tích dữ liệu học tập thời gian thực</p>
            </div>
          </div>
          <button 
            onClick={fetchAdvice}
            disabled={loadingAdvice}
            className="px-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50 border border-slate-200"
          >
            {loadingAdvice ? 'Đang phân tích...' : 'Cập nhật phân tích'}
          </button>
        </div>
        
        <div className={cn(
          "rounded-3xl p-8 min-h-[150px] transition-all border",
          advice ? "bg-slate-50 border-slate-100" : "bg-slate-50/50 border-dashed border-slate-200"
        )}>
          {loadingAdvice ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <p className="text-sm text-slate-400 font-medium">Trí tuệ nhân tạo đang xử lý dữ liệu...</p>
            </div>
          ) : advice ? (
            <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 prose-strong:text-primary-600">
              <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                <Brain className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                Nhấn <b>Cập nhật phân tích</b> để nhận lộ trình học tập tối ưu cá nhân hóa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
