import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    rooms: [
      {
        room: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
        dates: [Date],
      },
    ],
    price: {
      type: Number,
      required: true, 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Booking", BookingSchema);
