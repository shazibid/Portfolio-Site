'use client'

import { motion } from 'framer-motion'
import { Linkedin, Github } from 'lucide-react'
import { useState } from 'react'
import emailjs from '@emailjs/browser'

// Initialize EmailJS with your public key
emailjs.init('0XfITqJobzNQ5bnbM')

const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/shazibid', color: 'hover:text-custom-rose' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/shazi-bidarian/', color: 'hover:text-custom-cream' },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await emailjs.send(
        'service_miwvki6',
        'template_8qt99lc',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'bidarian.s23@gmail.com',
        }
      )
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-padding bg-dark-surface relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-5" style={{ backgroundColor: '#EFEBCE' }} />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-5" style={{ backgroundColor: '#A3A380' }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h2
          className="text-5xl sm:text-6xl md:text-7xl font-black text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get In <span className="text-gradient">Touch</span>
        </motion.h2>
        <div className="w-24 h-1 mx-auto mt-4 mb-12" style={{ background: 'linear-gradient(to right, #A3A380, #D6CE93, #EFEBCE)' }} />
        <motion.p
          className="text-center text-gray-400 mb-12 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Have a project in mind or want to collaborate? I'd love to hear from you!
        </motion.p>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-100">Let's Connect</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities
              to be part of your vision. Feel free to reach out through any of the channels below.
            </p>
            
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-3 bg-dark-card rounded-lg border border-gray-800 text-gray-300 transition-all backdrop-blur-sm ${social.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, borderColor: '#A3A380' }}
                >
                  <social.icon className="w-5 h-5" />
                  <span>{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-card border border-gray-800 rounded-lg focus:outline-none focus:border-custom-olive text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-card border border-gray-800 rounded-lg focus:outline-none focus:border-custom-rose text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-colors"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-dark-card border border-gray-800 rounded-lg focus:outline-none focus:border-custom-cream text-gray-100 placeholder-gray-500 resize-none backdrop-blur-sm transition-colors"
                placeholder="Your message..."
              />
            </div>
            
            {submitStatus === 'success' && (
              <motion.div
                className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Message sent successfully! I'll get back to you soon.
              </motion.div>
            )}
            
            {submitStatus === 'error' && (
              <motion.div
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Failed to send message. Please check your email address and try again.
              </motion.div>
            )}
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: 'linear-gradient(to right, #A3A380, #D6CE93)',
                boxShadow: '0 0 30px rgba(163, 163, 128, 0.3)',
              }}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
