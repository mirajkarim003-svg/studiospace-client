"use client";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import StudioCard from "@/components/StudioCard";
import EmptyState from "@/components/EmptyState";
import { CardGridSkeleton } from "@/components/Skeletons";
import { useWishlist } from "@/context/WishlistContext";
import { useApi } from "@/lib/useApi";

function Saved() {
  const { data, loading, error, reload } = useApi("/wishlist");
  const { ids } = useWishlist();
  const studios = (data?.studios || []).filter((s) => ids.has(s._id)); // hearts removed here disappear instantly

  return (
    <>
      <PageHeader title="Saved studios" subtitle="Your wishlist of favorite spaces." />
      <div className="container-x py-10">
        {loading ? <CardGridSkeleton count={3} /> : error ? (
          <EmptyState title="We could not load your wishlist" text={error} actionLabel="Try again" onAction={reload} />
        ) : studios.length === 0 ? (
          <EmptyState title="Nothing saved yet" text="Tap the heart on any studio to keep it here." actionHref="/studios" actionLabel="Explore studios" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{studios.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
        )}
      </div>
    </>
  );
}

export default function WishlistPage() {
  return <PrivateRoute><Saved /></PrivateRoute>;
}
