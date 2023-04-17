import globalStyles from "../styles/global";
import { AnimatePresence } from "framer-motion";

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
