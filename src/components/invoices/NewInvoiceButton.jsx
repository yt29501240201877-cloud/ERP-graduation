import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import { PlusIcon } from "../common/icons";

function NewInvoiceButton({ onClick }) {
  return (
    <Button variant="primary" icon={<PlusIcon />} onClick={onClick}>
      New Invoice
    </Button>
  );
}

NewInvoiceButton.propTypes = {
  onClick: PropTypes.func,
};

export default NewInvoiceButton;
