/* ==========================================
   1. DOM ELEMENTS
   ========================================== */
const scoreDisplay = document.getElementById("scoreDisplay");
const clickBtn = document.getElementById("clickBtn");
const upgradeBtn = document.getElementById("upgradeBtn");
const costDisplay = document.getElementById("costDisplay");
const title = document.getElementById("title");
const prestigeBtn = document.getElementById("prestigeBtn");
const prestigeDisplay = document.getElementById("prestigeDisplay");
const autoClickBtn = document.getElementById("autoClickBtn");
const particleContainer = document.getElementById("particle-container");
const totalBubblesDisplay = document.getElementById("totalBubblesDisplay");

// Modal Elements
const modal = document.getElementById("offline-modal");
const closeBtn = document.querySelector(".close-button");
const closeModalBtn = document.getElementById("close-modal-btn");
const earningsText = document.getElementById("offline-earnings-text");

/* ==========================================
   2. GAME STATE (Variables & Storage)
   ========================================== */
let score = parseInt(localStorage.getItem("oceanScore")) || 0;
let boost = parseInt(localStorage.getItem("oceanBoost")) || 1;
let cost = parseInt(localStorage.getItem("oceanCost")) || 100;
let autoClickerPower = parseInt(localStorage.getItem("oceanPower")) || 0;
let autoClickerCost = parseInt(localStorage.getItem("oceanAutoCost")) || 200;
let prestigePoints = parseInt(localStorage.getItem("prestigePoints")) || 0;
let totalBubblesEverPopped =
  parseInt(localStorage.getItem("totalBubbles")) || 0;

let lastSaveTime = localStorage.getItem("lastSaveTime");
let achievements = {
  firstClick: {
    name: "First Bubble",
    description: "Pop 1 bubble",
    unlocked: false,
  },
  thousandPoints: {
    name: "Shallow Dives",
    description: "Pop 1,000 bubbles",
    unlocked: false,
  },
  prestigeOne: {
    name: "Deep Sea Explorer",
    description: "Prestige for the first time",
    unlocked: false,
  },
};

let savedAchievements = JSON.parse(localStorage.getItem("achievements"));
if (savedAchievements) {
  achievements = savedAchievements;
}

/* ==========================================
   3. FUNCTIONS (Core Logic)
   ========================================== */

// --- Saving ---
function saveGame() {
  localStorage.setItem("oceanScore", score);
  localStorage.setItem("oceanBoost", boost);
  localStorage.setItem("oceanCost", cost);
  localStorage.setItem("oceanPower", autoClickerPower);
  localStorage.setItem("oceanAutoCost", autoClickerCost);
  localStorage.setItem("prestigePoints", prestigePoints);
  localStorage.setItem("lastSaveTime", Date.now());
  localStorage.setItem("totalBubbles", totalBubblesEverPopped);
  localStorage.setItem("achievements", JSON.stringify(achievements));
}

// --- Visuals & UI ---
function updateVisuals() {
  let background = "";
  let titleText = "";

  if (score < 500) {
    background = "linear-gradient(to bottom, #87CEEB 0%, #00BFFF 100%)";
    titleText = "🌊 Ocean Clicker 🌊";
  } else if (score < 1500) {
    background = "linear-gradient(to bottom, #00BFFF 0%, #00CED1 100%)";
    titleText = "🐠 Shallow Sea 🐠";
  } else if (score < 3000) {
    background = "linear-gradient(to bottom, #00CED1 0%, #40E0D0 100%)";
    titleText = "🦀 Coral Reef 🦀";
  } else if (score < 5000) {
    background = "linear-gradient(to bottom, #40E0D0 0%, #008B8B 100%)";
    titleText = "🦑 Twilight Zone 🦑";
  } else if (score < 8000) {
    background = "linear-gradient(to bottom, #008B8B 0%, #000080 100%)";
    titleText = "🐟 Midnight Zone 🐟";
  } else if (score < 12000) {
    background = "linear-gradient(to bottom, #000080 0%, #000000 100%)";
    titleText = "🐙 The Abyss 🐙";
  } else {
    background = "linear-gradient(to bottom, #000000 0%, #000000 100%)";
    titleText = "🔱 Deepest Trenches 🔱";
  }

  document.body.style.backgroundImage = background;

  if (title.textContent !== titleText) {
    title.textContent = titleText;
    // Restart the animation
    title.classList.remove("fade-in-text");
    void title.offsetWidth;
    title.classList.add("fade-in-text");
  }
}

// --- Sound & Effects ---
function playSound(soundFile) {
  let audio = new Audio(soundFile);
  audio.play();
}

function createParticle(x, y) {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  const size = Math.random() * 30 + 10;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  // Position immediately using transform, not top/left
  particle.style.left = `${x - size / 2}px`;
  particle.style.top = `${y - size / 2}px`;

  const dx = (Math.random() - 0.5) * 200;
  const dy = -Math.random() * 150 - 50;

  particle.style.setProperty("--dx", `${dx}px`);
  particle.style.setProperty("--dy", `${dy}px`);

  particleContainer.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 1000);
}

// --- Modal Handling ---
function closeAllModals() {
  modal.style.display = "none";
}

closeBtn.onclick = closeAllModals;
closeModalBtn.onclick = closeAllModals;
window.onclick = function (event) {
  if (event.target == modal) {
    closeAllModals();
  }
};

document
  .getElementById("loadCustomBackground")
  .addEventListener("click", function () {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (readerEvent) => {
        let content = readerEvent.target.result;
        document.body.style.backgroundImage = `url(${content})`;
        localStorage.setItem("customBackground", content);
      };
    };
    input.click();
  });
/* ==========================================
   4. EVENT LISTENERS & INITIALIZATION
   ========================================== */

// --- Main Click ---
clickBtn.addEventListener("click", function (e) {
  let multiplier = 1 + prestigePoints * 0.1;
  let amountEarned = boost * multiplier;

  if (score < 100000) {
    prestigeBtn.textContent = `Prestige (${Math.floor(score)} / 100,000)`;
    prestigeBtn.disabled = true;
  } else {
    prestigeBtn.textContent = "Prestige Now!";
    prestigeBtn.disabled = false;
  }

  score = score + amountEarned;
  totalBubblesEverPopped += amountEarned;

  scoreDisplay.textContent = `Bubbles Popped: ${Math.floor(score)}`;
  totalBubblesDisplay.textContent = `Total Bubbles Popped: ${Math.floor(totalBubblesEverPopped)}`;

  saveGame();
  updateVisuals();
  playSound("pop.mp3");
  checkAchievements();
  this.blur();
  createParticle(e.clientX, e.clientY);
});

// --- Upgrade Purchase ---
upgradeBtn.addEventListener("click", function () {
  if (score >= cost) {
    score = score - cost;
    boost++;
    cost = cost * 1.8;

    costDisplay.textContent = `Cost: ${Math.round(cost)}`;
    scoreDisplay.textContent = `Bubbles Popped: ${score}`;

    playSound("buy.mp3");
    saveGame();
    updateVisuals();
    this.blur();
  } else {
    alert("Not enough bubbles!");
  }
});

// --- Auto-Popper Purchase ---
autoClickBtn.addEventListener("click", function () {
  if (score >= autoClickerCost) {
    score = score - autoClickerCost;
    autoClickerPower = autoClickerPower + 10;
    autoClickerCost = Math.round(autoClickerCost * 1.8);

    autoClickBtn.textContent = `Buy Auto-Popper (+10 p/s) (Cost: ${autoClickerCost})`;
    scoreDisplay.textContent = `Bubbles Popped: ${score}`;

    playSound("buy.mp3");
    saveGame();
    this.blur();
  } else {
    alert("Not enough bubbles for an Auto-Popper!");
  }
});

// --- Prestige ---
prestigeBtn.addEventListener("click", function () {
  if (score >= 100000) {
    let pointsGained = Math.floor(score / 100000);
    prestigePoints += pointsGained;

    playSound("buy.mp3");

    // Apply permanent bonuses
    autoClickerPower += Math.floor(prestigePoints * 0.5);
    cost = Math.max(100, cost - prestigePoints * 10);

    // Reset variables
    score = 0;
    boost = 1;
    autoClickerCost = 200;

    // Screen Shake
    document.body.classList.add("shake-animation");
    setTimeout(() => {
      document.body.classList.remove("shake-animation");
    }, 500);

    // Update UI
    scoreDisplay.textContent = `Bubbles Popped: ${score}`;
    costDisplay.textContent = `Cost: ${Math.round(cost)}`;
    autoClickBtn.textContent = `Buy Auto-Popper (+${10 + Math.floor(prestigePoints * 0.5)} p/s) (Cost: ${autoClickerCost})`;
    prestigeDisplay.textContent = `Prestige Points: ${prestigePoints}`;

    alert(`Prestige Complete! You gained ${pointsGained} Prestige Points.`);
    saveGame();
    updateVisuals();
    checkAchievements();
  } else {
    alert("You need at least 100,000 bubbles to prestige!");
  }
});

// --- Game Loop (Offline Earnings & Autos) ---
function gameLoop() {
  score = score + autoClickerPower;
  totalBubblesEverPopped += autoClickerPower;
  scoreDisplay.textContent = `Bubbles Popped: ${score}`;
  totalBubblesDisplay.textContent = `Total Bubbles Popped: ${Math.floor(totalBubblesEverPopped)}`;

  saveGame();
  updateVisuals();
  checkAchievements();
}

// Run loop every second
setInterval(gameLoop, 1000);

// --- Initialization on Load ---
function init() {
  // Check for offline earnings
  if (lastSaveTime) {
    let currentTime = Date.now();
    let timeDifferenceSeconds = Math.floor((currentTime - lastSaveTime) / 1000);
    let offlineEarnings = timeDifferenceSeconds * autoClickerPower;

    if (offlineEarnings > 0) {
      score += offlineEarnings;
      totalBubblesEverPopped += offlineEarnings;
      earningsText.innerHTML = `You earned <strong>${Math.floor(offlineEarnings)}</strong> bubbles!<br>
                          Total lifetime bubbles: <strong>${Math.floor(totalBubblesEverPopped)}</strong>`;
      modal.style.display = "block";
    }
  }

  let customBg = localStorage.getItem("customBackground");
  if (customBg) {
    document.body.style.backgroundImage = `url(${customBg})`;
  } else {
    updateVisuals(); // Fallback to normal ocean themes
  }

  // Initialize UI
  scoreDisplay.textContent = `Bubbles Popped: ${score}`;
  totalBubblesDisplay.textContent = `Total Bubbles Popped: ${totalBubblesEverPopped}`;
  costDisplay.textContent = `Cost: ${Math.round(cost)}`;
  prestigeDisplay.textContent = `Prestige Points: ${prestigePoints}`;
  autoClickBtn.textContent = `Buy Auto-Popper (+${10 + Math.floor(prestigePoints * 0.5)} p/s) (Cost: ${autoClickerCost})`;
  updateVisuals();
  updateAchievementUI();
}

function checkAchievements() {
  let unlockedAny = false;

  if (totalBubblesEverPopped >= 1 && !achievements.firstClick.unlocked) {
    achievements.firstClick.unlocked = true;
    unlockedAny = true;
  }
  if (totalBubblesEverPopped >= 1000 && !achievements.thousandPoints.unlocked) {
    achievements.thousandPoints.unlocked = true;
    unlockedAny = true;
  }
  if (prestigePoints >= 1 && !achievements.prestigeOne.unlocked) {
    achievements.prestigeOne.unlocked = true;
    unlockedAny = true;
  }

  if (unlockedAny) {
    saveGame();
    updateAchievementUI();
    playSound("buy.mp3"); // Using buy sound for unlock
  }
}

function updateAchievementUI() {
  let list = document.getElementById("achievementsList");
  list.innerHTML = ""; // Clear current list

  for (let key in achievements) {
    if (achievements[key].unlocked) {
      let item = document.createElement("div");
      item.className = "achievement-unlocked";
      item.textContent = `✅ ${achievements[key].name}`;
      item.title = achievements[key].description;
      list.appendChild(item);
    }
  }
}

init();
