//variable qui contient le canvas
let canvas = document.getElementById("id_canvas");

//variable qui contient le contexte
let ctx = canvas.getContext('2d');

//variable qui contient la largeur du canvas
var wid = canvas.width;

//variable qui contient la hauteur du canvas
var hei = canvas.height;

//variable qui contient les coordonnées de l'origine du canvas
let origine = [wid / 2, hei / 2];

//variable qui contient l'origine initiale
let origine_init = [0, 0];

//variable contenant des tableaux de 2 éléments (clé, objet) des gestes qui satisfont la recherche
let res_search_tab = [];

//variable contenant des tableaux de 2 éléments (clé, objet) des gestes ont étaient selectionnés parmi ceux qui satisfont la recherche
let res_selected_tab = [];

//tableau qui contient les même geste que "res_selected_tab" mais où les valeur des axes (accel_x, accel_y...) ont été modifiés pour correspondre à des valeur normalisées
let res_selected_tab_norm = [];

//variable qui contient l'axe qui doit être affiché
let axe_state = "acceleration_x";

let origine_click_movement = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

//variable qui retient si l'utilisateur est en train de cliquer sur sa souris
var mouse_click = false

//variable qui stocke le nombre de champs pour entrer les keywords
var compteur_keywords = 0;

//objet qui contient tous les gestes de tous les utilisateurs
var objet_json = {};

//variable qui stocke quel est le geste actuellement selectionné
var chosen_one;

//tableau qui stocke l'ensemble des couleurs à appliquer aux courbes
var color_tab = ["red", "blue", "green", "purple"];

//varaible qui tocke la valeur du zoom
let zoom = 20;

//class point qui contient une abscisse et une ordonné
class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

//fonction appelé lorsque l'on bouge la molette de la souris
function molette(e) {

    //si le zoom est inférieur ou égale à 10 et qu'on dézoome, on bloque le zoom
    if(zoom <= 10 && e.deltaY < 0){
        zoom = 10;
    }

    //si le zoom est supérieur ou égale à 50 et qu'on zoome, on bloque le zoom
    else if(zoom >= 50 && e.deltaY > 0){
        zoom = 50;
    }

    //sinon on ajoute 1 ou -1 en fonction du mouvement de la molette
    else{
        if(e.deltaY > 0){
            zoom += 1;
        }
        else{
            zoom -= 1;
        }
    }

    //on réactualise la canvas
	canvas_display_reload();
	e.preventDefault();
}

//fonction qui dessine les axes sur le canvas
function drawAxes(){
    
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";

        //dessine les axes principaux
        ctx.moveTo(0, origine[1]);
        ctx.lineTo(wid, origine[1]);
        ctx.moveTo(origine[0], 0);
        ctx.lineTo(origine[0], hei);
    
        //pour chaque axe, gradue en fonction du zoom
        for(var i = origine[0] - zoom; i > 0  ; i -= zoom){

            //grand traits ( aux multiples de 5)
            if((i - origine[0]) % (5*zoom) == 0){
                ctx.moveTo(i, origine[1] - 10);
                ctx.lineTo(i, origine[1] + 10);
            }
            
            //petits traits
            else{
                ctx.moveTo(i, origine[1] - 5);
                ctx.lineTo(i, origine[1] + 5);
            }
        }
    
        for(var i = origine[0] + zoom; i < wid ; i += zoom){
            if((i - origine[0]) % (5*zoom) == 0){
    		    ctx.moveTo(i, origine[1] - 10);
                ctx.lineTo(i, origine[1] + 10);
            }
            else{
                ctx.moveTo(i, origine[1] - 5);
                ctx.lineTo(i, origine[1] + 5);
            }
        }
    
        for(var i = origine[1] - zoom; i > 0; i -= zoom){
            if((i - origine[1]) % (5*zoom) == 0){
                ctx.moveTo(origine[0] + 10, i);
                ctx.lineTo(origine[0] - 10, i);
            }
            else{
                ctx.moveTo(origine[0] + 5, i);
                ctx.lineTo(origine[0] - 5, i);
            }
        }
    
        for(var i = origine[1] + zoom; i < hei; i += zoom){
            if((i  - origine[1]) % (5*zoom) == 0){
                ctx.moveTo(origine[0] + 10, i);
                ctx.lineTo(origine[0] - 10, i);
            }
            else{
                ctx.moveTo(origine[0] + 5, i);
                ctx.lineTo(origine[0] - 5, i);
            }
        }
    
        ctx.stroke();
        ctx.closePath();
    
    }



//Dessine un point
function drawPoint(p, c){
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI, true);
    ctx.stroke();
    ctx.closePath();
}

//Dessine une ligne d'un point à un autre
function drawLine(p1, p2, c){
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = 1;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.closePath();
}

//fonction appelé lorsque le click souris est maintenu
function mouseDown(){
    console.log("down");
    mouse_click = true;
    
}

//fonction appelé lorsque le click souris est relaché
function mouseUp(){
    console.log("up");
    origine_click_movement = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    mouse_click = false;
}

//fonction appelé lorsque la souris passe sur le canvas
function mouseMove(e){

    //si le click souris n'est pas maintenu, ne fait rien
    if(!mouse_click){
        console.log("false mouse");
        return false;
    }

    //sinon, déplace les axes en fonction du drag de la souris
    else{
        console.log("on canvas");
        if(origine_click_movement[0] ==  Number.MAX_SAFE_INTEGER){
            origine_click_movement[0] = e.clientX;
            origine_click_movement[1] = e.clientY;
            origine_init[0] = origine[0];
            origine_init[1] = origine[1];
        }
        origine[0] = origine_init[0] + e.clientX - origine_click_movement[0];
        origine[1] = origine_init[1] + e.clientY - origine_click_movement[1];

        //recharge le canvas
        canvas_display_reload();
    }   
}



//fonction permettant d'initialiser la variable contenenant tous les objets de tous les comptes
function fill_objet_json(){
    var file_path = "../Principal/Record/";
    
    //pour chaque pseudos, on va chercher le contenu de leur fichier personnel
    pseudos.forEach(elem => {
        jQuery.ajax({
            url: file_path + elem + ".json",
            success : function(res){
                fill_objet_json2(res, elem);
            },
            error : function(){
                console.log(elem);
                console.log("error in fill_objet_json function");
                console.log(file_path + elem + ".json");
            }
        })
    });
}

//on ajoute le contenu de chaque fichier à "objet_json"
function fill_objet_json2(res, elem){
    objet_json = jQuery.extend(objet_json, res);
}

//fonction qui modifie axe state en fonction du bouton appuyé
function accel_X(){
    axe_state = "acceleration_x";
    canvas_display_reload();
}

function accel_Y(){
    axe_state = "acceleration_y";
    canvas_display_reload();
}

function accel_Z(){
    axe_state = "acceleration_z";
    canvas_display_reload();
}

function rota_X(){
    axe_state = "orientation_x";
    canvas_display_reload();
}

function rota_Y(){
    axe_state = "orientation_y";
    canvas_display_reload();
}

function rota_Z(){
    axe_state = "orientation_z";
    canvas_display_reload();
}

//activé au chargement de la page
window.onload = function(){

    //on recharge le canvas
    canvas_display_reload();

    //affiche tous les pseudos pour la recherche
    modifie_research();

    //rempli l'objet_json
    fill_objet_json();
}

//fonction qui affiche les mouvement selectionnés sur le canvas
function display_movements(tab){
    for(var i = 0; i < tab.length; i++){

        //récupère le décalage du mouvement
        let decalage = tab[i][1].decalage;

        //stocke le premier point pour pouvoir tracer la courbe en le reliant à un autre (en fonction de l'axe voulu)
        p2 = new Point(origine[0] + j + decalage, origine[1] + tab[i][1][axe_state][j]);

        //pour chaque donné dans l'axe voulu
        for(var j = 0; j < tab[i][1][axe_state].length; j++){

            //on créer un point avec des coordonnées sensibles au zoom
            var p1 = new Point(origine[0] + (j * (zoom/10)) + (decalage*(zoom/10)), origine[1] + (tab[i][1][axe_state][j]) * (zoom/10));

            //on dessine le point
            drawPoint(p1, color_tab[i]);

            //on trace un trait
            drawLine(p1, p2, color_tab[i]);

            //on conserve la valeur de l'ancien point 
            var p2 = p1;
        }
    }
}

//fonction qui va augmenter le décalage du mouvement actuellement selectionné
function increase_decalage(){
    for(var i = 0; i < res_selected_tab.length; i++){
        if(res_selected_tab[i][0] == chosen_one){

            //on augmente le décalge de ce geste de 2
            res_selected_tab[i][1].decalage += 2;
        }
    }
    //recharge le canvas
    canvas_display_reload();
}

//fonction qui va augmenter le décalage du mouvement actuellement selectionné
function decrease_decalage(){
    for(var i = 0; i < res_selected_tab.length; i++){
        if(res_selected_tab[i][0] == chosen_one){

            //on diminue le décalge de ce geste de 2
            res_selected_tab[i][1].decalage -= 2;
        }
    }
    //recharge le canvas
    canvas_display_reload();
}

//fonction qui affiche tous les pseudos existants pour la recherche
function modifie_research(){
    var amout_pseudos = pseudos.length;
    for(var i = 0; i < amout_pseudos; i++){
        document.getElementById("id_pseudos_area"+i).innerHTML = "<input type='checkbox' id='id_search_pseudos"+i+"'>"+pseudos[i]+"</br>\
                                                            <div id='id_pseudos_area"+(i+1)+"'>";
    }


} 

//fonction qui ajoute des champs de mots clés pour la recherche (2 en plus max)
function add_keywords(){

    //limite du nombre de champs de keywords
    var max_keywords = 2;

    //si le compteur est inférieur à la limite, on peut en ajouter
    if(compteur_keywords < max_keywords){
        compteur_keywords ++;
        document.getElementById("id_new_keyword"+(compteur_keywords-1)).innerHTML = "<input type='text' id='id_keyword"+compteur_keywords+"' value='' name='keyword'></br>\
                                                                <div id='id_new_keyword"+compteur_keywords+"'>\
                                                                </div>"
    }

    //sinon on a une alerte
    else{
        alert("Vous ne pouvez pas entrer plus de mots clés");
    }
    
    
}

//variable qui est vrai tant que tous les keywords sont dans les mots clés d'un geste
var tmp_bool = false;

//fonction qui va selectionner les gestes qui correspondent à la recherche
function search(){

    //on met le tableau à vide 
    res_search_tab = []

    //onstocke dans un tableau toutes les clés de tous les gestes de tous les utilisateurs
    let keys = Object.keys(objet_json);

    //on créer des couples clés, objet et on les mets dans "res_search_tab" si le pseudo a était coché
    for(var i = 0; i < pseudos.length; i++){
        if(document.getElementById("id_search_pseudos"+i).checked){
            for (let j = 0; j < keys.length; j++) {
                if(Object.entries(objet_json)[j][1].pseudo == pseudos[i]){
                    res_search_tab.push(Object.entries(objet_json)[j]);
                }
            }
        }     
    }


    var date_debut = Date.parse(new Date(document.getElementById("id_start_date").value));
    var date_fin = Date.parse(new Date(document.getElementById("id_end_date").value));

    
    //on enleve met à 0 les couples qui ne correspondent pas aux dates (on ne les enleve pas tout de suite pour ne pas avoir un problème sur la boucle avec la taille du tableau à parcourir)
    for(var i = 0; i < res_search_tab.length; i++){
        
        if(res_search_tab[i][1].date > date_fin || res_search_tab[i][1].date < date_debut){
            res_search_tab[i] = 0;
        }
    }

    //on supprime les zéros
    delete_zeros();

    //pour chaque champs de keywords dans la recherche
    for(var i = 0; i <= compteur_keywords; i++){

        //si le champ n'est pas vide
        if(document.getElementById("id_keyword"+i).value != ""){

            //si le un geste dans "res_search_tab" ne contient pas tous les keywords qui ont étaient entrés par l'utilisateur, il est mis à 0
            for(var j = 0; j < res_search_tab.length; j++){
                tmp_bool = false;
                
                if(res_search_tab[j] != 0){
                    for(var k = 0; k < res_search_tab[j][1].mot_clef.length; k++){ 
                        if(document.getElementById("id_keyword"+i).value == res_search_tab[j][1].mot_clef[k]){   
                            tmp_bool = true;
                            break;
                        }  
                    } 
                }
                if(tmp_bool == false){ 
                    
                    //on met le geste à 0
                    res_search_tab[j] = 0;
                    tmp_bool = false
                }
            }
        }
        else{
            console.log("null mot clef vide");
        }
        
    }  
    //on enlève les 0 de res_search_tab
    delete_zeros();

    //on vide la zone de résultat des recherche
    clear_research_area();

    //on affiche les résultats de la recherche
    display_search_res();
}

//fonction qui enlève les 0 dans un tableau
function delete_zeros(){
    for(var i = 0; i < res_search_tab.length; i++){

        if(res_search_tab[i] == 0){

            //on met à 0 la valeur qui a suivi la condition
            res_search_tab.splice(i, 1);
            i--;
        }
    }
}

//fonction qui affiche récursivement les gestes qui satisfont la recherche
function display_search_res(){
    for(var i = 0; i < res_search_tab.length; i++){
        document.getElementById("id_search_res"+i).innerHTML = "<button id='id_button_res"+i+"' class='class_button_res' onclick='select(this)' value='"+res_search_tab[i][0]+"'>"+res_search_tab[i][0]+"</button>\
                                                                <div id='id_search_res"+(i+1)+"'></div>";
    }
}

//fonction qui enlève les précédentes recherches
function clear_research_area(){
    document.getElementById("id_search_res").innerHTML =    "<div id='id_search_res'>\
                                                                <div id='id_search_res0'></div>\
                                                            </div>"
}

//fonction qui est appelée chaque fois qu'un geste est selectionné dans la zone des résultats
function select(elem){
    chosen(elem);
    var res_selected_tab_limite = 4;
    var already_selected = false;

    //on vérifie que le mouvement ne soit pas déjà affiché
    for(var i = 0; i < res_selected_tab.length; i++){
        if(res_selected_tab[i][0] == elem.value){
            alert("Ce mouvement est déjà affiché");
            already_selected = true;
            break;
        }
    }

    //on vérifie qu'il n'y ait pas déjà 4 courbes affichées
    if(!already_selected){
        for(var i = 0; i < res_search_tab.length; i++){
            if(elem.value == res_search_tab[i][0]){
                if(res_selected_tab.length == res_selected_tab_limite){
                    alert("Seulement 4 gestes peuvent être afficher en même temps");
                    
                }
                else{
                    //on l'ajoute à res_selected_tab
                    res_selected_tab.push(res_search_tab[i]);
                }
            }
        }

        //on clear la selected area
        clear_selected_area();

        //on la réaffiche
        display_selected_res();

        //on actualise le canvas
        canvas_display_reload();
    } 
}

//fonction qui affiche récursivement les gestes qui ont été selectionnés
function display_selected_res(){
    for(var i = 0; i < res_selected_tab.length; i++){
        
        document.getElementById("id_selected_res"+i).innerHTML = "<button id='id_selected_movement"+i+"'onclick='chosen(this)' value='"+res_selected_tab[i][0]+"'>"+res_selected_tab[i][0]+"</button>\
                                                                <button onclick='remove(this)' value='"+res_selected_tab[i][0]+"'>remove</button>\
                                                                <div id='id_selected_res"+(i+1)+"'></div>";
    }
}

//fonction qui enlève les précédents gestes selectionnés
function clear_selected_area(){
    document.getElementById("id_selected_res").innerHTML =    "<div id='id_selected_res'>\
                                                                <div id='id_selected_res0'></div>\
                                                            </div>"
}

//fonction qui retire un geste de la zone des gestes selectionnés
function remove(elem){
    
    for(var i = 0; i < res_selected_tab.length; i++){
        //si le geste est celui que l'on veut enlever on le retire
        if(elem.value == res_selected_tab[i][0]){
            res_selected_tab.splice(i, 1);
            break;
        }
    }

    //on efface la zone des selections
    clear_selected_area();

    //on réaffiche
    display_selected_res();

    //on actualise le canvas
    canvas_display_reload();
}

//fonction qui modifie le geste sélectionné actuellement
function chosen(elem){
    chosen_one = elem.value;

    //actualise
    modifie_canvas_details();
}

//fonction qui recharge le canvas
function canvas_display_reload(){

    //clear le canvas
    ctx.clearRect(0, 0, wid, hei);

    //dessine les axes
    drawAxes();

    var tab = res_selected_tab;

    //si la normalisation est cochée tab devient res_selected_tab_norm
    if(document.getElementById("id_normalisation").checked){
        normalisation();
        tab = res_selected_tab_norm;
    }

    //on actualise les détails
    modifie_canvas_details();

    //on affiche les courbes normalisées ou non
    display_movements(tab);
}


//fonction qui normalise les valeurs de res_selected_tab en fonction de valeurs modifiées par l'utilisateur 
function normalisation(){

    //on créer un clone de res_selected_tab
    res_selected_tab_norm = clone(res_selected_tab);

    //on récupère la valeur absolue du mouvement (en fonction de l'axe) la plus élevé afin de normaliser sur celle-ci
    for(var i = 0; i < res_selected_tab.length; i++){
        var val_abs_max = 0;
        
        for(var j = 0; j < res_selected_tab[i][1][axe_state].length; j++){
            if(Math.abs(res_selected_tab[i][1][axe_state][j]) > val_abs_max){
                val_abs_max = Math.abs(res_selected_tab[i][1][axe_state][j]);
            }
        }

        //on récupère les valeurs entrées par l'utilisateur
        val_max = document.getElementById("id_norm_sup").value;
        val_min = -(document.getElementById("id_norm_inf").value);

        //pour cahque gestes selectionnés
        for(var i = 0; i < res_selected_tab_norm.length; i++){
            
            //pour chaque données en fonction de l'axe voulu, on modifie res_selected_tab_norm pour avoir des valeurs normalisées selon les valeurs entrées par l'utilisateur
            for(var j = 0; j < res_selected_tab_norm[i][1][axe_state].length; j++){
                if(res_selected_tab_norm[i][1][axe_state][j] > 0){
                    res_selected_tab_norm[i][1][axe_state][j] = (val_max / val_abs_max) * res_selected_tab_norm[i][1][axe_state][j];
                }
                else if(res_selected_tab_norm[i][1][axe_state][j] < 0){
                    res_selected_tab_norm[i][1][axe_state][j] = (val_min / -(val_abs_max)) * res_selected_tab_norm[i][1][axe_state][j];
                }
            }
        }
    }
}

//fonction qui fait un clone d'un tableau existant
function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

//fonction qui actualise l'axe sélectionné et le geste actuellement selectionné
function modifie_canvas_details(){
    document.getElementById("id_canvas_details").innerHTML = "<div id='id_canvas_details'><p>Axe: "+axe_state+"</p> <p>Selected: "+chosen_one+"</p></div>";
}


