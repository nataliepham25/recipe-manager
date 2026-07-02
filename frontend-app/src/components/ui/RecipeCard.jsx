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

export default function RecipeCard({
  recipe,
  isFavorited    = false,
  onToggleFavorite,
  isSelected     = false,
  onToggleRecipe,
}) {
  const cuisineTag  = recipe.tags.find(t => KNOWN_CUISINES.has(t.toLowerCase()));
  const accentColor = CUISINE_ACCENT[cuisineTag] ?? CUISINE_ACCENT.default;

  return (
    <Link href={`/recipes/${recipe.id}`} className="block h-full">
      <article className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-colors cursor-pointer h-full relative">

        {/* Cuisine accent bar */}
        <div style={{ height: '3px', backgroundColor: accentColor }} />

        {/* Body */}
        <div className="p-3 flex flex-col gap-1 relative">

          {/* Heart button — top-right of body */}
          {onToggleFavorite && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(); }}
              className="absolute top-2 right-2 z-10 leading-none"
              aria-label={isFavorited ? 'Remove from saved' : 'Save recipe'}
            >
              <span style={{ fontSize: '16px', color: isFavorited ? '#A0785A' : '#E5DDD3', lineHeight: 1 }}>
                {isFavorited ? '♥' : '♡'}
              </span>
            </button>
          )}

          {/* Cuisine label */}
          {cuisineTag && (
            <p className="text-[9px] font-medium uppercase tracking-[0.06em] pr-6" style={{ color: '#A0785A' }}>
              {cuisineTag}
            </p>
          )}

          {/* Title */}
          <h2 className="text-sm font-medium text-text-primary pr-6" style={{ lineHeight: '1.3' }}>
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

          {/* Tags + difficulty + shopping list button */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              {recipe.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
              <DifficultyBadge difficulty={recipe.difficulty} />
            </div>

            {onToggleRecipe && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleRecipe(); }}
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'border-transparent text-white'
                    : 'border-border text-text-secondary hover:border-accent'
                }`}
                style={isSelected ? { background: '#A0785A' } : {}}
                aria-label={isSelected ? 'Remove from shopping list' : 'Add to shopping list'}
              >
                {isSelected ? '✓' : '+'}
              </button>
            )}
          </div>

        </div>
      </article>
    </Link>
  );
}
