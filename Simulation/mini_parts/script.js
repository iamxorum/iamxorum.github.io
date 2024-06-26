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
    let timeLeft = 90 * 60; // 45 minutes
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

      // If questionNumber and timer are hidden, show them
      timerElement.style.display = "block";
      questionNumber.style.display = "block";

      //remove correct answers count from the DOM
      correctAnswersDiv.display = "block";
      //remove wrong answers count from the DOM display none
      wrongAnswersDiv.display = "block";

      // Remove the goButton if it exists before starting the quiz
      let goButton = document.getElementById("go-btn");
      if (goButton) {
        goButton.remove();
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

    function showQuestion() {
      resetState();
      let currentQuestion = questions[currentQuestionIndex];
      let questionNo = currentQuestionIndex + 1;

      // Escape html entities to prevent XSS attacks and display the question text
      // const questionText = escape(currentQuestion.question).replace(/\n/g, '<br>');
      // Replace \n with <br> to display line breaks
      questionElement.innerHTML = currentQuestion.question;
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
        // Add a a text block that says "To be reviewed by the teacher" to the question block in caps
        const reviewText = document.createElement("p");
        reviewText.textContent = "TREBUIE REVIZUIT DE PROFESOR";
        questionElement.appendChild(reviewText);

        // add style to the reviewText
        reviewText.style.textAlign = "center";
        reviewText.style.color = "#000";
        reviewText.style.fontSize = "1.5rem";
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
      //hide correct answers count from the DOM
      correctAnswersDiv.display = "none";
      //hide wrong answers count from the DOM
      wrongAnswersDiv.display = "none";
      timerElement.textContent = "00:00:00";
      // If questionNumber and timer are hidden, show them
      timerElement.style.display = "none";
      questionNumber.style.display = "none";
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      nextButton.innerHTML = "Play Again";
      nextButton.style.display = "block";

      // Equally distribute the grades based on the number of questions
      const grade = Math.round((score / questions.length) * 10);

      // questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      // Add a tab \t to display the grade
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}! <br><br>Grade: ${grade}`;

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
        timeLeft = 45 * 60; // 45 minutes
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
