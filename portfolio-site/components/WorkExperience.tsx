'use client'

import { motion } from 'framer-motion'
import { workExperience } from '@/data/workExperience'
import { Briefcase, MapPin, Calendar, Github } from 'lucide-react'

export default function WorkExperience() {
  if (workExperience.length === 0) {
    return (
      <section id="experience" className="section-padding bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gradient">EXPERIENCE</span>
          </motion.h2>
          <motion.div
            className="text-center mt-12 p-8 bg-dark-card rounded-xl border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-gray-400 mb-4">
              Add your work experience to <code className="text-custom-olive bg-dark-surface px-2 py-1 rounded">data/workExperience.ts</code>
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  const gradientColors = [
    { from: '#A3A380', to: '#D6CE93' },
    { from: '#D6CE93', to: '#EFEBCE' },
    { from: '#EFEBCE', to: '#A3A380' },
  ]

  return (
    <section id="experience" className="section-padding bg-dark-surface relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-5" style={{ backgroundColor: '#D6CE93' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5" style={{ backgroundColor: '#A3A380' }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4">
            <span className="text-gradient">EXPERIENCE</span>
          </h2>
          <div className="w-24 h-1 mx-auto mt-4" style={{ background: 'linear-gradient(to right, #A3A380, #D6CE93, #EFEBCE)' }} />
          <p className="text-gray-400 mt-8 text-lg">
            My professional journey in ML & AI
          </p>
        </motion.div>
        
        <div className="space-y-8">
          {workExperience.map((job, index) => {
            const gradient = gradientColors[index % gradientColors.length]
            return (
              <motion.div
                key={`${job.company}-${job.period}`}
                className="relative"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                {/* Timeline line */}
                {index < workExperience.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, rgba(163, 163, 128, 0.5), transparent)' }} />
                )}
                
                <div className="flex gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 relative">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-dark-bg shadow-lg relative z-10"
                      style={{ background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})` }}
                    >
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 w-16 h-16 rounded-full blur-xl opacity-30"
                      style={{ background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})` }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-dark-card rounded-2xl p-8 border border-gray-800 backdrop-blur-sm hover:border-custom-olive transition-all relative overflow-hidden group">
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-5" style={{ background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})` }} />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-100 mb-2 group-hover:text-custom-olive transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1 text-custom-sage font-semibold">
                              <Briefcase className="w-4 h-4" />
                              {job.company}
                            </span>
                            {job.location && (
                              <span className="flex items-center gap-1 text-gray-500 text-sm font-normal">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-sm text-gray-500 font-medium whitespace-nowrap">
                          <Calendar className="w-4 h-4" />
                          {job.period}
                        </span>
                      </div>
                      
                      <ul className="space-y-3 mb-6">
                        {job.description.map((desc, i) => {
                          const colors = ['#A3A380', '#D6CE93', '#EFEBCE']
                          return (
                            <li key={i} className="text-gray-300 flex items-start gap-3">
                              <span className="text-xl mt-1.5" style={{ color: colors[i % colors.length] }}>•</span>
                              <span className="leading-relaxed">{desc}</span>
                            </li>
                          )
                        })}
                      </ul>
                      
                      {(job.technologies && job.technologies.length > 0) || job.projectLink ? (
                        <div className="pt-6 border-t border-gray-800">
                          {job.technologies && job.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {job.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-3 py-1.5 rounded-full text-xs border font-medium text-custom-olive"
                                  style={{ backgroundColor: 'rgba(163, 163, 128, 0.1)', borderColor: 'rgba(163, 163, 128, 0.3)' }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {job.projectLink && (
                            <div className="flex gap-4">
                              <a
                                href={job.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-custom-olive transition-colors font-medium"
                              >
                                <Github className="w-4 h-4" />
                                View Project
                              </a>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
