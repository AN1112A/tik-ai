// Tikkurila Decorating Assistant - Embeddable Script
// This script can be embedded on any website to add the Tikkurila chat assistant

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    version: '1.0.0',
    baseUrl: 'https://your-domain.com', // Will be set by the embedding site
    theme: 'light',
    position: 'bottom-right',
    primaryColor: '#1e40af',
    accentColor: '#3b82f6',
    autoLoad: true,
    debug: false
  };

  // Global namespace
  window.TikkurilaAssistant = {
    version: CONFIG.version,
    instances: new Map(),
    
    // Initialize the assistant
    init: async function(options = {}) {
      const config = { ...CONFIG, ...options };
      
      // Create container
      const container = document.createElement('div');
      container.id = `tikkurila-assistant-${Date.now()}`;
      container.style.cssText = 'position: fixed; z-index: 10000;';
      
      // Add to page
      document.body.appendChild(container);
      
      try {
        // Import and initialize chat interface
        const { TikkurilaChatInterface } = await import('./chat-interface.mjs');
        const chatInterface = new TikkurilaChatInterface(container, config);
        
        // Store instance
        this.instances.set(container.id, chatInterface);
        
        if (config.debug) {
          console.log('Tikkurila Assistant initialized:', container.id);
        }
        
        return chatInterface;
      } catch (error) {
        console.error('Failed to initialize Tikkurila Assistant:', error);
        container.remove();
        throw error;
      }
    },
    
    // Get instance by ID
    getInstance: function(id) {
      return this.instances.get(id);
    },
    
    // Remove instance
    destroy: function(id) {
      const instance = this.instances.get(id);
      if (instance) {
        instance.close();
        instance.container.remove();
        this.instances.delete(id);
      }
    },
    
    // Remove all instances
    destroyAll: function() {
      for (const [id, instance] of this.instances) {
        instance.close();
        instance.container.remove();
      }
      this.instances.clear();
    }
  };

  // Auto-initialize if configured
  if (CONFIG.autoLoad && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Check for data attributes on script tag
      const script = document.currentScript;
      if (script) {
        const options = {};
        
        // Parse data attributes
        for (const attr of script.attributes) {
          if (attr.name.startsWith('data-')) {
            const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            let value = attr.value;
            
            // Parse boolean values
            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            
            // Parse JSON values
            if (value.startsWith('{') || value.startsWith('[')) {
              try {
                value = JSON.parse(value);
              } catch (e) {
                // Keep as string if JSON parsing fails
              }
            }
            
            options[key] = value;
          }
        }
        
        // Initialize with options
        TikkurilaAssistant.init(options).catch(console.error);
      }
    });
  }

  // Expose global API
  window.TikkurilaChat = TikkurilaAssistant;

})();