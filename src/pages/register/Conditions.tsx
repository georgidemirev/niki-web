import { Card, HBox, VBox } from 'components/common';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface Props {
    i18n: any;
    t(key, opts?): any;
}
class TermsOfUse extends React.Component<Props> {
    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered gradient-container">
                <Card borderbox className="" style={{ width: '55%' }}>
                    <HBox style={{ width: '100%' }}>
                        <span className="title bold gradient">
                            {' '}
                            {t('therms.therms_of_use')}{' '}
                        </span>
                    </HBox>
                    <VBox style={{ width: '100%' }}>
                        <p>{t('therms.last_updated')}: 05.06.2020</p>
                        <h2 id="въведение">{t('therms.introduction')}</h2>
                        <p className="text privacy">
                            <a href="http://influ.ai">influ.ai</a>{' '}
                            {t('therms.intro_p1')}
                        </p>
                        <p className="text privacy">{t('therms.intro_p2')}</p>
                        <p className="text privacy">{t('therms.intro_p3')}</p>
                        <p className="text privacy">{t('therms.intro_p4')}</p>
                        <h2 id="общи-условия">{t('therms.general_therms')}</h2>
                        <p className="text privacy">
                            {t('therms.general_therms_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.general_therms_p2')}
                        </p>
                        <h2 id="пояснения-за-потребителя-за-ролята-на-influ.ai">
                            {t('therms.explanation_to_user')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.explanation_to_user_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.explanation_to_user_p2')}
                        </p>
                        <p className="text privacy">
                            {t('therms.explanation_to_user_p3')}
                        </p>
                        <p className="text privacy">
                            {t('therms.explanation_to_user_p4')}
                        </p>
                        <p className="text privacy">
                            {t('therms.explanation_to_user_p5')}
                        </p>
                        <h2 id="отговорност">{t('therms.responsibility')}</h2>
                        <p className="text privacy">
                            {t('therms.responsibility_p1')}
                        </p>
                        <h2 id="допустимост-на-инфлуенсър">
                            {t('therms.influencer_eligibility')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.influencer_eligibility_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.influencer_eligibility_p2')}
                        </p>
                        <h2 id="отговорност-на-инфлуенсър">
                            {t('therms.influencer_responsibility')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.influencer_responsibility_p1')}
                        </p>
                        <h2 id="въпроси-за-поверителност">
                            {t('therms.privacy_issues')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.privacy_issues_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.privacy_issues_p2')}
                        </p>
                        <h2 id="прекратяване-на-тези-условия">
                            {t('therms.termination_of_these_conditions')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.termination_of_these_conditions_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.termination_of_these_conditions_p2')}
                        </p>
                        <h2 id="модификации">{t('therms.modifications')}</h2>
                        <p className="text privacy">
                            {t('therms.modifications_p1')}
                        </p>
                        <h2 id="споделяне-на-вашето-съдържание-и-информация">
                            {t('therms.sharing_your_content_information')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.sharing_your_content_information_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.sharing_your_content_information_p2')}
                        </p>
                        <h2 id="допълнителни-отговорности">
                            {t('therms.additional_responsibility')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.additional_responsibility_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.additional_responsibility_p2')}
                        </p>
                        <h2 id="отказ-от-отговорност">
                            {t('therms.disclaimer')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.disclaimer_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.disclaimer_p2')}
                        </p>
                        <p className="text privacy">
                            {t('therms.disclaimer_p3')}
                        </p>
                        <p className="text privacy">
                            {t('therms.disclaimer_p4')}
                        </p>
                        <h2 id="ограничения-на-отговорността">
                            {t('therms.limitations_of_liability')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.limitations_of_liability_p1')}
                        </p>
                        <h2 id="злоупотреба-с-influ.ai">
                            {t('therms.abuse_influai')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.abuse_influai_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.abuse_influai_p2')}
                        </p>
                        <h2 id="интелектуална-собственост">
                            {t('therms.intellectual_property')}
                        </h2>
                        <p className="text privacy">
                            {t('therms.intellectual_property_p1')}
                        </p>
                        <p className="text privacy">
                            {t('therms.intellectual_property_p2')}
                        </p>
                        <p className="text privacy">
                            {t('therms.intellectual_property_p3')}
                        </p>
                        <p className="text privacy">
                            {t('therms.intellectual_property_p4')}
                        </p>
                        <p className="text privacy">
                            {t('therms.intellectual_property_p5')}
                        </p>
                        <h2 id="контакти">{t('therms.contacts')}</h2>
                        <p className="text privacy">
                            {t('therms.contacts_p1')}
                        </p>
                    </VBox>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(TermsOfUse);

export default withTranslation()(wrapped);
