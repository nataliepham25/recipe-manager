const ITEMS = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein',  label: 'Protein',  unit: 'g' },
  { key: 'carbs',    label: 'Carbs',    unit: 'g' },
  { key: 'fat',      label: 'Fat',      unit: 'g' },
];

export default function NutritionCard({ nutrition, servings }) {
  return (
    <div>
      {servings != null && (
        <p className="text-xs text-text-secondary mb-3">
          Total for {servings} {servings === 1 ? 'serving' : 'servings'}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {ITEMS.map(({ key, label, unit }) => (
          <div key={key} className="bg-surface border border-border rounded-lg p-3">
            <p className="text-xs text-text-secondary mb-1">{label}</p>
            <p className="text-lg font-medium text-text-primary">
              {nutrition[key]}
              <span className="text-xs text-text-secondary ml-1">{unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
