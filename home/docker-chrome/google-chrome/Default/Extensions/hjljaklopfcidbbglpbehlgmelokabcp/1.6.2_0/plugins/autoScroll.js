(function() {
	var scroll = true;
	var yChange = 0;
	var lastWheel = 0;
	window.addEventListener("wheel", function() {
		lastWheel = Date.now();
	});
	var scrollDiv = null;
	if (scrollHeight(document.body) > scrollHeight(document.documentElement)){
		scrollDiv = document.body;
	} else {
		scrollDiv = document.documentElement;
	}

	(function getElements(elem) {
		for (var i = 0; i < elem.children.length; i++) {
			getElements(elem.children[i]);
			if (scrollHeight(elem.children[i]) > scrollHeight(scrollDiv) && elem.children[i].offsetHeight > 300 && elem.children[i].offsetWidth > 200) {
				var before = elem.children[i].scrollTop++;
				if (before != elem.children[i].scrollTop) {
					scrollDiv = elem.children[i];
				}
			}
		}
	})(scrollDiv);

	function scrollHeight(elem) {
		var height = elem.scrollHeight - elem.clientHeight;
		if (elem.offsetHeight - window.innerHeight > height) {
			height = elem.offsetHeight - window.innerHeight;
		}
		return height;
	}
	chrome.runtime.sendMessage({ autoScrollHeight: scrollHeight(scrollDiv) }, function() {
		if (chrome.runtime.lastError) {
			return;
		}
	});
	function s() {
		if (Date.now() > lastWheel + 500) {
			yChange += speed;
			if (yChange >= 1) {
				if (scrollDiv !== document.body && scrollDiv !== document.documentElement){
					scrollDiv.scrollTop += parseInt(yChange);
				}else{
					window.scrollBy(0, parseInt(yChange));
				}
				
				yChange -= parseInt(yChange);
			}
		}
		if (!scroll) {
			return;
		}
		setTimeout(s, 5);
	}
	chrome.runtime.onMessage.addListener(function(message, sender, response) {
		if (message.q == "scrollStop") {
			scroll = false;
		}
		if (message.q == "scrolling" && scroll) {
			response(true);
		}
		if (message.q == "scrollDiv") {
			s();
		}
	});
})();
