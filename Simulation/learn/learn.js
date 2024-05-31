(async () => {
  try {
    const subjects = {
      "ASD": "../assets/asd.json",
      "CC": "../assets/cc.json",
      "CE": "../assets/ce.json",
      "C++": "../assets/cpp.json",
      "CRIPTO": "../assets/crypto.json",
      "DB": "../assets/db.json",
      "JAVA": "../assets/java.json",
      "PP": "../assets/pp.json",
      "RC": "../assets/rc.json",
      "SGDB": "../assets/sgdb.json",
      "SO": "../assets/so.json",
      "TAP": "../assets/tap.json",
      "WEB": "../assets/web.json"
    };

    // Function to fetch JSON from a file
    async function fetchJSONFile(filePath) {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    }

    // Function to escape HTML entities to prevent XSS attacks
    function escapeHTML(str) {
      return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/\n/g, '<br>');
    }

    // Function to render questions
    function renderQuestions(questions, subject, isWeb) {
      const questionsContainer = document.getElementById('questions-container');
      questionsContainer.innerHTML = '';

      const subjectTitle = document.createElement('h2');
      subjectTitle.textContent = `${subject}`;
      subjectTitle.id = `subject-${subject}`;
      //center and margin 2rem 
      subjectTitle.style.textAlign = 'center';
      subjectTitle.style.marginTop = '2rem';
      subjectTitle.style.marginBottom = '2rem';
      questionsContainer.appendChild(subjectTitle);

      questions.forEach((questionData, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');

        const questionText = document.createElement('h4');
        if (isWeb) {
          questionText.innerHTML = `Q${index + 1}: ${escapeHTML(questionData.question)}`;
        } else {
          questionText.innerHTML = `Q${index + 1}: ${questionData.question}`;
        }
        questionDiv.appendChild(questionText);

        if (questionData.img) {
          const questionImg = document.createElement('img');
          questionImg.src = questionData.img;
          questionImg.alt = `Image for question ${index + 1}`;
          questionDiv.appendChild(questionImg);
        }

        const answersList = document.createElement('ul');
        questionData.answers.forEach((answer, answerIndex) => {
          const answerItem = document.createElement('li');
          answerItem.innerHTML = escapeHTML(answer);
          if (questionData.correctAnswerIndexes.includes(answerIndex)) {
            answerItem.classList.add('correct-answer');
          }
          answersList.appendChild(answerItem);
        });
        questionDiv.appendChild(answersList);

        questionsContainer.appendChild(questionDiv);
      });
    }

    // Function to load and render questions for a selected subject
    async function loadSubject(subject) {
      const filePath = subjects[subject];
      const questions = await fetchJSONFile(filePath);
      let isWeb = false;
      // if the subject is web, set isWeb to true
      if (subject === "WEB") {
        isWeb = true;
      }
      renderQuestions(questions, subject, isWeb);
      navLinks.classList.toggle('show');
      // Remove active class from all buttons
      document.querySelectorAll('.nav-links li button').forEach(btn => btn.classList.remove('active'));
      // Add active class to the clicked button
      document.querySelector(`.nav-links li button[data-subject="${subject}"]`).classList.add('active');
    }

    // Populate the navigation bar
    const navLinks = document.querySelector('.nav-links');
    Object.entries(subjects).forEach(([subject, filePath]) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = subject;
      button.setAttribute('data-subject', subject);
      button.onclick = () => loadSubject(subject);
      li.appendChild(button);
      navLinks.appendChild(li);
    });

    // Add event listener for menu toggle (if clicked again, hide the navigation bar not delete it)
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', function () {
      // Toggle the 'show' class to display or hide the navigation bar
      navLinks.classList.toggle('show');
    });


    // Load the first subject by default
    loadSubject(Object.keys(subjects)[0]);
  } catch (error) {
    console.error(error);
  }
})();