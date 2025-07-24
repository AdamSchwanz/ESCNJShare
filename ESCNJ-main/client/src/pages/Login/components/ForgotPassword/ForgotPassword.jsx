import { useState } from "react";
import "./ForgotPassword.css";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../../redux/loaderSlice";
import { message } from "antd";
import userService from "../../../../services/userService";

const ForgotPassword = ({ setSelectedView }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    companyName: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    companyName: "",
    sendEmail: "",
  });

  const [isEmailSent, setIsEmailSent] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateData = () => {
    const newErrors = { ...errors };
    let hasErrors = false;
    const { username, email, companyName } = formData;
    let emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) {
      newErrors.email = "Please enter a valid email";
      hasErrors = true;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Incorrect email format";
      hasErrors = true;
    } else {
      newErrors.email = "";
    }
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
    return !hasErrors;
  };

  const handleSubmit = async () => {
    // console.log("Form Data: ", formData);
    if (!validateData()) {
      setErrors((prevState) => ({ ...prevState, sendEmail: "" }));
      return;
    }
    try {
      dispatch(ShowLoading());
      const response = await userService.forgotPassword(formData);
      //   console.log("Response: ", response);
      setErrors((prevState) => ({ ...prevState, sendEmail: "" }));
      message.success(response.message);
      if (!isEmailSent) {
        setIsEmailSent(true);
      }
    } catch (error) {
      setErrors((prevState) => ({
        ...prevState,
        sendEmail: error?.response?.data?.error || "Something Went Wrong!",
      }));
    } finally {
      dispatch(HideLoading());
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-form">
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
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
        <div className="input-container">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="text"
            className="input"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="input-container">
          <label htmlFor="companyName" className="label">
            Company Name
          </label>
          <input
            type="text"
            className="input"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
          {errors.companyName && (
            <div className="error">{errors.companyName}</div>
          )}
        </div>

        <div className="buttons-wrapper">
          <div className="button-container">
            <IoMdArrowBack
              className="back-btn"
              size={24}
              onClick={() => setSelectedView("login")}
            />
          </div>
          <div className="button-container">
            <button onClick={handleSubmit}>
              {isEmailSent ? "Resend Email" : "Send Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
