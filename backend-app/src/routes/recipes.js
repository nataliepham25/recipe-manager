const express = require('express');
const router = express.Router();
const recipeService = require('../services/recipeService.js');

router.get('/', (req, res, next) => {
  try {
    const { search, tags, ingredient, difficulty } = req.query;
    const data = recipeService.getAll({ search, tags, ingredient, difficulty });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const data = recipeService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
