import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  async function loadTickets() {
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTickets(data);
      else setError(data.error || "Could not load tickets");
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category, priority }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not create ticket");
        return;
      }

      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("medium");
      loadTickets();
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  const inputStyle = { display: "block", width: "100%", marginBottom: 10, padding: 8 };

  return (
    <div>
      <h2>Create a ticket</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Describe the problem"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Category (e.g. Network, Hardware)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={inputStyle}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button type="submit" style={{ padding: "8px 16px" }}>Submit ticket</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2 style={{ marginTop: 30 }}>Your tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        <ul>
          {tickets.map((t) => (
            <li key={t.id} style={{ marginBottom: 12 }}>
              <strong>{t.title}</strong> [{t.status}] [{t.priority}]
              <br />
              {t.description}
              {t.category && <> (Category: {t.category})</>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tickets;