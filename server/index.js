require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const waitlistSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().max(30).optional().or(z.literal(""))
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/waitlist", (req, res) => {
  const parsed = waitlistSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      message: "Invalid input",
      errors: parsed.error.issues
    });
  }

  const { name, email, whatsapp } = parsed.data;
  const createdAt = new Date().toISOString();

  try {
    const stmt = db.prepare(`
      INSERT INTO waitlist (name, email, whatsapp, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(name || null, email.toLowerCase(), whatsapp || null, createdAt);

    return res.status(201).json({ ok: true, message: "Joined waitlist" });
  } catch (err) {
    // Handle duplicate email
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ ok: false, message: "Email already joined" });
    }
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// Optional: admin/test endpoint (remove later or protect)
app.get("/api/waitlist", (req, res) => {
  const rows = db.prepare(`SELECT id, name, email, whatsapp, created_at FROM waitlist ORDER BY id DESC`).all();
  res.json({ ok: true, count: rows.length, data: rows });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
