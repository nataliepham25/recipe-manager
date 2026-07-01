const express = require('express');
const cors = require('cors');
const recipesRouter = require('./routes/recipes.js');
const errorHandler = require('./middleware/errorHandler.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/recipes', recipesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
