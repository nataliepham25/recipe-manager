'use client';

const DIFFICULTIES    = ['easy', 'medium', 'hard'];
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free'];
const SORT_OPTIONS    = [
  { value: '',           label: 'Sort by' },
  { value: 'prep-asc',   label: 'Prep: low → high' },
  { value: 'prep-desc',  label: 'Prep: high → low' },
  { value: 'diff-asc',   label: 'Difficulty: easy first' },
  { value: 'diff-desc',  label: 'Difficulty: hard first' },
];

const selectClass =
  'bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary ' +
  'focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer flex-shrink-0';

const pillBase = 'text-xs px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap';
const pillOff  = 'bg-tag-bg text-tag-text border-transparent hover:border-border';
const pillOn   = 'bg-accent text-white border-accent';

export default function FilterBar({
  difficulty, onDifficultyChange,
  selectedTags, onTagToggle,
  availableTags = [],
  dietary, onDietaryToggle,
  sort, onSortChange,
  hasActiveFilters, onClear,
}) {
  return (
    <div className="space-y-2">

      {/* ── Scrollable controls row ── */}
      <div className="overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">

          <select
            value={difficulty}
            onChange={e => onDifficultyChange(e.target.value)}
            className={selectClass}
            aria-label="Filter by difficulty"
          >
            <option value="">All difficulties</option>
            {DIFFICULTIES.map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={e => onSortChange(e.target.value)}
            className={selectClass}
            aria-label="Sort recipes"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <div className="w-px h-4 bg-border flex-shrink-0" />

          {DIETARY_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => onDietaryToggle(opt)}
              className={`${pillBase} ${dietary.includes(opt) ? pillOn : pillOff}`}
            >
              {opt}
            </button>
          ))}

          {hasActiveFilters && (
            <>
              <div className="w-px h-4 bg-border flex-shrink-0" />
              <button
                onClick={onClear}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
              >
                Clear filters
              </button>
            </>
          )}

        </div>
      </div>

      {/* ── Wrapping tag pills ── */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`${pillBase} ${selectedTags.includes(tag) ? pillOn : pillOff}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
