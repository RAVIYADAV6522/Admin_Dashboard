/**
 * Human-readable message from RTK Query / fetchBaseQuery errors after unwrap().
 */
export function getApiErrorMessage(err, fallback) {
  if (!err) return fallback;
  if (typeof err === "string") return err;

  const data = err.data;
  if (data != null) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        if (parsed?.message) return parsed.message;
      } catch {
        if (data.length < 400) return data;
      }
    }
    if (typeof data === "object") {
      if (typeof data.message === "string" && data.message) return data.message;
      if (typeof data.error === "string" && data.error) return data.error;
      if (Array.isArray(data.issues) && data.issues.length) {
        return data.issues
          .map((i) => `${(i.path && i.path.join?.(".")) || "?"}: ${i.message}`)
          .join(" · ");
      }
    }
  }

  if (typeof err.error === "string" && err.error) return err.error;

  const st = err.status;
  if (st === "FETCH_ERROR" || st === "PARSING_ERROR" || st === "TIMEOUT" || st === 0) {
    return "Could not reach the API. Check that the server is running and VITE_BASE_URL in client/.env matches it (e.g. http://localhost:9000), then restart the Vite dev server.";
  }

  if (typeof st === "number") {
    return `Request failed (HTTP ${st}). Open the terminal where the API runs and look for errors.`;
  }

  if (typeof err.message === "string" && err.message && err.message !== "Rejected") {
    return err.message;
  }

  return fallback;
}
