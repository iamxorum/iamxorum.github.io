function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br>");
}

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results-container");
  const results = JSON.parse(localStorage.getItem("results"));

  if (results && results.length > 0) {
    results.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");
      resultItem.classList.add(
        result.isCorrect ? "correctResult" : "incorrectResult"
      );

      const statusDiv = document.createElement("div");
      statusDiv.classList.add("status");
      statusDiv.textContent = result.isCorrect ? "CORRECT" : "INCORRECT";
      resultItem.appendChild(statusDiv);

      if (result.isCorrect === true) {
        if (result.isWeb === true) {
          resultItem.innerHTML += `
          <p><strong>Question:</strong> ${escapeHTML(result.question)}</p>
          <p><strong>Your Answer:</strong> ${escapeHTML(
            result.selectedAnswer
          )}</p>
        `;
        } else {
          resultItem.innerHTML += `
            <p><strong>Question:</strong> ${result.question}</p>
            <p><strong>Your Answer:</strong> ${result.selectedAnswer}</p>
            <p><strong>Correct Answer:</strong> ${result.correctAnswers}</p>
          `;
        }
      } else {
        if (result.isWeb === true) {
          resultItem.innerHTML += `
          <p><strong>Question:</strong> ${escapeHTML(result.question)}</p>
          <p><strong>Your Answer:</strong> ${escapeHTML(
            result.selectedAnswer
          )}</p>
          <p><strong>Correct Answer:</strong> ${escapeHTML(
            result.correctAnswers
          )}</p>
        `;
        } else {
          resultItem.innerHTML += `
          <p><strong>Question:</strong> ${result.question}</p>
          <p><strong>Your Answer:</strong> ${result.selectedAnswer}</p>
          <p><strong>Correct Answer:</strong> ${result.correctAnswers}</p>
        `;
        }
      }

      resultsContainer.appendChild(resultItem);
    });
  } else {
    resultsContainer.innerHTML = "<p>No results available.</p>";
  }

  // Delete results from local storage
  localStorage.removeItem("results");
});
