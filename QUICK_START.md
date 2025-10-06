# 🚀 Quick Start Guide - Tikkurila AI Chatbot

Get your Tikkurila AI Decorating Assistant up and running in under 5 minutes!

## 📋 Prerequisites

- A website where you can add JavaScript
- (Optional) An OpenAI or Anthropic API key for AI-powered responses

## 🎯 3 Steps to Launch

### Step 1: Host Your Knowledge Base

The chatbot needs access to your product knowledge base. You have two options:

#### Option A: GitHub Pages (Recommended)

1. Create a public GitHub repository
2. Copy the `kb/` folder to your repo
3. Enable GitHub Pages in Settings → Pages
4. Your KB will be at: `https://your-username.github.io/your-repo/kb/v1/`

#### Option B: Your Own Server

1. Upload the `kb/` folder to your web server
2. Ensure CORS is enabled
3. Note the URL where it's accessible

### Step 2: Add the Embed Script

Add these lines to your website's HTML (before the closing `</body>` tag):

```html
<!-- Simple version - No AI -->
<script src="https://your-username.github.io/your-repo/embed.js"></script>
<script>
  TikkurilaChat.init({
    baseUrl: 'https://your-username.github.io/your-repo'
  });
</script>
```

**OR with AI for smarter responses:**

```html
<!-- AI-powered version -->
<script src="https://your-username.github.io/your-repo/embed.js"></script>
<script>
  TikkurilaChat.init({
    baseUrl: 'https://your-username.github.io/your-repo',
    apiKey: 'sk-...', // Your OpenAI API key
    apiProvider: 'openai'
  });
</script>
```

### Step 3: Customize (Optional)

Personalize the chatbot to match your brand:

```html
<script src="https://your-username.github.io/your-repo/embed.js"></script>
<script>
  TikkurilaChat.init({
    baseUrl: 'https://your-username.github.io/your-repo',
    
    // Colors
    primaryColor: '#0066cc',
    accentColor: '#004999',
    
    // Position
    position: 'bottom-right', // or 'bottom-left'
    
    // Greeting
    greeting: 'Hi! How can I help with your decorating project today?'
  });
</script>
```

## ✅ Done!

The chatbot will now appear on your website as a floating button in the bottom corner. Click it to start chatting!

---

## 🎨 Testing Locally

Want to test before deploying?

1. **Start a local server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Node.js
   npx serve
   ```

2. **Open the demo:**
   ```
   http://localhost:8000/demo/chatbot-demo.html
   ```

3. **Test the chatbot:**
   - Click the chat button
   - Try asking: "What paint for my bathroom?"
   - Try: "Best ceiling paint?"
   - Try: "I need durable paint for my hallway"

---

## 💬 Example Questions to Try

Once your chatbot is running, test it with these questions:

### Product Recommendations
- "What paint should I use in my bathroom?"
- "Best paint for ceilings that hides roller marks?"
- "I need washable paint for my hallway"
- "What's good for exterior wood cladding?"

### Technical Questions
- "How many coats of paint do I need?"
- "What's the drying time?"
- "Do I need a primer?"
- "How do I calculate how much paint to buy?"

### Specific Needs
- "Paint that prevents mould"
- "Eco-friendly paint for nursery"
- "Floor paint for my garage"
- "Paint for furniture"

---

## 🔑 Getting an API Key (For AI Mode)

### OpenAI (Recommended)

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create new key
5. Copy the key (starts with `sk-`)
6. Add billing information (pay-as-you-go, very affordable)

**Cost:** ~$0.001-0.003 per conversation (extremely cheap!)

### Anthropic (Alternative)

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Get API key
4. Use in config with `apiProvider: 'anthropic'`

---

## 🎛️ Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `baseUrl` | Auto-detected | Where your KB is hosted |
| `apiKey` | null | OpenAI or Anthropic API key |
| `apiProvider` | 'openai' | 'openai' or 'anthropic' |
| `model` | 'gpt-4o-mini' | AI model to use |
| `primaryColor` | '#0066cc' | Main brand color |
| `accentColor` | '#004999' | Secondary color |
| `position` | 'bottom-right' | Chat button position |
| `greeting` | Default | First message from bot |

---

## 🆘 Troubleshooting

### Chatbot doesn't appear

**Check:**
- Browser console for errors (F12)
- Script URL is correct
- CORS is enabled on your KB host

**Fix:** Make sure the `embed.js` path is correct and accessible

### Knowledge base not loading

**Check:**
- `baseUrl` points to the correct location
- `/kb/v1/index.json` is accessible
- CORS headers are set if on different domain

**Fix:** Open `https://your-baseUrl/kb/v1/index.json` in browser - should show JSON

### AI not responding

**Check:**
- API key is valid
- API key has billing enabled
- Check browser console for API errors

**Fix:** The bot will fall back to rule-based responses if AI fails

### Chatbot works but no product recommendations

**Check:**
- Product JSON files have data
- Products have correct `rooms`, `surfaces`, `features` fields

**Fix:** Make sure product data is properly formatted (see example files)

---

## 📚 Next Steps

- **Customize Products:** Edit files in `kb/v1/products/` with your actual products
- **Add FAQs:** Update `kb/v1/faqs.json` with common questions
- **Tune Rules:** Modify `kb/v1/rules.json` for better recommendations
- **Style It:** Override CSS variables to match your brand
- **Advanced:** Read the full [CHATBOT_README.md](CHATBOT_README.md)

---

## 🎉 You're All Set!

Your Tikkurila AI Decorating Assistant is now ready to help your customers find the perfect paint products!

**Need help?** Check the full documentation or open an issue on GitHub.

---

### Want to see it in action first?

Open `demo/chatbot-demo.html` in your browser to see a live demo with all features enabled!
