document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results-container");
  const results = JSON.parse(localStorage.getItem("results"));

  if (results && results.length > 0) {
    results.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");
      resultItem.classList.add(result.isCorrect ? "correct" : "incorrect");
      if (result.isCorrect === true) {
        resultItem.innerHTML = `
                    <p><strong>Question:</strong> ${result.question}</p>
                    <p><strong>Your Answer:</strong> ${
                      result.selectedAnswer
                    }</p>
                    <p><strong>Result:</strong> ${
                      result.isCorrect ? "Correct" : "Incorrect"
                    }</p>
                `;
      } else {
        resultItem.innerHTML = `
                    <p><strong>Question:</strong> ${result.question}</p>
                    <p><strong>Your Answer:</strong> ${
                      result.selectedAnswer
                    }</p>
                    <p><strong>Correct Answer:</strong> ${
                      result.correctAnswers
                    }</p>
                    <p><strong>Result:</strong> ${
                      result.isCorrect ? "Correct" : "Incorrect"
                    }</p>
                `;
      }

      resultsContainer.appendChild(resultItem);
    });
  } else {
    resultsContainer.innerHTML = "<p>No results available.</p>";
  }

  //delete results from local storage
  localStorage.removeItem("results");
});
