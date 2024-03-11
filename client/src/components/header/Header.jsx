import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

const Header = ({ type }) => {
  return (
    <div className={`header ${type === "list" ? "listMode" : ""}`}>
      <div className="headerContainer">
        <div className="headerContent">
          <h1 className="headerTitle">Book Your Hotel With Us</h1>
          <p className="headerDesc">
            Save your star and enjoy the journey with TripAura
          </p>
          <div className="headerPromo">
            <div className="lightbeam"></div>
          </div>
          <Link to="/" className="headerLink">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
