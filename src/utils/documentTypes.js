export const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024

export const DOCUMENT_TYPE_LABELS = {
  HOSPITAL_BILL: 'Hospital bill',
  MEDICAL_REPORT: 'Medical report',
  PRESCRIPTION: 'Prescription',
  DISCHARGE_SUMMARY: 'Discharge summary',
  RC_BOOK: 'RC book',
  DRIVING_LICENSE: 'Driving license',
  ACCIDENT_PHOTO: 'Accident photo',
  FIR_COPY: 'FIR copy',
  AADHAAR_CARD: 'Aadhaar card',
  PAN_CARD: 'PAN card',
  INVOICE: 'Invoice',
  OTHER: 'Other document',
}

const HEALTH_DOCUMENT_TYPES = [
  'HOSPITAL_BILL',
  'MEDICAL_REPORT',
  'PRESCRIPTION',
  'DISCHARGE_SUMMARY',
  'AADHAAR_CARD',
  'PAN_CARD',
]

const MOTOR_DOCUMENT_TYPES = [
  'RC_BOOK',
  'DRIVING_LICENSE',
  'ACCIDENT_PHOTO',
  'FIR_COPY',
  'AADHAAR_CARD',
  'PAN_CARD',
]

const GENERIC_DOCUMENT_TYPES = ['AADHAAR_CARD', 'PAN_CARD', 'INVOICE', 'OTHER']

export function getDocumentTypesForClaimType(claimType) {
  const normalized = String(claimType || '').toUpperCase()
  if (normalized === 'HEALTH') return HEALTH_DOCUMENT_TYPES
  if (normalized === 'MOTOR' || normalized === 'AUTO') return MOTOR_DOCUMENT_TYPES
  return GENERIC_DOCUMENT_TYPES
}

export function getDocumentTypeLabel(documentType) {
  return DOCUMENT_TYPE_LABELS[documentType] ?? documentType?.replace(/_/g, ' ') ?? 'Document'
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
