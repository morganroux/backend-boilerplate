import _ from "lodash";
import { Resolvers } from "../codegen/generated";

const resolverTest: Resolvers = {
  Query: {
    books: () => [
      {
        title: "The Awakening",
        author: "Kate Chopin",
      },
      {
        title: "City of Glass",
        author: "Paul Auster",
      },
    ],
  },
};

export const resolvers: Resolvers = _.merge(resolverTest);
