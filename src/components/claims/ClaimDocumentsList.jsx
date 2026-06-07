import { useState } from 'react'
import { Eye, FileText, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { claimApi } from '@/api/claim.api'
import { Button } from '@/components/ui/button'
import { DocumentPreviewDialog } from '@/components/claims/DocumentPreviewDialog'
import { getApiErrorMessage } from '@/services/apiError'
import { getDocumentId } from '@/services/documents'
import { formatFileSize, getDocumentTypeLabel, normalizeDocumentType } from '@/utils/documentTypes'
import { formatDateTime } from '@/utils/format'

export function ClaimDocumentsList({
  documents = [],
  loading = false,
  claimId,
  canDelete = false,
  onDocumentsChange,
}) {
  const [previewDoc, setPreviewDoc] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (documentId, fileName) => {
    if (!claimId || !documentId) return
    if (!window.confirm(`Delete "${fileName}"? This cannot be undone.`)) return

    setDeletingId(documentId)
    try {
      await claimApi.deleteDocument(claimId, documentId)
      toast.success('Document deleted')
      await onDocumentsChange?.()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete document'))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-6 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading documents…
      </div>
    )
  }

  if (!documents.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-sm text-slate-500">
        No documents uploaded yet for this claim.
      </p>
    )
  }

  return (
    <>
      <ul className="space-y-2">
        {documents.map((doc) => {
          const documentId = getDocumentId(doc)
          const documentType = normalizeDocumentType(doc.documentType ?? doc.type)
          const fileName = doc.fileName ?? doc.originalFileName ?? doc.name ?? 'Document'
          const size = doc.fileSize ?? doc.size
          const isDeleting = deletingId === documentId

          return (
            <li
              key={documentId ?? `${documentType}-${fileName}`}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">
                    {getDocumentTypeLabel(documentType)}
                  </p>
                  <p className="truncate text-sm text-slate-600">{fileName}</p>
                  <p className="text-xs text-slate-400">
                    {size != null && formatFileSize(size)}
                    {size != null && doc.uploadedAt && ' · '}
                    {doc.uploadedAt && formatDateTime(doc.uploadedAt)}
                    {documentId && (
                      <>
                        {(size != null || doc.uploadedAt) && ' · '}
                        <span className="font-mono">{documentId}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              {documentId ? (
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() =>
                      setPreviewDoc({
                        documentId,
                        documentType,
                        name: fileName,
                        size,
                        contentType: doc.contentType ?? doc.mimeType,
                      })
                    }
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  {canDelete && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isDeleting}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(documentId, fileName)}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  )}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      <DocumentPreviewDialog
        open={Boolean(previewDoc)}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
        document={previewDoc}
      />
    </>
  )
}
