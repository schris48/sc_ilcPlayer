// Translation dictionary for localization
const translations = {
  en: {
    transcriptButtonTitle: "Transcript",
    displayTranscript: "Display Transcript",
    hideTranscript: "Hide Transcript",
    skipBack: "Skip Back 15 Seconds",
    skipForward: "Skip Forward 15 Seconds",
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
    volume: "Volume",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit Fullscreen"
  },
  fr: {
    transcriptButtonTitle: "Transcription",
    displayTranscript: "Afficher la transcription",
    hideTranscript: "Cacher la transcription",
    skipBack: "Reculer de 15 secondes",
    skipForward: "Avancer de 15 secondes",
    play: "Jouer",
    pause: "Pause",
    mute: "Muet",
    unmute: "Annuler le muet",
    volume: "Volume",
    fullscreen: "Plein écran",
    exitFullscreen: "Quitter le plein écran"
  },
  de: {
    transcriptButtonTitle: "Transkript",
    displayTranscript: "Transkript anzeigen",
    hideTranscript: "Transkript verbergen",
    skipBack: "15 Sekunden zurückspringen",
    skipForward: "15 Sekunden vorspulen",
    play: "Abspielen",
    pause: "Pause",
    mute: "Stummschalten",
    unmute: "Stummschaltung aufheben",
    volume: "Lautstärke",
    fullscreen: "Vollbild",
    exitFullscreen: "Vollbildmodus beenden"
  },
  ja: {
    transcriptButtonTitle: "トランスクリプト",
    displayTranscript: "トランスクリプトを表示",
    hideTranscript: "トランスクリプトを非表示",
    skipBack: "15秒戻す",
    skipForward: "15秒進む",
    play: "再生",
    pause: "一時停止",
    mute: "ミュート",
    unmute: "ミュート解除",
    volume: "音量",
    fullscreen: "フルスクリーン",
    exitFullscreen: "フルスクリーン解除"
  },
  es: {
    transcriptButtonTitle: "Transcripción",
    displayTranscript: "Mostrar transcripción",
    hideTranscript: "Ocultar transcripción",
    skipBack: "Retroceder 15 segundos",
    skipForward: "Avanzar 15 segundos",
    play: "Reproducir",
    pause: "Pausa",
    mute: "Silenciar",
    unmute: "Quitar silencio",
    volume: "Volumen",
    fullscreen: "Pantalla completa",
    exitFullscreen: "Salir de pantalla completa"
  }
};

// Get the user's language (defaults to English if unsupported)
const userLanguage = navigator.language.split('-')[0];
let currentLanguage = translations[userLanguage] ? userLanguage : 'en'; // Ensure currentLanguage is defined
const localizedText = translations[currentLanguage];

// Load plugin
videojs.registerPlugin('ilcResponsivePlugin', function() {
  const ilcVideoPlayer = this;

  // Initialize player
  ilcVideoPlayer.on('loadstart', function() {
    const textTracks = ilcVideoPlayer.mediainfo.textTracks;

    // Find the first metadata track
    const metadataTrack = Array.from(textTracks).find(track => track.kind === "metadata");
    if (metadataTrack) {
      
      // Create transcript button
      const bcTxtButton = document.createElement('button');
      bcTxtButton.className = 'vjs-transcript-control vjs-control vjs-button';
      bcTxtButton.style.zIndex = '1';
      bcTxtButton.type = 'button';
      bcTxtButton.title = localizedText.transcriptButtonTitle;
      bcTxtButton.setAttribute('aria-disabled', 'false');
      bcTxtButton.setAttribute('aria-label', localizedText.transcriptButtonTitle);

      const bcSpanPlaceholder = document.createElement('span');
      bcSpanPlaceholder.setAttribute('aria-hidden', 'true');
      bcSpanPlaceholder.className = 'vjs-icon-placeholder';

      const bcSpanText = document.createElement('span');
      bcSpanText.className = 'vjs-control-text';
      bcSpanText.setAttribute('aria-live', 'polite');
      bcSpanText.textContent = localizedText.displayTranscript;

      bcTxtButton.append(bcSpanPlaceholder, bcSpanText);
      ilcVideoPlayer.controlBar.customControlSpacer.el().appendChild(bcTxtButton);

      // Create transcript container
      const bcTextContainer = document.createElement('div');
      bcTextContainer.className = 'bcTextContainer';
      bcTextContainer.style.display = 'none';
      bcTextContainer.setAttribute('aria-hidden', 'true');

      const bcTextContent = document.createElement('div');
      bcTextContent.className = 'bcTextContent';
      bcTextContent.setAttribute('tabindex', '0');
      bcTextContent.setAttribute('role', 'region');
      bcTextContent.setAttribute('aria-label', localizedText.transcriptButtonTitle);

      const bcTextFooter = document.createElement('div');
      bcTextFooter.className = 'bcTextFooter';

      const bcRtnButton = document.createElement('button');
      bcRtnButton.className = 'bcRtnButton';
      bcRtnButton.title = localizedText.hideTranscript;
      bcRtnButton.type = 'button';
      bcRtnButton.textContent = localizedText.hideTranscript;
      bcRtnButton.setAttribute('aria-label', localizedText.hideTranscript);

      bcTextFooter.appendChild(bcRtnButton);
      bcTextContainer.append(bcTextContent, bcTextFooter);
      ilcVideoPlayer.el().after(bcTextContainer);

      // Load the text track content into the container
      if (metadataTrack?.src) {
        fetch(metadataTrack.src)
          .then(response => response.text())
          .then(data => {
            const contentStart = data.indexOf("-->") + 16;
            bcTextContent.innerHTML = data.slice(contentStart);
          })
          .catch(error => console.error('Error loading transcript:', error));
      }

      // Hide transcript button in fullscreen
      ilcVideoPlayer.on('fullscreenchange', function() {
        const isFullscreen = ilcVideoPlayer.isFullscreen();
        bcTxtButton.style.visibility = isFullscreen ? "hidden" : "visible";
        bcTxtButton.setAttribute('aria-hidden', isFullscreen);
      });

      // Show transcript on button click
      bcTxtButton.addEventListener('click', function() {
        ilcVideoPlayer.pause();
        ilcVideoPlayer.el().style.display = 'none';
        ilcVideoPlayer.el().setAttribute('aria-hidden', 'true');
        bcTextContainer.style.display = 'block';
        bcTextContainer.setAttribute('aria-hidden', 'false');
        bcTextContent.focus();
      });

      // Hide transcript on return button click
      bcRtnButton.addEventListener('click', function() {
        bcTextContainer.style.display = 'none';
        bcTextContainer.setAttribute('aria-hidden', 'true');
        ilcVideoPlayer.el().style.display = 'block';
        ilcVideoPlayer.el().setAttribute('aria-hidden', 'false');
        bcTxtButton.focus();
      });
    }
  });

  // Localize video.js controls
  function localizeVideoJsControls() {
    const controls = [
      { selector: '.vjs-play-control', keyPlay: 'play', keyPause: 'pause' },
      { selector: '.vjs-mute-control', keyMute: 'mute', keyUnmute: 'unmute' },
      { selector: '.vjs-volume-panel', key: 'volume' },
      { selector: '.vjs-fullscreen-control', keyEnter: 'fullscreen', keyExit: 'exitFullscreen' },
      { selector: '.vjs-replay-control', key: 'skipBack' },
      { selector: '.vjs-forward-control', key: 'skipForward' }
    ];

    controls.forEach(control => {
      const button = document.querySelector(control.selector);
      if (button) {
        if (control.keyPlay && control.keyPause) {
          button.setAttribute('title', button.classList.contains('vjs-paused') ? localizedText.play : localizedText.pause);
          button.setAttribute('aria-label', button.classList.contains('vjs-paused') ? localizedText.play : localizedText.pause);
        } else if (control.keyMute && control.keyUnmute) {
          button.setAttribute('title', button.classList.contains('vjs-vol-0') ? localizedText.unmute : localizedText.mute);
          button.setAttribute('aria-label', button.classList.contains('vjs-vol-0') ? localizedText.unmute : localizedText.mute);
        } else if (control.keyEnter && control.keyExit) {
          button.setAttribute('title', document.fullscreenElement ? localizedText.exitFullscreen : localizedText.fullscreen);
          button.setAttribute('aria-label', document.fullscreenElement ? localizedText.exitFullscreen : localizedText.fullscreen);
        } else {
          button.setAttribute('title', localizedText[control.key]);
          button.setAttribute('aria-label', localizedText[control.key]);
        }
      }
    });
  }

  document.addEventListener('languageChanged', function () {
    localizeVideoJsControls();
  });

  document.addEventListener('DOMContentLoaded', function () {
    localizeVideoJsControls();

    const observer = new MutationObserver(() => localizeVideoJsControls());
    observer.observe(document.body, { childList: true, subtree: true });
  });

  window.changeLanguage = function(newLanguage) {
    if (translations[newLanguage]) {
      currentLanguage = newLanguage;
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLanguage }));
    } else {
      console.warn("Language not supported: " + newLanguage);
    }
  };

  window.localization = { getLocalizedText };

  // Ensure localization applies on load
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLanguage }));
});
