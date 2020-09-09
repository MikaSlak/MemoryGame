<?php
// on a volontairement séparé la scoreboard dans un autre fichier php pour
// nous permettre un affichage asynchrone, ce qui nous donnera des temps de chargement
// moins longs !

// en-tete du tableau
require 'gamebackClass.php';
$db = new GameBack('memorygamedb'); // c'est parti pour notre objet database
// on affiche l'en-tete de notre tableau de score
echo"  
    <tr>
    <th colspan=\"4\">
    TOP 5 
    </th>
    </tr>
    <tr>
    <th>
    Pseudo
    </th>
    <th>
    Chrono
    </th>
    <th>
    Clicks
    </th>
    <th >
    Score
    </th>
    </tr>
";
// nous allons maintenant faire un foreach pour parcourir les entrées de notre table
// en triant par ordre croissant pour les scores, et dans une limite de 5 resultats !
foreach($db->query('SELECT * FROM memory_game_main_table ORDER BY score DESC LIMIT 5') as $joueur): 
// attention un peu tricky ici on va fermer la balise php donc on retourne sur du html ! 
// ce html sera affiché en boucle vu qu'on est dans un foreach !!
// Et dans ce html on va simplement afficher les resultats de notre requette sql affichée ci-dessus (cf bas de page pour plus de details)
?>


<tr>
<td class="pseudo-td"><?= $joueur->pseudo;//on affiche nos donnes dans des td ! ?></td>
<td><?= $joueur->chrono;?></td>
<td><?= $joueur->clicks;?></td>
<td><?= $joueur->score;?></td>
</tr>


<?php endforeach;//et on termine le foreeach ?>

<?php 
/*
Une base de donnée mysql est segmentée en tables et ces tables sont segmentés en colonnes
notre base de donnée s'apelle ici "memorygamedb"
Nous pouvons créer notre DB depuis phpMyAdmin > création d'une base de donnée>lui donner le nom "memorygamedb"> puis click sur créer
Pour créer notre table principale nous pouvons (toujours depuis phpmyadmin) click sur la base de donnée fraichement créée >  onglet SQL  > et valider la commande suivante : 
CREATE TABLE `memory_game_main_table` (
  `MyIndex` int(11) NOT NULL,
  `pseudo` tinytext NOT NULL COMMENT 'pseudo du joueur',
  `chrono` smallint(6) NOT NULL COMMENT 'temps restant a la victoire',
  `clicks` smallint(6) NOT NULL COMMENT 'nombre de clicks durant la partie',
  `score` int(11) NOT NULL COMMENT 'score final'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
// c'est ici que nous "designons" notre table en précisant le type pour chaque colonne
// cf https://www.w3schools.com/sql/sql_datatypes.asp

la requette executée en ligne 33 de ce script est la suivante : 
SELECT * FROM memory_game_main_table ORDER BY score DESC LIMIT 5
Nous allons donc selectionner (SELECT) toute les info (*) de la table memory_game_main_table (unique table de notre db !)
et trier les resultats par score décroissant (ORDER BY score DESC) 
dans une limite de 5 infos (LIMIT 5) pour n'afficher que le top 5 !

pour l'autre requette effectuée coté ./index.php
on a une requette : 
SELECT * FROM memory_game_main_table
encore mois restrictive que celle précedement détaillée

et
INSERT INTO memory_game_main_table(MyIndex, pseudo, chrono, clicks, score) VALUES(nombre, "texte", nombre, nombre)
Nous permet d'insérer une nouvelle entrée dans la table memory_game_main_table avec les valeurs précisés dans VALUES()
*/ 
?>