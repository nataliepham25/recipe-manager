const STYLES = {
  easy:   { background: '#EAF3DE', color: '#3B6D11' },
  medium: { background: '#FAEEDA', color: '#854F0B' },
  hard:   { background: '#FCEBEB', color: '#A32D2D' },
};

export default function DifficultyBadge({ difficulty }) {
  const style = STYLES[difficulty] ?? STYLES.medium;
  return (
    <span
      className="text-[10px] font-medium px-2.5 py-0.5 rounded-full capitalize"
      style={style}
    >
      {difficulty}
    </span>
  );
}
