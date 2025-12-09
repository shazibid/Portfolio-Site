# Customization Guide

Welcome! This guide will help you customize your portfolio to showcase your unique work and experience.

## 🎨 Design Theme

Your portfolio features a warm, cozy aesthetic inspired by music, art, and plants with:
- Warm color palette (oranges, ambers, warm browns)
- Cozy lighting effects
- Creative decorative elements

## 📝 Customizing Your Projects

Edit `data/projects.ts` to add your actual projects:

```typescript
export const projects: Project[] = [
  {
    title: 'My Awesome Project',
    description: 'A detailed description of what this project does and why it\'s cool.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    image: '🎨', // Use an emoji or replace with an image URL later
    link: 'https://your-live-demo.com', // Optional: remove if no live demo
    github: 'https://github.com/yourusername/project', // Optional: remove if private
    category: 'web', // Optional: 'web', 'art', 'music', 'design', or 'other'
  },
  // Add more projects...
]
```

### Project Fields:
- **title**: Project name
- **description**: Brief description of the project
- **technologies**: Array of technologies/tools used
- **image**: Emoji or image URL (you can add images later by replacing emojis)
- **link**: Optional URL to live demo
- **github**: Optional URL to GitHub repository
- **category**: Optional category for filtering

## 💼 Customizing Your Work Experience

Edit `data/workExperience.ts` to add your professional experience:

```typescript
export const workExperience: WorkExperience[] = [
  {
    title: 'Software Developer',
    company: 'Tech Company Inc.',
    location: 'City, State', // Optional
    period: 'Jan 2023 - Present',
    description: [
      'Developed and maintained web applications using React and Node.js',
      'Collaborated with cross-functional teams to deliver features on time',
      'Improved application performance by 40% through optimization',
    ],
    technologies: ['React', 'Node.js', 'TypeScript'], // Optional
  },
  // Add more work experience entries...
]
```

### Work Experience Fields:
- **title**: Your job title
- **company**: Company name
- **location**: Optional location
- **period**: Time period (e.g., "Jan 2023 - Present" or "Summer 2022")
- **description**: Array of bullet points describing your responsibilities and achievements
- **technologies**: Optional array of technologies used in this role

## 🎯 Other Customizations

### Personal Information

1. **Hero Section**: Edit `components/Hero.tsx` to change:
   - Your name (currently "Shazi")
   - Rotating roles text
   - Hero description

2. **About Section**: Edit `components/About.tsx` to:
   - Update your personal bio
   - Modify the stats (records, plants, projects, coffees)
   - Change icons/emojis

3. **Contact Information**: Edit `components/Contact.tsx` to:
   - Update social media links
   - Change email addresses
   - Modify contact form behavior

### Colors & Theme

Edit `tailwind.config.js` to customize:
- Warm color palette
- Animation speeds
- Custom colors

### Skills

Edit `components/Skills.tsx` to:
- Update skill categories
- Modify skill levels
- Add/remove skills

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to see your portfolio

4. Start customizing by editing:
   - `data/projects.ts` - Add your projects
   - `data/workExperience.ts` - Add your work experience
   - Individual component files for other customizations

## 📸 Adding Images

Currently, projects use emojis. To add actual images:

1. Create a `public/images` folder
2. Add your project images there
3. In `data/projects.ts`, change the `image` field from an emoji to a path:
   ```typescript
   image: '/images/my-project.png'
   ```
4. Update `components/Projects.tsx` to render `<img>` tags instead of emoji spans

Happy customizing! 🎨✨

