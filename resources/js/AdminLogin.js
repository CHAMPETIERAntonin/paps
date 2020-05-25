//sendJsonRequest
//sendJsonForm

var loginForm = document.getElementById("loginForm");
var errorLogin = document.getElementById("errorLogin");

loginForm.addEventListener("submit", function(event)
{
	event.preventDefault();
	
	sendJsonForm("/login", loginForm, function(status, res)
	{
		errorLogin.hidden = res.correctLogin;
		if(res.redirect != null)
			location.href = res.redirect;
	});
});