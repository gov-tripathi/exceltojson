import { useMemo } from 'react'

function JsonViewer({ data, maxLength, fullMode = false }) {
  const jsonString = useMemo(() => {
    if (!data) return 'No data'
    
    try {
      const str = JSON.stringify(data, null, 2)
      
      // If no limit or showing full, return everything
      if (maxLength === undefined || maxLength === null || fullMode) {
        return str
      }
      
      // Truncate if too long
      if (str.length > maxLength) {
        return str.substring(0, maxLength) + '\n\n... (truncated - click "Show Full" to see all)'
      }
      
      return str
    } catch (err) {
      return 'Error displaying JSON: ' + err.message
    }
  }, [data, maxLength, fullMode])

  // Syntax highlighting
  const highlightedJson = useMemo(() => {
    return jsonString
      .replace(/(".*?")(\s*:)/g, '<span class="text-sky-400">$1</span>$2') // keys
      .replace(/:\s*(".*?")/g, ': <span class="text-emerald-400">$1</span>') // string values
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-amber-400">$1</span>') // numbers
      .replace(/:\s*(true|false)/g, ': <span class="text-pink-400">$1</span>') // booleans
      .replace(/:\s*(null)/g, ': <span class="text-neutral-500">$1</span>') // null
  }, [jsonString])

  return (
    <div className={`font-mono text-xs overflow-auto bg-black rounded-xl p-4 text-neutral-300 border border-white/10 ${
      fullMode ? 'max-h-[800px]' : 'max-h-[400px]'
    }`}>
      <pre 
        className="whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  )
}

export default JsonViewer
