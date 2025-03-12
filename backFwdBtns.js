videojs.registerPlugin('backFwdBtns', function() {
    var vPlayer = this,
        jumpAmount = 15,
        controlBar,
        insertBeforeNode,
        newElementBB = document.createElement("div"),
        newElementFB = document.createElement("div");

    // Function to localize button text using centralized localization
    function localizeButtonText() {
        const skipBackText = window.localization.getLocalizedText('skipBack');
        const skipForwardText = window.localization.getLocalizedText('skipForward');

        // Set button text and accessibility attributes after button elements are created
        if (newElementBB) {
            newElementBB.querySelector('.vjs-control-text').textContent = skipBackText;
            newElementBB.setAttribute('aria-label', skipBackText);
            newElementBB.setAttribute('title', skipBackText);
        }

        if (newElementFB) {
            newElementFB.querySelector('.vjs-control-text').textContent = skipForwardText;
            newElementFB.setAttribute('aria-label', skipForwardText);
            newElementFB.setAttribute('title', skipForwardText);
        }
    }

    // Event listener for language change (will trigger when language is changed globally)
    document.addEventListener('languageChanged', function() {
        localizeButtonText();
    });

    // Assign button HTML structure
    newElementBB.innerHTML = "<button class='vjs-control vjs-button vjs-skip-back' type='button'><span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'></span></button>";
    newElementFB.innerHTML = "<button class='vjs-control vjs-button vjs-skip-ahead' type='button'><span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'></span></button>";

    // Get control bar and insert buttons
    controlBar = vPlayer.$(".vjs-control-bar");
    insertBeforeNode = vPlayer.$(".vjs-volume-panel");

    if (controlBar && insertBeforeNode) {
        controlBar.insertBefore(newElementBB, insertBeforeNode);
        controlBar.insertBefore(newElementFB, insertBeforeNode);
    } else {
        console.log('Error: Control bar or volume panel not found.');
    }

    // Initial button text update after DOM insertion
    localizeButtonText();

    // Event handlers for button functionality
    newElementBB.addEventListener("click", function() {
        var newTime,
            videoTime = vPlayer.currentTime();
        newTime = Math.max(videoTime - jumpAmount, 0);
        vPlayer.currentTime(newTime);
    });

    newElementFB.addEventListener("click", function() {
        var newTime,
            videoTime = vPlayer.currentTime(),
            videoDuration = vPlayer.duration();
        newTime = Math.min(videoTime + jumpAmount, videoDuration);
        vPlayer.currentTime(newTime);
    });
});
