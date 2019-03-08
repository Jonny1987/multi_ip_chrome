if (!listenerActive){
	var listenerActive = true;
	document.onkeydown = function(e){
		var shortcutObj = {ctrlKey: false, altKey: false, shiftKey: false, keyCode: 0};
		if (e.ctrlKey)
			shortcutObj.ctrlKey = true;
		if (e.altKey)
			shortcutObj.altKey = true;
		if (e.shiftKey)
			shortcutObj.shiftKey = true;
		if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 96 && e.keyCode <= 105){
			shortcutObj.keyCode = e.keyCode;
			chrome.runtime.sendMessage({keyboardShortcut: shortcutObj}, function(){
				if (chrome.runtime.lastError)
					return;
			});
		}
	}
}