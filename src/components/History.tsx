import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { storage } from '../lib/storage';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BookOpen, GraduationCap, Trash2, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(storage.get().history);
  }, []);

  const handleClear = () => {
    Swal.fire({
      title: 'Xóa lịch sử?',
      text: "Toàn bộ dữ liệu học tập cũ sẽ bị xóa vĩnh viễn.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Xóa sạch',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        storage.clearHistory();
        setHistory([]);
        Swal.fire('Đã xóa!', 'Lịch sử học tập đã được làm sạch.', 'success');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lịch sử học tập</h1>
          <p className="text-slate-500 mt-1">Theo dõi các hoạt động và tư vấn AI của bạn.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Xóa lịch sử
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <Clock className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-medium text-lg">Chưa có dữ liệu học tập</p>
            <p className="text-sm">Hãy bắt đầu học hoặc sử dụng Tư vấn AI để ghi lại lịch sử.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-all flex items-start gap-6 group">
                <div className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${
                  item.action === 'learning' ? 'bg-indigo-50 text-indigo-600' : 'bg-primary-50 text-primary-600'
                }`}>
                  {item.action === 'learning' ? <BookOpen className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {item.action === 'learning' ? 'Hoạt động học tập' : 'Tư vấn AI'}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      {format(item.timestamp, 'HH:mm - dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-600 leading-relaxed">
                    {item.action === 'learning' ? (
                      <p>
                        Trạng thái: <span className="font-bold text-slate-900">{item.data.status === 'started' ? 'Bắt đầu' : 'Tạm dừng'}</span>
                        {item.data.time && ` • Lúc: ${item.data.time}`}
                      </p>
                    ) : (
                      <div className="line-clamp-2 italic text-slate-500">
                        {item.data.result || 'Đã phân tích tài liệu học tập'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
