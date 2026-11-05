"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiPlus, FiUploadCloud } from "react-icons/fi";
import SafeImg from "./SafeImg";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import { imgbbEnabled, uploadToImgbb } from "@/lib/imgbb";
import { isValidUrl } from "@/lib/utils";

// Used by both "Add New Studio" and "Update Studio"
export default function StudioForm({ studio }) {
  const router = useRouter();
  const { user } = useAuth();
  const editing = Boolean(studio);

  const [f, setF] = useState({
    title: studio?.title || "",
    category: studio?.category || "",
    hourlyRate: studio?.hourlyRate ?? "",
    securityDeposit: studio?.securityDeposit ?? "",
    maxCapacity: studio?.maxCapacity ?? "",
    location: studio?.location || "",
    image: studio?.image || "",
    gallery: (studio?.gallery || []).join("\n"),
    amenities: studio?.amenities || [],
    overview: studio?.overview || "",
  });
  const [errors, setErrors] = useState({});
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErrors({ ...errors, [k]: "" }); };
  const toggleAmenity = (a) => setF({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] });
  const addCustom = () => {
    const v = custom.trim();
    if (v && !f.amenities.includes(v)) setF({ ...f, amenities: [...f.amenities, v] });
    setCustom("");
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setF((p) => ({ ...p, image: url }));
      setErrors((p) => ({ ...p, image: "" }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const validate = () => {
    const er = {};
    if (f.title.trim().length < 3) er.title = "Title must be at least 3 characters.";
    if (!f.category) er.category = "Please choose a category.";
    if (!(Number(f.hourlyRate) > 0)) er.hourlyRate = "Enter an hourly rate above $0.";
    if (f.securityDeposit === "" || Number(f.securityDeposit) < 0) er.securityDeposit = "Enter a deposit ($0 or more).";
    if (!Number.isInteger(Number(f.maxCapacity)) || Number(f.maxCapacity) < 1) er.maxCapacity = "Capacity must be a whole number, 1 or more.";
    if (f.location.trim().length < 3) er.location = "Please enter the studio address.";
    if (!isValidUrl(f.image.trim())) er.image = "Enter a valid image URL (https://...) or upload one.";
    const badGallery = f.gallery.split("\n").map((s) => s.trim()).filter(Boolean).find((u) => !isValidUrl(u));
    if (badGallery) er.gallery = `This gallery link is not a valid URL: ${badGallery}`;
    if (f.overview.trim().length < 20) er.overview = "Overview must be at least 20 characters.";
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return toast.error("Please fix the highlighted fields.");
    setBusy(true);
    const body = {
      title: f.title.trim(), category: f.category, hourlyRate: Number(f.hourlyRate), securityDeposit: Number(f.securityDeposit),
      maxCapacity: Number(f.maxCapacity), location: f.location.trim(), image: f.image.trim(),
      gallery: f.gallery.split("\n").map((s) => s.trim()).filter(Boolean), amenities: f.amenities, overview: f.overview.trim(),
    };
    try {
      const r = editing ? await api(`/studios/${studio._id}`, { method: "PUT", body }) : await api("/studios", { method: "POST", body });
      toast.success(r.message);
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  };

  const field = (id, label, input, hint) => (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      {input}
      {hint && !errors[id] && <p className="mt-1 text-xs text-base-content/60">{hint}</p>}
      {errors[id] && <p className="field-error">{errors[id]}</p>}
    </div>
  );
  const cls = (k) => `input input-bordered w-full ${errors[k] ? "input-error" : ""}`;

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">{field("title", "Studio title", <input id="title" value={f.title} onChange={set("title")} className={cls("title")} placeholder="e.g. Northlight Cyc Wall Studio" />)}</div>
        {field("category", "Category", (
          <select id="category" value={f.category} onChange={set("category")} className={`select select-bordered w-full ${errors.category ? "select-error" : ""}`}>
            <option value="">Choose a category</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.value}</option>)}
          </select>
        ))}
        {field("location", "Location / address", <input id="location" value={f.location} onChange={set("location")} className={cls("location")} placeholder="Street, city, state" />)}
        {field("hourlyRate", "Hourly rate ($)", <input id="hourlyRate" type="number" min="1" step="0.5" value={f.hourlyRate} onChange={set("hourlyRate")} className={cls("hourlyRate")} placeholder="45" />)}
        {field("securityDeposit", "Security deposit ($)", <input id="securityDeposit" type="number" min="0" value={f.securityDeposit} onChange={set("securityDeposit")} className={cls("securityDeposit")} placeholder="100" />)}
        {field("maxCapacity", "Max capacity (people)", <input id="maxCapacity" type="number" min="1" step="1" value={f.maxCapacity} onChange={set("maxCapacity")} className={cls("maxCapacity")} placeholder="10" />)}
        <div className="grid gap-5 sm:grid-cols-2 md:col-span-2">
          <div>
            <label className="field-label" htmlFor="host-name">Host name</label>
            <input id="host-name" readOnly value={user?.name || ""} className="input input-bordered w-full cursor-not-allowed bg-base-200" />
          </div>
          <div>
            <label className="field-label" htmlFor="host-email">Host email</label>
            <input id="host-email" readOnly value={user?.email || ""} className="input input-bordered w-full cursor-not-allowed bg-base-200" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          {field("image", "Main image URL", <input id="image" value={f.image} onChange={set("image")} className={cls("image")} placeholder="https://..." />)}
          {imgbbEnabled && (
            <label className="btn btn-outline btn-sm mt-3 rounded-full">
              {uploading ? <span className="loading loading-spinner loading-xs" /> : <FiUploadCloud />}
              Upload from device
              <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
            </label>
          )}
          <div className="mt-4">
            {field("gallery", "More gallery images (optional)", <textarea id="gallery" rows={3} value={f.gallery} onChange={set("gallery")} className={`textarea textarea-bordered w-full ${errors.gallery ? "textarea-error" : ""}`} placeholder="One image URL per line" />, "These appear in the gallery carousel on your studio page.")}
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-base-300 bg-base-200">
          <SafeImg src={isValidUrl(f.image.trim()) ? f.image.trim() : ""} alt="Studio preview" category={f.category || "Studio"} className="h-full w-full object-cover" />
        </div>
      </div>

      <fieldset>
        <legend className="field-label">Amenities</legend>
        <div className="flex flex-wrap gap-2">
          {[...new Set([...AMENITIES, ...f.amenities])].map((a) => {
            const on = f.amenities.includes(a);
            return (
              <button type="button" key={a} onClick={() => toggleAmenity(a)} aria-pressed={on} className={`btn btn-sm rounded-full ${on ? "btn-primary" : "btn-outline"}`}>{a}</button>
            );
          })}
        </div>
        <div className="mt-3 flex max-w-sm gap-2">
          <input value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} placeholder="Add your own amenity" className="input input-bordered input-sm w-full rounded-full" />
          <button type="button" onClick={addCustom} className="btn btn-sm rounded-full"><FiPlus />Add</button>
        </div>
      </fieldset>

      {field("overview", "Detailed overview", <textarea id="overview" rows={6} value={f.overview} onChange={set("overview")} className={`textarea textarea-bordered w-full ${errors.overview ? "textarea-error" : ""}`} placeholder="Describe the space, the gear included, house rules and how to get there." />)}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => router.back()} className="btn btn-ghost rounded-full" disabled={busy}>Cancel</button>
        <button className="btn btn-primary rounded-full px-8" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />}
          {editing ? "Save changes" : "Publish studio"}
        </button>
      </div>
    </form>
  );
}
