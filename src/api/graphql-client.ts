import { GraphQLClient } from "graphql-request";
import { API_BASE_URL } from "@/lib/constants";

const graphqlUrl = API_BASE_URL
  ? `${API_BASE_URL}/graphql`
  : `${window.location.origin}/graphql`;

export const gqlClient = new GraphQLClient(graphqlUrl, {
  credentials: "include",
});
