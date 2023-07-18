"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export default function Modal({ children }: React.PropsWithChildren<{}>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return mounted ? createPortal(<>{children}</>, document.body) : null;
}
