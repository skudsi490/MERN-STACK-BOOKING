import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import loginImage from "../../assets/login-background.jpg";
import Navbar from "../../components/navbar/Navbar";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/api/auth/login", credentials);
      localStorage.setItem("token", res.data.details.token);
      const { token, ...userDetails } = res.data.details;
      dispatch({ type: "LOGIN_SUCCESS", payload: userDetails });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="loginContainer">
      <Navbar />
      <div className="loginContent">
        <div className="loginImage">
          <img src={loginImage} alt="Login Visual" />
        </div>
        <div className="loginFormContainer">
          <form className="loginForm" onSubmit={handleClick}>
            <input
              type="text"
              placeholder="username"
              id="username"
              value={credentials.username}
              onChange={handleChange}
              className="lInput"
            />
            <input
              type="password"
              placeholder="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              className="lInput"
            />
            <button
              disabled={loading}
              onClick={handleClick}
              className="lButton"
            >
              Login
            </button>
            {error && <span className="loginError">{error.message}</span>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
