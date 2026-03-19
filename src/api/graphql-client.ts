import { GraphQLClient } from "graphql-request";
import { API_BASE_URL } from "@/lib/constants";

export const gqlClient = new GraphQLClient(`${API_BASE_URL}/graphql`, {
  credentials: "include",
});
