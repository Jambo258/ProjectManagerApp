/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        colors: {
            // Layout
            // Project
            'grayscale': {
                100: 'rgba(255, 255, 255, 1)', // White bgs
                200: 'rgba(245, 245, 245, 1)', // Page bg
                300: 'rgba(205, 205, 205, 1)', // White div border
                400: 'rgba(145, 145, 145, 1)' // Input field border
            },

            // Menu
            'dark-blue': {
                100: 'rgba(72, 79, 96, 1)', // Menu item border
                200: 'rgba(52, 57, 68, 1)', // Menu item bg
                300: 'rgba(42, 45, 52, 1)' // Menu bg
            },

            // Buttons
            // 200 on hover
            'primary': {
                100: 'rgba(208, 224, 220, 1)',
                200: 'rgba(186, 219, 211, 1)'
            },

            'success': {
                100: 'rgba(117, 223, 67, 1)',
                200: 'rgba(92, 199, 42, 1)'
            },

            'caution': {
                100: 'rgba(249, 142, 51, 1)',
                200: 'rgba(227, 119, 27, 1)'
            },

            // Fonts
            'light-font': 'rgba(233, 244, 242, 1)',
            'dark-font': 'rgba(42, 45, 52, 1)',

            // Labels
            'red': {
                100: 'rgba(255, 175, 175, 1)',
                200: 'rgba(242, 59, 59, 1)',
                300: 'rgba(193, 48, 48, 1)'
            },
            'purple': {
                100: 'rgba(221, 178, 255, 1)',
                200: 'rgba(176, 76, 255, 1)',
                300: 'rgba(142, 60, 207, 1)'
            },
            'blue': {
                100: 'rgba(164, 238, 255, 1)',
                200: 'rgba(59, 209, 242, 1)',
                300: 'rgba(48, 167, 193, 1)'
            },
            'green': {
                100: 'rgba(191, 255, 169, 1)',
                200: 'rgba(91, 246, 37, 1)',
                300: 'rgba(69, 187, 28, 1)'
            },
            'yellow': {
                100: 'rgba(255, 241, 168, 1)',
                200: 'rgba(255, 220, 34, 1)',
                300: 'rgba(234, 179, 37, 1)'
            }
        },
        extend: {
            fontFamily: {
                'notoSerif': ['"Noto Serif"', 'serif'],
                'kumbhSans': ['"Kumbh Sans"', 'sans-serif']
            }
        },
    },
    plugins: [],
};
