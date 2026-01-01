import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react'

function FileUpload({ file, onFileSelect }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm'],
    },
    multiple: false,
  })

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const removeFile = (e) => {
    e.stopPropagation()
    onFileSelect(null)
  }

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
        isDragActive
          ? 'border-white bg-white/5'
          : file
          ? 'border-white/30 bg-white/5'
          : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/50 hover:bg-neutral-900'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="p-8">
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-4"
            >
              <div className="p-4 rounded-2xl bg-white border border-white/20">
                <FileSpreadsheet className="w-8 h-8 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span className="text-sm text-white font-medium">Ready to process</span>
                </div>
                <p className="text-lg font-semibold truncate mt-1 text-white">{file.name}</p>
                <p className="text-sm text-neutral-400">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={removeFile}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <motion.div
                animate={{ y: isDragActive ? -5 : 0 }}
                className="inline-flex p-4 rounded-2xl bg-neutral-800 border border-white/10 mb-4"
              >
                <Upload className={`w-8 h-8 transition-colors ${isDragActive ? 'text-white' : 'text-neutral-400'}`} />
              </motion.div>
              <p className="text-lg font-medium mb-2 text-white">
                {isDragActive ? (
                  <span>Drop your Excel file here</span>
                ) : (
                  'Drag & drop your Excel file'
                )}
              </p>
              <p className="text-sm text-neutral-400">
                or <span className="text-white hover:underline">browse</span> to select
              </p>
              <p className="text-xs text-neutral-500 mt-3">Supports .xlsx and .xlsm files</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FileUpload
