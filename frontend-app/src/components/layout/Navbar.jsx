import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/recipes" className="font-serif text-[18px] text-text-primary leading-none">
          Recipes
        </Link>
        <div className="flex items-center gap-5">
          <span className="text-xs text-text-secondary cursor-default select-none">By cuisine</span>
          <span className="text-xs text-text-secondary cursor-default select-none">By course</span>
        </div>
      </div>
    </nav>
  );
}
