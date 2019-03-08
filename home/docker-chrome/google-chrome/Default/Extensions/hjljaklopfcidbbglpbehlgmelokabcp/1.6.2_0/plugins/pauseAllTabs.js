(function(){
	var site = window.location.href;
	if (site.indexOf("pandora.com") != -1){
		if (document.getElementsByClassName("pauseButton").length > 0 && document.getElementsByClassName("pauseButton")[0].style.display == "block")
			document.getElementsByClassName("pauseButton")[0].click();
		else if (document.getElementsByClassName("PlayButton").length > 0 && document.getElementsByClassName("PlayButton")[0].getAttribute("data-qa") == "pause_button")
			document.getElementsByClassName("PlayButton")[0].click();
	}else if (site.indexOf("spotify.com") != -1){
		if (document.getElementById("play-pause") != null && document.getElementById("play-pause").getAttribute('class').indexOf("playing") != -1)
			document.getElementById("play-pause").click();
		else{
			var controlButtons = document.getElementsByClassName("control-button");
			for (var i = 0; i < controlButtons.length; i++){
				if (controlButtons[i].className.indexOf("pause") != -1){
					controlButtons[i].click();
					break;
				}
			}
		}
	}else if (site.indexOf("soundcloud.com") != -1){
		if (document.getElementsByClassName("playControl")[0].getAttribute("class").indexOf("playing") != -1)
			document.getElementsByClassName("playControl")[0].click();
	}
	var videos = document.getElementsByTagName("video");
	for (var i = 0; i < videos.length; i++)
		videos[i].pause();
	var audios = document.getElementsByTagName("audio");
	for (var i = 0; i < audios.length; i++)
		audios[i].pause();
	var objects = document.getElementsByTagName("object");
	for (var i = 0; i < objects.length; i++)
		objects[i].pause();
})();