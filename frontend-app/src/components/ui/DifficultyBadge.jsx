const styles = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${styles[difficulty] ?? styles.medium}`}>
      {difficulty}
    </span>
  );
}
