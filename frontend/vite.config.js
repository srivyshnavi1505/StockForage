import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Force Vite server restart to clear dependency cache
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
