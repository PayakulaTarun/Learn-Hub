# Student Resource Hub Content Management System

## 🎯 Overview

This project uses a **JSON-based content management system** that automatically generates routes and pages from structured JSON files.

## 📁 Content Structure

```
/content/
├── frontend/      # Web development (JavaScript, React, etc.)
├── backend/       # Server-side (Python, Java, Node.js, etc.)
├── databases/     # SQL, NoSQL, etc.
├── devops/        # Docker, Kubernetes, CI/CD, etc.
└── mobile/        # iOS, Android, React Native, etc.
```

## 📝 Content Schema

Each tutorial **MUST** follow this structure:

```json
{
  "slug": "unique-identifier",
  "title": "Tutorial Title",
  "category": "frontend|backend|databases|devops|mobile",
  "description": "Brief description of the tutorial",
  "sections": [
    {
      "id": "unique-section-id",
      "title": "Section Title",
      "content": "Markdown-formatted content. Supports **bold**, *italic*, lists, etc.",
      "codeExample": "// Optional code example",
      "language": "javascript"
    }
  ]
}
```

## ➕ Adding a New Tutorial

### Step 1: Create JSON File

Choose the appropriate category folder and create a new `.json` file:

```bash
/content/frontend/typescript.json
/content/backend/golang.json
/content/databases/postgresql.json
```

### Step 2: Fill Out the Schema

```json
{
  "slug": "typescript",
  "title": "TypeScript Masterclass",
  "category": "frontend",
  "description": "Master TypeScript type system and advanced patterns",
  "sections": [
    {
      "id": "intro",
      "title": "Introduction to TypeScript",
      "content": "**TypeScript** is a typed superset of JavaScript.\n\nKey features:\n- Static typing\n- Enhanced IDE support\n- Compile-time error detection",
      "codeExample": "const message: string = 'Hello, TypeScript!';\nconsole.log(message);",
      "language": "typescript"
    },
    {
      "id": "types",
      "title": "Type System",
      "content": "TypeScript provides several built-in types...",
      "codeExample": "type User = {\n  name: string;\n  age: number;\n};",
      "language": "typescript"
    }
  ]
}
```

### Step 3: Build and Test

```bash
npm run build   # Generates static pages
npm run dev     # Start development server
```

### Step 4: Verify

Visit: `http://localhost:3000/subjects/typescript`

## ✅ Validation Rules

### Required Fields
- ✅ `slug` — unique, lowercase, hyphens only
- ✅ `title` — display name
- ✅ `category` — must match folder name
- ✅ `description` — 1-2 sentences
- ✅ `sections` — array with at least 1 section

### Section Requirements
- ✅ `id` — unique within tutorial
- ✅ `title` — section heading
- ✅ `content` — markdown text
- ⚠️ `codeExample` — optional
- ⚠️ `language` — optional (defaults to 'text')

## 🎨 Content Formatting

### Markdown Support

```markdown
**Bold text**
*Italic text*
`Inline code`

- Bullet point
- Another point

1. Numbered list
2. Second item

[Link text](https://example.com)
```

### Code Examples

```json
{
  "codeExample": "function greet(name) {\n  return `Hello, ${name}!`;\n}",
  "language": "javascript"
}
```

Supported languages:
- `javascript`, `typescript`, `jsx`, `tsx`
- `python`, `java`, `go`, `rust`
- `html`, `css`, `json`
- `bash`, `sql`

## 🔍 Content Discovery

The system automatically:
1. **Scans** `/content` directory
2. **Reads** all `.json` files
3. **Validates** schema
4. **Generates** routes at build time
5. **Creates** static pages

**No manual configuration required!**

## 📊 File Organization Best Practices

### ✅ GOOD

```
/content/
├── frontend/
│   ├── javascript.json
│   ├── react.json
│   ├── vue.json
│   └── angular.json
```

### ❌ BAD

```
/src/data/
├── javascript-tutorial.txt
├── react.md
└── vue_FINAL_v2_backup.json
```

## 🚨 Common Errors

### Error: Tutorial not showing up

**Cause**: File not in correct directory structure
**Fix**: Ensure file is in `/content/{category}/{slug}.json`

### Error: Build fails with JSON parse error

**Cause**: Invalid JSON syntax
**Fix**: Use a JSON validator or VS Code's built-in validation

### Error: Content shows as undefined

**Cause**: Missing required fields in schema
**Fix**: Ensure all required fields are present

## 🧪 Testing New Content

```bash
# 1. Validate JSON syntax
cat content/frontend/new-topic.json | jq .

# 2. Build project
npm run build

# 3. Check if route was generated
# Look for: ✓ /subjects/new-topic in build output

# 4. Start dev server
npm run dev

# 5. Visit in browser
open http://localhost:3000/subjects/new-topic
```

## 📚 Migration from TXT Files

If you have existing `.txt` files, convert them using this template:

**Before** (text file):
```
JAVASCRIPT MASTERCLASS
======================

SECTION 1: Introduction
-----------------------
JavaScript is...

```javascript
console.log('Hello');
```
```

**After** (JSON):
```json
{
  "slug": "javascript",
  "title": "JavaScript Masterclass",
  "category": "frontend",
  "description": "Learn JavaScript from fundamentals to advanced patterns",
  "sections": [
    {
      "id": "intro",
      "title": "Introduction",
      "content": "JavaScript is...",
      "codeExample": "console.log('Hello');",
      "language": "javascript"
    }
  ]
}
```

## 🛠️ API Reference

### Content Loader Functions

```typescript
// Get all tutorials
import { getAllTutorials } from '@/lib/contentLoader';
const tutorials = getAllTutorials();

// Get tutorial by slug
import { getTutorialBySlug } from '@/lib/contentLoader';
const tutorial = getTutorialBySlug('javascript');

// Get all slugs (for static generation)
import { getAllTutorialSlugs } from '@/lib/contentLoader';
const slugs = getAllTutorialSlugs();

// Get tutorials by category
import { getTutorialsByCategory } from '@/lib/contentLoader';
const frontendTutorials = getTutorialsByCategory('frontend');
```

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Add new tutorial | Create JSON in `/content/{category}/` |
| Build site | `npm run build` |
| Start dev server | `npm run dev` |
| Validate JSON | Use VS Code or `jq` command |
| View tutorial | `/subjects/{slug}` |

## 💡 Tips

1. **Use VS Code** — JSON schema validation built-in
2. **Test locally** — Always run `npm run dev` before committing
3. **Keep it simple** — Don't overcomplicate content structure
4. **Use markdown** — For formatting in `content` field
5. **Code examples** — Keep them short and focused (< 30 lines)

---

**Need help?** Check `PROJECT_STABILIZATION_REPORT.md` for full architecture details.
