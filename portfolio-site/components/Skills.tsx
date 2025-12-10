'use client'

import { motion } from 'framer-motion'

const skillCategories = [
  {
    category: 'ML & AI',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'Scikit-learn', level: 90 },
      { name: 'Pandas', level: 95 },
      { name: 'NumPy', level: 90 },
      { name: 'OpenAI Vision', level: 85 },
      { name: 'Keras/TensorFlow', level: 85 },
    ],
    gradient: { from: '#A3A380', to: '#D6CE93' },
  },
  {
    category: 'Programming',
    skills: [
      { name: 'Java', level: 90 },
      { name: 'C++', level: 85 },
      { name: 'TypeScript', level: 85 },
      { name: 'SQL/Postgres', level: 80 },
      { name: 'JavaScript', level: 80 },
    ],
    gradient: { from: '#D6CE93', to: '#EFEBCE' },
  },
  {
    category: 'Tools & Systems',
    skills: [
      { name: 'Git', level: 95 },
      { name: 'Supabase', level: 85 },
      { name: 'Data Pipelines', level: 90 },
      { name: 'ML Model Evaluation', level: 90 },
      { name: 'Technical Troubleshooting', level: 95 },
    ],
    gradient: { from: '#EFEBCE', to: '#A3A380' },
  },
]

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-dark-bg relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-5" style={{ backgroundColor: '#EFEBCE' }} />
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-5" style={{ backgroundColor: '#A3A380' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4">
            <span className="text-gradient">SKILLS</span>
          </h2>
          <div className="w-24 h-1 mx-auto mt-4" style={{ background: 'linear-gradient(to right, #A3A380, #D6CE93, #EFEBCE)' }} />
          <p className="text-gray-400 mt-8 text-lg max-w-2xl mx-auto">
            Technologies and tools I use to build intelligent systems
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              className="bg-dark-card rounded-xl p-6 border border-gray-800 backdrop-blur-sm relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02, borderColor: '#A3A380' }}
            >
              {/* Subtle glow on hover */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-all duration-300"
                style={{ background: `linear-gradient(to bottom right, ${category.gradient.from}, ${category.gradient.to})` }}
              />
              
              <h3 
                className="text-2xl font-bold mb-6 text-center relative z-10"
                style={{ 
                  background: `linear-gradient(to right, ${category.gradient.from}, ${category.gradient.to})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {category.category}
              </h3>
              <div className="space-y-4 relative z-10">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-200 font-medium">{skill.name}</span>
                      <span className="text-gray-500 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-dark-surface rounded-full h-2.5 overflow-hidden border border-gray-800">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          background: `linear-gradient(to right, ${category.gradient.from}, ${category.gradient.to})`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: categoryIndex * 0.2 + skillIndex * 0.1, duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Soft Skills */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-300 mb-6">Soft Skills</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Technical Troubleshooting', 'Cross-team Collaboration', 'Leadership', 'Adaptability', 'Time Management'].map((skill, index) => (
              <motion.span
                key={skill}
                className="px-4 py-2 bg-dark-card border border-gray-800 rounded-full text-gray-300 text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.1, borderColor: '#A3A380' }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
