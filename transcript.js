//Load plugin
videojs.registerPlugin('transcript', function() {
  var ilcVideoPlayer = this;

  //Remove the picture-in-picture button in the player which is enabled by default.
  pip_control = ilcVideoPlayer.el().getElementsByClassName("vjs-picture-in-picture-control")[0]; //Get pip element from DOM
  if (typeof(pip_control) != 'undefined' && pip_control != null) { //Check first if pip element is defined/not null, not all browsers enable it
    pip_control.parentNode.removeChild(pip_control);
  }

  //Initialize player
  ilcVideoPlayer.on('loadstart',function(){
    
    //Get all available text tracks for the currently loaded video
    var numTracks = ilcVideoPlayer.mediainfo.textTracks.length;
    
    //Check if any of the tracks are a metadata track
    for (var i = 0; i < numTracks; i++) {
      
      //If a metadata track is found, create text box functionality
      if(ilcVideoPlayer.mediainfo.textTracks[i].kind == "metadata"){

        //Create transcript button
        var bcTxtButton = document.createElement('button');
        bcTxtButton.className = 'vjs-transcript-control vjs-control vjs-button';
        bcTxtButton.setAttribute('style', 'z-index:1'); //If button appears under control bar it will not work on moble.
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
        
        //Create text box + button
        var bcTextContainer = document.createElement('div');
        var bcTextContent = document.createElement('div');
        var bcTextFooter = document.createElement('div');
        var bcRtnButton = document.createElement('button');
        var rtnBtnText = document.createTextNode("Hide Transcript");
        bcTextContainer.style.display = "none";
        bcTextContainer.setAttribute('aria-hidden', 'true');
        bcTextContainer.className = 'bcTextContainer';
        bcTextContent.className = 'bcTextContent';
        bcTextContent.setAttribute('tabindex','0');
        bcTextFooter.className = 'bcTextFooter';
        bcRtnButton.className = 'bcRtnButton';
        bcRtnButton.setAttribute('title','Hide Transcript');
        bcRtnButton.setAttribute('type', 'button');
        bcRtnButton.appendChild(rtnBtnText);
        bcTextContainer.appendChild(bcTextContent);
        bcTextFooter.appendChild(bcRtnButton);
        bcTextContainer.appendChild(bcTextFooter);
        $(bcTextContainer).insertAfter(ilcVideoPlayer.el());
        
        //Load the text track into the text box
        $url = ilcVideoPlayer.mediainfo.textTracks[i].src;
        $.get($url, function(data, status){
          var newdata = data.slice(data.indexOf("-->") + 16);
          bcTextContent.innerHTML = newdata;
        });

        //Hide transcript button if the video is full screen
        ilcVideoPlayer.on('fullscreenchange', function(evt) {
          if(ilcVideoPlayer.isFullscreen()) {
            bcTxtButton.style.visibility = "hidden";
            bcTxtButton.setAttribute('aria-hidden', 'true');
          }else if(!ilcVideoPlayer.isFullscreen()){
            bcTxtButton.style.visibility = "visible";
            bcTxtButton.setAttribute('aria-hidden', 'false');
          }
        });

        //Display transcript if transcript button clicked
        $(bcTxtButton).click(function(){
          ilcVideoPlayer.pause();
          ilcVideoPlayer.el().style.display = "none";
          ilcVideoPlayer.el().setAttribute('aria-hidden', 'true');
          bcTextContainer.style.display = "block";
          bcTextContainer.setAttribute('aria-hidden', 'false');
          bcTextContent.focus();
        });
      
        //Hide transcript if hide transcript button clicked
        $(bcRtnButton).click(function(){
          bcTextContainer.style.display = "none";
          bcTextContainer.setAttribute('aria-hidden', 'true');
          ilcVideoPlayer.el().style.display = "block";
          ilcVideoPlayer.el().setAttribute('aria-hidden', 'false');
          bcTxtButton.focus();
        });

        break; //Do not continue looping if at least 1 metadata track was found
        
      } //End If: transcript file exists
    }; //End loop: all txt trks
  }) //End: initialize player
}); //End: plugin
