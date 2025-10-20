import React from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';

const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line no-unused-vars
    const { colors } = useTheme();

    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium theme-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "btn-primary",
      secondary: "bg-surface text-textHigh hover:bg-hover border border-border",
      outline:
        "border border-primary text-primary hover:bg-primary hover:text-white",
      ghost: "text-textHigh hover:bg-hover",
      link: "underline-offset-4 hover:underline text-primary",
      destructive: "btn-error",
      success: "btn-success",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    };

    const classes = cn(baseClasses, variants[variant], sizes[size], className);

    // If asChild is true, render the single child element and merge classes/props
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(classes, children.props.className),
        ref,
        ...props,
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
