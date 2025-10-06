# Tikkurila AI Decorating Assistant 🎨

An embeddable AI chatbot that helps customers find the perfect paint products for their decorating needs. The assistant uses your product knowledge base, FAQs, and routing rules to provide personalized recommendations.

## Features

✅ **Smart Product Recommendations** - Matches customer needs with the right products  
✅ **FAQ Integration** - Instant answers to common questions  
✅ **Room & Surface Specific** - Tailored advice for bathrooms, ceilings, trim, etc.  
✅ **Beautiful Modern UI** - Responsive design that works on desktop and mobile  
✅ **Easy to Embed** - Simple integration on any webpage  
✅ **Fully Customizable** - Adjust colors to match your brand  

## Demo

Open `demo/chatbot.html` in your browser to see the assistant in action!

## Quick Start

### Option 1: ES Module (Recommended)

Add this to your HTML page:

```html
<script type="module">
  import { TikkilaChat } from './src/chat-widget.mjs';
  
  const chat = new TikkilaChat({
    baseUrl: '',  // Base URL where your KB is hosted
    primaryColor: '#E30613'  // Your brand color
  });
  
  await chat.initialize();
  chat.render();
</script>
```

### Option 2: CDN / GitHub Pages

If you're hosting on GitHub Pages or a CDN:

```html
<script type="module">
  import { TikkilaChat } from 'https://your-domain.com/src/chat-widget.mjs';
  
  const chat = new TikkilaChat({
    baseUrl: 'https://your-domain.com',
    primaryColor: '#E30613'
  });
  
  await chat.initialize();
  chat.render();
</script>
```

## Configuration Options

```javascript
const chat = new TikkilaChat({
  baseUrl: '',              // Required: Base URL for your knowledge base
  primaryColor: '#E30613',  // Optional: Primary brand color (default: Tikkurila red)
  textColor: '#333333',     // Optional: Text color
  backgroundColor: '#ffffff' // Optional: Background color
});
```

## Architecture

### Components

1. **`src/kb-loader.mjs`** - Loads and caches the knowledge base data
2. **`src/ai-agent.mjs`** - AI logic for understanding queries and generating responses
3. **`src/chat-widget.mjs`** - The embeddable chat UI component

### Knowledge Base Structure

```
/kb/v1/
├── index.json          # KB index and chunk list
├── faqs.json          # Frequently asked questions
├── rules.json         # Routing rules (room → product mappings)
├── fallback.json      # Fallback contact options
└── products/
    ├── interior.json
    ├── exterior.json
    ├── primers.json
    └── specialist.json
```

## How It Works

1. **User asks a question** (e.g., "What should I use in a bathroom?")
2. **Agent analyzes the query** using:
   - FAQ matching for common questions
   - Routing rules for room/surface recommendations
   - Product search for specific items
3. **Generates a response** with product recommendations and links
4. **Displays in chat UI** with beautiful formatting

## Customization

### Changing the Theme

```javascript
const chat = new TikkilaChat({
  baseUrl: '',
  theme: {
    primaryColor: '#YOUR_COLOR',
    textColor: '#333333',
    backgroundColor: '#ffffff'
  }
});
```

### Adding More FAQs

Edit `kb/v1/faqs.json`:

```json
{
  "faqs": [
    {
      "intent": "kitchen-paint",
      "question": "What paint is best for kitchens?",
      "answer": "For kitchens, we recommend washable paints like Optiva...",
      "links": {
        "pdp": "https://www.tikkurila.co.uk/optiva"
      },
      "lastUpdated": "2025-10-06"
    }
  ]
}
```

### Adding Routing Rules

Edit `kb/v1/rules.json`:

```json
{
  "routing": {
    "kitchen": {
      "preferRange": "Optiva",
      "hint": "Washable and scrub-resistant for high-traffic areas."
    }
  }
}
```

### Adding Products

Edit the relevant product file in `kb/v1/products/`:

```json
{
  "products": [
    {
      "name": "Optiva Matt 7",
      "sku": "OPT-7",
      "category": "Interior",
      "description": "Premium washable matt paint",
      "rooms": ["kitchen", "hallway", "living-room"],
      "surfaces": ["walls"],
      "features": ["washable", "durable", "low-odor"],
      "url": "https://www.tikkurila.co.uk/optiva-matt-7"
    }
  ]
}
```

## Integration Examples

### WordPress

Add to your theme's `footer.php`:

```php
<script type="module">
  import { TikkilaChat } from '<?php echo get_template_directory_uri(); ?>/js/chat-widget.mjs';
  
  const chat = new TikkilaChat({
    baseUrl: '<?php echo site_url(); ?>',
    primaryColor: '#E30613'
  });
  
  await chat.initialize();
  chat.render();
</script>
```

### React

```jsx
import { useEffect } from 'react';
import { TikkilaChat } from './chat-widget.mjs';

function App() {
  useEffect(() => {
    const chat = new TikkilaChat({
      baseUrl: '',
      primaryColor: '#E30613'
    });
    
    chat.initialize().then(() => {
      chat.render();
    });
  }, []);

  return <div>Your app content...</div>;
}
```

### Shopify

Add to your theme's `theme.liquid`:

```liquid
<script type="module">
  import { TikkilaChat } from '{{ 'chat-widget.mjs' | asset_url }}';
  
  const chat = new TikkilaChat({
    baseUrl: '{{ shop.url }}',
    primaryColor: '#E30613'
  });
  
  await chat.initialize();
  chat.render();
</script>
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires ES6 module support. For older browsers, you may need to transpile with Babel.

## Development

### Local Testing

1. Start a local server (required for ES modules):
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

2. Open http://localhost:8000/demo/chatbot.html

### File Structure

```
.
├── src/
│   ├── kb-loader.mjs      # KB data loader
│   ├── ai-agent.mjs       # AI response generator
│   └── chat-widget.mjs    # Chat UI component
├── kb/v1/
│   ├── index.json         # KB index
│   ├── faqs.json         # FAQs database
│   ├── rules.json        # Routing rules
│   ├── fallback.json     # Fallback options
│   └── products/         # Product data
├── demo/
│   ├── chatbot.html      # Interactive demo
│   └── index.html        # KB test page
└── dist/
    └── tikkurila-chat.js # Embeddable script
```

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Enable GitHub Pages in Settings → Pages
3. Set source to "GitHub Actions"
4. Your KB will be available at: `https://username.github.io/repo-name/`

### CDN (jsDelivr)

1. Tag a release: `git tag v1.0.0 && git push --tags`
2. Access via: `https://cdn.jsdelivr.net/gh/username/repo@v1.0.0/src/chat-widget.mjs`

## Troubleshooting

### Chat widget doesn't appear

- Check browser console for errors
- Ensure ES modules are supported (use a modern browser)
- Verify `baseUrl` is correct
- Check that KB files are accessible (no CORS errors)

### "Failed to load index.json"

- Verify the KB files exist at the correct paths
- Check file permissions
- Ensure the server allows fetching JSON files

### Responses are generic/fallback only

- Check that FAQs and products are populated in the KB
- Verify routing rules are configured
- Add more product data to improve recommendations

## Support

For questions or issues:
- Check the FAQ in `kb/v1/faqs.json`
- Review the demo at `demo/chatbot.html`
- Contact: [Your support email/WhatsApp]

## License

[Your License Here]

---

Made with ❤️ for Tikkurila
