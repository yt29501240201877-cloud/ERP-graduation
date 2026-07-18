import React from "react";
import PropTypes from "prop-types";
import controlStyles from "./inputs.module.css";

function TextArea({ id, value, onChange, placeholder, rows = 5, maxLength }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className={controlStyles.control}
      style={{ resize: "vertical", fontFamily: "inherit" }}
    />
  );
}

TextArea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
};

export default TextArea;
