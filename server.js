const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');


const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
//Initialize app to express
const app = express();

//DB config
const db = require('./config/keys').mongoURI

//BodyParser middleware
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
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
