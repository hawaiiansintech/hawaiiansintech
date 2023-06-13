import React from "react";

export default function Plausible() {
  // see https://plausible.io/docs/outbound-link-click-tracking

  return (
    <script
      defer
      data-domain="hawaiiansintech.org"
      src="https://plausible.io/js/script.outbound-links.js"
    ></script>
  );
}
