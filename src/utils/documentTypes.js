/** Matches com.claims.document.DocumentType on the backend. */
export const DOCUMENT_TYPE = {
  AADHAR_CARD: 'AADHAR_CARD',
  PAN_CARD: 'PAN_CARD',
  HOSPITAL_BILL: 'HOSPITAL_BILL',
  MEDICAL_REPORT: 'MEDICAL_REPORT',
  PRESCRIPTION: 'PRESCRIPTION',
  DISCHARGE_SUMMARY: 'DISCHARGE_SUMMARY',
  ACCIDENT_PHOTO: 'ACCIDENT_PHOTO',
  FIR_COPY: 'FIR_COPY',
  VEHICLE_RC: 'VEHICLE_RC',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  INSURANCE_POLICY: 'INSURANCE_POLICY',
  INVOICE: 'INVOICE',
  OTHER: 'OTHER',
}

export const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024

export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPE.AADHAR_CARD]: 'Aadhaar card',
  [DOCUMENT_TYPE.PAN_CARD]: 'PAN card',
  [DOCUMENT_TYPE.HOSPITAL_BILL]: 'Hospital bill',
  [DOCUMENT_TYPE.MEDICAL_REPORT]: 'Medical report',
  [DOCUMENT_TYPE.PRESCRIPTION]: 'Prescription',
  [DOCUMENT_TYPE.DISCHARGE_SUMMARY]: 'Discharge summary',
  [DOCUMENT_TYPE.ACCIDENT_PHOTO]: 'Accident photo',
  [DOCUMENT_TYPE.FIR_COPY]: 'FIR copy',
  [DOCUMENT_TYPE.VEHICLE_RC]: 'Vehicle RC',
  [DOCUMENT_TYPE.DRIVING_LICENSE]: 'Driving license',
  [DOCUMENT_TYPE.INSURANCE_POLICY]: 'Insurance policy',
  [DOCUMENT_TYPE.INVOICE]: 'Invoice',
  [DOCUMENT_TYPE.OTHER]: 'Other document',
}

/** Older frontend values → backend enum (for API responses saved with wrong keys). */
const LEGACY_DOCUMENT_TYPE_ALIASES = {
  AADHAAR_CARD: DOCUMENT_TYPE.AADHAR_CARD,
  RC_BOOK: DOCUMENT_TYPE.VEHICLE_RC,
}

const HEALTH_DOCUMENT_TYPES = [
  DOCUMENT_TYPE.HOSPITAL_BILL,
  DOCUMENT_TYPE.MEDICAL_REPORT,
  DOCUMENT_TYPE.PRESCRIPTION,
  DOCUMENT_TYPE.DISCHARGE_SUMMARY,
  DOCUMENT_TYPE.AADHAR_CARD,
  DOCUMENT_TYPE.PAN_CARD,
]

const MOTOR_DOCUMENT_TYPES = [
  DOCUMENT_TYPE.VEHICLE_RC,
  DOCUMENT_TYPE.DRIVING_LICENSE,
  DOCUMENT_TYPE.ACCIDENT_PHOTO,
  DOCUMENT_TYPE.FIR_COPY,
  DOCUMENT_TYPE.INSURANCE_POLICY,
  DOCUMENT_TYPE.AADHAR_CARD,
  DOCUMENT_TYPE.PAN_CARD,
]

const GENERIC_DOCUMENT_TYPES = [
  DOCUMENT_TYPE.AADHAR_CARD,
  DOCUMENT_TYPE.PAN_CARD,
  DOCUMENT_TYPE.INVOICE,
  DOCUMENT_TYPE.OTHER,
]

export function normalizeDocumentType(documentType) {
  if (!documentType) return documentType
  const upper = String(documentType).toUpperCase()
  return LEGACY_DOCUMENT_TYPE_ALIASES[upper] ?? upper
}

export function getDocumentTypesForClaimType(claimType) {
  const normalized = String(claimType || '').toUpperCase()
  if (normalized === 'HEALTH') return HEALTH_DOCUMENT_TYPES
  if (normalized === 'MOTOR' || normalized === 'AUTO') return MOTOR_DOCUMENT_TYPES
  return GENERIC_DOCUMENT_TYPES
}

export function getDocumentTypeLabel(documentType) {
  const normalized = normalizeDocumentType(documentType)
  return DOCUMENT_TYPE_LABELS[normalized] ?? normalized?.replace(/_/g, ' ') ?? 'Document'
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function validateDocumentFile(file) {
  if (!file) return 'Please select a file'
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return `File must be ${formatFileSize(MAX_DOCUMENT_SIZE_BYTES)} or smaller`
  }
  return null
}

/** Maps API document list to local upload state keyed by document type. */
export function buildUploadedDocumentsMap(documents) {
  if (!documents) return {}

  const list = Array.isArray(documents)
    ? documents
    : Object.entries(documents).map(([documentType, doc]) => ({
        documentType,
        ...(typeof doc === 'object' && doc !== null ? doc : { fileName: String(doc) }),
      }))

  return list.reduce((acc, doc) => {
    const type = normalizeDocumentType(doc.documentType ?? doc.type)
    if (!type) return acc
    acc[type] = {
      name: doc.fileName ?? doc.originalFileName ?? doc.name ?? 'Uploaded file',
      size: doc.fileSize ?? doc.size ?? 0,
    }
    return acc
  }, {})
}

export function getClaimDocumentsFromResponse(claim) {
  if (!claim) return []
  return claim.documents ?? claim.claimDocuments ?? claim.attachments ?? []
}
