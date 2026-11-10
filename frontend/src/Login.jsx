import { useState } from "react";

const API_URL = "http://localhost:5000/api";

function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  const inputStyle = { display: "block", width: "100%", marginBottom: 10, padding: 8 };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "60px auto" }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>Log in</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        New here?{" "}
        <button type="button" onClick={onSwitch}>Create an account</button>
      </p>
    </form>
  );
}

export default Login;