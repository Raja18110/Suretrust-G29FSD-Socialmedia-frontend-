import React from "react";

interface ProfileViewProps {
  name: string;
  image: string;
  email :string;
}

const ProfileView: React.FC<ProfileViewProps> = ({ name,  image, email }) => {
  return (
   <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6 border border-gray-300 flex items-center gap-6">
     <div className="flex items-center gap-6">
        <img
          src={image}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-400"
        />

      <div className="flex flex-col">
  <p className="text-xl font-semibold">Name: {name}</p>
  <p className="text-lg text-gray-700">Email: {email}</p>
</div>
      </div>
    </div>
  );
};

export default ProfileView;


