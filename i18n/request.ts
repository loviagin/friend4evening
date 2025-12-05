import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

// Список поддерживаемых локалей
const locales = ['en', 'ru'];
const defaultLocale = 'en';

// Функция для парсинга Accept-Language заголовка
function getLocaleFromAcceptLanguage(acceptLanguage: string | null): string {
    if (!acceptLanguage) return defaultLocale;
    
    // Парсим заголовок Accept-Language
    // Формат: "en-US,en;q=0.9,ru;q=0.8"
    const languages = acceptLanguage
        .split(',')
        .map(lang => {
            const [locale, q = 'q=1'] = lang.trim().split(';');
            const quality = parseFloat(q.replace('q=', ''));
            return { locale: locale.split('-')[0].toLowerCase(), quality };
        })
        .sort((a, b) => b.quality - a.quality);
    
    // Находим первую поддерживаемую локаль
    for (const { locale } of languages) {
        if (locales.includes(locale)) {
            return locale;
        }
    }
    
    return defaultLocale;
}

export default getRequestConfig(async () => {
    const store = await cookies();
    const headersList = await headers();
    
    // Сначала проверяем cookie (если пользователь уже выбрал локаль)
    let locale = store.get('locale')?.value;
    
    // Если в cookie нет локали, определяем из заголовка Accept-Language
    if (!locale || !locales.includes(locale)) {
        const acceptLanguage = headersList.get('accept-language');
        locale = getLocaleFromAcceptLanguage(acceptLanguage);
    }
    
    // Загружаем основные сообщения
    const mainMessages = (await import(`../messages/${locale}.json`)).default;
    
    // Загружаем юридические страницы
    try {
        const legalRules = (await import(`../messages/legal/rules.${locale}.json`)).default;
        const legalAgreement = (await import(`../messages/legal/agreement.${locale}.json`)).default;
        const legalPrivacy = (await import(`../messages/legal/privacy.${locale}.json`)).default;
        
        // Объединяем сообщения
        return {
            locale,
            messages: {
                ...mainMessages,
                legal: {
                    rules: legalRules,
                    agreement: legalAgreement,
                    privacy: legalPrivacy
                }
            }
        };
    } catch (error) {
        // Если юридические файлы не найдены, возвращаем только основные сообщения
        return {
            locale,
            messages: mainMessages
        };
    }
});