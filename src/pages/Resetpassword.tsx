import React from "react";
import { baseUrl } from "../baseUrl";

const sendOtpUrl = `${baseUrl}/otp/otp`;
const changePasswordUrl = `${baseUrl}/otp/verify-otp`;

const ProfileCard: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  // ----------------------------
  // SEND OTP
  // ----------------------------
  const handleSendOtp = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(sendOtpUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setErrorMsg(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      console.log(data);
    } catch (error) {
      console.log("Error sending OTP:", error);
      setErrorMsg("Something went wrong");
    }
  };

  // ----------------------------
  // CHANGE PASSWORD
  // ----------------------------
  const handleChangePassword = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      return setErrorMsg("Passwords do not match!");
    }

    try {
      const res = await fetch(changePasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setErrorMsg(data.message || "Invalid OTP");
      }

      setSuccessMsg("Password changed successfully!");
      console.log(data);

    } catch (error) {
      console.log("Error changing password:", error);
      setErrorMsg("Something went wrong");
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-xl p-5 border">
      <h3 className="text-bold">Reset Password</h3>

      {successMsg && (
        <p className="text-green-600 font-semibold mb-3">{successMsg}</p>
      )}

      {errorMsg && (
        <p className="text-red-600 font-semibold mb-3">{errorMsg}</p>
      )}

      {otpSent ? (
        <>
          <h5 className="align-center mb-3">Check your email for OTP</h5>

          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter The OTP"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="w-full bg-blue-600 text-white py-2 rounded mb-3"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <input
              type="email"
              placeholder="Enter Your Registered Email"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="w-full bg-blue-600 text-white py-2 rounded mb-3"
              onClick={handleSendOtp}
            >
              SEND OTP
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;

