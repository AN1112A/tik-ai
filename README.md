# Tikkurila KB (Static JSON) — GitHub Pages Starter

Host your chatbot knowledge base as static JSON on **GitHub Pages** (optionally fronted by jsDelivr).

## Quick start
1. Create a **public** repo (e.g., `tikkurila-kb`).
2. Copy these files into the repo.
3. Push to `main`.
4. In GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (already configured via the included workflow).
5. Visit your Pages URL (e.g., `https://<org>.github.io/<repo>/kb/v1/index.json`).

### Optional: jsDelivr CDN
Use `https://cdn.jsdelivr.net/gh/<org>/<repo>@<tag>/kb/v1/index.json` for fast global delivery.
Tag releases (`v1.0.0`, `v1.0.1`, …) for immutable caching.

## Structure
```
/kb/v1/
  index.json          # tiny index + chunk list (this loads first)
  rules.json          # routing rules (ceilings → AR2, bathrooms → Luja, etc.)
  faqs.json           # intent → answer → sources
  fallback.json       # WhatsApp, chat bubble message, help centre
  /products/
    interior.json     # split by category for lazy loading
    exterior.json
    primers.json
    specialist.json
/src/
  kb-loader.mjs       # tiny ES module to load/search the KB
/demo/
  index.html          # demo page wiring it together
```

## Notes
- Keep `index.json` small; put full product data in chunked files.
- Use **versioned paths** (`/kb/v1/…`) and long cache headers (Pages adds good caching; jsDelivr is CDN cached).
- For large files, parse in a **Web Worker** (you can adapt `kb-loader.mjs`).

