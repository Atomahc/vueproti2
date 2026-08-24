import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api-cas': {
          target: env.VITE_API_CAS_PREFIX || 'http://cas.nsenz.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-cas/, '')
        },
        '/api-loca': {
          target: env.VITE_API_LOCAL_PREFIX || 'http://192.168.2.11:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-loca/, '')
        }
      }
    }
  }
})
