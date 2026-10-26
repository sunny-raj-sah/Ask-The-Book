const API_BASE = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  if (!API_BASE) {
    throw new Error("VITE_API_URL is not configured in the frontend.");
  }

  const token = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  if (options.body != null && !isFormData) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    // Handle responses that don't contain JSON.
  }

  if (response.status === 401 && token) {
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  if (!response.ok) {
    const error = new Error(
      data.details ||
        data.error ||
        data.message ||
        "Something went wrong."
    );

    error.status = response.status;
    throw error;
  }

  return data;
}