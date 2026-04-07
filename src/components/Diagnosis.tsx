import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Loader2, CheckCircle2, MessageSquare, GraduationCap, Sparkles } from 'lucide-react';
import { analyzeOnionImage } from '../lib/ai';
import { storage } from '../lib/storage';
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2';

export function Diagnosis() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Lỗi', 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    const prompt = `Bạn là một trợ lý giáo dục AI (AI Tutor) của Skill Education. Hãy phân tích hình ảnh này (có thể là bài tập, ghi chú, hoặc tài liệu học tập) và:
1. Tóm tắt nội dung chính của tài liệu.
2. Giải thích các khái niệm khó hoặc giải chi tiết bài tập nếu có.
3. Đưa ra các gợi ý mở rộng để người học nắm vững kiến thức hơn.
4. Trình bày lời khuyên để cải thiện kết quả học tập liên quan đến nội dung này.
Trình bày chuyên nghiệp và dễ hiểu bằng Markdown.`;

    try {
      const analysisResult = await analyzeOnionImage(image, prompt);
      setResult(analysisResult);
      
      // Save to history
      storage.addHistory({
        action: 'diagnosis',
        data: { 
          type: 'ai-consulting',
          result: analysisResult,
          imagePreview: image.substring(0, 100) + '...'
        }
      });
    } catch (error: any) {
      Swal.fire('Lỗi phân tích', error.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary-600 rounded-3xl shadow-xl shadow-primary-200">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tư vấn AI Thông minh</h1>
          <p className="text-slate-500 mt-1 italic">Chụp ảnh bài tập hoặc tài liệu để nhận hỗ trợ tức thì.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col group">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary-500" />
              Tài liệu học tập
            </h2>
            {image && (
              <button 
                onClick={clearImage}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-1.5 bg-rose-50 rounded-lg transition-colors"
              >
                Xóa ảnh
              </button>
            )}
          </div>
          
          <div className="relative flex-1 group">
            {!image ? (
              <div 
                className="h-full border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center p-10 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer min-h-[350px] group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 group-hover:text-primary-500 transition-all duration-500">
                  <Upload className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tải ảnh bài tập</h3>
                <p className="text-sm text-slate-400 max-w-[200px] leading-relaxed">Kéo thả hoặc nhấn để chọn ảnh từ thiết bị của bạn.</p>
              </div>
            ) : (
              <div className="relative h-full rounded-[1.5rem] overflow-hidden bg-slate-100 min-h-[350px] flex items-center justify-center border border-slate-200">
                <img src={image} alt="Preview" className="max-h-[500px] object-contain" />
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />

          <button
            onClick={handleAnalyze}
            disabled={!image || isAnalyzing}
            className="mt-8 w-full py-5 px-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold shadow-2xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
                <span>Gia sư AI đang suy nghĩ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-amber-400 group-hover:animate-pulse" />
                <span>Bắt đầu Tư vấn AI</span>
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-md flex flex-col h-full">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            Phản hồi từ Gia sư AI
          </h2>
          
          <div className="flex-1 bg-slate-50/50 rounded-2xl p-8 overflow-y-auto border border-slate-100 min-h-[400px]">
            {!image && !result && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center py-12">
                <div className="w-20 h-20 border-4 border-slate-100 rounded-full flex items-center justify-center mb-6">
                   <Sparkles className="w-10 h-10 opacity-20" />
                </div>
                <p className="font-medium">Vui lòng tải ảnh lên để nhận lời khuyên hỗ trợ học tập cá nhân hóa.</p>
              </div>
            )}
            
            {isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-primary-600 space-y-6 py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                <div className="text-center">
                  <p className="font-extrabold text-xl animate-pulse">Đang quét kiến thức...</p>
                  <p className="text-slate-400 text-xs mt-2">Sử dụng mô hình {storage.get().settings.selectedModel || 'Gemini 3 Pro'}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 text-emerald-600 mb-6 pb-4 border-b border-emerald-100">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Phân tích hoàn tất</span>
                </div>
                <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 prose-strong:text-primary-600">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
