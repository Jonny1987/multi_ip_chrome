$(document).ready(function(){

	var background = chrome.extension.getBackgroundPage().session;
	var scripts = chrome.extension.getBackgroundPage().scripts;

	loadDefaults();

	$("#autoScrollStart").click(function(){
		if ($(this).text() == "Start")
		{
			var speed = 10;
			if (!isNaN($("#autoScrollSpeed").val()))
				speed = parseFloat($("#autoScrollSpeed").val());
			else
				$("#autoScrollSpeed").val(speed);
			scripts.autoScrollGo(speed);
			$("#autoScrollStart").text("Stop");
			background.plugins["autoScroll"].speed = speed;
			chrome.storage.sync.set({"autoScrollSpeed": speed}, function(){
				if (chrome.runtime.lastError)
					return;
			});
		}
		else{
			scripts.autoScrollStop();
			$("#autoScrollStart").text("Start");
		}
	});

	$("#autoScrollSpeed").change(function(val){
		var speed = 10;
		if (!isNaN($("#autoScrollSpeed").val()))
			speed = parseFloat($("#autoScrollSpeed").val());
		background.plugins["autoScroll"].speed = speed;
		chrome.storage.sync.set({"autoScrollSpeed": speed}, function(){
			if (chrome.runtime.lastError)
				return;
		});
	});

	$("#focusGo").click(function(){
		if ($(this).text() == "Select Focus"){
			chrome.tabs.executeScript({
				file: "jquery-3.1.1.min.js"
			}, function(){
				if (chrome.runtime.lastError)
					return;
				chrome.tabs.executeScript({
					file: "scripts/domSelector.js"
				}, function(){
					if (chrome.runtime.lastError)
						return;
					chrome.tabs.executeScript({
						file: "plugins/focus.js"
					}, function(){
						if (chrome.runtime.lastError)
							return;
						window.close();
					});
				});
			});
			$("#focusGo").text("Remove Focus");
		}else{
			chrome.tabs.executeScript({
				code: "removeFocus(); if (domSelector){ domSelector.stop(); }"
			}, function(){
				if (chrome.runtime.lastError)
					return;
			});
			$("#focusGo").text("Select Focus");
		}
	});

	$("#autoClickStart").click(function(){
		if ($(this).text() == "Select Click Target")
		{
			var delay = 10;
			if (!isNaN(parseFloat($("#autoClickDelay").val()))){
				delay = parseFloat($("#autoClickDelay").val());
				if (delay < 0){
					delay = 0;
					$("#autoClickDelay").val(delay);
				}
			}
			else
				$("#autoClickDelay").val(delay);
			chrome.tabs.executeScript({
				file: "jquery-3.1.1.min.js"
			}, function(){
				if (chrome.runtime.lastError)
					return;
				chrome.tabs.executeScript({
					file: "scripts/domSelector.js"
				}, function(){
					if (chrome.runtime.lastError)
						return;
					chrome.tabs.executeScript({
						code: "var delay = "+delay+";"
					}, function(){
						if (chrome.runtime.lastError)
							return;
						chrome.tabs.executeScript({
							file: "plugins/autoClick.js"
						}, function(){
							if (chrome.runtime.lastError)
								return;
							window.close();
						});
					});
				});
			});
			$("#autoClickStart").text("Stop");
			background.plugins["autoClick"].delay = delay;
			chrome.storage.sync.set({"autoClickDelay": delay}, function(){
				if (chrome.runtime.lastError)
					return;
			});
		}
		else{
			chrome.tabs.executeScript({
				code: "clicking = false; if (domSelector){ domSelector.stop(); }"
			}, function(){
				if (chrome.runtime.lastError)
					return;
			});
			$("#autoClickStart").text("Select Click Target");
		}
	});

	$("#autoClickDelay").change(function(val){
		var delay = 10;
		if (!isNaN(parseFloat($("#autoClickDelay").val()))){
			delay = parseFloat($("#autoClickDelay").val());
			if (delay < 0){
				delay = 0;
			}
		}
		background.plugins["autoClick"].delay = delay;
		chrome.storage.sync.set({"autoClickDelay": delay}, function(){
			if (chrome.runtime.lastError)
				return;
		});
	});

	$("#youtubeExtractCaptionsGo").click(function(){
		chrome.webRequest.onBeforeRequest.addListener(cb, {urls: ["https://www.youtube.com/api/timedtext*"]});
		var popupTimeout = setTimeout(function(){
			popupMessage("Loading Closed Captions...<br>Captions might not be available for this video.");
		}, 200);
		function failAlert(){
			popupMessage("YouTube Extract Captions Failed.<br>The captions for this video failed to load.");
		}
		var failedTimeout = setTimeout(failAlert, 3000);
		function cb(details){
			clearTimeout(failedTimeout);
			clearTimeout(popupTimeout);
			closePopup()
			chrome.webRequest.onBeforeRequest.removeListener(cb);
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET", details.url, true);
			xmlhttp.onload = function(e){
				if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
				{
					var text = xmlhttp.responseText.replace(/<\/p>/g, "~").replace(/(<([^>]+)>)/ig,"").replace(/&#39;/g, "'").replace(/\n/g, " ").replace(/~~/g, "~").replace(/~~/g, "~").replace(/~/g, "<br>");
					chrome.tabs.create({url: "data:text/html;charset=utf-8,"+text}, function(){
						if (chrome.runtime.lastError)
							return;
					});
				}
				else
					failAlert();
			}
			xmlhttp.send();
		};
		chrome.tabs.executeScript({
			file: "plugins/youtubeExtractCaptions.js"
		}, function(){
			if (chrome.runtime.lastError)
				return;
		});
	});

	$("#pauseAllTabsGo").click(function(){
		scripts.pauseAllTabsGo();
	});

	$("#passwordgeneratorGo").click(function(){
		var pool = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
		var criteriaMet = false;
		var password;
		while (!criteriaMet){
			password = "";
			for (var i = 0; i < 16; i++)
				password += pool.charAt(Math.floor(Math.random()*((pool.length-1)-1)));
			if (password.match(new RegExp("[a-z]", "g")) && password.match(new RegExp("[0-9]", "g")) && password.match(new RegExp("[A-Z]", "g"))){
				criteriaMet = true;
			}
		}
		if (background.plugins["passwordGenerator"].lastPopupId != -2)
			chrome.windows.remove(background.plugins["passwordGenerator"].lastPopupId, function(){
				if (chrome.runtime.lastError)
					return;
			});

		chrome.windows.create({
			url: "data:text/html,<head><title>CTG Plugins - Password Generator</title></head><body style='text-align: center; background: #999999;'><strong style='font-size: 20px;'>Password:</strong><br><textarea style='resize:none; text-align: center; font-size: 20px;' id='password' cols='20' rows='1' readOnly>"+password+"</textarea><br><strong id='copyText' style='font-size: 18px;'>Press Ctrl+C to copy to clipboard</strong><script>window.onload = function(){ if (navigator.userAgent.indexOf('Mac') != -1){ document.getElementById('copyText').innerHTML = 'Press &#8984;+C to copy to clipboard.'; }document.getElementById('password').select();document.onkeydown = function(e){if (navigator.userAgent.indexOf('Mac') == -1){ if (e.ctrlKey && e.keyCode === 67){document.getElementById('copyText').innerHTML = 'The password has been copied.';}}else{ if (e.metaKey && e.keyCode === 67){ document.getElementById('copyText').innerHTML = 'The password has been copied.'; } } }}</script></body>",
			type: "popup",
			width: 400,
			height: 150,
			focused: true,
			incognito: true
		}, function(popup){
			if (chrome.runtime.lastError)
				return;
			background.plugins["passwordGenerator"].lastPopupId = popup.id;
		});
	});

	$("#updateOk").click(function(){
		$(".updateInfo").prop("hidden", true);
		$(".plugin").prop("hidden", false);
		background.installReason = null;
		background.newPlugins = 0;
		chrome.storage.sync.set({"pluginCount": Object.keys(background.plugins).length}, function(){
			if (chrome.runtime.lastError)
				return;
		});
		chrome.storage.sync.set({"updateNotification": false}, function(){
			if (chrome.runtime.lastError)
				return;
		});
		chrome.browserAction.setBadgeText({text: ""});
		loadDefaults();
	});

	$("#ratingLink").click(function(){
		chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/ctg-plugins/hjljaklopfcidbbglpbehlgmelokabcp/reviews"}, function(){
			if (chrome.runtime.lastError)
				return;
		});
	});

	$("#websiteLink").click(function(){
		chrome.tabs.create({url: "https://creativetechguy.com"}, function(){
			if (chrome.runtime.lastError)
				return;
		});
	});

	$("#optionsPage").click(function(){
		if (chrome.runtime.openOptionsPage)
			chrome.runtime.openOptionsPage();
		else
			window.open(chrome.runtime.getURL("options.html"), function(){
				if (chrome.runtime.lastError)
					return;
			});
	});

	function loadDefaults(){
		if (background.currentTab.url.indexOf("youtube.com/watch") == -1){
			if (background.settings.hideUnavailable)
				$(".youtubeExtractCaptions").prop("hidden", true);
			else
				$("#youtubeExtractCaptionsGo").prop("disabled", true);
		}

		$("#autoScrollSpeed").val(background.plugins["autoScroll"].speed);
		if (!background.plugins["autoScroll"].enabled)
			$(".autoScroll").prop("hidden", true);
		else
		{
			chrome.tabs.sendMessage(background.currentTab.id, {q: "scrolling"}, function(scrolling){
				if (chrome.runtime.lastError)
					return;
				if (scrolling)
					$("#autoScrollStart").text("Stop");
			});
		}

		if (!background.plugins["focus"].enabled)
			$(".focus").prop("hidden", true);
		else
		{
			chrome.tabs.sendMessage(background.currentTab.id, {q: "focusing"}, function(focusing){
				if (chrome.runtime.lastError)
					return;
				if (focusing)
					$("#focusGo").text("Remove Focus");
			});
		}

		if (!background.plugins["autoClick"].enabled)
			$(".autoClick").prop("hidden", true);
		else
		{
			chrome.tabs.sendMessage(background.currentTab.id, {q: "clicking"}, function(clicking){
				if (chrome.runtime.lastError)
					return;
				if (clicking)
					$("#autoClickStart").text("Stop");
			});
		}
		$("#autoClickDelay").val(background.plugins["autoClick"].delay);
		if (!background.plugins["youtubeExtractCaptions"].enabled)
			$(".youtubeExtractCaptions").prop("hidden", true);
		if (!background.plugins["pauseAllTabs"].enabled)
			$(".pauseAllTabs").prop("hidden", true);
		if (!background.plugins["passwordGenerator"].enabled)
			$(".passwordGenerator").prop("hidden", true);

		if (!background.enabled){
			if (background.settings.hideUnavailable){
				$(".autoScroll").prop("hidden", true);
				$(".autoClick").prop("hidden", true);
				$(".focus").prop("hidden", true);
			}else{
				$("#autoScrollStart").prop("disabled", true);
				$("#autoClickStart").prop("disabled", true);
				$("#focusGo").prop("disabled", true);
			}
		}

		if (background.installReason == "update"){
			if (background.newPlugins > 0 || background.customUpdateMessage.length > 0){
				$("#updateMessageDiv").prop("hidden", false);
				if (background.customUpdateMessage.length > 0){
					$("#updateMessage").html(background.customUpdateMessage);
				}else{
					if (background.newPlugins > 1)
						$("#updateMessage").html("New Plugins Added!");
					else
						$("#updateMessage").html("New Plugin Added!");
				}
			}
			$(".updateInfo").prop("hidden", false);
			$(".plugin").prop("hidden", true);
		}else{
			var plugins = $(".plugin");
			var allHidden = true;
			for (var i = 0; i < plugins.length; i++){
				if (!plugins.eq(i).prop("hidden")){
					allHidden = false;
					break;
				}
			}
			if (allHidden){
				$("#optionsPage").html("Enable Plugins");
			}
		}
	}

	function popupMessage(text){
		chrome.tabs.executeScript({
			code: "var text = '"+text+"';"
		}, function(){
			if (chrome.runtime.lastError)
				return;
			chrome.tabs.executeScript({file: "scripts/dialogBox.js"}, function(){
				if (chrome.runtime.lastError)
					return;
			});
		});
	}

	function closePopup(){
		chrome.tabs.executeScript({
			code: "if(document.getElementById('ctgDialogPopup')){document.body.removeChild(document.getElementById('ctgDialogPopup'));}"
		}, function(){
			if (chrome.runtime.lastError)
				return;
		});
	}

});