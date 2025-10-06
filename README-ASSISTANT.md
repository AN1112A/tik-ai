# 🎨 Tikkurila Decorating Assistant

An AI-powered chat assistant that helps customers find the right Tikkurila paint products for their decorating projects. The assistant can be easily embedded on any website and provides intelligent product recommendations based on room type, surface requirements, and specific challenges.

## ✨ Features

- **Natural Language Processing**: Understands customer questions about decorating projects
- **Smart Product Recommendations**: Suggests appropriate Tikkurila products based on room, surface, and requirements
- **Problem Solving**: Provides expert advice on common painting issues (mould, peeling, roller marks, etc.)
- **Conversation Memory**: Remembers context throughout the conversation
- **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Easy Integration**: Simple one-line integration for any website
- **Customizable**: Configurable appearance, colors, and behavior

## 🚀 Quick Start

### 1. Basic Integration

Add the assistant to your website with a single script tag:

```html
<script type="module">
  import { TikkurilaChatInterface } from './src/chat-interface.mjs';
  import { KB } from './src/kb-loader.mjs';
  
  // Initialize the assistant
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  const kb = new KB(window.location.origin);
  const assistant = new TikkurilaChatInterface(container, {
    baseUrl: window.location.origin,
    primaryColor: '#1e40af',
    accentColor: '#3b82f6'
  });
</script>
```

### 2. Using the Embed Script

For even easier integration, use the embed script:

```html
<script src="https://your-domain.com/src/embed.mjs" 
        data-base-url="https://your-domain.com"
        data-primary-color="#1e40af"
        data-position="bottom-right">
</script>
```

## 📁 Project Structure

```
/workspace/
├── src/
│   ├── ai-agent.mjs          # Core AI logic and conversation handling
│   ├── chat-interface.mjs    # Embeddable chat UI component
│   ├── kb-loader.mjs         # Knowledge base loader (existing)
│   └── embed.mjs             # Easy integration script
├── kb/v1/                    # Knowledge base data (existing)
│   ├── faqs.json
│   ├── rules.json
│   ├── products/
│   └── ...
├── demo/
│   ├── assistant-demo.html   # Comprehensive demo
│   ├── simple-integration.html
│   └── index.html            # Original demo
└── README-ASSISTANT.md       # This file
```

## 🎯 How It Works

### 1. AI Agent (`ai-agent.mjs`)

The core intelligence that:
- Analyzes user messages using natural language processing
- Extracts key information (room type, surface, issues, requirements)
- Maintains conversation state and context
- Generates appropriate responses based on intent
- Integrates with the knowledge base for product recommendations

### 2. Chat Interface (`chat-interface.mjs`)

A modern, responsive chat UI that:
- Provides an intuitive chat experience
- Handles user input and displays responses
- Shows typing indicators and suggestions
- Supports mobile and desktop interactions
- Can be easily customized and themed

### 3. Knowledge Base Integration

Leverages your existing knowledge base structure:
- Loads FAQs and product data from JSON files
- Uses routing rules for smart recommendations
- Provides fallback responses when needed
- Supports lazy loading of product chunks

## 🔧 Configuration Options

```javascript
{
  baseUrl: 'https://your-domain.com',     // Base URL for API calls
  theme: 'light',                         // 'light' | 'dark'
  position: 'bottom-right',               // Widget position
  primaryColor: '#1e40af',               // Primary brand color
  accentColor: '#3b82f6',                // Accent color
  autoLoad: true,                        // Auto-initialize on page load
  debug: false                           // Enable debug logging
}
```

## 💬 Example Conversations

### Bathroom with Mould Issues
**User**: "I'm painting my bathroom and have mould problems"
**Assistant**: "For areas with mould or moisture issues, I recommend the Luja system (Luja Universal Primer + Luja topcoat) which provides excellent moisture and mould resistance."

### Ceiling Painting
**User**: "What should I use on my ceiling?"
**Assistant**: "For ceilings, I recommend Anti-Reflex White [2] which provides ultra-matt, light-diffusing finish that minimizes roller marks."

### Problem Solving
**User**: "I'm getting roller marks on my walls"
**Assistant**: "Roller marks can be minimized by using the right roller nap, maintaining a wet edge, and choosing paints with good flow properties like Anti-Reflex White [2] for ceilings."

## 🛠️ API Reference

### TikkurilaChatInterface

```javascript
// Initialize
const assistant = new TikkurilaChatInterface(container, options);

// Methods
assistant.open()        // Open chat widget
assistant.close()       // Close chat widget
assistant.reset()       // Reset conversation
```

### TikkurilaAgent

```javascript
// Initialize
const agent = new TikkurilaAgent(kb);

// Methods
await agent.processMessage(message)  // Process user message
agent.resetConversation()            // Reset conversation state
agent.getConversationSummary()       // Get conversation details
```

## 🎨 Customization

### Styling
The chat interface uses CSS custom properties that can be overridden:

```css
.tikkurila-chat-container {
  --primary-color: #1e40af;
  --accent-color: #3b82f6;
  --background-color: white;
  --text-color: #333;
}
```

### Themes
Support for light and dark themes with automatic detection:

```javascript
const assistant = new TikkurilaChatInterface(container, {
  theme: 'dark'  // or 'light'
});
```

## 📱 Mobile Support

The assistant is fully responsive and includes:
- Touch-friendly interface elements
- Optimized layout for small screens
- Swipe gestures for mobile interaction
- Adaptive sizing based on viewport

## 🔍 Debugging

Enable debug mode to see detailed logging:

```javascript
const assistant = new TikkurilaChatInterface(container, {
  debug: true
});
```

## 🚀 Deployment

### 1. Host the Files
Upload the `src/` directory to your web server or CDN.

### 2. Update Base URL
Update the `baseUrl` in your integration code to point to your hosted files.

### 3. Test Integration
Use the demo pages to test the integration before going live.

## 📊 Analytics & Tracking

The assistant can be extended with analytics tracking:

```javascript
// Track user interactions
assistant.on('message', (message) => {
  analytics.track('assistant_message', { message });
});

assistant.on('recommendation', (product) => {
  analytics.track('product_recommendation', { product });
});
```

## 🔒 Security

- All API calls use HTTPS
- No sensitive data is stored locally
- Input validation and sanitization
- CORS-compliant for cross-origin requests

## 🤝 Contributing

To extend the assistant:

1. **Add new intents** in `ai-agent.mjs`
2. **Update knowledge base** with new products/FAQs
3. **Customize UI** in `chat-interface.mjs`
4. **Test thoroughly** with various user inputs

## 📝 License

This project is part of the Tikkurila knowledge base system and follows the same licensing terms.

## 🆘 Support

For technical support or questions about the assistant:
- Check the demo pages for examples
- Review the API documentation
- Test with the provided sample conversations
- Contact the development team for advanced customization

---

**Ready to help your customers find the perfect paint!** 🎨✨