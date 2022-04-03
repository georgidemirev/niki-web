import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

import { bg } from './languages/bg';
import { en } from './languages/en';
import { es } from './languages/es';
import { LanguageCode } from './constants';
import { getDefaultLanguage } from './utils';

i18n.use(initReactI18next).init({
    fallbackLng: LanguageCode.EN,
    lng: getDefaultLanguage(),
    resources: {
        en: {
            translations: en,
        },
        es: {
            translations: es,
        },
        bg: {
            translations: bg,
        },
    },
    ns: ['translations'],
    defaultNS: 'translations',
});

i18n.languages = ['en', 'es', 'bg'];

export default i18n;
