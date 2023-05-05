const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema , GraphQLID, GraphQLInt } = graphql;

const movies = [
  { id: 1, name: 'film1', genre: 'Crime', directorId: 1},
  { id: 2, name: 'film2', genre: 'Horror', directorId: 2},
  { id: 3, name: 'film3', genre: 'Cartoon', directorId: 3},
  { id: 4, name: 'film4', genre: 'Thriller', directorId: 4},
]

const directors = [
  { id: 1, name: 'director 1', age: 51 },
  { id: 2, name: 'director 2', age: 52 },
  { id: 3, name: 'director 3', age: 53 },
  { id: 4, name: 'director 4', age: 54 },
]

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return directors.find( director => director.id == parent.id);
      }
    }
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return movies.find(movie => movie.id == args.id);
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return directors.find( director => director.id == args.id);
      }
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
});

// //query
// query($id: ID) {
//   movie(id: $id) {
//     id
//     name
//     genre
//     director {
//       name
//       age
//     }
//   }
// }
// //vars
// {
//   "id": "3"
// }