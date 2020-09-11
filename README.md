# Memory game (HTML, SASS, JAVASCRIPT, PHP, MySQL)

##Fonctionnement général :

+ Le jeu tourne en HTML, CSS (SASS), JAVASCRIPT, PHP, MYSQL

+ Nous avons 6 commits : 
	- **Premiere etape** : HTML et CSS terminés
	- **Deuxieme etape** : On passe en sass
	- **Troisieme etape** : javascript, moteur jeu fonctionnel
	- **Quatrieme etape** : FRONT terminé
	- **Cinquieme etape** : on attaque le back et les modifications du front
	- **CODE FINAL**

+ Il est possible de modifier tout le theme du jeu en modifiant les premieres lignes du fichier scss (**./scss/style.scss**)

```
$font-game:Better, Arial, Helvetica, sans-serif;
$general-color1:orangered; 
$general-color2:gold; 
$general-color3:white;
$overlay-bkgnd: rgba(0,0,0,.9); 
```

+ Coté javascript, nous avons deux classes : 
	- **ControleurAudio()**
	- **Game(temp_de_partie, tableau_de_carte)**
La classe game va nous permettre de gérer tous les événements du jeu (retourner carte, victoire, game over, mélanger les cartes, ...)
La classe ControleurAudio va nous aider à lancer les sons du jeu plus facilement.

+ Coté PHP nous avons une classe GameBack qui va nous permettre la lecture des infos de la base de donnée, 
l'écriture de nouvelles entrées (en cas de victoire) et une grande partie de la gestion de l'affichage des surcouches (victoire, gameover, lancer partie).
La classe **GameBack** est contenue dans le fichier **gamebackClass.php**
Le fichier **score.php** vas nous permettre un affichage asynchrone de la scoreBoard pour éviter les temps de chargement trop longs (**cf score.php et ./js/script.js**)
Le fichier **index.php** utilisera notre classe GameBack

+ Le code est largement commenté pour une meilleur compréhension !



##Deploiement : 


Depuis l'interface phpMyAdmin de notre serveur, il nous faut créer une nouvelle base de donnée (**nom : "memorygamedb"**)
Puis aller dans la section SQL et entrer cette commande pour structurer notre DB(=data base = base de donnée) : 


```
CREATE TABLE `memory_game_main_table` (
  `MyIndex` int(11) NOT NULL,
  `pseudo` tinytext NOT NULL COMMENT 'pseudo du joueur',
  `chrono` smallint(6) NOT NULL COMMENT 'temps restant a la victoire',
  `clicks` smallint(6) NOT NULL COMMENT 'nombre de clicks durant la partie',
  `score` int(11) NOT NULL COMMENT 'score final'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

-- fin du code --

(**cf ./score.php pour plus de détails sur les db**) 

Pour terminer, rdv dans notre fichier **score.php ligne 8** :
```
$db = new GameBack('memorygamedb'); 
```
et dans notre fichier **index.php ligne 3** :
```
$gameback = new GameBack('memorygamedb');
```

Et comme indiqué dans notre constructeur de la classe gameback (**cf ./gamebackClass.php ligne 14**) :
```
($db_name, $db_user = 'root', $db_pass='', $db_host = 'localhost') 
```
nous allons pouvoir préciser pour ces deux lignes les informations de connexion à votre db :
```
$db = new GameBack('db_name', 'db_user', 'db_pass','db_host');
```
Ces informations sont fournies par l'hébergeur lors de la création d'une nouvelle base de donnée.

Nous avons également deux arguments par defaut (db_user et db_host) pour facilement déployer en local.
Toujours en local, si notre password de db est 'root' alors il nous faut éditer le constructeur de l'objet (**cf ./gamebackClass.php ligne 14**) :
```
($db_name, $db_user = 'root', $db_pass='root', $db_host = 'localhost') 
```
remplacer ``` $db_pass=''``` par  ```$db_pass='root'```




//////////////
##Fragilités :						     						                                //
//////////////
+ Sécurisation des variables pseudoName et pseudoSpan coté javascript (**./script.js**) :
Il y a un check de caractères spéciaux sur le pseudo quand on lance la partie + 
un check pour verifier qu'on ne prend pas le nom d'un joueur de la scoreBoard.
Cependant ce check devrait aussi s'éffectuer lors d'une victoire !

+ Sécurisation des variable $_POST :
Très peu de sécurité coté back, il nous faudrait faire des check sur toute les variables 
lors de la victoire pour éviter les injections SQL.

- Passer les variables en arguments aux methodes de l'objet back suivantes :afficherJoueur(), divSurcoucheLancement(), divSurcoucheVictoire() (**probleme de scoping**)

***- FAIRE UN TRY pour les methodes de connexion/interaction avec la base de donnée !!***

- spliter l'objet back en deux objets, un objet db et un objet game ?



///////////////
##évolutions ?
///////////////


Implementer l'objet gameBack avec une methode plus pointue pour la gestion de la victoire ?


Faire tourner la progressBar autour du plateau de cartes ?

//////////
Credits :
/////////
//code : 
progressBar.js -> https://kimmobrunfeldt.github.io/progressbar.js/
codepen.io
youtube
// sons :
musique de fond : "snake jazz" - Rick and morty













