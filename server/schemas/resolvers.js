const { UserInputError, AuthenticationError } = require("apollo-server-express");
const { User } = require('../models');

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
    }
};

module.exports = resolvers;