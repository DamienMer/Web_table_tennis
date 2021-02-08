<?php
    $adresse_account = "sport_account.json";
    $pseudo = $_POST["pseudo"];
    $password = $_POST["password"];
    
    $file = file_get_contents($adresse_account);
    $json = json_decode($file, true);

    // créer un compte sous forme couple pseudo/password en cryptant le password
    $new = array($pseudo => array("password" => password_hash($password, PASSWORD_DEFAULT)));

    // concatène l'ancien tableau des couples pseudo/password avec le nouveau
    $updated_array = array_merge($json, $new);

    // met à jour le json avec le nouveau compte
    $json = json_encode($updated_array);
    file_put_contents($adresse_account, $json);

    // démarre la session
    session_start();

    // initialise le pseudo de la session
    $_SESSION["pseudo"] = $pseudo;

    //créer le dossier personnel
    
    fwrite(fopen('../sport_principal/Principal/Record/'.$pseudo.'.json', 'wrx+'), "{}");

    // redirige à la page principale
    header("Location:../sport_principal/Principal/sport_principal.php");
?>