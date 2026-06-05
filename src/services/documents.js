import { unwrapApiData } from './apiError'

export function unwrapDocumentsList(response) {
  const data = unwrapApiData(response)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.documents)) return data.documents
  if (Array.isArray(data?.content)) return data.content
  return []
}

export function getDocumentId(doc) {
  return doc?.documentId ?? doc?.docId ?? doc?.id ?? null
}

export function getDocumentPreviewKind(contentType, fileName) {
  const type = String(contentType ?? '').toLowerCase()
  const name = String(fileName ?? '').toLowerCase()

  if (type.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(name)) {
    return 'image'
  }
  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    return 'pdf'
  }
  return 'download'
}
