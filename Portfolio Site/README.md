# Shazi Bidarian - Portfolio

An experimental, standout portfolio website showcasing ML/AI work with a warm, creative aesthetic. Built with Next.js, React, and TypeScript.

## ✨ Features

- 🎨 **Experimental Design** - Unique, standout layout inspired by creative portfolios
- 🤖 **ML/AI Focus** - Showcases machine learning projects and experience
- 🌅 **Warm Aesthetic** - Cozy color palette with warm lighting effects
- 🎵 **Creative Elements** - Music, art, records, and plants integrated throughout
- 📱 **Fully Responsive** - Beautiful on all devices
- ⚡ **Fast & Optimized** - Built with Next.js 14
- 🎭 **Smooth Animations** - Framer Motion for delightful interactions
- 📊 **Data-Driven** - Easy to customize projects and experience

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## 📝 Customization

### Your Projects

Edit `data/projects.ts` to add your ML/AI projects:

```typescript
{
  title: 'Your Project',
  description: 'Description...',
  technologies: ['Python', 'TensorFlow'],
  image: '🤖',
  link: 'https://...',
  github: 'https://...',
  category: 'ml',
  highlight: true, // For featured projects
}
```

### Your Experience

Edit `data/workExperience.ts` to add your work experience:

```typescript
{
  title: 'ML Engineer',
  company: 'Company',
  period: '2024 - Present',
  description: ['Achievement 1', 'Achievement 2'],
  technologies: ['Python', 'ML'],
}
```

### Personal Info

- **Hero**: `components/Hero.tsx` - Update name, roles, stats
- **About**: `components/About.tsx` - Update bio and education
- **Contact**: `components/Contact.tsx` - Update social links

## 🎨 Design Philosophy

This portfolio combines:
- **Technical Excellence** - Showcasing ML/AI expertise
- **Creative Expression** - Warm, artistic aesthetic
- **Personal Touch** - Music, records, plants, and cozy vibes
- **Standout Design** - Experimental layouts that make an impression

## 📂 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation
│   ├── Hero.tsx            # Hero section
│   ├── About.tsx          # About section
│   ├── Projects.tsx        # Projects showcase
│   ├── WorkExperience.tsx  # Experience timeline
│   ├── Skills.tsx         # Skills section
│   └── Contact.tsx        # Contact form
├── data/
│   ├── projects.ts        # Your projects (edit this!)
│   └── workExperience.ts   # Your experience (edit this!)
└── CUSTOMIZATION.md       # Detailed guide
```

## 🎯 Current Content

Based on your resume, the portfolio includes:

- **Projects**: CareFi (AI Dermatology), Book Review Sentiment Classifier
- **Experience**: Arity ML Fellow, Cornell Tech ML Fellow, Apple
- **Skills**: Python, ML libraries, Java, C++, TypeScript
- **Education**: UC San Diego, Saddleback/IVC, Cornell Tech

## 🚢 Deployment

Deploy easily with [Vercel](https://vercel.com):

```bash
npm run build
```

Then connect your GitHub repo to Vercel for automatic deployments.

## 📚 Learn More

- See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for detailed customization guide
- Edit `data/projects.ts` and `data/workExperience.ts` to add your content
- Customize colors in `tailwind.config.js`
- Modify components in `components/` directory

---

Built with ❤️ and lots of ☕
