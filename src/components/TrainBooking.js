import React, { useState, useEffect } from 'react';
import PriorityQueue from '../utils/PriorityQueue';
import SeatTree from '../utils/SeatTree';
import '../styles/TrainBooking.css';

const TrainBooking = () => {
  const [seatTree] = useState(new SeatTree());
  const [priorityQueue] = useState(new PriorityQueue());
  const [seats, setSeats] = useState(new Map());
  const [showForm, setShowForm] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
  });

  useEffect(() => {
    updateSeatsDisplay();
  }, []);

  const updateSeatsDisplay = () => {
    const newSeats = new Map();
    for (let row = 1; row <= 10; row++) {
      const rowSeats = seatTree.rows.get(row);
      newSeats.set(row, rowSeats);
    }
    setSeats(newSeats);
  };

  const handleSeatClick = (type, row) => {
    setSelectedSeat({ type, row });
    setShowForm(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const age = parseInt(formData.age);
    const passenger = { ...formData, age };

    if (age >= 40 && selectedSeat.type !== 'lower') {
      const lowerSeat = seatTree.findAvailableLowerBerth();
      if (lowerSeat) {
        const wantsLower = await showLowerBerthPrompt();
        if (wantsLower) {
          processBooking('lower', lowerSeat.row, passenger);
          return;
        }
      }
    }

    processBooking(selectedSeat.type, selectedSeat.row, passenger);
  };

  const showLowerBerthPrompt = () => {
    return new Promise((resolve) => {
      const result = window.confirm(
        "As you are above 40, a lower berth is recommended and available. Would you like to book the lower berth instead?"
      );
      resolve(result);
    });
  };

  const processBooking = (type, row, passenger) => {
    const booked = seatTree.bookSeat(type, row, passenger);
    if (booked) {
      updateSeatsDisplay();
      alert(`Seat booked successfully! ${type.toUpperCase()} berth, Row ${row}`);
    } else {
      alert('Seat not available!');
    }

    setShowForm(false);
    setFormData({ name: '', age: '', gender: '' });
  };

  return (
    <div className="train-booking">
      <h1>Train Seat Booking System</h1>
      
      <div className="seat-container">
        {['upper', 'middle', 'lower'].map(berthType => (
          <div key={berthType} className="berth-section">
            <h3>{berthType.toUpperCase()} BERTH</h3>
            <div className="row-container">
              {Array.from(seats.entries()).map(([row, rowSeats]) => (
                <div 
                  key={`${berthType}-${row}`}
                  className={`seat ${rowSeats[berthType].isBooked ? 'booked' : ''}`}
                  onClick={() => !rowSeats[berthType].isBooked && handleSeatClick(berthType, row)}
                >
                  <div>Row {row}</div>
                  {rowSeats[berthType].isBooked && (
                    <div className="passenger-info">
                      {rowSeats[berthType].passenger.name}
                      <br />
                      Age: {rowSeats[berthType].passenger.age}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="booking-form">
          <form onSubmit={handleBooking}>
            <div>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
                required
                min="1"
                max="120"
              />
            </div>
            <div>
              <select
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <button type="submit">Book Seat</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TrainBooking; 