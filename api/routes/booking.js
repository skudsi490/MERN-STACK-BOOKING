import express from "express";
import {
  createBooking,
  getBookingsByUser,
  deleteBooking,
  makeRoomAvailable 
} from "../controllers/booking.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createBooking); // Create a booking
router.get("/find/:userId", verifyToken, getBookingsByUser); // Get bookings by user
router.delete("/:id", verifyToken, deleteBooking); // delete booking
router.put('/make-available/:roomNumberId', verifyToken, makeRoomAvailable);

export default router;
