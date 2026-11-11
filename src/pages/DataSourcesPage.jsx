import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteDataFile, getDataDictionary, listDataSources, uploadDataFile } from '../api.js'
import { useAuth } from '../auth.jsx'

const STATUS_BADGES = {
  profiling: { className: 'badge badge-warning', label: 'Profiling…' },
  ready: { className: 'badge badge-success', label: 'Ready' },
  failed: { className: 'badge badge-neutral', label: 'Failed' },
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DictionaryViewer({ source, fileId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data-dictionary', source, fileId],
    queryFn: () => getDataDictionary(source, fileId),
  })

  if (isLoading) return <p className="worklog-working">Loading dictionary…</p>
  if (error) return <div className="alert alert-danger"><span>{error.message}</span></div>
  return <pre className="step-item-output">{data.markdown}</pre>
}

function FileRow({ source, file, onDelete, deleting }) {
  const [showDictionary, setShowDictionary] = useState(false)
  const badge = STATUS_BADGES[file.status] || STATUS_BADGES.failed

  return (
    <div>
      <div className="mail-result-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="label">{file.filename}</span>
          <span style={{ fontSize: '13.5px' }}>{formatSize(file.size_bytes)}</span>
          {file.error && <span style={{ fontSize: '13px' }}>{file.error}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={badge.className}>{badge.label}</span>
          {file.status === 'ready' && (
            <button type="button" className="btn btn-link" onClick={() => setShowDictionary((v) => !v)}>
              {showDictionary ? 'Hide dictionary' : 'View dictionary'}
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={() => onDelete(file.id)} disabled={deleting}>
            Remove
          </button>
        </div>
      </div>
      {showDictionary && <DictionaryViewer source={source} fileId={file.id} />}
    </div>
  )
}

function SourceCard({ source }) {
  const [uploadError, setUploadError] = useState('')
  const queryClient = useQueryClient()

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['data-sources'] })

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadDataFile(source.key, file),
    onSuccess: () => {
      setUploadError('')
      refresh()
    },
    onError: (err) => setUploadError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (fileId) => deleteDataFile(source.key, fileId),
    onSuccess: refresh,
  })

  function onFileChange(e) {
    const file = e.target.files?.[0]
    if (file) uploadMutation.mutate(file)
    e.target.value = ''
  }

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <p className="card-kicker">{source.label}</p>
      <p className="card-body">{source.description}</p>

      <div style={{ marginTop: '16px' }}>
        <input type="file" accept=".csv,text/csv" onChange={onFileChange} disabled={uploadMutation.isPending} />
        <p className="card-body" style={{ marginTop: '8px' }}>
          Uploading a file with an existing name replaces it and regenerates its dictionary.
        </p>
      </div>
      {uploadMutation.isPending && <p style={{ marginTop: '10px' }}>Uploading…</p>}
      {uploadError && (
        <div className="alert alert-danger" style={{ marginTop: '14px' }}>
          <span>{uploadError}</span>
        </div>
      )}
      {deleteMutation.error && (
        <div className="alert alert-danger" style={{ marginTop: '14px' }}>
          <span>{deleteMutation.error.message}</span>
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        {source.files.length === 0 ? (
          <p className="worklog-empty">No files uploaded yet — quotes will flag this source as missing.</p>
        ) : (
          source.files.map((file) => (
            <FileRow
              key={file.id}
              source={source.key}
              file={file}
              onDelete={(id) => deleteMutation.mutate(id)}
              deleting={deleteMutation.isPending}
            />
          ))
        )}
      </div>
    </div>
  )
}

const INTEGRATIONS = [
  { name: 'SAP', file: 'sap' },
  { name: 'Microsoft Dynamics 365', file: 'dynamics365' },
  { name: 'Excel', file: 'excel' },
  { name: 'Teams', file: 'teams' },
  { name: 'Gmail', file: 'gmail' },
  { name: 'Outlook', file: 'outlook' },
]

export default function DataSourcesPage() {
  const { user, loading, login } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['data-sources'],
    queryFn: listDataSources,
    enabled: !!user,
    // Keep polling while any file is still being profiled in the background.
    refetchInterval: (query) =>
      query.state.data?.sources.some((s) => s.files.some((f) => f.status === 'profiling')) ? 3000 : false,
  })

  if (!loading && !user) {
    return (
      <div className="demo-hero">
        <span className="kicker">Data sources</span>
        <h1 className="page-title">Sign in to manage your data.</h1>
        <div className="signin-actions">
          <button type="button" className="btn btn-primary" onClick={login}>
          Sign in with Google
        </button>
        </div>
        <div className="integrations-note">
          <span className="integrations-label">Integrations in process</span>
          <ul className="integrations-list">
            {INTEGRATIONS.map((item) => (
              <li key={item.file} className="integration-chip">
                <span
                  className="integration-logo"
                  style={{ '--logo': `url(/integrations/${item.file}.svg)` }}
                  aria-hidden="true"
                />
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="demo-hero">
        <span className="kicker">Data sources</span>
        <h1 className="page-title">Your pricing data.</h1>
        <p className="page-lead">
          Upload CSVs for each source. Each file is profiled into a data dictionary, and the quote
          agents query it when preparing a proposal. Sources with no files are flagged as missing
          in the quote's risk flags.
        </p>
      </div>

      {isLoading && <p>Loading data sources…</p>}
      {error && (
        <div className="alert alert-danger">
          <span>{error.message}</span>
        </div>
      )}
      {data?.sources.map((source) => (
        <SourceCard key={source.key} source={source} />
      ))}
    </>
  )
}
