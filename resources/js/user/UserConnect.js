//sendJsonRequest
//sendJsonForm
//loadCSVasObj
//loadCSVasArray


let form = document.getElementById("form");
let error = document.getElementById("error");

form.addEventListener("submit", function(event)
{
	event.preventDefault();
		
	sendJsonRequest("/user", "POST", {id:form.elements[0].value}, function(status, res)
	{
		error.hidden = res.correct;
		
		if(res.redirect != null)
			location.href = res.redirect;
	});
});