import { DropDownSelectItem } from '../../../models/interfaces/DropDownSelectItem';
import i18n from '../../../localization/i18n';

export function getCountries(): DropDownSelectItem[] {
    return [
        { value: 'Bulgaria', text: i18n.t('update_acc.country.bulgaria') },
        { value: 'Spain', text: i18n.t('update_acc.country.spain') },
    ];
}
