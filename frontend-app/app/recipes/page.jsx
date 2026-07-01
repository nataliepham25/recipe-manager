'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '@/src/components/layout/Navbar';
import PageWrapper from '@/src/components/layout/PageWrapper';
import SearchBar from '@/src/components/ui/SearchBar';
import FilterBar from '@/src/components/ui/FilterBar';
import RecipeCard from '@/src/components/ui/RecipeCard';

const API = 'http://localhost:8080/api';

const DIFFICULTY_ORDER  = { easy: 0, medium: 1, hard: 2 };
const KNOWN_CUISINES    = new Set(['italian','japanese','mexican','greek','asian','indian','seafood','french','mediterranean']);

function parseMinutes(str) {
  const m = String(str).match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

// ─── Section label style ──────────────────────────────────────────────────────

const sectionLabelClass =
  'text-[9px] font-medium tracking-[0.1em] uppercase text-text-muted border-b border-border pb-1 mb-3';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-[3px] bg-border" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-border rounded w-16" />
        <div className="h-3.5 bg-border rounded w-3/4" />
        <div className="h-2.5 bg-border rounded w-full" />
        <div className="h-2.5 bg-border rounded w-2/3" />
        <div className="h-2.5 bg-border rounded w-24" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-4 bg-border rounded-full w-14" />
          <div className="h-4 bg-border rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

// ─── Cuisine chip ─────────────────────────────────────────────────────────────

function CuisineChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`border rounded-md text-xs px-3 py-1 capitalize transition-colors whitespace-nowrap ${
        active
          ? 'bg-accent text-white border-accent'
          : 'bg-surface border-border text-text-secondary hover:border-accent'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecipesPage() {
  const [recipes, setRecipes]                 = useState([]);
  const [allTags, setAllTags]                 = useState([]);
  const [availableCuisines, setAvailableCuisines] = useState([]);
  const [totalStats, setTotalStats]           = useState({ count: 0, cuisines: 0 });
  const [search, setSearch]                   = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTags, setSelectedTags]       = useState([]);
  const [difficulty, setDifficulty]           = useState('');
  const [dietary, setDietary]                 = useState([]);
  const [sort, setSort]                       = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  // Debounce search 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Seed allTags, cuisines, and hero stats from unfiltered data (once on mount)
  useEffect(() => {
    fetch(`${API}/recipes`)
      .then(r => r.json())
      .then(json => {
        if (!json.success) return;
        setAllTags([...new Set(json.data.flatMap(r => r.tags))].sort());
        const cuisines = [...new Set(
          json.data.flatMap(r => r.tags.filter(t => KNOWN_CUISINES.has(t)))
        )].sort();
        setAvailableCuisines(cuisines);
        setTotalStats({ count: json.data.length, cuisines: cuisines.length });
      })
      .catch(() => {});
  }, []);

  // Fetch filtered recipes (search / tags / difficulty go to the API)
  const fetchRecipes = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (debouncedSearch)    params.set('search', debouncedSearch);
    if (selectedTags.length) params.set('tags', selectedTags.join(','));
    if (difficulty)          params.set('difficulty', difficulty);

    const qs = params.toString();
    fetch(`${API}/recipes${qs ? `?${qs}` : ''}`)
      .then(r => r.json())
      .then(json => {
        if (!json.success) throw new Error(json.error || 'Failed to fetch recipes');
        setRecipes(json.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [debouncedSearch, selectedTags, difficulty]);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  // Client-side: dietary + cuisine filter, then sort
  const displayRecipes = useMemo(() => {
    let result = recipes;

    if (dietary.length > 0) {
      result = result.filter(r =>
        dietary.every(opt => r.tags.includes(opt.toLowerCase()))
      );
    }

    if (selectedCuisine) {
      result = result.filter(r => r.tags.includes(selectedCuisine));
    }

    if (sort) {
      result = [...result].sort((a, b) => {
        switch (sort) {
          case 'prep-asc':  return parseMinutes(a.prepTime)  - parseMinutes(b.prepTime);
          case 'prep-desc': return parseMinutes(b.prepTime)  - parseMinutes(a.prepTime);
          case 'diff-asc':  return (DIFFICULTY_ORDER[a.difficulty] ?? 1) - (DIFFICULTY_ORDER[b.difficulty] ?? 1);
          case 'diff-desc': return (DIFFICULTY_ORDER[b.difficulty] ?? 1) - (DIFFICULTY_ORDER[a.difficulty] ?? 1);
          default: return 0;
        }
      });
    }

    return result;
  }, [recipes, dietary, selectedCuisine, sort]);

  const hasActiveFilters = !!(search || selectedTags.length || dietary.length || difficulty || sort || selectedCuisine);

  function clearFilters() {
    setSearch('');
    setDebouncedSearch('');
    setSelectedTags([]);
    setDietary([]);
    setDifficulty('');
    setSort('');
    setSelectedCuisine('');
  }

  const handleTagToggle = tag =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleDietaryToggle = opt =>
    setDietary(prev => prev.includes(opt) ? prev.filter(d => d !== opt) : [...prev, opt]);

  const sectionLabel = hasActiveFilters
    ? `${displayRecipes.length} result${displayRecipes.length !== 1 ? 's' : ''}`
    : 'Latest recipes';

  return (
    <>
      <Navbar />

      {/* ── Hero band ── */}
      <div className="bg-hero w-full">
        <div className="max-w-3xl mx-auto px-4 py-7">
          <p className="text-xs font-medium text-text-muted uppercase tracking-widest mb-3">
            {totalStats.count > 0
              ? `${totalStats.count} recipes · ${totalStats.cuisines} cuisines`
              : ' '}
          </p>
          <h1 className="font-serif text-2xl text-text-primary mb-4" style={{ lineHeight: '1.2' }}>
            What are you cooking today?
          </h1>
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <PageWrapper>

        {/* ── Filters ── */}
        <div className="mb-6">
          <FilterBar
            difficulty={difficulty}      onDifficultyChange={setDifficulty}
            selectedTags={selectedTags}  onTagToggle={handleTagToggle}
            availableTags={allTags}
            dietary={dietary}            onDietaryToggle={handleDietaryToggle}
            sort={sort}                  onSortChange={setSort}
            hasActiveFilters={hasActiveFilters}
            onClear={clearFilters}
          />
        </div>

        {/* ── Browse by cuisine ── */}
        <div className="mb-6">
          <p className={sectionLabelClass}>Browse by cuisine</p>
          <div className="overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              <CuisineChip
                label="All"
                active={!selectedCuisine}
                onClick={() => setSelectedCuisine('')}
              />
              {availableCuisines.map(c => (
                <CuisineChip
                  key={c}
                  label={c}
                  active={selectedCuisine === c}
                  onClick={() => setSelectedCuisine(prev => prev === c ? '' : c)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Section label ── */}
        <p className={sectionLabelClass}>{sectionLabel}</p>

        {/* ── Content ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-primary mb-1">Something went wrong</p>
            <p className="text-sm text-text-secondary mb-4">{error}</p>
            <button
              onClick={fetchRecipes}
              className="text-sm px-4 py-2 border border-border rounded-lg text-text-primary hover:border-accent transition-colors"
            >
              Try again
            </button>
          </div>
        ) : displayRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-primary mb-1">No recipes found</p>
            <p className="text-sm text-text-secondary">
              {hasActiveFilters ? 'Try adjusting your search or filters' : 'No recipes available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

      </PageWrapper>
    </>
  );
}
