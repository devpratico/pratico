interface IntlConfig {
    locales: string[];
    defaultLocale: string;
    localePrefix: 'as-needed' | 'always' | 'never';
}


/**
 * This is used by i18n.ts and intlMiddleware.ts
 */
const config: IntlConfig = {
    locales: ['en', 'fr'],
    defaultLocale: 'fr',
    localePrefix: 'always' // Default
};

export default config;
