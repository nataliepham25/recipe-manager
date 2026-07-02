import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'recipe-favorites';

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Read from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setFavoriteIds(readStorage());
  }, []);

  const toggleFavorite = useCallback(id => {
    setFavoriteIds(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorited = useCallback(id => favoriteIds.includes(id), [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorited };
}
