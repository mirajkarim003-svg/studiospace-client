import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Step 1 of Challenge 1: the logged-in user (Better Auth session) asks for a 60 second
// "exchange" token. The browser hands it to the Express server, which verifies it with the
// shared JWT_SECRET and answers with an HTTPOnly session cookie.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  if (!process.env.JWT_SECRET) return NextResponse.json({ message: "JWT_SECRET is not configured." }, { status: 500 });

  const { email, name, image } = session.user;
  const token = jwt.sign({ email: email.toLowerCase(), name, image: image || "" }, process.env.JWT_SECRET, {
    audience: "studiospace-exchange",
    expiresIn: "60s",
  });
  return NextResponse.json({ token });
}
