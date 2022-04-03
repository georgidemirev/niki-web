import flagEN from '../assets/flags/flag-en.png';
import flagES from '../assets/flags/flag-es.png';
import flagBG from '../assets/flags/flag-bg.png';

export enum LanguageCode {
    ES = 'es',
    EN = 'en',
    BG = 'bg',
}

export interface Language {
    name: string;
    code: LanguageCode;
    icon: string;
}

export const LANGUAGES: Language[] = [
    {
        name: 'Español',
        code: LanguageCode.ES,
        icon: flagES,
    },
    {
        name: 'English',
        code: LanguageCode.EN,
        icon: flagEN,
    },
    {
        name: 'Български',
        code: LanguageCode.BG,
        icon: flagBG,
    },
];
