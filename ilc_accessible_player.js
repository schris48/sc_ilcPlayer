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

    // Set default language (can be dynamically detected or set by user preference)
    let currentLanguage = 'en'; // Default to English

    // Function to localize button text based on the selected language
    function localizeButtons() {
        // Get all buttons (replace with actual class or ID selectors for your video player)
        const skipBackButton = document.querySelector('.vjs-skip-back'); // Replace with actual class or ID
        const skipForwardButton = document.querySelector('.vjs-skip-forward'); // Replace with actual class or ID
        const playButton = document.querySelector('.vjs-play-control'); // Replace with actual class or ID
        const muteButton = document.querySelector('.vjs-mute-control'); // Replace with actual class or ID

        // Apply the localization text
        if (skipBackButton) {
            skipBackButton.setAttribute('aria-label', localizationData[currentLanguage].skipBack);
            skipBackButton.setAttribute('title', localizationData[currentLanguage].skipBack);
        }

        if (skipForwardButton) {
            skipForwardButton.setAttribute('aria-label', localizationData[currentLanguage].skipForward);
            skipForwardButton.setAttribute('title', localizationData[currentLanguage].skipForward);
        }

        if (playButton) {
            playButton.setAttribute('aria-label', localizationData[currentLanguage].play);
            playButton.setAttribute('title', localizationData[currentLanguage].play);
        }

        if (muteButton) {
            muteButton.setAttribute('aria-label', localizationData[currentLanguage].mute);
            muteButton.setAttribute('title', localizationData[currentLanguage].mute);
        }
    }

    // Function to change the language dynamically
    function changeLanguage(newLanguage) {
        if (localizationData[newLanguage]) {
            currentLanguage = newLanguage;
            localizeButtons();
        } else {
            console.warn("Language not supported: " + newLanguage);
        }
    }

    // Initialize localization when the script is loaded
    localizeButtons();

    // Example of changing the language dynamically (this can be triggered by a user action or setting change)
    // For instance, we could detect the user's language setting or let them choose
    // changeLanguage('fr'); // Uncomment this line to switch to French
    // changeLanguage('de'); // Uncomment this line to switch to German
    // changeLanguage('ja'); // Uncomment this line to switch to Japanese
    // changeLanguage('es'); // Uncomment this line to switch to Spanish

    // Add event listeners or functionality to trigger language changes from UI elements (e.g., buttons or dropdowns)
    // Example: Assuming there's a language selector dropdown with an ID of `language-selector`
    const languageSelector = document.querySelector('#language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function(event) {
            changeLanguage(event.target.value);
        });
    }
})();
