# Student Resource Hub - Modern Learning Platform

A modern, responsive learning platform built with Next.js, TypeScript, and Tailwind CSS. Features comprehensive web development tutorials with interactive code examples and smooth navigation.

## 🚀 Features

- **Modern Design**: Clean, professional UI with responsive design
- **Static Site Generation**: Fast loading with Next.js SSG
- **Interactive Code Examples**: Syntax highlighting with Prism.js
- **Mobile-First**: Fully responsive across all devices
- **SEO Optimized**: Perfect for educational content discovery
- **TypeScript**: Type-safe development experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Code Highlighting**: Prism.js

## 📂 Project Structure

```
d:\similar_gfg\
├── content/                # Educational Content (JSON)
│   ├── frontend/          # Web Development Tutorials
│   ├── backend/           # Backend Tutorials
│   └── ...
├── public/                 # Static Assets (images)
├── src/                    # Source Code
│   ├── components/        # React Components
│   ├── lib/               # Logic & Utilities (Content Loader)
│   ├── pages/             # Next.js Routes
│   ├── styles/            # Global Styles (Tailwind)
│   └── types/             # TypeScript Interfaces
```

## 📚 Content System

The platform uses a file-based content management system where tutorials are stored as JSON files in the `content/` directory.

**Example Structure:**
```json
{
  "slug": "tutorial-slug",
  "title": "Tutorial Title",
  "category": "frontend",
  "sections": [
    {
      "title": "Introduction",
      "content": "Markdown content...",
      "codeExample": "console.log('Hello');",
      "language": "javascript"
    }
  ]
}
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Export static site** (if static export is configured):
   ```bash
   npm run export
   ```

## 🎨 Design System

- **Primary Color**: #4A90E2 (Professional Blue)
- **Secondary**: #F8F8FF (Ghost White)
- **Typography**: Inter font family
- **Code**: JetBrains Mono

## 🚀 Deployment

Deploy easily to:
- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repo
- **GitHub Pages**: Use `npm run export`

## 📄 License

MIT License - feel free to use for educational purposes.

---
Built with ❤️ for the developer community
