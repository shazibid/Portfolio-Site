// Your Work Experience
// Based on your resume - customize as needed!

export interface WorkExperience {
  title: string
  company: string
  location?: string
  period: string
  description: string[]
  technologies?: string[]
  projectLink?: string
}

export const workExperience: WorkExperience[] = [
  {
    title: 'Machine Learning Project Fellow',
    company: 'Arity',
    location: 'Dallas, TX (Remote)',
    period: 'August 2025 - December 2025',
    description: [
      'Processed and engineered features for 60,000+ iOS/Android telematics events, reducing 50+ raw sensor fields into a clean set of 20+ modeling variables used for cluster analysis',
      'Developed and evaluated 12+ unsupervised ML models (K-Means, DBSCAN, HDBSCAN) across 50+ hyperparameter combinations, revealing <5% natural separability between turn behaviors due to heavy feature overlap',
      'Led a 4-fellow team, synthesizing 10+ analytic and geospatial visualizations and delivering data-driven insights and recommendations to Arity (Allstate) stakeholders.',
    ],
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'ML Models', 'Team Leadership'],
    projectLink: 'https://github.com/shazibid/ARITY-BTT-PROJECT-1',
  },
  {
    title: 'Machine Learning Fellow',
    company: 'Break Through Tech AI, Cornell Tech',
    location: 'NY (Remote)',
    period: 'May 2025 - Current',
    description: [
      'Participant in 12-month program including Machine Learning coursework with Cornell faculty and experiential learning projects',
      'Led collaborative labs and discussions with fellows and mentors, strengthening technical understanding',
      'Coordinated technical direction for a 4-fellow engineering team, aligning model development and dataset engineering',
    ],
    technologies: ['Machine Learning', 'Python', 'Team Leadership'],
  },
  {
    title: 'Product Zone Specialist',
    company: 'Apple',
    location: 'Mission Viejo, CA',
    period: 'August 2024 - June 2025',
    description: [
      'Delivered 95%+ monthly customer satisfaction scores by translating complex technical concepts into accessible language',
      'Consistently ranked in Top 3 for monthly business sales, generating $11,000+ revenue',
      'Recognized by management for efficiency and error-free execution, serving as trusted resource for complex cases',
    ],
    technologies: ['Technical Troubleshooting', 'Customer Relations'],
  },
  {
    title: 'Mobile Expert',
    company: 'T-Mobile',
    location: 'Rancho Santa Margarita, CA',
    period: 'July 2022 - October 2023',
    description: [
      'Provided expert advice and resolved technical issues, maintaining a high level of customer satisfaction',
      'Trained and mentored new employees, adapting approaches to different learning styles while guiding them in making sound, customer-focused decisions',
      'Managed inventory and store organization, optimizing product availability and presentation',
    ],
    technologies: ['Device Diagnostics & Troubleshooting', 'Customer Relations', 'Account & Service Resolution'],
  },
]
