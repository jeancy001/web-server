
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" }
});

export const UserAdmin= mongoose.model("Useradmin", UserSchema);
