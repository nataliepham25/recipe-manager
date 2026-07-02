'use client';

import { useState } from 'react';

export default function ShoppingListPanel({ isOpen, onClose, selectedRecipes, aggregatedIngredients, onClearList }) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    const text = aggregatedIngredients
      .map(({ name, quantity, unit }) => `- ${quantity} ${unit} ${name}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable in some contexts
    }
  }

  function handleClear() {
    onClearList();
    onClose();
  }

  const btnClass =
    'flex-1 text-sm py-2 border border-border rounded-lg text-text-primary hover:border-accent transition-colors';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(44, 24, 16, 0.3)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '320px', background: '#FFFFFF', padding: '20px' }}
        aria-label="Shopping list"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="font-serif text-lg text-text-primary">Shopping list</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-xl leading-none transition-colors"
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        {/* Selected recipe chips */}
        {selectedRecipes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 flex-shrink-0">
            {selectedRecipes.map(r => (
              <span key={r.id} className="text-[10px] bg-tag-bg text-tag-text px-2.5 py-0.5 rounded-full">
                {r.title}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-border mb-4 flex-shrink-0" />

        {/* Ingredients list — scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {aggregatedIngredients.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">
              Add recipes to see ingredients here
            </p>
          ) : (
            <ul>
              {aggregatedIngredients.map(({ name, quantity, unit }) => (
                <li
                  key={`${name}__${unit}`}
                  className="flex justify-between items-baseline py-2"
                  style={{ borderBottom: '1px solid #F5EDE3' }}
                >
                  <span className="text-sm font-medium text-text-primary">{name}</span>
                  <span className="text-xs text-text-secondary ml-4 flex-shrink-0">
                    {quantity} {unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t border-border mt-4 flex-shrink-0">
          <button onClick={copyToClipboard} className={btnClass}>
            {copied ? 'Copied!' : 'Copy list'}
          </button>
          <button onClick={handleClear} className={btnClass}>
            Clear list
          </button>
        </div>
      </div>
    </>
  );
}
