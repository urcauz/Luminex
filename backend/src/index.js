import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;  // Default to 5000 if no PORT is set
const __dirname = path.resolve();

// 🔧 Increase body size limits to handle larger requests (like profile pics)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",  // Or update to match your frontend's domain
    credentials: true,
  })
);

// 🛣️ Route Setup
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 🏭 Serve frontend in production or skip if you don't need it
if (process.env.NODE_ENV === "production") {
  // Serve static assets (if you want to serve any static assets directly from frontend/src)
  app.use(express.static(path.join(__dirname, "../frontend/src")));

  // Handle all other routes and send the frontend HTML
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/src", "index.html"));  // or other entry file for your frontend
  });
}

// 🚀 Start server
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
