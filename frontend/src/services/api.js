const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
const GRAPH_PATH = import.meta.env.VITE_GRAPH_PATH || '/graph'
const UPLOAD_PATH = import.meta.env.VITE_UPLOAD_PATH || '/upload'
const CHAT_PATH = import.meta.env.VITE_CHAT_PATH || '/chat'
const HISTORY_PATH = import.meta.env.VITE_HISTORY_PATH || '/history'
const COMPLIANCE_PATH = import.meta.env.VITE_COMPLIANCE_PATH || '/compliance'
const INCIDENTS_PATH = import.meta.env.VITE_INCIDENTS_PATH || '/incidents'
const CACHE_TTL_MS = 30_000

const cache = {
  history: {
    data: null,
    expiresAt: 0,
    request: null,
  },
}

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

  const data = await response.json()
  cache.history.data = null
  cache.history.expiresAt = 0
  cache.history.request = null

  return data
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
  const endpoint = documentId
    ? buildEndpoint(`${GRAPH_PATH}/document/${encodeURIComponent(documentId)}`)
    : buildEndpoint(GRAPH_PATH)

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
  const now = Date.now()

  if (cache.history.data && cache.history.expiresAt > now) {
    return cache.history.data
  }

  if (cache.history.request) {
    return cache.history.request
  }

  const endpoint = buildEndpoint(HISTORY_PATH)

  cache.history.request = fetch(endpoint, {
    method: 'GET',
  }).then(async (response) => {
    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(body?.error || 'History fetch failed')
    }

    const data = await response.json()
    cache.history.data = data
    cache.history.expiresAt = Date.now() + CACHE_TTL_MS

    return data
  }).finally(() => {
    cache.history.request = null
  })

  return cache.history.request
}

export async function fetchCompliance(documentId) {
  const query = documentId ? `?document_id=${encodeURIComponent(documentId)}` : ''
  const endpoint = buildEndpoint(`${COMPLIANCE_PATH}${query}`)

  const response = await fetch(endpoint, {
    method: 'GET',
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'Compliance analysis failed')
  }

  return response.json()
}

export async function generateDocumentGraph(documentId) {
  const endpoint = buildEndpoint(`${GRAPH_PATH}/generate`)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ document_id: documentId }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'Document graph generation failed')
  }

  return response.json()
}

export async function fetchIncidents() {
  const endpoint = buildEndpoint(INCIDENTS_PATH)

  const response = await fetch(endpoint, {
    method: 'GET',
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'Incident fetch failed')
  }

  return response.json()
}

export async function findSimilarIncidents(query, topK = 5) {
  const endpoint = buildEndpoint(`${INCIDENTS_PATH}/similar`)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, top_k: topK }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || 'Incident similarity search failed')
  }

  return response.json()
}
