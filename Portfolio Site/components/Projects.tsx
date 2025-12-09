'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Award } from 'lucide-react'
import { projects } from '@/data/projects'

export default function Projects() {
  if (projects.length === 0) {
    return (
      <section id="projects" className="section-padding bg-dark-bg">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gradient">PROJECTS</span>
          </motion.h2>
          <motion.div
            className="text-center mt-12 p-8 bg-dark-card rounded-xl border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-gray-400 mb-4">
              Add your projects to <code className="text-custom-olive bg-dark-surface px-2 py-1 rounded">data/projects.ts</code>
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  const highlightedProjects = projects.filter(p => p.highlight)
  const otherProjects = projects.filter(p => !p.highlight)

  const colorVariants = [
    { from: 'rgba(163, 163, 128, 0.15)', to: 'rgba(214, 206, 147, 0.15)' },
    { from: 'rgba(214, 206, 147, 0.15)', to: 'rgba(239, 235, 206, 0.15)' },
    { from: 'rgba(239, 235, 206, 0.15)', to: 'rgba(163, 163, 128, 0.15)' },
  ]

  return (
    <section id="projects" className="section-padding bg-dark-bg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-5" style={{ backgroundColor: '#A3A380' }} />
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-5" style={{ backgroundColor: '#D6CE93' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4">
            <span className="text-gradient">PROJECTS</span>
          </h2>
          <div className="w-24 h-1 mx-auto mt-4" style={{ background: 'linear-gradient(to right, #A3A380, #D6CE93, #EFEBCE)' }} />
          <p className="text-gray-400 mt-8 text-lg max-w-2xl mx-auto">
            ML & AI projects that showcase my passion for building intelligent systems
          </p>
        </motion.div>
        
        {/* Highlighted Projects */}
        {highlightedProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-400 mb-8 flex items-center gap-2">
              <span className="w-8 h-0.5" style={{ background: 'linear-gradient(to right, #A3A380, #D6CE93)' }}></span>
              Featured Work
              <span className="w-8 h-0.5" style={{ background: 'linear-gradient(to right, #D6CE93, #EFEBCE)' }}></span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {highlightedProjects.map((project, index) => {
                const colorVariant = colorVariants[index % colorVariants.length]
                return (
                  <motion.div
                    key={project.title}
                    className="bg-dark-card rounded-2xl overflow-hidden border border-gray-800 hover:border-custom-olive transition-all duration-300 group backdrop-blur-sm relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    {project.highlight && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1 rounded-full text-xs text-custom-olive border border-custom-olive/50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(163, 163, 128, 0.2)' }}>
                        <Award className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                    
                    <div 
                      className="h-64 flex items-center justify-center text-8xl relative overflow-hidden"
                      style={{ background: `linear-gradient(to bottom right, ${colorVariant.from}, ${colorVariant.to})` }}
                    >
                      <span className="relative z-10">{project.image}</span>
                      {project.category && (
                        <span className="absolute bottom-4 left-4 px-3 py-1 bg-dark-card/90 rounded-full text-xs text-gray-300 border border-gray-700 uppercase font-semibold">
                          {project.category}
                        </span>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3 text-gray-100 group-hover:text-custom-olive transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 rounded-full text-xs border font-medium text-custom-olive"
                            style={{ backgroundColor: 'rgba(163, 163, 128, 0.1)', borderColor: 'rgba(163, 163, 128, 0.3)' }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-custom-olive transition-colors font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-custom-sage transition-colors font-medium"
                          >
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            {highlightedProjects.length > 0 && (
              <h3 className="text-2xl font-bold text-gray-400 mb-8 flex items-center gap-2">
                <span className="w-8 h-0.5" style={{ background: 'linear-gradient(to right, #D6CE93, #EFEBCE)' }}></span>
                More Projects
                <span className="w-8 h-0.5" style={{ background: 'linear-gradient(to right, #EFEBCE, #A3A380)' }}></span>
              </h3>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => {
                const colorVariant = colorVariants[index % colorVariants.length]
                return (
                  <motion.div
                    key={project.title}
                    className="bg-dark-card rounded-xl overflow-hidden border border-gray-800 hover:border-custom-sage transition-all duration-300 group backdrop-blur-sm"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (highlightedProjects.length + index) * 0.1, duration: 0.6 }}
                    whileHover={{ y: -8 }}
                  >
                    <div 
                      className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                      style={{ background: `linear-gradient(to bottom right, ${colorVariant.from}, ${colorVariant.to})` }}
                    >
                      <span className="relative z-10">{project.image}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-custom-sage transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded-full text-xs border"
                            style={{ backgroundColor: 'rgba(214, 206, 147, 0.1)', borderColor: 'rgba(214, 206, 147, 0.3)', color: '#D6CE93' }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 rounded-full text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-custom-olive transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Demo
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-custom-sage transition-colors"
                          >
                            <Github className="w-3 h-3" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
