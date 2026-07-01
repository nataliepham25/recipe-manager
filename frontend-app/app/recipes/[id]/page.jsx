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

// Handles "2", "0.75", "1/3", "1/2"
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
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace(/\.?0+$/, '');
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

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Bone({ className }) {
  return <div className={`bg-border rounded animate-pulse ${className}`} />;
}

function Skeleton() {
  return (
    <div>
      <Bone className="h-4 w-28 mb-6" />
      <Bone className="h-8 w-2/3 mb-3" />
      <Bone className="h-4 w-full mb-1" />
      <Bone className="h-4 w-3/4 mb-6" />

      <div className="flex gap-8 pb-4 mb-4 border-b border-border">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Bone className="h-2.5 w-10" />
            <Bone className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-8">
        {[16, 14, 20].map(w => (
          <Bone key={w} className={`h-5 w-${w} rounded-full`} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3 space-y-6">
          <Bone className="h-5 w-28" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Bone className="h-6 w-6 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-0.5">
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-3">
          <Bone className="h-5 w-24 mb-4" />
          {[...Array(5)].map((_, i) => (
            <Bone key={i} className="h-4 w-full" />
          ))}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {[...Array(4)].map((_, i) => (
              <Bone key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stat chip ───────────────────────────────────────────────────────────────

function StatChip({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-text-secondary uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-text-primary">{children}</span>
    </div>
  );
}

// ─── Shared action button style ───────────────────────────────────────────────

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
        if (r.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const json = await r.json();
        if (!json.success) throw new Error(json.error || 'Failed to load recipe');
        setRecipe(json.data);
        setServings(json.data.servings);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => { fetchRecipe(); }, [fetchRecipe]);

  const scaledNutrition = recipe && servings != null
    ? scaleNutrition(recipe.nutrition, recipe.servings, servings)
    : null;

  return (
    <>
      <Navbar />
      <PageWrapper>

        {/* ── Loading ── */}
        {loading && <Skeleton />}

        {/* ── 404 ── */}
        {!loading && notFound && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-primary mb-1">Recipe not found</p>
            <p className="text-sm text-text-secondary mb-4">
              This recipe doesn&apos;t exist or may have been removed.
            </p>
            <Link href="/recipes" className={actionBtn}>← All Recipes</Link>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-primary mb-1">Something went wrong</p>
            <p className="text-sm text-text-secondary mb-4">{error}</p>
            <button onClick={fetchRecipe} className={actionBtn}>Try again</button>
          </div>
        )}

        {/* ── Recipe ── */}
        {!loading && recipe && (
          <>
            {/* Back link */}
            <Link
              href="/recipes"
              className="inline-block text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
            >
              ← All Recipes
            </Link>

            {/* Title + description */}
            <h1 className="text-3xl font-medium tracking-tight text-text-primary">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-text-secondary mt-2">{recipe.description}</p>
            )}

            {/* Meta chips */}
            <div className="flex flex-wrap gap-6 mt-6 pb-4 border-b border-border mb-4">
              <StatChip label="Prep">{recipe.prepTime}</StatChip>
              <StatChip label="Cook">{recipe.cookTime}</StatChip>
              <StatChip label="Servings">{recipe.servings}</StatChip>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-secondary uppercase tracking-wide">
                  Difficulty
                </span>
                <DifficultyBadge difficulty={recipe.difficulty} />
              </div>
            </div>

            {/* Tags */}
            {recipe.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-8">
                {recipe.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
            )}

            {/* ── Two-column content ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

              {/* Left — Instructions (60%) */}
              <div className="lg:col-span-3">
                <h2 className="text-base font-medium text-text-primary mb-5">
                  Instructions
                </h2>
                <ol className="space-y-6">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span
                        className="text-2xl font-medium text-border leading-none flex-shrink-0 w-7 pt-0.5 select-none"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm text-text-primary leading-relaxed pt-1">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right — Ingredients + Nutrition (40%) */}
              <div className="lg:col-span-2">
                <h2 className="text-base font-medium text-text-primary mb-4">
                  Ingredients
                </h2>

                {/* Serving adjuster */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <span className="text-sm text-text-secondary">Servings</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setServings(s => Math.max(1, s - 1))}
                      aria-label="Decrease servings"
                      className="w-7 h-7 flex items-center justify-center border border-border rounded text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-text-primary w-5 text-center">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(s => s + 1)}
                      aria-label="Increase servings"
                      className="w-7 h-7 flex items-center justify-center border border-border rounded text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Ingredient list */}
                <ul className="space-y-2.5 mb-6">
                  {recipe.ingredients.map((ing, i) => {
                    const scaled = formatAmount(
                      parseAmount(ing.amount) * servings / recipe.servings
                    );
                    return (
                      <li key={i} className="flex items-baseline gap-1.5 text-sm">
                        <span className="font-medium text-text-primary tabular-nums min-w-[2.5rem] text-right flex-shrink-0">
                          {scaled}
                        </span>
                        <span className="text-text-secondary flex-shrink-0">{ing.unit}</span>
                        <span className="text-text-primary">{ing.name}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* Nutrition */}
                <div className="border-t border-border pt-6">
                  <h2 className="text-base font-medium text-text-primary mb-4">
                    Nutrition
                  </h2>
                  {scaledNutrition && (
                    <NutritionCard nutrition={scaledNutrition} servings={servings} />
                  )}
                </div>
              </div>

            </div>
          </>
        )}

      </PageWrapper>
    </>
  );
}
