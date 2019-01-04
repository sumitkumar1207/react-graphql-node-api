const express = require('express');
const bodyParser = require('body-parser');

//Initialize app to express
const app = express();

//BodyParser middleware
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('Hello World!');
})

//Creating port
const PORT = process.env.PORT || 5505;

app.listen(PORT, console.log(`Server is started on port ${PORT}`));