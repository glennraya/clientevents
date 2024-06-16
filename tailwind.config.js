import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
const { nextui } = require('@nextui-org/react')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'Inter',
                    // {
                    //     fontFeatureSettings: '"cv11", "ss01"',
                    //     fontVariationSettings: '"opsz" 32'
                    // },
                    ...defaultTheme.fontFamily.sans
                ]
            }
        }
    },
    dark: 'media',
    plugins: [nextui()]
}
