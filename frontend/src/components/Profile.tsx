import React from 'react';

interface ProfileProps {
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const Profile = ({ username, email, role, avatarUrl }: ProfileProps) => {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-6">
        <img src={avatarUrl || '/default-avatar.png'} alt={`${username} avatar`} className="w-32 h-32 rounded-full object-cover border" />

        <div className="space-y-2">
          <p className="text-xl font-semibold">{username}</p>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
