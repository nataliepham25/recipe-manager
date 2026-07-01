export default function Tag({ children }) {
  return (
    <span className="bg-tag-bg text-tag-text text-[10px] px-2.5 py-0.5 rounded-full">
      {children}
    </span>
  );
}
