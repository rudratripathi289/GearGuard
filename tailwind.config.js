/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        priority: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
          critical: '#dc2626',
        },
        status: {
          new: '#3b82f6',
          assigned: '#8b5cf6',
          'in-progress': '#f59e0b',
          'under-review': '#6366f1',
          completed: '#10b981',
        },
      },
    },
  },
  plugins: [],
}

