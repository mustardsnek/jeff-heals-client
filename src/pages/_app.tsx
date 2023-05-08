// https://dev.to/anuraggharat/adding-bootstrap-to-nextjs-39b2

import client from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import "@mustardsnek/vesslio-storybook/dist/esm/index.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.js");
  }, []);
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
