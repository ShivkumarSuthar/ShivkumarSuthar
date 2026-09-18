# Shivkumar Suthar — Portfolio & Study

Personal portfolio for **Shivkumar Suthar** (MERN / Full-Stack), plus a **Study** workspace to save courses, track lesson progress, and practice JavaScript, React, and HTML/CSS in the browser.

**Live:** [shivkumar-suthar.vercel.app](https://shivkumar-suthar.vercel.app) (if deployed)

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4**
- **Auth.js** (NextAuth v5) — email/password + optional Google / Facebook SSO
- **MongoDB Atlas** (Mongoose) — users, courses, lessons, progress
- **Sandpack** — in-browser code practice

## Features

| Area | What you get |
|------|----------------|
| Portfolio | Home, CV, projects, recommendations, code samples |
| Study (`/study`) | Sign in, create courses, plan dates, mark lessons done |
| Practice | JS / React / HTML–CSS playgrounds per lesson |
| SEO | Metadata, sitemap, robots, Open Graph image |

## Prerequisites

- Node.js 20+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or any MongoDB URI)
- (Optional) Google OAuth client for “Continue with Google”

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit **`.env.local`** (single env file — do not commit it):

```env
# Required
AUTH_SECRET=          # openssl rand -base64 32
AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/shivkumar_study?retryWrites=true&w=majority

# Optional — site URL / SEO
APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional — Google SSO
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXT_PUBLIC_AUTH_GOOGLE=0   # set to 1 when ID + secret are set

# Optional — Facebook SSO
AUTH_FACEBOOK_ID=
AUTH_FACEBOOK_SECRET=
NEXT_PUBLIC_AUTH_FACEBOOK=0
```

### Auth URL (important)

`AUTH_URL` is the **site origin only** — not the Google callback path.

| Environment | `AUTH_URL` |
|-------------|------------|
| Local | `http://localhost:3000` (or `:3001` if that port is used) |
| Vercel | `https://shivkumar-suthar.vercel.app` |

Auth.js builds the callback as:  
`{AUTH_URL}/api/auth/callback/google`

### Google OAuth redirect URIs

In [Google Cloud Console](https://console.cloud.google.com/) → Credentials → OAuth client → **Authorized redirect URIs**, add:

```text
http://localhost:3000/api/auth/callback/google
https://shivkumar-suthar.vercel.app/api/auth/callback/google
```

(Match the port you actually use locally.)

## Scripts

```bash
npm run dev      # development (http://localhost:3000)
npm run build    # production build (uses .next-build so it won’t wipe a running next dev cache)
npm run start    # serve the production build
npm run lint     # ESLint
```

## Project structure (high level)

```text
src/
  app/                 # App Router pages + API routes
    study/             # Study UI (loading / error / layout)
    api/auth/          # Auth.js + register
    api/study/courses/ # Course CRUD
  auth.ts              # Auth.js config
  components/          # Portfolio + Study UI
  lib/mongodb.ts       # Mongoose models + connection
  data/portfolioData.ts
```

## Study usage

1. Open `/study`
2. Register or sign in (email, or Google if configured)
3. Create a course → add lessons (video / doc / article / practice)
4. Toggle lesson complete, set plan date, save progress (stored in MongoDB)

## Deploy (Vercel)

1. Push the repo and import the project on Vercel
2. Set the same env vars in the Vercel project settings (use production `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` with `https://`)
3. Ensure Atlas Network Access allows Vercel (or `0.0.0.0/0` for serverless)
4. Deploy

## License

Apache-2.0 (see package / source headers where applicable)
