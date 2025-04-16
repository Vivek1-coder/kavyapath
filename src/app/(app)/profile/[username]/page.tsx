"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LogoutButton from "../../../../components/Signout";
import { LoaderCircle } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
interface ProfileProps {
  url: string;
  name: string;
  email: string;
  location: string;
  followers: number;
  id: number;
  bio?: string;
  _id?: number;
}

const ProfilePhoto: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg z-50">
      <img src={url} alt="Profile" className="h-full w-full object-cover" />
    </div>
  );
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [loading,setIsloading] = useState(false);
  const [same,setIssame] = useState(false);
  const params = useParams();
  const username = params?.username as string;

  const fetchUserDetails = async (username: string) => {
    try {
      const response = await axios.get(`/api/get-user-details?username=${username}`);
      setUser(response.data.user[0]);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const isUserSelf = async(username:string) => {
    try {
      const response = await axios.get(`/api/is-user-self?username=${username}`)
      if(response.data.message === "Same"){
        setIssame(true);
      }
      console.log(response.data.message)
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  }

  useEffect(() => {
    if (username) {
      setIsloading(true);
      fetchUserDetails(username);
      isUserSelf(username)
      setIsloading(false);
    }
  }, [username]);

  const currentUser = {
    id: 1,
    name: "Aayush",
    location: "Delhi, India",
    followers: 1000,
  };

  const userProfile: ProfileProps = {
    name: user?.name || "Mr. Unknown",
    url: user?.url || "https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    email: user?.email || "abcd@nsut.ac.in",
    location: user?.location || "Delhi, India",
    followers: user?.followers || 1,
    id: user?._id || 0,
    bio: user?.bio || "न स्थिरं किञ्चिदस्यां संसारे चलिते सदा\।क्षणेक्षणे परिवर्त्तन्ते, नित्यं नूतनता यथा॥",
  };

  return (
    <div className="login-background  min-h-screen bg-gray-100 pt-0 px-6 " >
      <Navbar/>
      <div className="flex justify-center">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Cover Image */}
        <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-orange-500 via-red-400 to-yellow-300">
          <div className="bg-opacity-40 absolute inset-0 bg-white mix-blend-overlay"></div>
        </div>

        {/* Profile Info */}
        <div className="-mt-16 flex flex-col items-center p-6 z-50 ">
          <ProfilePhoto url={userProfile.url}/>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">{userProfile.name}</h2>
          <p className="text-gray-600">{userProfile.email}</p>
          <br/>
          <p className="text-sm text-gray-500">{userProfile.bio}</p>
          <br/>
          <p className="text-sm text-gray-500">{userProfile.location}</p>
          {/* Stats */}
          <div className="mt-4 flex space-x-4">
            <span className="font-semibold text-blue-600">{userProfile.followers}</span>
            <span className="text-gray-500">followers</span>
          </div>
          {/* Actions */}
          
          <div className="mt-4 flex space-x-4">
            {same?<div className="login-button"><LogoutButton/></div> : <button className="login-button">{loading?<LoaderCircle/>:"Follow"}</button>}
          </div>
        </div>

        {/* Edit Form for Current User */}
        {currentUser.id === userProfile.id && (
          <form className="max-w-fit-content flex flex-col items-center justify-center p-6">
            <h2 className="text-center text-2xl font-bold text-gray-900">Edit Profile</h2>
            <div className="w-full max-w-md">
              <label className="mt-4 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={currentUser.name}
                className="mt-1 w-full rounded-md border px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-400"
              />

              <label className="mt-4 block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                defaultValue={currentUser.location}
                className="mt-1 w-full rounded-md border px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-400"
              />

              <button className="login-button mt-4 w-full" type="submit">
                Update Details
              </button>
            </div>
          </form>
        )}

        {/* Poems Section */}
        {/* <div className="border-t-2 border-b-2 p-6">
          <p className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-5xl font-bold text-transparent">
            Poems
          </p>
        </div> */}
      </div>
      </div>
    </div>
  );
};

export default Profile;
