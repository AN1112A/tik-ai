/**
 * Tikkurila Chatbot - Easy Embed Script
 * 
 * Add this script to your website to enable the Tikkurila Decorating Assistant
 * 
 * Usage:
 * <script src="https://your-domain.github.io/your-repo/embed.js"></script>
 * <script>
 *   TikkurilaChat.init({
 *     apiKey: 'your-openai-or-anthropic-key', // Optional - works without AI too
 *     apiProvider: 'openai', // or 'anthropic'
 *     primaryColor: '#0066cc',
 *     position: 'bottom-right'
 *   });
 * </script>
 */

(function() {
  'use strict';

  // Determine base URL from script tag
  const currentScript = document.currentScript || document.querySelector('script[src*="embed.js"]');
  const scriptSrc = currentScript ? currentScript.src : '';
  const baseUrl = scriptSrc.replace(/\/embed\.js.*$/, '');

  // Global API
  window.TikkurilaChat = {
    _chatbot: null,
    _config: null,

    /**
     * Initialize the chatbot
     * @param {Object} config - Configuration options
     * @param {string} config.apiKey - OpenAI or Anthropic API key (optional)
     * @param {string} config.apiProvider - 'openai' or 'anthropic' (default: 'openai')
     * @param {string} config.model - AI model to use (optional)
     * @param {string} config.baseUrl - Base URL for knowledge base (default: auto-detected)
     * @param {string} config.position - 'bottom-right' or 'bottom-left' (default: 'bottom-right')
     * @param {string} config.primaryColor - Primary brand color (default: '#0066cc')
     * @param {string} config.accentColor - Accent color (default: '#004999')
     * @param {string} config.greeting - Initial greeting message
     */
    init: async function(config = {}) {
      if (this._chatbot) {
        console.warn('Tikkurila Chat already initialized');
        return;
      }

      this._config = {
        baseUrl: baseUrl,
        ...config
      };

      // Load dependencies
      await this._loadDependencies();

      // Create chatbot instance
      const { TikkurilaChatbot } = await import(`${baseUrl}/src/chatbot-widget.js`);
      this._chatbot = new TikkurilaChatbot(this._config);
      await this._chatbot.init();

      console.log('✅ Tikkurila Chat initialized');
    },

    /**
     * Open the chatbot
     */
    open: function() {
      if (this._chatbot && !this._chatbot.isOpen) {
        this._chatbot.toggle();
      }
    },

    /**
     * Close the chatbot
     */
    close: function() {
      if (this._chatbot && this._chatbot.isOpen) {
        this._chatbot.toggle();
      }
    },

    /**
     * Toggle the chatbot
     */
    toggle: function() {
      if (this._chatbot) {
        this._chatbot.toggle();
      }
    },

    /**
     * Destroy the chatbot
     */
    destroy: function() {
      if (this._chatbot) {
        this._chatbot.destroy();
        this._chatbot = null;
      }
    },

    /**
     * Send a message programmatically
     * @param {string} message - The message to send
     */
    sendMessage: function(message) {
      if (this._chatbot) {
        if (!this._chatbot.isOpen) {
          this._chatbot.toggle();
        }
        const input = document.getElementById('tikkurila-input');
        if (input) {
          input.value = message;
          this._chatbot.sendMessage();
        }
      }
    },

    _loadDependencies: async function() {
      // Dependencies are loaded via ES modules in the widget
      return Promise.resolve();
    }
  };

  // Auto-initialize if config is set before script loads
  if (window.TikkurilaChatbotConfig) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.TikkurilaChat.init(window.TikkurilaChatbotConfig);
      });
    } else {
      window.TikkurilaChat.init(window.TikkurilaChatbotConfig);
    }
  }
})();
