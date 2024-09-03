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
}

const Select: React.FC<SelectProps> = ({
  id,
  name,
  options,
  value,
  onChange,
  textStyle,
  disabled,
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
        className="px-2 py-[5px] mt-2 rounded bg-transparent border-[1px] border-gray-400 text-xs w-full"
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
