import { db } from "../connect.js";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";

function getComments(req, res) {
  const q = `SELECT c.*, u.id AS user_id, name, profile_pic FROM comments AS c JOIN users AS u ON (u.id = c.user_id)
  WHERE c.post_id = ? ORDER BY c.created_at DESC`;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}

function addComment(req, res) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "someComplicatedSecretKey", (err, userDetails) => {
    if (err) return res.status(403).json("Invalid token");

    const q =
      "INSERT INTO comments(`desc`, `created_at`, `user_id`, `post_id`) VALUES (?)";
    const values = [
      req.body.desc,
      dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userDetails.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment Successfully created");
    });
  });
}

export { getComments, addComment };
