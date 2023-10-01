const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author')
const _ = require('lodash');

const BookType = new GraphQLObjectType({
    name:'Book',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        genre: { type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                //return _.find(authors, {id: parent.authorId})
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
                //return _.filter(books, { authorId: parent.id })
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
                //return _.find(books, { id:args.id});
                // code to get data from db / other source
            }
        },
        author:{
            type: AuthorType,
            args: { id: { type: GraphQLID}},
            resolve(parent, args){
                //return _.find(authors, { id: args.id})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                const author = new Author({
                    name: args.name,
                    age: args.age
                });

                try {
                    // Save the author to the database and wait for the operation to complete.
                    const savedAuthor = await author.save();

                    // Return the saved author.
                    return savedAuthor;
                } catch (error) {
                    // Handle any errors that occur during the save operation.
                    // You might want to log the error or return an appropriate error response.
                    throw new Error('Failed to add author: ' + error.message);
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})