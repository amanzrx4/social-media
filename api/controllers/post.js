import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

function getPosts(req, res) {
  const userId = req.query.userId;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged In!");
  jwt.verify(token, "someComplicatedSecretKey", (err, userDetails) => {
    if (err) return res.status(403).json("Token is invalid bro!");

    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS user_id, name, profile_pic FROM posts AS p JOIN users AS u ON (u.id = p.user_id) WHERE p.user_id = ? ORDER BY p.created_at DESC`
        : `SELECT p.*, u.id AS user_id, name, profile_pic FROM posts AS p JOIN users AS u ON (u.id = p.user_id)
    LEFT JOIN relationships AS r ON (p.user_id = r.followed_user_id) WHERE r.follower_user_id= ? OR p.user_id =?
    ORDER BY p.created_at DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userDetails.id, userDetails.id];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}

function addPost(req, res) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged In!");
  jwt.verify(token, "someComplicatedSecretKey", (err, userDetails) => {
    if (err) return res.status(403).json("Token is invalid bro!");
    const q =
      "INSERT INTO posts(`desc`, `img`, `created_at`, `user_id`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img || null,
      dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userDetails.id,
    ];
    db.query(q, [values], (err, _) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
}

export { getPosts, addPost };
