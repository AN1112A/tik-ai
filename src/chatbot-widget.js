/**
 * Tikkurila Decorating Assistant - Embeddable Chatbot Widget
 * 
 * Features:
 * - Modern, responsive UI with smooth animations
 * - AI-powered decorating advice and product recommendations
 * - Knowledge base integration (FAQs, products, rules)
 * - Conversation memory and context
 * - Easy embedding on any webpage
 */

import { KB } from './kb-loader.mjs';
import { ChatbotEngine } from './chatbot-engine.js';

export class TikkurilaChatbot {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || window.location.origin,
      apiKey: options.apiKey || null, // For OpenAI/Anthropic integration
      apiProvider: options.apiProvider || 'openai', // 'openai' or 'anthropic'
      position: options.position || 'bottom-right', // 'bottom-right', 'bottom-left'
      primaryColor: options.primaryColor || '#0066cc',
      accentColor: options.accentColor || '#004999',
      greeting: options.greeting || "Hi! I'm your Tikkurila decorating assistant. How can I help you today?",
      ...options
    };

    this.isOpen = false;
    this.kb = new KB(this.options.baseUrl);
    this.engine = null;
    this.container = null;
    this.messages = [];
  }

  async init() {
    // Load knowledge base
    await this.kb.loadIndex();
    
    // Initialize chatbot engine
    this.engine = new ChatbotEngine(this.kb, this.options);
    await this.engine.init();
    
    // Create UI
    this.createWidget();
    
    // Add initial greeting
    this.addMessage({
      type: 'bot',
      content: this.options.greeting,
      timestamp: new Date()
    });
  }

  createWidget() {
    // Create container
    this.container = document.createElement('div');
    this.container.id = 'tikkurila-chatbot';
    this.container.className = 'tikkurila-chatbot-container';
    
    // Add styles
    this.injectStyles();
    
    // Create chat button
    const button = this.createChatButton();
    this.container.appendChild(button);
    
    // Create chat window
    const chatWindow = this.createChatWindow();
    this.container.appendChild(chatWindow);
    
    // Add to DOM
    document.body.appendChild(this.container);
  }

  createChatButton() {
    const button = document.createElement('button');
    button.className = 'tikkurila-chat-button';
    button.innerHTML = `
      <svg class="icon-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg class="icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    
    button.addEventListener('click', () => this.toggle());
    
    return button;
  }

  createChatWindow() {
    const window = document.createElement('div');
    window.className = 'tikkurila-chat-window';
    
    window.innerHTML = `
      <div class="tikkurila-chat-header">
        <div class="header-content">
          <div class="avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="header-text">
            <h3>Tikkurila Assistant</h3>
            <span class="status">Online</span>
          </div>
        </div>
        <button class="minimize-btn" title="Minimize">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      
      <div class="tikkurila-chat-messages" id="tikkurila-messages"></div>
      
      <div class="tikkurila-chat-input-area">
        <div class="quick-questions" id="quick-questions"></div>
        <div class="input-wrapper">
          <textarea 
            id="tikkurila-input" 
            placeholder="Ask about painting or decorating..." 
            rows="1"
          ></textarea>
          <button class="send-button" id="tikkurila-send" title="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div class="powered-by">
          Powered by AI • <a href="https://www.tikkurila.co.uk" target="_blank">Tikkurila</a>
        </div>
      </div>
    `;
    
    // Add event listeners
    const input = window.querySelector('#tikkurila-input');
    const sendBtn = window.querySelector('#tikkurila-send');
    const minimizeBtn = window.querySelector('.minimize-btn');
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    input.addEventListener('input', () => {
      this.autoResizeTextarea(input);
    });
    
    sendBtn.addEventListener('click', () => this.sendMessage());
    minimizeBtn.addEventListener('click', () => this.toggle());
    
    // Show quick questions initially
    this.showQuickQuestions();
    
    return window;
  }

  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  showQuickQuestions() {
    const questionsContainer = document.getElementById('quick-questions');
    if (this.messages.length > 1) {
      questionsContainer.style.display = 'none';
      return;
    }
    
    const questions = [
      "What paint for my bathroom?",
      "Best ceiling paint?",
      "Painting exterior walls",
      "Primer recommendations"
    ];
    
    questionsContainer.innerHTML = questions
      .map(q => `<button class="quick-question">${q}</button>`)
      .join('');
    
    questionsContainer.querySelectorAll('.quick-question').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        document.getElementById('tikkurila-input').value = questions[i];
        this.sendMessage();
      });
    });
    
    questionsContainer.style.display = 'flex';
  }

  addMessage(message) {
    this.messages.push(message);
    
    const messagesContainer = document.getElementById('tikkurila-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${message.type}`;
    
    if (message.type === 'bot') {
      messageEl.innerHTML = `
        <div class="message-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="message-content">${this.formatMessage(message.content)}</div>
      `;
    } else {
      messageEl.innerHTML = `
        <div class="message-content">${this.escapeHtml(message.content)}</div>
      `;
    }
    
    messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom with smooth animation
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
    
    // Hide quick questions after first message
    this.showQuickQuestions();
  }

  formatMessage(content) {
    // Support markdown-like formatting
    let formatted = this.escapeHtml(content);
    
    // Bold text **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('tikkurila-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'message message-bot typing-indicator';
    typingEl.id = 'typing-indicator';
    typingEl.innerHTML = `
      <div class="message-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  removeTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  }

  async sendMessage() {
    const input = document.getElementById('tikkurila-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage({
      type: 'user',
      content: message,
      timestamp: new Date()
    });
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      // Get bot response
      const response = await this.engine.processMessage(message, this.messages);
      
      // Remove typing indicator
      this.removeTypingIndicator();
      
      // Add bot response
      this.addMessage({
        type: 'bot',
        content: response,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      this.removeTypingIndicator();
      
      this.addMessage({
        type: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again or contact our support team.",
        timestamp: new Date()
      });
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.container.classList.add('open');
      setTimeout(() => {
        document.getElementById('tikkurila-input')?.focus();
      }, 300);
    } else {
      this.container.classList.remove('open');
    }
  }

  injectStyles() {
    if (document.getElementById('tikkurila-chatbot-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'tikkurila-chatbot-styles';
    style.textContent = `
      .tikkurila-chatbot-container {
        --primary-color: ${this.options.primaryColor};
        --accent-color: ${this.options.accentColor};
        --border-radius: 12px;
        --shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
        
        position: fixed;
        ${this.options.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        bottom: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }

      .tikkurila-chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        border: none;
        color: white;
        cursor: pointer;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }

      .tikkurila-chat-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 32px rgba(0, 0, 0, 0.2);
      }

      .tikkurila-chat-button .icon-close {
        display: none;
        position: absolute;
      }

      .tikkurila-chat-button .icon-chat {
        display: block;
      }

      .tikkurila-chatbot-container.open .tikkurila-chat-button .icon-close {
        display: block;
      }

      .tikkurila-chatbot-container.open .tikkurila-chat-button .icon-chat {
        display: none;
      }

      .tikkurila-chat-window {
        position: absolute;
        bottom: 80px;
        ${this.options.position.includes('right') ? 'right: 0;' : 'left: 0;'}
        width: 380px;
        max-width: calc(100vw - 40px);
        height: 600px;
        max-height: calc(100vh - 120px);
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        opacity: 0;
        transform: scale(0.8) translateY(20px);
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .tikkurila-chatbot-container.open .tikkurila-chat-window {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: all;
      }

      .tikkurila-chat-header {
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        color: white;
        padding: 16px 20px;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .tikkurila-chat-header .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .tikkurila-chat-header .avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tikkurila-chat-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .tikkurila-chat-header .status {
        font-size: 12px;
        opacity: 0.9;
      }

      .tikkurila-chat-header .minimize-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: background 0.2s;
      }

      .tikkurila-chat-header .minimize-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .tikkurila-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: #f5f7f9;
      }

      .tikkurila-chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .tikkurila-chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .tikkurila-chat-messages::-webkit-scrollbar-thumb {
        background: #cbd5e0;
        border-radius: 3px;
      }

      .message {
        display: flex;
        gap: 10px;
        animation: messageSlide 0.3s ease-out;
      }

      @keyframes messageSlide {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .message-bot {
        align-self: flex-start;
      }

      .message-user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      .message-avatar {
        width: 32px;
        height: 32px;
        background: var(--primary-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
      }

      .message-content {
        max-width: 75%;
        padding: 12px 16px;
        border-radius: 12px;
        line-height: 1.5;
        font-size: 14px;
      }

      .message-bot .message-content {
        background: white;
        color: #2d3748;
        border-bottom-left-radius: 4px;
      }

      .message-user .message-content {
        background: var(--primary-color);
        color: white;
        border-bottom-right-radius: 4px;
      }

      .message-content a {
        color: inherit;
        text-decoration: underline;
      }

      .message-user .message-content a {
        color: white;
      }

      .typing-indicator .message-content {
        padding: 16px;
      }

      .typing-dots {
        display: flex;
        gap: 4px;
      }

      .typing-dots span {
        width: 8px;
        height: 8px;
        background: #cbd5e0;
        border-radius: 50%;
        animation: typing 1.4s infinite;
      }

      .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-10px);
        }
      }

      .tikkurila-chat-input-area {
        border-top: 1px solid #e2e8f0;
        background: white;
        padding: 16px;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
      }

      .quick-questions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }

      .quick-question {
        padding: 8px 12px;
        background: #f5f7f9;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        font-size: 13px;
        color: #4a5568;
        cursor: pointer;
        transition: all 0.2s;
      }

      .quick-question:hover {
        background: #e2e8f0;
        border-color: var(--primary-color);
        color: var(--primary-color);
      }

      .input-wrapper {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }

      .input-wrapper textarea {
        flex: 1;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        font-family: inherit;
        resize: none;
        max-height: 120px;
        outline: none;
        transition: border-color 0.2s;
      }

      .input-wrapper textarea:focus {
        border-color: var(--primary-color);
      }

      .send-button {
        width: 40px;
        height: 40px;
        background: var(--primary-color);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s;
      }

      .send-button:hover {
        background: var(--accent-color);
        transform: scale(1.05);
      }

      .powered-by {
        margin-top: 12px;
        text-align: center;
        font-size: 11px;
        color: #a0aec0;
      }

      .powered-by a {
        color: var(--primary-color);
        text-decoration: none;
      }

      @media (max-width: 480px) {
        .tikkurila-chat-window {
          width: calc(100vw - 40px);
          height: calc(100vh - 100px);
          bottom: 70px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  destroy() {
    if (this.container) {
      this.container.remove();
    }
    const styles = document.getElementById('tikkurila-chatbot-styles');
    if (styles) {
      styles.remove();
    }
  }
}

// Auto-initialize if config is present
if (typeof window !== 'undefined' && window.TikkurilaChatbotConfig) {
  window.addEventListener('DOMContentLoaded', async () => {
    const chatbot = new TikkurilaChatbot(window.TikkurilaChatbotConfig);
    await chatbot.init();
    window.tikkurilaChatbot = chatbot;
  });
}
