class SeatNode {
  constructor(type, number, row) {
    this.type = type;    // upper, middle, or lower
    this.number = number;
    this.row = row;
    this.isBooked = false;
    this.passenger = null;
    this.left = null;    // Previous seat in row
    this.right = null;   // Next seat in row
  }
}

class SeatTree {
  constructor() {
    this.rows = new Map(); // Map to store rows
    this.initialize();
  }

  initialize() {
    // Create 10 rows with 3 seats each (upper, middle, lower)
    for (let row = 1; row <= 10; row++) {
      const upper = new SeatNode('upper', row, row);
      const middle = new SeatNode('middle', row, row);
      const lower = new SeatNode('lower', row, row);

      // Link seats in the same row
      upper.right = middle;
      middle.left = upper;
      middle.right = lower;
      lower.left = middle;

      this.rows.set(row, { upper, middle, lower });
    }
  }

  findAvailableSeat(type, row) {
    const rowSeats = this.rows.get(row);
    if (!rowSeats) return null;
    return !rowSeats[type].isBooked ? rowSeats[type] : null;
  }

  findAvailableLowerBerth() {
    for (let row = 1; row <= 10; row++) {
      const seat = this.findAvailableSeat('lower', row);
      if (seat) return seat;
    }
    return null;
  }

  bookSeat(type, row, passenger) {
    const seat = this.findAvailableSeat(type, row);
    if (seat) {
      seat.isBooked = true;
      seat.passenger = passenger;
      return true;
    }
    return false;
  }

  getAlternativeLowerSeat(row) {
    for (let i = 1; i <= 10; i++) {
      if (i !== row) {
        const seat = this.findAvailableSeat('lower', i);
        if (seat) return seat;
      }
    }
    return null;
  }
}

export default SeatTree; 