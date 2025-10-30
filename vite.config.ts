import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "auto",
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: "WeMove",
                short_name: "WeMove",
                description: "WeMove description",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "android-launchericon-192-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "android-launchericon-512-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
