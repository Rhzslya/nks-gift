import React from "react";

interface ButtonProps {
  isLoading: boolean;
  text: string;
  type?: "button" | "submit" | "reset";
  handleClick?: () => void;
  variant?: "skyBlue" | "pink" | "black";
}
const AuthButton: React.FC<ButtonProps> = ({
  isLoading,
  text,
  type = "button",
  handleClick,
  variant = "skyBlue",
}) => {
  const classNames: any = {
    skyBlue: "bg-sky-400 hover:bg-sky-300",
    pink: "bg-pink-400 hover:bg-pink-300",
    black: "bg-black-400 hover:bg-black-300",
  };
  return (
    <button
      disabled={isLoading}
      type={type}
      onClick={handleClick}
      className={`w-full ${classNames[variant]} text-white px-2 py-[3px] text-[15px] rounded  duration-300`}
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
};

export default AuthButton;
