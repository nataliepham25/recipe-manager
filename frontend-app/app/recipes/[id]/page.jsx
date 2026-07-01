'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/src/components/layout/Navbar';
import PageWrapper from '@/src/components/layout/PageWrapper';
import Tag from '@/src/components/ui/Tag';
import DifficultyBadge from '@/src/components/ui/DifficultyBadge';
import NutritionCard from '@/src/components/ui/NutritionCard';

const API = 'http://localhost:8080/api';

const KNOWN_CUISINES = new Set(['italian','japanese','mexican','greek','asian','indian','seafood','french','mediterranean']);

function parseAmount(amount) {
  const str = String(amount).trim();
  if (str.includes('/')) {
    const [num, den] = str.split('/');
    return parseFloat(num) / parseFloat(den);
  }
  return parseFloat(str) || 0;
}

function formatAmount(num) {
  if (num === 0) return '0';
  const rounded = Math.round(num * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, '');
}

function scaleNutrition(nutrition, defaultServings, selectedServings) {
  const scale = selectedServings / defaultServings;
  return {
    calories: Math.round(nutrition.calories * scale * 10) / 10,
    protein:  Math.round(nutrition.protein  * scale * 10) / 10,
    carbs:    Math.round(nutrition.carbs    * scale * 10) / 10,
    fat:      Math.round(nutrition.fat      * scale * 10) / 10,
  };
}

// ─── Meta chip ────────────────────────────────────────────────────────────────

function MetaChip({ label, children }) {
  return (
    <div
      className="flex flex-col items-center text-center flex-1"
      style={{ background: '#F5EDE3', borderRadius: '8px', padding: '6px 12px' }}
    >
      <span className="text-[9px] uppercase tracking-wide text-text-muted mb-0.5">{label}</span>
      <span className="text-sm font-medium text-text-primary">{children}</span>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Bone({ className }) {
  return <div className={`bg-border rounded animate-pulse ${className}`} />;
}

function Skeleton() {
  return (
    <div>
      <Bone className="h-3 w-24 mb-6" />
      <Bone className="h-3 w-32 mb-2" />
      <Bone className="h-8 w-2/3 mb-2" />
      <Bone className="h-3 w-full mb-1" />
      <Bone className="h-3 w-3/4 mb-6" />
      <div className="flex gap-2 mb-6">
        {[...Array(4)].map((_, i) => <Bone key={i} className="flex-1 h-14 rounded-lg" />)}
      </div>
      <div className="flex gap-2 mb-8">
        {[14, 12, 18].map(w => <Bone key={w} className={`h-4 w-${w} rounded-full`} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-5">
          <Bone className="h-4 w-24" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Bone className="w-9 h-7 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-3">
          <Bone className="h-4 w-24" />
          {[...Array(6)].map((_, i) => <Bone key={i} className="h-3 w-full" />)}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[...Array(4)].map((_, i) => <Bone key={i} className="h-14 rounded-lg" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared action button ─────────────────────────────────────────────────────

const actionBtn =
  'text-sm px-4 py-2 border border-border rounded-lg text-text-primary hover:border-accent transition-colors';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe]     = useState(null);
  const [servings, setServings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError]       = useState(null);

  const fetchRecipe = useCallback(() => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    fetch(`${API}/recipes/${id}`)
      .then(async r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return; }
        const json = await r.json();
        if (!json.success) throw new Error(json.error || 'Failed to load recipe');
        setRecipe(json.data);
        setServings(json.data.servings);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  useEffect(() => { fetchRecipe(); }, [fetchRecipe]);

  const scaledNutrition = recipe && servings != null
    ? scaleNutrition(recipe.nutrition, recipe.servings, servings)
    : null;

  return (
    <>
      <Navbar />
      <PageWrapper>

        {loading && <Skeleton />}

        {!loading && notFound && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-primary mb-1">Recipe not found</p>
            <p className="text-sm text-text-secondary mb-4">This recipe doesn&apos;t exist or may have been removed.</p>
            <Link href="/recipes" className={actionBtn}>← All recipes</Link>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-primary mb-1">Something went wrong</p>
            <p className="text-sm text-text-secondary mb-4">{error}</p>
            <button onClick={fetchRecipe} className={actionBtn}>Try again</button>
          </div>
        )}

        {!loading && recipe && (() => {
          const cuisineTag = recipe.tags.find(t => KNOWN_CUISINES.has(t.toLowerCase()));
          const eyebrow = [
            cuisineTag && (cuisineTag.charAt(0).toUpperCase() + cuisineTag.slice(1)),
            recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1),
          ].filter(Boolean).join(' · ');

          return (
            <>
              {/* Back link */}
              <Link
                href="/recipes"
                className="inline-block text-xs text-text-secondary hover:text-text-primary transition-colors mb-4"
              >
                ← All recipes
              </Link>

              {/* Header block */}
              <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-1">
                {eyebrow}
              </p>
              <h1 className="font-serif text-3xl text-text-primary" style={{ lineHeight: '1.2' }}>
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="text-sm text-text-secondary mt-[6px] mb-4">{recipe.description}</p>
              )}

              {/* Meta chips row */}
              <div className="flex gap-2 mb-4">
                <MetaChip label="Prep">{recipe.prepTime}</MetaChip>
                <MetaChip label="Cook">{recipe.cookTime}</MetaChip>
                <MetaChip label="Servings">{recipe.servings}</MetaChip>
                <MetaChip label="Level"><DifficultyBadge difficulty={recipe.difficulty} /></MetaChip>
              </div>

              {/* Tags */}
              {recipe.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {recipe.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                </div>
              )}

              {/* Two-column content */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                {/* Left — Instructions */}
                <div className="lg:col-span-3">
                  <h2 className="text-sm font-medium text-text-primary mb-5">Instructions</h2>
                  <ol className="space-y-5">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span
                          aria-hidden="true"
                          className="flex-shrink-0 select-none"
                          style={{
                            fontSize: '28px',
                            fontWeight: 500,
                            color: '#E5DDD3',
                            minWidth: '36px',
                            lineHeight: '1',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-sm text-text-primary pt-1" style={{ lineHeight: '1.6' }}>
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Right — Ingredients + Nutrition */}
                <div className="lg:col-span-2">
                  <h2 className="text-sm font-medium text-text-primary mb-4">Ingredients</h2>

                  {/* Serving adjuster */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                    <span className="text-xs text-text-secondary">Servings</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => setServings(s => Math.max(1, s - 1))}
                        aria-label="Decrease servings"
                        className="w-6 h-6 flex items-center justify-center border border-border rounded text-text-secondary hover:border-accent hover:text-text-primary transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium text-text-primary w-5 text-center tabular-nums">
                        {servings}
                      </span>
                      <button
                        onClick={() => setServings(s => s + 1)}
                        aria-label="Increase servings"
                        className="w-6 h-6 flex items-center justify-center border border-border rounded text-text-secondary hover:border-accent hover:text-text-primary transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Ingredient list */}
                  <ul className="mb-6">
                    {recipe.ingredients.map((ing, i) => {
                      const scaled = formatAmount(parseAmount(ing.amount) * servings / recipe.servings);
                      return (
                        <li
                          key={i}
                          className="flex justify-between items-baseline"
                          style={{ borderBottom: '1px solid #F5EDE3', padding: '5px 0' }}
                        >
                          <span className="text-xs font-medium text-text-primary">{ing.name}</span>
                          <span className="text-xs text-text-secondary ml-4 flex-shrink-0">
                            {scaled} {ing.unit}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Nutrition */}
                  <div className="border-t border-border pt-5">
                    <h2 className="text-sm font-medium text-text-primary mb-4">Nutrition</h2>
                    {scaledNutrition && (
                      <NutritionCard nutrition={scaledNutrition} servings={servings} />
                    )}
                  </div>
                </div>

              </div>
            </>
          );
        })()}

      </PageWrapper>
    </>
  );
}
