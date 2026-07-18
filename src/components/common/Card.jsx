import React from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.css";

/**
 * Plain white bordered surface. Used as the base for stat cards and
 * the invoice table panel so both share the same border/radius/shadow.
 */
function Card({ children, className = "", noPadding = false }) {
  const classNames = [styles.card, noPadding ? styles.noPadding : "", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classNames}>{children}</div>;
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
};

export default Card;
