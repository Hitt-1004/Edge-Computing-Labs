const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Define GraphQL schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Define resolver functions
const root = {
  hello: () => 'Hello, GraphQL!'
};

// Create an Express application
const app = express();

// Set up the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true // Enable GraphiQL for testing the API in the browser
}));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GraphQL server is running on http://localhost:${PORT}/graphql`);
});