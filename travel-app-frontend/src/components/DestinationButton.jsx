import React from "react";

const DestinationButton = ({ planId, destinationsCount, onClick }) => {
  return (
    <button onClick={() => onClick(planId)}>
      Destinacije ({destinationsCount || 0})
    </button>
  );
};

export default DestinationButton;
