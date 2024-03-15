import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading } = useFetch(`/api/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    let dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    return !roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
  };

  const handleSelect = (e, roomId, roomNumberId) => {
    const { checked } = e.target;
    // Find the room object in the `data` array that matches the `roomId`
    const roomType = data.find((room) => room._id === roomId);
    if (!roomType) {
      console.error("Selected room not found in data for id:", roomId);
      return;
    }

    setSelectedRooms((prevSelectedRooms) =>
      checked
        ? [
            ...prevSelectedRooms,
            { roomId, roomNumberId, price: roomType.price },
          ]
        : prevSelectedRooms.filter((room) => room.roomNumberId !== roomNumberId)
    );
  };

  const handleClick = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    if (selectedRooms.length === 0) {
      alert("Please select at least one room to reserve.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Update the availability of each room before making the booking.
      await Promise.all(
        selectedRooms.map((selectedRoom) =>
          axios.put(
            `/api/rooms/availability/${selectedRoom.roomNumberId}`,
            { dates: alldates },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      // Create the booking with the correct details.
      const bookingDetails = {
        hotelId,
        userId: user.id,
        rooms: selectedRooms.map((selectedRoom) => ({
          roomId: selectedRoom.roomId,
          roomNumberId: selectedRoom.roomNumberId,
          price: selectedRoom.price,
          dates: alldates,
        })),
      };

      const response = await axios.post("/api/bookings", bookingDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setOpen(false);
        navigate("/my-bookings");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {loading ? (
          <span>Loading...</span>
        ) : (
          data.map((item) => (
            <div className="rItem" key={item._id}>
              <div className="rItemInfo">
                <div className="rTitle">{item.title}</div>
                <div className="rDesc">{item.desc}</div>
                <div className="rMax">
                  Max people: <b>{item.maxPeople}</b>
                </div>
                <div className="rPrice">{item.price}</div>
              </div>
              <div className="rSelectRooms">
                {item.roomNumbers.map((roomNumber) => (
                  <div className="room" key={roomNumber._id}>
                    <label>{roomNumber.number}</label>
                    <input
                      type="checkbox"
                      value={item._id} 
                      onChange={(e) =>
                        handleSelect(e, item._id, roomNumber._id)
                      }
                      disabled={!isAvailable(roomNumber)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
