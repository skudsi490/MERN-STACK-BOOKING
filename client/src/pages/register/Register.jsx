import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar"; 
import "./register.css";

const Register = () => {
  const [info, setInfo] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    city: "",
    phone: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.id]: e.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      await axios.post("http://localhost:8800/api/auth/register", info);
      navigate("/login");
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="register">
      <div className="rContainer">
        <h1 className="rTitle">Create an Account</h1>
        <form className="rForm">
          <input
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Country"
            id="country"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="City"
            id="city"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Phone"
            id="phone"
            onChange={handleChange}
          />
          <button onClick={handleClick}>Register</button>
        </form>
        {error && <span className="rError">Something went wrong!</span>}
      </div>
    </div>
    </div>
  );
};

export default Register;
