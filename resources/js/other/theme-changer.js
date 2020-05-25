
contentColor = localStorage.getItem("content");
specialColor = localStorage.getItem("special");
imagesColor = localStorage.getItem("images");
subcontentColor = localStorage.getItem("subcontent");
toolbarColor = localStorage.getItem("toolbar");
textColor = localStorage.getItem("text");
elementColor = localStorage.getItem("element");

if (contentColor != null)
{
	document.documentElement.style
		.setProperty('--content-background-color', contentColor);
	document.documentElement.style
		.setProperty('--subcontent-background-color', subcontentColor);
	document.documentElement.style
		.setProperty('--toolbar-background-color', toolbarColor);
	document.documentElement.style
		.setProperty('--text-color', textColor);
	document.documentElement.style
		.setProperty('--subcontent-element-color', elementColor);
	document.documentElement.style
		.setProperty('--special-color', specialColor);
	document.documentElement.style
		.setProperty('--images-tweak', imagesColor);

}


function generatePopup()
{
	var popup = document.createElement("div")
	popup.appendChild(document.createElement("h3"));
	popup.children[0].innerHTML = "Besoin d'aide ?";
	popup.appendChild(document.createElement("p"));
	popup.children[1].innerHTML = 'Vous manquez d informations sur le site et ses charismatiques créateurs, ou bien vous n êtes pas satisfait avec le visuel du site ? Vous trouverez en bas de la page tout ce dont vous pourriez avoir besoin ! <hr/> <br/> <h3> Affichage : </h3>'

	var dark = document.createElement("div");
	dark.classList.add("dark-theme")
	dark.innerHTML = "Thème sombre"

	dark.addEventListener("click", () =>
	{
		document.documentElement.style
			.setProperty('--content-background-color', '#2F2F2C');
		localStorage.setItem("content", '#2F2F2C');
		document.documentElement.style
			.setProperty('--subcontent-background-color', '#31312E');
		localStorage.setItem("subcontent", '#31312E');
		document.documentElement.style
			.setProperty('--toolbar-background-color', '#29292C');
		localStorage.setItem("toolbar", '#29292C');
		document.documentElement.style
			.setProperty('--text-color', '#EFEFEF');
		localStorage.setItem("text", '#EFEFEF');
		document.documentElement.style
			.setProperty('--subcontent-element-color', '#37383A');
		localStorage.setItem("element", '#37383A');
		document.documentElement.style
			.setProperty('--special-color', '#E69743');
		localStorage.setItem("special", '#E69743');
		document.documentElement.style
			.setProperty('--images-tweak', '180deg');
		localStorage.setItem("images", '180deg');
	});


	var bright = document.createElement("div");
	bright.classList.add("bright-theme")
	bright.innerHTML = "Thème clair"


	bright.addEventListener("click", () =>
	{
		document.documentElement.style
			.setProperty('--content-background-color', '#F2F7FF');
		localStorage.setItem("content", '#F2F7FF');
		document.documentElement.style
			.setProperty('--subcontent-background-color', '#F2F4F8');
		localStorage.setItem("subcontent", '#F2F4F8');
		document.documentElement.style
			.setProperty('--toolbar-background-color', '#E9F0FF');
		localStorage.setItem("toolbar", '#E9F0FF');
		document.documentElement.style
			.setProperty('--text-color', '#111111');
		localStorage.setItem("text", '#111111');
		document.documentElement.style
			.setProperty('--subcontent-element-color', '#E3E5E9');
		localStorage.setItem("element", '#E3E5E9');
		document.documentElement.style
			.setProperty('--special-color', '#0DA2FF');
		localStorage.setItem("special", '#0DA2FF');
		document.documentElement.style
			.setProperty('--images-tweak', '0deg');
		localStorage.setItem("images", '0deg');
	});

	popup.appendChild(dark);
	popup.appendChild(bright);



	//en faire une popup :
	registerPopup("theme", popup);
}


generatePopup();