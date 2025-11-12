import React from "react";

const Button = ({
  label = "Button",
  type = "button",
  className = "",
  desabled = "false",
}) => {
  return (
    <div className="w-full">
      <button
        type={type}
        className={`bg-blue-500 text-white py-2 rounded hover:bg-blue-600b ${className}`}
        desabled={desabled}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
