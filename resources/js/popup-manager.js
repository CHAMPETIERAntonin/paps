//openBasicPopup
//openPopup
//leavePopup
//setupBasicPopup
//registerReturnButtons
//registerBasicPopupButtons


let sail;

let popups = new Map();
let currentPopup = null;
let basicPopup;

function registerReturnButtons()
{
	let returnButtons = document.getElementsByClassName("returnButton");
	for(let i=0;i<returnButtons.length;i++)
	{
		returnButtons[i].addEventListener("click", leavePopup);
	}
}


function registerBasicPopupButtons()
{
	let infoCircles = document.getElementsByClassName("popupOpener");
	for(let i=0;i<infoCircles.length;i++)
	{
		infoCircles[i].addEventListener("click", function()
		{
			if(infoCircles[i].getAttribute("data-name") != null)
				openPopup(infoCircles[i].getAttribute("data-name"));
			else
			{
				setupBasicPopup(infoCircles[i].getAttribute("data-title"), infoCircles[i].getAttribute("data-content"));
				openBasicPopup();
			}
		});
	}
}

function createPopupElements()
{
	sail = document.createElement("div");
	sail.classList.add("sail", "invisible", "returnButton");
	
	basicPopup = document.createElement("div");
	basicPopup.classList.add("pop-up", "invisible");
	basicPopup.setAttribute("onclick","event.cancelBubble=true;");
	basicPopup.appendChild(document.createElement("h3"));
	basicPopup.appendChild(document.createElement("p"));
	
	var retBut = document.createElement("button");
	retBut.classList.add("returnButton");
	retBut.innerHTML = "Retour";
	
	basicPopup.appendChild(retBut);
	
	sail.appendChild(basicPopup);
	
	popups.set("basicPopup", basicPopup)

	document.body.appendChild(sail);
}

function registerPopup(name, popup)
{
	let popupContainer = document.createElement("div");
	popupContainer.classList.add("pop-up", "invisible");
	popupContainer.setAttribute("onclick","event.cancelBubble=true;");
	popupContainer.appendChild(popup);
	
	popups.set(name, popupContainer);

	console.log("Register Popup " + name)

	sail.appendChild(popupContainer);
	registerReturnButtons();
}


function registerPopupNoFrame(name, popup)
{
	popup.classList.add("invisible");
	popup.setAttribute("onclick","event.cancelBubble=true;");
	
	popups.set(name, popup);
	sail.appendChild(popup);
	registerReturnButtons();
}

/**
 * @param {String} title 
 * @param {String} content 
 */
function setupBasicPopup(title, content)
{
	basicPopup.children[0].innerHTML = title;
	basicPopup.children[1].innerHTML = content;
}


function openPopup(popupName)
{
	if(currentPopup != null)
		return;

	var popup = popups.get(popupName)

	popup.classList.remove("invisible");
	sail.classList.remove("invisible");
	currentPopup = popup;
}

function openBasicPopup()
{
	openPopup("basicPopup");
	basicPopup.getElementsByClassName("returnButton")[0].focus();
}

function leavePopup()
{
	if(currentPopup == null)
		return;
	
	currentPopup.classList.add("invisible");
	sail.classList.add("invisible")
	currentPopup = null;
}

createPopupElements();
registerBasicPopupButtons();
registerReturnButtons();


/* 

let popups = ["userList", "addUser", "addUserList", "choiceList", "addChoice", "addChoiceList"];

popups.forEach(function(element)
{
	var button = document.getElementById(element + "Button");
	var popup = document.getElementById(element);
	button.addEventListener("click", function(){openPopup(popup)});
}) */

