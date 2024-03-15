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
          {bookings.map((booking) => (
            <div key={booking._id} className="bookingItem">
              <img
                src={booking.hotel?.photos?.[0] || "/images/default-hotel.jpg"}
                alt="Hotel"
                className="bookingImg"
              />
              <div className="bookingDetails">
                <h2>{booking.hotel?.name || "Hotel name not available"}</h2>
                {/* Display booking dates for each room */}
                <p>Number of rooms: {booking.rooms.length}</p>{" "}
                {/* Number of rooms */}
                {booking.rooms.map((room, index) => {
                  const checkIn = new Date(room.dates[0]);
                  const checkOut = new Date(room.dates[room.dates.length - 1]);
                  const nights = (checkOut - checkIn) / (1000 * 3600 * 24);

                  return (
                    <p key={index}>
                      {nights} night(s): {checkIn.toLocaleDateString()} -{" "}
                      {checkOut.toLocaleDateString()}
                    </p>
                  );
                })}
                {/* Display the total price */}
                <p className="bookingPrice">
                  Total Price: $
                  {booking.price ? booking.price.toFixed(2) : "Not available"}
                </p>
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="cancelBookingBtn"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default MyBookings;
