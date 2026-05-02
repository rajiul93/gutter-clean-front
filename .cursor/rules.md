# Frontend Rules (Next.js + Tailwind + shadcn)

## UI & Design
- Build modern, clean, and minimal UI
- Maintain proper whitespace and spacing (padding, margin, gap)
- Use consistent typography and color system
- Prefer responsive design (mobile-first)
- Body colour white and primary color is `oklch(44.3% 0.11 240.79)`

## Component Structure
- Divide UI into multiple small reusable sections
- Each section should be a separate component
- Avoid large monolithic components

## State Management
- Minimize props drilling
- Use zustand for state management
- Keep state as close as possible to where it is used

## Folder Structure

### 1. Shared / Common Components
- If a component is reusable across multiple pages:
  place it inside:
  /components/<module-name>/

Example:
components/
  navbar/
    navbar.tsx
  footer/
    footer.tsx
  ui/
    button.tsx

---

### 2. Page-Specific Components
- If a component is used only in a single page:
  create a folder beside that page

Example:
app/
  (home)/
    page.tsx
    hero-section/
      hero-section.tsx
    services-section/
      services-section.tsx

---

## Coding Style
- Use functional components only
- Use TypeScript strictly
- Use Tailwind CSS (no inline styles)
- Use `cn()` utility for class merging
- Keep components clean and readable

## Performance
- Use Server Components by default
- Use Client Components only when needed
- Lazy load heavy components if required

## Naming Convention
- Use kebab-case for folders
- Use PascalCase for components
- Keep naming meaningful and descriptive