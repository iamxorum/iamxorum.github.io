function escapeHTML(str) {
  return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function reformatHTML(str) {
  return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results-container");
  const results = JSON.parse(localStorage.getItem("results"));

  if (results && results.length > 0) {
    // Add summary stats at the top
    const correctCount = results.filter(result => result.isCorrect).length;
    const totalCount = results.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    
    const summaryDiv = document.createElement("div");
    summaryDiv.classList.add("result-summary");
    summaryDiv.innerHTML = `
      <div class="summary-score">
        <div class="score-value">${correctCount}/${totalCount}</div>
        <div class="score-percentage">${percentage}%</div>
      </div>
      <div class="summary-text">
        You answered ${correctCount} out of ${totalCount} questions correctly.
      </div>
    `;
    resultsContainer.appendChild(summaryDiv);
    
    // Add each result item
    results.forEach((result, index) => {
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
        questionP.innerHTML = `<strong>Question ${index + 1}:</strong> ${escapeHTML(
          result.question
        )}`;
      } else {
        questionP.innerHTML = `<strong>Question ${index + 1}:</strong> ${result.question}`;
      }
      resultItem.appendChild(questionP);

      // Create answer columns container
      const answerColumns = document.createElement("div");
      answerColumns.classList.add("answer-columns");
      
      // Your answers column
      const yourAnswersDiv = document.createElement("div");
      yourAnswersDiv.innerHTML = `<strong>Your Answers:</strong>`;
      
      if (result.isWeb) {
        result.selectedAnswer.forEach((answer) => {
          const answerP = document.createElement("div");
          answerP.textContent = reformatHTML(answer);
          yourAnswersDiv.appendChild(answerP);
        });
      } else {
        result.selectedAnswer.forEach((yourAnswer) => {
          const yourAnswerP = document.createElement("div");
          yourAnswerP.innerHTML = yourAnswer;
          yourAnswersDiv.appendChild(yourAnswerP);
        });
      }
      answerColumns.appendChild(yourAnswersDiv);

      // Correct answers column (only show if incorrect or not web)
      if (!result.isCorrect || !result.isWeb) {
        const correctAnswersDiv = document.createElement("div");
        correctAnswersDiv.innerHTML = `<strong>Correct Answers:</strong>`;
        
        if (result.isWeb) {
          result.correctAnswers.forEach((answer) => {
            const answerP = document.createElement("div");
            answerP.textContent = reformatHTML(answer);
            correctAnswersDiv.appendChild(answerP);
          });
        } else {
          result.correctAnswers.forEach((correctAnswer) => {
            const correctAnswerP = document.createElement("div");
            correctAnswerP.innerHTML = correctAnswer;
            correctAnswersDiv.appendChild(correctAnswerP);
          });
        }
        answerColumns.appendChild(correctAnswersDiv);
      }
      
      resultItem.appendChild(answerColumns);
      resultsContainer.appendChild(resultItem);
    });
    
    // Add a button to go back to home
    const homeButton = document.createElement("button");
    homeButton.textContent = "Back to Home";
    homeButton.classList.add("home-btn");
    homeButton.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
    resultsContainer.appendChild(homeButton);
    
  } else {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <p>No results available.</p>
        <button class="home-btn" onclick="window.location.href='../index.html'">
          Back to Home
        </button>
      </div>
    `;
  }

  // Delete results from local storage
  localStorage.removeItem("results");
});
