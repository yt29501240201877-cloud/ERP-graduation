import React from "react";
import PropTypes from "prop-types";
import Button from "../../common/Button";
import styles from "./WizardFooter.module.css";

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

function WizardFooter({ onCancel, onSaveDraft, onSubmit, isSubmitting = false }) {
  return (
    <div className={styles.footer}>
      <button type="button" className={styles.cancelLink} onClick={onCancel}>
        Cancel
      </button>
      <div className={styles.rightActions}>
        <Button variant="secondary" onClick={onSaveDraft}>
          Save as Draft
        </Button>
        <Button variant="primary" icon={<SendIcon />} onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit for Approval"}
        </Button>
      </div>
    </div>
  );
}

WizardFooter.propTypes = {
  onCancel: PropTypes.func,
  onSaveDraft: PropTypes.func,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

export default WizardFooter;
