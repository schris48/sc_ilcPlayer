videojs.registerPlugin('backFwdBtns', function() {
  // +++ Create divs for buttons +++  
  var vPlayer = this,
      jumpAmount = 15,
      controlBar,
      insertBeforeNode,
      newElementBB = document.createElement("div"),
      newElementFB = document.createElement("div");

  // Function to localize button text
  function localizeButtonText() {
    const localizationData = {
      en: {
        skipBack: "Skip Back 15 Seconds",
        skipForward: "Skip Forward 15 Seconds"
      },
      fr: {
        skipBack: "Reculer de 15 secondes",
        skipForward: "Avancer de 15 secondes"
      },
      de: {
        skipBack: "15 Sekunden zurückspringen",
        skipForward: "15 Sekunden vorspulen"
      },
      ja: {
        skipBack: "15秒戻す",
        skipForward: "15秒進む"
      },
      es: {
        skipBack: "Retroceder 15 segundos",
        skipForward: "Avanzar 15 segundos"
      }
    };

    // Get the current language from the localization plugin
    let currentLanguage = 'en'; // Default language

    // Function to change the language dynamically
    function changeLanguage(newLanguage) {
      if (localizationData[newLanguage]) {
        currentLanguage = newLanguage;
        updateButtonText();
      } else {
        console.warn("Language not supported: " + newLanguage);
      }
    }

    // Update button text based on the current language
    function updateButtonText() {
      if (newElementBB) {
        newElementBB.querySelector('.vjs-control-text').textContent = localizationData[currentLanguage].skipBack;
        newElementBB.setAttribute('aria-label', localizationData[currentLanguage].skipBack);
        newElementBB.setAttribute('title', localizationData[currentLanguage].skipBack);
      }

      if (newElementFB) {
        newElementFB.querySelector('.vjs-control-text').textContent = localizationData[currentLanguage].skipForward;
        newElementFB.setAttribute('aria-label', localizationData[currentLanguage].skipForward);
        newElementFB.setAttribute('title', localizationData[currentLanguage].skipForward);
      }
    }

    // Initial button text update
    updateButtonText();

    // Assuming you have some mechanism to trigger this change dynamically
    // For example, the user selects a new language
    const languageSelector = document.querySelector('#language-selector');
    if (languageSelector) {
      languageSelector.addEventListener('change', function(event) {
        changeLanguage(event.target.value);
      });
    }
  }

  // +++ Assign properties to elements and assign to parents +++  
  newElementBB.innerHTML = "<button class='vjs-control vjs-button vjs-skip-back' type='button' title='Skip Back 15 Seconds' aria-disabled='false'><span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'>Skip Back 15 Seconds</span></button>";
  newElementFB.innerHTML = "<button class='vjs-control vjs-button vjs-skip-ahead' type='button' title='Skip Ahead 15 Seconds' aria-disabled='false'><span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'>Skip Ahead 15 Seconds</span></button>";

  // +++ Get controlbar and insert elements +++  
  controlBar = vPlayer.$(".vjs-control-bar");
  // Get the element to insert buttons in front of in controlbar
  insertBeforeNode = vPlayer.$(".vjs-volume-panel");

  // Check if control bar is available and the buttons are being inserted
  if (controlBar && insertBeforeNode) {
    controlBar.insertBefore(newElementBB, insertBeforeNode);
    controlBar.insertBefore(newElementFB, insertBeforeNode);
  } else {
    console.log('Error: Control bar or volume panel not found.');
  }

  // +++ Add event handlers to jump back or forward +++  
  // Back button logic, don't jump to negative times
  newElementBB.addEventListener("click", function() {
    var newTime,
        rewindAmt = jumpAmount,
        videoTime = vPlayer.currentTime();
    if (videoTime >= rewindAmt) {
      newTime = videoTime - rewindAmt;
    } else {
      newTime = 0;
    }
    vPlayer.currentTime(newTime);
  });

  // Forward button logic, don't jump past the duration
  newElementFB.addEventListener("click", function() {
    var newTime,
        forwardAmt = jumpAmount,
        videoTime = vPlayer.currentTime(),
        videoDuration = vPlayer.duration();
    if (videoTime + forwardAmt <= videoDuration) {
      newTime = videoTime + forwardAmt;
    } else {
      newTime = videoDuration;
    }
    vPlayer.currentTime(newTime);
  });

  // Call localizeButtonText to initialize the localization process
  localizeButtonText();
});
