(async () => {
  const loadingScreen = document.getElementsByClassName("loader_container");
  const quizContainer = document.getElementsByClassName("body");
  const searchBox = document.getElementById("search-box");
  let allQuestions = []; // To store all questions for the current subject
  let combinedQuestions = []; // To store all questions from all subjects

  try {
    const subjects = {
      ASD: "../assets/asd.json",
      CC: "../assets/cc.json",
      CE: "../assets/ce.json",
      "C++": "../assets/cpp.json",
      CRIPTO: "../assets/crypto.json",
      DB: "../assets/db.json",
      JAVA: "../assets/java.json",
      PP: "../assets/pp.json",
      RC: "../assets/rc.json",
      SGDB: "../assets/sgdb.json",
      SO: "../assets/so.json",
      TAP: "../assets/tap.json",
      WEB: "../assets/web.json",
    };

    async function fetchJSONFile(filePath) {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${filePath}: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    }

    loadingScreen[0].style.display = "flex";
    quizContainer[0].style.display = "none";

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await sleep(Math.floor(Math.random() * 2000) + 1000);

    function escapeHTML(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\n/g, "<br>");
    }

    function renderQuestions(questions, subject, isWeb) {
      const questionsContainer = document.getElementById("questions-container");
      questionsContainer.innerHTML = "";

      const subjectTitle = document.createElement("h2");
      subjectTitle.textContent = getSubjectTitle(subject);
      subjectTitle.id = `subject-${subject}`;
      questionsContainer.appendChild(subjectTitle);

      loadingScreen[0].style.display = "none";
      quizContainer[0].style.display = "block";

      questions.forEach((questionData, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question-block");
        
        if (questionData.tobereviewd) {
          questionDiv.classList.add("tobereviewed");
          const reviewText = document.createElement("p");
          reviewText.textContent = "TREBUIE REVIZUIT DE PROFESOR";
          questionDiv.appendChild(reviewText);
        }

        const questionText = document.createElement("h4");
        questionText.innerHTML = `Q${index + 1}: ${
          isWeb ? escapeHTML(questionData.question) : questionData.question
        }`;
        questionDiv.appendChild(questionText);

        if (questionData.img) {
          const questionImg = document.createElement("img");
          questionImg.src = questionData.img;
          questionImg.alt = `Image for question ${index + 1}`;
          questionImg.loading = "lazy";
          questionDiv.appendChild(questionImg);
        }

        const answersList = document.createElement("ul");
        questionData.answers.forEach((answer, answerIndex) => {
          const answerItem = document.createElement("li");
          answerItem.innerHTML = isWeb ? escapeHTML(answer) : answer;
          if (questionData.correctAnswerIndexes.includes(answerIndex)) {
            answerItem.classList.add("correct-answer");
          }
          answersList.appendChild(answerItem);
        });
        questionDiv.appendChild(answersList);

        if (questionData.details) {
          const detailsButton = document.createElement("button");
          detailsButton.textContent = "Show Details";
          detailsButton.classList.add("details_btn");
          questionDiv.appendChild(detailsButton);

          detailsButton.addEventListener("click", () => {
            const existingDetails = document.getElementById("details-div");
            if (existingDetails) {
              existingDetails.remove();
              detailsButton.textContent = "Show Details";
              return;
            }

            const detailsDiv = document.createElement("div");
            detailsDiv.innerHTML = questionData.details;
            detailsDiv.id = "details-div";
            detailsButton.insertAdjacentElement("afterend", detailsDiv);
            detailsButton.textContent = "Hide Details";
          });
        }

        questionsContainer.appendChild(questionDiv);
      });
    }

    async function loadSubject(subject) {
      const filePath = subjects[subject];
      const subjectQuestions = await fetchJSONFile(filePath);
      allQuestions = subjectQuestions; // Store current subject questions
      renderQuestions(allQuestions, subject, subject === "WEB");
      navLinks.classList.toggle("show");
      document
        .querySelectorAll(".nav-links li button")
        .forEach((btn) => btn.classList.remove("active"));
      document
        .querySelector(`.nav-links li button[data-subject="${subject}"]`)
        .classList.add("active");
    }

    function getSubjectTitle(subject) {
      const subjectTitles = {
        WEB: "WEB - Tehnologii Web",
        ASD: "ASD - Algoritmi și Structuri de Date",
        CC: "CC - Cloud Computing",
        CE: "CE - Comerț Electronic",
        "C++": "Programare C++",
        CRIPTO: "CRIPTO - Criptografie",
        DB: "DB - Baze de Date",
        JAVA: "Programare Java",
        PP: "PP - Programare Procedurală",
        RC: "RC - Rețele de Calculatoare",
        SGDB: "SGDB - Sisteme de Gestiune a Bazelor de Date",
        SO: "SO - Sisteme de Operare",
        TAP: "TAP - Tehnici Avansate de Programare",
      };
      return subjectTitles[subject] || subject;
    }

    function filterQuestions(query) {
      const filteredQuestions = combinedQuestions.filter((question) => {
        return question.question.toLowerCase().includes(query.toLowerCase());
      });
      // Display the filtered questions AND the subject title as their subject
      renderQuestions(
        filteredQuestions,
        "Filtrate",
        query.toLowerCase().includes("web")
      );
    }

    const navLinks = document.querySelector(".nav-links");
    Object.entries(subjects).forEach(([subject]) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = subject;
      button.setAttribute("data-subject", subject);
      button.onclick = () => loadSubject(subject);
      li.appendChild(button);
      navLinks.appendChild(li);
    });

    const menuToggle = document.querySelector(".menu-toggle");
    navLinks.classList.toggle("show");
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("show");
    });

    searchBox.addEventListener("input", (event) => {
      filterQuestions(event.target.value);
    });

    // Load all questions from all subjects initially
    for (const subject of Object.keys(subjects)) {
      const subjectQuestions = await fetchJSONFile(subjects[subject]);
      combinedQuestions = combinedQuestions.concat(subjectQuestions);
    }

    // Load the first subject to display initially
    loadSubject(Object.keys(subjects)[0]);

    // Add this to the JavaScript to toggle the active class on the menu button
    document.addEventListener('DOMContentLoaded', function() {
      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      
      menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('show');
        menuToggle.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-links') && !event.target.closest('.menu-toggle')) {
          navLinks.classList.remove('show');
          menuToggle.classList.remove('active');
        }
      });
      
      // Close menu when a nav item is clicked
      document.querySelectorAll('.nav-links li button').forEach(button => {
        button.addEventListener('click', function() {
          navLinks.classList.remove('show');
          menuToggle.classList.remove('active');
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
})();
