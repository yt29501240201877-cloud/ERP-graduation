import React from "react";
import PropTypes from "prop-types";
import { BankIcon, CheckPaymentIcon, GlobeIcon } from "../common/icons";
import styles from "./PaymentMethod.module.css";

const METHOD_CONFIG = {
  bank_transfer: { label: "Bank Transfer", icon: BankIcon },
  check: { label: "Check", icon: CheckPaymentIcon },
  online: { label: "Online", icon: GlobeIcon },
};

function PaymentMethod({ method }) {
  const config = METHOD_CONFIG[method] || { label: method, icon: GlobeIcon };
  const Icon = config.icon;

  return (
    <span className={styles.method}>
      <Icon />
      {config.label}
    </span>
  );
}

PaymentMethod.propTypes = {
  method: PropTypes.oneOf(["bank_transfer", "check", "online"]).isRequired,
};

export default PaymentMethod;
