// Translation dictionary for localization
const skipTranslations = {
  en: {
    skipBackTitle: "Skip Back 15 Seconds",
    skipBackText: "Skip Back 15 Seconds",
    skipAheadTitle: "Skip Ahead 15 Seconds",
    skipAheadText: "Skip Ahead 15 Seconds"
  },
  fr: {
    skipBackTitle: "Reculer de 15 secondes",
    skipBackText: "Reculer de 15 secondes",
    skipAheadTitle: "Avancer de 15 secondes",
    skipAheadText: "Avancer de 15 secondes"
  }
};

// Get the user's language (defaults to English if unsupported)
const userLang = navigator.language.split('-')[0];
const localizedSkipText = skipTranslations[userLang] || skipTranslations["en"];

// Plugin registration
videojs.registerPlugin("backForwardButtons", function () {
  var vPlayer = this,
    jumpAmount = 15,
    controlBar,
    insertBeforeNode,
    newElementBB = document.createElement("div"),
    newElementFB = document.createElement("div");

  // +++ Create Skip Back button +++
  newElementBB.innerHTML = `
    <button class='vjs-control vjs-button vjs-skip-back' type='button' 
      title='${localizedSkipText.skipBackTitle}' 
      aria-disabled='false'>
      <span class='vjs-icon-placeholder' aria-hidden='true'></span>
      <span class='vjs-control-text' aria-live='polite'>
        ${localizedSkipText.skipBackText}
      </span>
    </button>`;

  // +++ Create Skip Ahead button +++
  newElementFB.innerHTML = `
    <button class='vjs-control vjs-button vjs-skip-ahead' type='button' 
      title='${localizedSkipText.skipAheadTitle}' 
      aria-disabled='false'>
      <span class='vjs-icon-placeholder' aria-hidden='true'></span>
      <span class='vjs-control-text' aria-live='polite'>
        ${localizedSkipText.skipAheadText}
      </span>
    </button>`;

  // +++ Insert buttons into the control bar +++
  controlBar = vPlayer.$(".vjs-control-bar");
  insertBeforeNode = vPlayer.$(".vjs-volume-panel");

  controlBar.insertBefore(newElementBB, insertBeforeNode);
  controlBar.insertBefore(newElementFB, insertBeforeNode);

  // +++ Add event listeners for button actions +++
  newElementBB.addEventListener("click", function () {
    var newTime,
      rewindAmt = jumpAmount,
      videoTime = vPlayer.currentTime();
    newTime = videoTime >= rewindAmt ? videoTime - rewindAmt : 0;
    vPlayer.currentTime(newTime);
  });

  newElementFB.addEventListener("click", function () {
    var newTime,
      forwardAmt = jumpAmount,
      videoTime = vPlayer.currentTime(),
      videoDuration = vPlayer.duration();
    newTime = videoTime + forwardAmt <= videoDuration ? videoTime + forwardAmt : videoDuration;
    vPlayer.currentTime(newTime);
  });
});
