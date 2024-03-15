import Booking from "../models/Booking.js";
import Room from "../models/Room.js"; 
import mongoose from 'mongoose';

export const createBooking = async (req, res, next) => {
  const { hotelId, rooms } = req.body;

  try {
    const newBooking = new Booking({
      user: req.user.id,
      hotel: hotelId,
      rooms: rooms.map(room => ({
        room: mongoose.Types.ObjectId(room.roomId),
        roomNumber: mongoose.Types.ObjectId(room.roomNumberId),
        dates: room.dates,
        price: room.price,
      })),
    });

    // Save the new booking
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
};


export const getBookingsByUser = async (req, res, next) => {
  try {
    let bookings = await Booking.find({ user: req.user.id })
      .populate("hotel", "name photos");

    bookings = await Promise.all(
      bookings.map(async (booking) => {
        const roomDetails = await Promise.all(
          booking.rooms.map(async ({ room, dates }) => {
            const roomData = await Room.findById(room); 
            console.log('Room data:', roomData); 
            return {
              room: roomData, 
              dates,
            };
          })
        );
        return {
          ...booking._doc,
          rooms: roomDetails,
        };
      })
    );
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const deleteBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    next(err);
  }
};
