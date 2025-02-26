// Load plugin
videojs.registerPlugin('ilcResponsivePlugin', function() {
  var ilcVideoPlayer = this;

  // Remove picture-in-picture button if present
  var pipControl = ilcVideoPlayer.el().querySelector(".vjs-picture-in-picture-control");
  if (pipControl) {
    pipControl.remove();
  }

  // Initialize player
  ilcVideoPlayer.on('loadstart', function() {
    var textTracks = ilcVideoPlayer.mediainfo.textTracks || [];
    
    // Find metadata track
    var metadataTrack = textTracks.find(track => track.kind === "metadata");
    if (!metadataTrack) return;

    // Create transcript button
    var transcriptButton = document.createElement('button');
    transcriptButton.className = 'vjs-transcript-control vjs-control vjs-button';
    transcriptButton.setAttribute('type', 'button');
    transcriptButton.setAttribute('title', 'Transcript');
    transcriptButton.setAttribute('aria-label', 'Toggle Transcript');

    var iconSpan = document.createElement('span');
    iconSpan.className = 'vjs-icon-placeholder';
    iconSpan.setAttribute('aria-hidden', 'true');

    var textSpan = document.createElement('span');
    textSpan.className = 'vjs-control-text';
    textSpan.setAttribute('aria-live', 'polite');
    textSpan.textContent = 'Display Transcript';

    transcriptButton.append(iconSpan, textSpan);
    ilcVideoPlayer.controlBar.customControlSpacer.el().appendChild(transcriptButton);

    // Create transcript container
    var transcriptContainer = document.createElement('div');
    transcriptContainer.className = 'bcTextContainer';
    transcriptContainer.style.display = 'none';
    transcriptContainer.setAttribute('aria-hidden', 'true');

    var transcriptContent = document.createElement('div');
    transcriptContent.className = 'bcTextContent';
    transcriptContent.setAttribute('tabindex', '0');

    var transcriptFooter = document.createElement('div');
    transcriptFooter.className = 'bcTextFooter';

    var closeButton = document.createElement('button');
    closeButton.className = 'bcRtnButton';
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('title', 'Hide Transcript');
    closeButton.textContent = 'Hide Transcript';

    transcriptFooter.appendChild(closeButton);
    transcriptContainer.append(transcriptContent, transcriptFooter);
    ilcVideoPlayer.el().after(transcriptContainer);

    // Load transcript text
    fetch(metadataTrack.src)
      .then(response => response.text())
      .then(data => {
        transcriptContent.innerHTML = data.substring(data.indexOf("-->") + 16);
      });

    // Toggle transcript visibility
    transcriptButton.addEventListener('click', function() {
      ilcVideoPlayer.pause();
      ilcVideoPlayer.el().style.display = 'none';
      ilcVideoPlayer.el().setAttribute('aria-hidden', 'true');
      transcriptContainer.style.display = 'block';
      transcriptContainer.setAttribute('aria-hidden', 'false');
      transcriptContent.focus();
    });

    closeButton.addEventListener('click', function() {
      transcriptContainer.style.display = 'none';
      transcriptContainer.setAttribute('aria-hidden', 'true');
      ilcVideoPlayer.el().style.display = 'block';
      ilcVideoPlayer.el().setAttribute('aria-hidden', 'false');
      transcriptButton.focus();
    });

    // Hide transcript button in fullscreen
    ilcVideoPlayer.on('fullscreenchange', function() {
      var isFullscreen = ilcVideoPlayer.isFullscreen();
      transcriptButton.style.visibility = isFullscreen ? 'hidden' : 'visible';
      transcriptButton.setAttribute('aria-hidden', isFullscreen ? 'true' : 'false');
    });
  });
});
