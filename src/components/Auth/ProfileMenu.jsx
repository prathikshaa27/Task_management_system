import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";

export default function ProfileMenu() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="absolute top-4 right-6">
      <button
        onClick={() => setShowModal(true)}
        className="text-2xl text-gray-700 hover:text-blue-600"
        title="Edit Profile"
      >
        <FaUserCircle />
      </button>
      {showModal && <ProfileModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
