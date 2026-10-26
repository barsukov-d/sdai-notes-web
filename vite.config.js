import { defineConfig } from "vite"

/**
 * Сайт ходит в API по относительному адресу /api — vite переадресует запросы
 * на сервер заметок. На стенде сервер работает в том же рабочем месте на
 * порту 3000; адрес можно поменять переменной API_URL.
 */
export default defineConfig({
  server: {
    host: process.env.HOST ?? "0.0.0.0",
    port: Number(process.env.PORT ?? 5173),
    strictPort: true,
    // Превью открывается по чужому домену — vite по умолчанию такие запросы отклоняет.
    allowedHosts: true,
    proxy: {
      "/api": process.env.API_URL ?? "http://localhost:3000",
    },
  },
})
