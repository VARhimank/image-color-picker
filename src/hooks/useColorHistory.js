import { useState } from 'react';

const KEY = 'color-history';
const MAX = 20;

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

function save(history) {
  localStorage.setItem(KEY, JSON.stringify(history));
}

export function useColorHistory() {
  const [history, setHistory] = useState(load);

  const addColor = (color) => {
    setHistory(prev => {
      // Avoid consecutive duplicates
      if (prev[0]?.hex === color.hex) return prev;
      const next = [color, ...prev].slice(0, MAX);
      save(next);
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(KEY);
  };

  return { history, addColor, clearHistory };
}
