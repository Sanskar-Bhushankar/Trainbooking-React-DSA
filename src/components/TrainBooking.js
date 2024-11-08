import React, { useState, useEffect } from 'react';
import PriorityQueue from '../utils/PriorityQueue';
import '../styles/TrainBooking.css';
import coachImage from '../assets/coach-image.webp';
import trackImage from '../assets/track-image.png';

const BookingModal = ({ onSubmit, onCancel, selectedSeat, formData, setFormData }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Book Your Seat</h2>
      </div>
      
      <div className="selected-seat-info">
        Selected: {selectedSeat.berthType.toUpperCase()} Berth - Section {selectedSeat.section}
      </div>

      <form className="booking-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Passenger Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={formData.age}
            onChange={e => setFormData({...formData, age: e.target.value})}
            required
            min="1"
            max="120"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
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

        <div className="button-group">
          <button type="submit">Confirm Booking</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
);

// eslint-disable-next-line
const TrainBooking = () => {
  // eslint-disable-next-line
  const [priorityQueue] = useState(new PriorityQueue());
  
  const createCoachSeats = () => {
    const sections = {};
    for (let i = 0; i < 21; i += 3) {
      const sectionKey = `${i}-${Math.min(i + 2, 20)}`;
      sections[sectionKey] = { upper: null, middle: null, lower: null };
    }
    return sections;
  };

  const [activeCoach, setActiveCoach] = useState(null);
  const [seats, setSeats] = useState({
    'A1': createCoachSeats(),
    'A2': createCoachSeats(),
    'A3': createCoachSeats(),
    'A4': createCoachSeats(),
    'A5': createCoachSeats()
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Initialize any necessary state
  }, []);

  const handleCoachClick = (coachId) => {
    setActiveCoach(activeCoach === coachId ? null : coachId);
    setShowForm(false);
    setSelectedSeat(null);
  };

  const handleSeatClick = (section, berthType) => {
    setSelectedSeat({ section, berthType });
    setShowForm(true);
  };

  const findAvailableLowerBerth = () => {
    // Check all coaches for available lower berths
    for (const coachId of Object.keys(seats)) {
      if (coachId === activeCoach) continue; // Skip current coach
      
      // Check each section in the coach
      for (const [section, berths] of Object.entries(seats[coachId])) {
        if (!berths.lower) {
          return { coachId, section };
        }
      }
    }
    return null;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const age = parseInt(formData.age);
    const passenger = { ...formData, age };

    if (age >= 40 && selectedSeat.berthType !== 'lower') {
      priorityQueue.enqueue(passenger);
      
      // First check current coach
      const availableLowerSection = Object.keys(seats[activeCoach]).find(
        section => !seats[activeCoach][section].lower
      );

      if (availableLowerSection) {
        const wantsLower = window.confirm(
          'A lower berth is available in the current coach. Would you like to book the lower berth instead?'
        );
        
        if (wantsLower) {
          selectedSeat.berthType = 'lower';
          selectedSeat.section = availableLowerSection;
        }
      } else {
        // Check other coaches
        const availableInOtherCoach = findAvailableLowerBerth();
        
        if (availableInOtherCoach) {
          const wantsOtherCoach = window.confirm(
            `A lower berth is available in Coach ${availableInOtherCoach.coachId}, Section ${availableInOtherCoach.section}. Would you like to book that instead?`
          );

          if (wantsOtherCoach) {
            // Book in the other coach
            setSeats(prevSeats => ({
              ...prevSeats,
              [availableInOtherCoach.coachId]: {
                ...prevSeats[availableInOtherCoach.coachId],
                [availableInOtherCoach.section]: {
                  ...prevSeats[availableInOtherCoach.coachId][availableInOtherCoach.section],
                  lower: passenger
                }
              }
            }));
            setShowForm(false);
            setFormData({ name: '', age: '', gender: '' });
            return; // Exit the function as we've already booked
          }
        }
      }
    }

    // Book in the originally selected seat if no other options were chosen
    setSeats(prevSeats => ({
      ...prevSeats,
      [activeCoach]: {
        ...prevSeats[activeCoach],
        [selectedSeat.section]: {
          ...prevSeats[activeCoach][selectedSeat.section],
          [selectedSeat.berthType]: passenger
        }
      }
    }));

    setShowForm(false);
    setFormData({ name: '', age: '', gender: '' });
  };

  return (
    <div className="train-booking">
      <h1>Train Seat Booking System</h1>
      
      <div className="train-container">
        <div className="train-display">
          {Object.keys(seats).map((coachId) => (
            <div
              key={coachId}
              className={`coach-button ${activeCoach === coachId ? 'active' : ''}`}
              onClick={() => handleCoachClick(coachId)}
            >
              <img src={coachImage} alt={`Coach ${coachId}`} className="coach-image" />
              <div className="coach-label">Coach {coachId}</div>
            </div>
          ))}
        </div>
        <div className="track-container">
          <img src={trackImage} alt="Railway Track" className="track-image" />
        </div>
      </div>

      {activeCoach && (
        <div>
          <h2 className="coach-title">Coach {activeCoach}</h2>
          <div className="compartments-container">
            {Object.entries(seats[activeCoach]).map(([section, berths]) => (
              <div key={section} className="compartment-section">
                <div className="section-title">{activeCoach} ({section})</div>
                <div className="berth-container">
                  {['upper', 'middle', 'lower'].map(berthType => (
                    <div
                      key={berthType}
                      className={`seat-box ${berths[berthType] ? 'booked' : ''}`}
                      onClick={() => !berths[berthType] && handleSeatClick(section, berthType)}
                    >
                      {berths[berthType] ? (
                        <div className="passenger-info">
                          {berths[berthType].name}<br />
                          Age: {berths[berthType].age}
                        </div>
                      ) : (
                        berthType
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && selectedSeat && (
        <BookingModal
          onSubmit={handleBooking}
          onCancel={() => {
            setShowForm(false);
            setFormData({ name: '', age: '', gender: '' });
          }}
          selectedSeat={selectedSeat}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
};

export default TrainBooking; 