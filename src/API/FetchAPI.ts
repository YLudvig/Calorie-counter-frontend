import { logout } from "../Utilities/AuthUtil.ts";

//Ändra vid deploy
const BASE_URL = import.meta.env.VITE_API_URL + "/api";

function getHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export function fetchApi(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = BASE_URL + endpoint;
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options && options.headers ? options.headers : {}),
    },
  };

  return fetch(url, fetchOptions).then(function (response) {
    if (response.status === 401 || response.status === 403) {
      logout();
      window.location.replace("/");
      throw new Error("Unauthorized or forbidden");
    }
    return response;
  });
}
