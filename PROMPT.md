# Build: Wedding Bingo Card Generator

Build a single-page web app where anyone can create a wedding bingo card by entering the couple's names, the wedding date, and their 16 predictions. Generates a downloadable 4x4 bingo card as a PNG. Reusable for any wedding.

## Tech stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **PNG export:** `html-to-image` (npm package) — render the card to a hidden DOM node, convert to PNG, trigger download
- **Deployment target:** Vercel (so keep it static / client-side; no backend or DB needed)
- **No auth, no persistence** — everything happens in the browser

## User flow
1. **Landing screen:** brief intro ("Wedding Bingo — fill in your predictions, get your card") + "Start" button
2. **Wedding details screen:** three inputs
   - Partner 1 name (free text)
   - Partner 2 name (free text)
   - Wedding date (date picker)
   - Guest's name (free text, optional — appears on the card)
3. **Predictions form:** 16 questions (see below). Mix of multiple-choice (radio buttons) and free-text inputs. Show all questions on one scrollable page with clear section dividers — works best on mobile.
4. **Card preview screen:** shows the generated 4x4 bingo card with the couple's names, date, guest name, and predictions. Buttons: "Download PNG", "Edit answers", and "Start over" (resets everything for a new wedding).

## The 16 questions
Each square on the bingo card corresponds to one answer. For multiple-choice questions, the user picks one option. For free-text, they type a short answer (cap at ~30 chars to fit on the card).

### Partner 1 (label dynamically with Partner 1's name, e.g. "What Sarah does")
1. **[Partner 1] cries during vows?** — Yes / No
2. **[Partner 1]'s first words at altar** — "Wow" / "You look beautiful" / "Hi" / Other (free text)
3. **[Partner 1] forgets a line in vows or speech?** — Yes / No
4. **[Partner 1] mentions sports in their speech?** — Yes / No

### Partner 2 (label dynamically with Partner 2's name)
5. **[Partner 2] cries walking down the aisle?** — Yes / No
6. **[Partner 2]'s first words to [Partner 1]** — "Hi" / "I love you" / A joke / Other (free text)
7. **[Partner 2] mentions their parents in vows/speech?** — Yes / No
8. **[Partner 2] changes outfits during reception?** — Yes / No

### The Look
9. **Outfit style** — Open back / Mermaid / Ballgown / Minimalist / Two-piece / Suit / Other
10. **Hair** — Up / Down / Half-up
11. **Suit / second outfit color** — Black / Navy / Grey / Cream / Patterned / Other
12. **Bouquet brand or florist** — Free text

### Reception
13. **Walk-in song (title or artist)** — Free text
14. **First dance song (title or artist)** — Free text
15. **First speech goes over 5 minutes?** — Yes / No
16. **Surprise performance (someone sings/dances/plays)?** — Yes / No

**Note:** The questions reference "Partner 1" and "Partner 2" so the app stays gender-neutral and reusable. Substitute the actual names entered in step 2 when rendering the form labels.

## Bingo card design
- 4x4 grid, square cells
- Each cell shows: a short label (the question shortened) at the top in small text, and the user's answer in larger text below
- Title bar at top: "WEDDING BINGO" + "[Partner 1] & [Partner 2]" + formatted wedding date (e.g. "12 May 2026")
- Footer: guest's name if provided (e.g. "Tod's card")
- Style: clean, elegant, wedding-appropriate. Cream/off-white background, serif headings (e.g. Playfair Display from Google Fonts), thin gold or charcoal borders. Don't make it look like a Vegas bingo hall.
- Card should render at a fixed pixel size (e.g. 1200x1200) when exporting to PNG so it's high-res for sharing
- On screen, scale it responsively so it fits mobile

## Other requirements
- **Mobile-first** — most guests will fill this in on their phones
- **Validation:** require Partner 1 name, Partner 2 name, and wedding date before proceeding to the form. Require all 16 predictions before enabling "Generate card".
- Default free-text "Other" options to a placeholder so the card never has empty cells
- **Shuffle the order of the 16 squares on the bingo card per user** (so cards differ between guests) — keep the question order in the form fixed for usability, but randomize the grid layout when rendering the card. Use the guest's name (if provided) as a seed so the same person gets the same card layout if they regenerate.
- Define the 16 question objects in a constants file (`questions.ts` or similar) so they're easy to edit in one place

## What I want back
- Full working Next.js project, ready to `npm install && npm run dev`
- Clean component structure (e.g. `WeddingDetailsForm`, `PredictionsForm`, `BingoCard`, `CardPreview`)
- Comments only where non-obvious
- A README with: how to run locally, how to edit the questions, how to deploy to Vercel
- No tests needed

Build it.
