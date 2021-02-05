// in das Dokument schreiben während die Seite geladen wird
document.write("Hallo Dokument!");

// den Text-Inhalt des Titels ändern
let titel = document.getElementById("titel");
titel.innerText = "Ein schöner Titel";

// DOM-Objekte über "getElementsByTagName" abfragen
let canvas = document.getElementsByTagName("canvas");
console.log(canvas);
canvas = canvas[0];
console.log(canvas);

// Attribute des Canvas ändern
console.log(canvas.getAttribute("width"));
canvas.setAttribute("height", 666);
console.log(canvas.getAttribute("height"));

// Demonstration von "querySelectorAll"
// in diesem Fall "alle Elemente mit der id "liste""
let liste = document.querySelectorAll("#liste")[0];

// neues Element erstellen
let newElement = document.createElement("li");

// den HTML-Inhalt ändern
newElement.innerHTML = "Zweites Element <i>sogar mit Tags!</i>";

// das neue Element an ein anderes anfügen
liste.appendChild(newElement);

// Ein "Test-Element", also rohen Text, anhängen
newElement.appendChild(document.createTextNode("<h2>Browser austricksen leicht gemacht!</h2>"));