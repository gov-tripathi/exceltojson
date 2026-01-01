import { motion } from 'framer-motion'
import { 
  Code2, 
  Grid3X3, 
  MessageSquare, 
  Bookmark, 
  Table2, 
  FileText, 
  Database,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react'

const optionsList = [
  {
    key: 'include_formulas',
    label: 'Include Formulas',
    description: 'Extract formula expressions and dependencies',
    icon: Code2,
  },
  {
    key: 'include_cells',
    label: 'Include Cell Map',
    description: 'Full cell-by-cell data with types',
    icon: Grid3X3,
  },
  {
    key: 'include_comments',
    label: 'Comments & Links',
    description: 'Extract comments and hyperlinks',
    icon: MessageSquare,
  },
  {
    key: 'include_named_ranges',
    label: 'Named Ranges',
    description: 'Include workbook named ranges',
    icon: Bookmark,
  },
  {
    key: 'include_excel_tables',
    label: 'Excel Tables',
    description: 'Extract structured table data',
    icon: Table2,
  },
  {
    key: 'include_inferred_sections',
    label: 'Infer Text Sections',
    description: 'Auto-detect text regions',
    icon: FileText,
  },
]

function OptionsPanel({ options, onOptionChange }) {
  return (
    <div className="glass rounded-2xl overflow-hidden h-fit sticky top-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white">
          <SlidersHorizontal className="w-4 h-4 text-black" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Extraction Options</h2>
          <p className="text-xs text-neutral-500">Customize your output</p>
        </div>
      </div>

      {/* Options list */}
      <div className="p-3 space-y-2">
        {optionsList.map((option, index) => {
          const isActive = options[option.key]
          const Icon = option.icon

          return (
            <motion.button
              key={option.key}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onOptionChange(option.key, !isActive)}
              className={`w-full p-3 rounded-xl flex items-start gap-3 text-left transition-all ${
                isActive
                  ? 'bg-white/10 border border-white/20'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-white' : 'bg-neutral-800'}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                  {option.label}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{option.description}</p>
              </div>
              <div
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  isActive ? 'bg-white' : 'bg-neutral-700'
                }`}
              >
                <motion.div
                  animate={{ x: isActive ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow-sm ${
                    isActive ? 'bg-black' : 'bg-neutral-400'
                  }`}
                />
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Chunk size slider */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">RAG Chunk Size</span>
          </div>
          <span className="text-sm text-white font-mono bg-white/10 px-2 py-1 rounded">{options.chunk_max_cells}</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={options.chunk_max_cells}
          onChange={(e) => onOptionChange('chunk_max_cells', parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-neutral-500 mt-2">
          <span>100</span>
          <span>2000</span>
        </div>
      </div>

      {/* RAG info */}
      <div className="mx-4 mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">RAG-Ready Output</span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Chunks are optimized for embedding models and vector databases. Each chunk includes context-rich text for semantic search.
        </p>
      </div>
    </div>
  )
}

export default OptionsPanel
