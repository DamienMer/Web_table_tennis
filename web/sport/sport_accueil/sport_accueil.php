<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="sport_accueil.css">
		<title>Table Tennis</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

	</head>
	
	<body>
		<div id= "gridcol">
			<p id="shortdescribe">Universite Paris Sud/Orsay<br/>damien.merret@u-psud.fr<br/>Licence Informatique 3eme annee</p>
			<img id="fff" src="../ressources/fff.png">
			<img id="ttmor" src="../ressources/ttmor.png">
		</div>
		
		<main>
		
		<!-- Création de la session, initialisation de la variable de session pseudo et vérification de la variable de session wrong_sign_in-->
			<?php
				session_start();
				$_SESSION["pseudo"] = null;
				if(isset($_SESSION["wrong_sign_in"])){
					echo "<p>error, wrong password or pseudo</p>";
					$_SESSION["wrong_sign_in"] = null;
				}

				//si le fichier des comptes n'existe pas, on le créer
				$adresse_account = "sport_account.json";
				if(!file_exists($adresse_account)){
					fwrite(fopen($adresse_account, 'wrx+'), "{}");
				}
			?>
			<h1 id="titre">The table tennis</h1>

			<div class="bulle">
				<p>Bienvenue sur la page dédiée au tennis de table.</p>
				
				<div id="inupbutton">
					<button id="sign_in_button" onclick="display_form_in()">Sign in</button><br><br>
					<button id="sign_up_button" onclick="display_form_up()">Sign up</button><br><br>
					<form action="../../index.php">
						<input type="submit" value="Exit">
					</form>
					<br>
				</div>
			</div>


			<script type="text/javascript" src="sport_accueil.js"></script>
			
		</main>
	</body>

</html>