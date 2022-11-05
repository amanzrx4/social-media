import { db } from "../connect.js";
import jwt from "jsonwebtoken";

function getLikes(req, res) {
  const q = "SELECT user_id FROM likes WHERE post_id  = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.user_id));
  });
}

function addLike(req, res) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "someComplicatedSecretKey", (err, userDetails) => {
    if (err) return res.status(403).json("Token is invalid");

    const q = "INSERT INTO likes (`user_id`,`post_id`) VALUES (?)";
    const values = [userDetails.id, req.body.postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
}

function deleteLike(req, res) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "someComplicatedSecretKey", (err, userDetails) => {
    if (err) return res.status(403).json("Invalid Token");

    const q = "DELETE FROM likes WHERE `user_id` = ? AND `post_id` = ?";

    db.query(q, [userDetails.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been disliked successfully");
    });
  });
}

export { getLikes, addLike, deleteLike };
