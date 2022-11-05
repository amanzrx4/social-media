import { db } from "../connect.js";
const getUser = (req, res) => {
  const userId = req.params.userId;
  console.log("userid", userId);
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export { getUser };
