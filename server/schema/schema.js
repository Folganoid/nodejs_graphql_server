const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema , GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const Movie = require('../models/movie');
const Director = require('../models/director');

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return Director.findById(parent.directorId);
      }
    }
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
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
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
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
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
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
		},
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Director.findByIdAndRemove(args.id);
      }
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movie.findByIdAndRemove(args.id);
      }
    },
    updateDirector: {
			type: DirectorType,
			args: {
        id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				return Director.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true },
        );
			},
		},
    updateMovie: {
			type: MovieType,
			args: {
        id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
			},
			resolve(parent, args) {
				return Movie.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, genre: args.genre, directorId: args.directorId } },
          { new: true },
        );
			},
		},
	}
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movie.findById(args.id);
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Director.findById(args.id);
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({});
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
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

// // mutations
// // create
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

// mutation($name: String, $age: Int) {
//   addDirector(name: $name, age: $age) {
//     name
//     age
//   }
// }
// {
//   "name": "Test",
//   "genre": "sdfsdf",
//   "directorId": 2
// }

// // delete
// mutation($id: ID) {
// 	deleteMovie(id: $id) {
// 		name
// 	}
// }
// {
// 	"id": "64580fb63f8012cb1915b41a"
// }

// //update
// mutation($id: ID, $name: String!, $age: Int!) {
// 	updateDirector(id: $id, name: $name, age: $age) {
// 		name
// 		age
// 	}
// }
// {
// 	"id": "6458109c2e8a9dd7b3abbeec",
// 	"name": "11111111",
// 	"age": 100
// }

