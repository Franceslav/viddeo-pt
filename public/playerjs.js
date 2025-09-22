/**
 * Simple PlayerJS implementation
 * This is a basic video player that can handle various video formats
 */
(function() {
  'use strict';

  // PlayerJS constructor
  function PlayerJS(options) {
    this.container = options.container || document.body;
    this.file = options.file || '';
    this.poster = options.poster || '';
    this.title = options.title || '';
    this.autoplay = options.autoplay || false;
    this.controls = options.controls !== false;
    this.width = options.width || '100%';
    this.height = options.height || '400px';
    
    this.init();
  }

  PlayerJS.prototype.init = function() {
    // Create video element
    this.video = document.createElement('video');
    this.video.controls = this.controls;
    this.video.style.width = this.width;
    this.video.style.height = this.height;
    this.video.style.borderRadius = '8px';
    
    // Set video source
    if (this.file) {
      this.video.src = this.file;
    }
    
    // Set poster
    if (this.poster) {
      this.video.poster = this.poster;
    }
    
    // Set title
    if (this.title) {
      this.video.title = this.title;
    }
    
    // Set autoplay
    if (this.autoplay) {
      this.video.autoplay = true;
    }
    
    // Add event listeners
    this.video.addEventListener('loadstart', () => {
      console.log('PlayerJS: Video loading started');
    });
    
    this.video.addEventListener('canplay', () => {
      console.log('PlayerJS: Video can start playing');
    });
    
    this.video.addEventListener('error', (e) => {
      console.error('PlayerJS: Video error', e);
    });
    
    // Append to container
    if (typeof this.container === 'string') {
      this.container = document.querySelector(this.container);
    }
    
    if (this.container) {
      this.container.appendChild(this.video);
    }
  };

  PlayerJS.prototype.play = function() {
    if (this.video) {
      this.video.play();
    }
  };

  PlayerJS.prototype.pause = function() {
    if (this.video) {
      this.video.pause();
    }
  };

  PlayerJS.prototype.stop = function() {
    if (this.video) {
      this.video.pause();
      this.video.currentTime = 0;
    }
  };

  PlayerJS.prototype.setVolume = function(volume) {
    if (this.video) {
      this.video.volume = Math.max(0, Math.min(1, volume));
    }
  };

  PlayerJS.prototype.getVolume = function() {
    return this.video ? this.video.volume : 0;
  };

  PlayerJS.prototype.setCurrentTime = function(time) {
    if (this.video) {
      this.video.currentTime = time;
    }
  };

  PlayerJS.prototype.getCurrentTime = function() {
    return this.video ? this.video.currentTime : 0;
  };

  PlayerJS.prototype.getDuration = function() {
    return this.video ? this.video.duration : 0;
  };

  PlayerJS.prototype.destroy = function() {
    if (this.video && this.video.parentNode) {
      this.video.parentNode.removeChild(this.video);
    }
  };

  // Make PlayerJS available globally
  if (typeof window !== 'undefined') {
    window.PlayerJS = PlayerJS;
  }

  // Export for Node.js if needed
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerJS;
  }

})();
