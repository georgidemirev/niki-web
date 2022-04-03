import { Card, HBox } from 'components/common';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface Props {
    i18n: any;
    t(key, opts?): any;
}
class CreateOrganizationSuccess extends React.Component<Props> {
    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered gradient-container-row-35">
                <Card
                    className="create-organization__card"
                    style={{ minWidth: '40%', width: '40%', textAlign: 'left' }}
                >
                    <HBox style={{ width: '100%' }}>
                        <span className="title gradient bold">
                            {' '}
                            {t('create_organization.success')}{' '}
                        </span>
                    </HBox>
                    <p className="text" style={{ marginBottom: 0 }}>
                        {t('create_organization.success_message')}
                    </p>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(CreateOrganizationSuccess);

export default withTranslation()(wrapped);
