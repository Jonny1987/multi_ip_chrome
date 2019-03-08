if (document.getElementById("ctgDialogPopup"))
	document.body.removeChild(document.getElementById("ctgDialogPopup"));
var popup = document.createElement("div");
popup.style.cssText = "width: 100%; height: 100%; background: rgba(0, 0, 0, .85); position: fixed; z-index: 100;";
popup.id = "ctgDialogPopup";
popup.innerHTML = "<div style='background: #999999; width: 350px; height: 150px; left: 50%; top: 50%; margin-left: -175px; margin-top: -75px; text-align: center; font-size: 20px; position: fixed; box-shadow: 0px 0px 100px #8A0000; border-radius: 25px; display: table'><text style='color: #B30000; font-weight: bold; padding: 5px; display: table-cell; vertical-align: middle;'>"+text+"<br><button style='font-size: 20px; width: 100px; cursor: pointer;' id='ctgDialogPopupClose'>OK</button></text></div>";
document.body.insertBefore(popup, document.body.firstChild);
document.getElementById("ctgDialogPopupClose").onclick = function(){
	document.body.removeChild(document.getElementById("ctgDialogPopup"));
}