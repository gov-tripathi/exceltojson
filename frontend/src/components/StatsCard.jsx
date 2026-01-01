import { motion } from 'framer-motion'

function StatsCard({ icon: Icon, label, value, delay = 0 }) {
  const formatValue = (v) => {
    if (v >= 1000) {
      return `${(v / 1000).toFixed(1)}k`
    }
    return v
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
    >
      <div className="p-2 rounded-lg bg-white w-fit mb-2">
        <Icon className="w-4 h-4 text-black" />
      </div>
      <motion.p
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.1, type: 'spring', stiffness: 300 }}
        className="text-2xl font-bold text-white"
      >
        {formatValue(value)}
      </motion.p>
      <p className="text-xs text-neutral-400 mt-1">{label}</p>
    </motion.div>
  )
}

export default StatsCard
