const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 In-memory data
let characters = [];
let achievements = {};

// 🟢 Test route
app.get("/", (req, res) => {
  res.send("Finance RPG API Running 🚀");
});

// 🎮 Create Character
app.post("/character/create", (req, res) => {
  const { name } = req.body;

  const character = {
    id: characters.length,
    name,
    level: 1,
    xp: 0,
    gold: 100,
    netWorth: 100,
    debt: 0
  };

  characters.push(character);

  res.json(character);
});

// 💰 Budget Quest
app.post("/quest/budget", (req, res) => {
  const { income, expenses, characterId } = req.body;

  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  const savings = income - totalExpenses;

  let xp = 0;
  let message = "";

  if (savings > 0) {
    xp = 100;
    message = "Great! You saved money 💰";
  } else {
    xp = 20;
    message = "You are in loss 😢 Try better budgeting!";
  }

  const character = characters[characterId];

  if (!character) {
    return res.status(404).json({ message: "Character not found" });
  }

  character.xp += xp;

  if (character.xp >= 200) {
    character.level += 1;
    character.xp = 0;
    message += " 🎉 Level Up!";
  }

  // 💳 Interest
  if (character.debt > 0) {
    character.debt += Math.floor(character.debt * 0.02);
  }

  // 🏆 Achievements
  if (!achievements[characterId]) {
    achievements[characterId] = [];
  }

  if (savings > 0 && !achievements[characterId].includes("First Save")) {
    achievements[characterId].push("First Save");
  }

  if (savings > 10000 && !achievements[characterId].includes("Saver Pro")) {
    achievements[characterId].push("Saver Pro");
  }

  if (character.level >= 2 && !achievements[characterId].includes("Level Up Master")) {
    achievements[characterId].push("Level Up Master");
  }

  // 📊 Net Worth
  character.netWorth = character.gold - character.debt;

  res.json({
    savings,
    xp,
    message,
    character,
    allAchievements: achievements[characterId]
  });
});

// 💸 Take Loan
app.post("/debt/take", (req, res) => {
  const { characterId, amount } = req.body;

  const character = characters[characterId];

  if (!character) {
    return res.status(404).json({ message: "Character not found" });
  }

  character.debt += amount;
  character.gold += amount;

  character.netWorth = character.gold - character.debt;

  res.json(character);
});

// 💳 Repay Loan
app.post("/debt/repay", (req, res) => {
  const { characterId, amount } = req.body;

  const character = characters[characterId];

  if (!character) {
    return res.status(404).json({ message: "Character not found" });
  }

  if (character.gold < amount) {
    return res.json({ message: "Not enough gold 💔" });
  }

  character.debt -= amount;
  character.gold -= amount;

  if (character.debt < 0) character.debt = 0;

  character.netWorth = character.gold - character.debt;

  res.json(character);
});

// 🚀 Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});