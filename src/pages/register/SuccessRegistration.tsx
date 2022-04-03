import { Card, HBox } from 'components/common';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class RegistrationSuccess extends React.Component<Props> {
    @action
    submitLoginBtn = () => {
        if (this.props.match.params.invitation_token) {
            this.props.history.replace(
                `/login/${this.props.match.params.invitation_token}/${this.props.match.params.campaign_id}`
            );
        } else {
            this.props.history.replace('/login');
        }
    };

    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered gradient-container-row-35">
                <Card
                    className="create-campaign__card"
                    style={{ minWidth: '40%', width: '40%', textAlign: 'left' }}
                >
                    <HBox style={{ width: '100%' }}>
                        <span className="title gradient bold">
                            {t('registration_success.successful')}
                        </span>
                    </HBox>
                    <p className="text" style={{ marginBottom: 0 }}>
                        {t('registration_success.congratulations')}
                    </p>
                    <p style={{ marginTop: 15, padding: 0 }}>
                        {t('registration_success.p1')}
                    </p>
                    <p style={{ marginTop: 15, padding: 0 }}>
                        {t('registration_success.p2')}
                    </p>
                    <p style={{ marginTop: 15, padding: 0 }}>
                        {t('registration_success.p3')}
                    </p>
                    <p className="text">{t('registration_success.all_free')}</p>
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '5%',
                            marginBottom: '5%',
                        }}
                    >
                        <span
                            style={{ cursor: 'pointer' }}
                            className="text bold"
                            onClick={() => this.submitLoginBtn()}
                        >
                            {t('registration_success.log_in')}
                        </span>
                    </div>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(RegistrationSuccess);

export default withTranslation()(wrapped);
