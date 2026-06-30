/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import "./app-shell.css";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  padded?: boolean;
  fullHeight?: boolean;
  mobileBreakpoint?: number;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export type AppShellMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface AppShellComposition {
  (props: AppShellProps): React.JSX.Element;
  MenuButton: (props: AppShellMenuButtonProps) => React.JSX.Element;
}

const ShellCtx = React.createContext<{
  mobile: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ mobile: false, open: false, setOpen: () => {} });

function MenuButton({ className = "", children, ...rest }: AppShellMenuButtonProps) {
  const { open, setOpen } = React.useContext(ShellCtx);
  return (
    <button
      type="button"
      className={["jl-appshell__menubtn", className].filter(Boolean).join(" ")}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      {...rest}
    >
      {children || (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function AppShellRoot({
  sidebar,
  header,
  padded = false,
  fullHeight = true,
  mobileBreakpoint = 900,
  mobileOpen: openProp,
  defaultMobileOpen = false,
  onMobileOpenChange,
  className = "",
  style,
  children,
  ...rest
}: AppShellProps) {
  const [mobile, setMobile] = React.useState(false);
  const isControlled = openProp != null;
  const [internalOpen, setInternalOpen] = React.useState(defaultMobileOpen);
  const open = isControlled ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onMobileOpenChange?.(next);
    },
    [isControlled, onMobileOpenChange]
  );

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    // Sync mobile mode and close the drawer whenever we leave mobile.
    const apply = () => {
      setMobile(mql.matches);
      if (!mql.matches) setOpen(false);
    };
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [mobileBreakpoint, setOpen]);

  const ctx = React.useMemo(() => ({ mobile, open, setOpen }), [mobile, open, setOpen]);

  return (
    <ShellCtx.Provider value={ctx}>
      <div
        className={["jl-appshell", className].filter(Boolean).join(" ")}
        data-mobile={mobile || undefined}
        data-open={mobile && open ? "true" : undefined}
        style={{ height: fullHeight ? "100dvh" : "100%", ...style }}
        {...rest}
      >
        {sidebar != null && <div className="jl-appshell__aside">{sidebar}</div>}
        {mobile && (
          <div className="jl-appshell__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
        )}
        <div className="jl-appshell__main">
          {header != null && <div className="jl-appshell__header">{header}</div>}
          <div
            className={["jl-appshell__content", padded ? "jl-appshell__content--padded" : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {children}
          </div>
        </div>
      </div>
    </ShellCtx.Provider>
  );
}

export const AppShell = Object.assign(AppShellRoot, {
  MenuButton,
}) as AppShellComposition;
