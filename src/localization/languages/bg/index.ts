import { LanguageTypes } from 'localization/lang_types';
import { connectTranslation } from './connect';
import { createCampaignTranslation } from './create_campaign';
import { dashboardTranslation } from './dashboard';
import { footerTranslation } from './footer';
import { influencerCardTranslation } from './influencer_card';
import { influencerProfileTranslation } from './influencer_profile';
import { loginTranslation } from './login';
import { marketplaceTranslation } from './marketplace';
import { registrationTranslation } from './registration';
import { createOrganizationTranslation } from './create_organization';
import { changePasswordTranslation } from './change_password';
import { briefInfluencersViewTranslation } from './brief_influencers.ts';
import { errorMessagesTranslation } from './error_messages';
import { monthsTranslation } from './months';
import { invitationStartTranslation } from './invitation_start';
import { creativesUploadEditTranslation } from './creatives_upload_edit';
import { thermsTranslation } from './therms';
import { supportTranslation } from './support';
import { headerTranslation } from './header';
import { updateAccTranslation } from './update_acc';
import { campaignDetailTranslation } from './campaign_detail';
import { briefDetailViewTranslation } from './brief_detail';
import { registrationSuccessTranslation } from './registration_success';
import { addInfluencersTranslation } from './add_influencers';
import { creativesTranslation } from './creatives';
import { categoriesTranslation } from './categories';

export const bg: LanguageTypes = {
    language: 'bg',
    registration: registrationTranslation,
    connect: connectTranslation,
    therms: thermsTranslation,
    login: loginTranslation,
    dashboard: dashboardTranslation,
    marketplace: marketplaceTranslation,
    create_campaign: createCampaignTranslation,
    influencer_profile: influencerProfileTranslation,
    support: supportTranslation,
    influencer_card: influencerCardTranslation,
    footer: footerTranslation,
    header: headerTranslation,
    update_acc: updateAccTranslation,
    create_organization: createOrganizationTranslation,
    change_password: changePasswordTranslation,
    brief_influencers: briefInfluencersViewTranslation,
    error_messages: errorMessagesTranslation,
    months: monthsTranslation,
    invitation_start: invitationStartTranslation,
    creatives_upload_edit: creativesUploadEditTranslation,
    campaign_detail: campaignDetailTranslation,
    brief_detail: briefDetailViewTranslation,
    registration_success: registrationSuccessTranslation,
    add_influencers: addInfluencersTranslation,
    creatives: creativesTranslation,
    categories: categoriesTranslation,
};
