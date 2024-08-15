import React from "react";

interface ConfirmButtonProps {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  variant?: "confirm" | "success" | "warning" | "cancel";
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  text,
  onClick,
  variant = "confirm",
}) => {
  const classNames = {
    confirm:
      "text-gray-100  hover:bg-red-400 py-1 px-2 bg-red-500 rounded duration-300 ",
    success:
      "text-gray-100  hover:bg-green-400 py-1 px-2 bg-green-500 rounded duration-300 ",
    warning:
      "text-gray-100  hover:bg-orange-400 py-1 px-2 bg-orange-500 rounded duration-300 ",
    cancel:
      "text-gray-600 hover:text-gray-500 bg-white py-1 px-12 border-[1px] border-gray-500 rounded duration-300",
  };

  return (
    <button onClick={onClick} className={classNames[variant]}>
      {text}
    </button>
  );
};

export default ConfirmButton;
