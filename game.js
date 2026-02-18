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
const offlineModal = document.getElementById("offline-modal");
const closeBtn = document.querySelector(".close-button");
const closeModalBtn = document.getElementById("close-modal-btn");
const earningsText = document.getElementById("offline-earnings-text");

// Achievements Elements
const achievementsModal = document.getElementById("achievements-modal");
const openAchievementsBtn = document.getElementById("openAchievementsBtn");
const closeAchievementsBtn = document.querySelector(".close-achievements");

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

// --- Updated Load Game ---
function loadGame() {
  score = parseInt(localStorage.getItem("oceanScore")) || 0;
  boost = parseInt(localStorage.getItem("oceanBoost")) || 1;
  cost = parseInt(localStorage.getItem("oceanCost")) || 100;
  autoClickerPower = parseInt(localStorage.getItem("oceanPower")) || 0;
  autoClickerCost = parseInt(localStorage.getItem("oceanAutoCost")) || 200;
  prestigePoints = parseInt(localStorage.getItem("prestigePoints")) || 0;
  totalBubblesEverPopped = parseInt(localStorage.getItem("totalBubbles")) || 0;
  lastSaveTime = localStorage.getItem("lastSaveTime"); // <--- This loads the correct value

  // --- LOAD ACHIEVEMENTS ---
  const savedAchievements = localStorage.getItem("achievements");
  if (savedAchievements) {
    achievements = JSON.parse(savedAchievements);
  }
}

// --- Background Music ---
const bgMusic = new Audio("music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Attempt to play music on the first click (browsers block autoplay)
let musicStarted = false;
document.addEventListener("click", () => {
  if (!musicStarted) {
    bgMusic.play().catch((error) => {
      console.log("Music play prevented by browser autoplay policy.");
    });
    musicStarted = true;
  }
});

// --- Achievements Data Structure ---
let achievements = JSON.parse(localStorage.getItem("achievements")) || {
  firstClick: {
    name: "First Bubble",
    description: "Pop 1 bubble",
    goal: 1,
    unlocked: false,
    claimed: false,
    reward: 50,
    type: "total",
  },
  thousandPoints: {
    name: "Shallow Dives",
    description: "Pop 10,000 bubbles",
    goal: 10000,
    unlocked: false,
    claimed: false,
    reward: 5000,
    type: "total",
  },
  prestigeOne: {
    name: "Deep Sea Explorer",
    description: "Prestige 5 times",
    goal: 5,
    unlocked: false,
    claimed: false,
    reward: 50000,
    type: "prestige",
  },
  millionClub: {
    name: "Millionaire",
    description: "Pop 1,000,000 bubbles",
    goal: 1000000,
    unlocked: false,
    claimed: false,
    reward: 250000,
    type: "total",
  },
  billionClub: {
    name: "Billionaire",
    description: "Pop 1,000,000,000 bubbles",
    goal: 1000000000,
    unlocked: false,
    claimed: false,
    reward: 200000000,
    type: "total",
  },
  speedClicker: {
    name: "Speed Demon",
    description: "Get 100 Auto-Popper Power",
    goal: 100,
    unlocked: false,
    claimed: false,
    reward: 100000,
    type: "auto",
  },
  prestigeTen: {
    name: "Prestige Master",
    description: "Prestige 10 times",
    goal: 10,
    unlocked: false,
    claimed: false,
    reward: 150000,
    type: "prestige",
  },
  prestigeHundred: {
    name: "Grand Master",
    description: "Prestige 100 times",
    goal: 100,
    unlocked: false,
    claimed: false,
    reward: 10000000,
    type: "prestige",
  },
  theAbyss: {
    name: "Abyss Diver",
    description: "Reach 'The Abyss' stage",
    goal: 8000,
    unlocked: false,
    claimed: false,
    reward: 15000,
    type: "total",
  },
  coreReach: {
    name: "Core Bound",
    description: "Reach 'Inner Core' stage",
    goal: 300000000,
    unlocked: false,
    claimed: false,
    reward: 50000000,
    type: "total",
  },
  spaceBound: {
    name: "Space Bound",
    description: "Reach 'Space' stage",
    goal: 2500000000,
    unlocked: false,
    claimed: false,
    reward: 500000000,
    type: "total",
  },
  universeMaster: {
    name: "Universe Master",
    description: "Reach 'The Universe' stage",
    goal: 50000000000,
    unlocked: false,
    claimed: false,
    reward: 10000000000,
    type: "total",
  },
  richAndFamous: {
    name: "Rich and Famous",
    description: "Accumulate 100 Prestige Points",
    goal: 100,
    unlocked: false,
    claimed: false,
    reward: 2500000,
    type: "prestigePoints",
  },
};

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

// --- Updated updateVisuals to include Milestone Banner ---
function updateVisuals() {
  let currentStage = stages[0];
  for (let i = 0; i < stages.length; i++) {
    if (score >= stages[i].score) {
      currentStage = stages[i];
    }
  }

  // 1. Update main body background
  let customBg = localStorage.getItem("customBackground");
  if (customBg) {
    document.body.style.backgroundImage = `url(${customBg})`;
  } else {
    document.body.style.backgroundImage = currentStage.bg;
  }

  // 2. Update container background based on stage
  const container = document.querySelector(".container");
  container.style.background = `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8))`;
  container.style.border = `1px solid rgba(255,255,255,0.2)`;

  // 3. Update title and trigger banner
  if (title.textContent !== currentStage.title) {
    title.textContent = currentStage.title;
    title.classList.remove("fade-in-text");
    void title.offsetWidth;
    title.classList.add("fade-in-text");

    // --- NEW: Milestone Banner Logic ---
    const banner = document.getElementById("milestone-banner");
    banner.textContent = `🎉 New Stage: ${currentStage.title} 🎉`;
    banner.style.display = "block";
    setTimeout(() => {
      banner.style.display = "none";
    }, 3000); // Hides after 3 seconds
    // ------------------------------------
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
  offlineModal.style.display = "none";
  achievementsModal.style.display = "none";
}

closeBtn.onclick = closeAllModals;
closeModalBtn.onclick = closeAllModals;
closeAchievementsBtn.onclick = () => {
  achievementsModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == offlineModal || event.target == achievementsModal) {
    closeAllModals();
  }
};

// --- Achievements Menu Logic ---
openAchievementsBtn.onclick = () => {
  achievementsModal.style.display = "block";
  updateAchievementUI();
};

function updateAchievementUI() {
  let unlockedList = document.getElementById("unlockedList");
  let lockedList = document.getElementById("lockedList");

  unlockedList.innerHTML = "";
  lockedList.innerHTML = "";

  for (let key in achievements) {
    let ach = achievements[key];
    let card = document.createElement("div");
    card.className = `achievement-card ${ach.unlocked ? "" : "locked"}`;

    let details = document.createElement("div");
    details.className = "ach-details";
    details.innerHTML = `<span class="ach-name">${ach.name}</span>
                             <span class="ach-desc">${ach.description}</span>`;

    card.appendChild(details);

    if (ach.unlocked) {
      if (!ach.claimed) {
        let claimBtn = document.createElement("button");
        claimBtn.className = "claim-btn";
        claimBtn.textContent = `Claim ${ach.reward.toLocaleString()}`;
        claimBtn.onclick = () => claimReward(key);
        card.appendChild(claimBtn);
      } else {
        let claimedSpan = document.createElement("span");
        claimedSpan.textContent = "✅ Claimed";
        claimedSpan.style.color = "#28a745";
        claimedSpan.style.fontWeight = "bold";
        card.appendChild(claimedSpan);
      }
      unlockedList.appendChild(card);
    } else {
      lockedList.appendChild(card);
    }
  }
}

function claimReward(key) {
  let ach = achievements[key];
  if (ach.unlocked && !ach.claimed) {
    score += ach.reward;
    ach.claimed = true;
    saveGame();
    updateAchievementUI();
    playSound("buy.mp3");
    scoreDisplay.textContent = `Bubbles Popped: ${Math.floor(score)}`;
  }
}

function checkAchievements() {
  let unlockedAny = false;
  let totalPrestigeCount =
    parseInt(localStorage.getItem("totalPrestigeCount")) || 0;
  for (let key in achievements) {
    let ach = achievements[key];

    // Skip if already unlocked
    if (ach.unlocked) continue;

    let currentProgress = 0;
    if (ach.type === "total") currentProgress = totalBubblesEverPopped;
    else if (ach.type === "prestigePoints") currentProgress = prestigePoints;
    else if (ach.type === "auto") currentProgress = autoClickerPower;
    // --- ADDED THIS FOR PRESTIGE COUNT ---
    else if (ach.type === "prestige") {
      // You need to track total prestiges somewhere.
      // If you aren't, this check will fail.
      // Let's assume you add a variable: let totalPrestigeCount = 0;
      currentProgress = totalPrestigeCount;
    }
    // -------------------------------------

    if (currentProgress >= ach.goal) {
      ach.unlocked = true;
      unlockedAny = true;
    }
  }

  if (unlockedAny) {
    saveGame();
    // If the modal is open, refresh it immediately
    if (achievementsModal.style.display === "block") {
      updateAchievementUI();
    }
    playSound("buy.mp3");
  }
}

// --- Workshop ---
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

document
  .getElementById("removeCustomBackground")
  .addEventListener("click", function () {
    localStorage.removeItem("customBackground");
    updateVisuals();
  });

/* ==========================================
   4. EVENT LISTENERS & INITIALIZATION
   ========================================== */

const stages = [
  {
    score: 0,
    bg: "linear-gradient(to bottom, #87CEEB 0%, #00BFFF 100%)",
    title: "🌊 Ocean Clicker 🌊",
    boost: 1,
  },
  {
    score: 100,
    bg: "linear-gradient(to bottom, #00BFFF 0%, #FFD700 100%)",
    title: "🏖️ Beach Intermission 🏖️",
    boost: 1.1,
  },
  {
    score: 500,
    bg: "linear-gradient(to bottom, #FFD700 0%, #87CEEB 100%)",
    title: "🛶 Shallow Dives 🛶",
    boost: 1.3,
  },
  {
    score: 1000,
    bg: "linear-gradient(to bottom, #87CEEB 0%, #0077be 100%)",
    title: "🚤 Speed Boat 🚤",
    boost: 1.5,
  },
  {
    score: 2500,
    bg: "linear-gradient(to bottom, #0077be 0%, #000080 100%)",
    title: "🤿 Deep Sea 🤿",
    boost: 1.8,
  },
  {
    score: 5000,
    bg: "linear-gradient(to bottom, #000080 0%, #000000 100%)",
    title: "🐙 The Abyss 🐙",
    boost: 2.2,
  },
  {
    score: 10000,
    bg: "linear-gradient(to bottom, #000000 0%, #4B0082 100%)",
    title: "🦑 Giant Squid Area 🦑",
    boost: 2.5,
  },
  {
    score: 25000,
    bg: "linear-gradient(to bottom, #4B0082 0%, #000000 100%)",
    title: "🚢 Sunken Ship 🚢",
    boost: 3,
  },
  {
    score: 50000,
    bg: "linear-gradient(to bottom, #000000 0%, #800000 100%)",
    title: "🌋 Thermal Vents 🌋",
    boost: 3.5,
  },
  {
    score: 100000,
    bg: "linear-gradient(to bottom, #800000 0%, #FF4500 100%)",
    title: "🌍 Ocean Floor 🌍",
    boost: 4,
  },
  {
    score: 250000,
    bg: "linear-gradient(to bottom, #FF4500 0%, #a0522d 100%)",
    title: "🪨 Earth's Crust 🪨",
    boost: 5,
  },
  {
    score: 500000,
    bg: "linear-gradient(to bottom, #a0522d 0%, #8b4513 100%)",
    title: "🦴 Fossil Bed 🦴",
    boost: 6,
  },
  {
    score: 1000000,
    bg: "linear-gradient(to bottom, #8b4513 0%, #A52A2A 100%)",
    title: "💎 Diamond Mine 💎",
    boost: 8,
  },
  {
    score: 2500000,
    bg: "linear-gradient(to bottom, #A52A2A 0%, #FF8C00 100%)",
    title: "🔥 Upper Mantle 🔥",
    boost: 10,
  },
  {
    score: 5000000,
    bg: "linear-gradient(to bottom, #FF8C00 0%, #FF4500 100%)",
    title: "🔥 Lower Mantle 🔥",
    boost: 12,
  },
  {
    score: 10000000,
    bg: "linear-gradient(to bottom, #FF4500 0%, #FF0000 100%)",
    title: "🌋 Magma Chamber 🌋",
    boost: 15,
  },
  {
    score: 25000000,
    bg: "linear-gradient(to bottom, #FF0000 0%, #B22222 100%)",
    title: "☄️ Outer Core ☄️",
    boost: 20,
  },
  {
    score: 50000000,
    bg: "linear-gradient(to bottom, #B22222 0%, #8B0000 100%)",
    title: "🧲 Magnetic Core 🧲",
    boost: 25,
  },
  {
    score: 100000000,
    bg: "linear-gradient(to bottom, #8B0000 0%, #FFD700 100%)",
    title: "☢️ Inner Core ☢️",
    boost: 30,
  },
  {
    score: 250000000,
    bg: "linear-gradient(to bottom, #FFD700 0%, #00BFFF 100%)",
    title: "☁️ Stratosphere ☁️",
    boost: 40,
  },
  {
    score: 500000000,
    bg: "linear-gradient(to bottom, #00BFFF 0%, #1E90FF 100%)",
    title: "🛰️ Satellite Orbit 🛰️",
    boost: 50,
  },
  {
    score: 1000000000,
    bg: "linear-gradient(to bottom, #1E90FF 0%, #0000CD 100%)",
    title: "🚀 Moon Base 🚀",
    boost: 65,
  },
  {
    score: 2500000000,
    bg: "linear-gradient(to bottom, #0000CD 0%, #000000 100%)",
    title: "🌌 Deep Space 🌌",
    boost: 80,
  },
  {
    score: 5000000000,
    bg: "linear-gradient(to bottom, #000000 0%, #FFD700 100%)",
    title: "☀️ Solar Flare ☀️",
    boost: 100,
  },
  {
    score: 10000000000,
    bg: "linear-gradient(to bottom, #FFD700 0%, #4682B4 100%)",
    title: "🪐 Gas Giant 🪐",
    boost: 130,
  },
  {
    score: 25000000000,
    bg: "linear-gradient(to bottom, #4682B4 0%, #000000 100%)",
    title: "🪐 Asteroid Belt 🪐",
    boost: 160,
  },
  {
    score: 50000000000,
    bg: "linear-gradient(to bottom, #000000 0%, #8B008B 100%)",
    title: "🌌 Nebula 🌌",
    boost: 200,
  },
  {
    score: 100000000000,
    bg: "linear-gradient(to bottom, #8B008B 0%, #4B0082 100%)",
    title: "🌟 Star System 🌟",
    boost: 250,
  },
  {
    score: 250000000000,
    bg: "linear-gradient(to bottom, #4B0082 0%, #000000 100%)",
    title: "🌌 Galaxy Edge 🌌",
    boost: 300,
  },
  {
    score: 500000000000,
    bg: "linear-gradient(to bottom, #000000 0%, #FF1493 100%)",
    title: "🌌 Galactic Core 🌌",
    boost: 350,
  },
  {
    score: 1000000000000,
    bg: "linear-gradient(to bottom, #FF1493 0%, #000000 100%)",
    title: "✨ Black Hole ✨",
    boost: 450,
  },
  {
    score: 2500000000000,
    bg: "linear-gradient(to bottom, #000000 0%, #DA70D6 100%)",
    title: "🌌 Time Warp 🌌",
    boost: 600,
  },
  {
    score: 5000000000000,
    bg: "linear-gradient(to bottom, #DA70D6 0%, #FF00FF 100%)",
    title: "🌌 Parallel World 🌌",
    boost: 800,
  },
  {
    score: 10000000000000,
    bg: "linear-gradient(to bottom, #FF00FF 0%, #000000 100%)",
    title: "🌌 The Cosmic Net 🌌",
    boost: 1000,
  },
  {
    score: 50000000000000,
    bg: "linear-gradient(to bottom, #000000 0%, #FFFFFF 100%)",
    title: "🌌 The Universe 🌌",
    boost: 1500,
  },
];

// --- Optimized Main Click ---
clickBtn.addEventListener("click", function (e) {
  let currentStage = stages[0];
  for (let i = 0; i < stages.length; i++) {
    if (score >= stages[i].score) currentStage = stages[i];
  }

  // Calculate earnings
  let prestigeMultiplier = 1 + prestigePoints * 0.1;
  let amountEarned = boost * prestigeMultiplier * currentStage.boost;

  // Update State
  score = score + amountEarned;
  totalBubblesEverPopped += amountEarned;

  // Update DOM (UI) - Keep this fast
  scoreDisplay.textContent = `Bubbles Popped: ${Math.floor(score)}`;
  totalBubblesDisplay.textContent = `Total Bubbles Popped: ${Math.floor(totalBubblesEverPopped)}`;

  // --- OPTIMIZATION ---
  // Only update visuals if the stage actually changes
  if (title.textContent !== currentStage.title) {
    updateVisuals();
  }

  // Only save periodically (e.g., every 5-10 seconds)
  // Or keep it here if your game isn't lagging, but know it's heavy!
  saveGame();
  // ---------------------

  playSound("pop.mp3");
  checkAchievements(); // This is necessary to unlock rewards immediately
  this.blur();
  createParticle(e.clientX, e.clientY);
});

// --- Upgrade Purchase ---
upgradeBtn.addEventListener("click", function () {
  if (score >= cost) {
    score = score - cost;
    boost++;
    cost = Math.round(cost * 1.35);
    costDisplay.textContent = Math.round(cost);
    scoreDisplay.textContent = `Bubbles Popped: ${Math.floor(score)}`;
    playSound("buy.mp3");
    saveGame();
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
    autoClickerCost = Math.round(autoClickerCost * 1.5);
    autoClickBtn.textContent = `Buy Auto-Popper (+10 p/s) (Cost: ${autoClickerCost})`;
    scoreDisplay.textContent = `Bubbles Popped: ${Math.floor(score)}`;
    playSound("buy.mp3");
    saveGame();
    this.blur();
  } else {
    alert("Not enough bubbles!");
  }
});

// --- Prestige ---
prestigeBtn.addEventListener("click", function () {
  if (score >= 100000) {
    let pointsGained = Math.floor(score / 100000);
    prestigePoints += pointsGained;

    // Increment total prestige count for achievement
    let totalPrestige =
      parseInt(localStorage.getItem("totalPrestigeCount")) || 0;
    localStorage.setItem("totalPrestigeCount", totalPrestige + 1);

    playSound("buy.mp3");
    autoClickerPower += Math.floor(prestigePoints * 0.5);

    // --- FIX: Reset all game state variables ---
    score = 0;
    boost = 1;
    cost = 100; // Reset manual click upgrade cost
    autoClickerCost = 200; // Reset auto-popper cost
    // ---------------------------------------------

    document.body.classList.add("shake-animation");
    setTimeout(() => {
      document.body.classList.remove("shake-animation");
    }, 500);

    // --- FIX: Immediately update the DOM (display) ---
    scoreDisplay.textContent = `Bubbles Popped: ${score}`;
    costDisplay.textContent = Math.round(cost); // Update manual upgrade display
    // Update Auto-Popper display
    autoClickBtn.textContent = `Buy Auto-Popper (+10 p/s) (Cost: ${autoClickerCost})`;
    prestigeDisplay.textContent = `Prestige Points: ${prestigePoints}`;
    // ----------------------------------------------------

    alert(`Prestige Complete! You gained ${pointsGained} Prestige Points.`);

    saveGame(); // Save *after* updating state and UI
    updateVisuals();
    checkAchievements();
  } else {
    alert("You need at least 100,000 bubbles to prestige!");
  }
});

// --- Game Loop ---
function gameLoop() {
  let currentStage = stages[0];
  for (let i = 0; i < stages.length; i++) {
    if (score >= stages[i].score) currentStage = stages[i];
  }

  let autosEarned = autoClickerPower * currentStage.boost;
  score = score + autosEarned;
  totalBubblesEverPopped += autosEarned;

  scoreDisplay.textContent = `Bubbles Popped: ${Math.floor(score)}`;
  totalBubblesDisplay.textContent = `Total Bubbles Popped: ${Math.floor(totalBubblesEverPopped)}`;

  saveGame();
  updateVisuals();
  checkAchievements(); // This ensures achievements check constantly
}
setInterval(gameLoop, 1000);
// --- Updated Initialization ---
function init() {
  loadGame(); // <--- Correctly loads data first

  // Now check if lastSaveTime exists after loadGame()
  if (lastSaveTime) {
    let currentTime = Date.now();
    let timeDifferenceSeconds = Math.floor((currentTime - lastSaveTime) / 1000);

    // Determine current stage boost for offline earnings
    let currentStage = stages[0];
    for (let i = 0; i < stages.length; i++) {
      if (score >= stages[i].score) currentStage = stages[i];
    }

    // Recommendation: Include prestige multiplier in offline earnings for balance
    let prestigeMultiplier = 1 + prestigePoints * 0.1;
    let offlineEarnings =
      timeDifferenceSeconds *
      (autoClickerPower * currentStage.boost * prestigeMultiplier);

    if (offlineEarnings > 0) {
      score += offlineEarnings;
      totalBubblesEverPopped += offlineEarnings;
      earningsText.innerHTML = `You earned <strong>${Math.floor(offlineEarnings)}</strong> bubbles while away!`;
      offlineModal.style.display = "block";
    }
  }

  // Refresh displays
  updateVisuals();
  scoreDisplay.textContent = `Bubbles Popped: ${Math.floor(score)}`;
  totalBubblesDisplay.textContent = `Total Bubbles Popped: ${Math.floor(totalBubblesEverPopped)}`;
  costDisplay.textContent = Math.round(cost);
  autoClickBtn.textContent = `Buy Auto-Popper (+10 p/s) (Cost: ${autoClickerCost})`;
  prestigeDisplay.textContent = `Prestige Points: ${prestigePoints}`;
  updateAchievementUI();

  // Final check to make sure visuals match current score on load
  checkAchievements();
}

init();
