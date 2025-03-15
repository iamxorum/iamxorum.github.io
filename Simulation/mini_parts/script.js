(async () => {
  const loadingScreen = document.getElementsByClassName("loader_container");
  const quizContainer = document.getElementsByClassName("app");
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

    //sleep randomize betwwen 1 and 5 seconds
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    //sleep for 1 second
    await sleep(Math.floor(Math.random() * 2000) + 1000);

    let json1;

    // get the h3 element with the id "quiz-title" that has id "title"and store the value in a variable
    const quizTitle = document.getElementById("title");
    let allQuestions;

    // create condition which titile is (if 'Module 1'or 'Module 2)
    if (quizTitle.textContent === "Algoritmi si Structuri de Date") {
      json1 = await fetchJSONFile("../assets/asd.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Cloud Computing") {
      json1 = await fetchJSONFile("../assets/cc.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Baze de Date") {
      json1 = await fetchJSONFile("../assets/db.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Sistem de Gestiuni de Baze de Date") {
      json1 = await fetchJSONFile("../assets/sgdb.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Sisteme de Operare") {
      json1 = await fetchJSONFile("../assets/so.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Programare C++") {
      json1 = await fetchJSONFile("../assets/cpp.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Programare Java") {
      json1 = await fetchJSONFile("../assets/java.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Programare Procedurala") {
      json1 = await fetchJSONFile("../assets/pp.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Tehnici Avansate de Programare") {
      json1 = await fetchJSONFile("../assets/tap.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Comert Electronic") {
      json1 = await fetchJSONFile("../assets/ce.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Criptografie") {
      json1 = await fetchJSONFile("../assets/crypto.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Retele de Calculatoare") {
      json1 = await fetchJSONFile("../assets/rc.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "UMFCD Orto") {
      json1 = await fetchJSONFile("../assets/orto.json");
      allQuestions = [...json1];
    } else if (quizTitle.textContent === "Tehnologii Web") {
      json1 = await fetchJSONFile("../assets/web.json");
      allQuestions = [...json1];
    }

    const allQuestionsArray = allQuestions.flat();

    // shuffle the array
    function shuffleArray(array) {
      let currentIndex = array.length;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      return array;
    }

    // Shuffle the questions
    shuffleArray(allQuestionsArray);

    // Function to randomly select 'n' questions from the combined array
    function getRandomQuestions(questions, n) {
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    }

    // Get random questions
    let randomlyChosenQuestions;

    loadingScreen[0].style.display = "none";
    quizContainer[0].style.display = "block";
    let questions;
    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const answerButton = document.getElementById("answer-btn");
    const timerElement = document.getElementById("timer");

    // Create a score container div
    const scoreContainer = document.createElement("div");
    scoreContainer.className = "score-container";
    
    // Create elements for correct and wrong answer counts
    const correctAnswersDiv = document.createElement("div");
    const wrongAnswersDiv = document.createElement("div");
    
    // Set IDs and initial text content
    correctAnswersDiv.id = "correct-answers";
    correctAnswersDiv.textContent = "0";
    wrongAnswersDiv.id = "wrong-answers";
    wrongAnswersDiv.textContent = "0";
    
    // Add CORRECT and WRONG labels
    correctAnswersDiv.setAttribute("data-label", "CORRECT");
    wrongAnswersDiv.setAttribute("data-label", "WRONG");
    
    // Append to score container
    scoreContainer.appendChild(correctAnswersDiv);
    scoreContainer.appendChild(wrongAnswersDiv);
    
    // Insert after timer
    timerElement.insertAdjacentElement("afterend", scoreContainer);

    // Create question number element
    const questionNumber = document.createElement("div");
    questionNumber.id = "question-number";
    questionElement.insertAdjacentElement("beforebegin", questionNumber);

    let currentQuestionIndex = 0;
    let score = 0;
    let wrong = 0;
    let timeLeft = 90 * 60; // 90 minutes
    let userAnswers = [];
    let timerInterval;

    function startQuiz() {
      score = 0;
      wrong = 0;
      //empty the userAnswers array before starting the quiz
      userAnswers = [];
      //empty local storage before starting the quiz
      localStorage.removeItem("results");
      // remove the result div if it exists
      const result_div = document.getElementById("result");
      if (result_div) {
        result_div.remove();
      }

      // If questionNumber and timer are hidden, show them
      timerElement.style.display = "block";
      questionNumber.style.display = "block";
      scoreContainer.style.display = "flex";

      // Remove the goButton if it exists before starting the quiz
      let goButton = document.getElementById("go-btn");
      if (goButton) {
        goButton.remove();
      }
      
      // Remove any duplicate score containers
      const scoreContainers = document.querySelectorAll('.score-container');
      if (scoreContainers.length > 1) {
        for (let i = 1; i < scoreContainers.length; i++) {
          scoreContainers[i].remove();
        }
      }
      
      randomlyChosenQuestions = getRandomQuestions(
        allQuestionsArray,
        allQuestionsArray.length
      );

      questions = randomlyChosenQuestions.map((questionData) => ({
        question: `${questionData.question}`,
        img: questionData.img,
        answers: questionData.answers.map((answer) => ({
          text: String.raw`${answer}`,
          correct: questionData.correctAnswerIndexes.includes(
            questionData.answers.indexOf(answer)
          ),
        })),
        tobereviewd: questionData.tobereviewd,
        details: questionData.details,
      }));

      // Shuffle the answers for each question and update the correct answer indexes
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

      currentQuestionIndex = 0;
      score = 0;
      nextButton.innerHTML = "Next";
      
      // Update score display
      correctAnswersDiv.textContent = `${score}`;
      wrongAnswersDiv.textContent = `${wrong}`;
      
      showQuestion();
    }

    function toggleAnswer(button) {
      // Toggle the selected state of the clicked button
      button.classList.toggle("selected");
    }

    function escape(htmlStr) {
      return htmlStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function showQuestion() {
      resetState();
      let currentQuestion = questions[currentQuestionIndex];
      let questionNo = currentQuestionIndex + 1;

      // Display the question
      questionElement.innerHTML = currentQuestion.question;
      
      // Display the question number
      questionNumber.textContent = `Question ${questionNo} of ${questions.length}`;

      // Check if there is an image path specified in the JSON record
      const imgElement = document.getElementsByClassName("image")[0];
      if (currentQuestion.img) {
        imgElement.src = currentQuestion.img;
        imgElement.style.display = "block";
      } else {
        imgElement.src = "";
        imgElement.style.display = "none";
      }

      currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);

        // Add a data attribute to the button to store the correct index
        button.dataset.correctIndex = currentQuestion.answers.indexOf(answer);

        if (answer.correct) {
          button.dataset.correct = answer.correct;
        }

        button.addEventListener("click", () => toggleAnswer(button));
      });

      if (currentQuestion.tobereviewd == "true") {
        questionElement.classList.add("tobereviewed");
        // Add a text block that says "To be reviewed by the teacher" to the question block in caps
        const reviewText = document.createElement("p");
        reviewText.textContent = "TREBUIE REVIZUIT DE PROFESOR";
        questionElement.appendChild(reviewText);
      } else {
        questionElement.classList.remove("tobereviewed");
      }

      // Show the answer button for every question
      answerButton.style.display = "block";
      nextButton.style.display = "none";
    }

    function arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      const sortedA = a.slice().sort();
      const sortedB = b.slice().sort();
      return sortedA.every((val, index) => val === sortedB[index]);
    }

    function showCorrectAnswers() {
      // Ensure at least one answer is selected
      const selectedButtons = Array.from(
        answerButtons.getElementsByClassName("selected")
      );
      if (selectedButtons.length === 0) {
        return;
      }

      // Remove answer button after showing correct answers
      answerButton.style.display = "none";

      // Count the number of correct answers
      const correctCount = Array.from(answerButtons.children).reduce(
        (count, button) => {
          if (button.dataset.correct === "true") {
            return count + 1;
          }
          return count;
        },
        0
      );

      let countSelected = 0;
      let allSelectedCorrect = true;
      let error = 0;
      let alreadyIncrementedError = false;

      Array.from(answerButtons.children).forEach((button) => {
        const isCorrect = button.dataset.correct === "true";
        const isSelected = button.classList.contains("selected");

        // If it's correct and selected, mark as correct
        if (isCorrect && isSelected) {
          button.classList.add("correct");
          button.classList.remove("selected");
          countSelected++;
        } else if (!isCorrect && isSelected) {
          // If a wrong answer is selected, mark as incorrect and indicate not all selected are correct
          button.classList.add("incorrect");
          button.classList.remove("selected");
          allSelectedCorrect = false;
          if (!alreadyIncrementedError) {
            wrong++;
            alreadyIncrementedError = true;
          }
        } else if (isCorrect && !isSelected) {
          // Mark correct answers that were not selected
          button.classList.add("correct");
          if (!alreadyIncrementedError) {
            wrong++;
            alreadyIncrementedError = true;
          }
        }

        // Disable buttons after showing correct answers
        button.disabled = true;
      });

      // Increment score only if all selected answers are correct
      if (allSelectedCorrect && countSelected === correctCount) {
        score++;
      } else if (countSelected > 0 && !allSelectedCorrect) {
        error++;
      }

      // selected answers and correct answers to the userAnswers array
      userAnswers[currentQuestionIndex] = {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: selectedButtons.map((button) =>
          escape(button.textContent)
        ),
        correctAnswers: questions[currentQuestionIndex].answers
          .filter((answer) => answer.correct)
          .map((answer) => {
            // Use a regular expression to remove HTML tags
            const plainText = answer.text.replace(/<\/?[^>]+(>|$)/g, "");
            return plainText;
          }),
        // take the index of the selected answers from selectedButtons.data-correct-index and convert to array of integers
        selectedIndex: selectedButtons.map((button) =>
          parseInt(button.dataset.correctIndex)
        ),
        // take the index of the correct answers
        correctIndex: questions[currentQuestionIndex].correctAnswerIndexes,
        isCorrect: arraysEqual(
          selectedButtons.map((button) =>
            parseInt(button.dataset.correctIndex)
          ),
          questions[currentQuestionIndex].correctAnswerIndexes
        ),
        isWeb: false,
      };

      // Add a button to display the details of the question if the question has details to be displayed
      if (questions[currentQuestionIndex].details) {
        const detailsButton = document.createElement("button");
        detailsButton.innerHTML = "Details";
        detailsButton.classList.add("details_btn");

        // Add the details button to the answerButtons div
        answerButtons.appendChild(detailsButton);

        // Add an event listener to the details button to display the details of the question
        detailsButton.addEventListener("click", () => {
          // Create a new div to display the details of the question
          const detailsDiv = document.createElement("div");
          detailsDiv.innerHTML = questions[currentQuestionIndex].details;
          detailsDiv.id = "details-div";

          // Check if the details div already exists, if it does, remove it before creating a new one
          const detailsDivEx = document.getElementById("details-div");
          if (detailsDivEx) {
            detailsDivEx.remove();
          }

          // Insert the detailsDiv after the details button
          detailsButton.insertAdjacentElement("afterend", detailsDiv);

          detailsButton.remove();

          // Add a button to hide the details
          const hideButton = document.createElement("button");
          hideButton.innerHTML = "Hide Details";
          hideButton.classList.add("details_btn");

          // Add an event listener to the hide button to hide the details
          hideButton.addEventListener("click", () => {
            // Add the details button back before removing the detailsDiv
            answerButtons.appendChild(detailsButton);
            detailsDiv.remove();
            hideButton.remove();
          });

          // Insert the hideButton after the detailsDiv
          detailsDiv.insertAdjacentElement("afterend", hideButton);
        });
      }

      // Update score
      correctAnswersDiv.textContent = `${score}`;
      wrongAnswersDiv.textContent = `${wrong}`;

      nextButton.style.display = "block";
      if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "Finish";
      }
    }

    function resetState() {
      nextButton.style.display = "none";
      answerButton.style.display = "none";
      while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
      }
    }

    function showScore() {
      resetState();
      stopTimer();
      
      // Hide timer, question number, and score container
      timerElement.style.display = "none";
      questionNumber.style.display = "none";
      scoreContainer.style.display = "none";
      
      timerElement.textContent = "00:00:00";
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      nextButton.innerHTML = "Play Again";
      nextButton.style.display = "block";

      // Equally distribute the grades based on the number of questions
      const grade = Math.round((score / questions.length) * 10);

      // Add grade information
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}! <br><br>Grade: ${grade}`;

      // Check if the result div already exists, if it does, remove it before creating a new one
      const result_div_ex = document.getElementById("result");
      if (result_div_ex) {
        result_div_ex.remove();
      }

      // Remove if there is an image displayed
      const imgElement = document.getElementsByClassName("image")[0];
      imgElement.src = "";
      imgElement.style.display = "none";

      // Remove the goButton if it exists
      goButton = document.getElementById("go-btn");
      if (goButton) {
        goButton.remove();
      }

      // Create result div
      const result_div = document.createElement("div");
      result_div.id = "result";

      if (grade >= 5) {
        result_div.style.backgroundColor = "rgba(40, 167, 69, 0.9)";
        result_div.textContent = "PASSED";
      } else {
        result_div.style.backgroundColor = "rgba(220, 53, 69, 0.9)";
        result_div.textContent = "FAILED";
      }

      // Add the result div to the DOM
      document.body.appendChild(result_div);

      // Remove existing event listeners before adding a new one
      nextButton.removeEventListener("click", handleNextButtonClick);
      nextButton.addEventListener("click", handleNextButtonClick);

      // Add button to go back to the result page
      goButton = document.createElement("button");
      goButton.innerHTML = "Go to Results";
      goButton.id = "go-btn";

      // Add the button to the DOM below the quiz div
      nextButton.insertAdjacentElement("afterend", goButton);

      // Add event listener to the button to go to the result page
      goButton.addEventListener("click", () => {
        localStorage.setItem("results", JSON.stringify(userAnswers));
        location.href = "../result/results.html";
      });
    }

    function handleNextButton() {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        localStorage.setItem("results", JSON.stringify(userAnswers));
        showScore();
      }
    }

    function handleNextButtonClick() {
      // Check if timer is = 0 to start the timer again
      if (timerElement.textContent === "00:00:00") {
        timeLeft = 90 * 60; // 90 minutes
        startTimer();
        startQuiz();
      } else {
        handleNextButton();
      }
    }

    nextButton.addEventListener("click", handleNextButtonClick);
    answerButton.addEventListener("click", showCorrectAnswers);

    // Function to update timer display
    function updateTimer() {
      if (timeLeft <= 0) {
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
      return timeLeft;
    }

    // Function to pad zero for single digits
    function padZero(num) {
      return num < 10 ? `0${num}` : num;
    }

    // Function to start the timer
    function startTimer() {
      updateTimer();
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          currentQuestionIndex = questions.length;
          // automatically click the next button when the timer reaches 0
          handleNextButton();
          // remove answer button after the timer reaches 0
          answerButton.style.display = "none";
        }
      }, 1000); // Update timer every second
    }

    // Function to stop the timer
    function stopTimer() {
      clearInterval(timerInterval);
      timeLeft = 0;
      updateTimer();
    }

    // Fix scrollbar issues
    document.addEventListener('DOMContentLoaded', function() {
      document.body.style.overflow = 'hidden';
      setTimeout(function() {
        document.body.style.overflow = '';
      }, 100);
      
      // Remove any duplicate score containers
      const scoreContainers = document.querySelectorAll('.score-container');
      if (scoreContainers.length > 1) {
        for (let i = 1; i < scoreContainers.length; i++) {
          scoreContainers[i].remove();
        }
      }
      
      // Apply modern styling to elements
      if (questionNumber) {
        questionNumber.style.background = 'linear-gradient(90deg, #6366f1, #4f46e5)';
        questionNumber.style.color = '#ffffff';
        questionNumber.style.fontWeight = '600';
        questionNumber.style.padding = '14px';
        questionNumber.style.borderRadius = '12px';
        questionNumber.style.marginBottom = '20px';
        questionNumber.style.textAlign = 'center';
        questionNumber.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      }
      
      if (timerElement) {
        timerElement.style.padding = '14px 24px';
        timerElement.style.fontSize = '22px';
        timerElement.style.fontWeight = '700';
        timerElement.style.color = '#ffffff';
        timerElement.style.backgroundColor = '#6366f1';
        timerElement.style.borderRadius = '12px';
        timerElement.style.textAlign = 'center';
        timerElement.style.width = '160px';
        timerElement.style.margin = '0 auto 30px';
        timerElement.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      }
      
      // Style score containers
      if (correctAnswersDiv && wrongAnswersDiv) {
        correctAnswersDiv.style.background = 'linear-gradient(to right, #4ade80, #22c55e)';
        correctAnswersDiv.style.color = '#ffffff';
        correctAnswersDiv.style.padding = '16px';
        correctAnswersDiv.style.flex = '1';
        correctAnswersDiv.style.borderRadius = '12px';
        correctAnswersDiv.style.fontWeight = '600';
        correctAnswersDiv.style.textAlign = 'center';
        correctAnswersDiv.style.fontSize = '20px';
        correctAnswersDiv.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        correctAnswersDiv.style.position = 'relative';
        
        wrongAnswersDiv.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
        wrongAnswersDiv.style.color = '#ffffff';
        wrongAnswersDiv.style.padding = '16px';
        wrongAnswersDiv.style.flex = '1';
        wrongAnswersDiv.style.borderRadius = '12px';
        wrongAnswersDiv.style.fontWeight = '600';
        wrongAnswersDiv.style.textAlign = 'center';
        wrongAnswersDiv.style.fontSize = '20px';
        wrongAnswersDiv.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        wrongAnswersDiv.style.position = 'relative';
        
        // Add CORRECT and WRONG labels
        correctAnswersDiv.setAttribute('data-content', 'CORRECT');
        wrongAnswersDiv.setAttribute('data-content', 'WRONG');
        
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          #correct-answers::before, #wrong-answers::before {
            content: attr(data-content);
            position: absolute;
            top: 5px;
            left: 10px;
            font-size: 10px;
            opacity: 0.7;
            letter-spacing: 1px;
          }
        `;
        document.head.appendChild(styleElement);
      }
      
      if (scoreContainer) {
        scoreContainer.style.display = 'flex';
        scoreContainer.style.justifyContent = 'space-between';
        scoreContainer.style.margin = '0 auto 30px';
        scoreContainer.style.gap = '20px';
      }
    });

    // Call startQuiz when quiz starts
    startQuiz();
    startTimer();
  } catch (error) {
    console.error(error);
    // Show error message to user
    const loadingScreen = document.getElementsByClassName("loader_container")[0];
    if (loadingScreen) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "An error occurred while loading the quiz. Please try again.";
      errorMessage.style.color = "#ffffff";
      errorMessage.style.textAlign = "center";
      errorMessage.style.marginTop = "20px";
      errorMessage.style.padding = "10px";
      errorMessage.style.backgroundColor = "rgba(220, 53, 69, 0.8)";
      errorMessage.style.borderRadius = "8px";
      
      const pulseElement = document.getElementById("pulse");
      if (pulseElement) {
        pulseElement.textContent = "Error";
        pulseElement.style.color = "#ff6b81";
        pulseElement.insertAdjacentElement("afterend", errorMessage);
      }
    }
  }
})();
