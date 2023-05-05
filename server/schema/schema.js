const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema , GraphQLID } = graphql;

const data = [
  { id: 1, name: 'film1', genre: 'Crime'},
  { id: 2, name: 'film2', genre: 'Horror'},
  { id: 3, name: 'film3', genre: 'Cartoon'},
  { id: 4, name: 'film4', genre: 'Thriller'},
]

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return data.find(movie => movie.id == args.id);
      }
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
});

// //query
// query($id: String) {
//   movie(id: $id) {
//     id
//     name
//   }
// }
// //vars
// {
//   "id": "3"
// }