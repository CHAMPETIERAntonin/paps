//sendJsonRequest
//sendJsonForm

var creationForm = document.getElementById("creationForm");
var errorName = document.getElementById("errorName");
var errorPoints = document.getElementById("errorPoints");

creationForm.addEventListener("submit", function(event)
{
	event.preventDefault();
	
	sendJsonForm("/admin/createVote", creationForm, function(status, res)
	{
		errorName.hidden = res.correctName;
		errorPoints.hidden = res.correctPoints;
		if(res.redirect != null)
			location.href = res.redirect;
	});
});