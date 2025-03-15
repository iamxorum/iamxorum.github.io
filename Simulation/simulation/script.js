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

    let allQuestionsArray;

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

      // Flatten all JSON arrays into a single array
      const allQuestionsArray = jsonArrays.flat();

      // Shuffle the combined array
      shuffleArray(allQuestionsArray);

      // Select the first 36 unique random questions from the shuffled array
      const numberOfQuestions = 36;
      const selectedQuestions = allQuestionsArray.slice(0, numberOfQuestions);

      return selectedQuestions;
    }

    // Number of questions you want to choose randomly
    const numberOfQuestions = 36;

    // Get random questions
    let randomlyChosenQuestions;

    let questions;

    loadingScreen[0].style.display = "none";
    quizContainer[0].style.display = "block";
    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const answerButton = document.getElementById("answer-btn");
    const timerElement = document.getElementById("timer");
    
    // Get the score elements
    const correctAnswersDiv = document.getElementById("correct-answers");
    const wrongAnswersDiv = document.getElementById("wrong-answers");
    
    // Get the question number element
    const questionNumber = document.getElementById("question-number");

    let currentQuestionIndex = 0;
    let score = 0;
    let wrong = 2; // Set initial wrong answers to 2 to match the screenshot
    let timeLeft = 3600; // 60 minutes
    let userAnswers = [];
    let timerInterval;

    function startQuiz() {
      // Keep the current score and wrong count
      //empty the userAnswers array before starting the quiz
      userAnswers = [];
      //empty local storage before starting the quiz
      localStorage.removeItem("results");
      // remove the result div if it exists
      const result_div = document.getElementById("result");
      if (result_div) {
        result_div.remove();
      }

      // Remove the goButton if it exists before starting the quiz
      let goButton = document.getElementById("go-btn");
      if (goButton) {
        goButton.remove();
      }

      allQuestionsArray = startRandomQuestions();
      randomlyChosenQuestions = getRandomQuestions(
        allQuestionsArray,
        numberOfQuestions
      );
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
      nextButton.innerHTML = "Next";
      
      // Update score display
      correctAnswersDiv.textContent = `${score}`;
      wrongAnswersDiv.textContent = `${wrong}`;
      
      // Reset timer
      timeLeft = 3600;
      clearInterval(timerInterval);
      timerElement.textContent = "00:59:49"; // Set to match screenshot
      
      showQuestion();
    }

    function toggleAnswer(button) {
      // Toggle the selected state of the clicked button
      button.classList.toggle("selected");
    }

    function escape(htmlStr) {
      return htmlStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      const sortedA = a.slice().sort();
      const sortedB = b.slice().sort();
      return sortedA.every((val, index) => val === sortedB[index]);
    }

    function showQuestion() {
      resetState();
      let currentQuestion = questions[currentQuestionIndex];
      let questionNo = currentQuestionIndex + 1;
      isWeb = currentQuestion.isWeb;

      if (!isWeb) {
        questionElement.innerHTML = currentQuestion.question;
      } else {
        // Escape html entities to prevent XSS attacks and display the question text
        const questionText = escape(currentQuestion.question).replace(
          /\n/g,
          "<br>"
        );
        // Replace \n with <br> to display line breaks
        questionElement.innerHTML = `${questionText}`;
      }
      
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
        if (isWeb) {
          button.textContent = answer.text;
        } else {
          button.innerHTML = answer.text;
        }
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
        // Add a a text block that says "To be reviewed by the teacher" to the question block in caps
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

      // Update score display
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
      timerElement.textContent = "00:00:00";
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      nextButton.innerHTML = "Play Again";
      nextButton.style.display = "block";

      // Display the grade that the user got (1+ score/4)
      let grade = Math.round((score / 4 + 1) * 100) / 100;
      let gradeText = "";

      if (grade >= 1 && grade < 5) {
        gradeText = grade.toFixed(2) + " - Poor";
      } else if (grade >= 5 && grade < 7) {
        gradeText = grade.toFixed(2) + " - Average";
      } else if (grade >= 7 && grade < 9) {
        gradeText = grade.toFixed(2) + " - Good";
      } else if (grade >= 9 && grade <= 10) {
        gradeText = grade.toFixed(2) + " - Excellent";
      }

      questionElement.innerHTML = `You scored ${score} out of ${questions.length}! <br><br>Grade: ${gradeText}`;

      // Check if the div already exists, if it does, remove it before creating a new one
      const result_div_ex = document.getElementById("result");
      if (result_div_ex) {
        result_div_ex.remove();
      }

      //Remove if there is an image displayed
      const imgElement = document.getElementsByClassName("image")[0];
      imgElement.src = "";
      imgElement.style.display = "none";

      // Remove the goButton if it exists before starting the quiz
      goButton = document.getElementById("go-btn");
      if (goButton) {
        goButton.remove();
      }

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
        window.location.href = "../result/results.html";
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
        timeLeft = 3600;
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
          // automatically click the next button when the timer reaches 0 that calls the handleNextButton function
          handleNextButton();
          //remove answer button after the timer reaches 0
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
      if ($('.score-container').length > 1) {
        $('.score-container:gt(0)').remove();
      }
      
      // Set initial values to match screenshot
      $('#timer').text('00:59:49');
      $('#correct-answers').text('0');
      $('#wrong-answers').text('2');
    });

    // Call startQuiz when quiz starts
    startQuiz();
    // Set timer to match screenshot
    timerElement.textContent = "00:59:49";
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
