"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
}

export default function Button({ variant, children, ...props } : ButtonProps) {
  const baseStyles = "font-bold py-2 px-4 rounded";
  const primaryStyles = "text-white border border-blue-900 bg-blue-900 hover:bg-blue-700";
  const secondaryStyles = "text-blue-900 border border-blue-500 hover:bg-gray-700";
  return (
    <button className={`${baseStyles} ${variant === "primary" ? primaryStyles : secondaryStyles}`} {...props}>
      {children}
    </button>
  );
}