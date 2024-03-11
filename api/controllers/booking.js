import Booking from "../models/Booking.js";

export const createBooking = async (req, res, next) => {
  const { hotelId, rooms } = req.body;

  const newBooking = new Booking({
    user: req.user.id,
    hotel: hotelId,
    rooms: rooms.map((room) => ({
      room: room.roomId,
      dates: room.dates,
    })),
  });

  try {
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    next(err);
  }
};

export const getBookingsByUser = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "hotel",
      "name photos"
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
