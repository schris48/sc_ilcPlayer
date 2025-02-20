// Translation dictionary for localization
const translations = {
  en: {
    transcriptButtonTitle: "Transcript",
    displayTranscript: "Display Transcript",
    hideTranscript: "Hide Transcript"
  },
  fr: {
    transcriptButtonTitle: "Transcription",
    displayTranscript: "Afficher la transcription",
    hideTranscript: "Cacher la transcription"
  }
};

// Get the user's language (defaults to English if unsupported)
const userLanguage = navigator.language.split('-')[0];
const localizedText = translations[userLanguage] || translations["en"];

// Load plugin
videojs.registerPlugin('ilcResponsivePlugin', function() {
  const ilcVideoPlayer = this;

  // Remove the picture-in-picture button in the player
  const pipControl = ilcVideoPlayer.el().querySelector(".vjs-picture-in-picture-control");
  if (pipControl) {
    pipControl.remove();
  }

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

      const bcTextFooter = document.createElement('div');
      bcTextFooter.className = 'bcTextFooter';

      const bcRtnButton = document.createElement('button');
      bcRtnButton.className = 'bcRtnButton';
      bcRtnButton.title = localizedText.hideTranscript;
      bcRtnButton.type = 'button';
      bcRtnButton.textContent = localizedText.hideTranscript;

      bcTextFooter.appendChild(bcRtnButton);
      bcTextContainer.append(bcTextContent, bcTextFooter);
      ilcVideoPlayer.el().after(bcTextContainer);

      // Load the text track content into the container
      fetch(metadataTrack.src)
        .then(response => response.text())
        .then(data => {
          const contentStart = data.indexOf("-->") + 16;
          bcTextContent.innerHTML = data.slice(contentStart);
        })
        .catch(error => console.error('Error loading transcript:', error));

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
});
