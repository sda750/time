import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import cors from "cors";

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage for metadata
const dbPath = path.join(process.cwd(), "db.json");
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ works: [] }));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/works", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  res.json(data.works);
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { memory } = req.body;
  const newWork = {
    id: Date.now().toString(),
    url: `/uploads/${req.file.filename}`,
    type: req.file.mimetype.startsWith("video") ? "video" : "image",
    memory,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };

  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  data.works.push(newWork);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  res.json(newWork);
});

// Update clicks
app.post("/api/works/:id/click", (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const work = data.works.find((w: any) => w.id === id);
  if (work) {
    work.clicks += 1;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    res.json(work);
  } else {
    res.status(404).json({ error: "Work not found" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
