import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileSpreadsheet, 
  Settings2, 
  Download, 
  Eye, 
  Zap,
  Code2,
  Table2,
  LayoutGrid,
  FileText,
  Database,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  Copy,
  FileJson
} from 'lucide-react'
import FileUpload from './components/FileUpload'
import OptionsPanel from './components/OptionsPanel'
import JsonViewer from './components/JsonViewer'
import StatsCard from './components/StatsCard'

// In development, call localhost:8000 directly
// In production on Vercel, call /api/convert
const getApiUrl = (endpoint) => {
  if (import.meta.env.DEV) {
    return `http://localhost:8000${endpoint}`
  }
  return `/api${endpoint}`
}

function App() {
  const [file, setFile] = useState(null)
  const [options, setOptions] = useState({
    include_formulas: true,
    include_cells: true,
    include_comments: true,
    include_named_ranges: true,
    include_excel_tables: true,
    include_inferred_sections: true,
    chunk_max_cells: 400,
  })
  const [outputMode, setOutputMode] = useState('preview')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showFullJson, setShowFullJson] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile)
    setResult(null)
    setError(null)
    setStatusMessage('')
  }, [])

  const handleOptionChange = useCallback((key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }, [])

  const processFile = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResult(null)
    setStatusMessage('Preparing file...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Add all options to form data
      formData.append('include_formulas', options.include_formulas.toString())
      formData.append('include_cells', options.include_cells.toString())
      formData.append('include_comments', options.include_comments.toString())
      formData.append('include_named_ranges', options.include_named_ranges.toString())
      formData.append('include_excel_tables', options.include_excel_tables.toString())
      formData.append('include_inferred_sections', options.include_inferred_sections.toString())
      formData.append('chunk_max_cells', options.chunk_max_cells.toString())

      if (outputMode === 'download') {
        setStatusMessage('Converting and downloading...')
        
        const response = await fetch(getApiUrl('/convert'), {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          const errorData = await response.text()
          throw new Error(errorData || `Server error: ${response.status}`)
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${file.name.replace(/\.[^.]+$/, '')}_output.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        setResult({ downloaded: true })
        setStatusMessage('Download complete!')
      } else {
        setStatusMessage('Converting to JSON...')
        
        const response = await fetch(getApiUrl('/convert'), {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.text()
          throw new Error(errorData || `Server error: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response from server')
        }
        
        setResult(data)
        const sheetCount = Object.keys(data.sheets || {}).length
        setStatusMessage(`Success! Converted ${sheetCount} sheet(s)`)
      }
    } catch (err) {
      console.error('Conversion error:', err)
      setError(err.message || 'Failed to convert file. Please try again.')
      setStatusMessage('')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStats = () => {
    if (!result || result.downloaded) return null
    
    const sheets = Object.keys(result.sheets || {}).length
    let cells = 0
    let tables = 0
    let chunks = 0
    let formulas = 0

    Object.values(result.sheets || {}).forEach(sheet => {
      cells += Object.keys(sheet.cells || {}).length
      tables += (sheet.tables || []).length
      chunks += (sheet.chunks || []).length
      Object.values(sheet.cells || {}).forEach(cell => {
        if (cell.f) formulas++
      })
    })

    return { sheets, cells, tables, chunks, formulas }
  }

  const stats = getStats()

  const copyToClipboard = async () => {
    if (result && !result.downloaded) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
        setStatusMessage('Copied to clipboard!')
        setTimeout(() => setStatusMessage(''), 2000)
      } catch (err) {
        setError('Failed to copy to clipboard')
      }
    }
  }

  const downloadJson = () => {
    if (result && !result.downloaded) {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file?.name?.replace(/\.[^.]+$/, '') || 'output'}_output.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-black grid-bg">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="p-3 rounded-2xl bg-white">
                <FileSpreadsheet className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  Excel <span className="text-neutral-400">→</span> JSON
                </h1>
                <p className="text-sm text-neutral-500">AI-Ready Converter</p>
              </div>
            </motion.div>

            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
              RAG Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* File Upload */}
            <FileUpload file={file} onFileSelect={handleFileSelect} />

            {/* Output Mode Toggle */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-5 h-5 text-neutral-400" />
                  <span className="font-medium text-white">Output Mode</span>
                </div>
                <div className="flex bg-neutral-900 rounded-xl p-1">
                  <button
                    onClick={() => setOutputMode('preview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      outputMode === 'preview'
                        ? 'bg-white text-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => setOutputMode('download')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      outputMode === 'download'
                        ? 'bg-white text-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Process Button */}
            <button
              onClick={processFile}
              disabled={!file || isProcessing}
              className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                file && !isProcessing
                  ? 'bg-white hover:bg-neutral-100 text-black shadow-lg shadow-white/10'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Convert to JSON
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Status Message */}
            {statusMessage && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm text-white">
                {statusMessage}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-400">Error</p>
                  <p className="text-sm text-neutral-300 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-5 gap-3">
                <StatsCard icon={LayoutGrid} label="Sheets" value={stats.sheets} delay={0} />
                <StatsCard icon={Table2} label="Cells" value={stats.cells} delay={0.05} />
                <StatsCard icon={Database} label="Tables" value={stats.tables} delay={0.1} />
                <StatsCard icon={Code2} label="Formulas" value={stats.formulas} delay={0.15} />
                <StatsCard icon={FileText} label="Chunks" value={stats.chunks} delay={0.2} />
              </div>
            )}

            {/* JSON Output */}
            {result && !result.downloaded && (
              <div className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <FileJson className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">JSON Output</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFullJson(!showFullJson)}
                      className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${showFullJson ? 'bg-white' : 'bg-neutral-700'}`}>
                        <div 
                          className={`absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all ${
                            showFullJson ? 'left-[22px] bg-black' : 'left-0.5 bg-neutral-400'
                          }`} 
                        />
                      </div>
                      Show Full
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadJson}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <JsonViewer 
                    data={result} 
                    maxLength={showFullJson ? undefined : 8000} 
                    fullMode={showFullJson}
                  />
                </div>
              </div>
            )}

            {/* Download Success */}
            {result?.downloaded && (
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 flex items-center gap-4">
                <div className="p-3 rounded-full bg-white">
                  <Check className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="font-semibold text-white">Download Complete!</p>
                  <p className="text-sm text-neutral-400 mt-1">Your JSON file has been downloaded successfully.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Options */}
          <aside>
            <OptionsPanel options={options} onOptionChange={handleOptionChange} />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-neutral-500">
            Extract formulas, tables, and RAG-ready chunks from your Excel files
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
