import { ref } from 'vue'

// Shared viewport state — a single control (ViewportControl.vue) drives every
// <Preview> on the page at once, so readers can flip the whole set of examples
// to a mobile / tablet / desktop width and see the system adapt cohesively.
// null = Fit (each frame fills the docs column, no horizontal scroll).
export interface Viewport {
  label: string
  value: number | null
  icon: 'fit' | 'mobile' | 'tablet' | 'desktop'
}

export const VIEWPORTS: Viewport[] = [
  { label: 'Fit', value: null, icon: 'fit' },
  { label: 'Mobile', value: 380, icon: 'mobile' },
  { label: 'Tablet', value: 768, icon: 'tablet' },
  { label: 'Desktop', value: 1024, icon: 'desktop' }
]

export const viewportWidth = ref<number | null>(null)

// Whether the floating viewport toolbar is collapsed to its handle on the right.
// Kept in the store so the choice persists as the reader navigates between pages.
export const viewportCollapsed = ref(true)
