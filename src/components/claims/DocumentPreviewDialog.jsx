import { useEffect, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { claimApi } from '@/api/claim.api'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/services/apiError'
import { getDocumentPreviewKind } from '@/services/documents'
import { formatFileSize, getDocumentTypeLabel } from '@/utils/documentTypes'

export function DocumentPreviewDialog({ open, onOpenChange, document }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewKind, setPreviewKind] = useState('download')
  const [blob, setBlob] = useState(null)

  const documentId = document?.documentId
  const fileName = document?.name ?? 'document'
  const title = document?.documentType
    ? getDocumentTypeLabel(document.documentType)
    : fileName

  useEffect(() => {
    if (!open || !documentId) {
      return undefined
    }

    let cancelled = false
    let objectUrl = null

    const load = async () => {
      setLoading(true)
      setError('')
      setPreviewUrl(null)
      setBlob(null)

      try {
        const res = await claimApi.fetchDocumentBlob(documentId)
        if (cancelled) return

        const contentType =
          res.headers['content-type']?.split(';')[0]?.trim() ||
          document.contentType ||
          'application/octet-stream'
        const fileBlob =
          res.data instanceof Blob ? res.data : new Blob([res.data], { type: contentType })

        objectUrl = URL.createObjectURL(fileBlob)
        setBlob(fileBlob)
        setPreviewUrl(objectUrl)
        setPreviewKind(getDocumentPreviewKind(contentType, fileName))
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load document preview'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [open, documentId, document?.contentType, fileName])

  const handleDownload = () => {
    if (!blob || !previewUrl) return
    const link = document.createElement('a')
    link.href = previewUrl
    link.download = fileName
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        title={title}
        description={
          document?.size
            ? `${fileName} · ${formatFileSize(document.size)}`
            : fileName
        }
      >
        {loading && (
          <div className="flex min-h-[240px] items-center justify-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && previewUrl && previewKind === 'image' && (
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg bg-slate-50 p-2">
            <img
              src={previewUrl}
              alt={fileName}
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        )}

        {!loading && !error && previewUrl && previewKind === 'pdf' && (
          <iframe
            src={previewUrl}
            title={fileName}
            className="h-[70vh] w-full rounded-lg border border-slate-200"
          />
        )}

        {!loading && !error && previewUrl && previewKind === 'download' && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-sm text-slate-600">
              Preview is not available for this file type. Download to view it.
            </p>
            <Button type="button" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download {fileName}
            </Button>
          </div>
        )}

        {!loading && previewUrl && previewKind !== 'download' && (
          <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
            <Button type="button" variant="secondary" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
