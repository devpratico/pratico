const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin(
    './intl/i18n.ts'
)


/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withNextIntl(nextConfig)
