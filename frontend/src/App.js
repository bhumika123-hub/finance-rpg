import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [character, setCharacter] = useState(null);

  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [result, setResult] = useState(null);

  const [achievements, setAchievements] = useState([]);

  const [loanAmount, setLoanAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");

  const createCharacter = async () => {
    const res = await fetch("http://localhost:5000/character/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    const data = await res.json();
    setCharacter(data);
  };

  const playBudgetGame = async () => {
    const res = await fetch("http://localhost:5000/quest/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        income: Number(income),
        expenses: expense.split(",").map(Number),
        characterId: character.id
      })
    });

    const data = await res.json();

    setResult(data);
    setCharacter(data.character);
    setAchievements(data.allAchievements || []);
  };

  const takeLoan = async () => {
    const res = await fetch("http://localhost:5000/debt/take", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterId: character.id,
        amount: Number(loanAmount)
      })
    });

    const data = await res.json();
    setCharacter(data);
  };

  const repayLoan = async () => {
    const res = await fetch("http://localhost:5000/debt/repay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterId: character.id,
        amount: Number(repayAmount)
      })
    });

    const data = await res.json();

    if (data.message) {
      alert(data.message);
    } else {
      setCharacter(data);
    }
  };

  return (
    <div style={{
      textAlign: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      color: "white",
      padding: "30px"
    }}>
      <div style={{
        background: "#ffffff10",
        padding: "20px",
        borderRadius: "15px",
        width: "350px",
        margin: "auto",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)"
      }}>
        <h1>🎮 Finance RPG</h1>

        {!character ? (
          <>
            <input
              style={{ padding: "10px", borderRadius: "8px", width: "80%" }}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br /><br />
            <button style={btn} onClick={createCharacter}>
              Create Character
            </button>
          </>
        ) : (
          <>
            <h2>{character.name} 👑</h2>
            <p>Level: {character.level}</p>
            <p>XP: {character.xp}</p>

            <div style={xpBar}>
              <div style={{
                ...xpFill,
                width: `${(character.xp / 200) * 100}%`
              }}></div>
            </div>

            <p>Gold: {character.gold}</p>
            <p>Debt: {character.debt}</p>

            <p style={{
              color: character.netWorth >= 0 ? "lightgreen" : "red"
            }}>
              Net Worth: ₹{character.netWorth}
            </p>

            <hr />

            <h3>💰 Budget Quest</h3>

            <input style={input} placeholder="Income"
              onChange={(e) => setIncome(e.target.value)} />

            <br /><br />

            <input style={input} placeholder="Expenses (1,2,3)"
              onChange={(e) => setExpense(e.target.value)} />

            <br /><br />

            <button style={btn} onClick={playBudgetGame}>
              Play
            </button>

            {result && (
              <div>
                <p>Savings: {result.savings}</p>
                <p>XP: {result.xp}</p>
                <p>{result.message}</p>
              </div>
            )}

            {achievements.length > 0 && (
              <>
                <h3>🏆 Achievements</h3>
                {achievements.map((a, i) => <p key={i}>{a}</p>)}
              </>
            )}

            <hr />

            <h3>💳 Debt</h3>

            <input style={input} placeholder="Loan"
              onChange={(e) => setLoanAmount(e.target.value)} />

            <br /><br />

            <button style={btn} onClick={takeLoan}>Take Loan</button>

            <br /><br />

            <input style={input} placeholder="Repay"
              onChange={(e) => setRepayAmount(e.target.value)} />

            <br /><br />

            <button style={btn} onClick={repayLoan}>Repay</button>
          </>
        )}
      </div>
    </div>
  );
}

const btn = {
  padding: "10px 20px",
  borderRadius: "10px",
  background: "#00c6ff",
  border: "none",
  color: "white",
  cursor: "pointer"
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  width: "80%"
};

const xpBar = {
  width: "100%",
  height: "10px",
  background: "#555",
  borderRadius: "10px"
};

const xpFill = {
  height: "100%",
  background: "limegreen",
  borderRadius: "10px"
};

export default App;