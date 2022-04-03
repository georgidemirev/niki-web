import { Card, HBox } from 'components/common';
import { observer } from 'mobx-react';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface Props {
    i18n: any;
    t(key, opts?): any;
}

@observer
class FourOhFour extends React.Component<Props> {
    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered gradient-container-row-35">
                <Card
                    className="create-campaign__card"
                    style={{ minWidth: '40%', width: '40%', textAlign: 'left' }}
                >
                    <HBox style={{ width: '100%' }}>
                        <span className="title gradient bold"> 404! </span>
                    </HBox>
                    <p className="text" style={{ marginBottom: 0 }}>
                        {t('error_messages.four_oh_four')}
                    </p>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(FourOhFour);

export default withTranslation()(wrapped);
