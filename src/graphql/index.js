const { composeWithMongoose } = require('graphql-compose-mongoose/node8');
const { schemaComposer } = require('graphql-compose');
const { Notes, NotesCollection } = require('../db');

// CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const NotesCollectionTC = composeWithMongoose(
  NotesCollection,
  customizationOptions
);

// Add needed CRUD Notes Collection operations to the GraphQL Schema
// via graphql-compose it will be much much easier, with less typing
schemaComposer.Query.addFields({
  collectionById: NotesCollectionTC.getResolver('findById'),
  collectionByIds: NotesCollectionTC.getResolver('findByIds'),
  collection: NotesCollectionTC.getResolver('findOne'),
  collections: NotesCollectionTC.getResolver('findMany'),
  collectionCount: NotesCollectionTC.getResolver('count'),
  collectionConnection: NotesCollectionTC.getResolver('connection'),
  collectionPagination: NotesCollectionTC.getResolver('pagination')
});
schemaComposer.Mutation.addFields({
  collectionCreateOne: NotesCollectionTC.getResolver('createOne'),
  collectionUpdateById: NotesCollectionTC.getResolver('updateById'),
  collectionRemoveById: NotesCollectionTC.getResolver('removeById')
});

// same setup for notes
const NotesTC = composeWithMongoose(Notes, customizationOptions);
schemaComposer.Query.addFields({
  noteById: NotesTC.getResolver('findById'),
  noteByIds: NotesTC.getResolver('findByIds'),
  note: NotesTC.getResolver('findOne'),
  notes: NotesTC.getResolver('findMany'),
  noteCount: NotesTC.getResolver('count'),
  noteConnection: NotesTC.getResolver('connection'),
  notePagination: NotesTC.getResolver('pagination')
});
schemaComposer.Mutation.addFields({
  noteCreateOne: NotesTC.getResolver('createOne'),
  noteUpdateById: NotesTC.getResolver('updateById'),
  noteRemoveById: NotesTC.getResolver('removeById')
});

// define relation between notes and collections
NotesTC.addRelation('collection', {
  resolver: () => NotesCollectionTC.getResolver('findById'),
  prepareArgs: {
    _id: source => source.group
  },
  projection: { group: 1 }
});
// define relation between collection and notes
NotesCollectionTC.addRelation('notes', {
  resolver: () => NotesTC.getResolver('findMany'),
  prepareArgs: {
    group: source => source._id
  },
  projection: { _id: 1 }
});

const graphqlSchema = schemaComposer.buildSchema();
module.exports = graphqlSchema;
