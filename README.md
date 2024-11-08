# Train Seat Booking System 🚂

A React-based train seat booking system that simulates Indian Railways' booking process with intelligent seat allocation and elderly passenger priority.

## Features 🌟

- **Interactive Train Visualization**: Visual representation of train coaches with real-time seat availability
- **Smart Seat Allocation**: Prioritizes lower berths for elderly passengers (age >= 40)
- **Multi-Coach Management**: Handles booking across multiple coaches
- **Age-based Priority System**: Suggests alternative lower berths in other coaches for elderly passengers

## Technical Implementation 🛠️

### Priority Queue Implementation
The system uses a Priority Queue to handle elderly passenger bookings:
- Passengers aged 40 and above get higher priority
- When a non-lower berth is selected by an elderly passenger:
  1. Checks current coach for available lower berths
  2. If not found, searches other coaches
  3. Suggests available lower berths to the passenger
  4. Maintains queue based on age priority

## User Interface 🎨

- Clean and intuitive design
- Visual coach selection
- Real-time seat availability updates
- Interactive booking modal
- Clear status indicators

## How It Works 🔄

1. **Coach Selection**
   - Click on any coach to view its seat layout
   - Visual indicators show available and booked seats

2. **Booking Process**
   - Select an available seat
   - Enter passenger details
   - System checks age for berth allocation
   - Suggests alternatives if better options available

3. **Priority Handling**
   - Elderly passengers (≥40 years) get priority for lower berths
   - System automatically searches all coaches for suitable seats
   - Option to accept or decline alternative suggestions

## Technical Stack 💻

- React.js
- CSS3
- Priority Queue Data Structure
- Binary Tree Data Structure
- JavaScript ES6+

## Future Enhancements 🚀

- [ ] Add waitlist functionality
- [ ] Implement seat swapping
- [ ] Include cancellation feature
- [ ] Add print ticket functionality


