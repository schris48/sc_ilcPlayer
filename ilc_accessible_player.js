(function() {
    // Localization data (translations for multiple languages)
    const localizationData = {
        en: {
            skipBack: "Skip Back 15 Seconds",
            skipForward: "Skip Forward 15 Seconds",
            play: "Play",
            pause: "Pause",
            mute: "Mute",
            unmute: "Unmute"
        },
        fr: {
            skipBack: "Reculer de 15 secondes",
            skipForward: "Avancer de 15 secondes",
            play: "Jouer",
            pause: "Pause",
            mute: "Muet",
            unmute: "Annuler le muet"
        },
        de: {
            skipBack: "15 Sekunden zurückspringen",
            skipForward: "15 Sekunden vorspulen",
            play: "Abspielen",
            pause: "Pause",
            mute: "Stummschalten",
            unmute: "Stummschaltung aufheben"
        },
        ja: {
            skipBack: "15秒戻す",
            skipForward: "15秒進む",
            play: "再生",
            pause: "一時停止",
            mute: "ミュート",
            unmute: "ミュート解除"
        },
        es: {
            skipBack: "Retroceder 15 segundos",
            skipForward: "Avanzar 15 segundos",
            play: "Reproducir",
            pause: "Pausa",
            mute: "Silenciar",
            unmute: "Quitar silencio"
        }
    };

    let currentLanguage = 'en'; // Default language

    // Centralized function to get localized text
    function getLocalizedText(key) {
        return localizationData[currentLanguage][key] || localizationData.en[key];
    }

    // Function to change the language dynamically
    function changeLanguage(newLanguage) {
        if (localizationData[newLanguage]) {
            currentLanguage = newLanguage;
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLanguage }));
        } else {
            console.warn("Language not supported: " + newLanguage);
        }
    }

    // Listen for language changes and update relevant parts of the page
    document.addEventListener('languageChanged', function() {
        // Call function to localize buttons for both the player and skip buttons
        localizeButtons();
        localizeSkipButtons();
    });

    // Expose the changeLanguage function to global scope
    window.changeLanguage = changeLanguage;

    // Export centralized localization functions for use in other plugins
    window.localization = {
        getLocalizedText
    };
})();
