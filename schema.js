const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require("graphql");

//Launch type
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: {type: GraphQLBoolean},
    rocket: { type: RocketType}
  }),
});

//Rocket type
const RocketType = new GraphQLObjectType({
    name: "Rocket",
    fields: () => ({
      rocket_id: { type: GraphQLString },
      rocket_name: { type: GraphQLString },
      rocket_type: { type: GraphQLString }
    }),
  });

  //Root Query
  const RootQuery = new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
          launches: {
            type: new GraphQLList(LaunchType),
            async resolve(parent, args) {
                const list = await axios.get('https://api.spacexdata.com/v3/launches');
                return list.data;
            }
          },
          launch: {
              type: LaunchType,
              args: {
                  flight_number: { type: GraphQLInt }
              },
              async resolve(parent, args) {
                  const launch = await axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`);
                  return launch.data;
              }
          },
          rockets: {
            type: new GraphQLList(RocketType),
            async resolve(parent, args) {
                const list = await axios.get('https://api.spacexdata.com/v3/rockets');
                return list.data;
            }
          },
          rocket: {
              type: RocketType,
              args: {
                  id: { type: GraphQLString }
              },
              async resolve(parent, args) {
                  const rocket = await axios.get(`https://api.spacexdata.com/v3/rockets/${args.id}`);
                  return rocket.data;
              }
          }
      }
  })

  module.exports = new GraphQLSchema({
      query: RootQuery
  })