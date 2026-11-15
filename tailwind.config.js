import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                mubs: {
                    navy: '#002147',
                    blue: '#003B73',
                    deep: '#001633',
                    red: '#C4122F',
                    redDark: '#990F24',
                    gold: '#FDB813',
                    goldLight: '#FEF08A',
                    surface: '#F8FAFC',
                },
                cbet: {
                    gold: '#FDB813',
                    emerald: '#10B981',
                    purple: '#7C3AED',
                    rose: '#C4122F',
                    blue: '#003B73',
                }
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
                'card-hover': '0 10px 25px -5px rgba(15, 36, 113, 0.08), 0 8px 10px -6px rgba(15, 36, 113, 0.04)',
                'glow': '0 0 20px -3px rgba(36, 89, 245, 0.25)',
            }
        },
    },

    plugins: [forms],
};
