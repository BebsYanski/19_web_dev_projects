// Select DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// const quizQuestions = [{
//         question: "What is the capital of France?",
//         answers: ["Berlin", "Madrid", "Paris", "Rome"],
//         correctAnswer: 2,
//     },
//     {
//         question: "Which planet is known as the Red Planet?",
//         answers: ["Earth", "Mars", "Jupiter", "Saturn"],
//         correctAnswer: 1,
//     },
//     {
//         question: "What is the largest ocean on Earth?",
//         answers: [
//             "Atlantic Ocean",
//             "Indian Ocean",
//             "Arctic Ocean",
//             "Pacific Ocean",
//         ],
//         correctAnswer: 3,
//     },
//     {
//         question: "Who wrote 'To Kill a Mockingbird'?",
//         answers: [
//             "Harper Lee",
//             "Mark Twain",
//             "Ernest Hemingway",
//             "F. Scott Fitzgerald",
//         ],
//         correctAnswer: 0,
//     },
//     {
//         question: "What is the chemical symbol for gold?",
//         answers: ["Au", "Ag", "Fe", "Pb"],
//         correctAnswer: 0,
//     },
// ];

const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "Berlin", isCorrect: false },
      { text: "Madrid", isCorrect: false },
      { text: "Paris", isCorrect: true },
      { text: "Rome", isCorrect: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Earth", isCorrect: false },
      { text: "Mars", isCorrect: true },
      { text: "Jupiter", isCorrect: false },
      { text: "Saturn", isCorrect: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", isCorrect: false },
      { text: "Indian Ocean", isCorrect: false },
      { text: "Arctic Ocean", isCorrect: false },
      { text: "Pacific Ocean", isCorrect: true },
    ],
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    answers: [
      { text: "Harper Lee", isCorrect: true },
      { text: "Mark Twain", isCorrect: false },
      { text: "Ernest Hemingway", isCorrect: false },
      { text: "F. Scott Fitzgerald", isCorrect: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Au", isCorrect: true },
      { text: "Ag", isCorrect: false },
      { text: "Fe", isCorrect: false },
      { text: "Pb", isCorrect: false },
    ],
  },
];

// Quiz State Variables
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// events
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  // Restart variables
  currentQuestionIndex = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  try {
    // reset state
    answersDisabled = false;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    if (!currentQuestion) {
      throw new Error("Current question is null or undefined.");
    }

    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";

    questionText.textContent = currentQuestion.question;

    // Clear answers container
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer) => {
      if (!answer || !answer.text || typeof answer.text !== "string") {
        throw new Error("Answer is null, undefined, or not a string.");
      }

      const button = document.createElement("button");
      if (!button) {
        throw new Error("Failed to create button element.");
      }

      button.textContent = answer.text;
      button.classList.add("answer-btn");

      // what is a dataset? allows us to store custom data
      button.dataset.correct = answer.isCorrect;

      button.addEventListener("click", selectAnswer);

      answersContainer.appendChild(button);
    });
  } catch (error) {
    console.error("Error in showQuestion: ", error);
  }
}

function selectAnswer(event) {
  if (answersDisabled) {
    return;
  }
  answersDisabled = true;
  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  // Show correct/incorrect feedback
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  // Move to next question after a short delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good Effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}

function restartQuiz() {
  // console.log("Quiz Restarted");
  resultScreen.classList.remove("active");
  startQuiz();
}
