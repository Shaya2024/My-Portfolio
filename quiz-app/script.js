

 // DOM Elements
 const topicSelection = document.getElementById("topic-selection");
 const quizContainer = document.querySelector(".quiz-container");
 const quizContent = document.getElementById("quiz")
 const tryAgainBtn = document.getElementById("retry")
 const message = document.getElementById("message")
 const progressBar = document.querySelector(".progress-bar");
 const scoreContainer = document.querySelector(".score-container");
 const scoreDisplay = document.getElementById("score-display")

// Intital display
quizContainer.style.display = "none"; 


  // App state
  let currentQuestion = 0;
  let score = 0;

// Topics 
const topicToCategory = {
  Computers: 18, // Example category for "Science: Computers"
  Sports: 21, // Example category for "Mathematics"
  History: 23, // Example category for "History"
};




 async function selectTopic(topic) {
  await fetchQuestions(topic);
  topicSelection.style.display = "none"; // Hide the topic selection
  quizContainer.style.display = "block"; // Show the quiz container

   
}


document.querySelectorAll(".topic-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const selectedTopic = e.target.getAttribute("data-topic");
    selectTopic(selectedTopic);
  });
});



async function fetchQuestions(topic) {
  const category = topicToCategory[topic];
  console.log(`fetched number ${topicToCategory[topic]}`)
  const response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`
  );
  const data = await response.json();
  questions = data.results.map((item) => ({
    question: item.question,
    answers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
    correct: [...item.incorrect_answers, item.correct_answer].findIndex(
      (answer) => answer === item.correct_answer
    ),
  }));
 loadQuestion();
 quizContainer.style.display = "block"
}



  
  // Function to load a question
  function loadQuestion() {
    const questionData = questions[currentQuestion];
    quizContent.innerHTML = `
      <h2>${questionData.question}</h2>
      <ul>
        ${questionData.answers
          .map(
            (answer, index) =>
              `<li><button class="answer-btn" data-index="${index}">${answer}</button></li>`
          )
          .join("")}
      </ul>`
      updateProgressBar();
      toggleAnswerButtons(false);
      clearInterval(timer);
      startTimer(); 
    ;
  }
  
  // Function to handle answer selection
  quizContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("answer-btn")) {
      toggleAnswerButtons(true);
      clearInterval(timer);
      const selectedAnswer = parseInt(e.target.getAttribute("data-index"));
      if (selectedAnswer === questions[currentQuestion].correct) {
        score++;
        message.innerHTML = `<h2>Correct!</h2>`;
        e.target.classList.add("correct");
      } else {
        message.innerHTML = `<h2>Wrong!</h2>`;
        e.target.classList.add("wrong");
      }
      document.getElementById("current-score").textContent = `${score}/${questions.length}`;
        message.classList.add("message-fade-out"); // Add fade-out animation
  
        // Wait for the fade-out animation to complete before clearing the message
        setTimeout(() => {
          message.innerHTML = ""; // Clear the message text
          message.classList.remove("message-fade-out");
          e.target.classList.remove("correct");
        e.target.classList.remove("wrong");

      currentQuestion++;
      if (currentQuestion < questions.length) {
        loadQuestion();
      } else {
        scoreDisplay.innerHTML = 
        `<h2>Quiz Completed!</h2>
    <p>Your Score: ${score}/${questions.length}</p>
    <p>Percentage: ${(score / questions.length) * 100}%</p>`;
        scoreContainer.style.display = "block";
        quizContainer.style.display = "none"
      }  
        }, 1000); // This matches the CSS animation duration
       // Slight delay before starting the fade-out


  }});


  function toggleAnswerButtons(disabled) {
    const answerButtons = document.querySelectorAll(".answer-btn");
    answerButtons.forEach((button) => {
      button.disabled = disabled; // Disable or enable buttons
    });
  }


  // Progress Bar
function updateProgressBar() {
  
  const progress = ((currentQuestion + 1) / questions.length) * 100; // Calculate percentage
  progressBar.style.width = `${progress}%`; // Update width
}


// End of Quiz - Try again
  
  function reset() {
    currentQuestion = 0;
    score = 0;
    quizContainer.style.display = "none";
    scoreContainer.style.display = "none";
    topicSelection.style.display = "flex"; 
  }

  tryAgainBtn.addEventListener("click", reset)



let timer;
const timeLimit = 15;

function startTimer(){
  let timeLeft = timeLimit;
  document.getElementById("time-left").textContent = timeLeft;

  timer = setInterval(()=> {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeOut()
    }
  },1000)

  
}
  

function handleTimeOut(){
  message.innerHTML = `<h2>Time's up!</h2>`;
  message.classList.add("message-fade-out"); // Add fade-out animation
  
  // Wait for the fade-out animation to complete before clearing the message
  setTimeout(() => {
    message.innerHTML = ""; // Clear the message text
    message.classList.remove("message-fade-out");
    document.querySelector(".correct")?.classList.remove("correct");
    document.querySelector(".wrong")?.classList.remove("wrong");

currentQuestion++;
if (currentQuestion < questions.length) {
  loadQuestion();
} else {
  scoreDisplay.innerText = 
        `You scored ${score}/${questions.length}!`;
        scoreContainer.style.display = "block";
        quizContainer.style.display = "none"
}  
  }, 1000);


}