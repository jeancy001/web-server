
import { UserAdmin } from "../models/userAdmin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"


export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  const admin = await UserAdmin.create({
    username,
    password: hash,
    role: "admin"
  });

  res.json({ message: "Admin created", admin });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await UserAdmin.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(403).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

  res.json({ token, role: user.role });
};
