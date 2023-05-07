const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const Director = require('../models/director');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://root:password@localhost:27017/local?authSource=admin', {useNewUrlParser: true});

app.use('/', graphqlHTTP({
  schema,
  graphiql: true,
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB is OK'));

app.listen(PORT, err => {
  err ? console.log(error) : console.log('Server started!');
});
