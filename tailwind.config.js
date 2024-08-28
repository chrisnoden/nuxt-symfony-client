/** @type {import('tailwindcss').Config} */
module.exports = {
    plugins: [
        require('@tailwindcss/forms'),
    ],
    content: [
        './app/**/*.vue',
        './app/*.vue',
        './app/tailwind.precompile.vue'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: ({colors}) => ({
                'main-bg': colors.white,
                'main-bg-dark': colors.gray['900'],
                'main-fg': colors.gray['900'],         // text on a light background
                'main-fg-dark': colors.gray['50'],     // text on a dark background
                'body-bg': colors.white,
                'body-bg-dark': colors.gray['900'],
                'menu-bg': colors.white,
                'menu-fg': colors.gray['800'],
                'menu-bg-dark': colors.gray['950'],
                'menu-fg-dark': colors.gray['200'],
                'menu-popup-bg': colors.white,
                'menu-popup-bg-dark': colors.gray['200'],

                // most colors are derived from these using the values of 50-950 for "darkness"
                'core-light': colors.zinc,
                'core-dark': colors.neutral,
                'highlight': colors.blue,

                fontSize: {
                    'xxs': '0.6rem',
                },
            }),
            screens: {
                sm: '640px',
                // => @media (min-width: 640px) { ... }

                md: '768px',
                // => @media (min-width: 768px) { ... }

                lg: '1024px',
                // => @media (min-width: 1024px) { ... }

                xl: '1280px',
                // => @media (min-width: 1280px) { ... }

                '2xl': '1536px',
                // => @media (min-width: 1536px) { ... }
            },
            transitionProperty: {
                'height': 'height'
            }
        },
    },
    variants: {},
};
