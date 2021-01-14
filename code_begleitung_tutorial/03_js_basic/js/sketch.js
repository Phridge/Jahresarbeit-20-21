//Erster Code
let message = "Das ist eine Nachricht!";
window.alert(message);
console.log(message);

//Erster Code 2
let message = "Das ist eine Nachricht!";
let reply = "Das ist eine Antwort!"
window.alert(message + reply);
let numberA = 20;
let numberB = 22;
let numberC = numberA + numberB;
console.log("20 + 22 = " + numberC);
console.log("Zwanzig plus Zweiundzwanzig ist " + (numberA + numberB));

//Funktionen
function addNumbers(a, b) {
    let c = a + b;
    console.log("Die Antwort ist " + c);
}
addNumbers(3, 5);
addNumbers(10, 14);

function f(x) {
    return 5 * x + 3;
}
console.log("5 * 5 + 3 = " + f(5));

//Verzweigungen
function min(a, b) {
    if(a < b) {
        return a;
    } else {
        return b;
    }
}

console.log(min(2, 1));
console.log(min(4, 7));

//Schleifen
function printRepeat(value, times) {
    for (let i = 0; i < times; i++) {
        console.log(value);
    } 
};

printRepeat("Wiederholung", 10);