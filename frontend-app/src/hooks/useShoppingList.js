import { useState, useMemo, useCallback } from 'react';

function parseAmount(amount) {
  const str = String(amount).trim();
  if (str.includes('/')) {
    const [num, den] = str.split('/');
    return parseFloat(num) / parseFloat(den);
  }
  return parseFloat(str) || 0;
}

// "chicken_breast" → "Chicken Breast"
function formatIngredientId(id) {
  return String(id)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function useShoppingList() {
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const toggleRecipe = useCallback(recipe => {
    setSelectedRecipes(prev =>
      prev.find(r => r.id === recipe.id)
        ? prev.filter(r => r.id !== recipe.id)
        : [...prev, recipe]
    );
  }, []);

  const isSelected = useCallback(id =>
    selectedRecipes.some(r => r.id === id),
  [selectedRecipes]);

  const clearList = useCallback(() => setSelectedRecipes([]), []);

  // Merge ingredients across all selected recipes, summing matching name+unit pairs
  const aggregatedIngredients = useMemo(() => {
    const map = new Map();

    for (const recipe of selectedRecipes) {
      for (const ing of recipe.ingredients) {
        const displayName = ing.name || formatIngredientId(ing.ingredientId || '');
        const unit = ing.unit || '';
        const key = `${displayName.toLowerCase()}__${unit}`;
        const qty = parseAmount(ing.amount);

        if (map.has(key)) {
          map.get(key).quantity += qty;
        } else {
          map.set(key, { name: displayName, quantity: qty, unit });
        }
      }
    }

    return [...map.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(item => ({
        ...item,
        quantity: parseFloat((Math.round(item.quantity * 100) / 100).toFixed(2).replace(/\.?0+$/, '')),
      }));
  }, [selectedRecipes]);

  return { selectedRecipes, toggleRecipe, isSelected, clearList, aggregatedIngredients };
}
