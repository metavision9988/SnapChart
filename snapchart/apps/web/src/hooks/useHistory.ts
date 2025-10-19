import { useState, useEffect } from 'react';
import type { DiagramType } from '@snapchart/types';

export interface HistoryItem {
  id: string;
  type: DiagramType;
  prompt: string;
  code: string;
  timestamp: number;
}

const HISTORY_KEY = 'snapchart_history';
const MAX_HISTORY = 10;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 초기 로드
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    setHistory((prev) => {
      // 최신 항목을 앞에 추가
      const updated = [newItem, ...prev];

      // 최대 10개 유지
      const trimmed = updated.slice(0, MAX_HISTORY);

      // LocalStorage에 저장
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
      } catch (error) {
        console.error('Failed to save history:', error);
      }

      return trimmed;
    });
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter(item => item.id !== id);

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to delete history item:', error);
      }

      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  return {
    history,
    saveToHistory,
    deleteHistoryItem,
    clearHistory
  };
}
