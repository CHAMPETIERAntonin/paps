//sendJsonRequest
//sendJsonForm
//loadCSVasObj
//loadCSVasArray
//openBasicPopup
//openPopup
//leavePopup
//setupBasicPopup
//registerReturnButtons
//registerBasicPopupButtons


var userList = document.getElementById("userList");
var supprUserList = document.getElementById("supprUserList");

var userListForm = document.getElementById("userListForm");
var userUniqueForm = document.getElementById("userUniqueForm");

var choiceList = document.getElementById("choiceList");
var supprChoiceList = document.getElementById("supprChoiceList");

var choiceListForm = document.getElementById("choiceListForm");
var choiceUniqueForm = document.getElementById("choiceUniqueForm");

var downloadUserList = document.getElementById("downloadUserList");


var creationForm = document.getElementById("creationForm");

var errorPoints = document.getElementById("errorPoints");


var splitUrl = location.pathname.split("/")
var userCode = splitUrl[3]


userListForm.addEventListener("submit", function(event)
{
	event.preventDefault();
	
	
    var reader = new FileReader();
    reader.onload = function()
	{
		let obj = {};
		obj.votingUsers = loadCSVasArray(reader.result,3);
		
		sendJsonRequest("/admin/uploadVotingUsers/" + userCode, "POST", obj, function(status, res) 
		{
			setupBasicPopup("Utilisateurs", res.number + " utilisateurs ont été correctement ajoutés.");
			openBasicPopup();
			fillUserList();
		});
	};
    reader.readAsText(userListForm[0].files[0]);
});


userUniqueForm.addEventListener("submit", function(event)
{
	event.preventDefault();
	
	let obj = {};
	
	obj.votingUsers = [[document.getElementById("firstName").value, document.getElementById("lastName").value, document.getElementById("mark").value]];
	
	sendJsonRequest("/admin/uploadVotingUsers/" + userCode, "POST", obj, function(status, res) 
	{
		if(res.number == 1)
			setupBasicPopup("Utilisateurs", "L'utilisateur a été correctement ajouté.");
		else
			setupBasicPopup("Utilisateurs", "Erreur lors de l'ajout de l'utilisateur");
		
		openBasicPopup();
		fillUserList();
	});
});



function addUserToList(firstName, lastName, mark, code)
{
	var frame = document.createElement("div");
	frame.classList.add("vertical-list-item")

	
	var firstNameDiv = document.createElement("p");
	firstNameDiv.setAttribute("style", "width:19%");
	firstNameDiv.innerHTML = firstName;
	
	var lastNameDiv = document.createElement("p");
	lastNameDiv.setAttribute("style", "width:19%");
	lastNameDiv.innerHTML = lastName;
	
	var markDiv = document.createElement("p");
	markDiv.setAttribute("style", "width:6%");
	markDiv.innerHTML = mark;
	
	var codeDiv = document.createElement("p");
	codeDiv.setAttribute("style", "width: calc(53% - 30px)");
	codeDiv.innerHTML = code;
	
	var suppr = document.createElement("p");
	suppr.classList.add("vertical-list-suppr");
	suppr.setAttribute("style", "width:30px;")
	suppr.innerHTML = "&#128465;";
	
	var supprContainer = document.createElement("div");
	supprContainer.style.overflowX = "hidden";
	supprContainer.appendChild(suppr);

	suppr.addEventListener("click", function()
	{
		var obj = {};
		obj.userCode = code;
		sendJsonRequest("/admin/supprUser/" + userCode, "POST", obj, function(status, res)
		{
			if(res.correct)
				userList.removeChild(frame);
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

	frame.appendChild(firstNameDiv);
	frame.appendChild(lastNameDiv);
	frame.appendChild(markDiv);
	frame.appendChild(codeDiv);
	frame.appendChild(supprContainer);
	
	userList.appendChild(frame);
}

function fillUserList()
{
	while (userList.childElementCount > 1) 
	{
		userList.removeChild(userList.lastElementChild);
	}
	
	sendJsonRequest("/admin/getFirstUsers/" + userCode, "GET", null, function(status, res)
	{
		res.votingUsers.forEach(function(e)
		{
			addUserToList(e[0], e[1], e[2], e[3]);
		})
	});
}



choiceListForm.addEventListener("submit", function(event)
{
	event.preventDefault();
	
	var reader = new FileReader();
    reader.onload = function()
	{
		let obj = {};
		obj.choices = loadCSVasArray(reader.result,2);
		
		sendJsonRequest("/admin/uploadChoices/" + userCode, "POST", obj, function(status, res) 
		{
			setupBasicPopup("Choix", res.number + " choix ont été correctement ajoutés.");
			openBasicPopup();
			fillChoiceList();
		});
	};
    reader.readAsText(choiceListForm[0].files[0]);
});


choiceUniqueForm.addEventListener("submit", function(event)
{
	event.preventDefault();
	
	let obj = {};
	
	obj.choices = [[document.getElementById("choiceName").value, document.getElementById("maxMembers").value]];
	
	sendJsonRequest("/admin/uploadChoices/" + userCode, "POST", obj, function(status, res) 
	{
		if(res.number == 1)
			setupBasicPopup("Choix", "Le choix a été correctement ajouté.");
		else
			setupBasicPopup("Choix", "Erreur lors de l'ajout du choix");
		
		openBasicPopup();
		fillChoiceList();
	});
});


function addChoiceToList(name, maxMembers, index)
{
	var frame = document.createElement("div");
	frame.classList.add("vertical-list-item");
	
	var span = document.createElement("span");
	
	
	var nameDiv = document.createElement("p");
	nameDiv.setAttribute("style", "width:18%");
	nameDiv.innerHTML = name;
	
	var maxMembersDiv = document.createElement("p");
	maxMembersDiv.setAttribute("style", "width:18%; text-align:right");
	maxMembersDiv.innerHTML = maxMembers;
	
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
		var obj = {};
		obj.choiceIndex = index;
		sendJsonRequest("/admin/supprChoice/" + userCode, "POST", obj, function(status, res)
		{
			if(res.correct)
				choiceList.removeChild(frame);
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
	frame.appendChild(nameDiv);
	frame.appendChild(maxMembersDiv);
	frame.appendChild(span2);
	frame.appendChild(supprContainer);
	
	choiceList.appendChild(frame);
}

function fillChoiceList()
{
	while (choiceList.childElementCount > 1) 
	{
		choiceList.removeChild(choiceList.lastElementChild);
	}
	
	sendJsonRequest("/admin/getChoices/" + userCode, "GET", null, function(status, res)
	{
		res.choices.forEach(function(e, index)
		{
			addChoiceToList(e[0], e[1], index);
		})
	});
}


supprUserList.addEventListener("click", function()
{
	var obj = {userCode:"all"};
	sendJsonRequest("/admin/supprUser/" + userCode, "POST", obj, function(status, res)
	{
		if(res.correct)
		{
			while (userList.childElementCount > 1) 
			{
				userList.removeChild(userList.lastElementChild);
			}
		}
	});
});

supprChoiceList.addEventListener("click", function()
{
	var obj = {choiceIndex:"all"};
	sendJsonRequest("/admin/supprChoice/" + userCode, "POST", obj, function(status, res)
	{
		if(res.correct)
		{
			while (choiceList.childElementCount > 1) 
			{
				choiceList.removeChild(choiceList.lastElementChild);
			}
		}
	});
});



downloadUserList.addEventListener("click", function()
{
	location.href = "/admin/downloadUsers/" + userCode;
});


function fillEditZone()
{
	
	sendJsonRequest("/admin/getBasicInfos/" + userCode, "GET",null, function(status, res)
	{
		console.log(creationForm.elements);

		if(res.correct)
		{
			creationForm.elements[0].value = res.maximumPoints;
			
			if(res.direction == 0)
				creationForm.elements[1].checked = true;
			else if(res.direction == 1)
				creationForm.elements[2].checked = true;

			if(res.started)
			{
				creationForm.elements[0].disabled = true;
				creationForm.elements[0].disabled = true;
				creationForm.elements[1].disabled = true;
				creationForm.elements[2].disabled = true;
			}

		}
	});

	creationForm.addEventListener("submit", function(event)
	{
		event.preventDefault();

		sendJsonRequest("/admin/editVote/" + userCode, "POST", {maximumPoints:creationForm.elements[0].value, direction: (creationForm.elements[1].checked ? 0 : 1)}, function(status, res)
		{
			if(res.correctPoints && res.correctDirection && res.correctLogin)
			{
				setupBasicPopup("Modification Vote", "Modifications correctements enregistrées");
				openBasicPopup();
			}
			else
			{
				errorPoints.hidden = res.correctPoints;
					
				if(!res.correctLogin || !res.correctDirection)
				{
					setupBasicPopup("Modification Vote", "Erreur lors de l'enregistrement des modifications");
					openBasicPopup();
				}

			}
		});
	});

}


fillUserList();
fillChoiceList();
fillEditZone();