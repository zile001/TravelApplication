import React from "react";

const DestinationButton = ({ planId, count, onClick }) => {
  return (
    <button onClick={() => onClick(planId)}>Destinacije ({count || 0})</button>
  );
};

export default DestinationButton;
