import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite is the build tool / dev server for the React app.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // automatically opens the browser on `npm run dev`
  },
})
