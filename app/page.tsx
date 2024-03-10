"use client";
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Users from "@/components/User";

const client = new ApolloClient({
  uri: "http://localhost:4000", // Your GraphQL server endpoint
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>User</h1>
        <Users />
      </div>
    </ApolloProvider>
  );
};

export default App;
