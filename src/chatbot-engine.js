/**
 * Tikkurila Chatbot Engine
 * 
 * Handles AI-powered conversations, product recommendations,
 * and knowledge base integration.
 */

export class ChatbotEngine {
  constructor(kb, options = {}) {
    this.kb = kb;
    this.options = options;
    this.faqs = null;
    this.rules = null;
    this.fallback = null;
    this.products = null;
    this.conversationContext = [];
  }

  async init() {
    // Load knowledge base data
    [this.faqs, this.rules, this.fallback, this.products] = await Promise.all([
      this.kb.getFaqs(),
      this.kb.getRules(),
      this.kb.getFallback(),
      this.kb.loadAllProducts()
    ]);
  }

  async processMessage(userMessage, conversationHistory = []) {
    // Add to conversation context
    this.conversationContext.push({
      role: 'user',
      content: userMessage
    });

    // Analyze user intent
    const intent = this.analyzeIntent(userMessage);

    // Check if this matches an FAQ
    const faqMatch = this.findFaqMatch(userMessage);
    if (faqMatch) {
      return this.formatFaqResponse(faqMatch);
    }

    // Extract decorating requirements
    const requirements = this.extractRequirements(userMessage);

    // Find matching products
    const matchedProducts = this.findMatchingProducts(requirements);

    // Generate AI response
    const response = await this.generateResponse(
      userMessage,
      intent,
      requirements,
      matchedProducts,
      conversationHistory
    );

    // Add to conversation context
    this.conversationContext.push({
      role: 'assistant',
      content: response
    });

    return response;
  }

  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();

    const intents = {
      product_search: [
        'recommend', 'suggest', 'what paint', 'which paint', 'best paint',
        'looking for', 'need paint', 'want to paint'
      ],
      room_specific: [
        'bathroom', 'kitchen', 'bedroom', 'ceiling', 'living room',
        'hallway', 'exterior', 'outdoor'
      ],
      surface_specific: [
        'wall', 'ceiling', 'wood', 'metal', 'trim', 'door', 'window',
        'siding', 'fence', 'deck'
      ],
      issue_specific: [
        'mould', 'mold', 'moisture', 'damp', 'stain', 'coverage',
        'durability', 'washable', 'scrubbable'
      ],
      how_to: [
        'how to', 'how do i', 'how many coats', 'preparation',
        'apply', 'application', 'steps'
      ],
      technical: [
        'temperature', 'drying time', 'coverage', 'finish',
        'gloss', 'matt', 'satin'
      ]
    };

    const detected = {};
    for (const [intent, keywords] of Object.entries(intents)) {
      detected[intent] = keywords.some(kw => lowerMessage.includes(kw));
    }

    return detected;
  }

  findFaqMatch(message) {
    if (!this.faqs || !this.faqs.faqs) return null;

    const lowerMessage = message.toLowerCase();

    // Find FAQ by matching question or intent
    return this.faqs.faqs.find(faq => {
      const questionMatch = faq.question.toLowerCase().includes(lowerMessage) ||
                           lowerMessage.includes(faq.question.toLowerCase());
      const intentMatch = faq.intent && lowerMessage.includes(faq.intent.replace(/-/g, ' '));
      return questionMatch || intentMatch;
    });
  }

  formatFaqResponse(faq) {
    let response = faq.answer;

    if (faq.links && faq.links.pdp) {
      response += `\n\n[View Product Details](${faq.links.pdp})`;
    }

    return response;
  }

  extractRequirements(message) {
    const lowerMessage = message.toLowerCase();

    const requirements = {
      rooms: [],
      surfaces: [],
      issues: [],
      preferences: []
    };

    // Room detection
    const roomKeywords = {
      bathroom: ['bathroom', 'bath', 'shower room', 'wet room'],
      kitchen: ['kitchen'],
      bedroom: ['bedroom', 'bed room'],
      ceiling: ['ceiling'],
      'living-room': ['living room', 'lounge', 'sitting room'],
      hallway: ['hallway', 'hall', 'corridor'],
      exterior: ['exterior', 'outside', 'outdoor', 'external']
    };

    for (const [room, keywords] of Object.entries(roomKeywords)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        requirements.rooms.push(room);
      }
    }

    // Surface detection
    const surfaceKeywords = {
      walls: ['wall', 'walls'],
      ceiling: ['ceiling', 'ceilings'],
      wood: ['wood', 'wooden', 'timber'],
      metal: ['metal', 'steel', 'iron'],
      trim: ['trim', 'skirting', 'architrave'],
      doors: ['door', 'doors'],
      windows: ['window', 'windows']
    };

    for (const [surface, keywords] of Object.entries(surfaceKeywords)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        requirements.surfaces.push(surface);
      }
    }

    // Issue detection
    const issueKeywords = {
      moisture: ['moisture', 'damp', 'humid', 'wet'],
      mould: ['mould', 'mold', 'mildew'],
      stains: ['stain', 'stains', 'marks'],
      coverage: ['coverage', 'hide', 'hiding'],
      durability: ['durable', 'durability', 'long-lasting', 'hard-wearing']
    };

    for (const [issue, keywords] of Object.entries(issueKeywords)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        requirements.issues.push(issue);
      }
    }

    // Preference detection
    const preferenceKeywords = {
      washable: ['washable', 'scrubbable', 'clean', 'wipe'],
      matt: ['matt', 'matte', 'flat'],
      satin: ['satin', 'silk'],
      gloss: ['gloss', 'glossy', 'sheen'],
      white: ['white'],
      colored: ['color', 'colour', 'colored', 'coloured', 'tint']
    };

    for (const [pref, keywords] of Object.entries(preferenceKeywords)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        requirements.preferences.push(pref);
      }
    }

    return requirements;
  }

  findMatchingProducts(requirements) {
    if (!this.products || this.products.length === 0) {
      return [];
    }

    // Score products based on requirements
    const scored = this.products.map(product => {
      let score = 0;

      // Match rooms
      if (requirements.rooms.length > 0 && product.rooms) {
        const roomMatches = requirements.rooms.filter(r => 
          product.rooms.includes(r)
        ).length;
        score += roomMatches * 3;
      }

      // Match surfaces
      if (requirements.surfaces.length > 0 && product.surfaces) {
        const surfaceMatches = requirements.surfaces.filter(s => 
          product.surfaces.includes(s)
        ).length;
        score += surfaceMatches * 2;
      }

      // Match issues
      if (requirements.issues.length > 0 && product.features) {
        const issueMatches = requirements.issues.filter(i => 
          product.features.some(f => f.toLowerCase().includes(i))
        ).length;
        score += issueMatches * 4;
      }

      return { product, score };
    });

    // Filter and sort by score
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.product);
  }

  async generateResponse(userMessage, intent, requirements, products, history) {
    // If API key is provided, use AI service
    if (this.options.apiKey) {
      return await this.generateAIResponse(userMessage, intent, requirements, products, history);
    }

    // Otherwise, use rule-based response
    return this.generateRuleBasedResponse(userMessage, intent, requirements, products);
  }

  async generateAIResponse(userMessage, intent, requirements, products, history) {
    // Build context for AI
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(userMessage, requirements, products);

    try {
      if (this.options.apiProvider === 'openai') {
        return await this.callOpenAI(systemPrompt, userPrompt, history);
      } else if (this.options.apiProvider === 'anthropic') {
        return await this.callAnthropic(systemPrompt, userPrompt, history);
      }
    } catch (error) {
      console.error('AI API error:', error);
      // Fallback to rule-based
      return this.generateRuleBasedResponse(userMessage, intent, requirements, products);
    }
  }

  buildSystemPrompt() {
    return `You are a helpful Tikkurila decorating assistant. Your role is to:

1. Help customers choose the right paint products for their decorating projects
2. Provide expert advice on surface preparation, application, and finishing
3. Recommend products based on the specific room, surface, and requirements
4. Be friendly, professional, and concise

Key product knowledge:
- Anti-Reflex White [2]: Ultra-matt ceiling paint that minimizes roller marks
- Luja range: Moisture and mould-resistant for bathrooms and humid areas
- Optiva range: Washable, durable interior paints
- Helmi/Everal Aqua: Water-based enamels for trim and woodwork

Guidelines:
- Always recommend specific Tikkurila products when appropriate
- Mention key features like moisture resistance, washability, or coverage
- Keep responses concise (2-3 sentences unless more detail is needed)
- Include product links when recommending specific products
- If unsure, offer to connect them with the technical team

Current rules from knowledge base:
${JSON.stringify(this.rules, null, 2)}`;
  }

  buildUserPrompt(userMessage, requirements, products) {
    let prompt = `Customer question: "${userMessage}"\n\n`;

    if (Object.values(requirements).some(arr => arr.length > 0)) {
      prompt += `Detected requirements:\n`;
      if (requirements.rooms.length > 0) prompt += `- Rooms: ${requirements.rooms.join(', ')}\n`;
      if (requirements.surfaces.length > 0) prompt += `- Surfaces: ${requirements.surfaces.join(', ')}\n`;
      if (requirements.issues.length > 0) prompt += `- Issues: ${requirements.issues.join(', ')}\n`;
      if (requirements.preferences.length > 0) prompt += `- Preferences: ${requirements.preferences.join(', ')}\n`;
      prompt += '\n';
    }

    if (products && products.length > 0) {
      prompt += `Relevant products found:\n`;
      products.forEach(p => {
        prompt += `- ${p.name}: ${p.description || ''}\n`;
        if (p.link) prompt += `  Link: ${p.link}\n`;
      });
      prompt += '\n';
    }

    prompt += 'Please provide a helpful, concise response.';

    return prompt;
  }

  async callOpenAI(systemPrompt, userPrompt, history) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (last 5 messages)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      if (msg.type === 'user') {
        messages.push({ role: 'user', content: msg.content });
      } else if (msg.type === 'bot') {
        messages.push({ role: 'assistant', content: msg.content });
      }
    });

    // Add current message
    messages.push({ role: 'user', content: userPrompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.options.apiKey}`
      },
      body: JSON.stringify({
        model: this.options.model || 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callAnthropic(systemPrompt, userPrompt, history) {
    const messages = [];

    // Add conversation history (last 5 messages)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      if (msg.type === 'user') {
        messages.push({ role: 'user', content: msg.content });
      } else if (msg.type === 'bot') {
        messages.push({ role: 'assistant', content: msg.content });
      }
    });

    // Add current message
    messages.push({ role: 'user', content: userPrompt });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.options.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.options.model || 'claude-3-haiku-20240307',
        system: systemPrompt,
        messages: messages,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  generateRuleBasedResponse(userMessage, intent, requirements, products) {
    // Check routing rules
    if (this.rules && this.rules.routing) {
      for (const [key, rule] of Object.entries(this.rules.routing)) {
        if (requirements.rooms.includes(key) || userMessage.toLowerCase().includes(key)) {
          let response = `For ${key}, I recommend `;
          
          if (rule.prefer) {
            response += `**${rule.prefer}**. `;
          } else if (rule.preferRange) {
            response += `the **${rule.preferRange}** range. `;
          }
          
          if (rule.hint) {
            response += rule.hint;
          }

          return response;
        }
      }
    }

    // If we found matching products, recommend them
    if (products && products.length > 0) {
      const product = products[0];
      let response = `I recommend **${product.name}**`;
      
      if (product.description) {
        response += ` - ${product.description}`;
      }
      
      if (product.link) {
        response += `\n\n[View Product](${product.link})`;
      }

      if (products.length > 1) {
        response += `\n\nOther options: `;
        response += products.slice(1).map(p => p.name).join(', ');
      }

      return response;
    }

    // Generic helpful response based on intent
    if (intent.room_specific) {
      return this.getGenericRoomAdvice(requirements.rooms[0]);
    }

    if (intent.issue_specific) {
      return this.getGenericIssueAdvice(requirements.issues[0]);
    }

    // Fallback response
    return `I'd be happy to help you find the right paint! Could you tell me more about:\n\n` +
           `• What room or area you're painting?\n` +
           `• What surface (walls, ceiling, wood, etc.)?\n` +
           `• Any specific requirements (moisture resistance, washability, etc.)?\n\n` +
           `This will help me recommend the perfect product for your project!`;
  }

  getGenericRoomAdvice(room) {
    const advice = {
      bathroom: 'For bathrooms, you need moisture and mould-resistant paint. The **Luja** system is specifically designed for humid environments.',
      ceiling: 'For ceilings, **Anti-Reflex White [2]** is excellent - it\'s ultra-matt and minimizes roller marks.',
      kitchen: 'For kitchens, look for washable, durable paints that can handle cleaning. The **Optiva** range is a great choice.',
      exterior: 'For exterior surfaces, you need weather-resistant paint. What specific surface are you painting (wood, masonry, metal)?'
    };

    return advice[room] || 'Could you tell me more about what you\'re looking to paint?';
  }

  getGenericIssueAdvice(issue) {
    const advice = {
      moisture: 'For moisture issues, the **Luja** range offers excellent moisture and mould resistance.',
      mould: 'To prevent mould, use the **Luja** system which has mould-resistant properties.',
      durability: 'For high durability, consider the **Optiva** range which offers excellent washability and scrub resistance.'
    };

    return advice[issue] || 'I can help with that! What surface are you treating?';
  }
}
