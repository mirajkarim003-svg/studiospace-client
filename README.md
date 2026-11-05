# StudioSpace (client)

**Peer-to-peer creative workspace and production studio sharing platform.**

- Live site: `https://YOUR-SITE.vercel.app` (replace after you deploy)
- Server repo: `https://github.com/YOUR-USERNAME/studiospace-server`

## Features

- Browse, search, filter and sort studios (photo studios, film stages, podcast rooms, music suites, art workshops) with pagination
- Home page with a 3-slide Swiper hero, 6 featured studios loaded from MongoDB, clickable category cards and "How booking works" / "Host guarantee" sections
- Studio details page with gallery carousel, amenities, host info, reviews and a booking modal that shows already confirmed slots
- Full CRUD for studios: add, update, delete (with confirmation modal), "My Studio Listings" table
- Booking system with Pending / Confirmed / Completed / Cancelled statuses, host approval page and PDF receipts
- Authentication with Better Auth (email + password, Google login), password rules, private routes that survive page reload
- JWT in HTTPOnly cookies, double-booking prevention, light/dark theme toggle, saved-studios wishlist
- Toasts (react-hot-toast) and custom modals everywhere, skeleton loaders, empty states, custom 404 page, fully responsive

## Tech stack

Next.js 15 (App Router, JavaScript), Tailwind CSS + DaisyUI, Better Auth (MongoDB adapter), JWT, Swiper, react-hot-toast, react-icons, jsPDF. Server: Express + MongoDB (separate repo).

## Run locally

1. Start the server first (see the server README).
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values (MongoDB URI, secrets, `API_URL`).
4. `npm run seed:demo-user` (creates the examiner account in your database)
5. `npm run dev` and open http://localhost:3000

## Examiner test credentials

| Email | Password |
| --- | --- |
| examiner@studiospace.com | Examiner123 |

This account hosts three seeded studios (so My Listings, Booking Requests and Dashboard have data) and can also book the other hosts' studios.

## Deploy

Deploy on Vercel with the root directory set to this folder, add every variable from `.env.example` (set `API_URL` to your Render URL and `BETTER_AUTH_URL` to your Vercel URL). Full guide in the main README.
