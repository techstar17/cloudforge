require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// temporary user storage (replace with DB later)
let users = [];

// multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ---------------- AUTH ----------------

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  users.push({
    id: Date.now(),
    email,
    password: hashed,
  });

  res.json({ message: "User registered successfully 🚀" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful 🚀",
    token
  });
});

// AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ---------------- UPLOAD ----------------

app.post("/upload", authMiddleware, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          error: "Upload error",
          details: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "No file received",
        });
      }

      const file = req.file;
      const fileName = `${Date.now()}-${file.originalname}`;

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

      res.json({
        message: "Uploaded to AWS S3 successfully 🚀",
        url: fileUrl,
        uploadedBy: req.user.email
      });

    } catch (error) {
      res.status(500).json({
        error: "Upload failed",
        details: error.message,
      });
    }
  });
});

// ---------------- HEALTH ----------------

app.get("/", (req, res) => {
  res.json({ status: "CloudForge running 🚀" });
});

// ---------------- START ----------------

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`CloudForge running on port ${PORT}`);
});