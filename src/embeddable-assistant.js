// Tikkurila AI Decorating Assistant - Embeddable Component
class TikkurilaEmbeddableAssistant {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      apiKey: options.apiKey || '',
      baseUrl: options.baseUrl || window.location.origin,
      theme: options.theme || 'light',
      position: options.position || 'bottom-right',
      ...options
    };
    
    this.assistant = new TikkurilaAIAssistant(this.options.apiKey, this.options.baseUrl);
    this.isOpen = false;
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    if (!this.container) {
      console.error('Container element not found');
      return;
    }

    this.createWidget();
    await this.assistant.initialize();
    this.isInitialized = true;
    
    // Show welcome message
    this.addMessage('assistant', "Hi! I'm your Tikkurila decorating assistant. I can help you find the perfect paint for your project. What are you looking to paint today?");
  }

  createWidget() {
    this.container.innerHTML = `
      <div class="tikkurila-assistant-widget ${this.options.theme} ${this.options.position}">
        <div class="assistant-header">
          <div class="assistant-title">
            <span class="assistant-icon">🎨</span>
            <span class="assistant-name">Tikkurila Assistant</span>
          </div>
          <button class="assistant-toggle" aria-label="Toggle chat">
            <span class="toggle-icon">💬</span>
          </button>
        </div>
        
        <div class="assistant-chat ${this.isOpen ? 'open' : ''}">
          <div class="chat-messages" id="chat-messages"></div>
          <div class="chat-input-container">
            <input type="text" class="chat-input" placeholder="Ask about your decorating project..." />
            <button class="send-button" aria-label="Send message">Send</button>
          </div>
        </div>
      </div>
    `;

    this.addStyles();
    this.bindEvents();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .tikkurila-assistant-widget {
        position: fixed;
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }

      .tikkurila-assistant-widget.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      .tikkurila-assistant-widget.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      .tikkurila-assistant-widget.top-right {
        top: 20px;
        right: 20px;
      }

      .tikkurila-assistant-widget.top-left {
        top: 20px;
        left: 20px;
      }

      .assistant-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1e3a8a;
        color: white;
        padding: 12px 16px;
        border-radius: 8px 8px 0 0;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .assistant-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .assistant-icon {
        font-size: 18px;
      }

      .assistant-name {
        font-weight: 600;
      }

      .assistant-toggle {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .assistant-toggle:hover {
        background-color: rgba(255,255,255,0.1);
      }

      .toggle-icon {
        font-size: 16px;
      }

      .assistant-chat {
        background: white;
        border: 1px solid #e5e7eb;
        border-top: none;
        border-radius: 0 0 8px 8px;
        width: 350px;
        height: 400px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        transform: translateY(-100%);
        opacity: 0;
        transition: all 0.3s ease;
        position: absolute;
        bottom: 100%;
        right: 0;
      }

      .assistant-chat.open {
        transform: translateY(0);
        opacity: 1;
      }

      .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .message {
        max-width: 80%;
        padding: 8px 12px;
        border-radius: 12px;
        word-wrap: break-word;
      }

      .message.user {
        background: #1e3a8a;
        color: white;
        align-self: flex-end;
        margin-left: auto;
      }

      .message.assistant {
        background: #f3f4f6;
        color: #374151;
        align-self: flex-start;
      }

      .message.assistant a {
        color: #1e3a8a;
        text-decoration: none;
      }

      .message.assistant a:hover {
        text-decoration: underline;
      }

      .chat-input-container {
        display: flex;
        padding: 12px;
        border-top: 1px solid #e5e7eb;
        gap: 8px;
      }

      .chat-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        padding: 8px 12px;
        outline: none;
        font-size: 14px;
      }

      .chat-input:focus {
        border-color: #1e3a8a;
        box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.1);
      }

      .send-button {
        background: #1e3a8a;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      .send-button:hover {
        background: #1e40af;
      }

      .send-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .loading {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #6b7280;
        font-style: italic;
      }

      .loading-dots {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #6b7280;
        animation: loading 1.4s infinite ease-in-out both;
      }

      .loading-dots:nth-child(1) { animation-delay: -0.32s; }
      .loading-dots:nth-child(2) { animation-delay: -0.16s; }

      @keyframes loading {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }

      .product-card {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
      }

      .product-name {
        font-weight: 600;
        color: #1e3a8a;
        margin-bottom: 4px;
      }

      .product-details {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 8px;
      }

      .product-link {
        color: #1e3a8a;
        text-decoration: none;
        font-size: 12px;
        font-weight: 500;
      }

      .product-link:hover {
        text-decoration: underline;
      }

      @media (max-width: 480px) {
        .assistant-chat {
          width: 300px;
          height: 350px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  bindEvents() {
    const toggleButton = this.container.querySelector('.assistant-toggle');
    const chatInput = this.container.querySelector('.chat-input');
    const sendButton = this.container.querySelector('.send-button');

    toggleButton.addEventListener('click', () => this.toggleChat());
    
    sendButton.addEventListener('click', () => this.sendMessage());
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target) && this.isOpen) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    const chat = this.container.querySelector('.assistant-chat');
    chat.classList.add('open');
    
    // Focus input
    setTimeout(() => {
      const input = this.container.querySelector('.chat-input');
      input.focus();
    }, 300);
  }

  closeChat() {
    this.isOpen = false;
    const chat = this.container.querySelector('.assistant-chat');
    chat.classList.remove('open');
  }

  async sendMessage() {
    const input = this.container.querySelector('.chat-input');
    const message = input.value.trim();
    
    if (!message || !this.isInitialized) return;

    input.value = '';
    this.addMessage('user', message);
    this.showLoading();

    try {
      const response = await this.assistant.processQuery(message);
      this.hideLoading();
      this.addMessage('assistant', response);
    } catch (error) {
      this.hideLoading();
      this.addMessage('assistant', "I'm sorry, I'm having trouble processing your request. Please try again.");
    }
  }

  addMessage(sender, content) {
    const messagesContainer = this.container.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // Format content with basic markdown support
    const formattedContent = this.formatMessage(content);
    messageDiv.innerHTML = formattedContent;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatMessage(content) {
    // Basic markdown formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  }

  showLoading() {
    const messagesContainer = this.container.querySelector('.chat-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant loading';
    loadingDiv.id = 'loading-message';
    loadingDiv.innerHTML = `
      <span>Thinking</span>
      <div class="loading-dots"></div>
      <div class="loading-dots"></div>
      <div class="loading-dots"></div>
    `;
    
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideLoading() {
    const loadingMessage = this.container.querySelector('#loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }

  // Public API methods
  open() {
    this.openChat();
  }

  close() {
    this.closeChat();
  }

  sendMessage(message) {
    if (typeof message === 'string') {
      const input = this.container.querySelector('.chat-input');
      input.value = message;
      this.sendMessage();
    }
  }

  clearHistory() {
    this.assistant.clearHistory();
    const messagesContainer = this.container.querySelector('.chat-messages');
    messagesContainer.innerHTML = '';
    this.addMessage('assistant', "Hi! I'm your Tikkurila decorating assistant. How can I help you today?");
  }
}

// Auto-initialize if data attributes are present
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-tikkurila-assistant]');
  containers.forEach(container => {
    const options = {
      apiKey: container.dataset.apiKey || '',
      baseUrl: container.dataset.baseUrl || window.location.origin,
      theme: container.dataset.theme || 'light',
      position: container.dataset.position || 'bottom-right'
    };
    
    new TikkurilaEmbeddableAssistant(container.id, options);
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TikkurilaEmbeddableAssistant;
} else {
  window.TikkurilaEmbeddableAssistant = TikkurilaEmbeddableAssistant;
}
