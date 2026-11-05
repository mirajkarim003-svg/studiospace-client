"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiCheck, FiMapPin, FiUsers, FiShield, FiEdit2 } from "react-icons/fi";
import SafeImg from "@/components/SafeImg";
import Avatar from "@/components/Avatar";
import StarRating from "@/components/StarRating";
import Reviews from "@/components/Reviews";
import BookingModal from "@/components/BookingModal";
import EmptyState from "@/components/EmptyState";
import { DetailsSkeleton } from "@/components/Skeletons";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useApi } from "@/lib/useApi";
import { money } from "@/lib/utils";

export default function StudioDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { ids, toggle } = useWishlist();
  const studioQ = useApi(`/studios/${id}`);
  const reviewsQ = useApi(`/studios/${id}/reviews`);
  const [bookOpen, setBookOpen] = useState(false);

  if (studioQ.loading && !studioQ.data) return <DetailsSkeleton />;
  if (studioQ.error || !studioQ.data) {
    return (
      <div className="container-x py-20">
        <EmptyState title="We could not find that studio" text="It may have been removed by its host." actionHref="/studios" actionLabel="Browse all studios" />
      </div>
    );
  }

  const studio = studioQ.data.studio;
  const isOwner = user?.email === studio.ownerEmail;
  const images = [...new Set([studio.image, ...(studio.gallery || [])])];
  const wished = ids.has(studio._id);

  const startBooking = () => {
    if (!user) {
      toast("Please log in to book this studio", { icon: "🔒" });
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }
    setBookOpen(true);
  };

  return (
    <div className="container-x py-10">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Swiper className="gallery-swiper overflow-hidden rounded-2xl bg-base-300" modules={[Navigation, Pagination, Keyboard]} navigation pagination={{ clickable: true }} keyboard>
            {images.map((src, i) => (
              <SwiperSlide key={src + i}>
                <div className="aspect-[16/10] w-full">
                  <SafeImg src={src} alt={`${studio.title} photo ${i + 1}`} category={studio.category} eager={i === 0} className="h-full w-full object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-md bg-neutral px-2.5 py-1 text-xs font-semibold text-neutral-content">{studio.category}</span>
              <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{studio.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-base-content/70"><FiMapPin className="shrink-0" />{studio.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <StarRating value={studio.rating} />
                <p className="mt-1 text-sm text-base-content/60">{studio.reviewCount ? `${studio.rating.toFixed(1)} from ${studio.reviewCount} reviews` : "No reviews yet"}</p>
              </div>
              <button onClick={() => toggle(studio._id)} aria-label={wished ? "Remove from wishlist" : "Save to wishlist"} className="btn btn-circle btn-outline">
                {wished ? <FaHeart className="text-error" /> : <FaRegHeart />}
              </button>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="mb-3 font-display text-2xl font-bold">About this space</h2>
            <p className="whitespace-pre-line leading-relaxed text-base-content/80">{studio.overview}</p>
          </section>

          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-bold">Amenities</h2>
            {studio.amenities?.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 rounded-xl bg-base-200 px-4 py-3"><FiCheck className="shrink-0 text-success" />{a}</li>
                ))}
              </ul>
            ) : <p className="text-base-content/70">The host has not listed amenities for this space yet.</p>}
          </section>

          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-bold">Your host</h2>
            <div className="flex items-center gap-4 rounded-xl border border-base-300 p-5">
              <Avatar src={studio.ownerPhoto} name={studio.ownerName} size={56} />
              <div>
                <p className="text-lg font-bold">{studio.ownerName}</p>
                <p className="text-sm text-base-content/60">Listed on {new Date(studio.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-bold">Reviews</h2>
            <Reviews studioId={studio._id} reviews={reviewsQ.data?.reviews || []} user={user} isOwner={isOwner}
              onChanged={() => { reviewsQ.reload(); studioQ.reload(); }} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg">
            <p><span className="text-4xl font-extrabold">{money(studio.hourlyRate)}</span><span className="text-base-content/60"> / hour</span></p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-3"><FiUsers className="text-primary" />Up to {studio.maxCapacity} people</li>
              <li className="flex items-center gap-3"><FiShield className="text-primary" />{money(studio.securityDeposit)} refundable security deposit</li>
              <li className="flex items-center gap-3"><FiMapPin className="text-primary" />{studio.location}</li>
            </ul>
            {isOwner ? (
              <Link href={`/studios/edit/${studio._id}`} className="btn btn-outline mt-6 w-full rounded-full"><FiEdit2 />Edit your listing</Link>
            ) : (
              <button onClick={startBooking} className="btn btn-primary mt-6 w-full rounded-full">Book Workspace Now</button>
            )}
            <p className="mt-3 text-center text-xs text-base-content/60">No payment is taken online. The host reviews and confirms your request first.</p>
          </div>
        </aside>
      </div>
      {!isOwner && <BookingModal open={bookOpen} onClose={() => setBookOpen(false)} studio={studio} />}
    </div>
  );
}
