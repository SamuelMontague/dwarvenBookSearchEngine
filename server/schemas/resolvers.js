const { User } = require('../models')
const { AuthenticationError} = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
      user: async (parent, args, context) => {
          if(context.user) {
              const userData = await User.findOne({ _id: context.user._id })
              .select('-password')
              return userData;
          }
          throw new AuthenticationError('you aint logged in')
        }
    },
    Mutation: {
      login: async (parent, {email, password}) => {
        const user = await User.findOne({ email });
        if(!user) {
            throw new AuthenticationError("wrong email and/or password yo")
        }
        const correctPw = await user.isCorrectPassword(password)
        if(!correctPassword) {
            throw new AuthenticationError("wrong email and/or password yo")
        }
        const token = signToken(user);
        return {token, user};
      },
        addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user)
        return {token, user};
        },
        saveBook: async (parent, { book }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: { savedBooks: book}},
                    {new: true}
                )
                return updatedUser;
            }
            throw new AuthenticationError('Gotta be logged in for that yo')
        },
        removeBook: async (parent, {bookId}, context) => {
            if (contex.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: { savedBooks: { bookId: bookId}}},
                    {new: true}
                )
                return updatedUser;
            }
        }
         
    }
};
  
  module.exports = resolvers;