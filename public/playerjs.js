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
    this.video.style.objectFit = 'contain';
    this.video.preload = 'metadata';
    
    // Set video source
    if (this.file) {
      // Check if it's HLS (.m3u8)
      if (this.file.includes('.m3u8')) {
        this.setupHLS();
      } else {
        this.video.src = this.file;
      }
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
      console.error('Video error details:', {
        error: this.video.error,
        networkState: this.video.networkState,
        readyState: this.video.readyState,
        src: this.video.src,
        currentSrc: this.video.currentSrc
      });
      
      // Show detailed error message
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 8px; max-width: 80%;';
      
      let errorMessage = 'Ошибка загрузки видео';
      let errorDetails = 'Проверьте URL или формат файла';
      
      if (this.video.error) {
        switch (this.video.error.code) {
          case 1:
            errorMessage = 'Видео прервано';
            errorDetails = 'Загрузка была прервана пользователем';
            break;
          case 2:
            errorMessage = 'Ошибка сети';
            errorDetails = 'Проблема с загрузкой видео';
            break;
          case 3:
            errorMessage = 'Ошибка декодирования';
            errorDetails = 'Видео повреждено или не поддерживается';
            break;
          case 4:
            errorMessage = 'Формат не поддерживается';
            errorDetails = 'Браузер не поддерживает этот формат видео';
            break;
        }
      }
      
      errorDiv.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 10px;">${errorMessage}</p>
        <p style="font-size: 12px; margin-bottom: 10px;">${errorDetails}</p>
        <p style="font-size: 10px; color: #ccc;">URL: ${this.video.src || 'не указан'}</p>
      `;
      
      this.container.appendChild(errorDiv);
    });
    
    // Append to container
    if (typeof this.container === 'string') {
      this.container = document.querySelector(this.container);
    }
    
    if (this.container) {
      // Clear container first
      this.container.innerHTML = '';
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

  PlayerJS.prototype.setupHLS = function() {
    // For HLS streams, we'll try to use native HLS support first
    // If not available, we'll show a message to use a compatible browser
    if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      this.video.src = this.file;
      console.log('PlayerJS: Using native HLS support');
    } else {
      // No native HLS support, show message
      console.log('PlayerJS: No native HLS support, showing message');
      const hlsDiv = document.createElement('div');
      hlsDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 8px; max-width: 80%;';
      hlsDiv.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 10px;">HLS поток не поддерживается</p>
        <p style="font-size: 12px; margin-bottom: 10px;">Для воспроизведения HLS используйте Safari или установите расширение HLS.js</p>
        <p style="font-size: 10px; color: #ccc;">URL: ${this.file}</p>
        <a href="${this.file}" target="_blank" style="color: #4ade80; text-decoration: underline; font-size: 12px;">Открыть в новой вкладке</a>
      `;
      this.container.appendChild(hlsDiv);
    }
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
