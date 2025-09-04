/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  plugins: [require('@tailwindcss/typography')]
}