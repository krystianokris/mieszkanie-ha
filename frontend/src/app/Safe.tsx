import { ErrorBoundary, type JSX } from "solid-js";

/** Keeps one broken tile or section from blanking the whole panel. */
export function Safe(props: { label: string; children: JSX.Element }) {
  return (
    <ErrorBoundary
      fallback={(err) => {
        console.error(`[krystal] ${props.label} failed`, err);
        return (
          <div class="k-tile k-error" role="alert">
            <span class="k-kicker">Krystal · {props.label}</span>
            <p>{String(err?.message ?? err)}</p>
          </div>
        );
      }}
    >
      {props.children}
    </ErrorBoundary>
  );
}
