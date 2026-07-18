import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

/**
 * Generic button used everywhere in the app (Export CSV, New Invoice,
 * Filter, pagination arrows...). Variant controls color treatment;
 * everything else about sizing/spacing stays consistent.
 */
function Button({
  children,
  icon,
  variant = "secondary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
  className = "",
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "secondary", "ghost"]),
  size: PropTypes.oneOf(["sm", "md"]),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
