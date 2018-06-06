// Exécute un appel AJAX POST
// Prend en paramètres l'URL cible, la donnée à envoyer et la fonction callback appelée en cas de succès                                                              --
// Le paramètre isJson permet d'indiquer si l'envoi concerne des données JSON
// Fonction générique d'appel de requêtes serveur
function ajaxGet (url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400 ) { // Le serveur à bien traité la requête
            callback(req.responseText);
        } else { // Affiche des informations sur le traitement de la requête
            console.log(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        // La requête n'a pas réussi à atteindre le serveur
        console.log("Erreur réseau avec l'URL " + url)
    });
    req.send(null);
};
