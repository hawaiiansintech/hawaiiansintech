import "../assets/styles/modernism.css";
import { AnimatePresence } from "framer-motion";

function App({ Component, pageProps }) {
  return (
    <AnimatePresence>
      <Component {...pageProps} />
      <link href="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css" rel="stylesheet" />
    </AnimatePresence>
  );
}

export default App;
