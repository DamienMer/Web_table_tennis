//nom donné à l'enregistrement
var record_name = "";

//tableau contenant les keywords
var record_keywords = [];

//contient le nombre de mots clé que l'utilisateur veut rentrer (nombre de mot clés + 1)
var compteur_keywords = 0;

//motion est l'accélération
var rec_mot_x = [];
var rec_mot_y = [];
var rec_mot_z = [];

//orientation
var rec_ori_x = [];
var rec_ori_y = [];
var rec_ori_z = [];

//timer 
var timer = 0;

//fonction qui va activer l'enregistrement, retry est à true si le précédent enregistrement n'était pas satisfaisant et que l'utilisateur voulait recommencer
function start(retry){

    //fait patienter l'utilisateur pendant 1 seconde pour qu'il se positionne
    var milliseconds = 1000;
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }

    //fait vibrer le téléphone pour préciser que l'enregistrement commence
    window.navigator.vibrate(200);
    
    //Si l'utilisateur est entrain de réessayer l'enregistrement, on ne change pas le tableau record_keywords qui est déjà rempli
    if(retry){

        //on modifie la mainroom pour faire disparaitre le bouton start
        document.getElementById("id_mainroom").innerHTML = "<div id='id_mainroom'></br>\
                                                            <button id='id_start_stop_button' onclick='stop()'>STOP</button></br>\
                                                            </div>";
        console.log("l'enregistrement a commencé");

        //on active les capteurs
        window.addEventListener("devicemotion", motion, false);
        window.addEventListener("deviceorientation", orientation, false);
    }

    //si c'est le premier enregistrement on remplie le tableau record_keywords avec les mot clés entrés par l'utilisateur
    else{
        record_name = document.getElementById("id_name").value;
        for(var i = 0; i <= compteur_keywords; i++){
            if(document.getElementById("id_keyword"+i).value != ""){
                record_keywords.push(document.getElementById("id_keyword"+i).value);
            }
        }

        //on modifie la mainroom pour faire disparaitre le bouton start
        document.getElementById("id_mainroom").innerHTML = "<div id='id_mainroom'></br>\
                                                            <button id='id_start_stop_button' onclick='stop()'>STOP</button></br>\
                                                            </div>";
        console.log("l'enregistrement a commencé");

        //on active les capteurs
        window.addEventListener("devicemotion", motion, false);
        window.addEventListener("deviceorientation", orientation, false);
    }

    //on affecte la date actuelle au timer
    timer = new Date().getTime();

}

//fonction qui va récupérer les accélération et les mettre dans 3 tableaux (x, y et z)
function motion(event){
    console.log("in motion function");
    rec_mot_x.push(Math.round(event.acceleration.x));
    rec_mot_y.push(Math.round(event.acceleration.y));
    rec_mot_z.push(Math.round(event.acceleration.z));
    console.log(rec_mot_x.length);
    console.log(rec_mot_y.length);
    console.log(rec_mot_z.length);
    
    //on récupère la date actuelle, si elle est supérieur au timer de 3 secondes, on stop l'enregistrement.
    if (new Date().getTime() > timer + 3000){
        stop();
    }

}

//fonction qui va récupérer les accélération et les mettre dans 3 tableaux (x, y et z)
function orientation(event){
    console.log("in orientation function");
    rec_ori_x.push(Math.round(event.alpha));
    rec_ori_y.push(Math.round(event.beta));
    rec_ori_z.push(Math.round(event.gamma));
    console.log(rec_ori_z.length);
    console.log(rec_ori_z.length);
    console.log(rec_ori_z.length);
}

//fonction qui met fin à l'enregistrement
function stop(){

    //désactive les capteurs
    window.removeEventListener("devicemotion", motion, false);
    window.removeEventListener("deviceorientation", orientation, false);

    //fait vibrer le téléphone pour préciser que c'est la fin dde l'enregistrement 
    window.navigator.vibrate(200);
    console.log("end");

    //affiche le choix de ce que l'utilisateur veut faire avec les données enregistrées, il peut réessayer l'enregistrement, l'accepter ou annuler.
    document.getElementById("id_mainroom").innerHTML =  "<div id='id_mainroom'></br>\
                                                        <button id='id_ok_button' onclick='save_data()'>OK !!!</button>\
                                                        <button id='id_retry_button' onclick='retry()'>Retry ?</button></br>\
                                                        <br><button id='id_cancel_button' onclick='cancel()'>cancel</button></br>\
                                                        </div>";
}

//fonction qui ajoute des champs de texte pour écrire des mots clés
function add_keywords(){

    //limite du nombre de mots clés pouvant être entrés
    var max_keywords = 2;

    //affiche récursivement un nouveau champ de texte
    if(compteur_keywords < max_keywords){
        compteur_keywords ++;
        console.log(compteur_keywords);
        document.getElementById("id_new_keyword"+(compteur_keywords-1)).innerHTML = "<br><input type='text' id='id_keyword"+compteur_keywords+"' value='' name='keyword'><br>\
                                                                <div id='id_new_keyword"+compteur_keywords+"'>\
                                                                </div>"
    }

    //si l'utilisateur dépasse le nombre de mots clés limités, on lève une alerte
    else{
        alert("Vous ne pouvez pas entrer plus de mots clés");
    }
    
    
}

//fonction appelée lorsque l'utilisateur veut réenregistrer
function retry(){
    console.log("in the retry");

    //les tableaux conservant les valeurs de l'accélération sont remis à vide
    rec_mot_x = [];
    rec_mot_x = [];
    rec_mot_y = [];
    rec_mot_z = [];

    //les tableaux conservant les valeurs de l'orientation sont remis à vide
    rec_ori_x = [];
    rec_ori_y = [];
    rec_ori_z = [];

    //on relance la fonction start on on donne comme argument true pour le retry
    start(true);

}

//fonction appelé lorsque l'utilisateur annule l'enregistrement
function cancel(){
    document.location.href="sport_principal.php"; 
}


//fonction appelé lorsque l'utilisateur accepte l'enregistrement
function save_data(){
    let record_date = new Date().getTime();
    console.log("in save_data function");

    //on construit l'objet json qui sera envoyé dans le fichier personnel
    let json = {
        nom: record_name,
        pseudo: pseudo,
        mot_clef: record_keywords,
        date: record_date,
        decalage: 0,
        acceleration_x: rec_mot_x,
        acceleration_y: rec_mot_y,
        acceleration_z: rec_mot_z,
        orientation_x: rec_ori_x,
        orientation_y: rec_ori_y,
        orientation_z: rec_ori_z
    }

    console.log(json);

    //on applle save_data_bis en passant en paramètre l'objet json précédemment construit 
    save_data_bis(json);
 
    //on redirige vers la page de visualisation 
    document.location.href="../Visualisation/visualisation.php"; 
    console.log("done");
}

//fonction qui va mettre l'objet json dans un POST qui pourra ensuite être utilisé dans le fichier "save_data.php" via $_POST
function save_data_bis(json){
    jQuery.post({
		url: "save_data.php",
		dataType: "text",
        data: { "json": JSON.stringify(json),
                "mvt_name": json.nom}

	});
}

//variable globale qui dit si le nom pour le future enregistrement est valide ou non
var is_valid_record_name = false;

//fonction qui va chercher dans le fichier personnel si le nom entré pour le future enregistrement existe déjà.
function check_record_name(){

    //on va chercher le contenu du fichier personnel de l'utilisateur en utilisant la variable "pseudo" créée dans "sport_principal.php"
	jQuery.ajax({
		url:"Record/"+ pseudo +".json",
		/*"http://C:\\wamp64\\www\\web\\TP2_web\\sport\\sport_account.json",*/
		success : function(res){
			check_record_name_bis(res);
		},
		error : function() {
            console.log("error");
            console.log("end");
		},
		dataType : "json"
	})
}

//fonction qui active ou désactive le bouton d'enregistrement selon si le nom entré à déjà était pris
/*
 * Dans cet fonction, la variable tmp avait pour but d'essayer de modifier l'activation du bouton le plus tard possible, cependant ce n'est pas plus efficace
 * Par conséquent il est tout de même possible d'entrer un nom déjà existant si la fonction n'a pas le temps de s'exécuter
 */

function check_record_name_bis(res){

    //on stocke le nom entré
    let elem = document.getElementById('id_name');

    //variable intermédiaire qui modifiera ou non "is_valid_record_name"
    var tmp = true;

    is_valid_record_name = false;
   
    //récupère les clés de tous les gestes contenus dans le répertoire de l'utilisateur
    let keys = Object.keys(res);
    console.log(keys);

    //si l'utilisateur n'a pas entré de nom pour le geste, on met tmp à false
    if(elem.value == ""){
        tmp = false;
    }

    //sinon pour chaque geste, on vérifie que le nom entré n'existe pas
    else{
        for (let i = 0; i < keys.length; i++) {
            mvt_name = Object.entries(res)[i][1].nom;
            if(mvt_name == elem.value){
                tmp = false;
                break;
            }
        }
    }
    
    //si la valeur de tmp est true, on met "is_valid_record_name" à true, sinon on le laisse à false
    tmp ? is_valid_record_name = true : is_valid_record_name = false;

    //on appelle la fonction qui va vérifier l'état de "is_valid_record_name"
    valid_name();
}

//fonction qui active ou désactive le bouton d'enregistrement
function valid_name(){
    if(is_valid_record_name == true){
        document.getElementById('id_start_stop_button').disabled = false;
    }
    else{
        document.getElementById('id_start_stop_button').disabled = true;
    }
}