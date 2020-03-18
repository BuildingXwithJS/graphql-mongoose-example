// Require the framework and instantiate it
const { ApolloServer, gql } = require('apollo-server-fastify');
const fastify = require('fastify')({ logger: true });
const { isConnected } = require('./db');
const graphqlSchema = require('./graphql');

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// Run the server!
const start = async () => {
  try {
    // create graphql server
    const gqlServer = new ApolloServer({
      schema: graphqlSchema
    });

    await isConnected;
    await fastify.register(gqlServer.createHandler()).listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

module.exports = start;
