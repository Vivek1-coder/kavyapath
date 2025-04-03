import { signOut } from "next-auth/react";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    signOut({
        callbackUrl: "/",
      });
  };

  return (
    <button onClick={handleLogout} className='bg-red-500 p-2 rounded-xl w-40 hover:bg-red-700 hover:scale-105'>
      Logout
    </button>
  );
};

export default LogoutButton;
    