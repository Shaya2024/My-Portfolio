

 // DOM Elements
 const topicSelection = document.getElementById("topic-selection");
 const topicInput = document.getElementById("topic-input");
 const quizContainer = document.querySelector(".quiz-container");
 const quizContent = document.getElementById("quiz")
 const tryAgainBtn = document.getElementById("retry") 
 const message = document.getElementById("message")
 const progressBar = document.querySelector(".progress-bar");
 const scoreContainer = document.querySelector(".score-container");
 const scoreDisplay = document.getElementById("score-display")
 const topicButton = document.getElementById("topic-button"); /*new*/




// Intital display
quizContainer.style.display = "none"; 


  // App state
  let currentQuestion = 0;
  let score = 0;
  let questions = [];


topicButton.addEventListener('click', () => {
  console.log("you clicked the right button!")
  const selectedTopic = document.getElementById("topic-input").value;
  selectTopic(selectedTopic)
} );

topicInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const selectedTopic = topicInput.value;
    selectTopic(selectedTopic);
  }
});

async function selectTopic(topic) {
  await fetchQuestions(topic);
  topicSelection.style.display = "none"; // Hide the topic selection
  quizContainer.style.display = "block"; // Show the quiz container

   
}


async function fetchQuestions(topic) {
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.style.display = "block"; // Show the loading indicator
  try {
    // Send a POST request to your Netlify backend function
    const response = await fetch("https://quiz-app-shaya2024.netlify.app/.netlify/functions/fetch-questions", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }), // Pass the topic to the backend
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw API response from Netlify backend:", data);

    // Parse and use the fetched questions (assume backend returns clean JSON directly)
    const parsedQuestions = data.questions; // Update this based on how your backend returns data
    if (!Array.isArray(parsedQuestions)) {
      throw new Error("Invalid response: Expected an array of questions.");
    }

    // Map the questions into your app's format
    questions = parsedQuestions.map((item) => ({
      question: item.question,
      answers: item.answers,
      correct: item.correct,
    }));

    loadQuestion(); // Load the first question
    quizContainer.style.display = "block"; // Show the quiz container
  } catch (error) {
    console.error("Error fetching questions from the backend:", error);
    alert("Unable to generate questions. Please try again.");
  }
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

//15 sec Timer

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


  // Progress Bar
function updateProgressBar() {
  
  const progress = ((currentQuestion + 1) / questions.length) * 100; // Calculate percentage
  progressBar.style.width = `${progress}%`; // Update width
}


// End of Quiz - Try again
  
  function reset() {
    currentQuestion = 0;
    score = 0;
    topicInput.value = "";
    loadingIndicator.style.display = "none";
    quizContainer.style.display = "none";
    scoreContainer.style.display = "none";
    topicSelection.style.display = "flex"; 
  }

  tryAgainBtn.addEventListener("click", reset)



