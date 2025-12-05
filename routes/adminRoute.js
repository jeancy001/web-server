
import express from "express";

const router = express.Router();

import { registerAdmin, login } from "../controllers/receiptAuth.js";


router.post("/register-admin", registerAdmin);
router.post("/login", login);

export {router  as RouterAdmin};
