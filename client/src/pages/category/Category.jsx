import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import "./category.css";

const Category = () => {
  const { search } = useLocation();
  const [city, setCity] = useState("");
  const [properties, setProperties] = useState([]);

  const { data, loading, error } = useFetch(
    `/api/hotels${search}${city ? `&city=${city}` : ""}&noLimit=true`
  );

  useEffect(() => {
    setProperties(data);
  }, [data]);

  const handleCityFilter = (e) => {
    e.preventDefault();
    const cityValue = e.target.elements.city.value;
    setCity(cityValue);
  };

  const handleResetFilter = () => {
    setCity("");
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <form onSubmit={handleCityFilter} className="cityFilterForm">
        <input
          type="text"
          name="city"
          placeholder="Filter by city"
          defaultValue={city}
        />
        <button type="submit">Apply</button>
        <button type="button" onClick={handleResetFilter}>
          Reset
        </button>
      </form>
      <div className="propertiesList">
        {loading && <div>Loading...</div>}
        {error && <div>There was an error fetching the properties.</div>}
        {!loading && !error && properties.length === 0 && (
          <div>No properties found.</div>
        )}
        {!loading &&
          !error &&
          properties.map((property) => (
            <SearchItem key={property._id} item={property} />
          ))}
      </div>
    </div>
  );
};

export default Category;
