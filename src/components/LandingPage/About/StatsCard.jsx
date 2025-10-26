/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'

const StatsCard = ({index,itemVariants, floatVariants, stat }) => {
  return (
     <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-primary/30">
                <motion.div
                  variants={floatVariants}
                  animate="float"
                  className="text-3xl md:text-4xl font-bold text-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]   mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
  )
}

export default StatsCard