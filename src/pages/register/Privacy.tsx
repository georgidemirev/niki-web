import Cookies from 'js-cookie';
import React from 'react';
import './Privacy.css';
import { PrivacyBG } from './privacy/PrivacyBG';
import { PrivacyEN } from './privacy/PrivacyEN';
import { PrivacyES } from './privacy/PrivacyES';

export function PrivacyPage() {
    const language = Cookies.get('lang');

    const render = () => {
        if (language === 'en') return <PrivacyEN />;
        if (language === 'bg') return <PrivacyBG />;
        if (language === 'es') return <PrivacyES />;
    };

    return <>{render()}</>;
}
