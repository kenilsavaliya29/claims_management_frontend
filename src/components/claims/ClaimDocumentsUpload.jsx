import { useRef, useState } from 'react'
import { CheckCircle2, FileUp, Loader2, Upload, XCircle } from 'lucide-react'
import { claimApi } from '@/api/claim.api'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getApiErrorMessage } from '@/services/apiError'
import {
  formatFileSize,
  getDocumentTypeLabel,
  getDocumentTypesForClaimType,
  MAX_DOCUMENT_SIZE_BYTES,
  validateDocumentFile,
} from '@/utils/documentTypes'
import { cn } from '@/utils/cn'

export function ClaimDocumentsUpload({ claimId, claimType, onUploadComplete }) {
  const types = getDocumentTypesForClaimType(claimType)
  const [activeType, setActiveType] = useState(types[0] ?? '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState({})
  const inputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setError('')
    if (!file) {
      setSelectedFile(null)
      return
    }
    const validationError = validateDocumentFile(file)
    if (validationError) {
      setError(validationError)
      setSelectedFile(null)
      e.target.value = ''
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !activeType) return
    setUploading(true)
    setError('')
    try {
      await claimApi.uploadDocument(claimId, selectedFile, activeType)
      setUploaded((prev) => {
        const next = {
          ...prev,
          [activeType]: {
            name: selectedFile.name,
            size: selectedFile.size,
          },
        }
        onUploadComplete?.(Object.keys(next).length)
        return next
      })
      setSelectedFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to upload document'))
    } finally {
      setUploading(false)
    }
  }

  if (!types.length) {
    return (
      <p className="text-sm text-slate-500">No document types available for this claim type.</p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Upload supporting documents (max {formatFileSize(MAX_DOCUMENT_SIZE_BYTES)} per file).
        Select a document type tab, choose a file, then upload.
      </p>

      <Tabs value={activeType} onValueChange={(v) => {
        setActiveType(v)
        setSelectedFile(null)
        setError('')
        if (inputRef.current) inputRef.current.value = ''
      }}>
        <TabsList className="h-auto">
          {types.map((type) => (
            <TabsTrigger key={type} value={type} className="gap-1.5">
              {uploaded[type] && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
              {getDocumentTypeLabel(type)}
            </TabsTrigger>
          ))}
        </TabsList>

        {types.map((type) => (
          <TabsContent key={type} value={type}>
            <DocumentUploadPanel
              documentType={type}
              selectedFile={activeType === type ? selectedFile : null}
              uploaded={uploaded[type]}
              error={activeType === type ? error : ''}
              uploading={uploading && activeType === type}
              inputRef={activeType === type ? inputRef : null}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              onReplace={() => {
                setUploaded((prev) => {
                  const next = { ...prev }
                  delete next[type]
                  onUploadComplete?.(Object.keys(next).length)
                  return next
                })
                inputRef.current?.click()
              }}
              onBrowse={() => inputRef.current?.click()}
            />
          </TabsContent>
        ))}
      </Tabs>

      <p className="text-xs text-slate-400">
        {Object.keys(uploaded).length} of {types.length} document type
        {types.length === 1 ? '' : 's'} uploaded
      </p>
    </div>
  )
}

function DocumentUploadPanel({
  documentType,
  selectedFile,
  uploaded,
  error,
  uploading,
  inputRef,
  onFileChange,
  onUpload,
  onBrowse,
  onReplace,
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
        onChange={onFileChange}
      />

      {uploaded ? (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/80 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-emerald-900">Uploaded</p>
            <p className="truncate text-sm text-emerald-800">{uploaded.name}</p>
            <p className="text-xs text-emerald-700">{formatFileSize(uploaded.size)}</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={onReplace}>
            Replace
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-brand-50 p-3 text-brand-700">
            <FileUp className="h-6 w-6" />
          </div>
          <p className="mt-3 font-medium text-slate-900">{getDocumentTypeLabel(documentType)}</p>
          <p className="mt-1 text-sm text-slate-500">PDF, JPG, PNG or WEBP up to 5 MB</p>
          <Button type="button" variant="secondary" className="mt-4" onClick={onBrowse}>
            <Upload className="h-4 w-4" />
            Choose file
          </Button>
        </div>
      )}

      {selectedFile && !uploaded && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-slate-200 bg-white p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
          </div>
          <Button type="button" onClick={onUpload} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload file'
            )}
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}

export function ClaimDocumentsSummary({ uploadedCount, totalTypes, className }) {
  return (
    <div className={cn('rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-800', className)}>
      Claim created successfully. Upload documents below ({uploadedCount}/{totalTypes} types
      uploaded).
    </div>
  )
}
