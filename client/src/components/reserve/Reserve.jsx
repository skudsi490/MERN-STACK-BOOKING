import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading } = useFetch(`/api/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchRoomData();
  }, [hotelId]);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let dates = [];
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date).getTime());
    }
    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const roomUnavailableDates = roomNumber.unavailableDates.map((date) =>
      new Date(date).getTime()
    );
    return !alldates.some((date) => roomUnavailableDates.includes(date));
  };

  const handleSelect = (e, roomType, roomNumberId) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedRooms(prev => [
        ...prev,
        {
          roomNumberId,
          roomId: roomType._id,
          price: roomType.price,
          dates: [dates[0].startDate, dates[0].endDate]
        }
      ]);
    } else {
      setSelectedRooms(prev => prev.filter(room => room.roomNumberId !== roomNumberId));
    }
  };
  

  const navigate = useNavigate();

  const handleClick = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
  
    const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);
  
    const bookingData = {
      hotelId,
      rooms: selectedRooms.map((room) => ({
        roomId: room.roomId,
        roomNumberId: room.roomNumberId, // Assuming roomNumberId is available in room object
        dates: [dates[0].startDate, dates[0].endDate],
      })),
      price: selectedRooms.reduce(
        (acc, room) =>
          acc + room.price * alldates.length,
        0
      ),
    };
  
    try {
      const token = localStorage.getItem("token");
  
      // Step 1: Post booking data to your API
      await axios.post("/api/bookings", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Step 2: Update each room's unavailable dates
      await Promise.all(selectedRooms.map(async (room) => {
        const roomUpdateData = {
          dates: alldates,
        };
        await axios.put(`/api/rooms/availability/${room.roomNumberId}`, roomUpdateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }));
  
      // Refetch room data to reflect the new unavailable dates
      await fetchRoomData();
      setOpen(false);
      navigate("/my-bookings");
    } catch (error) {
      console.error(
        "Error creating booking:",
        error.response ? error.response.data : error
      );
    }
  };
  
  // Fetch room data function
  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`/api/hotels/room/${hotelId}`);
    } catch (error) {
      console.error("Error fetching room data:", error);
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
        {loading
          ? "Loading..."
          : data.map((item) => (
              <div className="rItem" key={item._id}>
                <div className="rItemInfo">
                  <div className="rTitle">{item.title}</div>
                  <div className="rDesc">{item.desc}</div>
                  <div className="rMax">
                    Max people: <b>{item.maxPeople}</b>
                  </div>
                  <div className="rPrice">${item.price}</div>
                </div>
                <div className="rSelectRooms">
                  {item.roomNumbers.map((roomNumber) => (
                    <div className="room" key={roomNumber._id}>
                      <label>{roomNumber.number}</label>
                      <input
                        type="checkbox"
                        value={roomNumber._id}
                        onChange={(e) => handleSelect(e, item, roomNumber._id)}
                        disabled={!isAvailable(roomNumber)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
