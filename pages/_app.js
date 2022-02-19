import "../assets/styles/modernism.css";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";

function App({ Component, pageProps }) {
  return (
      <AnimatePresence>
      {/* Adds google analytics to all pages */}
      <Script
        strategy='lazyOnload'
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TAG_ID}`} />
      <Script strategy='lazyOnload'>
        {
          `
          window.dataLayer = window.dataLayer || [];
          function gtag() {dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA_TAG_ID}');
          `
        }
      </Script>
        <Component {...pageProps} />
      </AnimatePresence>
  );
}

export default App;
