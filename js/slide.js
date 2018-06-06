// on crée l'objet slider
var slider = {
  height: null,
  width: null,
  imgTab: null,
  base: 0,
  parent: document.querySelector(".modal-body"),

  // méthode pour générer le slider
  generateSlider: function() {

    // création d'une div qui contiendra le slider
    var newDiv = document.createElement("div");
    newDiv.style.height = this.height;
    newDiv.style.width = this.width;
    // on imbrique la nouvelle div dans le parent
    this.parent.appendChild(newDiv);

    // on crée et stylise une img dans newDiv
    var img = document.createElement("img");
    img.className = "sliderImg";
    img.src = this.imgTab[this.base];
    img.style.width = this.width;
    newDiv.style.position = "relative";
    newDiv.appendChild(img);

    // on crée et  stylise les deux boutons de navigation du slider
    var button1 = document.createElement("i");
    var button2 = document.createElement("i");
    button1.style.position = "absolute";
    button2.style.position = "absolute";
    newDiv.appendChild(button1);
    newDiv.appendChild(button2);
    button1.className = "far fa-arrow-alt-circle-left";
    button1.style.fontSize = "2em";
    button2.className = "far fa-arrow-alt-circle-right";
    button2.style.fontSize = "2em";
    button1.style.top = "40%";
    button2.style.top = "40%";
    button1.style.left = "10px";
    button2.style.right = "10px";
    button1.style.color = "white";
    button2.style.color = "white";
    button1.style.backgroundColor = "#3cb0fd";
    button1.style.padding = "5px 5px 5px 5px";
    button1.style.borderRadius = "25px";
    button2.style.backgroundColor = "#3cb0fd";
    button2.style.padding = "5px 5px 5px 5px";
    button2.style.borderRadius = "25px";



  },

  // On ajoute 1 au tableau base pour afficher la prochaine img
  nextSlide: function() {
    this.base++;
    document.querySelector(".sliderImg").src = this.imgTab[this.base];

    // if base++ is bigger than base we reset it to 0
    if (this.imgTab.length - 1 < this.base) {
      this.base = 0;
      document.querySelector(".sliderImg").src = this.imgTab[this.base];

    }

  },

  // On soustrait 1 au tableau base pour afficher l'img précédente
  previousSlide: function() {
    this.base--;
    document.querySelector(".sliderImg").src = this.imgTab[this.base];

    // if base is under 0  we reset it to 2
    if (this.base < 0) {
      this.base = 2;
      document.querySelector(".sliderImg").src = this.imgTab[this.base];

    }

  },

  // on enrigne la touche du préssée (e) et apelle les méthodes si ces touches sont droite ou gauche
  changeSlideOnKeypress: function() {
    $('body').keydown(function(e) {
      if (e.which === 39) {
        slider1.nextSlide();
      } else if (e.which === 37) {
        slider1.previousSlide();
      }
    })
  },

  // on apelle les méthodes previous et next sur clic des fléches de navigation
  slideOnClick: function() {
    document.querySelector(".fa-arrow-alt-circle-left").addEventListener("click", function() {
      slider1.previousSlide();
    });
    document.querySelector(".fa-arrow-alt-circle-right").addEventListener("click", function() {
      slider1.nextSlide();
    });
  }
}

// on crée le slider avec comme paramétres: la hauteur, la largeur et une table contenant les img que nous voulons afficher
var slider1 = Object.create(slider);
slider1.height = "auto";
slider1.width = "100%";
slider1.imgTab = [
  "img/slide1.png",
  "img/slide2.png",
  "img/slide3.png"
]
// initialisation des methodes
slider1.generateSlider();
slider1.nextSlide();
slider1.previousSlide();
slider1.changeSlideOnKeypress();
slider1.slideOnClick();
