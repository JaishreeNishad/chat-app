import React from "react";

const Input = ({
  label = "",
  type = "",
  name = "",
  className = "",
  isRequired = false,
  placeholder = "",
  value = "",
  onChange = () => {},
}) => {
  return (
    <div className="w-full mb-3 flex flex-col">
      {" "}
      <label
        for={name}
        className={` mb-2 text-md font-medium flex text-start ${className}`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        id="first_name"
        className={`bg-gray-50 border border-gray-300 p-1.5 w-full  ${className}`}
        placeholder={placeholder}
        required={isRequired}
      />
    </div>
  );
};

export default Input;
