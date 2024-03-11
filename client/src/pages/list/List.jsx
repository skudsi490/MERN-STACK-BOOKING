import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { useContext } from "react";

const List = () => {
  const { dispatch } = useContext(SearchContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Use state from the context instead of local state
  const [destination, setDestination] = useState(
    location.state.destination || ""
  );
  const [dates, setDates] = useState(location.state.dates || []);
  const [options, setOptions] = useState(
    location.state.options || { adult: 2, children: 0, room: 1 }
  );
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [openDate, setOpenDate] = useState(false);

  // Fetch data using search parameters from context
  const { data, loading, error, reFetch } = useFetch(
    `api/hotels?city=${destination}&min=${min || 0}&max=${max || 9999}`
  );

  useEffect(() => {
    reFetch();
  }, [destination, dates, options, min, max]);

  const handleOptionChange = (name, value) => {
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    dispatch({
      type: "UPDATE_SEARCH",
      payload: {
        city: destination,
        dates: dates,
        options: options,
      },
    });

    reFetch();
  };

  useEffect(() => {
    // Update local storage when the search state changes
    localStorage.setItem(
      "searchState",
      JSON.stringify({
        city: destination,
        dates: dates,
        options: options,
      })
    );
  }, [destination, dates, options]);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination"
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDates([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dates}
                  minDate={new Date()}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adults</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.adult}
                    onChange={(e) =>
                      handleOptionChange("adult", e.target.value)
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    value={options.children}
                    onChange={(e) =>
                      handleOptionChange("children", e.target.value)
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Rooms</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.room}
                    onChange={(e) => handleOptionChange("room", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="listResult">
            {loading
              ? "Loading..."
              : error
              ? "An error occurred. Please try again."
              : data.map((item) => (
                  <SearchItem item={item} key={item._id} dates={dates} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
