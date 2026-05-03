# Wedding Bingo

A single-page web app for making a wedding-day bingo card. Enter the couple's
names, the date, and your 16 predictions — get a downloadable 4x4 PNG. No
accounts, no backend, no database; everything runs in the browser.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Build the production bundle with:

```bash
npm run build
npm run start
```

## How it works

The flow is four steps, all client-side:

1. **Landing** — intro and a Start button
2. **Wedding details** — Partner 1, Partner 2, date, optional guest name
3. **Predictions** — 16 questions on one scrollable page
4. **Preview** — generated 4x4 card with **Download PNG**, **Edit answers**, **Start over**

The PNG is rendered from a hidden 1200×1200 DOM node using
[`html-to-image`](https://www.npmjs.com/package/html-to-image), so the export
stays high-res even though the on-screen card is scaled to fit the device.

The 16 squares are shuffled per guest using a deterministic seed
(`guest|partner1|partner2|date`) so the same person regenerating gets the same
layout, but two different guests at the same wedding get different cards.

## Editing the questions

All 16 questions live in [`lib/questions.ts`](./lib/questions.ts) as a single
array. Each entry has:

- `id` — unique key (used for state and shuffle stability)
- `section` — one of `partner1`, `partner2`, `look`, `reception`
- `prompt` — full question text shown in the form. Use `{p1}` and `{p2}` to
  substitute the partner names entered by the user.
- `shortLabel` — short version that appears at the top of the bingo cell. Same
  `{p1}`/`{p2}` placeholders.
- `type` — `"yesno"`, `"choice"`, or `"text"`
- `choices` — for `choice` type, an array of options. Including `"Other"`
  enables a free-text fallback.
- `placeholder` — fallback text shown on the card if the answer is empty
  (so cells never render blank)

Edit the array, save, and the form and card update automatically. Keep the
total at 16 — the card is a fixed 4×4 grid.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, click **Add New… → Project**, import the repo, and accept the
   defaults — Vercel auto-detects Next.js.
3. Click **Deploy**. No environment variables are needed.

Subsequent pushes to the main branch trigger an automatic redeploy.
