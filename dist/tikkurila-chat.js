// Tikkurila Chat Widget - Embeddable Script
// Usage: <script src="https://your-domain.com/dist/tikkurila-chat.js" data-base-url="https://your-kb-url.com"></script>

(function() {
  'use strict';

  // Get configuration from script tag
  const currentScript = document.currentScript || document.querySelector('script[src*="tikkurila-chat.js"]');
  const baseUrl = currentScript?.getAttribute('data-base-url') || '';
  const primaryColor = currentScript?.getAttribute('data-primary-color') || '#E30613';

  // Load the modules and initialize
  async function init() {
    try {
      // Dynamically import the modules
      const kbModule = await import(baseUrl + '/src/kb-loader.mjs');
      const agentModule = await import(baseUrl + '/src/ai-agent.mjs');
      const chatModule = await import(baseUrl + '/src/chat-widget.mjs');

      const { TikkilaChat } = chatModule;

      // Create and initialize the chat widget
      const chat = new TikkilaChat({
        baseUrl: baseUrl,
        primaryColor: primaryColor
      });

      await chat.initialize();
      chat.render();

      console.log('✅ Tikkurila Chat Widget initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Tikkurila Chat Widget:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
