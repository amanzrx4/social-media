import express from "express";

const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import authRoutes from "./routes/auth.js";
import relationShipRoutes from "./routes/relationship.js";
const PORT = 8000;

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  // return console.log("file", req);
  return res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/relationships", relationShipRoutes);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
