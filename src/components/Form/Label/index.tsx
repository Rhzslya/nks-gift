import React, { useState } from "react";
import { capitalizeFirst } from "@/utils/Capitalize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface LabelAndInputProps {
  id: string;
  type: string;
  name: string;
  text: string;
  value: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | string[] | null;
  isPasswordSignUp?: boolean;
  passwordCriteria?: {
    length: boolean;
    combination: boolean;
    specialChar: boolean;
  };
}

const LabelAndInput: React.FC<LabelAndInputProps> = ({
  id,
  type,
  name,
  text,
  value,
  handleChange,
  handlePasswordChange,
  error,
  isPasswordSignUp,
  passwordCriteria,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasBeenTouched(true);
    if (handlePasswordChange) {
      handlePasswordChange(e);
    } else if (handleChange) {
      handleChange(e);
    }
  };

  // Determine if the input should have an error class
  const inputClassName = `px-2 py-2 rounded bg-transparent focus:bg-transparent focus:border-pink-300 border-[1px] ${
    isPasswordSignUp && passwordCriteria
      ? passwordCriteria.length &&
        passwordCriteria.combination &&
        passwordCriteria.specialChar
        ? "border-gray-400"
        : hasBeenTouched
        ? "border-red-500"
        : "border-gray-400"
      : error
      ? hasBeenTouched
        ? "border-red-500"
        : "border-gray-400"
      : "border-gray-400"
  } text-sm w-full`;

  return (
    <div className="">
      <label htmlFor={id}>{capitalizeFirst(text)}</label>
      <div className="relative mt-2">
        <input
          type={isPasswordVisible && type === "password" ? "text" : type}
          id={id}
          name={name}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setHasBeenTouched(true)}
          className={inputClassName}
        />
        {type === "password" && (
          <span
            onClick={togglePasswordVisibility}
            className="absolute h-full right-2 top-[25%] cursor-pointer text-gray-600"
          >
            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
          </span>
        )}
      </div>
      {isPasswordSignUp && passwordCriteria && (
        <div className="password-criteria flex flex-col mt-2 text-[12px] text-gray-600">
          <p
            className={
              passwordCriteria.length ? "text-green-500" : "text-red-500"
            }
          >
            {passwordCriteria.length ? "✓" : "✗"} Minimum of 8 characters
          </p>
          <p
            className={
              passwordCriteria.combination ? "text-green-500" : "text-red-500"
            }
          >
            {passwordCriteria.combination ? "✓" : "✗"} Uppercase, lowercase, and
            one number
          </p>
          <p
            className={
              passwordCriteria.specialChar ? "text-green-500" : "text-red-500"
            }
          >
            {passwordCriteria.specialChar ? "✓" : "✗"} One special character
          </p>
        </div>
      )}

      {error && (
        <div className="password-criteria flex flex-col mt-2 text-[12px] ">
          <p className="text-red-500">
            {Array.isArray(error) ? error.join(", ") : error}
          </p>
        </div>
      )}
    </div>
  );
};

export default LabelAndInput;
