# 📂 Project Structure

## Core Directories

```
d:\similar_gfg\
├── content\                # Educational Content (JSON)
│   └── backend\           # Python Tutorials (20+ topics)
├── public\                 # Static Assets (images)
├── src\                    # Source Code
│   ├── components\        # React Components
│   ├── lib\               # Logic & Utilities (Content Loader)
│   ├── pages\             # Next.js Routes
│   ├── styles\            # Global Styles (Tailwind)
│   └── types\             # TypeScript Interfaces
```

## Key Files

### Content Handling
- **`src/types/content.ts`**: Defines the strict schema for tutorials (Theory, Examples, Practice, etc.).
- **`src/lib/contentLoader.ts`**: Robust loader that safely parses JSON and handles errors.

### Routing (Pages)
- **`src/pages/index.tsx`**: Homepage (Landing page).
- **`src/pages/subjects/index.tsx`**: "All Subjects" list.
- **`src/pages/subjects/[subject].tsx`**: Dynamic Topic Page (The main learning interface).
- **`src/pages/404.tsx`**: Custom "Page Not Found".
- **`src/pages/_error.tsx`**: Global Error Handler.

### Components
- **`Header.tsx`**: Main navigation (Home, Subjects, About).
- **`Layout.tsx`**: Base layout wrapper.

## Content Format

All content is stored in `content/backend/` as JSON files.

**Example Structure (`python-introduction.json`):**
```json
{
  "title": "Introduction to Python",
  "slug": "python-introduction",
  "category": "backend",
  "theory": "Markdown content...",
  "examples": [
    { "code": "print('Hi')", "output": "Hi", "explanation": "..." }
  ],
  "common_mistakes": [...],
  "interview_questions": [...],
  "practice_problems": [...]
}
```

## Development

- **Run Dev Server:** `npm run dev`
- **Build Production:** `npm run build`
- **Start Production:** `npm start`
