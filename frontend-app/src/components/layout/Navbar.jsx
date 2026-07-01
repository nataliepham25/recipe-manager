import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
        <Link href="/recipes" className="text-base font-semibold text-text-primary tracking-tight">
          Recipes
        </Link>
      </div>
    </nav>
  );
}
