// Better Auth (server side). Runs inside Next.js route handlers only.
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";

// Re-use one Mongo connection in dev (hot reload creates modules many times)
const g = globalThis;
const client = g._studioMongo ?? new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
if (process.env.NODE_ENV !== "production") g._studioMongo = client;
const db = client.db(process.env.DB_NAME || "studiospace");

const googleReady = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, // assignment: after registering, send the user to the Login page
  },
  socialProviders: googleReady
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : {},
  hooks: {
    // Server-side copy of the password rules, so nobody can skip the form checks
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const pw = String(ctx.body?.password || "");
        if (!/[A-Z]/.test(pw)) throw new APIError("BAD_REQUEST", { message: "Password must include an uppercase letter." });
        if (!/[a-z]/.test(pw)) throw new APIError("BAD_REQUEST", { message: "Password must include a lowercase letter." });
      }
    }),
  },
});
