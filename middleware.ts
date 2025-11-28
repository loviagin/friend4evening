import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    localePrefix: 'always',
});

export const config = {
    matcher: [
        '/((?!api|_next|.*\\..*).*)',
    ],
};