// My Game status
let currentRound = 0;
let score = 0;
const maxRounds = 3;
const gameMeals = []; //keep track of meals displayed to use

// GET ALL DOM ELEMENTS I WILL USE
const startPage = document.getElementById("start-page");
const gamePage = document.getElementById("game-page");
const resultsPage = document.getElementById("results-page");
const startBtn = document.getElementById("start-btn");
const submitGuessBtn = document.getElementById("submit-guess");
const guessInput = document.getElementById("guess-input");
const mealImage = document.getElementById("meal-image");
const ingredientsList = document.getElementById("ingredients");
const instructions = document.getElementById("instructions");
const feedback = document.getElementById("feedback");
const roundCounter = document.getElementById("round-counter");
const finalScore = document.getElementById("final-score");
const mealsSummary = document.getElementById("meals-summary");
const restartBtn = document.getElementById("restart-btn");

// Event listeners I WILL USE
startBtn.addEventListener("click", startGame);
submitGuessBtn.addEventListener("click", submitGuess);
guessInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") submitGuess();
});
restartBtn.addEventListener("click", resetGame);

// Our game starts here
async function startGame() {
  startPage.classList.add("hidden");
  gamePage.classList.remove("hidden");
  currentRound = 0;
  score = 0;
  gameMeals.length = 0;
  nextRound();
}

async function nextRound() {
  currentRound++; //keep track of game round

  if (currentRound > maxRounds) {
    endGame();
    return;
  }

  roundCounter.textContent = `Round: ${currentRound}/${maxRounds}`;
  feedback.textContent = "";
  guessInput.value = "";

  try {
    const meal = await fetchRandomMeal(); //we will fetch random meal
    displayMeal(meal);
  } catch (error) {
    console.error("Error fetching meal:", error);
    feedback.textContent = "Error loading meal. Please try again."; //we will display tp user what happened
  }
}

async function fetchRandomMeal() {
  //MEAL API
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const data = await response.json();
  return data.meals[0];
}

function displayMeal(meal) {
  // Store meal for results page and puhs it to UI
  gameMeals.push(meal);
  console.log(JSON.stringify(gameMeals));

  // Display meal image
  mealImage.src = meal.strMealThumb;

  // Display ingredients
  ingredientsList.innerHTML = "<h3>Ingredients:</h3><ul>";
  for (let i = 1; i <= 40; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      //does ingeredients exist
      ingredientsList.innerHTML += `<li>${measure} ${ingredient}</li>`;
    }
  }
  ingredientsList.innerHTML += "</ul>";

  instructions.textContent = meal.strInstructions;
}

function submitGuess() {
  const guess = guessInput.value.trim().toLowerCase();
  console.log("User Guess: " + guess);

  if (!guess) return;

  const currentMeal = gameMeals[currentRound - 1];
  const correctCategory = currentMeal.strCategory.toLowerCase(); //user can type in uppper case we control it here
  const correctArea = currentMeal.strArea.toLowerCase(); //user can type in uppper case we control it here

  if (guess === correctCategory || guess === correctArea) {
    score++; //keep track of score
    feedback.textContent = "Correct!";
    feedback.className = "correct";
  } else {
    feedback.textContent = `Incorrect! It is ${correctArea} (${correctCategory}).`;
    feedback.className = "incorrect";
    alert(
      `Incorrect! It is ${correctArea} (${correctCategory}). Your Answer ${guess}`
    );
  }

  setTimeout(nextRound, 1000); //set timeout before next round will be automatic
}

function endGame() {
  gamePage.classList.add("hidden");
  resultsPage.classList.remove("hidden");

  finalScore.textContent = `Your score: ${score}/${maxRounds}`;

  mealsSummary.innerHTML = "<h3>Meals Played:</h3>";
  gameMeals.forEach((meal) => {
    mealsSummary.innerHTML += `
            <div class="meal-summary">
                <h4>${meal.strMeal}</h4>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Cuisine:</strong> ${meal.strArea}</p>
            </div>
        `;
  });
}

function resetGame() {
  resultsPage.classList.add("hidden");
  startGame();
}
