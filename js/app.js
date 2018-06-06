var app = {
  // clé API Jcdeaux Lyon
  velibApi: 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=14531e7cdfe331ad75ac758ce80d630bb2143c27',
  map: null,
  x: null,
  // déclaration des variables pour naviguer le DOM
  stationName: document.querySelector(".station_name"),
  stationAddress: document.querySelector('.station_address'),
  availableBikes: document.querySelector('.station_bike'),
  stationInfo: document.getElementById("station_info"),
  chronoOff: document.querySelector("#chrono_off"),
  chronoOn: document.querySelector("#chrono_on"),
  chronoStation: document.querySelector('#chrono_station'),
  timerText: document.querySelector('#chrono_countdown'),
  submitButton: document.getElementById("booking_submit"),
  cancelBooking: document.getElementById("booking_cancel"),
  openBooking: document.getElementById("open_booking"),
  modal: document.getElementById('myModal'),
  modal2: document.getElementById('myModal_2'),
  stationBooking: document.getElementById("station_booking"),
  submitBooking: document.getElementById("booking_submit"),
  close: document.getElementById("btnClose"),
  btn: document.getElementById("myBtn"),
  span: document.getElementsByClassName("close")[0],


  // événements lors d'un clic sur un bouton
  buttonEvents: function(){
      var app = this;

      // ouverture du modal lors du clic sur 'comment ça marche', fermeture du second modal
    app.btn.onclick = function() {
      app.modal.style.display = "block";
      app.modal2.style.display = "none";
    }

    // fermeture du modal lors du clic sur la croix en haut a droite
    app.span.onclick = function() {
      app.modal.style.display = "none";
    }

    // si l'utilisateur clique en dehors d'un modal. ferme le modal qui est ouvert. Pour le deuxiéme modal, la fermeture réenitialse le style et le canvas
    window.onclick = function(event) {
      if (event.target == app.modal) {
        app.modal.style.display = "none";
      } else if (event.target == app.modal2) {
        app.modal2.style.display = "none";
        app.stationInfo.style.display = "block";
        app.openBooking.style.display = "inline";
        app.stationBooking.style.display = "none";
        app.submitBooking.style.display = "none";
        ctx.clearRect(0, 0, document.getElementById('canvas-sign').width, document.getElementById('canvas-sign').height);
      }
    }

    // fermer le modal de station lors du clic sur le bouton fermer
    app.close.onclick = function() {
      app.modal2.style.display = "none";
      app.stationInfo.style.display = "block";
      app.openBooking.style.display = "inline";
      app.stationBooking.style.display = "none";
      app.submitBooking.style.display = "none";
    }
  },
  // initialisation de la map google
  initMap: function() {
    app.map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: 45.755637,
        lng: 4.843653
      },
      zoom: 16,
      minZoom: 14,
      scrollwheel: false
    });

    // appel de la méthode pour créer les marqueurs
    app.callApiVelib();
  },

  // méthode pour créer un chrono
  countDown: function() {
    var finishDate = new Date().getTime() + 1200100;
    app.x = setInterval(function() {
      var now = new Date().getTime();

      var distance = finishDate - now;

      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      // afficher dans l'élément avec comme id="chrono_countdown"
      app.timerText.innerHTML = (minutes + ":" + seconds);
      app.timerText.style.color = "#3cb0fd";
      // si le chrono se termine, cacher les informations
      if (distance < 0) {
        // reset du chrono
        clearInterval(app.x);
        // on switch le footer
        app.chronoOff.style.display = "block";
        app.chronoOn.style.display = "none";
      }


    },);

  },

  // appel ajax de l'API pour les infos de stations de vélib, on affiche les marqueurs pour chaque stations, on réserve et on lance le chrono lors de la réservation
  callApiVelib: function() {
    ajaxGet(app.velibApi, function(reponse) {
      var stations = JSON.parse(reponse);

      // pour chaque station : on crée un marqueur sur la map + on définis les action lors du clic sur les boutons du modal station
      stations.forEach(function(station) {
        var marker = new google.maps.Marker({
          position: station.position,
          map: app.map,
          icon: "img/marker_vert.png",
          title: station.name
        });

        // marqueur rouge si la station n'a aucun vélib en stock
        if (station.available_bikes === 0) {
          marker.icon = "img/marker_rouge.png";
        }

        // On charge les informations de la station dans le DOM
        marker.addListener('click', function() {
          app.modal2.style.display = "block";
          var nomStation = $(".station_name");
          nomStation.text(station.name);
          var stationAddress = $(".station_address");
          stationAddress.text(station.address);
          var stationBike = $(".station_bike");
          stationBike.text(station.available_bikes);

          // animation du marqueur lors du clic
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 2100);

          // affichage du modal avec les informations de la station provenant de l'API + on clear le canvas si jamais il y avais déjà une signature
          app.openBooking.onclick = function() {
            // si des vélibs sont disponibles
            if (station.available_bikes != 0){
              app.stationInfo.style.display = "none";
              app.openBooking.style.display = "none";
              app.stationBooking.style.display = "block";
              app.submitBooking.style.display = "inline";
              ctx.clearRect(0, 0, document.getElementById('canvas-sign').width, document.getElementById('canvas-sign').height);
            }
            // si available_bikes = 0
            else {
              alert("Aucun vélo disponible !");
            }
          };




          // Si l'utilisateur valide la réservation, on ferme le modal, on lance le chrono et on affiche le nom de la station dans le footer
          app.submitButton.onclick = function() {
            // si le canvas n'est pas signé
            if (document.getElementById('canvas-sign').toDataURL() == document.getElementById('blank').toDataURL()) {
              alert('Vous devez signer pour réserver !');
            } else {
              // le nom de la station est enregistré pour la session ou jusqu'a fin du chrono / annulation
              sessionStorage.setItem('name', station.name);

              // on switch le footer
              app.chronoOff.style.display = "none";
              app.chronoOn.style.display = "flex";
              // on récupère le nom de la station pour l'afficher dans le footer
              app.chronoStation.innerHTML = sessionStorage.getItem("name");
              app.chronoStation.style.color = "#3cb0fd";

              app.modal2.style.display = "none";
              app.stationInfo.style.display = "block";
              app.openBooking.style.display = "inline";
              app.stationBooking.style.display = "none";
              app.submitBooking.style.display = "none";
              // reset du chrono si le chrono était déjà en place
              clearInterval(app.x);
              // on lance le chrono pour cette réservation
              app.countDown();
            }
          };
          // Annulation de la  reservation
          app.cancelBooking.onclick = function() {
            // on reset le chrono pour éviter de le faire tourner sans affichage
            clearInterval(app.x);
            // on re-switch le footer
            app.chronoOff.style.display = "block";
            app.chronoOn.style.display = "none";
          };

        });

      });
    });
  }
}

app.buttonEvents();
