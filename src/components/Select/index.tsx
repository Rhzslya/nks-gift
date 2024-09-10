import { capitalizeFirst } from "@/utils/Capitalize";
import React from "react";

interface SelectProps {
  id: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  textStyle?: string;
  disabled?: boolean;
  error?: string | string[] | null;
}

const Select: React.FC<SelectProps> = ({
  id,
  name,
  options,
  value,
  onChange,
  textStyle,
  disabled,
  error,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={textStyle}>
        {capitalizeFirst(name)}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="py-[6px] px-1 mt-2 rounded bg-transparent border-[1px] border-gray-400 text-xs w-full"
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

export default Select;
