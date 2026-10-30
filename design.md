# Design: Daydreamer

Shared system for the existing personal portfolio. Preserve real works, routes, scripts and truthful descriptions. Publication remains GitHub Pages.

## System
- Hallmark v2.0.0, editorial, Studio (dealt 3/3).
- Cool proof paper, blue-black ink, true-colour photography, quiet typography.
- No decorative background grid, fake measurement guides or status dots: this is a personal portfolio, not a typesetting demonstration.
- Homepage: compact portfolio index, one dominant photograph, an adjacent secondary image and film entry. All destinations remain separate pages.
- Other pages: photography catalogue and album viewer; paired design projects; case-study gallery; working film player; personal profile.
- `dist/tokens.css` is the palette, font and shared scale source. Reuse `--paper`, `--ink`, `--muted`, `--line`, `--page` aliases.

## Type and space
- Display: locally served Hedvig Letters Serif 400, Songti SC fallback for Chinese.
- Body: locally served Geist 400/500 with PingFang SC fallback.
- H1 48–84px, section head 32–52px, item 24–28px, body 16px, captions and controls 14px.
- No tracked all-caps labels, eyebrows or decorative arrow suffixes. Identifying facts may be captions below an image or a factual paragraph.
- Column gap 32px desktop / 16px phone. Rhythm uses tokens; only contextual spacing, not giant empty sections.
- Main container capped at 1320px; 48px desktop outer margins, 24px tablet and 20px phone.

## Controls and imagery
- Underline or a subtle surface change for hover, no image zoom or floating cards.
- Primary: 48px, blue-black fill and paper text; secondary: text or fine outline.
- Focus instantly visible. Min 44px targets on small controls.
- Main photography remains in original colour. No generated imagery or new artwork.
- Dialog viewers use viewer tokens and retain keyboard arrows, Escape, swipe and focus restoration.
- Native video controls, no autoplay. Preserve posters, sources and switching logic.

## Exceptions to marketing-page heuristics
- This is a compact multipage portfolio: do not add landing-page sections, metrics or CTA filler.
- Image-viewer buttons are intentionally image-sized. Albums are photographic galleries by purpose.
- Product concept pages retain brand names and source/rights statements verbatim.
- `waist-demo.html`, `waist.css`, `waist.js` are the existing interactive product demo with its own visual system; preserve it.

## Motion and exports
- Calm, still composition. Only control press states; reduced-motion fallback applies throughout.
- `dist/tokens.css`, `dist/base.css`, `dist/styles.css`, `dist/design.css`.
