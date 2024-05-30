Array.prototype.includes;

const radioButtons = document.getElementsByName("select");

const foo = document.getElementById("main");
const textarea = document.getElementById("input-text");
const textarea2 = document.getElementById("input-text-2");

const radioButtons1 = document.getElementsByName("select");
const radioButtons2 = document.getElementsByName("select2");

let store = "",
  shift = 1,
  encrypted = "";
let temp, temp1, temp2, temp3;

const romanianAlphabet = [
  "a",
  "ă",
  "â",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "î",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "ș",
  "t",
  "ț",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "Ă",
  "Â",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "Î",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "Ș",
  "T",
  "Ț",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const russianAlphabet = [
  "а",
  "б",
  "в",
  "г",
  "д",
  "е",
  "ё",
  "ж",
  "з",
  "и",
  "й",
  "к",
  "л",
  "м",
  "н",
  "о",
  "п",
  "р",
  "с",
  "т",
  "у",
  "ф",
  "х",
  "ц",
  "ч",
  "ш",
  "щ",
  "ъ",
  "ы",
  "ь",
  "э",
  "ю",
  "я",
  "ѐ",
  "ё",
  "ѓ",
  "є",
  "і",
  "ї",
  "ј",
  "љ",
  "њ",
  "ћ",
  "ќ",
  "ў",
  "ґ",
  "ң",
  "ү",
  "ә",
  "ө",
  "ғ",
  "қ",
  "ң",
  "А",
  "Б",
  "В",
  "Г",
  "Д",
  "Е",
  "Ё",
  "Ж",
  "З",
  "И",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ф",
  "Х",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ъ",
  "Ы",
  "Ь",
  "Э",
  "Ю",
  "Я",
  "Ѐ",
  "Ѓ",
  "Є",
  "І",
  "Ї",
  "Ј",
  "Љ",
  "Њ",
  "Ћ",
  "Ќ",
  "Ў",
  "Ґ",
  "Ң",
  "Ү",
  "Ә",
  "Ө",
  "Ғ",
  "Қ",
  "Ң",
];

const generalAlphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function caesarCipher(text, shift, alphabet) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    let char = text[i];

    let index = alphabet.indexOf(char.toUpperCase());

    if (index !== -1) {
      let isUpperCase = char === char.toUpperCase();
      let isLowerCase = char === char.toLowerCase();
      let newIndex =
        (index + parseInt(shift) + alphabet.length) % alphabet.length;
      if (isUpperCase) {
        result += alphabet[newIndex].toUpperCase();
      } else if (isLowerCase) {
        result += alphabet[newIndex].toLowerCase();
      }
    } else {
      result += char;
    }
  }
  return result;
}

function stage1(shift) {
  let rez = document.getElementsByClassName("result")[0];

  for (let i = 0; i < store.length; i++) {
    if (store[i] === "ş") {
      store = store.substring(0, i) + "ș" + store.substring(i + 1);
    }
    if (store[i] === "ţ") {
      store = store.substring(0, i) + "ț" + store.substring(i + 1);
    }
  }

  switch (document.querySelector('input[name="select2"]:checked').id) {
    case "option-1_1":
      encrypted = caesarCipher(store, shift, romanianAlphabet);
      break;
    case "option-2_1":
      encrypted = caesarCipher(store, shift, russianAlphabet);
      break;
    case "option-3_1":
      encrypted = caesarCipher(store, shift, generalAlphabet);
      break;
    default:
      // Handle unexpected values
      console.log("Unexpected value selected");
      break;
  }
  temp = document.createElement("div");
  temp.classList.add("fraza");
  temp2 = document.createElement("h1");
  temp2.innerText = encrypted;
  temp3 = document.createElement("button");
  temp3.innerText = "COPY";
  temp3.setAttribute("id", "copy-btn-1");
  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  document.getElementById("copy-btn-1").addEventListener("click", function (e) {
    e.stopPropagation();
    navigator.clipboard
      .writeText(encrypted)
      .then(function () {
        alert("TEXT COPIED!");
      })
      .catch(function (error) {
        console.error("COPY ERROR: ", error);
      });
  });
}

document.getElementById("submit").addEventListener("click", function (e) {
  matrix = [];
  console.clear();
  e.preventDefault();
  e.stopPropagation();

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();

  shift = textarea2.value;
  store = textarea.value;

  if (store.length > 0 && shift.length > 0) {
    let prel = document.createElement("div");
    prel.classList.add("result");
    foo.appendChild(prel);

    shift = parseInt(shift);
    switch (document.querySelector('input[name="select"]:checked').id) {
      case "option-1":
        stage1(shift);
        break;
      case "option-2":
        stage1(-shift);
        break;
      default:
        // Handle unexpected values
        console.log("Unexpected value selected");
        break;
    }
  }
});

document.getElementById("delete").addEventListener("click", function (e) {
  console.clear();
  e.preventDefault();
  e.stopPropagation();

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();
});
