const { recipes, ingredients } = require('../db/db.js');

const ingredientMap = new Map(ingredients.map(i => [i.id, i]));

function parseAmount(amount) {
  const str = String(amount).trim();
  if (str.includes('/')) {
    const [num, den] = str.split('/');
    return parseFloat(num) / parseFloat(den);
  }
  return parseFloat(str) || 0;
}

function getIngredientNames(recipeIngredients) {
  return recipeIngredients.map(({ ingredientId }) => {
    const ing = ingredientMap.get(ingredientId);
    return ing ? ing.name.toLowerCase() : '';
  });
}

function getAll(filters = {}) {
  const { search, tags, ingredient, difficulty } = filters;
  let result = recipes;

  if (difficulty) {
    result = result.filter(r => r.difficulty === difficulty);
  }

  if (tags) {
    const tagList = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    result = result.filter(r => {
      const recipeTags = r.tags.map(t => t.toLowerCase());
      return tagList.every(tag => recipeTags.includes(tag));
    });
  }

  if (ingredient) {
    const query = ingredient.toLowerCase();
    result = result.filter(r =>
      getIngredientNames(r.ingredients).some(name => name.includes(query))
    );
  }

  if (search) {
    const query = search.toLowerCase();
    result = result.filter(r => {
      if (r.title.toLowerCase().includes(query)) return true;
      if (r.tags.some(t => t.toLowerCase().includes(query))) return true;
      return getIngredientNames(r.ingredients).some(name => name.includes(query));
    });
  }

  return result;
}

function getById(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) {
    const err = new Error('Recipe not found');
    err.statusCode = 404;
    throw err;
  }

  const joinedIngredients = recipe.ingredients.map(({ ingredientId, amount, unit }) => {
    const ing = ingredientMap.get(ingredientId) || null;
    return { amount, unit, ...ing };
  });

  const nutrition = calculateNutrition(recipe, recipe.servings);

  return { ...recipe, ingredients: joinedIngredients, nutrition };
}

function calculateNutrition(recipe, servings) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  for (const { ingredientId, amount } of recipe.ingredients) {
    const ing = ingredientMap.get(ingredientId);
    if (!ing) continue;

    const qty = parseAmount(amount);
    totals.calories += ing.nutrition.calories * qty;
    totals.protein += ing.nutrition.protein * qty;
    totals.carbs += ing.nutrition.carbs * qty;
    totals.fat += ing.nutrition.fat * qty;
  }

  const scale = (servings || recipe.servings) / recipe.servings;

  return {
    calories: Math.round(totals.calories * scale * 10) / 10,
    protein: Math.round(totals.protein * scale * 10) / 10,
    carbs: Math.round(totals.carbs * scale * 10) / 10,
    fat: Math.round(totals.fat * scale * 10) / 10,
  };
}

module.exports = { getAll, getById, calculateNutrition };
