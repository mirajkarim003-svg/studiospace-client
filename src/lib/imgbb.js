// Optional image upload to imgbb. Needs NEXT_PUBLIC_IMGBB_KEY in .env.local
export const imgbbEnabled = Boolean(process.env.NEXT_PUBLIC_IMGBB_KEY);

export async function uploadToImgbb(file) {
  if (!imgbbEnabled) throw new Error("Image upload is not configured. Paste an image URL instead.");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5 MB.");
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.data?.url) throw new Error(json?.error?.message || "Image upload failed. Please try again.");
  return json.data.url;
}
