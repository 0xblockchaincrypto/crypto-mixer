import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
  useQuery,
  ApolloProvider,
} from "@apollo/client";

// Apollo Client setup
const client = new ApolloClient({
  link: new HttpLink({
    uri: "YOUR_SUBGRAPH_URL", // Replace with your subgraph URL
  }),
  cache: new InMemoryCache(),
});

// GraphQL query
const GET_DATA = gql`
  query {
    entities {  // Replace 'entities' with your actual entity name
      id
      field1
      field2
    }
  }
`;

// React component
function YourComponent() {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.entities.map((entity) => (
        <div key={entity.id}>
          <p>{entity.field1}</p>
          <p>{entity.field2}</p>
        </div>
      ))}
    </div>
  );
}

// App component
function App() {
  return (
    <ApolloProvider client={client}>
      <YourComponent />
    </ApolloProvider>
  );
}

export default App;
