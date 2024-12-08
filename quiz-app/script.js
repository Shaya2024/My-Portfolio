 // DOM Elements
 const topicSelection = document.getElementById("topic-selection");
 const quizContainer = document.getElementById("quiz");
 const tryAgainBtn = document.getElementById("retry")
 const message = document.getElementById("message")

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




 function selectTopic(topic) {
  console.log(`Selected Topic: ${topic}`); // For debugging
  topicSelection.style.display = "none"; // Hide the topic selection
  quizContainer.style.display = "block"; // Show the quiz container
   fetchQuestions(topic)
   
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
 loadQuestion()
}



  
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
      updateProgressBar(); 
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


  // Progress Bar
function updateProgressBar() {
  const progressBar = document.querySelector(".progress-bar");
  const progress = ((currentQuestion + 1) / questions.length) * 100; // Calculate percentage
  progressBar.style.width = `${progress}%`; // Update width
}


// End of Quiz - Try again
  
  function reset() {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
    tryAgainBtn.style.display = "none";

  }

  tryAgainBtn.addEventListener("click", reset)


