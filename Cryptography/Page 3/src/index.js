Array.prototype.includes;

const radioButtons = document.getElementsByName("select");

const foo = document.getElementById("main");
const textarea = document.getElementById("input-text");
const textarea2 = document.getElementById("input-text-2");

const radioButtons1 = document.getElementsByName("select");
const radioButtons2 = document.getElementsByName("select2");

let store,
  shift = 1,
  encrypted = "";
let temp, temp1, temp2, temp3, temp4;

function tempAlert(msg, duration) {
  var el = document.createElement("div");
  el.setAttribute("id", "alert-msg");
  el.innerHTML = msg;
  setTimeout(function () {
    el.style.animation = "slide-up 0.5s ease-in-out";
    setTimeout(function () {
      el.parentNode.removeChild(el);
    }, 500);
  }, duration);
  document.body.appendChild(el);
}

function decimalToHexadecimal(store) {
  var hex = "";
  while (store > 0) {
    var remainder = store % 16;
    if (remainder < 10) {
      hex = remainder + hex;
    } else {
      hex = String.fromCharCode(remainder + 55) + hex;
    }
    store = Math.floor(store / 16);
  }
  var hexWithComma = "";
  for (var i = hex.length - 1, j = 1; i >= 0; i--, j++) {
    hexWithComma = hex.charAt(i) + hexWithComma;
    if (j % 2 === 0 && i !== 0) {
      hexWithComma = "," + hexWithComma;
    }
  }
  return hexWithComma;
}

function decimalToOctal(store) {
  var octal = "";
  while (store > 0) {
    var remainder = store % 8;
    octal = remainder + octal;
    store = Math.floor(store / 8);
  }
  return octal;
}

function decimalToTernary(store) {
  var ternary = "";
  while (store > 0) {
    var remainder = store % 3;
    ternary = remainder + ternary;
    store = Math.floor(store / 3);
  }
  return ternary;
}

function decimalToQuaternary(store) {
  var quaternary = "";
  while (store > 0) {
    var remainder = store % 4;
    quaternary = remainder + quaternary;
    store = Math.floor(store / 4);
  }
  return quaternary;
}

function decimalToQuinary(store) {
  var quinary = "";
  while (store > 0) {
    var remainder = store % 5;
    quinary = remainder + quinary;
    store = Math.floor(store / 5);
  }
  return quinary;
}

function decimalToSenary(store) {
  var senary = "";
  while (store > 0) {
    var remainder = store % 6;
    senary = remainder + senary;
    store = Math.floor(store / 6);
  }
  return senary;
}

function decimalToHeptal(store) {
  var heptal = "";
  while (store > 0) {
    var remainder = store % 7;
    heptal = remainder + heptal;
    store = Math.floor(store / 7);
  }
  return heptal;
}

function decimalToNonary(store) {
  var nonary = "";
  while (store > 0) {
    var remainder = store % 9;
    nonary = remainder + nonary;
    store = Math.floor(store / 9);
  }
  return nonary;
}

function decimalToDecimal(store) {
  return store.toString();
}

function decimalToSexagesimal(store) {
  var sexagesimal = "";
  while (store > 0) {
    var remainder = store % 60;
    sexagesimal = remainder.toString() + "," + sexagesimal;
    store = Math.floor(store / 60);
  }
  // Remove the trailing comma if there is one
  if (sexagesimal.charAt(sexagesimal.length - 1) === ",") {
    sexagesimal = sexagesimal.slice(0, -1);
  }
  return sexagesimal;
}

function decimalToDuodecimal(store) {
  var duodecimal = "";
  while (store > 0) {
    var remainder = store % 12;
    duodecimal = remainder.toString() + "," + duodecimal;
    store = Math.floor(store / 12);
  }
  if (duodecimal.charAt(duodecimal.length - 1) === ",") {
    duodecimal = duodecimal.slice(0, -1);
  }
  return duodecimal;
}

function decimalToBinary(store) {
  var binary = "";
  while (store > 0) {
    var remainder = store % 2;
    binary = remainder + binary;
    store = Math.floor(store / 2);
  }
  return binary;
}

function stage1() {
  let rez = document.getElementsByClassName("result")[0];
  let input = "";

  if (!isNaN(Number(store))) {
    input = store;
  } else {
    for (let i = 0; i < store.length; i++) {
      input += store.charCodeAt(i);
    }
  }
  parseInt(input);
  {
    let result = decimalToBinary(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Binary";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-1");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-1")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToTernary(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Base 3";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-2");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-2")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            alert("TEXT COPIED!");
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToQuaternary(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Base 4";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-3");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-3")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToQuinary(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Base 5";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-4");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-4")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToSenary(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Base 6";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-5");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-5")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(input)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToHeptal(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Base 7";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-6");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-6")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToOctal(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Octal";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-7");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-7")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToNonary(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Base 9";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-8");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-8")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Decimal";
    temp2 = document.createElement("h1");
    temp2.innerText = input;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-9");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-9")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(input)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToDuodecimal(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Base 12";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-10");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-10")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToHexadecimal(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "HEX";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-11");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-11")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }

  {
    let result = decimalToSexagesimal(input);
    temp = document.createElement("div");
    temp.classList.add("fraza");
    temp4 = document.createElement("h2");
    temp4.innerText = "Base 60";
    temp2 = document.createElement("h1");
    temp2.innerText = result;
    temp3 = document.createElement("button");
    temp3.innerText = "COPY";
    temp3.setAttribute("id", "copy-btn-12");
    temp.appendChild(temp4);
    temp.appendChild(temp2);
    temp.appendChild(temp3);
    rez.appendChild(temp);

    document
      .getElementById("copy-btn-12")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard
          .writeText(result)
          .then(function () {
            tempAlert("Copy to clipboard", 1500);
          })
          .catch(function (error) {
            console.error("COPY ERROR: ", error);
          });
      });
  }
}

document.getElementById("submit").addEventListener("click", function (e) {
  matrix = [];
  console.clear();
  e.preventDefault();
  e.stopPropagation();

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();

  store = textarea.value;
  if (!isNaN(Number(store))) {
    let prel = document.createElement("div");
    prel.classList.add("result");
    foo.appendChild(prel);
    stage1();
  }
});

document.getElementById("delete").addEventListener("click", function (e) {
  console.clear();
  e.preventDefault();
  e.stopPropagation();

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();
});
