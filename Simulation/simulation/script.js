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

      // Flatten all JSON arrays into a single array
      const allQuestionsArray = jsonArrays.flat();

      // Shuffle the combined array
      shuffleArray(allQuestionsArray);

      // Select the first 36 unique rnadom questions from the shuffled array
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
    const timerElement = document.getElementById("timer"); // Moved here

    // Create a new element to display the count of correct and wrong answers
    const answerCountsDiv = document.createElement("div");
    // Create elements for correct and wrong answer counts
    const correctAnswersDiv = document.createElement("div");
    const wrongAnswersDiv = document.createElement("div");
    // Set IDs and initial text content for the correct and wrong answer counts
    correctAnswersDiv.id = "correct-answers";
    correctAnswersDiv.textContent = `0`;
    wrongAnswersDiv.id = "wrong-answers";
    wrongAnswersDiv.textContent = `0`;
    // Append the correct and wrong answer divs to the answerCountsDiv
    answerCountsDiv.appendChild(correctAnswersDiv);
    answerCountsDiv.appendChild(wrongAnswersDiv);
    // Style the answerCountsDiv
    answerCountsDiv.style.textAlign = "center";
    answerCountsDiv.style.margin = "10px auto";
    answerCountsDiv.style.display = "flex";
    answerCountsDiv.style.flexDirection = "row";
    answerCountsDiv.style.justifyContent = "space-around";
    // Insert the answerCountsDiv after the timer element
    timerElement.insertAdjacentElement("afterend", answerCountsDiv);
    // Add question number element before the question (question number will be displayed above the question)
    const questionNumber = document.createElement("div");
    questionNumber.id = "question-number";
    questionElement.insertAdjacentElement("beforebegin", questionNumber);
    //Style the question number
    questionNumber.style.textAlign = "center";
    questionNumber.style.margin = "10px auto 0";
    questionNumber.style.marginBottom = "10px";
    //make him like a button with a background: #7c2c47;; and color: white; padding: 10px;
    questionNumber.style.backgroundColor = "#4447f1";
    questionNumber.style.color = "#fafafa";
    questionNumber.style.fontWeight = "bold";
    questionNumber.style.padding = "1rem";
    questionNumber.style.borderRadius = "5px";
    questionNumber.style.width = "100%";

    let currentQuestionIndex = 0;
    let score = 0;
    let wrong = 0;
    let timeLeft = 3600; // 30 minutes
    let userAnswers = [];

    function startQuiz() {
      score = 0;
      wrong = 0;
      //empty the userAnswers array before starting the quiz
      userAnswers = [];
      //empyt local storage before starting the quiz
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

      //remove correct answers count from the DOM
      correctAnswersDiv.display = "block";
      //remove wrong answers count from the DOM display none
      wrongAnswersDiv.display = "block";
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
      score = 0;
      nextButton.innerHTML = "Next";
      // Add count of correct answers
      correctAnswersDiv.id = "correct-answers";
      correctAnswersDiv.textContent = `0`;
      // Add count of wrong answers
      wrongAnswersDiv.id = "wrong-answers";
      wrongAnswersDiv.textContent = `0`;
      // Add correct answers count to the DOM below the timer
      timerElement.insertAdjacentElement("afterend", answerCountsDiv);
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
      questionNumber.textContent = `${questionNo}/${questions.length}`;

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

        // add style to the reviewText
        reviewText.style.textAlign = "center";
        reviewText.style.color = "red";
        reviewText.style.fontWeight = "bold";
        reviewText.style.marginTop = "1rem";
        reviewText.style.marginBottom = "1rem";
      } else {
        questionElement.classList.remove("tobereviewed");
      }

      // Show the answer button for every question
      answerButton.style.display = "block";
      answerButton.addEventListener("click", showCorrectAnswers);
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

      if (isWeb) {
        userAnswers[currentQuestionIndex] = {
          question: questions[currentQuestionIndex].question,
          selectedAnswer: selectedButtons.map((button) =>
            escape(button.textContent)
          ),
          correctAnswers: questions[currentQuestionIndex].answers
            .filter((answer) => answer.correct)
            .map((answer) => {
              return answer.text;
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
          isWeb: questions[currentQuestionIndex].isWeb,
        };
      } else {
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
          isWeb: questions[currentQuestionIndex].isWeb,
        };
      }

      // Add a button to display the the details of the question if the question has details to be displayed
      if (questions[currentQuestionIndex].details) {
        const detailsButton = document.createElement("button");
        detailsButton.innerHTML = "Details";
        detailsButton.classList.add("details_btn");
        detailsButton.style.backgroundColor = "#4447f1";
        detailsButton.style.color = "#fafafa";
        detailsButton.style.fontWeight = "bold";
        detailsButton.style.borderRadius = "5px";
        detailsButton.style.width = "100%";
        detailsButton.style.marginTop = "1rem";
        detailsButton.style.marginBottom = "1rem";
        detailsButton.style.padding = "1rem";
        detailsButton.style.fontSize = "1rem";
        detailsButton.style.cursor = "pointer";
        detailsButton.style.transition = "all 0.3s";
        detailsButton.style.display = "block";

        // Add the details button to the answerButtons div
        answerButtons.appendChild(detailsButton);

        // Add an event listener to the details button to display the details of the question
        detailsButton.addEventListener("click", () => {
          // Create a new div to display the details of the question
          const detailsDiv = document.createElement("div");
          detailsDiv.innerHTML = questions[currentQuestionIndex].details;
          detailsDiv.style.marginTop = "1rem";
          detailsDiv.style.marginBottom = "1rem";
          detailsDiv.style.padding = "1rem";
          detailsDiv.style.backgroundColor = "#f1f1f1";
          detailsDiv.style.borderRadius = "5px";
          detailsDiv.style.fontSize = "1rem";
          detailsDiv.style.lineHeight = "1.5rem";
          detailsDiv.style.fontWeight = "normal";
          detailsDiv.style.color = "#000";
          detailsDiv.style.transition = "all 0.3s";
          detailsDiv.style.display = "block";
          detailsDiv.style.width = "100%";

          // Check if the details div already exists, if it does, remove it before creating a new one
          const detailsDivEx = document.getElementById("details-div");
          if (detailsDivEx) {
            detailsDivEx.remove();
          }

          // Add an id to the detailsDiv
          detailsDiv.id = "details-div";

          // Insert the detailsDiv after the details button
          detailsButton.insertAdjacentElement("afterend", detailsDiv);

          detailsButton.remove();

          // Add a button to hide the details
          const hideButton = document.createElement("button");
          hideButton.innerHTML = "Hide Details";
          hideButton.classList.add("details_btn");
          hideButton.style.backgroundColor = "#4447f1";
          hideButton.style.color = "#fafafa";
          hideButton.style.fontWeight = "bold";
          hideButton.style.borderRadius = "5px";
          hideButton.style.width = "100%";
          hideButton.style.marginTop = "1rem";
          hideButton.style.marginBottom = "1rem";
          hideButton.style.padding = "1rem";
          hideButton.style.fontSize = "1rem";
          hideButton.style.cursor = "pointer";
          hideButton.style.transition = "all 0.3s";
          hideButton.style.display = "block";

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
      while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
      }
    }

    function showScore() {
      resetState();
      stopTimer();
      //remove correct answers count from the DOM
      correctAnswersDiv.display = "none";
      //remove wrong answers count from the DOM display none
      wrongAnswersDiv.display = "none";
      timerElement.textContent = "00:00:00";
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      nextButton.innerHTML = "Play Again";
      nextButton.style.display = "block";

      // Display the grade that the user got (1+ score/4)
      let grade = score / 4 + 1;
      let gradeText = "";

      if (grade >= 1 && grade < 5) {
        gradeText = grade + " - Poor";
      } else if (grade >= 5 && grade < 7) {
        gradeText = grade + " - Average";
      } else if (grade >= 7 && grade < 9) {
        gradeText = grade + " - Good";
      } else if (grade >= 9 && grade < 10) {
        gradeText = grade + " - Excellent";
      }

      // questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      // Add a tab \t to display the grade
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}! <br><br>Grade: ${gradeText}`;

      // If the grade is  >= 5, create a new div to put below the quiz div to display a message "PASSED" with a green background
      // If the grade is < 5, create a new div to put below the quiz div to display a message "FAILED" with a red background
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
      result_div.style.textAlign = "center";
      result_div.style.padding = "10px";
      // margin: 100px auto 0;
      result_div.style.margin = "10px auto 0";
      result_div.style.color = "white";
      result_div.style.fontWeight = "bold";
      result_div.style.fontSize = "20px";
      result_div.style.borderRadius = "5px";
      result_div.style.width = "90%";
      result_div.style.maxWidth = "80rem";
      result_div.style.display = "block";

      if (grade >= 5) {
        result_div.style.backgroundColor = "green";
        result_div.textContent = "PASSED";
      } else {
        result_div.style.backgroundColor = "red";
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
      goButton.classList.add("btn");
      goButton.id = "go-btn";

      // Add the button to the DOM below the quiz div
      nextButton.insertAdjacentElement("afterend", goButton);

      // Add event listener to the button to go to the result page
      goButton.addEventListener("click", () => {
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
          //remove answer button after the timer reaches 0
          answerButton.style.display = "none";
        }
      }, 1000); // Update timer every second
    }

    // Function to stop the timer
    function stopTimer() {
      timeLeft = 0;
    }

    // Call startTimer when quiz starts
    startQuiz();
    startTimer();
  } catch (error) {
    console.error(error);
  }
})();
