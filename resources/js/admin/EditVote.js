//sendJsonRequest
//sendJsonForm
//loadCSVasObj
//loadCSVasArray

var addSubUsers = document.getElementById("addSubUsers");
var submit = document.getElementById("submit");
var _password = document.getElementById("_password");
var errorPassword = document.getElementById("_password");



submit.addEventListener("click", function(event)
{
	event.preventDefault();
	
    var reader = new FileReader();
    reader.onload = function()
	{
		let obj = {};
		obj.votingUsers = loadCSVasArray(reader.result,2);
		obj._password = _password.value;
		
		sendJsonRequest("/user/uploadVotingUsers/" + location.href.substring(location.href.lastIndexOf('/') + 1), "POST", obj, function(status, res) 
		{
			errorPassword.hidden = res.correctPassword;
		});
	};
    reader.readAsText(addSubUsers.files[0]);
});


