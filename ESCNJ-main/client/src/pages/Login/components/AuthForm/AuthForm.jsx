import { useState } from "react";
import ESCNJLogo from "../../../../assets/ESCNJ-Logo.jpg";
import "./AuthForm.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../../redux/loaderSlice";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import SetPassword from "../SetPassword/SetPassword";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import userService from "../../../../services/userService";

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    login: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedView, setSelectedView] = useState("login");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateData = () => {
    const newErrors = { ...errors };
    let hasErrors = false;
    const { username, password } = formData;
    if (!username) {
      newErrors.username = "Please enter a valid username";
      hasErrors = true;
    } else {
      newErrors.username = "";
    }
    if (!password) {
      newErrors.password = "Please enter a valid password";
      hasErrors = true;
    } else {
      newErrors.password = "";
    }
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    // console.log("Form Data: ", formData);
    e.preventDefault();
    if (!validateData()) {
      setErrors((prevState) => ({ ...prevState, login: "" }));
      return;
    }
    try {
      dispatch(ShowLoading());
      const response = await userService.loginUser(formData);
      //   console.log("Response: ", response);
      setErrors((prevState) => ({ ...prevState, login: "" }));
      if (!response.token && response.tempUser) {
        setShowModal(true);
      } else if (response.token && !response.tempUser) {
        Cookies.set("escnj-jwt-token", response.token, {
          secure: true,
          sameSite: "Lax",
        });
        const from = location.state?.from.pathname;
        navigate(from || "/");
      }
    } catch (error) {
      setErrors((prevState) => ({
        ...prevState,
        login: error?.response?.data?.error || "Something Went Wrong!",
      }));
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleCloseModal = ({ success }) => {
    if (success) {
      setFormData((prevState) => ({ ...prevState, password: "" }));
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="auth-form">
        <div className="login-logo">
          <img src={ESCNJLogo}></img>
        </div>
        {selectedView === "login" ? (
          <form className="input-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                type="text"
                className="input"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="error">{errors.username}</div>
              )}
            </div>
            <div className="input-container">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={`${showPassword ? "text" : "password"}`}
                  className="input"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="password-eye">
                  {!showPassword ? (
                    <FaRegEye size={20} onClick={toggleShowPassword} />
                  ) : (
                    <FaRegEyeSlash size={20} onClick={toggleShowPassword} />
                  )}
                </div>
              </div>
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>
            <div className="input-container">
              <button type="submit">Login</button>
              {errors.login && <div className="error">{errors.login}</div>}
            </div>
            <div
              className="forgot-password"
              onClick={() => setSelectedView("forgot-password")}
            >
              Forgot your password?
            </div>
          </form>
        ) : (
          <ForgotPassword setSelectedView={setSelectedView} />
        )}
      </div>

      <CustomModal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel={"Password Setup"}
        width="40%"
      >
        <SetPassword userData={formData} onModalClose={handleCloseModal} />
      </CustomModal>
    </>
  );
};

export default AuthForm;
