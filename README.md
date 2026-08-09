# PürInstinct Games — Supplier Order & Pricing

Interactive supplier order and pricing request tool. Digitizes the
supplier pricing brief into a live, editable, multi-page document with
PDF export.

## Architecture

- `lib/data.ts` — static seed content: zone names, stats, segmentation
  notes, accent colors, default item lists. Never written to at runtime.
- `lib/types.ts` — shared types (`Zone`, `ItemRow`, `CoverData`, ...).
- `lib/firebase.ts` — Firebase app/Firestore/Storage/Auth init from
  `NEXT_PUBLIC_FIREBASE_*` env vars (see `.env.local.example`). Silent
  anonymous auth gives every visitor a stable uid — no visible login.
- `lib/store.tsx` — the app's state. Subscribes to Firestore in real
  time (`cover/main` doc + one `zones/{slug}` doc per zone) so every
  visitor sees the same live document. Edits are optimistic locally and
  debounce-written to Firestore (~300ms).
- `lib/imageStorage.ts` — uploads cropped photos to Firebase Storage and
  returns a download URL; Firestore documents only ever hold that URL,
  never the raw image, to stay well under Firestore's 1 MiB/document
  limit.
- `components/PhotoUpload.tsx` / `CoverImageUpload.tsx` — photo upload
  with crop/reposition (`react-easy-crop`), locked to a fixed aspect
  ratio per slot (21:9 for zone photos, 4:3 for the cover). The original
  upload is kept alongside the cropped result so repositioning later
  doesn't lose quality.
- `components/RoadmapApp`-equivalent — `app/page.tsx` + `components/*`
  render the 10-page document and drive PDF export via `html2canvas` +
  `jsPDF`.

## Firebase setup (one-time, per environment)

This app is unusable without Firebase configured — there is no local
fallback persistence. Until you complete this, edits are kept in memory
only and are lost on refresh (a red banner in the app says so).

1. [console.firebase.google.com](https://console.firebase.google.com) →
   Add project → enable **Firestore** (production mode), **Storage**,
   and **Authentication → Sign-in method → Anonymous**.
2. Project settings → Add app → Web → copy the config into `.env.local`
   (local) and into Vercel → Project → Settings → Environment Variables
   (production) — see `.env.local.example` for the exact keys.
3. `npx firebase-tools login` (interactive) once, then create
   `.firebaserc` with your real project id:
   ```json
   { "projects": { "default": "your-project-id" } }
   ```
4. Deploy the security rules:
   ```bash
   npx firebase-tools deploy --only firestore:rules,storage
   ```

Editing is intentionally open to anyone with the link — no passcode
gate. `firestore.rules` / `storage.rules` only require the (silent,
anonymous) auth session to exist, mainly to keep the database from
being a fully public write target for random scripts.

## Development

```bash
npm run dev
```

Run `npm run build` before pushing — TypeScript strict must pass.
