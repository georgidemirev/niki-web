import { Card, Hbox, LinkTo, Vbox } from 'components/common';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';

interface Props {
    i18n: any;
    t(key, opts?): any;
}
class Support extends React.Component<Props> {
    componentDidMount() {
        store.setSelectedTab(2);
    }

    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered gradient-container">
                <Card
                    borderbox
                    className="create-campaign__card"
                    style={{ minWidth: '40vw', width: '40vw' }}
                >
                    <Vbox fullwidth className="" valign="center">
                        <Hbox>
                            <span className="title bold gradient">
                                {t('support.any_questions')}
                            </span>
                        </Hbox>
                        <Hbox style={{ marginTop: '5%' }}>
                            <LinkTo
                                type="mailto"
                                href="support@influ.ai"
                                value="support@influ.ai"
                            />
                        </Hbox>
                        <Hbox style={{ marginTop: '5%' }}>
                            <LinkTo
                                type="tel"
                                href="+359886624880"
                                value="+359 886 624 880"
                            />
                        </Hbox>
                    </Vbox>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(Support);

export default withTranslation()(wrapped);
