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
    let b1 = document.getElementById("input-first-b").value;
    let c1 = document.getElementById("input-first-c").value;
    let d1 = document.getElementById("input-first-d").value;

    let a2 = document.getElementById("input-second-a").value;
    let b2 = document.getElementById("input-second-b").value;
    let c2 = document.getElementById("input-second-c").value;
    let d2 = document.getElementById("input-second-d").value;

    a1 = a1.split(",").map((num) => parseInt(num));
    a2 = a2.split(",").map((num) => parseInt(num));
    b1 = b1.split(",").map((num) => parseInt(num));
    b2 = b2.split(",").map((num) => parseInt(num));
    c1 = c1.split(",").map((num) => parseInt(num));
    c2 = c2.split(",").map((num) => parseInt(num));
    d1 = d1.split(",").map((num) => parseInt(num));
    d2 = d2.split(",").map((num) => parseInt(num));

    let A = [a1, a2];
    let B = [b1, b2];
    let C = [c1, c2];
    let D = [d1, d2];

    let M1Indexes = [];
    let M2Indexes = [];

    for (let j = 0; j < input_text.length - 2; j++) {
      // Get the last two vectors in A, B, C, and D
      let lastTwoA = A.slice(-2);
      let lastTwoB = B.slice(-2);
      let lastTwoC = C.slice(-2);
      let lastTwoD = D.slice(-2);

      let M1 = [lastTwoA[0], lastTwoB[0], lastTwoC[0], lastTwoD[0]];
      let M2 = [lastTwoA[1], lastTwoB[1], lastTwoC[1], lastTwoD[1]];

      // Populate M1Indexes with the indexes of vectors in M1
      for (let i = 0; i < M1.length; i++) {
        const index = galoisField.findIndex((element) =>
          element.every((value, j) => value === M1[i][j])
        );
        M1Indexes.push(index);
      }

      // Populate M2Indexes with the indexes of vectors in M2
      for (let i = 0; i < M2.length; i++) {
        const index = galoisField.findIndex((element) =>
          element.every((value, j) => value === M2[i][j])
        );
        M2Indexes.push(index);
      }

      let produc1 = M1Indexes[0] + M2Indexes[0];
      let produc2 = M1Indexes[1] + M2Indexes[2];
      let vector1 = galoisField[produc1 % (galoisField.length - 1)];
      let vector2 = galoisField[produc2 % (galoisField.length - 1)];
      aN = [
        (vector1[0] + vector2[0]) % primeGalois,
        (vector1[1] + vector2[1]) % primeGalois,
      ];
      produc1 = M1Indexes[0] + M2Indexes[1];
      produc2 = M1Indexes[1] + M2Indexes[3];
      vector1 = galoisField[produc1 % (galoisField.length - 1)];
      vector2 = galoisField[produc2 % (galoisField.length - 1)];
      bN = [
        (vector1[0] + vector2[0]) % primeGalois,
        (vector1[1] + vector2[1]) % primeGalois,
      ];
      produc1 = M1Indexes[2] + M2Indexes[0];
      produc2 = M1Indexes[3] + M2Indexes[2];
      vector1 = galoisField[produc1 % (galoisField.length - 1)];
      vector2 = galoisField[produc2 % (galoisField.length - 1)];
      cN = [
        (vector1[0] + vector2[0]) % primeGalois,
        (vector1[1] + vector2[1]) % primeGalois,
      ];
      produc1 = M1Indexes[2] + M2Indexes[1];
      produc2 = M1Indexes[3] + M2Indexes[3];
      vector1 = galoisField[produc1 % (galoisField.length - 1)];
      vector2 = galoisField[produc2 % (galoisField.length - 1)];
      dN = [
        (vector1[0] + vector2[0]) % primeGalois,
        (vector1[1] + vector2[1]) % primeGalois,
      ];

      A.push(aN);
      B.push(bN);
      C.push(cN);
      D.push(dN);
    }

    let Y = [];

    for (let i = 0; i < input_text.length; i++) {
      let temp = [];
      let letterIndex = lettersArray.indexOf(input_text[i]);

      let index2 = galoisField.findIndex((element) =>
        element.every((value, k) => value === A[i][k])
      );
      let index3 = galoisField.findIndex((element) =>
        element.every((value, k) => value === C[i][k])
      );
      let indexA = (letterIndex + index2) % (galoisField.length - 1);
      let indexC = (letterIndex + index3) % (galoisField.length - 1);
      let tempA = findVectorAtIndex(galoisField, indexA);
      let div1 = [];
      let div2 = [];

      if (tempA) {
        let tempC = findVectorAtIndex(galoisField, indexC);
        for (let k = 0; k < tempA.length; k++) {
          let sum1 = (tempA[k] + B[i][k]) % primeGalois;
          div1.push(sum1);
          let sum2 = (tempC[k] + D[i][k]) % primeGalois;
          div2.push(sum2);
        }
        let div1Index = galoisField.findIndex((element) =>
          element.every((value, k) => value === div1[k])
        );

        let div2Index = galoisField.findIndex((element) =>
          element.every((value, k) => value === div2[k])
        );

        let diff = 0;
        if (div1Index > div2Index) {
          diff = (div1Index - div2Index) % galoisField.length;
        } else {
          diff =
            (div1Index - div2Index + galoisField.length - 1) %
            galoisField.length;
        }
        temp = findVectorAtIndex(galoisField, diff);
        Y.push(temp);
      } else {
        Y.push(Array(powGalois).fill(0));
      }
    }

    for (let i = 0; i < input_text.length; i++) {
      const row = document.createElement("tr");
      const letterCell = document.createElement("td");
      const lettersIndexCell = document.createElement("td");
      const galoisFieldVectorCell = document.createElement("td");
      const yVectorCell = document.createElement("td");
      const yVectorIndexCell = document.createElement("td");
      const encryptedLetterCell = document.createElement("td");

      letterCell.innerText = input_text[i];
      lettersIndexCell.innerText = lettersArray.indexOf(input_text[i]);
      let letterIndex = lettersArray.indexOf(input_text[i]);
      let index1 = galoisValues.find(
        (v) => galoisValues[v] === letterIndex + 1
      );
      galoisFieldVectorCell.innerText = galoisField[index1];
      yVectorCell.innerText = Y[i];
      const yVectorIndex = galoisField.findIndex((element) =>
        element.every((value, k) => value === Y[i][k])
      );
      yVectorIndexCell.innerText = yVectorIndex;

      encryptedLetterCell.innerText = lettersArray[yVectorIndex];

      row.appendChild(letterCell);
      row.appendChild(lettersIndexCell);
      row.appendChild(galoisFieldVectorCell);
      row.appendChild(yVectorCell);
      row.appendChild(yVectorIndexCell);
      row.appendChild(encryptedLetterCell);
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
