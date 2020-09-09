<?php

class GameBack{
    // on déclare tout nos attributs privés 
    // qui vont nous servir exclusivement pour la connexion a la db !
    // d'ailleurs, pour plus d'infos sur les db, cf bas de page ./score.php !!
    private $db_name; 
    private $db_user;
    private $db_pass;
    private $db_host;
    private $pdo;

    // constructeur avec certains (user et host) arguments par defaut pour travailler facilement en local
    public function __construct($db_name, $db_user = 'root', $db_pass='', $db_host = 'localhost'){ 
        $this->db_name = $db_name;
        $this->db_user = $db_user;
        $this->db_pass = $db_pass;
        $this->db_host = $db_host;
    }

    // methode privée pdo
    // cf : https://www.php.net/manual/fr/ref.pdo-mysql.php
    private function getPDO(){
        if($this->pdo === null){ // evite d'initialiser une connexion a la db a chaque fois
            $pdo = new PDO('mysql:host=localhost;dbname=memorygamedb;charset=latin1', 'root', '');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo = $pdo;
        }
        return $this->pdo;
    }

    // methode query qui va nous servir pour nous sortir les infos de la db pour la scoreBoard
    //cf : https://www.php.net/manual/fr/pdostatement.fetch.php
    public function query($statement){ // on prépare une methode qui vas nous permettre de sortir(renvoyer) des donnés 
      $req = $this->getPDO()->query($statement);
      $datas = $req->fetchAll(PDO::FETCH_OBJ);
      
      return $datas;
    }

    // methode insertVictory qui va nous servir pour inserer les donnes de victoire dans la db
    // pas besoin du FETCH_OBJ
    public function insertVictory($statement){  // et une autre pour executer une requette simple en cas de victoire
        $req = $this->getPDO()->query($statement);
        return $req;
      }

    // methode qui nous permet d'afficher le nom du joueur en jeu
    public function afficherJoueur(){
        if(isset($_POST['pseudoJoueur'])) {
            echo"<span id=\"playerName\">";
            echo $_POST['pseudoJoueur'];
            echo"</span>";
        }else{
        echo"<span id=\"playerName\">";
        echo"</span>";   
        }
    }

    // methode qui va agir comme le div principal de la surcouche de lancement (avec ou sans classe "visible", cf index.php)
    public function divSurcoucheLancement(){
        if(isset($_POST['pseudoJoueur']) && isset($_POST['chronoFinal']) && isset($_POST['clicksFinal']) && isset($_POST['scoreFinal'])) {
            // si on a une victoire on affiche pas 
            // la fenetre start game au rechargement de la page
            // donc on affiche un div de classe surcouche-info (sans visible!)
            echo"<div id=\"texte-lancement\" class=\"surcouche-info\">";
        }else{
            // et si on est sur une premiere game on affiche la page de lancement
            // (on ne fait qu'ajouter ou supprimer la classe visible du div surcouche-info ! )
            echo"<div id=\"texte-lancement\" class=\"surcouche-info visible\">"; 
            
        }
    }

    // methode qui va agir comme le div principal de la surcouche de victoire (avec ou sans classe "visible", cf index.php)
    public function divSurcoucheVictoire(){
        if(isset($_POST['pseudoJoueur']) && isset($_POST['chronoFinal']) && isset($_POST['clicksFinal']) && isset($_POST['scoreFinal'])) {
            // si on a une victoire on affiche  
            // la fenetre victoire (on ajoute la clase visible)
            echo"<div id=\"texte-victoire\" class=\"surcouche-info visible\">";
        }else{
            // sinon on ne met pas la classe "visible" 
            // (on ne fait qu'ajouter ou supprimer la classe visible du div surcouche ! )
            echo"<div id=\"texte-victoire\" class=\"surcouche-info\">";
        }
    }

} // fin de déclaration de classe

?>