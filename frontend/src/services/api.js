const API_URL = import.meta.env.VITE_API_URL
const GRAPH_PATH = import.meta.env.VITE_GRAPH_PATH

export async function extractGraph(documentText) {
  // Ensure trailing slash to avoid Flask redirects which break CORS preflight
  const endpoint = `${API_URL}${GRAPH_PATH}${!GRAPH_PATH.endsWith('/') ? '/' : ''}`
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: documentText }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'Graph generation failed')
  }

  return response.json()
}
