const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load Event model
const Event = require('./models/Event')

//Load User model
const User = require('./models/User')

//Initialize app to express
const app = express();

//DB config
const db = require('./config/keys').mongoURI

//BodyParser middleware
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
  type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type User{
    _id: ID!
    email: String!
    password: String
  }

  input EventInput{
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input UserInput{
    email: String!
    password: String!
  }

  type RootQuery{
    events: [Event!]!
  }

  type RootMutation{
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
  }

  schema{
    query: RootQuery
    mutation: RootMutation
  }
  `),
  rootValue: {
    events: () => {
      return Event.find().then(events => {
        return events.map(event => {
          return { ...event._doc, _id: event._doc._id.toString() }
        })
      }).catch(err => { throw err })
    },
    createEvent: args => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5c38cbed5f357410161376ad'
      });

      let createdEvent;
      return event.save()
        .then(result => {
          createdEvent = { ...result._doc, _id: result._doc._id.toString() };
          return User.findById('5c38cbed5f357410161376ad');
        })
        .then(user => {
          if (!user) {
            throw new Error("User not found with this is id")
          }
          user.createdEvents.push(event);
          return user.save();
        })
        .then(result => {
          return createdEvent
        })
        .catch(err => {
          console.log(err)
          throw err
        }
        );
    },
    createUser: args => {

      //Checking for user
      return User.findOne({ email: args.userInput.email })
        .then(user => {

          //if user exists
          if (user) {
            throw new Error('Email already exists with this email');
          }

          //Convert plain password to hashed
          return bcrypt.hash(args.userInput.password, 12);
        })
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });

          //Save user to db
          return user.save();
        })
        .then(result => {
          return { ...result._doc, password: null, _id: result.id };
        })
        .catch(err => { throw err });
    }
  },
  graphiql: true
})
);

app.get('/', (req, res, next) => {
  res.send('Hello World!');
})

//Connect to DB
mongoose.connect(db, { useNewUrlParser: true }).then(console.log("MongoDb connected..")).catch(err => console.log(err))

//Creating port
const PORT = process.env.PORT || 5500;

//Connect to server
app.listen(PORT, console.log(`Server is started on port ${PORT}`));
