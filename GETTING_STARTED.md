# Getting Started with Your Tikkurila AI Assistant 🚀

Welcome! Your AI decorating assistant is ready to help customers find the perfect paint products. Here's how to customize it with your data and deploy it.

## ✅ What's Already Built

- ✅ Complete AI chatbot with natural language understanding
- ✅ Beautiful, responsive chat widget
- ✅ Knowledge base loader and caching system
- ✅ Demo pages showing the chatbot in action
- ✅ Integration examples for various platforms

## 📝 Next Steps to Customize

### 1. Add Your Product Data

The chatbot currently has sample FAQs and rules, but the product databases are empty. You mentioned you have JSON files with product information - here's how to add them:

**Option A: Replace the existing files**
- Copy your product data into these files:
  - `kb/v1/products/interior.json` - Interior paints
  - `kb/v1/products/exterior.json` - Exterior paints
  - `kb/v1/products/primers.json` - Primers
  - `kb/v1/products/specialist.json` - Specialist products

**Option B: See the expected format**
- Look at `kb/v1/products/SAMPLE_PRODUCT_STRUCTURE.json` for the data structure
- Each product should have: name, category, description, features, rooms, surfaces, etc.

**Example product structure:**
```json
{
  "products": [
    {
      "name": "Product Name",
      "sku": "PROD-123",
      "category": "Interior",
      "description": "Product description...",
      "features": ["feature1", "feature2"],
      "rooms": ["bathroom", "kitchen"],
      "surfaces": ["walls", "ceiling"],
      "url": "https://www.tikkurila.co.uk/product-name"
    }
  ]
}
```

### 2. Add More FAQs

Edit `kb/v1/faqs.json` to add your frequently asked questions:

```json
{
  "faqs": [
    {
      "intent": "unique-intent-name",
      "question": "What customers ask?",
      "answer": "Your helpful answer with product recommendations",
      "links": {
        "pdp": "https://www.tikkurila.co.uk/product"
      },
      "lastUpdated": "2025-10-06"
    }
  ]
}
```

### 3. Configure Routing Rules

Edit `kb/v1/rules.json` to define room/surface → product mappings:

```json
{
  "routing": {
    "bathroom": {
      "preferRange": "Luja",
      "hint": "Moisture and mould resistance for humid rooms."
    },
    "ceiling": {
      "prefer": "Anti-Reflex White 2",
      "hint": "Ultra-matt finish minimizes roller marks."
    }
  }
}
```

### 4. Update Contact Information

Edit `kb/v1/fallback.json` with your real contact details:

```json
{
  "whatsapp": "https://wa.me/YOUR_NUMBER",
  "helpCentre": "https://your-help-centre-url.com",
  "message": "Your custom message for when the bot can't help"
}
```

### 5. Test Locally

1. **Start a local server** (required for ES modules):
   ```bash
   # Option 1: Python
   python -m http.server 8000
   
   # Option 2: Node.js
   npx serve
   
   # Option 3: PHP
   php -S localhost:8000
   ```

2. **Open the demo**:
   - Go to http://localhost:8000/demo/chatbot.html
   - Try asking questions like:
     - "What should I use in a bathroom?"
     - "What do I use on ceilings to hide roller marks?"
     - "I need help choosing paint for my kitchen"

3. **Check the browser console** for any errors

### 6. Deploy to Your Website

#### For WordPress:
Add to your theme's footer:
```php
<script type="module">
  import { TikkilaChat } from '<?php echo get_template_directory_uri(); ?>/js/chat-widget.mjs';
  const chat = new TikkilaChat({ baseUrl: '<?php echo site_url(); ?>' });
  await chat.initialize();
  chat.render();
</script>
```

#### For Static HTML:
Copy the code from `demo/simple-embed.html`:
```html
<script type="module">
  import { TikkilaChat } from './src/chat-widget.mjs';
  const chat = new TikkilaChat({ baseUrl: '' });
  await chat.initialize();
  chat.render();
</script>
```

#### For GitHub Pages:
1. Push this repo to GitHub
2. Enable GitHub Pages in Settings
3. Your chatbot will be live at `https://yourusername.github.io/repo-name/`

### 7. Customize the Appearance

Change the chatbot's colors to match your brand:

```javascript
const chat = new TikkilaChat({
  baseUrl: '',
  primaryColor: '#YOUR_BRAND_COLOR',  // Default: #E30613
  textColor: '#333333',
  backgroundColor: '#ffffff'
});
```

## 🎯 How the AI Works

The chatbot uses a multi-step approach to answer questions:

1. **Greeting Detection** - Welcomes new users
2. **FAQ Matching** - Searches FAQs for matching questions
3. **Rule Matching** - Applies routing rules for room/surface queries
4. **Product Search** - Searches product catalog
5. **Fallback** - Provides contact options if it can't help

You can customize this logic in `src/ai-agent.mjs` if needed.

## 📊 Current Knowledge Base Status

- ✅ FAQs: 2 sample questions configured
- ✅ Rules: 2 routing rules configured  
- ⚠️ Products: Empty - **needs your data**
- ✅ Fallback: Configured with sample contact info

## 🔧 Troubleshooting

**"Failed to load index.json"**
- Make sure you're running a local server (not opening HTML directly)
- Check that files exist in the `kb/v1/` directory

**Chat widget doesn't appear**
- Check browser console for errors
- Verify ES module support (use Chrome, Firefox, or Safari - not IE)
- Ensure script is placed before closing `</body>` tag

**Responses are always generic**
- Add more FAQs to `kb/v1/faqs.json`
- Add routing rules to `kb/v1/rules.json`
- Add product data to the product JSON files

**CORS errors**
- You must serve files from a web server (not `file://` protocol)
- Use one of the local server options mentioned above

## 📚 Further Reading

- **[CHATBOT_README.md](CHATBOT_README.md)** - Complete documentation
- **[README.md](README.md)** - Overview and deployment
- `demo/chatbot.html` - Interactive demo
- `demo/simple-embed.html` - Minimal integration example

## 🆘 Need Help?

If you run into issues:

1. Check the browser console for error messages
2. Review the demo pages to see working examples
3. Verify your JSON files have valid syntax (use JSONLint.com)
4. Make sure you're running a local web server for testing

## 🎉 You're Ready!

Once you've added your product data and FAQs, your AI assistant will be able to:
- Answer customer questions about decorating
- Recommend the right products for specific needs
- Guide users through room-by-room paint selection
- Provide links to product pages
- Escalate to human support when needed

Start by opening the demo and testing it out! 🚀
