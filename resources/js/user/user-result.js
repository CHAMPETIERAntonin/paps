var notOver = document.querySelector('#not-over-frame');
var success = document.querySelector('#success-frame');
var failure = document.querySelector('#failure-frame');

var text = document.querySelector("#choice-obtained");


var splitUrl = location.pathname.split("/")
var userCode = splitUrl[2]


/**
 * @param {string} result 
 */
function un(result) 
{ // Avec outcome qui indique si l'user a eu ou pas quelque chose et result, le nom de ce qu'il a eu.
 // On vérifie si outcome est défini, je considère qu'il ne l'est pas lorsque les résultats n'ont pas encore été calculés par l'admin
	if (result != null)
	{
		notOver.classList.add("invisible");
		success.classList.remove("invisible");
		
		text.innerText +=  (stringStartWithVoyelle(result) ? " d'" : " de ") + result + " !";
	}
	else
	{
		notOver.classList.add("invisible");
		failure.classList.remove("invisible");
	}
}

/**
 * 
 * @param {string} string 
 */
function stringStartWithVoyelle(string)
{
	var s = string.toLowerCase().substring(0,1)
	return "aeiouyàùîïéèôêë".includes(s)
}

function populate()
{
	document.getElementById("buttonReturn").setAttribute("href", "/user/" + userCode + "/panel");
	sendJsonRequest("/user/" + userCode + "/getResults", "GET", null, function(status, res)
	{
		if(res.correct && res.selected)
		{
			un(res.resultName);
		}
	});
}

populate();
