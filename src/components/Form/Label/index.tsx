import React from "react";
import { capitalizeFirst } from "@/utils/Capitalize";

interface LabelAndInputProps {
  id: string;
  type: string;
  name: string;
  text: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | string[] | null;
}

const LabelAndInput: React.FC<LabelAndInputProps> = ({
  id,
  type,
  name,
  text,
  value,
  handleChange,
  error,
}) => {
  return (
    <>
      <label htmlFor={id}>{capitalizeFirst(text)}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="px-2 py-2 rounded bg-transparent focus:bg-transparent focus:border-pink-300 border-[1px] border-gray-400 text-sm mt-2"
      />
      {error && (
        <small className="text-red-600">
          {Array.isArray(error) ? error.join(", ") : error}
        </small>
      )}
    </>
  );
};

export default LabelAndInput;
