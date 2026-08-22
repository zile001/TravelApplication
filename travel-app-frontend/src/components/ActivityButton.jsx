import React from "react";
import "../styles/ActionButton.css";
const ActivityButton = ({ planId, count, onClick }) => {
  return (
    <button className="action-btn" onClick={() => onClick(planId)}>
      Aktivnosti <span className="action-btn-badge">{count || 0}</span>
    </button>
  );
};

export default ActivityButton;
