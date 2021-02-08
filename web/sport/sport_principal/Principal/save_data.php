<?php
    //on active la session
    session_start();

    //on affecte stock le pseudo dans une variable
    $pseudo = $_SESSION["pseudo"];
    
    //on stocke le chemin d'accès au fichier personnel
    $json_file_rec='Record/'.$pseudo.'.json';

    //on affecte à $record le contenu de l'enregistrement envoyé en POST
    $record = json_decode($_POST["json"]);

    //on affecte à $mvt_name le nom qui a été donné au geste
    $mvt_name = $_POST["mvt_name"];

    //si le fichier personnel n'existe pas, il est créé
    if(!file_exists($json_file_rec)){
        fopen($json_file_rec, 'wrx+');
    }

    //si le fichier est vide, on stock des accolades dans $json
    if(file_get_contents($json_file_rec) == ""){
		$json = json_decode("{}", true);
    }
    //on stock le contenu de $json_file_rec dans $json   
	else{
		$json = json_decode(file_get_contents($json_file_rec), true);
	}

    //on ajoute le nouvel enregistrement à $json
    $json = array_merge($json, array($mvt_name.":__".$pseudo => $record));

    //on sauve les données dans le fichier personnel
    file_put_contents($json_file_rec, json_encode($json));

    //on supprime $_POST["json"]
    $_POST["json"] = null;
    unset($_POST["json"]);
    
?>