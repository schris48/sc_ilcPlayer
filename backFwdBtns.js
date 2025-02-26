videojs.registerPlugin('backForwardButtons', function() {
  // +++ Create divs for buttons +++
  var vPlayer = this,
      jumpAmount = 15,
      controlBar,
      insertBeforeNode,
      newElementBB = document.createElement("div"),
      newElementFB = document.createElement("div");

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
});
