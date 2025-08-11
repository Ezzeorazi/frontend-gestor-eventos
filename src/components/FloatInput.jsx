import React from "react";

export default function FloatInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  placeholder = " ",
  autoComplete = "off",
  className = "",
}) {
  return (
    <label htmlFor={id} className={`relative block ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="peer w-full rounded border border-gray-300 px-3 pt-5 pb-2 shadow-sm focus:border-blue-600 focus:outline-none sm:text-sm"
      />
      <span className="pointer-events-none absolute left-3 top-1 text-sm text-gray-700 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm px-1">
        {label}
      </span>
    </label>
  );
}
