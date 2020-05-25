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
	//title.setAttribute('href', "#######################");
	title.textContent = name;
	title.addEventListener("click", function(event)
	{
		sendJsonRequest("/admin/startResults/" + index,"POST",{}, function(status, res)
		{
			if(res.correct)
				setupBasicPopup("Debug","CORRECT");
			else
				setupBasicPopup("Debug"," PAS CORRECT");

			openBasicPopup();
		});
	});

	var info1 = document.createElement('div');
	var info2 = document.createElement('div');
	info1.classList.toggle('informations');
	info2.classList.toggle('informations');

	var members = document.createElement('p');
	members.textContent = numberOfMumbers + " participants";
	members.setAttribute('style', "width:50%; text-align: center");

	var separ = document.createElement('div');
	separ.classList.toggle('footer-separator');
	separ.setAttribute('style', 'margin: 0;');
	separ.textContent = '|';

	var percentageP = document.createElement('p');
	percentageP.textContent = pourcentage + "% de participation";
	percentageP.setAttribute('style', "width:50%; text-align: center");

	var modify = document.createElement('a');
	modify.textContent = 'Modifier';
	modify.classList.toggle('button-list');
	modify.setAttribute("href", "/admin/modify/" + index);
	modify.setAttribute("style", "text-decoration-line: none;" + index);
	
	var suppr = document.createElement('button');
	suppr.textContent = 'Supprimer';
	suppr.classList.toggle('button-list');
	suppr.addEventListener("click", function()
	{
		sendJsonRequest("/admin/supprVote", "POST", {index:index}, function(status, res)
		{
			if(res.correct)
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

function createAddElement()
{
	var frame = document.createElement('a');
	frame.classList.toggle('list');
	frame.classList.toggle('add-list');
	frame.setAttribute('href', "/admin/createVote");
	frame.innerText = "+";

	container.appendChild(frame);
}


function loadVoteElements()
{
	sendJsonRequest("/admin/getCurrentVotes", "GET", null, function(status, res)
	{

		while (container.childElementCount > 0) 
		{
			container.removeChild(container.lastElementChild);
		}
		

		for(let i=0;i<res.length;i++)
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