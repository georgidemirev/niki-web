import { Card, Hbox, Vbox, _Button as Button } from 'components/common';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';
// import FacebookLogin from 'react-facebook-login';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

class ConnectInstagramStartPage extends React.Component<Props> {
    submit = async () => {
        if (this.props.match.path === '/token/update') {
            if (store.user.user) {
                store.user.user.fbgraph_token = '';
            }
        }
        store.errorMessage = '';
        let url;
        if (this.props.match.params.invitation_token) {
            url = await store.user.connectToInstagram(
                this.props.match.params.invitation_token,
                this.props.match.params.campaign_id
            );
        } else {
            url = await store.user.connectToInstagram();
        }
        if (!store.errorMessage) {
            if (url) {
                // user has to authorize for facebook
                window.location = url;
            } else {
                store.isFetching = false;
                store.userIsLoggedIn = true;
                this.props.history.replace('/home/dashboard');
            }
        } else {
            store.isFetching = false;
        }
    };

    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered gradient-container">
                <Card borderbox className="" style={{ width: '55%' }}>
                    <Hbox>
                        <span className="title gradient">
                            {store.errorMessage}
                        </span>
                    </Hbox>
                    <Vbox fullwidth className="" valign="center">
                        <Hbox>
                            <span className="title bold gradient">
                                {t('connect.title')}
                            </span>

                            <p style={{ marginTop: 15, padding: 0 }}>
                                1. {t('connect.step_1')}
                            </p>
                            <p style={{ marginTop: 15, padding: 0 }}>
                                2. {t('connect.step_2')}
                            </p>
                            <p style={{ marginTop: 15, padding: 0 }}>
                                3. {t('connect.step_3')}
                            </p>
                            <p style={{ marginTop: 15, padding: 0 }}>
                                4. {t('connect.step_4')}
                            </p>
                            <p
                                style={{
                                    marginTop: 15,
                                    padding: 0,
                                    color: '#D100FF',
                                }}
                            >
                                * {t('connect.disclaimer')}
                            </p>
                        </Hbox>
                        <Hbox style={{ marginTop: '5%' }}>
                            <Button
                                text={t('connect.connect_to_instagram')}
                                onClick={() => this.submit()}
                            />
                            {/* <FacebookLogin
                onClick={() => this.submit()} /> */}
                        </Hbox>
                    </Vbox>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(ConnectInstagramStartPage);

export default withTranslation()(wrapped);
