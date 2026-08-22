import React from "react";
import "../styles/ActionButton.css";
const FinanceButton = ({ planId, onClick }) => {
  return (
    <button className="action-btn" onClick={() => onClick(planId)}>
      Finansije
    </button>
  );
};

export default FinanceButton;
