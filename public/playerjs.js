/**
 * Advanced PlayerJS implementation
 * Full-featured video player with support for multiple formats and streaming
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
    this.loop = options.loop || false;
    this.muted = options.muted || false;
    this.preload = options.preload || 'metadata';
    
    // Player state
    this.isPlaying = false;
    this.isPaused = false;
    this.isLoading = true;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1;
    
    this.init();
  }

  PlayerJS.prototype.init = function() {
    // Create main player container
    this.playerContainer = document.createElement('div');
    this.playerContainer.style.cssText = `
      position: relative;
      width: ${this.width};
      height: ${this.height};
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Create video element
    this.video = document.createElement('video');
    this.video.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    `;
    this.video.preload = this.preload;
    this.video.loop = this.loop;
    this.video.muted = this.muted;
    
    // Set video source
    if (this.file) {
      this.setupVideoSource();
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
    
    // Create custom controls
    this.createControls();
    
    // Add event listeners
    this.setupEventListeners();
    
    // Append to container
    if (typeof this.container === 'string') {
      this.container = document.querySelector(this.container);
    }
    
    if (this.container) {
      // Clear container first
      this.container.innerHTML = '';
      this.container.appendChild(this.playerContainer);
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

  PlayerJS.prototype.setupVideoSource = function() {
    // Check if it's HLS (.m3u8)
    if (this.file.includes('.m3u8')) {
      this.setupHLS();
    } else if (this.file.includes('.mpd')) {
      this.setupDASH();
    } else {
      // Regular video file
      this.video.src = this.file;
      this.playerContainer.appendChild(this.video);
    }
  };

  PlayerJS.prototype.setupHLS = function() {
    // For HLS streams, try native support first
    if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
      this.video.src = this.file;
      this.playerContainer.appendChild(this.video);
      console.log('PlayerJS: Using native HLS support');
    } else {
      // Try to use HLS.js if available
      if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(this.file);
        hls.attachMedia(this.video);
        this.playerContainer.appendChild(this.video);
        console.log('PlayerJS: Using HLS.js');
      } else {
        // Show fallback message
        this.showStreamMessage('HLS поток', 'Для воспроизведения HLS используйте Safari или установите HLS.js');
      }
    }
  };

  PlayerJS.prototype.setupDASH = function() {
    // For DASH streams, try native support first
    if (this.video.canPlayType('application/dash+xml')) {
      this.video.src = this.file;
      this.playerContainer.appendChild(this.video);
      console.log('PlayerJS: Using native DASH support');
    } else {
      // Try to use dash.js if available
      if (typeof dashjs !== 'undefined') {
        const player = dashjs.MediaPlayer().create();
        player.initialize(this.video, this.file, false);
        this.playerContainer.appendChild(this.video);
        console.log('PlayerJS: Using dash.js');
      } else {
        this.showStreamMessage('DASH поток', 'Для воспроизведения DASH установите dash.js');
      }
    }
  };

  PlayerJS.prototype.showStreamMessage = function(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      text-align: center;
      background: rgba(0,0,0,0.9);
      padding: 30px;
      border-radius: 12px;
      max-width: 80%;
      border: 2px solid #333;
    `;
    messageDiv.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 15px;">📺</div>
      <h3 style="margin: 0 0 10px 0; font-size: 18px;">${type} не поддерживается</h3>
      <p style="margin: 0 0 15px 0; font-size: 14px; color: #ccc;">${message}</p>
      <div style="font-size: 12px; color: #666; margin-bottom: 15px;">URL: ${this.file}</div>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button onclick="window.open('${this.file}', '_blank')" style="
          background: #4ade80;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        ">Открыть в новой вкладке</button>
        <button onclick="this.parentElement.parentElement.parentElement.innerHTML=''" style="
          background: #666;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        ">Закрыть</button>
      </div>
    `;
    this.playerContainer.appendChild(messageDiv);
  };

  PlayerJS.prototype.createControls = function() {
    if (!this.controls) return;
    
    // Create controls overlay
    this.controlsOverlay = document.createElement('div');
    this.controlsOverlay.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      padding: 20px 15px 15px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;
    
    // Create play/pause button
    this.playButton = document.createElement('button');
    this.playButton.innerHTML = '▶️';
    this.playButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 5px;
      margin-right: 10px;
      pointer-events: auto;
    `;
    
    // Create progress bar
    this.progressContainer = document.createElement('div');
    this.progressContainer.style.cssText = `
      flex: 1;
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      margin: 0 10px;
      cursor: pointer;
      pointer-events: auto;
    `;
    
    this.progressBar = document.createElement('div');
    this.progressBar.style.cssText = `
      height: 100%;
      background: #4ade80;
      border-radius: 2px;
      width: 0%;
      transition: width 0.1s ease;
    `;
    
    this.progressContainer.appendChild(this.progressBar);
    
    // Create time display
    this.timeDisplay = document.createElement('div');
    this.timeDisplay.style.cssText = `
      color: white;
      font-size: 12px;
      min-width: 80px;
      text-align: right;
      pointer-events: auto;
    `;
    this.timeDisplay.textContent = '0:00 / 0:00';
    
    // Create volume control
    this.volumeButton = document.createElement('button');
    this.volumeButton.innerHTML = '🔊';
    this.volumeButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 5px;
      margin-left: 10px;
      pointer-events: auto;
    `;
    
    // Create fullscreen button
    this.fullscreenButton = document.createElement('button');
    this.fullscreenButton.innerHTML = '⛶';
    this.fullscreenButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 5px;
      margin-left: 5px;
      pointer-events: auto;
    `;
    
    // Assemble controls
    const controlsRow = document.createElement('div');
    controlsRow.style.cssText = 'display: flex; align-items: center; width: 100%;';
    controlsRow.appendChild(this.playButton);
    controlsRow.appendChild(this.progressContainer);
    controlsRow.appendChild(this.timeDisplay);
    controlsRow.appendChild(this.volumeButton);
    controlsRow.appendChild(this.fullscreenButton);
    
    this.controlsOverlay.appendChild(controlsRow);
    this.playerContainer.appendChild(this.controlsOverlay);
    
    // Add control event listeners
    this.setupControlEvents();
  };

  PlayerJS.prototype.setupControlEvents = function() {
    // Play/pause button
    this.playButton.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });
    
    // Progress bar
    this.progressContainer.addEventListener('click', (e) => {
      const rect = this.progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * this.duration;
      this.setCurrentTime(newTime);
    });
    
    // Volume button
    this.volumeButton.addEventListener('click', () => {
      this.video.muted = !this.video.muted;
      this.volumeButton.innerHTML = this.video.muted ? '🔇' : '🔊';
    });
    
    // Fullscreen button
    this.fullscreenButton.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        this.playerContainer.requestFullscreen();
      }
    });
    
    // Show/hide controls on hover
    this.playerContainer.addEventListener('mouseenter', () => {
      this.controlsOverlay.style.opacity = '1';
    });
    
    this.playerContainer.addEventListener('mouseleave', () => {
      this.controlsOverlay.style.opacity = '0';
    });
  };

  PlayerJS.prototype.setupEventListeners = function() {
    // Video events
    this.video.addEventListener('loadstart', () => {
      console.log('PlayerJS: Video loading started');
      this.isLoading = true;
    });
    
    this.video.addEventListener('canplay', () => {
      console.log('PlayerJS: Video can start playing');
      this.isLoading = false;
      this.duration = this.video.duration;
      this.updateTimeDisplay();
    });
    
    this.video.addEventListener('play', () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.playButton.innerHTML = '⏸️';
    });
    
    this.video.addEventListener('pause', () => {
      this.isPlaying = false;
      this.isPaused = true;
      this.playButton.innerHTML = '▶️';
    });
    
    this.video.addEventListener('timeupdate', () => {
      this.currentTime = this.video.currentTime;
      this.updateProgress();
      this.updateTimeDisplay();
    });
    
    this.video.addEventListener('volumechange', () => {
      this.volume = this.video.volume;
      this.volumeButton.innerHTML = this.video.muted ? '🔇' : '🔊';
    });
    
    this.video.addEventListener('error', (e) => {
      console.error('PlayerJS: Video error', e);
      this.showError();
    });
  };

  PlayerJS.prototype.updateProgress = function() {
    if (this.duration > 0) {
      const percentage = (this.currentTime / this.duration) * 100;
      this.progressBar.style.width = percentage + '%';
    }
  };

  PlayerJS.prototype.updateTimeDisplay = function() {
    const current = this.formatTime(this.currentTime);
    const duration = this.formatTime(this.duration);
    this.timeDisplay.textContent = `${current} / ${duration}`;
  };

  PlayerJS.prototype.formatTime = function(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  PlayerJS.prototype.showError = function() {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      text-align: center;
      background: rgba(0,0,0,0.9);
      padding: 30px;
      border-radius: 12px;
      max-width: 80%;
      border: 2px solid #ef4444;
    `;
    
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
      <div style="font-size: 24px; margin-bottom: 15px;">⚠️</div>
      <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #ef4444;">${errorMessage}</h3>
      <p style="margin: 0 0 15px 0; font-size: 14px; color: #ccc;">${errorDetails}</p>
      <div style="font-size: 12px; color: #666; margin-bottom: 15px;">URL: ${this.video.src || 'не указан'}</div>
      <button onclick="this.parentElement.remove()" style="
        background: #ef4444;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
      ">Закрыть</button>
    `;
    
    this.playerContainer.appendChild(errorDiv);
  };

  PlayerJS.prototype.destroy = function() {
    if (this.playerContainer && this.playerContainer.parentNode) {
      this.playerContainer.parentNode.removeChild(this.playerContainer);
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
