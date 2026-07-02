require("dotenv").config();

const express = require("express");
const cors = require("cors");
const recipesRouter = require("./routes/recipes.js");
const aiRouter = require("./routes/ai.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://recipe-manager-2h3uvstht-natalie-ps-projects.vercel.app",
      /\.vercel\.app$/,
    ],
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/recipes", recipesRouter);
app.use("/api/ai", aiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
