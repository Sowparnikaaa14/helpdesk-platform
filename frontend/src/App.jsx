import { useState } from "react";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>IT Helpdesk Platform</h1>
      <p>Welcome, {user.name} ({user.role})</p>
    </div>
  );
}

export default App;