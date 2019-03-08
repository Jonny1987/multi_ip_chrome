var clicking = false;
var clickingLoop;
var domSelector = DomOutline({onClick: elementClicked, realtime: true});

domSelector.start();

function elementClicked(e){
	domSelector.stop();
	if (clickingLoop)
		clearInterval(clickingLoop);
	clicking = true;
	clickingLoop = setInterval(function(){
		if (e)
			e.click();
		else
			clicking = false;
		if (!clicking)
			clearInterval(clickingLoop);
	}, delay);
}

chrome.runtime.onMessage.addListener(function(message, sender, response){
	if (message.q == "clicking"){
		response(clicking);
		if (!clicking)
			domSelector.stop();
	}
});