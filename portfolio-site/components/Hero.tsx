'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowRight, Code, Brain, Sparkles } from 'lucide-react'

const roles = ['ML Engineer', 'AI Researcher', 'Creative Coder', 'Data Scientist', 'Problem Solver']

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg">
      {/* Animated gradient orbs with custom colors */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: '#A3A380' }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: '#D6CE93' }}
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: '#EFEBCE' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Neural network nodes with custom colors */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#A3A380' : i % 3 === 1 ? '#D6CE93' : '#EFEBCE',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Main content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 text-gray-400"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-custom-olive" />
              <span className="text-sm uppercase tracking-wider">Hello, I'm</span>
            </motion.div>
            
            {/* Name */}
            <motion.h1
              className="text-7xl sm:text-8xl md:text-9xl font-black leading-[0.9] tracking-tighter"
              style={{ 
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                letterSpacing: '-0.06em',
                fontWeight: 900,
                lineHeight: '0.85'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="text-gradient block" style={{ fontWeight: 950, letterSpacing: '-0.05em', WebkitTextStroke: '0.5px rgba(163, 163, 128, 0.3)' }}>SHAZI</span>
              <span className="text-gray-100 block" style={{ fontWeight: 950, letterSpacing: '-0.05em' }}>BIDARIAN</span>
            </motion.h1>
            
            {/* Role */}
            <motion.div
              className="text-2xl sm:text-3xl md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="text-gray-400">I'm a </span>
              <motion.span
                key={currentRole}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-gradient font-bold inline-block ml-2 font-mono"
                style={{ 
                  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
                  letterSpacing: '0.05em'
                }}
              >
                {roles[currentRole]}
              </motion.span>
            </motion.div>
            
            {/* Description */}
            <motion.p
              className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Building intelligent systems with machine learning and AI. 
              Currently a ML Fellow at <span className="text-custom-olive">Cornell Tech</span> and 
              working on exciting projects at <span className="text-custom-sage">Arity</span>.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.a
                href="#projects"
                className="group px-8 py-4 rounded-lg font-semibold text-white hover:shadow-2xl transition-all flex items-center gap-2"
                style={{ 
                  background: 'linear-gradient(to right, #A3A380, #D6CE93)',
                  boxShadow: '0 0 30px rgba(163, 163, 128, 0.3)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                href="#contact"
                className="px-8 py-4 border-2 border-gray-700 rounded-lg font-semibold hover:border-custom-olive hover:text-custom-olive transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.a>
            </motion.div>
            
            {/* Quick stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {[
                { value: '60K+', label: 'Data Nodes', color: 'text-custom-olive' },
                { value: '12+', label: 'ML Models', color: 'text-custom-sage' },
                { value: '0.92', label: 'AUC Score', color: 'text-custom-cream' },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right side - Visual elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            {/* Code block visual */}
            <div className="relative bg-dark-card rounded-2xl p-8 border border-gray-800 backdrop-blur-sm">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-4 font-mono text-sm">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-gray-600">def</span>
                  <span className="text-custom-olive">build_ai</span>
                  <span className="text-gray-600">():</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="pl-4 text-gray-400"
                >
                  <span className="text-custom-sage">return</span>
                  <span className="text-gray-300"> creativity</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="pl-4 text-gray-400"
                >
                  <span className="text-custom-sage">+</span>
                  <span className="text-gray-300"> innovation</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                  className="pl-4 text-gray-400"
                >
                  <span className="text-custom-sage">+</span>
                  <span className="text-gray-300"> passion</span>
                </motion.div>
              </div>
              
              {/* Floating icons */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(to bottom right, #A3A380, #D6CE93)' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(to bottom right, #D6CE93, #EFEBCE)' }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-10 left-10 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ backgroundColor: '#A3A380' }} />
            <div className="absolute -z-10 bottom-10 right-10 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ backgroundColor: '#D6CE93' }} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg className="w-6 h-6 text-custom-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
