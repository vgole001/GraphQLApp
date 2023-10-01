const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const _ = require('lodash');

const books = [
    {
      "id": "1",
      "name": "The Lord of the Rings: The Fellowship of the Ring",
      "genre": "Fantasy",
      "authorId":"1"
    },
    {
      "id": "2",
      "name": "Harry Potter and the Sorcerer's Stone",
      "genre": "Fantasy",
      "authorId":"2"
    },
    {
        "id": "2",
        "name": "Hello",
        "genre": "Lala land",
        "authorId":"2"
    },
    {
      "id": "3",
      "name": "The Hitchhiker's Guide to the Galaxy",
      "genre": "Science Fiction",
      "authorId":"3"
    }
  ];

  const authors = [
    {
      "id": "1",
      "name": "Patric Winston",
      "age": "55"
    },
    {
      "id": "2",
      "name": "Jim Foster",
      "age": "22"
    },
    {
      "id": "3",
      "name": "Mike Tyson",
      "age": "55"
    }
  ];

const BookType = new GraphQLObjectType({
    name:'Book',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        genre: { type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                return _.find(authors, {id: parent.authorId})
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        age: { type: GraphQLInt},
        book:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, { authorId: parent.id })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(books, { id:args.id});
                // code to get data from db / other source
            }
        },
        author:{
            type: AuthorType,
            args: { id: { type: GraphQLID}},
            resolve(parent, args){
                return _.find(authors, { id: args.id})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})