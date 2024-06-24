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
      //empty the userAnswers2 array and userAnswers map before starting the quiz
      userAnswers2 = [];
      userAnswer.clear();
      //empyt local storage before starting the quiz
      localStorage.removeItem("results");
      // remove the result div if it exists
      const result_div = document.getElementById("result");
      if (result_div) {
        result_div.remove();
      }

      quizContainer[0].style.marginTop = "0rem";

      // If questionNumber and timer are hidden, show them
      timerElement.style.display = "block";
      questionNumber.style.display = "block";
      navigation_questions.style.display = "flex";

      // remove all the question number buttons before starting the quiz
      while (navigation_questions.firstChild) {
        navigation_questions.removeChild(navigation_questions.firstChild);
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
      // Create buttons for each question to append to the navigation_questions div
      questions.forEach((question, index) => {
        const button = document.createElement("button");
        button.textContent = index + 1;
        button.classList.add("btn");
        button.addEventListener("click", () => {
          currentQuestionIndex = index;
          showQuestion();
        });
        navigation_questions.appendChild(button);
      });
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
      if (currentQuestionIndex === questions.length) {
        localStorage.setItem("results", JSON.stringify(userAnswers2));
        return;
      }

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

      // Make the current question number button active and a bit bigger
      const questionButtons = Array.from(navigation_questions.children);
      questionButtons.forEach((button, index) => {
        if (index === currentQuestionIndex) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      });

      // Check if the user has already answered the current question
      if (userAnswer.has(currentQuestionIndex)) {
        const userAnswerData = userAnswer.get(currentQuestionIndex);
        const selectedAnswers = userAnswerData.selectedAnswer;

        // Loop through the selected answers
        selectedAnswers.forEach((selectedAnswer) => {
          // Find the corresponding answer element in the UI
          const answerElement = Array.from(answerButtons.children).find(
            (button) => {
              return button.textContent.trim() === selectedAnswer; // Trim textContent to remove leading/trailing whitespace
            }
          );

          // If the answer element is found, mark it as selected
          if (answerElement) {
            answerElement.classList.add("selected");
          }
        });
      }

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
      nextButton.style.display = "block";

      // from the second to the last question, show the prevButton to go back to the previous question
      if (currentQuestionIndex > 0) {
        prevButton.style.display = "block";
      } else {
        prevButton.style.display = "none";
      }

      if (currentQuestionIndex === questions.length - 1) {
        nextButton.innerHTML = "Submit";
        // Remove next-btn id and add sub-btn id to the next button
        nextButton.id = "sub-btn";
      } else {
        nextButton.innerHTML = "Next";
        // Remove sub-btn id and add next-btn id to the next button
        nextButton.id = "next-btn";
      }

      // if it's Submited, remove the next button listener and add the showScore function
      if (nextButton.id === "sub-btn") {
        nextButton.removeEventListener("click", handleNextButtonClick);
        nextButton.addEventListener("click", handleSubButtonClick);
      } else {
        nextButton.removeEventListener("click", handleSubButtonClick);
        nextButton.addEventListener("click", handleNextButtonClick);
      }
    }

    function arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      const sortedA = a.slice().sort();
      const sortedB = b.slice().sort();
      return sortedA.every((val, index) => val === sortedB[index]);
    }

    function storeAnswers() {
      // Ensure at least one answer is selected
      selectedButtons = Array.from(
        answerButtons.getElementsByClassName("selected")
      );
      if (selectedButtons.length === 0) {
        // If the user didn't select any answer but before it was selected, remove the answered class from the question number button
        const questionButtons = Array.from(navigation_questions.children);
        questionButtons[currentQuestionIndex].classList.remove("answered");
        return;
      }

      // Store the selected answers in the userAnswers array for the current index (when the user cames back, to update the answers for the current question)
      // if the answers are correct, set correct as 1, else set it as 0
      if (isWeb) {
        userAnswer.set(currentQuestionIndex, {
          question: questions[currentQuestionIndex].question,
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
          selectedAnswer: selectedButtons.map((button) =>
            escape(button.textContent)
          ),
          // take the index of the correct answers
          correctAnswers: questions[currentQuestionIndex].answers
            .filter((answer) => answer.correct)
            .map((answer) => {
              return answer.text;
            }),
        });
      } else {
        userAnswer.set(currentQuestionIndex, {
          question: questions[currentQuestionIndex].question,
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
          selectedAnswer: selectedButtons.map((button) =>
            escape(button.textContent)
          ),
          // take the index of the correct answers
          correctAnswers: questions[currentQuestionIndex].answers
            .filter((answer) => answer.correct)
            .map((answer) => {
              // Use a regular expression to remove HTML tags
              const plainText = answer.text.replace(/<\/?[^>]+(>|$)/g, "");
              return plainText;
            }),
        });
      }

      // add answered class to the question number button
      const questionButtons = Array.from(navigation_questions.children);
      questionButtons[currentQuestionIndex].classList.add("answered");
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
      // Calculate the score by seekeing the correct answers from the userAnswers array with the isCorrect = true (increment the score by 1 for each correct answer)
      score = 0;

      userAnswer.forEach((answer) => {
        if (answer.isCorrect) {
          score++;
        }
      });

      // Hide the navigation_questions div
      navigation_questions.style.display = "none";

      //add margin top to the result div
      quizContainer[0].style.marginTop = "20rem";

      // Remove prevButton if it exists
      if (prevButton) {
        prevButton.style.display = "none";
      }

      // Convert the userAnswers Map to an array
      userAnswers2 = Array.from(userAnswer.values());

      timerElement.textContent = "00:00:00";
      // Hide timer and question number
      timerElement.style.display = "none";
      questionNumber.style.display = "none";
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

      const div_control = document.getElementsByClassName("control_flow")[0];

      console.log(userAnswers2);

      // Add the button to the DOM below the quiz div
      div_control.insertAdjacentElement("afterend", goButton);

      // Add event listener to the button to go to the result page
      goButton.addEventListener("click", () => {
        window.location.href = "../result/results.html";
      });
    }

    function handleSubButtonClick() {
      showScore();
      localStorage.setItem("results", JSON.stringify(userAnswers2));
    }

    function handleNextButton() {
      if (currentQuestionIndex < questions.length) {
        storeAnswers();
        currentQuestionIndex++;
        showQuestion();
      } else {
        showScore();
        localStorage.setItem("results", JSON.stringify(userAnswers2));
      }
    }

    function handlePrevButton() {
      if (currentQuestionIndex < questions.length) {
        storeAnswers();
        currentQuestionIndex--;
        showQuestion();
      } else {
        // Check if all the question buttons have the answered class
        // If they do, show the score, else show an alert to answer all questions
        const questionButtons = Array.from(navigation_questions.children);
        const answeredQuestions = questionButtons.filter((button) =>
          button.classList.contains("answered")
        );
        if (answeredQuestions.length === questions.length) {
          showScore();
          localStorage.setItem("results", JSON.stringify(userAnswers2));
        } else {
          alert("Please answer all questions before submitting.");
        }
      }
    }

    prevButton.addEventListener("click", () => {
      handlePrevButton();
    });

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
