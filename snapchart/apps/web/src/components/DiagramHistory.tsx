import { Clock, Trash2, FileText } from 'lucide-react';
import type { HistoryItem } from '../hooks/useHistory';
import type { DiagramType } from '@snapchart/types';

interface DiagramHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const DIAGRAM_TYPE_LABELS: Record<DiagramType, string> = {
  flowchart: '플로우차트',
  sequence: '시퀀스',
  pie: '파이 차트',
  gantt: '간트 차트',
  er: 'ER 다이어그램',
  state: '상태 다이어그램',
  journey: 'User Journey',
  graph: '조직도'
};

export function DiagramHistory({
  history,
  onSelect,
  onDelete,
  onClearAll
}: DiagramHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // 1시간 이내
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}분 전`;
    }

    // 24시간 이내
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}시간 전`;
    }

    // 그 외
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">최근 생성 목록</h2>
        <div className="text-center py-8 text-gray-400">
          <FileText size={48} className="mx-auto mb-3" />
          <p>아직 생성된 다이어그램이 없습니다</p>
          <p className="text-sm mt-2">다이어그램을 생성하면 여기에 표시됩니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">최근 생성 목록</h2>
        <button
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-700 hover:underline"
        >
          전체 삭제
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="group border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-blue-600">
                    {DIAGRAM_TYPE_LABELS[item.type]}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 truncate">
                  {item.prompt}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-all"
                title="삭제"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        최근 10개까지 자동 저장됩니다
      </p>
    </div>
  );
}
