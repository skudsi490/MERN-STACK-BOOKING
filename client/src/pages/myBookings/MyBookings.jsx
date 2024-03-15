import React, { useContext } from "react";
import useFetchBookings from "../../hooks/useFetchBookings";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import "./MyBookings.css";
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'; 

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const { bookings, loading, error, cancelBooking } = useFetchBookings(user?._id);

  if (loading) return <div>Loading your bookings...</div>;
  if (error) return <div>Error fetching bookings: {error.message}</div>;

  const formatDateRange = (startDate, endDate) => {
    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();
    return `${formattedStartDate} - ${formattedEndDate}`;
  };  

  const calculateTotalPrice = (rooms) => {
    return rooms.reduce((total, {room, dates}) => {
      if (!room || typeof room.price !== 'number') {
        console.error('Invalid room data:', room);
        return total;
      }
      const daysBooked = differenceInCalendarDays(new Date(dates[dates.length - 1]), new Date(dates[0])) + 1;
      return total + (room.price * daysBooked);
    }, 0);
  };
  
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="myBookingsPage">
        <h1>My Bookings</h1>
        {bookings.map((booking) => {
  if (!booking.rooms || booking.rooms.length === 0 || !booking.rooms[0].dates) {
    console.error('Invalid booking data', booking);
    return null;
  }
          const startDate = new Date(booking.rooms[0].dates[0]);
          const endDate = new Date(booking.rooms[0].dates[booking.rooms[0].dates.length - 1]);
          const dateRange = formatDateRange(startDate, endDate);
          const daysBooked = differenceInCalendarDays(endDate, startDate) + 1;
          const totalPrice = calculateTotalPrice(booking.rooms, daysBooked);

          return (
            <div key={booking._id} className="bookingItem">
              <img
                src={booking.hotel?.photos?.[0] || "/images/default-hotel.jpg"}
                alt="Hotel"
                className="bookingImg"
              />
              <div className="bookingDetails">
                <h2>{booking.hotel?.name || "Hotel name not available"}</h2>
                <p>Booking Dates: {dateRange}</p>
                <p>Days Booked: {daysBooked} Days</p>
                <p>Total Price: ${totalPrice.toFixed(2)}</p>
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
