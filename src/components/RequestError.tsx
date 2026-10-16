import { ApiError } from "../lib/api";
import "./RequestError.css";

export function RequestError({ error }: { error: Error }) {
  return (
    <div className="request-error" role="alert">
      <p>{error.message}</p>
      {error instanceof ApiError && error.requestId && (
        <small>Referência: {error.requestId}</small>
      )}
    </div>
  );
}
