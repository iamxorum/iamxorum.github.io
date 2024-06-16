function escapeHTML(str) {
  return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results-container");
  const results = JSON.parse(localStorage.getItem("results"));

  if (results && results.length > 0) {
    results.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add(
        "result-item",
        result.isCorrect ? "correctResult" : "incorrectResult"
      );

      const statusDiv = document.createElement("div");
      statusDiv.classList.add("status");
      statusDiv.textContent = result.isCorrect ? "CORRECT" : "INCORRECT";
      resultItem.appendChild(statusDiv);

      const questionP = document.createElement("p");
      if (result.isWeb) {
        questionP.innerHTML = `<strong>Question:</strong> ${escapeHTML(
          result.question
        )}`;
      } else {
        questionP.innerHTML = `<strong>Question:</strong> ${result.question}`;
      }
      resultItem.appendChild(questionP);

      const yourAnswersDiv = document.createElement("div");
      yourAnswersDiv.innerHTML = `<strong>Your Answers:</strong>`;
      if (result.isWeb) {
        result.selectedAnswer.forEach((answer) => {
          const answerP = document.createElement("div");
          answerP.innerHTML = escapeHTML(answer);
          yourAnswersDiv.appendChild(answerP);
        });
      } else {
        result.selectedAnswer.forEach((yourAnswer) => {
          const yourAnswerP = document.createElement("div");
          yourAnswerP.innerHTML = yourAnswer;
          yourAnswersDiv.appendChild(yourAnswerP);
        });
      }
      resultItem.appendChild(yourAnswersDiv);

      if (!result.isCorrect || !result.isWeb) {
        const correctAnswersDiv = document.createElement("div");
        correctAnswersDiv.innerHTML = `<strong>Correct Answers:</strong>`;
        if (result.isWeb) {
          result.correctAnswers.forEach((answer) => {
            const answerP = document.createElement("div");
            answerP.innerHTML = escapeHTML(answer);
            correctAnswersDiv.appendChild(answerP);
          });
        } else {
          result.correctAnswers.forEach((correctAnswer) => {
            const correctAnswerP = document.createElement("div");
            correctAnswerP.innerHTML = correctAnswer;
            correctAnswersDiv.appendChild(correctAnswerP);
          });
        }
        resultItem.appendChild(correctAnswersDiv);
      }

      resultsContainer.appendChild(resultItem);
    });
  } else {
    resultsContainer.innerHTML = "<p>No results available.</p>";
  }

  // Delete results from local storage
  localStorage.removeItem("results");
});
