"use client";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import SafeImg from "./SafeImg";
import { useWishlist } from "@/context/WishlistContext";
import { money } from "@/lib/utils";

export default function StudioCard({ studio }) {
  const { ids, toggle } = useWishlist();
  const wished = ids.has(studio._id);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-base-300">
        <SafeImg src={studio.image} alt={studio.title} category={studio.category} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-md bg-neutral/90 px-2.5 py-1 text-xs font-semibold text-neutral-content backdrop-blur">{studio.category}</span>
        <button
          onClick={() => toggle(studio._id)}
          aria-label={wished ? `Remove ${studio.title} from wishlist` : `Save ${studio.title} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-base-100/90 shadow backdrop-blur transition hover:scale-110"
        >
          {wished ? <FaHeart className="h-4 w-4 text-error" /> : <FaRegHeart className="h-4 w-4" />}
        </button>
        <span className="tape-badge absolute bottom-3 left-3">
          <FaStar className="h-3 w-3" />
          {studio.reviewCount > 0 ? studio.rating.toFixed(1) : "New"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-1 font-display text-xl font-bold">{studio.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-base-content/70">
          <FiMapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p>
            <span className="text-2xl font-extrabold">{money(studio.hourlyRate)}</span>
            <span className="text-sm text-base-content/60"> / hr</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="btn btn-primary btn-sm rounded-full">View Details</Link>
        </div>
      </div>
    </article>
  );
}
