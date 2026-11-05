import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
// Creates the demo account used by examiners:  npm run seed:demo-user
import { config } from "dotenv";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const DEMO = {
  name: "Demo Examiner",
  email: "examiner@studiospace.com",
  password: "Examiner123",
  image: "https://ui-avatars.com/api/?name=Demo+Examiner&background=4a3cf0&color=fff&size=128",
};

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing. Fill in .env.local first.");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.DB_NAME || "studiospace")),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "seed-script-secret-not-used-for-login-0000000000",
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: false },
});

try {
  await client.connect();
  await auth.api.signUpEmail({ body: DEMO });
  console.log(`Demo user created: ${DEMO.email} / ${DEMO.password}`);
} catch (e) {
  if (/exist/i.test(e?.message || "") || /exist/i.test(e?.body?.message || "")) console.log("Demo user already exists. Nothing to do.");
  else { console.error("Could not create the demo user:", e?.body?.message || e.message); process.exitCode = 1; }
} finally {
  await client.close();
}
