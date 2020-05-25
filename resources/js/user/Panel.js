//sendJsonRequest
//sendJsonForm
//loadCSVasObj
//loadCSVasArray


let form = document.getElementById("choiceContainer");
let pointsLeftDiv = document.getElementById("pointsLeftDiv");
let searchBox = document.getElementById("searchBox");
let starsContainer = document.getElementById("starsContainer");

var splitUrl = location.pathname.split("/")
var id = splitUrl[2]

let adminCode = id.substring(0, 10);
let voteCode = id.substring(11, 15);
let userCode = id.substring(16, 26);

let pointsLeft = 0;
let points = new Map();
let searchItems = [];

function addChoice(name, point)
{
    var div = document.createElement("searchItem");
	div.classList.toggle('form');
	div.setAttribute("style", "overflow:hidden; transition: height 1s, margin 0.2s");
    
    var label = document.createElement("label");
    label.setAttribute("for","choice");
    label.innerHTML = name;
		
	var subDiv = document.createElement("div");
	subDiv.classList.toggle('number-input');
    
    var input = document.createElement("input");
    input.setAttribute("id", "choice");
    input.setAttribute("name", name);
    input.setAttribute("type", "number");
	input.setAttribute("size", "5");
	if(point == null)
		input.setAttribute("value", "0");
	else
	{
		input.setAttribute("value", point + "");
		points.set(name, point);
	}
	input.setAttribute("style", "text-align:center;color:" + (point == null || point == 0 ? "#888888" : "--text-color"));
	input.addEventListener("change", function(event)
	{
		var valeur = points.get(name) ?? 0;

		var delta = isNaN(parseInt(input.value)) ? 0 : (parseInt(input.value) - valeur);

		if(delta > 0)
		{
			let toAdd = Math.min(delta, pointsLeft);
			input.value = (valeur + toAdd) + "";
			points.set(name, valeur + toAdd);
			input.setAttribute("style", "text-align:center;color:" + (valeur + toAdd == 0 ? "#888888" : "--text-color"));

			pointsLeft -= toAdd;
		}
		else
		{
			let toRemove = Math.min(-delta, valeur);
			input.value = (valeur - toRemove) + "";
			points.set(name, valeur - toRemove);
			input.setAttribute("style", "text-align:center;color:" + (valeur - toRemove == 0 ? "#888888" : "--text-color"));

			pointsLeft += toRemove;
		}
		pointsLeftDiv.innerText = pointsLeft;
		
	});
	

	var downArrow = document.createElement("div");
	downArrow.classList.toggle("down-arrow");
	downArrow.innerHTML = "&lt";
	downArrow.addEventListener("click", function(event)
	{
		if(!isNaN(parseInt(input.value)))
		{
			var valeur = points.get(name) ?? 0;
			
			let step  = 1;
			if(event.shiftKey)
				step = 5;
			else if(event.ctrlKey)
				step = 10;


			let toRemove = Math.min(step, valeur);
			input.value = (valeur - toRemove) + "";
			points.set(name, valeur - toRemove);

			input.setAttribute("style", "text-align:center;color:" + (valeur - toRemove == 0 ? "#888888" : "--text-color"));


			pointsLeft += toRemove;
			pointsLeftDiv.innerText = pointsLeft;
		}
	});
    
	var upArrow = document.createElement("div");
	upArrow.classList.toggle("up-arrow");
	upArrow.innerHTML = "&gt";
	upArrow.addEventListener("click", function(event)
	{
		if(!isNaN(parseInt(input.value)))
		{
			var valeur = points.get(name) ?? 0;
			
			let step  = 1;
			if(event.shiftKey)
				step = 5;
			else if(event.ctrlKey)
				step = 10;


			let toAdd = Math.min(step, pointsLeft);
			input.value = (valeur + toAdd) + "";
			points.set(name, valeur + toAdd);

			input.setAttribute("style", "text-align:center;color:" + (valeur + toAdd == 0 ? "#888888" : "--text-color"));


			pointsLeft -= toAdd;
			pointsLeftDiv.innerText = pointsLeft;
		}
	});
	
	subDiv.appendChild(downArrow);
	subDiv.appendChild(input);
	subDiv.appendChild(upArrow);
	
    div.appendChild(label);
    div.appendChild(subDiv);
	form.appendChild(div);
	searchItems.push(div);
	
}

searchBox.addEventListener("submit", function(event)
{
	event.preventDefault();
	searchCallback();
});

searchBox.children[0].addEventListener("keyup", function(event)
{
	searchCallback();
});

function searchCallback()
{
	var filter = searchBox.children[0].value.toUpperCase();
	searchItems.forEach(function(e) 
	{
		// if (e.children[0].innerHTML.toUpperCase().indexOf(filter) > -1) 
		// 	e.style.display = "";
		// else 
		// 	e.style.display = "none";

		if (e.getElementsByTagName("input")[0].getAttribute("name").toUpperCase().indexOf(filter) > -1)
		{
			e.setAttribute("style", "overflow:hidden; transition: height 1s, margin 0.2s");
		}
		else
		{
			e.style.height = "0";
			e.style.marginTop = "0";
			e.style.marginBottom = "0";
		}

	});
}

function populate()
{
	document.getElementById("resultsButton").setAttribute("href", "/user/" + id + "/results")

	sendJsonRequest("/user/getUserInfos", "POST", {id:id}, function(status, res)
	{
		if(!res.correct)
			return location.href = res.redirect;
		
		pointsLeft = res.points;

		starsContainer.innerText = " Vous avez " + res.maxPoints + " étoiles au total : "

		res.choices.forEach(function(e)
		{
			var p =  e[1] == null ? 0 : e[1];
			addChoice(e[0], p);
			pointsLeft -= p;
		});

		pointsLeftDiv.innerText = pointsLeft;
	});
}


document.getElementById("submit").addEventListener("click", function(event)
{
	var obj = {choices:[]};

	searchItems.forEach(function(e)
	{
			var input = e.getElementsByTagName("input")[0];
			var name = input.getAttribute("name");
			var valeur = parseInt(input.value);
			if(!isNaN(valeur) && valeur > 0)
				obj.choices.push([name,valeur]);
	});

	sendJsonRequest("/user/" + id + "/panel", "POST", obj, function(status,res)
	{
		if(res.errors)
			setupBasicPopup("Utilisateur", "Erreur lors de l'enregistrement de vos choix");
		else
			setupBasicPopup("Utilisateur", "Vos choix ont correctement été enregistrés");
		openBasicPopup();
	});

});


populate();
    //L'avertissement utilisateur

    // Je l'ai pas rajouté car tu as déjà créer une structure pour ça que je ne connais pas, mais il faut aussi créer le message d'alerte qui apparaîtra si l'user n'a pas mit toutes ses étoiles dans les inputs
