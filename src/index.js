// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const { isConnected, NotesCollection, Notes } = require('./db');

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.post('/collections', async (request, reply) => {
  const { name } = request.body;
  const newCollection = new NotesCollection({ name });
  await newCollection.save();

  return newCollection.toObject();
});
fastify.get('/collections', async (request, reply) => {
  const collections = NotesCollection.find().lean();
  return collections;
});

fastify.post('/collections/:id/notes', async (request, reply) => {
  const { id } = request.params;
  const { name, body } = request.body;
  const newNote = new Notes({ name, body, group: id });
  await newNote.save();
  return newNote.toObject();
});
fastify.get('/collections/:id/notes', async (request, reply) => {
  const { id } = request.params;
  const notes = Notes.find({ group: id }).lean();
  return notes;
});

// Run the server!
const start = async () => {
  try {
    await isConnected;
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

module.exports = start;
