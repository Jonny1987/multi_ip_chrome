var focusing = false;
var selectedElement;
var popup;
var maxZ = findMaxZ();
var domSelector = DomOutline({onClick: elementClicked, realtime: true, exclude: "focusHUD", zIndex: maxZ-10});

domSelector.start();

var allStyle = "color: #000000; text-align: center; line-height: initial; font-family: Arial; letter-spacing: initial; min-height: 0px; border: 0px; padding: 0px; margin: 0px; text-transform: initial;";
var tableStyle = allStyle+"margin: auto; width: 100%; margin-top: 8px; margin-bottom: 8px;";
var buttonStyle = allStyle+"padding: 1px 6px; background: #DDDDDD; font-size: 14px; border-style: outset; border-color: #DDDDDD; border-width: 2px; box-shadow: initial; border-radius: 0px;";
var tdStyle = allStyle+"";
var strongStyle = allStyle+"font-weight: bold;";

openHUD();

function elementClicked(e){
	domSelector.stop();
	selectedElement = e;
	toolHUD();
	domSelector.highlight(selectedElement);
}

function openHUD(){
	if (document.getElementById("focusHUD") != null)
		document.body.removeChild(document.getElementById("focusHUD"));
	popup = document.createElement("div");
	popup.style.cssText = "top: 10px; right: 10px; width: 300px; height: 80px; background: #20c300; border-radius: 20px; position: fixed; z-index: "+maxZ+"; padding: 5px; box-shadow: 0px 0px 25px #777777;";
	popup.id = "focusHUD";
	popup.className = "focusHUD";
	popup.innerHTML = "<table class='focusHUD' style='"+tableStyle+"'><tr class='focusHUD'><td class='focusHUD' style='"+tdStyle+" font-size: 18px;'><strong class='focusHUD' style='"+strongStyle+"'>Focus Selector</strong></td></tr><tr class='focusHUD'><td class='focusHUD' style='"+tdStyle+" font-size: 14px;'>Select the area you want to focus, or select a part of the area and use the expand tool.</td></tr></table>";
	document.body.appendChild(popup);
}

function toolHUD(){
	popup.innerHTML = "<table class='focusHUD' style='"+tableStyle+"'><tr class='focusHUD'><td class='focusHUD' colspan='3' style='"+tdStyle+" padding-bottom: 10px; font-size: 18px;'><strong class='focusHUD' style='"+strongStyle+"'>Focus Selector</strong></td></tr><tr class='focusHUD'><td class='focusHUD' style='"+tdStyle+"'><button class='focusHUD' id='focusHUDExpand' style='"+buttonStyle+"'>Expand</button></td><td class='focusHUD' style='"+tdStyle+"'><button class='focusHUD' id='focusHUDActivate' style='"+buttonStyle+"'>Activate</button></td><td class='focusHUD' style='"+tdStyle+"'><button class='focusHUD' id='focusHUDCancel' style='"+buttonStyle+"'>Cancel</button></td></tr></table>";
	if (selectedElement.parentElement.tagName.toLowerCase() == "body"){
		$("#focusHUDExpand").prop("disabled", true);
		$("#focusHUDExpand").css("background", "#777777");
		$("#focusHUDExpand").css("border-color", "#444444");
	}

	$("#focusHUDExpand").click(function(){
		if ($(selectedElement).width() == 0){
			document.body.removeChild(document.getElementById("focusHUD"));
			domSelector.stop();
			return;
		}
		var selectedWidth = $(selectedElement).width();
		var selectedHeight = $(selectedElement).height();
		while ($(selectedElement).width() <= selectedWidth && $(selectedElement).height() <= selectedHeight && selectedElement.parentElement.tagName.toLowerCase() != "body" || $(selectedElement).width() == 0 || $(selectedElement).height() == 0){
			selectedElement = selectedElement.parentElement;
		}
		if (selectedElement.parentElement.tagName.toLowerCase() == "body"){
			$("#focusHUDExpand").prop("disabled", true);
			$("#focusHUDExpand").css("background", "#777777");
			$("#focusHUDExpand").css("border-color", "#444444");
		}
		domSelector.highlight(selectedElement);
	});

	$("#focusHUDActivate").click(function(){
		document.body.removeChild(document.getElementById("focusHUD"));
		focus();
		focusing = true;
	});

	$("#focusHUDCancel").click(function(){
		document.body.removeChild(document.getElementById("focusHUD"));
		domSelector.stop();
	});
}

function findMaxZ(){
	var maxZ = 100;
	(function getZ(elem){
		if (elem == selectedElement)
			return;
		for (var i = 0; i < elem.children.length; i++){
			getZ(elem.children[i]);
			var style = window.getComputedStyle(elem.children[i]);
			
			if (style["z-index"] != "auto" && style["z-index"] != "initial" && style["z-index"] != "inherit"){
				var zIndex = parseInt(style["z-index"]);
				if (zIndex > 2000000000){
					zIndex -= 1000;
					elem.children[i].style.zIndex = ""+zIndex;
				}
				if (zIndex > maxZ)
					maxZ = zIndex;
			}
		}
	})(document.body);
	return maxZ + 100;
}

function focus(){
	(function hideElements(elem){
		if (elem == selectedElement)
			return;
		for (var i = 0; i < elem.children.length; i++){
			hideElements(elem.children[i]);
			var style = window.getComputedStyle(elem.children[i]);
			if (style.display != "none" && style.visibility != "hidden"){
				elem.children[i].style.visibility = "hidden";
				elem.children[i].dataset.focusHidden = true;
			}
		}
	})(document.body);

	(function showParents(elem){
		if (elem == null)
			return;
		showParents(elem.parentElement);
		if (elem.dataset.focusHidden){
			elem.style.visibility = "visible";
			delete elem.dataset.focusHidden;
		}
	})(selectedElement);
}

function removeFocus(){
	if (focusing){
		(function showElements(elem){
			for (var i = 0; i < elem.children.length; i++){
				showElements(elem.children[i]);
				if (elem.children[i].dataset.focusHidden){
					elem.children[i].style.visibility = "visible";
					delete elem.children[i].dataset.focusHidden;
				}
			}
		})(document.body);
		focusing = false;
	}
}

chrome.runtime.onMessage.addListener(function(message, sender, response){
	if (message.q == "focusing"){
		response(focusing);
		if (!focusing){
			domSelector.stop();
			if (document.getElementById("focusHUD") != null)
				document.body.removeChild(document.getElementById("focusHUD"));
		}
	}
});