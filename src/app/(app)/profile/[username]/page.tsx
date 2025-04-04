import React from "react";

interface ProfileProps {
  url: string;
  name: string;
  qualification: string;
  location: string;
  followers: number;
  id: number;
}

const ProfilePhoto: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
      <img src={url} alt="Profile" className="h-full w-full object-cover" />
    </div>
  );
};

const Profile: React.FC = () => {
  const userProfile: ProfileProps = {
    name: "Aayush",
    url: "#",
    qualification: "Student at NSUT",
    location: "Delhi, India",
    followers: 1000,
    id: 1,
  };

  const currentUser = { id: 1, name: "Aayush", location: "Delhi, India", followers: 1000 };

  return (
    <div className="login-background flex min-h-screen justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Cover Image */}
        <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-orange-500 via-red-400 to-yellow-300">
          <div className="bg-opacity-40 absolute inset-0 bg-white mix-blend-overlay"></div>
        </div>

        {/* Profile Info */}
        <div className="-mt-16 flex flex-col items-center p-6">
          <ProfilePhoto url={userProfile.url} />
          <h2 className="mt-3 text-2xl font-bold text-gray-900">{userProfile.name}</h2>
          <p className="text-gray-600">{userProfile.qualification}</p>
          <p className="text-sm text-gray-500">{userProfile.location}</p>

          {/* Stats */}
          <div className="mt-4 flex space-x-4">
            <span className="font-semibold text-blue-600">{userProfile.followers}</span>
            <span className="text-gray-500">followers</span>
          </div>

          {/* Actions */}
          <div className="mt-4 flex space-x-4">
            <button className="login-button">Follow</button>
          </div>
        </div>

        {currentUser.id === userProfile.id && (
          <form className="max-w-fit-content flex flex-col items-center justify-center p-6">
            <h2 className="text-center text-2xl font-bold text-gray-900">Edit Profile</h2>
            <div>
              <label className="mt-4 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={currentUser.name}
                className="mt-1 w-full rounded-md border px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="mt-4 block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                defaultValue={currentUser.location}
                className="mt-1 w-full rounded-md border px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <button className="login-button" type="submit">Update Details</button>
            </div>
          </form>
        )}
        <div className="border-t-2 border-b-2 p-2">
          <p className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-5xl font-bold text-transparent">Poems</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
