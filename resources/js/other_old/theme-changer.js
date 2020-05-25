
contentColor = localStorage.getItem("content");


subcontentColor = localStorage.getItem("subcontent");


toolbarColor = localStorage.getItem("toolbar");


textColor = localStorage.getItem("text");

if (contentColor != null) {
  document.documentElement.style
  .setProperty('--content-background-color', contentColor);
  document.documentElement.style
  .setProperty('--subcontent-background-color', subcontentColor);
  document.documentElement.style
  .setProperty('--toolbar-background-color', toolbarColor);
  document.documentElement.style
  .setProperty('--text-color', textColor);
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

  dark.addEventListener("click", () => {
    document.documentElement.style
    .setProperty('--content-background-color', '#3E3A3C');
    localStorage.setItem("content",'#3E3A3C');
    document.documentElement.style
    .setProperty('--subcontent-background-color', '#26262E');
    localStorage.setItem("subcontent",'#26262E');
    document.documentElement.style
    .setProperty('--toolbar-background-color', '#323239');
    localStorage.setItem("toolbar",'#323239');
    document.documentElement.style
    .setProperty('--text-color', '#EFEFEF');
    localStorage.setItem("text",'#EFEFEF');
  });


  var bright = document.createElement("div");
  bright.classList.add("bright-theme")
  bright.innerHTML = "Thème clair"


  bright.addEventListener("click", () => {
    document.documentElement.style
    .setProperty('--content-background-color', '#F3F3FF');
    localStorage.setItem("content",'#F3F3FF');
    document.documentElement.style
    .setProperty('--subcontent-background-color', '#B3B3BF');
    localStorage.setItem("subcontent",'#B3B3BF');
    document.documentElement.style
    .setProperty('--toolbar-background-color', '#D3D3DF');
    localStorage.setItem("toolbar",'#D3D3DF');
    document.documentElement.style
    .setProperty('--text-color', '#111111');
    localStorage.setItem("text",'#111111');
  });

  popup.appendChild(dark);
  popup.appendChild(bright);



  //en faire une popup :
  registerPopup("theme", popup);
}


generatePopup();