import { AnimatePresence } from "framer-motion";
import globalStyles from "../styles/global";

function App({ Component, pageProps }) {
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
