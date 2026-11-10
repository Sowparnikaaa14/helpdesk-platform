import { useState } from "react";
import Login from "./Login";
import Tickets from "./Tickets";

function App() {
  const [user, setUser] = useState(null);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>IT Helpdesk Platform</h1>
      <p>
        Welcome, {user.name} ({user.role}){" "}
        <button onClick={handleLogout}>Log out</button>
      </p>
      <Tickets role={user.role}/>
    </div>
  );
}

export default App;