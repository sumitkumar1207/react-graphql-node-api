const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

//Load Event model
const Event = require('./models/Event')

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

  input EventInput{
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type RootQuery{
    events: [Event!]!
  }

  type RootMutation{
    createEvent(eventInput: EventInput): Event
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
        date: new Date(args.eventInput.date)
      });
      return event.save().then(result => {
        return { ...result._doc };
      }).catch(err => {
        console.log(err)
        throw err
      }
      );
    }
  },
  graphiql: true
})
)
app.get('/', (req, res, next) => {
  res.send('Hello World!');
})

//Connect to DB
mongoose.connect(db, { useNewUrlParser: true }).then(console.log("MongoDb connected..")).catch(err => console.log(err))

//Creating port
const PORT = process.env.PORT || 5505;

//Connect to server
app.listen(PORT, console.log(`Server is started on port ${PORT}`));
