Array.prototype.includes;

const radioButtons = document.getElementsByName("select");

const foo = document.getElementById("main");
const foo2 = document.getElementsByClassName("sec2")[0];
const foo3 = document.getElementsByClassName("sec3")[0];
const foo4 = document.getElementsByClassName("sec4")[0];
const foo5 = document.getElementsByClassName("sec1_2")[0];
const textarea = document.getElementById("input-text");

var btn = document.getElementById("pop-up-btn");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

let store = "";
let totalPer,
  temp,
  temp1,
  temp2,
  temp3,
  temp4,
  temp5,
  encodedString1 = "",
  encodedString2 = "",
  codes = [],
  matrix = [],
  matrix2 = [],
  words = [],
  characters = [];

const massLetters = [
  // Latin alphabet
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
  "à",
  "á",
  "â",
  "ã",
  "ä",
  "å",
  "æ",
  "ç",
  "è",
  "é",
  "ê",
  "ë",
  "ì",
  "í",
  "î",
  "ï",
  "ð",
  "ñ",
  "ò",
  "ó",
  "ô",
  "õ",
  "ö",
  "ø",
  "ù",
  "ú",
  "û",
  "ü",
  "ý",
  "þ",
  "ÿ",
  // Cyrillic alphabet
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
  // Nordic alphabets
  "ä",
  "å",
  "ö",
  "æ",
  "ø",
  // Romanian special characters
  "ă",
  "â",
  "î",
  "ț",
  "ș",
  // Other special characters
  "ą",
  "ć",
  "č",
  "đ",
  "ę",
  "ė",
  "ě",
  "ł",
  "ń",
  "ň",
  "ő",
  "œ",
  "ř",
  "ś",
  "š",
  "ť",
  "ű",
  "ů",
  "ü",
  "ž",
  "ź",
  "ż",
];

const alphabet = [...new Set(massLetters)];

const numere = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

let punctuatie = [];

class Node {
  constructor(value, freq) {
    this.value = value;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

class Node2 {
  constructor(value, freq) {
    this.value = value;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

function toggleInput() {
  const toggle = document.querySelector(".toggle-switch");
  const textInput = document.getElementById("input-text");
  const fileInput = document.getElementById("fileInput");

  toggle.classList.toggle("active");

  if (toggle.classList.contains("active")) {
    textInput.style.display = "none";
    fileInput.style.display = "block";
  } else {
    textInput.style.display = "block";
    fileInput.style.display = "none";
  }
}

function finalStage1(rez, totalCount) {
  //Descent sorting
  matrix.sort(sortFunction);
  matrix2.sort(sortFunction);

  for (let k = 0; k < matrix.length; k++) {
    if (matrix[k][1] === 0) {
      continue;
    }

    temp = document.createElement("div");
    temp.classList.add("child");
    temp2 = document.createElement("h1");
    if (matrix[k][0] === " ") {
      temp2.innerText = "SPACE";
    } else if (matrix[k][0] === "\n") {
      temp2.innerText = "ENTER";
    } else if (matrix[k][0] === "\t") {
      temp2.innerText = "TAB";
    } else {
      temp2.innerText = matrix2[k][0];
    }
    temp3 = document.createElement("h1");
    temp3.innerText = matrix2[k][1];

    if (matrix[k][1] >= 10) {
      temp.classList.add("huge");
    } else if (matrix[k][1] < 10 && matrix[k][1] >= 5) {
      temp.classList.add("big");
    } else if (matrix[k][1] < 1) {
      temp.classList.add("small");
    } else {
      temp.classList.add("medium");
    }
    temp4 = document.createElement("h1");
    temp4.innerText = Math.fround(matrix[k][1]).toFixed(2) + "%";

    temp.appendChild(temp2);
    temp.appendChild(temp3);
    temp.appendChild(temp4);
    rez.appendChild(temp);
    totalPer += matrix[k][1];
  }

  temp = document.createElement("div");
  temp.classList.add("child");
  temp.classList.add("final");
  temp1 = document.createElement("h1");
  temp1.innerText = "TOT: " + store.length;
  temp2 = document.createElement("h1");
  temp2.innerText = totalCount;
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(totalPer).toFixed(2) + "%";

  temp.appendChild(temp1);
  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sortFunction(a, b) {
  if (a[1] === b[1]) {
    return 0;
  } else {
    return a[1] > b[1] ? -1 : 1;
  }
}

const linearSearch = (matrix, target) => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === target) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
};

function shannonFanoDecode(encoded, codes) {
  let decoded = "";
  let code = "";
  for (let i = 0; i < encoded.length; i++) {
    code += encoded[i];
    for (let j = 0; j < codes.length; j++) {
      if (codes[j][1] === code) {
        decoded += codes[j][0];
        code = "";
        break;
      }
    }
  }
  return decoded;
}

function shannonFano(input) {
  characters = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i][1] != 0) {
      characters.push(input[i]);
    }
  }

  let data = characters.map(([value, freq]) => new Node2(value, freq));

  // Recursive function to create the tree
  function createTree(nodes) {
    if (nodes.length == 1) {
      return nodes[0];
    } else {
      // Calculate the total frequency of the nodes
      let totalFreq = nodes.reduce((acc, node) => acc + node.freq, 0);

      // Calculate the index for the split
      let halfFreq = 0;
      let splitIndex = -1;
      let minDiff = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        halfFreq += nodes[i].freq;
        let diff = Math.abs(halfFreq - totalFreq / 2);
        if (diff < minDiff) {
          minDiff = diff;
          splitIndex = i;
        }
      }

      // Recursively create the left and right subtrees
      let leftTree = createTree(nodes.slice(0, splitIndex + 1));
      let rightTree = createTree(nodes.slice(splitIndex + 1));

      // Create a new node as the parent of the left and right subtrees
      let parent = new Node2(null, totalFreq);
      parent.left = leftTree;
      parent.right = rightTree;

      return parent;
    }
  }

  // Sort the data by frequency in descending order
  data.sort(function (a, b) {
    return b.freq - a.freq;
  });

  // Create the tree from the data
  let root = createTree(data);

  // Traverse the tree to assign codes to each node
  function assignCodes(node, code) {
    if (node.left) {
      assignCodes(node.left, code + "0");
    }
    if (node.right) {
      assignCodes(node.right, code + "1");
    }
    if (!node.left && !node.right) {
      node.code = code;
    }
  }
  if (store.length > 1) {
    assignCodes(root, "");
  } else {
    root.code = "0";
  }

  // Return the codes as an array of tuples
  return data.map((node) => [node.value, node.code]);
}

function stage1() {
  let rez = document.getElementsByClassName("result")[0];

  for (let i = 0; i < store.length; i++) {
    if (store[i].includes("ş")) {
      store[i] = "ș";
    }
    if (store[i].includes("ţ")) {
      store[i] = "ț";
    }
  }

  // Initialize a variable to keep track of the total count of Roman characters in the store array
  let totalCount = 0;

  // Loop through each element in the store array
  for (let i = 0; i < store.length; i++) {
    // If the current element is a Roman character, increment the total count
    totalCount++;
    if (
      !alphabet.includes(store[i]) &&
      !numere.includes(store[i]) &&
      !punctuatie.includes(store[i])
    ) {
      punctuatie.push(store[i]);
    }
  }

  let combined = alphabet.concat(numere, punctuatie);

  // Loop through each Roman character in the alphabet array
  for (let i = 0; i < combined.length; i++) {
    // Create two new rows for the matrix, with the current Roman character in the first column and 0 in the second column
    let row1 = [combined[i], 0];
    let row2 = [combined[i], 0];
    // Add the rows to the matrix and matrix2 arrays
    matrix.push(row1);
    matrix2.push(row2);
  }

  let calculate;
  // Loop through each combined character in the combined array again
  for (var j = 0; j < combined.length; j++) {
    // Set the stringsearch variable to the current combined character
    var stringsearch = combined[j];
    // Initialize a count variable to keep track of how many times the current combined character appears in the store array
    let count = 0;
    // Loop through each element in the store array, incrementing the count variable each time the current combined character is found
    for (
      var i = (count = 0);
      i < store.length;
      count += +(stringsearch === store[i++])
    );
    // Calculate the percentage of total Roman characters that the current combined character represents
    if (count != 0) {
      calculate = (count / totalCount) * 100 || 0;
    } else {
      calculate = 0;
    }

    // Find the row and column indices for the current Roman character in the matrix array using the linearSearch function
    [row, col] = linearSearch(matrix, combined[j]);
    // If the row and column indices are valid, set the second column of that row to the calculated percentage
    if (row != -1 && col != -1) matrix[row][col + 1] = calculate;

    // Find the row and column indices for the current Roman character in the matrix2 array using the linearSearch function
    [row, col] = linearSearch(matrix2, combined[j]);
    // If the row and column indices are valid, set the second column of that row to the count of occurrences of the current Roman character
    if (row != -1 && col != -1) matrix2[row][col + 1] = count;
  }
  for (let q = 0; q < radioButtons.length; q++) {
    radioButtons[q].addEventListener("click", function (e) {
      e.stopPropagation();
      switch (radioButtons[q].id) {
        case "option-1":
          (totalPer = 0), (totalCount = 0);
          for (let i = 0; i < store.length; i++) {
            // If the current element is a Roman character, increment the total count
            if (alphabet.includes(store[i])) totalCount++;
          }
          matrix = [];
          matrix2 = [];
          temp = document.getElementsByClassName("result")[0];
          while (temp.firstChild) {
            temp.removeChild(temp.firstChild);
          }

          // Loop through each Roman character in the alphabet array
          for (let i = 0; i < alphabet.length; i++) {
            // Create two new rows for the matrix, with the current Roman character in the first column and 0 in the second column
            let row1 = [alphabet[i], 0];
            let row2 = [alphabet[i], 0];
            // Add the rows to the matrix and matrix2 arrays
            matrix.push(row1);
            matrix2.push(row2);
          }

          // Loop through each combined character in the combined array again
          for (var j = 0; j < alphabet.length; j++) {
            // Set the stringsearch variable to the current combined character
            var stringsearch = alphabet[j];
            // Initialize a count variable to keep track of how many times the current combined character appears in the store array
            let count = 0;
            // Loop through each element in the store array, incrementing the count variable each time the current combined character is found
            for (
              var i = (count = 0);
              i < store.length;
              count += +(stringsearch === store[i++])
            );
            // Calculate the percentage of total Roman characters that the current combined character represents
            if (count != 0) {
              calculate = (count / totalCount) * 100 || 0;
            } else {
              calculate = 0;
            }

            // Find the row and column indices for the current Roman character in the matrix array using the linearSearch function
            [row, col] = linearSearch(matrix, alphabet[j]);
            // If the row and column indices are valid, set the second column of that row to the calculated percentage
            if (row != -1 && col != -1) matrix[row][col + 1] = calculate;

            // Find the row and column indices for the current Roman character in the matrix2 array using the linearSearch function
            [row, col] = linearSearch(matrix2, alphabet[j]);
            // If the row and column indices are valid, set the second column of that row to the count of occurrences of the current Roman character
            if (row != -1 && col != -1) matrix2[row][col + 1] = count;
          }
          finalStage1(rez, totalCount);
          break;
        case "option-2":
          (totalPer = 0), (totalCount = 0);
          for (let i = 0; i < store.length; i++) {
            // If the current element is a Roman character, increment the total count
            if (numere.includes(store[i])) totalCount++;
          }
          matrix = [];
          matrix2 = [];
          temp = document.getElementsByClassName("result")[0];
          while (temp.firstChild) {
            temp.removeChild(temp.firstChild);
          }
          // Loop through each Roman character in the alphabet array
          for (let i = 0; i < numere.length; i++) {
            // Create two new rows for the matrix, with the current Roman character in the first column and 0 in the second column
            let row1 = [numere[i], 0];
            let row2 = [numere[i], 0];
            // Add the rows to the matrix and matrix2 arrays
            matrix.push(row1);
            matrix2.push(row2);
          }

          // Loop through each combined character in the combined array again
          for (var j = 0; j < numere.length; j++) {
            // Set the stringsearch variable to the current combined character
            var stringsearch = numere[j];
            // Initialize a count variable to keep track of how many times the current combined character appears in the store array
            let count = 0;
            // Loop through each element in the store array, incrementing the count variable each time the current combined character is found
            for (
              var i = (count = 0);
              i < store.length;
              count += +(stringsearch === store[i++])
            );
            // Calculate the percentage of total Roman characters that the current combined character represents
            if (count != 0) {
              calculate = (count / totalCount) * 100 || 0;
            } else {
              calculate = 0;
            }

            // Find the row and column indices for the current Roman character in the matrix array using the linearSearch function
            [row, col] = linearSearch(matrix, numere[j]);
            // If the row and column indices are valid, set the second column of that row to the calculated percentage
            if (row != -1 && col != -1) matrix[row][col + 1] = calculate;

            // Find the row and column indices for the current Roman character in the matrix2 array using the linearSearch function
            [row, col] = linearSearch(matrix2, numere[j]);
            // If the row and column indices are valid, set the second column of that row to the count of occurrences of the current Roman character
            if (row != -1 && col != -1) matrix2[row][col + 1] = count;
          }
          finalStage1(rez, totalCount);
          break;
        case "option-3":
          (totalPer = 0), (totalCount = 0);
          for (let i = 0; i < store.length; i++) {
            // If the current element is a Roman character, increment the total count
            if (punctuatie.includes(store[i])) totalCount++;
          }
          matrix = [];
          matrix2 = [];
          temp = document.getElementsByClassName("result")[0];
          while (temp.firstChild) {
            temp.removeChild(temp.firstChild);
          }
          // Loop through each Roman character in the alphabet array
          for (let i = 0; i < punctuatie.length; i++) {
            // Create two new rows for the matrix, with the current Roman character in the first column and 0 in the second column
            let row1 = [punctuatie[i], 0];
            let row2 = [punctuatie[i], 0];
            // Add the rows to the matrix and matrix2 arrays
            matrix.push(row1);
            matrix2.push(row2);
          }

          // Loop through each combined character in the combined array again
          for (var j = 0; j < punctuatie.length; j++) {
            // Set the stringsearch variable to the current combined character
            var stringsearch = punctuatie[j];
            // Initialize a count variable to keep track of how many times the current combined character appears in the store array
            let count = 0;
            // Loop through each element in the store array, incrementing the count variable each time the current combined character is found
            for (
              var i = (count = 0);
              i < store.length;
              count += +(stringsearch === store[i++])
            );
            // Calculate the percentage of total Roman characters that the current combined character represents
            if (count != 0) {
              calculate = (count / totalCount) * 100 || 0;
            } else {
              calculate = 0;
            }

            // Find the row and column indices for the current Roman character in the matrix array using the linearSearch function
            [row, col] = linearSearch(matrix, punctuatie[j]);
            // If the row and column indices are valid, set the second column of that row to the calculated percentage
            if (row != -1 && col != -1) matrix[row][col + 1] = calculate;

            // Find the row and column indices for the current Roman character in the matrix2 array using the linearSearch function
            [row, col] = linearSearch(matrix2, punctuatie[j]);
            // If the row and column indices are valid, set the second column of that row to the count of occurrences of the current Roman character
            if (row != -1 && col != -1) matrix2[row][col + 1] = count;
          }
          finalStage1(rez, totalCount);
          break;
        case "option-4":
          (totalPer = 0), (totalCount = 0);
          for (let i = 0; i < store.length; i++) {
            // If the current element is a Roman character, increment the total count
            totalCount++;
          }
          matrix = [];
          matrix2 = [];
          temp = document.getElementsByClassName("result")[0];
          while (temp.firstChild) {
            temp.removeChild(temp.firstChild);
          }

          // Loop through each Roman character in the alphabet array
          for (let i = 0; i < combined.length; i++) {
            // Create two new rows for the matrix, with the current Roman character in the first column and 0 in the second column
            let row1 = [combined[i], 0];
            let row2 = [combined[i], 0];
            // Add the rows to the matrix and matrix2 arrays
            matrix.push(row1);
            matrix2.push(row2);
          }

          // Loop through each combined character in the combined array again
          for (var j = 0; j < combined.length; j++) {
            // Set the stringsearch variable to the current combined character
            var stringsearch = combined[j];
            // Initialize a count variable to keep track of how many times the current combined character appears in the store array
            let count = 0;
            // Loop through each element in the store array, incrementing the count variable each time the current combined character is found
            for (
              var i = (count = 0);
              i < store.length;
              count += +(stringsearch === store[i++])
            );
            // Calculate the percentage of total Roman characters that the current combined character represents
            if (count != 0) {
              calculate = (count / totalCount) * 100 || 0;
            } else {
              calculate = 0;
            }

            // Find the row and column indices for the current Roman character in the matrix array using the linearSearch function
            [row, col] = linearSearch(matrix, combined[j]);
            // If the row and column indices are valid, set the second column of that row to the calculated percentage
            if (row != -1 && col != -1) matrix[row][col + 1] = calculate;

            // Find the row and column indices for the current Roman character in the matrix2 array using the linearSearch function
            [row, col] = linearSearch(matrix2, combined[j]);
            // If the row and column indices are valid, set the second column of that row to the count of occurrences of the current Roman character
            if (row != -1 && col != -1) matrix2[row][col + 1] = count;
          }
          finalStage1(rez, totalCount);
          break;
        default:
          // Handle unexpected values
          console.log("Unexpected value selected");
          break;
      }
    });
  }
  finalStage1(rez, totalCount);
}

function probModel() {
  rez = document.getElementsByClassName("result-1-2")[0];

  let probM = [];
  for (let i = 0; i < matrix.length; i++) {
    if (alphabet.includes(matrix[i][0]) && matrix[i][1] !== 0) {
      probM.push(matrix[i]);
    }
  }

  if (probM.length === 0) {
    temp = document.createElement("div");
    temp.classList.add("h-child");
    temp5 = document.createElement("div");
    temp5.classList.add("horizontal-child");
    let temp6 = document.createElement("div");
    temp3 = document.createElement("h1");
    temp3.innerText = "NO DATA";
    temp6.appendChild(temp3);
    temp.appendChild(temp6);
    temp5.appendChild(temp);
    rez.appendChild(temp5);
  } else {
    probM.sort((a, b) => a[0].localeCompare(b[0]));

    temp = document.createElement("div");
    temp.classList.add("h-child");
    temp5 = document.createElement("div");
    temp5.classList.add("horizontal-child");
    for (let i = 0; i < probM.length; i++) {
      let temp6 = document.createElement("div");
      temp3 = document.createElement("h1");
      temp3.innerText =
        probM[i][0] + "\n\n" + Math.fround(probM[i][1]).toFixed(2) + "%";
      temp6.appendChild(temp3);
      temp.appendChild(temp6);
    }
    temp5.appendChild(temp);
    rez.appendChild(temp5);

    for (var i = 0; i < probM.length; i++) {
      probM[i][0] = probM[i][0].toLowerCase();
    }
  }
}

function stage2(m) {
  encodedString1 = "";
  const rez = document.getElementsByClassName("result-2")[0];

  for (let i = 0; i < store.length; i++) {
    for (let j = 0; j < m.length; j++) {
      if (m[j][0] === store[i]) {
        encodedString1 += m[j][1];
        break; // pentru a ieși din bucla for internă
      }
    }
  }

  temp = document.createElement("div");
  temp.classList.add("fraza");
  temp2 = document.createElement("h1");
  temp2.innerText = encodedString1;
  temp3 = document.createElement("button");
  temp3.innerText = "COPY";
  temp3.setAttribute("id", "copy-btn-1");
  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  document.getElementById("copy-btn-1").addEventListener("click", function (e) {
    e.stopPropagation();
    navigator.clipboard
      .writeText(encodedString1)
      .then(function () {
        alert("TEXT COPIED!");
      })
      .catch(function (error) {
        console.error("COPY ERROR: ", error);
      });
  });

  m.sort((a, b) => a[1].length - b[1].length);
  for (let k = 0; k < matrix.length; k++) {
    if (matrix[k][1] === 0) {
      continue;
    }
    temp = document.createElement("div");
    temp.classList.add("child");
    temp2 = document.createElement("h1");
    if (m[k][0] === " ") {
      temp2.innerText = "SPACE";
    } else if (m[k][0] === "\n") {
      temp2.innerText = "ENTER";
    } else if (m[k][0] === "\t") {
      temp2.innerText = "TAB";
    } else {
      temp2.innerText = m[k][0];
    }

    temp.classList.add("normal");
    temp4 = document.createElement("h1");
    temp4.innerText = m[k][1];

    temp.appendChild(temp2);
    temp.appendChild(temp4);
    rez.appendChild(temp);
  }
  temp = document.createElement("div");
  temp.classList.add("fraza-2");
  temp2 = document.createElement("h1");
  temp2.innerText = shannonFanoDecode(encodedString1, m);
  temp.appendChild(temp2);
  rez.appendChild(temp);
}

function getCol(matrix, col) {
  var column = [];
  for (var i = 0; i < matrix.length; i++) {
    column.push(matrix[i][col]);
  }
  return column; // return column data..
}

function huffmanDecode(encoded, encodingTable) {
  var decoded = "";
  var currentCode = "";
  for (var i = 0; i < encoded.length; i++) {
    currentCode += encoded.charAt(i);
    for (var char in encodingTable) {
      if (encodingTable[char] === currentCode) {
        decoded += char;
        currentCode = "";
        break;
      }
    }
  }
  return decoded;
}

function huffmanEncode(input) {
  var characters = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i][1] != 0) {
      characters.push(input[i]);
    }
  }

  // sort characters in descending order by frequency
  characters.sort(function (a, b) {
    if (a[1] === b[1]) {
      return a[0].localeCompare(b[0]);
    }
    return b[1] - a[1];
  });

  // initialize Huffman tree with leaves for each character and their frequency
  var tree = [];
  for (var i = characters.length - 1; i >= 0; i--) {
    tree.push({
      freq: characters[i][1],
      char: characters[i][0],
      left: null,
      right: null,
    });
  }

  // build Huffman tree by combining nodes with the two smallest frequencies
  while (tree.length > 1) {
    var node1 = tree.pop();
    var node2 = tree.pop();
    var parent = {
      freq: node1.freq + node2.freq,
      char: null,
      left: node2,
      right: node1,
    };
    tree.push(parent);
    // sort tree in descending order by frequency, then alphabetically if frequencies are equal
    tree.sort(function (a, b) {
      if (a.freq === b.freq) {
        if (a.char && b.char) {
          return a.char.localeCompare(b.char);
        } else {
          return 0;
        }
      }
      return b.freq - a.freq;
    });
  }

  // build Huffman encoding table by traversing tree and assigning codes to each character
  var encodingTable = {};
  if (tree.length > 0) {
    var traverseTree = function (node, code) {
      if (!node.left && !node.right) {
        encodingTable[node.char] = code;
      } else {
        traverseTree(node.left, code + "0");
        traverseTree(node.right, code + "1");
      }
    };
    traverseTree(tree[0], "");
  } else {
    encodingTable[characters[0][0]] = "0";
  }

  // calculate entropy
  var totalChars = 0;
  var characterFrequencies = {};
  for (var i = 0; i < characters.length; i++) {
    var char = characters[i][0];
    var freq = characters[i][1];
    characterFrequencies[char] = freq;
    totalChars += freq;
  }

  var entropy = 0;
  for (var char in characterFrequencies) {
    var freq = characterFrequencies[char];
    if (freq === 0) continue;
    var prob = freq / totalChars;
    entropy -= prob * Math.log2(prob);
  }

  // calculate average code length
  var weightedCodeLength = 0;
  for (var char in encodingTable) {
    var freq = characterFrequencies[char];
    var code = encodingTable[char];
    weightedCodeLength += freq * code.length;
  }
  var averageCodeLength = weightedCodeLength / totalChars;

  // calculate efficiency and redundancy
  var efficiency = entropy / averageCodeLength;
  var redundancy = 1 - efficiency;

  // calculate code capacity
  var codeCapacity = Math.log2(2);

  // returnam tabela de codificare Huffman, entropia, redundanta, eficienta si lungimea medie a codului
  return {
    encodingTable: encodingTable,
    source_Entropy: entropy,
    huffman_Redundancy: redundancy,
    huffman_Efficiency: efficiency,
    huffman_AverageCodeLength: averageCodeLength,
    huffman_CodeCapacity: codeCapacity,
  };
}

function stage3() {
  encodedString2 = "";
  const huffman = huffmanEncode(matrix);
  let rez = document.getElementsByClassName("result-3")[0];

  // Convert object to array of tuples
  let m = Object.entries(huffman.encodingTable);

  for (let i = 0; i < store.length; i++) {
    for (let j = 0; j < m.length; j++) {
      if (m[j][0] === store[i]) {
        encodedString2 += m[j][1];
        break; // pentru a ieși din bucla for internă
      }
    }
  }

  temp = document.createElement("div");
  temp.classList.add("fraza");
  temp2 = document.createElement("h1");
  temp2.innerText = encodedString2;
  temp3 = document.createElement("button");
  temp3.innerText = "COPY";
  temp3.setAttribute("id", "copy-btn-2");
  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  document.getElementById("copy-btn-2").addEventListener("click", function (e) {
    e.stopPropagation();
    navigator.clipboard
      .writeText(encodedString2)
      .then(function () {
        alert("TEXT COPIED!");
      })
      .catch(function (error) {
        console.error("COPY ERROR: ", error);
      });
  });

  // Sort array in descending order based on values
  m.sort((a, b) => a[1].length - b[1].length);

  for (let k = 0; k < matrix.length; k++) {
    if (matrix[k][1] === 0) {
      continue;
    }
    temp = document.createElement("div");
    temp.classList.add("child");
    temp2 = document.createElement("h1");
    if (m[k][0] === " ") {
      temp2.innerText = "SPACE";
    } else if (m[k][0] === "\n") {
      temp2.innerText = "ENTER";
    } else if (m[k][0] === "\t") {
      temp2.innerText = "TAB";
    } else {
      temp2.innerText = m[k][0];
    }

    temp.classList.add("normal");
    temp4 = document.createElement("h1");
    temp4.innerText = m[k][1];

    temp.appendChild(temp2);
    temp.appendChild(temp4);
    rez.appendChild(temp);
  }

  temp = document.createElement("div");
  temp.classList.add("fraza-2");
  temp2 = document.createElement("h1");
  temp2.innerText = huffmanDecode(encodedString2, huffman.encodingTable);
  temp.appendChild(temp2);
  rez.appendChild(temp);

  rez = document.getElementsByClassName("result-4")[0];
  const keys = Object.keys(huffman);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "1st Shannon's Theorem";
  temp.classList.add("huge");
  temp.classList.add("final");
  temp3 = document.createElement("h1");
  temp3.innerText =
    Math.fround(huffman[keys[1]] / Math.log2(2)).toFixed(4) +
    " ≤ " +
    huffman[keys[4]].toFixed(4) +
    " < " +
    Math.fround(huffman[keys[1]] / Math.log2(2) + 1).toFixed(4);

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Compress Rate";
  temp.classList.add("small");
  temp3 = document.createElement("h1");
  temp3.innerText =
    Math.fround(
      -1 * ((-1 + encodedString2.length / 8 / store.length) * 100)
    ).toFixed(2) + "%";

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Primary characters - {PC}";
  temp.classList.add("small");
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(store.length);

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Memory allocated | PC";
  temp.classList.add("small");
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(store.length).toFixed(2) + " Bytes";

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Binary characters - {BC}";
  temp.classList.add("small");
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(encodedString2.length);

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Memory allocated | BC";
  temp.classList.add("small");
  temp3 = document.createElement("h1");
  temp3.innerText =
    Math.fround(encodedString2.length / 8).toFixed(2) + " Bytes";

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Shannon Entropy";
  temp.classList.add("medium");
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(huffman[keys[1]]).toFixed(2);

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Code Capacity";
  temp.classList.add("medium");
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(huffman[keys[5]]).toFixed(2);

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Redundancy";
  temp.classList.add("medium");
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(huffman[keys[2]]).toFixed(2);

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Efficiency";
  temp.classList.add("medium");
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(huffman[keys[3]]).toFixed(2);

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("child");
  temp2 = document.createElement("h1");
  temp2.innerText = "Huffman Average Length";
  temp.classList.add("medium");
  temp3 = document.createElement("h1");
  temp3.innerText = Math.fround(huffman[keys[4]]).toFixed(2);

  temp.appendChild(temp2);
  temp.appendChild(temp3);
  rez.appendChild(temp);
}

document.getElementById("submit").addEventListener("click", function (e) {
  matrix = [];
  matrix2 = [];
  totalPer = 0;
  console.clear();
  e.preventDefault();
  e.stopPropagation();

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-1-2")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-2")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-3")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-4")[0];
  if (prel0) prel0.remove();

  store = textarea.value.toLowerCase();
  if (store.length > 0) {
    foo2.classList.remove("invisible");
    foo3.classList.remove("invisible");
    foo4.classList.remove("invisible");
    foo5.classList.remove("invisible");
    let prel = document.createElement("div");
    prel.classList.add("result");
    foo.appendChild(prel);
    prel = document.createElement("div");
    prel.classList.add("result-1-2");
    foo5.appendChild(prel);
    stage1();
    probModel();
    prel = document.createElement("div");
    prel.classList.add("result-2");
    foo2.appendChild(prel);
    codes = shannonFano(matrix);
    stage2(codes);
    prel = document.createElement("div");
    prel.classList.add("result-3");
    foo3.appendChild(prel);
    prel = document.createElement("div");
    prel.classList.add("result-4");
    foo4.appendChild(prel);
    stage3();
  }
});

document.getElementById("delete").addEventListener("click", function (e) {
  console.clear();
  e.preventDefault();
  e.stopPropagation();

  foo2.classList.add("invisible");
  foo3.classList.add("invisible");
  foo4.classList.add("invisible");
  foo5.classList.add("invisible");

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-1-2")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-2")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-3")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-4")[0];
  if (prel0) prel0.remove();
});

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
