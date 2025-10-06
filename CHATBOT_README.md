# Tikkurila AI Decorating Assistant 🎨

An embeddable AI-powered chatbot for helping customers choose the right Tikkurila paint products for their decorating projects.

## ✨ Features

- **🤖 AI-Powered Conversations** - Optional integration with OpenAI or Anthropic for natural, contextual responses
- **📚 Knowledge Base Integration** - Uses your FAQs, product catalog, and routing rules
- **🎯 Smart Product Recommendations** - Matches customer needs to the right products
- **💬 Context-Aware** - Maintains conversation history for relevant follow-ups
- **🎨 Customizable Design** - Match your brand colors and positioning
- **📱 Fully Responsive** - Works beautifully on desktop, tablet, and mobile
- **⚡ Lightweight** - Fast loading, minimal dependencies
- **🔒 Privacy-First** - No data collection, client-side only

## 🚀 Quick Start

### Option 1: Basic Integration (No AI)

Add these two lines to your HTML:

```html
<script src="https://your-domain.github.io/your-repo/embed.js"></script>
<script>
  TikkurilaChat.init();
</script>
```

This will use rule-based matching from your knowledge base for instant responses.

### Option 2: AI-Powered Integration

For more natural, conversational responses, add your OpenAI or Anthropic API key:

```html
<script src="https://your-domain.github.io/your-repo/embed.js"></script>
<script>
  TikkurilaChat.init({
    apiKey: 'your-openai-api-key',
    apiProvider: 'openai', // or 'anthropic'
    model: 'gpt-4o-mini' // optional
  });
</script>
```

### Option 3: Custom Configuration

Full customization options:

```html
<script src="https://your-domain.github.io/your-repo/embed.js"></script>
<script>
  TikkurilaChat.init({
    // AI Configuration (optional)
    apiKey: 'your-api-key',
    apiProvider: 'openai', // or 'anthropic'
    model: 'gpt-4o-mini',
    
    // Appearance
    primaryColor: '#0066cc',
    accentColor: '#004999',
    position: 'bottom-right', // or 'bottom-left'
    
    // Content
    greeting: 'Hi! How can I help with your decorating project?',
    
    // Advanced
    baseUrl: 'https://your-cdn.com/kb' // custom KB location
  });
</script>
```

## 📖 API Reference

### Initialization

```javascript
TikkurilaChat.init(config)
```

**Configuration Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | null | OpenAI or Anthropic API key |
| `apiProvider` | string | 'openai' | 'openai' or 'anthropic' |
| `model` | string | 'gpt-4o-mini' | AI model to use |
| `baseUrl` | string | auto-detected | Base URL for knowledge base |
| `primaryColor` | string | '#0066cc' | Primary brand color |
| `accentColor` | string | '#004999' | Accent color |
| `position` | string | 'bottom-right' | 'bottom-right' or 'bottom-left' |
| `greeting` | string | Default greeting | Initial bot message |

### Programmatic Control

```javascript
// Open the chat window
TikkurilaChat.open();

// Close the chat window
TikkurilaChat.close();

// Toggle the chat window
TikkurilaChat.toggle();

// Send a message programmatically
TikkurilaChat.sendMessage('What paint for bathrooms?');

// Destroy the chatbot instance
TikkurilaChat.destroy();
```

## 🏗️ Architecture

The chatbot consists of three main components:

### 1. Widget (`chatbot-widget.js`)
- Modern, responsive UI with smooth animations
- Chat bubble, message display, input handling
- Typing indicators, quick questions
- Fully customizable styling

### 2. Engine (`chatbot-engine.js`)
- Intent analysis and requirement extraction
- FAQ matching from knowledge base
- Product recommendation algorithm
- AI integration (OpenAI/Anthropic)
- Rule-based fallback responses

### 3. Knowledge Base (`kb/v1/`)
- `index.json` - KB index and chunk list
- `faqs.json` - Frequently asked questions
- `rules.json` - Routing rules and preferences
- `products/*.json` - Product catalog (chunked)
- `fallback.json` - Help center links

## 💡 How It Works

### Without AI (Rule-Based)

1. **User Input** → Intent analysis detects rooms, surfaces, issues
2. **Knowledge Matching** → Searches FAQs and routing rules
3. **Product Matching** → Scores products based on requirements
4. **Response Generation** → Creates response using templates

### With AI (OpenAI/Anthropic)

1. **User Input** → Same intent analysis
2. **Context Building** → Combines user query, KB data, conversation history
3. **AI Processing** → Sends to OpenAI/Anthropic with system prompt
4. **Natural Response** → AI generates conversational, helpful response

## 📝 Knowledge Base Format

### Products (`products/*.json`)

```json
{
  "products": [
    {
      "name": "Anti-Reflex White [2]",
      "description": "Ultra-matt ceiling paint",
      "rooms": ["ceiling"],
      "surfaces": ["ceiling"],
      "features": ["ultra-matt", "hide roller marks"],
      "link": "https://www.tikkurila.co.uk/anti-reflex-white-2"
    }
  ]
}
```

### FAQs (`faqs.json`)

```json
{
  "faqs": [
    {
      "intent": "bathroom-paint",
      "question": "What should I use in a bathroom?",
      "answer": "Use the Luja system for moisture and mould resistance.",
      "links": {
        "pdp": "https://www.tikkurila.co.uk/luja-20"
      }
    }
  ]
}
```

### Routing Rules (`rules.json`)

```json
{
  "routing": {
    "bathrooms": {
      "preferRange": "Luja",
      "hint": "Moisture + mould resistance for humid rooms."
    }
  },
  "tieBreakers": [
    "Prefer washable paints when durability is requested."
  ]
}
```

## 🎨 Customization

### Custom Styling

The chatbot uses CSS custom properties that you can override:

```html
<style>
  .tikkurila-chatbot-container {
    --primary-color: #your-color;
    --accent-color: #your-accent;
    --border-radius: 16px;
  }
</style>
```

### Quick Questions

The chatbot automatically shows quick question buttons on first load. Customize these by modifying the `showQuickQuestions()` method in `chatbot-widget.js`.

## 🔧 Development

### Local Testing

1. Clone the repository
2. Start a local server (e.g., `python -m http.server 8000`)
3. Open `demo/chatbot-demo.html`

### File Structure

```
/
├── src/
│   ├── chatbot-widget.js      # UI component
│   ├── chatbot-engine.js      # AI/logic engine
│   └── kb-loader.mjs          # KB loader utility
├── kb/v1/
│   ├── index.json             # KB index
│   ├── faqs.json              # FAQs
│   ├── rules.json             # Routing rules
│   ├── fallback.json          # Help links
│   └── products/
│       ├── interior.json
│       ├── exterior.json
│       ├── primers.json
│       └── specialist.json
├── demo/
│   ├── index.html             # KB demo
│   └── chatbot-demo.html      # Chatbot demo
└── embed.js                   # Easy embed script
```

## 🔐 Security & Privacy

- **No tracking** - The chatbot doesn't collect or send any user data
- **Client-side only** - All processing happens in the browser
- **Optional AI** - API calls only when you provide a key
- **Your control** - Host on your own domain/CDN

## 📊 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional product data in knowledge base
- More sophisticated intent detection
- Multi-language support
- Analytics integration
- A/B testing framework

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For questions or issues:

1. Check the [demo page](demo/chatbot-demo.html)
2. Review the knowledge base structure
3. Test with and without AI to isolate issues
4. Check browser console for errors

## 🎯 Roadmap

- [ ] Multi-language support (Finnish, Swedish, etc.)
- [ ] Voice input capability
- [ ] Image upload for surface identification
- [ ] Integration with e-commerce platforms
- [ ] Analytics dashboard
- [ ] Admin panel for KB management
- [ ] Webhook integration for CRM systems

---

Built with ❤️ for Tikkurila
