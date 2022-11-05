import { db } from "../connect.js";
import jwt from "jsonwebtoken";

function getRelationships(req, res) {
  const q =
    "SELECT follower_user_id FROM relationships WHERE followed_user_id = ?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.follower_user_id));
  });
}

function addRelationship(req, res) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "someComplicatedSecretKey", (err, userDetails) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO relationships (`follower_user_id`,`followed_user_id`) VALUES (?)";
    const values = [userDetails.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
}

function deleteRelationship(req, res) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "someComplicatedSecretKey", (err, userDetails) => {
    if (err) return res.status(403).json("Invalid token");

    const q =
      "DELETE FROM relationships WHERE `follower_user_id` = ? AND `followed_user_id` = ?";

    db.query(q, [userDetails.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
}

export { getRelationships, addRelationship, deleteRelationship };
