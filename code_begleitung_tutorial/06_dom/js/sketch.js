
document.write("Hallo Dokument!");

let titel = document.getElementById("titel");
titel.innerText = "Ein schöner Titel";

let canvas = document.getElementsByTagName("canvas");
console.log(canvas);
canvas = canvas[0];
console.log(canvas);

console.log(canvas.getAttribute("width"));
canvas.setAttribute("height", 666);
console.log(canvas.getAttribute("height"));

let liste = document.querySelectorAll("#liste")[0];

let newElement = document.createElement("li");
newElement.innerHTML = "Zweites Element <i>sogar mit Tags!</i>";

liste.appendChild(newElement);
newElement.appendChild(document.createTextNode("<h2>Browser austricksen leicht gemacht!</h2>"));