import { LanguageCode, LANGUAGES } from './constants';

export function getDefaultLanguage(): LanguageCode {
    const savedLang = localStorage.getItem('lang') as LanguageCode;
    if (savedLang) {
        return savedLang;
    }
    const browserLanguage = getBrowserLanguage();

    if (browserLanguage) {
        return browserLanguage;
    }
    return LanguageCode.EN;
}

export function getLanguageByCode(code: LanguageCode) {
    const languages = LANGUAGES.filter((language) => language.code === code);

    if (languages.length === 1) {
        return languages[0];
    }
    throw new Error(`No language with language code ${code} found.`);
}

export function getBrowserLanguage(): LanguageCode | null {
    const browserLang = window.navigator.language.split('-')[0];

    if (Object.values(LanguageCode).includes(browserLang as LanguageCode)) {
        return browserLang as LanguageCode;
    }

    return null;
}
