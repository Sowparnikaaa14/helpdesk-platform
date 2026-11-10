const express = require("express");
const pool = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Every ticket route needs a logged-in user
router.use(requireAuth);

// Create a ticket
router.post("/", async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const result = await pool.query(
      `INSERT INTO tickets (title, description, category, priority, created_by)
       VALUES ($1, $2, $3, COALESCE($4, 'medium'), $5)
       RETURNING *`,
      [title, description, category || null, priority || null, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List tickets: employees see their own, agents and admins see all
router.get("/", async (req, res) => {
  try {
    const baseQuery = `
      SELECT t.*, c.name AS created_by_name, a.name AS assigned_to_name
      FROM tickets t
      JOIN users c ON t.created_by = c.id
      LEFT JOIN users a ON t.assigned_to = a.id
    `;

    let result;
    if (req.user.role === "employee") {
      result = await pool.query(
        baseQuery + " WHERE t.created_by = $1 ORDER BY t.created_at DESC",
        [req.user.id]
      );
    } else {
      result = await pool.query(baseQuery + " ORDER BY t.created_at DESC");
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get one ticket
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [req.params.id]);
    const ticket = result.rows[0];

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    if (req.user.role === "employee" && ticket.created_by !== req.user.id) {
      return res.status(403).json({ error: "You don't have permission" });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update status: agents and admins only
router.patch("/:id/status", requireRole("agent", "admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["open", "assigned", "in_progress", "resolved", "closed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await pool.query(
      "UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// Assign a ticket to the logged-in agent
router.patch("/:id/assign", requireRole("agent", "admin"), async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE tickets SET assigned_to = $1, status = 'assigned', updated_at = NOW() WHERE id = $2 RETURNING *",
      [req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;