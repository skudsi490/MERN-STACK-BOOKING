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

  const handleSelect = (e, roomType) => {
    const { checked, value } = e.target; // value should be the room type ID, not the room number ID
    setSelectedRooms(
      checked
        ? [...selectedRooms, { roomId: roomType._id, price: roomType.price, dates: [dates[0].startDate, dates[0].endDate] }]
        : selectedRooms.filter((selectedRoom) => selectedRoom.roomId !== roomType._id)
    );
  };
  

  const navigate = useNavigate();

  const handleClick = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    
    const allDatesFilled = selectedRooms.every(room => room.dates && room.dates.length === 2);
    if (!allDatesFilled) {
      console.error("Error: Not all selected rooms have start and end dates.");
      return;
    }
    
    const totalBookingPrice = selectedRooms.reduce((acc, room) => {
      const nights = getDatesInRange(room.dates[0], room.dates[1]).length;
      return acc + (room.price * nights);
    }, 0);
    
    const bookingData = {
      hotelId,
      rooms: selectedRooms.map(room => ({
        roomId: room.roomId, // This should be the room type ID
        dates: getDatesInRange(room.dates[0], room.dates[1]),
      })),
      price: totalBookingPrice,
    };
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/bookings", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      console.log(response.data);
      setOpen(false);
      navigate("/my-bookings");
    } catch (err) {
      console.error("Error creating booking:", err.response ? err.response.data : err);
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
                <div className="rMax">Max people: <b>{item.maxPeople}</b></div>
                <div className="rPrice">${item.price}</div>
              </div>
              <div className="rSelectRooms">
                {item.roomNumbers.map((roomNumber) => (
                  <div className="room" key={roomNumber._id}>
                    <label>{roomNumber.number}</label>
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={(e) => handleSelect(e, item)}
                      disabled={!isAvailable(roomNumber)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <button onClick={handleClick} className="rButton">Reserve Now!</button>
      </div>
    </div>
  );
};

export default Reserve;
