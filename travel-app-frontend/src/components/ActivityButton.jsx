import React from "react";

const ActivityButton = ({ planId, count, onClick }) => {
  return (
    <button onClick={() => onClick(planId)}>Aktivnosti ({count || 0})</button>
  );
};

export default ActivityButton;
