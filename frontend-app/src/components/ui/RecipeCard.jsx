import Link from 'next/link';
import Tag from './Tag';
import DifficultyBadge from './DifficultyBadge';

const CUISINE_ACCENT = {
  italian:       '#C4956A',
  japanese:      '#7BAE8A',
  mexican:       '#D4896A',
  greek:         '#8BA8C4',
  asian:         '#7BAE8A',
  indian:        '#D4896A',
  seafood:       '#7BAE8A',
  mediterranean: '#8BA8C4',
  default:       '#A0785A',
};

const KNOWN_CUISINES = new Set(Object.keys(CUISINE_ACCENT));

export default function RecipeCard({ recipe }) {
  const cuisineTag   = recipe.tags.find(t => KNOWN_CUISINES.has(t.toLowerCase()));
  const accentColor  = CUISINE_ACCENT[cuisineTag] ?? CUISINE_ACCENT.default;

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <article className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-colors cursor-pointer h-full">

        {/* Cuisine accent bar */}
        <div style={{ height: '3px', backgroundColor: accentColor }} />

        {/* Body */}
        <div className="p-3 flex flex-col gap-1">
          {/* Cuisine label */}
          {cuisineTag && (
            <p className="text-[9px] font-medium uppercase tracking-[0.06em]" style={{ color: '#A0785A' }}>
              {cuisineTag}
            </p>
          )}

          {/* Title */}
          <h2 className="text-sm font-medium text-text-primary" style={{ lineHeight: '1.3' }}>
            {recipe.title}
          </h2>

          {/* Description */}
          {recipe.description && (
            <p
              className="text-text-secondary overflow-hidden"
              style={{
                fontSize: '11px',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {recipe.description}
            </p>
          )}

          {/* Meta */}
          <p style={{ fontSize: '10px', color: '#B8967A' }}>
            {[
              recipe.prepTime && `${recipe.prepTime} prep`,
              recipe.cookTime && `${recipe.cookTime} cook`,
            ].filter(Boolean).join(' · ')}
          </p>

          {/* Tags + difficulty */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {recipe.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
            <DifficultyBadge difficulty={recipe.difficulty} />
          </div>
        </div>

      </article>
    </Link>
  );
}
