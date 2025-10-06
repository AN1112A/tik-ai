// AI Agent for Tikkurila Decorating Assistant
export class TikkurilaAgent {
  constructor(kb) {
    this.kb = kb;
    this.conversationState = {
      currentRoom: null,
      surfaceType: null,
      issues: [],
      requirements: [],
      budget: null,
      experience: null,
      timeline: null
    };
    this.conversationHistory = [];
  }

  // Main entry point for processing user messages
  async processMessage(userMessage) {
    this.conversationHistory.push({ role: 'user', content: userMessage });
    
    // Analyze the user's intent and extract information
    const analysis = this.analyzeUserIntent(userMessage);
    
    // Update conversation state based on analysis
    this.updateConversationState(analysis);
    
    // Generate appropriate response
    const response = await this.generateResponse(analysis);
    
    this.conversationHistory.push({ role: 'assistant', content: response.text });
    
    return {
      ...response,
      conversationState: { ...this.conversationState },
      suggestions: response.suggestions || []
    };
  }

  // Analyze user intent and extract key information
  analyzeUserIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Room detection
    const roomKeywords = {
      'living room': ['living room', 'lounge', 'sitting room', 'front room'],
      'bedroom': ['bedroom', 'bed room', 'master bedroom', 'guest room'],
      'kitchen': ['kitchen', 'cookery', 'cooking'],
      'bathroom': ['bathroom', 'bath room', 'toilet', 'wc', 'washroom'],
      'hallway': ['hallway', 'hall', 'corridor', 'entrance'],
      'dining room': ['dining room', 'dining', 'dinner room'],
      'ceiling': ['ceiling', 'ceilings'],
      'exterior': ['exterior', 'outside', 'external', 'garden', 'fence', 'shed']
    };

    // Surface type detection
    const surfaceKeywords = {
      'wood': ['wood', 'wooden', 'timber', 'oak', 'pine', 'woodwork', 'skirting', 'door frame'],
      'wall': ['wall', 'walls', 'plaster', 'plasterboard', 'drywall'],
      'metal': ['metal', 'steel', 'iron', 'radiator', 'pipe'],
      'concrete': ['concrete', 'brick', 'stone', 'render'],
      'previously painted': ['painted', 'existing paint', 'old paint', 'paintwork']
    };

    // Issue detection
    const issueKeywords = {
      'mould': ['mould', 'mold', 'damp', 'moisture', 'condensation', 'steam'],
      'stains': ['stains', 'staining', 'marks', 'discoloration', 'yellowing'],
      'peeling': ['peeling', 'flaking', 'cracking', 'chipping'],
      'roller marks': ['roller marks', 'brush marks', 'streaks', 'lines'],
      'durability': ['durable', 'hard wearing', 'scrub', 'washable', 'tough'],
      'coverage': ['coverage', 'opacity', 'hiding', 'covering']
    };

    // Experience level detection
    const experienceKeywords = {
      'beginner': ['beginner', 'first time', 'never painted', 'new to', 'inexperienced'],
      'intermediate': ['some experience', 'painted before', 'moderate', 'intermediate'],
      'expert': ['expert', 'professional', 'experienced', 'done this before']
    };

    // Budget detection
    const budgetKeywords = {
      'budget': ['budget', 'cheap', 'affordable', 'cost', 'price'],
      'premium': ['premium', 'best', 'high quality', 'top of the range', 'expensive']
    };

    // Timeline detection
    const timelineKeywords = {
      'urgent': ['urgent', 'asap', 'quickly', 'soon', 'immediately'],
      'weekend': ['weekend', 'this weekend', 'saturday', 'sunday'],
      'flexible': ['flexible', 'whenever', 'no rush', 'take time']
    };

    const detectedRoom = this.findKeywords(lowerMessage, roomKeywords);
    const detectedSurface = this.findKeywords(lowerMessage, surfaceKeywords);
    const detectedIssues = this.findKeywords(lowerMessage, issueKeywords);
    const detectedExperience = this.findKeywords(lowerMessage, experienceKeywords);
    const detectedBudget = this.findKeywords(lowerMessage, budgetKeywords);
    const detectedTimeline = this.findKeywords(lowerMessage, timelineKeywords);

    // Intent classification
    let intent = 'general_inquiry';
    if (lowerMessage.includes('what') && (lowerMessage.includes('paint') || lowerMessage.includes('use'))) {
      intent = 'product_recommendation';
    } else if (lowerMessage.includes('how') && lowerMessage.includes('paint')) {
      intent = 'how_to_advice';
    } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || detectedIssues.length > 0) {
      intent = 'problem_solving';
    } else if (lowerMessage.includes('finish') || lowerMessage.includes('look')) {
      intent = 'finish_inquiry';
    }

    return {
      intent,
      room: detectedRoom[0] || null,
      surface: detectedSurface[0] || null,
      issues: detectedIssues,
      experience: detectedExperience[0] || null,
      budget: detectedBudget[0] || null,
      timeline: detectedTimeline[0] || null,
      originalMessage: message
    };
  }

  findKeywords(text, keywordMap) {
    const found = [];
    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        found.push(key);
      }
    }
    return found;
  }

  // Update conversation state based on analysis
  updateConversationState(analysis) {
    if (analysis.room) this.conversationState.currentRoom = analysis.room;
    if (analysis.surface) this.conversationState.surfaceType = analysis.surface;
    if (analysis.issues.length > 0) {
      this.conversationState.issues = [...new Set([...this.conversationState.issues, ...analysis.issues])];
    }
    if (analysis.experience) this.conversationState.experience = analysis.experience;
    if (analysis.budget) this.conversationState.budget = analysis.budget;
    if (analysis.timeline) this.conversationState.timeline = analysis.timeline;
  }

  // Generate appropriate response based on analysis
  async generateResponse(analysis) {
    switch (analysis.intent) {
      case 'product_recommendation':
        return await this.handleProductRecommendation(analysis);
      case 'how_to_advice':
        return await this.handleHowToAdvice(analysis);
      case 'problem_solving':
        return await this.handleProblemSolving(analysis);
      case 'finish_inquiry':
        return await this.handleFinishInquiry(analysis);
      default:
        return await this.handleGeneralInquiry(analysis);
    }
  }

  async handleProductRecommendation(analysis) {
    // Load FAQs and rules for context
    const [faqs, rules] = await Promise.all([
      this.kb.getFaqs(),
      this.kb.getRules()
    ]);

    // Check for specific FAQ matches first
    const faqMatch = this.findFAQMatch(analysis, faqs);
    if (faqMatch) {
      return {
        text: faqMatch.answer,
        type: 'faq_response',
        suggestions: this.generateSuggestions(faqMatch),
        links: faqMatch.links
      };
    }

    // Use routing rules for recommendations
    const recommendation = this.getRoutingRecommendation(analysis, rules);
    
    return {
      text: recommendation.text,
      type: 'product_recommendation',
      suggestions: recommendation.suggestions,
      products: recommendation.products || []
    };
  }

  findFAQMatch(analysis, faqs) {
    const faqList = faqs.faqs || [];
    
    // Direct intent matching
    for (const faq of faqList) {
      if (analysis.room && faq.intent.includes(analysis.room)) {
        return faq;
      }
      if (analysis.issues.some(issue => faq.intent.includes(issue))) {
        return faq;
      }
    }

    // Keyword matching in questions
    for (const faq of faqList) {
      const questionWords = faq.question.toLowerCase().split(/\s+/);
      const messageWords = analysis.originalMessage.toLowerCase().split(/\s+/);
      const commonWords = questionWords.filter(word => messageWords.includes(word));
      
      if (commonWords.length >= 2) {
        return faq;
      }
    }

    return null;
  }

  getRoutingRecommendation(analysis, rules) {
    const routing = rules.routing || {};
    
    // Check for specific room recommendations
    if (analysis.room && routing[analysis.room]) {
      const roomRule = routing[analysis.room];
      return {
        text: `For ${analysis.room}, I recommend ${roomRule.prefer || roomRule.preferRange}. ${roomRule.hint || ''}`,
        suggestions: [roomRule.prefer || roomRule.preferRange],
        products: [roomRule.prefer || roomRule.preferRange]
      };
    }

    // General recommendations based on issues
    if (analysis.issues.includes('mould')) {
      return {
        text: "For areas with mould or moisture issues, I recommend the Luja system (Luja Universal Primer + Luja topcoat) which provides excellent moisture and mould resistance.",
        suggestions: ["Luja Universal Primer", "Luja topcoat"],
        products: ["Luja"]
      };
    }

    if (analysis.issues.includes('roller marks') || analysis.room === 'ceiling') {
      return {
        text: "To minimize roller marks, especially on ceilings, I recommend Anti-Reflex White [2] which provides ultra-matt, light-diffusing finish.",
        suggestions: ["Anti-Reflex White [2]"],
        products: ["Anti-Reflex White"]
      };
    }

    // Default recommendation
    return {
      text: "I'd be happy to help you find the right paint! Could you tell me more about the room you're painting and any specific requirements you have?",
      suggestions: [],
      products: []
    };
  }

  generateSuggestions(faq) {
    const suggestions = [];
    if (faq.links && faq.links.pdp) {
      suggestions.push({
        text: "View Product Details",
        url: faq.links.pdp,
        type: "product_link"
      });
    }
    return suggestions;
  }

  async handleHowToAdvice(analysis) {
    const advice = this.getHowToAdvice(analysis);
    return {
      text: advice.text,
      type: 'how_to_advice',
      suggestions: advice.suggestions || []
    };
  }

  getHowToAdvice(analysis) {
    if (analysis.room === 'bathroom' || analysis.issues.includes('mould')) {
      return {
        text: "For bathroom painting, start with a clean, dry surface. Use Luja Universal Primer first, then apply Luja topcoat. Ensure good ventilation and allow proper drying time between coats.",
        suggestions: ["Luja Universal Primer", "Luja topcoat"]
      };
    }

    if (analysis.room === 'ceiling') {
      return {
        text: "For ceiling painting, use a roller with a medium nap. Apply Anti-Reflex White [2] in a 'W' pattern, then fill in the gaps. Work in small sections to maintain a wet edge and minimize roller marks.",
        suggestions: ["Anti-Reflex White [2]"]
      };
    }

    return {
      text: "For best results, ensure the surface is clean, dry, and properly prepared. Use appropriate primer if needed, and apply paint in thin, even coats. Allow proper drying time between coats.",
      suggestions: []
    };
  }

  async handleProblemSolving(analysis) {
    const solution = this.getProblemSolution(analysis);
    return {
      text: solution.text,
      type: 'problem_solving',
      suggestions: solution.suggestions || []
    };
  }

  getProblemSolution(analysis) {
    if (analysis.issues.includes('mould')) {
      return {
        text: "Mould issues require a moisture-resistant paint system. I recommend the Luja range which is specifically designed for humid environments and provides excellent mould resistance.",
        suggestions: ["Luja Universal Primer", "Luja topcoat"]
      };
    }

    if (analysis.issues.includes('peeling')) {
      return {
        text: "Peeling paint usually indicates poor adhesion. Remove all loose paint, clean the surface thoroughly, and use a suitable primer before repainting. For exterior work, consider our specialist exterior primers.",
        suggestions: ["Exterior primers", "Surface preparation products"]
      };
    }

    if (analysis.issues.includes('roller marks')) {
      return {
        text: "Roller marks can be minimized by using the right roller nap, maintaining a wet edge, and choosing paints with good flow properties like Anti-Reflex White [2] for ceilings.",
        suggestions: ["Anti-Reflex White [2]"]
      };
    }

    return {
      text: "I'd need to know more about the specific problem you're experiencing to provide the best solution. Could you describe the issue in more detail?",
      suggestions: []
    };
  }

  async handleFinishInquiry(analysis) {
    return {
      text: "Tikkurila offers a range of finishes from ultra-matt to high-gloss. For ceilings, Anti-Reflex White [2] provides an ultra-matt finish that minimizes roller marks. For high-traffic areas, consider washable finishes like Optiva.",
      type: 'finish_inquiry',
      suggestions: ["Anti-Reflex White [2]", "Optiva range"]
    };
  }

  async handleGeneralInquiry(analysis) {
    // Check if we have enough information to make a recommendation
    if (this.conversationState.currentRoom || analysis.room) {
      return await this.handleProductRecommendation(analysis);
    }

    return {
      text: "Hello! I'm here to help you with your decorating needs. I can recommend the right Tikkurila products for your project. What room are you looking to paint, and do you have any specific requirements or challenges?",
      type: 'greeting',
      suggestions: [
        "Tell me about your project",
        "What room are you painting?",
        "I have a specific problem"
      ]
    };
  }

  // Reset conversation state
  resetConversation() {
    this.conversationState = {
      currentRoom: null,
      surfaceType: null,
      issues: [],
      requirements: [],
      budget: null,
      experience: null,
      timeline: null
    };
    this.conversationHistory = [];
  }

  // Get conversation summary
  getConversationSummary() {
    return {
      state: this.conversationState,
      history: this.conversationHistory,
      messageCount: this.conversationHistory.length
    };
  }
}