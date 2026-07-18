import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./FileDropzone.module.css";

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 16V4m0 0l-4 4m4-4l4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * Generic drag-and-drop / click-to-browse upload area. Accepts a
 * single file and reports it upward via `onFileSelect`; the caller
 * decides what to do with it (attach to a form, upload immediately,
 * etc.).
 */
function FileDropzone({ label = "Upload file", hint = "Drag and drop or click to browse", accept, onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setFileName(file.name);
    onFileSelect?.(file);
  };

  return (
    <div
      className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={styles.hiddenInput}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <UploadIcon />
      <span className={styles.label}>{fileName || label}</span>
      {!fileName && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

FileDropzone.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  accept: PropTypes.string,
  onFileSelect: PropTypes.func,
};

export default FileDropzone;
