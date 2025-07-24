import { useState } from "react";
import "./SetPassword.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../../redux/loaderSlice";
import { message } from "antd";
import userService from "../../../../services/userService";

const SetPassword = ({ userData, onModalClose }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    setPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const toggleShowPassword = (name) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const validateData = () => {
    const newErrors = { ...errors };
    let hasErrors = false;
    const { newPassword, confirmPassword } = formData;
    if (!newPassword) {
      newErrors.newPassword = "Please enter a new password";
      hasErrors = true;
    } else {
      newErrors.newPassword = "";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
      hasErrors = true;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Password didn't match";
      hasErrors = true;
    } else {
      newErrors.confirmPassword = "";
    }
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
    return !hasErrors;
  };

  const handleSubmit = async () => {
    if (!validateData()) {
      setErrors((prevState) => ({ ...prevState, setPassword: "" }));
      return;
    }
    const data = {
      ...userData,
      newPassword: formData.newPassword,
    };
    // console.log("Date to be sent: ", data);
    try {
      dispatch(ShowLoading());
      const response = await userService.setPassword(data);
      //   console.log("Response: ", response);
      setErrors((prevState) => ({ ...prevState, setPassword: "" }));
      message.success(response.message);
      onModalClose({ success: true });
    } catch (error) {
      setErrors((prevState) => ({
        ...prevState,
        setPassword: error?.response?.data?.error || "Something Went Wrong!",
      }));
    } finally {
      dispatch(HideLoading());
    }
  };

  return (
    <div className="set-password">
      <div className="title">Set Your Password</div>
      <div className="form">
        <div className="input-container">
          <label htmlFor="newPassword" className="label">
            New Password
          </label>
          <div className="password-wrapper">
            <input
              type={`${showPassword.newPassword ? "text" : "password"}`}
              className="input"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <div className="password-eye">
              {!showPassword.newPassword ? (
                <FaRegEye
                  size={20}
                  onClick={() => toggleShowPassword("newPassword")}
                />
              ) : (
                <FaRegEyeSlash
                  size={20}
                  onClick={() => toggleShowPassword("newPassword")}
                />
              )}
            </div>
          </div>
          {errors.newPassword && (
            <div className="error">{errors.newPassword}</div>
          )}
        </div>
        <div className="input-container">
          <label htmlFor="confirmPassword" className="label">
            Confirm Password
          </label>
          <div className="password-wrapper">
            <input
              type={`${showPassword.confirmPassword ? "text" : "password"}`}
              className="input"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div className="password-eye">
              {!showPassword.confirmPassword ? (
                <FaRegEye
                  size={20}
                  onClick={() => toggleShowPassword("confirmPassword")}
                />
              ) : (
                <FaRegEyeSlash
                  size={20}
                  onClick={() => toggleShowPassword("confirmPassword")}
                />
              )}
            </div>
          </div>
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="input-container">
          <button onClick={handleSubmit}>Save</button>
          {errors.setPassword && (
            <div className="error">{errors.setPassword}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
