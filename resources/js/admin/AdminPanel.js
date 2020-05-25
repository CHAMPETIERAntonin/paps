//sendJsonRequest
//sendJsonForm
//loadCSV
var container = document.querySelector('.list-container');


function createVoteListElement(name, numberOfMumbers, pourcentage, index)
{
	var frame = document.createElement('div');
	frame.classList.toggle('list');

	var title = document.createElement('a');
	title.classList.toggle('title-list');
	title.setAttribute('href', "/admin/vote/" + index);
	title.textContent = name;
	// title.addEventListener("click", function(event)
	// {
	// 	sendJsonRequest("/admin/startResults/" + index,"POST",{}, function(status, res)
	// 	{
	// 		if(res.correct)
	// 			setupBasicPopup("Debug","CORRECT");
	// 		else
	// 			setupBasicPopup("Debug"," PAS CORRECT");

	// 		openBasicPopup();
	// 	});
	// });

	var info1 = document.createElement('div');
	var info2 = document.createElement('div');
	info1.classList.toggle('informations');
	info2.classList.toggle('informations');

	var members = document.createElement('p');
	members.textContent = numberOfMumbers + " participants";


	var separ = document.createElement('div');
	separ.classList.toggle('footer-separator');
	separ.textContent = '|';

	var percentageP = document.createElement('p');
	percentageP.textContent = pourcentage + "% de participation";

	var modify = document.createElement('a');
	modify.textContent = 'Modifier';
	modify.classList.toggle('button-list');
	modify.setAttribute("href", "/admin/vote/" + index + "/modify");

	var suppr = document.createElement('button');
	suppr.textContent = 'Supprimer';
	suppr.classList.toggle('button-list');
	suppr.addEventListener("click", function ()
	{
		sendJsonRequest("/admin/supprVote", "POST", { index: index }, function (status, res)
		{
			if (res.correct)
			{
				loadVoteElements();
			}
		});
	});

	// On assemble tout ensemble
	info1.appendChild(members);
	info1.appendChild(separ);
	info1.appendChild(percentageP);
	info2.appendChild(modify);
	info2.appendChild(suppr);
	frame.appendChild(title);
	frame.appendChild(info1);
	frame.appendChild(info2);
	container.appendChild(frame);
}
//<div class='content'>
//	<h3> <strong> Créer une file d'attente : </strong> </h2>
//	<hr /> <br />
//	<div class="centerContainer">
//		<form id="creationForm" action='/createVote' method='post' class='form-container'>
//			<div class='form'>
//				<label for='name'>Nom de la file d'attente</label>
//				<input id='name' name='name' type='text' autocomplete="off" placeholder=' ...' />
//			</div>
//			<p class="formError" id="errorName" hidden> Ce nom est déjà pris</p>
//			<div class='form'>
//				<label for='points'>Nombre de points par personne</label>
//				<input id='points' name='name' type='number' autocomplete="off" placeholder=' 1' min="0" />
//			</div>
//			<p class="formError" id="errorPoints" hidden> Vous devez choisir un nombre supérieur à 0 </p>
//			<div class='form'>
//				<label for='croissant'>Ordre des notes/rang <span class="infoCircle popupOpener" data-title="Notes/Rang" data-content="Choisissez croissant si la personne la plus avantagée a un score plus élevée (note) ou décroissant si elle a un score plus bas (rang)"></span> </label>////////
//
//				<span for='croissant'>croissant</span>
//				<div class="customRadio">
//					<input id='croissant' name='name' type='radio' name="radio" checked/>
//					<checkmark></checkmark>
//				</div>
//				<span for='decroissant'>décroissant</span>
//				<div class="customRadio">
//					<input id='decroissant' name='name' type='radio' name="radio"/>
//					<checkmark></checkmark>
//				</div
//
//			</div>
//			<div class='form'>
//				<button> Ajouter</button>
//			</div>
//		</form>
//	</div>
//</div>



function createAddElement()
{
	var frame = document.createElement('div');
	frame.classList.toggle('list');
	frame.classList.toggle('add-list');
	//frame.setAttribute('href', "#");//"/admin/createVote");
	frame.innerText = "+";
	
	
	frame.addEventListener("click", fillAddElement);
	container.appendChild(frame);

}

document.getElementsByClassName("contents-container")[0].addEventListener("click", function (event)
{
	// event.preventDefault();

	var frame = document.querySelector(".add-list");
	if (frame.innerHTML != "+")
	{
		frame.innerHTML = "+";
	}
})

function fillAddElement(event) 
{
	event.cancelBubble = true;
	var frame = document.querySelector(".add-list");
	
	if(frame.innerHTML == "+")
	{
		frame.innerHTML = "";
		var centerContainer = document.createElement("div");
		centerContainer.setAttribute("style", "font-size:20px;height: 100%;justify-content: center;cursor: auto;");
		centerContainer.classList.add("centerContainer");

		var form = document.createElement("form");
		form.classList.toggle("form-container");
		form.setAttribute("id", "creationForm");
		form.setAttribute("action", "/admin/createVote");
		form.setAttribute("method", "post");

		var form1 = document.createElement("div");
		form1.classList.add("form");
		form1.classList.add("addList-form");
		var form2 = document.createElement("div");
		form2.classList.add("form");
		form2.classList.add("addList-form");

		var label = document.createElement("label");
		label.setAttribute("for", "name");
		label.innerHTML = "Nom de la file d'attente :";

		var input = document.createElement("input");
		input.setAttribute("id", "name");
		input.setAttribute("name", "name");
		input.setAttribute("type", "text");
		input.setAttribute("autocomplete", "off");
		input.setAttribute("placeholder", "...");


		var parag = document.createElement("p");
		parag.setAttribute("style", "font-size: initial; font-weight:initial")
		parag.classList.add("formError");
		parag.hidden = true;
		parag.innerHTML = " Ce nom est déjà pris";

		var button = document.createElement("button");
		button.innerHTML = "Ajouter & configurer";
		
		
		form.addEventListener("submit", function(event)
		{
			event.preventDefault();

			sendJsonRequest("/admin/createVote", "POST", {name:input.value}, function(status,res)
			{
				parag.hidden = res.correctName;

				if(res.redirect != null)
					location.href = res.redirect;
			})
		});

		form1.appendChild(label);
		form1.appendChild(input);

		form2.appendChild(button);

		form.appendChild(form1);
		form.appendChild(parag);
		form.appendChild(form2);

		centerContainer.appendChild(form);

		frame.appendChild(centerContainer);
	}
}



function loadVoteElements()
{
	sendJsonRequest("/admin/getCurrentVotes", "GET", null, function (status, res)
	{

		while (container.childElementCount > 0) 
		{
			container.removeChild(container.lastElementChild);
		}


		for (let i = 0; i < res.length; i++)
		{
			createVoteListElement(res[i].name, res[i].numberOfMembers, res[i].percentage, i);
		}
		createAddElement();
	});
}

loadVoteElements();


//createVoteListElement("SUAPS", 225, 15);
//createVoteListElement("Machine à Café", 60, 1380);
//createVoteListElement("Projet", 24, 100);
//createAddElement();