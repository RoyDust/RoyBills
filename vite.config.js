import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createStyleImportPlugin } from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  // 按需引入zarm的css
  plugins: [
    react(),
    createStyleImportPlugin(
      {
        libs: [
          {
            libraryName: 'zarm',
            esModules: true,
            resolveStyle: (name) => {
              return `zarm/es/${name}/style/css`
            }
          }
        ]
      }
    )
  ],
  // less设置
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      }
    }
  },
  // 跨域设置
  server: {
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: 'http://api.chennick.wang/api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
      },
      '/public': {
        target: 'http://api.chennick.wang/', changeOrigin: true,
      }
    }
  },
  // 别名设置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'utils': path.resolve(__dirname, 'src/utils'), // src 路径
      'config': path.resolve(__dirname, 'src/config') // src 路径
    }
  }
})
