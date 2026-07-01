'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '@/src/components/layout/Navbar';
import PageWrapper from '@/src/components/layout/PageWrapper';
import SearchBar from '@/src/components/ui/SearchBar';
import FilterBar from '@/src/components/ui/FilterBar';
import RecipeCard from '@/src/components/ui/RecipeCard';

const API = 'http://localhost:8080/api';

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };

function parseMinutes(str) {
  const m = String(str).match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="h-4 bg-border rounded w-3/4" />
        <div className="h-5 bg-border rounded-full w-14" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-border rounded w-full" />
        <div className="h-3 bg-border rounded w-2/3" />
      </div>
      <div className="h-3 bg-border rounded w-32 mb-3" />
      <div className="flex gap-1.5">
        <div className="h-5 bg-border rounded-full w-16" />
        <div className="h-5 bg-border rounded-full w-14" />
        <div className="h-5 bg-border rounded-full w-12" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecipesPage() {
  const [recipes, setRecipes]               = useState([]);
  const [allTags, setAllTags]               = useState([]);
  const [search, setSearch]                 = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTags, setSelectedTags]     = useState([]);
  const [difficulty, setDifficulty]         = useState('');
  const [dietary, setDietary]               = useState([]);
  const [sort, setSort]                     = useState('');
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  // Debounce search 300 ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch all tags once on mount (stable regardless of active filters)
  useEffect(() => {
    fetch(`${API}/recipes`)
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setAllTags([...new Set(json.data.flatMap(r => r.tags))].sort());
        }
      })
      .catch(() => {});
  }, []);

  // Fetch filtered recipes (search, tags, difficulty go to the API)
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

  // Client-side dietary filter + sort (no extra round-trip)
  const displayRecipes = useMemo(() => {
    let result = recipes;

    if (dietary.length > 0) {
      result = result.filter(r =>
        dietary.every(opt => r.tags.includes(opt.toLowerCase()))
      );
    }

    if (sort) {
      result = [...result].sort((a, b) => {
        switch (sort) {
          case 'prep-asc':  return parseMinutes(a.prepTime) - parseMinutes(b.prepTime);
          case 'prep-desc': return parseMinutes(b.prepTime) - parseMinutes(a.prepTime);
          case 'diff-asc':  return (DIFFICULTY_ORDER[a.difficulty] ?? 1) - (DIFFICULTY_ORDER[b.difficulty] ?? 1);
          case 'diff-desc': return (DIFFICULTY_ORDER[b.difficulty] ?? 1) - (DIFFICULTY_ORDER[a.difficulty] ?? 1);
          default: return 0;
        }
      });
    }

    return result;
  }, [recipes, dietary, sort]);

  const hasActiveFilters = !!(search || selectedTags.length || dietary.length || difficulty || sort);

  function clearFilters() {
    setSearch('');
    setDebouncedSearch('');
    setSelectedTags([]);
    setDietary([]);
    setDifficulty('');
    setSort('');
  }

  const handleTagToggle = tag =>
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );

  const handleDietaryToggle = opt =>
    setDietary(prev =>
      prev.includes(opt) ? prev.filter(d => d !== opt) : [...prev, opt]
    );

  return (
    <>
      <Navbar />
      <PageWrapper>
        <h1 className="text-2xl font-medium tracking-tight text-text-primary mb-6">
          Recipes
        </h1>

        <div className="space-y-3 mb-8">
          <SearchBar value={search} onChange={setSearch} />
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
              {hasActiveFilters
                ? 'Try adjusting your search or filters'
                : 'No recipes are available'}
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
