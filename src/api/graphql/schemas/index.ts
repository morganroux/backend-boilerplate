import { gql } from "apollo-server-express";

const typeDefsTest = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

export const typeDefs = [typeDefsTest];
