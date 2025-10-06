// AI Agent for Tikkurila decorating assistant
export class DecoratingAgent {
  constructor(kb) {
    this.kb = kb;
    this.rules = null;
    this.faqs = null;
    this.fallback = null;
    this.products = null;
    this.conversationHistory = [];
  }

  async initialize() {
    [this.rules, this.faqs, this.fallback, this.products] = await Promise.all([
      this.kb.getRules(),
      this.kb.getFaqs(),
      this.kb.getFallback(),
      this.kb.loadAllProducts()
    ]);
  }

  // Main method to process user messages
  async processMessage(userMessage) {
    this.conversationHistory.push({ role: 'user', content: userMessage });
    
    const response = await this.generateResponse(userMessage);
    this.conversationHistory.push({ role: 'assistant', content: response });
    
    return response;
  }

  async generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (this.isGreeting(lowerMessage)) {
      return this.getGreeting();
    }

    // Check FAQs for matching intent
    const faqMatch = this.findMatchingFaq(lowerMessage);
    if (faqMatch) {
      return this.formatFaqResponse(faqMatch);
    }

    // Check routing rules for room/surface recommendations
    const ruleMatch = this.findMatchingRule(lowerMessage);
    if (ruleMatch) {
      return this.formatRuleResponse(ruleMatch);
    }

    // Check for specific product search
    const productMatch = this.searchProducts(lowerMessage);
    if (productMatch && productMatch.length > 0) {
      return this.formatProductResponse(productMatch);
    }

    // Fallback to help options
    return this.getFallbackResponse();
  }

  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'help'];
    return greetings.some(g => message.includes(g));
  }

  getGreeting() {
    return {
      text: "Hello! I'm the Tikkurila decorating assistant. I can help you find the perfect paint for your project. Whether you're painting ceilings, bathrooms, kitchens, or any other surface, I'm here to guide you.\n\nWhat are you looking to paint today?",
      type: 'greeting'
    };
  }

  findMatchingFaq(message) {
    if (!this.faqs?.faqs) return null;

    for (const faq of this.faqs.faqs) {
      // Check if message contains keywords from the question or intent
      const intent = faq.intent.replace(/-/g, ' ');
      const questionWords = faq.question.toLowerCase().split(' ').filter(w => w.length > 3);
      
      if (message.includes(intent) || 
          questionWords.some(word => message.includes(word))) {
        return faq;
      }
    }
    return null;
  }

  formatFaqResponse(faq) {
    let text = faq.answer;
    
    if (faq.links?.pdp) {
      text += `\n\n[View product details](${faq.links.pdp})`;
    }
    
    return {
      text,
      type: 'faq',
      links: faq.links || {}
    };
  }

  findMatchingRule(message) {
    if (!this.rules?.routing) return null;

    for (const [key, rule] of Object.entries(this.rules.routing)) {
      if (message.includes(key) || message.includes(key.slice(0, -1))) {
        return { key, ...rule };
      }
    }
    return null;
  }

  formatRuleResponse(rule) {
    let text = '';
    
    if (rule.prefer) {
      text = `For ${rule.key}, I recommend **${rule.prefer}**. ${rule.hint}`;
    } else if (rule.preferRange) {
      text = `For ${rule.key}, I recommend the **${rule.preferRange}** range. ${rule.hint}`;
    }
    
    return {
      text,
      type: 'recommendation',
      product: rule.prefer || rule.preferRange
    };
  }

  searchProducts(message) {
    if (!this.products || this.products.length === 0) return [];

    // Since products array is empty in current KB, return empty for now
    // This will work when products are added
    return this.products.filter(p => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return message.includes(name) || name.includes(message);
    });
  }

  formatProductResponse(products) {
    if (products.length === 1) {
      const p = products[0];
      return {
        text: `I found **${p.name}**. ${p.description || ''}`,
        type: 'product',
        products: products
      };
    } else {
      const list = products.map(p => `• **${p.name}**`).join('\n');
      return {
        text: `I found these products that might help:\n\n${list}`,
        type: 'product',
        products: products
      };
    }
  }

  getFallbackResponse() {
    return {
      text: `I'd love to help, but I need a bit more information. Could you tell me:\n\n• What room or area are you painting?\n• What surface (walls, ceiling, trim, etc.)?\n• Are there any specific requirements (moisture resistance, washable, etc.)?\n\n${this.fallback.message}\n\n[Visit our Help Centre](${this.fallback.helpCentre}) or [Contact us on WhatsApp](${this.fallback.whatsapp})`,
      type: 'fallback',
      fallbackLinks: this.fallback
    };
  }

  // Get conversation context for more natural responses
  getContext() {
    return this.conversationHistory.slice(-6); // Last 3 exchanges
  }

  reset() {
    this.conversationHistory = [];
  }
}
