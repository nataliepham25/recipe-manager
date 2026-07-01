export default function PageWrapper({ children }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {children}
    </main>
  );
}
