import { storage } from './storage';

export const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Mặc định)' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Nâng cao)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Dự phòng)' }
];

export async function analyzeOnionImage(base64Image: string, prompt: string, modelIndex = 0): Promise<string> {
  const settings = storage.get().settings;
  const apiKey = settings.apiKey;
  
  if (!apiKey) {
    throw new Error('Vui lòng nhập API Key trong phần Cài đặt!');
  }

  // Use selected model first, then fallback through the list
  const selectedModelId = settings.selectedModel || MODELS[0].id;
  
  // Find starting index if not provided
  let currentIndex = modelIndex;
  if (modelIndex === 0) {
    currentIndex = MODELS.findIndex(m => m.id === selectedModelId);
    if (currentIndex === -1) currentIndex = 0;
  }

  const currentModelId = MODELS[currentIndex].id;
  
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${currentModelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
          }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2048 }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorCode = errorData?.error?.message || `HTTP ${response.status}`;
      
      // Fallback logic for retry-able errors (429, 500, etc.)
      if (currentIndex < MODELS.length - 1) {
        console.warn(`Model ${currentModelId} failed with ${errorCode}. Falling back...`);
        return analyzeOnionImage(base64Image, prompt, currentIndex + 1);
      }
      
      throw new Error(`Tất cả model đều thất bại. Lỗi cuối cùng: ${errorCode}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error: any) {
    if (currentIndex < MODELS.length - 1 && !error.message.includes('API Key')) {
       console.warn(`Request failed for ${currentModelId}. Retrying with next model...`);
       return analyzeOnionImage(base64Image, prompt, currentIndex + 1);
    }
    throw error;
  }
}

export async function getFarmingAdvice(sensorData: any, modelIndex = 0): Promise<string> {
  const settings = storage.get().settings;
  const apiKey = settings.apiKey;
  
  if (!apiKey) {
    throw new Error('Vui lòng nhập API Key trong phần Cài đặt!');
  }

  const selectedModelId = settings.selectedModel || MODELS[0].id;
  let currentIndex = modelIndex;
  if (modelIndex === 0) {
    currentIndex = MODELS.findIndex(m => m.id === selectedModelId);
    if (currentIndex === -1) currentIndex = 0;
  }

  const currentModelId = MODELS[currentIndex].id;

  const prompt = `Bạn là chuyên gia tư vấn giáo dục. Dựa trên dữ liệu học tập:
- Tiến độ hoàn thành: ${sensorData.moisture}%
- Mức độ tập trung: ${sensorData.temperature}/100
- Thời gian học: ${sensorData.humidity} phút

Hãy đưa ra 3 lời khuyên ngắn gọn (dưới 100 từ) về cách cải thiện hiệu quả học tập. Định dạng bằng Markdown.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${currentModelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorCode = errorData?.error?.message || `HTTP ${response.status}`;

      if (currentIndex < MODELS.length - 1) {
        return getFarmingAdvice(sensorData, currentIndex + 1);
      }
      throw new Error(`Đã dừng do lỗi: ${errorCode}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error: any) {
    if (currentIndex < MODELS.length - 1 && !error.message.includes('API Key')) {
       return getFarmingAdvice(sensorData, currentIndex + 1);
    }
    throw error;
  }
}
