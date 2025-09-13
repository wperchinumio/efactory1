import React, { useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Separator } from '@/components/ui'
import RadioButton from '@/components/ui/RadioButton'
import { IconFileSpreadsheet, IconUpload, IconInfoCircle, IconTrash } from '@tabler/icons-react'
import { uploadMassOrders } from '@/services/api'

type Environment = 'verify' | 'sandbox' | 'production'

export default function MassUploadPage(){
  const [environment, setEnvironment] = useState<Environment>('verify')
  const [file, setFile] = useState<File|null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function onPickFile(){ inputRef.current?.click() }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0] || null
    setFile(f)
  }

  function pushLog(message: string){
    setLogs(prev => [message, ...prev])
  }

  async function onUpload(){
    if (!file){
      pushLog('Please choose an Excel .xlsx file to upload.')
      console.warn('MassUpload: No file selected')
      return
    }
    if (!/\.xlsx$/i.test(file.name)){
      pushLog('Only .xlsx files are accepted')
      console.warn('MassUpload: Invalid file type, only .xlsx accepted')
      return
    }
    setUploading(true)
    try {
      const res = await uploadMassOrders(file, environment)
      const successMsg = res?.message || 'Success'
      const date = new Date()
      const dateStr = `${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')}/${date.getFullYear()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
      pushLog(`${dateStr} : Success`)
      console.info('MassUpload: Upload complete', successMsg)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err: any) {
      const msg = err?.error_message || err?.message || 'Upload failed'
      pushLog(msg)
      console.error('MassUpload: Upload error', msg)
    } finally {
      setUploading(false)
    }
  }

  function clearLogs(){ setLogs([]) }

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
    <div className="md:px-6 sm:px-3 pt-6 md:pt-8 bg-body-color">
      <div className="container-fluid mb-6">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2"><IconFileSpreadsheet className="w-5 h-5"/> ORDERPOINTS - MASS UPLOAD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-[14px]">
              <div className="p-4 rounded-md border border-border-color bg-body-color">
                <div className="font-semibold mb-1">About Mass Upload</div>
                <p className="text-font-color-100">
                  We provide 2 different Excel templates to upload a batch of orders. Template 1 is one order per excel row. Template 2 is one line per excel row.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <a className="text-primary underline" href={template1Url} onClick={e=>{ e.preventDefault(); downloadTemplate(template1Url, 'Template_1.xlsx') }}>Template 1</a>
                  <a className="text-primary underline" href={template2Url} onClick={e=>{ e.preventDefault(); downloadTemplate(template2Url, 'Template_2.xlsx') }}>Template 2</a>
                  <span className="text-font-color-100 text-[13px]">Download, fill, then upload below.</span>
                </div>
              </div>

              {/* Options + Upload grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="space-y-3">
                  <div className="font-semibold">Available options</div>
                  <ul className="list-disc pl-5 text-font-color-100">
                    <li><strong>Verify Only:</strong> Only verifies the uploaded file is correct.</li>
                    <li><strong>Sandbox:</strong> Verifies and imports into the sandbox upon success.</li>
                    <li><strong>Production:</strong> Verifies and imports into the production server sandbox upon success.</li>
                  </ul>
                  <div className="mt-2 text-[13px] text-danger flex items-start gap-2">
                    <IconInfoCircle className="w-4 h-4 mt-0.5"/>
                    <div>Partial upload is not allowed; all orders must be valid or the whole batch is rejected.</div>
                  </div>
                  <div className="pt-3 grid grid-cols-1 gap-2">
                    <RadioButton name="mu" value="verify" label="Verify Only" checked={environment==='verify'} onChange={()=>setEnvironment('verify')} />
                    <RadioButton name="mu" value="sandbox" label="Sandbox" checked={environment==='sandbox'} onChange={()=>setEnvironment('sandbox')} />
                    <RadioButton name="mu" value="production" label="Production" checked={environment==='production'} onChange={()=>setEnvironment('production')} />
                    <div className="text-[13px] text-font-color-100">{envHelp}</div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="rounded-md border border-dashed border-border-color p-6 bg-body-color flex flex-col items-center justify-center text-center min-h-[160px]">
                    <input ref={inputRef} type="file" accept=".xlsx" className="hidden" onChange={onFileChange} />
                    <div className="flex items-center gap-3">
                      <Button onClick={onPickFile} variant="outline"><IconUpload className="w-4 h-4"/>Choose .xlsx</Button>
                      <Button onClick={onUpload} disabled={!file || uploading}>{uploading? 'Uploading...' : 'Upload'}</Button>
                    </div>
                    {file && (
                      <div className="mt-2 text-[13px] text-font-color-100">Selected: <span className="text-font-color">{file.name}</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Console */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Log messages</div>
                  <Button size="small" variant="danger" onClick={clearLogs}><IconTrash className="w-4 h-4"/>Clear</Button>
                </div>
                <div className="rounded-md border border-neutral-800 bg-neutral-900 text-neutral-100 font-mono text-[12px] p-3 min-h-[140px] max-h-[260px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-neutral-300/80">Log messages will appear here once you have uploaded the excel order batch file.</div>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((l, i)=>(<div key={i} dangerouslySetInnerHTML={{ __html: l }} />))}
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


