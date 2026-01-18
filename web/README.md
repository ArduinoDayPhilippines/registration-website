This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

This project uses the Next.js App Router (v13+) structure:

```
web/
├── src/
│   ├── app/              # App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page (/)
│   │   └── globals.css   # Global styles
│   └── components/       # Reusable components
└── public/               # Static assets
```

## Creating Pages

Pages in Next.js App Router are created using file-based routing. Each `page.tsx` file inside the `src/app` directory becomes a route.

### Basic Page

Create a new page by adding a folder with a `page.tsx` file:

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our registration website.</p>
    </div>
  );
}
```

This creates a route at `/about`.

### Dynamic Routes

Create dynamic routes using square brackets `[param]`:

```tsx
// src/app/events/[id]/page.tsx
export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Event {params.id}</h1>
    </div>
  );
}
```

This matches routes like `/events/1`, `/events/2`, etc.

### Nested Routes

Create nested routes by nesting folders:

```
src/app/
├── events/
│   ├── page.tsx           # /events
│   ├── [id]/
│   │   └── page.tsx       # /events/:id
│   └── register/
│       └── page.tsx       # /events/register
```

### Route Groups

Use parentheses to organize routes without affecting the URL:

```
src/app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx       # /about
│   └── contact/
│       └── page.tsx       # /contact
└── (dashboard)/
    └── profile/
        └── page.tsx       # /profile
```

### Layouts

Create shared layouts using `layout.tsx`:

```tsx
// src/app/events/layout.tsx
export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <h2>Events Navigation</h2>
      </nav>
      {children}
    </div>
  );
}
```

### Loading States

Add loading UI with `loading.tsx`:

```tsx
// src/app/events/loading.tsx
export default function Loading() {
  return <div>Loading events...</div>;
}
```

### Error Handling

Handle errors with `error.tsx`:

```tsx
// src/app/events/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Creating Components

Components are reusable pieces of UI. Create them in the `src/components` directory.

### Server Components (Default)

By default, components are Server Components:

```tsx
// src/components/EventCard.tsx
export default function EventCard({ title, date }: { title: string; date: string }) {
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <p>{date}</p>
    </div>
  );
}
```

**Benefits:**
- Faster initial page load
- Direct access to backend resources
- Better SEO
- Automatic code splitting

### Client Components

Use `"use client"` directive for interactive components:

```tsx
// src/components/RegistrationForm.tsx
'use client';

import { useState } from 'react';

export default function RegistrationForm() {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button type="submit">Register</button>
    </form>
  );
}
```

**Use Client Components when you need:**
- Event listeners (`onClick`, `onChange`, etc.)
- State and lifecycle effects (`useState`, `useEffect`)
- Browser-only APIs
- Custom hooks

### Component Organization

Organize components by feature or type:

```
src/components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── forms/                 # Form components
│   ├── RegistrationForm.tsx
│   └── LoginForm.tsx
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── events/                # Feature-specific components
    ├── EventCard.tsx
    └── EventList.tsx
```

### Importing Components

```tsx
// In a page or another component
import EventCard from '@/components/events/EventCard';
import RegistrationForm from '@/components/forms/RegistrationForm';

export default function EventsPage() {
  return (
    <div>
      <EventCard title="Arduino Day 2026" date="March 27, 2026" />
      <RegistrationForm />
    </div>
  );
}
```

### TypeScript Props

Define component props with TypeScript interfaces:

```tsx
// src/components/events/EventCard.tsx
interface EventCardProps {
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
}

export default function EventCard({ 
  title, 
  date, 
  description, 
  imageUrl 
}: EventCardProps) {
  return (
    <div className="event-card">
      {imageUrl && <img src={imageUrl} alt={title} />}
      <h3>{title}</h3>
      <p>{date}</p>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### Styling Components

This project uses CSS modules and Tailwind CSS. You can style components in multiple ways:

#### Tailwind CSS (Recommended)

```tsx
export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {children}
    </button>
  );
}
```

#### CSS Modules

```tsx
// Button.tsx
import styles from './Button.module.css';

export default function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.button}>{children}</button>;
}
```

```css
/* Button.module.css */
.button {
  background-color: blue;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
```

## Best Practices

1. **Use Server Components by default** - Only add `"use client"` when necessary
2. **Keep components small and focused** - Each component should have a single responsibility
3. **Use TypeScript** - Define prop types for better type safety
4. **Organize by feature** - Group related components together
5. **Extract reusable logic** - Create custom hooks for shared logic
6. **Follow naming conventions** - Use PascalCase for components, camelCase for functions
7. **Add loading and error states** - Improve user experience with proper feedback

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.