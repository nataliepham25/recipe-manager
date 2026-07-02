const express = require('express');
const router = express.Router();
const { generateSuggestion } = require('../services/aiService.js');
const { getById } = require('../services/recipeService.js');

const VALID_TYPES = new Set(['substitution', 'scaling_tips', 'pairing']);

router.post('/suggest', async (req, res, next) => {
  try {
    const { recipeId, type } = req.body;

    if (!recipeId || !type) {
      const err = new Error('recipeId and type are required');
      err.statusCode = 400;
      throw err;
    }

    if (!VALID_TYPES.has(type)) {
      const err = new Error(`type must be one of: ${[...VALID_TYPES].join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const recipe = getById(recipeId);
    const suggestion = await generateSuggestion(type, recipe);

    res.json({ success: true, data: suggestion });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
