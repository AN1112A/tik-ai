# Tikkurila AI Decorating Assistant 🎨

An embeddable AI chatbot that helps customers find the perfect paint products for their decorating needs. Includes a static JSON knowledge base hosted on **GitHub Pages** (optionally fronted by jsDelivr).

## 🚀 What's New

✅ **Complete AI Chatbot** - Interactive assistant that discusses decorating needs  
✅ **Embeddable Widget** - Beautiful chat interface for any webpage  
✅ **Smart Recommendations** - Matches FAQs and routing rules to customer queries  
✅ **Modern UI** - Responsive design with Tikkurila branding

## Quick Start

### Try the Chatbot Demo

1. Open `demo/chatbot.html` in your browser to see the full interactive demo
2. Or open `demo/simple-embed.html` for a minimal integration example

### Deploy to GitHub Pages

1. Create a **public** repo (e.g., `tikkurila-kb`).
2. Copy these files into the repo.
3. Push to `main`.
4. In GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (already configured via the included workflow).
5. Visit your Pages URL (e.g., `https://<org>.github.io/<repo>/demo/chatbot.html`).

### Optional: jsDelivr CDN
Use `https://cdn.jsdelivr.net/gh/<org>/<repo>@<tag>/kb/v1/index.json` for fast global delivery.
Tag releases (`v1.0.0`, `v1.0.1`, …) for immutable caching.

## Structure

```
/kb/v1/              # Knowledge base (static JSON)
  index.json         # KB index + chunk list
  rules.json         # routing rules (rooms → products)
  faqs.json          # frequently asked questions
  fallback.json      # contact options
  /products/         # product data by category
    interior.json
    exterior.json
    primers.json
    specialist.json

/src/                # Chatbot source code
  kb-loader.mjs      # KB data loader
  ai-agent.mjs       # AI logic for responses
  chat-widget.mjs    # embeddable chat UI

/demo/               # Examples & demos
  chatbot.html       # interactive demo page
  simple-embed.html  # minimal integration example
  index.html         # KB data test page

/dist/               # Distribution files
  tikkurila-chat.js  # standalone embed script
```

## Embedding the Chatbot

Add this to your HTML page (before `</body>`):

```html
<script type="module">
  import { TikkilaChat } from './src/chat-widget.mjs';
  
  const chat = new TikkilaChat({
    baseUrl: '',  // Your KB base URL
    primaryColor: '#E30613'
  });
  
  await chat.initialize();
  chat.render();
</script>
```

See **[CHATBOT_README.md](CHATBOT_README.md)** for complete documentation, customization options, and integration examples.

## Notes

- Keep `index.json` small; put full product data in chunked files.
- Use **versioned paths** (`/kb/v1/…`) and long cache headers (Pages adds good caching; jsDelivr is CDN cached).
- For large files, parse in a **Web Worker** (you can adapt `kb-loader.mjs`).
- The chatbot uses ES modules - requires a modern browser or build step for older browsers.

