// pages/_app.js
import Layout from "../components/layout"; // Make sure the import path is correct

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
