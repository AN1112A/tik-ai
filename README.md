# Tikkurila AI Decorating Assistant 🎨

An embeddable, AI-powered chatbot that helps customers choose the right paint products for their decorating projects.

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

## 🤖 AI Chatbot Integration

This repository now includes a **complete embeddable chatbot** that you can add to any website!

### ⚡ Quick Start

```html
<script type="module">
  import { TikkurilaChatbot } from './src/chatbot-widget.js';
  
  const chatbot = new TikkurilaChatbot({
    baseUrl: window.location.origin,
    primaryColor: '#0066cc'
  });
  
  await chatbot.init();
</script>
```

### ✨ Features

- 🤖 **AI-Powered** - Optional OpenAI/Anthropic integration for natural conversations
- 📚 **Knowledge Base** - Uses your FAQs, products, and routing rules
- 🎯 **Smart Recommendations** - Matches customer needs to the right products
- 🎨 **Fully Customizable** - Match your brand colors and style
- 📱 **Responsive** - Works beautifully on all devices
- ⚡ **Lightweight** - Fast loading, minimal dependencies

### 📖 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- **[Full Documentation](CHATBOT_README.md)** - Complete chatbot documentation
- **[Demo](demo/chatbot-demo.html)** - See it in action
- **[Examples](examples/)** - Integration examples and customization

### 🎯 Example Uses

Try asking the chatbot:
- "What paint should I use in my bathroom?"
- "Best ceiling paint to hide roller marks?"
- "I need durable paint for my hallway"
- "What's good for exterior wood?"

### 📁 Complete Structure

```
/
├── src/
│   ├── chatbot-widget.js      # Main chatbot UI component
│   ├── chatbot-engine.js      # AI/logic engine
│   └── kb-loader.mjs          # KB loader utility
├── kb/v1/
│   ├── index.json             # KB index + chunk list
│   ├── rules.json             # Routing rules
│   ├── faqs.json              # FAQs (15+ questions)
│   ├── fallback.json          # Help links
│   └── products/
│       ├── interior.json      # 8 interior products
│       ├── exterior.json      # 5 exterior products
│       ├── primers.json       # 4 primers
│       └── specialist.json    # 5 specialist products
├── demo/
│   ├── index.html             # KB demo
│   └── chatbot-demo.html      # Full chatbot demo
├── examples/
│   ├── basic-integration.html
│   ├── ai-powered-integration.html
│   └── custom-styling.html
├── embed.js                   # Easy embed script
├── QUICK_START.md            # 5-minute setup guide
└── CHATBOT_README.md         # Complete docs
```

## Notes
- Keep `index.json` small; put full product data in chunked files.
- Use **versioned paths** (`/kb/v1/…`) and long cache headers (Pages adds good caching; jsDelivr is CDN cached).
- For large files, parse in a **Web Worker** (you can adapt `kb-loader.mjs`).
- The chatbot works **without AI** using rule-based matching, or **with AI** for natural conversations.

