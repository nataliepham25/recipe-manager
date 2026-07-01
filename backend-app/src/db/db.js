const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, '../../db/data.json'), 'utf8');
const { recipes, ingredients } = JSON.parse(raw);

module.exports = { recipes, ingredients };
