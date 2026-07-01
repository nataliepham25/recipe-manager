import Link from 'next/link';
import Tag from './Tag';
import DifficultyBadge from './DifficultyBadge';

export default function RecipeCard({ recipe }) {
  const totalTime = recipe.prepTime && recipe.cookTime
    ? `${recipe.prepTime} prep · ${recipe.cookTime} cook`
    : recipe.prepTime || recipe.cookTime || null;

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <article className="bg-surface border border-border rounded-lg p-5 hover:border-accent transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="text-base font-semibold text-text-primary leading-snug">
            {recipe.title}
          </h2>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>

        {recipe.description && (
          <p className="text-sm text-text-secondary mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {totalTime && (
          <p className="text-xs text-text-secondary mb-3">{totalTime}</p>
        )}

        {recipe.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
