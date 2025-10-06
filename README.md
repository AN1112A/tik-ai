# 🎨 Tikkurila AI Decorating Assistant

An intelligent, embeddable AI assistant that helps customers find the perfect Tikkurila paint products for their decorating projects.

## ✨ Features

- **🎯 Smart Product Recommendations**: AI-powered suggestions based on room type, surface, and project requirements
- **💬 Natural Language Processing**: Understands questions in plain English
- **📚 Comprehensive Knowledge Base**: 100+ Tikkurila products and extensive FAQs
- **🔧 Technical Guidance**: Expert advice on primers, preparation, and application
- **📱 Mobile Responsive**: Works perfectly on all devices
- **🔗 Direct Product Links**: Links to product pages and technical data sheets
- **⚡ Fast & Lightweight**: Optimized for performance

## 🚀 Quick Start

### 1. View the Demo

The AI assistant is already running! Visit the demo page:

```
http://localhost:8000/demo/ai-assistant-demo.html
```

### 2. Integration

Add this to your HTML:

```html
<!-- Add this to your HTML -->
<div id="tikkurila-assistant" 
     data-tikkurila-assistant 
     data-theme="light" 
     data-position="bottom-right">
</div>

<!-- Include the scripts -->
<script src="src/kb-loader.mjs" type="module"></script>
<script src="src/ai-assistant.js"></script>
<script src="src/embeddable-assistant.js"></script>
```

### 3. Configuration Options

| Attribute | Options | Default | Description |
|-----------|---------|---------|-------------|
| `data-theme` | `light`, `dark` | `light` | Visual theme |
| `data-position` | `bottom-right`, `bottom-left`, `top-right`, `top-left` | `bottom-right` | Widget position |
| `data-api-key` | Your OpenAI API key | (optional) | For enhanced AI responses |
| `data-base-url` | Base URL for knowledge base | Current domain | Knowledge base location |

## 🏗️ Architecture

### Components

1. **Knowledge Base Loader** (`src/kb-loader.mjs`)
   - Loads product data and FAQs from JSON files
   - Provides search and filtering capabilities

2. **AI Assistant Core** (`src/ai-assistant.js`)
   - Processes user queries
   - Matches products based on keywords and context
   - Generates intelligent responses

3. **Embeddable Widget** (`src/embeddable-assistant.js`)
   - Chat interface component
   - Mobile-responsive design
   - Easy integration

### Knowledge Base Structure

```
/kb/v1/
├── index.json          # Main index with chunk references
├── faqs.json           # Frequently asked questions
├── rules.json          # Routing rules and preferences
├── fallback.json       # Fallback responses
└── products/
    ├── interior.json   # Interior paints and products
    ├── exterior.json   # Exterior paints and products
    ├── primers.json    # Primers and undercoats
    └── specialist.json # Specialty products
```

## 🎯 How It Works

1. **User asks a question** about their decorating project
2. **AI processes the query** using keyword matching and context analysis
3. **Knowledge base searches** for relevant products and FAQs
4. **Smart recommendations** are generated based on:
   - Room type (bathroom, kitchen, living room, etc.)
   - Surface material (wood, metal, walls, etc.)
   - Specific requirements (washable, durable, eco-friendly, etc.)
   - Technical considerations (primers, preparation, etc.)

## 📊 Knowledge Base Statistics

- **100+ Products**: Complete Tikkurila product catalog
- **40+ FAQs**: Comprehensive question and answer database
- **Categories**: Interior, Exterior, Primers, Specialists
- **Product Types**: Emulsions, Enamels, Oils, Stains, Effect Paints

## 🔧 Example Queries

The AI assistant can handle questions like:

- "What paint should I use for my bathroom?"
- "I need paint for my kitchen cabinets"
- "What's the best paint for ceilings?"
- "Can I paint over laminate furniture?"
- "What primer do I need for bare wood?"
- "I want to paint my exterior wood fence"
- "How do I prepare walls before painting?"

## 🛠️ Development

### Prerequisites

- Modern web browser with ES6+ support
- Local web server (for development)

### Setup

1. Clone or download the project
2. Start a local web server:
   ```bash
   python3 -m http.server 8000
   # or
   npx http-server
   ```
3. Open `http://localhost:8000/demo/ai-assistant-demo.html`

### File Structure

```
├── src/
│   ├── kb-loader.mjs           # Knowledge base loader
│   ├── ai-assistant.js         # AI assistant core
│   └── embeddable-assistant.js # Embeddable widget
├── kb/v1/
│   ├── index.json              # Main index
│   ├── faqs.json               # FAQs database
│   ├── rules.json              # Routing rules
│   └── products/               # Product data
├── demo/
│   └── ai-assistant-demo.html  # Demo page
└── README.md                   # This file
```

## 🎨 Customization

### Styling

The widget uses CSS custom properties for easy theming:

```css
.tikkurila-assistant-widget {
  --primary-color: #1e3a8a;
  --background-color: #ffffff;
  --text-color: #374151;
  --border-color: #e5e7eb;
}
```

### Adding Products

To add new products, update the appropriate JSON file in `/kb/v1/products/`:

```json
{
  "name": "Product Name",
  "category": "Category",
  "type": "Product Type",
  "finish": "Finish",
  "rooms": ["room1", "room2"],
  "surfaces": ["surface1", "surface2"],
  "issues": ["feature1", "feature2"],
  "description": "Product description",
  "links": {
    "pdp": "https://product-page-url"
  }
}
```

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the demo page for examples
- Review the knowledge base structure
- Test with the provided example queries

---

**Built with ❤️ for Tikkurila customers**
