(function () {
    const localizationData = {
        en: { skipBack: "Skip Back 15 Seconds", skipForward: "Skip Forward 15 Seconds", play: "Play", pause: "Pause", mute: "Mute", unmute: "Unmute", volume: "Volume", fullscreen: "Fullscreen", exitFullscreen: "Exit Fullscreen" },
        fr: { skipBack: "Reculer de 15 secondes", skipForward: "Avancer de 15 secondes", play: "Jouer", pause: "Pause", mute: "Muet", unmute: "Annuler le muet", volume: "Volume", fullscreen: "Plein écran", exitFullscreen: "Quitter le plein écran" },
        de: { skipBack: "15 Sekunden zurückspringen", skipForward: "15 Sekunden vorspulen", play: "Abspielen", pause: "Pause", mute: "Stummschalten", unmute: "Stummschaltung aufheben", volume: "Lautstärke", fullscreen: "Vollbild", exitFullscreen: "Vollbildmodus beenden" },
        ja: { skipBack: "15秒戻す", skipForward: "15秒進む", play: "再生", pause: "一時停止", mute: "ミュート", unmute: "ミュート解除", volume: "音量", fullscreen: "フルスクリーン", exitFullscreen: "フルスクリーン解除" },
        es: { skipBack: "Retroceder 15 segundos", skipForward: "Avanzar 15 segundos", play: "Reproducir", pause: "Pausa", mute: "Silenciar", unmute: "Quitar silencio", volume: "Volumen", fullscreen: "Pantalla completa", exitFullscreen: "Salir de pantalla completa" }
    };

    const iconFonts = {
        en: "tvo-custom-en",
        fr: "tvo-custom-fr",
        de: "tvo-custom-de",
        ja: "tvo-custom-ja",
        es: "tvo-custom-es"
    };

    function getBrowserLanguage() {
        const lang = navigator.language.split('-')[0]; // Get primary language (e.g., 'fr' from 'fr-CA')
        return localizationData[lang] ? lang : 'en'; // Default to English if not found
    }

    let currentLanguage = getBrowserLanguage();

    function getLocalizedText(key) {
        return localizationData[currentLanguage][key] || localizationData.en[key];
    }

    function changeLanguage(newLanguage) {
        if (localizationData[newLanguage]) {
            currentLanguage = newLanguage;
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLanguage }));
            loadIconFont(newLanguage);
        } else {
            console.warn("Language not supported: " + newLanguage);
        }
    }

    function loadIconFont(language) {
        const fontFamily = iconFonts[language] || iconFonts.en;
        document.querySelectorAll('[data-icon]:before, [class^="icon-"], [class*=" icon-"]').forEach(element => {
            element.style.fontFamily = fontFamily;
        });
    }

    function localizeVideoJsControls() {
        const controls = [
            { selector: '.vjs-play-control', keyPlay: 'play', keyPause: 'pause' },
            { selector: '.vjs-mute-control', keyMute: 'mute', keyUnmute: 'unmute' },
            { selector: '.vjs-volume-panel', key: 'volume' },
            { selector: '.vjs-fullscreen-control', keyEnter: 'fullscreen', keyExit: 'exitFullscreen' },
            { selector: '.vjs-replay-control', key: 'skipBack' },
            { selector: '.vjs-forward-control', key: 'skipForward' },
            { selector: '.vjs-transcript-control', key: 'transcript' } // Added transcript control
        ];

        controls.forEach(control => {
            const button = document.querySelector(control.selector);
            if (button) {
                if (control.keyPlay && control.keyPause) {
                    button.setAttribute('title', button.classList.contains('vjs-paused') ? getLocalizedText('play') : getLocalizedText('pause'));
                    button.setAttribute('aria-label', button.classList.contains('vjs-paused') ? getLocalizedText('play') : getLocalizedText('pause'));
                } else if (control.keyMute && control.keyUnmute) {
                    button.setAttribute('title', button.classList.contains('vjs-vol-0') ? getLocalizedText('unmute') : getLocalizedText('mute'));
                    button.setAttribute('aria-label', button.classList.contains('vjs-vol-0') ? getLocalizedText('unmute') : getLocalizedText('mute'));
                } else if (control.keyEnter && control.keyExit) {
                    button.setAttribute('title', document.fullscreenElement ? getLocalizedText('exitFullscreen') : getLocalizedText('fullscreen'));
                    button.setAttribute('aria-label', document.fullscreenElement ? getLocalizedText('exitFullscreen') : getLocalizedText('fullscreen'));
                } else {
                    button.setAttribute('title', getLocalizedText(control.key));
                    button.setAttribute('aria-label', getLocalizedText(control.key));
                }
            }
        });
    }

    document.addEventListener('languageChanged', function () {
        localizeVideoJsControls();
    });

    document.addEventListener('DOMContentLoaded', function () {
        localizeVideoJsControls();
        loadIconFont(currentLanguage);

        const observer = new MutationObserver(() => localizeVideoJsControls());
        observer.observe(document.body, { childList: true, subtree: true });
    });

    window.changeLanguage = changeLanguage;
    window.localization = { getLocalizedText };

    // Ensure localization applies on load
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLanguage }));

    // Register the combined plugin
    videojs.registerPlugin('ilcResponsivePlugin', function() {
        var ilcVideoPlayer = this;

        // Remove the picture-in-picture button in the player which is enabled by default.
        var pip_control = ilcVideoPlayer.el().getElementsByClassName("vjs-picture-in-picture-control")[0]; // Get pip element from DOM
        if (typeof(pip_control) != 'undefined' && pip_control != null) { // Check first if pip element is defined/not null, not all browsers enable it
            pip_control.parentNode.removeChild(pip_control);
        }

        // Initialize player
        ilcVideoPlayer.on('loadstart', function() {
            // Get all available text tracks for the currently loaded video
            var numTracks = ilcVideoPlayer.mediainfo.textTracks.length;

            // Check if any of the tracks are a metadata track
            for (var i = 0; i < numTracks; i++) {
                // If a metadata track is found, create text box functionality
                if (ilcVideoPlayer.mediainfo.textTracks[i].kind == "metadata") {
                    // Create transcript button
                    var bcTxtButton = document.createElement('button');
                    bcTxtButton.className = 'vjs-transcript-control vjs-control vjs-button';
                    bcTxtButton.setAttribute('style', 'z-index:1'); // If button appears under control bar it will not work on mobile.
                    bcTxtButton.setAttribute('type', 'button');
                    bcTxtButton.setAttribute('title', 'Transcript');
                    bcTxtButton.setAttribute('aria-disabled', 'false');
                    var bcSpanPlaceholder = document.createElement('span');
                    bcSpanPlaceholder.setAttribute('aria-hidden', 'true');
                    bcSpanPlaceholder.className = 'vjs-icon-placeholder';
                    var bcSpanText = document.createElement('span');
                    bcSpanText.className = 'vjs-control-text';
                    bcSpanText.setAttribute('aria-live', 'polite');
                    var bcSpanTextText = document.createTextNode("Display Transcript");
                    bcTxtButton.appendChild(bcSpanPlaceholder);
                    bcSpanText.appendChild(bcSpanTextText);
                    bcTxtButton.appendChild(bcSpanText);
                    $(ilcVideoPlayer.controlBar.customControlSpacer.el()).html(bcTxtButton);

                    // Create text box + button
                    var bcTextContainer = document.createElement('div');
                    var bcTextContent = document.createElement('div');
                    var bcTextFooter = document.createElement('div');
                    var bcRtnButton = document.createElement('button');
                    var rtnBtnText = document.createTextNode("Hide Transcript");
                    bcTextContainer.style.display = "none";
                    bcTextContainer.setAttribute('aria-hidden', 'true');
                    bcTextContainer.className = 'bcTextContainer';
                    bcTextContent.className = 'bcTextContent';
                    bcTextContent.setAttribute('tabindex', '0');
                    bcTextFooter.className = 'bcTextFooter';
                    bcRtnButton.className = 'bcRtnButton';
                    bcRtnButton.setAttribute('title', 'Hide Transcript');
                    bcRtnButton.setAttribute('type', 'button');
                    bcRtnButton.appendChild(rtnBtnText);
                    bcTextContainer.appendChild(bcTextContent);
                    bcTextFooter.appendChild(bcRtnButton);
                    bcTextContainer.appendChild(bcTextFooter);
                    $(bcTextContainer).insertAfter(ilcVideoPlayer.el());

                    // Load the text track into the text box
                    var $url = ilcVideoPlayer.mediainfo.textTracks[i].src;
                    $.get($url, function(data, status) {
                        var newdata = data.slice(data.indexOf("-->") + 16);
                        bcTextContent.innerHTML = newdata;
                    });

                    // Hide transcript button if the video is full screen
                    ilcVideoPlayer.on('fullscreenchange', function(evt) {
                        if (ilcVideoPlayer.isFullscreen()) {
                            bcTxtButton.style.visibility = "hidden";
                            bcTxtButton.setAttribute('aria-hidden', 'true');
                        } else if (!ilcVideoPlayer.isFullscreen()) {
                            bcTxtButton.style.visibility = "visible";
                            bcTxtButton.setAttribute('aria-hidden', 'false');
                        }
                    });

                    // Display transcript if transcript button clicked
                    $(bcTxtButton).click(function() {
                        ilcVideoPlayer.pause();
                        ilcVideoPlayer.el().style.display = "none";
                        ilcVideoPlayer.el().setAttribute('aria-hidden', 'true');
                        bcTextContainer.style.display = "block";
                        bcTextContainer.setAttribute('aria-hidden', 'false');
                        bcTextContent.focus();
                    });

                    // Hide transcript if hide transcript button clicked
                    $(bcRtnButton).click(function() {
                        bcTextContainer.style.display = "none";
                        bcTextContainer.setAttribute('aria-hidden', 'true');
                        ilcVideoPlayer.el().style.display = "block";
                        ilcVideoPlayer.el().setAttribute('aria-hidden', 'false');
                        bcTxtButton.focus();
                    });

                    break; // Do not continue looping if at least 1 metadata track was found
                } // End If: transcript file exists
            } // End loop: all text tracks
        }); // End: initialize player
    }); // End: plugin
})();
