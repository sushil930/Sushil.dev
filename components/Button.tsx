import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-pixel uppercase tracking-wider transition-all duration-300 ease-in-out border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  const variants = {
    primary: "border-neon-green text-neon-green bg-transparent shadow-[0_0_15px_rgba(74,222,128,0.5)]",
    secondary: "border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-slate-950 hover:shadow-[0_0_15px_rgba(216,180,254,0.5)]",
    outline: "border-slate-600 text-slate-400 hover:border-slate-300 hover:text-white"
  };

  const sizes = {
    sm: "text-[10px] px-3 py-1.5",
    md: "text-xs px-6 py-3",
    lg: "text-sm px-8 py-4"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;