const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema , GraphQLID, GraphQLInt, GraphQLList } = graphql;
const Movie = require('../models/movie');
const Director = require('../models/director');

// const movies = [
//   { id: 1, name: 'film1', genre: 'Crime', directorId: 1},
//   { id: 1, name: 'film11', genre: 'Crime', directorId: 1},
//   { id: 1, name: 'film12', genre: 'Crime', directorId: 1},
//   { id: 2, name: 'film2', genre: 'Horror', directorId: 2},
//   { id: 2, name: 'film21', genre: 'Horror', directorId: 2},
//   { id: 2, name: 'film22', genre: 'Horror', directorId: 2},
//   { id: 3, name: 'film3', genre: 'Cartoon', directorId: 3},
//   { id: 2, name: 'film31', genre: 'Horror', directorId: 3},
//   { id: 4, name: 'film4', genre: 'Thriller', directorId: 4},
// ]

// const directors = [
//   { id: 1, name: 'director 1', age: 51 },
//   { id: 2, name: 'director 2', age: 52 },
//   { id: 3, name: 'director 3', age: 53 },
//   { id: 4, name: 'director 4', age: 54 },
// ]

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        // return directors.find( director => director.id == parent.id);
        return Director.findById(parent.directorId);
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
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies.filter(movie => movie.directorId === parent.id);
        return Movie.find({directorId: parent.id});
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addDirector: {
			type: DirectorType,
			args: {
				name: { type: GraphQLString },
				age: { type: GraphQLInt },
			},
			resolve(parent, args) {
				const director = new Director({
					name: args.name,
					age: args.age,
				});
				return director.save();
			},
		},
		addMovie: {
			type: MovieType,
			args: {
				name: { type: GraphQLString },
				genre: { type: GraphQLString },
				directorId: { type: GraphQLID },
			},
			resolve(parent, args) {
				const movie = new Movie({
					name: args.name,
					genre: args.genre,
					directorId: args.directorId,
				});
				return movie.save();
			},
		}
	}
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return movies.find(movie => movie.id == args.id);
        return Movie.findById(args.id);
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return directors.find( director => director.id == args.id);
        return Director.findById(args.id);
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies;
        return Movie.find({});
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        // return directors;
        return Director.find({});
      }
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

// //query
// query($id: ID) {
//   movie(id: $id) {
//     id
//     name
//     director{
//       id
//       name
//       age
//     }
//   }
// }
// //vars
// {
//   "id": "6454f8195a30fba7f54cc49f"
// }

// query{
//   movies {
//     id
//     name
//     director{
//       id
//       name
//       age
//     }
//   }
// }

// mutations
// mutation($name: String, $age: Int) {
//   addDirector(name: $name, age: $age) {
//     name
//     age
//   }
// }

// {
//   "name": "Clint Eastwood",
//   "age": 100
// }