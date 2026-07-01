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
        <p className="text-[9px] uppercase tracking-widest text-text-muted mb-3">
          Total for {servings} {servings === 1 ? 'serving' : 'servings'}
        </p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {ITEMS.map(({ key, label, unit }) => (
          <div key={key} style={{ background: '#F5EDE3', borderRadius: '8px', padding: '8px 10px' }}>
            <p className="text-[9px] uppercase tracking-wide text-text-muted mb-1">{label}</p>
            <p className="text-base font-medium text-text-primary">
              {nutrition[key]}
              <span className="text-[10px] text-text-muted ml-1">{unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
