<?php
require 'gamebackClass.php'; // on require le fichier dans lequel se situe la definition de la classe
$gameback = new GameBack('memorygamedb'); // et on construit notre objet pour le back, comme précisé dans le pdf ; ) 
?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <!--Titre de notre page-->
        <title>Memory Game</title>
        <meta charset="UTF-8">
        <!--petite favicon cerise : ) -->
        <link rel="icon" type="image/png" href="./assets/imgs/favicon.png">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="./css/style.css"/>
    </head>
    <body>
        <!--
        ON RENTRE DANS LE BODY DE LA PAGE
        PRINCIPE DE FONCTIONNEMENT DU PROJET :
            - Les evenements principaux du jeu (Commencer le jeu/ Game Over / Victoire)
            vont etre disposés dans des div de classe "surcouche-info" (et seront appelés "surcouches").
            - Si ces div possedent la classe "visible" ils seront visible à l'éran sinon ils seront masqués (cf ./scss/style.scss)
            - La surcouche de lancement du jeu (id "texte-lancement") possede par defaut la classe "visible"
            - L'ajout ou la supression de la classe "visible" se fera en JavaScript (cf ./js/script.js)
        
            - Toute nos cartes seront dans un div conteneneur "conteneur-game"
            - Chaque carte est un div de classe "carte"
            - si une div "carte" possede la classe "visible" la carte est retournée, sinon la carte est de dos !
            - si un div carte possede la classe "match" (en plus de visible) on aura une petite animation sur l'image
            - Chaque div carte posséde DEUX div :
                - un div de classe "carte-cache" (qui lui meme possede des div de classe "ornement ornement-haut" 
                et "ornement ornement-haut' pour un petit effet de style sur le dos de la carte)
                - un div de classe "carte-revele" qui possede une image de classe "valeur-carte" (= IMAGE DU FRUIT)
                - ces deux div sus-mentioné possedent une classe commune "carte-style"
                
        COTE BACK :
            - Les surcouches lancer le jeu et victoire ont une scoreBoard (qui affiche de manière ordonné le contenu de la DB)
            - La scoreBoard apelle les infos de la db depuis le fichier ./score.php 
            et ce fichier scoreBoard sera géré de manière asynchrone (merci AJAX (cf ./script.js)).
            La connexion à la db se fera par l'objet gameback qui nous permettra de gérer les principales fonctionnalités du back
            - A chaque victoire on ajoute une entrée à la DB avec les info de jeux de la victoire (pseudo, chrono, nombre de clicks, score)
            grace à un forumlaire invisible disposé dans la surcouche victoire (div id "texte-victoire" et classe "surcouche-info")
            - Etant donné que les donnés vont paser par post, il va y avoir rechargement de la page
            du coup pour les surouches de lancement de jeu et victoire il faut envisager deux possibilités qui seront gérés en php :
                - si on est sur le chargement de la page avec victoire (des donnés POST sont en transit) alors surcouche victoire sera affiché
                - et si on est sur un premier chargement de page (lancement de jeu, donc aucune données POST en transit) alors
                la surcouche de lancement de jeu est visible !
        -->
        <!--titre jeux-->
        <h1 class="titre-game">Memory Game By Zbrehbreh</h1>
        <!--Affichage du player EN JEU (cf ./gamebackClass.php et ./js/script.js )-->
        <h1 class="titre-game">Player :   
            <?php              
                $gameback->afficherJoueur();
            ?>   
        </h1>
        <!--SURCOUCHE (ou overlay pour nos amis anglophones) DE LANCEMENT DU JEU-->
        <!-- au lieu de faire un simple div de classe surcouche info-->
        <!--il nous faut considerer deux possibilités qu'on va gérer en PHP -->
        <?php 
            $gameback->divSurcoucheLancement();
        ?>
        <!--ATTENTION au niveau de l'indentation, cette balise php agit comme un DIV OUVRANT-->
        <!--la classe visible va nous permettre d'afficher/masquer l'overlay de la div ci-dessous-->
            <div class="surcouche-texte-principal">
                Entrez votre pseudo
             </div>
            <!--zone texte pour entrer notre pseudo sur le lancement du jeux-->
        <input type="text" id="inputPseudo">
        <!--Bouton pour lancement du jeux-->
        <input type="submit" class="button" id="btnStart" value="GO !"><br />
        <!--ScoreBoard-->
            <div class="scoreBoard">
                    <table class="tableScoreBoard">
                        <!--le tbody ci-dessous sera rempli grace à la section AJAX de notre fichier ./script.js-->
                        <!-- ajax plutot que de mettre directement du php ici pour eviter que le chargement de la page ne soit trop lourd!-->
                        <tbody id="scoreCore">
                        </tbody>
                    </table>
            </div>
        </div>

        <!--SURCOUCHE GAMEOVER-->
        <div id="texte-game-over" class="surcouche-info"><!--la classe visible va nous permettre d'afficher/masquer l'overlay-->
            <div class="surcouche-texte-principal">
            GAME OVER
            </div>
            <span  class="surcouche-petit-texte">Clic pour recommencer</span>
            <div class="scoreBoard">
                    <table class="tableScoreBoard">
                        <!--le tbody ci-dessous sera rempli grace à la section AJAX de notre fichier ./script.js-->
                        <!-- ajax plutot que de mettre directement du php ici pour eviter que le chargement de la page ne soit trop lourd!-->
                        <tbody id="scoreCore2">
                        </tbody>
                    </table>
            </div>
        </div>

         <!--SURCOUCHE VICTOIRE-->
         <!-- meme principe de fonctionement que pour la premiere surcouche, on verifie si il y a des données POST en transit
         en d'autre thermes si il y a eu une victoire ou pas ! -->

        <?php 
            $gameback->divSurcoucheVictoire();
        ?>
        <!--ATTENTION au niveau de l'indentation, cette balise php agit comme un DIV OUVRANT-->
            <!--la classe visible va nous permettre d'afficher/masquer l'overlay de la classe ci-dessous-->
            <div class="surcouche-texte-principal">
            <?php
                /////////////////////////////////////////////////////////
                // SECTION RECUREATION DATAS POST                      //
                /////////////////////////////////////////////////////////
                if(isset($_POST['pseudoJoueur'])){
                //echo $_POST['pseudoJoueur'];
                $pseudo = $_POST['pseudoJoueur'];
                 }else{
                $pseudo = "";
                 }

                if(isset($_POST['chronoFinal'])){
               // echo $_POST['chronoFinal'];
                $chrono = $_POST['chronoFinal'];
                 }else{
                $chrono= "";
                }

                if(isset($_POST['clicksFinal'])){
               // echo $_POST['clicksFinal'];
                $clicks = $_POST['clicksFinal'];
                 }else{
                    $clicks = "";
                }

                if(isset($_POST['scoreFinal'])){
               // echo $_POST['scoreFinal'];
                $score = $_POST['scoreFinal'];
                 }else{
                    $score = "";
                }

                ///////////////////////////////////////////////////////////////
                // SECTION RECUPERER LE DERNIER ID DE LA DB                  //
                // POUR DETERMINER LE SUIVANT                                //  
                // ET EVITER AJOUTER A LA DB SI REACTUALIATION DE LA PAGE    //
                ///////////////////////////////////////////////////////////////
                
                foreach($gameback->query('SELECT * FROM memory_game_main_table') as $joueur): 
                    // pour plus d'informations sur les db, cf ./score.php
                    $dernierMyIndex = $joueur->MyIndex;
                    $dernierPseudo = $joueur->pseudo;
                    $dernierChrono = $joueur->chrono;
                    $dernierClicks = $joueur->clicks;
                endforeach;
                 // attention en cas de premiere utilisation du jeu on va avoir un $dernierMyIndex undefined
                //du coup pour parrer
                if(!isset($dernierMyIndex)){$dernierMyIndex=0;}
                if(!isset($dernierPseudo)){$dernierPseudo="";}
                if(!isset($dernierChrono)){$dernierChrono="";}
                if(!isset($dernierClicks)){$dernierClicks="";}
                $dernierMyIndex = $dernierMyIndex +1;// on indente manuellement (on aurait pu aussi utiliser auto-increment coté sql)
                /////////////////////////////////////////////////////////
                // SECTION AJOUTER A LA DB LA NOUVELLE ENTREE VICTOIRE //
                /////////////////////////////////////////////////////////

                if ($dernierPseudo==$pseudo && $dernierChrono == $chrono && $dernierClicks==$clicks){
                    // on est sur une réactualisation de page victoire on n'ajoute rien a la db 
                    // car les deux dernieres entrées sont identique !
                    echo "Let's Go !";
                }else{
                    //et sinon grace à la methode insertVictory de notre objet gameback on ajoute la victoire a la db !
                    if($pseudo!='' && $chrono!='' && $clicks!=''){
                    echo "VICTOIRE !";
                    $query = 'INSERT INTO memory_game_main_table(MyIndex, pseudo, chrono, clicks, score) VALUES(';
                    $query = $query . $dernierMyIndex;
                    $query = $query . ", ";
                    $query = $query . '\''; // on est sur du string donc entre crochets
                    $query = $query . $pseudo;
                    $query = $query . '\'';
                    $query = $query . ", ";
                    $query = $query . $chrono;
                    $query = $query . ", ";
                    $query = $query . $clicks;
                    $query = $query . ", ";
                    $query = $query . $score;
                    $query = $query . ")";
                    //echo $query; // decommenter pour jeter un coup d'oeil à la query 
                    $victoire = $gameback->insertVictory($query);
                }else{
                    echo "Let's Go !";  
                }
            }   
            ?>
            </div>
            <span  class="surcouche-petit-texte">Clic pour recommencer</span>


            <div class="scoreBoard">
                    <table class="tableScoreBoard">
                        <!--C'est dans le tbody ci dessous que le score va venir se déposer (cf ./script.js section AJAX-->
                        <tbody id="scoreCore3">
                            
                        </tbody>
                    </table>
            </div>



            <div class="conteneur-form-victoire">
            <form action="index.php" method="post" id="victoireAjoutDbForm">
                <input type="text" name="pseudoJoueur" id="pseudoJoueur" />
                <input type="text" name="chronoFinal" id="chronoFinal"/>
                <input type="text" name="clicksFinal" id="clicksFinal" />
                <input type="text" name="scoreFinal" id="scoreFinal"/>
            </form>
            </div>





            </div>
           
        <!-- div non visible qui enregistre le nombre de clicks pendant la partie
        pour afficher cf ./sass/style.scss et commenter la ligne "display: none;" dans la section .conteneur-info-game-essais
        -->
        <div class="conteneur-info-game-essais">
            <span id="essais">0</span>   
        </div>

        <!--conteneur general (info jeux + jeux)-->
        <div class="conteneur-game">
            <!--On va placer nos 16 cartes dans le conteneur général : -->
            <!--la classe visible (sur la div "carte" va nous permettre d'afficher/masquer la carte-->
            <!--et la classe match va nous permettre de lancer la petite animation de l'image fruit-->
            <div class="carte">    
                <!--div carte cachée qui possède les div ornements-->         
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                    <img class="ornement ornement-bas" 
                    src="./assets/imgs/ornement.png">    
                </div>
                <!--div carte révélée qui possède l'image du fruit de classe "valeur carte"-->  
                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/A.png">   
                </div>
            </div>
            
            <!--et REBELOTTE sur les 15 cartes restantes en prenant soin de changer le src de chaque image pour affichier 8x2 paires-->
            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                     <img class="ornement ornement-bas" 
                     src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/A.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/B.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/B.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/C.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/C.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/D.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/D.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/E.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/E.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/F.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/F.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/G.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/G.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/H.png">   
                </div>
            </div>

            <div class="carte">
                <div class="carte-cache carte-style">
                    <img class="ornement ornement-haut" 
                    src="./assets/imgs/ornement.png">
                 <img class="ornement ornement-bas" 
                 src="./assets/imgs/ornement.png">    
                </div>

                <div class="carte-revele carte-style">   
                    <img class="valeur-carte" 
                    src="./assets/imgs/H.png">   
                </div>
            </div>


          

        </div>
        <div class="info-game-chrono">
            <span id="temps-restant"></span>  
            <div id="progress-bar-circulaire">
            </div> 
        </div>
        <!--On ajoute ProgressBar
        cf : https://kimmobrunfeldt.github.io/progressbar.js/
        (EN)
        -->
        <script src="./js/progressbar.min.js"></script>
        <!--On ajoute notre script principal (script.js) de maniere asynchrone (lancement en meme temps que la page-->
        <script src="./js/script.js" async></script> 
        <!--meta viewport
        cf : https://www.alsacreations.com/article/lire/1490-Comprendre-le-Viewport-dans-le-Web-mobile.html
        tuto FR
        -->

    </body>
</html>
    
    