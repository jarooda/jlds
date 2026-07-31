import * as React from "react";
import { createPortal } from "react-dom";

/* Renders `children` into <body>, outside every clipping ancestor. Pair it with
 * `useAnchoredPopup`, which positions the popup against its trigger.
 *
 * Portals need a real document, so nothing is rendered during SSR;
 * `useSyncExternalStore` reports "not client" on the server and "client" after
 * hydration without a state update in an effect. */

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function AnchoredPortal({ children }: { children: React.ReactNode }) {
  const isClient = React.useSyncExternalStore(subscribe, onClient, onServer);
  return isClient ? createPortal(children, document.body) : null;
}
