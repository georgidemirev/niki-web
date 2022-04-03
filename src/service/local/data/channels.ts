import { SocialChannel } from 'models/interfaces/SocialChannel';

export function getChannels(): SocialChannel[] {
    return [
        {
            name: 'Instagram',
            source: 'instagram',
            link: 'https://instagram.com/',
        },
        { name: 'YouTube', source: 'youtube', link: 'https://youtube.com/' },
        { name: 'TikTok', source: 'tiktok', link: 'https://tiktok.com/' },
        { name: 'Facebook', source: 'facebook', link: 'https://facebook.com/' },
        { name: 'LinkedIn', source: 'linkedin', link: 'https://linkedin.com/' },
        { name: 'Blog', source: 'blog', link: '' },
    ];
}
