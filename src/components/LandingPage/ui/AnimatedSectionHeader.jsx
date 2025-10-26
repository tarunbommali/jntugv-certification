/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

// Default animation configurations
const defaultAnimations = {
  container: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  badge: {
    initial: { scale: 0 },
    whileInView: { scale: 1 },
    transition: { delay: 0.2, type: "spring" },
  },
};

// Default styling classes
const defaultClasses = {
  alignment: {
    center: "text-center",
    left: "text-left",
    right: "text-right",
  },
  maxWidth: {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  },
};

const AnimatedSectionHeader = ({
  // Content
  badge = null,
  title = "",
  description = "",

  // Layout
  alignment = "center",
  maxWidth = "3xl",
  className = "text-center mb-16 relative z-10",

  // Title
  titleAs: TitleComponent = "h2",
  titleClassName = "text-xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-primary mb-4",

  // Description
  descriptionClassName = "text-lg text-muted-foreground",

  // Badge
  badgeClassName = "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-secondary mb-4",

  // Animations - can override defaults
  containerAnimation = {},
  badgeAnimation = {},

  // Additional props - CHANGED: once: false to trigger every time
  viewport = { once: false, amount: 0.3 },
  children,
  ...props
}) => {
  // Merge default animations with custom ones
  const containerAnim = {
    ...defaultAnimations.container,
    ...containerAnimation,
  };
  const badgeAnim = { ...defaultAnimations.badge, ...badgeAnimation };

  const BadgeIcon = badge?.icon;

  return (
    <motion.div
      {...containerAnim}
      viewport={viewport}
      className={`
        ${defaultClasses.alignment[alignment]} 
        ${className} 
        relative z-10 mb-16
      `}
      {...props}
    >
      {/* Badge */}
      {badge && (
        <motion.div
          {...badgeAnim}
          viewport={viewport}
          className={badgeClassName}
        >
          {BadgeIcon && <BadgeIcon className="h-4 w-4" />}
          <span className="text-sm font-medium">{badge.text}</span>
        </motion.div>
      )}

      {/* Title */}
      {title && (
        <TitleComponent className={titleClassName}>{title}</TitleComponent>
      )}

      {/* Description */}
      {description && (
        <p
          className={`
          ${descriptionClassName} 
          ${defaultClasses.maxWidth[maxWidth]} 
          ${alignment === "center" ? "mx-auto" : ""}
        `}
        >
          {description}
        </p>
      )}

      {/* Additional Content */}
      {children}
    </motion.div>
  );
};

export default AnimatedSectionHeader;