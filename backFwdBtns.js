videojs.registerPlugin('backForwardButtons', function() {
  // Create divs for the buttons
  var vPlayer = this,
    jumpAmount = 15,
    controlBar,
    insertBeforeNode,
    newElementBB = document.createElement("div"),
    newElementFB = document.createElement("div");

  // Assign properties to elements and add button content
  newElementBB.innerHTML = "<button class='vjs-control vjs-button vjs-skip-back' type='button' title='Skip Back 15 Seconds' aria-disabled='false'><span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'>Skip Back 15 Seconds</span></button>";
  newElementFB.innerHTML = "<button class='vjs-control vjs-button vjs-skip-ahead' type='button' title='Skip Ahead 15 Seconds' aria-disabled='false'><span class='vjs-icon-placeholder' aria-hidden='true'></span><span class='vjs-control-text' aria-live='polite'>Skip Ahead 15 Seconds</span></button>";

  // Get the control bar and the element to insert buttons before
  controlBar = vPlayer.$(".vjs-control-bar");
  insertBeforeNode = vPlayer.$(".vjs-volume-panel");

  // Insert the buttons into the control bar
  controlBar.insertBefore(newElementBB, insertBeforeNode);
  controlBar.insertBefore(newElementFB, insertBeforeNode);

  // Back button functionality - prevent negative time
  newElementBB.addEventListener("click", function() {
    var videoTime = vPlayer.currentTime();
    var newTime = Math.max(0, videoTime - jumpAmount); // Ensure time doesn't go below 0
    vPlayer.currentTime(newTime);
  });

  // Forward button functionality - prevent jumping past the video duration
  newElementFB.addEventListener("click", function() {
    var videoTime = vPlayer.currentTime(),
      videoDuration = vPlayer.duration();
    var newTime = Math.min(videoDuration, videoTime + jumpAmount); // Ensure time doesn't exceed the video duration
    vPlayer.currentTime(newTime);
  });
});
