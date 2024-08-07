import React from "react";

interface SelectProps {
  id: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  textStyle?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  name,
  options,
  value,
  onChange,
  textStyle,
}) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className={textStyle}>
        {name}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="px-2 py-2 rounded bg-transparent border-[1px] border-gray-400 text-sm w-full"
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
