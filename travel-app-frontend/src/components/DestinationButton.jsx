import React from "react";
import "../styles/ActionButton.css";
const DestinationButton = ({ planId, count, onClick }) => {
  return (
    <button className="action-btn" onClick={() => onClick(planId)}>
      Destinacije <span className="action-btn-badge">{count || 0}</span>
    </button>
  );
};

export default DestinationButton;
