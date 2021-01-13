let someString = "Evolution!";

// let someString = "Was anderes!" // nicht machen

console.log(someString);

window.alert(someString);

function printRepeat(value, times) {
    let i = 0;

    while(i < times) {
        console.log(value);
        i = i + 1;
    }
}

printRepeat(someString, 5)

printRepeat = function(value, times) {
    for (let i = 0; i < times; i++) {
        console.log(value);
    } 
};

printRepeat(someString, 5);

let doRepeat = (func, times) => {
    for(let i = 0; i < times; i++) {
        func();
    }
};

doRepeat(
    () => alert("Hello World!"),
    3
);

function add(a, b) {
    return a + b
}

console.log(add("123", "456"))
console.log(add(123, 456))
console.log(add("123", 456))
console.log(add(123, "456"))

function min(a, b) {
    if(a < b) {
        return a
    } else {
        return b
    }
}

let print = console.log

print(min(2, 1))
print(min(4, 7))
print(min("Hello", "World"))
