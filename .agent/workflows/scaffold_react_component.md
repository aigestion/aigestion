---
description: Scaffolds a new React component with styles, tests, and storybook files.
---

# Scaffold React Component

## 1. Input Required
- **Component Name**: (e.g., `feature-card`)
- **Destination Path**: (e.g., `frontend/apps/dashboard/src/components`)

## 2. Generate Files
- [ ] Create directory `[Destination Path]/[Component Name]`
- [ ] Create `index.ts` (Export)
- [ ] Create `[Component Name].tsx` (Logic & UI)
- [ ] Create `[Component Name].module.css` (Styles)
- [ ] Create `[Component Name].test.tsx` (Unit Test)

## 3. Standard Template (Reference)
```tsx
import styles from './[Component Name].module.css';

interface [Component Name]Props {
  title: string;
}

export const [Component Name] = ({ title }: [Component Name]Props) => {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
    </div>
  );
};
```
