const { UserInputError, AuthenticationError } = require("apollo-server-express");
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

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
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Oops incorrect credentials');
            }

            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError('Oops incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (_parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                );

                return updatedUser;
            }
            throw new AuthenticationError('Uh oh! Not logged in!');
        },
        removeBook: async (_parent, { bookId }, context) => {

            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('Uh oh! Not logged in!');
        }
    }
};

module.exports = resolvers;