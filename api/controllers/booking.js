import Booking from "../models/Booking.js";
import Room from "../models/Room.js"; 

export const createBooking = async (req, res, next) => {
  const { hotelId, rooms } = req.body;

  try {
    let totalPrice = 0;

    // Booking validation and price calculation
    const roomUpdates = []; // Hold room updates to mark unavailable dates
    for (const room of rooms) {
      const roomDetails = await Room.findById(room.roomId);
      if (!roomDetails) {
        return res.status(404).json({
          message: `Room with ID ${room.roomId} not found` });
        }
        const days = (new Date(room.dates[1]) - new Date(room.dates[0])) / (1000 * 3600 * 24) + 1;
        totalPrice += days * roomDetails.price;
  
        // Add the booking dates to the room's unavailableDates
        const datesToUpdate = room.dates.map(date => new Date(date));
        roomUpdates.push({ _id: room.roomId, dates: datesToUpdate });
      }
  
      // Update the availability of the rooms
      await Promise.all(
        roomUpdates.map(async (roomUpdate) => {
          await Room.findByIdAndUpdate(
            roomUpdate._id,
            { $push: { unavailableDates: { $each: roomUpdate.dates } } },
            { new: true }
          );
        })
      );
  
      // Proceed to create booking if all room IDs are valid
      const newBooking = new Booking({
        user: req.user.id,
        hotel: hotelId,
        rooms: rooms.map(room => ({
          room: room.roomId,
          dates: room.dates,
        })),
        price: totalPrice,
      });
  
      const savedBooking = await newBooking.save();
      res.status(201).json(savedBooking);
    } catch (err) {
      next(err);
    }
  };
  

export const getBookingsByUser = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("hotel", "name photos")
      .populate({
        path: "rooms.room",
        select: "title price maxPeople desc"
      });
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
