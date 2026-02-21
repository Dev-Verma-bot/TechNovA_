const buildUrl = (url, params) => {
  if (!params) return url;
  const query = new URLSearchParams(params).toString();
  return query ? `${url}?${query}` : url;
};

export const apiConnector = async (
  method,
  url,
  bodyData,
  headers,
  params,
  options = {}
) => {
  const response = await fetch(buildUrl(url, params), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: bodyData ? JSON.stringify(bodyData) : undefined,
    credentials: options.credentials || "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      (typeof data === "object" && data?.message) || "Request failed"
    );
    error.response = { data, status: response.status };
    throw error;
  }

  return { data, status: response.status };
};
