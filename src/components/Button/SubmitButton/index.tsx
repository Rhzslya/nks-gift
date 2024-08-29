import { Spinner } from "@/utils/Loading";
import React from "react";

interface ButtonProps {
  isLoading?: boolean | string;
  text: string;
  type?: "button" | "submit" | "reset";
  handleClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: "skyBlue" | "pink" | "black" | "red" | "gray";
}

const SubmitButton: React.FC<ButtonProps> = ({
  isLoading = false,
  text,
  type = "button",
  handleClick,
  disabled = false,
  variant = "skyBlue", // default value
}) => {
  const variantClassNames: {
    [key in NonNullable<ButtonProps["variant"]>]: string;
  } = {
    skyBlue: "bg-sky-400 hover:bg-sky-300",
    pink: "bg-pink-400 hover:bg-pink-300",
    black: "bg-black-400 hover:bg-black-300",
    red: "bg-red-300 hover:bg-red-200",
    gray: "bg-gray-500 hover:bg-gray-400",
  };

  const buttonClassName = disabled
    ? "opacity-50 cursor-not-allowed"
    : variantClassNames[variant];

  const baseClassName = `w-full text-white px-2 py-[6px] text-[15px] rounded duration-300 ${variantClassNames[variant]}`;

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={handleClick}
      className={`${baseClassName} ${buttonClassName}`}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner
            type="spinningBubbles"
            color="white"
            width="20px"
            height="20px"
          />
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
