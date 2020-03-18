const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/graphqlexample', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// define notes collection
const notesCollectionSchema = new mongoose.Schema({
  name: String
});
const NotesCollection = mongoose.model(
  'NotesCollection',
  notesCollectionSchema
);

// notes
const notesSchema = new mongoose.Schema({
  name: String,
  body: String,
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'NotesCollection' }
});
const Notes = mongoose.model('Notes', notesSchema);

exports.isConnected = new Promise(resolve => db.once('open', resolve));
exports.NotesCollection = NotesCollection;
exports.Notes = Notes;
