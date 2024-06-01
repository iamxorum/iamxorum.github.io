(async () => {
    try {
      // Function to fetch JSON from a file
      async function fetchJSONFile(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
        }
        return await response.json();
      }
  
      let json1;
  
      // get the h3 element with the id "quiz-title" that has id "title"and store the value in a variable
      let allQuestions;
  
      json1 = await fetchJSONFile('../assets/web.json');
      allQuestions = [...json1];
  
      const allQuestionsArray = allQuestions.flat();
  
      // Function to randomly select 'n' questions from the combined array
      function getRandomQuestions(questions, n) {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
      }

  
      // Get random questions
      let randomlyChosenQuestions;
      
      let questions;
      const questionElement = document.getElementById("question");
      const answerButtons = document.getElementById("answer-buttons");
      const nextButton = document.getElementById("next-btn");
      const answerButton = document.getElementById("answer-btn");
      const timerElement = document.getElementById("timer"); // Moved here
  
      // Create a new element to display the count of correct answers in a div
      const correctAnswers_div = document.createElement("div");
      correctAnswers_div.id = "correct-answers";
      correctAnswers_div.style.textAlign = "center";
      correctAnswers_div.style.margin = "10px auto 0";
      correctAnswers_div.style.marginBottom = "10px";
      // after the timer
      timerElement.insertAdjacentElement("afterend", correctAnswers_div);
      //add the correct answers count to the DOM
      const correctAnswers = document.getElementById("correct-answers");
  
      // Add question number element before the question (question number will be displayed above the question)
      const questionNumber = document.createElement("div");
      questionNumber.id = "question-number";
      questionElement.insertAdjacentElement("beforebegin", questionNumber);
      //Style the question number
      questionNumber.style.textAlign = "center";
      questionNumber.style.margin = "10px auto 0";
      questionNumber.style.marginBottom = "10px";
      //make him like a button with a background: #7c2c47;; and color: white; padding: 10px;
      questionNumber.style.backgroundColor = "#82dcff";
      questionNumber.style.color = "black";
      questionNumber.style.fontWeight = "bold";
      questionNumber.style.padding = "1rem";
      questionNumber.style.borderRadius = "5px";
      questionNumber.style.width = "100%";
      
      let currentQuestionIndex = 0;
      let score = 0;
      let timeLeft = 90 * 60; // 45 minutes
      let userAnswers = [];
  
      function startQuiz() {
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

        // Get all the questions from the JSON file
        randomlyChosenQuestions = getRandomQuestions(allQuestionsArray, allQuestionsArray.length);
        questions = randomlyChosenQuestions
          .map(questionData => ({
            question: String.raw`${questionData.question}`,
            img: questionData.img,
            answers: questionData.answers.map(answer => ({
              text: String.raw`${answer}`,
              correct: questionData.correctAnswerIndexes.includes(questionData.answers.indexOf(answer)),
            })),
            explication: `${questionData.explication}`,
          }));
  
        // Shuffle the answers for each question and update the correct answer indexes
        questions.forEach((question) => {
          question.answers = question.answers.sort(() => 0.5 - Math.random());
          question.correctAnswerIndexes = question.answers.reduce((indexes, answer, index) => {
            if (answer.correct) {
              indexes.push(index);
            }
            return indexes;
          }, []);
        });
        
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = "Next";
        // Add count of correct answers
        correctAnswers.id = "correct-answers";
        correctAnswers.textContent = `Correct Answers: ${score}`;
        // Add correct answers count to the DOM below the timer
        timerElement.insertAdjacentElement("afterend", correctAnswers);
        showQuestion();
  
      }
  
      function toggleAnswer(button) {
        // Toggle the selected state of the clicked button
        button.classList.toggle("selected");
      }
      
      function escape(htmlStr) {
        return htmlStr.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");        
     
      }
    
      
      function showQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        let questionNo = currentQuestionIndex + 1;
      
        // Escape html entities to prevent XSS attacks and display the question text
        const questionText = escape(currentQuestion.question).replace(/\n/g, '<br>');
        // Replace \n with <br> to display line breaks
        questionElement.innerHTML = `${questionText}`;
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
            button.textContent = answer.text;
            button.classList.add("btn");
            answerButtons.appendChild(button);            
    
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
    
            button.addEventListener("click", () => toggleAnswer(button));
        });
        
        // Show the answer button for every question
        answerButton.style.display = "block";
        answerButton.addEventListener("click", showCorrectAnswers);
      }
  
      function showCorrectAnswers() {
        // Ensure at least one answer is selected
        const selectedButtons = Array.from(answerButtons.getElementsByClassName("selected"));
        if (selectedButtons.length === 0) {
            return;
        }
    
        // Remove answer button after showing correct answers
        answerButton.style.display = "none";
    
        // Count the number of correct answers
        const correctCount = Array.from(answerButtons.children).reduce((count, button) => {
            if (button.dataset.correct === "true") {
                return count + 1;
            }
            return count;
        }, 0);
    
        let alreadyIncremented = false;
        let tempScore = score;
        let countSelected = 0;
        let allSelectedCorrect = true;
        let error = 0;
    
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
            } else if (isCorrect && !isSelected) {
                // Mark correct answers that were not selected
                button.classList.add("correct");
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

        userAnswers.push({
          question: questions[currentQuestionIndex].question,
          selectedAnswer: selectedButtons.map((button) => button.textContent),
          correctAnswers: questions[currentQuestionIndex].answers.filter(answer => answer.correct).map(answer => answer.text),
          isCorrect: allSelectedCorrect && countSelected === correctCount
        });
    
        // Update score
        correctAnswers.textContent = `Correct Answers: ${score}`;
    
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
        correctAnswers.remove();
        timerElement.textContent = "00:00:00";
        questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
        nextButton.innerHTML = "Play Again";
        nextButton.style.display = "block";
  
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
        const goButton = document.createElement("button");
        goButton.innerHTML = "Go to Results";
        goButton.classList.add("btn");

        // Add the button to the DOM below the quiz div
        nextButton.insertAdjacentElement("afterend", goButton);

        // Add event listener to the button to go to the result page
        goButton.addEventListener("click", () => {
          location.href = "../results.html";
        });
      }
      
      
      function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          showQuestion();
        } else {
          localStorage.setItem('results', JSON.stringify(userAnswers));
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
        const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
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
  