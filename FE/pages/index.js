import Interface from "./Interface";
import Script from "next/script";
// import { ApolloProvider } from "@apollo/client";
// import client from "../components/apolloClient";
const Index = () => {
  return (
    <div>
      <Script src="/js/snarkjs.min.js" />
      {/* <ApolloProvider client={client}> */}
      <Interface />
      {/* </ApolloProvider> */}
    </div>
  );
};

export default Index;
