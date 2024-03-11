// E:\BookingV1\api\routes\auth.js

import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

export default router;
