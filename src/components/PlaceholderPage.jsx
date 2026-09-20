export default function PlaceholderPage({ title, message }) {
  return (
    <div className="page-placeholder">
      <h1>{title}</h1>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
