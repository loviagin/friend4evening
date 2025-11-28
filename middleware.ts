import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    localePrefix: 'always',  // будет /ru/..., /en/...
});

export const config = {
    matcher: [
        '/((?!api|_next|.*\\..*).*)',
    ],
};