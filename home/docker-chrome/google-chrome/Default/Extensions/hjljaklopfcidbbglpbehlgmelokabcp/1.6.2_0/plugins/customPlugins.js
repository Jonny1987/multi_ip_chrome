$(document).ready(function(){

	var background = chrome.extension.getBackgroundPage().session;
	var scripts = chrome.extension.getBackgroundPage().scripts;

	load();

	function load(){
		$("#localStorageRemaining").html(scripts.nwc(background.localStorageRemaining));
		$(".pluginRow").remove();
		if (background.plugins["customPlugins"].plugins.length > 0)
		{
			var plugins = background.plugins["customPlugins"].plugins;
			for (var i = plugins.length-1; i >= 0; i--){
				addPluginRow(plugins[i].title, plugins[i].regEx, plugins[i].code, plugins[i].enabled);
			}
		}
	}

	function addPluginRow(title, url, code, enabled){
		var tr = $("<tr>");
		tr.addClass("pluginRow");
		tr.append($("<td>").append($("<input>").val(title).attr("readonly", true).attr("id", title)));
		tr.append($("<td>").append($("<input>").val(url).attr("readonly", true)));
		tr.append($("<td>").append($("<textarea>").text(code).attr("readonly", true).css({"height": "100px", "width": "95%"})));
		tr.append($("<td>").append($("<button>").html("Edit").addClass("editPlugin")).append($("<br>")).append($("<button>").html("Export").addClass("exportPlugin")).append($("<br>")).append($("<button>").html("Remove").addClass("removePlugin")).append($("<br>")).append($("<div>").append($("<text>").html("Enabled:")).append($("<input>").attr("type", "checkbox").attr("checked", enabled).addClass("enablePlugin"))));
		$("#pluginAreaBody").append(tr);
		$(".removePlugin").off("click");
		$(".removePlugin").click(removePlugin);
		$(".editPlugin").off("click");
		$(".editPlugin").click(editPlugin);
		$(".exportPlugin").off("click");
		$(".exportPlugin").click(exportPlugin);
		$(".enablePlugin").off("click");
		$(".enablePlugin").change(enablePlugin);
	}

	$(document).keydown(calculateBytesRequired);

	function calculateBytesRequired(){
		setTimeout(function(){
			var plugin = {};
			plugin.title = $("#newPluginTitle").val();
			plugin.regEx = $("#newPluginRegEx").val();
			plugin.code = $("#newPluginCode").val();
			var str = JSON.stringify(plugin);
			var m = encodeURIComponent(str).match(/%[89ABab]/g);
			var length = str.length + (m ? m.length : 0);
			$("#storageBytesRequired").html("~"+scripts.nwc(length)+" Bytes Required");
		}, 10);
	}

	$("#newPluginCode").keydown(function(e){
		if (e.keyCode == 9){
			e.preventDefault();
			var txt = $("#newPluginCode");
			var caretPos = txt[0].selectionStart;
			var textAreaTxt = txt.val();
			var txtToAdd = "\t";
			$("#newPluginCode").val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos));
			document.getElementById("newPluginCode").selectionStart = document.getElementById("newPluginCode").selectionEnd = caretPos + txtToAdd.length;
		}
	});

	$("#newPlugin").click(function(){
		$("#importPluginArea").attr("hidden", true);
		$("#newPluginTitle").val("");
		$("#newPluginRegEx").val("");
		$("#newPluginDelay").val("");
		$("#newPluginCode").val("");
		calculateBytesRequired();
		$("#newPluginArea").attr("hidden", false);
	});

	$("#closeNewPluginArea").click(function(){
		$("#newPluginArea").attr("hidden", true);
	});

	$("#closeImportPluginArea").click(function(){
		$("#importPluginArea").attr("hidden", true);
	});

	$("#importPlugin").click(function(){
		$("#newPluginArea").attr("hidden", true);
		$("#importPluginCode").val("");
		$("#importPluginArea").attr("hidden", false);
	});

	$("#importPluginGo").click(function(){
		try{
			var code = window.atob($("#importPluginCode").val());
			var plugin = JSON.parse(code);
			$("#importPluginArea").attr("hidden", true);
			$("#newPluginTitle").val(plugin.title);
			$("#newPluginRegEx").val(plugin.regEx);
			$("#newPluginDelay").val(plugin.delay);
			$("#newPluginCode").val(plugin.code);
			calculateBytesRequired();
			$("#newPluginArea").attr("hidden", false);
		}catch(e){
			$("#importPluginCode").val("Invalid Code");
		}
	});

	

	function removePlugin(e){
		var row = $(e.currentTarget).parent().parent();
		var pluginTitle = row.children().eq(0).children().eq(0).val();
		var pluginRegEx = row.children().eq(1).children().eq(0).val();
		var pluginCode = row.children().eq(2).children().eq(0).val();
		if (confirm("Are you sure you want to delete "+pluginTitle+"?\nThis cannot be undone.")){
			var plugins = background.plugins["customPlugins"].plugins;
			for (var i = 0; i < plugins.length; i++){
				if (plugins[i].title == pluginTitle && plugins[i].regEx == pluginRegEx && plugins[i].code == pluginCode){
					plugins.splice(i, 1);
					break;
				}
			}
			row.remove();
			chrome.storage.local.set({"customPlugins": JSON.stringify(background.plugins["customPlugins"].plugins)}, function(){
				if (chrome.runtime.lastError)
					return;
				scripts.getLocalBytesRemaining(function(){
					$("#localStorageRemaining").html(scripts.nwc(background.localStorageRemaining));
				});
			});
		}
	}

	function editPlugin(e){
		var row = $(e.currentTarget).parent().parent();
		var pluginTitle = row.children().eq(0).children().eq(0).val();
		var pluginRegEx = row.children().eq(1).children().eq(0).val();
		var pluginCode = row.children().eq(2).children().eq(0).val();
		var pluginDelay = 0;
		var plugins = background.plugins["customPlugins"].plugins;
		for (var i = 0; i < plugins.length; i++){
			if (plugins[i].title == pluginTitle){
				pluginDelay = plugins[i].delay;
			}
		}
		$("#newPluginTitle").val(pluginTitle);
		$("#newPluginRegEx").val(pluginRegEx);
		$("#newPluginDelay").val(pluginDelay);
		$("#newPluginCode").val(pluginCode);
		calculateBytesRequired();
		$("#newPluginArea").attr("hidden", false);
		$(document).scrollTop(0);
	}

	function enablePlugin(e){
		var row = $(e.currentTarget).parent().parent().parent();
		var pluginTitle = row.children().eq(0).children().eq(0).val();
		var plugins = background.plugins["customPlugins"].plugins;
		for (var i = 0; i < plugins.length; i++){
			if (plugins[i].title == pluginTitle){
				plugins[i].enabled = this.checked;
				break;
			}
		}
		chrome.storage.local.set({"customPlugins": JSON.stringify(background.plugins["customPlugins"].plugins)}, function(){
			if (chrome.runtime.lastError)
				return;
			scripts.getLocalBytesRemaining(function(){
				$("#localStorageRemaining").html(scripts.nwc(background.localStorageRemaining));
			});
		});
	}

	function exportPlugin(e){
		var row = $(e.currentTarget).parent().parent();
		var pluginTitle = row.children().eq(0).children().eq(0).val();
		var plugins = background.plugins["customPlugins"].plugins;
		for (var i = 0; i < plugins.length; i++){
			if (plugins[i].title == pluginTitle){
				exportPopup(window.btoa(JSON.stringify(plugins[i])));
				break;
			}
		}
	}

	$("#savePlugin").click(function(){
		var plugin = {};
		plugin.title = $("#newPluginTitle").val();
		plugin.regEx = $("#newPluginRegEx").val();
		if (plugin.regEx.length == 0)
			plugin.regEx = ".*";
		plugin.delay = $("#newPluginDelay").val();
		plugin.code = $("#newPluginCode").val();
		plugin.enabled = true;
		$("#newPluginArea").attr("hidden", true);
		for (var i = 0; i < background.plugins["customPlugins"].plugins.length; i++){
			if (plugin.title == background.plugins["customPlugins"].plugins[i].title){
				background.plugins["customPlugins"].plugins.splice(i, 1);
				$(document.getElementById(plugin.title)).parent().parent().remove();
				break;
			}
		}
		background.plugins["customPlugins"].plugins.push(plugin);

		chrome.storage.local.set({"customPlugins": JSON.stringify(background.plugins["customPlugins"].plugins)}, function(){
			if (chrome.runtime.lastError){
				$("#newPluginArea").attr("hidden", false);
				$("#storageBytesRequired").html("Not enough storage to save.");
				return;
			}
			scripts.getLocalBytesRemaining(function(){
				$("#localStorageRemaining").html(scripts.nwc(background.localStorageRemaining));
			});
		});
		load();
	});

	$("#deleteAll").click(function(){
		if (confirm("Are you sure you want to delete all Custom Plugins?\nThis cannot be undone.")){
			background.plugins["customPlugins"].plugins = [];
			chrome.storage.local.set({"customPlugins": JSON.stringify(background.plugins["customPlugins"].plugins)}, function(){
				if (chrome.runtime.lastError)
					return;
				scripts.getLocalBytesRemaining(function(){
					$("#localStorageRemaining").html(scripts.nwc(background.localStorageRemaining));
				});
			});
			location.reload();
		}
	});

	function exportPopup(code){
		if (document.getElementById("exportPopup") != null)
			document.body.removeChild(document.getElementById("exportPopup"));
		var popup = document.createElement("div");
		popup.style.cssText = "width: 100%; height: 100%; background: rgba(0, 0, 0, .85); position: fixed; z-index: 100;";
		popup.id = "exportPopup";
		var copyText = "Press Ctrl+C to copy.";
		if (navigator.userAgent.indexOf("Mac") != -1)
			copyText = "Press &#8984;+C to copy.";
		popup.innerHTML = "<div style='background: #999999; width: 350px; height: 150px; left: 50%; top: 50%; margin-left: -175px; margin-top: -75px; text-align: center; font-size: 20px; position: fixed; box-shadow: 0px 0px 100px #8A0000; border-radius: 25px; display: table'><text style='color: #B30000; font-weight: bold; padding: 5px; display: table-cell; vertical-align: middle;'>Export Plugin<br><textarea id='codeArea' cols='50' rows='1' style='resize: none; overflow: hidden;' readOnly>"+code+"</textarea><br><text id='copyText'>"+copyText+"</text><br><button style='font-size: 20px; width: 100px; cursor: pointer;' id='exportPopupClose'>Close</button></text></div>";
		document.body.insertBefore(popup, document.body.firstChild);
		document.getElementById("codeArea").select();
		document.getElementById("exportPopupClose").onclick = function(){
			document.body.removeChild(document.getElementById("exportPopup"));
		}
	}

	document.onkeydown = function(e){
		if (navigator.userAgent.indexOf("Mac") == -1){
			if (e.ctrlKey && e.keyCode === 67 && document.getElementById("copyText") != null)
				document.getElementById("copyText").innerHTML = "The code has been copied.";
		}else{
			if (e.metaKey && e.keyCode === 67 && document.getElementById("copyText") != null)
				document.getElementById("copyText").innerHTML = "The code has been copied.";
		}
	}

});