import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteCatalogEntry, listCatalog, uploadCatalog } from '../api.js'
import { useAuth } from '../auth.jsx'

function formatMoney(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function CatalogPage() {
  const { user, loading, login } = useAuth()
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['catalog'],
    queryFn: listCatalog,
    enabled: !!user,
  })

  const uploadMutation = useMutation({
    mutationFn: uploadCatalog,
    onSuccess: () => {
      setUploadError('')
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    onError: (err) => setUploadError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCatalogEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog'] }),
  })

  function onFileChange(e) {
    const file = e.target.files?.[0]
    if (file) uploadMutation.mutate(file)
  }

  if (!loading && !user) {
    return (
      <div className="demo-hero">
        <span className="kicker">Cost catalog</span>
        <h1 className="page-title">Sign in to manage your costs.</h1>
        <button type="button" className="btn btn-primary" onClick={login}>
          Sign in with Google
        </button>
      </div>
    )
  }

  const entries = data?.entries ?? []

  return (
    <>
      <div className="demo-hero">
        <span className="kicker">Cost catalog</span>
        <h1 className="page-title">Your product costs.</h1>
        <p className="page-lead">
          Upload a CSV of your material/labor/machinery costs per product — quotes use these
          numbers instead of an estimate whenever a product matches. This stands in for a real
          ERP connection until one's wired up.
        </p>
      </div>

      <div className="card">
        <p className="card-kicker">Upload / refresh catalog</p>
        <h3 className="card-title">CSV columns: product_name, material_cost, labor_cost, machinery_cost</h3>
        <p className="card-body">
          Re-uploading updates any product that already exists (matched by name) and adds any new
          ones — nothing is removed.
        </p>
        <div style={{ marginTop: '16px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={onFileChange}
            disabled={uploadMutation.isPending}
          />
        </div>
        {uploadMutation.isPending && <p style={{ marginTop: '10px' }}>Uploading…</p>}
        {uploadError && (
          <div className="alert alert-danger" style={{ marginTop: '14px' }}>
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        {isLoading && <p>Loading catalog…</p>}
        {error && (
          <div className="alert alert-danger">
            <span>{error.message}</span>
          </div>
        )}
        {!isLoading && !error && entries.length === 0 && (
          <p className="worklog-empty">No products uploaded yet.</p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="mail-result-row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="label">{entry.product_name}</span>
              <span style={{ fontSize: '13.5px' }}>
                Material {formatMoney(entry.material_cost)} · Labor {formatMoney(entry.labor_cost)} ·
                {' '}Machinery {formatMoney(entry.machinery_cost)}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => deleteMutation.mutate(entry.id)}
              disabled={deleteMutation.isPending}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
