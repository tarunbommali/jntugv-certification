/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "../../ui/Card.jsx";
import { Rocket, Target, Star } from "lucide-react";

const Statement = () => {
  return (
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10"
        >
          <Card className="max-w-full mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-2xl group">
            {/* Animated Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

            <div className="relative bg-background rounded-2xl py-8">
              <CardContent className="text-center p-0">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>

                <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent mb-6">
                  Our Mission & Vision
                </h3>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Our Mission
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      To democratize access to high-quality technical education
                      and certification, enabling students from all backgrounds
                      to acquire industry-relevant skills and advance their
                      careers in the rapidly evolving technology landscape
                      through innovative learning experiences and industry
                      partnerships.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Our Vision
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      To become the leading platform for industry-aligned
                      technical education, empowering millions of learners
                      worldwide to achieve their career aspirations and drive
                      innovation in the global technology ecosystem through
                      accessible, practical, and transformative learning
                      experiences.
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
  )
}


export default Statement