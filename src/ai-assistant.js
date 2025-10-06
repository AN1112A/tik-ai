// Tikkurila AI Decorating Assistant
class TikkurilaAIAssistant {
  constructor(apiKey, baseUrl = '') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.kb = new KB(this.baseUrl);
    this.conversationHistory = [];
    this.isLoading = false;
  }

  async initialize() {
    try {
      await this.kb.loadIndex();
      console.log('Knowledge base loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
      return false;
    }
  }

  async processQuery(userInput) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.addMessage('user', userInput);
    
    try {
      // First, try to find matching products based on keywords
      const products = await this.kb.loadAllProducts();
      const matchingProducts = this.findMatchingProducts(userInput, products);
      
      // If we have good matches, use them directly
      if (matchingProducts.length > 0) {
        const response = this.generateProductResponse(matchingProducts, userInput);
        this.addMessage('assistant', response);
        return response;
      }
      
      // Otherwise, use AI to generate a more sophisticated response
      const aiResponse = await this.generateAIResponse(userInput, products);
      this.addMessage('assistant', aiResponse);
      return aiResponse;
      
    } catch (error) {
      console.error('Error processing query:', error);
      const errorResponse = "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team.";
      this.addMessage('assistant', errorResponse);
      return errorResponse;
    } finally {
      this.isLoading = false;
    }
  }

  findMatchingProducts(query, products) {
    const keywords = this.extractKeywords(query.toLowerCase());
    const matches = [];
    
    for (const product of products) {
      let score = 0;
      
      // Check product name
      if (this.containsKeywords(product.name.toLowerCase(), keywords)) {
        score += 3;
      }
      
      // Check category
      if (this.containsKeywords(product.category.toLowerCase(), keywords)) {
        score += 2;
      }
      
      // Check description
      if (product.description && this.containsKeywords(product.description.toLowerCase(), keywords)) {
        score += 1;
      }
      
      // Check rooms
      if (product.rooms && this.containsKeywords(product.rooms.join(' ').toLowerCase(), keywords)) {
        score += 2;
      }
      
      // Check surfaces
      if (product.surfaces && this.containsKeywords(product.surfaces.join(' ').toLowerCase(), keywords)) {
        score += 2;
      }
      
      // Check issues
      if (product.issues && this.containsKeywords(product.issues.join(' ').toLowerCase(), keywords)) {
        score += 1;
      }
      
      if (score > 0) {
        matches.push({ product, score });
      }
    }
    
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(m => m.product);
  }

  extractKeywords(text) {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    
    return text
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .map(word => word.replace(/[^\w]/g, ''));
  }

  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  generateProductResponse(products, query) {
    if (products.length === 0) {
      return "I couldn't find specific products for your query. Could you provide more details about what you're looking to paint or decorate?";
    }

    let response = "Based on your query, here are some Tikkurila products that might be perfect for your project:\n\n";
    
    products.forEach((product, index) => {
      response += `**${index + 1}. ${product.name}**\n`;
      response += `- Category: ${product.category}\n`;
      response += `- Finish: ${product.finish}\n`;
      response += `- Description: ${product.description}\n`;
      
      if (product.rooms && product.rooms.length > 0) {
        response += `- Best for: ${product.rooms.join(', ')}\n`;
      }
      
      if (product.issues && product.issues.length > 0) {
        response += `- Features: ${product.issues.join(', ')}\n`;
      }
      
      response += `- [View Product](${product.links.pdp})\n\n`;
    });

    response += "Would you like more information about any of these products, or do you have questions about a specific decorating challenge?";
    
    return response;
  }

  async generateAIResponse(query, products) {
    // For now, we'll use a simple rule-based approach
    // In a real implementation, you would integrate with OpenAI or another LLM
    
    const productSummary = products.slice(0, 10).map(p => 
      `${p.name} (${p.category}, ${p.finish}): ${p.description}`
    ).join('\n');

    // Simple keyword-based responses
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('bathroom') || lowerQuery.includes('wet') || lowerQuery.includes('moisture')) {
      const lujaProducts = products.filter(p => p.name.toLowerCase().includes('luja'));
      if (lujaProducts.length > 0) {
        return this.generateProductResponse(lujaProducts, query);
      }
    }
    
    if (lowerQuery.includes('ceiling') || lowerQuery.includes('roller marks')) {
      const ceilingProducts = products.filter(p => 
        p.name.toLowerCase().includes('anti-reflex') || 
        p.rooms?.includes('ceiling')
      );
      if (ceilingProducts.length > 0) {
        return this.generateProductResponse(ceilingProducts, query);
      }
    }
    
    if (lowerQuery.includes('wood') || lowerQuery.includes('furniture') || lowerQuery.includes('trim')) {
      const woodProducts = products.filter(p => 
        p.surfaces?.includes('wood') || 
        p.surfaces?.includes('furniture') ||
        p.surfaces?.includes('trim')
      );
      if (woodProducts.length > 0) {
        return this.generateProductResponse(woodProducts, query);
      }
    }
    
    if (lowerQuery.includes('kitchen') || lowerQuery.includes('washable') || lowerQuery.includes('durable')) {
      const durableProducts = products.filter(p => 
        p.issues?.includes('washable') || 
        p.issues?.includes('durable') ||
        p.rooms?.includes('kitchen')
      );
      if (durableProducts.length > 0) {
        return this.generateProductResponse(durableProducts, query);
      }
    }
    
    // Fallback to general product recommendations
    const generalProducts = products.slice(0, 3);
    return this.generateProductResponse(generalProducts, query);
  }

  addMessage(sender, content) {
    this.conversationHistory.push({
      sender,
      content,
      timestamp: new Date().toISOString()
    });
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TikkurilaAIAssistant;
} else {
  window.TikkurilaAIAssistant = TikkurilaAIAssistant;
}
