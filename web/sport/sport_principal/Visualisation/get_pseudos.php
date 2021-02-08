<!--Fichier qui a pour but de créer un tableau (a envoyer au fichier js visualisation) contenant le nom de tous les utilisateurs. On pourra par la suite récupérer les données de chaque gestes pour chaque personne-->
<?php
    //pas de session start car le fichier est inclut dans un autre ou la session est déjà lancée

    //on stocke le chemin du fichier json de l'ensemble des comptes
    $file_path = "../../sport_accueil/sport_account.json";

    //on initialise le tableau res qui contiendra l'ensemble des pseudos
    $res = [];

    //on récupère le contenu du fichier json des comptes
    $json = json_decode(file_get_contents($file_path, true));

    //on stocke tous les pseudos dans "res"
    foreach($json as $key => $value){
        array_push($res, $key);
    }

    //on met ce tableau dans un POST pour pouvoir l'utiliser comme variable javascript (voir visualisation.php vers la fin)
    $_POST["pseudos"] = json_encode($res);
?>