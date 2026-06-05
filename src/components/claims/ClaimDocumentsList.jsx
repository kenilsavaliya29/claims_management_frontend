import { useState } from 'react'
import { Eye, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DocumentPreviewDialog } from '@/components/claims/DocumentPreviewDialog'
import { getDocumentId } from '@/services/documents'
import { formatFileSize, getDocumentTypeLabel, normalizeDocumentType } from '@/utils/documentTypes'
import { formatDateTime } from '@/utils/format'

export function ClaimDocumentsList({ documents = [], loading = false }) {
  const [previewDoc, setPreviewDoc] = useState(null)

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
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
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
