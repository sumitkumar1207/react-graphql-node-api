// Load auth resolvers
const authResolvers = require('./auth');

// Load events resolvers
const eventsResolvers = require('./events');

// Load booking resolvers
const bookingResolvers = require('./booking');

const rootResolver = {
  ...authResolvers,
  ...bookingResolvers,
  ...eventsResolvers
}

module.exports = rootResolver