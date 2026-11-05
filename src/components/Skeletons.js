const bar = "animate-pulse rounded-md bg-base-300";

export function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100" aria-hidden="true">
      <div className={`aspect-[4/3] w-full ${bar} rounded-none`} />
      <div className="space-y-3 p-5">
        <div className={`h-6 w-3/4 ${bar}`} />
        <div className={`h-4 w-1/2 ${bar}`} />
        <div className="flex items-center justify-between pt-3">
          <div className={`h-8 w-20 ${bar}`} />
          <div className={`h-9 w-28 rounded-full ${bar}`} />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading studios">
      {Array.from({ length: count }, (_, i) => <StudioCardSkeleton key={i} />)}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4 rounded-2xl border border-base-300 p-4">
          <div className={`h-24 w-32 shrink-0 ${bar}`} />
          <div className="flex-1 space-y-3"><div className={`h-5 w-2/3 ${bar}`} /><div className={`h-4 w-1/2 ${bar}`} /><div className={`h-4 w-1/3 ${bar}`} /></div>
        </div>
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="container-x py-10" role="status" aria-label="Loading studio">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className={`aspect-[16/9] w-full rounded-2xl ${bar}`} />
          <div className={`h-9 w-2/3 ${bar}`} />
          <div className={`h-4 w-1/3 ${bar}`} />
          <div className={`h-32 w-full ${bar}`} />
        </div>
        <div className={`h-72 rounded-2xl ${bar}`} />
      </div>
    </div>
  );
}
