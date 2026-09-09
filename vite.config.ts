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
      host: '0.0.0.0',
      proxy: {
        '/api-cas': {
          target: (env.VITE_API_CAS_PREFIX ).replace('http://', 'https://'),
          changeOrigin: true,
          secure: false, // 禁用SSL校验以防证书问题
          autoRewrite: true,
          rewrite: (path) => path.replace(/^\/api-cas/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (options.target && typeof options.target === 'string') {
                const targetUrl = new URL(options.target)
                proxyReq.setHeader('Origin', targetUrl.origin)
                proxyReq.setHeader('Referer', targetUrl.origin + '/')
                proxyReq.setHeader('Host', targetUrl.host)
              }
            })
          }
        },
        '/prod-api': {
          target: env.VITE_API_LOCAL_PREFIX ,
          changeOrigin: true,
          autoRewrite: true,
          rewrite: (path) => path.replace(/^\/prod-api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (options.target && typeof options.target === 'string') {
                const targetUrl = new URL(options.target)
                proxyReq.setHeader('Origin', targetUrl.origin)
                proxyReq.setHeader('Referer', targetUrl.origin + '/')
                proxyReq.setHeader('Host', targetUrl.host)
              }
            })
          }
        },
        '/api-dayu': {
          target: env.VITE_API_DAYU_PREFIX,
          changeOrigin: true,
          secure: false,
          autoRewrite: true,
          rewrite: (path) => path.replace(/^\/api-dayu/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (options.target && typeof options.target === 'string') {
                const targetUrl = new URL(options.target)
                proxyReq.setHeader('Origin', targetUrl.origin)
                proxyReq.setHeader('Referer', targetUrl.origin + '/')
                proxyReq.setHeader('Host', targetUrl.host)
              }
            })
          }
        }
      }
    }
  }
})
