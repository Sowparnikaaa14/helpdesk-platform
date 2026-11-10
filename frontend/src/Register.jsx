import { useState } from "react";

const API_URL = "http://localhost:5000/api";

function Register({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess("Account created. You can log in now.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  const inputStyle = { display: "block", width: "100%", marginBottom: 10, padding: 8 };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "60px auto" }}>
      <h2>Create account</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
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
      <button type="submit" style={{ padding: "8px 16px" }}>Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch}>Back to login</button>
      </p>
    </form>
  );
}

export default Register;