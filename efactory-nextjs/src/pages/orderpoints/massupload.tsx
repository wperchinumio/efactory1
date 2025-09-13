import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Separator } from '@/components/ui'
import RadioButton from '@/components/ui/RadioButton'
import { IconFileSpreadsheet, IconUpload, IconInfoCircle, IconTrash, IconCheck, IconX } from '@tabler/icons-react'
import { uploadMassOrders } from '@/services/api'

type Environment = 'verify' | 'sandbox' | 'production'
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function MassUploadPage(){
  const [environment, setEnvironment] = useState<Environment>('verify')
  const [file, setFile] = useState<File|null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  function onPickFile(){ inputRef.current?.click() }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0] || null
    setFile(f)
    setUploadStatus('idle')
    // Auto-upload like legacy behavior
    if (f) {
      void onUpload(f)
    }
  }

  function pushLog(message: string){
    setLogs(prev => [message, ...prev])
  }

  async function onUpload(fileOverride?: File){
    const effectiveFile = fileOverride || file
    if (!effectiveFile){
      pushLog('<span class="text-red-400">❌ Please choose an Excel .xlsx file to upload.</span>')
      setUploadStatus('error')
      console.warn('MassUpload: No file selected')
      return
    }
    if (!/\.xlsx$/i.test(effectiveFile.name)){
      pushLog('<span class="text-red-400">❌ Only .xlsx files are accepted</span>')
      setUploadStatus('error')
      console.warn('MassUpload: Invalid file type, only .xlsx accepted')
      return
    }
    if (effectiveFile.size > 10 * 1024 * 1024) { // 10MB limit
      pushLog('<span class="text-red-400">❌ File too large. Maximum size is 10MB.</span>')
      setUploadStatus('error')
      console.warn('MassUpload: File too large')
      return
    }
    
    setUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 200)
    
    try {
      const res = await uploadMassOrders(effectiveFile, environment)
      const successMsg = res?.message || 'Success'
      const date = new Date()
      const dateStr = `${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')}/${date.getFullYear()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
      pushLog(`<span class="text-green-400">✅ ${dateStr} : ${successMsg}</span>`)
      console.info('MassUpload: Upload complete', successMsg)
      setUploadStatus('success')
      setUploadProgress(100)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err: any) {
      const msg = err?.error_message || err?.message || 'Upload failed'
      pushLog(`<span class="text-red-400">❌ ${msg}</span>`)
      console.error('MassUpload: Upload error', msg)
      setUploadStatus('error')
    } finally {
      clearInterval(progressInterval)
      setUploading(false)
      setTimeout(() => {
        setUploadStatus('idle')
        setUploadProgress(0)
      }, 2000)
    }
  }

  function clearLogs(){
    setLogs([])
    setFile(null)
    setIsDragging(false)
    setUploadStatus('idle')
    setUploadProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        onPickFile()
      }
      if (e.key === 'Escape') {
        clearLogs()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const envHelp = useMemo(()=>{
    return {
      verify: 'Verify Only will only validate the uploaded file and report issues. No import occurs.',
      sandbox: 'Sandbox will validate the file and import into the sandbox if valid.',
      production: 'Production will validate and import into the production server sandbox upon success.'
    }[environment]
  }, [environment])

  const template1Url = '/api/proxy/src/templates/Template_1.xlsx'
  const template2Url = '/api/proxy/src/templates/Template_2.xlsx'

  function downloadTemplate(url: string, filename: string){
    try {
      const a = document.createElement('a')
      a.href = `${url}?ts=${Date.now()}`
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (e){
      console.error('Template download failed', e)
    }
  }

  return (
    <div className="md:px-6 sm:px-3 pt-4 md:pt-6 bg-body-color">
      <div className="container-fluid mb-4">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg"><IconFileSpreadsheet className="w-5 h-5"/> ORDERPOINTS - MASS UPLOAD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[14px]">
              {/* About Mass Upload Section - Compact */}
              <div className="p-4 rounded-lg border border-border-color bg-body-color">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-2 text-font-color">About Mass Upload</h3>
                    <p className="text-font-color-100 text-[13px] mb-3">
                      We provide 2 different Excel templates to upload a batch of orders. 
                      <strong> Template 1</strong> requires the full order info in one single excel row. 
                      <strong> Template 2</strong> requires the full line info in one single row.
                    </p>
                    <div className="flex items-center gap-4">
                      <a className="text-primary underline font-medium hover:text-primary-600 text-sm" href={template1Url} onClick={e=>{ e.preventDefault(); downloadTemplate(template1Url, 'Template_1.xlsx') }}>Template 1 (one order per row)</a>
                      <a className="text-primary underline font-medium hover:text-primary-600 text-sm" href={template2Url} onClick={e=>{ e.preventDefault(); downloadTemplate(template2Url, 'Template_2.xlsx') }}>Template 2 (one line per row)</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Options + Upload grid - Compact & Mobile Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm mb-2 text-font-color">Available Options</h3>
                    <ul className="list-disc pl-4 text-font-color-100 text-[13px] space-y-1">
                      <li><strong>Verify Only:</strong> Only verifies the uploaded file is correct.</li>
                      <li><strong>Sandbox:</strong> Verifies and imports into the sandbox upon success.</li>
                      <li><strong>Production:</strong> Verifies and imports into the production server sandbox upon success.</li>
                    </ul>
                  </div>
                  
                  {/* Critical Warning - Compact */}
                  <div className="bg-danger/10 border border-danger/30 rounded p-3">
                    <div className="flex items-start gap-2">
                      <IconInfoCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0"/>
                      <div className="text-danger text-[13px]">
                        <div className="font-semibold">IMPORTANT:</div>
                        <div>Partial upload is not allowed; all orders must be valid or the whole batch is rejected.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-font-color">Select Upload Mode:</h4>
                    <div className="space-y-1">
                      <RadioButton name="mu" value="verify" label="Verify Only" checked={environment==='verify'} onChange={()=>setEnvironment('verify')} />
                      <RadioButton name="mu" value="sandbox" label="Sandbox" checked={environment==='sandbox'} onChange={()=>setEnvironment('sandbox')} />
                      <RadioButton name="mu" value="production" label="Production" checked={environment==='production'} onChange={()=>setEnvironment('production')} />
                    </div>
                    <div className="text-[12px] text-font-color-100 bg-primary-10 dark:bg-primary-900/10 dark:text-gray-200 p-2 rounded border-l-2 border-primary">{envHelp}</div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-font-color">Upload Excel File</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded text-xs">Ctrl+U</kbd> to select file
                      </div>
                    </div>
                    <div
                      className={`rounded-lg border-2 border-dashed p-4 flex flex-col items-center justify-center text-center min-h-[120px] transition-all duration-200 touch-manipulation ${
                        isDragging 
                          ? 'bg-primary-10 dark:bg-primary-900/20 border-primary scale-[1.02]' 
                          : 'bg-card-color border-border-color hover:bg-primary-10 dark:hover:bg-primary-900/10 hover:border-primary'
                      }`}
                      onDragEnter={e=>{ e.preventDefault(); setIsDragging(true) }}
                      onDragOver={e=>{ e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={e=>{ e.preventDefault(); setIsDragging(false) }}
                      onDrop={e=>{
                        e.preventDefault();
                        setIsDragging(false);
                        const f = e.dataTransfer?.files?.[0];
                        if (f){
                          setFile(f);
                          // Start upload immediately like legacy behavior
                          void onUpload(f);
                        }
                      }}
                    >
                      <input ref={inputRef} type="file" accept=".xlsx" className="hidden" onChange={onFileChange} />
                      
                      <div className="mb-3">
                        <IconUpload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-primary-600' : 'text-font-color-100'}`} />
                        <h4 className={`text-sm font-medium mb-1 ${isDragging ? 'text-primary-700 dark:text-primary-300' : 'text-font-color'}`}>
                          {isDragging ? 'Drop your file here' : 'Drop files here or click to upload'}
                        </h4>
                        <p className="text-font-color-100 text-xs">
                          {isDragging 
                            ? 'Release to upload immediately' 
                            : 'Upload starts immediately'
                          }
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                        <Button 
                          onClick={onPickFile} 
                          variant="outline" 
                          size="small"
                          disabled={uploading}
                          className="w-full sm:w-auto"
                        >
                          <IconUpload className="w-3 h-3 mr-1"/>
                          Choose .xlsx
                        </Button>
                        {file && !uploading && (
                          <Button 
                            onClick={onUpload} 
                            variant="primary"
                            size="small"
                            className="w-full sm:w-auto"
                          >
                            Upload Again
                          </Button>
                        )}
                      </div>
                      
                      {file && (
                        <div className="mt-2 p-2 bg-card-color rounded border border-border-color text-left w-full max-w-sm mx-auto">
                          <div className="flex items-center gap-1">
                            <IconFileSpreadsheet className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-xs font-medium text-font-color">Selected:</span>
                          </div>
                          <div className="text-xs text-font-color-100 mt-1 truncate" title={file.name}>{file.name}</div>
                          <div className="text-xs text-font-color-100">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                            {file.size > 10 * 1024 * 1024 && (
                              <span className="text-red-500 dark:text-red-400 ml-1">(Too large)</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Upload Progress */}
                      {uploading && (
                        <div className="mt-2 w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary-600 border-t-transparent"></div>
                            <span className="text-xs font-medium text-primary-600">Uploading...</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{uploadProgress}%</span>
                          </div>
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-primary-600 dark:bg-primary-500 h-1.5 rounded-full transition-all duration-300" 
                              style={{width: `${uploadProgress}%`}}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Success State */}
                      {uploadStatus === 'success' && (
                        <div className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                          <IconCheck className="w-4 h-4" />
                          <span className="text-xs font-medium">Upload successful!</span>
                        </div>
                      )}

                      {/* Error State */}
                      {uploadStatus === 'error' && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                          <IconX className="w-4 h-4" />
                          <span className="text-xs font-medium">Upload failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Log Messages Section - Compact */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-font-color">Log Messages</h3>
                  <Button 
                    size="small" 
                    variant="danger" 
                    onClick={clearLogs}
                    className="px-3 py-1 text-xs"
                  >
                    <IconTrash className="w-3 h-3 mr-1"/>
                    Clear
                  </Button>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 text-gray-100 font-mono text-xs p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-gray-400 italic">Log messages will appear here once you have uploaded the excel order batch file.</div>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((l, i)=>(
                        <div key={i} className="border-b border-gray-700 pb-1 last:border-b-0" dangerouslySetInnerHTML={{ __html: l }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


