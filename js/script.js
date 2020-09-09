// let's do this façon objet !!

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////// CLASSE GESTION AUDIO ////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
class ControleurAudio {
    constructor(){
        this.musiqueFond = new Audio('../assets/audio/gamesound.mp3');
        this.musiqueFlip = new Audio('../assets/audio/win.wav'); // lien musique flip a changer
        this.musiqueMatch = new Audio('../assets/audio/win.wav'); 
        this.musiqueUnmatch = new Audio('../assets/audio/loose.wav');
        this.musiqueVictory = new Audio('../assets/audio/win.wav');
        this.musiqueGameOver = new Audio('../assets/audio/loose.wav');
        this.musiqueFond.volume = 0.5;
        this.musiqueFlip.volume = 0.2;
        this.musiqueMatchvolume = 0.2;
        this.musiqueUnmatch.volume = 0.2;
        this.musiqueVictory.volume = 0.2;
        this.musiqueGameOver.volume = 0.2;
        this.musiqueFond.loop = true;
    }
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
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////// CLASSE GAME /////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
class Game{
    constructor(tempsTotal, cartes){
        //alert('contructeur objet');
        this.controleurAudio = new ControleurAudio();
        this.tableauCartes = cartes;
        this.tempsTotal = tempsTotal;
        this.tempsRestant = tempsTotal;
        this.chrono = document.getElementById('temps-restant');
        this.essais = document.getElementById('essais');
        
    }

    //methode pour lancer notre partie
    lancerGame(){
        
       // alert('game lancé');
        this.CheckerCarte = null; // variable qui va nous permettre
        // de savoir si on a deja cliqué sur une carte 
        // et si on recherche une paire ou si on clique pour la 
        // premiere fois
        this.totalClicks = 0;
        this.tempsRestant = this.tempsTotal; // reset temps a chauqe fois qu'on lance game
        this.tableauCartesMatch = []; // on va placer toute nos cartes matché dans ce tableau
        this.busy = true;

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


    cacherCartes(cartes){
        this.tableauCartes.forEach(carte => {
            carte.classList.remove('visible');
            carte.classList.remove('matched');
        })
    }

    // methode pour lancer le chronometre
lancerChronometre(){
    // on apelle une fonction toute les 1000ms = 1seconde
    return setInterval(() => {
        this.tempsRestant--; // on enleve 1 au temps restant
        this.chrono.innerText = this.tempsRestant; // on affiche dans le span
        if(this.tempsRestant===0){ // si temps restant est = a 0 -> game over ! 
            this.gameOver();
        }
    }, 1000);

}

    // methode game over
    gameOver(){
        clearInterval(this.chronometre);
        this.controleurAudio.lancerSonGameOver();
        document.getElementById('texte-game-over').classList.add('visible');
    }

    // methode victoire
    victoire(){
        clearInterval(this.chronometre)
        this.controleurAudio.lancerSonVictory();
        document.getElementById('texte-victoire').classList.add('visible');

    }



    
//methode pour retourner une carte
    retournerCarte(carte){
      if(this.puisJeRetournerCarte(carte)) {  // si j'ai le droit de le faire....
         this.controleurAudio.lancerSonFlip(); // on lance le son flip
         this.totalClicks++; // on rajoute 1 a totalClicks
         this.essais.innerText = this.totalClicks; // on actualise le span avec le nombre d'essais 
         carte.classList.add('visible');

         if(this.CheckerCarte) // si checkerCarte est != null
            this.matchOuPas(carte);
        else
            this.CheckerCarte = carte;

      } 
    }


    // methode pour checker si il y a match ou pas ! 
matchOuPas(carte){
    if(this.recupTypeCarte(carte) === this.recupTypeCarte(this.CheckerCarte)) // si carte = checkercarte alors on match
        this.yesOnMatch(carte, this.CheckerCarte);
    else
        this.pasDeMatch(carte, this.CheckerCarte); // sinon on ajoute cette carte a checker carte (premier clic pour paire)

    this.CheckerCarte=null;
}

// methode si on a match en tre 2 cartes
yesOnMatch(carte1, carte2){
// on ajouter ces cartes au tableau des match ! 
this.tableauCartesMatch.push(carte1);
this.tableauCartesMatch.push(carte2);
carte1.classList.add('match'); // on ajoute class match pour animation css
carte2.classList.add('match'); // sur les deux cartes matché
this.controleurAudio.lancerSonMatch();
if(this.tableauCartesMatch.length === this.tableauCartes.length){
    this.victoire();
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
// on utilisera les adresses pour verifier le match ou pas ! 
recupTypeCarte(carte){
    return carte.getElementsByClassName('valeur-carte')[0].src;

}


// methode pour mélanger cartes
    melangerCartes(){
        //fisher & yates algorythme
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
      
      //return true; // decommenter ligne ci - dessous !!!!
       return !this.busy && !this.tableauCartesMatch.includes(carte) && carte !== this.CheckerCarte
      
      
        // si busy est false ET si la carte n'est pas dans le tableau des cartes matchés et si la carte 
       // ET si la carte est differente de la carte a checker (si 1er click sur carte et recherche de paire)
       //
       // Donc si les 3 valeurs sont FALSE on va renvoyer TRUE !!

    }

}
///////////////////////////////////////////////////////////
///////////////// FIN CLASSE GAME ////////////////////////

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////// FONCTION DEMARAGE ///////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

function letsGo(){
    //alert('page chargée oh yeah !');
    // on va charger les surcouches(start, restart, victory, game over) dans une variable
    let surcouches = document.getElementsByClassName('surcouche-info');
    // puis on convertis en tableau : 
    surcouches = Array.from(surcouches);
    // la meme pour les cartes
    let cartes = document.getElementsByClassName('carte');
    cartes = Array.from(cartes);
    // on créé notre objet game
    let game = new Game(60, cartes);
    
    // on va maintenant faire une boucle
    // sur tout les elements de surcouches
    // pour ajouter un eventListener click
    surcouches.forEach(surcouche => {
        surcouche.addEventListener('click', () => {
            // si on click on enleve la classe visible de la surcouche
            surcouche.classList.remove('visible');
            //alert('on va lancer le game');
            game.lancerGame(); // ON LANCE LA METHODE LANCERGAME DE L'OBJET GAME !!!!!!!!!!!!!!!!!!!!!!
           
            // test controleurAudio lecture son fond au click overlay
           // let controleurAudio = new ControleurAudio;
           //controleurAudio.lancerMusiqueFond();
        });
    }); // fin du forEach surcouches

    // on va maintenant faire une boucle
    // sur toute les cartes
    // pour ajouter un eventListener click -> game.retournerCarte();
    cartes.forEach(carte => {
        carte.addEventListener('click', () => {
            game.retournerCarte(carte); // ON LANCE LA METHODE RETOURNER CARTE DE L'OBJ GAME !!!!!!!!!!!
            //.classList.remove('visible');
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
if(document.readyState === 'loading'){ // si la pge est en chargement
    document.addEventListener('DOMContentLoaded', letsGo()); // alors on ajoute un eventListener qui va attendre que le DOM soit chargé
}else{
    letsGo(); // et si on est chargé, alors zou ! (ou let's go !!)
}
///////////////////////////////////////////////////////////
///////////////// FIN GESTION CHARGEMENT PAGE//////////////