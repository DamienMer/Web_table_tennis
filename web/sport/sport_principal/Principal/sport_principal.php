<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="sport_principal.css">
		<title>Table Tennis</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

	</head>
	
	<body>
		<div id= "gridcol">
			<p id="shortdescribe">Universite Paris Sud/Orsay<br/>damien.merret@u-psud.fr<br/>Licence Informatique 3eme annee</p>
			<h1 id="titre">Enregistrement</h1>
			<img id="fff" src="../../ressources/fff.png">
			<img id="ttmor" src="../../ressources/ttmor.png">
		</div>

		<?php
			session_start();
				if(!isset($_SESSION["pseudo"])){
					header("Location:../../sport_accueil/sport_accueil.php");
				}
				echo "Pseudo: ".$_SESSION["pseudo"];
		?>
		

		<div id="id_navigate">
			<form action="../../sport_accueil/sport_accueil.php">
				<input type="submit" value="logout">
			</form>

			<form action="../Visualisation/visualisation.php">
					<input type="submit" value="Visualisation">
			</form>
		</div>



		<div id="id_mainroom">

			<div class="bulle">

				<h2>Record name</h2>
				<input type="text" id="id_name" value="" name="nom_enregistrement" onkeyup='check_record_name()'>


				<h2>Add keywords</h2>
				<button id="id_add_keywords" onclick="add_keywords()">Add</button>

				<h2>Record keywords</h2>
				<input type="text" id="id_keyword0" value="" name="keyword">

				<div id="id_new_keyword0"></div>

				

				<br><button id="id_start_stop_button" onclick="start(false)" disabled='disabled'>START</button>
			
			</div>	

		</div>

		
		<?php echo'<script> var pseudo = "'.$_SESSION['pseudo'].'";</script>'?>
		<script type="text/javascript" src="sport_principal.js"></script>
	</body>

</html>