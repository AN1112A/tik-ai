// Embeddable Chat Widget for Tikkurila
import { KB } from './kb-loader.mjs';
import { DecoratingAgent } from './ai-agent.mjs';

export class TikkilaChat {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || '';
    this.theme = {
      primaryColor: options.primaryColor || '#E30613', // Tikkurila red
      textColor: options.textColor || '#333333',
      backgroundColor: options.backgroundColor || '#ffffff',
      ...options.theme
    };
    
    this.kb = null;
    this.agent = null;
    this.isOpen = false;
    this.isInitialized = false;
    this.container = null;
    this.messagesContainer = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    // Initialize KB and Agent
    this.kb = new KB(this.baseUrl);
    this.agent = new DecoratingAgent(this.kb);
    
    try {
      await this.agent.initialize();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Tikkurila chat:', error);
      throw error;
    }
  }

  render() {
    // Create main container
    this.container = document.createElement('div');
    this.container.id = 'tikkurila-chat-widget';
    this.container.innerHTML = this.getHTML();
    document.body.appendChild(this.container);
    
    // Add styles
    this.addStyles();
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Show welcome message
    this.addMessage(
      "Hello! I'm your Tikkurila decorating assistant. I can help you find the perfect paint for your project. What are you looking to paint today?",
      'bot'
    );
  }

  getHTML() {
    return `
      <!-- Chat Button -->
      <button id="tikkurila-chat-button" class="tikkurila-chat-button" aria-label="Open chat">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
          <circle cx="12" cy="10" r="1.5" fill="white"/>
          <circle cx="8" cy="10" r="1.5" fill="white"/>
          <circle cx="16" cy="10" r="1.5" fill="white"/>
        </svg>
      </button>

      <!-- Chat Window -->
      <div id="tikkurila-chat-window" class="tikkurila-chat-window" style="display: none;">
        <div class="tikkurila-chat-header">
          <div class="tikkurila-chat-header-content">
            <div class="tikkurila-chat-logo">🎨</div>
            <div class="tikkurila-chat-title">
              <h3>Tikkurila Assistant</h3>
              <p>Decorating advice & product recommendations</p>
            </div>
          </div>
          <button id="tikkurila-chat-close" class="tikkurila-chat-close" aria-label="Close chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" fill="white"/>
            </svg>
          </button>
        </div>

        <div id="tikkurila-chat-messages" class="tikkurila-chat-messages">
          <!-- Messages will be added here -->
        </div>

        <div class="tikkurila-chat-input-container">
          <div class="tikkurila-chat-suggestions" id="tikkurila-chat-suggestions">
            <button class="tikkurila-suggestion-btn" data-message="What should I use on ceilings?">Ceiling paint</button>
            <button class="tikkurila-suggestion-btn" data-message="What should I use in a bathroom?">Bathroom paint</button>
            <button class="tikkurila-suggestion-btn" data-message="I need help choosing paint">Help me choose</button>
          </div>
          
          <div class="tikkurila-chat-input-wrapper">
            <input 
              type="text" 
              id="tikkurila-chat-input" 
              class="tikkurila-chat-input" 
              placeholder="Ask about decorating..."
              autocomplete="off"
            />
            <button id="tikkurila-chat-send" class="tikkurila-chat-send" aria-label="Send message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10L17 12 2 14L2.01 21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  addStyles() {
    if (document.getElementById('tikkurila-chat-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'tikkurila-chat-styles';
    style.textContent = `
      #tikkurila-chat-widget * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .tikkurila-chat-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${this.theme.primaryColor};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
        z-index: 999999;
      }

      .tikkurila-chat-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .tikkurila-chat-window {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 400px;
        max-width: calc(100vw - 40px);
        height: 600px;
        max-height: calc(100vh - 120px);
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        z-index: 999998;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .tikkurila-chat-header {
        background: ${this.theme.primaryColor};
        color: white;
        padding: 20px;
        border-radius: 16px 16px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tikkurila-chat-header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .tikkurila-chat-logo {
        font-size: 32px;
        line-height: 1;
      }

      .tikkurila-chat-title h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .tikkurila-chat-title p {
        font-size: 12px;
        opacity: 0.9;
      }

      .tikkurila-chat-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .tikkurila-chat-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .tikkurila-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f8f9fa;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .tikkurila-message {
        display: flex;
        gap: 8px;
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

      .tikkurila-message.user {
        flex-direction: row-reverse;
      }

      .tikkurila-message-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 18px;
      }

      .tikkurila-message.bot .tikkurila-message-avatar {
        background: ${this.theme.primaryColor};
        color: white;
      }

      .tikkurila-message.user .tikkurila-message-avatar {
        background: #6c757d;
        color: white;
      }

      .tikkurila-message-bubble {
        max-width: 70%;
        padding: 12px 16px;
        border-radius: 16px;
        line-height: 1.5;
        font-size: 14px;
      }

      .tikkurila-message.bot .tikkurila-message-bubble {
        background: white;
        color: ${this.theme.textColor};
        border-bottom-left-radius: 4px;
      }

      .tikkurila-message.user .tikkurila-message-bubble {
        background: ${this.theme.primaryColor};
        color: white;
        border-bottom-right-radius: 4px;
      }

      .tikkurila-message-bubble strong {
        font-weight: 600;
      }

      .tikkurila-message-bubble a {
        color: inherit;
        text-decoration: underline;
      }

      .tikkurila-message.user .tikkurila-message-bubble a {
        color: white;
      }

      .tikkurila-typing {
        display: flex;
        gap: 4px;
        padding: 12px;
      }

      .tikkurila-typing span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #adb5bd;
        animation: typing 1.4s infinite;
      }

      .tikkurila-typing span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .tikkurila-typing span:nth-child(3) {
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

      .tikkurila-chat-input-container {
        background: white;
        border-top: 1px solid #e9ecef;
        padding: 16px;
        border-radius: 0 0 16px 16px;
      }

      .tikkurila-chat-suggestions {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }

      .tikkurila-suggestion-btn {
        padding: 8px 12px;
        border: 1px solid #dee2e6;
        background: white;
        border-radius: 20px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
        color: ${this.theme.textColor};
      }

      .tikkurila-suggestion-btn:hover {
        background: ${this.theme.primaryColor};
        color: white;
        border-color: ${this.theme.primaryColor};
      }

      .tikkurila-chat-input-wrapper {
        display: flex;
        gap: 8px;
      }

      .tikkurila-chat-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #dee2e6;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      .tikkurila-chat-input:focus {
        border-color: ${this.theme.primaryColor};
      }

      .tikkurila-chat-send {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: ${this.theme.primaryColor};
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      }

      .tikkurila-chat-send:hover {
        transform: scale(1.05);
      }

      .tikkurila-chat-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      @media (max-width: 480px) {
        .tikkurila-chat-window {
          bottom: 0;
          right: 0;
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
        }

        .tikkurila-chat-header {
          border-radius: 0;
        }

        .tikkurila-chat-input-container {
          border-radius: 0;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  attachEventListeners() {
    const button = document.getElementById('tikkurila-chat-button');
    const closeBtn = document.getElementById('tikkurila-chat-close');
    const sendBtn = document.getElementById('tikkurila-chat-send');
    const input = document.getElementById('tikkurila-chat-input');
    const suggestions = document.querySelectorAll('.tikkurila-suggestion-btn');

    button.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.toggleChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    suggestions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const message = e.target.getAttribute('data-message');
        input.value = message;
        this.sendMessage();
      });
    });

    this.messagesContainer = document.getElementById('tikkurila-chat-messages');
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('tikkurila-chat-window');
    window.style.display = this.isOpen ? 'flex' : 'none';
    
    if (this.isOpen) {
      document.getElementById('tikkurila-chat-input').focus();
    }
  }

  async sendMessage() {
    const input = document.getElementById('tikkurila-chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    this.addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    this.showTyping();
    
    // Get AI response
    try {
      const response = await this.agent.processMessage(message);
      this.hideTyping();
      this.addMessage(response.text, 'bot');
    } catch (error) {
      this.hideTyping();
      this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      console.error('Chat error:', error);
    }
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `tikkurila-message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'tikkurila-message-avatar';
    avatar.textContent = sender === 'bot' ? '🎨' : '👤';
    
    const bubble = document.createElement('div');
    bubble.className = 'tikkurila-message-bubble';
    
    // Convert markdown-style links to HTML
    const htmlText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    // Convert **text** to <strong>
    const formattedText = htmlText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    bubble.innerHTML = formattedText.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  showTyping() {
    const typing = document.createElement('div');
    typing.id = 'tikkurila-typing-indicator';
    typing.className = 'tikkurila-message bot';
    typing.innerHTML = `
      <div class="tikkurila-message-avatar">🎨</div>
      <div class="tikkurila-message-bubble">
        <div class="tikkurila-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(typing);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('tikkurila-typing-indicator');
    if (typing) typing.remove();
  }
}

// Auto-initialize if data-auto-init attribute is present
if (typeof window !== 'undefined') {
  window.TikkilaChat = TikkilaChat;
}
