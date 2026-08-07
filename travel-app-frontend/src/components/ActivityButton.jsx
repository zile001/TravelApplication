import React from "react";

const ActivityButton = ({ planId, activitiesCount, onClick }) => {
  return (
    <button onClick={() => onClick(planId)}>
      Aktivnosti ({activitiesCount || 0})
    </button>
  );
};

export default ActivityButton;
