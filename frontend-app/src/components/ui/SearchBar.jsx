'use client';

export default function SearchBar({ value, onChange, placeholder = 'Search recipes, ingredients, or tags…' }) {
  return (
    <input
      type="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
    />
  );
}
