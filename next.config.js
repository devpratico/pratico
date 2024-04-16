const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./app/_intl/i18n.ts')


/** @type {import('next').NextConfig} */
const nextConfig = {

    reactStrictMode: true,
    
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
}

module.exports = withNextIntl(nextConfig)
