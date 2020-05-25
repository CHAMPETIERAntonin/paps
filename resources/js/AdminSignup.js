//sendJsonRequest
//sendJsonForm


var signupForm = document.getElementById("signupForm");
var errorPassword = document.getElementById("errorPassword");
var errorPasswordConfirm = document.getElementById("errorPasswordConfirm");
var errorMail = document.getElementById("errorMail");
var errorCondition = document.getElementById("errorCondition");


signupForm.addEventListener("submit", function(event)
{
	event.preventDefault();
	
	sendJsonForm("/signup", signupForm, function(status, res)
	{
		errorPassword.hidden = res.correctPassword;
		errorPasswordConfirm.hidden = res.correctPasswordConfirm;
		errorMail.hidden = res.correctEmail;
		errorCondition.hidden = res.correctLicence;
		if(res.redirect != null)
			location.href = res.redirect;
	});
	
});
