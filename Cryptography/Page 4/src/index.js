const textarea = document.getElementById("input-text");
const maxHeight = 8 * 16; // 8rem * 16px (default font size)
const foo = document.getElementById("main");
const foo2 = document.getElementsByClassName("sec2")[0];

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lettersArray = letters.split("");

textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  const height = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${height}px`;
});

function findVectorAtIndex(vectors, index) {
  for (let i = 0; i < vectors.length; i++) {
    if (i === index) {
      return vectors[i];
    }
  }
  return null; // return null if vector is not found
}

function generateGalois(primeGalois, powGalois, matrix) {
  // Initialize an empty matrix to store the elements of the Galois field
  const galoisField = [];

  // Initialize the first vector with zeros
  const firstVector = [];
  for (let i = 0; i < powGalois; i++) {
    firstVector.push(0);
  }
  galoisField.push(firstVector);

  // Create the remaining vectors
  for (let i = 1; i < powGalois; i++) {
    const vector = [];
    for (let j = powGalois - 1; j >= 0; j--) {
      if (j === i) {
        vector.push(1);
      } else {
        vector.push(0);
      }
    }
    galoisField.push(vector);
  }

  // Generate the powGalois vector using the input matrix
  const inputVector = matrix[1].slice();
  let fourthVector = [];

  // Unshift the input vector
  inputVector.shift();

  // Switch the signs
  for (let i = 0; i < inputVector.length; i++) {
    if (inputVector[i] != 0) {
      fourthVector.push(inputVector[i] * -1);
    } else {
      fourthVector.push(0);
    }
  }

  // Sum every negative number with the nearest positive multiple of primeGalois that makes the negative number a positive
  for (let i = 0; i < fourthVector.length; i++) {
    if (fourthVector[i] < 0) {
      let absValue = Math.abs(fourthVector[i]);
      let multiplier = Math.ceil(absValue / primeGalois);
      fourthVector[i] += multiplier * primeGalois;
    }
  }

  // Modulo the values to make them positive
  for (let i = 0; i < fourthVector.length; i++) {
    fourthVector[i] = fourthVector[i] % primeGalois;
  }

  galoisField.push(fourthVector);

  // Generate the remaining vectors
  for (let j = powGalois + 1; j < primeGalois ** powGalois; j++) {
    let remainingVector = galoisField[j - 1];
    remainingVector = remainingVector.concat([0]);
    if (remainingVector[0] === 0) {
      remainingVector.shift();
    } else {
      for (let i = 0; i < galoisField[j - 1].length; i++) {
        remainingVector[i + 1] =
          (remainingVector[i + 1] +
            remainingVector[0] * galoisField[powGalois][i]) %
          primeGalois;
      }
      remainingVector.shift();
    }
    galoisField.push(remainingVector);
  }
  // Generate values for each power of t
  let galoisValues = [];
  for (let i = 0; i < primeGalois ** powGalois; i++) {
    let temp = 0;
    for (let j = 0; j < powGalois; j++) {
      temp += galoisField[i][j] * primeGalois ** matrix[0][j + 1];
    }
    galoisValues.push(temp);
  }

  return [galoisField, galoisValues];
}

function printGT(galoisField, prime, power, galoisValues) {
  const rez = document.getElementsByClassName("result")[0];
  for (let k = 0; k < prime ** power; k++) {
    temp = document.createElement("div");
    temp.classList.add("child");
    temp2 = document.createElement("h1");
    temp2.innerText = "t^" + k;
    temp3 = document.createElement("h1");
    temp3.innerText = galoisField[k];
    temp4 = document.createElement("h1");
    temp4.innerText = galoisValues[k];

    temp.appendChild(temp2);
    temp.appendChild(temp3);
    temp.appendChild(temp4);
    rez.appendChild(temp);
  }
}

document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  console.clear();
  const tableBody = document.getElementById("table-body");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-1-2")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("sec-2")[0];
  if (prel0) prel0.remove();

  const primeGaloisInput = document.getElementById("input-prime-galois");
  const powGaloisInput = document.getElementById("input-pow-galois");

  const primeGalois = parseInt(primeGaloisInput.value);
  const powGalois = parseInt(powGaloisInput.value);

  // Get the polynomial string from the textarea
  const polyString = document.getElementById("input-poly").value;

  // Split the string into individual terms using a regular expression
  const terms = polyString.split(/([+-])/);

  // Remove any empty strings from the array of terms
  const cleanedTerms = terms.filter((term) => term !== "");

  // Initialize an empty matrix to store the powers and coefficients
  const matrix = [[], []];

  // Loop through each term and extract the exponent and coefficient
  for (let i = 0; i < cleanedTerms.length; i++) {
    // Get the current term and remove any whitespace
    const term = cleanedTerms[i].trim();

    // Get the exponent and coefficient of the term
    const match = term.match(/([0-9]*)(t\^[0-9]+)/);

    if (match) {
      const coefficient = match[1] === "" ? 1 : parseInt(match[1]);
      const power = parseInt(match[2].substring(2));
      matrix[0].push(power);
      matrix[1].push(coefficient);
    }
  }

  const [galoisField, galoisValues] = generateGalois(
    primeGalois,
    powGalois,
    matrix
  );

  const onesCount = galoisValues.filter((value) => value === 1).length;
  if (onesCount === 1) {
    foo2.classList.remove("invisible");
    let prel = document.createElement("div");
    prel.classList.add("result");
    foo.appendChild(prel);
    printGT(galoisField, primeGalois, powGalois, galoisValues);
    //-------------------------------------------
    const input_text = document
      .getElementById("input-text")
      .value.toUpperCase();

    let a1 = document.getElementById("input-first-a").value;
    let a2 = document.getElementById("input-second-a").value;
    let b1 = document.getElementById("input-first-b").value;
    let b2 = document.getElementById("input-second-b").value;

    a1 = a1.split(",").map((num) => parseInt(num));
    a2 = a2.split(",").map((num) => parseInt(num));
    b1 = b1.split(",").map((num) => parseInt(num));
    b2 = b2.split(",").map((num) => parseInt(num));

    let A = [a1, a2];
    let B = [b1, b2];

    for (let i = 0; i < input_text.length - 2; i++) {
      // Get the last two vectors in A
      let lastTwoA = A.slice(-2);
      let lastTwoB = B.slice(-2);
      const index1 = galoisField.findIndex((element) =>
        element.every((value, i) => value === lastTwoB[0][i])
      );
      const index2 = galoisField.findIndex((element) =>
        element.every((value, i) => value === lastTwoB[1][i])
      );
      let index = (index1 + index2) % (galoisField.length - 1);

      // Add the two vectors to get a new vector
      let tempA = [];
      for (let j = 0; j < lastTwoA[0].length; j++) {
        tempA.push((lastTwoA[0][j] + lastTwoA[1][j]) % primeGalois);
      }
      let tempB = findVectorAtIndex(galoisField, index);

      // Push the new vector to A and B
      A.push(tempA);
      B.push(tempB);
    }

    let Y = [];
    for (let i = 0; i < input_text.length; i++) {
      let temp = [];
      let letterIndex = lettersArray.indexOf(input_text[i]);
      //console.log("index1: ", index1, lettersArray[index1]);

      let index1 = galoisValues.find(
        (v) => galoisValues[v] === letterIndex + 1
      );
      //console.log("index1: ", index1, galoisField[index1]);
      const index2 = galoisField.findIndex((element) =>
        element.every((value, k) => value === A[i][k])
      );
      //console.log("index2: ", index2, galoisField[index2]);
      let index = (index1 + index2) % (galoisField.length - 1);
      //console.log("index: ", index);
      let tempA = findVectorAtIndex(galoisField, index);
      if (tempA) {
        for (let k = 0; k < tempA.length; k++) {
          let sum = (tempA[k] + B[i][k]) % primeGalois;
          temp.push(sum);
        }
        Y.push(temp);
      } else {
        Y.push(Array(powGalois).fill(0));
      }
    }

    for (let i = 0; i < input_text.length; i++) {
      const row = document.createElement("tr");
      row.classList.add("result-2");
      const letterCell = document.createElement("td");
      const lettersIndexCell = document.createElement("td");
      const galoisValueIndexCell = document.createElement("td");
      const galoisFieldVectorCell = document.createElement("td");
      const aVectorCell = document.createElement("td");
      const aVectorIndexCell = document.createElement("td");
      const bVectorCell = document.createElement("td");
      const bVectorIndexCell = document.createElement("td");
      const yVectorIndexCell = document.createElement("td");
      const yLetterCell = document.createElement("td");

      letterCell.innerText = input_text[i];
      lettersIndexCell.innerText = lettersArray.indexOf(input_text[i]) + 1;
      let letterIndex = lettersArray.indexOf(input_text[i]);
      let index1 = galoisValues.find(
        (v) => galoisValues[v] === letterIndex + 1
      );
      galoisValueIndexCell.innerText = index1;
      galoisFieldVectorCell.innerText = galoisField[index1];
      aVectorCell.innerText = A[i];
      aVectorIndexCell.innerText = galoisField.findIndex((element) =>
        element.every((value, k) => value === A[i][k])
      );
      bVectorCell.innerText = B[i];
      bVectorIndexCell.innerText = galoisField.findIndex((element) =>
        element.every((value, k) => value === B[i][k])
      );
      const yVectorIndex = galoisField.findIndex((element) =>
        element.every((value, k) => value === Y[i][k])
      );
      let a = galoisValues[yVectorIndex];
      yVectorIndexCell.innerText = a;
      a = a % lettersArray.length; // length of the letters array
      a--;
      if ((a + 1) % lettersArray.length == 0) {
        yLetterCell.innerText = " ";
      } else {
        yLetterCell.innerText = lettersArray[a];
      }

      row.appendChild(letterCell);
      row.appendChild(lettersIndexCell);
      row.appendChild(galoisFieldVectorCell);
      row.appendChild(galoisValueIndexCell);
      row.appendChild(aVectorCell);
      row.appendChild(aVectorIndexCell);
      row.appendChild(bVectorCell);
      row.appendChild(bVectorIndexCell);
      row.appendChild(yVectorIndexCell);
      row.appendChild(yLetterCell);
      tableBody.appendChild(row);
    }
  } else {
    alert(
      "No galois field found for the given prime number and power and the given input polynomial"
    );
  }
});

document.getElementById("delete").addEventListener("click", function (e) {
  console.clear();
  e.preventDefault();
  e.stopPropagation();

  foo2.classList.add("invisible");

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-1-2")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-2")[0];
  if (prel0) prel0.remove();
});
