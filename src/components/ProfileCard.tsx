import React from "react";


interface ProfileCardProps {
  name: string;
  image: string;
  onAccept: () => void;
  onReject: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name,  image, onAccept, onReject }) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-xl p-5 border">
      <div className="flex flex-col items-center">
        <img
          src={image}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />

        <h2 className="text-xl font-bold mt-4">{name}</h2>
        {/* <p className="text-gray-600">{age} years old</p> */}
        {/* Bio */}
        <p className="text-gray-600 text-center mt-2">
          Student | Developer | Passionate about Full Stack Development.
        </p>


        <div className="flex gap-4 mt-5">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reject
          </button>

          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;


