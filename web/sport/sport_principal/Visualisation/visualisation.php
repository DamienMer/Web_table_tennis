<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="visualisation.css">
		<title>Table Tennis</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

	</head>
	
	<body>
		<div id= "gridcol">
			<p id="shortdescribe">Universite Paris Sud/Orsay<br/>damien.merret@u-psud.fr<br/>Licence Informatique 3eme annee</p>
			<h1 id="titre">Visualisation</h1>
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
			
			<form action="../Principal/sport_principal.php">
				<input type="submit" value="Enregistrement">
			</form>
		</div>


		<div class="class_mainroom_col">
			<div class="bulle">
				<div id="id_firstroom">
					<h3>Modification de l'axe en fonction du temps</h3>
					<button id="axe_button" onclick="accel_X()">accel_X</button><br>
					<button id="axe_button" onclick="accel_Y()">accel_Y</button><br>
					<button id="axe_button" onclick="accel_Z()">accel_Z</button><br>
					<button id="axe_button" onclick="rota_X()">rota_X</button><br>
					<button id="axe_button" onclick="rota_Y()">rota_Y</button><br>
					<button id="axe_button" onclick="rota_Z()">rota_Z</button><br>
					<h3>Décalage de courbe</h3>
					Decalage à droite: <button id="normalisation_button" onclick="increase_decalage()">+</button><br>
					Decalage à gauche: <button id="normalisation_button" onclick="decrease_decalage()">-</button><br>
					<h3>Normalisation</h3>
					<input type="checkbox" id="id_normalisation" onclick="canvas_display_reload()"> normalisation<br>
					> 0: <input type="range" class="range" id="id_norm_sup"  onmousemove="canvas_display_reload()" onchange="canvas_display_reload()" min="0" max="200" value="0"><br>
					< 0: <input type="range" class="range" id="id_norm_inf"  onmousemove="canvas_display_reload()" onchange="canvas_display_reload()" min="0" max="200" value="0"><br>	
				</div>
			</div>

			<div class="bulle">
				<div id="id_secondroom">
					
					<div id="id_canvas_details"></div>
					<canvas id="id_canvas" height="600" width="1000" onmousemove="mouseMove(event)" onmouseup="mouseUp()" onmousedown="mouseDown()" onwheel="molette(event)">
					
				</div>
			</div>

		</div>



		<div class="class_research_col">

			<div class="bulle">
				<div id="id_research_room">
					<h2>Research</h2>

					<h4>Start date:</h4>
					<input type="text" id="id_start_date" value="2016-12-29T21:15:30">
					<h4>End date:</h4>
					<input type="text" id="id_end_date" value="2019-12-29T21:15:30">
						
					<h4>Users:</h4>
					<div id="id_pseudos_area0"></div>

					<h4>Keywords:</h4>
					<button id="id_add_keywords" onclick="add_keywords()">Add keywords</button>
					<p></p>
					<input type="text" id="id_keyword0" value="" name="keyword">
					<div id="id_new_keyword0"></div>


					<button id="id_search_button" onclick="search()">search</button>

				</div>
			</div>

			<div class="bulle">
				<h2>Results</h2>
				<div id="id_search_res">
					<div id="id_search_res0"></div>
				</div>
			</div>

			<div class="bulle">
				<h2>Selected</h2>
				<div id="id_selected_res">
					<div id="id_selected_res0"></div>
				</div>
			</div>

		</div>


		<?php require_once "get_pseudos.php";?>
		<?php echo'<script> var pseudos = '.$_POST['pseudos'].';</script>'?>


		<script type="text/javascript" src="visualisation.js"></script>
	</body>

</html>