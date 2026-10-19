import "./RequestError.css";

export function RequestError({ error }: { error: Error }) {
  return (
    <div className="request-error" role="alert">
      <p>{error.message}</p>
    </div>
  );
}
