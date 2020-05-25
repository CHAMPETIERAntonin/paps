const waiting = document.querySelector("#waiting-frame");
const warning = document.querySelector("#warning-frame");
const done = document.querySelector("#done-frame");

const allowUsers = document.querySelector("#allow-users");
const calcResults = document.querySelector("#calc-results");
const confirmation = document.querySelector(".confirmation-container");


var resultList = document.getElementById("resultList")


calcResults.addEventListener("click", calculateResults);
allowUsers.addEventListener("click", allowUsersAccess);



function calculateResults()
{
	// if (document.querySelector(".visible") != done)
	// {
	// 	waiting.classList.toggle("invisible");
	// 	done.classList.toggle("invisible");
	// 	waiting.classList.toggle("visible");
	// 	done.classList.toggle("visible");
	// }

	sendJsonRequest("/admin/startResults/" +  location.href.substring(location.href.lastIndexOf('/') + 1), "POST", null, function(status, res)
	{
		if(res.correct)
		{
			openPopup("sucess")

			addResultToList(res.result.date, resultList.childElementCount - 1)
		}
	});

};

function allowUsersAccess()
{
	// if (document.querySelector(".visible") == done)
	// {
	// 	done.classList.toggle("invisible");
	// 	warning.classList.toggle("invisible");
	// 	done.classList.toggle("visible");
	// 	warning.classList.toggle("visible");
	// }
	// else
	// {
	// 	waiting.classList.toggle("invisible");
	// 	warning.classList.toggle("invisible");
	// 	waiting.classList.toggle("visible");
	// 	warning.classList.toggle("visible");
	// }

	// allowUsers.removeEventListener("click", allowUsersAccess);
	// calcResults.removeEventListener("click", calculateResults);

	// var confirm = document.createElement("div");
	// confirm.innerHTML = "Confirmer";

	// var abort = document.createElement("div");
	// abort.innerHTML = "Annuler";

	// confirmation.appendChild(confirm);
	// confirmation.appendChild(abort);
	// abort.addEventListener("click", abortOperation);
	// confirm.addEventListener("click", confirmOperation);


	openPopup("warning")
};


function registerPopups()
{
	var warningPopup = document.createElement("div")
	warningPopup.setAttribute("style", "width:75%;cursor: initial;")
	warningPopup.id = "warning-frame";
	warningPopup.classList.add("result-frame");
	warningPopup.innerHTML = '<div class="result-frame-frame" style="flex-direction: column;padding: 5px;"><div id="warning" style="display: flex;height: 90%;width: 100%;"><div class="result-frame-picture" style="margin: 50px;"> </div><div class="result-frame-text"><p> Attention ! Le processus entraînera des conséquences irréversibles ! Cliquer sur "Confirmer" si vous êtes sûr de vous ! </p></div><div></div></div><div style="height: 10%;justify-content: center;" class="centerContainerH"><button style="width: 75px;" id="confirmAllowUsers">Confirmer</button><button style="width: 75px;" class="returnButton">Retour</button></div></div>'
	registerPopupNoFrame("warning", warningPopup)
	document.getElementById("confirmAllowUsers").addEventListener("click", function(event)
	{
		leavePopup()

		sendJsonRequest("/admin/startVote/" + location.href.substring(location.href.lastIndexOf('/') + 1), "POST", null, function(status, res)
		{
			if(res.correct)
			{
				openPopup("sucess");
				allowUsers.disabled = true;
				allowUsers.innerText = "L'accès est déjà autorisé"
			}
		})
	})


	var succesPopup = document.createElement("div")
	succesPopup.setAttribute("style", "width:75%;cursor: initial;")
	succesPopup.id = "done-frame";
	succesPopup.classList.add("result-frame");
	succesPopup.innerHTML = '<div class="result-frame-frame" style="flex-direction: column;padding: 5px;"><div id="done" style="display: flex;width: 100%;"><div class="result-frame-picture" style="margin: 50px;"> </div><div class="result-frame-text"><p> Processus terminé ! Vous pouvez choisir une autre option ou quitter la page ! </p></div></div><div style="height: 10%;width: 100%;justify-content: center;" class="centerContainer"><button style="width: 100px; " class="returnButton">Confirmer</button></div></div>'
	registerPopupNoFrame("sucess", succesPopup)
}


function updateSelected(indexSelected)
{
	Array.from(resultList.children).forEach(function(e, index)
	{
		if(index != 0)
		{	
			if(index - 1 == indexSelected)
				e.setAttribute("style", "background-color:var(--toolbar-background-color)");
			else
				e.setAttribute("style", "")

			e.children[0].children[0].checked = index - 1 == indexSelected;
		}

	});
}


function addResultToList(date, index, selected)
{
	var link = "admin/vote/" + location.href.substring(location.href.lastIndexOf('/') + 1) + "/results/" + index


	var frame = document.createElement("div");
	frame.classList.add("vertical-list-item");

	if(selected)
		frame.setAttribute("style", "background-color:var(--toolbar-background-color)")
	
	var span = document.createElement("span");
	span.setAttribute("style", "width:25%");

	var input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	input.checked = selected;
	input.addEventListener("change", function(event)
	{
		sendJsonRequest("/admin/vote/" + location.href.substring(location.href.lastIndexOf('/') + 1) + "/setSelectedResult/" + index, "POST", {selected:input.checked}, function(status, res)
		{
			if(res.correct)
			{
				updateSelected(res.indexSelected);
			}
		})
	});
	span.appendChild(input)
	
	
	var dateDiv = document.createElement("p");
	dateDiv.setAttribute("style", "width:25%");
	dateDiv.innerHTML = date;
	
	var linkDiv = document.createElement("a");
	linkDiv.setAttribute("style", "width:18%; text-align:right; text-decoration:none; color:var(--special-color)");
	linkDiv.setAttribute("href", "/" + link);
	linkDiv.innerHTML= "lien";
	
	var span2 = document.createElement("span");
	span2.setAttribute("style", "width: calc(35% - 30px)");
	
	var suppr = document.createElement("p");
	suppr.classList.add("vertical-list-suppr");
	suppr.setAttribute("style", "width:30px;")
	suppr.innerHTML = "&#128465;";
	
	var supprContainer = document.createElement("div");
	supprContainer.style.overflowX = "hidden";
	supprContainer.appendChild(suppr);
	
	suppr.addEventListener("click", function()
	{

		sendJsonRequest("/admin/vote/" + location.href.substring(location.href.lastIndexOf('/') + 1) + "/supprResult/" + index, "POST", null, function(status, res)
		{
			if(res.correct)
				loadResults();
		});
	});
	

	frame.addEventListener("mouseenter", function(event)
	{
		suppr.style.left = "0px";
	});
	
	frame.addEventListener("mouseleave", function(event)
	{
		suppr.style.left = "30px";
	});

	frame.appendChild(span);
	frame.appendChild(dateDiv);
	frame.appendChild(linkDiv);
	frame.appendChild(span2);
	frame.appendChild(supprContainer);
	
	resultList.appendChild(frame);
}


function loadResults()
{

	sendJsonRequest("/admin/vote/" + location.href.substring(location.href.lastIndexOf('/') + 1) + "/getAllResults", "GET", null, function(status, res)
	{
		if(res.correct)
		{
			if(res.started)
			{
				allowUsers.disabled = true;
				allowUsers.innerText = "L'accès est déjà autorisé"
			}

			while (resultList.childElementCount > 1) 
			{
				resultList.removeChild(resultList.lastElementChild);
			}

			res.results.forEach(function(e,index)
			{
				console.log(res.indexSelected)
				addResultToList(e.date, index, index == res.indexSelected);
			});
			
		}
	});
}


/* export interface ResultObj
{
	choices:{name:string,users:{firstName:string,lastName:string}[]}[];
	noResults:{firstName:string,lastName:string}[];
} */




registerPopups();
loadResults();

