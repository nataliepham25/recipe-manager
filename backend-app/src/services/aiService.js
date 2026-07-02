const Anthropic = require('@anthropic-ai/sdk');

function buildPrompt(type, recipe) {
  const ingredientList = recipe.ingredients
    .map(ing => `- ${ing.amount} ${ing.unit} ${ing.name}`)
    .join('\n');

  const base = `Recipe: ${recipe.title}
Ingredients:
${ingredientList}`;

  switch (type) {
    case 'substitution':
      return `${base}

Suggest 2-3 ingredient substitutions for this recipe. For each substitution, name the original ingredient, the substitute, and briefly explain why it works. Be concise and practical.`;

    case 'scaling_tips':
      return `${base}
Servings: ${recipe.servings}

Give 2-3 practical tips for scaling this recipe beyond simply multiplying ingredient amounts. Focus on technique adjustments, timing changes, or equipment considerations. Be concise.`;

    case 'pairing':
      return `${base}

Suggest 2-3 dish or drink pairings that complement this recipe. For each pairing, give a brief explanation of why it works well. Be concise.`;

    default: {
      const err = new Error('Invalid suggestion type');
      err.statusCode = 400;
      throw err;
    }
  }
}

async function generateSuggestion(type, recipe) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const err = new Error('AI features are not configured (missing API key)');
    err.statusCode = 503;
    throw err;
  }

  const client = new Anthropic({ apiKey });
  const prompt = buildPrompt(type, recipe);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].text;
}

module.exports = { generateSuggestion };
