const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
const GRAPH_PATH = import.meta.env.VITE_GRAPH_PATH || '/graph'
const UPLOAD_PATH = import.meta.env.VITE_UPLOAD_PATH || '/upload'
const CHAT_PATH = import.meta.env.VITE_CHAT_PATH || '/chat'
const HISTORY_PATH = import.meta.env.VITE_HISTORY_PATH || '/history'

function buildEndpoint(path) {
  const base = API_URL.replace(/\/+$/, '')
  const route = path.startsWith('/') ? path : `/${path}`
  return `${base}${route}`
}

export async function extractGraph(documentText) {
  const endpoint = buildEndpoint(GRAPH_PATH)

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

export async function uploadDocument(file, documentType = 'unknown') {
  const endpoint = buildEndpoint(UPLOAD_PATH)
  const formData = new FormData()

  formData.append('file', file)
  formData.append('document_type', documentType)

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'Document upload failed')
  }

  return response.json()
}

export async function sendChatQuery(query) {
  const endpoint = buildEndpoint(CHAT_PATH)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'Chat request failed')
  }

  return response.json()
}

export async function fetchGraph(documentId) {
  const query = documentId ? `?document_id=${encodeURIComponent(documentId)}` : ''
  const endpoint = buildEndpoint(`${GRAPH_PATH}${query}`)

  const response = await fetch(endpoint, {
    method: 'GET',
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'Graph fetch failed')
  }

  return response.json()
}

export async function fetchHistory() {
  const endpoint = buildEndpoint(HISTORY_PATH)

  const response = await fetch(endpoint, {
    method: 'GET',
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'History fetch failed')
  }

  return response.json()
}
