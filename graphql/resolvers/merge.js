// Load Event model 
const Event = require('../../models/Event');

// Load User model 
const User = require('../../models/User');

const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};
const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: new dateToString(booking._doc.createdAt),
    updatedAt: new dateToString(booking._doc.updatedAt)
  }
}

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event._id,
    date: new dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  }
}

exports.transformEvent = transformEvent
exports.transformBooking = transformBooking

// exports.user = user
// exports.event = event
// exports.singleEvent = singleEvent