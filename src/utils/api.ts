export function fetchApi<T>(path: string, payload: object): Promise<T> {
  return fetch(`${import.meta.env.VITE_FIGMANIA_URL}${path}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then((response) => {
    return response.json()
  })
}
