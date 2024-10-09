//import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./app/(frontend)/_intl/i18n.ts')



/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
	// optimization: {
	// 	// minimize: false,
	// 	minify: true
	// },
    webpack: (config, {dev, isServer}) => {
        config.resolve.alias.canvas = false;
		
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto",
        });
        // Add browser-sync plugin https://blog.ndoizo.ca/posts/nextjs-browsersync/
        if (dev && !isServer) {
            config.plugins.push(
                new BrowserSyncPlugin(
                    {
                        host: '0.0.0.0',
                        port: 4000,
                        open: false,
                        proxy: 'http://localhost:3000/',
                    },
                    {
                        reload: false,
                        injectChanges: false,
                    },
                ),
            )
        }
        
        return config;
    },

    experimental: {
        serverActions: {
            allowedOrigins: ['http://localhost:4000'],
        }
    },
}

module.exports = withNextIntl(nextConfig)
