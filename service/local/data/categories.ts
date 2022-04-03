import { DropDownSelectItem } from '../../../models/interfaces/DropDownSelectItem';
import i18n from '../../../localization/i18n';

export function getInfluencerCategories(): DropDownSelectItem[] {
    return [
        {
            value: 'Fashion & Beauty',
            text: i18n.t('categories.fashion_and_beauty'),
        },
        {
            value: 'Health & Fitness',
            text: i18n.t('categories.health_and_fitness'),
        },
        { value: 'Food & Drinks', text: i18n.t('categories.food_and_drinks') },
        { value: 'Lifestyle', text: i18n.t('categories.lifestyle') },
        { value: 'Family', text: i18n.t('categories.family') },
        {
            value: 'Interior Design',
            text: i18n.t('categories.interior_design'),
        },
        { value: 'Entertainment', text: i18n.t('categories.entertainment') },
        { value: 'Inspiration', text: i18n.t('categories.inspiration') },
        { value: 'Travel', text: i18n.t('categories.travel') },
        { value: 'Technology', text: i18n.t('categories.technology') },
        { value: 'Animals', text: i18n.t('categories.animals') },
        { value: 'DIY & Craft', text: i18n.t('categories.diy_and_craft') },
        { value: 'Photography', text: i18n.t('categories.photography') },
        { value: 'Art', text: i18n.t('categories.art') },
        { value: 'Design', text: i18n.t('categories.design') },
        { value: 'Outdoors', text: i18n.t('categories.outdoors') },
        {
            value: 'Hobbies & Interests',
            text: i18n.t('categories.hobbies_and_interests'),
        },
        { value: 'Sports', text: i18n.t('categories.sports') },
        { value: 'Gaming', text: i18n.t('categories.gaming') },
        { value: 'Esports', text: i18n.t('categories.esports') },
        { value: 'Comedy', text: i18n.t('categories.comedy') },
        {
            value: 'Films, Music, Books',
            text: i18n.t('categories.films_music_books'),
        },
        {
            value: 'Business & Entrepreneurship',
            text: i18n.t('categories.business_and_entrepreneurship'),
        },
    ];
}
