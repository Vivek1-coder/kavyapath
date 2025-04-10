import { signOut } from "next-auth/react";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    signOut({
        callbackUrl: "/",
      });
  };

  return (
    <button onClick={handleLogout} className="hover:cursor-pointer">
      सत्र समाप्त करें
    </button>
  );
};

export default LogoutButton;
    