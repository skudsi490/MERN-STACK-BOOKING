import Booking from "../models/Booking.js";
import Room from "../models/Room.js"; 

export const createBooking = async (req, res, next) => {
  const { hotelId, rooms } = req.body;

  try {
    let totalPrice = 0;
    const roomUpdates = [];

    for (const room of rooms) {
      const roomDetails = await Room.findById(room.roomId);
      if (!roomDetails) {
        return res.status(404).json({ message: `Room with ID ${room.roomId} not found` });
      }

      // Define startDate and endDate within the loop to ensure they're accessible
      const startDate = new Date(room.dates[0]);
      const endDate = new Date(room.dates[1]);
      const days = (endDate - startDate) / (1000 * 3600 * 24) + 1; // +1 to include the end date
      totalPrice += days * roomDetails.price;

      const datesToUpdate = [];
      for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        datesToUpdate.push(new Date(day));
      }

      roomUpdates.push({
        roomId: room.roomId,
        roomNumberId: room.roomNumberId,
        datesToUpdate
      });
    }

    await Promise.all(roomUpdates.map(async ({ roomId, roomNumberId, datesToUpdate }) => {
      await Room.updateOne(
        { "_id": roomId, "roomNumbers._id": roomNumberId },
        { $push: { "roomNumbers.$.unavailableDates": { $each: datesToUpdate } } }
      );
    }));

    const newBooking = new Booking({
      user: req.user.id,
      hotel: hotelId,
      rooms: rooms.map(room => ({
        room: room.roomId,
        roomNumber: room.roomNumberId,
        dates: [startDate, endDate],
      })),
      price: totalPrice,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("Error in createBooking:", err);
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
