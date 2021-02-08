var is_valid_pseudo = false;
var is_valid_password = false;

// fonction qui affiche le formulaire de login

function display_form_in(){
	console.log("display form in function");
	document.getElementById("inupbutton").innerHTML = "<form method='POST' action='sport_accueil_check_in.php'>\
															 <br>Pseudo : </br>\
															 <br><input type='text'name='pseudo' id='id_pseudo_in'/> </br>\
															 <br>Password : </br>\
															 <br><input type='password'name='password' id='id_password_in'/> </br><br>\
															 <br><input type='submit' value= 'submit'/>\
															 <input type='button' onclick='display_inupbutton()' value='cancel'/>\
														</form><br>";
}

// fonction qui affiche le formulaire du sign up

function display_form_up(){
	console.log("display form up function");
	document.getElementById("inupbutton").innerHTML = "<form method='POST' action='sport_check_up.php'/>\
															<br>Pseudo : </br>\
															<br><input type='text' name='pseudo' id='id_pseudo_up' onkeyup='check_pseudo_up()'/> </br>\
															<br>Password : </br>\
															<br><input type='password' name='password' id='id_password_up' onkeyup='check_password_up()'/> </br><br>\
															<br><input type='submit' id='id_submit' value= 'submit' disabled='disabled'/>\
															<input type='button' onclick='display_inupbutton()' value='cancel'/>\
														</form><br>";
}

//fonction qui affiche le choix sign in sign up

function display_inupbutton(){
	console.log("display_inupbutton function");
	document.getElementById("inupbutton").innerHTML = 	"<button id='id_sign_in_button' onclick='display_form_in()'>Sign in</button><br><br>\
														 <button id='sign_up_button' onclick='display_form_up()'>Sign up</button><br><br>\
														 <form action='../../index.php'>\
															<input type='submit' value='Exit'>\
														</form><br>"
}


// fonction qui vérifie si le pseudo entré n'est pas vide, sinon il vérifie qu'il n'est pas déjà pris

function check_pseudo_up(){
	let elem = document.getElementById('id_pseudo_up');
	console.log(elem.value);
	console.log("on est dans check_pseudo_up");
	if(elem.value == ""){
		//conserve la validation à false si rien n'a été entré dans la case pseudo
		is_valid_pseudo = false;
	}
	else{
		jQuery.ajax({
			url:"sport_account.json",
			/*"http://C:\\wamp64\\www\\web\\TP2_web\\sport\\sport_account.json",*/
			success : function(res){
				valid_pseudo_up(res);
			},
			error : function() {
				console.log("error");
			},
			dataType : "json"
		})
	}
}

// fonction qui vérifie que le pseudo entré n'est pas un pseudo déjà existant

function valid_pseudo_up(res){
	console.log("in valid_pseudo function");
	let elem = document.getElementById('id_pseudo_up');
	if (elem.value in res){
		//conserve la validation du pseudo à false si rien n'a été entré dans la case pseudo
		is_valid_pseudo = false;
	}
	else{
		//met la validation du pseudo à true
		is_valid_pseudo = true;
	}
	// appelle la fonction qui va vérifier la validation du compte
	valid_all();
}

// fonction vérifie la validité du password

function check_password_up(){
	let elem = document.getElementById('id_password_up');
	// si le password est vide on met is_valid_password à false
	if(elem.value == ""){
		is_valid_password = false;
	}
	else{
		is_valid_password = true;
	}
	valid_all();
}

// fonction qui permet selon les valeurs de is_valid_pseudo et is_valid_password de bloquer ou non l'envoi du formulaire de création de compte

function valid_all(){
	let elem = document.getElementById("id_submit");
	if(is_valid_password && is_valid_pseudo){
		// active le bouton submit du formulaire
		elem.disabled = false;
	}
	else{
		// désactive le bouton submit du formulaire
		elem.disabled = true;
	}
}

document.getElementById("titre").style.color = "00ff00";