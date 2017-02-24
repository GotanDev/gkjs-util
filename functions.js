/** Bibliothèque de fonctions javascript pratiques. 
 * 
 * PROJECT GOTAN KIT JAVASCRIPT
 * @author Damien Cuvillier
 * @copyright All right Reserved to Gotan
 */




/* Chargement dynamique de dépendance.
 * Ajoute une dépendance JS au DOM. */
include = function(jsFile) {
        $("body").after("<script type='application/javascript' src='./static/js/" + jsFile + "'></script>");
};


// Jquery Hacks

String.prototype.trim = function() {
        return jQuery.trim(this);
};

/** A partir de la chaine, on enlève les espaces en début et fin. 
 * Si la valeur est une chaine vide, on retourne null
 */
String.prototype["null"] = function(){
        var value = this.trim();
        if (value == "") {
                return null;
        }
        return value;
};


/** A partir de la chaine, on vérifie que la chaine est nulle ou vide
 */
String.prototype.isNullOrEmpty = function(){
        return this["null"]() == null;
};

/** Met en majuscule la première lettre de chaque mot de la chaîne
 */
String.prototype.capitalize = function(){
        var parts = this.split(" ");
        var rString = "";
        for (ip in parts) {
                rString += parts[ip][0].toUpperCase();
                rString += parts[ip].substr(1).toLowerCase();
                rString += " ";
        }
        return rString.trim();
};

/** Parse une date à partir du format ISO 8601.
 * @param dateString la chaine contenant la date
 * Tolérance sur les - : espaces et ms 
 * 
 * 
 */
Date.parseISO8601 = function(dateString) {
        if (dateString == null) {
                return null;
        }
        if (typeof dateString == "string") {
                try{
                        return new Date(dateString);
                } catch(e) {
                        if (ds.debug){
                                console.error("Unable to parse " + dateString + " to a featured date");
                                return null;
                        }
                }
        } else {
                return dateString;
        }
};


/** Réalise une différence entre deux dates et affiche le format sous forme d'une String
 * 
 */
Date.diff = function(date1, date2){
    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;

    diff.ms = tmp % 1000;
    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes
 
    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes
 
    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp ;                   // Extraction du nombre d'heures
     
     
    return fz(diff.hour,2) + ":" + fz(diff.min,2) + ":" + fz(diff.sec,2) + "." + fz(diff.ms,3); 
}


/**
 * Transforme une date contenu dans un String en un timestamp.
 * 
 * @param String contenant la date au format yyyyMMddHHmmss
 * @return le timestamp en format Date
 * http://stackoverflow.com/questions/1833892/converting-a-string-formatted-yyyymmddhhmmss-into-a-javascript-date-object
 * 
 */
Date.timestamp = function(dateString) {
        if (dateString == null) {
                return null;
        }
        var date = Date.parse(dateString);
        var timestamp = date.getTime();
        return timestamp;
};


/** 
 * Formate une date.
 * @param Boolean asUrlParameter format yyyyMMddHHmmss
 * @return String la date au format "DD/MM/YYYY hh:mm:ss" ou yyyyMMddHHmmss
 */
Date.prototype.format = function(asUrlParameter){
          if(asUrlParameter){
                  return this.toISOString();
          } else{
                  return this.toLocaleString();
          }
};

/** Encode en HTML les caractères particuliers d'une chaine.
 * @return string
 */
String.prototype.encode = function(){
        var map = {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"};
        return this.replace(/[&<>"']/g, function(match) { return "&" + map[match] + ";"; });
};
/** Echappe les caractères particuliers d'une chaine.
 * @return string
 */
String.prototype.escape = function(){
        return this.replace("\"", "\\\"");
};

/** Pour l'ensemble des champs d'entrée avec la classe 'identifier', 
 * on normalize les données en enlevant les accents, les majuscules 
 * et en remplacant les espaces par des tirets '-' 
 */
String.prototype.identifier = function(){
        return this
                .replace(/[€]/gi, "eur")
                .replace(/[$]/gi, "dollar")
                .replace(/[%]/gi, "percent")
                .replace(/[éèêë]/gi, "e")
                .replace(/[âàæä]/gi, "a")
                .replace(/[ç]/gi, "c")
                .replace(/[îï]/gi, "i")
                .replace(/[ôøœö]/gi, "o")
                .replace(/[ß]/gi, "b")
                .replace(/[ùûü]/gi, "u")
                .replace(/[_:;\/\\!\?\.,-]/gi, " ") // Remplace certains caractères par des espaces
                .replace(/[^\w\d\s]/gi, "") // Supprime les caractères spéciaux (hors espaces, nombres, underscore et lettre)
                .replace(/  /gi, " ") // supprime les doubles espaces
                .replace(/ /gi, "-")
                .replace(/^[0-9]*/,"") //Interdiction de commencer avec un ou plusieurs chiffre
                 
                .toLowerCase();
};


/** Supprime tout le contenu HTML d'une chaine de caractère. 
 * @çeturn string 
 */
String.prototype.sanitize = function(){
         $("body").append("<g style='hidden' id='sanitizer'>");
         $('#sanitizer').html(this);
         var message = $("#sanitizer").text();
         $("#sanitizer").remove();
         return message;
};

/** Récupère la valeur numérique d'une propriété CSS calculée. 
 * Utile pour récupérer un nombre de pixels
 */
jQuery.fn.numericCss = function(cssProperty) {
        return parseInt(this.css(cssProperty));
};

/** Encode a set of form elements as an object. */
jQuery.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
/** Clone un objet. 
 * Il arrive que dans certains cas, nous constations le comportement de pointeurs 
 * dans des usages avancées d'objet JSON. 
 * Cette fonction force un clonage pur de l'objet en paramètre, ainsi que de tous ses sous objets.
 * 
 * TODO : vérifier la charge mémoire et le temps de traitement.
 * Cette fonction est différente de la fonction clone du fmk jQuery
 * qui permet de cloner des elements du DOM uniquement.
 */
var clone = function (object) {
        if (typeof object == "object") {
                if (object == null) { return null; }
                var newElement = jQuery.extend({}, object);
                for(var subElementIndex in newElement) {
                        if (typeof newElement[subElementIndex] == "object") {
                                newElement[subElementIndex] = clone(newElement[subElementIndex]);
                        }
                }
                return newElement;
        } else {
                console.error("Unable to clone a non object element");
                return null;
        }
};
/** Est ce qu'un objet est un tableau. 
 * @return true/false
 */
isArray = function (object) {
        return object instanceof Array ;
};

/** Supprime tous les arobases des noms d'attributs d'un objet JSON
 * @param objet
 * @return nouvel objet ou tableau
 */
removeArobaseAttribute = function (object) {
        if (typeof object != "object") {
                return object;
        }
        var newObject = null;
        if (isArray(object)) {
                newObject = [];
                for (var i in object) {
                        newObject.push(removeArobaseAttribute(object[i]));
                }
        } else {
                newObject = {};
                for (attributeId in object) {
                        var attributeKey = (attributeId[0] == "@") ? attributeId.substr(1) : attributeId;
                        newObject[attributeKey] = removeArobaseAttribute(object[attributeId]);
                }
        }
        
        return newObject;
};

/** 
 * Remplit de zero un nombre sur une taille donnée. 
 */
fz = function(number, size) {
        if(typeof number != "string" && typeof number != "number") {
                return null;
        }
        while(("" + number).length < size) {
                number = "0" + number;
        }
        return number;
} 


/** Parse un booleen. 
 * Tolère 
 * <ul>
 *      <li>les string (doit être égal EXACTEMENT à "true")</li>
 *  <li>Les nombres : == 1</li>
 *  <li>Les booléens</li>
 */
function parseBoolean(value) {
        switch(typeof value) {
                case "string": 
                        return /^true$/i.test(value);
                case "number":
                        return value == 1;
                case "boolean": 
                        return value;
        }
        return false;
}



/**
 * Tri les éléments d'une liste.
 */
sortAlpha = function(elements, revert) {
        var sorted = elements.sort(function(a, b){
                if(revert){
                        return $(a).text() > $(b).text() ? -1 : 1;
                }else{
                        return $(a).text() < $(b).text() ? -1 : 1;
                }
                
        });
        
        return sorted;
};

Array.indexOfByAttr = function(array, attr, value){
        var index = 0;
        var found = false;
        while(index < array.length && !found){
                found = array[index][attr] == value;
                index++;
        }
        if(!found){
                return -1;
        }
        return index - 1;
        
}


Array.indexOfById = function(array, id){
        return Array.indexOfByAttr(array, "id", id);
};


Array.getElementByAttr = function(array, attr, value){
        var index = Array.indexOfByAttr(array, attr, value);
        if(index<0){
                return null;
        }else{
                return array[index];
        }
}

Array.getElementById = function(array, id){
        return Array.getElementByAttr(array,"id",id);
}

var wait = function (ms) {
        ms += new Date().getTime();
        while (new Date() < ms){}
} ;


Array.getElementsByAttr= function(array, attr, value){
        var elements = [];
        for(var i=0 ; i < array.length; i++){
                if(array[i][attr] == value){
                        elements.push(array[i]);
                }
        }
        return elements;
}

/**
 * ajoute une méthode de comparaison au prototye de la classe Array.
 * Si le tableau contient des tableaux ou des objets, la comparaison est executée en profondeur.
 * */
Array.areEquals = function(obj1, obj2){
        if (!obj2)
        return false;

    if (obj1.length != obj2.length)
        return false;

    for (var i = 0; i < obj1.length; i++) {
        // Check for arrays inside and proceed deep compare
        if (obj1[i] instanceof Array && obj2[i] instanceof Array) {
            if (!Array.areEquals(obj1[i], obj2[i]))
                return false;       
        }
        // Check for objects inside and proceed deep compare
        else if(obj1[i] instanceof Object && obj2[i] instanceof Object){
                if(!Object.areEquals(obj1[i], obj2[i])){
                        return false;
                }
        }
        else if (obj1[i] != obj2[i]) { 
            return false;   
        }           
    }       
    return true;
};
/**
 * ajoute une méthode de comparaison au prototye de la classe Object.
 * Si l'objet contient des tableaux ou des objets, la comparaison est executée en profondeur.
 * */

Object.areEquals = function(obj1, obj2){
        var propName;
    for (propName in obj1) {
        // check if this properties are present in that properties
        if (obj1.hasOwnProperty(propName) != obj2.hasOwnProperty(propName)) {
            return false;
        }
        //Check types
        else if (typeof obj1[propName] != typeof obj2[propName]) {
            return false;
        }
    }
   
    for(propName in obj2) { 
         // check if that properties are present in this properties
        if (obj2.hasOwnProperty(propName) != obj1.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof obj2[propName] != typeof obj1[propName]) {
            return false;
        }

        // check for arrays insinde and proceed deep compare
        if (obj1[propName] instanceof Array && obj2[propName] instanceof Array) {
           if (!obj1[propName].equals(obj2[propName])){
                   return false;
           }
        }
        // check for objects inside and proceed deep compare 
        else if (obj1[propName] instanceof Object && obj2[propName] instanceof Object) {
           if (areEquals(obj1[propName], obj2[propName])){
                   return false;   
           }
        }
        // check values from primitive types
        else if(obj1[propName] != obj2[propName]) {
           return false;
        }
    }
    return true;
};

/** Met le programme en pause. */
function pause(millis)
{
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); }
    while(curDate-date < millis);
}
