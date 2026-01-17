import React from "react";
import ProfileCard from "../components/ProfileCard";

const Profile: React.FC = () => {
  const handleAccept = () => {
    alert("Profile Accepted!");
  };

  const handleReject = () => {
    alert("Profile Rejected!");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <ProfileCard
        name="Alexy Johnson"
  
        image="https://i.pravatar.cc/150?img=20"
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
};

export default Profile;
