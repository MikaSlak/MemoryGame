//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
///////////////////////// THE SCRIPT .JS  ///////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*
On va voir le jeu façon POO !

PRINCIPE DE FONCTIONEMENT DU SCRIPT :
en fin de script nous avons un if(document.readyState === 'loading') qui va nous permettre de lancer la fonction letsGo()
quand la page est chargée (cf : https://developer.mozilla.org/fr/docs/Web/Events/DOMContentLoaded )

Cette fonction let's go va gérer les differentes façon de lancer notre jeu qui sera représenté par un objet "game"
on pourra lancer le jeux de trois manières : 
    - au lancement de la partie, quand le joueur à entré son pseudo et à clické sur GO (ou appuyé sur la touche entrée)
    - apres une victoire pour relancer une partie
    - apres un game over pour relancer une partie
Ces trois façon de lancer ma game seront représentés coté html par trois div de classe "surcouche-info".
La fonction let's go va gérer tout les eventLisener sur toute ces surcouches et lancer la game ou non grace à la methode 
lancerGame() de notre objet "game".
La fonction let's go va également gérer tout les eventListener sur les cartes qui apelleront la methode retournerCarte de notre objet game

Pour le reste tout sera géré grace aux differentes methode de l'objet game.
l'objet game est composé des methodes suivantes :
    constructeur(tempsTotal, cartes) 
    map_range() // appelée dans notre lancerChronometre pour recalibrer notre probressbar
    lancerGame()
    cacherCartes(cartes)
    lancerChronometre()
    gameOver()
    victoire()
    retournerCarte(carte) // appelée dans eventlistener
    matchOuPas(carte)
    yesOnMatch(carte1, carte2)
    pasDeMatch(carte1, carte2)
    recupTypeCarte(carte)
    melangerCartes()
    puisJeRetournerCarte(carte)
Regarder les commentaires dans la classe "Game" pour plus de détail sur chaque methode

Une section AJAX dans la fonction let's go et dans l'objet "game" vont nous permettre d'apeller la scoreBoard (asynchrone pour éviter chargement longs)
*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// allé zou, on passe aux choses serieuses, let's declarer nos classes ^^
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////// CLASSE GESTION AUDIO ////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// petite classe qui va nous faciliter la gestion du son

class ControleurAudio {
    constructor(){ // constructeur apellé quand on contruit notre objet
        this.musiqueFond = new Audio('./assets/audio/gamesound.mp3');
        this.musiqueFlip = new Audio('./assets/audio/flip.wav'); // lien musique flip à changer
        this.musiqueMatch = new Audio('./assets/audio/match.wav'); 
        this.musiqueUnmatch = new Audio('./assets/audio/unmatch.wav');
        this.musiqueVictory = new Audio('./assets/audio/victoire.wav');
        this.musiqueGameOver = new Audio('./assets/audio/gameover.wav');
        this.musiqueFond.volume = 0.4;
        this.musiqueFlip.volume = 0.2;
        this.musiqueMatchvolume = 0.2;
        this.musiqueUnmatch.volume = 0.2;
        this.musiqueVictory.volume = 0.2;
        this.musiqueGameOver.volume = 0.2;
        this.musiqueFond.loop = true;
    }
    // et methodes pour lancer chaque son
    lancerMusiqueFond(){
        this.musiqueFond.play();
    }
    stopMusiqueFond(){ // creation d'un stop avec pause + revenir a 0
        this.musiqueFond.pause();
        this.musiqueFond.currentTime = 0;
    }
    lancerSonFlip(){
        this.musiqueFlip.play();
    }
    lancerSonMatch(){
        this.musiqueMatch.play();
    }
    lancerSonUnmatch(){
        this.musiqueUnmatch.play();
    }
    lancerSonVictory(){
        this.stopMusiqueFond();
        this.musiqueVictory.play();
    }
    lancerSonGameOver(){
        this.stopMusiqueFond();
        this.musiqueGameOver.play();
    }

}
///////////////////////////////////////////////////////////
///////////////// FIN CLASSE GESTION AUDIO ////////////////
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////// CLASSE GAME /////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// le coeur du script !!
class Game{
    constructor(tempsTotal, cartes){ 
        // notre constructeur (1ere methode apellée à la construction de l'objet) demande deux arguments
        // contrairement à notre constructeur controleurAudio,
        // un int temps total pour la partie ,
        // et un tableau de cartes !
        this.controleurAudio = new ControleurAudio();
        this.tableauCartes = cartes;
        this.tempsTotal = tempsTotal;
        this.tempsRestant = tempsTotal;
        this.chrono = document.getElementById('temps-restant');
        this.essais = document.getElementById('essais');   
        // SECTION AJAX INTERNE A L'OBJET 
        this.xmlhttp = new XMLHttpRequest();
        this.xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              document.getElementById("scoreCore").innerHTML = this.responseText;
              document.getElementById("scoreCore2").innerHTML = this.responseText;
              document.getElementById("scoreCore3").innerHTML = this.responseText;
            }
      
          };
          // SECTION PROGRESS BAR
        this.progressBar = document.getElementById('progress-bar-circulaire');
        this.bar = new ProgressBar.Circle(this.progressBar, {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 100,
        color: '#FF4500',
        trailColor: '#FFF',
        trailWidth: 1,
        svgStyle: null
  });
    }

    // petite methode qui nous servira à recalibrer les plages de valeurs pour la progress bar circulaire
    map_range(value, low1, high1, low2, high2) { 
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    //methode pour lancer notre partie
    lancerGame(){
        // alert('game lancé');
        this.CheckerCarte = null; // variable qui va nous permettre
        // de savoir si on a deja cliqué sur une carte 
        // et si on recherche une paire ou si on clique pour la 
        // premiere fois
        this.totalClicks = 0;
        this.tempsRestant = this.tempsTotal; // reset temps à chaque fois qu'on lance game
        this.tableauCartesMatch = []; // on va placer toute nos cartes matché dans ce tableau
        this.busy = true;
        this.bar.animate(1); // on réinitialise la progressbar circulaire
        setTimeout(() =>{ // on fait un timeout de 500 ms pour le smoooooth
            this.controleurAudio.lancerMusiqueFond();
            this.melangerCartes();
            this.chronometre = this.lancerChronometre(); // lancement du chronometre
            this.busy = false;
        }, 500);
        this.cacherCartes();
        this.chrono.innerText = this.tempsRestant; // on reinitialise temps
        this.essais.innerText = this.totalClicks; // on réinitialise clics
    }

    // methode pour cacher toute nos cartes
    cacherCartes(cartes){
        this.tableauCartes.forEach(carte => {
            carte.classList.remove('visible');
            carte.classList.remove('matched');
        });
    }

    // methode pour lancer le chronometre
    lancerChronometre(){
    // on apelle une fonction toute les 1000ms = 1seconde
        return setInterval(() => {
            this.tempsRestant--; // on enleve 1 au temps restant
            // ... et ....
            // on va utiliser une variable et la fonction map_range
            // pour transformer notre ecart de temps
            // qui va de 0 à this.tempsTotal
            // vers un écart qui va de 0 à 100
            // CAR notre bar.animate a besoin d'un float entre 0 et 1
            // et on aura plus qu'a divier cette nouvelle valeur par 100
            // histoire d'avoir une progressBar qui s'adapte au temps qu'on a donne [a notre][plus précisement:au constructeur de l']objet game
            let temps0a100 = this.map_range(this.tempsRestant, 0, this.tempsTotal, 0, 100);
            temps0a100 = Math.round(temps0a100); // on va arrondir à deux décimales.
            this.bar.animate(temps0a100/100); 
            this.chrono.innerText = this.tempsRestant; // on affiche le temps restant dans le span dédié
                if(this.tempsRestant<(0.10*this.tempsTotal)){ // si on est en dessous de 10 % de notre temps total on colore en rouge le texte chrono
                    this.chrono.style.color="#FF0000";
                }
                if(this.tempsRestant===0){ // si temps restant est = a 0 -> game over ! 
                    this.gameOver(); // on apelle la methode gameOver()
                }
        }, 1000);

    }

    // methode game over
    gameOver(){
        clearInterval(this.chronometre); // on clean le chronomere
        this.controleurAudio.lancerSonGameOver(); // on lance le son game over
        document.getElementById('texte-game-over').classList.add('visible'); // on affiche la surcouche game over
    }

    // methode victoire
    victoire(){
        this.controleurAudio.lancerSonVictory(); // on lance le son victoiiiire
        document.getElementById('pseudoJoueur').value =  document.getElementById('playerName').innerHTML;
        document.getElementById('chronoFinal').value = String(this.tempsRestant);
        document.getElementById('clicksFinal').value = String(this.totalClicks);
        let calculScore = (this.tempsRestant*100) - (this.totalClicks*10);
        document.getElementById('scoreFinal').value = String(calculScore);
        document.getElementById('victoireAjoutDbForm').submit();
        clearInterval(this.chronometre); // on clean le chronometre
    }

    //methode pour retourner une carte
    retournerCarte(carte){
      if(this.puisJeRetournerCarte(carte)) {  // si j'ai le droit de le faire....
         this.controleurAudio.lancerSonFlip(); // on lance le son flip
         this.totalClicks++; // on rajoute 1 a totalClicks
         this.essais.innerText = this.totalClicks; // on actualise le span avec le nombre d'essais 
         carte.classList.add('visible'); // on retourne la carte en ajoutant la classe "visible"
            if(this.CheckerCarte) // si on a deja cliqué sur une carte et qu'on cherche la paire
                this.matchOuPas(carte); // alors on check si la carte fraichement clickée est un match ou pas
            else
                this.CheckerCarte = carte; // sinon, on est sur un premier click de recherche de paire, et on ajoute cette carte
                // dans notre propriété "checherCarte" qui va nous permettre de checker si il y a match ou pas au prochain click
      } 
    }

    // methode pour checker si il y a match ou pas ! 
    matchOuPas(carte){
        if(this.recupTypeCarte(carte) === this.recupTypeCarte(this.CheckerCarte)) // si carte = checkercarte alors on match
            this.yesOnMatch(carte, this.CheckerCarte);
        else
            this.pasDeMatch(carte, this.CheckerCarte); // sinon on ajoute cette carte à checker carte (premier clic pour paire)

        this.CheckerCarte=null;
    }

    // methode si on a match entre 2 cartes
    yesOnMatch(carte1, carte2){
        // on ajouter ces cartes au tableau des match ! 
        this.tableauCartesMatch.push(carte1);
        this.tableauCartesMatch.push(carte2);
        carte1.classList.add('match'); // on ajoute class match pour animation css
        carte2.classList.add('match'); // sur les deux cartes matchées
        this.controleurAudio.lancerSonMatch(); // on lance le son match
        // et si la longeur du tableauCarteMatch est égal à la longeur du tableauCartes alors on a un WIN ! 
            if(this.tableauCartesMatch.length === this.tableauCartes.length){
                this.victoire(); // on apelle ma methode victoire()
            }
    }

    //methode si pas de match netre deux cartes
    pasDeMatch(carte1, carte2){
        this.busy = true;
        setTimeout(() => {
            carte1.classList.remove('visible');
            carte2.classList.remove('visible');
            this.busy = false;
        }, 1000); // ATTENTION CE TIMMOUT PERMET
        // DE DEFINIR LE TEMPS QUE RESTE A L'ECRAN UN NON-MATCH AVANT 
        // DE se retourner ! 
    }

    // methode pour renvoyer l'adresse de l'image de la carte selectionné
    // on utilisera les adresses pour verifier le match ou pas (methode matchOuPas() ) ! 
    recupTypeCarte(carte){
        return carte.getElementsByClassName('valeur-carte')[0].src;
    }

    // methode pour mélanger cartes
    melangerCartes(){
        //algorythme fisher & yates 
        // cf : https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        //Pour i allant de n − 1 à 1 faire :
       // j ← entier aléatoire entre 0 et i
       // échanger a[j] et a[i]
        for(let i = this.tableauCartes.length -1; i>0;i--){
            let randomizer = Math.floor(Math.random() * (i+1));
            // Math.random -> float entre 0 et 1
            // non inclusif sur 1 et inclusif sur 0
            // puis on va utiliser la propriété ORDER de  GRID pour mélanger
            this.tableauCartes[randomizer].style.order = i;
            // on swap l'ordre de dispo css
            this.tableauCartes[i].style.order = randomizer;

        }

    }

    // methode qui renvoi true ou false : si on a le droit ou pas de retourner la carte
    puisJeRetournerCarte(carte){ // 3 scenarios ou on ne peut pas retourner carte
        // - si busy est true 
        // - si on click sur une carte qui a deja matché sur une paire
        // - si on click sur la premiere carte qui a deja été clické pour
        // rechercher une paire
       return !this.busy && !this.tableauCartesMatch.includes(carte) && carte !== this.CheckerCarte
        // si busy est false ET si la carte n'est pas dans le tableau des cartes matchés et si la carte 
       // ET si la carte est differente de la carte a checker (si 1er click sur carte et recherche de paire)
       //
       // Donc si les 3 valeurs sont FALSE on va renvoyer TRUE !!

    }

}
///////////////////////////////////////////////////////////
///////////////// FIN CLASSE GAME ////////////////////////
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////// FONCTION DEMARAGE ///////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

function letsGo(){
    // on peut décommenter le petit alert en dessous pour constater que cette fonction se lance bien au chargement de la page
    //alert('page chargée oh yeah !');
    let nomExisteDeja=false;
   
    // SECTION AJAX QUI VA NOUS PERMETTRE DE LANCER L'AFFICHAGE DU SCORE DE MANIERE ASYNCHRONE (MERCI AJAX !)
    // POUR LE LANCEMENT DU JEU AVANT QU'UN ATTRIBUT DE L'OBJET NE S'EN OCCUPE EN JEU !
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("scoreCore").innerHTML = this.responseText;
            document.getElementById("scoreCore2").innerHTML = this.responseText;
            document.getElementById("scoreCore3").innerHTML = this.responseText;
          }
        };
    xmlhttp.open("GET","score.php",true); // cf  ./score.php
    xmlhttp.send();
    //fin de ma section ajax
    // On va charger les surcouches(start, restart, victory, game over) dans trois variables differentes pour dissocier les eventListener
    let surcouche1 = document.getElementById('texte-lancement');
    let surcouche2 = document.getElementById('texte-game-over');
    let surcouche3 = document.getElementById('texte-victoire');
    // on a aussi une variable pour notre bouton de démarage
    let btnStart = document.getElementById('btnStart');
    // une pour l'input pseudo
    let inputPseudo = document.getElementById('inputPseudo');
    // puis on stoque toute les cartes dans une variable "cartes" (pluriel !!)
    let cartes = document.getElementsByClassName('carte');
    // et on converti en tableau : 
    cartes = Array.from(cartes);
    ///////////////////////////////////////////////////
    // CREATION DE L'OBJET GAME                      //
    let game = new Game(60, cartes);                 // 
    ///////////////////////////////////////////////////
    //gestion bouton start
    // si on click
    btnStart.addEventListener('click', function startClicked(){
        // on va stoquer + afficher le pseudo du joueur
        let playerName = document.getElementById('inputPseudo').value;
        let playerSpan = document.getElementById('playerName');
        // on stoque le noms des joueurs de notre top5
        let tableauJoueurs = document.getElementsByClassName('pseudo-td');
        //on prepare un regex pour la verification du pseudo
        let regex = /^[A-Za-z0-9 ]+$/;
        if(regex.test(playerName)){ // si on a pas de caracteres spéciaux dans le pseudo
            for(i = 0; i< (tableauJoueurs.length/3);i++){ // et une petite boucle pour verifier que le pseudo n'existe pas deja ! 
                console.log(tableauJoueurs[i].innerHTML + ' et ' + playerName);
                if(tableauJoueurs[i].innerHTML.trim()==playerName.trim()){
                   nomExisteDeja = true; // si il existe déja on met ma variable a true
                }
            }
                if(!nomExisteDeja){ // si le pseudo n'existe pas on lance la game !
                    surcouche1.classList.remove('visible'); 
                    playerSpan.innerText=playerName;
                    game.lancerGame(); // ET ON LANCE LA METHODE lancerGame() de l'objet game
                }else{
                   // console.log('le nom existe deja')
                    document.getElementById('inputPseudo').style.borderColor="red";
                    document.getElementById('inputPseudo').style.borderWidth = "thick";  
                    document.getElementById('inputPseudo').blur(); //on fait perdre le focus à la zone texte  
                }


        }else{
            // console.log('le nom comporte des caracteres speciaux')
            document.getElementById('inputPseudo').style.borderColor="red";
            document.getElementById('inputPseudo').style.borderWidth = "thick"; 
            document.getElementById('inputPseudo').blur();
        }
    });
    
    // permet de remettre notre nomExisteDeja sur false si on re click sur l'input pseudo qui aura perdu son focus
    let playerNameFocus = document.getElementById('inputPseudo');
    playerNameFocus.addEventListener('focus', () => {
        //console.log('focus');
        nomExisteDeja = false;
    });

    
    // gestion touche "entrée" dans input pseudo
    inputPseudo.addEventListener("keyup", (event)=>{
        if (event.keyCode === 13) { // code 13 = entrée !!
            btnStart.click(); // si on appuie sur entrée alors on click sur le bouton
        };
    });
    
    // SURCOUCHE GAME OVER
    surcouche2.addEventListener('click', ()=>{ // si on click on relance la game et on fait disparaitre la surcouche
        surcouche2.classList.remove('visible'); 
        game.lancerGame();
    });

    // SURCOUCHE VICTOIRE
    surcouche3.addEventListener('click', ()=>{ // idem pour la victoire
        surcouche3.classList.remove('visible'); 
        game.lancerGame();
    });

    // on va maintenant parcourir notre tableau de cartes
    // pour ajouter un eventListener sur chaque carte qui apellera la methode .retournerCarte() de notre objet game;
    cartes.forEach(carte => {
        carte.addEventListener('click', () => {
            game.retournerCarte(carte); // ON LANCE LA METHODE retournerCarte() DE L'OBJ GAME !!!!!!!!!!!
        });
    }); // fin du forEach cartes  
} // fin de la fonction letsGo
///////////////////////////////////////////////////////////
///////////////// FIN FONCTION DEMARAGE ///////////////////
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////// GESTION CHARGEMENT PAGE /////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

if(document.readyState === 'loading'){ // si la page est en chargement
    document.addEventListener('DOMContentLoaded', letsGo()); // alors on ajoute un eventListener qui va attendre que le DOM soit chargé
}else{
    letsGo(); // et si on est chargé, alors zou ! (ou let's go !!)
}
///////////////////////////////////////////////////////////
///////////////// FIN GESTION CHARGEMENT PAGE//////////////
///////////////////////////////////////////////////////////