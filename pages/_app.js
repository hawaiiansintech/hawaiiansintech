import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import globalStyles from "../styles/global";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  useEffect(() => {
    document.body.className = "bg-tan-200";
  });
  return (
    <>
      <AnimatePresence>
        <Component {...pageProps} />
      </AnimatePresence>
      <style jsx global>
        {globalStyles}
      </style>
    </>
  );
}

export default App;
