(async () => {
  const loadingScreen = document.getElementsByClassName("loader_container");
  const quizContainer = document.getElementsByClassName("body");
  const searchBox = document.getElementById("search-box");
  let allQuestions = []; // To store all questions for the current subject

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
      subjectTitle.style.textAlign = "center";
      subjectTitle.style.marginTop = "2rem";
      subjectTitle.style.marginBottom = "2rem";
      subjectTitle.style.fontWeight = "bold";
      subjectTitle.style.color = "#fafafa";
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
          reviewText.style.textAlign = "center";
          reviewText.style.color = "#000";
          reviewText.style.fontSize = "1.5rem";
          reviewText.style.fontWeight = "bold";
          reviewText.style.marginTop = "1rem";
          reviewText.style.marginBottom = "1rem";
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

        // Add a button to display the the details of the question if the question has details to be displayed
        if (questionData.details) {
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
          questionDiv.appendChild(detailsButton);

          // Add an event listener to the details button to display the details of the question
          detailsButton.addEventListener("click", () => {
            // Create a new div to display the details of the question
            const detailsDiv = document.createElement("div");
            detailsDiv.innerHTML = questionData.details;
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
              questionDiv.appendChild(detailsButton);
              detailsDiv.remove();
              hideButton.remove();
            });

            // Insert the hideButton after the detailsDiv
            detailsDiv.insertAdjacentElement("afterend", hideButton);
          });
        }

        questionsContainer.appendChild(questionDiv);
      });
    }

    async function loadSubject(subject) {
      const filePath = subjects[subject];
      allQuestions = await fetchJSONFile(filePath);
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
      const filteredQuestions = allQuestions.filter((question) => {
        return question.question.toLowerCase().includes(query.toLowerCase());
      });
      const currentSubject = document
        .querySelector(".nav-links li button.active")
        .getAttribute("data-subject");
      renderQuestions(
        filteredQuestions,
        currentSubject,
        currentSubject === "WEB"
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

    loadSubject(Object.keys(subjects)[0]);
  } catch (error) {
    console.error(error);
  }
})();
