// Embeddable Chat Interface for Tikkurila Decorating Assistant
export class TikkurilaChatInterface {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      theme: 'light',
      position: 'bottom-right',
      primaryColor: '#1e40af', // Tikkurila blue
      accentColor: '#3b82f6',
      ...options
    };
    
    this.isOpen = false;
    this.isMinimized = false;
    this.agent = null;
    this.kb = null;
    
    this.init();
  }

  async init() {
    // Import dependencies
    const { KB } = await import('./kb-loader.mjs');
    const { TikkurilaAgent } = await import('./ai-agent.mjs');
    
    // Initialize knowledge base and agent
    this.kb = new KB(this.options.baseUrl || window.location.origin);
    this.agent = new TikkurilaAgent(this.kb);
    
    this.createInterface();
    this.attachEventListeners();
  }

  createInterface() {
    // Create main chat container
    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'tikkurila-chat-container';
    this.chatContainer.innerHTML = `
      <div class="tikkurila-chat-widget">
        <div class="tikkurila-chat-header">
          <div class="tikkurila-chat-title">
            <div class="tikkurila-chat-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="tikkurila-chat-info">
              <h3>Tikkurila Assistant</h3>
              <p>Decorating Expert</p>
            </div>
          </div>
          <div class="tikkurila-chat-controls">
            <button class="tikkurila-chat-minimize" title="Minimize">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="tikkurila-chat-close" title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="tikkurila-chat-body">
          <div class="tikkurila-chat-messages" id="tikkurila-messages">
            <div class="tikkurila-message tikkurila-message-assistant">
              <div class="tikkurila-message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tikkurila-message-content">
                <p>Hello! I'm your Tikkurila decorating assistant. I can help you find the perfect paint for your project. What room are you looking to paint?</p>
                <div class="tikkurila-suggestions">
                  <button class="tikkurila-suggestion-btn" data-message="I'm painting my living room">Living Room</button>
                  <button class="tikkurila-suggestion-btn" data-message="I need help with my bathroom">Bathroom</button>
                  <button class="tikkurila-suggestion-btn" data-message="I'm painting my kitchen">Kitchen</button>
                  <button class="tikkurila-suggestion-btn" data-message="I have a specific problem">I have a problem</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tikkurila-chat-input-container">
            <div class="tikkurila-chat-input-wrapper">
              <input type="text" 
                     class="tikkurila-chat-input" 
                     placeholder="Ask about your decorating project..." 
                     maxlength="500">
              <button class="tikkurila-chat-send" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="tikkurila-chat-typing" style="display: none;">
              <div class="tikkurila-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>Assistant is typing...</span>
            </div>
          </div>
        </div>
      </div>
      
      <button class="tikkurila-chat-toggle" title="Open Tikkurila Assistant">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="tikkurila-chat-badge">1</span>
      </button>
    `;

    // Add styles
    this.addStyles();
    
    // Append to container
    this.container.appendChild(this.chatContainer);
    
    // Initialize state
    this.updateInterfaceState();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .tikkurila-chat-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        font-size: 14px;
        line-height: 1.5;
      }

      .tikkurila-chat-widget {
        width: 380px;
        height: 600px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .tikkurila-chat-widget.open {
        transform: translateY(0);
        opacity: 1;
      }

      .tikkurila-chat-widget.minimized {
        height: 60px;
      }

      .tikkurila-chat-header {
        background: linear-gradient(135deg, ${this.options.primaryColor} 0%, ${this.options.accentColor} 100%);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }

      .tikkurila-chat-title {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .tikkurila-chat-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tikkurila-chat-info h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .tikkurila-chat-info p {
        margin: 0;
        font-size: 12px;
        opacity: 0.9;
      }

      .tikkurila-chat-controls {
        display: flex;
        gap: 8px;
      }

      .tikkurila-chat-controls button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }

      .tikkurila-chat-controls button:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .tikkurila-chat-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .tikkurila-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .tikkurila-message {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .tikkurila-message-user {
        flex-direction: row-reverse;
      }

      .tikkurila-message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .tikkurila-message-assistant .tikkurila-message-avatar {
        background: #f3f4f6;
        color: ${this.options.primaryColor};
      }

      .tikkurila-message-user .tikkurila-message-avatar {
        background: ${this.options.primaryColor};
        color: white;
      }

      .tikkurila-message-content {
        flex: 1;
        min-width: 0;
      }

      .tikkurila-message-assistant .tikkurila-message-content {
        background: #f9fafb;
        padding: 12px 16px;
        border-radius: 18px 18px 18px 4px;
        border: 1px solid #e5e7eb;
      }

      .tikkurila-message-user .tikkurila-message-content {
        background: ${this.options.primaryColor};
        color: white;
        padding: 12px 16px;
        border-radius: 18px 18px 4px 18px;
      }

      .tikkurila-message-content p {
        margin: 0 0 8px 0;
      }

      .tikkurila-message-content p:last-child {
        margin-bottom: 0;
      }

      .tikkurila-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }

      .tikkurila-suggestion-btn {
        background: white;
        border: 1px solid #d1d5db;
        color: #374151;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .tikkurila-suggestion-btn:hover {
        background: ${this.options.primaryColor};
        color: white;
        border-color: ${this.options.primaryColor};
      }

      .tikkurila-chat-input-container {
        padding: 16px 20px;
        border-top: 1px solid #e5e7eb;
        background: white;
      }

      .tikkurila-chat-input-wrapper {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .tikkurila-chat-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      .tikkurila-chat-input:focus {
        border-color: ${this.options.primaryColor};
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .tikkurila-chat-send {
        background: ${this.options.primaryColor};
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .tikkurila-chat-send:disabled {
        background: #d1d5db;
        cursor: not-allowed;
      }

      .tikkurila-chat-send:not(:disabled):hover {
        background: ${this.options.accentColor};
        transform: scale(1.05);
      }

      .tikkurila-chat-typing {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        color: #6b7280;
        font-size: 12px;
      }

      .tikkurila-typing-indicator {
        display: flex;
        gap: 4px;
      }

      .tikkurila-typing-indicator span {
        width: 6px;
        height: 6px;
        background: #6b7280;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
      }

      .tikkurila-typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .tikkurila-typing-indicator span:nth-child(3) {
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

      .tikkurila-chat-toggle {
        background: ${this.options.primaryColor};
        border: none;
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }

      .tikkurila-chat-toggle:hover {
        background: ${this.options.accentColor};
        transform: scale(1.1);
      }

      .tikkurila-chat-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ef4444;
        color: white;
        font-size: 12px;
        font-weight: 600;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }

      .tikkurila-chat-widget.hidden {
        display: none;
      }

      .tikkurila-chat-toggle.hidden {
        display: none;
      }

      /* Responsive design */
      @media (max-width: 480px) {
        .tikkurila-chat-container {
          bottom: 10px;
          right: 10px;
          left: 10px;
        }

        .tikkurila-chat-widget {
          width: 100%;
          height: 70vh;
          max-height: 600px;
        }
      }

      /* Dark theme support */
      @media (prefers-color-scheme: dark) {
        .tikkurila-chat-widget {
          background: #1f2937;
          border-color: #374151;
        }

        .tikkurila-message-assistant .tikkurila-message-content {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }

        .tikkurila-chat-input {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }

        .tikkurila-chat-input-container {
          background: #1f2937;
          border-color: #374151;
        }

        .tikkurila-suggestion-btn {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  attachEventListeners() {
    const toggle = this.chatContainer.querySelector('.tikkurila-chat-toggle');
    const closeBtn = this.chatContainer.querySelector('.tikkurila-chat-close');
    const minimizeBtn = this.chatContainer.querySelector('.tikkurila-chat-minimize');
    const input = this.chatContainer.querySelector('.tikkurila-chat-input');
    const sendBtn = this.chatContainer.querySelector('.tikkurila-chat-send');
    const header = this.chatContainer.querySelector('.tikkurila-chat-header');

    // Toggle chat
    toggle.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeChat();
    });
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMinimize();
    });

    // Header click to restore if minimized
    header.addEventListener('click', () => {
      if (this.isMinimized) {
        this.toggleMinimize();
      }
    });

    // Input handling
    input.addEventListener('input', () => {
      sendBtn.disabled = !input.value.trim();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    sendBtn.addEventListener('click', () => this.sendMessage());

    // Suggestion buttons
    this.chatContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('tikkurila-suggestion-btn')) {
        const message = e.target.dataset.message;
        input.value = message;
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.updateInterfaceState();
  }

  closeChat() {
    this.isOpen = false;
    this.isMinimized = false;
    this.updateInterfaceState();
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.updateInterfaceState();
  }

  updateInterfaceState() {
    const widget = this.chatContainer.querySelector('.tikkurila-chat-widget');
    const toggle = this.chatContainer.querySelector('.tikkurila-chat-toggle');

    if (this.isOpen) {
      widget.classList.add('open');
      toggle.classList.add('hidden');
    } else {
      widget.classList.remove('open');
      toggle.classList.remove('hidden');
    }

    if (this.isMinimized) {
      widget.classList.add('minimized');
    } else {
      widget.classList.remove('minimized');
    }
  }

  async sendMessage() {
    const input = this.chatContainer.querySelector('.tikkurila-chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Clear input and disable send button
    input.value = '';
    input.disabled = true;
    this.chatContainer.querySelector('.tikkurila-chat-send').disabled = true;

    // Add user message
    this.addMessage(message, 'user');

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Process message with AI agent
      const response = await this.agent.processMessage(message);
      
      // Hide typing indicator
      this.hideTypingIndicator();
      
      // Add assistant response
      this.addMessage(response.text, 'assistant', response.suggestions, response.links);
      
    } catch (error) {
      console.error('Error processing message:', error);
      this.hideTypingIndicator();
      this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    } finally {
      // Re-enable input
      input.disabled = false;
      input.focus();
    }
  }

  addMessage(text, sender, suggestions = [], links = {}) {
    const messagesContainer = this.chatContainer.querySelector('.tikkurila-chat-messages');
    
    const messageEl = document.createElement('div');
    messageEl.className = `tikkurila-message tikkurila-message-${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'tikkurila-message-avatar';
    
    if (sender === 'assistant') {
      avatar.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      `;
    } else {
      avatar.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
    
    const content = document.createElement('div');
    content.className = 'tikkurila-message-content';
    
    // Add text content
    const textEl = document.createElement('p');
    textEl.textContent = text;
    content.appendChild(textEl);
    
    // Add suggestions if provided
    if (suggestions && suggestions.length > 0) {
      const suggestionsEl = document.createElement('div');
      suggestionsEl.className = 'tikkurila-suggestions';
      
      suggestions.forEach(suggestion => {
        const btn = document.createElement('button');
        btn.className = 'tikkurila-suggestion-btn';
        btn.textContent = typeof suggestion === 'string' ? suggestion : suggestion.text;
        btn.dataset.message = typeof suggestion === 'string' ? suggestion : suggestion.text;
        suggestionsEl.appendChild(btn);
      });
      
      content.appendChild(suggestionsEl);
    }
    
    messageEl.appendChild(avatar);
    messageEl.appendChild(content);
    messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTypingIndicator() {
    const typingEl = this.chatContainer.querySelector('.tikkurila-chat-typing');
    typingEl.style.display = 'flex';
  }

  hideTypingIndicator() {
    const typingEl = this.chatContainer.querySelector('.tikkurila-chat-typing');
    typingEl.style.display = 'none';
  }

  // Public API methods
  open() {
    this.isOpen = true;
    this.isMinimized = false;
    this.updateInterfaceState();
  }

  close() {
    this.closeChat();
  }

  reset() {
    this.agent.resetConversation();
    const messagesContainer = this.chatContainer.querySelector('.tikkurila-chat-messages');
    messagesContainer.innerHTML = `
      <div class="tikkurila-message tikkurila-message-assistant">
        <div class="tikkurila-message-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="tikkurila-message-content">
          <p>Hello! I'm your Tikkurila decorating assistant. I can help you find the perfect paint for your project. What room are you looking to paint?</p>
          <div class="tikkurila-suggestions">
            <button class="tikkurila-suggestion-btn" data-message="I'm painting my living room">Living Room</button>
            <button class="tikkurila-suggestion-btn" data-message="I need help with my bathroom">Bathroom</button>
            <button class="tikkurila-suggestion-btn" data-message="I'm painting my kitchen">Kitchen</button>
            <button class="tikkurila-suggestion-btn" data-message="I have a specific problem">I have a problem</button>
          </div>
        </div>
      </div>
    `;
  }
}