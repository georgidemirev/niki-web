// import { Avatar } from '@material-ui/core'
import { Card, Hbox, Vbox, _Button as Button } from 'components/common';
import React, { CSSProperties } from 'react';
import { store } from 'state/Store';
import './InvitationStart.css';
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

class InvitationStart extends React.Component<Props> {
    componentDidMount() {
        if (store.isAuthenticated && store.userRole === 'influencer') {
            this.redirectTo(
                `/campaign/${this.props.match.params.campaign_id}/${store.user.user?._id}/${this.props.match.params.invitation_token}`
            );
        }
    }

    registerUser = () => {
        this.redirectTo(
            `/register/${this.props.match.params.invitation_token}/${this.props.match.params.campaign_id}`
        );
    };

    logInUser = () => {
        this.redirectTo(
            `/login/${this.props.match.params.invitation_token}/${this.props.match.params.campaign_id}`
        );
    };

    redirectTo = (path) => {
        this.props.history.push(path);
    };

    render() {
        const { t } = this.props;
        return (
            <Vbox className="App-Content_wrapper gradient-container gradient-row-35">
                {/* <Hbox fullwidth borderbox className='brand__container' valign='center' style={{ padding: '2vw' }}>
					<Avatar style={{ width: '100px', height: '100px' }} />
					<Vbox className='brand__info' style={{ marginLeft: '1vw' }}>
						<span className='title bold'>Company name</span>
						<span className='text bold'>Some other info</span>
					</Vbox>
				</Hbox> */}
                <div className="instructions__container">
                    <Card className="invite_instructions" borderbox>
                        <Vbox fullwidth valign="center" align="center">
                            <span className="title gradient bold">
                                {t('invitation_start.how_works')}
                            </span>
                            <span
                                className="text"
                                style={{
                                    color: '#8D06FF',
                                    marginTop: '1vh',
                                    textAlign: 'center',
                                    paddingLeft: '1vw',
                                    paddingRight: '1vw',
                                }}
                            >
                                {t('invitation_start.collaborating_top_brands')}
                            </span>
                        </Vbox>

                        <Vbox fullwidth borderbox style={{ marginTop: '2vh' }}>
                            <Hbox
                                borderbox
                                valign="center"
                                fullwidth
                                style={{
                                    paddingLeft: '1vw',
                                    paddingRight: '1vw',
                                    marginTop: '1vh',
                                    marginBottom: '1vh',
                                }}
                            >
                                <div className="circle" style={styles.circle}>
                                    1
                                </div>
                                <span
                                    className="text bright"
                                    style={{
                                        maxWidth: '90%',
                                        marginLeft: '1vw',
                                    }}
                                >
                                    {t(
                                        'invitation_start.create_account_connect_instagram'
                                    )}
                                </span>
                            </Hbox>

                            <Hbox
                                borderbox
                                valign="center"
                                fullwidth
                                style={{
                                    paddingLeft: '1vw',
                                    paddingRight: '1vw',
                                    marginTop: '1vh',
                                    marginBottom: '1vh',
                                }}
                            >
                                <div className="circle" style={styles.circle}>
                                    2
                                </div>
                                <span
                                    className="text bright"
                                    style={{
                                        maxWidth: '90%',
                                        marginLeft: '1vw',
                                    }}
                                >
                                    {t('invitation_start.accept_decline')}
                                </span>
                            </Hbox>

                            <Hbox
                                borderbox
                                valign="center"
                                fullwidth
                                style={{
                                    paddingLeft: '1vw',
                                    paddingRight: '1vw',
                                    marginTop: '1vh',
                                    marginBottom: '1vh',
                                }}
                            >
                                <div className="circle" style={styles.circle}>
                                    3
                                </div>
                                <span
                                    className="text bright"
                                    style={{
                                        maxWidth: '90%',
                                        marginLeft: '1vw',
                                    }}
                                >
                                    {t('invitation_start.manage_message')}
                                </span>
                            </Hbox>
                        </Vbox>
                    </Card>
                    <Card className="buttons__card" borderbox>
                        <span className="title gradient bold">
                            {' '}
                            {t('invitation_start.register')}
                        </span>
                        <Vbox
                            fullwidth
                            valign="center"
                            style={{ marginTop: '1vh' }}
                        >
                            <Button
                                text={t('invitation_start.register')}
                                containerStyle={{
                                    width: '70%',
                                    marginBottom: '2vh',
                                }}
                                style={{ width: '100%' }}
                                onClick={() => this.registerUser()}
                            />
                            <Button
                                text={t('invitation_start.log_in')}
                                type="outlined"
                                containerStyle={{ width: '70%' }}
                                style={{ width: '100%' }}
                                onClick={() => this.logInUser()}
                            />
                        </Vbox>
                    </Card>
                </div>
            </Vbox>
        );
    }
}

const wrapped = withRouter(InvitationStart);

export default withTranslation()(wrapped);

const styles = {
    circle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D100FF',
        height: '30px',
        width: '30px',
        borderRadius: '50%',
        textAlign: 'center',
        color: '#fff',
    } as CSSProperties,
};
