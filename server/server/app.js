const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const Director = require('../models/director');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://user:user@atlas-sql-6454f17c1249f9356411a361-e20hk.a.query.mongodb.net/graphql?ssl=true&authSource=admin');

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
