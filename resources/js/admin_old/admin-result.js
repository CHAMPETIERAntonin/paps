var titleDiv = document.getElementById("Choice-big-title")
var choiceContaireDiv = document.getElementsByClassName("choicesContainer")[0]
var viewport = document.getElementsByClassName("choice-results")[0]
var choiceSelector = document.getElementsByClassName("choice-selector")[0]

// fonction pour gérer la transition

// Valeur par défaut : pas de transition de sortie comme lors de la première exécution de la fonction on a aucun encadré dedans à faire partir !
numberoutcoming = 0;

function transition(numberincoming, numberoutcoming, name)
 {

	var left = 860;
	var opacityIC = 0;
	var opacityOC = 1;
	var right = 0;
	function slider() 
	{
		var elementincoming = document.querySelector('#result' + numberincoming);
		var elementoutcoming = document.querySelector("#result" + numberoutcoming);
		left -= 10.75;
		opacityIC += 0.0125;
		elementincoming.style.left = left + 'px';
		elementincoming.style.opacity = "" + opacityIC;

		if (numberoutcoming != 0) 
		{
			right -= 10.75;
			opacityOC -= 0.0125;
			elementoutcoming.style.left = right + 'px';
			elementoutcoming.style.opacity = "" + opacityOC;
		}


		if (left == 0) 
		{
			clearInterval(id)
			if (numberoutcoming != 0) 
			{
				elementoutcoming.style.left = "860px";
			}
			window["numberoutcoming"] = numberincoming;
			var title = document.querySelector("#Choice-big-title");
			title.innerHTML = name;

		}

	}
	if (numberincoming != numberoutcoming) {
		var id = setInterval(slider, 10);

	}

}


function createElement(choiceName, users, index)
{
	if(index == 0)
		titleDiv.innerText = choiceName;

	var button = document.createElement("div");
	button.classList.add("choice-button");
	button.innerText = choiceName;
	button.addEventListener("click", function(event)
	{
		choiceContaireDiv.style.left = (index * -100) + "%";
		titleDiv.innerText = choiceName;
	});
	choiceSelector.appendChild(button);	


	var container = document.createElement("div");
	container.classList.add("result-container");
	container.style.width = viewport.offsetWidth + "px";

	users.forEach(function(e, index)
	{
		var userContainer = document.createElement("div");
		userContainer.classList.add("result-list");

		var rank = document.createElement("span");
		rank.innerText = index + 1 + "";

		var firstName = document.createElement("span");
		firstName.innerText = e.firstName;

		var lastName = document.createElement("span");
		lastName.innerText = e.lastName;

		userContainer.appendChild(rank);
		userContainer.appendChild(firstName);
		userContainer.appendChild(lastName);

		container.appendChild(userContainer);
	});

	choiceContaireDiv.appendChild(container);
}


function populate()
{
	sendJsonRequest("/admin/getResults/" + location.href.substring(location.href.lastIndexOf('/') + 1), "GET", null, function(status, res)
	{
		if(res.correct)
		{

			res.results.choices.forEach(function(e,index)
			{
				createElement(e.name,e.users, index);
			});

			createElement("Non triés", res.results.noResults, res.results.choices.length);
		}
		else
		{
			setupBasicPopup("Résultats", "Vous n'avez pas encore généré les résultats");
			openBasicPopup();
		}
	})
}


populate();

// Comme on peut le voir dans le html admin-results, chaque "result-container" contient un ID coorespondant à result[numéro d'ordre] avec le numéro partant de 1.
// On se sert de ces numéros pour désigner l'encadré auquel il faut faire la transition, on garde automatiquement une trace du derneir encadré auquel on a fait la transition pour y appliquer automatiquement une transition de sortie à la prochaine utilisation de la fonction.


//Génération des boutons + tableau : fonction type 
function berj()
{
	numberResult = 0; // variable à incrémenter au début de chaque fonction de génération pour attribuer les ID des tableaux ("result" + numberResult)

	const buttonContainer = document.querySelector(".choice-selector");

	var button = document.createElement("div");
	button.classList.toggle("choice-button");
	button.innerHTML = "Name";

	buttonContainer.appendChild(button);

	const resultsContainer = document.querySelector(".choice-results");

	var resultContainer = document.createElement("div");
	resultContainer.classList.toggle("result-container");
	window['numberResult'] += 1
	identifier = numberResult;
	resultContainer.setAttribute("id", "result" + numberResult);

	var tile = document.createElement("div"); // Là je créer une des "tuiles" qui sera affiché en gris dans le tableau, j'en fais qu'une seule pour le coup.
	tile.classList.toggle("result-list");

	var rank = document.createElement("span");
	rank.innerHTML = "1";

	var fName = document.createElement("span");
	fName.innerHTML = "Corentin";

	var lName = document.createElement("span");
	lName.innerHTML = "Caugant";

	tile.appendChild(rank);
	tile.appendChild(fName);
	tile.appendChild(lName);
	resultContainer.appendChild(tile);
	resultsContainer.appendChild(resultContainer);

	button.addEventListener("click", (e) => {

		transition(identifier, numberoutcoming, "Name");
	})

	// A supprimer : le code pour appliquer l'eventListener à une des div exemple du HTML pour le débugage :

	const button2 = document.querySelector("#button2");

	button2.addEventListener("click", (e) => {

		transition(2, numberoutcoming, "Name2");
	})
}
