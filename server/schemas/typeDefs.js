const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int
  }

  type Book {
    _id: ID!
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  input savedBook {
    description: String!
    title: String!
    bookId: String
    image: string
    link: String
    authors: [String]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(id: ID!, username: String!): User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(id: ID!, authors: [String], bookId: String!, description: String!, image: String, link: String, title: String!): User
    deleteBook(id: ID!, bookId: String!): User
  }
`;

module.exports = typeDefs;