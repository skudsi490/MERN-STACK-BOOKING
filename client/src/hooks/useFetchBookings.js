import { useState, useEffect } from "react";
import axios from "axios";

const useFetchBookings = (userId) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const result = await axios.get(`/api/bookings/find/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        });
        if (isMounted) {
          setBookings(result.data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response ? error.response.data : error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (userId) {
      fetchBookings();
    }

    return () => {
      isMounted = false;
      source.cancel("Component got unmounted");
    };
  }, [userId]);

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the cancelled booking from state
      setBookings((currentBookings) =>
        currentBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error(
        "Error cancelling booking:",
        error.response ? error.response.data : error.message
      );
      // Optionally update the error state to reflect this error in the UI
      setError(error.response ? error.response.data : error.message);
    }
  };

  console.log("Fetched bookings:", bookings);

  return { bookings, loading, error, cancelBooking };
};

export default useFetchBookings;
