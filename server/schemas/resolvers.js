const { UserInputError, AuthenticationError } = require("apollo-server-express");
const { User, Book } = require('../models');

const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('__v -password')

                return userData;
            }
            throw new AuthenticationError('Uh oh! Not logged in');
        }
    },
    Mutation: {
        addUser: async (_parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        }
    }
};

module.exports = resolvers;