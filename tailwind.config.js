
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Синий для кнопки "Добавить"
        accent: '#f59e0b', // Желтый для кнопки "Отменить"
        danger: '#dc2626', // Красный для кнопки "Удалить"
        complete: '#16a34a', // Зеленый для кнопки "Выполнить"
        background: '#f3f4f6', // Мягкий серо-голубой фон
      },
    },
  },
  plugins: [],
}
