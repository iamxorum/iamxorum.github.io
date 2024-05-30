Array.prototype.includes;

const radioButtons = document.getElementsByName("select");

const foo = document.getElementById("main");
const foo2 = document.getElementsByClassName("sec2")[0];
const foo3 = document.getElementsByClassName("sec3")[0];
const foo4 = document.getElementsByClassName("sec4")[0];
const foo5 = document.getElementsByClassName("sec5")[0];
const foo6 = document.getElementsByClassName("sec6")[0];
const textarea = document.getElementById("input-text");

function containsLetters(str, arr) {
  // Convert the string to lowercase to perform case-insensitive comparison

  // Iterate over each character in the string
  for (let i = 0; i < str.length; i++) {
      // Check if the character exists in the array
      if (arr.includes(str[i].toUpperCase())) {
          return true; // If found, return true
      }
  }
  return false; // If not found, return false
}

let storage = []; // Store non-terminals with the last rule and have length at least 2
const terminalmap = new Map();
let nonterminals_array = []; // Store non-terminals

function step_1(productionObjects, lastRule) {
    let lastRuleSymbol = lastRule; // The symbol 'p' to be removed

    let nonterminals_array = []; // Store non-terminals
    // Store the non-terminals
    productionObjects.forEach(obj => {
        nonterminals_array.push(obj.nonTerminal);
    });
    // Check if the non-terminal has the last rule and has a length of at least 2 {exclude the nonterminal "S"}  
    productionObjects.forEach(obj => {
        let productions = obj.productions.map(prod => {
            // Split production into components (assuming grammar symbols are separated by space or concatenation)
            return prod.split(/(?=[A-Z])| /) // Regex to split by uppercase letter or spaces
                .filter(symbol => symbol === lastRuleSymbol) // Check if the production contains the last rule
                .join(''); // Rejoin the production components
        });


        // Check if the non-terminal has the lastrule as value and has a length of at least 2 and store its length
        if (productions.some(prod => prod === lastRuleSymbol) && obj.nonTerminal !== "S" && obj.productions.length > 1) {
            storage.push(obj.nonTerminal);
        }
    });

    // Step 1: Filter out the lastRule from productions 
    let intermediateProductionObjects = productionObjects.map(obj => {
        return {
            nonTerminal: obj.nonTerminal,
            productions: obj.productions.filter(prod => prod.trim() !== lastRuleSymbol)
        };
    });

    // Remove the lastrule from productions that are like "pBc" where p is lastrule for example
    intermediateProductionObjects = intermediateProductionObjects.map(obj => {
        let productions = obj.productions.map(prod => {
            let index = 0;
            let newProd = '';
            while (index < prod.length) {
                let symbol = prod[index];
                if (symbol === lastRuleSymbol) {
                    index++;
                    continue;
                }
                newProd += symbol;
                index++;
            }
            return newProd;
        });

        return {
            nonTerminal: obj.nonTerminal,
            productions: productions
        };
    });

    // Step 2: Identify non-terminals with empty productions
    let emptyNonTerminals = intermediateProductionObjects
                                .filter(obj => obj.productions.length === 0)
                                .map(obj => obj.nonTerminal);

    // Step 3: Filter out non-terminals with empty productions from the productionObjects list and store the nonterminals with the last rule and have length at least 2
    let updatedProductionObjects = intermediateProductionObjects
      .filter(obj => obj.productions.length > 0)
      .map(obj => {
          let productions = obj.productions.map(prod => {
              if (containsLetters(prod, emptyNonTerminals)) {
                  let index = 0;
                  let newProd = '';
                  while (index < prod.length) {
                      let symbol = prod[index];
                      if (emptyNonTerminals.includes(symbol)) {
                          index++;
                          continue;
                      }
                      newProd += symbol;
                      index++;
                  }
                  return newProd;
              } 
              // Split production into components (assuming grammar symbols are separated by space or concatenation)
              return prod.split(/(?=[A-Z])| /) // Regex to split by uppercase letter or spaces
                  .filter(symbol => !emptyNonTerminals.includes(symbol)) // Filter out empty non-terminals
                  .join(''); // Rejoin the production components
          });

          // Remove from productions letters that are not in nonterminals_array
          productions = productions.map(prod => {
              let index = 0;
              let newProd = '';
              while (index < prod.length) {
                  let symbol = prod[index];
                  // Check if the symbol is lowercase
                  if (symbol === symbol.toLowerCase()) {
                      newProd += symbol;
                      index++;
                      continue;
                  }

                  if (nonterminals_array.includes(symbol)) {
                      newProd += symbol;
                  }
                  index++;
              }
              // if the newProd is empty, do not return it
              return newProd;
          });
          return {
              nonTerminal: obj.nonTerminal,
              productions: productions
          };
    });

    // Search for "" in the productions and remove it
    updatedProductionObjects = updatedProductionObjects.map(obj => {
        let productions = obj.productions.filter(prod => prod !== "");
        return {
            nonTerminal: obj.nonTerminal,
            productions: productions
        };
    });

    // pop the nonterminals that are not anymore in the productions
    storage = storage.filter(symbol => updatedProductionObjects.some(obj => obj.productions.some(prod => prod.includes(symbol))));

    // console.log("storage", storage);

    // Example:
    // lastrule = p
    // B -> p | c | CAD
    // C -> c | p
    // D -> d | p
    // B should become from B -> p | c | CAD to B -> c | CAD | CA | AD | A
    // C and D by having that "p" will create for B the following, togeher with c | CAD:
    // CA because the D has a p and we delete it from CAD;
    // AD because the C has a p and we delete it from CAD;
    // A because the C and D have a p and we delete it from CAD;
    // The same for the other non-terminals that have p in their productions

    // console.log("updatedProductionObjects", updatedProductionObjects);

    // Step 4: check if a non-terminal has a value that contains a nonterminal from the storage and check that that value has at least length 2
    let updatedProductionObjectsCopy = updatedProductionObjects.map(obj => {
      let productions = obj.productions.map(prod => {
          // Split production into components (assuming grammar symbols are separated by space or concatenation)
          // if is length 1, then we don't need to do anything
          if (prod.length === 1) return prod;
          // check if prod contains a symbol from the storage
          if (containsLetters(prod, storage)) {
            // Create from prod the possible combinations
            let combinations = [];
            let prodCopy = prod;
            let index = 0;
            let found = false;
            while (index < prodCopy.length) {
                let symbol = prodCopy[index];
                if (storage.includes(symbol)) {
                    found = true;
                    let left = prodCopy.slice(0, index);
                    let right = prodCopy.slice(index + 1);
                    let newProd = left + right;
                    if (!combinations.includes(newProd)) {
                        combinations.push(newProd);
                    }
                }
                index++;
            }

            // create the last combination by removing from the prod the symbols from the storage
            let newProd = '';
            let index2 = 0;
            while (index2 < prod.length) {
                let symbol = prod[index2];
                if (storage.includes(symbol)) {
                    index2++;
                    continue;
                }
                newProd += symbol;
                index2++;
            }
            if (!combinations.includes(newProd)) {
                combinations.push(newProd);
            }
            
            if (found) {
                combinations.push(prod);
                return combinations;
            }
        }
        return prod;          
      });
      
      return {
          nonTerminal: obj.nonTerminal,
          productions: productions.flat()
      };
  });

  return updatedProductionObjectsCopy;

  // console.log("updatedProductionObjectsCopy", updatedProductionObjectsCopy);
}

function step_2(productionObjects){
  let temporary;

    // Store the non-terminals
  productionObjects.forEach(obj => {
       nonterminals_array.push(obj.nonTerminal);
  });
  
  // Iterate the rules to find the ones that have a single non-terminal
  productionObjects.forEach(obj => {
    if (obj.productions.length !== 1) return;
    // Check if the object production has a non-terminal
    if (!nonterminals_array.includes(obj.productions[0])) return;

    temporary = obj;  
  });

  if (temporary) {
    // iterate to find the object that has the temporary obj.production[0] as obj.nonterminal
    // and replace the temporary.production[0] with the productions of the obj.production[0]

    let temp_nt;
    productionObjects.forEach(obj => {
      if (obj.nonTerminal === temporary.productions[0]) {
        temporary.productions = obj.productions;
        temp_nt = obj.nonTerminal;
      }
    });

    // iterate again in the productions and where we find a obj.production[i] that has in it the value of temp_nt
    // we will replace with the temporary.nonterminal;
    productionObjects = productionObjects.map(obj => {
      let productions = obj.productions.map(prod => {
          if (prod.includes(temp_nt)) {
              let newProd = prod.replace(temp_nt, temporary.nonTerminal);
              return newProd;
          }
          return prod;
          
      });

      return {
          nonTerminal: obj.nonTerminal,
          productions: productions
      };
    });

    // iterate again, if we find the temporary-nt in the obj.nonterminal, we will erase that obj
    productionObjects = productionObjects.filter(obj => obj.nonTerminal !== temp_nt);

    // iterate again and replace the obj.production[i] with the temporary.productions if the obj.production[i] is length == 1 
    productionObjects = productionObjects.map(obj => {
      let productions = obj.productions.map(prod => {
          if (prod.length === 1 && nonterminals_array.includes(prod)) {
              return temporary.productions;
          }
          return prod;
      });

      return {
          nonTerminal: obj.nonTerminal,
          productions: productions.flat()
      };
    });
  }

  // iterate in obj.productions for obj.nonterminal = "S" to find the terminal values and their corresponding "X terminal" (for example a: Xa)
  productionObjects.forEach(obj => {
    if (obj.nonTerminal === "S") {
        obj.productions.forEach(prod => {
          let index = 0;
          while (index < prod.length && prod.length > 1) {
              let symbol = prod[index];
  
              if (symbol === symbol.toLowerCase()) {
                if (!terminalmap.has(symbol)) {
                  terminalmap.set(symbol, "X" + symbol);
                }
              }
              index++;
          }
        });
    }
  });

  return productionObjects;

}

function step_3(productionObjects){
    // Replace in the productions[0] >= 2 the terminal values with the corresponding "X terminal"
    prods = productionObjects.map(obj => {
      let productions = obj.productions.map(prod => {
        if (prod.length === 1) return prod;
          let index = 0;
          let newProd = '';
          while (index < prod.length) {
              let symbol = prod[index];
              if (symbol === symbol.toLowerCase()) {
                if (terminalmap.has(symbol)){
                  newProd += terminalmap.get(symbol);
                } else {
                  newProd += symbol;
                }
              } else {
                  newProd += symbol;
              }
              index++;
          }
          return newProd;
      });

      return {
          nonTerminal: obj.nonTerminal,
          productions: productions
      };
      
    });

    // push to the productions the terminal values and their corresponding "X terminal" in the format "X terminal: terminal"
    terminalmap.forEach((value, key) => {
      prods.push({
          nonTerminal: value,
          productions: [key]
      });
    });
  return prods;
}

function getByValue(map, searchValue) {
  for (let valueArray of map.values()) {
    if (valueArray instanceof Array && valueArray.includes(searchValue)) {
      return true;
    }
  }
  return false;
}

function getNonTerminal(map, searchValue) {
  for (let [key, valueArray] of map.entries()) {
    if (valueArray instanceof Array && valueArray.includes(searchValue)) {
      return key;
    }
  }
  return false;
}

function step_4(productionObjects){
  // Convert the production objects to a hashmap for easy access
  let productionMap = new Map();
  productionObjects.forEach(obj => {
    productionMap.set(obj.nonTerminal, obj.productions);
  });
  
  // iterate in the first entry of the productionMap and iterate in the values of the productionMap;
  
  let firstEntry = productionMap.entries().next().value;
  let firstEntryValue = firstEntry[1];
  let y = 1;

  firstEntryValue.forEach(prod => {
    let sliceN = -3;
    let index = prod.length;
    while (prod.length > 2 && index > 2) {
      // get the last 3 symbols of the production
        let last = prod.slice(sliceN);
        // If last[0] is not a non-terminal, then we have to decrease the sliceN by 1
        if (last[0] === last[0].toLowerCase()) {
          sliceN--;
          last = prod.slice(sliceN);
          if (last[0] === last[0].toLowerCase()){
            sliceN--;
            last = prod.slice(sliceN);
          }
        }
        if(last.length > (prod.length - 2)) {
          break;
        }
        // if the last value is not found in the productionMap then we have to create a new non-terminal "Y"+y and add it to the productionMap with last as value
        if (!getByValue(productionMap, last)) {
          productionMap.set("Y" + y, [last]);
          y++;
        }

        index--;
        sliceN--;
    }
  });

  // iterate in the first entry of the productionMap and iterate in the values of the productionMap;
  // for each value, if it is at last 3 symbols, from the second symbol, we have to replace it with the corresponding non-terminal "Y"+y

  let indexEntry = 0;
  firstEntryValue.forEach(prod => {
    let index = prod.length;
    if (prod.length < 3) return;
    // check if from prod[1] to prod[prod.length] has a non-terminal with that value, if yes, replace with prod[0] + "Y" + y
    let slice = prod.slice(1, index);
    if (slice[0] === slice[0].toLowerCase()) {
      slice = prod.slice(2, index);
    }
    if (getByValue(productionMap, slice)) {
      let nonTerminal = getNonTerminal(productionMap, slice);
      prod = prod[0] + nonTerminal;
      firstEntryValue[indexEntry] = prod;
       
    } 
    indexEntry++; 
  });

  // Iterate the Y keys in the productionMap and for each value;
  // if the value is length at least 3, check if the string from 1 to value.length has a non-terminal with that value, if yes, replace with value[0] + "Y" + y
  let yKeys = new Map();
  productionMap.forEach((value, key) => {
    if (key[0] === "Y") {
      yKeys.set(key, value);
    }
  });

  // Sort the yKeys by the length of the value (descending order)
  yKeys = new Map([...yKeys.entries()].sort((a, b) => b[1][0].length - a[1][0].length));

  yKeys.forEach((value, key) => {
    let index = 0;
    value.forEach(prod => {
      let bislice = false
      let slice = prod.slice(1);
      if (slice[0] === slice[0].toLowerCase()) {
        bislice = true;
        slice = prod.slice(2);
      }
      if (getByValue(productionMap, slice)) {
        let nonTerminal = getNonTerminal(productionMap, slice);
        if (bislice) {
          prod = prod[0] + prod[1] + nonTerminal;
        } else {
          prod = prod[0] + nonTerminal;
        }
          value[index] = prod;
      }
      index++;
    });
  });
  return productionMap;
}
    
document.getElementById("submit").addEventListener("click", function (e) {
  // Empty storage
  storage = [];
  // Empty terminalmap
  terminalmap.clear();
  // Empty nonterminals_array
  nonterminals_array = [];
  console.clear();
  e.preventDefault();
  e.stopPropagation();

  // Get the textarea element
  let textarea = document.getElementById("input-text");

  // Remove any existing result elements
  let resultContainer = document.getElementsByClassName("result")[0];
  if (resultContainer) resultContainer.remove();

  prel0 = document.getElementsByClassName("result-2")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-3")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-4")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-5")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-6")[0];
  if (prel0) prel0.remove();

  if (textarea.value.length > 0) {
    foo2.classList.remove("invisible");
    foo3.classList.remove("invisible");
    foo4.classList.remove("invisible");
    foo5.classList.remove("invisible");
    foo6.classList.remove("invisible");

    // Create a new result container
    let resultDiv = document.createElement("div");
    resultDiv.classList.add("result");
    foo.appendChild(resultDiv);

    // Get the value of the textarea and convert it to lowercase
    let store = textarea.value;

    // Split the input text by newline to get individual production rules
    let productionRules = store.split("\n");

    // Initialize an array to store objects for each production rule except the last
    let productionObjects = [];
    let lastRule = "";

    // Check if there are any production rules
    if (productionRules.length > 0) {
        // Handle the last production rule separately
        lastRule = productionRules.pop().trim(); // Remove and trim the last rule

        // Iterate over the remaining production rules
        productionRules.forEach(function (rule) {
            // Split each production rule by '->' to separate non-terminal and productions
            let [nonTerminal, productions] = rule.split("->").map(part => part.trim());

            // Split the productions by '|' to get an array of individual productions
            let productionArray = productions.split("|").map(prod => prod.trim());

            // Create an object to store non-terminal and productions
            let productionObject = {
                nonTerminal: nonTerminal,
                productions: productionArray
            };

            // Push the production object for the current rule to the productionObjects array
            productionObjects.push(productionObject);
        });
    }

    prel = document.createElement("div");
    prel.classList.add("result-2");
    foo2.appendChild(prel);

    // Display the productionObjects
    productionObjects.forEach(obj => {
        let temp = document.createElement("div");
        temp.classList.add("child");
        let temp2 = document.createElement("h1");
        if (obj.nonTerminal === "S") {
            temp.classList.add("huge");
        } else if (obj.nonTerminal[0] === "Y") {
            temp.classList.add("big");
        } else if (obj.nonTerminal[0] === "X") {
            temp.classList.add("medium");
        } else {
            temp.classList.add("small");
        }
        temp2.textContent = obj.nonTerminal + " -> " + obj.productions.join(" | ");
        temp.appendChild(temp2);
        prel.appendChild(temp);
    });

    // Apply steps to the productionObjects
    productionObjects = step_1(productionObjects, lastRule);
    prel = document.createElement("div");
    prel.classList.add("result-3");
    foo3.appendChild(prel);

    // Display the productionObjects
    productionObjects.forEach(obj => {
      let temp = document.createElement("div");
      temp.classList.add("child");
      let temp2 = document.createElement("h1");
      if (obj.nonTerminal === "S") {
          temp.classList.add("huge");
      } else if (obj.nonTerminal[0] === "Y") {
          temp.classList.add("big");
      } else if (obj.nonTerminal[0] === "X") {
          temp.classList.add("medium");
      } else {
          temp.classList.add("small");
      }
      temp2.textContent = obj.nonTerminal + " -> " + obj.productions.join(" | ");
      temp.appendChild(temp2);
      prel.appendChild(temp);
    });

    productionObjects = step_2(productionObjects);
    prel = document.createElement("div");
    prel.classList.add("result-4");

    foo4.appendChild(prel);
    // Display the productionObjects
    productionObjects.forEach(obj => {
      let temp = document.createElement("div");
      temp.classList.add("child");
      let temp2 = document.createElement("h1");
      if (obj.nonTerminal === "S") {
          temp.classList.add("huge");
      } else if (obj.nonTerminal[0] === "Y") {
          temp.classList.add("big");
      } else if (obj.nonTerminal[0] === "X") {
          temp.classList.add("medium");
      } else {
          temp.classList.add("small");
      }
      temp2.textContent = obj.nonTerminal + " -> " + obj.productions.join(" | ");
      temp.appendChild(temp2);
      prel.appendChild(temp);
    });

    productionObjects = step_3(productionObjects);
    prel = document.createElement("div");
    prel.classList.add("result-5");
    foo5.appendChild(prel);

    // Display the productionObjects
    productionObjects.forEach(obj => {
      let temp = document.createElement("div");
      temp.classList.add("child");
      let temp2 = document.createElement("h1");
      if (obj.nonTerminal === "S") {
          temp.classList.add("huge");
      } else if (obj.nonTerminal[0] === "Y") {
          temp.classList.add("big");
      } else if (obj.nonTerminal[0] === "X") {
          temp.classList.add("medium");
      } else {
          temp.classList.add("small");
      }
      temp2.textContent = obj.nonTerminal + " -> " + obj.productions.join(" | ");
      temp.appendChild(temp2);
      prel.appendChild(temp);
    });

    productionMap = step_4(productionObjects);

    prel = document.createElement("div");
    prel.classList.add("result-6");
    foo6.appendChild(prel);

    // Display the productionObjects
    productionMap.forEach((value, key) => {
      temp = document.createElement("div");
      temp.classList.add("child");
      temp2 = document.createElement("h1");
      if (key === "S") {
        temp.classList.add("huge");
      } else if (key[0] === "Y") {
          temp.classList.add("big");
      } else if (key[0] === "X") {
        temp.classList.add("medium");
      } else {
        temp.classList.add("small");
      }
      temp2.textContent = key + " -> " + value.join(" | ");
      temp.appendChild(temp2);
      prel.appendChild(temp);
    });

    // Display the productionObjects
    productionMap.forEach((value, key) => {
      temp = document.createElement("div");
      temp.classList.add("child");
      temp2 = document.createElement("h1");
      if (key === "S") {
        temp.classList.add("huge");
      } else if (key[0] === "Y") {
          temp.classList.add("big");
      } else if (key[0] === "X") {
        temp.classList.add("medium");
      } else {
        temp.classList.add("small");
      }
      temp2.textContent = key + " -> " + value.join(" | ");
      temp.appendChild(temp2);
      resultDiv.appendChild(temp);
    });
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
  foo6.classList.add("invisible");

  let prel0 = document.getElementsByClassName("result")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-2")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-3")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-4")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-5")[0];
  if (prel0) prel0.remove();

  prel0 = document.getElementsByClassName("result-6")[0];
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
