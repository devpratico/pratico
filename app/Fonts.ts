import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

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

export const janifera = localFont({
	src: '../public/fonts/Janifera.ttf',
	display: 'swap'
})

export const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
})