const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Helpdesk API is running" });
});
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});