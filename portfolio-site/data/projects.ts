// Your ML/AI Projects
// Customize as needed!

export interface Project {
  title: string
  description: string
  technologies: string[]
  image: string // Emoji or image URL
  link?: string
  github?: string
  category?: 'ml' | 'ai' | 'web' | 'research' | 'other'
  highlight?: boolean // Mark standout projects
}

export const projects: Project[] = [
  {
    title: 'CareFi: AI Dermatology Web Service',
    description: 'AI-driven skin analysis workflow using OpenAI Vision and YOLOv8. Built production-ready 3-image ingestion pipeline with validation, preprocessing, and Supabase Storage integration. Winner of Best Coast Hackathon.',
    technologies: ['OpenAI Vision', 'YOLOv8', 'Supabase', 'TypeScript', 'Next.js'],
    image: '🤖',
    link: 'https://www.youtube.com/watch?v=9bRPwL0-zkQ&t=2s', // Add your live demo link
    github: 'https://github.com/jonathanle17/CareFi', // Add your GitHub link
    category: 'ai',
    highlight: true,
  },
  {
    title: 'Book Review Sentiment Classifier',
    description: 'Binary text classification model on ~2,000 book reviews using TF-IDF vectorization (5,000 features, unigrams + bigrams). Designed and tuned Keras neural network with multiple dense and dropout layers, achieving AUC = 0.92.',
    technologies: ['Python', 'Keras', 'TensorFlow', 'Scikit-learn', 'NLP'],
    image: '📚',
    github: 'https://github.com/shazibid/Book-Review-Sentiment-Classifier',
    category: 'ml',
    highlight: true,
  },
  // Add more projects as you build them!
]
