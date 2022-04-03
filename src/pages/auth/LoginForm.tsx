import {
    Card,
    TextField,
    VBox,
    _Button as Button,
    _Checkbox as Checkbox,
    _ErrorMessage as ErrorMessage,
} from 'components/common';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class LoginForm extends React.Component<Props> {
    @observable email = '';

    @observable password = '';

    @observable alwaysSignedIn = false;

    @action
    resetObservables() {
        this.email = '';
        this.password = '';
    }

    @action
    setEmail(email) {
        this.email = email;
    }

    @action
    setPassword(password) {
        this.password = password;
    }

    onPressForgotPass = () => {
        this.props.history.replace('/forgot_password');
    };

    onPressRegister = () => {
        this.props.history.replace('/register');
    };

    @action
    submit = async () => {
        if (!!this.email && !!this.password) {
            store.errorMessage = '';
            store.authStore.isLoading = true;
            await store.authStore.logInUser(this.email, this.password);
            if (!store.errorMessage) {
                store.authStore.isLoading = false;
                store.userIsLoggedIn = true;
                if (store.userRole === 'influencer') {
                    if (!store.user.user?.fbgraph_token) {
                        if (this.props.match.params.invitation_token) {
                            this.props.history.replace(
                                `/influencer_connect/${this.props.match.params.invitation_token}/${this.props.match.params.campaign_id}`
                            );
                        } else {
                            this.props.history.replace('/influencer_connect');
                        }
                    } else if (this.props.match.params.invitation_token) {
                        this.props.history.replace(
                            `/campaign/${this.props.match.params.campaign_id}/${store.user.user?._id}/${this.props.match.params.invitation_token}`
                        );
                    } else {
                        this.props.history.replace('/home/dashboard');
                    }
                } else {
                    // this.props.history.replace(this.props.location.state.from.pathname)
                    this.props.history.replace('/home/dashboard');
                }
            } else {
                store.authStore.isLoading = false;
            }
        } else {
            store.errorMessage = 'You have to fill up both fields';
            store.isFetching = false;
        }
        this.resetObservables();
    };

    @action
    setAlwaysLoggedIn(value: boolean) {
        this.alwaysSignedIn = value;
    }

    onKeyUp = (event) => {
        if (event.key === 'Enter' && event.target.value !== '') this.submit();
    };

    render() {
        const { t } = this.props;
        return (
            <Card className="LoginForm" fullwidth>
                <span className="title bold">{t('login.title')}</span>
                <VBox style={{ marginTop: '3.7%' }} fullwidth borderbox>
                    <TextField
                        value={this.email}
                        label={t('login.email')}
                        placeholder={t('login.email_placeholder')}
                        style={{ marginTop: '1vh', marginBottom: '1vh' }}
                        onChange={(event) =>
                            (this.email = event.target.value.trim())
                        }
                        onKeyUp={this.onKeyUp}
                    />
                    <TextField
                        containerStyle={{ marginTop: '3.7%' }}
                        value={this.password}
                        label={t('login.password')}
                        placeholder={t('login.password_placeholder')}
                        type="password"
                        style={{ marginTop: '1vh', marginBottom: '1vh' }}
                        onChange={(event) =>
                            (this.password = event.target.value)
                        }
                        onKeyUp={this.onKeyUp}
                    />
                </VBox>
                <ErrorMessage errorMessage={store.errorMessage} />
                <div className="buttons__div">
                    <Checkbox
                        id="alwaysSigned-checkbox"
                        label={t('login.keep_me_signed_in')}
                        checked={this.alwaysSignedIn}
                        onChange={(event) =>
                            this.setAlwaysLoggedIn(event.target.checked)
                        }
                    />
                    <Button
                        style={{
                            boxShadow: '0px 18px 40px rgba(128, 128, 128, 0.2)',
                        }}
                        text={t('login.login')}
                        onClick={() => this.submit()}
                    />
                </div>
                <div className="redirect-links">
                    <span
                        style={{ cursor: 'pointer', marginRight: '1.5%' }}
                        className="text gradient"
                        onClick={() => this.onPressRegister()}
                    >
                        {t('login.no_account')}
                    </span>
                    <span
                        style={{ cursor: 'pointer' }}
                        className="text bright"
                        onClick={() => this.onPressForgotPass()}
                    >
                        {t('login.forgot_password')}
                    </span>
                </div>
            </Card>
        );
    }
}

const wrapped = withRouter(LoginForm);

export default withTranslation()(wrapped);
