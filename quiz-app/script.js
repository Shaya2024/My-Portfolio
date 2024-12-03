const questions = [
    {
      question: "What is the result of typeof NaN in JavaScript?",
      answers: [
        "'number'",
        "'NaN'",
        "'undefined'",
        "'object'"
      ],
      correct: 0
    },
    {
      question: "Which of these is NOT a valid JavaScript variable name?",
      answers: [
        "_variable",
        "$123",
        "123variable",
        "variable123"
      ],
      correct: 2
    },
    {
      question: "What is the difference between == and === in JavaScript?",
      answers: [
        "== checks both value and type, === checks only value",
        "== checks only value, === checks both value and type",
        "== performs deep comparison, === performs shallow comparison",
        "== and === are equivalent"
      ],
      correct: 1
    },
    {
      question: "What is the output of the following code?\nconsole.log([1, 2, 3] + [4, 5, 6]);",
      answers: [
        "[1, 2, 3, 4, 5, 6]",
        "123456",
        "NaN",
        "Error"
      ],
      correct: 1
    },
    {
      question: "Which of these is NOT a primitive type in JavaScript?",
      answers: [
        "Symbol",
        "String",
        "Object",
        "Number"
      ],
      correct: 2
    },
    {
      question: "What is the purpose of the this keyword in JavaScript?",
      answers: [
        "It refers to the current scope",
        "It refers to the global object",
        "It refers to the object that owns the function being executed",
        "It refers to the parent object"
      ],
      correct: 2
    },
    {
      question: "What does Object.freeze() do?",
      answers: [
        "Prevents the addition of new properties",
        "Prevents modification of existing properties",
        "Prevents deletion of properties",
        "All of the above"
      ],
      correct: 3
    },
    {
      question: "What will console.log(0.1 + 0.2 === 0.3) print?",
      answers: [
        "true",
        "false",
        "NaN",
        "undefined"
      ],
      correct: 1
    },
    {
      question: "How does JavaScript handle asynchronous code execution?",
      answers: [
        "Using threads",
        "Using an event loop",
        "Using parallel processing",
        "Using synchronous blocking"
      ],
      correct: 1
    },
    {
      question: "What is the difference between let and var?",
      answers: [
        "let is block-scoped, var is function-scoped",
        "let allows redeclaration, var does not",
        "var is block-scoped, let is function-scoped",
        "There is no difference"
      ],
      correct: 0
    }
  ];
  
  // App state
  let currentQuestion = 0;
  let score = 0;
  
  // DOM Elements
  const quizContainer = document.getElementById("quiz");
  const tryAgainBtn = document.getElementById("retry")
  const message = document.getElementById("message")
  
  // Function to load a question
  function loadQuestion() {
    const questionData = questions[currentQuestion];
    quizContainer.innerHTML = `
      <h2>${questionData.question}</h2>
      <ul>
        ${questionData.answers
          .map(
            (answer, index) =>
              `<li><button class="answer-btn" data-index="${index}">${answer}</button></li>`
          )
          .join("")}
      </ul>`
    ;
  }
  
  // Function to handle answer selection
  quizContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("answer-btn")) {
      const selectedAnswer = parseInt(e.target.getAttribute("data-index"));
      if (selectedAnswer === questions[currentQuestion].correct) {
        score++;
        message.innerHTML = `<h2>Correct!</h2>`;
      } else {
        message.innerHTML = `<h2>Wrong!</h2>`;
        
      }
      currentQuestion++;
      if (currentQuestion < questions.length) {
        loadQuestion();
      } else {
        quizContainer.innerHTML = `<h2>You scored ${score}/${questions.length}!</h2>`;
        tryAgainBtn.style.display = "block";
      }    }
  });
  
  function reset() {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
    tryAgainBtn.style.display = "none";

  }

  tryAgainBtn.addEventListener("click", reset)
  
  // Initialize the quiz
  loadQuestion();
