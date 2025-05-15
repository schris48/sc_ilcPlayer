videojs.registerPlugin('accessibilityPlugin', function() {
    var player = this;
  
    // Localization strings
    var localization = {
      en: {
        play: 'Play',
        pause: 'Pause',
        mute: 'Mute',
        unmute: 'Unmute',
        volume: 'Volume',
        fullscreen: 'Fullscreen',
        exitFullscreen: 'Exit Fullscreen',
        transcript: 'Display Transcript',
        captions: 'Captions',
        skipBack: 'Skip Back 15 Seconds',
        skipForward: 'Skip Forward 15 Seconds'
      },
      fr: {
        play: 'Lecture',
        pause: 'Pause',
        mute: 'Muet',
        unmute: 'Réactiver le son',
        volume: 'Volume',
        fullscreen: 'Plein écran',
        exitFullscreen: 'Quitter le plein écran',
        transcript: 'Afficher le texte',
        captions: 'Sous-titres',
        skipBack: 'Reculer de 15 secondes',
        skipForward: 'Avancer de 15 secondes'
      },
      es: {
        play: 'Reproducir',
        pause: 'Pausa',
        mute: 'Silenciar',
        unmute: 'Reactivar sonido',
        volume: 'Volumen',
        fullscreen: 'Pantalla completa',
        exitFullscreen: 'Salir de pantalla completa',
        transcript: 'Mostrar texto',
        captions: 'Subtítulos',
        skipBack: 'Retroceder 15 segundos',
        skipForward: 'Avanzar 15 segundos'
      },
      de: {
        play: 'Wiedergabe',
        pause: 'Pause',
        mute: 'Stummschalten',
        unmute: 'Ton einschalten',
        volume: 'Lautstärke',
        fullscreen: 'Vollbild',
        exitFullscreen: 'Vollbildmodus beenden',
        transcript: 'Text anzeigen',
        captions: 'Untertitel',
        skipBack: '15 Sekunden zurückspringen',
        skipForward: '15 Sekunden vorspulen'
      },
      ja: {
        play: '再生',
        pause: '一時停止',
        mute: 'ミュート',
        unmute: 'ミュート解除',
        volume: '音量',
        fullscreen: '全画面表示',
        exitFullscreen: '全画面表示を終了',
        transcript: '文字起こしを表示',
        captions: '字幕',
        skipBack: '15秒戻す',
        skipForward: '15秒進む'
      }
    };
  
    // Function to set ARIA attributes and localization
    function setAccessibility(button, action, lang) {
      button.setAttribute('aria-label', localization[lang][action]);
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
    }
  
    // Add event listeners for keyboard navigation
    function addKeyboardNavigation(button, action) {
      button.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          playeraction;
        }
      });
    }
  
    // Apply accessibility features to player buttons
    player.ready(function() {
      var lang = player.language() || 'en';
  
      var playButton = player.controlBar.playToggle.el();
      setAccessibility(playButton, 'play', lang);
      addKeyboardNavigation(playButton, 'play');
  
      var muteButton = player.controlBar.volumePanel.muteToggle.el();
      setAccessibility(muteButton, 'mute', lang);
      addKeyboardNavigation(muteButton, 'mute');
  
      var fullscreenButton = player.controlBar.fullscreenToggle.el();
      setAccessibility(fullscreenButton, 'fullscreen', lang);
      addKeyboardNavigation(fullscreenButton, 'requestFullscreen');
  
      var transcriptButton = player.controlBar.addChild('button', {
        text: localization[lang].transcript,
        name: 'TranscriptButton'
      }).el();
      setAccessibility(transcriptButton, 'transcript', lang);
      addKeyboardNavigation(transcriptButton, 'transcript');
  
      var captionsButton = player.controlBar.addChild('button', {
        text: localization[lang].captions,
        name: 'CaptionsButton'
      }).el();
      setAccessibility(captionsButton, 'captions', lang);
      addKeyboardNavigation(captionsButton, 'captions');
  
      // Create Skip Back Button
      var skipBackButton = document.createElement("button");
      skipBackButton.className = 'vjs-control vjs-button vjs-skip-back';
      skipBackButton.setAttribute('type', 'button');
      skipBackButton.innerHTML = "<span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'></span>";
      setAccessibility(skipBackButton, 'skipBack', lang);
      addKeyboardNavigation(skipBackButton, 'skipBack');
  
      // Create Skip Forward Button
      var skipForwardButton = document.createElement("button");
      skipForwardButton.className = 'vjs-control vjs-button vjs-skip-ahead';
      skipForwardButton.setAttribute('type', 'button');
      skipForwardButton.innerHTML = "<span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'></span>";
      setAccessibility(skipForwardButton, 'skipForward', lang);
      addKeyboardNavigation(skipForwardButton, 'skipForward');
  
      // Wrap buttons in div elements
      var skipBackDiv = document.createElement("div");
      skipBackDiv.appendChild(skipBackButton);
  
      var skipForwardDiv = document.createElement("div");
      skipForwardDiv.appendChild(skipForwardButton);
  
      // Ensure insertion before volume panel (fallback to appending at the end)
      var controlBar = player.$(".vjs-control-bar");
      var insertBeforeNode = player.$(".vjs-volume-panel");
      if (insertBeforeNode) {
        controlBar.insertBefore(skipBackDiv, insertBeforeNode);
        controlBar.insertBefore(skipForwardDiv, insertBeforeNode);
      } else {
        controlBar.appendChild(skipBackDiv);
        controlBar.appendChild(skipForwardDiv);
        console.warn('Warning: Volume panel not found. Buttons appended at the end.');
      }
  
      // Event handlers for button functionality
      skipBackButton.addEventListener("click", function() {
        var newTime = Math.max(player.currentTime() - 15, 0);
        player.currentTime(newTime);
      });
  
      skipForwardButton.addEventListener("click", function() {
        var newTime = Math.min(player.currentTime() + 15, player.duration());
        player.currentTime(newTime);
      });
  
      // Function to localize button text
      function localizeButtonText() {
        skipBackButton.querySelector('.vjs-control-text').textContent = localization[lang].skipBack;
        skipBackButton.setAttribute('aria-label', localization[lang].skipBack);
        skipBackButton.setAttribute('title', localization[lang].skipBack);
  
        skipForwardButton.querySelector('.vjs-control-text').textContent = localization[lang].skipForward;
        skipForwardButton.setAttribute('aria-label', localization[lang].skipForward);
        skipForwardButton.setAttribute('title', localization[lang].skipForward);
      }
  
      // Update button text after adding to DOM
      localizeButtonText();
  
      // Listen for language changes
      document.addEventListener('languageChanged', function() {
        lang = player.language() || 'en';
        localizeButtonText();
      });
    });
  });
