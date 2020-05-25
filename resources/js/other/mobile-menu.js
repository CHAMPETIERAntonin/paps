var magicBackground = document.querySelector(".sail");
var mobileMenu = document.querySelector(".mobile-container");
var triggerMobile = document.querySelector(".mobile-menu");
var mobileMenuCloser = document.querySelector(".mobile-toolbar-exit");


isDeployed = false;
leftIndicator = 0;
boucle = "";

function enter() {
  leftIndicator += 2.5;
  document.documentElement.style
  .setProperty('--width-counter', leftIndicator + "px");
  if (leftIndicator == 200) {
    clearInterval(boucle);
    isDeployed = true;
    triggerMobile.addEventListener("click", magic);
    magicBackground.addEventListener("click", magic);
    mobileMenuCloser.addEventListener("click", magic);
    
  }
}

function exit() {
  leftIndicator -= 2.5;
  document.documentElement.style
  .setProperty('--width-counter', leftIndicator + "px");
  if (leftIndicator == 0) {
    clearInterval(boucle);
    isDeployed= false;
    triggerMobile.addEventListener("click", magic);

  }
}

function magic() {
  triggerMobile.removeEventListener("click", magic);
  magicBackground.removeEventListener("click", magic);
  mobileMenuCloser.addEventListener("click", magic);
  if (isDeployed == false) {
    magicBackground.classList.toggle("invisible");
    boucle = setInterval(enter, 4);

  }
  else {
    magicBackground.classList.toggle("invisible");
    boucle = setInterval(exit, 4);
}
}





triggerMobile.addEventListener("click", magic);



//document.documentElement.style
//.setProperty('--content-background-color', contentColor);