var inputs = document.getElementsByTagName("input");

for (var i = 0; i < inputs.length; i++){
	if (inputs[i].type == "password"){
		inputs[i].setAttribute("data-ctgplugins-ispassword", true);
		inputs[i].type = "text";
	}else if (inputs[i].getAttribute("data-ctgplugins-ispassword")){
		inputs[i].type = "password";
	}
}