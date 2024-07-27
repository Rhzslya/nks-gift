import React from "react";

interface ButtonProps {
  isLoading: boolean;
  text: string;
  type?: "button" | "submit" | "reset";
  handleClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({
  isLoading,
  text,
  type = "button",
  handleClick,
}) => {
  return (
    <button
      disabled={isLoading}
      type={type}
      onClick={handleClick}
      className="w-full bg-sky-400 text-white px-2 py-[6px] text-sm rounded hover:bg-sky-300 duration-300"
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
};

export default Button;
