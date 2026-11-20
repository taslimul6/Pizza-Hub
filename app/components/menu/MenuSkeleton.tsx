// Loading state: grey placeholder cards while the menu loads
export default function MenuSkeleton() {
  return (
    <div role="status" aria-label="Loading menu">
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-3xl border border-border bg-muted"
          />
        ))}
      </div>
    </div>
  );
}
