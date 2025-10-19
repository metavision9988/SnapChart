import { Loader2, Info } from 'lucide-react';
import { SAMPLE_DESCRIPTIONS } from '../constants/samplePrompts';

interface DiagramInputProps {
  type: string;
  prompt: string;
  onTypeChange: (type: string) => void;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function DiagramInput({
  type,
  prompt,
  onTypeChange,
  onPromptChange,
  onGenerate,
  isLoading
}: DiagramInputProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">다이어그램 생성</h2>

      {/* 타입 선택 */}
      <div className="mb-6">
        <label
          htmlFor="diagram-type"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          다이어그램 타입
        </label>
        <select
          id="diagram-type"
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="flowchart">플로우차트</option>
          <option value="sequence">시퀀스 다이어그램</option>
          <option value="pie">파이 차트</option>
          <option value="gantt">간트 차트</option>
          <option value="er">ER 다이어그램</option>
          <option value="state">상태 다이어그램</option>
          <option value="journey">User Journey</option>
          <option value="graph">조직도 (Graph)</option>
        </select>

        {/* 타입 설명 */}
        <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            {SAMPLE_DESCRIPTIONS[type as keyof typeof SAMPLE_DESCRIPTIONS]}
          </p>
        </div>
      </div>

      {/* 프롬프트 입력 */}
      <div className="mb-6">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          설명을 입력하세요
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          💡 샘플 프롬프트가 입력되어 있습니다. 바로 생성하거나 자유롭게 수정하세요!
        </p>
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !prompt.trim()}
        className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>생성 중...</span>
          </>
        ) : (
          <span>다이어그램 생성</span>
        )}
      </button>
    </div>
  );
}
