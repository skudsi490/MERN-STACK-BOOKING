import React, { useContext } from "react";
import useFetchBookings from "../../hooks/useFetchBookings";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import "./MyBookings.css";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const { bookings, loading, error, cancelBooking } = useFetchBookings(
    user?._id
  );

  if (loading) return <div>Loading your bookings...</div>;
  if (error) return <div>Error fetching bookings: {error.message}</div>;

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="myBookingsPage">
        <h1>My Bookings</h1>
        {bookings.map((booking) => {
          // Create a set to store unique date ranges
          const uniqueDates = new Set(
            booking.rooms.map(
              (room) =>
                `${new Date(room.dates[0]).toLocaleDateString()} - ${new Date(
                  room.dates[1]
                ).toLocaleDateString()}`
            )
          );

          return (
            <div key={booking._id} className="bookingItem">
              <img
                src={booking.hotel?.photos?.[0] || "/images/default-hotel.jpg"}
                alt="Hotel"
                className="bookingImg"
              />
              <div className="bookingDetails">
                <h2>{booking.hotel?.name || "Hotel name not available"}</h2>
                {/* Map over the set of unique dates */}
                {[...uniqueDates].map((dateRange, index) => (
                  <p key={index}>Booking Dates: {dateRange}</p>
                ))}
                {/* Cancel Booking Button */}
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="cancelBookingBtn"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
