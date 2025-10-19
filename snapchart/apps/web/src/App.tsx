import { useState, useEffect } from 'react';
import { DiagramInput } from './components/DiagramInput';
import { DiagramPreview } from './components/DiagramPreview';
import { DiagramHistory } from './components/DiagramHistory';
import { useGenerateDiagram } from './hooks/useGenerateDiagram';
import { useHistory } from './hooks/useHistory';
import { SAMPLE_PROMPTS } from './constants/samplePrompts';
import type { DiagramType } from '@snapchart/types';
import type { HistoryItem } from './hooks/useHistory';

export default function App() {
  const [type, setType] = useState<DiagramType>('flowchart');
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS.flowchart);

  const { data, isLoading, error, mutate } = useGenerateDiagram();
  const { history, saveToHistory, deleteHistoryItem, clearHistory } = useHistory();

  // 타입이 변경될 때 샘플 프롬프트 자동 입력
  useEffect(() => {
    setPrompt(SAMPLE_PROMPTS[type]);
  }, [type]);

  // 다이어그램 생성 성공 시 히스토리에 저장
  useEffect(() => {
    if (data?.code) {
      saveToHistory({
        type,
        prompt,
        code: data.code
      });
    }
  }, [data]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    mutate({ type, prompt });
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setType(item.type);
    setPrompt(item.prompt);
    // 히스토리 항목의 코드를 바로 표시
    mutate({ type: item.type, prompt: item.prompt });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            SnapChart
          </h1>
          <p className="text-gray-600 mt-1">
            AI로 다이어그램을 3초 만에
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-4">
            <DiagramInput
              type={type}
              prompt={prompt}
              onTypeChange={setType}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-5">
            <DiagramPreview
              data={data}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* History Section */}
          <div className="lg:col-span-3">
            <DiagramHistory
              history={history}
              onSelect={handleHistorySelect}
              onDelete={deleteHistoryItem}
              onClearAll={clearHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
