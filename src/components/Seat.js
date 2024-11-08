import React from 'react';

const Seat = ({ type, number, isBooked, onClick }) => {
  return (
    <div 
      className={`seat ${isBooked ? 'booked' : 'available'}`}
      onClick={() => !isBooked && onClick()}
    >
      <span>{type}-{number}</span>
    </div>
  );
};

export default Seat; 