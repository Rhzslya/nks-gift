import { capitalizeFirst } from "@/utils/Capitalize";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface ButtonProps {
  isLoading?: boolean;
  text: string;
  type?: "button" | "submit" | "reset";
  variant?: "signIn" | "signOut";
}

const AuthButtonAlt: React.FC<ButtonProps> = ({
  text,
  type = "button", // Menambahkan default value untuk `type`
  variant,
  isLoading,
}: ButtonProps) => {
  const classNames: Record<string, string> = {
    signIn: "bx-log-in",
    signOut: "bx-log-out",
  };

  return (
    <button
      onClick={variant === "signIn" ? () => signIn() : () => signOut()}
      disabled={isLoading}
      type={type}
      className="flex items-center gap-2 w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      <i className={`bx ${classNames[variant || "signIn"]} text-[18px]`}></i>
      <p>{capitalizeFirst(text)}</p>
    </button>
  );
};

export default AuthButtonAlt;
