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
    primary: "border-neon-green text-neon-green bg-transparent shadow-[0_0_15px_rgba(74,222,128,0.5)] md:hover:bg-neon-green md:hover:text-slate-950 active:bg-neon-green active:text-slate-950 transition-colors",
    secondary: "border-neon-purple text-neon-purple md:hover:bg-neon-purple md:hover:text-slate-950 md:hover:shadow-[0_0_15px_rgba(216,180,254,0.5)] active:bg-neon-purple active:text-slate-950 active:shadow-[0_0_15px_rgba(216,180,254,0.5)]",
    outline: "border-slate-600 text-slate-400 md:hover:border-slate-300 md:hover:text-white active:border-slate-300 active:text-white"
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