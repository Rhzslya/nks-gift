import React from "react";

interface ButtonProps {
  isLoading: boolean;
  text: string;
  type?: "button" | "submit" | "reset";
  handleClick?: () => void;
  disabled?: boolean;
}
const SubmitButton: React.FC<ButtonProps> = ({
  isLoading,
  text,
  type = "button",
  handleClick,
  disabled,
}) => {
  const inputClassName = `${
    disabled ? "opacity-50 cursor-not-allowed " : "hover:bg-sky-300 "
  }`;

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={handleClick}
      className={`w-full bg-sky-400 text-white px-2 py-[6px] text-[15px] rounded duration-300 ${inputClassName}`}
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
};

export default SubmitButton;
