'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="section-padding bg-dark-surface relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#D6CE93' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#A3A380' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4">
            <span className="text-gradient">ABOUT</span>
            <span className="text-gray-100"> ME</span>
          </h2>
          <div className="w-24 h-1 mx-auto mt-4" style={{ background: 'linear-gradient(to right, #A3A380, #D6CE93, #EFEBCE)' }} />
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-3xl opacity-20" style={{ background: 'linear-gradient(to right, rgba(163, 163, 128, 0.3), rgba(214, 206, 147, 0.3))' }} />
              <div className="relative bg-dark-card rounded-2xl p-8 border border-gray-800 backdrop-blur-sm">
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  I'm a <span className="text-custom-olive font-semibold">Software</span> and <span className="text-custom-olive font-semibold">Machine Learning Engineer</span>, and a
                  Computer Science student at <span className="text-custom-olive font-semibold">UC San Diego</span>, passionate about building AI and web systems that make
                  a real impact. Currently, I'm a Software Engineering Intern at <span className="text-custom-sage">Aesthetic</span>, building serverless
                  pipelines with AWS Lambda and Gemini Vision, and a ML Fellow at <span className="text-custom-sage">Cornell Tech's Break Through Tech AI</span>.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mt-4">
                  Previously, I worked at <span className="text-custom-cream">Arity</span> designing scalable data-cleaning pipelines over 60K+ telematics nodes
                  and evaluating 12+ unsupervised ML models. I also won the <span className="text-custom-cream">Best Coast Hackathon</span> with CareFi,
                  an AI dermatology web service powered by OpenAI Vision and YOLOv8.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mt-4">
                  Outside of engineering, I'm a life-long artist and musician, which naturally shapes how I build software —
                  I love creating things that feel intuitive, expressive, and thoughtfully designed.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Stats and Education */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Education Card */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gradient mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-gray-100">UC San Diego</div>
                  <div className="text-sm text-gray-400">B.S. Computer Science</div>
                  <div className="text-xs text-custom-cream">GPA: 3.90/4.00 • Expected Dec 2027</div>
                  <div className="text-xs text-gray-500 mt-1">Discrete Mathematics, Systems Programming and Software Tools</div>
                </div>
                <div className="border-t border-gray-800 pt-4">
                  <div className="font-semibold text-gray-100">Saddleback & IVC</div>
                  <div className="text-sm text-gray-400">A.S. Computer Science</div>
                  <div className="text-xs text-custom-sage">GPA: 3.81/4.00 • June 2025</div>
                  <div className="text-xs text-gray-500 mt-1">Advanced Java, Data Structures & Algorithms in C++, Discrete Mathematics, Linear Algebra</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-custom-olive/10 text-custom-olive border border-custom-olive/20">NSLS</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-custom-sage/10 text-custom-sage border border-custom-sage/20">Phi Theta Kappa</span>
                  </div>
                </div>
                <div className="border-t border-gray-800 pt-4">
                  <div className="font-semibold text-gray-100">Cornell University</div>
                  <div className="text-sm text-gray-400">Break Through Tech AI • August 2025</div>
                  <div className="text-xs text-custom-rose">Machine Learning Foundations Certificate</div>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Models Built', value: '12+', icon: '🤖', color: 'text-custom-olive' },
                { label: 'Data Nodes', value: '60K+', icon: '📊', color: 'text-custom-sage' },
                { label: 'Projects', value: '5+', icon: '✨', color: 'text-custom-cream' },
                { label: 'Hackathons Won', value: '1', icon: '🏆', color: 'text-custom-olive' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, borderColor: '#A3A380' }}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
