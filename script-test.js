window.addEventListener("DOMContentLoaded", () => {
  const studentName = localStorage.getItem("studentName");
  const examName = localStorage.getItem("examName");
  const examTimer = parseInt(localStorage.getItem("examTimer"), 10);
  const questionsContainer = document.getElementById("questionsContainer");
  const questionnoContainer = document.getElementById("questionnoContainer");
  const timerDisplay = document.getElementById("timeRemaining");
  let visitedindex = [];

  const userAnswers = {}; // To store user's selected answers

  // Example hardcoded answers (you can replace this with actual answer keys)
  const correctAnswers = [
    "A", "C", "B", "D", "A", "B", "C", "D", "A", "C",
    "B", "A", "D", "C", "B", "E", "A", "C", "D", "B",
    "A", "C", "D", "B", "E", "A", "C", "B", "D", "A",
    "C", "B", "A", "D", "C", "B", "E", "A", "C", "B",
    "D", "A", "C", "B", "D", "A", "C", "B", "D", "E",
    "A", "B", "C", "D", "A", "C", "B", "D", "A", "C",
    "B", "A", "D", "C", "B", "A", "C", "B", "D", "A",
    "B", "C", "D", "A", "C",
  ];
  // Answer options for each question

  // Utility function to show pop-up messages
  function showPopup(message, onConfirm = null, onCancel = null) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popupMessage");
    const popupButtons = document.getElementById("popupButtons");

    popupMessage.textContent = message;
    popup.style.display = "flex";

    // Clear existing buttons
    popupButtons.innerHTML = "";

    // Confirm Button
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "OK";
    confirmButton.classList.add("popup-btn", "confirm-btn");
    confirmButton.onclick = () => {
      popup.style.display = "none";
      if (onConfirm) onConfirm();
    };
    popupButtons.appendChild(confirmButton);

    // Cancel Button
    if (onCancel) {
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.classList.add("popup-btn", "cancel-btn");
      cancelButton.onclick = () => {
        popup.style.display = "none";
        if (onCancel) onCancel();
      };
      popupButtons.appendChild(cancelButton);
    }
  }

  if (!studentName || !examName || !examTimer) {
    showPopup("Missing student or exam details. Please start from the upload page.", () => {
      window.location.href = "upload.html";
    });
    return;
  }

  document.getElementById("studentNameDisplay").textContent = `Name: ${studentName}`;
  document.getElementById("examNameDisplay").textContent = `${examName}`;

  // Assuming the images are located in a folder called "images"
  const storedImages = [];
  for (let i = 1; i <= correctAnswers.length; i++) {
    storedImages.push({ data: `images/${i}.jpg` });
  }

  if (!storedImages || storedImages.length === 0) {
    showPopup("No questions found. Please upload images first.", () => {
      window.location.href = "upload.html";
    });
    return;
  }

  let currentQuestionIndex = 0;

  function updateQuestionButtonState() {
    const questionButtons = document.querySelectorAll(".question-btn");

    questionButtons.forEach((button, index) => {
      if (userAnswers[index] === undefined) {
        button.classList.remove("answered"); // Remove visited state if not answered
      } else {
        button.classList.add("answered"); // Mark as visited
      }
    });

    questionButtons.forEach((button, index) => {
      const questionNo = index; // Assuming question numbers start from 1
      if (visitedindex.includes(questionNo)) {
        button.classList.add("visited");  // Add 'visited'
      } else {
        button.classList.remove("visited"); // Remove if not visited
      }
    });
  }

  function displayQuestion(index) {
    questionsContainer.innerHTML = ""; // Clear existing content
    questionnoContainer.innerHTML = ""; // Clear existing content
    visitedindex.push(index);

    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionNumber = document.createElement("p");
    questionNumber.classList.add("question-number");
    questionNumber.textContent = `Question ${index + 1}:`;

    const questionImage = document.createElement("img");
    questionImage.src = storedImages[index].data;
    questionImage.alt = `Question ${index + 1}`;
    questionImage.classList.add("question-image");

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    ["A", "B", "C", "D"].forEach((option) => {
      const label = document.createElement("label");
      label.classList.add("option");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `answer_${index}`;
      input.value = option;

      // Restore saved answer
      if (userAnswers[index] === option) {
        input.checked = true;
        updateQuestionButtonState(index);
      }

      input.addEventListener("change", () => {
        userAnswers[index] = option;
        updateQuestionButtonState();
      });

      label.appendChild(input);
      label.append(` ${option}`);
      optionsDiv.appendChild(label);
    });

    const textBoxLabel = document.createElement("label");
    textBoxLabel.classList.add("text-option");

    const textBox = document.createElement("input");
    textBox.type = "text";
    textBox.name = `answer_${index}_text`;
    textBox.placeholder = "Type your answer here";

    // Restore saved text answer
    if (userAnswers[index] && typeof userAnswers[index] === "string") {
      textBox.value = userAnswers[index];
    }

    textBox.addEventListener("input", () => {
      userAnswers[index] = textBox.value;
    });

    textBoxLabel.textContent = "E: ";
    textBoxLabel.appendChild(textBox);
    optionsDiv.appendChild(textBoxLabel);

    questionDiv.appendChild(questionNumber);
    questionDiv.appendChild(questionImage);
    questionDiv.appendChild(optionsDiv);

    // Navigation Buttons (Back, Next)
    const navButtonsDiv = document.createElement("div");
    navButtonsDiv.classList.add("navigation-buttons");

    if (index > 0) {
      const backButton = document.createElement("button");
      backButton.textContent = "Back";
      backButton.classList.add("nav-btn");
      backButton.onclick = () => {
        displayQuestion(index - 1);
      };
      navButtonsDiv.appendChild(backButton);
    }

    if (index < storedImages.length - 1) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.classList.add("nav-btn");
      nextButton.onclick = () => {
        displayQuestion(index + 1);
      };
      navButtonsDiv.appendChild(nextButton);
    }

    questionDiv.appendChild(navButtonsDiv);

    // Question Buttons (1, 2, 3, etc.)
    const questionButtonsDiv = document.createElement("div");
    questionButtonsDiv.classList.add("question-buttons");

    storedImages.forEach((_, i) => {
      const questionButton = document.createElement("button");
      questionButton.textContent = i + 1;
      questionButton.classList.add("question-btn");

      // Highlight the button corresponding to the current question
      if (i === index) {
        questionButton.classList.add("active");
      }

      questionButton.onclick = () => {
        currentQuestionIndex = i;
        displayQuestion(i);
      };

      questionButtonsDiv.appendChild(questionButton);
    });

    questionnoContainer.appendChild(questionButtonsDiv);
    questionsContainer.appendChild(questionDiv);
    updateQuestionButtonState();
  }

  displayQuestion(currentQuestionIndex);

  let timerSeconds = examTimer * 60;

  const timerInterval = setInterval(() => {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;

    timerDisplay.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      showPopup("Time is up! Submitting your answers.", () => submitAnswers(true));
    } else {
      timerSeconds--;
    }
  }, 1000);

  document.getElementById("submitBtn").addEventListener("click", () => {
    showPopup(
      "Are you sure you want to submit the test? Once submitted, you cannot make changes.",
      () => submitAnswers(false), // On Confirm
      () => { } // On Cancel, do nothing and return to the exam
    );
  });

  function submitAnswers(autoSubmit) {
    const answers = [];
    let correctAnswersCount = 0;
    let notAnsweredCount = 0;

    storedImages.forEach((_, index) => {
      const selectedOption = userAnswers[index];
      const correctAnswer = correctAnswers[index] || "No correct answer provided";

      const normalizedSelectedOption = String(selectedOption).trim();
      const normalizedCorrectAnswer = String(correctAnswer).trim();

      const isAnswered = normalizedSelectedOption !== "" && normalizedSelectedOption !== "No answer provided";

      let result, userAnswer = selectedOption || "No answer provided";

      if (isAnswered) {
        // If answered, compare the answers
        const isCorrect = normalizedSelectedOption === normalizedCorrectAnswer;
        result = isCorrect ? "Correct" : "Incorrect";
        if (isCorrect) {
          correctAnswersCount++;
        } else {
          result = "Incorrect";
        }
      } else {
        // If not answered
        result = "Not Answered";
        userAnswer = "No answer provided";
        notAnsweredCount++;
      }

      answers.push({
        Question: `Question ${index + 1}`,
        YourAnswer: userAnswer,
        CorrectAnswer: correctAnswer,
        Result: result,
      });
    });

    const incorrectAnswersCount = storedImages.length - correctAnswersCount - notAnsweredCount; // Exclude unanswered questions



    const scoreData = {
      totalQuestions: storedImages.length,
      correctAnswers: correctAnswersCount,
      incorrectAnswers: incorrectAnswersCount,
      notAnswered: notAnsweredCount,
      percentage: ((correctAnswersCount / storedImages.length) * 100).toFixed(2),
    };

    localStorage.setItem("scoreData", JSON.stringify(scoreData));
    localStorage.setItem("userAnswers", JSON.stringify(answers));

    // Export results to Excel
    exportResultsToExcel(answers, scoreData);

    window.location.href = "results.html";
  }

  function exportResultsToExcel(answers, scoreData) {
    const studentName = localStorage.getItem("studentName");
    const examName = localStorage.getItem("examName");

    const workbook = XLSX.utils.book_new();

    const answersSheet = XLSX.utils.json_to_sheet(answers);
    XLSX.utils.book_append_sheet(workbook, answersSheet, "Answers");

    const scoreSheet = XLSX.utils.json_to_sheet([scoreData]);
    XLSX.utils.book_append_sheet(workbook, scoreSheet, "Score Summary");

    const fileName = `${studentName}_${examName}_Results.xlsx`;

    XLSX.writeFile(workbook, fileName);
  }

  window.onbeforeunload = () => "Refreshing the page will lose all progress. Are you sure?";
});
