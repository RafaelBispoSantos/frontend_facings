/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1', // Cor principal
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
          },
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e', // Verde para status de sucesso
            700: '#15803d',
          },
          danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444', // Vermelho para alertas e erros
            700: '#b91c1c',
          },
          warning: {
            500: '#eab308', // Amarelo para avisos
          },
          unilever: {
            blue: '#1a4a9e', // Azul corporativo Unilever
            lightBlue: '#00a0df',
            green: '#00a87e', // Verde corporativo Unilever
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        boxShadow: {
          card: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        borderRadius: {
          card: '0.5rem',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  };