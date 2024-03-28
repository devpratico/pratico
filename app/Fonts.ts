import localFont from 'next/font/local'

export const luciole = localFont({
    src: [
        {
            path: '../public/fonts/Luciole-Regular.woff2',
            weight: 'normal',
            style: 'normal',
        },
        {
            path: '../public/fonts/Luciole-Bold.woff2',
            weight: 'bold',
            style: 'normal',
        },
        {
            path: '../public/fonts/Luciole-Italic.woff2',
            weight: 'normal',
            style: 'italic',
        },
        {
            path: '../public/fonts/Luciole-BoldItalic.woff2',
            weight: 'bold',
            style: 'italic',
        },
    ],
    variable: '--font-luciole',
    display: 'swap',
})