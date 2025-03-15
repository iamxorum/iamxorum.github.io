(async () => {
  const loadingScreen = document.getElementsByClassName("loader_container");
  const quizContainer = document.getElementsByClassName("body_app");
  const navigation_questions = document.getElementById("navigation-buttons");
  try {
    // Function to fetch JSON from a file
    async function fetchJSONFile(filePath) {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${filePath}: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    }

    // display the loading screen
    loadingScreen[0].style.display = "flex";
    quizContainer[0].style.display = "none";

    // Load JSON files
    let json1 = await fetchJSONFile("../assets/asd.json");
    let json2 = await fetchJSONFile("../assets/cc.json");
    let json3 = await fetchJSONFile("../assets/ce.json");
    let json4 = await fetchJSONFile("../assets/cpp.json");
    let json5 = await fetchJSONFile("../assets/crypto.json");
    let json6 = await fetchJSONFile("../assets/db.json");
    let json7 = await fetchJSONFile("../assets/java.json");
    let json8 = await fetchJSONFile("../assets/pp.json");
    let json9 = await fetchJSONFile("../assets/rc.json");
    let json10 = await fetchJSONFile("../assets/sgdb.json");
    let json11 = await fetchJSONFile("../assets/so.json");
    let json12 = await fetchJSONFile("../assets/tap.json");
    let json13 = await fetchJSONFile("../assets/web.json");
    // Load more JSON files as needed

    //sleep randomize betwwen 1 and 5 seconds
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    //sleep for 1 second
    await sleep(Math.floor(Math.random() * 2000) + 1000);

    let allQuestionsArray;

    // Combine all JSON files into one array
    //const allQuestions = [...json1, ...json2, ...json3, ...json4, ...json5, ...json6, ...json7, ...json8, ...json9, ...json10, ...json11, ...json12, ...json13];
    //const allQuestions = [...json13];

    //const allQuestionsArray = allQuestions.flat();

    // Function to randomly select 'n' questions from the combined array
    function getRandomQuestions(questions, n) {
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function startRandomQuestions() {
      const jsonArrays = [
        json1,
        json2,
        json3,
        json4,
        json5,
        json6,
        json7,
        json8,
        json9,
        json10,
        json11,
        json12,
        json13,
      ];

      const selectedQuestions = [];
      const totalQuestionsNeeded = 36;
      const numberOfJsonArrays = jsonArrays.length;

      // Calculate minimum and maximum questions that can be taken from each array
      const minQuestionsPerArray = Math.floor(
        totalQuestionsNeeded / numberOfJsonArrays
      );
      const extraQuestionsNeeded = totalQuestionsNeeded % numberOfJsonArrays;

      let remainingQuestionsNeeded = totalQuestionsNeeded;

      jsonArrays.forEach((jsonArray, index) => {
        // Decide whether to take 2 or 3 questions
        let numberOfQuestions;
        if (index < extraQuestionsNeeded) {
          numberOfQuestions = minQuestionsPerArray + 1;
        } else {
          numberOfQuestions = minQuestionsPerArray;
        }

        // Shuffle the array to ensure randomness
        shuffleArray(jsonArray);

        // Select the desired number of questions
        const questionsToAdd = jsonArray.slice(0, numberOfQuestions);

        // Add the selected questions to the final list
        selectedQuestions.push(...questionsToAdd);
        remainingQuestionsNeeded -= numberOfQuestions;
      });

      // In case we have selected more questions than needed, trim the list to the exact number
      if (selectedQuestions.length > totalQuestionsNeeded) {
        shuffleArray(selectedQuestions);
        return selectedQuestions.slice(0, totalQuestionsNeeded);
      }

      return selectedQuestions;
    }

    // Number of questions you want to choose randomly
    const numberOfQuestions = 36;

    // Get random questions
    let randomlyChosenQuestions;

    loadingScreen[0].style.display = "none";
    quizContainer[0].style.display = "flex";

    let questions;
    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const prevButton = document.getElementById("prev-btn");
    const timerElement = document.getElementById("timer"); // Moved here
    const questionNumber = document.createElement("div");
    questionNumber.id = "question-number";
    questionElement.insertAdjacentElement("beforebegin", questionNumber);
    //Style the question number
    questionNumber.style.textAlign = "center";
    questionNumber.style.margin = "10px auto 0";
    questionNumber.style.marginBottom = "10px";
    //make him like a button with a background: #7c2c47;; and color: white; padding: 10px;
    questionNumber.style.backgroundColor = "#f14444";
    questionNumber.style.color = "#fafafa";
    questionNumber.style.fontWeight = "bold";
    questionNumber.style.padding = "1rem";
    questionNumber.style.borderRadius = "5px";
    questionNumber.style.width = "100%";

    let currentQuestionIndex = 0;
    let score = 0;
    let wrong = 0;
    let timeLeft = 3600; // 30 minutes
    // Create hasmap to store the user answers
    let userAnswer = new Map();
    let userAnswers2 = [];
    let selectedButtons = [];

    function startQuiz() {
      // Clear previous data if not already cleared
      if (userAnswers2.length > 0) {
        userAnswers2 = [];
      }
      
      if (userAnswer.size > 0) {
        userAnswer.clear();
      }
      
      // Try to restore any temporary answers
      const tempAnswers = localStorage.getItem("tempAnswers");
      if (tempAnswers) {
        try {
          const parsedAnswers = JSON.parse(tempAnswers);
          parsedAnswers.forEach((answer, index) => {
            userAnswer.set(index, answer);
          });
          userAnswers2 = parsedAnswers;
        } catch (e) {
          console.error("Error restoring temporary answers:", e);
        }
      }
      
      // Remove result div if it exists
      const result_div = document.getElementById("result");
      if (result_div) {
        result_div.remove();
      }
      
      // Reset UI elements
      if (navigation_questions) {
        // Clear navigation buttons
        navigation_questions.innerHTML = '';
      }
      
      // Get questions
      allQuestionsArray = startRandomQuestions();
      randomlyChosenQuestions = getRandomQuestions(allQuestionsArray, numberOfQuestions);
      questions = randomlyChosenQuestions.map((questionData) => ({
        isWeb: questionData.isWeb || false,
        question: String.raw`${questionData.question}`,
        img: questionData.img,
        answers: questionData.answers.map((answer) => ({
          text: String.raw`${answer}`,
          correct: questionData.correctAnswerIndexes.includes(
            questionData.answers.indexOf(answer)
          ),
        })),
        tobeviewed: questionData.tobereviewd,
      }));

      // Shuffle answers
      questions.forEach((question) => {
        question.answers = question.answers.sort(() => 0.5 - Math.random());
        question.correctAnswerIndexes = question.answers.reduce(
          (indexes, answer, index) => {
            if (answer.correct) {
              indexes.push(index);
            }
            return indexes;
          },
          []
        );
      });

      // Create navigation buttons
      if (navigation_questions) {
        questions.forEach((question, index) => {
          const button = document.createElement("button");
          button.textContent = index + 1;
          button.classList.add("nav-button");
          
          button.addEventListener("click", () => {
            // Store answers before navigating
            storeAnswers();
            currentQuestionIndex = index;
            showQuestion();
            
            // Update active state for all buttons
            const allButtons = navigation_questions.querySelectorAll("button");
            allButtons.forEach((btn, idx) => {
              btn.classList.toggle("active", idx === index);
              btn.classList.toggle("answered", userAnswer.has(idx));
            });
          });
          
          navigation_questions.appendChild(button);
        });
      }
      
      // Add progress indicator if it doesn't exist
      const existingProgressIndicator = document.querySelector('.progress-indicator');
      if (existingProgressIndicator) {
        existingProgressIndicator.remove();
      }
      
      const progressIndicator = document.createElement('div');
      progressIndicator.className = 'progress-indicator';
      progressIndicator.innerHTML = `
        <span class="progress-text">Progress:</span>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: 0%"></div>
        </div>
        <span class="progress-count">0/${questions.length}</span>
      `;
      
      // Insert before the app container
      const appContainer = document.querySelector('.app');
      if (appContainer) {
        appContainer.insertAdjacentElement('beforebegin', progressIndicator);
      }
      
      // Show the first question
      showQuestion();
    }

    function toggleAnswer(button) {
      // Get all answer buttons
      const buttons = answerButtons.querySelectorAll(".btn");
      
      // Toggle the selected class on the clicked button
      button.classList.toggle("selected");
      
      // Store the answers
      storeAnswers();
      
      // Update navigation button to show this question has been answered
      if (navigation_questions) {
        const navButtons = navigation_questions.querySelectorAll("button");
        if (navButtons[currentQuestionIndex]) {
          navButtons[currentQuestionIndex].classList.add("answered");
        }
      }
      
      // Update progress indicator
      updateProgressIndicator();
    }

    function escape(htmlStr) {
      return htmlStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function showQuestion() {
      resetState();
      
      if (currentQuestionIndex === questions.length) {
        showScore();
        return;
      }

      let currentQuestion = questions[currentQuestionIndex];
      let questionNo = currentQuestionIndex + 1;
      isWeb = currentQuestion.isWeb;

      if (!isWeb) {
        questionElement.innerHTML = currentQuestion.question;
      } else {
        const questionText = escape(currentQuestion.question).replace(/\n/g, "<br>");
        questionElement.innerHTML = `${questionText}`;
      }
      
      // Display the question number
      if (questionNumber) {
        questionNumber.textContent = `Question ${questionNo} of ${questions.length}`;
      }

      // Handle image if present
      const imgElement = document.getElementsByClassName("image")[0];
      if (imgElement) {
        if (currentQuestion.img) {
          imgElement.src = currentQuestion.img;
          imgElement.style.display = "block";
        } else {
          imgElement.src = "";
          imgElement.style.display = "none";
        }
      }

      // Create answer buttons
      if (answerButtons) {
        currentQuestion.answers.forEach((answer, index) => {
          const button = document.createElement("button");
          if (isWeb) {
            button.textContent = answer.text;
          } else {
            button.innerHTML = answer.text;
          }
          button.classList.add("btn");
          answerButtons.appendChild(button);

          // Add data attributes
          button.dataset.correctIndex = index;
          if (answer.correct) {
            button.dataset.correct = "true";
          }

          // Add click event
          button.addEventListener("click", () => toggleAnswer(button));
        });
      }

      // Update active state in navigation
      if (navigation_questions) {
        const questionButtons = Array.from(navigation_questions.children);
        questionButtons.forEach((button, index) => {
          if (index === currentQuestionIndex) {
            button.style.backgroundColor = "#6366f1";
          } else {
            button.style.backgroundColor = "#262b40";
          }
          
          // Maintain answered state
          if (userAnswer.has(index)) {
            button.style.border = "2px solid #4ade80";
          } else {
            button.style.border = "none";
          }
        });
      }

      // Restore previously selected answers
      if (userAnswer.has(currentQuestionIndex) && answerButtons) {
        const userAnswerData = userAnswer.get(currentQuestionIndex);
        const selectedAnswers = userAnswerData.selectedAnswer;
        
        // Find and select the corresponding buttons
        const answerElements = Array.from(answerButtons.children);
        
        selectedAnswers.forEach(selectedAnswer => {
          for (let i = 0; i < answerElements.length; i++) {
            const buttonText = isWeb ? answerElements[i].textContent : answerElements[i].innerHTML;
            // Compare with both raw and escaped versions
            if (buttonText === selectedAnswer || buttonText === unescape(selectedAnswer)) {
              answerElements[i].classList.add("selected");
              break;
            }
          }
        });
      }

      // Handle "to be reviewed" questions
      if (currentQuestion.tobereviewd === "true") {
        questionElement.classList.add("tobereviewed");
        const reviewText = document.createElement("p");
        reviewText.textContent = "TREBUIE REVIZUIT DE PROFESOR";
        questionElement.appendChild(reviewText);
        reviewText.style.textAlign = "center";
        reviewText.style.color = "red";
        reviewText.style.fontWeight = "bold";
        reviewText.style.marginTop = "1rem";
      } else {
        questionElement.classList.remove("tobereviewed");
      }

      // Show navigation buttons
      if (nextButton) {
        nextButton.style.display = "block";
      }
      
      if (prevButton) {
        prevButton.style.display = currentQuestionIndex > 0 ? "block" : "none";
      }

      // Update submit button if on last question
      if (nextButton) {
        if (currentQuestionIndex === questions.length - 1) {
          nextButton.innerHTML = "Submit";
          nextButton.id = "sub-btn";
        } else {
          nextButton.innerHTML = "Next";
          nextButton.id = "next-btn";
        }

        // Update button event listeners
        if (nextButton.id === "sub-btn") {
          nextButton.removeEventListener("click", handleNextButtonClick);
          nextButton.addEventListener("click", handleSubButtonClick);
        } else {
          nextButton.removeEventListener("click", handleSubButtonClick);
          nextButton.addEventListener("click", handleNextButtonClick);
        }
      }
      
      // Update progress indicator
      updateProgressIndicator();
    }

    function arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      const sortedA = a.slice().sort();
      const sortedB = b.slice().sort();
      return sortedA.every((val, index) => val === sortedB[index]);
    }

    function storeAnswers() {
      // Get all selected buttons
      selectedButtons = Array.from(answerButtons.getElementsByClassName("selected"));
      
      // Mark the question as answered in the navigation
      const questionButtons = Array.from(navigation_questions.children);
      
      if (selectedButtons.length > 0) {
        // Add the answered class to the current question button
        questionButtons[currentQuestionIndex].classList.add("answered");
        
        // Store the selected answers
        if (questions[currentQuestionIndex].isWeb) {
          userAnswer.set(currentQuestionIndex, {
            question: questions[currentQuestionIndex].question,
            selectedIndex: selectedButtons.map(button => parseInt(button.dataset.correctIndex)),
            correctIndex: questions[currentQuestionIndex].correctAnswerIndexes,
            isCorrect: arraysEqual(
              selectedButtons.map(button => parseInt(button.dataset.correctIndex)),
              questions[currentQuestionIndex].correctAnswerIndexes
            ),
            isWeb: questions[currentQuestionIndex].isWeb,
            selectedAnswer: selectedButtons.map(button => escape(button.textContent)),
            correctAnswers: questions[currentQuestionIndex].answers
              .filter(answer => answer.correct)
              .map(answer => answer.text)
          });
        } else {
          userAnswer.set(currentQuestionIndex, {
            question: questions[currentQuestionIndex].question,
            selectedIndex: selectedButtons.map(button => parseInt(button.dataset.correctIndex)),
            correctIndex: questions[currentQuestionIndex].correctAnswerIndexes,
            isCorrect: arraysEqual(
              selectedButtons.map(button => parseInt(button.dataset.correctIndex)),
              questions[currentQuestionIndex].correctAnswerIndexes
            ),
            isWeb: questions[currentQuestionIndex].isWeb,
            selectedAnswer: selectedButtons.map(button => button.innerHTML),
            correctAnswers: questions[currentQuestionIndex].answers
              .filter(answer => answer.correct)
              .map(answer => answer.text)
          });
        }
        
        // Update userAnswers2 array immediately
        userAnswers2 = Array.from(userAnswer.values());
        
        // Save to localStorage after each answer
        localStorage.setItem("tempAnswers", JSON.stringify(userAnswers2));
      } else {
        // If no answer is selected, remove the answered class
        questionButtons[currentQuestionIndex].classList.remove("answered");
        
        // Remove from userAnswer map if it exists
        if (userAnswer.has(currentQuestionIndex)) {
          userAnswer.delete(currentQuestionIndex);
          
          // Update userAnswers2 array
          userAnswers2 = Array.from(userAnswer.values());
          
          // Save to localStorage
          localStorage.setItem("tempAnswers", JSON.stringify(userAnswers2));
        }
      }
      
      // Update progress indicator
      updateProgressIndicator();
    }

    function resetState() {
      nextButton.style.display = "none";
      while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
      }
    }

    function showScore() {
      resetState();
      stopTimer();
      
      // Calculate score
      score = 0;
      userAnswer.forEach((answer) => {
        if (answer.isCorrect) {
          score++;
        }
      });
      
      // Convert userAnswers Map to array
      userAnswers2 = Array.from(userAnswer.values());
      
      // Calculate grade
      let grade = score / 4 + 1;
      let gradeText = "";
      
      if (grade >= 1 && grade < 5) {
        gradeText = `${grade.toFixed(1)} - Poor`;
      } else if (grade >= 5 && grade < 7) {
        gradeText = `${grade.toFixed(1)} - Average`;
      } else if (grade >= 7 && grade < 9) {
        gradeText = `${grade.toFixed(1)} - Good`;
      } else if (grade >= 9 && grade <= 10) {
        gradeText = `${grade.toFixed(1)} - Excellent`;
      }
      
      // Hide navigation, timer, and other elements
      if (navigation_questions) {
        navigation_questions.style.display = "none";
      }
      
      if (timerElement) {
        timerElement.style.display = "none";
      }
      
      if (questionNumber) {
        questionNumber.style.display = "none";
      }
      
      // Clear the app container
      const appContainer = document.querySelector('.app');
      if (!appContainer) return; // Safety check
      
      appContainer.innerHTML = '';
      
      // Create results wrapper
      const resultsWrapper = document.createElement('div');
      resultsWrapper.className = 'results-wrapper';
      
      // Build the complete results page structure - without Play Again button
      resultsWrapper.innerHTML = `
        <!-- Top gradient bar -->
        <div class="top-gradient"></div>
        
        <!-- Header with title and progress -->
        <div class="results-header">
          <div class="exam-title">Exam</div>
          <div class="progress-text">Progress: ${userAnswer.size}/${questions.length}</div>
        </div>
        
        <!-- Center title -->
        <div class="center-title">Exam</div>
        
        <!-- Middle gradient separator -->
        <div class="middle-gradient"></div>
        
        <!-- Score box -->
        <div class="score-box">
          <div class="score-text">You scored ${score} out of ${questions.length}!</div>
          <div class="grade-text">Grade: ${gradeText}</div>
        </div>
        
        <!-- Action buttons - only Go to Results button -->
        <div class="action-buttons">
          <button id="results-btn" class="results-btn">Go to Results</button>
        </div>
        
        <!-- Score summary -->
        <div class="score-summary">
          <div class="score-bar correct">Correct: ${score}</div>
          <div class="score-bar incorrect">Incorrect: ${questions.length - score}</div>
        </div>
        
        <!-- Result banner -->
        <div class="result-banner ${grade >= 5 ? 'passed' : 'failed'}">
          ${grade >= 5 ? 'PASSED' : 'FAILED'}
        </div>
      `;
      
      // Add the results wrapper to the app container
      appContainer.appendChild(resultsWrapper);
      
      // Add event listener to the Go to Results button
      const resultsBtn = document.getElementById('results-btn');
      if (resultsBtn) {
        resultsBtn.addEventListener('click', function() {
          window.location.href = "../result/results.html";
        });
      }
      
      // Save results to localStorage
      localStorage.setItem("results", JSON.stringify(userAnswers2));
      localStorage.removeItem("tempAnswers");
    }

    function handleSubButtonClick() {
      storeAnswers();
      
      const answeredCount = document.querySelectorAll('.navigation button.answered').length;
      const totalQuestions = questions.length;
      
      if (answeredCount < totalQuestions) {
        if (confirm(`You've only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`)) {
          showScore();
          localStorage.setItem("results", JSON.stringify(userAnswers2));
          localStorage.removeItem("tempAnswers");
        } else {
          // Highlight unanswered questions
          const questionButtons = Array.from(navigation_questions.children);
          questionButtons.forEach((button, index) => {
            if (!button.classList.contains('answered')) {
              button.style.animation = 'pulse 1s infinite';
              setTimeout(() => {
                button.style.animation = '';
              }, 3000);
            }
          });
        }
      } else {
        showScore();
        localStorage.setItem("results", JSON.stringify(userAnswers2));
        localStorage.removeItem("tempAnswers");
      }
    }

    function handleNextButton() {
      if (currentQuestionIndex < questions.length) {
        storeAnswers();
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
          showQuestion();
        } else {
          showScore();
        }
      } else {
        showScore();
      }
    }

    function handlePrevButton() {
      if (currentQuestionIndex > 0) {
        storeAnswers();
        currentQuestionIndex--;
        showQuestion();
      }
    }

    function handleNextButtonClick() {
      // Check if timer is = 0 to start the timer again
      if (timerElement.textContent === "00:00:00") {
        timeLeft = 3600;
        startTimer();
        startQuiz();
      }
    }

    nextButton.addEventListener("click", () => {
      if (currentQuestionIndex < questions.length) {
        handleNextButton();
      } else {
        startQuiz();
      }
    });

    // Function to update timer display
    function updateTimer() {
      if (timeLeft === 0) {
        timerElement.textContent = "00:00:00";
        return timeLeft;
      }
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(
        seconds
      )}`;
      timerElement.textContent = `${formattedTime}`;

      // Update timer color based on time remaining
      updateTimerColor();

      return timeLeft;
    }

    // Function to pad zero for single digits
    function padZero(num) {
      return num < 10 ? `0${num}` : num;
    }

    // Function to start the timer
    function startTimer() {
      updateTimer();
      const timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          currentQuestionIndex = questions.length;
          // automatically click the next button when the timer reaches 0 that calls the handleNextButton function
          handleNextButton();
        }
      }, 1000); // Update timer every second
    }

    // Function to stop the timer
    function stopTimer() {
      timeLeft = 0;
    }

    // Function to update the progress bar
    function updateProgressBar() {
      const progressBar = document.querySelector('.progress-bar');
      const answeredQuestions = document.querySelectorAll('.navigation button.answered').length;
      const totalQuestions = questions.length;
      const progressPercentage = (answeredQuestions / totalQuestions) * 100;
      
      progressBar.style.width = `${progressPercentage}%`;
      
      // Update the question number text to include progress
      questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length} (${answeredQuestions} answered)`;
    }

    // Function to update timer color based on time remaining
    function updateTimerColor() {
      if (timeLeft <= 300) { // 5 minutes or less
        timerElement.classList.add('danger');
        timerElement.classList.remove('warning');
      } else if (timeLeft <= 600) { // 10 minutes or less
        timerElement.classList.add('warning');
        timerElement.classList.remove('danger');
      } else {
        timerElement.classList.remove('warning', 'danger');
      }
    }

    // Function to show a confirmation dialog before submitting
    function confirmSubmit() {
      const answeredQuestions = document.querySelectorAll('.navigation button.answered').length;
      const totalQuestions = questions.length;
      
      if (answeredQuestions < totalQuestions) {
        return confirm(`You've answered ${answeredQuestions} out of ${totalQuestions} questions. Are you sure you want to submit?`);
      }
      
      return true;
    }

    // Function to highlight unanswered questions
    function highlightUnanswered() {
      const questionButtons = Array.from(navigation_questions.children);
      
      questionButtons.forEach((button, index) => {
        if (!button.classList.contains('answered')) {
          button.classList.add('unanswered');
          
          // Add a pulsing animation
          button.animate([
            { transform: 'scale(1)', backgroundColor: 'rgba(239, 68, 68, 0.3)' },
            { transform: 'scale(1.1)', backgroundColor: 'rgba(239, 68, 68, 0.5)' },
            { transform: 'scale(1)', backgroundColor: 'rgba(239, 68, 68, 0.3)' }
          ], {
            duration: 1000,
            iterations: 3
          });
        }
      });
    }

    // Add a function to update the progress indicator
    function updateProgressIndicator() {
      const progressCount = document.querySelector('.progress-count');
      const progressBar = document.querySelector('.progress-bar');
      
      if (progressCount && progressBar) {
        const answeredCount = userAnswer.size;
        const totalQuestions = questions.length;
        
        progressCount.textContent = `${answeredCount}/${totalQuestions}`;
        progressBar.style.width = `${(answeredCount / totalQuestions) * 100}%`;
      }
    }

    // Call startTimer when quiz starts
    startQuiz();
    startTimer();

    // Add top gradient line
    const topGradient = document.createElement('div');
    topGradient.className = 'top-gradient';
    document.body.insertAdjacentElement('afterbegin', topGradient);
  } catch (error) {
    console.error(error);
  }
})();
