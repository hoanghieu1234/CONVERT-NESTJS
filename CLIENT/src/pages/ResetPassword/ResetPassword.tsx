import axios from "axios";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Meta from "../../components/Meta/Meta";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { BsEyeSlash, BsEyeSlashFill } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleConfirmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    try {
      const token = window.location.pathname.split("/").pop();
      console.log(token);
      const resData = await axios.put(
        `http://localhost:8080/api/v1/user/reset-password/${token}`,
        {
          password: password,
        }
      );
      console.log(resData, "reset password");

      const data = resData.data;
      if (data.success) {
        toast.success("Password reset successful!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Meta title={"Reset Password"} />
      <BreadCrumb title="Reset Password" />
      <ToastContainer />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className="text-center mb-3">Reset Password</h3>
                <form
                  action=""
                  className="d-flex flex-column gap-15 "
                  onSubmit={handleSubmit}
                >
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      placeholder="Password"
                      className="form-control custom-password"
                      onChange={handlePasswordChange}
                    />
                    {showPassword ? (
                      <BsEyeSlashFill onClick={handleToggleShowPassword} className="custom-eye-password"/>
                    ) : (
                      <BsEyeSlash onClick={handleToggleShowPassword} className="custom-eye-password"/>
                    )}
                  </div>
                  <div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm-password"
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      className="form-control custom-confirm-password"
                      onChange={handleConfirmChange}
                    />
                    {showConfirmPassword ? (
                      <BsEyeSlashFill onClick={handleToggleShowConfirmPassword} className="custom-eye-confirm"/>
                    ) : (
                      <BsEyeSlash onClick={handleToggleShowConfirmPassword} className="custom-eye-confirm"/>
                    )}
                  </div>
                  <div>
                    <div className="d-flex justify-content-center gap-15 align-items-center">
                      <button className="button border-0">Ok</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </> // Make sure this closing tag corresponds to the opening tag
  );
};

export default ResetPassword;
