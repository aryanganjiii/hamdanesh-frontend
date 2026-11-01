export default function Toast({ message, error = false }) {
  return <div className={`toast ${message ? "show" : ""} ${error ? "error" : ""}`} role="status" aria-live="polite">{message}</div>;
}
