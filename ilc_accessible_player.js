(function () {
    const localizationData = {
        en: { skipBack: "Skip Back 15 Seconds", skipForward: "Skip Forward 15 Seconds", play: "Play", pause: "Pause", mute: "Mute", unmute: "Unmute", volume: "Volume", fullscreen: "Fullscreen", exitFullscreen: "Exit Fullscreen", transcript: "Display Transcript" },
        fr: { skipBack: "Reculer de 15 secondes", skipForward: "Avancer de 15 secondes", play: "Jouer", pause: "Pause", mute: "Muet", unmute: "Annuler le muet", volume: "Volume", fullscreen: "Plein écran", exitFullscreen: "Quitter le plein écran", transcript: "Afficher la transcription" },
        de: { skipBack: "15 Sekunden zurückspringen", skipForward: "15 Sekunden vorspulen", play: "Abspielen", pause: "Pause", mute: "Stummschalten", unmute: "Stummschaltung aufheben", volume: "Lautstärke", fullscreen: "Vollbild", exitFullscreen: "Vollbildmodus beenden", transcript: "Transkript anzeigen" },
        ja: { skipBack: "15秒戻す", skipForward: "15秒進む", play: "再生", pause: "一時停止", mute: "ミュート", unmute: "ミュート解除", volume: "音量", fullscreen: "フルスクリーン", exitFullscreen: "フルスクリーン解除", transcript: "トランスクリプトを表示" },
        es: { skipBack: "Retroceder 15 segundos", skipForward: "Avanzar 15 segundos", play: "Reproducir", pause: "Pausa", mute: "Silenciar", unmute: "Quitar silencio", volume: "Volumen", fullscreen: "Pantalla completa", exitFullscreen: "Salir de pantalla completa", transcript: "Mostrar transcripción" }
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
            { selector: '.vjs-transcript-control', key: 'transcript' }
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
})();
