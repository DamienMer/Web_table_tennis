<?php
    $adresse_account = "sport_account.json";
    $pseudo = $_POST["pseudo"];
    $password = $_POST["password"];

    $file = file_get_contents($adresse_account);
    $json = json_decode($file, true);
    session_start();

    // vérifie que le compte existe et redirige vers la page principale
    if(array_key_exists($pseudo, $json) && password_verify($password, $json[$pseudo]["password"])){

        $_SESSION["pseudo"] = $pseudo;

        //créer un fichier pour l'utilisateur s'il n'y en a pas
        if(!file_exists('../sport_principal/Principal/Record/'.$pseudo.'.json')){
            fopen('../sport_principal/Principal/Record/'.$pseudo.'.json', 'wrx+');
        }

        //redirige vers la page d'enregistrement
        header("Location:../sport_principal/Principal/sport_principal.php");
    }
    // si le compte n'existe pas on initialise une variable de session à false et on redirige vers la page d'accueil
    else{
        $_SESSION["wrong_sign_in"] = "true";
        header("Location:sport_accueil.php");
    }
?>