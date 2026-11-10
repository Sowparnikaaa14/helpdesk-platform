import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Tickets from "./Tickets";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      return null;
    }
  });
  const [showRegister, setShowRegister] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={setUser} onSwitch={() => setShowRegister(true)} />
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>IT Helpdesk Platform</h1>
      <p>
        Welcome, {user.name} ({user.role}){" "}
        <button onClick={handleLogout}>Log out</button>
      </p>
      <Tickets role={user.role} />
    </div>
  );
}

export default App;