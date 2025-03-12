videojs.registerPlugin('backFwdBtns', function() {
    var vPlayer = this,
        jumpAmount = 15,
        controlBar = vPlayer.$(".vjs-control-bar"),
        insertBeforeNode = vPlayer.$(".vjs-volume-panel");

    if (!controlBar) {
        console.error('Error: Control bar not found.');
        return;
    }

    // Create Skip Back Button
    var newElementBB = document.createElement("button");
    newElementBB.className = 'vjs-control vjs-button vjs-skip-back';
    newElementBB.setAttribute('type', 'button');
    newElementBB.innerHTML = "<span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'></span>";

    // Create Skip Forward Button
    var newElementFB = document.createElement("button");
    newElementFB.className = 'vjs-control vjs-button vjs-skip-ahead';
    newElementFB.setAttribute('type', 'button');
    newElementFB.innerHTML = "<span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'></span>";

    // Ensure insertion before volume panel (fallback to appending at the end)
    if (insertBeforeNode) {
        controlBar.insertBefore(newElementBB, insertBeforeNode);
        controlBar.insertBefore(newElementFB, insertBeforeNode);
    } else {
        controlBar.appendChild(newElementBB);
        controlBar.appendChild(newElementFB);
        console.warn('Warning: Volume panel not found. Buttons appended at the end.');
    }

    // Function to localize button text
    function localizeButtonText() {
        const skipBackText = window.localization.getLocalizedText('skipBack');
        const skipForwardText = window.localization.getLocalizedText('skipForward');

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

    // Update button text after adding to DOM
    localizeButtonText();

    // Listen for language changes
    document.addEventListener('languageChanged', function() {
        localizeButtonText();
    });

    // Event handlers for button functionality
    newElementBB.addEventListener("click", function() {
        var newTime = Math.max(vPlayer.currentTime() - jumpAmount, 0);
        vPlayer.currentTime(newTime);
    });

    newElementFB.addEventListener("click", function() {
        var newTime = Math.min(vPlayer.currentTime() + jumpAmount, vPlayer.duration());
        vPlayer.currentTime(newTime);
    });
});
