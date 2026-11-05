"use client";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import PageHeader from "@/components/PageHeader";
import StudioCard from "@/components/StudioCard";
import EmptyState from "@/components/EmptyState";
import CategoryIcon from "@/components/CategoryIcon";
import { CardGridSkeleton } from "@/components/Skeletons";
import { CATEGORIES } from "@/lib/constants";
import { useApi } from "@/lib/useApi";

const SORTS = [
  ["newest", "Newest first"],
  ["rating", "Top rated"],
  ["priceLow", "Price: low to high"],
  ["priceHigh", "Price: high to low"],
];
const PRICES = [["", "Any price"], ["50", "Up to $50 / hr"], ["100", "Up to $100 / hr"], ["200", "Up to $200 / hr"]];

function Explore() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = sp.get("category") || "all";
  const sort = sp.get("sort") || "newest";
  const search = sp.get("search") || "";
  const maxPrice = sp.get("maxPrice") || "";
  const page = Number(sp.get("page") || 1);

  // The URL is the single source of truth: category cards on Home link here with ?category=...
  const setParams = (patch) => {
    const p = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v == null || v === "all" || (k === "sort" && v === "newest") || (k === "page" && Number(v) === 1)) p.delete(k);
      else p.set(k, v);
    });
    if (!("page" in patch)) p.delete("page");
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const [q, setQ] = useState(search);
  useEffect(() => setQ(search), [search]);
  useEffect(() => {
    const t = setTimeout(() => q.trim() !== search && setParams({ search: q.trim() }), 450);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const query = new URLSearchParams({ limit: "9", page: String(page), sort });
  if (search) query.set("search", search);
  if (category !== "all") query.set("category", category);
  if (maxPrice) query.set("maxPrice", maxPrice);
  const { data, loading, error, reload } = useApi(`/studios?${query}`);

  const filtered = search || category !== "all" || maxPrice;
  const clear = () => { setQ(""); router.replace(pathname, { scroll: false }); };

  return (
    <>
      <PageHeader title="Explore studios" subtitle="Search every space on StudioSpace, then filter by category, price and rating." />
      <div className="container-x py-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search studios</span>
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/50" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city or amenity" className="input input-bordered w-full rounded-full pl-12 pr-10" />
            {q && <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-base-200" aria-label="Clear search"><FiX /></button>}
          </label>
          <select value={maxPrice} onChange={(e) => setParams({ maxPrice: e.target.value })} className="select select-bordered rounded-full" aria-label="Maximum price">
            {PRICES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={sort} onChange={(e) => setParams({ sort: e.target.value })} className="select select-bordered rounded-full" aria-label="Sort studios">
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button onClick={() => setParams({ category: "all" })} className={`btn btn-sm rounded-full ${category === "all" ? "btn-primary" : "btn-outline"}`}>All studios</button>
          {CATEGORIES.map((c) => (
            <button key={c.value} onClick={() => setParams({ category: c.value })} className={`btn btn-sm gap-2 rounded-full ${category === c.value ? "btn-primary" : "btn-outline"}`}>
              <CategoryIcon name={c.icon} className="h-4 w-4" />{c.label}
            </button>
          ))}
        </div>

        {loading && !data ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <EmptyState title="We could not load the studios" text={error} actionLabel="Try again" onAction={reload} />
        ) : data.studios.length === 0 ? (
          <EmptyState title="No studios match your search" text="Try a different keyword, a wider price range or another category." actionLabel="Clear all filters" onAction={clear} />
        ) : (
          <>
            <p className="mb-5 text-sm text-base-content/70">{data.total} studio{data.total !== 1 ? "s" : ""} found{filtered ? " for your filters" : ""}</p>
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
              {data.studios.map((s) => <StudioCard key={s._id} studio={s} />)}
            </div>
            {data.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="join">
                  <button className="btn join-item" disabled={page <= 1} onClick={() => setParams({ page: page - 1 })}>Previous</button>
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                    <button key={n} className={`btn join-item ${n === page ? "btn-primary" : ""}`} onClick={() => setParams({ page: n })} aria-current={n === page ? "page" : undefined}>{n}</button>
                  ))}
                  <button className="btn join-item" disabled={page >= data.pages} onClick={() => setParams({ page: page + 1 })}>Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="container-x py-16"><CardGridSkeleton /></div>}>
      <Explore />
    </Suspense>
  );
}
