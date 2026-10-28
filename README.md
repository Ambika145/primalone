# PrimalOne homepage

React 18 + Bootstrap 5 (reboot, grid, utilities) + custom CSS, built with Vite.
Copy comes from `PrimalOne_Homepage_Final_Content.md` (v3) and lives in `src/data/content.js`.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve dist/
npm run images     # regenerate public/img from assets/ (after adding new photography)
```

## Structure

- `src/data/content.js`: all copy, prices, FAQ, links. Edit copy here, not in components.
- `src/components/`: one component (and stylesheet) per section: `AnnouncementBar`, `Navbar`, `Hero`, `Sequence`, `WhySequence`, `DayLine`, `Benefits`, `Learn`, `EarlySignal`, `Shop`, `Faq`, `FinalCta`, `Footer`, `CartDrawer`, `StickyBuyBar`; shared pieces in `components/ui/`.
- `src/context/CartContext.jsx`: cart state (saved in localStorage) and pack-size selection.
- `src/hooks/motion.js`: in-view, parallax, scroll-progress and reduced-motion hooks.
- `src/styles/base.css`: design tokens, type, buttons, reveal animations.
- `scripts/optimize-images.mjs`: converts `assets/*.png` into responsive WebP, the light/dark logo variants, `og-image.jpg` and `favicon.png`. The originals in `assets/` are never modified.

## Before launch

- Resolve every yellow **To confirm** tag, then set `SHOW_REVIEW_TAGS = false` in `src/data/content.js`.
- The pages in `routes` (`src/data/content.js`) do not exist yet: product label pages, shipping, returns, contact, journal, privacy and terms.
- Checkout is disabled in the cart drawer until the store/payment integration is connected.
- The Early signal section must only go live if the brief's launch gate is met (current formulas and written participant consent).
- `PrimalOne_Homepage_Revamp.html` is the previous static draft, kept for reference.
