import { signOut } from "next-auth/react";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    signOut({
        callbackUrl: "/",
      });
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
    