import React, { useState } from "react";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Meta from "../../components/Meta/Meta";
import "./Profile.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  let userLogin: any = localStorage.getItem("userLogin");
  userLogin = JSON.parse(userLogin);
  let idUser = userLogin?.data?._id;

  const validateForm = () => {
    const errors: any = {};
    let isValid = true;

    if (!formData.firstname.trim()) {
      errors.firstname = "First Name is required";
      isValid = false;
    }

    if (!formData.lastname.trim()) {
      errors.lastname = "Last Name is required";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
      isValid = false;
    }

    if (!formData.oldPassword.trim()) {
      errors.oldPassword = "Old Password is required";
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = "New Password is required";
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      phone: "",
      oldPassword: "",
      newPassword: "",
    });
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError("");

    if (!validateForm()) {
      return;
    }
    const data = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      phone: formData.phone,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    try {
      const response = await axios.patch(
        `http://localhost:8080/api/v1/user/change-profile/${idUser}`,
        data
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Profile updated successfully", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000, // Đóng thông báo sau 3 giây
        });
        clearForm();
      }
      return response.data;
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setPasswordError("Old password does not match");
      } else {
        // Hiển thị thông báo toast lỗi nếu có lỗi xảy ra
        toast.error("An error occurred while updating profile", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <>
      <Meta title={"Profile"} />
      <BreadCrumb title={"Profile"} />
      <ToastContainer />

      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>
        <div className="profile-content">
          <form onSubmit={handleEditProfile}>
            <div className="profile-info">
              <h2>My Profile Information</h2>
              <div className="form-group">
                <label htmlFor="firstname">First Name:</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
                {formErrors.firstname && (
                  <p className="error-message">{formErrors.firstname}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name:</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
                {formErrors.lastname && (
                  <p className="error-message">{formErrors.lastname}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {formErrors.phone && (
                  <p className="error-message">{formErrors.phone}</p>
                )}
              </div>
            </div>
            <div className="profile-actions">
              <div className="form-group">
                <label htmlFor="oldPassword">Old Password:</label>
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={toggleShowOldPassword}
                >
                  {showOldPassword ? "Hide" : "Show"}
                </button>
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}
                {formErrors.oldPassword && (
                  <p className="error-message">{formErrors.oldPassword}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                {formErrors.newPassword && (
                  <p className="error-message">{formErrors.newPassword}</p>
                )}
                <button
                  type="button"
                  className="toggle-password"
                  onClick={toggleShowNewPassword}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="profile-actions">
              <button type="submit" className="btn-profile">
                Edit Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
