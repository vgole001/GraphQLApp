const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema/schema'); // Import the schema from the schema.js file
const mongoose = require('mongoose')
const config = require('./utils/config')

const app = express();

async function startApolloServer() {

    mongoose.connect(config.MONGODB_URI)
        .then(() => {
        console.log('Successfully connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB:', error.message)
    })

  const server = new ApolloServer({
    schema, // Use the imported schema
  });

  await server.start(); // Ensure that the Apollo Server is started before applying middleware

  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
  });
}

startApolloServer();