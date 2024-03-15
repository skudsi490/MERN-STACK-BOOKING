import { useContext } from "react";
import { Link } from "react-router-dom";
import { differenceInCalendarDays, format } from "date-fns";
import { SearchContext } from "../../context/SearchContext";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  const { dates } = useContext(SearchContext);

  // Calculate the number of nights between the selected dates
  const nights = dates[0]
    ? differenceInCalendarDays(dates[0].endDate, dates[0].startDate)
    : 0;

  // Calculate the total price based on the number of nights and the item's price per night
  const totalPrice = item.cheapestPrice * (nights > 0 ? nights : 1);

  return (
    <div className="searchItem">
      <img src={item.photos[0]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">{item.distance}m from center</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
          Standard Room , city view, free Wi-Fi
        </span>
        <span className="siFeatures">{item.desc}</span>
        <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>
        )}
        <div className="siDetailTexts">
          <span className="siPrice">${totalPrice}</span>
          <span className="siTaxOp">
            Includes taxes and fees for {nights} night(s)
          </span>
          <Link to={`/hotels/${item._id}`}>
            <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
